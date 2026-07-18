<?php

namespace App\Services\AiContentEngine\Support;

use App\Services\AiContentEngine\Research\TavilyClient;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Structured JSON generation for AI Content Engine agents.
 *
 * Preferred provider: Tavily Research (TAVILY_API_KEY).
 * Optional fallback: OpenAI-compatible chat completions (OPENAI_API_KEY).
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

    public function missingConfigMessage(): string
    {
        return 'Configure TAVILY_API_KEY (recomendado) para o AI Content Engine. '
            .'A Tavily é usada na pesquisa e na geração estruturada de conteúdo. '
            .'OPENAI_API_KEY é apenas fallback opcional — não é obrigatória.';
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return array<string, mixed>
     */
    public function chatJson(array $messages, ?string $model = null, float $temperature = 0.5): array
    {
        $provider = $this->resolveProvider();

        if ($provider === null) {
            throw new RuntimeException($this->missingConfigMessage());
        }

        return match ($provider) {
            'tavily' => $this->chatJsonViaTavily($messages, $model),
            'openai' => $this->chatJsonViaOpenAi($messages, $model, $temperature),
            default => throw new RuntimeException('Unsupported LLM provider: '.$provider),
        };
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
    protected function chatJsonViaTavily(array $messages, ?string $model = null): array
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
            ] : []
        );

        return $this->normalizeStructuredContent($content);
    }

    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return array<string, mixed>
     */
    protected function chatJsonViaOpenAi(array $messages, ?string $model = null, float $temperature = 0.5): array
    {
        $apiKey = config('ai_content_engine.openai.api_key');

        if (blank($apiKey)) {
            throw new RuntimeException('OPENAI_API_KEY is required when AI_CONTENT_LLM_PROVIDER=openai.');
        }

        $response = Http::baseUrl(config('ai_content_engine.openai.base_url'))
            ->withToken($apiKey)
            ->acceptJson()
            ->timeout((int) config('ai_content_engine.openai.timeout', 180))
            ->retry(2, 1200)
            ->post('/chat/completions', [
                'model' => $model ?: config('ai_content_engine.openai.model'),
                'messages' => $messages,
                'temperature' => $temperature,
                'response_format' => ['type' => 'json_object'],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('LLM chat failed: '.$response->status().' '.$response->body());
        }

        $content = data_get($response->json(), 'choices.0.message.content');
        $decoded = json_decode((string) $content, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('LLM returned invalid JSON.');
        }

        return $decoded;
    }

    protected function resolveProvider(): ?string
    {
        $preferred = strtolower((string) config('ai_content_engine.llm.provider', 'auto'));

        if ($preferred === 'tavily') {
            return $this->tavily->configured() ? 'tavily' : null;
        }

        if ($preferred === 'openai') {
            return filled(config('ai_content_engine.openai.api_key')) ? 'openai' : null;
        }

        // auto: Tavily first (pesquisa + geração), OpenAI só se Tavily não estiver configurada
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
                return $decoded;
            }

            throw new RuntimeException('Tavily Research returned a non-JSON string.');
        }

        if (isset($content['json']) && is_string($content['json'])) {
            $decoded = $this->decodeJsonString($content['json']);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        if (isset($content['result']) && is_array($content['result'])) {
            return $content['result'];
        }

        if (isset($content['data']) && is_array($content['data'])) {
            return $content['data'];
        }

        // Content itself may already be the agent payload (topics, content_html, …).
        if ($this->looksLikeAgentPayload($content)) {
            return $content;
        }

        throw new RuntimeException('Tavily Research returned unexpected structured content.');
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
        $keys = ['topics', 'title', 'content_html', 'excerpt', 'slug_hint', 'changes', 'hallucination_flags', 'seo_score', 'posts', 'verdict', 'confidence_score'];

        foreach ($keys as $key) {
            if (array_key_exists($key, $content)) {
                return true;
            }
        }

        return false;
    }
}
