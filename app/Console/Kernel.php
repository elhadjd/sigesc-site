<?php

namespace App\Console;

use App\Jobs\GenerateWeeklyAiBlogPosts;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Every Monday at 08:00 (Africa/Luanda) — research + AI posts.
        $schedule->job(new GenerateWeeklyAiBlogPosts)
            ->weeklyOn(1, '08:00')
            ->timezone('Africa/Luanda')
            ->withoutOverlapping()
            ->name('ai-weekly-blog-posts')
            ->when(fn () => (bool) config('ai_blog.enabled'));
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
