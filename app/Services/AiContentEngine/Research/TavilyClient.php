<?php

namespace App\Services\AiContentEngine\Research;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Shared Tavily Search API client for content research.
 *
 * Docs: https://docs.tavily.com/documentation/api-reference/endpoint/search
 */
class TavilyClient
{
    public function configured(): bool
    {
        return (bool) config('ai_content_engine.tavily.enabled', true)
            && filled(config('ai_content_engine.tavily.api_key'));
    }

    /**
     * @param  array{
     *   query: string,
     *   max_results?: int,
     *   search_depth?: string,
     *   topic?: string,
     *   include_answer?: bool,
     *   include_domains?: list<string>|null,
     *   days?: int|null
     * }  $options
     * @return array{answer:?string, results: list<array<string, mixed>>}
     */
    public function search(array $options): array
    {
        if (! $this->configured()) {
            return ['answer' => null, 'results' => []];
        }

        $query = trim((string) ($options['query'] ?? ''));
        if ($query === '') {
            return ['answer' => null, 'results' => []];
        }

        $maxResults = (int) ($options['max_results'] ?? config('ai_content_engine.tavily.max_results', 8));
        $payload = [
            'api_key' => config('ai_content_engine.tavily.api_key'),
            'query' => $query,
            'search_depth' => $options['search_depth'] ?? 'advanced',
            'include_answer' => (bool) ($options['include_answer'] ?? true),
            'max_results' => max(1, min(20, $maxResults)),
            'topic' => $options['topic'] ?? 'general',
        ];

        if (! empty($options['include_domains'])) {
            $payload['include_domains'] = array_values(array_unique($options['include_domains']));
        }

        if (! empty($options['days'])) {
            $payload['days'] = (int) $options['days'];
        }

        $response = $this->post($payload);

        // Retry without domain filter when Tavily rejects unknown domains.
        if (! $response->successful() && ! empty($payload['include_domains'])) {
            unset($payload['include_domains']);
            $response = $this->post($payload);
        }

        if (! $response->successful()) {
            throw new \RuntimeException('Tavily error: '.$response->status().' '.$response->body());
        }

        $data = $response->json() ?: [];

        return [
            'answer' => isset($data['answer']) && is_string($data['answer']) ? $data['answer'] : null,
            'results' => is_array($data['results'] ?? null) ? $data['results'] : [],
        ];
    }

    /**
     * Prefer trusted Angolan / institutional domains, then open web.
     *
     * @return array{answer:?string, results: list<array<string, mixed>>}
     */
    public function searchForContent(string $query, int $maxResults = 8, string $topic = 'general'): array
    {
        $trusted = array_values(array_filter(config('ai_content_engine.trusted_domains', [])));
        $merged = ['answer' => null, 'results' => []];
        $seen = [];

        try {
            if ($trusted !== []) {
                $preferred = $this->search([
                    'query' => $query,
                    'max_results' => min(5, $maxResults),
                    'topic' => $topic,
                    'include_answer' => true,
                    'include_domains' => $trusted,
                    'days' => $topic === 'news' ? 30 : null,
                ]);

                $merged['answer'] = $preferred['answer'];
                foreach ($preferred['results'] as $item) {
                    $url = $item['url'] ?? null;
                    if (! $url || isset($seen[$url])) {
                        continue;
                    }
                    $seen[$url] = true;
                    $item['_preferred_domain'] = true;
                    $merged['results'][] = $item;
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Tavily trusted-domain search failed', ['error' => $e->getMessage()]);
        }

        $open = $this->search([
            'query' => $query,
            'max_results' => $maxResults,
            'topic' => $topic,
            'include_answer' => $merged['answer'] === null,
            'days' => $topic === 'news' ? 30 : null,
        ]);

        if ($merged['answer'] === null) {
            $merged['answer'] = $open['answer'];
        }

        foreach ($open['results'] as $item) {
            $url = $item['url'] ?? null;
            if (! $url || isset($seen[$url])) {
                continue;
            }
            $seen[$url] = true;
            $merged['results'][] = $item;
        }

        $merged['results'] = array_slice($merged['results'], 0, $maxResults);

        return $merged;
    }

    protected function post(array $payload): \Illuminate\Http\Client\Response
    {
        return Http::timeout(45)
            ->acceptJson()
            ->post(config('ai_content_engine.tavily.base_url').'/search', $payload);
    }
}
