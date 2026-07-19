<?php

namespace App\Services\AiContentEngine\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Lightweight Angola search-interest signals (fail-soft).
 *
 * - Google Trends RSS (geo=AO) for "what's hot" (often sports — filtered)
 * - Google Suggest (gl=ao) for business intent queries per editorial bucket
 */
class AngolaSearchInterest
{
    /**
     * @return array{
     *   trends: array<int, string>,
     *   suggestions: array<int, string>,
     *   queries: array<int, string>,
     *   source: string
     * }
     */
    public function forBucket(string $bucketKey, int $limit = 6): array
    {
        $cacheKey = 'ai_content_angola_interest:'.$bucketKey;
        $ttl = max(30, (int) config('ai_content_engine.search_interest.cache_minutes', 180));

        return Cache::remember($cacheKey, now()->addMinutes($ttl), function () use ($bucketKey, $limit) {
            $trends = $this->filterForBusiness($this->dailyTrends(), $bucketKey);
            $suggestions = $this->suggestionsForBucket($bucketKey, $limit);
            $queries = collect($suggestions)
                ->merge($trends)
                ->map(fn ($q) => trim((string) $q))
                ->filter()
                ->unique(fn ($q) => Str::lower($q))
                ->take($limit)
                ->values()
                ->all();

            return [
                'trends' => array_values($trends),
                'suggestions' => array_values($suggestions),
                'queries' => $queries,
                'source' => 'google_suggest+trends_ao',
            ];
        });
    }

    /**
     * @return array<int, string>
     */
    public function dailyTrends(): array
    {
        if (! (bool) config('ai_content_engine.search_interest.enabled', true)) {
            return [];
        }

        try {
            $url = (string) config(
                'ai_content_engine.search_interest.trends_rss_url',
                'https://trends.google.com/trending/rss?geo=AO'
            );

            $response = Http::withHeaders([
                'User-Agent' => 'SIGESC-AIContentEngine/1.0 (+'.config('sigesc.site_url').')',
                'Accept' => 'application/rss+xml, application/xml, text/xml, */*',
            ])->timeout(12)->get($url);

            if (! $response->successful()) {
                return [];
            }

            $xml = $response->body();
            if (! preg_match_all('/<item>.*?<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/si', $xml, $matches)) {
                return [];
            }

            $titles = [];
            foreach ($matches[1] as $raw) {
                $title = html_entity_decode(strip_tags(trim($raw)), ENT_QUOTES | ENT_HTML5);
                if ($title === '' || Str::contains(Str::lower($title), 'daily search')) {
                    continue;
                }
                $titles[] = $title;
            }

            return array_values(array_unique($titles));
        } catch (\Throwable $e) {
            Log::warning('Angola Google Trends RSS failed', ['error' => $e->getMessage()]);

            return [];
        }
    }

    /**
     * @return array<int, string>
     */
    public function suggestionsForBucket(string $bucketKey, int $limit = 6): array
    {
        if (! (bool) config('ai_content_engine.search_interest.enabled', true)) {
            return [];
        }

        $stems = config("ai_content_engine.search_interest.bucket_stems.{$bucketKey}", []);
        if (! is_array($stems) || $stems === []) {
            $stems = config('ai_content_engine.search_interest.bucket_stems.gestao', ['software gestão Angola']);
        }

        $out = [];
        foreach ($stems as $stem) {
            foreach ($this->googleSuggest((string) $stem) as $suggestion) {
                $out[] = $suggestion;
                if (count($out) >= $limit * 2) {
                    break 2;
                }
            }
        }

        return array_slice(array_values(array_unique($out)), 0, $limit);
    }

    /**
     * @return array<int, string>
     */
    public function googleSuggest(string $query): array
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'SIGESC-AIContentEngine/1.0 (+'.config('sigesc.site_url').')',
            ])->timeout(10)->get('https://suggestqueries.google.com/complete/search', [
                'client' => 'firefox',
                'q' => $query,
                'hl' => 'pt',
                'gl' => 'ao',
            ]);

            if (! $response->successful()) {
                return [];
            }

            $payload = $response->json();
            if (! is_array($payload) || ! isset($payload[1]) || ! is_array($payload[1])) {
                return [];
            }

            return collect($payload[1])
                ->map(fn ($item) => trim((string) $item))
                ->filter()
                ->values()
                ->all();
        } catch (\Throwable $e) {
            Log::warning('Google Suggest failed', ['query' => $query, 'error' => $e->getMessage()]);

            return [];
        }
    }

    /**
     * Keep only trends that look useful for business / SIGESC buckets.
     *
     * @param  array<int, string>  $trends
     * @return array<int, string>
     */
    protected function filterForBusiness(array $trends, string $bucketKey): array
    {
        $keywords = config("ai_content_engine.search_interest.bucket_keywords.{$bucketKey}", []);
        $global = config('ai_content_engine.search_interest.business_keywords', []);
        $needles = array_map('mb_strtolower', array_merge($global, is_array($keywords) ? $keywords : []));

        return collect($trends)
            ->filter(function (string $title) use ($needles) {
                $hay = Str::lower($title);
                foreach ($needles as $needle) {
                    if ($needle !== '' && str_contains($hay, $needle)) {
                        return true;
                    }
                }

                return false;
            })
            ->values()
            ->all();
    }
}
