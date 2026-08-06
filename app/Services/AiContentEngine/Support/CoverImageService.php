<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\Article;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Resolve a contextual cover image for an AI article.
 *
 * Order: remote stock (stored locally) → curated topic photos → editorial
 * blog-covers SVG catalog → generated SVG → placeholder.
 *
 * Never uses SIGESC module/product screenshots or brand logos.
 * With require_local_url=true, remote URLs are never returned unless saved under storage/public.
 */
class CoverImageService
{
    public function __construct(
        protected LlmGateway $llm,
        protected LocalCoverCatalog $localCatalog,
        protected BlogCoverGenerator $coverGenerator,
    ) {}

    /**
     * @return array{url: string, source: string, attribution: array<string, mixed>, stored: bool}
     */
    public function resolve(Article $article, ?string $prompt = null): array
    {
        $queries = $this->buildQueries($article);
        $prompt ??= $this->defaultPrompt($article);
        $preferOpenai = (bool) config('ai_content_engine.images.prefer_openai', false);
        $provider = strtolower((string) config('ai_content_engine.images.provider', 'auto'));
        $requireLocal = (bool) config('ai_content_engine.images.require_local_url', true);

        // Editorial catalog (blog-covers SVGs) is optional early preference — never product UI.
        if ((bool) config('ai_content_engine.images.prefer_local_catalog', false)) {
            $local = $this->localCatalog->match($article);
            if ($local !== null && ! $this->localCatalog->isForbiddenProductPath((string) $local['url'])) {
                return $local;
            }
        }

        $attempts = match ($provider) {
            'openai' => ['openai'],
            'openverse' => ['openverse'],
            'wikimedia' => ['wikimedia'],
            'unsplash' => ['unsplash'],
            'pexels' => ['pexels'],
            'local' => [],
            default => $preferOpenai
                ? ['openai', 'openverse', 'wikimedia', 'unsplash', 'pexels']
                : ['openverse', 'wikimedia', 'unsplash', 'pexels', 'openai'],
        };

        foreach ($attempts as $source) {
            $candidates = match ($source) {
                'openai' => array_values(array_filter([$this->fromOpenAi($prompt)])),
                'openverse' => $this->fromOpenverse($queries),
                'wikimedia' => $this->fromWikimedia($queries),
                'unsplash' => $this->fromUnsplash($queries),
                'pexels' => $this->fromPexels($queries),
                default => [],
            };

            foreach ($candidates as $hit) {
                $accepted = $this->acceptHit($hit, $article->slug.'-cover');
                if ($accepted !== null) {
                    return $accepted;
                }
            }
        }

        $pool = $this->curatedPoolFor($article);
        $preferred = abs(crc32(Str::slug($article->focus_keyword ?: $article->title ?: 'blog'))) % max(1, count($pool));
        $ordered = array_merge(
            array_slice($pool, $preferred),
            array_slice($pool, 0, $preferred)
        );

        foreach ($ordered as $url) {
            if (! $this->urlIsReachable($url)) {
                continue;
            }

            $stored = $this->maybeStore($url, $article->slug.'-cover');
            if ($stored) {
                return [
                    'url' => $stored,
                    'source' => 'curated',
                    'attribution' => [
                        'provider' => 'unsplash-cdn',
                        'note' => 'Curated stock photo keyed to article topic (stored locally)',
                    ],
                    'stored' => true,
                ];
            }

            if (! $requireLocal) {
                return [
                    'url' => $url,
                    'source' => 'curated',
                    'attribution' => [
                        'provider' => 'unsplash-cdn',
                        'note' => 'Curated stock photo keyed to article topic',
                    ],
                    'stored' => false,
                ];
            }
        }

        // Topic-matched editorial SVG catalog (never product screenshots).
        $editorial = $this->localCatalog->match($article);
        if ($editorial !== null) {
            return $editorial;
        }

        if ((bool) config('ai_content_engine.images.generate_local_cover', true)) {
            return $this->coverGenerator->ensureFor($article);
        }

        $fallback = $this->localServerFallback();
        if ($this->localCatalog->isForbiddenProductPath($fallback)) {
            return $this->coverGenerator->ensureFor($article);
        }

        if (! $this->localPathExists($fallback) && Str::startsWith($fallback, '/')) {
            return $this->coverGenerator->ensureFor($article);
        }

        return [
            'url' => $fallback,
            'source' => 'local',
            'attribution' => [
                'provider' => 'local',
                'note' => 'Server fallback cover — remote sources unavailable',
            ],
            'stored' => false,
        ];
    }

