<?php

namespace App\Services\AiContentEngine\Research;

use App\Models\AiContent\ResearchSource;
use Illuminate\Support\Str;

class TrustScorer
{
    public function score(?string $url, ?ResearchSource $source = null, ?string $provider = null): int
    {
        if ($source && $source->trust_score) {
            return (int) $source->trust_score;
        }

        if ($source && $source->category) {
            return $this->scoreByCategory($source->category);
        }

        $host = $this->host($url);
        if (! $host) {
            return (int) config('ai_content_engine.research.trust_scores.web', 45);
        }

        $known = ResearchSource::query()
            ->where('is_active', true)
            ->where(function ($q) use ($host) {
                $q->where('domain', $host)
                    ->orWhere('domain', 'like', '%'.$host.'%');
            })
            ->orderByDesc('trust_score')
            ->first();

        if ($known) {
            return (int) $known->trust_score;
        }

        if ($this->matchesOfficial($host)) {
            return (int) config('ai_content_engine.research.trust_scores.official', 100);
        }

        if (Str::contains($host, ['worldbank.org', 'imf.org', 'un.org', 'afdb.org'])) {
            return (int) config('ai_content_engine.research.trust_scores.institutional', 90);
        }

        if (Str::contains($host, ['.edu', 'university', 'universidade', 'ac.ao'])) {
            return (int) config('ai_content_engine.research.trust_scores.university', 85);
        }

        if (in_array($provider, ['news', 'news_search'], true) || Str::contains($host, ['jornal', 'news', 'noticia'])) {
            return (int) config('ai_content_engine.research.trust_scores.news', 65);
        }

        if (Str::contains($host, ['blog', 'medium.com', 'wordpress'])) {
            return (int) config('ai_content_engine.research.trust_scores.blog', 50);
        }

        if (Str::contains($host, ['agt', 'minfin', 'gov.ao', 'bna.ao'])) {
            return (int) config('ai_content_engine.research.trust_scores.specialized', 70);
        }

        return (int) config('ai_content_engine.research.trust_scores.web', 45);
    }

    public function scoreByCategory(string $category): int
    {
        $map = config('ai_content_engine.research.trust_scores', []);

        return (int) ($map[$category] ?? $map['web'] ?? 45);
    }

    protected function matchesOfficial(string $host): bool
    {
        // Official Angolan / government domains only (institutions scored separately).
        $officialHints = [
            'agt.minfin.gov.ao',
            'minfin.gov.ao',
            'governo.gov.ao',
            'bna.ao',
            'inapem.gov.ao',
            'diario.gov.ao',
            'angio.gov.ao',
        ];

        foreach ($officialHints as $domain) {
            if ($host === $domain || Str::endsWith($host, '.'.$domain)) {
                return true;
            }
        }

        return Str::endsWith($host, '.gov.ao') || Str::contains($host, 'minfin.gov.ao');
    }

    protected function host(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $host = parse_url($url, PHP_URL_HOST);
        if (! $host) {
            return null;
        }

        return Str::lower(preg_replace('/^www\./', '', $host) ?? $host);
    }
}
