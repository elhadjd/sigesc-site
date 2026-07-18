<?php

namespace App\Services\AiContentEngine\AskExpert;

use App\Mail\ExpertAnswerReadyMail;
use App\Models\AiContent\Article;
use App\Models\AiContent\ExpertQuestion;
use Illuminate\Support\Facades\Mail;

class ExpertResultMailer
{
    public function notifyAnswer(ExpertQuestion $question): void
    {
        $email = trim((string) $question->asker_email);
        if ($email === '' || $question->email_notified_at) {
            return;
        }

        $question->loadMissing('article');
        [$postUrl, $postTitle, $postReady] = $this->resolvePost($question->article);

        Mail::to($email)->send(new ExpertAnswerReadyMail(
            question: $question->fresh(),
            answerUrl: route('ask-expert.show', $question->uuid),
            postUrl: $postUrl,
            postTitle: $postTitle,
            postReady: $postReady,
        ));

        $question->update([
            'email_notified_at' => now(),
            'article_email_notified_at' => $postReady ? now() : $question->article_email_notified_at,
        ]);
    }

    public function notifyPublishedArticle(ExpertQuestion $question): void
    {
        $email = trim((string) $question->asker_email);
        if ($email === '' || $question->article_email_notified_at) {
            return;
        }

        $question->loadMissing('article');
        [$postUrl, $postTitle, $postReady] = $this->resolvePost($question->article);

        if (! $postReady || ! $postUrl) {
            return;
        }

        Mail::to($email)->send(new ExpertAnswerReadyMail(
            question: $question->fresh(),
            answerUrl: route('ask-expert.show', $question->uuid),
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
     * @return array{0:?string,1:?string,2:bool}
     */
    protected function resolvePost(?Article $article): array
    {
        if (! $article || blank($article->slug)) {
            return [null, null, false];
        }

        $postUrl = url('/blog/posts/'.$article->slug);
        $postReady = $article->status === Article::STATUS_PUBLISHED
            || filled($article->post_id)
            || filled($article->published_at);

        return [$postUrl, $article->title, $postReady];
    }
}
