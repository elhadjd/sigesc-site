<?php

namespace App\Services\AiContentEngine\Support;

use App\Services\AiContentEngine\Research\TavilyClient;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Structured JSON generation for AI Content Engine agents.
 *
 * Providers: DeepSeek (OpenAI-compatible), Tavily Research, OpenAI.
 */
class LlmGateway
{
    public function __construct(
        protected TavilyClient $tavily
    ) {}

    public function configured(): bool
    {
        return $this->resolveProvider() !== null;
    }

    public function provider(): ?string
    {
        return $this->resolveProvider();
    }

    public function isProviderReady(string $provider): bool
    {
        return $this->resolveProvider(strtolower($provider)) !== null;
    }

    public function missingConfigMessage(): string
    {
        return 'Configure DEEPSEEK_API_KEY (recomendado para Pergunte ao Especialista), '
            .'ou TAVILY_API_KEY / OPENAI_API_KEY para o AI Content Engine.';
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return array<string, mixed>
     */
    public function chatJson(
        array $messages,
        ?string $model = null,
        float $temperature = 0.5,
        ?string $outputLength = null,
        ?string $providerOverride = null
    ): array {
        $provider = $providerOverride
            ? $this->resolveProvider($providerOverride)
            : $this->resolveProvider();

        if ($provider === null) {
            throw new RuntimeException(
                $providerOverride
                    ? 'LLM provider "'.$providerOverride.'" is not configured.'
                    : $this->missingConfigMessage()
            );
        }

        return match ($provider) {
            'deepseek' => $this->chatJsonViaOpenAiCompatible(
                $messages,
                $this->normalizeDeepSeekModel($model),
                $temperature,
                (string) config('ai_content_engine.deepseek.base_url'),
                (string) config('ai_content_engine.deepseek.api_key'),
                (int) config('ai_content_engine.deepseek.timeout', 180),
                'DeepSeek'
            ),
            'tavily' => $this->chatJsonViaTavily($messages, $model, $outputLength),
            'openai' => $this->chatJsonViaOpenAiCompatible(
                $messages,
                $model ?: (string) config('ai_content_engine.openai.model'),
                $temperature,
                (string) config('ai_content_engine.openai.base_url'),
                (string) config('ai_content_engine.openai.api_key'),
                (int) config('ai_content_engine.openai.timeout', 180),
                'OpenAI'
            ),
            default => throw new RuntimeException('Unsupported LLM provider: '.$provider),
        };
    }

    /**
     * Provider-aware model for fact-check / review agents.
     * Never return OpenAI names when the active provider is DeepSeek.
     */
    public function reviewModel(?string $providerOverride = null): string
    {
        $provider = $providerOverride
            ? $this->resolveProvider($providerOverride)
            : $this->resolveProvider();

        return match ($provider) {
            'deepseek' => $this->normalizeDeepSeekModel(
                (string) config('ai_content_engine.deepseek.review_model', 'deepseek-v4-pro')
            ),
            'tavily' => (string) config('ai_content_engine.tavily.research_model', 'mini'),
            'openai' => (string) config('ai_content_engine.openai.review_model', 'gpt-4o-mini'),
            default => $this->normalizeDeepSeekModel(null),
        };
    }

    /**
     * DeepSeek API currently accepts only deepseek-v4-flash | deepseek-v4-pro.
     * Remap legacy aliases and accidental OpenAI model names from agents.
     */
    public function normalizeDeepSeekModel(?string $model): string
    {
        $allowed = ['deepseek-v4-flash', 'deepseek-v4-pro'];
        $default = strtolower(trim((string) config('ai_content_engine.deepseek.model', 'deepseek-v4-flash')));
        $review = strtolower(trim((string) config('ai_content_engine.deepseek.review_model', 'deepseek-v4-pro')));
        $candidate = strtolower(trim((string) ($model ?: $default)));

        if (in_array($candidate, $allowed, true)) {
            return $candidate;
        }

        // Legacy DeepSeek aliases (retiring 2026-07-24).
        if ($candidate === 'deepseek-chat') {
            return 'deepseek-v4-flash';
        }
        if ($candidate === 'deepseek-reasoner') {
            return 'deepseek-v4-pro';
        }

        // Agents historically pass openai.review_model (gpt-4o-mini, etc.).
        if (
            str_contains($candidate, 'gpt')
            || str_starts_with($candidate, 'o1')
            || str_starts_with($candidate, 'o3')
            || str_contains($candidate, 'chatgpt')
        ) {
            return in_array($review, $allowed, true) ? $review : 'deepseek-v4-pro';
        }

        return in_array($default, $allowed, true) ? $default : 'deepseek-v4-flash';
    }

    public function generateImage(string $prompt, string $size = '1792x1024'): ?string
    {
        $apiKey = config('ai_content_engine.openai.api_key');
        if (blank($apiKey)) {
            return null;
        }

        $response = Http::baseUrl(config('ai_content_engine.openai.base_url'))
            ->withToken($apiKey)
            ->acceptJson()
            ->timeout(120)
            ->post('/images/generations', [
                'model' => config('ai_content_engine.openai.image_model'),
                'prompt' => $prompt,
                'n' => 1,
                'size' => $size,
                'response_format' => 'url',
            ]);

        if (! $response->successful()) {
            return null;
        }

        return data_get($response->json(), 'data.0.url');
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return array<string, mixed>
     */
    protected function chatJsonViaTavily(array $messages, ?string $model = null, ?string $outputLength = null): array
    {
        if (! $this->tavily->configured()) {
            throw new RuntimeException('TAVILY_API_KEY is required for the AI Content Engine (Tavily provider).');
        }

        $system = '';
        $userParts = [];

        foreach ($messages as $message) {
            $role = strtolower((string) ($message['role'] ?? 'user'));
            $content = trim((string) ($message['content'] ?? ''));
            if ($content === '') {
                continue;
            }
            if ($role === 'system') {
                $system .= ($system === '' ? '' : "\n\n").$content;
            } else {
                $userParts[] = $content;
            }
        }

        $userPayload = implode("\n\n", $userParts);
        $input = trim(<<<PROMPT
{$system}

Devolve APENAS o objeto JSON pedido nas instruções acima (sem markdown, sem texto extra).
Usa o contexto anexado em context.json quando existir.

Contexto / pedido:
{$userPayload}
PROMPT);

        $content = $this->tavily->researchJson(
            $input,
            $this->genericJsonSchema(),
            $model ?: (string) config('ai_content_engine.tavily.research_model', 'mini'),
            filled($userPayload) ? [
                [
                    'name' => 'context.json',
                    'data' => base64_encode($userPayload),
                    'type' => 'base64',
                ],
            ] : [],
            $outputLength
        );

        return $this->normalizeStructuredContent($content);
    }

    /**
     * OpenAI-compatible chat completions (OpenAI, DeepSeek, etc.).
     *
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return array<string, mixed>
     */
    protected function chatJsonViaOpenAiCompatible(
        array $messages,
        string $model,
        float $temperature,
        string $baseUrl,
        string $apiKey,
        int $timeout,
        string $label
    ): array {
        if (blank($apiKey)) {
            throw new RuntimeException($label.' API key is required for this LLM provider.');
        }

        $baseUrl = rtrim($baseUrl, '/');
        // DeepSeek accepts both https://api.deepseek.com and .../v1
        if (! str_ends_with($baseUrl, '/v1')) {
            $baseUrl .= '/v1';
        }

        $response = Http::baseUrl($baseUrl)
            ->withToken($apiKey)
            ->acceptJson()
            ->timeout($timeout)
            ->retry(2, 1200)
            ->post('/chat/completions', [
                'model' => $model,
                'messages' => $messages,
                'temperature' => $temperature,
                'response_format' => ['type' => 'json_object'],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException($label.' chat failed: '.$response->status().' '.$response->body());
        }

        $content = data_get($response->json(), 'choices.0.message.content');
        $decoded = json_decode((string) $content, true);

        if (! is_array($decoded)) {
            throw new RuntimeException($label.' returned invalid JSON.');
        }

        return $decoded;
    }

    protected function resolveProvider(?string $preferred = null): ?string
    {
        $preferred = strtolower((string) ($preferred ?? config('ai_content_engine.llm.provider', 'auto')));

        if ($preferred === 'deepseek') {
            return filled(config('ai_content_engine.deepseek.api_key')) ? 'deepseek' : null;
        }

        if ($preferred === 'tavily') {
            return $this->tavily->configured() ? 'tavily' : null;
        }

        if ($preferred === 'openai') {
            return filled(config('ai_content_engine.openai.api_key')) ? 'openai' : null;
        }

        // auto: DeepSeek → Tavily → OpenAI
        if (filled(config('ai_content_engine.deepseek.api_key'))) {
            return 'deepseek';
        }

        if ($this->tavily->configured()) {
            return 'tavily';
        }

        if (filled(config('ai_content_engine.openai.api_key'))) {
            return 'openai';
        }

        return null;
    }

    /**
     * @return array<string, mixed>
     */
    protected function genericJsonSchema(): array
    {
        return [
            'properties' => [
                'json' => [
                    'type' => 'string',
                    'description' => 'Single minified JSON object string that fully matches the schema requested in the task instructions (all required keys).',
                ],
            ],
            'required' => ['json'],
        ];
    }

    /**
     * @param  array<string, mixed>|string  $content
     * @return array<string, mixed>
     */
    protected function normalizeStructuredContent(array|string $content): array
    {
        if (is_string($content)) {
            $decoded = $this->decodeJsonString($content);
            if (is_array($decoded)) {
                return $this->normalizeStructuredContent($decoded);
            }

            throw new RuntimeException('Tavily Research returned a non-JSON string.');
        }

        if (isset($content['json']) && is_string($content['json'])) {
            $decoded = $this->decodeJsonString($content['json']);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        if (isset($content['json']) && is_array($content['json'])) {
            return $content['json'];
        }

        foreach (['result', 'data', 'output', 'payload', 'response'] as $key) {
            if (! isset($content[$key])) {
                continue;
            }
            if (is_array($content[$key])) {
                if ($this->looksLikeAgentPayload($content[$key])) {
                    return $content[$key];
                }
                if (isset($content[$key]['json']) || isset($content[$key]['content_html']) || isset($content[$key]['answer_html'])) {
                    return $this->normalizeStructuredContent($content[$key]);
                }

                return $content[$key];
            }
            if (is_string($content[$key])) {
                $decoded = $this->decodeJsonString($content[$key]);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }
        }

        if (isset($content['content']) && is_string($content['content'])) {
            $decoded = $this->decodeJsonString($content['content']);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        if (isset($content['content']) && is_array($content['content'])) {
            return $this->normalizeStructuredContent($content['content']);
        }

        if ($this->looksLikeAgentPayload($content)) {
            return $content;
        }

        throw new RuntimeException('Tavily Research returned unexpected structured content: '.implode(', ', array_keys($content)));
    }

    /**
     * @return array<string, mixed>|null
     */
    protected function decodeJsonString(string $raw): ?array
    {
        $raw = trim($raw);
        if ($raw === '') {
            return null;
        }

        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        if (preg_match('/\{.*\}/s', $raw, $matches)) {
            $decoded = json_decode($matches[0], true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $content
     */
    protected function looksLikeAgentPayload(array $content): bool
    {
        $keys = [
            'topics', 'title', 'content_html', 'excerpt', 'slug_hint', 'changes',
            'hallucination_flags', 'seo_score', 'posts', 'verdict', 'confidence_score',
            'answer_html', 'quality_score', 'should_become_article', 'suggested_title',
            'summary', 'keywords', 'confidence', 'fact_check_status', 'meta_title',
            'facebook', 'instagram', 'linkedin',
        ];

        foreach ($keys as $key) {
            if (array_key_exists($key, $content)) {
                return true;
            }
        }

        return false;
    }
}
