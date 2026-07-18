<?php

namespace App\Services\AiContentEngine\Research\Providers;

use App\Services\AiContentEngine\Research\Contracts\ResearchProviderInterface;
use App\Services\AiContentEngine\Research\TrustScorer;
use App\Services\AiContentEngine\Support\ResearchGateway;

/**
 * Free web research fallback (no Tavily credits).
 * Complements official/internal sources for Ask Expert.
 */
class DuckDuckGoResearchProvider implements ResearchProviderInterface
{
    public function __construct(
        protected ResearchGateway $gateway,
        protected TrustScorer $scorer
    ) {}

    public function name(): string
    {
        return 'duckduckgo';
    }

    public function enabled(): bool
    {
        return (bool) config('ai_content_engine.research.duckduckgo_enabled', true);
    }

    public function search(string $topic, int $limit = 8): array
    {
        if (! $this->enabled()) {
            return [];
        }

        $query = str_contains(mb_strtolower($topic), 'angola')
            ? $topic
            : $topic.' Angola';

        $hits = $this->gateway->searchDuckDuckGo($query, $limit);
        $results = [];

        foreach ($hits as $item) {
            $url = $item['url'] ?? null;
            $results[] = [
                'title' => $item['title'] ?? '',
                'url' => $url,
                'snippet' => $item['snippet'] ?? '',
                'content' => $item['snippet'] ?? '',
                'provider' => $this->name(),
                'trust_score' => $this->scorer->score($url, null, $this->name()),
                'published_date' => null,
                'metadata' => [
                    'role' => 'duckduckgo_web',
                ],
            ];
        }

        usort($results, fn ($a, $b) => ($b['trust_score'] <=> $a['trust_score']));

        return array_slice($results, 0, $limit);
    }
}
