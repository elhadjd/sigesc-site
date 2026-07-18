<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use App\Services\AiContentEngine\Support\ResearchGateway;
use Illuminate\Support\Str;

class TrendAgent implements AgentInterface
{
    public function __construct(
        protected ResearchGateway $research,
        protected LlmGateway $llm,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AITrendAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        // TrendAgent discovers NEW topics; article may be a placeholder.
        $seedQueries = $context['queries'] ?? config('ai_content_engine.seed_queries', []);
        $bundle = [];

        foreach (array_slice($seedQueries, 0, 5) as $query) {
            $search = $this->research->search($query, 5);
            $bundle[] = [
                'query' => $query,
                'provider' => $search['provider'],
                'results' => $search['results'],
            ];
        }

        $categories = implode(', ', config('ai_content_engine.categories', []));

        $ideas = $this->llm->chatJson([
            [
                'role' => 'system',
                'content' => <<<PROMPT
És o AITrendAgent do SIGESC (Angola). Descobres QUALQUER tema útil a empresários angolanos:
fiscalidade (AGT/IVA/IRT/II), faturação, licenças, RH, salários, stock, PDV, farmácias, restaurantes,
salões, lojas, câmbio, crédito, aduaneira, marketing, contratos, INAPEM, BNA, e gestão do dia-a-dia.
Varie os assuntos — não fiques só num tema. Nunca inventes leis/datas/números. Usa só a pesquisa.
Devolve JSON: {"topics":[{"title":"","summary":"","category":"","priority":1,"keywords":[],"reason":""}]}
priority: 1=alta, 5=baixa. category deve ser uma de: {$categories}
Máximo 5 topics, focados no mercado angolano.
PROMPT
            ],
            [
                'role' => 'user',
                'content' => 'Pesquisa recente: '.json_encode($bundle, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], null, 0.4);

        $topics = collect($ideas['topics'] ?? [])
            ->filter(fn ($t) => filled($t['title'] ?? null))
            ->take((int) ($context['limit'] ?? config('ai_content_engine.pipeline.topics_per_day', 2)))
            ->values()
            ->all();

        $created = [];

        foreach ($topics as $topic) {
            // Skip near-duplicate titles from last 14 days.
            if (Article::where('title', $topic['title'])
                ->where('created_at', '>=', now()->subDays(14))
                ->exists()
            ) {
                continue;
            }

            $category = Category::firstOrCreate(
                ['slug' => Str::slug($topic['category'] ?? 'gestao')],
                ['name' => $topic['category'] ?? 'Gestão', 'is_active' => true]
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
                'priority' => $new->priority,
            ]);
        }

        return [
            'topics' => $created,
            'count' => count($created),
        ];
    }
}
