<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BarcodeQrGeneratorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_generator_page_is_public_with_seo_and_options(): void
    {
        $this->get('/gerador-de-codigo-barras')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('barcode-qr-generator/index')
                ->has('seo')
                ->has('codeKinds')
                ->has('contentTypes')
                ->has('barcodeFormats')
                ->has('errorLevels')
                ->has('disclaimer')
                ->where('seo.title', fn ($title) => str_contains((string) $title, 'Gerador de Código de Barras e QR Code Grátis'))
                ->where('seo.keywords', fn ($kw) => str_contains((string) $kw, 'gerador qr code online'))
                ->where('disclaimer', fn ($text) => str_contains((string) $text, 'NÃO são guardados'))
            );
    }

    public function test_crawler_gets_ssr_html_with_privacy_and_keywords(): void
    {
        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/gerador-de-codigo-barras')
            ->assertOk()
            ->assertSee('Gerador de código de barras e QR Code grátis', false)
            ->assertSee('não são guardados', false)
            ->assertSee('FAQPage', false)
            ->assertSee('WebApplication', false)
            ->assertSee('criar qr code com logo', false)
            ->assertSee('CODE128', false)
            ->assertSee('Wi‑Fi', false)
            ->getContent();

        $this->assertStringContainsString('Conteúdo indexável gerado no servidor', $html);
        $this->assertStringNotContainsString('data-page=', $html);
    }

    public function test_sitemap_and_robots_include_generator(): void
    {
        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee('/gerador-de-codigo-barras', false);

        $robots = file_get_contents(public_path('robots.txt'));
        $this->assertNotFalse($robots);
        $this->assertStringContainsString('Allow: /gerador-de-codigo-barras', $robots);
    }
}
