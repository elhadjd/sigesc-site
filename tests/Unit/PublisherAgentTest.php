<?php

namespace Tests\Unit;

use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Models\Post;
use App\Services\AiContentEngine\Agents\PublisherAgent;
use App\Services\AiContentEngine\Support\AiLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublisherAgentTest extends TestCase
{
    use RefreshDatabase;

    public function test_publish_now_syncs_to_blog_post(): void
    {
        config(['ai_content_engine.pipeline.sync_to_blog_posts' => true]);

        $category = Category::create([
            'name' => 'AGT',
            'slug' => 'agt',
            'is_active' => true,
        ]);

        $article = Article::create([
            'title' => 'Faturação eletrónica AGT para PME',
            'slug' => 'faturacao-eletronica-agt-pme',
            'status' => Article::STATUS_DRAFT,
            'category_id' => $category->id,
            'excerpt' => 'Como cumprir a AGT',
            'content_html' => '<p>Artigo original sobre compliance.</p>',
            'featured_image' => '/img/sigesc capa.png',
            'author_name' => 'Equipa Editorial SIGESC',
            'author_role' => 'AI Content Engine',
            'author_avatar' => '/img/sigesc capa.png',
            'read_time' => 7,
            'needs_human_review' => false,
        ]);

        $article->tags()->create(['tag' => 'AGT', 'slug' => 'agt']);
        $article->faqs()->create([
            'question' => 'O que é faturação eletrónica?',
            'answer_html' => '<p>Emissão digital de documentos fiscais.</p>',
            'position' => 0,
        ]);

        $result = app(PublisherAgent::class)->publishNow($article);

        $this->assertTrue($result['published']);
        $this->assertDatabaseHas('ai_articles', [
            'id' => $article->id,
            'status' => Article::STATUS_PUBLISHED,
        ]);
        $this->assertDatabaseHas('posts', [
            'slug' => 'faturacao-eletronica-agt-pme',
            'is_published' => 1,
            'is_ai_generated' => 1,
        ]);

        $post = Post::where('slug', 'faturacao-eletronica-agt-pme')->first();
        $this->assertStringContainsString('Perguntas frequentes', (string) $post->content);
        $this->assertSame($post->id, $article->fresh()->post_id);
    }

    public function test_handle_blocks_auto_publish_when_needs_review(): void
    {
        config([
            'ai_content_engine.pipeline.auto_publish' => true,
            'ai_content_engine.pipeline.require_fact_check' => true,
        ]);

        $article = Article::create([
            'title' => 'Tema sensível sem confirmação',
            'slug' => 'tema-sensivel',
            'status' => Article::STATUS_SOCIAL,
            'excerpt' => 'Teste',
            'content_html' => '<p>Teste</p>',
            'author_name' => 'AI',
            'author_role' => 'AI',
            'author_avatar' => '/img/sigesc capa.png',
            'needs_human_review' => true,
        ]);

        $job = \App\Models\AiContent\AiJob::create([
            'type' => 'single_article',
            'status' => 'running',
            'article_id' => $article->id,
        ]);

        $result = app(PublisherAgent::class)->handle($article, $job);

        $this->assertFalse($result['published']);
        $this->assertSame(Article::STATUS_NEEDS_REVIEW, $article->fresh()->status);
    }
}
