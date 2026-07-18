<?php

namespace App\Services\AiContentEngine\Support;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class LlmGateway
{
    /**
     * @param  array<int, array{role: string, content: string}>  $messages
     * @return array<string, mixed>
     */
    public function chatJson(array $messages, ?string $model = null, float $temperature = 0.5): array
    {
        $apiKey = config('ai_content_engine.openai.api_key');

        if (blank($apiKey)) {
            throw new RuntimeException('OPENAI_API_KEY is required for the AI Content Engine.');
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
}
