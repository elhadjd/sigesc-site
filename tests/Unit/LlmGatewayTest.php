<?php

namespace Tests\Unit;

use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class LlmGatewayTest extends TestCase
{
    public function test_auto_provider_prefers_tavily_over_openai(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'auto',
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => 'tvly-test',
            'ai_content_engine.openai.api_key' => 'sk-openai',
        ]);

        $gateway = app(LlmGateway::class);

        $this->assertTrue($gateway->configured());
        $this->assertSame('tavily', $gateway->provider());
    }

    public function test_missing_keys_explain_tavily_is_required(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'auto',
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => null,
            'ai_content_engine.openai.api_key' => null,
        ]);

        $gateway = app(LlmGateway::class);

        $this->assertFalse($gateway->configured());
        $this->assertStringContainsString('TAVILY_API_KEY', $gateway->missingConfigMessage());
        $this->assertStringNotContainsString('OPENAI_API_KEY is required for the AI Content Engine', $gateway->missingConfigMessage());

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('TAVILY_API_KEY');
        $gateway->chatJson([
            ['role' => 'system', 'content' => 'Return JSON'],
            ['role' => 'user', 'content' => '{"q":1}'],
        ]);
    }

    public function test_chat_json_uses_tavily_research_without_openai(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'auto',
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => 'tvly-test',
            'ai_content_engine.tavily.base_url' => 'https://api.tavily.com',
            'ai_content_engine.tavily.research_model' => 'mini',
            'ai_content_engine.tavily.research_timeout' => 30,
            'ai_content_engine.tavily.research_poll_seconds' => 1,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'api.tavily.com/research' => Http::response([
                'request_id' => 'req-123',
                'status' => 'pending',
                'input' => 'test',
                'model' => 'mini',
                'response_time' => 0.1,
            ], 201),
            'api.tavily.com/research/req-123' => Http::response([
                'request_id' => 'req-123',
                'status' => 'completed',
                'content' => [
                    'json' => json_encode([
                        'topics' => [
                            [
                                'title' => 'IVA em Angola para PME',
                                'summary' => 'Guia prático',
                                'category' => 'IVA',
                                'priority' => 1,
                                'keywords' => ['IVA', 'AGT'],
                                'reason' => 'Procura alta',
                            ],
                        ],
                    ], JSON_UNESCAPED_UNICODE),
                ],
            ], 200),
        ]);

        $result = app(LlmGateway::class)->chatJson([
            ['role' => 'system', 'content' => 'Devolve {"topics":[]}'],
            ['role' => 'user', 'content' => 'Pesquisa recente: []'],
        ]);

        $this->assertSame('IVA em Angola para PME', $result['topics'][0]['title']);
        Http::assertSentCount(2);
        Http::assertNotSent(function ($request) {
            return str_contains($request->url(), 'openai.com')
                || str_contains($request->url(), 'chat/completions');
        });
    }
}
