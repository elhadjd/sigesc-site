<?php

namespace App\Services\AiContentEngine\Research\Providers;

use App\Models\AiContent\ResearchSource;
use App\Services\AiContentEngine\Research\Contracts\ResearchProviderInterface;
use App\Services\AiContentEngine\Research\TrustScorer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class OfficialSourcesProvider implements ResearchProviderInterface
{
    public function __construct(
        protected TrustScorer $scorer
    ) {}

    public function name(): string
    {
        return 'official';
    }

    public function search(string $topic, int $limit = 8): array
    {
        $sources = ResearchSource::query()
            ->where('is_active', true)
            ->where(function ($q) {
                $q->where('category', 'official')
                    ->orWhere('type', 'official')
                    ->orWhere('trust_score', '>=', 90);
            })
            ->orderByDesc('priority')
            ->orderByDesc('trust_score')
            ->limit(max(3, $limit))
            ->get();

        $results = [];

        foreach ($sources as $source) {
            if (! $source->url) {
                continue;
            }

            $snippet = $this->fetchSnippet($source->url, $topic);

            $results[] = [
                'title' => $source->name.': '.$topic,
                'url' => $source->url,
                'snippet' => $snippet,
                'content' => $snippet,
                'provider' => $this->name(),
                'source_id' => $source->id,
                'trust_score' => (int) ($source->trust_score ?: 100),
                'published_date' => null,
                'metadata' => [
                    'source_name' => $source->name,
                    'category' => $source->category,
                    'priority' => $source->priority,
                    'country' => $source->country,
                ],
            ];
        }

        return array_slice($results, 0, $limit);
    }

    protected function fetchSnippet(string $url, string $topic): string
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => 'SIGESC-HybridResearch/1.0 (+'.config('sigesc.site_url').')',
                'Accept-Language' => 'pt-PT,pt;q=0.9',
            ])->timeout(12)->get($url);

            if (! $response->successful()) {
                return 'Fonte oficial prioritária para o tema: '.$topic;
            }

            $html = $response->body();
            $html = preg_replace('/<script\b[^>]*>.*?<\/script>/si', ' ', $html) ?? $html;
            $html = preg_replace('/<style\b[^>]*>.*?<\/style>/si', ' ', $html) ?? $html;
            $text = trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5)) ?? '');

            if ($text === '') {
                return 'Fonte oficial prioritária para o tema: '.$topic;
            }

            // Prefer a window around the topic keywords when present.
            $needle = Str::lower(Str::words($topic, 4, ''));
            $pos = $needle !== '' ? mb_stripos(Str::lower($text), $needle) : false;
            if ($pos !== false) {
                $start = max(0, $pos - 180);

                return Str::limit(mb_substr($text, $start, 900), 900, '');
            }

            return Str::limit($text, 900, '');
        } catch (\Throwable) {
            return 'Fonte oficial prioritária para o tema: '.$topic;
        }
    }
}
