<?php

namespace Tests\Feature;

use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalculatorsAndSeoHardeningTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();

        Post::create([
            'title' => 'Como calcular o IRT em Angola em 2026',
            'slug' => 'calcular-irt-angola-2026',
            'excerpt' => 'Guia prático com a tabela legal.',
            'content' => '<p>Conteúdo completo sobre IRT e retenção na fonte.</p><h2>Tabela</h2><p>Isenção até 150.000 Kz.</p>',
            'image' => '/img/sigesc capa.png',
            'category' => 'IRT',
            'author_name' => 'Equipa SIGESC',
            'author_avatar' => '/img/sigesc capa.png',
            'author_role' => 'Fiscalidade',
            'publish_date' => Carbon::today(),
            'read_time' => 5,
            'tags' => ['IRT', 'Angola', 'AGT'],
            'is_published' => true,
        ]);
    }

    public function test_calculators_page_is_public_and_has_seo(): void
    {
        $this->get('/calculadoras')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('calculators/index')
                ->has('meta.irt_brackets')
                ->has('seo')
                ->where('seo.title', fn ($title) => str_contains((string) $title, 'Calculadora IVA e IRT Angola'))
                ->where('seo.keywords', fn ($kw) => str_contains((string) $kw, 'calculadora IVA Angola'))
            );
    }

    public function test_calculators_ssr_for_crawlers(): void
    {
        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/calculadoras')
            ->assertOk()
            ->assertSee('Calculadora IVA e IRT Angola', false)
            ->assertSee('IRT', false)
            ->assertSee('FAQPage', false)
            ->assertSee('WebApplication', false)
            ->assertSee('calculadora IVA Angola', false)
            ->getContent();

        $this->assertStringContainsString('application/ld+json', $html);
    }

    public function test_ask_expert_hub_has_rich_seo_for_crawlers(): void
    {
        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/pergunte-ao-especialista')
            ->assertOk()
            ->assertSee('Pergunte ao Especialista Angola', false)
            ->assertSee('dúvidas fiscais', false)
            ->assertSee('FAQPage', false)
            ->assertSee('Service', false)
            ->getContent();

        $this->assertStringContainsString('application/ld+json', $html);
        $this->assertStringContainsString('perguntas AGT', $html);
    }

    public function test_irt_calculation_endpoint_is_deterministic(): void
    {
        $this->postJson('/calculadoras/calcular', [
            'type' => 'irt_grupo_a',
            'gross_monthly' => 180000,
        ])
            ->assertOk()
            ->assertJsonPath('result.irt', '17300.00')
            ->assertJsonPath('result.net', '162700.00');
    }

    public function test_blog_html_contains_article_body_for_humans_like_ssr(): void
    {
        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ])->get('/blog/posts/calcular-irt-angola-2026')
            ->assertOk()
            ->getContent();

        $this->assertStringContainsString('Como calcular o IRT em Angola em 2026', $html);
        $this->assertStringContainsString('Conteúdo completo sobre IRT', $html);
        $this->assertStringContainsString('application/ld+json', $html);
        $this->assertStringContainsString('seo-prerender', $html);
    }

    public function test_rss_and_sitemap_include_posts_and_calculators(): void
    {
        $this->get('/feed.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/rss+xml; charset=UTF-8')
            ->assertSee('calcular-irt-angola-2026', false)
            ->assertSee('Conteúdo completo sobre IRT', false);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertSee('calcular-irt-angola-2026', false)
            ->assertSee('/calculadoras', false)
            ->assertSee('/feed.xml', false)
            ->assertSee('/modules/dropshipping', false);
    }
}