    /**
     * @param  array{url: string, source: string, attribution: array<string, mixed>}  $hit
     * @return array{url: string, source: string, attribution: array<string, mixed>, stored: bool}|null
     */
    protected function acceptHit(array $hit, string $storeName): ?array
    {
        $url = (string) ($hit['url'] ?? '');
        if ($url === '' || ! Str::startsWith($url, ['http://', 'https://', '/'])) {
            return null;
        }

        if ($this->localCatalog->isForbiddenProductPath($url)) {
            Log::info('[AIContent][CoverImage] Skipping product/brand screenshot path', ['url' => $url]);

            return null;
        }

        $attributionBlob = strtolower(trim(implode(' ', array_filter([
            (string) ($hit['attribution']['title'] ?? ''),
            (string) ($hit['attribution']['creator'] ?? ''),
            (string) ($hit['attribution']['note'] ?? ''),
            (string) ($hit['source'] ?? ''),
        ]))));
        if ($attributionBlob !== '' && $this->looksLikeBrandOrLogo($attributionBlob)) {
            return null;
        }

        $requireLocal = (bool) config('ai_content_engine.images.require_local_url', true);

        // Relative/local paths must exist on this server and never be product UI.
        if (Str::startsWith($url, '/')) {
            if (! $this->localPathExists($url)) {
                Log::info('[AIContent][CoverImage] Skipping missing local path', ['url' => $url]);

                return null;
            }

            $hit['stored'] = true;

            return $hit;
        }

        $stored = $this->maybeStore($url, $storeName);
        if ($stored) {
            $hit['url'] = $stored;
            $hit['stored'] = true;

            return $hit;
        }

        if ($requireLocal) {
            Log::info('[AIContent][CoverImage] Skipping remote URL not stored locally', [
                'url' => $url,
                'source' => $hit['source'] ?? null,
            ]);

            return null;
        }

        if (! $this->urlIsReachable($url)) {
            Log::info('[AIContent][CoverImage] Skipping unreachable URL', [
                'url' => $url,
                'source' => $hit['source'] ?? null,
            ]);

            return null;
        }

        $hit['stored'] = false;

        return $hit;
    }

    protected function localPathExists(string $urlPath): bool
    {
        if ($this->localCatalog->existsOnServer($urlPath)) {
            return true;
        }

        // storage/public URLs from maybeStore (e.g. /storage/ai-content/images/...)
        if (Str::startsWith($urlPath, '/storage/')) {
            $relative = Str::after($urlPath, '/storage/');
            $disk = config('ai_content_engine.storage.disk', 'public');

            return Storage::disk($disk)->exists($relative);
        }

        $full = public_path(ltrim($urlPath, '/'));

        return is_file($full) && filesize($full) > 0;
    }

    /**
     * @return list<string>
     */
    public function buildQueries(Article $article): array
    {
        $seed = trim(implode(' ', array_filter([
            $article->focus_keyword,
            $article->category?->name,
            $article->title,
        ])));

        $english = $this->englishBoosts($seed);
        $queries = array_values(array_unique(array_filter([
            $english[0] ?? null,
            trim(($article->focus_keyword ?: '').' '.($english[0] ?? '')),
            $seed,
            ...array_slice($english, 1),
            'african business office retail photography',
        ])));

        return array_slice($queries, 0, 5);
    }

    protected function defaultPrompt(Article $article): string
    {
        return 'Editorial cover photo for a business knowledge article about "'
            .$article->title
            .'" in Angola. Clean corporate photography, African context when possible, no text overlay, no logos or brand marks, professional lighting.';
    }

