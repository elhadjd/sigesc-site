<?php

namespace App\Listeners;

use App\Events\ChatEvent;
use App\Mail\NewChatMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class ChatListener
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
    public function handle(ChatEvent $event): void
    {
        // Mail::to('sigesctec@gmail.com')->send(new NewChatMail($event->chat->session));
    }
}
