<?php

namespace App\Services\AiContentEngine\AskExpert;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Models\AiContent\ExpertQuestion;
use App\Services\AiContentEngine\Pipeline\ContentPipeline;
use App\Services\AiContentEngine\Research\HybridResearchEngine;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Str;

class AskExpertService
{
    public function __construct(
        protected HybridResearchEngine $research,
        protected LlmGateway $llm,
        protected ContentPipeline $pipeline,
        protected AiLogger $logger
    ) {}

    /**
     * @param  array{question: string, asker_name?: string, asker_email?: string}  $input
     */
    public function ask(array $input): ExpertQuestion
    {
        $question = ExpertQuestion::create([
            'question' => $input['question'],
            'asker_name' => $input['asker_name'] ?? null,
            'asker_email' => $input['asker_email'] ?? null,
            'status' => 'researching',
        ]);

        $job = AiJob::create([
            'type' => 'ask_expert',
            'status' => 'running',
            'started_at' => now(),
            'current_agent' => 'AskExpert',
            'input' => ['expert_question_id' => $question->id],
        ]);

        try {
            $bundle = $this->research->research($question->question.' Angola');

            $answer = $this->llm->chatJson([
                [
                    'role' => 'system',
                    'content' => <<<'PROMPT'
És o especialista SIGESC para empresários em Angola.
Responde com precisão, português de Angola, cita incerteza quando existir.
Nunca inventes leis/datas/números.
JSON:
{
  "answer_html":"",
  "quality_score":0-100,
  "should_become_article":false,
  "suggested_title":"",
  "category":"",
  "keywords":[],
  "summary":""
}
PROMPT
                ],
                [
                    'role' => 'user',
                    'content' => json_encode([
                        'question' => $question->question,
                        'research_summary' => $bundle['summary'],
                        'findings' => $bundle['findings'],
                        'avg_trust_score' => $bundle['avg_trust_score'],
                    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                ],
            ], null, 0.35);

            $quality = (float) ($answer['quality_score'] ?? 0);
            $shouldConvert = (bool) ($answer['should_become_article'] ?? false) && $quality >= 75;

            $question->update([
                'answer_html' => $answer['answer_html'] ?? '<p>Não foi possível formular uma resposta confiável neste momento.</p>',
                'quality_score' => $quality,
                'research' => [
                    'from_cache' => $bundle['from_cache'],
                    'avg_trust_score' => $bundle['avg_trust_score'],
                    'providers' => $bundle['providers'],
                    'summary' => $bundle['summary'],
                    'findings' => $bundle['findings'],
                ],
                'status' => 'answered',
                'convert_to_article' => $shouldConvert,
            ]);

            if ($shouldConvert) {
                $article = $this->convertToArticle($question, $answer);
                $question->update([
                    'article_id' => $article->id,
                    'status' => 'converted',
                ]);

                // Process asynchronously-friendly: run pipeline inline for now (queued by job wrapper).
                $this->pipeline->processArticle($article, $job);
            }

            $job->update([
                'status' => 'completed',
                'finished_at' => now(),
                'progress' => 100,
                'output' => [
                    'expert_question_id' => $question->id,
                    'quality_score' => $quality,
                    'converted' => $shouldConvert,
                ],
            ]);

            $this->logger->info('AskExpert answered', $job, $question->article, 'AskExpert', [
                'quality' => $quality,
                'converted' => $shouldConvert,
            ]);
        } catch (\Throwable $e) {
            $question->update(['status' => 'rejected']);
            $job->update([
                'status' => 'failed',
                'error' => $e->getMessage(),
                'finished_at' => now(),
            ]);
            $this->logger->error($e->getMessage(), $job, null, 'AskExpert');
            throw $e;
        }

        return $question->fresh(['article']);
    }

    /**
     * @param  array<string, mixed>  $answer
     */
    protected function convertToArticle(ExpertQuestion $question, array $answer): Article
    {
        $title = $answer['suggested_title'] ?: Str::limit($question->question, 90, '');
        $category = Category::firstOrCreate(
            ['slug' => Str::slug($answer['category'] ?? 'gestao')],
            ['name' => $answer['category'] ?? 'Gestão', 'is_active' => true]
        );

        $article = Article::create([
            'title' => $title,
            'slug' => Article::uniqueSlug($title),
            'status' => Article::STATUS_DISCOVERED,
            'priority' => 2,
            'excerpt' => $answer['summary'] ?? null,
            'category_id' => $category->id,
            'focus_keyword' => $answer['keywords'][0] ?? null,
            'author_name' => config('ai_content_engine.author.name'),
            'author_role' => config('ai_content_engine.author.role'),
            'author_avatar' => config('ai_content_engine.author.avatar'),
            'pipeline_meta' => [
                'from_expert_question' => $question->id,
                'seed_answer' => $answer,
            ],
        ]);

        foreach ($answer['keywords'] ?? [] as $i => $keyword) {
            $article->keywords()->create([
                'keyword' => $keyword,
                'type' => $i === 0 ? 'focus' : 'secondary',
                'score' => max(10, 100 - ($i * 10)),
            ]);
        }

        return $article;
    }
}
