<?php

namespace App\Services\AiContentEngine\Research\Providers;

use App\Models\AiContent\ResearchSetting;
use App\Models\AiContent\ResearchSource;
use App\Services\AiContentEngine\Research\Contracts\ResearchProviderInterface;
use App\Services\AiContentEngine\Research\TrustScorer;
use App\Services\AiContentEngine\Support\ResearchGateway;

class NewsSearchProvider implements ResearchProviderInterface
{
    public function __construct(
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

        $query = $topic.' Angola notícias OR legislação OR AGT';
        $raw = $this->gateway->search($query, $limit);

        $newsDomains = ResearchSource::query()
            ->where('is_active', true)
            ->where(function ($q) {
                $q->where('category', 'news')->orWhere('type', 'news');
            })
            ->pluck('domain')
            ->filter()
            ->all();

        $results = [];

        foreach ($raw['results'] as $item) {
            $url = $item['url'] ?? '';
            $host = parse_url($url, PHP_URL_HOST) ?: '';
            $host = strtolower(preg_replace('/^www\./', '', $host) ?? $host);

            $isNews = in_array($host, $newsDomains, true)
                || str_contains($host, 'jornal')
                || str_contains($host, 'noticia')
                || str_contains($host, 'news');

            // Keep general recent web hits as light news complement.
            $score = $this->scorer->score($url, null, $isNews ? 'news' : 'web');

            $results[] = [
                'title' => $item['title'] ?? '',
                'url' => $url,
                'snippet' => $item['snippet'] ?? '',
                'content' => $item['snippet'] ?? '',
                'provider' => $this->name(),
                'trust_score' => $score,
                'published_date' => null,
                'metadata' => [
                    'upstream' => $raw['provider'],
                    'is_news_domain' => $isNews,
                ],
            ];
        }

        usort($results, fn ($a, $b) => ($b['trust_score'] <=> $a['trust_score']));

        return array_slice($results, 0, $limit);
    }
}
