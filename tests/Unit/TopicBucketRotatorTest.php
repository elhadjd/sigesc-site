<?php

namespace Tests\Unit;

use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Services\AiContentEngine\Support\TopicBucketRotator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class TopicBucketRotatorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::forget(TopicBucketRotator::CACHE_KEY);
    }

    public function test_config_has_balanced_topic_buckets_including_fiscal(): void
    {
        $buckets = config('ai_content_engine.topic_buckets');

        $this->assertArrayHasKey('fiscal', $buckets);
        $this->assertArrayHasKey('gestao', $buckets);
        $this->assertArrayHasKey('marketing', $buckets);
        $this->assertArrayHasKey('empreendedorismo', $buckets);
        $this->assertContains('AGT', $buckets['fiscal']['categories']);
        $this->assertSame('round_robin', config('ai_content_engine.topic_rotation.mode'));
    }

    public function test_round_robin_advances_from_marketing_to_empreendedorismo_then_fiscal(): void
    {
        config(['ai_content_engine.topic_rotation.mode' => 'round_robin']);

        $rotator = app(TopicBucketRotator::class);
        $rotator->remember('marketing');

        $next = $rotator->pick(now(), 2);
        $this->assertSame('empreendedorismo', $next['key']);

        $rotator->remember('empreendedorismo');
        $after = $rotator->pick(now(), 2);
        $this->assertSame('fiscal', $after['key']);
    }

    public function test_first_pick_prefers_fiscal_when_marketing_dominates(): void
    {
        config(['ai_content_engine.topic_rotation.mode' => 'round_robin']);

        $marketing = Category::create(['name' => 'Marketing Digital', 'slug' => 'marketing-digital', 'is_active' => true]);

        foreach (range(1, 5) as $i) {
            Article::create([
                'title' => "Loja online Angola {$i}",
                'slug' => "loja-online-{$i}",
                'status' => Article::STATUS_PUBLISHED,
                'category_id' => $marketing->id,
                'pipeline_meta' => ['topic_bucket' => 'marketing'],
                'created_at' => now()->subDays($i),
            ]);
        }

        $picked = app(TopicBucketRotator::class)->pick(now(), 2);
        $this->assertSame('fiscal', $picked['key']);
        $this->assertContains('AGT', $picked['categories']);
    }

    public function test_bucket_for_category_and_title_map_iva_to_fiscal(): void
    {
        $rotator = app(TopicBucketRotator::class);

        $this->assertSame('fiscal', $rotator->bucketForCategory('IVA'));
        $this->assertSame('fiscal', $rotator->bucketForCategory('AGT'));
        $this->assertSame('marketing', $rotator->bucketForCategory('WhatsApp Business'));
        $this->assertSame('gestao', $rotator->bucketForCategory('ERP'));
        $this->assertSame('fiscal', $rotator->bucketForTitle('IVA em Angola: regime geral e simplificado'));
        $this->assertSame('marketing', $rotator->bucketForTitle('Campanhas de anúncios no Facebook e Instagram'));
    }
}
