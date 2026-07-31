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
                ->where('plan.monthly_price', 30000)
                ->where('plan.currency', 'AOA')
                ->where('plan.offline_licenses_limited', true)
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
                ->assertSee('30.000 Kz', false)
                ->assertSee('licenças', false)
                ->assertSee('FAQPage', false)
                ->assertSee('LimitedAvailability', false)
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
            ->assertSee('30.000 Kz', false)
            ->assertSee('/parceria', false);

        $this->get('/ai.txt')
            ->assertOk()
            ->assertSee('30,000 Kz', false)
            ->assertSee('Offline version licenses', false);
    }

    public function test_sitemap_includes_partnership_and_geo_files(): void
    {
        $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('/parceria', $xml);
        $this->assertStringContainsString('/llms.txt', $xml);
        $this->assertStringContainsString('/ai.txt', $xml);
    }
}
