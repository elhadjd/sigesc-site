<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductsPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_hospitalar_media_resolves_images(): void
    {
        $shots = \App\Support\HospitalarMedia::all();

        $this->assertNotEmpty($shots);
        $this->assertSame('/img/produtos/hospitalar/hero.jpg', \App\Support\HospitalarMedia::heroSrc());
        $this->assertContains('recepcao', collect($shots)->pluck('key')->all());
        $this->assertContains('faturacao', collect($shots)->pluck('key')->all());
    }

    public function test_hub_media_resolves_images(): void
    {
        $shots = \App\Support\HubMedia::all();

        $this->assertNotEmpty($shots);
        $this->assertSame('/img/produtos/hub/hero.jpg', \App\Support\HubMedia::heroSrc());
        $this->assertContains('dashboard', collect($shots)->pluck('key')->all());
        $this->assertContains('contabilidade', collect($shots)->pluck('key')->all());
    }

    public function test_seo_builder_for_products_pages(): void
    {
        $products = app(\App\Services\Seo\SeoBuilder::class)->forProducts();
        $this->assertStringContainsString('Produtos', $products['title']);
        $this->assertStringContainsString('/produtos', $products['canonical']);

        $hospitalar = app(\App\Services\Seo\SeoBuilder::class)->forHospitalar();
        $this->assertStringContainsString('Hospitalar', $hospitalar['title']);
        $this->assertStringContainsString('/produtos/hospitalar', $hospitalar['canonical']);
        $this->assertStringContainsString('clinic.sisgesc.net', $hospitalar['description']);
        $types = collect($hospitalar['json_ld'] ?? [])->pluck('@type')->all();
        $this->assertContains('FAQPage', $types);
        $this->assertContains('SoftwareApplication', $types);

        $hub = app(\App\Services\Seo\SeoBuilder::class)->forHub();
        $this->assertStringContainsString('HUB', $hub['title']);
        $this->assertStringContainsString('/produtos/hub', $hub['canonical']);
        $this->assertStringContainsString('hub.sisgesc.net', $hub['description']);
        $hubTypes = collect($hub['json_ld'] ?? [])->pluck('@type')->all();
        $this->assertContains('FAQPage', $hubTypes);
        $this->assertContains('SoftwareApplication', $hubTypes);
    }

    public function test_product_config_urls(): void
    {
        $this->assertStringContainsString('clinic.sisgesc.net', (string) config('sigesc.clinic_url'));
        $this->assertStringContainsString('hub.sisgesc.net', (string) config('sigesc.hub_url'));
    }

    public function test_crawler_hospitalar_page_has_rich_seo(): void
    {
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/produtos/hospitalar');

        $response->assertOk();
        $html = $response->getContent();

        $this->assertStringContainsString('Hospitalar', $html);
        $this->assertStringContainsString('clinic.sisgesc.net', $html);
        $this->assertStringContainsString('/img/produtos/hospitalar/hero.jpg', $html);
        $this->assertStringContainsString('SoftwareApplication', $html);
        $this->assertStringContainsString('Conteúdo indexável gerado no servidor', $html);
        $this->assertStringNotContainsString('data-page=', $html);
    }

    public function test_crawler_hub_page_has_rich_seo(): void
    {
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/produtos/hub');

        $response->assertOk();
        $html = $response->getContent();

        $this->assertStringContainsString('HUB', $html);
        $this->assertStringContainsString('hub.sisgesc.net', $html);
        $this->assertStringContainsString('contabilidade', mb_strtolower($html));
        $this->assertStringContainsString('/img/produtos/hub/hero.jpg', $html);
        $this->assertStringContainsString('SoftwareApplication', $html);
        $this->assertStringNotContainsString('data-page=', $html);
    }

    public function test_human_products_pages_use_inertia(): void
    {
        $this->get('/produtos')->assertOk()->assertInertia(fn ($page) => $page
            ->component('produtos/index')
            ->has('seo')
            ->has('prerender')
            ->has('products')
        );

        $this->get('/produtos/hospitalar')->assertOk()->assertInertia(fn ($page) => $page
            ->component('produtos/hospitalar')
            ->has('product')
            ->where('product.slug', 'hospitalar')
            ->has('product.screenshots')
        );

        $this->get('/produtos/hub')->assertOk()->assertInertia(fn ($page) => $page
            ->component('produtos/hub')
            ->has('product')
            ->where('product.slug', 'hub')
            ->has('product.screenshots')
        );
    }
}
