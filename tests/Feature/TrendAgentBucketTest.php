<?php

namespace Tests\Feature;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Services\AiContentEngine\Agents\TrendAgent;
use App\Services\AiContentEngine\Support\AngolaSearchInterest;
use App\Services\AiContentEngine\Support\LlmGateway;
use App\Services\AiContentEngine\Support\ResearchGateway;
use App\Services\AiContentEngine\Support\TopicBucketRotator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Mockery;
use Tests\TestCase;

class TrendAgentBucketTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::forget(TopicBucketRotator::CACHE_KEY);
    }

    public function test_trend_agent_forces_fiscal_bucket_topics_and_remembers_rotation(): void
    {
        $marketing = Category::create(['name' => 'E-commerce', 'slug' => 'e-commerce', 'is_active' => true]);
        Article::create([
            'title' => 'Loja online antiga',
            'slug' => 'loja-online-antiga',
            'status' => Article::STATUS_PUBLISHED,
            'category_id' => $marketing->id,
            'pipeline_meta' => ['topic_bucket' => 'marketing'],
        ]);

        $research = Mockery::mock(ResearchGateway::class);
        $research->shouldReceive('search')->andReturn([
            'provider' => 'duckduckgo',
            'results' => [
                ['title' => 'AGT IVA', 'url' => 'https://agt.minfin.gov.ao', 'snippet' => 'IVA Angola'],
            ],
        ]);
        $this->app->instance(ResearchGateway::class, $research);

        $interest = Mockery::mock(AngolaSearchInterest::class);
        $interest->shouldReceive('forBucket')->with('fiscal', Mockery::any())->andReturn([
            'trends' => ['IVA Angola AGT'],
            'suggestions' => ['IVA Angola taxa'],
            'queries' => ['IVA Angola taxa'],
            'source' => 'test',
        ]);
        $this->app->instance(AngolaSearchInterest::class, $interest);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldReceive('chatJson')
            ->once()
            ->withArgs(function (array $messages) {
                $system = $messages[0]['content'] ?? '';
                $user = $messages[1]['content'] ?? '';

                return str_contains($system, 'ROTAÇÃO EDITORIAL')
                    && str_contains($system, 'fiscal')
                    && str_contains($user, 'angola_search_interest');
            })
            ->andReturn([
                'topics' => [
                    [
                        'title' => 'IVA em Angola: regime geral e simplificado para PME',
                        'summary' => 'Guia AGT',
                        'category' => 'IVA',
                        'priority' => 1,
                        'keywords' => ['IVA', 'AGT'],
                        'reason' => 'procura fiscal',
                    ],
                    [
                        'title' => 'Como vender no Instagram em Angola',
                        'summary' => 'ads',
                        'category' => 'Marketing Digital',
                        'priority' => 2,
                        'keywords' => ['Instagram'],
                        'reason' => 'should be dropped',
                    ],
                ],
            ]);
        $this->app->instance(LlmGateway::class, $llm);

        $job = AiJob::create([
            'type' => 'daily_pipeline',
            'status' => 'running',
            'started_at' => now(),
        ]);

        $result = app(TrendAgent::class)->handle(new Article(), $job, [
            'limit' => 1,
            'bucket' => [
                'key' => 'fiscal',
                'label' => 'Fiscalidade & AGT',
                'categories' => ['AGT', 'IVA', 'Faturação Eletrónica'],
                'queries' => ['IVA Angola taxa geral regime simplificado'],
                'reason' => 'test',
            ],
        ]);

        $this->assertSame(1, $result['count']);
        $this->assertSame('fiscal', $result['bucket']);
        $article = $result['topics'][0];
        $this->assertStringContainsString('IVA', $article->title);
        $this->assertSame('fiscal', $article->pipeline_meta['topic_bucket'] ?? null);
        $this->assertSame('fiscal', Cache::get(TopicBucketRotator::CACHE_KEY));
    }
}
