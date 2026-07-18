<?php

namespace Tests\Unit;

use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Services\AiContentEngine\Support\TopicBucketRotator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TopicBucketRotatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_config_has_balanced_topic_buckets_including_fiscal(): void
    {
        $buckets = config('ai_content_engine.topic_buckets');

        $this->assertArrayHasKey('fiscal', $buckets);
        $this->assertArrayHasKey('gestao', $buckets);
        $this->assertArrayHasKey('marketing', $buckets);
        $this->assertArrayHasKey('empreendedorismo', $buckets);
        $this->assertContains('AGT', $buckets['fiscal']['categories']);
        $this->assertTrue(
            collect($buckets['fiscal']['queries'])->contains(fn ($q) => str_contains(strtolower($q), 'agt'))
        );
    }

    public function test_prefers_underused_fiscal_when_marketing_dominates(): void
    {
        $marketing = Category::create(['name' => 'Marketing Digital', 'slug' => 'marketing-digital', 'is_active' => true]);
        $ecommerce = Category::create(['name' => 'E-commerce', 'slug' => 'e-commerce', 'is_active' => true]);

        foreach (range(1, 5) as $i) {
            Article::create([
                'title' => "Loja online Angola {$i}",
                'slug' => "loja-online-{$i}",
                'status' => Article::STATUS_PUBLISHED,
                'category_id' => $i % 2 ? $marketing->id : $ecommerce->id,
                'pipeline_meta' => ['topic_bucket' => 'marketing'],
                'created_at' => now()->subDays($i),
            ]);
        }

        $picked = app(TopicBucketRotator::class)->pick(now(), 2);

        $this->assertSame('fiscal', $picked['key']);
        $this->assertNotEmpty($picked['queries']);
        $this->assertContains('AGT', $picked['categories']);
    }

    public function test_bucket_for_category_maps_iva_to_fiscal(): void
    {
        $rotator = app(TopicBucketRotator::class);

        $this->assertSame('fiscal', $rotator->bucketForCategory('IVA'));
        $this->assertSame('fiscal', $rotator->bucketForCategory('AGT'));
        $this->assertSame('marketing', $rotator->bucketForCategory('WhatsApp Business'));
        $this->assertSame('gestao', $rotator->bucketForCategory('ERP'));
    }
}
