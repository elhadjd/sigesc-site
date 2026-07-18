<?php

namespace Tests\Feature;

use App\Mail\ExpertAnswerReadyMail;
use App\Models\AiContent\Article;
use App\Models\AiContent\ExpertQuestion;
use App\Services\AiContentEngine\AskExpert\ExpertResultMailer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ExpertAnswerReadyMailTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_view_shows_question_text_not_model_json(): void
    {
        $question = ExpertQuestion::create([
            'question' => 'Como criar uma loja virtual em Angola?',
            'asker_name' => 'Leonardo',
            'asker_email' => 'leo@example.com',
            'answer_html' => '<h2>Passo a passo</h2><p>Registe a empresa no GUE e organize faturação com SIGESC.</p>',
            'status' => 'answered',
            'quality_score' => 90,
        ]);

        $mailable = new ExpertAnswerReadyMail(
            expertQuestion: $question,
            answerUrl: 'https://www.sisgesc.net/pergunte-ao-especialista/'.$question->uuid,
            postUrl: 'https://www.sisgesc.net/blog/posts/loja-virtual-angola',
            postTitle: 'Guia loja virtual',
            postReady: false,
        );

        $mailable->assertSeeInHtml('Como criar uma loja virtual em Angola?');
        $mailable->assertSeeInHtml('Leonardo');
        $mailable->assertSeeInHtml('Passo a passo');
        $mailable->assertDontSeeInHtml('"asker_email"');
        $mailable->assertDontSeeInHtml('"research"');
        $mailable->assertDontSeeInHtml('localhost');
    }

    public function test_mailer_uses_public_sisgesc_urls_not_app_url_localhost(): void
    {
        Mail::fake();
        config(['sigesc.site_url' => 'https://www.sisgesc.net']);

        $article = Article::create([
            'title' => 'Guia loja virtual',
            'slug' => 'guia-loja-virtual',
            'status' => Article::STATUS_SCHEDULED,
        ]);

        $question = ExpertQuestion::create([
            'question' => 'Como criar uma loja virtual em Angola?',
            'asker_name' => 'Leonardo',
            'asker_email' => 'leo@example.com',
            'answer_html' => '<p>Resposta útil.</p>',
            'status' => 'converted',
            'article_id' => $article->id,
        ]);

        app(ExpertResultMailer::class)->notifyAnswer($question);

        Mail::assertQueued(ExpertAnswerReadyMail::class, function (ExpertAnswerReadyMail $mail) use ($question) {
            return $mail->hasTo('leo@example.com')
                && str_starts_with($mail->answerUrl, 'https://www.sisgesc.net/pergunte-ao-especialista/')
                && $mail->postUrl === 'https://www.sisgesc.net/blog/posts/guia-loja-virtual'
                && ! str_contains($mail->answerUrl, 'localhost')
                && $mail->expertQuestion->is($question);
        });
    }
}
