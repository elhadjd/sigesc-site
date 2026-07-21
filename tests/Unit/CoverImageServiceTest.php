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
        ]);
    }

    public function test_openverse_provides_topic_relevant_cover_without_openai(): void
    {
        Storage::fake('public');
        config([
            'ai_content_engine.images.provider' => 'auto',
            'ai_content_engine.images.prefer_openai' => false,
            'ai_content_engine.images.openverse_enabled' => true,
            'ai_content_engine.images.store_locally' => false,
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

        $this->assertSame('https://cdn.example.com/covers/retail-africa.jpg', $result['url']);
        $this->assertSame('openverse', $result['source']);
        $this->assertSame('Photo Author', $result['attribution']['creator'] ?? null);
    }

    public function test_skips_brand_logo_and_picks_photo(): void
    {
        Storage::fake('public');
        config([
            'ai_content_engine.images.provider' => 'openverse',
            'ai_content_engine.images.store_locally' => false,
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

        $this->assertSame('https://cdn.example.com/covers/office-photo.jpg', $result['url']);
        $this->assertSame('openverse', $result['source']);
    }

    public function test_skips_unreachable_url_and_uses_next_candidate(): void
    {
        Storage::fake('public');
        config([
            'ai_content_engine.images.provider' => 'openverse',
            'ai_content_engine.images.store_locally' => false,
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

        $this->assertSame('https://cdn.example.com/covers/alive.jpg', $result['url']);
    }

    public function test_image_agent_sets_featured_image_and_injects_cover_html(): void
    {
        Storage::fake('public');
        config([
            'ai_content_engine.images.provider' => 'openverse',
            'ai_content_engine.images.store_locally' => false,
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
        $this->assertSame('https://cdn.example.com/covers/tax-office.jpg', $fresh->featured_image);
        $this->assertSame('openverse', $output['source']);
        $this->assertStringContainsString('ai-cover', (string) $fresh->content_html);
        $this->assertStringContainsString('tax-office.jpg', (string) $fresh->content_html);
        $this->assertSame(5, $fresh->images()->count());
        $this->assertSame('openverse', $fresh->pipeline_meta['cover_image']['source'] ?? null);
    }

    public function test_curated_fallback_varies_by_topic(): void
    {
        config([
            'ai_content_engine.images.provider' => 'auto',
            'ai_content_engine.images.openverse_enabled' => false,
            'ai_content_engine.images.wikimedia_enabled' => false,
            'ai_content_engine.images.store_locally' => false,
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake([
            'images.unsplash.com/*' => Http::response('ok', 200, ['Content-Type' => 'image/jpeg']),
        ]);

        $urls = [];
        foreach (['alpha-seed-one', 'beta-seed-two', 'gamma-seed-three', 'delta-seed-four'] as $i => $seed) {
            $article = Article::create([
                'title' => 'Artigo '.$seed,
                'slug' => 'artigo-'.$seed,
                'focus_keyword' => $seed,
                'status' => Article::STATUS_DRAFT,
            ]);
            $result = app(CoverImageService::class)->resolve($article);
            $this->assertSame('curated', $result['source']);
            $urls[] = $result['url'];
        }

        $this->assertGreaterThan(1, count(array_unique($urls)), 'Curated covers should vary across topics');
    }

    public function test_local_fallback_when_all_remote_fail(): void
    {
        config([
            'ai_content_engine.images.provider' => 'auto',
            'ai_content_engine.images.openverse_enabled' => false,
            'ai_content_engine.images.wikimedia_enabled' => false,
            'ai_content_engine.images.store_locally' => false,
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
}
