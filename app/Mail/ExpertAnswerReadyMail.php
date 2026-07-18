<?php

namespace App\Mail;

use App\Models\AiContent\ExpertQuestion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;

class ExpertAnswerReadyMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public ExpertQuestion $expertQuestion,
        public string $answerUrl,
        public ?string $postUrl = null,
        public ?string $postTitle = null,
        public bool $postReady = false,
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->postReady && $this->postTitle
            ? 'Resposta SIGESC + artigo: '.Str::limit((string) $this->postTitle, 60, '…')
            : 'A sua resposta do Especialista SIGESC está pronta';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        $questionText = (string) $this->expertQuestion->question;
        $answerHtml = (string) ($this->expertQuestion->answer_html ?? '');
        $plainAnswer = trim(preg_replace('/\s+/u', ' ', strip_tags($answerHtml)) ?? '');

        return new Content(
            view: 'emails.expertAnswerReady',
            with: [
                'askerName' => $this->expertQuestion->asker_name ?: 'Empreendedor',
                'questionText' => $questionText,
                'answerExcerpt' => Str::limit($plainAnswer, 380, '…'),
                'answerUrl' => $this->answerUrl,
                'postUrl' => $this->postUrl,
                'postTitle' => $this->postTitle,
                'postReady' => $this->postReady,
                'siteUrl' => config('sigesc.site_url'),
                'solutionsUrl' => config('sigesc.getting_started_url'),
                'adminUrl' => config('sigesc.admin_url'),
                'siteHost' => config('sigesc.site_host'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
