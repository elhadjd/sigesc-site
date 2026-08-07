<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PartnershipPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_partnership_page_is_public_with_plan_and_seo(): void
    {
        $this->get('/parceria')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('partnership/index')
                ->has('seo')
                ->has('plan')
                ->where('plan.monthly_price', 40000)
                ->where('plan.currency', 'AOA')
                ->where('plan.offline_licenses_limited', false)
                ->where('plan.freelancer.commission_percent', 30)
                ->where('seo.title', fn ($title) => str_contains((string) $title, 'Parceria SIGESC'))
                ->where('seo.keywords', fn ($kw) => str_contains((string) $kw, 'parceria SIGESC'))
            );
    }

    public function test_crawler_and_ai_bots_get_ssr_with_offer_schema(): void
    {
        foreach (['Googlebot/2.1', 'GPTBot', 'ClaudeBot', 'PerplexityBot'] as $bot) {
            $html = $this->withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; '.$bot.')',
            ])->get('/parceria')
                ->assertOk()
                ->assertSee('40.000 Kz', false)
                ->assertSee('Freelancer', false)
                ->assertSee('30%', false)
                ->assertSee('ilimitadas', false)
                ->assertSee('FAQPage', false)
                ->assertSee('InStock', false)
                ->assertSee('Parceria SIGESC', false)
                ->getContent();

            $this->assertStringContainsString('Conteúdo indexável gerado no servidor', $html);
            $this->assertStringNotContainsString('data-page=', $html);
        }
    }

    public function test_llms_and_ai_txt_are_public(): void
    {
        $this->get('/llms.txt')
            ->assertOk()
            ->assertSee('40.000 Kz', false)
            ->assertSee('/parceria', false)
            ->assertSee('Freelancer', false);

        $this->get('/ai.txt')
            ->assertOk()
            ->assertSee('40.000 Kz', false)
            ->assertSee('unlimited', false);
    }

    public function test_sitemap_includes_partnership_and_geo_files(): void
    {
        $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('/parceria', $xml);
        $this->assertStringContainsString('/llms.txt', $xml);
        $this->assertStringContainsString('/ai.txt', $xml);
    }
}
