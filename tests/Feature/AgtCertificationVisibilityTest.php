<?php

namespace Tests\Feature;

use Tests\TestCase;

class AgtCertificationVisibilityTest extends TestCase
{
    public function test_config_exposes_agt_certification_number(): void
    {
        $this->assertSame('FE/323/AGT/2026', config('sigesc.agt_certification.number'));
        $this->assertStringContainsString(
            'FE/323/AGT/2026',
            (string) config('ai_content_engine.pipeline.brand_cta')
        );
    }

    public function test_ssr_layout_shows_certification_number(): void
    {
        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/calculadoras')
            ->assertOk()
            ->assertSee('FE/323/AGT/2026', false)
            ->assertSee('Software certificado AGT', false)
            ->getContent();

        $this->assertStringContainsString('agt-cert', $html);
    }
}
