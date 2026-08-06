<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\Article;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Resolve a contextual cover image for an AI article from the public internet.
 *
 * Order: Tavily web images → Google CSE → DuckDuckGo → Openverse → Wikimedia →
 * Unsplash → Pexels → curated external Unsplash CDN URLs.
 *
 * External image URLs are preferred (not project-generated SVGs / product screenshots).
 * Local SVG generation is off by default.
 */
class CoverImageService
{
    public function __construct(
        protected LlmGateway $llm,
        protected LocalCoverCatalog $localCatalog,
        protected BlogCoverGenerator $coverGenerator,
        protected \App\Services\AiContentEngine\Research\TavilyClient $tavily,
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
        $requireLocal = (bool) config('ai_content_engine.images.require_local_url', false);
        $allowLocalCovers = (bool) config('ai_content_engine.images.allow_local_covers', false);

        // Local editorial catalog is OFF unless explicitly enabled — user wants internet photos.
        if ($allowLocalCovers && (bool) config('ai_content_engine.images.prefer_local_catalog', false)) {
            $local = $this->localCatalog->match($article);
            if ($local !== null && ! $this->localCatalog->isForbiddenProductPath((string) $local['url'])) {
                return $local;
            }
        }

        $attempts = match ($provider) {
            'openai' => ['openai'],
            'tavily' => ['tavily'],
            'google' => ['google'],
            'duckduckgo' => ['duckduckgo'],
            'openverse' => ['openverse'],
            'wikimedia' => ['wikimedia'],
            'unsplash' => ['unsplash'],
            'pexels' => ['pexels'],
            'local' => [],
            default => $preferOpenai
                ? ['openai', 'tavily', 'google', 'duckduckgo', 'openverse', 'wikimedia', 'unsplash', 'pexels']
                : ['tavily', 'google', 'duckduckgo', 'openverse', 'wikimedia', 'unsplash', 'pexels', 'openai'],
        };

        foreach ($attempts as $source) {
            $candidates = match ($source) {
                'openai' => array_values(array_filter([$this->fromOpenAi($prompt)])),
                'tavily' => $this->fromTavily($queries),
                'google' => $this->fromGoogle($queries),
                'duckduckgo' => $this->fromDuckDuckGo($queries),
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
                        'note' => 'Curated internet stock photo keyed to article topic',
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
                        'note' => 'External curated stock photo keyed to article topic',
                    ],
                    'stored' => false,
                ];
            }
        }

        // Local SVG / catalog only if explicitly allowed (default: never).
        if ($allowLocalCovers) {
            $editorial = $this->localCatalog->match($article);
            if ($editorial !== null) {
                return $editorial;
            }

            if ((bool) config('ai_content_engine.images.generate_local_cover', false)) {
                return $this->coverGenerator->ensureFor($article);
            }
        }

        // Absolute last resort: still an external Unsplash URL (never a local generated SVG).
        $lastResort = $pool[0] ?? 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80';

        return [
            'url' => $lastResort,
            'source' => 'curated',
            'attribution' => [
                'provider' => 'unsplash-cdn',
                'note' => 'External last-resort stock photo',
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

        $allowLocalCovers = (bool) config('ai_content_engine.images.allow_local_covers', false);
        if (Str::startsWith($url, '/') && ! $allowLocalCovers) {
            Log::info('[AIContent][CoverImage] Skipping local project path — internet covers required', ['url' => $url]);

            return null;
        }

        $attributionBlob = strtolower(trim(implode(' ', array_filter([
            (string) ($hit['attribution']['title'] ?? ''),
            (string) ($hit['attribution']['creator'] ?? ''),
            (string) ($hit['attribution']['note'] ?? ''),
            (string) ($hit['attribution']['description'] ?? ''),
            (string) ($hit['source'] ?? ''),
        ]))));
        if ($attributionBlob !== '' && $this->looksLikeBrandOrLogo($attributionBlob)) {
            return null;
        }

        $requireLocal = (bool) config('ai_content_engine.images.require_local_url', false);

        // Relative/local paths must exist on this server and never be product UI.
        if (Str::startsWith($url, '/')) {
            if (! $this->localPathExists($url)) {
                Log::info('[AIContent][CoverImage] Skipping missing local path', ['url' => $url]);

                return null;
            }

            $hit['stored'] = true;

            return $hit;
        }

        // Prefer keeping the external URL when local storage is optional.
        if (! $requireLocal && ! (bool) config('ai_content_engine.images.store_locally', false)) {
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
            trim(($english[0] ?? '').' editorial photo'),
            trim(($article->focus_keyword ?: '').' '.($english[0] ?? '')),
            $seed !== '' ? $seed.' foto' : null,
            ...array_slice($english, 1),
            'african business office retail photography',
        ])));

        return array_slice($queries, 0, 6);
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
     * Web image search via Tavily (query-related images from the open web).
     *
     * @param  list<string>  $queries
     * @return list<array{url: string, source: string, attribution: array<string, mixed>}>
     */
    protected function fromTavily(array $queries): array
    {
        if (! (bool) config('ai_content_engine.images.tavily_enabled', true)) {
            return [];
        }

        if (! $this->tavily->configured()) {
            return [];
        }

        $hits = [];
        foreach ($queries as $query) {
            $imageQuery = trim($query.' photography photo');
            foreach ($this->tavily->searchImages($imageQuery, 8) as $image) {
                $url = (string) ($image['url'] ?? '');
                $description = (string) ($image['description'] ?? '');
                if ($url === '' || ! Str::startsWith($url, ['http://', 'https://'])) {
                    continue;
                }
                if ($this->looksLikeBrandOrLogo(Str::lower($description.' '.$url))) {
                    continue;
                }
                $hits[] = [
                    'url' => $url,
                    'source' => 'tavily',
                    'attribution' => [
                        'provider' => 'tavily-web',
                        'description' => $description !== '' ? $description : null,
                        'query' => $query,
                    ],
                ];
            }
        }

        return $hits;
    }

    /**
     * Google Programmable Search (Custom Search JSON API) — image mode.
     *
     * @param  list<string>  $queries
     * @return list<array{url: string, source: string, attribution: array<string, mixed>}>
     */
    protected function fromGoogle(array $queries): array
    {
        $key = trim((string) config('ai_content_engine.images.google_cse_api_key'));
        $cx = trim((string) config('ai_content_engine.images.google_cse_cx'));
        if ($key === '' || $cx === '' || ! (bool) config('ai_content_engine.images.google_enabled', true)) {
            return [];
        }

        $hits = [];
        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders($this->headers())
                    ->timeout(20)
                    ->get('https://www.googleapis.com/customsearch/v1', [
                        'key' => $key,
                        'cx' => $cx,
                        'q' => $query,
                        'searchType' => 'image',
                        'num' => 8,
                        'safe' => 'active',
                        'imgSize' => 'large',
                        'imgType' => 'photo',
                    ]);

                if (! $response->successful()) {
                    continue;
                }

                foreach (collect($response->json('items') ?? [])->take(6) as $item) {
                    $url = (string) ($item['link'] ?? '');
                    $title = (string) ($item['title'] ?? '');
                    $snippet = (string) ($item['snippet'] ?? '');
                    if ($url === '' || ! Str::startsWith($url, ['http://', 'https://'])) {
                        continue;
                    }
                    if ($this->looksLikeBrandOrLogo(Str::lower($title.' '.$snippet.' '.$url))) {
                        continue;
                    }
                    $hits[] = [
                        'url' => $url,
                        'source' => 'google',
                        'attribution' => [
                            'provider' => 'google-cse',
                            'title' => $title !== '' ? $title : null,
                            'context' => data_get($item, 'image.contextLink'),
                            'query' => $query,
                        ],
                    ];
                }
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Google CSE failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $hits;
    }

    /**
     * DuckDuckGo image results (free web image search, no API key).
     *
     * @param  list<string>  $queries
     * @return list<array{url: string, source: string, attribution: array<string, mixed>}>
     */
    protected function fromDuckDuckGo(array $queries): array
    {
        if (! (bool) config('ai_content_engine.images.duckduckgo_enabled', true)) {
            return [];
        }

        $hits = [];
        foreach ($queries as $query) {
            try {
                $tokenResponse = Http::withHeaders([
                    'User-Agent' => $this->headers()['User-Agent'],
                ])->timeout(20)->get('https://duckduckgo.com/', [
                    'q' => $query,
                ]);

                if (! $tokenResponse->successful()) {
                    continue;
                }

                if (! preg_match("/vqd=['\"]([^'\"]+)['\"]/", $tokenResponse->body(), $match)) {
                    continue;
                }

                $vqd = $match[1];
                $imagesResponse = Http::withHeaders([
                    'User-Agent' => $this->headers()['User-Agent'],
                    'Referer' => 'https://duckduckgo.com/',
                ])->timeout(25)->get('https://duckduckgo.com/i.js', [
                    'l' => 'wt-wt',
                    'o' => 'json',
                    'q' => $query,
                    'vqd' => $vqd,
                    'f' => ',,,',
                    'p' => '1',
                ]);

                if (! $imagesResponse->successful()) {
                    continue;
                }

                $results = $imagesResponse->json('results') ?? [];
                if (! is_array($results)) {
                    continue;
                }

                foreach (array_slice($results, 0, 8) as $row) {
                    if (! is_array($row)) {
                        continue;
                    }
                    $url = (string) ($row['image'] ?? $row['thumbnail'] ?? '');
                    $title = (string) ($row['title'] ?? '');
                    if ($url === '' || ! Str::startsWith($url, ['http://', 'https://'])) {
                        continue;
                    }
                    if ($this->looksLikeBrandOrLogo(Str::lower($title.' '.$url))) {
                        continue;
                    }
                    $hits[] = [
                        'url' => $url,
                        'source' => 'duckduckgo',
                        'attribution' => [
                            'provider' => 'duckduckgo-images',
                            'title' => $title !== '' ? $title : null,
                            'source_page' => $row['url'] ?? null,
                            'query' => $query,
                        ],
                    ];
                }
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] DuckDuckGo images failed', [
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
