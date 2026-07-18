<?php

namespace App\Jobs\AiContent;

use App\Services\AiContentEngine\Pipeline\ContentPipeline;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PublishDueArticles implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(ContentPipeline $pipeline): void
    {
        $count = $pipeline->publishDue();
        Log::info('AI Content Engine published due articles', ['count' => $count]);
    }
}
