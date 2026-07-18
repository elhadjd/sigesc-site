<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\AiLog;
use App\Models\AiContent\Article;
use Illuminate\Support\Facades\Log;

class AiLogger
{
    public function info(string $message, ?AiJob $job = null, ?Article $article = null, ?string $agent = null, array $context = []): void
    {
        $this->write('info', $message, $job, $article, $agent, $context);
    }

    public function warning(string $message, ?AiJob $job = null, ?Article $article = null, ?string $agent = null, array $context = []): void
    {
        $this->write('warning', $message, $job, $article, $agent, $context);
    }

    public function error(string $message, ?AiJob $job = null, ?Article $article = null, ?string $agent = null, array $context = []): void
    {
        $this->write('error', $message, $job, $article, $agent, $context);
    }

    protected function write(string $level, string $message, ?AiJob $job, ?Article $article, ?string $agent, array $context): void
    {
        AiLog::create([
            'ai_job_id' => $job?->id,
            'article_id' => $article?->id,
            'agent' => $agent,
            'level' => $level,
            'message' => $message,
            'context' => $context ?: null,
        ]);

        Log::log($level, "[AIContent][{$agent}] {$message}", $context);
    }
}
