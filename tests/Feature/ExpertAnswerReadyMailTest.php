<?php

namespace Tests\Feature;

use App\Mail\ExpertAnswerReadyMail;
use App\Models\AiContent\Article;
use App\Models\AiContent\ExpertQuestion;
use App\Models\Post;
use App\Services\AiContentEngine\AskExpert\ExpertResultMailer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ExpertAnswerReadyMailTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_view_shows_full_answer_not_model_json(): void
    {
        $question = ExpertQuestion::create([
            'question' => 'Como criar uma loja virtual em Angola?',
            'asker_name' => 'Leonardo',
            'asker_email' => 'leo@example.com',
            'answer_html' => '<h2>Passo a passo</h2><p>Registe a empresa no GUE e organize faturação com SIGESC.</p><p>Use PDV e stock no mesmo sistema.</p>',
            'status' => 'answered',
            'quality_score' => 90,
        ]);

        $mailable = new ExpertAnswerReadyMail(
            expertQuestion: $question,
            answerUrl: 'https://sisgesc.net/pergunte-ao-especialista/'.$question->uuid,
            postUrl: 'https://sisgesc.net/blog/posts/loja-virtual-angola',
            postTitle: 'Guia loja virtual',
            postReady: false,
        );

        $mailable->assertSeeInHtml('Como criar uma loja virtual em Angola?');
        $mailable->assertSeeInHtml('Leonardo');
        $mailable->assertSeeInHtml('Passo a passo');
        $mailable->assertSeeInHtml('Use PDV e stock no mesmo sistema.');
        $mailable->assertSeeInHtml('Resposta completa');
        $mailable->assertDontSeeInHtml('"asker_email"');
        $mailable->assertDontSeeInHtml('"research"');
        $mailable->assertDontSeeInHtml('localhost');
    }

    public function test_mailer_uses_published_post_slug_and_apex_host(): void
    {
        Mail::fake();
        config(['sigesc.site_url' => 'https://www.sisgesc.net']);

        $post = Post::create([
            'title' => 'Como calcular o IVA em Angola — guia passo a passo',
            'slug' => 'como-calcular-iva-angola-guia-passo-a-passo',
            'excerpt' => 'Guia prático',
            'content' => '<p>IVA 14%</p>',
            'image' => '/img/sigesc capa.png',
            'category' => 'IVA',
            'author_name' => 'Equipa SIGESC',
            'author_avatar' => '/img/sigesc capa.png',
            'author_role' => 'Fiscalidade',
            'publish_date' => now()->toDateString(),
            'read_time' => 5,
            'tags' => ['IVA'],
            'is_published' => true,
        ]);

        $article = Article::create([
            'title' => 'Como calcular o IVA em Angola — guia passo a passo',
            'slug' => 'como-calcular-o-iva-em-angola-guia-passo-a-passo',
            'status' => Article::STATUS_PUBLISHED,
            'post_id' => $post->id,
            'published_at' => now(),
        ]);

        $question = ExpertQuestion::create([
            'question' => 'Como calcular iva em Angola ?',
            'asker_name' => 'Leonardo',
            'asker_email' => 'leo@example.com',
            'answer_html' => '<p>Taxa geral 14%. Base tributável. Factura com IVA.</p>',
            'status' => 'converted',
            'article_id' => $article->id,
        ]);

        app(ExpertResultMailer::class)->notifyAnswer($question);

        Mail::assertQueued(ExpertAnswerReadyMail::class, function (ExpertAnswerReadyMail $mail) use ($question) {
            return $mail->hasTo('leo@example.com')
                && $mail->answerUrl === 'https://sisgesc.net/pergunte-ao-especialista/'.$question->uuid
                && $mail->postUrl === 'https://sisgesc.net/blog/posts/como-calcular-iva-angola-guia-passo-a-passo'
                && ! str_contains((string) $mail->postUrl, 'www.')
                && ! str_contains((string) $mail->postUrl, 'como-calcular-o-iva-em-angola')
                && $mail->expertQuestion->is($question);
        });

        $this->assertSame(
            'como-calcular-iva-angola-guia-passo-a-passo',
            $article->fresh()->slug
        );
    }

    public function test_force_resend_ignores_previous_notification_flag(): void
    {
        Mail::fake();
        config(['sigesc.site_url' => 'https://sisgesc.net']);

        $question = ExpertQuestion::create([
            'question' => 'Como calcular iva em Angola ?',
            'asker_name' => 'Leonardo',
            'asker_email' => 'leo@example.com',
            'answer_html' => '<p>Resposta completa com vários detalhes fiscais.</p>',
            'status' => 'answered',
            'email_notified_at' => now()->subHour(),
        ]);

        app(ExpertResultMailer::class)->notifyAnswer($question, force: true);

        Mail::assertQueued(ExpertAnswerReadyMail::class, 1);
    }
}
