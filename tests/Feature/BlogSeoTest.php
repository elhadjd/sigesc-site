<?php

namespace Tests\Feature;

use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogSeoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();

        Post::create([
            'title' => 'Software de gestão comercial em Angola',
            'slug' => 'software-gestao-comercial-angola',
            'excerpt' => 'Como escolher um ERP para PME angolanas.',
            'meta_description' => 'Guia de software de gestão comercial em Angola.',
            'content' => '<p>Artigo completo sobre gestão comercial, PDV e stock.</p>',
            'image' => '/img/sigesc capa.png',
            'category' => 'Gestão Comercial',
            'author_name' => 'Equipa SIGESC',
            'author_avatar' => '/img/sigesc capa.png',
            'author_role' => 'Análise & Conteúdo',
            'publish_date' => Carbon::today(),
            'read_time' => 6,
            'tags' => ['Gestão Comercial', 'Angola', 'SIGESC'],
            'is_featured' => true,
            'is_published' => true,
            'is_ai_generated' => true,
            'generation_topic' => 'software_gestao_comercial_angola',
        ]);
    }

    public function test_sitemap_lists_published_posts(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $response->assertSee('software-gestao-comercial-angola', false);
        $response->assertSee('/blog/posts', false);
    }

    public function test_crawlers_receive_server_rendered_blog_post_html(): void
    {
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ])->get('/blog/posts/software-gestao-comercial-angola');

        $response->assertOk();
        $response->assertSee('Software de gestão comercial em Angola', false);
        $response->assertSee('Artigo completo sobre gestão comercial', false);
        $response->assertSee('application/ld+json', false);
        $response->assertSee('BlogPosting', false);
    }

    public function test_humans_receive_inertia_blog_response(): void
    {
        $response = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ])->get('/blog/posts/software-gestao-comercial-angola');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('blog/post')
            ->has('seo')
            ->has('post')
            ->where('post.slug', 'software-gestao-comercial-angola')
        );
    }

    public function test_xhr_without_json_accept_returns_inertia_blog_page(): void
    {
        // Inertia visits send X-Requested-With; they must get a page, not the filter JSON API.
        $response = $this->withHeaders([
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'text/html, application/xhtml+xml',
        ])->get('/blog/posts');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('blog/index')
            ->has('posts')
            ->has('seo')
        );
    }

    public function test_blog_filter_ajax_still_returns_json(): void
    {
        $response = $this->withHeaders([
            'X-Requested-With' => 'XMLHttpRequest',
            'Accept' => 'application/json',
        ])->get('/blog/posts');

        $response->assertOk();
        $response->assertJsonStructure(['posts', 'pagination', 'categories']);
        $this->assertFalse($response->headers->has('X-Inertia'));
    }
}
