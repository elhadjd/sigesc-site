<?php

namespace App\Services\AiContentEngine\Support;

use App\Services\AiContentEngine\Research\TavilyClient;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ResearchGateway
{
    public function __construct(
        protected TavilyClient $tavily
    ) {}

    /**
     * Deep research via Tavily AI when available, with DuckDuckGo fallback.
     *
     * @return array{provider: string, results: array<int, array<string, mixed>>}
     */
    public function search(string $query, int $maxResults = 8): array
    {
        if ($this->tavily->configured()) {
            try {
                $data = $this->tavily->searchForContent($query, $maxResults, 'general');
                $results = [];

                foreach ($data['results'] as $item) {
                    $results[] = [
                        'title' => $item['title'] ?? '',
                        'url' => $item['url'] ?? '',
                        'snippet' => $item['content'] ?? '',
                        'score' => $item['score'] ?? null,
                    ];
                }

                if (! empty($data['answer'])) {
                    array_unshift($results, [
                        'title' => 'Tavily Answer',
                        'url' => '',
                        'snippet' => $data['answer'],
                        'score' => 1,
                    ]);
                }

                return [
                    'provider' => 'tavily',
                    'results' => array_slice($results, 0, $maxResults),
                ];
            } catch (\Throwable $e) {
                Log::warning('Tavily search failed, falling back', ['error' => $e->getMessage()]);
            }
        }

        return [
            'provider' => 'duckduckgo',
            'results' => $this->searchDuckDuckGo($query, $maxResults),
        ];
    }

    /**
     * Free HTML search (no API key / no Tavily credits).
     *
     * @return array<int, array<string, mixed>>
     */
    public function searchDuckDuckGo(string $query, int $maxResults = 8): array
    {
        $hits = [];
        $q = str_contains(mb_strtolower($query), 'angola')
            ? $query
            : $query.' Angola';

        try {
            $response = Http::withHeaders([
                'User-Agent' => 'SIGESC-AIContentEngine/1.0 (+'.config('sigesc.site_url').')',
            ])->timeout(25)->get('https://html.duckduckgo.com/html/', [
                'q' => $q,
                'kl' => 'pt-pt',
            ]);

            if ($response->successful() && preg_match_all(
                '/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/si',
                $response->body(),
                $anchors,
                PREG_SET_ORDER
            )) {
                foreach ($anchors as $anchor) {
                    if (count($hits) >= $maxResults) {
                        break;
                    }

                    $url = html_entity_decode($this->unwrapDuckUrl($anchor[1]), ENT_QUOTES | ENT_HTML5);
                    if (! Str::startsWith($url, ['http://', 'https://'])) {
                        continue;
                    }

                    $hits[] = [
                        'title' => trim(html_entity_decode(strip_tags($anchor[2]), ENT_QUOTES | ENT_HTML5)),
                        'url' => $url,
                        'snippet' => '',
                        'score' => null,
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::warning('DuckDuckGo research fallback failed', ['error' => $e->getMessage()]);
        }

        return $hits;
    }

    protected function unwrapDuckUrl(string $url): string
    {
        if (Str::contains($url, 'uddg=')) {
            parse_str(parse_url($url, PHP_URL_QUERY) ?: '', $query);
            if (! empty($query['uddg'])) {
                return urldecode($query['uddg']);
            }
        }

        return $url;
    }

    public function isTrustedUrl(?string $url): bool
    {
        if (! $url) {
            return false;
        }

        $host = parse_url($url, PHP_URL_HOST) ?: '';
        $host = Str::lower(preg_replace('/^www\./', '', $host) ?? $host);

        foreach (config('ai_content_engine.trusted_domains', []) as $domain) {
            if ($host === $domain || Str::endsWith($host, '.'.$domain)) {
                return true;
            }
        }

        return false;
    }
}
