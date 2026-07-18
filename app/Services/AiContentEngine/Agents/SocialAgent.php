<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\CreditSaver;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Str;

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

        $social = CreditSaver::heuristicSocial()
            ? $this->buildHeuristicSocial($article, $url)
            : $this->llm->chatJson([
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

    /**
     * @return array<string, mixed>
     */
    protected function buildHeuristicSocial(Article $article, string $url): array
    {
        $title = trim((string) $article->title);
        $excerpt = trim((string) ($article->excerpt ?: $title));
        $hashtags = array_values(array_filter([
            '#SIGESC',
            '#Angola',
            '#PME',
            '#Empreendedorismo',
            $article->focus_keyword ? '#'.Str::studly(Str::slug($article->focus_keyword, '')) : null,
        ]));

        $long = "{$title}\n\n{$excerpt}\n\nLeia no blog SIGESC e organize a sua gestão comercial com ferramentas feitas para Angola.\n\n{$url}";
        $short = Str::limit("{$title} — dicas para empresários em Angola. {$url}", 240, '');

        return [
            'facebook' => ['text' => $long, 'hashtags' => $hashtags],
            'instagram' => ['text' => $long, 'hashtags' => $hashtags],
            'linkedin' => ['text' => $long, 'hashtags' => $hashtags],
            'whatsapp' => ['text' => "{$title}\n{$url}"],
            'twitter' => ['text' => $short, 'hashtags' => array_slice($hashtags, 0, 3)],
            'threads' => ['text' => $short, 'hashtags' => $hashtags],
            'heuristic' => true,
        ];
    }
}
