<?php

namespace App\Services\AiContentEngine\Support;

class CreditSaver
{
    public static function enabled(): bool
    {
        return (bool) config('ai_content_engine.credit_saver.enabled', true);
    }

    public static function singleSearch(): bool
    {
        return self::enabled() && (bool) config('ai_content_engine.credit_saver.single_search', true);
    }

    public static function heuristicSeo(): bool
    {
        return self::enabled() && (bool) config('ai_content_engine.credit_saver.heuristic_seo', true);
    }

    public static function heuristicSocial(): bool
    {
        return self::enabled() && (bool) config('ai_content_engine.credit_saver.heuristic_social', true);
    }

    public static function skipReviewerLlm(): bool
    {
        return self::enabled() && (bool) config('ai_content_engine.credit_saver.skip_reviewer_llm', true);
    }

    public static function skipResearchSummaryLlm(): bool
    {
        return self::enabled() && (bool) config('ai_content_engine.credit_saver.skip_research_summary_llm', true);
    }

    public static function trendSeedLimit(): int
    {
        $default = self::enabled() ? 2 : 5;

        return max(1, (int) config('ai_content_engine.credit_saver.trend_seed_queries', $default));
    }
}
