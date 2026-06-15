<?php

namespace App\Listeners;

use App\Events\welcomeUserEvent;
use App\Mail\welcomeUser;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class welcomeUserListener
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
    public function handle(welcomeUserEvent $event): void
    {
        $data = [
            'userName'=>$event->user->name != null ? $event->user->name : $event->user->surname,
        ];
        Mail::to($event->user->email)->send(new welcomeUser($data));
    }
}
