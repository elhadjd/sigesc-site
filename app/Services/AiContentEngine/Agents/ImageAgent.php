<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageAgent implements AgentInterface
{
    public function __construct(
        protected LlmGateway $llm,
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
            .'" in Angola. Clean corporate photography, no text overlay, professional lighting.';

        $roles = [
            'cover' => '1792x1024',
            'og' => '1792x1024',
            'facebook' => '1792x1024',
            'linkedin' => '1792x1024',
            'whatsapp' => '1024x1024',
        ];

        $images = [];
        $coverUrl = null;
        $remote = $this->llm->generateImage($prompt, '1792x1024');

        if ($remote) {
            $stored = $this->store($remote, $article->slug.'-cover');
            $coverUrl = $stored ?: $remote;
        }

        if (! $coverUrl) {
            $coverUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80';
        }

        $article->images()->delete();

        foreach ($roles as $role => $size) {
            $url = $coverUrl;
            // Optional dedicated generations for social crops when enabled.
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
                'meta' => ['size' => $size],
            ]);

            $images[$role] = $url;
        }

        $og = $article->open_graph ?? [];
        $og['image'] = $images['og'] ?? $coverUrl;
        $twitter = $article->twitter_card ?? [];
        $twitter['image'] = $images['og'] ?? $coverUrl;

        $article->update([
            'featured_image' => $coverUrl,
            'open_graph' => $og,
            'twitter_card' => $twitter,
        ]);

        $this->logger->info('Images generated', $job, $article, $this->name(), [
            'roles' => array_keys($images),
        ]);

        return ['images' => $images];
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
