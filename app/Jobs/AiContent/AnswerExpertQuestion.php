<?php

namespace App\Jobs\AiContent;

use App\Services\AiContentEngine\AskExpert\AskExpertService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AnswerExpertQuestion implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public int $timeout = 3600;

    public function __construct(public int $expertQuestionId) {}

    public function handle(AskExpertService $service): void
    {
        $service->processQueued($this->expertQuestionId);
    }
}
