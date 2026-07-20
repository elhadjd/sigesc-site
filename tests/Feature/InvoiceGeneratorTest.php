<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceGeneratorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_generator_page_is_public_with_seo_and_tax_options(): void
    {
        $this->get('/gerador-de-fatura')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('invoice-generator/index')
                ->has('seo')
                ->has('taxOptions')
                ->has('documentTypes')
                ->has('disclaimer')
                ->where('seo.title', fn ($title) => str_contains((string) $title, 'Criar Fatura Online Grátis Angola'))
                ->where('seo.keywords', fn ($kw) => str_contains((string) $kw, 'criar fatura online grátis'))
                ->where('disclaimer', fn ($text) => str_contains((string) $text, 'NÃO são guardadas'))
            );
    }

    public function test_crawler_gets_ssr_html_with_privacy_and_keywords(): void
    {
        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/gerador-de-fatura')
            ->assertOk()
            ->assertSee('Criar fatura online grátis Angola', false)
            ->assertSee('não são guardadas', false)
            ->assertSee('FAQPage', false)
            ->assertSee('WebApplication', false)
            ->assertSee('criar fatura online grátis', false)
            ->assertSee('Factura-Recibo', false)
            ->assertSee('Taxa geral (14%)', false)
            ->getContent();

        $this->assertStringContainsString('Conteúdo indexável gerado no servidor', $html);
        $this->assertStringNotContainsString('data-page=', $html);
    }

    public function test_sitemap_and_robots_include_generator(): void
    {
        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee('/gerador-de-fatura', false);

        $robots = file_get_contents(public_path('robots.txt'));
        $this->assertNotFalse($robots);
        $this->assertStringContainsString('Allow: /gerador-de-fatura', $robots);
    }
}
