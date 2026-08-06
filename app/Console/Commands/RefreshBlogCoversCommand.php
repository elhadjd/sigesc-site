<?php

namespace App\Console\Commands;

use App\Models\AiContent\Article;
use App\Models\AiContent\AiJob;
use App\Models\Post;
use App\Services\AiContentEngine\Agents\ImageAgent;
use App\Services\AiContentEngine\Support\CoverImageService;
use App\Services\AiContentEngine\Support\LocalCoverCatalog;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Replaces product/brand screenshot covers with contextual editorial or stock covers.
 */
class RefreshBlogCoversCommand extends Command
{
    protected $signature = 'ai-content:refresh-covers
        {--dry-run : List offending covers without writing}
        {--all : Refresh every article/post cover, not only product screenshots}
        {--limit=200 : Max records to process}';

    protected $description = 'Replace SIGESC module/brand screenshot blog covers with contextual images';

    public function handle(CoverImageService $covers, ImageAgent $imageAgent, LocalCoverCatalog $catalog): int
    {
        $dry = (bool) $this->option('dry-run');
        $all = (bool) $this->option('all');
        $limit = max(1, (int) $this->option('limit'));

        $this->info($dry ? 'Dry-run: scanning covers…' : 'Refreshing product/brand covers…');

        $articlesFixed = 0;
        $postsFixed = 0;

        Article::query()
            ->orderByDesc('id')
            ->limit($limit)
            ->get()
            ->each(function (Article $article) use ($covers, $imageAgent, $catalog, $dry, $all, &$articlesFixed) {
                $current = (string) ($article->featured_image ?? '');
                if (! $all && ! $this->needsRefresh($current, $catalog)) {
                    return;
                }

                $this->line("Article #{$article->id}: {$current}");

                if ($dry) {
                    $articlesFixed++;

                    return;
                }

                $job = AiJob::create([
                    'type' => 'cover-refresh',
                    'status' => 'running',
                    'article_id' => $article->id,
                ]);

                try {
                    $result = $imageAgent->handle($article->fresh(), $job);
                    $url = (string) ($result['images']['cover'] ?? $article->fresh()->featured_image);

                    if ($catalog->isForbiddenProductPath($url)) {
                        $safe = $covers->resolve($article->fresh());
                        $article->update(['featured_image' => $safe['url']]);
                        $url = $safe['url'];
                    }

                    if ($article->post_id) {
                        Post::where('id', $article->post_id)->update(['image' => $url]);
                    } else {
                        Post::where('slug', $article->slug)->update(['image' => $url]);
                    }

                    $job->update(['status' => 'completed']);
                    $articlesFixed++;
                    $this->info("  → {$url} ({$result['source']})");
                } catch (\Throwable $e) {
                    $job->update(['status' => 'failed', 'error' => $e->getMessage()]);
                    $this->error('  failed: '.$e->getMessage());
                }
            });

        Post::query()
            ->orderByDesc('id')
            ->limit($limit)
            ->get()
            ->each(function (Post $post) use ($covers, $catalog, $dry, $all, &$postsFixed) {
                $current = (string) ($post->image ?? '');
                if (! $all && ! $this->needsRefresh($current, $catalog)) {
                    return;
                }

                // Prefer article cover when already refreshed.
                $article = Article::query()->where('post_id', $post->id)->orWhere('slug', $post->slug)->first();
                if ($article && filled($article->featured_image) && ! $catalog->isForbiddenProductPath((string) $article->featured_image)) {
                    if (! $dry && $post->image !== $article->featured_image) {
                        $post->update(['image' => $article->featured_image]);
                        $postsFixed++;
                        $this->info("Post #{$post->id} synced from article → {$article->featured_image}");
                    }

                    return;
                }

                $this->line("Post #{$post->id}: {$current}");

                if ($dry) {
                    $postsFixed++;

                    return;
                }

                $proxy = new Article([
                    'title' => $post->title,
                    'slug' => $post->slug ?: Str::slug((string) $post->title),
                    'focus_keyword' => is_array($post->tags) ? (string) ($post->tags[0] ?? $post->title) : (string) $post->title,
                    'content_html' => $post->content ?? '',
                ]);

                $resolved = $covers->resolve($proxy);
                $post->update(['image' => $resolved['url']]);
                $postsFixed++;
                $this->info("  → {$resolved['url']} ({$resolved['source']})");
            });

        $this->info("Done. Articles: {$articlesFixed}, Posts: {$postsFixed}".($dry ? ' (dry-run)' : ''));

        return self::SUCCESS;
    }

    protected function needsRefresh(string $url, LocalCoverCatalog $catalog): bool
    {
        if ($url === '') {
            return true;
        }

        if ($catalog->isForbiddenProductPath($url)) {
            return true;
        }

        // Any project-local cover must be replaced with an internet photo.
        if (Str::startsWith($url, '/img/') || Str::startsWith($url, '/storage/')) {
            return true;
        }

        return false;
    }
}
