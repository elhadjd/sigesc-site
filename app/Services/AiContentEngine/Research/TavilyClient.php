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

        // Credit saver: one Search call — prefer trusted domains by scoring, not a second request.
        if ((bool) config('ai_content_engine.credit_saver.single_search', true)) {
            $open = $this->search([
                'query' => $query,
                'max_results' => $maxResults,
                'topic' => $topic,
                'include_answer' => true,
                'days' => $topic === 'news' ? 30 : null,
            ]);

            $merged['answer'] = $open['answer'];
            foreach ($open['results'] as $item) {
                $url = (string) ($item['url'] ?? '');
                if ($url === '' || isset($seen[$url])) {
                    continue;
                }
                $seen[$url] = true;
                $host = parse_url($url, PHP_URL_HOST) ?: '';
                $host = strtolower(preg_replace('/^www\./', '', (string) $host));
                $item['_preferred_domain'] = $host !== '' && collect($trusted)->contains(
                    fn ($domain) => $host === $domain || str_ends_with($host, '.'.$domain)
                );
                $merged['results'][] = $item;
            }

            usort($merged['results'], function (array $a, array $b) {
                $pref = ((int) ! empty($b['_preferred_domain'])) <=> ((int) ! empty($a['_preferred_domain']));
                if ($pref !== 0) {
                    return $pref;
                }

                return ((float) ($b['score'] ?? 0)) <=> ((float) ($a['score'] ?? 0));
            });

            $merged['results'] = array_slice($merged['results'], 0, $maxResults);

            return $merged;
        }

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

    /**
     * Run Tavily Research and return structured content (JSON schema or report).
     *
     * @param  array<string, mixed>  $outputSchema
     * @param  list<array{name: string, data: string, type?: string}>  $files
     * @return array<string, mixed>|string
     */
    public function researchJson(
        string $input,
        array $outputSchema,
        ?string $model = null,
        array $files = [],
        ?string $outputLength = null
    ): array|string {
        if (! $this->configured()) {
            throw new \RuntimeException('TAVILY_API_KEY is required for Tavily Research.');
        }

        $input = trim($input);
        if ($input === '') {
            throw new \RuntimeException('Tavily Research input cannot be empty.');
        }

        $payload = [
            'input' => $input,
            'model' => $this->normalizeResearchModel($model),
            'stream' => false,
            'output_schema' => $outputSchema,
            // Tavily only accepts short|standard|long (not "concise").
            'output_length' => $this->normalizeOutputLength($outputLength),
        ];

        if ($files !== []) {
            $payload['files'] = array_slice($files, 0, 5);
        }

        $create = $this->researchRequest()
            ->timeout(60)
            ->post($this->baseUrl().'/research', $payload);

        if (! $create->successful()) {
            throw new \RuntimeException('Tavily Research create failed: '.$create->status().' '.$create->body());
        }

        $body = $create->json() ?: [];
        $requestId = (string) ($body['request_id'] ?? '');

        // Some plans/responses may complete inline.
        if (($body['status'] ?? null) === 'completed' && array_key_exists('content', $body)) {
            return $body['content'];
        }

        if ($requestId === '') {
            if (array_key_exists('content', $body)) {
                return $body['content'];
            }

            throw new \RuntimeException('Tavily Research did not return a request_id.');
        }

        return $this->pollResearch($requestId);
    }

    /**
     * @return array<string, mixed>|string
     */
    public function pollResearch(string $requestId): array|string
    {
        $timeout = max(30, (int) config('ai_content_engine.tavily.research_timeout', 240));
        $interval = max(1, (int) config('ai_content_engine.tavily.research_poll_seconds', 4));
        $deadline = microtime(true) + $timeout;

        do {
            $response = $this->researchRequest()
                ->timeout(45)
                ->get($this->baseUrl().'/research/'.$requestId);

            if (! $response->successful()) {
                throw new \RuntimeException('Tavily Research poll failed: '.$response->status().' '.$response->body());
            }

            $body = $response->json() ?: [];
            $status = (string) ($body['status'] ?? '');

            if ($status === 'completed') {
                if (! array_key_exists('content', $body)) {
                    throw new \RuntimeException('Tavily Research completed without content.');
                }

                return $body['content'];
            }

            if ($status === 'failed') {
                $error = data_get($body, 'error') ?? data_get($body, 'detail.error') ?? 'unknown error';
                throw new \RuntimeException('Tavily Research task failed: '.$error);
            }

            if (microtime(true) >= $deadline) {
                break;
            }

            sleep($interval);
        } while (microtime(true) < $deadline);

        throw new \RuntimeException("Tavily Research timed out after {$timeout}s (request_id={$requestId}).");
    }

    /**
     * Tavily Research only accepts mini|pro|auto.
     * Agents may still pass OpenAI model names (e.g. gpt-4o-mini) — map those away.
     */
    public function normalizeResearchModel(?string $model): string
    {
        $candidate = strtolower(trim((string) ($model ?: config('ai_content_engine.tavily.research_model', 'mini'))));

        if (in_array($candidate, ['mini', 'pro', 'auto'], true)) {
            return $candidate;
        }

        $fallback = strtolower(trim((string) config('ai_content_engine.tavily.research_model', 'mini')));

        return in_array($fallback, ['mini', 'pro', 'auto'], true) ? $fallback : 'mini';
    }

    /**
     * Tavily Research only accepts short|standard|long.
     * Map legacy/aliases such as "concise" → short.
     */
    public function normalizeOutputLength(?string $length = null): string
    {
        $candidate = strtolower(trim((string) (
            $length
            ?: config('ai_content_engine.tavily.research_output_length', 'short')
        )));

        $aliases = [
            'concise' => 'short',
            'brief' => 'short',
            'mini' => 'short',
            'small' => 'short',
            'medium' => 'standard',
            'normal' => 'standard',
            'default' => 'standard',
            'full' => 'long',
            'max' => 'long',
            'detailed' => 'long',
        ];

        if (isset($aliases[$candidate])) {
            return $aliases[$candidate];
        }

        if (in_array($candidate, ['short', 'standard', 'long'], true)) {
            return $candidate;
        }

        return 'short';
    }

    protected function baseUrl(): string
    {
        return rtrim((string) config('ai_content_engine.tavily.base_url', 'https://api.tavily.com'), '/');
    }

    protected function researchRequest(): \Illuminate\Http\Client\PendingRequest
    {
        return Http::acceptJson()
            ->withToken((string) config('ai_content_engine.tavily.api_key'))
            ->withHeaders([
                'Content-Type' => 'application/json',
            ]);
    }

    protected function post(array $payload): \Illuminate\Http\Client\Response
    {
        return Http::timeout(45)
            ->acceptJson()
            ->post($this->baseUrl().'/search', $payload);
    }
}
