<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CrawlerHtmlAllPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    /**
     * @return array<int, array{0: string, 1: string}>
     */
    public static function publicPagesProvider(): array
    {
        return [
            ['/', 'SIGESC'],
            ['/solutions', 'Soluções'],
            ['/modules/ponto-de-venda', 'Ponto'],
            ['/modules/dropshipping', 'Dropshipping'],
            ['/prices', 'Preços'],
            ['/contact', 'Contacto'],
            ['/blog/posts', 'Blog'],
            ['/calculadoras', 'Calculadoras'],
            ['/pergunte-ao-especialista', 'Especialista'],
            ['/downloads', 'Download'],
            ['/shop', 'Loja'],
            ['/clients/depoiments', 'Clientes'],
            ['/resources/help', 'Ajuda'],
        ];
    }

    /**
     * @dataProvider publicPagesProvider
     */
    public function test_crawler_receives_server_html_without_waiting_for_js(string $path, string $needle): void
    {
        Http::fake([
            'bo.sisgesc.net/*' => Http::response(['plans' => []], 200),
        ]);

        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get($path);

        $response->assertOk();
        $html = $response->getContent();

        $this->assertStringContainsString('<h1', $html);
        $this->assertStringContainsString($needle, $html);
        // Dedicated crawler document (not empty Inertia root waiting for JS).
        $this->assertStringContainsString('Conteúdo indexável gerado no servidor', $html);
        $this->assertStringNotContainsString('data-page=', $html);
    }

    public function test_human_home_still_gets_prerender_content_in_html(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->has('seo')
            ->has('prerender')
            ->has('modules')
        );

        $html = $response->getContent();
        $this->assertStringContainsString('SIGESC', $html);
        $this->assertStringContainsString('seo-prerender', $html);
        $this->assertStringContainsString('Ponto de Venda', $html);
        $this->assertStringContainsString('/modules/ponto-de-venda', $html);
        $this->assertStringContainsString('Dropshipping', $html);
        $this->assertStringContainsString('/modules/dropshipping', $html);
    }

    public function test_home_and_solutions_expose_module_submenu_before_js(): void
    {
        foreach (['/', '/solutions'] as $path) {
            $html = $this->get($path)->assertOk()->getContent();
            $this->assertStringContainsString('Ponto de Venda', $html);
            $this->assertStringContainsString('Gestão de Estoque', $html);
            $this->assertStringContainsString('Faturamento', $html);
            $this->assertStringContainsString('Dropshipping', $html);
            $this->assertStringContainsString('/modules/gestao-de-stock', $html);
            $this->assertStringContainsString('/modules/dropshipping', $html);
        }
    }

    public function test_dropshipping_module_page_has_rich_seo_for_crawlers(): void
    {
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/modules/dropshipping');

        $response->assertOk();
        $html = $response->getContent();

        $this->assertStringContainsString('Dropshipping', $html);
        $this->assertStringContainsString('stock próprio', $html);
        $this->assertStringContainsString('fornecedores', $html);
        $this->assertStringContainsString('/solutions', $html);
        $this->assertStringContainsString('Conteúdo indexável gerado no servidor', $html);
    }

    public function test_calculators_prerender_has_legal_detail(): void
    {
        $html = $this->get('/calculadoras')->assertOk()->getContent();
        $this->assertStringContainsString('Lei n.º 14/25', $html);
        $this->assertStringContainsString('150.000', $html);
        $this->assertStringContainsString('Taxa geral (14%)', $html);
        $this->assertStringContainsString('Contribuição especial', $html);
    }
}
