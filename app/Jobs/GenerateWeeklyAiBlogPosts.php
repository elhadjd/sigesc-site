<?php

namespace App\Jobs;

use App\Services\Blog\AiBlogPostGenerator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateWeeklyAiBlogPosts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public int $timeout = 300;

    public function handle(AiBlogPostGenerator $generator): void
    {
        if (! config('ai_blog.enabled')) {
            Log::info('AI weekly blog generation skipped: disabled in config.');

            return;
        }

        $posts = $generator->generateWeeklyPosts();

        Log::info('AI weekly blog generation finished', [
            'created_count' => count($posts),
            'slugs' => collect($posts)->pluck('slug')->all(),
        ]);
    }
}
