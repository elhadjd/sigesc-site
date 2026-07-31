<?php

namespace Tests\Unit;

use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Services\AiContentEngine\Agents\ImageAgent;
use App\Services\AiContentEngine\Support\CoverImageService;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class CoverImageServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'ai_content_engine.images.verify_url' => true,
            'ai_content_engine.images.reject_brand_terms' => true,
            'ai_content_engine.images.local_fallback' => '/img/placeholder-blog.svg',
            'ai_content_engine.images.require_local_url' => true,
            'ai_content_engine.images.prefer_local_catalog' => false,
            'ai_content_engine.images.generate_local_cover' => true,
        ]);
    }

    public function test_openverse_stores_cover_locally_when_required(): void
    {
        Storage::fake('public');
        config([
            'ai_content_engine.images.provider' => 'auto',
            'ai_content_engine.images.prefer_openai' => false,
            'ai_content_engine.images.openverse_enabled' => true,
            'ai_content_engine.images.store_locally' => true,
            'ai_content_engine.images.require_local_url' => true,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'api.openverse.org/*' => Http::response([
                'results' => [
                    [
                        'url' => 'https://cdn.example.com/covers/retail-africa.jpg',
                        'width' => 1600,
                        'height' => 900,
                        'filetype' => 'jpg',
                        'title' => 'Retail shop',
                        'creator' => 'Photo Author',
                        'license' => 'by',
                        'license_url' => 'https://creativecommons.org/licenses/by/2.0/',
                        'provider' => 'flickr',
                        'foreign_landing_url' => 'https://flickr.com/x',
                    ],
                ],
            ], 200),
            'cdn.example.com/*' => Http::response('fake-bytes', 200, ['Content-Type' => 'image/jpeg']),
        ]);

        $category = Category::create(['name' => 'PDV', 'slug' => 'pdv', 'is_active' => true]);
        $article = Article::create([
            'title' => 'Como escolher PDV para loja em Luanda',
            'slug' => 'como-escolher-pdv-loja-luanda',
            'focus_keyword' => 'PDV Angola',
            'category_id' => $category->id,
            'status' => Article::STATUS_SEO,
            'content_html' => '<p>Guia prático para PME.</p>',
        ]);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldReceive('generateImage')->never();
        $this->app->instance(LlmGateway::class, $llm);

        $result = app(CoverImageService::class)->resolve($article);

        $this->assertSame('openverse', $result['source']);
        $this->assertTrue($result['stored']);
        $this->assertStringContainsString('/storage/', $result['url']);
        $this->assertSame('Photo Author', $result['attribution']['creator'] ?? null);
    }

    public function test_skips_brand_logo_and_picks_photo(): void
    {
        Storage::fake('public');
        config([
            'ai_content_engine.images.provider' => 'openverse',
            'ai_content_engine.images.store_locally' => true,
            'ai_content_engine.images.require_local_url' => true,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'api.openverse.org/*' => Http::response([
                'results' => [
                    [
                        'url' => 'https://cdn.example.com/covers/brand-logo.png',
                        'width' => 1600,
                        'height' => 900,
                        'filetype' => 'png',
                        'title' => 'WhatsApp Company Logo',
                        'tags' => [['name' => 'logo'], ['name' => 'brand']],
                        'creator' => 'Brand Desk',
                        'license' => 'by',
                        'provider' => 'flickr',
                    ],
                    [
                        'url' => 'https://cdn.example.com/covers/office-photo.jpg',
                        'width' => 1800,
                        'height' => 1000,
                        'filetype' => 'jpg',
                        'title' => 'Business office meeting',
                        'creator' => 'Stock Photographer',
                        'license' => 'by',
                        'provider' => 'flickr',
                    ],
                ],
            ], 200),
            'cdn.example.com/covers/office-photo.jpg' => Http::response('ok', 200, ['Content-Type' => 'image/jpeg']),
            'cdn.example.com/*' => Http::response('ok', 200, ['Content-Type' => 'image/jpeg']),
        ]);

        $article = Article::create([
            'title' => 'Marketing digital para PME',
            'slug' => 'marketing-digital-pme',
            'focus_keyword' => 'marketing digital',
            'status' => Article::STATUS_SEO,
        ]);

        $result = app(CoverImageService::class)->resolve($article);

        $this->assertSame('openverse', $result['source']);
        $this->assertTrue($result['stored']);
        $this->assertStringContainsString('/storage/', $result['url']);
    }

    public function test_skips_unreachable_url_and_uses_next_candidate(): void
    {
        Storage::fake('public');
        config([
            'ai_content_engine.images.provider' => 'openverse',
            'ai_content_engine.images.store_locally' => true,
            'ai_content_engine.images.require_local_url' => true,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'api.openverse.org/*' => Http::response([
                'results' => [
                    [
                        'url' => 'https://cdn.example.com/covers/dead.jpg',
                        'width' => 1600,
                        'height' => 900,
                        'filetype' => 'jpg',
                        'title' => 'Broken retail photo',
                        'creator' => 'A',
                        'license' => 'by',
                        'provider' => 'flickr',
                    ],
                    [
                        'url' => 'https://cdn.example.com/covers/alive.jpg',
                        'width' => 1600,
                        'height' => 900,
                        'filetype' => 'jpg',
                        'title' => 'Alive retail photo',
                        'creator' => 'B',
                        'license' => 'by',
                        'provider' => 'flickr',
                    ],
                ],
            ], 200),
            'cdn.example.com/covers/dead.jpg' => Http::response('gone', 404),
            'cdn.example.com/covers/alive.jpg' => Http::response('ok', 200, ['Content-Type' => 'image/jpeg']),
        ]);

        $article = Article::create([
            'title' => 'PDV em Angola',
            'slug' => 'pdv-em-angola',
            'focus_keyword' => 'PDV',
            'status' => Article::STATUS_SEO,
        ]);

        $result = app(CoverImageService::class)->resolve($article);

        $this->assertSame('openverse', $result['source']);
        $this->assertTrue($result['stored']);
        $this->assertStringContainsString('/storage/', $result['url']);
    }

    public function test_image_agent_sets_featured_image_and_injects_cover_html(): void
    {
        Storage::fake('public');
        config([
            'ai_content_engine.images.provider' => 'openverse',
            'ai_content_engine.images.store_locally' => true,
            'ai_content_engine.images.require_local_url' => true,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'api.openverse.org/*' => Http::response([
                'results' => [
                    [
                        'url' => 'https://cdn.example.com/covers/tax-office.jpg',
                        'width' => 1800,
                        'height' => 1000,
                        'filetype' => 'jpg',
                        'title' => 'Tax office',
                        'creator' => 'Fiscal Photo',
                        'license' => 'by',
                        'provider' => 'flickr',
                    ],
                ],
            ], 200),
            'cdn.example.com/*' => Http::response('ok', 200, ['Content-Type' => 'image/jpeg']),
        ]);

        $article = Article::create([
            'title' => 'Como calcular o IVA em Angola',
            'slug' => 'como-calcular-iva-angola',
            'focus_keyword' => 'IVA Angola',
            'status' => Article::STATUS_SEO,
            'content_html' => '<p>Passo a passo do IVA.</p>',
        ]);

        $job = \App\Models\AiContent\AiJob::create([
            'type' => 'pipeline',
            'status' => 'running',
            'article_id' => $article->id,
        ]);

        $output = app(ImageAgent::class)->handle($article->fresh(), $job);

        $fresh = $article->fresh();
        $this->assertTrue(str_starts_with((string) $fresh->featured_image, '/storage/') || str_starts_with((string) $fresh->featured_image, '/img/'));
        $this->assertSame('openverse', $output['source']);
        $this->assertStringContainsString('ai-cover', (string) $fresh->content_html);
        $this->assertSame(5, $fresh->images()->count());
        $this->assertSame('openverse', $fresh->pipeline_meta['cover_image']['source'] ?? null);
    }

    public function test_local_catalog_matches_billing_topic(): void
    {
        config([
            'ai_content_engine.images.prefer_local_catalog' => true,
            'ai_content_engine.images.provider' => 'local',
        ]);

        $article = Article::create([
            'title' => 'Faturação eletrónica AGT Angola',
            'slug' => 'faturacao-eletronica-agt',
            'focus_keyword' => 'faturação eletrónica AGT',
            'status' => Article::STATUS_DRAFT,
        ]);

        $result = app(CoverImageService::class)->resolve($article);

        $this->assertSame('local-catalog', $result['source']);
        $this->assertStringStartsWith('/img/', $result['url']);
        $this->assertFileExists(public_path(ltrim($result['url'], '/')));
    }

    public function test_generated_local_cover_when_remotes_fail(): void
    {
        config([
            'ai_content_engine.images.provider' => 'auto',
            'ai_content_engine.images.prefer_local_catalog' => false,
            'ai_content_engine.images.openverse_enabled' => false,
            'ai_content_engine.images.wikimedia_enabled' => false,
            'ai_content_engine.images.store_locally' => false,
            'ai_content_engine.images.require_local_url' => true,
            'ai_content_engine.images.generate_local_cover' => true,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'images.unsplash.com/*' => Http::response('gone', 404),
        ]);

        $article = Article::create([
            'title' => 'Sem imagens remotas disponíveis',
            'slug' => 'sem-imagens-remotas-disponiveis',
            'focus_keyword' => 'teste capa',
            'status' => Article::STATUS_DRAFT,
        ]);

        $result = app(CoverImageService::class)->resolve($article);

        $this->assertSame('generated-local', $result['source']);
        $this->assertStringStartsWith('/img/blog-covers/', $result['url']);
        $this->assertFileExists(public_path(ltrim($result['url'], '/')));
        $this->assertStringContainsString('SIGESC', (string) file_get_contents(public_path(ltrim($result['url'], '/'))));
    }

    public function test_local_fallback_when_generation_disabled(): void
    {
        config([
            'ai_content_engine.images.provider' => 'auto',
            'ai_content_engine.images.prefer_local_catalog' => false,
            'ai_content_engine.images.openverse_enabled' => false,
            'ai_content_engine.images.wikimedia_enabled' => false,
            'ai_content_engine.images.store_locally' => false,
            'ai_content_engine.images.require_local_url' => true,
            'ai_content_engine.images.generate_local_cover' => false,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'images.unsplash.com/*' => Http::response('gone', 404),
        ]);

        $article = Article::create([
            'title' => 'Sem imagens remotas',
            'slug' => 'sem-imagens-remotas',
            'focus_keyword' => 'teste',
            'status' => Article::STATUS_DRAFT,
        ]);

        $result = app(CoverImageService::class)->resolve($article);

        $this->assertSame('local', $result['source']);
        $this->assertSame('/img/placeholder-blog.svg', $result['url']);
    }

    public function test_looks_like_brand_or_logo_detection(): void
    {
        $service = app(CoverImageService::class);

        $this->assertTrue($service->looksLikeBrandOrLogo('coca-cola company logo png'));
        $this->assertTrue($service->looksLikeBrandOrLogo('file:nike wordmark.svg'));
        $this->assertFalse($service->looksLikeBrandOrLogo('african retail shop photography'));
    }

    public function test_expanded_topic_buckets_and_weekly_topics(): void
    {
        $buckets = config('ai_content_engine.topic_buckets');
        $this->assertGreaterThanOrEqual(4, count($buckets));
        $this->assertGreaterThanOrEqual(15, count($buckets['fiscal']['queries'] ?? []));
        $this->assertGreaterThanOrEqual(15, count($buckets['gestao']['queries'] ?? []));
        $this->assertGreaterThanOrEqual(15, count($buckets['marketing']['queries'] ?? []));
        $this->assertGreaterThanOrEqual(15, count($buckets['empreendedorismo']['queries'] ?? []));

        $seed = config('ai_content_engine.seed_queries');
        $this->assertGreaterThanOrEqual(60, count($seed));

        $weekly = config('ai_blog.topics');
        $this->assertGreaterThanOrEqual(10, count($weekly));
    }
}
