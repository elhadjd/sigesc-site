<?php

namespace App\Services\AiContentEngine\Research\Providers;

use App\Models\AiContent\ResearchSetting;
use App\Services\AiContentEngine\Research\Contracts\ResearchProviderInterface;
use App\Services\AiContentEngine\Research\TrustScorer;
use App\Services\AiContentEngine\Support\ResearchGateway;

/**
 * News research — prefers Tavily (topic=news), falls back to ResearchGateway.
 */
class NewsSearchProvider implements ResearchProviderInterface
{
    public function __construct(
        protected TavilyResearchProvider $tavily,
        protected ResearchGateway $gateway,
        protected TrustScorer $scorer
    ) {}

    public function name(): string
    {
        return 'news';
    }

    public function search(string $topic, int $limit = 6): array
    {
        $enabled = ResearchSetting::getValue(
            'news_enabled',
            (bool) config('ai_content_engine.research.news_enabled', true)
        );

        if (! $enabled) {
            return [];
        }

        if ($this->tavily->enabled()) {
            $fromTavily = $this->tavily->searchNews($topic, $limit);

            return array_map(function (array $item) {
                $item['provider'] = $this->name();
                $item['metadata'] = array_merge($item['metadata'] ?? [], [
                    'upstream' => 'tavily',
                ]);

                return $item;
            }, $fromTavily);
        }

        // Fallback when Tavily is off / missing key.
        $raw = $this->gateway->search($topic.' Angola notícias OR legislação OR AGT', $limit);
        $results = [];

        foreach ($raw['results'] as $item) {
            $url = $item['url'] ?? '';
            $results[] = [
                'title' => $item['title'] ?? '',
                'url' => $url,
                'snippet' => $item['snippet'] ?? '',
                'content' => $item['snippet'] ?? '',
                'provider' => $this->name(),
                'trust_score' => $this->scorer->score($url, null, 'news'),
                'published_date' => null,
                'metadata' => [
                    'upstream' => $raw['provider'],
                ],
            ];
        }

        usort($results, fn ($a, $b) => ($b['trust_score'] <=> $a['trust_score']));

        return array_slice($results, 0, $limit);
    }
}