    /**
     * @return array{url: string, source: string, attribution: array<string, mixed>}|null
     */
    protected function fromOpenAi(string $prompt): ?array
    {
        if (blank(config('ai_content_engine.openai.api_key'))) {
            return null;
        }

        $url = $this->llm->generateImage($prompt, '1792x1024');
        if (! $url) {
            return null;
        }

        return [
            'url' => $url,
            'source' => 'openai',
            'attribution' => [
                'provider' => 'openai',
                'model' => config('ai_content_engine.openai.image_model'),
            ],
        ];
    }

    /**
     * @param  list<string>  $queries
     * @return list<array{url: string, source: string, attribution: array<string, mixed>}>
     */
    protected function fromOpenverse(array $queries): array
    {
        if (! (bool) config('ai_content_engine.images.openverse_enabled', true)) {
            return [];
        }

        $hits = [];

        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders($this->headers())
                    ->timeout(20)
                    ->get('https://api.openverse.org/v1/images/', [
                        'q' => $query,
                        'page_size' => 12,
                        'license_type' => 'commercial',
                        'mature' => 'false',
                    ]);

                if (! $response->successful()) {
                    continue;
                }

                $results = collect($response->json('results') ?? [])
                    ->filter(fn ($row) => $this->isAcceptableOpenverseRow(is_array($row) ? $row : []))
                    ->sortByDesc(function ($row) {
                        $w = (int) ($row['width'] ?? 0);
                        $h = (int) ($row['height'] ?? 0);

                        return ($w >= $h ? 100000 : 0) + ($w * $h);
                    })
                    ->values();

                foreach ($results->take(5) as $pick) {
                    $hits[] = [
                        'url' => (string) $pick['url'],
                        'source' => 'openverse',
                        'attribution' => [
                            'provider' => $pick['provider'] ?? 'openverse',
                            'title' => $pick['title'] ?? null,
                            'creator' => $pick['creator'] ?? null,
                            'license' => $pick['license'] ?? null,
                            'license_url' => $pick['license_url'] ?? null,
                            'foreign_landing_url' => $pick['foreign_landing_url'] ?? null,
                            'query' => $query,
                        ],
                    ];
                }
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Openverse failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $hits;
    }

