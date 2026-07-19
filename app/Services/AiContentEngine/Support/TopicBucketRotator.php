<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\Article;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Picks the next editorial topic bucket so daily articles diversify
 * across fiscal (AGT/IVA), gestão, marketing and empreendedorismo.
 *
 * Default strategy: strict round-robin from the last used bucket so
 * sales/ads stay in the mix without starving AGT/IVA.
 */
class TopicBucketRotator
{
    public const CACHE_KEY = 'ai_content_engine.last_topic_bucket';

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
        $keys = array_values(array_keys($buckets));

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

        $mode = strtolower((string) config('ai_content_engine.topic_rotation.mode', 'round_robin'));

        $key = match ($mode) {
            'underused' => $this->pickUnderused($keys),
            default => $this->pickRoundRobin($keys),
        };

        $reason = $mode === 'underused' ? 'underused_bucket' : 'round_robin';

        return $this->hydrate($key, $buckets[$key], $reason, $limitSeeds);
    }

    /**
     * Remember the bucket after an article is created (advances round-robin).
     */
    public function remember(string $bucketKey): void
    {
        if ($bucketKey === '') {
            return;
        }

        Cache::forever(self::CACHE_KEY, $bucketKey);
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

        // Title/keyword heuristics for older articles without topic_bucket meta.
        $hay = Str::lower($category);
        if (Str::contains($hay, ['agt', 'iva', 'irt', 'imposto', 'fatura', 'fiscal', 'nif'])) {
            return 'fiscal';
        }
        if (Str::contains($hay, ['anúncio', 'anuncio', 'ads', 'instagram', 'facebook', 'whatsapp', 'e-commerce', 'ecommerce', 'loja online', 'marketing'])) {
            return 'marketing';
        }
        if (Str::contains($hay, ['erp', 'crm', 'pdv', 'pos', 'stock', 'caixa', 'gestão', 'gestao'])) {
            return 'gestao';
        }

        return null;
    }

    /**
     * Infer bucket from article title when category mapping is weak.
     */
    public function bucketForTitle(?string $title): ?string
    {
        $hay = Str::lower((string) $title);
        if ($hay === '') {
            return null;
        }

        if (Str::contains($hay, ['agt', 'iva', 'irt', 'imposto industrial', 'faturação eletr', 'faturacao eletr', 'nif empresa', 'certidão de não dívida', 'certidao'])) {
            return 'fiscal';
        }
        if (Str::contains($hay, ['facebook', 'instagram', 'whatsapp', 'anúncio', 'anuncio', 'loja online', 'e-commerce', 'ecommerce', 'ads', 'marketing digital', 'delivery'])) {
            return 'marketing';
        }
        if (Str::contains($hay, ['abrir empresa', 'inapem', 'licen', 'farmácia', 'farmacia', 'salão', 'salao', 'importa', 'exporta', 'crédito pme', 'credito pme'])) {
            return 'empreendedorismo';
        }
        if (Str::contains($hay, ['erp', 'crm', 'pdv', 'pos', 'stock', 'fluxo de caixa', 'gestão', 'gestao', 'software'])) {
            return 'gestao';
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
            ->get(['id', 'title', 'pipeline_meta', 'category_id'])
            ->map(function (Article $article) {
                $meta = $article->pipeline_meta ?? [];
                if (filled($meta['topic_bucket'] ?? null)) {
                    return (string) $meta['topic_bucket'];
                }

                return $this->bucketForCategory($article->category?->name)
                    ?? $this->bucketForTitle($article->title);
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
            ->get(['id', 'title', 'pipeline_meta', 'category_id'])
            ->each(function (Article $article) use (&$counts) {
                $meta = $article->pipeline_meta ?? [];
                $key = $meta['topic_bucket']
                    ?? $this->bucketForCategory($article->category?->name)
                    ?? $this->bucketForTitle($article->title);
                if ($key && array_key_exists($key, $counts)) {
                    $counts[$key]++;
                }
            });

        return $counts;
    }

    /**
     * @param  array<int, string>  $keys
     */
    protected function pickRoundRobin(array $keys): string
    {
        $counts = $this->bucketArticleCounts(45);

        // If fiscal was starved while sales/ads dominate, catch up once before resuming the wheel.
        if (
            in_array('fiscal', $keys, true)
            && ($counts['fiscal'] ?? 0) === 0
            && ($counts['marketing'] ?? 0) >= 2
        ) {
            return 'fiscal';
        }

        $last = Cache::get(self::CACHE_KEY);
        if (! is_string($last) || ! in_array($last, $keys, true)) {
            $last = $this->lastBucketFromArticles($keys);
        }

        if ($last === null) {
            asort($counts);
            $underused = array_key_first($counts);

            return is_string($underused) && in_array($underused, $keys, true)
                ? $underused
                : $keys[0];
        }

        $index = array_search($last, $keys, true);
        if ($index === false) {
            return $keys[0];
        }

        return $keys[($index + 1) % count($keys)];
    }

    /**
     * @param  array<int, string>  $keys
     */
    protected function pickUnderused(array $keys): string
    {
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

        usort($candidates, static function (string $a, string $b) use ($counts) {
            return ($counts[$a] ?? 0) <=> ($counts[$b] ?? 0);
        });

        return $candidates[0];
    }

    /**
     * @param  array<int, string>  $keys
     */
    protected function lastBucketFromArticles(array $keys): ?string
    {
        $article = Article::query()
            ->with('category')
            ->latest('id')
            ->first(['id', 'title', 'pipeline_meta', 'category_id']);

        if (! $article) {
            return null;
        }

        $meta = $article->pipeline_meta ?? [];
        $key = $meta['topic_bucket']
            ?? $this->bucketForCategory($article->category?->name)
            ?? $this->bucketForTitle($article->title);

        return is_string($key) && in_array($key, $keys, true) ? $key : null;
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
