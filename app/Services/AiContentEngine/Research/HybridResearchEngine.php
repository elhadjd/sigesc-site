<?php

namespace App\Services\AiContentEngine\Research;

use App\Models\AiContent\Article;
use App\Models\AiContent\ResearchFinding;
use App\Models\AiContent\ResearchLog;
use App\Models\AiContent\ResearchResult;
use App\Models\AiContent\ResearchSetting;
use App\Models\AiContent\ResearchSource;
use App\Services\AiContentEngine\Research\Providers\DuckDuckGoResearchProvider;
use App\Services\AiContentEngine\Research\Providers\InternalKnowledgeProvider;
use App\Services\AiContentEngine\Research\Providers\NewsSearchProvider;
use App\Services\AiContentEngine\Research\Providers\OfficialSourcesProvider;
use App\Services\AiContentEngine\Research\Providers\TavilyResearchProvider;
use App\Services\AiContentEngine\Support\CreditSaver;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Str;

class HybridResearchEngine
{
    public function __construct(
        protected OfficialSourcesProvider $official,
        protected TavilyResearchProvider $tavily,
        protected NewsSearchProvider $news,
        protected InternalKnowledgeProvider $internal,
        protected DuckDuckGoResearchProvider $duckduckgo,
        protected TrustScorer $scorer,
        protected LlmGateway $llm
    ) {}

    /**
     * Hybrid research used by AIResearchAgent and artisan research:test.
     *
     * @param  array{
     *   skip_tavily?: bool,
     *   use_duckduckgo?: bool,
     *   skip_news?: bool,
     *   max_sources?: int,
     *   min_trust_score?: int,
     *   force_refresh?: bool
     * }  $options
     * @return array{
     *   topic: string,
     *   from_cache: bool,
     *   findings: array<int, array<string, mixed>>,
     *   summary: array<string, mixed>,
     *   avg_trust_score: int,
     *   providers: array<int, string>,
     *   execution_time_ms: int,
     *   session: ResearchResult|null
     * }
     */
    public function research(string $topic, ?Article $article = null, bool $forceRefresh = false, array $options = []): array
    {
        $started = microtime(true);
        $topic = trim($topic);
        $settings = ResearchSetting::allMapped();
        $cacheDays = (int) ($settings['cache_days'] ?? 30);
        $maxSources = (int) ($options['max_sources'] ?? $settings['max_sources'] ?? 12);
        $minTrust = (int) ($options['min_trust_score'] ?? $settings['min_trust_score'] ?? 50);
        $forceRefresh = $forceRefresh || ! empty($options['force_refresh']);
        $skipTavily = (bool) ($options['skip_tavily'] ?? false);
        $useDuckDuckGo = (bool) ($options['use_duckduckgo'] ?? false);
        $skipNews = (bool) ($options['skip_news'] ?? false);

        if (! $forceRefresh) {
            $cached = $this->findFreshCache($topic, $cacheDays);
            if ($cached) {
                $this->log('cache_hit', 'cache', 'ok', (int) ((microtime(true) - $started) * 1000), null, [
                    'topic' => $topic,
                    'session_id' => $cached->id,
                ], $article?->id);

                return [
                    'topic' => $topic,
                    'from_cache' => true,
                    'findings' => $cached->results ?? [],
                    'summary' => $cached->structured_payload
                        ?? ['topic' => $topic, 'main_points' => [$cached->structured_summary]],
                    'avg_trust_score' => (int) ($cached->avg_trust_score ?? 0),
                    'providers' => ['cache'],
                    'execution_time_ms' => (int) ((microtime(true) - $started) * 1000),
                    'session' => $cached,
                ];
            }
        }

        $findings = [];
        $providersUsed = [];

        // 1) Official sources — highest trust priority (never demoted by Tavily).
        $findings = array_merge($findings, $this->safeProviderSearch($this->official, $topic, min(6, $maxSources), $article?->id));
        $providersUsed[] = 'official';

        // 2) Tavily AI — optional (skipped for Ask Expert by default to save credits).
        if (! $skipTavily && ! empty($settings['tavily_enabled'])) {
            $tavilyLimit = min(max(6, (int) config('ai_content_engine.tavily.max_results', 8)), $maxSources);
            $findings = array_merge($findings, $this->safeProviderSearch($this->tavily, $topic, $tavilyLimit, $article?->id));
            $providersUsed[] = 'tavily';
        }

        // 3) Free web fallback (DuckDuckGo) when Tavily is skipped or as complement.
        if ($useDuckDuckGo || ($skipTavily && empty($settings['tavily_enabled']))) {
            $findings = array_merge($findings, $this->safeProviderSearch($this->duckduckgo, $topic, min(8, $maxSources), $article?->id));
            $providersUsed[] = 'duckduckgo';
        }

        // 4) News via Tavily (topic=news) when enabled.
        if (! $skipNews && ! $skipTavily && ! empty($settings['news_enabled'])) {
            $findings = array_merge($findings, $this->safeProviderSearch($this->news, $topic, min(5, $maxSources), $article?->id));
            $providersUsed[] = 'news';
        }

        // 5) Internal knowledge (published blog / prior research).
        $findings = array_merge($findings, $this->safeProviderSearch($this->internal, $topic, min(4, $maxSources), $article?->id));
        $providersUsed[] = 'internal';

        $normalized = $this->normalizeAndRank($findings, $minTrust, $maxSources);
        $avgTrust = $this->averageTrust($normalized);
        $summary = $this->buildStructuredSummary($topic, $normalized);

        $session = ResearchResult::create([
            'article_id' => $article?->id,
            'query' => $topic,
            'topic' => $topic,
            'provider' => 'hybrid',
            'avg_trust_score' => $avgTrust,
            'results' => $normalized,
            'structured_summary' => $summary['main_points'][0] ?? ($summary['topic'] ?? $topic),
            'structured_payload' => $summary,
            'facts' => $summary['main_points'] ?? [],
            'references' => $summary['sources'] ?? [],
            'from_cache' => false,
            'searched_at' => now(),
        ]);

        $this->persistFindings($topic, $normalized, $session, $article);

        $ms = (int) ((microtime(true) - $started) * 1000);
        $this->log('hybrid_research', 'hybrid', 'ok', $ms, null, [
            'topic' => $topic,
            'findings' => count($normalized),
            'avg_trust_score' => $avgTrust,
            'providers' => $providersUsed,
        ], $article?->id);

        return [
            'topic' => $topic,
            'from_cache' => false,
            'findings' => $normalized,
            'summary' => $summary,
            'avg_trust_score' => $avgTrust,
            'providers' => $providersUsed,
            'execution_time_ms' => $ms,
            'session' => $session,
        ];
    }

