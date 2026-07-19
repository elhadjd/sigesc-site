<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\CreditSaver;
use App\Services\AiContentEngine\Support\LlmGateway;

class ReviewerAgent implements AgentInterface
{
    public function __construct(
        protected LlmGateway $llm,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AIReviewerAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $article->update(['status' => Article::STATUS_REVIEWING]);

        // Credit saver: Writer + FactChecker keep quality; skip a full Research rewrite pass.
        if (CreditSaver::skipReviewerLlm()) {
            $review = [
                'content_html' => $article->content_html,
                'changes' => [],
                'hallucination_flags' => [],
                'readability_score' => 80,
                'notes' => 'Review LLM skipped (credit saver). Fact-check remains the quality gate.',
                'skipped' => true,
            ];
            $meta = $article->pipeline_meta ?? [];
            $meta['review'] = $review;
            $article->update(['pipeline_meta' => $meta]);
            $this->logger->info('Review skipped (credit saver)', $job, $article, $this->name());

            return ['review' => $review];
        }

        $review = $this->llm->chatJson([
            [
                'role' => 'system',
                'content' => <<<'PROMPT'
És o AIReviewerAgent. Corriges português de Angola, elimias repetições, melhoras clareza e coerência.
Detectas possíveis alucinações (leis/datas/números sem suporte).
Mantém HTML semântico. Não encurtes demais o artigo.
JSON: {"content_html":"","changes":[],"hallucination_flags":[],"readability_score":0-100,"notes":""}
PROMPT
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'title' => $article->title,
                    'content_html' => $article->content_html,
                    'research' => $article->pipeline_meta['research'] ?? [],
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], $this->llm->reviewModel(), 0.3);

        $html = (string) ($review['content_html'] ?? $article->content_html);
        $flags = $review['hallucination_flags'] ?? [];

        $meta = $article->pipeline_meta ?? [];
        $meta['review'] = $review;

        $article->update([
            'content_html' => $html,
            'pipeline_meta' => $meta,
            'needs_human_review' => count($flags) > 0 ? true : $article->needs_human_review,
        ]);

        $article->markRevision('review', $html, [
            'changes' => $review['changes'] ?? [],
            'hallucination_flags' => $flags,
        ]);

        $this->logger->info('Review completed', $job, $article, $this->name(), [
            'flags' => count($flags),
            'readability' => $review['readability_score'] ?? null,
        ]);

        return ['review' => $review];
    }
}
