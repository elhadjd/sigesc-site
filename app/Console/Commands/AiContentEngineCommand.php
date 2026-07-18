<?php

namespace App\Console\Commands;

use App\Jobs\AiContent\ProcessArticlePipeline;
use App\Jobs\AiContent\PublishDueArticles;
use App\Jobs\AiContent\RunDailyContentPipeline;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Agents\PublisherAgent;
use App\Services\AiContentEngine\Pipeline\ContentPipeline;
use Illuminate\Console\Command;

class AiContentEngineCommand extends Command
{
    protected $signature = 'ai-content:run
        {action=daily : daily|article|publish-due|approve}
        {--id= : Article ID for article/approve actions}
        {--sync : Run synchronously}
        {--force : Force publish even if needs review}';

    protected $description = 'Operate the SIGESC AI Content Engine pipeline';

    public function handle(ContentPipeline $pipeline, PublisherAgent $publisher): int
    {
        if (! config('ai_content_engine.enabled')) {
            $this->warn('AI Content Engine is disabled.');

            return self::SUCCESS;
        }

        $action = $this->argument('action');

        return match ($action) {
            'daily' => $this->runDaily($pipeline),
            'article' => $this->runArticle($pipeline),
            'publish-due' => $this->runPublishDue($pipeline),
            'approve' => $this->approve($publisher),
            default => $this->invalid($action),
        };
    }

    protected function runDaily(ContentPipeline $pipeline): int
    {
        if ($this->option('sync')) {
            $result = $pipeline->runDaily();
            $this->info('Daily pipeline done: '.json_encode($result));

            return self::SUCCESS;
        }

        RunDailyContentPipeline::dispatch();
        $this->info('Daily pipeline dispatched.');

        return self::SUCCESS;
    }

    protected function runArticle(ContentPipeline $pipeline): int
    {
        $id = (int) $this->option('id');
        if (! $id) {
            $this->error('--id is required for article action');

            return self::FAILURE;
        }

        $context = ['force_publish' => (bool) $this->option('force')];

        if ($this->option('sync')) {
            $article = Article::findOrFail($id);
            $result = $pipeline->processArticle($article, null, $context);
            $this->info('Article processed: '.json_encode($result['status']));

            return self::SUCCESS;
        }

        ProcessArticlePipeline::dispatch($id, $context);
        $this->info("Article #{$id} pipeline dispatched.");

        return self::SUCCESS;
    }

    protected function runPublishDue(ContentPipeline $pipeline): int
    {
        if ($this->option('sync')) {
            $count = $pipeline->publishDue();
            $this->info("Published {$count} scheduled article(s).");

            return self::SUCCESS;
        }

        PublishDueArticles::dispatch();
        $this->info('Publish-due job dispatched.');

        return self::SUCCESS;
    }

    protected function approve(PublisherAgent $publisher): int
    {
        $id = (int) $this->option('id');
        if (! $id) {
            $this->error('--id is required for approve action');

            return self::FAILURE;
        }

        $article = Article::findOrFail($id);
        $article->update(['needs_human_review' => false]);
        $result = $publisher->publishNow($article);
        $this->info('Approved & published: '.json_encode($result));

        return self::SUCCESS;
    }

    protected function invalid(string $action): int
    {
        $this->error("Unknown action [{$action}]");

        return self::FAILURE;
    }
}
