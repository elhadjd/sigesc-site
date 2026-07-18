<?php

namespace App\Services\Blog;

use App\Services\AiContentEngine\Research\TavilyClient;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WebResearchService
{
    public function __construct(
        protected TavilyClient $tavily
    ) {}

    /**
     * Research a topic across multiple queries and return normalized findings.
     * Prefers Tavily AI; falls back to DuckDuckGo when the key is missing.
     *
     * @param  array<int, string>  $queries
     * @return array{queries: array<int, string>, results: array<int, array<string, mixed>>, sources: array<int, string>, provider?: string}
     */
    public function research(array $queries): array
    {
        $results = [];
        $seenUrls = [];
        $provider = $this->tavily->configured() ? 'tavily' : 'duckduckgo';

        foreach ($queries as $query) {
            foreach ($this->searchQuery($query) as $hit) {
                $url = $hit['url'] ?? null;

                if (! $url || isset($seenUrls[$url])) {
                    continue;
                }

                $seenUrls[$url] = true;
                $results[] = $hit;
            }
        }

        $enriched = [];
        $maxPages = (int) config('ai_blog.research.max_pages_to_fetch', 4);

        foreach (array_slice($results, 0, $maxPages) as $hit) {
            $pageText = $this->extractPageText($hit['url']);

            $enriched[] = [
                'title' => $hit['title'],
                'url' => $hit['url'],
                'snippet' => $hit['snippet'],
                'page_excerpt' => $pageText,
            ];
        }

        // Keep lightweight search hits even if page fetch failed.
        if ($enriched === [] && $results !== []) {
            $enriched = array_slice($results, 0, $maxPages);
        }

        return [
            'queries' => $queries,
            'results' => $enriched,
            'sources' => collect($enriched)->pluck('url')->filter()->values()->all(),
            'provider' => $provider,
        ];
    }

    /**
     * @return array<int, array{title: string, url: string, snippet: string}>
     */
    protected function searchQuery(string $query): array
    {
        $limit = (int) config('ai_blog.research.results_per_query', 6);

        if ($this->tavily->configured()) {
            try {
                $data = $this->tavily->searchForContent($query, $limit, 'general');
                $hits = [];

                foreach ($data['results'] as $item) {
                    $url = $item['url'] ?? null;
                    if (! $url) {
                        continue;
                    }

                    $hits[] = [
                        'title' => $item['title'] ?? $query,
                        'url' => $url,
                        'snippet' => $item['content'] ?? '',
                    ];
                }

                if ($hits !== []) {
                    return $hits;
                }
            } catch (\Throwable $e) {
                Log::warning('Tavily blog research failed, falling back', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $this->searchDuckDuckGo($query);
    }

    /**
     * @return array<int, array{title: string, url: string, snippet: string}>
     */
    protected function searchDuckDuckGo(string $query): array
    {
        $limit = (int) config('ai_blog.research.results_per_query', 6);
        $hits = [];

        try {
            $response = Http::withHeaders($this->headers())
                ->timeout(25)
                ->get('https://html.duckduckgo.com/html/', [
                    'q' => $query,
                    'kl' => 'pt-pt',
                ]);

            if (! $response->successful()) {
                return $this->fallbackSearch($query, $limit);
            }

            $html = $response->body();

            if (preg_match_all(
                '/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/si',
                $html,
                $anchors,
                PREG_SET_ORDER
            )) {
                foreach ($anchors as $index => $anchor) {
                    if (count($hits) >= $limit) {
                        break;
                    }

                    $url = html_entity_decode($this->unwrapDuckDuckGoUrl($anchor[1]), ENT_QUOTES | ENT_HTML5);
                    $title = trim(html_entity_decode(strip_tags($anchor[2]), ENT_QUOTES | ENT_HTML5));

                    if (! Str::startsWith($url, ['http://', 'https://'])) {
                        continue;
                    }

                    $snippet = '';
                    if (preg_match_all('/class="result__snippet"[^>]*>(.*?)<\/(?:a|td|div)>/si', $html, $snippets)) {
                        $snippet = trim(html_entity_decode(strip_tags($snippets[1][$index] ?? ''), ENT_QUOTES | ENT_HTML5));
                    }

                    $hits[] = [
                        'title' => $title !== '' ? $title : $query,
                        'url' => $url,
                        'snippet' => $snippet,
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::warning('DuckDuckGo research failed', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);
        }

        return $hits !== [] ? $hits : $this->fallbackSearch($query, $limit);
    }

    /**
     * Fallback using DuckDuckGo Instant Answer API (lighter, less rich).
     *
     * @return array<int, array{title: string, url: string, snippet: string}>
     */
    protected function fallbackSearch(string $query, int $limit): array
    {
        try {
            $response = Http::withHeaders($this->headers())
                ->timeout(20)
                ->get('https://api.duckduckgo.com/', [
                    'q' => $query,
                    'format' => 'json',
                    'no_html' => 1,
                    'skip_disambig' => 1,
                ]);

            if (! $response->successful()) {
                return [];
            }

            $data = $response->json();
            $hits = [];

            foreach (array_merge(
                data_get($data, 'Results', []) ?: [],
                data_get($data, 'RelatedTopics', []) ?: []
            ) as $item) {
                if (count($hits) >= $limit) {
                    break;
                }

                if (isset($item['Topics']) && is_array($item['Topics'])) {
                    foreach ($item['Topics'] as $topic) {
                        if (count($hits) >= $limit) {
                            break;
                        }

                        $url = $topic['FirstURL'] ?? null;
                        $text = $topic['Text'] ?? '';

                        if ($url) {
                            $hits[] = [
                                'title' => Str::limit($text, 90, ''),
                                'url' => $url,
                                'snippet' => $text,
                            ];
                        }
                    }

                    continue;
                }

                $url = $item['FirstURL'] ?? null;
                $text = $item['Text'] ?? ($item['Text'] ?? '');

                if ($url) {
                    $hits[] = [
                        'title' => Str::limit($text, 90, ''),
                        'url' => $url,
                        'snippet' => $text,
                    ];
                }
            }

            if (($data['AbstractURL'] ?? null) && count($hits) < $limit) {
                array_unshift($hits, [
                    'title' => $data['Heading'] ?? $query,
                    'url' => $data['AbstractURL'],
                    'snippet' => $data['AbstractText'] ?? '',
                ]);
            }

            return array_slice($hits, 0, $limit);
        } catch (\Throwable $e) {
            Log::warning('DuckDuckGo Instant Answer fallback failed', [
                'query' => $query,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    protected function extractPageText(string $url): string
    {
        try {
            $response = Http::withHeaders($this->headers())
                ->timeout(20)
                ->withOptions(['allow_redirects' => true])
                ->get($url);

            if (! $response->successful()) {
                return '';
            }

            $html = $response->body();
            $html = preg_replace('/<script\b[^>]*>.*?<\/script>/si', ' ', $html) ?? $html;
            $html = preg_replace('/<style\b[^>]*>.*?<\/style>/si', ' ', $html) ?? $html;
            $html = preg_replace('/<noscript\b[^>]*>.*?<\/noscript>/si', ' ', $html) ?? $html;

            $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5);
            $text = preg_replace('/\s+/u', ' ', $text) ?? $text;

            return Str::limit(trim($text), 3500, '');
        } catch (\Throwable $e) {
            Log::info('Failed to extract page text', [
                'url' => $url,
                'error' => $e->getMessage(),
            ]);

            return '';
        }
    }

    protected function unwrapDuckDuckGoUrl(string $url): string
    {
        if (Str::contains($url, 'uddg=')) {
            parse_str(parse_url($url, PHP_URL_QUERY) ?: '', $query);

            if (! empty($query['uddg'])) {
                return urldecode($query['uddg']);
            }
        }

        return $url;
    }

    /**
     * @return array<string, string>
     */
    protected function headers(): array
    {
        return [
            'User-Agent' => config('ai_blog.research.user_agent'),
            'Accept-Language' => 'pt-PT,pt;q=0.9,en;q=0.8',
        ];
    }
}
