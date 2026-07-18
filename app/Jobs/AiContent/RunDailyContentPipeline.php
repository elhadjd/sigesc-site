<?php

namespace App\Jobs\AiContent;

use App\Services\AiContentEngine\Pipeline\ContentPipeline;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RunDailyContentPipeline implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    /** Tavily Research polls can take several minutes per agent step. */
    public int $timeout = 3600;

    public function handle(ContentPipeline $pipeline): void
    {
        if (! config('ai_content_engine.enabled')) {
            Log::info('AI Content Engine daily pipeline skipped (disabled).');

            return;
        }

        $result = $pipeline->runDaily();
        Log::info('AI Content Engine daily pipeline finished', $result);
    }
}
