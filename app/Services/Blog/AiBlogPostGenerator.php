<?php

namespace App\Services\Blog;

use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiBlogPostGenerator
{
    public function __construct(
        protected WebResearchService $research,
        protected OpenAiClient $openAi,
        protected MediaEnrichmentService $media
    ) {}

    /**
     * Generate and persist weekly posts for every configured topic.
     *
     * @return array<int, Post>
     */
    public function generateWeeklyPosts(): array
    {
        $created = [];
        $perTopic = max(1, (int) config('ai_blog.posts_per_topic', 1));

        foreach (config('ai_blog.topics', []) as $topic) {
            for ($i = 0; $i < $perTopic; $i++) {
                try {
                    $post = $this->generateForTopic($topic);
                    if ($post) {
                        $created[] = $post;
                    }
                } catch (\Throwable $e) {
                    Log::error('AI weekly post generation failed for topic', [
                        'topic' => $topic['key'] ?? null,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        $this->flushBlogCaches();

        return $created;
    }

    /**
     * @param  array<string, mixed>  $topic
     */
    public function generateForTopic(array $topic): ?Post
    {
        $research = $this->research->research($topic['queries'] ?? [$topic['label']]);

        $draft = $this->openAi->chat([
            [
                'role' => 'system',
                'content' => $this->systemPrompt(),
            ],
            [
                'role' => 'user',
                'content' => $this->userPrompt($topic, $research),
            ],
        ]);

        $title = trim((string) ($draft['title'] ?? ''));
        $excerpt = trim((string) ($draft['excerpt'] ?? ''));
        $content = (string) ($draft['content_html'] ?? '');

        if ($title === '' || $excerpt === '' || trim(strip_tags($content)) === '') {
            throw new \RuntimeException('AI draft missing required fields.');
        }

        // Avoid near-duplicate titles in the same week.
        if (Post::withTrashed()
            ->where('title', $title)
            ->where('created_at', '>=', now()->subDays(6))
            ->exists()
        ) {
            Log::info('Skipping AI post with duplicate title', ['title' => $title]);

            return null;
        }

        $enriched = $this->media->enrich($topic, $draft);
        $content = $this->media->injectMediaIntoContent($content, $enriched['media']);

        $wordCount = str_word_count(strip_tags($content));
        $readTime = max(3, (int) ceil($wordCount / 200));

        $author = config('ai_blog.author');

        $post = Post::create([
            'title' => $title,
            'meta_title' => Str::limit((string) ($draft['meta_title'] ?? $title), 70, ''),
            'excerpt' => Str::limit($excerpt, 320, ''),
            'meta_description' => Str::limit(
                (string) ($draft['meta_description'] ?? $excerpt),
                160,
                ''
            ),
            'content' => $content,
            'image' => $enriched['image'],
            'media' => $enriched['media'],
            'category' => $topic['category'] ?? 'Blog',
            'author_name' => $author['name'],
            'author_avatar' => $author['avatar'],
            'author_role' => $author['role'],
            'publish_date' => Carbon::today(),
            'read_time' => $readTime,
            'tags' => array_values(array_unique(array_merge(
                $topic['tags'] ?? [],
                is_array($draft['tags'] ?? null) ? $draft['tags'] : []
            ))),
            'source_urls' => $research['sources'],
            'generation_topic' => $topic['key'] ?? null,
            'is_ai_generated' => true,
            'is_featured' => (bool) ($draft['is_featured'] ?? false),
            'is_published' => true,
            'views' => 0,
        ]);

        Log::info('AI blog post created', [
            'id' => $post->id,
            'slug' => $post->slug,
            'topic' => $topic['key'] ?? null,
        ]);

        return $post;
    }

    protected function systemPrompt(): string
    {
        return <<<'PROMPT'
És um editor sénior de conteúdo B2B para o SIGESC (software de gestão comercial em Angola).
Escreves em português de Portugal/Angola, com tom profissional, claro e útil.
Usa apenas factos suportados pela pesquisa fornecida; quando a informação for incerta, indica isso.
Nunca inventes leis, prazos ou números oficiais.
Liga naturalmente o tema ao valor de um software de gestão comercial moderno (SIGESC) sem ser agressivo em vendas.
Devolve SEMPRE JSON válido com as chaves:
title, meta_title, excerpt, meta_description, content_html, tags (array), is_featured (bool), suggested_images (array de {url, alt}).
content_html deve ser HTML semântico rico (h2, h3, p, ul, ol, blockquote, strong) com 900–1400 palavras.
Inclui secções práticas: contexto, o que muda para empresas, checklist de conformidade/adoção, erros comuns, e conclusão com CTA suave para o SIGESC.
Não uses markdown. Não wraps em ```.
PROMPT;
    }

    /**
     * @param  array<string, mixed>  $topic
     * @param  array<string, mixed>  $research
     */
    protected function userPrompt(array $topic, array $research): string
    {
        $researchJson = json_encode($research, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $week = now()->isoFormat('MMMM YYYY');

        return <<<PROMPT
Tema da semana ({$week}): {$topic['label']}
Categoria editorial: {$topic['category']}
Palavras-chave preferenciais: {$this->tagsToString($topic['tags'] ?? [])}

Pesquisa web (usa como base factual; cita ideias sem copiar texto):
{$researchJson}

Cria um artigo original, atual e otimizado para SEO sobre este tema para o mercado angolano.
PROMPT;
    }

    /**
     * @param  array<int, string>  $tags
     */
    protected function tagsToString(array $tags): string
    {
        return implode(', ', $tags);
    }

    protected function flushBlogCaches(): void
    {
        Cache::forget('featured_posts');
        Cache::forget('recent_posts');
        Cache::forget('trending_posts');
        Cache::forget('post_categories');
        Cache::forget('sitemap_blog_posts');
    }
}
