<?php

namespace App\Services\AiContentEngine\Research\Providers;

use App\Models\AiContent\ResearchSetting;
use App\Services\AiContentEngine\Research\Contracts\ResearchProviderInterface;
use App\Services\AiContentEngine\Research\TavilyClient;
use App\Services\AiContentEngine\Research\TrustScorer;

/**
 * Primary web research provider (Tavily AI).
 * Complements official sources — never replaces them in ranking.
 */
class TavilyResearchProvider implements ResearchProviderInterface
{
    public function __construct(
        protected TavilyClient $client,
        protected TrustScorer $scorer
    ) {}

    public function name(): string
    {
        return 'tavily';
    }

    public function enabled(): bool
    {
        $settingsEnabled = ResearchSetting::getValue(
            'tavily_enabled',
            (bool) config('ai_content_engine.tavily.enabled', true)
        );

        return (bool) $settingsEnabled && $this->client->configured();
    }

    public function search(string $topic, int $limit = 8): array
    {
        if (! $this->enabled()) {
            return [];
        }

        $query = str_contains(mb_strtolower($topic), 'angola')
            ? $topic
            : $topic.' Angola';

        $data = $this->client->searchForContent(
            $query,
            $limit,
            'general'
        );

        return $this->mapResults($data, $limit);
    }

    /**
     * Recent news via Tavily topic=news.
     *
     * @return array<int, array<string, mixed>>
     */
    public function searchNews(string $topic, int $limit = 6): array
    {
        if (! $this->enabled()) {
            return [];
        }

        $query = str_contains(mb_strtolower($topic), 'angola')
            ? $topic
            : $topic.' Angola notícias';

        $data = $this->client->searchForContent($query, $limit, 'news');

        return $this->mapResults($data, $limit, 'news');
    }

    /**
     * @param  array{answer:?string, results: list<array<string, mixed>>}  $data
     * @return array<int, array<string, mixed>>
     */
    protected function mapResults(array $data, int $limit, string $mode = 'general'): array
    {
        $results = [];

        foreach ($data['results'] as $item) {
            $url = $item['url'] ?? '';
            $preferred = ! empty($item['_preferred_domain']);

            $results[] = [
                'title' => $item['title'] ?? '',
                'url' => $url,
                'snippet' => $item['content'] ?? '',
                'content' => $item['content'] ?? '',
                'provider' => $this->name(),
                'trust_score' => $this->scorer->score($url, null, $mode === 'news' ? 'news' : $this->name()),
                'published_date' => $item['published_date'] ?? null,
                'metadata' => [
                    'tavily_score' => $item['score'] ?? null,
                    'role' => $preferred ? 'tavily_trusted_domain' : 'tavily_web',
                    'mode' => $mode,
                ],
            ];
        }

        if (! empty($data['answer'])) {
            $results[] = [
                'title' => $mode === 'news' ? 'Síntese Tavily (notícias)' : 'Síntese Tavily',
                'url' => null,
                'snippet' => $data['answer'],
                'content' => $data['answer'],
                'provider' => $this->name(),
                'trust_score' => 58,
                'published_date' => null,
                'metadata' => ['role' => 'tavily_answer', 'mode' => $mode],
            ];
        }

        usort($results, fn ($a, $b) => ($b['trust_score'] <=> $a['trust_score']));

        return array_slice($results, 0, $limit);
    }
}
