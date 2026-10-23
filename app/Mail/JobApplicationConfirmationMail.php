<?php

namespace App\Mail;

use App\Models\Careers\JobApplication;
use App\Models\Careers\JobListing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobApplicationConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public JobApplication $application,
        public JobListing $listing
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Candidatura recebida — '.$this->listing->title.' | SIGESC',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.jobApplicationConfirmation',
            with: [
                'candidateName' => $this->application->name,
                'jobTitle' => $this->listing->title,
                'jobLocation' => $this->listing->location,
                'jobUrl' => route('careers.show', $this->listing->slug, absolute: true),
                'careersUrl' => route('careers.index', absolute: true),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