    protected function findFreshCache(string $topic, int $cacheDays): ?ResearchResult
    {
        $normalized = Str::lower(trim($topic));

        return ResearchResult::query()
            ->where(function ($q) use ($topic, $normalized) {
                $q->where('topic', $topic)
                    ->orWhereRaw('LOWER(topic) = ?', [$normalized])
                    ->orWhere('query', $topic);
            })
            ->where('searched_at', '>=', now()->subDays(max(1, $cacheDays)))
            ->whereNotNull('structured_payload')
            ->orderByDesc('searched_at')
            ->first();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function safeProviderSearch(object $provider, string $topic, int $limit, ?int $articleId): array
    {
        $started = microtime(true);

        try {
            if (method_exists($provider, 'enabled') && ! $provider->enabled()) {
                return [];
            }

            $results = $provider->search($topic, $limit);
            $this->log('provider_search', $provider->name(), 'ok', (int) ((microtime(true) - $started) * 1000), null, [
                'topic' => $topic,
                'count' => count($results),
            ], $articleId);

            return $results;
        } catch (\Throwable $e) {
            $this->log('provider_search', $provider->name(), 'error', (int) ((microtime(true) - $started) * 1000), $e->getMessage(), [
                'topic' => $topic,
            ], $articleId);

            return [];
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $findings
     * @return array<int, array<string, mixed>>
     */
    protected function normalizeAndRank(array $findings, int $minTrust, int $maxSources): array
    {
        $unique = [];

        foreach ($findings as $item) {
            $url = $item['url'] ?? null;
            $key = $url ?: md5(($item['title'] ?? '').'|'.($item['snippet'] ?? $item['content'] ?? ''));

            $source = null;
            if (! empty($item['source_id'])) {
                $source = ResearchSource::find($item['source_id']);
            } elseif ($url) {
                $host = Str::lower(preg_replace('/^www\./', '', parse_url($url, PHP_URL_HOST) ?: '') ?? '');
                if ($host) {
                    $source = ResearchSource::where('domain', $host)->first();
                }
            }

            $trust = (int) ($item['trust_score'] ?? $this->scorer->score($url, $source, $item['provider'] ?? null));
            if ($trust < $minTrust && ($item['provider'] ?? '') !== 'official') {
                continue;
            }

            $normalized = [
                'title' => $item['title'] ?? null,
                'url' => $url,
                'snippet' => $item['snippet'] ?? Str::limit((string) ($item['content'] ?? ''), 500, ''),
                'content' => $item['content'] ?? $item['snippet'] ?? '',
                'summary' => $item['summary'] ?? null,
                'provider' => $item['provider'] ?? 'hybrid',
                'source_id' => $source?->id ?? ($item['source_id'] ?? null),
                'trust_score' => $trust,
                'published_date' => $item['published_date'] ?? null,
                'metadata' => $item['metadata'] ?? [],
            ];

            if (! isset($unique[$key]) || $unique[$key]['trust_score'] < $trust) {
                $unique[$key] = $normalized;
            }
        }

        $ranked = array_values($unique);
        usort($ranked, function ($a, $b) {
            // Official first, then trust score.
            $aOfficial = ($a['provider'] ?? '') === 'official' ? 1 : 0;
            $bOfficial = ($b['provider'] ?? '') === 'official' ? 1 : 0;
            if ($aOfficial !== $bOfficial) {
                return $bOfficial <=> $aOfficial;
            }

            return ($b['trust_score'] <=> $a['trust_score']);
        });

        return array_slice($ranked, 0, max(1, $maxSources));
    }

    /**
     * @param  array<int, array<string, mixed>>  $findings
     * @return array<string, mixed>
     */
    protected function buildStructuredSummary(string $topic, array $findings): array
    {
        if ($findings === []) {
            return [
                'topic' => $topic,
                'main_points' => [],
                'important_dates' => [],
                'numbers' => [],
                'laws' => [],
                'changes' => [],
                'sources' => [],
                'confidence_level' => 0,
                'warnings' => ['Nenhuma fonte encontrada para o tema.'],
            ];
        }

        if (CreditSaver::skipResearchSummaryLlm()) {
            return $this->heuristicSummary($topic, $findings);
        }

        try {
            $summary = $this->llm->chatJson([
                [
                    'role' => 'system',
                    'content' => <<<'PROMPT'
És o motor de Research Summary do SIGESC (Angola).
Com base APENAS nas fontes fornecidas, cria um resumo estruturado.
Nunca inventes leis, datas ou números. Se incerto, coloca em warnings.
JSON obrigatório:
{
  "topic":"",
  "main_points":[],
  "important_dates":[],
  "numbers":[],
  "laws":[],
  "changes":[],
  "sources":[{"title":"","url":"","trust_score":0}],
  "confidence_level":0,
  "warnings":[]
}
confidence_level: 0-100
PROMPT
                ],
                [
                    'role' => 'user',
                    'content' => json_encode([
                        'topic' => $topic,
                        'findings' => $findings,
                    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                ],
            ], null, 0.15);

            $summary['topic'] = $summary['topic'] ?? $topic;
            $summary['sources'] = $summary['sources'] ?? collect($findings)->map(fn ($f) => [
                'title' => $f['title'] ?? '',
                'url' => $f['url'] ?? '',
                'trust_score' => $f['trust_score'] ?? 0,
            ])->values()->all();
            $summary['confidence_level'] = (int) ($summary['confidence_level'] ?? $this->averageTrust($findings));

            return $summary;
        } catch (\Throwable $e) {
            $fallback = $this->heuristicSummary($topic, $findings);
            $fallback['warnings'][] = 'Resumo LLM indisponível: '.$e->getMessage();

            return $fallback;
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $findings
     * @return array<string, mixed>
     */
    protected function heuristicSummary(string $topic, array $findings): array
    {
        $points = collect($findings)
            ->map(fn ($f) => trim((string) ($f['snippet'] ?? $f['summary'] ?? $f['content'] ?? '')))
            ->filter()
            ->map(fn ($text) => Str::limit($text, 280, ''))
            ->unique()
            ->take(6)
            ->values()
            ->all();

        return [
            'topic' => $topic,
            'main_points' => $points,
            'important_dates' => [],
            'numbers' => [],
            'laws' => [],
            'changes' => [],
            'sources' => collect($findings)->map(fn ($f) => [
                'title' => $f['title'] ?? '',
                'url' => $f['url'] ?? '',
                'trust_score' => $f['trust_score'] ?? 0,
            ])->values()->all(),
            'confidence_level' => $this->averageTrust($findings),
            'warnings' => [
                'Resumo heurístico (credit saver): o Writer deve citar apenas o que estas fontes suportam.',
            ],
            'heuristic' => true,
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $findings
     */
    protected function persistFindings(string $topic, array $findings, ResearchResult $session, ?Article $article): void
    {
        foreach ($findings as $item) {
            ResearchFinding::create([
                'topic' => $topic,
                'source_id' => $item['source_id'] ?? null,
                'article_id' => $article?->id,
                'ai_research_result_id' => $session->id,
                'title' => $item['title'] ?? null,
                'url' => $item['url'] ?? null,
                'content' => $item['content'] ?? null,
                'summary' => $item['summary'] ?? Str::limit((string) ($item['snippet'] ?? ''), 500, ''),
                'published_date' => $item['published_date'] ?? null,
                'trust_score' => (int) ($item['trust_score'] ?? 50),
                'provider' => $item['provider'] ?? 'hybrid',
                'searched_at' => now(),
                'metadata' => $item['metadata'] ?? null,
            ]);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $findings
     */
    protected function averageTrust(array $findings): int
    {
        if ($findings === []) {
            return 0;
        }

        $sum = array_sum(array_map(fn ($f) => (int) ($f['trust_score'] ?? 0), $findings));

        return (int) round($sum / count($findings));
    }

    protected function log(
        string $action,
        string $provider,
        string $status,
        int $ms,
        ?string $error = null,
        array $context = [],
        ?int $articleId = null
    ): void {
        ResearchLog::create([
            'agent' => 'AIResearchAgent',
            'action' => $action,
            'provider' => $provider,
            'status' => $status,
            'execution_time_ms' => $ms,
            'error' => $error,
            'context' => $context ?: null,
            'article_id' => $articleId,
        ]);
    }
}
