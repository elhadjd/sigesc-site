<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketplaceModulePageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_marketplace_is_listed_in_module_catalog(): void
    {
        $slugs = collect(config('sigesc_modules'))->pluck('slug');
        $this->assertTrue($slugs->contains('marketplace'));
    }

    public function test_marketplace_media_resolves_images(): void
    {
        $shots = \App\Support\MarketplaceMedia::all();

        $this->assertNotEmpty($shots);
        $this->assertSame('/img/marketplace/hero.jpg', \App\Support\MarketplaceMedia::heroSrc());
        $this->assertContains('listar', collect($shots)->pluck('key')->all());
        $this->assertContains('agendar', collect($shots)->pluck('key')->all());
    }

    public function test_seo_builder_for_marketplace_has_faq_and_software_schema(): void
    {
        $seo = app(\App\Services\Seo\SeoBuilder::class)->forMarketplace();

        $this->assertStringContainsString('Marketplace', $seo['title']);
        $this->assertStringContainsString('/modules/marketplace', $seo['canonical']);
        $this->assertStringContainsString('marketplace.sisgesc.net', $seo['description']);

        $types = collect($seo['json_ld'] ?? [])->pluck('@type')->all();
        $this->assertContains('FAQPage', $types);
        $this->assertContains('SoftwareApplication', $types);
        $this->assertContains('WebSite', $types);
    }

    public function test_marketplace_config_urls(): void
    {
        $this->assertStringContainsString('marketplace.sisgesc.net', (string) config('sigesc.marketplace_url'));
        $this->assertStringContainsString('/marketplace', (string) config('sigesc.marketplace_home_url'));
    }
}
