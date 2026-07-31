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

    public function test_discovery_files_contain_agt_cert_and_invoicing_keywords(): void
    {
        $needles = [
            'FE/323/AGT/2026',
            'software de faturação certificado pela AGT em Angola',
            'software de faturação em Angola',
            'software de faturação certificado em Angola',
        ];

        foreach (['/llms.txt', '/llms-full.txt', '/ai.txt', '/agents.md'] as $path) {
            $body = $this->get($path)->assertOk()->getContent();
            foreach ($needles as $needle) {
                $this->assertStringContainsString(
                    $needle,
                    $body,
                    "Expected [{$needle}] in {$path}"
                );
            }
        }

        $humans = $this->get('/humans.txt')->assertOk()->getContent();
        $this->assertStringContainsString('FE/323/AGT/2026', $humans);

        $this->get('/.well-known/security.txt')
            ->assertOk()
            ->assertSee('Contact:', false);

        $json = $this->get('/.well-known/ai-plugin.json')->assertOk()->json();
        $this->assertSame('SIGESC', $json['name_for_human'] ?? null);
        $this->assertStringContainsString('FE/323/AGT/2026', (string) ($json['description_for_human'] ?? ''));
    }

    public function test_home_seo_includes_organization_geo_and_cert_keywords(): void
    {
        $seo = app(\App\Services\Seo\SeoBuilder::class)->forHome();
        $types = collect($seo['json_ld'])->pluck('@type')->all();

        $this->assertContains('Organization', $types);
        $this->assertContains('SoftwareApplication', $types);
        $this->assertContains('WebSite', $types);
        $this->assertContains('WebPage', $types);
        $this->assertContains('FAQPage', $types);
        $this->assertNotEmpty($seo['geo_links']);
        $this->assertSame('FE/323/AGT/2026', $seo['agt_certification_number']);
        $this->assertStringContainsString('software de faturação certificado pela AGT em Angola', (string) $seo['keywords']);
        $this->assertStringContainsString('FE/323/AGT/2026', (string) $seo['title']);
    }

    public function test_ssr_home_and_about_expose_certification_keywords(): void
    {
        foreach (['/', '/sobre'] as $path) {
            $html = $this->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1)',
            ])->get($path)
                ->assertOk()
                ->assertSee('FE/323/AGT/2026', false)
                ->assertSee('software de faturação certificado pela AGT em Angola', false)
                ->assertSee('software de faturação em Angola', false)
                ->getContent();

            $this->assertStringContainsString('agt:certification', $html);
            $this->assertStringNotContainsString('data-page=', $html);
        }
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
