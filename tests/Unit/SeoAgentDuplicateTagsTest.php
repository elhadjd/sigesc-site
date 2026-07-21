<?php

namespace Tests\Unit;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\AiLog;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Agents\SeoAgent;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class SeoAgentDuplicateTagsTest extends TestCase
{
    use RefreshDatabase;

    public function test_seo_agent_dedupes_tags_that_share_the_same_slug(): void
    {
        config([
            'ai_content_engine.credit_saver.enabled' => false,
            'ai_content_engine.credit_saver.heuristic_seo' => false,
        ]);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldReceive('chatJson')->once()->andReturn([
            'meta_title' => 'Controlo de Fluxo de Caixa | SIGESC',
            'meta_description' => 'Ferramentas essenciais para PME.',
            'focus_keyword' => 'fluxo de caixa',
            'secondary_keywords' => ['tesouraria', 'PME Angola'],
            'tags' => [
                'fluxo de caixa',
                'Fluxo de Caixa',
                'fluxo-de-caixa',
                'Angola',
                'PME',
            ],
            'seo_score' => 88,
            'open_graph' => [],
            'twitter_card' => [],
        ]);
        $this->app->instance(LlmGateway::class, $llm);

        $article = Article::create([
            'title' => 'Controlo de Fluxo de Caixa',
            'slug' => 'controlo-de-fluxo-de-caixa',
            'status' => Article::STATUS_DRAFT,
            'excerpt' => 'Guia prático.',
            'content_html' => '<p>Conteúdo.</p>',
            'focus_keyword' => 'fluxo de caixa',
        ]);

        $job = AiJob::create([
            'type' => 'single_article',
            'status' => 'running',
            'article_id' => $article->id,
            'started_at' => now(),
        ]);

        app(SeoAgent::class)->handle($article->fresh(), $job);

        $tags = $article->fresh()->tags()->pluck('slug')->all();
        $this->assertSame(count($tags), count(array_unique($tags)));
        $this->assertContains('fluxo-de-caixa', $tags);
        $this->assertContains('angola', $tags);
        $this->assertContains('pme', $tags);
        $this->assertCount(3, $tags);
    }

    public function test_seo_agent_can_rerun_without_duplicate_tag_errors(): void
    {
        config([
            'ai_content_engine.credit_saver.enabled' => true,
            'ai_content_engine.credit_saver.heuristic_seo' => true,
        ]);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldNotReceive('chatJson');
        $this->app->instance(LlmGateway::class, $llm);

        $article = Article::create([
            'title' => 'Faturação Eletrónica Obrigatória',
            'slug' => 'faturacao-eletronica-obrigatoria',
            'status' => Article::STATUS_DRAFT,
            'excerpt' => 'Guia AGT.',
            'content_html' => '<p>Conteúdo SIGESC.</p>',
            'focus_keyword' => 'faturação eletrónica',
        ]);

        $job = AiJob::create([
            'type' => 'single_article',
            'status' => 'running',
            'article_id' => $article->id,
        ]);

        $agent = app(SeoAgent::class);
        $agent->handle($article->fresh(), $job);
        $agent->handle($article->fresh(), $job);

        $this->assertGreaterThan(0, $article->fresh()->tags()->count());
    }

    public function test_ai_logger_truncates_oversized_messages(): void
    {
        $article = Article::create([
            'title' => 'Log test',
            'slug' => 'log-test',
            'status' => Article::STATUS_DRAFT,
        ]);
        $job = AiJob::create([
            'type' => 'single_article',
            'status' => 'failed',
            'article_id' => $article->id,
        ]);

        $huge = str_repeat('E', 70000);
        app(AiLogger::class)->error($huge, $job, $article, 'ContentPipeline');

        $log = AiLog::query()->latest('id')->first();
        $this->assertNotNull($log);
        $this->assertLessThanOrEqual(AiLogger::MESSAGE_MAX + 5, mb_strlen((string) $log->message));
        $this->assertTrue((bool) data_get($log->context, 'message_truncated'));
    }
}
