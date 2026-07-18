<?php

namespace App\Console\Commands;

use App\Jobs\GenerateWeeklyAiBlogPosts;
use App\Services\Blog\AiBlogPostGenerator;
use Illuminate\Console\Command;

class GenerateWeeklyBlogPosts extends Command
{
    protected $signature = 'blog:generate-weekly
                            {--sync : Run immediately instead of dispatching to the queue}
                            {--topic= : Optional topic key from config/ai_blog.php}';

    protected $description = 'Research the web and create weekly AI blog posts (AGT + gestão comercial)';

    public function handle(AiBlogPostGenerator $generator): int
    {
        if (! config('ai_blog.enabled')) {
            $this->warn('AI blog generation is disabled (AI_BLOG_ENABLED=false).');

            return self::SUCCESS;
        }

        if (blank(config('ai_blog.openai.api_key'))) {
            $this->error('OPENAI_API_KEY is missing. Add it to your .env file.');

            return self::FAILURE;
        }

        $topicKey = $this->option('topic');

        if ($topicKey) {
            $topic = collect(config('ai_blog.topics'))
                ->firstWhere('key', $topicKey);

            if (! $topic) {
                $this->error("Unknown topic key: {$topicKey}");

                return self::FAILURE;
            }

            $this->info("Generating post for topic [{$topicKey}]...");
            $post = $generator->generateForTopic($topic);

            if (! $post) {
                $this->warn('No post created (possible duplicate or empty draft).');

                return self::SUCCESS;
            }

            $this->info("Created: {$post->title} ({$post->slug})");

            return self::SUCCESS;
        }

        if ($this->option('sync')) {
            $this->info('Generating weekly AI blog posts synchronously...');
            $posts = $generator->generateWeeklyPosts();
            $this->info('Created '.count($posts).' post(s).');

            foreach ($posts as $post) {
                $this->line(" - {$post->slug}");
            }

            return self::SUCCESS;
        }

        GenerateWeeklyAiBlogPosts::dispatch();
        $this->info('Weekly AI blog job dispatched to the queue.');

        return self::SUCCESS;
    }
}
