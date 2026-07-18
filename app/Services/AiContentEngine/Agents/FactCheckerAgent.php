<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;

class FactCheckerAgent implements AgentInterface
{
    public function __construct(
        protected LlmGateway $llm,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AIFactCheckerAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $article->update(['status' => Article::STATUS_FACT_CHECKING]);

        $check = $this->llm->chatJson([
            [
                'role' => 'system',
                'content' => <<<'PROMPT'
És o AIFactCheckerAgent. Verificas se afirmações do artigo estão suportadas pelas referências.
Se uma afirmação não tiver confirmação: marca needs_review=true e lista em unconfirmed.
Nunca aproves leis/datas/números sem evidência nas fontes.
JSON:
{
  "confidence":0.0,
  "confirmed":[{"claim":"","source_url":""}],
  "unconfirmed":[{"claim":"","reason":""}],
  "needs_review":false,
  "verdict":"pass|needs_review|fail",
  "notes":""
}
PROMPT
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'title' => $article->title,
                    'content_html' => $article->content_html,
                    'research' => $article->pipeline_meta['research'] ?? [],
                    'sources' => $article->sources()->get(['title', 'url', 'snippet', 'is_trusted']),
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], config('ai_content_engine.openai.review_model'), 0.1);

        $confidence = (float) ($check['confidence'] ?? 0);
        $needsReview = (bool) ($check['needs_review'] ?? false)
            || ($check['verdict'] ?? '') !== 'pass'
            || $confidence < (float) config('ai_content_engine.pipeline.min_confidence', 0.72);

        $meta = $article->pipeline_meta ?? [];
        $meta['fact_check'] = $check;

        $article->update([
            'fact_confidence' => $confidence,
            'needs_human_review' => $needsReview,
            'pipeline_meta' => $meta,
            'status' => $needsReview ? Article::STATUS_NEEDS_REVIEW : $article->status,
        ]);

        $article->markRevision('fact_check', $article->content_html, $check);

        $this->logger->info('Fact check completed', $job, $article, $this->name(), [
            'confidence' => $confidence,
            'needs_review' => $needsReview,
            'verdict' => $check['verdict'] ?? null,
        ]);

        return [
            'fact_check' => $check,
            'needs_review' => $needsReview,
            'confidence' => $confidence,
        ];
    }
}
