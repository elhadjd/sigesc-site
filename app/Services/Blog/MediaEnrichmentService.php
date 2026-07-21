<?php

namespace App\Services\Blog;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaEnrichmentService
{
    public function __construct(
        protected OpenAiClient $openAi
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

        $aiImage = $this->openAi->generateImage(
            'Professional editorial cover photo for a business blog about '.$topic['label']
            .' in Angola. Clean corporate style, no text overlay, photorealistic.'
        );

        if ($aiImage) {
            $stored = $this->storeRemoteImage($aiImage, 'ai-covers');
            if ($stored) {
                $cover = $stored;
                $media[] = [
                    'type' => 'image',
                    'url' => $stored,
                    'alt' => $draft['title'] ?? $topic['label'],
                    'role' => 'cover',
                ];
            }
        }

        if (! $cover) {
            $unsplash = $this->unsplashCover($topic['image_keywords'] ?? $topic['label']);
            if ($unsplash) {
                $cover = $unsplash;
                $media[] = [
                    'type' => 'image',
                    'url' => $unsplash,
                    'alt' => $draft['title'] ?? $topic['label'],
                    'role' => 'cover',
                ];
            }
        }

        $video = $this->youtubeVideo($topic['youtube_query'] ?? $topic['label']);
        if ($video) {
            $media[] = $video;
        }

        // Extra images suggested by the model
        foreach ($draft['suggested_images'] ?? [] as $suggestion) {
            if (! is_array($suggestion)) {
                continue;
            }

            $url = $suggestion['url'] ?? null;
            if (! is_string($url) || ! Str::startsWith($url, ['http://', 'https://'])) {
                continue;
            }

            $media[] = [
                'type' => 'image',
                'url' => $url,
                'alt' => $suggestion['alt'] ?? ($draft['title'] ?? 'Imagem do artigo'),
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

    protected function unsplashCover(string $keywords): ?string
    {
        $slug = Str::slug($keywords);
        // Source Unsplash provides a stable random image for a keyword set.
        $url = 'https://source.unsplash.com/1600x900/?'.urlencode($keywords);

        try {
            $response = Http::withHeaders([
                'User-Agent' => config('ai_blog.research.user_agent'),
            ])->withOptions([
                'allow_redirects' => false,
            ])->timeout(15)->get($url);

            $location = $response->header('Location');

            if ($location && Str::startsWith($location, ['http://', 'https://'])) {
                return $location;
            }

            // Some environments resolve immediately; store the redirect target URL as-is.
            if ($response->successful()) {
                return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80&sig={$slug}";
            }
        } catch (\Throwable $e) {
            Log::info('Unsplash cover lookup failed', ['error' => $e->getMessage()]);
        }

        return "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1600&q=80&sig={$slug}";
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
