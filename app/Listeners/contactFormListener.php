<?php

namespace App\Listeners;

use App\Events\contactFormEvent;
use App\Mail\ContactFormMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class contactFormListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(contactFormEvent $event): void
    {
        Mail::to('sigesctec@gmail.com')->send(new ContactFormMail($event->form));
    }
}
