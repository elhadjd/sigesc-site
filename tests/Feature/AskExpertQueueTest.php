<?php

namespace Tests\Feature;

use App\Jobs\AiContent\AnswerExpertQuestion;
use App\Mail\ExpertAnswerReadyMail;
use App\Models\AiContent\ExpertQuestion;
use App\Services\AiContentEngine\AskExpert\ExpertResultMailer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class AskExpertQueueTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_dispatches_job_and_redirects_to_show(): void
    {
        Queue::fake();

        $response = $this->post('/pergunte-ao-especialista', [
            'question' => 'Como fazer anúncios de sucesso no Instagram em Angola?',
            'asker_name' => 'Ana',
            'asker_email' => 'ana@example.com',
        ]);

        $question = ExpertQuestion::first();
        $this->assertNotNull($question);
        $this->assertSame('queued', $question->status);
        $this->assertSame('ana@example.com', $question->asker_email);

        $response->assertRedirect(route('ask-expert.show', $question->uuid));
        Queue::assertPushed(AnswerExpertQuestion::class, function (AnswerExpertQuestion $job) use ($question) {
            return $job->expertQuestionId === $question->id;
        });
    }

    public function test_result_mailer_sends_modern_email_with_post_link(): void
    {
        Mail::fake();

        $question = ExpertQuestion::create([
            'question' => 'Qual o sistema de gestão mais usado em Angola?',
            'asker_name' => 'Carlos',
            'asker_email' => 'carlos@example.com',
            'answer_html' => '<p>Depende do setor, mas ferramentas de faturação e stock são comuns.</p>',
            'status' => 'answered',
        ]);

        app(ExpertResultMailer::class)->notifyAnswer($question);

        Mail::assertQueued(ExpertAnswerReadyMail::class, function (ExpertAnswerReadyMail $mail) use ($question) {
            return $mail->hasTo('carlos@example.com')
                && $mail->answerUrl === route('ask-expert.show', $question->uuid);
        });

        $this->assertNotNull($question->fresh()->email_notified_at);
    }
}
