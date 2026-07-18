<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\Post;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PublisherAgent implements AgentInterface
{
    public function __construct(
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AIPublisherAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $forcePublish = (bool) ($context['force_publish'] ?? false);
        $autoPublish = (bool) config('ai_content_engine.pipeline.auto_publish', false);
        $requireFactCheck = (bool) config('ai_content_engine.pipeline.require_fact_check', true);

        if ($article->needs_human_review && $requireFactCheck && ! $forcePublish) {
            $article->update(['status' => Article::STATUS_NEEDS_REVIEW]);
            $this->logger->warning('Publication blocked — needs human review', $job, $article, $this->name());

            return [
                'status' => Article::STATUS_NEEDS_REVIEW,
                'published' => false,
            ];
        }

        if (! $autoPublish && ! $forcePublish) {
            $scheduledAt = now()->addHours((int) config('ai_content_engine.pipeline.schedule_delay_hours', 6));
            $article->update([
                'status' => Article::STATUS_SCHEDULED,
                'scheduled_at' => $scheduledAt,
            ]);
            $article->markRevision('scheduled', $article->content_html, [
                'scheduled_at' => $scheduledAt->toIso8601String(),
            ]);

            $this->logger->info('Article scheduled', $job, $article, $this->name(), [
                'scheduled_at' => $scheduledAt->toDateTimeString(),
            ]);

            return [
                'status' => Article::STATUS_SCHEDULED,
                'scheduled_at' => $scheduledAt->toIso8601String(),
                'published' => false,
            ];
        }

        return $this->publishNow($article, $job);
    }

    /**
     * @return array<string, mixed>
     */
    public function publishNow(Article $article, ?AiJob $job = null): array
    {
        $article->update([
            'status' => Article::STATUS_PUBLISHED,
            'published_at' => now(),
            'scheduled_at' => $article->scheduled_at ?: now(),
        ]);

        $postId = null;
        if (config('ai_content_engine.pipeline.sync_to_blog_posts')) {
            $postId = $this->syncToBlogPost($article);
            $article->update(['post_id' => $postId]);
        }

        if ($article->category) {
            $article->category->update([
                'articles_count' => $article->category->articles()->published()->count(),
            ]);
        }

        $article->markRevision('published', $article->content_html, ['post_id' => $postId]);
        $this->flushCaches($article);

        $this->logger->info('Article published', $job, $article, $this->name(), [
            'post_id' => $postId,
        ]);

        return [
            'status' => Article::STATUS_PUBLISHED,
            'published' => true,
            'post_id' => $postId,
        ];
    }

    protected function syncToBlogPost(Article $article): int
    {
        $tags = $article->tags()->pluck('tag')->all();
        if ($tags === [] && $article->focus_keyword) {
            $tags = [$article->focus_keyword];
        }

        $payload = [
            'title' => $article->title,
            'meta_title' => $article->meta_title,
            'slug' => $article->slug,
            'excerpt' => $article->excerpt ?: Str::limit($article->title, 160, ''),
            'meta_description' => $article->meta_description,
            'content' => $this->composePublicHtml($article),
            'image' => $article->featured_image ?: '/img/sigesc capa.png',
            'media' => $article->images()->get(['role', 'url', 'alt'])->map(fn ($img) => [
                'type' => 'image',
                'url' => $img->url,
                'alt' => $img->alt,
                'role' => $img->role,
            ])->all(),
            'category' => $article->category?->name ?: 'Gestão',
            'author_name' => $article->author_name ?: config('ai_content_engine.author.name'),
            'author_avatar' => $article->author_avatar ?: config('ai_content_engine.author.avatar'),
            'author_role' => $article->author_role ?: config('ai_content_engine.author.role'),
            'publish_date' => now()->toDateString(),
            'read_time' => $article->read_time ?: 5,
            'tags' => $tags,
            'source_urls' => $article->sources()->pluck('url')->all(),
            'generation_topic' => 'ai_content_engine',
            'is_ai_generated' => true,
            'is_featured' => ($article->priority ?? 5) <= 2,
            'is_published' => true,
        ];

        if ($article->post_id) {
            $post = Post::find($article->post_id);
            if ($post) {
                $post->update($payload);

                return $post->id;
            }
        }

        $existing = Post::withTrashed()->where('slug', $article->slug)->first();
        if ($existing) {
            $existing->restore();
            $existing->update($payload);

            return $existing->id;
        }

        return Post::create($payload)->id;
    }

    protected function composePublicHtml(Article $article): string
    {
        $html = (string) $article->content_html;

        if ($article->faqs()->exists()) {
            $html .= '<section class="ai-faq"><h2>Perguntas frequentes</h2>';
            foreach ($article->faqs as $faq) {
                $html .= '<h3>'.e($faq->question).'</h3>'.$faq->answer_html;
            }
            $html .= '</section>';
        }

        if ($article->glossary()->exists()) {
            $html .= '<section class="ai-glossary"><h2>Glossário</h2><dl>';
            foreach ($article->glossary as $item) {
                $html .= '<dt>'.e($item->term).'</dt><dd>'.e($item->definition).'</dd>';
            }
            $html .= '</dl></section>';
        }

        if ($article->sources()->exists()) {
            $html .= '<section class="ai-sources"><h2>Fontes consultadas</h2><ul>';
            foreach ($article->sources as $source) {
                $html .= '<li><a href="'.e($source->url).'" rel="noopener noreferrer nofollow" target="_blank">'
                    .e($source->title ?: $source->url).'</a></li>';
            }
            $html .= '</ul></section>';
        }

        return $html;
    }

    protected function flushCaches(Article $article): void
    {
        Cache::forget('sitemap_blog_posts');
        Cache::forget('featured_posts');
        Cache::forget('recent_posts');
        Cache::forget('trending_posts');
        Cache::forget('post_categories');
        Cache::forget('blog_post_'.$article->slug);
        Cache::forget('ai_content_dashboard_stats');
    }
}
