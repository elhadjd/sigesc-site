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
            'ai_content_engine.openai.api_key' => null,
        ]);

        Http::fake();

        $a = Article::create([
            'title' => 'IVA Angola guia',
            'slug' => 'iva-angola-guia',
            'focus_keyword' => 'IVA',
            'status' => Article::STATUS_DRAFT,
        ]);
        $b = Article::create([
            'title' => 'Marketing digital WhatsApp',
            'slug' => 'marketing-digital-whatsapp',
            'focus_keyword' => 'WhatsApp Business',
            'status' => Article::STATUS_DRAFT,
        ]);

        $service = app(CoverImageService::class);
        $one = $service->resolve($a);
        $two = $service->resolve($b);

        $this->assertSame('curated', $one['source']);
        $this->assertSame('curated', $two['source']);
        $this->assertNotSame($one['url'], $two['url']);
    }
}
