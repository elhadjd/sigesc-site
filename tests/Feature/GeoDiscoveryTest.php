<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GeoDiscoveryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_about_page_exposes_product_knowledge(): void
    {
        $this->get('/sobre')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('about/index')
                ->has('seo')
                ->has('knowledge')
                ->where('seo.title', fn ($t) => str_contains((string) $t, 'Sobre o SIGESC'))
                ->where('knowledge.partnership.monthly_price', 30000)
            );
    }

    public function test_discovery_files_contain_core_facts(): void
    {
        foreach (['/llms.txt', '/llms-full.txt', '/ai.txt', '/agents.md', '/humans.txt'] as $path) {
            $body = $this->get($path)->assertOk()->getContent();
            $this->assertStringContainsString('SIGESC', $body);
            $this->assertTrue(
                str_contains($body, 'FE/323/AGT/2026') || str_contains($body, '30.000') || str_contains($body, '30000'),
                "Expected AGT or partnership facts in {$path}"
            );
        }

        $this->get('/.well-known/security.txt')
            ->assertOk()
            ->assertSee('Contact:', false);

        $json = $this->get('/.well-known/ai-plugin.json')->assertOk()->json();
        $this->assertSame('SIGESC', $json['name_for_human'] ?? null);
    }

    public function test_home_seo_includes_organization_and_geo_links(): void
    {
        $seo = app(\App\Services\Seo\SeoBuilder::class)->forHome();
        $types = collect($seo['json_ld'])->pluck('@type')->all();

        $this->assertContains('Organization', $types);
        $this->assertContains('SoftwareApplication', $types);
        $this->assertContains('WebSite', $types);
        $this->assertContains('WebPage', $types);
        $this->assertContains('FAQPage', $types);
        $this->assertNotEmpty($seo['geo_links']);
    }

    public function test_sitemap_lists_geo_surfaces(): void
    {
        $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

        foreach (['/sobre', '/llms-full.txt', '/agents.md', '/.well-known/ai-plugin.json', '/parceria'] as $needle) {
            $this->assertStringContainsString($needle, $xml);
        }
    }

    public function test_ai_bot_gets_ssr_about_page(): void
    {
        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; GPTBot/1.0)',
        ])->get('/sobre')
            ->assertOk()
            ->assertSee('FE/323/AGT/2026', false)
            ->assertSee('llms-full.txt', false)
            ->getContent();

        $this->assertStringContainsString('FAQPage', $html);
        $this->assertStringNotContainsString('data-page=', $html);
    }
}
