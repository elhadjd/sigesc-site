<?php

namespace Tests\Feature;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Services\AiContentEngine\Agents\TrendAgent;
use App\Services\AiContentEngine\Support\LlmGateway;
use App\Services\AiContentEngine\Support\ResearchGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class TrendAgentBucketTest extends TestCase
{
    use RefreshDatabase;

    public function test_trend_agent_forces_fiscal_bucket_topics(): void
    {
        // Flood marketing so rotator would pick fiscal if called — we pass bucket explicitly.
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

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldReceive('chatJson')
            ->once()
            ->withArgs(function (array $messages) {
                $system = $messages[0]['content'] ?? '';

                return str_contains($system, 'BUCKET OBRIGATÓRIO')
                    && str_contains($system, 'fiscal')
                    && str_contains($system, 'NÃO escrevas sobre loja online');
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
                        // Wrong bucket category — should be remapped
                        'title' => 'Como vender no Instagram em Angola',
                        'summary' => 'ads',
                        'category' => 'Marketing Digital',
                        'priority' => 2,
                        'keywords' => ['Instagram'],
                        'reason' => 'should be remapped',
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
        $this->assertSame('IVA', $article->category?->name);
    }
}
