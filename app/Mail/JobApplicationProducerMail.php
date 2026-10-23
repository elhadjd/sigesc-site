<?php

namespace App\Mail;

use App\Models\Careers\JobApplication;
use App\Models\Careers\JobListing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobApplicationProducerMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public JobApplication $application,
        public JobListing $listing
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nova candidatura — '.$this->listing->title.' | '.$this->application->name,
            replyTo: [$this->application->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.jobApplicationProducer',
            with: [
                'candidateName' => $this->application->name,
                'candidateEmail' => $this->application->email,
                'candidatePhone' => $this->application->phone,
                'linkedinUrl' => $this->application->linkedin_url,
                'portfolioUrl' => $this->application->portfolio_url,
                'coverLetter' => $this->application->cover_letter,
                'jobTitle' => $this->listing->title,
                'jobLocation' => $this->listing->location,
                'jobUrl' => route('careers.show', $this->listing->slug, absolute: true),
                'adminUrl' => route('admin.careers.index', absolute: true),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
