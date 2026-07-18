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
        );

        $this->assertStringContainsString('SIGESC', $response->getContent());
        $this->assertStringContainsString('seo-prerender', $response->getContent());
    }
}
