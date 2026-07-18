<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\Article;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * Picks the next editorial topic bucket so daily articles diversify
 * across fiscal (AGT/IVA), gestão, marketing and empreendedorismo.
 */
class TopicBucketRotator
{
    /**
     * @return array{
     *   key: string,
     *   label: string,
     *   categories: array<int, string>,
     *   queries: array<int, string>,
     *   reason: string
     * }
     */
    public function pick(?Carbon $when = null, ?int $limitSeeds = null): array
    {
        $when ??= now();
        $buckets = config('ai_content_engine.topic_buckets', []);
        $keys = array_keys($buckets);

        if ($keys === []) {
            return [
                'key' => 'gestao',
                'label' => 'Gestão',
                'categories' => ['Gestão'],
                'queries' => array_slice(config('ai_content_engine.seed_queries', []), 0, $limitSeeds ?? 2),
                'reason' => 'fallback_empty_buckets',
            ];
        }

        if (! (bool) config('ai_content_engine.topic_rotation.enabled', true)) {
            $key = $keys[(int) $when->dayOfYear % count($keys)];

            return $this->hydrate($key, $buckets[$key], 'rotation_disabled_day_cycle', $limitSeeds);
        }

        $cooldownDays = max(1, (int) config('ai_content_engine.topic_rotation.cooldown_days', 5));
        $recentBuckets = $this->recentBucketKeys($cooldownDays);
        $counts = $this->bucketArticleCounts(45);

        $candidates = array_values(array_filter(
            $keys,
            static fn (string $key) => ! in_array($key, $recentBuckets, true)
        ));

        if ($candidates === []) {
            $candidates = $keys;
        }

        if ((bool) config('ai_content_engine.topic_rotation.prefer_underused', true)) {
            usort($candidates, static function (string $a, string $b) use ($counts) {
                return ($counts[$a] ?? 0) <=> ($counts[$b] ?? 0);
            });
            $key = $candidates[0];
            $reason = 'underused_bucket';
        } else {
            $key = $candidates[(int) $when->dayOfYear % count($candidates)];
            $reason = 'day_cycle';
        }

        return $this->hydrate($key, $buckets[$key], $reason, $limitSeeds);
    }

    /**
     * Map a category name to a bucket key (or null).
     */
    public function bucketForCategory(?string $category): ?string
    {
        $category = trim((string) $category);
        if ($category === '') {
            return null;
        }

        foreach (config('ai_content_engine.topic_buckets', []) as $key => $bucket) {
            foreach ($bucket['categories'] ?? [] as $name) {
                if (Str::lower($name) === Str::lower($category)) {
                    return $key;
                }
            }
        }

        return null;
    }

    /**
     * @return array<int, string>
     */
    public function recentBucketKeys(int $days): array
    {
        return Article::query()
            ->with('category')
            ->where('created_at', '>=', now()->subDays($days))
            ->latest('id')
            ->limit(40)
            ->get(['id', 'pipeline_meta', 'category_id'])
            ->map(function (Article $article) {
                $meta = $article->pipeline_meta ?? [];
                if (filled($meta['topic_bucket'] ?? null)) {
                    return (string) $meta['topic_bucket'];
                }

                return $this->bucketForCategory($article->category?->name);
            })
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * @return array<string, int>
     */
    public function bucketArticleCounts(int $days): array
    {
        $counts = array_fill_keys(array_keys(config('ai_content_engine.topic_buckets', [])), 0);

        Article::query()
            ->with('category')
            ->where('created_at', '>=', now()->subDays($days))
            ->latest('id')
            ->limit(200)
            ->get(['pipeline_meta', 'category_id'])
            ->each(function (Article $article) use (&$counts) {
                $meta = $article->pipeline_meta ?? [];
                $key = $meta['topic_bucket'] ?? $this->bucketForCategory($article->category?->name);
                if ($key && array_key_exists($key, $counts)) {
                    $counts[$key]++;
                }
            });

        return $counts;
    }

    /**
     * @param  array<string, mixed>  $bucket
     * @return array{
     *   key: string,
     *   label: string,
     *   categories: array<int, string>,
     *   queries: array<int, string>,
     *   reason: string
     * }
     */
    protected function hydrate(string $key, array $bucket, string $reason, ?int $limitSeeds): array
    {
        $queries = collect($bucket['queries'] ?? [])->shuffle()->values();
        $limit = $limitSeeds ?? CreditSaver::trendSeedLimit();

        return [
            'key' => $key,
            'label' => (string) ($bucket['label'] ?? $key),
            'categories' => array_values($bucket['categories'] ?? []),
            'queries' => $queries->take(max(1, $limit))->all(),
            'reason' => $reason,
        ];
    }
}
