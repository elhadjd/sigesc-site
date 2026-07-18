<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\AiContent\ResearchResult;
use App\Models\AiContent\ResearchSource;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use App\Services\AiContentEngine\Support\ResearchGateway;
use Illuminate\Support\Str;

class ResearchAgent implements AgentInterface
{
    public function __construct(
        protected ResearchGateway $research,
        protected LlmGateway $llm,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AIResearchAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $article->update(['status' => Article::STATUS_RESEARCHING]);

        $queries = [
            $article->title,
            ($article->focus_keyword ?: $article->title).' Angola',
            ($article->focus_keyword ?: $article->title).' AGT legislação',
        ];

        $allResults = [];
        $provider = 'mixed';

        foreach ($queries as $query) {
            $search = $this->research->search($query, (int) config('ai_content_engine.tavily.max_results', 8));
            $provider = $search['provider'];
            foreach ($search['results'] as $result) {
                if (! empty($result['url'])) {
                    $allResults[$result['url']] = $result;
                } elseif (! empty($result['snippet'])) {
                    $allResults[md5($result['snippet'])] = $result;
                }
            }
        }

        $results = array_values($allResults);

        $structured = $this->llm->chatJson([
            [
                'role' => 'system',
                'content' => <<<'PROMPT'
És o AIResearchAgent do SIGESC. Extrais factos verificáveis de fontes sobre Angola.
NUNCA copies texto. NUNCA inventes leis, datas ou números.
Se algo não estiver nas fontes, omite ou marca "não confirmado".
JSON:
{
  "summary":"",
  "facts":[{"claim":"","evidence":"","confidence":0.0}],
  "dates":[],
  "numbers":[],
  "changes":[],
  "references":[{"title":"","url":""}],
  "uncertainties":[]
}
PROMPT
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'topic' => $article->title,
                    'results' => array_slice($results, 0, 12),
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], null, 0.2);

        $research = ResearchResult::create([
            'article_id' => $article->id,
            'query' => $article->title,
            'provider' => $provider,
            'results' => $results,
            'structured_summary' => $structured['summary'] ?? null,
            'facts' => $structured['facts'] ?? [],
            'references' => $structured['references'] ?? [],
        ]);

        $article->sources()->delete();

        foreach (array_slice($results, 0, 12) as $result) {
            if (empty($result['url'])) {
                continue;
            }

            $domain = Str::lower(preg_replace('/^www\./', '', parse_url($result['url'], PHP_URL_HOST) ?: '') ?? '');
            $source = null;
            if ($domain) {
                $source = ResearchSource::firstOrCreate(
                    ['domain' => $domain],
                    [
                        'name' => $domain,
                        'url' => $result['url'],
                        'type' => $this->research->isTrustedUrl($result['url']) ? 'official' : 'web',
                        'is_trusted' => $this->research->isTrustedUrl($result['url']),
                    ]
                );
            }

            $article->sources()->create([
                'research_source_id' => $source?->id,
                'title' => $result['title'] ?? null,
                'url' => $result['url'],
                'snippet' => Str::limit($result['snippet'] ?? '', 500, ''),
                'is_trusted' => $this->research->isTrustedUrl($result['url']),
            ]);
        }

        $meta = $article->pipeline_meta ?? [];
        $meta['research'] = $structured;
        $article->update(['pipeline_meta' => $meta]);
        $article->markRevision('research', null, ['research_result_id' => $research->id]);

        $this->logger->info('Research completed', $job, $article, $this->name(), [
            'sources' => $article->sources()->count(),
            'provider' => $provider,
        ]);

        return [
            'research' => $structured,
            'research_result_id' => $research->id,
        ];
    }
}
