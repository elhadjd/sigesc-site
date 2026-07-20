<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceTemplatesLibraryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_library_page_is_public_with_seo_and_templates(): void
    {
        $this->get('/modelos-de-fatura')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('invoice-templates/index')
                ->has('seo')
                ->has('templates', 24)
                ->where('seo.title', fn ($title) => str_contains((string) $title, 'Modelos de Fatura Gratuitos Angola'))
                ->where('seo.keywords', fn ($kw) => str_contains((string) $kw, 'modelo de fatura gratuito Angola'))
            );
    }

    public function test_crawler_gets_ssr_html_with_downloads(): void
    {
        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/modelos-de-fatura')
            ->assertOk()
            ->assertSee('Modelos de fatura gratuitos Angola', false)
            ->assertSee('Factura avançada pronta para AGT', false)
            ->assertSee('FAQPage', false)
            ->assertSee('CollectionPage', false)
            ->assertSee('/modelos-de-fatura/', false)
            ->getContent();

        $this->assertStringContainsString('Conteúdo indexável gerado no servidor', $html);
        $this->assertStringNotContainsString('data-page=', $html);
    }

    public function test_template_preview_and_download_work(): void
    {
        $slug = 'factura-basica-kwanzas';

        $this->get('/modelos-de-fatura/'.$slug)
            ->assertOk()
            ->assertSee('Factura básica em Kwanzas', false)
            ->assertSee('Empresa Exemplo', false);

        $this->get('/modelos-de-fatura/'.$slug.'/download')
            ->assertOk()
            ->assertHeader('content-disposition');
    }

    public function test_sitemap_includes_invoice_templates(): void
    {
        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee('/modelos-de-fatura', false);
    }
}
