<?php

namespace App\Services\Blog;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiClient
{
    public function chat(array $messages, array $options = []): array
    {
        $payload = array_merge([
            'model' => config('ai_blog.openai.model'),
            'messages' => $messages,
            'temperature' => 0.7,
            'response_format' => ['type' => 'json_object'],
        ], $options);

        $response = $this->client()->post('/chat/completions', $payload);

        if (! $response->successful()) {
            throw new RuntimeException(
                'OpenAI chat failed: '.$response->status().' '.$response->body()
            );
        }

        $content = data_get($response->json(), 'choices.0.message.content');

        if (! is_string($content) || $content === '') {
            throw new RuntimeException('OpenAI returned an empty chat response.');
        }

        $decoded = json_decode($content, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('OpenAI returned invalid JSON content.');
        }

        return $decoded;
    }

    public function generateImage(string $prompt): ?string
    {
        if (! config('ai_blog.openai.generate_images')) {
            return null;
        }

        $response = $this->client()->post('/images/generations', [
            'model' => config('ai_blog.openai.image_model'),
            'prompt' => $prompt,
            'n' => 1,
            'size' => '1792x1024',
            'response_format' => 'url',
        ]);

        if (! $response->successful()) {
            return null;
        }

        return data_get($response->json(), 'data.0.url');
    }

    protected function client(): PendingRequest
    {
        $apiKey = config('ai_blog.openai.api_key');

        if (blank($apiKey)) {
            throw new RuntimeException(
                'OPENAI_API_KEY is not configured. Set it in your .env to enable AI blog generation.'
            );
        }

        return Http::baseUrl(config('ai_blog.openai.base_url'))
            ->withToken($apiKey)
            ->acceptJson()
            ->timeout((int) config('ai_blog.openai.timeout', 120))
            ->retry(2, 1000);
    }
}
