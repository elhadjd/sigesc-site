<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;

class FactCheckerAgent implements AgentInterface
{
    public const STATUS_VERIFIED = 'verified';
    public const STATUS_NEEDS_REVIEW = 'needs_review';
    public const STATUS_REJECTED = 'rejected';

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
És o AIFactCheckerAgent. Verificas se cada afirmação importante do artigo está ligada a uma fonte.
Se uma afirmação não tiver confirmação nas referências: needs_review=true e lista em unconfirmed.
Nunca aproves leis/datas/números sem evidência nas fontes.
JSON:
{
  "confidence":0.0,
  "confirmed":[{"claim":"","source_url":""}],
  "unconfirmed":[{"claim":"","reason":""}],
  "needs_review":false,
  "verdict":"pass|needs_review|fail",
  "fact_check_status":"verified|needs_review|rejected",
  "notes":""
}
Regras fact_check_status:
- verified: todas as afirmações críticas têm fonte
- needs_review: há afirmações sem fonte ou confiança média
- rejected: inventou leis/datas/números ou fontes insuficientes
PROMPT
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'title' => $article->title,
                    'content_html' => $article->content_html,
                    'research' => $article->pipeline_meta['research'] ?? [],
                    'research_summary' => $article->pipeline_meta['research']['research_summary'] ?? [],
                    'sources' => $article->sources()->get(['title', 'url', 'snippet', 'is_trusted']),
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], $this->llm->reviewModel(), 0.1);

        $confidence = (float) ($check['confidence'] ?? 0);
        $status = $this->resolveStatus($check, $confidence, $article);
        $needsReview = in_array($status, [self::STATUS_NEEDS_REVIEW, self::STATUS_REJECTED], true);

        $meta = $article->pipeline_meta ?? [];
        $meta['fact_check'] = array_merge($check, ['fact_check_status' => $status]);

        $article->update([
            'fact_confidence' => $confidence,
            'fact_check_status' => $status,
            'needs_human_review' => $needsReview,
            'pipeline_meta' => $meta,
            'status' => $needsReview ? Article::STATUS_NEEDS_REVIEW : $article->status,
        ]);

        $article->markRevision('fact_check', $article->content_html, $meta['fact_check']);

        $this->logger->info('Fact check completed', $job, $article, $this->name(), [
            'confidence' => $confidence,
            'fact_check_status' => $status,
            'needs_review' => $needsReview,
            'unconfirmed' => count($check['unconfirmed'] ?? []),
        ]);

        return [
            'fact_check' => $meta['fact_check'],
            'fact_check_status' => $status,
            'needs_review' => $needsReview,
            'confidence' => $confidence,
        ];
    }

    /**
     * @param  array<string, mixed>  $check
     */
    protected function resolveStatus(array $check, float $confidence, Article $article): string
    {
        $unconfirmed = $check['unconfirmed'] ?? [];
        $hasSources = $article->sources()->exists();
        $minConfidence = (float) config('ai_content_engine.pipeline.min_confidence', 0.72);

        if (($check['verdict'] ?? '') === 'fail' || $confidence < 0.4 || (! $hasSources && $unconfirmed !== [])) {
            return self::STATUS_REJECTED;
        }

        if (
            ($check['fact_check_status'] ?? null) === self::STATUS_REJECTED
            || ($check['verdict'] ?? '') === 'fail'
        ) {
            return self::STATUS_REJECTED;
        }

        if (
            ($check['needs_review'] ?? false)
            || ($check['verdict'] ?? '') === 'needs_review'
            || $confidence < $minConfidence
            || count($unconfirmed) > 0
            || ($check['fact_check_status'] ?? null) === self::STATUS_NEEDS_REVIEW
        ) {
            return self::STATUS_NEEDS_REVIEW;
        }

        if (($check['fact_check_status'] ?? null) === self::STATUS_VERIFIED || ($check['verdict'] ?? '') === 'pass') {
            return self::STATUS_VERIFIED;
        }

        return self::STATUS_NEEDS_REVIEW;
    }
}
