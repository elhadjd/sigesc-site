<?php

namespace Tests\Unit;

use App\Services\AiContentEngine\Research\TavilyClient;
use App\Services\AiContentEngine\Support\LlmGateway;
use ReflectionMethod;
use Tests\TestCase;

class LlmGatewayNormalizeTest extends TestCase
{
    public function test_normalizes_ask_expert_payload_and_nested_wrappers(): void
    {
        $gateway = new LlmGateway(app(TavilyClient::class));
        $method = new ReflectionMethod(LlmGateway::class, 'normalizeStructuredContent');
        $method->setAccessible(true);

        $direct = $method->invoke($gateway, [
            'answer_html' => '<p>Resposta</p>',
            'quality_score' => 88,
            'should_become_article' => false,
        ]);
        $this->assertSame('<p>Resposta</p>', $direct['answer_html']);

        $nested = $method->invoke($gateway, [
            'output' => [
                'json' => '{"answer_html":"<p>Ok</p>","quality_score":90}',
            ],
        ]);
        $this->assertSame('<p>Ok</p>', $nested['answer_html']);
    }
}
