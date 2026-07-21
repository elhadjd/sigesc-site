<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\AiLog;
use App\Models\AiContent\Article;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiLogger
{
    /**
     * Safe for legacy VARCHAR(255); after migrate to TEXT, still keep logs readable.
     * Full exception detail belongs in Laravel log / truncated context marker.
     */
    public const MESSAGE_MAX = 240;

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
        $full = $message;
        $safe = Str::limit($full, self::MESSAGE_MAX, '…');
        if ($safe !== $full) {
            $context = array_merge($context, [
                'message_truncated' => true,
                'message_full_length' => mb_strlen($full),
            ]);
        }

        try {
            AiLog::create([
                'ai_job_id' => $job?->id,
                'article_id' => $article?->id,
                'agent' => $agent ? Str::limit($agent, 60, '') : null,
                'level' => Str::limit($level, 20, ''),
                'message' => $safe,
                'context' => $context ?: null,
            ]);
        } catch (\Throwable $e) {
            // Never let logging break the pipeline (e.g. legacy VARCHAR(255) before migrate).
            Log::warning('[AIContent] Failed to persist ai_logs row', [
                'error' => $e->getMessage(),
                'agent' => $agent,
                'level' => $level,
            ]);
        }

        Log::log($level, "[AIContent][{$agent}] {$safe}", $context);
    }
}
