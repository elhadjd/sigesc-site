<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\LlmGateway;

class SocialAgent implements AgentInterface
{
    public function __construct(
        protected LlmGateway $llm,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AISocialAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $article->update(['status' => Article::STATUS_SOCIAL]);
        $url = $article->canonical_url ?: url('/blog/posts/'.$article->slug);

        $social = $this->llm->chatJson([
            [
                'role' => 'system',
                'content' => <<<'PROMPT'
És o AISocialAgent. Crias posts adaptados por rede, em português de Angola, tom profissional e útil.
JSON:
{
  "facebook":{"text":"","hashtags":[]},
  "instagram":{"text":"","hashtags":[]},
  "linkedin":{"text":"","hashtags":[]},
  "whatsapp":{"text":""},
  "twitter":{"text":"","hashtags":[]},
  "threads":{"text":"","hashtags":[]}
}
Inclui CTA suave para ler o artigo. Twitter/X max ~240 chars no text.
PROMPT
            ],
            [
                'role' => 'user',
                'content' => json_encode([
                    'title' => $article->title,
                    'excerpt' => $article->excerpt,
                    'url' => $url,
                    'focus_keyword' => $article->focus_keyword,
                    'image' => $article->featured_image,
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ], null, 0.6);

        // Ensure URL present in each network text.
        foreach ($social as $network => &$payload) {
            if (! is_array($payload)) {
                continue;
            }
            $text = (string) ($payload['text'] ?? '');
            if ($text !== '' && ! str_contains($text, $url)) {
                $payload['text'] = trim($text."\n\n".$url);
            }
        }
        unset($payload);

        $article->update(['social_posts' => $social]);
        $article->markRevision('social', $article->content_html, $social);

        $this->logger->info('Social variants created', $job, $article, $this->name(), [
            'networks' => array_keys($social),
        ]);

        return ['social_posts' => $social];
    }
}
