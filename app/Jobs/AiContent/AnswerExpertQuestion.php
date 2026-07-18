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

    public int $timeout = 600;

    /**
     * @param  array{question: string, asker_name?: string, asker_email?: string}  $input
     */
    public function __construct(public array $input) {}

    public function handle(AskExpertService $service): void
    {
        $service->ask($this->input);
    }
}
