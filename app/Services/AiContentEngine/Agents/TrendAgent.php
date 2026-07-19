<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\AngolaSearchInterest;
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
        protected AngolaSearchInterest $interest,
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

        $bucketKey = (string) ($picked['key'] ?? 'gestao');
        $bucketLabel = (string) ($picked['label'] ?? $bucketKey);
        $allowedCategories = $picked['categories'] ?? [];

        $interest = ['trends' => [], 'suggestions' => [], 'queries' => [], 'source' => 'disabled'];
        try {
            $interest = $this->interest->forBucket($bucketKey, 6);
        } catch (\Throwable) {
            // Fail-soft: editorial rotation must continue without live interest data.
        }

        $seedQueries = $context['queries'] ?? $picked['queries'];
        if (! is_array($seedQueries) || $seedQueries === []) {
            $seedQueries = $picked['queries'] ?? [];
        }

        // Mix curated seeds with live Angola search suggestions (same bucket).
        $seedQueries = collect($seedQueries)
            ->merge(array_slice($interest['queries'] ?? [], 0, 2))
            ->map(fn ($q) => trim((string) $q))
            ->filter()
            ->unique()
            ->take(max(2, CreditSaver::trendSeedLimit() + 1))
            ->values()
            ->all();

        $bundle = [];
        foreach ($seedQueries as $query) {
            $search = $this->research->search((string) $query, CreditSaver::enabled() ? 4 : 5);
            $bundle[] = [
                'query' => $query,
                'provider' => $search['provider'],
                'results' => $search['results'],
            ];
        }

        $categoryList = implode(', ', $allowedCategories !== [] ? $allowedCategories : config('ai_content_engine.categories', []));
        $allCategories = implode(', ', config('ai_content_engine.categories', []));
        $interestJson = json_encode([
            'suggestions' => array_slice($interest['suggestions'] ?? [], 0, 8),
            'filtered_trends' => array_slice($interest['trends'] ?? [], 0, 5),
            'source' => $interest['source'] ?? null,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $ideas = $this->llm->chatJson([
            [
                'role' => 'system',
                'content' => <<<PROMPT
És o AITrendAgent do SIGESC (Angola).

ROTAÇÃO EDITORIAL (mistura obrigatória):
Hoje o bucket é "{$bucketKey}" — {$bucketLabel}.
Mantemos TODOS os temas no mix ao longo dos dias (fiscal/AGT, gestão, marketing/vendas online, empreendedorismo).
Mas NESTA execução TODOS os topics DEVEM ser deste bucket.
Se o bucket for fiscal → AGT, IVA, IRT, faturação eletrónica, NIF, certidões.
Se for marketing → anúncios, loja online, WhatsApp, e-commerce (sim, continua importante).
Se for gestão → ERP/CRM/PDV, stock, fluxo de caixa.
Se for empreendedorismo → abrir empresa, licenças, setores.

Categorias permitidas: {$categoryList}
(lista geral: {$allCategories})

Usa a pesquisa web + sugestões de pesquisa Angola quando forem relevantes ao bucket.
Nunca inventes leis/datas/números. Temas práticos para PME. CTA SIGESC só se natural.

JSON: {"topics":[{"title":"","summary":"","category":"","priority":1,"keywords":[],"reason":""}]}
priority: 1=alta, 5=baixa. Máximo 5 topics.
PROMPT
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'bucket' => $bucketKey,
                    'bucket_label' => $bucketLabel,
                    'allowed_categories' => $allowedCategories,
                    'angola_search_interest' => json_decode($interestJson, true),
                    'research' => $bundle,
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], null, 0.35);

        $topics = collect($ideas['topics'] ?? [])
            ->filter(fn ($t) => filled($t['title'] ?? null))
            ->filter(function (array $topic) use ($bucketKey) {
                $mapped = $this->buckets->bucketForCategory($topic['category'] ?? null)
                    ?? $this->buckets->bucketForTitle($topic['title'] ?? null);

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
                    'angola_search_interest' => [
                        'suggestions' => array_slice($interest['suggestions'] ?? [], 0, 8),
                        'trends' => array_slice($interest['trends'] ?? [], 0, 5),
                        'source' => $interest['source'] ?? null,
                    ],
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
            $this->buckets->remember($bucketKey);
            $this->logger->info('Topic discovered', $job, $new, $this->name(), [
                'title' => $new->title,
                'bucket' => $bucketKey,
                'priority' => $new->priority,
            ]);
        }

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
                $this->buckets->remember($bucketKey);
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
