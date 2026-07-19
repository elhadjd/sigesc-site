<?php

namespace Tests\Unit;

use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class LlmGatewayTest extends TestCase
{
    public function test_auto_provider_prefers_deepseek_over_tavily(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'auto',
            'ai_content_engine.deepseek.api_key' => 'sk-deepseek',
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => 'tvly-test',
            'ai_content_engine.openai.api_key' => 'sk-openai',
        ]);

        $gateway = app(LlmGateway::class);

        $this->assertTrue($gateway->configured());
        $this->assertSame('deepseek', $gateway->provider());
    }

    public function test_auto_falls_back_to_tavily_without_deepseek(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'auto',
            'ai_content_engine.deepseek.api_key' => null,
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => 'tvly-test',
            'ai_content_engine.openai.api_key' => 'sk-openai',
        ]);

        $this->assertSame('tavily', app(LlmGateway::class)->provider());
    }

    public function test_missing_keys_mention_deepseek(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'auto',
            'ai_content_engine.deepseek.api_key' => null,
            'ai_content_engine.tavily.enabled' => true,
            'ai_content_engine.tavily.api_key' => null,
            'ai_content_engine.openai.api_key' => null,
        ]);

        $gateway = app(LlmGateway::class);

        $this->assertFalse($gateway->configured());
        $this->assertStringContainsString('DEEPSEEK_API_KEY', $gateway->missingConfigMessage());

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('DEEPSEEK_API_KEY');
        $gateway->chatJson([
            ['role' => 'system', 'content' => 'Return JSON'],
            ['role' => 'user', 'content' => '{"q":1}'],
        ]);
    }

    public function test_chat_json_uses_deepseek_openai_compatible_api(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'deepseek',
            'ai_content_engine.deepseek.api_key' => 'sk-deepseek',
            'ai_content_engine.deepseek.base_url' => 'https://api.deepseek.com',
            'ai_content_engine.deepseek.model' => 'deepseek-v4-flash',
            'ai_content_engine.deepseek.review_model' => 'deepseek-v4-pro',
            'ai_content_engine.deepseek.timeout' => 30,
            'ai_content_engine.tavily.api_key' => null,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'api.deepseek.com/*' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => json_encode([
                                'answer_html' => '<p>Resposta grounded</p>',
                                'quality_score' => 80,
                            ], JSON_UNESCAPED_UNICODE),
                        ],
                    ],
                ],
            ], 200),
        ]);

        $result = app(LlmGateway::class)->chatJson([
            ['role' => 'system', 'content' => 'Devolve JSON'],
            ['role' => 'user', 'content' => '{"question":"IVA"}'],
        ], null, 0.2, null, 'deepseek');

        $this->assertSame('<p>Resposta grounded</p>', $result['answer_html']);
        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'api.deepseek.com')
                && str_ends_with($request->url(), '/chat/completions')
                && ($request['model'] ?? null) === 'deepseek-v4-flash'
                && ($request['response_format']['type'] ?? null) === 'json_object';
        });
        Http::assertNotSent(function ($request) {
            return str_contains($request->url(), 'tavily.com');
        });
    }

    public function test_chat_json_uses_tavily_research_without_openai(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'tavily',
            'ai_content_engine.deepseek.api_key' => null,
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
    }

    public function test_openai_review_model_name_is_mapped_for_tavily(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'tavily',
            'ai_content_engine.deepseek.api_key' => null,
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
                'request_id' => 'req-map',
                'status' => 'completed',
                'content' => [
                    'json' => json_encode(['content_html' => '<p>ok</p>', 'changes' => []], JSON_UNESCAPED_UNICODE),
                ],
            ], 201),
        ]);

        app(LlmGateway::class)->chatJson([
            ['role' => 'system', 'content' => 'Review'],
            ['role' => 'user', 'content' => '{}'],
        ], 'gpt-4o-mini', 0.3);

        Http::assertSent(function ($request) {
            if (! str_ends_with($request->url(), '/research') || $request->method() !== 'POST') {
                return false;
            }

            return ($request['model'] ?? null) === 'mini';
        });
    }

    public function test_deepseek_remaps_gpt_and_legacy_model_names(): void
    {
        config([
            'ai_content_engine.llm.provider' => 'deepseek',
            'ai_content_engine.deepseek.api_key' => 'sk-deepseek',
            'ai_content_engine.deepseek.base_url' => 'https://api.deepseek.com',
            'ai_content_engine.deepseek.model' => 'deepseek-chat',
            'ai_content_engine.deepseek.review_model' => 'deepseek-v4-pro',
            'ai_content_engine.openai.api_key' => null,
            'ai_content_engine.tavily.api_key' => null,
        ]);

        $gateway = app(LlmGateway::class);

        $this->assertSame('deepseek-v4-flash', $gateway->normalizeDeepSeekModel(null));
        $this->assertSame('deepseek-v4-flash', $gateway->normalizeDeepSeekModel('deepseek-chat'));
        $this->assertSame('deepseek-v4-pro', $gateway->normalizeDeepSeekModel('deepseek-reasoner'));
        $this->assertSame('deepseek-v4-pro', $gateway->normalizeDeepSeekModel('gpt-4o-mini'));
        $this->assertSame('deepseek-v4-pro', $gateway->reviewModel());

        Http::fake([
            'api.deepseek.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => json_encode(['ok' => true])]],
                ],
            ], 200),
        ]);

        $gateway->chatJson([
            ['role' => 'system', 'content' => 'Fact check'],
            ['role' => 'user', 'content' => '{}'],
        ], 'gpt-4o-mini', 0.1, null, 'deepseek');

        Http::assertSent(function ($request) {
            return ($request['model'] ?? null) === 'deepseek-v4-pro';
        });
    }
}
