<?php

namespace App\Services\Blog;

use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Support\CoverImageService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaEnrichmentService
{
    public function __construct(
        protected OpenAiClient $openAi,
        protected CoverImageService $covers,
    ) {}

    /**
     * Build a media gallery (cover image + optional video) for a generated post.
     *
     * @param  array<string, mixed>  $topic
     * @param  array<string, mixed>  $draft
     * @return array{image: string, media: array<int, array<string, mixed>>}
     */
    public function enrich(array $topic, array $draft): array
    {
        $media = [];
        $cover = null;

        $proxy = new Article([
            'title' => (string) ($draft['title'] ?? $topic['label'] ?? 'Artigo'),
            'slug' => Str::slug((string) ($draft['title'] ?? $topic['key'] ?? 'artigo-blog')),
            'focus_keyword' => (string) ($topic['image_keywords'] ?? $topic['label'] ?? ''),
            'content_html' => (string) ($draft['content_html'] ?? ''),
        ]);

        $prompt = 'Professional editorial cover photo for a business blog about '
            .($topic['label'] ?? $proxy->title)
            .' in Angola. Clean corporate photography, African context when possible, no text overlay, no logos or brand marks, photorealistic.';

        try {
            $resolved = $this->covers->resolve($proxy, $prompt);
            $candidate = (string) ($resolved['url'] ?? '');
            if (Str::startsWith($candidate, ['http://', 'https://'])) {
                $cover = $candidate;
                $media[] = [
                    'type' => 'image',
                    'url' => $cover,
                    'alt' => $draft['title'] ?? $topic['label'],
                    'role' => 'cover',
                    'source' => $resolved['source'] ?? null,
                    'attribution' => $resolved['attribution'] ?? [],
                ];
            }
        } catch (\Throwable $e) {
            Log::info('CoverImageService enrichment failed', ['error' => $e->getMessage()]);
        }

        if (! $cover) {
            $aiImage = $this->openAi->generateImage($prompt);
            if ($aiImage && Str::startsWith($aiImage, ['http://', 'https://'])) {
                $cover = $aiImage;
                $media[] = [
                    'type' => 'image',
                    'url' => $cover,
                    'alt' => $draft['title'] ?? $topic['label'],
                    'role' => 'cover',
                ];
            }
        }

        if (! $cover) {
            // External curated Unsplash CDN — never a local generated SVG.
            $cover = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80';
            $media[] = [
                'type' => 'image',
                'url' => $cover,
                'alt' => $draft['title'] ?? $topic['label'],
                'role' => 'cover',
                'source' => 'curated',
            ];
        }

        $video = $this->youtubeVideo($topic['youtube_query'] ?? $topic['label']);
        if ($video) {
            $media[] = $video;
        }

        // Extra images suggested by the model — store locally when possible; skip brand/logo URLs.
        foreach ($draft['suggested_images'] ?? [] as $suggestion) {
            if (! is_array($suggestion)) {
                continue;
            }

            $url = $suggestion['url'] ?? null;
            if (! is_string($url) || ! Str::startsWith($url, ['http://', 'https://'])) {
                continue;
            }

            $alt = (string) ($suggestion['alt'] ?? ($draft['title'] ?? 'Imagem do artigo'));
            if ($this->covers->looksLikeBrandOrLogo(Str::lower($alt.' '.$url))) {
                continue;
            }

            $stored = $this->storeRemoteImage($url, 'ai-covers');
            $media[] = [
                'type' => 'image',
                'url' => $stored ?: $url,
                'alt' => $alt,
                'role' => 'inline',
            ];
        }

        return [
            'image' => $cover ?: config('ai_content_engine.images.local_fallback', '/img/placeholder-blog.svg'),
            'media' => $media,
        ];
    }

    /**
     * Inject media blocks into HTML content when missing.
     *
     * @param  array<int, array<string, mixed>>  $media
     */
    public function injectMediaIntoContent(string $html, array $media): string
    {
        $blocks = '';

        foreach ($media as $item) {
            if (($item['role'] ?? null) === 'cover') {
                continue;
            }

            if (($item['type'] ?? null) === 'video' && ! empty($item['embed_url'])) {
                $title = e($item['title'] ?? 'Vídeo relacionado');
                $embed = e($item['embed_url']);
                $blocks .= <<<HTML
<figure class="ai-media ai-media-video">
  <div class="ai-video-frame" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:2rem 0;">
    <iframe src="{$embed}" title="{$title}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe>
  </div>
  <figcaption>{$title}</figcaption>
</figure>
HTML;
            }

            if (($item['type'] ?? null) === 'image' && ! empty($item['url'])) {
                $url = e($item['url']);
                $alt = e($item['alt'] ?? '');
                $blocks .= <<<HTML
<figure class="ai-media ai-media-image" style="margin:2rem 0;">
  <img src="{$url}" alt="{$alt}" loading="lazy" style="width:100%;height:auto;border-radius:12px;" />
  <figcaption>{$alt}</figcaption>
</figure>
HTML;
            }
        }

        if ($blocks === '') {
            return $html;
        }

        // Insert after the first paragraph when possible.
        if (preg_match('/<\/p>/i', $html, $match, PREG_OFFSET_CAPTURE)) {
            $pos = $match[0][1] + strlen($match[0][0]);

            return substr($html, 0, $pos).$blocks.substr($html, $pos);
        }

        return $blocks.$html;
    }

    /**
     * @return array<string, mixed>|null
     */
    protected function youtubeVideo(string $query): ?array
    {
        try {
            $response = Http::withHeaders([
                'User-Agent' => config('ai_blog.research.user_agent'),
            ])->timeout(20)->get('https://www.youtube.com/results', [
                'search_query' => $query,
            ]);

            if (! $response->successful()) {
                return null;
            }

            if (! preg_match('/"videoId":"([a-zA-Z0-9_-]{6,})"/', $response->body(), $match)) {
                return null;
            }

            $videoId = $match[1];

            return [
                'type' => 'video',
                'provider' => 'youtube',
                'video_id' => $videoId,
                'url' => "https://www.youtube.com/watch?v={$videoId}",
                'embed_url' => "https://www.youtube.com/embed/{$videoId}",
                'title' => 'Vídeo relacionado: '.$query,
                'role' => 'inline',
            ];
        } catch (\Throwable $e) {
            Log::info('YouTube enrichment failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    protected function storeRemoteImage(string $url, string $folder): ?string
    {
        try {
            $response = Http::timeout(40)->get($url);

            if (! $response->successful()) {
                return null;
            }

            $extension = 'jpg';
            $contentType = $response->header('Content-Type');
            if (is_string($contentType) && str_contains($contentType, 'png')) {
                $extension = 'png';
            } elseif (is_string($contentType) && str_contains($contentType, 'webp')) {
                $extension = 'webp';
            }

            $path = $folder.'/'.Str::uuid().'.'.$extension;
            Storage::disk('public')->put($path, $response->body());

            return Storage::disk('public')->url($path);
        } catch (\Throwable $e) {
            Log::warning('Failed to store remote AI image', ['error' => $e->getMessage()]);

            return null;
        }
    }
}
