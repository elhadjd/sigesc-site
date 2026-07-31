<?php

namespace Tests\Unit;

use App\Services\AiContentEngine\Agents\WriterAgent;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use Mockery;
use Tests\TestCase;

class WriterAgentCertificationTest extends TestCase
{
    public function test_injects_agt_cert_when_sigesc_is_mentioned_without_number(): void
    {
        $agent = new WriterAgent(
            Mockery::mock(LlmGateway::class),
            Mockery::mock(AiLogger::class)
        );

        $html = '<h2>Ferramentas úteis</h2><p>O SIGESC ajuda PME em Angola com faturação.</p>';
        $out = $agent->ensureAgtCertificationMention($html, 'FE/323/AGT/2026');

        $this->assertStringContainsString('FE/323/AGT/2026', $out);
        $this->assertStringContainsString('certificado pela AGT', $out);
    }

    public function test_does_not_duplicate_cert_number(): void
    {
        $agent = new WriterAgent(
            Mockery::mock(LlmGateway::class),
            Mockery::mock(AiLogger::class)
        );

        $html = '<p>O SIGESC é certificado FE/323/AGT/2026.</p>';
        $out = $agent->ensureAgtCertificationMention($html, 'FE/323/AGT/2026');

        $this->assertSame(1, substr_count($out, 'FE/323/AGT/2026'));
    }

    public function test_skips_injection_when_product_not_mentioned(): void
    {
        $agent = new WriterAgent(
            Mockery::mock(LlmGateway::class),
            Mockery::mock(AiLogger::class)
        );

        $html = '<p>Como calcular o IVA em Angola com a tabela oficial.</p>';
        $out = $agent->ensureAgtCertificationMention($html, 'FE/323/AGT/2026');

        $this->assertStringNotContainsString('FE/323/AGT/2026', $out);
    }
}
