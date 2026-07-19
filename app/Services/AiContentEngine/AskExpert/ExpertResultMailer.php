<?php

namespace App\Services\AiContentEngine\AskExpert;

use App\Mail\ExpertAnswerReadyMail;
use App\Models\AiContent\Article;
use App\Models\AiContent\ExpertQuestion;
use App\Models\Post;
use Illuminate\Support\Facades\Mail;

class ExpertResultMailer
{
    public function notifyAnswer(ExpertQuestion $question, bool $force = false): void
    {
        $email = trim((string) $question->asker_email);
        if ($email === '') {
            return;
        }

        if (! $force && $question->email_notified_at) {
            return;
        }

        $question->loadMissing('article.post');
        [$postUrl, $postTitle, $postReady] = $this->resolvePost($question->article);

        Mail::to($email)->send(new ExpertAnswerReadyMail(
            expertQuestion: $question->fresh(),
            answerUrl: $this->publicUrl('/pergunte-ao-especialista/'.$question->uuid),
            postUrl: $postUrl,
            postTitle: $postTitle,
            postReady: $postReady,
        ));

        $question->update([
            'email_notified_at' => now(),
            'article_email_notified_at' => $postReady ? now() : $question->article_email_notified_at,
        ]);
    }

    public function notifyPublishedArticle(ExpertQuestion $question, bool $force = false): void
    {
        $email = trim((string) $question->asker_email);
        if ($email === '') {
            return;
        }

        if (! $force && $question->article_email_notified_at) {
            return;
        }

        $question->loadMissing('article.post');
        [$postUrl, $postTitle, $postReady] = $this->resolvePost($question->article);

        if (! $postReady || ! $postUrl) {
            return;
        }

        Mail::to($email)->send(new ExpertAnswerReadyMail(
            expertQuestion: $question->fresh(),
            answerUrl: $this->publicUrl('/pergunte-ao-especialista/'.$question->uuid),
            postUrl: $postUrl,
            postTitle: $postTitle,
            postReady: true,
        ));

        $question->update([
            'article_email_notified_at' => now(),
            'email_notified_at' => $question->email_notified_at ?: now(),
        ]);
    }

    /**
     * Prefer the published Post slug (public URL) over the AI article slug,
     * which can drift after SEO / writer rewrites.
     *
     * @return array{0:?string,1:?string,2:bool}
     */
    protected function resolvePost(?Article $article): array
    {
        if (! $article) {
            return [null, null, false];
        }

        $article->loadMissing('post');

        $post = $article->post;
        if (! $post && filled($article->slug)) {
            $post = Post::query()
                ->published()
                ->where('slug', $article->slug)
                ->first();
        }

        $slug = $post?->slug ?: $article->slug;
        if (blank($slug)) {
            return [null, null, false];
        }

        // Heal drift so future emails / sitemaps stay aligned with the live post.
        if ($post && filled($post->slug) && $article->slug !== $post->slug) {
            $article->forceFill(['slug' => $post->slug])->saveQuietly();
        }

        $postUrl = $this->publicUrl('/blog/posts/'.$slug);
        $title = $post?->title ?: $article->title;
        $postReady = ($post && $post->is_published)
            || $article->status === Article::STATUS_PUBLISHED
            || filled($article->post_id)
            || filled($article->published_at);

        return [$postUrl, $title, $postReady];
    }

    protected function publicUrl(string $path): string
    {
        $base = rtrim((string) config('sigesc.site_url', config('app.url')), '/');
        $host = (string) config('sigesc.site_host', 'sisgesc.net');

        // Force apex host — never email www.sisgesc.net blog links.
        if (preg_match('#^https?://(www\.)?sisgesc\.net#i', $base) === 1) {
            $base = 'https://'.$host;
        }

        return $base.'/'.ltrim($path, '/');
    }
}
