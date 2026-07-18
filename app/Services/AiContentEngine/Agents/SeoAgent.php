<?php

namespace App\Services\AiContentEngine\Agents;

use App\Models\AiContent\AiJob;
use App\Models\AiContent\Article;
use App\Services\AiContentEngine\Contracts\AgentInterface;
use App\Services\AiContentEngine\Support\AiLogger;
use App\Services\AiContentEngine\Support\CreditSaver;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Support\Str;

class SeoAgent implements AgentInterface
{
    public function __construct(
        protected LlmGateway $llm,
        protected AiLogger $logger
    ) {}

    public function name(): string
    {
        return 'AISEOAgent';
    }

    public function handle(Article $article, AiJob $job, array $context = []): array
    {
        $article->update(['status' => Article::STATUS_SEO]);
        $canonical = url('/blog/posts/'.$article->slug);

        $seo = CreditSaver::heuristicSeo()
            ? $this->buildHeuristicSeo($article, $canonical)
            : $this->llm->chatJson([
                [
                    'role' => 'system',
                    'content' => <<<'PROMPT'
És o AISEOAgent. Otimizas conteúdo empresarial angolano para Google.
JSON:
{
  "meta_title":"",
  "meta_description":"",
  "focus_keyword":"",
  "secondary_keywords":[],
  "tags":[],
  "seo_score":0-100,
  "internal_links":[{"anchor":"","path":""}],
  "external_links":[{"anchor":"","url":""}],
  "image_alt":"",
  "open_graph":{"title":"","description":"","image":""},
  "twitter_card":{"card":"summary_large_image","title":"","description":"","image":""},
  "schema_hints":{}
}
PROMPT
                ],
                [
                    'role' => 'user',
                    'content' => json_encode([
                        'title' => $article->title,
                        'excerpt' => $article->excerpt,
                        'category' => $article->category?->name,
                        'content_html' => Str::limit(strip_tags((string) $article->content_html), 4000, ''),
                        'canonical' => $canonical,
                    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                ],
            ], null, 0.3);

        $faqs = $article->faqs()->get(['question', 'answer_html']);
        $schema = [
            [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $seo['meta_title'] ?? $article->title,
                'description' => $seo['meta_description'] ?? $article->excerpt,
                'datePublished' => optional($article->published_at)->toAtomString(),
                'dateModified' => now()->toAtomString(),
                'author' => ['@type' => 'Organization', 'name' => 'SIGESC'],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => 'SIGESC',
                    'logo' => ['@type' => 'ImageObject', 'url' => 'https://admin.sisgesc.net/logo.png'],
                ],
                'mainEntityOfPage' => $canonical,
                'inLanguage' => 'pt-AO',
            ],
            [
                '@context' => 'https://schema.org',
                '@type' => 'BreadcrumbList',
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Início', 'item' => url('/')],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Blog', 'item' => route('blog.posts')],
                    ['@type' => 'ListItem', 'position' => 3, 'name' => $article->title, 'item' => $canonical],
                ],
            ],
        ];

        if ($faqs->isNotEmpty()) {
            $schema[] = [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => $faqs->map(fn ($f) => [
                    '@type' => 'Question',
                    'name' => $f->question,
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => trim(strip_tags($f->answer_html)),
                    ],
                ])->values()->all(),
            ];
        }

        $og = array_merge([
            'title' => $seo['meta_title'] ?? $article->title,
            'description' => $seo['meta_description'] ?? $article->excerpt,
            'image' => $article->featured_image,
            'url' => $canonical,
            'type' => 'article',
        ], $seo['open_graph'] ?? []);

        $twitter = array_merge([
            'card' => 'summary_large_image',
            'title' => $seo['meta_title'] ?? $article->title,
            'description' => $seo['meta_description'] ?? $article->excerpt,
            'image' => $article->featured_image,
        ], $seo['twitter_card'] ?? []);

        $article->keywords()->where('type', '!=', 'focus')->delete();
        if (! empty($seo['focus_keyword'])) {
            $article->keywords()->updateOrCreate(
                ['keyword' => $seo['focus_keyword'], 'type' => 'focus'],
                ['score' => 100]
            );
        }
        foreach ($seo['secondary_keywords'] ?? [] as $i => $keyword) {
            $article->keywords()->create([
                'keyword' => $keyword,
                'type' => 'secondary',
                'score' => max(10, 90 - ($i * 5)),
            ]);
        }

        $article->tags()->delete();
        foreach ($seo['tags'] ?? [] as $tag) {
            $article->tags()->create(['tag' => $tag, 'slug' => Str::slug($tag)]);
        }

        $meta = $article->pipeline_meta ?? [];
        $meta['seo'] = $seo;

        $article->update([
            'meta_title' => Str::limit($seo['meta_title'] ?? $article->title, 70, ''),
            'meta_description' => Str::limit($seo['meta_description'] ?? $article->excerpt, 160, ''),
            'focus_keyword' => $seo['focus_keyword'] ?? $article->focus_keyword,
            'canonical_url' => $canonical,
            'open_graph' => $og,
            'twitter_card' => $twitter,
            'schema_json_ld' => $schema,
            'seo_score' => (float) ($seo['seo_score'] ?? 0),
            'pipeline_meta' => $meta,
        ]);

        $article->markRevision('seo', $article->content_html, $seo);
        $this->logger->info('SEO generated', $job, $article, $this->name(), [
            'seo_score' => $article->seo_score,
            'focus_keyword' => $article->focus_keyword,
        ]);

        return ['seo' => $seo];
    }

    /**
     * @return array<string, mixed>
     */
    protected function buildHeuristicSeo(Article $article, string $canonical): array
    {
        $title = trim((string) $article->title);
        $excerpt = trim((string) ($article->excerpt ?: Str::limit(strip_tags((string) $article->content_html), 155, '')));
        $focus = $article->focus_keyword
            ?: $article->keywords()->where('type', 'focus')->value('keyword')
            ?: Str::of($title)->lower()->explode(' ')->take(4)->implode(' ');
        $secondary = $article->keywords()
            ->where('type', 'secondary')
            ->pluck('keyword')
            ->take(5)
            ->values()
            ->all();
        $tags = array_values(array_unique(array_filter([
            $article->category?->name,
            'Angola',
            'PME',
            'SIGESC',
            $focus,
        ])));

        $metaTitle = Str::limit($title.(str_contains(Str::lower($title), 'sigesc') ? '' : ' | SIGESC'), 70, '');
        $metaDescription = Str::limit($excerpt.' Gestão comercial com SIGESC.', 160, '');

        return [
            'meta_title' => $metaTitle,
            'meta_description' => $metaDescription,
            'focus_keyword' => $focus,
            'secondary_keywords' => $secondary,
            'tags' => $tags,
            'seo_score' => 82,
            'internal_links' => [
                ['anchor' => 'Soluções SIGESC', 'path' => '/solucoes'],
                ['anchor' => 'Blog SIGESC', 'path' => '/blog/posts'],
            ],
            'external_links' => [],
            'image_alt' => $title.' — SIGESC',
            'open_graph' => [
                'title' => $metaTitle,
                'description' => $metaDescription,
                'image' => $article->featured_image,
            ],
            'twitter_card' => [
                'card' => 'summary_large_image',
                'title' => $metaTitle,
                'description' => $metaDescription,
                'image' => $article->featured_image,
            ],
            'schema_hints' => ['canonical' => $canonical],
            'heuristic' => true,
        ];
    }
}
