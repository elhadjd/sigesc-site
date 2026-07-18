<?php

namespace App\Jobs\AiContent;

use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Pipeline\ContentPipeline;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessArticlePipeline implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    /** Align with Tavily Research steps; keep below QUEUE_RETRY_AFTER. */
    public int $timeout = 3600;

    public function __construct(
        public int $articleId,
        public array $context = []
    ) {}

    public function handle(ContentPipeline $pipeline): void
    {
        $article = Article::findOrFail($this->articleId);
        $pipeline->processArticle($article, null, $this->context);
    }
}
