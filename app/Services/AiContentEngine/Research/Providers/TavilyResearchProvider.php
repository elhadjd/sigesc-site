<?php

namespace App\Services\AiContentEngine\Research\Providers;

use App\Models\AiContent\ResearchSetting;
use App\Services\AiContentEngine\Research\Contracts\ResearchProviderInterface;
use App\Services\AiContentEngine\Research\TrustScorer;
use Illuminate\Support\Facades\Http;

class TavilyResearchProvider implements ResearchProviderInterface
{
    public function __construct(
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

        return (bool) $settingsEnabled && filled(config('ai_content_engine.tavily.api_key'));
    }

    public function search(string $topic, int $limit = 8): array
    {
        if (! $this->enabled()) {
            return [];
        }

        $payload = [
            'api_key' => config('ai_content_engine.tavily.api_key'),
            'query' => $topic.' Angola',
            'search_depth' => 'advanced',
            'include_answer' => true,
            'max_results' => $limit,
        ];

        $response = Http::timeout(45)
            ->acceptJson()
            ->post(config('ai_content_engine.tavily.base_url').'/search', $payload);

        if (! $response->successful()) {
            throw new \RuntimeException('Tavily error: '.$response->body());
        }

        $data = $response->json();
        $results = [];

        foreach ($data['results'] ?? [] as $item) {
            $url = $item['url'] ?? '';
            $results[] = [
                'title' => $item['title'] ?? '',
                'url' => $url,
                'snippet' => $item['content'] ?? '',
                'content' => $item['content'] ?? '',
                'provider' => $this->name(),
                'trust_score' => $this->scorer->score($url, null, $this->name()),
                'published_date' => $item['published_date'] ?? null,
                'metadata' => [
                    'tavily_score' => $item['score'] ?? null,
                    'role' => 'complementary',
                ],
            ];
        }

        if (! empty($data['answer'])) {
            $results[] = [
                'title' => 'Síntese complementar Tavily',
                'url' => null,
                'snippet' => $data['answer'],
                'content' => $data['answer'],
                'provider' => $this->name(),
                'trust_score' => 55,
                'published_date' => null,
                'metadata' => ['role' => 'tavily_answer'],
            ];
        }

        return $results;
    }
}
