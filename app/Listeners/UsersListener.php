<?php

namespace App\Listeners;

use App\Events\UserEvent;
use App\Events\Users;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UsersListener
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
    public function handle(UserEvent $event): void
    {

    }
}