    /**
     * @param  array<string, mixed>  $row
     */
    protected function isAcceptableOpenverseRow(array $row): bool
    {
        $url = (string) ($row['url'] ?? '');
        if (! Str::startsWith($url, ['http://', 'https://'])) {
            return false;
        }
        $mime = strtolower((string) ($row['filetype'] ?? ''));
        if ($mime !== '' && ! in_array($mime, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            return false;
        }

        $blob = strtolower(trim(implode(' ', array_filter([
            (string) ($row['title'] ?? ''),
            is_array($row['tags'] ?? null)
                ? collect($row['tags'])->map(fn ($t) => is_array($t) ? ($t['name'] ?? '') : (string) $t)->implode(' ')
                : (string) ($row['tags'] ?? ''),
            (string) ($row['category'] ?? ''),
            (string) ($row['creator'] ?? ''),
        ]))));

        return ! $this->looksLikeBrandOrLogo($blob);
    }

    /**
     * @param  list<string>  $queries
     * @return list<array{url: string, source: string, attribution: array<string, mixed>}>
     */
    protected function fromWikimedia(array $queries): array
    {
        if (! (bool) config('ai_content_engine.images.wikimedia_enabled', true)) {
            return [];
        }

        $hits = [];

        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders($this->headers())
                    ->timeout(20)
                    ->get('https://commons.wikimedia.org/w/api.php', [
                        'action' => 'query',
                        'generator' => 'search',
                        'gsrsearch' => $query,
                        'gsrnamespace' => 6,
                        'gsrlimit' => 12,
                        'prop' => 'imageinfo',
                        'iiprop' => 'url|mime|size',
                        'iiurlwidth' => 1600,
                        'format' => 'json',
                    ]);

                if (! $response->successful()) {
                    continue;
                }

                $pages = collect($response->json('query.pages') ?? [])
                    ->filter(function ($page) {
                        $info = $page['imageinfo'][0] ?? null;
                        if (! is_array($info)) {
                            return false;
                        }
                        $mime = strtolower((string) ($info['mime'] ?? ''));
                        if (! str_starts_with($mime, 'image/') || str_contains($mime, 'svg')) {
                            return false;
                        }
                        $w = (int) ($info['width'] ?? 0);
                        $h = (int) ($info['height'] ?? 0);
                        if ($w < 800 || $h < 500) {
                            return false;
                        }
                        $title = strtolower((string) ($page['title'] ?? ''));

                        return ! $this->looksLikeBrandOrLogo($title);
                    })
                    ->sortByDesc(function ($page) {
                        $info = $page['imageinfo'][0] ?? [];
                        $w = (int) ($info['width'] ?? 0);
                        $h = (int) ($info['height'] ?? 0);

                        return ($w >= $h ? 100000 : 0) + ($w * $h);
                    })
                    ->values();

                foreach ($pages->take(5) as $page) {
                    $info = $page['imageinfo'][0];
                    $url = (string) ($info['thumburl'] ?? $info['url'] ?? '');
                    if ($url === '') {
                        continue;
                    }
                    $hits[] = [
                        'url' => $url,
                        'source' => 'wikimedia',
                        'attribution' => [
                            'provider' => 'wikimedia-commons',
                            'title' => $page['title'] ?? null,
                            'page_url' => $info['descriptionurl'] ?? null,
                            'query' => $query,
                        ],
                    ];
                }
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Wikimedia failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $hits;
    }

    /**
     * @param  list<string>  $queries
     * @return list<array{url: string, source: string, attribution: array<string, mixed>}>
     */
    protected function fromUnsplash(array $queries): array
    {
        $key = trim((string) config('ai_content_engine.images.unsplash_access_key'));
        if ($key === '') {
            return [];
        }

        $hits = [];

        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders(array_merge($this->headers(), [
                    'Authorization' => 'Client-ID '.$key,
                ]))->timeout(20)->get('https://api.unsplash.com/search/photos', [
                    'query' => $query,
                    'per_page' => 8,
                    'orientation' => 'landscape',
                    'content_filter' => 'high',
                ]);

                if (! $response->successful()) {
                    continue;
                }

                foreach (collect($response->json('results') ?? [])->take(5) as $photo) {
                    $url = data_get($photo, 'urls.regular') ?: data_get($photo, 'urls.full');
                    if (! $url) {
                        continue;
                    }
                    $blob = strtolower(trim(implode(' ', array_filter([
                        (string) data_get($photo, 'description'),
                        (string) data_get($photo, 'alt_description'),
                        collect(data_get($photo, 'tags', []))->pluck('title')->implode(' '),
                    ]))));
                    if ($this->looksLikeBrandOrLogo($blob)) {
                        continue;
                    }
                    $hits[] = [
                        'url' => (string) $url,
                        'source' => 'unsplash',
                        'attribution' => [
                            'provider' => 'unsplash',
                            'photographer' => data_get($photo, 'user.name'),
                            'unsplash_url' => data_get($photo, 'links.html'),
                            'query' => $query,
                        ],
                    ];
                }
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Unsplash failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $hits;
    }

    /**
     * @param  list<string>  $queries
     * @return list<array{url: string, source: string, attribution: array<string, mixed>}>
     */
    protected function fromPexels(array $queries): array
    {
        $key = trim((string) config('ai_content_engine.images.pexels_api_key'));
        if ($key === '') {
            return [];
        }

        $hits = [];

        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders(array_merge($this->headers(), [
                    'Authorization' => $key,
                ]))->timeout(20)->get('https://api.pexels.com/v1/search', [
                    'query' => $query,
                    'per_page' => 8,
                    'orientation' => 'landscape',
                ]);

                if (! $response->successful()) {
                    continue;
                }

                foreach (collect($response->json('photos') ?? [])->take(5) as $photo) {
                    $url = data_get($photo, 'src.large2x') ?: data_get($photo, 'src.large');
                    if (! $url) {
                        continue;
                    }
                    $blob = strtolower(trim(implode(' ', array_filter([
                        (string) data_get($photo, 'alt'),
                        (string) data_get($photo, 'photographer'),
                    ]))));
                    if ($this->looksLikeBrandOrLogo($blob)) {
                        continue;
                    }
                    $hits[] = [
                        'url' => (string) $url,
                        'source' => 'pexels',
                        'attribution' => [
                            'provider' => 'pexels',
                            'photographer' => data_get($photo, 'photographer'),
                            'pexels_url' => data_get($photo, 'url'),
                            'query' => $query,
                        ],
                    ];
                }
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Pexels failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $hits;
    }

    /**
     * Detect logos, wordmarks, coats of arms, and obvious brand marks.
     */
    public function looksLikeBrandOrLogo(string $blob): bool
    {
        if ($blob === '') {
            return false;
        }

        if (! (bool) config('ai_content_engine.images.reject_brand_terms', true)) {
            return false;
        }

        if (preg_match(
            '/\b(logo|logotipo|logotype|wordmark|trademark|marca\s+registrada|brand\s+mark|emblem|badge|seal|coat\s+of\s+arms|brasão|bandeira\s+oficial|icon\s+set|app\s+icon|favicon|screenshot|ui\s+mockup|product\s+screenshot|software\s+screenshot)\b/u',
            $blob
        ) === 1) {
            return true;
        }

        // Never accept SIGESC product / brand marketing imagery as blog covers.
        if (preg_match('/\b(sigesc|sisgesc)\b/u', $blob) === 1) {
            return true;
        }

        // Common consumer brands often returned as "logo" stock — skip even without the word "logo".
        $brands = (array) config('ai_content_engine.images.brand_denylist', []);
        foreach ($brands as $brand) {
            $brand = trim(strtolower((string) $brand));
            if ($brand !== '' && str_contains($blob, $brand) && preg_match('/\b(logo|icon|wordmark|brand)\b/u', $blob) === 1) {
                return true;
            }
            // File titles like "File:Coca-Cola logo.svg" already caught; also "WhatsApp Logo PNG"
            if ($brand !== '' && preg_match('/\b'.preg_quote($brand, '/').'\b.{0,24}\b(logo|icon)\b/u', $blob) === 1) {
                return true;
            }
        }

        if (preg_match('/\bfile:.*\b(logo|wordmark|emblem|coat of arms|flag of)\b/u', $blob) === 1) {
            return true;
        }

        return false;
    }

    public function urlIsReachable(string $url): bool
    {
        if (! (bool) config('ai_content_engine.images.verify_url', true)) {
            return true;
        }

        if (! Str::startsWith($url, ['http://', 'https://'])) {
            return true;
        }

        try {
            $head = Http::withHeaders($this->headers())
                ->timeout(15)
                ->withOptions(['allow_redirects' => true])
                ->head($url);

            if ($head->successful()) {
                $ct = strtolower((string) $head->header('Content-Type'));

                return $ct === '' || str_starts_with($ct, 'image/') || str_contains($ct, 'octet-stream');
            }

            // Some CDNs reject HEAD — probe with a small ranged GET.
            $get = Http::withHeaders(array_merge($this->headers(), [
                'Range' => 'bytes=0-1023',
                'Accept' => 'image/*,*/*',
            ]))->timeout(20)->get($url);

            $ct = strtolower((string) $get->header('Content-Type'));

            return $get->status() < 400 && ($ct === '' || str_starts_with($ct, 'image/') || str_contains($ct, 'octet-stream'));
        } catch (\Throwable) {
            return false;
        }
    }

    /**
     * Topic-aware curated Unsplash CDN photos (no logos / product UI).
     *
     * @return list<string>
     */
    protected function curatedPoolFor(Article $article): array
    {
        $blob = Str::lower(trim(implode(' ', array_filter([
            $article->focus_keyword,
            $article->category?->name,
            $article->title,
        ]))));

        $topicPools = [
            'fiscal' => [
                'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1600&q=80',
            ],
            'retail' => [
                'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
            ],
            'marketing' => [
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1432888498266-38ffecfd34cd?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
            ],
            'finance' => [
                'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
            ],
            'hr' => [
                'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80',
            ],
            'logistics' => [
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=80',
                'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=80',
            ],
        ];

        $picked = [];
        if (preg_match('/(iva|agt|fatura|factura|fiscal|imposto|tribut)/u', $blob) === 1) {
            $picked = array_merge($picked, $topicPools['fiscal']);
        }
        if (preg_match('/(pdv|loja|stock|estoque|venda|retail|pos)/u', $blob) === 1) {
            $picked = array_merge($picked, $topicPools['retail']);
        }
        if (preg_match('/(marketing|whatsapp|anúncio|anuncio|digital|ads)/u', $blob) === 1) {
            $picked = array_merge($picked, $topicPools['marketing']);
        }
        if (preg_match('/(fluxo|caixa|finanç|financ|banco|crédito|credito)/u', $blob) === 1) {
            $picked = array_merge($picked, $topicPools['finance']);
        }
        if (preg_match('/(rh|salário|salario|folha|funcionário|funcionario)/u', $blob) === 1) {
            $picked = array_merge($picked, $topicPools['hr']);
        }
        if (preg_match('/(logística|logistica|entrega|frota|transporte)/u', $blob) === 1) {
            $picked = array_merge($picked, $topicPools['logistics']);
        }

        $general = [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1600&q=80',
        ];

        return array_values(array_unique(array_merge($picked !== [] ? $picked : $general, $general)));
    }

    /**
     * @return list<string>
     */
    protected function curatedPool(): array
    {
        return $this->curatedPoolFor(new Article([
            'title' => 'business',
            'focus_keyword' => 'business',
        ]));
    }

    protected function localServerFallback(): string
    {
        return (string) config(
            'ai_content_engine.images.local_fallback',
            '/img/placeholder-blog.svg'
        );
    }

    /**
     * Map Portuguese fiscal/business topics to English search terms (better stock results).
     *
     * @return list<string>
     */
    protected function englishBoosts(string $blob): array
    {
        $blob = Str::lower($blob);
        $boosts = [];

        $map = [
            'iva|imposto|agt|fiscal|irt|retenção|fatura' => 'tax accounting invoice office africa',
            'pdv|ponto de venda|loja|stock|estoque|inventário' => 'retail shop point of sale africa',
            'software|erp|gestão|sistema' => 'business laptop office africa entrepreneurship',
            'marketing|anúncio|ads|whatsapp|e-commerce|online' => 'digital marketing smartphone business africa',
            'empresa|empreendedor|abrir|licença|inapem' => 'african entrepreneur small business startup',
            'salário|rh|trabalho|funcionário' => 'payroll human resources office africa',
            'finança|caixa|banco|crédito|lucro' => 'finance cash flow business africa',
        ];

        foreach ($map as $pattern => $query) {
            if (preg_match('/('.$pattern.')/u', $blob) === 1) {
                $boosts[] = $query;
            }
        }

        if ($boosts === []) {
            $boosts[] = 'african business office meeting';
        }

        return array_values(array_unique($boosts));
    }

    protected function maybeStore(string $url, string $name): ?string
    {
        if (! (bool) config('ai_content_engine.images.store_locally', true)) {
            return null;
        }

        try {
            $response = Http::withHeaders(array_merge($this->headers(), [
                'Accept' => 'image/*,*/*',
            ]))->timeout(60)->get($url);
            if (! $response->successful()) {
                return null;
            }

            $contentType = strtolower((string) $response->header('Content-Type'));
            if ($contentType !== '' && ! str_starts_with($contentType, 'image/') && ! str_contains($contentType, 'octet-stream')) {
                return null;
            }

            $ext = match (true) {
                str_contains($contentType, 'png') => 'png',
                str_contains($contentType, 'webp') => 'webp',
                default => 'jpg',
            };

            $path = trim((string) config('ai_content_engine.storage.image_folder'), '/').'/'
                .Str::slug($name).'-'.Str::random(6).'.'.$ext;

            $disk = config('ai_content_engine.storage.disk', 'public');
            Storage::disk($disk)->put($path, $response->body());

            return Storage::disk($disk)->url($path);
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @return array<string, string>
     */
    protected function headers(): array
    {
        return [
            'User-Agent' => 'SIGESC-AIContentEngine/1.0 (+'.rtrim((string) config('sigesc.site_url'), '/').'; cover-images)',
            'Accept' => 'application/json',
        ];
    }
}
