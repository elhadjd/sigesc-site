<?php

namespace App\Mail;

use App\Models\AiContent\ExpertQuestion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExpertAnswerReadyMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public ExpertQuestion $question,
        public string $answerUrl,
        public ?string $postUrl = null,
        public ?string $postTitle = null,
        public bool $postReady = false,
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->postReady && $this->postTitle
            ? 'A sua resposta SIGESC + artigo: '.$this->postTitle
            : 'A sua resposta do Especialista SIGESC está pronta';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.expertAnswerReady',
            with: [
                'askerName' => $this->question->asker_name ?: 'Empreendedor',
                'question' => $this->question->question,
                'answerHtml' => $this->question->answer_html,
                'answerUrl' => $this->answerUrl,
                'postUrl' => $this->postUrl,
                'postTitle' => $this->postTitle,
                'postReady' => $this->postReady,
                'siteUrl' => url('/'),
                'solutionsUrl' => url('/solucoes'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
