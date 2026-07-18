<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Models\AiContent\ResearchSource;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Research\HybridResearchEngine;
use App\Services\AiContentEngine\Support\AiLogger;
use Illuminate\Support\Str;

/**
 * AIResearchAgent — thin orchestrator over HybridResearchEngine.
 * Keeps pipeline contract intact for Writer / Reviewer / FactChecker.
 */
class ResearchAgent implements AgentInterface
{
    public function __construct(
        protected HybridResearchEngine $engine,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AIResearchAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $article->update(['status' => Article::STATUS_RESEARCHING]);

        $topic = $article->focus_keyword
            ? $article->title.' — '.$article->focus_keyword
            : $article->title;

        $bundle = $this->engine->research(
            $topic,
            $article,
            (bool) ($context['force_refresh'] ?? false)
        );

        $summary = $bundle['summary'];
        $findings = $bundle['findings'];

        // Compatibility payload expected by Writer / Reviewer / FactChecker.
        $structured = [
            'summary' => is_array($summary['main_points'] ?? null)
                ? implode(' ', array_slice($summary['main_points'], 0, 3))
                : ($summary['topic'] ?? $topic),
            'facts' => collect($summary['main_points'] ?? [])->map(fn ($point) => [
                'claim' => $point,
                'evidence' => '',
                'confidence' => ($summary['confidence_level'] ?? 0) / 100,
            ])->all(),
            'dates' => $summary['important_dates'] ?? [],
            'numbers' => $summary['numbers'] ?? [],
            'laws' => $summary['laws'] ?? [],
            'changes' => $summary['changes'] ?? [],
            'references' => $summary['sources'] ?? [],
            'uncertainties' => $summary['warnings'] ?? [],
            'confidence_level' => $summary['confidence_level'] ?? $bundle['avg_trust_score'],
            'research_summary' => $summary,
        ];

        $article->sources()->delete();

        foreach ($findings as $result) {
            if (empty($result['url'])) {
                continue;
            }

            $domain = Str::lower(preg_replace('/^www\./', '', parse_url($result['url'], PHP_URL_HOST) ?: '') ?? '');
            $source = null;

            if (! empty($result['source_id'])) {
                $source = ResearchSource::find($result['source_id']);
            } elseif ($domain) {
                $source = ResearchSource::firstOrCreate(
                    ['domain' => $domain],
                    [
                        'name' => $domain,
                        'url' => $result['url'],
                        'type' => ($result['trust_score'] ?? 0) >= 90 ? 'official' : 'web',
                        'category' => ($result['trust_score'] ?? 0) >= 90 ? 'official' : 'web',
                        'priority' => ($result['trust_score'] ?? 0) >= 90 ? 100 : 40,
                        'country' => 'AO',
                        'trust_score' => (int) ($result['trust_score'] ?? 50),
                        'is_trusted' => ((int) ($result['trust_score'] ?? 0)) >= 70,
                        'is_active' => true,
                    ]
                );
            }

            $article->sources()->create([
                'research_source_id' => $source?->id,
                'title' => $result['title'] ?? null,
                'url' => $result['url'],
                'snippet' => Str::limit($result['snippet'] ?? ($result['content'] ?? ''), 500, ''),
                'is_trusted' => ((int) ($result['trust_score'] ?? 0)) >= 70,
            ]);
        }

        $meta = $article->pipeline_meta ?? [];
        $meta['research'] = $structured;
        $meta['hybrid_research'] = [
            'from_cache' => $bundle['from_cache'],
            'avg_trust_score' => $bundle['avg_trust_score'],
            'providers' => $bundle['providers'],
            'execution_time_ms' => $bundle['execution_time_ms'],
            'session_id' => $bundle['session']?->id,
        ];

        $article->update(['pipeline_meta' => $meta]);
        $article->markRevision('research', null, [
            'research_result_id' => $bundle['session']?->id,
            'avg_trust_score' => $bundle['avg_trust_score'],
            'from_cache' => $bundle['from_cache'],
        ]);

        $this->logger->info('Hybrid research completed', $job, $article, $this->name(), [
            'sources' => $article->sources()->count(),
            'avg_trust_score' => $bundle['avg_trust_score'],
            'from_cache' => $bundle['from_cache'],
            'providers' => $bundle['providers'],
        ]);

        return [
            'research' => $structured,
            'research_result_id' => $bundle['session']?->id,
            'avg_trust_score' => $bundle['avg_trust_score'],
            'from_cache' => $bundle['from_cache'],
            'findings_count' => count($findings),
        ];
    }
}
