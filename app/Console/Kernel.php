<?php

namespace App\Console;

use App\Jobs\AiContent\PublishDueArticles;
use App\Jobs\AiContent\RunDailyContentPipeline;
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
        // AI Content Engine — discover + research + write daily.
        $schedule->job(new RunDailyContentPipeline)
            ->dailyAt('07:30')
            ->timezone('Africa/Luanda')
            ->withoutOverlapping()
            ->name('ai-content-engine-daily')
            ->when(fn () => (bool) config('ai_content_engine.enabled'));

        // Publish scheduled articles every 15 minutes.
        $schedule->job(new PublishDueArticles)
            ->everyFifteenMinutes()
            ->timezone('Africa/Luanda')
            ->withoutOverlapping()
            ->name('ai-content-engine-publish-due')
            ->when(fn () => (bool) config('ai_content_engine.enabled'));

        // Legacy weekly blog generator (kept as fallback).
        $schedule->job(new GenerateWeeklyAiBlogPosts)
            ->weeklyOn(1, '08:00')
            ->timezone('Africa/Luanda')
            ->withoutOverlapping()
            ->name('ai-weekly-blog-posts')
            ->when(fn () => (bool) config('ai_blog.enabled') && ! config('ai_content_engine.enabled'));
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
