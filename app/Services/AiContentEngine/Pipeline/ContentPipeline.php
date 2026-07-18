<?php

namespace App\Services\AiContentEngine\Pipeline;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Agents\FactCheckerAgent;
use App\Services\AiContentEngine\Agents\ImageAgent;
use App\Services\AiContentEngine\Agents\PublisherAgent;
use App\Services\AiContentEngine\Agents\ResearchAgent;
use App\Services\AiContentEngine\Agents\ReviewerAgent;
use App\Services\AiContentEngine\Agents\SeoAgent;
use App\Services\AiContentEngine\Agents\SocialAgent;
use App\Services\AiContentEngine\Agents\TrendAgent;
use App\Services\AiContentEngine\Agents\WriterAgent;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use RuntimeException;
use Throwable;

class ContentPipeline
{
    public function __construct(
        protected TrendAgent $trend,
        protected ResearchAgent $research,
        protected WriterAgent $writer,
        protected ReviewerAgent $reviewer,
        protected FactCheckerAgent $factChecker,
        protected SeoAgent $seo,
        protected ImageAgent $image,
        protected SocialAgent $social,
        protected PublisherAgent $publisher,
        protected AiLogger $logger,
        protected LlmGateway $llm
    ) {}

    /**
     * Daily autonomous run: discover topics and produce articles.
     *
     * @return array<string, mixed>
     */
    public function runDaily(): array
    {
        if (! $this->llm->configured()) {
            throw new RuntimeException($this->llm->missingConfigMessage());
        }

        $job = AiJob::create([
            'type' => 'daily_pipeline',
            'status' => 'running',
            'started_at' => now(),
            'progress' => 0,
            'current_agent' => 'AITrendAgent',
            'input' => [
                'llm_provider' => $this->llm->provider(),
            ],
        ]);

        try {
            $this->reapStuckJobs();

            $discovery = $this->trend->handle(new Article(), $job, [
                'limit' => (int) config('ai_content_engine.pipeline.topics_per_day', 2),
            ]);

            $produced = [];
            $failures = [];
            $topics = $discovery['topics'] ?? [];

            foreach ($topics as $index => $article) {
                /** @var Article $article */
                $job->update([
                    'article_id' => $article->id,
                    'progress' => (int) (($index / max(1, count($topics))) * 90),
                    'current_agent' => 'ContentPipeline',
                ]);

                try {
                    // Own AiJob per article so a Writer failure does not mark the daily job failed mid-run.
                    $produced[] = $this->processArticle($article, null, [
                        'from_daily_job_id' => $job->id,
                    ]);
                } catch (Throwable $articleError) {
                    $failures[] = [
                        'article_id' => $article->id,
                        'error' => $articleError->getMessage(),
                    ];
                    $this->logger->error(
                        'Daily article failed: '.$articleError->getMessage(),
                        $job,
                        $article,
                        'ContentPipeline'
                    );
                }
            }

            $job->update([
                'status' => $failures !== [] && $produced === [] ? 'failed' : 'completed',
                'progress' => 100,
                'finished_at' => now(),
                'error' => $failures !== []
                    ? ('Alguns artigos falharam: '.collect($failures)->pluck('error')->take(3)->implode(' | '))
                    : null,
                'output' => [
                    'discovered' => count($topics),
                    'processed' => count($produced),
                    'failed' => count($failures),
                    'article_ids' => collect($produced)->pluck('article_id')->all(),
                    'failures' => $failures,
                ],
                'current_agent' => null,
            ]);

            return $job->output ?? [];
        } catch (Throwable $e) {
            $job->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
                'finished_at' => now(),
            ]);
            $this->logger->error($e->getMessage(), $job, null, 'ContentPipeline');
            throw $e;
        }
    }

    /**
     * Mark AI jobs stuck in "running" (crashed worker / timeout) as failed.
     */
    public function reapStuckJobs(int $minutes = 90): int
    {
        return AiJob::query()
            ->where('status', 'running')
            ->where('updated_at', '<', now()->subMinutes($minutes))
            ->update([
                'status' => 'failed',
                'error' => 'Job marcado como falhado: ficou em running sem atualização (worker parado ou timeout).',
                'finished_at' => now(),
                'current_agent' => null,
            ]);
    }

    /**
     * Run full production pipeline for one article.
     *
     * @return array<string, mixed>
     */
    public function processArticle(Article $article, ?AiJob $job = null, array $context = []): array
    {
        $job ??= AiJob::create([
            'type' => 'single_article',
            'status' => 'running',
            'article_id' => $article->id,
            'started_at' => now(),
            'progress' => 0,
        ]);

        $steps = [
            'research' => [$this->research, 15],
            'writer' => [$this->writer, 35],
            'reviewer' => [$this->reviewer, 50],
            'fact_checker' => [$this->factChecker, 65],
            'seo' => [$this->seo, 75],
            'image' => [$this->image, 85],
            'social' => [$this->social, 92],
            'publisher' => [$this->publisher, 100],
        ];

        $output = [];

        try {
            foreach ($steps as $key => [$agent, $progress]) {
                $job->update([
                    'current_agent' => $agent->name(),
                    'progress' => $progress,
                    'article_id' => $article->id,
                ]);

                $output[$key] = $agent->handle($article->fresh(), $job, $context);

                if ($key === 'fact_checker'
                    && ($output[$key]['needs_review'] ?? false)
                    && ($context['stop_on_needs_review'] ?? false)
                ) {
                    break;
                }
            }

            $job->update([
                'status' => 'completed',
                'progress' => 100,
                'finished_at' => now(),
                'output' => [
                    'article_id' => $article->id,
                    'status' => $article->fresh()->status,
                    'steps' => array_keys($output),
                ],
                'current_agent' => null,
            ]);
        } catch (Throwable $e) {
            $article->update(['status' => Article::STATUS_FAILED]);
            $job->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
                'finished_at' => now(),
            ]);
            $this->logger->error($e->getMessage(), $job, $article, 'ContentPipeline');
            throw $e;
        }

        return [
            'article_id' => $article->id,
            'status' => $article->fresh()->status,
            'output' => $output,
        ];
    }

    /**
     * Publish due scheduled articles.
     */
    public function publishDue(): int
    {
        $count = 0;

        Article::dueForPublish()
            ->orderBy('scheduled_at')
            ->limit(20)
            ->get()
            ->each(function (Article $article) use (&$count) {
                if (config('ai_content_engine.pipeline.require_fact_check') && (
                    $article->needs_human_review
                    || $article->fact_check_status !== 'verified'
                )) {
                    $article->update([
                        'status' => Article::STATUS_NEEDS_REVIEW,
                        'fact_check_status' => $article->fact_check_status ?: 'needs_review',
                    ]);

                    return;
                }

                $this->publisher->publishNow($article);
                $count++;
            });

        return $count;
    }
}
