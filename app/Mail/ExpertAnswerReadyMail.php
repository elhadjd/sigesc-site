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
            ? 'Resposta SIGESC + artigo: ' . Str::limit((string) $this->postTitle, 60, '…')
            : 'A sua resposta do Especialista SIGESC está pronta';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        $questionText = (string) $this->expertQuestion->question;
        $answerHtml = $this->sanitizeAnswerHtml((string) ($this->expertQuestion->answer_html ?? ''));
        $plainAnswer = trim(preg_replace('/\s+/u', ' ', strip_tags($answerHtml)) ?? '');

        return new Content(
            view: 'emails.expertAnswerReady',
            with: [
                'askerName' => $this->expertQuestion->asker_name ?: 'Empreendedor',
                'questionText' => $questionText,
                'answerExcerpt' => Str::limit($plainAnswer, 220, '…'),
                'answerHtml' => $answerHtml,
                'answerUrl' => $this->answerUrl,
                'postUrl' => $this->postUrl,
                'postTitle' => $this->postTitle,
                'postReady' => $this->postReady,
                'siteUrl' => rtrim((string) config('sigesc.site_url'), '/'),
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

    protected function sanitizeAnswerHtml(string $html): string
    {
        $html = trim($html);
        if ($html === '') {
            return '<p>A resposta está disponível no link abaixo.</p>';
        }

        $allowed = '<p><br><br/><strong><b><em><i><u><ul><ol><li><h2><h3><h4><a><blockquote><table><thead><tbody><tr><th><td>';
        $clean = strip_tags($html, $allowed);

        // Drop javascript: / data: hrefs from any leftover anchors.
        $clean = preg_replace_callback(
            '/<a\s+([^>]*?)>/i',
            function (array $matches) {
                $attrs = $matches[1];

                if (preg_match('/\bhref\s*=\s*(["\'])(.*?)\1/i', $attrs, $href) !== 1) {
                    return '<a>';
                }

                $url = trim($href[2]);

                // CORRIGIDO: Use ~ como delimitador em vez de #
                if ($url === '' || !preg_match('~^(https?://|mailto:|/|#)~i', $url)) {
                    return '<a>';
                }

                return '<a href="' . e($url) . '" target="_blank" rel="noopener noreferrer">';
            },
            $clean
        ) ?? $clean;

        return $clean;
    }
}
