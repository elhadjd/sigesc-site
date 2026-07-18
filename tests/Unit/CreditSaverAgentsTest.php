<?php

namespace Tests\Unit;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Agents\SeoAgent;
use App\Services\AiContentEngine\Agents\SocialAgent;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class CreditSaverAgentsTest extends TestCase
{
    use RefreshDatabase;

    public function test_seo_and_social_skip_llm_when_credit_saver_enabled(): void
    {
        config([
            'ai_content_engine.credit_saver.enabled' => true,
            'ai_content_engine.credit_saver.heuristic_seo' => true,
            'ai_content_engine.credit_saver.heuristic_social' => true,
        ]);

        $llm = Mockery::mock(LlmGateway::class);
        $llm->shouldNotReceive('chatJson');
        $this->app->instance(LlmGateway::class, $llm);

        $article = Article::create([
            'title' => 'Como vender na internet em Angola',
            'slug' => 'como-vender-na-internet-em-angola',
            'status' => Article::STATUS_DRAFT,
            'excerpt' => 'Guia prático para PME.',
            'content_html' => '<p>Conteúdo de teste com SIGESC.</p>',
            'focus_keyword' => 'vender na internet',
            'author_name' => 'Equipa Editorial SIGESC',
        ]);

        $job = AiJob::create([
            'type' => 'single_article',
            'status' => 'running',
            'article_id' => $article->id,
            'started_at' => now(),
        ]);

        $seo = app(SeoAgent::class)->handle($article->fresh(), $job);
        $this->assertTrue($seo['seo']['heuristic'] ?? false);
        $this->assertStringContainsString('SIGESC', (string) $article->fresh()->meta_title);

        $social = app(SocialAgent::class)->handle($article->fresh(), $job);
        $this->assertTrue($social['social_posts']['heuristic'] ?? false);
        $this->assertStringContainsString('/blog/posts/', (string) data_get($social, 'social_posts.facebook.text'));
    }
}
