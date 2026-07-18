<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\CreditSaver;
use App\Services\AiContentEngine\Support\LlmGateway;
use App\Services\AiContentEngine\Support\ResearchGateway;
use App\Services\AiContentEngine\Support\TopicBucketRotator;
use Illuminate\Support\Str;

class TrendAgent implements AgentInterface
{
    public function __construct(
        protected ResearchGateway $research,
        protected LlmGateway $llm,
        protected AiLogger $logger,
        protected TopicBucketRotator $buckets,
    ) {}

    public function name(): string
    {
        return 'AITrendAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $limit = (int) ($context['limit'] ?? config('ai_content_engine.pipeline.topics_per_day', 1));
        $picked = $context['bucket'] ?? null;

        if (! is_array($picked)) {
            $picked = $this->buckets->pick(now(), CreditSaver::trendSeedLimit());
        }

        $seedQueries = $context['queries'] ?? $picked['queries'];
        if (! is_array($seedQueries) || $seedQueries === []) {
            $seedQueries = $picked['queries'] ?? [];
        }

        $bundle = [];
        foreach ($seedQueries as $query) {
            $search = $this->research->search((string) $query, CreditSaver::enabled() ? 4 : 5);
            $bundle[] = [
                'query' => $query,
                'provider' => $search['provider'],
                'results' => $search['results'],
            ];
        }

        $bucketKey = (string) ($picked['key'] ?? 'gestao');
        $bucketLabel = (string) ($picked['label'] ?? $bucketKey);
        $allowedCategories = $picked['categories'] ?? [];
        $categoryList = implode(', ', $allowedCategories !== [] ? $allowedCategories : config('ai_content_engine.categories', []));
        $allCategories = implode(', ', config('ai_content_engine.categories', []));

        $ideas = $this->llm->chatJson([
            [
                'role' => 'system',
                'content' => <<<PROMPT
És o AITrendAgent do SIGESC (Angola).

BUCKET OBRIGATÓRIO DE HOJE: "{$bucketKey}" — {$bucketLabel}
TODOS os topics DEVEM ser sobre este bucket. Não inventes temas de outros buckets
(ex.: se o bucket for fiscal, NÃO escrevas sobre loja online / Facebook Ads / WhatsApp Business).

Categorias permitidas para este bucket: {$categoryList}
(lista geral só para referência: {$allCategories})

Regras:
- Temas práticos e acionáveis para PME em Angola.
- Nunca inventes leis/datas/números — usa só a pesquisa anexada.
- Quando fizer sentido, o ângulo pode ligar a gestão comercial / faturação (SIGESC) sem spam.
- Se o bucket for fiscal, prioriza AGT, IVA, IRT, Imposto Industrial, faturação eletrónica, NIF, certidões.
- Se a pesquisa for fraca, ainda assim propõe um guia prático do bucket com ângulo conservador.

JSON: {"topics":[{"title":"","summary":"","category":"","priority":1,"keywords":[],"reason":""}]}
priority: 1=alta, 5=baixa. Máximo 5 topics. category DEVE ser uma das categorias do bucket.
PROMPT
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'bucket' => $bucketKey,
                    'bucket_label' => $bucketLabel,
                    'allowed_categories' => $allowedCategories,
                    'research' => $bundle,
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], null, 0.35);

        $topics = collect($ideas['topics'] ?? [])
            ->filter(fn ($t) => filled($t['title'] ?? null))
            ->filter(function (array $topic) use ($bucketKey) {
                $mapped = $this->buckets->bucketForCategory($topic['category'] ?? null);
                // Drop off-bucket ideas (e.g. "loja online" while today is fiscal).
                return $mapped === null || $mapped === $bucketKey;
            })
            ->map(function (array $topic) use ($allowedCategories) {
                if (($topic['category'] ?? '') === '' && $allowedCategories !== []) {
                    $topic['category'] = $allowedCategories[0];
                }

                return $topic;
            })
            ->sortBy(fn ($t) => (int) ($t['priority'] ?? 3))
            ->values();

        $created = [];

        foreach ($topics as $topic) {
            if (count($created) >= max(1, $limit)) {
                break;
            }

            if ($this->isDuplicateTitle((string) $topic['title'])) {
                continue;
            }

            $category = Category::firstOrCreate(
                ['slug' => Str::slug($topic['category'] ?? ($allowedCategories[0] ?? 'gestao'))],
                ['name' => $topic['category'] ?? ($allowedCategories[0] ?? 'Gestão'), 'is_active' => true]
            );

            $new = Article::create([
                'title' => $topic['title'],
                'slug' => Article::uniqueSlug($topic['title']),
                'status' => Article::STATUS_DISCOVERED,
                'priority' => (int) ($topic['priority'] ?? 3),
                'excerpt' => $topic['summary'] ?? null,
                'category_id' => $category->id,
                'focus_keyword' => $topic['keywords'][0] ?? null,
                'author_name' => config('ai_content_engine.author.name'),
                'author_role' => config('ai_content_engine.author.role'),
                'author_avatar' => config('ai_content_engine.author.avatar'),
                'pipeline_meta' => [
                    'trend' => $topic,
                    'topic_bucket' => $bucketKey,
                    'topic_bucket_label' => $bucketLabel,
                    'topic_bucket_reason' => $picked['reason'] ?? null,
                    'discovery_bundle' => $bundle,
                ],
            ]);

            foreach ($topic['keywords'] ?? [] as $i => $keyword) {
                $new->keywords()->create([
                    'keyword' => $keyword,
                    'type' => $i === 0 ? 'focus' : 'secondary',
                    'score' => max(0, 100 - ($i * 10)),
                ]);
            }

            $created[] = $new;
            $this->logger->info('Topic discovered', $job, $new, $this->name(), [
                'title' => $new->title,
                'bucket' => $bucketKey,
                'priority' => $new->priority,
            ]);
        }

        // If LLM returned only duplicates / empty, create a safe seed title from the bucket.
        if ($created === [] && $seedQueries !== []) {
            $fallbackTitle = $this->fallbackTitle($bucketKey, $bucketLabel, (string) $seedQueries[0]);
            if (! $this->isDuplicateTitle($fallbackTitle)) {
                $categoryName = $allowedCategories[0] ?? 'Gestão';
                $category = Category::firstOrCreate(
                    ['slug' => Str::slug($categoryName)],
                    ['name' => $categoryName, 'is_active' => true]
                );
                $new = Article::create([
                    'title' => $fallbackTitle,
                    'slug' => Article::uniqueSlug($fallbackTitle),
                    'status' => Article::STATUS_DISCOVERED,
                    'priority' => 2,
                    'excerpt' => 'Guia prático para PME em Angola — '.$bucketLabel,
                    'category_id' => $category->id,
                    'focus_keyword' => Str::of($seedQueries[0])->explode(' ')->take(3)->implode(' '),
                    'author_name' => config('ai_content_engine.author.name'),
                    'author_role' => config('ai_content_engine.author.role'),
                    'author_avatar' => config('ai_content_engine.author.avatar'),
                    'pipeline_meta' => [
                        'topic_bucket' => $bucketKey,
                        'topic_bucket_label' => $bucketLabel,
                        'topic_bucket_reason' => 'fallback_seed_title',
                        'discovery_bundle' => $bundle,
                    ],
                ]);
                $created[] = $new;
            }
        }

        return [
            'topics' => $created,
            'count' => count($created),
            'bucket' => $bucketKey,
        ];
    }

    protected function isDuplicateTitle(string $title): bool
    {
        $title = trim($title);
        if ($title === '') {
            return true;
        }

        if (Article::where('title', $title)
            ->where('created_at', '>=', now()->subDays(21))
            ->exists()
        ) {
            return true;
        }

        $normalized = Str::lower(preg_replace('/\s+/', ' ', $title) ?? $title);
        $recent = Article::query()
            ->where('created_at', '>=', now()->subDays(21))
            ->latest('id')
            ->limit(80)
            ->pluck('title');

        foreach ($recent as $existing) {
            similar_text($normalized, Str::lower((string) $existing), $percent);
            if ($percent >= 82) {
                return true;
            }
        }

        return false;
    }

    protected function fallbackTitle(string $bucketKey, string $bucketLabel, string $seedQuery): string
    {
        $seed = Str::of($seedQuery)->replace(' Angola', '')->limit(70, '')->trim();

        return match ($bucketKey) {
            'fiscal' => 'Guia prático AGT: '.$seed,
            'marketing' => 'Marketing digital em Angola: '.$seed,
            'empreendedorismo' => 'Empreendedorismo em Angola: '.$seed,
            default => $bucketLabel.': '.$seed,
        };
    }
}
