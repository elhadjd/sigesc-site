<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\Article;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Resolve a relevant cover image for an AI article.
 *
 * Order (auto): OpenAI DALL-E → Openverse → Wikimedia → Unsplash → Pexels → curated pool.
 */
class CoverImageService
{
    public function __construct(
        protected LlmGateway $llm
    ) {}

    /**
     * @return array{url: string, source: string, attribution: array<string, mixed>, stored: bool}
     */
    public function resolve(Article $article, ?string $prompt = null): array
    {
        $queries = $this->buildQueries($article);
        $prompt ??= $this->defaultPrompt($article);
        $preferOpenai = (bool) config('ai_content_engine.images.prefer_openai', true);
        $provider = strtolower((string) config('ai_content_engine.images.provider', 'auto'));

        $attempts = match ($provider) {
            'openai' => ['openai'],
            'openverse' => ['openverse'],
            'wikimedia' => ['wikimedia'],
            'unsplash' => ['unsplash'],
            'pexels' => ['pexels'],
            default => $preferOpenai
                ? ['openai', 'openverse', 'wikimedia', 'unsplash', 'pexels']
                : ['openverse', 'wikimedia', 'unsplash', 'pexels', 'openai'],
        };

        foreach ($attempts as $source) {
            $hit = match ($source) {
                'openai' => $this->fromOpenAi($prompt),
                'openverse' => $this->fromOpenverse($queries),
                'wikimedia' => $this->fromWikimedia($queries),
                'unsplash' => $this->fromUnsplash($queries),
                'pexels' => $this->fromPexels($queries),
                default => null,
            };

            if (! $hit || blank($hit['url'] ?? null)) {
                continue;
            }

            $stored = $this->maybeStore((string) $hit['url'], $article->slug.'-cover');
            if ($stored) {
                $hit['url'] = $stored;
                $hit['stored'] = true;
            } else {
                $hit['stored'] = false;
            }

            return $hit;
        }

        $fallback = $this->curatedFallback($queries[0] ?? $article->title);

        return [
            'url' => $fallback,
            'source' => 'curated',
            'attribution' => [
                'provider' => 'unsplash-cdn',
                'note' => 'Curated stock fallback keyed to article topic',
            ],
            'stored' => false,
        ];
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
            'african business office retail',
        ])));

        return array_slice($queries, 0, 5);
    }

    protected function defaultPrompt(Article $article): string
    {
        return 'Editorial cover photo for a business knowledge article about "'
            .$article->title
            .'" in Angola. Clean corporate photography, African context when possible, no text overlay, professional lighting.';
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
     * @return array{url: string, source: string, attribution: array<string, mixed>}|null
     */
    protected function fromOpenverse(array $queries): ?array
    {
        if (! (bool) config('ai_content_engine.images.openverse_enabled', true)) {
            return null;
        }

        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders($this->headers())
                    ->timeout(20)
                    ->get('https://api.openverse.org/v1/images/', [
                        'q' => $query,
                        'page_size' => 8,
                        'license_type' => 'commercial',
                    ]);

                if (! $response->successful()) {
                    continue;
                }

                $results = collect($response->json('results') ?? [])
                    ->filter(function ($row) {
                        $url = (string) ($row['url'] ?? '');
                        if (! Str::startsWith($url, ['http://', 'https://'])) {
                            return false;
                        }
                        $mime = strtolower((string) ($row['filetype'] ?? ''));
                        if ($mime !== '' && ! in_array($mime, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                            return false;
                        }

                        return true;
                    })
                    ->sortByDesc(function ($row) {
                        $w = (int) ($row['width'] ?? 0);
                        $h = (int) ($row['height'] ?? 0);

                        // Prefer landscape covers.
                        return ($w >= $h ? 100000 : 0) + ($w * $h);
                    })
                    ->values();

                $pick = $results->first();
                if (! $pick) {
                    continue;
                }

                return [
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
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Openverse failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return null;
    }

    /**
     * @param  list<string>  $queries
     * @return array{url: string, source: string, attribution: array<string, mixed>}|null
     */
    protected function fromWikimedia(array $queries): ?array
    {
        if (! (bool) config('ai_content_engine.images.wikimedia_enabled', true)) {
            return null;
        }

        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders($this->headers())
                    ->timeout(20)
                    ->get('https://commons.wikimedia.org/w/api.php', [
                        'action' => 'query',
                        'generator' => 'search',
                        'gsrsearch' => $query,
                        'gsrnamespace' => 6,
                        'gsrlimit' => 8,
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

                        return $w >= 800 && $h >= 500;
                    })
                    ->sortByDesc(function ($page) {
                        $info = $page['imageinfo'][0] ?? [];
                        $w = (int) ($info['width'] ?? 0);
                        $h = (int) ($info['height'] ?? 0);

                        return ($w >= $h ? 100000 : 0) + ($w * $h);
                    })
                    ->values();

                $page = $pages->first();
                if (! $page) {
                    continue;
                }

                $info = $page['imageinfo'][0];
                $url = (string) ($info['thumburl'] ?? $info['url'] ?? '');
                if ($url === '') {
                    continue;
                }

                return [
                    'url' => $url,
                    'source' => 'wikimedia',
                    'attribution' => [
                        'provider' => 'wikimedia-commons',
                        'title' => $page['title'] ?? null,
                        'page_url' => $info['descriptionurl'] ?? null,
                        'query' => $query,
                    ],
                ];
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Wikimedia failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return null;
    }

    /**
     * @param  list<string>  $queries
     * @return array{url: string, source: string, attribution: array<string, mixed>}|null
     */
    protected function fromUnsplash(array $queries): ?array
    {
        $key = trim((string) config('ai_content_engine.images.unsplash_access_key'));
        if ($key === '') {
            return null;
        }

        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders(array_merge($this->headers(), [
                    'Authorization' => 'Client-ID '.$key,
                ]))->timeout(20)->get('https://api.unsplash.com/search/photos', [
                    'query' => $query,
                    'per_page' => 5,
                    'orientation' => 'landscape',
                    'content_filter' => 'high',
                ]);

                if (! $response->successful()) {
                    continue;
                }

                $photo = collect($response->json('results') ?? [])->first();
                $url = data_get($photo, 'urls.regular') ?: data_get($photo, 'urls.full');
                if (! $url) {
                    continue;
                }

                return [
                    'url' => (string) $url,
                    'source' => 'unsplash',
                    'attribution' => [
                        'provider' => 'unsplash',
                        'photographer' => data_get($photo, 'user.name'),
                        'unsplash_url' => data_get($photo, 'links.html'),
                        'query' => $query,
                    ],
                ];
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Unsplash failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return null;
    }

    /**
     * @param  list<string>  $queries
     * @return array{url: string, source: string, attribution: array<string, mixed>}|null
     */
    protected function fromPexels(array $queries): ?array
    {
        $key = trim((string) config('ai_content_engine.images.pexels_api_key'));
        if ($key === '') {
            return null;
        }

        foreach ($queries as $query) {
            try {
                $response = Http::withHeaders(array_merge($this->headers(), [
                    'Authorization' => $key,
                ]))->timeout(20)->get('https://api.pexels.com/v1/search', [
                    'query' => $query,
                    'per_page' => 5,
                    'orientation' => 'landscape',
                ]);

                if (! $response->successful()) {
                    continue;
                }

                $photo = collect($response->json('photos') ?? [])->first();
                $url = data_get($photo, 'src.large2x') ?: data_get($photo, 'src.large');
                if (! $url) {
                    continue;
                }

                return [
                    'url' => (string) $url,
                    'source' => 'pexels',
                    'attribution' => [
                        'provider' => 'pexels',
                        'photographer' => data_get($photo, 'photographer'),
                        'pexels_url' => data_get($photo, 'url'),
                        'query' => $query,
                    ],
                ];
            } catch (\Throwable $e) {
                Log::info('[AIContent][CoverImage] Pexels failed', [
                    'query' => $query,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return null;
    }

    /**
     * Varied curated Unsplash CDN covers so posts never share one generic image.
     */
    protected function curatedFallback(string $seed): string
    {
        $pool = [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80',
        ];

        $index = abs(crc32(Str::slug($seed) ?: 'sigesc')) % count($pool);

        return $pool[$index];
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
            'software|erp|gestão|sigesc|sistema' => 'business software laptop office africa',
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
            $response = Http::withHeaders($this->headers())->timeout(60)->get($url);
            if (! $response->successful()) {
                return null;
            }

            $contentType = strtolower((string) $response->header('Content-Type'));
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
