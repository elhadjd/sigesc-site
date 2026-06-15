<?php

namespace App\Providers;

use App\Events\ChatEvent;
use App\Events\contactFormEvent;
use App\Events\emailVerifiedEvent;
use App\Events\UserEvent;
use App\Events\welcomeUserEvent;
use App\Listeners\ChatListener;
use App\Listeners\contactFormListener;
use App\Listeners\UsersListener;
use App\Listeners\welcomeUserListener;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        UserEvent::class => [
            UsersListener::class,
        ],
        welcomeUserEvent::class => [
            welcomeUserListener::class,
        ],
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        emailVerifiedEvent::class =>[

        ],

        contactFormEvent::class => [
            contactFormListener::class,
        ],

        ChatEvent::class =>[
            ChatListener::class,
        ]
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
