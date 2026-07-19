<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\CoverImageService;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageAgent implements AgentInterface
{
    public function __construct(
        protected LlmGateway $llm,
        protected CoverImageService $covers,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AIImageAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $article->update(['status' => Article::STATUS_IMAGING]);

        $alt = $article->pipeline_meta['seo']['image_alt']
            ?? ($article->focus_keyword ?: $article->title);

        $prompt = 'Editorial cover photo for a business knowledge article about "'
            .$article->title
            .'" in Angola. Clean corporate photography, African context when possible, no text overlay, professional lighting.';

        $roles = [
            'cover' => '1792x1024',
            'og' => '1792x1024',
            'facebook' => '1792x1024',
            'linkedin' => '1792x1024',
            'whatsapp' => '1024x1024',
        ];

        $resolved = $this->covers->resolve($article, $prompt);
        $coverUrl = (string) $resolved['url'];
        $source = (string) ($resolved['source'] ?? 'unknown');
        $attribution = is_array($resolved['attribution'] ?? null) ? $resolved['attribution'] : [];

        $images = [];
        $article->images()->delete();

        foreach ($roles as $role => $size) {
            $url = $coverUrl;

            if ($role !== 'cover' && ($context['generate_variants'] ?? false)) {
                $variant = $this->llm->generateImage($prompt.' Format suited for '.$role, $size);
                if ($variant) {
                    $url = $this->store($variant, $article->slug.'-'.$role) ?: $variant;
                }
            }

            $article->images()->create([
                'role' => $role,
                'url' => $url,
                'alt' => $alt,
                'meta' => [
                    'size' => $size,
                    'source' => $source,
                    'attribution' => $attribution,
                ],
            ]);

            $images[$role] = $url;
        }

        $og = $article->open_graph ?? [];
        $og['image'] = $images['og'] ?? $coverUrl;
        $twitter = $article->twitter_card ?? [];
        $twitter['image'] = $images['og'] ?? $coverUrl;

        $contentHtml = $this->injectCoverIntoContent(
            (string) $article->content_html,
            $coverUrl,
            (string) $alt
        );

        $meta = $article->pipeline_meta ?? [];
        $meta['cover_image'] = [
            'source' => $source,
            'attribution' => $attribution,
            'url' => $coverUrl,
        ];

        $article->update([
            'featured_image' => $coverUrl,
            'content_html' => $contentHtml,
            'open_graph' => $og,
            'twitter_card' => $twitter,
            'pipeline_meta' => $meta,
        ]);

        $this->logger->info('Images resolved', $job, $article, $this->name(), [
            'source' => $source,
            'roles' => array_keys($images),
            'url' => $coverUrl,
        ]);

        return [
            'images' => $images,
            'source' => $source,
            'attribution' => $attribution,
        ];
    }

    protected function injectCoverIntoContent(string $html, string $coverUrl, string $alt): string
    {
        $html = trim($html);
        if ($html === '' || $coverUrl === '') {
            return $html;
        }

        if (str_contains($html, $coverUrl) || str_contains($html, 'class="ai-cover"')) {
            return $html;
        }

        $figure = '<figure class="ai-cover" style="margin:0 0 1.5rem;">'
            .'<img src="'.e($coverUrl).'" alt="'.e($alt).'" loading="eager" '
            .'style="width:100%;height:auto;border-radius:14px;display:block;" />'
            .'</figure>';

        // Keep cover at the top so blog cards and SSR show a real visual immediately.
        return $figure."\n".$html;
    }

    protected function store(string $url, string $name): ?string
    {
        try {
            $response = Http::timeout(60)->get($url);
            if (! $response->successful()) {
                return null;
            }

            $ext = str_contains((string) $response->header('Content-Type'), 'png') ? 'png' : 'jpg';
            $path = trim(config('ai_content_engine.storage.image_folder'), '/').'/'
                .Str::slug($name).'-'.Str::random(6).'.'.$ext;

            $disk = config('ai_content_engine.storage.disk', 'public');
            Storage::disk($disk)->put($path, $response->body());

            return Storage::disk($disk)->url($path);
        } catch (\Throwable) {
            return null;
        }
    }
}
