<?php

namespace App\Services\AiContentEngine\Contracts;

use App\Models\AiContent\Article;
use App\Models\AiContent\AiJob;

interface AgentInterface
{
    public function name(): string;

    /**
     * @param  array<string, mixed>  $context
     * @return array<string, mixed>
     */
    public function handle(Article $article, AiJob $job, array $context = []): array;
}
