<?php

namespace App\Services\Seo;

use App\Models\Post;
use Illuminate\Support\Str;

class SeoBuilder
{
    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    public function defaults(array $overrides = []): array
    {
        $siteName = 'SIGESC';
        $url = rtrim(config('app.url') ?: 'https://www.sisgesc.net', '/');

        return array_replace_recursive([
            'site_name' => $siteName,
            'title' => 'SIGESC - Software de Gestão Integrado para Empresas',
            'description' => 'O SIGESC é o software de gestão comercial completo para pequenas e médias empresas. Gerencie PDV, estoque, finanças e compras em uma única plataforma.',
            'keywords' => 'software de gestão, ERP Angola, faturação eletrónica AGT, PDV, gestão comercial, SIGESC',
            'canonical' => $url,
            'og_type' => 'website',
            'og_image' => 'https://admin.sisgesc.net/logo.png',
            'robots' => 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
            'twitter_card' => 'summary_large_image',
            'locale' => 'pt_AO',
            'json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Organization',
                    'name' => $siteName,
                    'url' => $url,
                    'logo' => 'https://admin.sisgesc.net/logo.png',
                ],
            ],
        ], $overrides);
    }

    /**
     * @return array<string, mixed>
     */
    public function forBlogIndex(): array
    {
        $url = route('blog.posts', absolute: true);

        return $this->defaults([
            'title' => 'Blog SIGESC | Faturação Eletrónica AGT e Gestão Comercial em Angola',
            'description' => 'Artigos semanais sobre faturação eletrónica AGT, compliance fiscal e software de gestão comercial para empresas em Angola.',
            'keywords' => 'blog SIGESC, AGT, faturação eletrónica, gestão comercial Angola, ERP',
            'canonical' => $url,
            'og_type' => 'website',
            'json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Blog',
                    'name' => 'Blog SIGESC',
                    'url' => $url,
                    'description' => 'Conteúdo especializado sobre faturação eletrónica e gestão comercial em Angola.',
                    'publisher' => [
                        '@type' => 'Organization',
                        'name' => 'SIGESC',
                        'logo' => [
                            '@type' => 'ImageObject',
                            'url' => 'https://admin.sisgesc.net/logo.png',
                        ],
                    ],
                ],
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function forPost(Post $post): array
    {
        $url = route('blog.posts.show', $post->slug, absolute: true);
        $image = $this->absoluteUrl($post->image);
        $description = $post->meta_description ?: $post->excerpt;
        $title = $post->meta_title ?: $post->title;
        $keywords = collect($post->tags ?? [])->implode(', ');

        $articleLd = [
            '@context' => 'https://schema.org',
            '@type' => 'BlogPosting',
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $url,
            ],
            'headline' => Str::limit($title, 110, ''),
            'description' => $description,
            'image' => array_values(array_filter(array_merge(
                [$image],
                collect($post->media ?? [])
                    ->where('type', 'image')
                    ->pluck('url')
                    ->map(fn ($u) => $this->absoluteUrl($u))
                    ->all()
            ))),
            'datePublished' => optional($post->publish_date)->toAtomString(),
            'dateModified' => optional($post->updated_at)->toAtomString(),
            'author' => [
                '@type' => 'Person',
                'name' => $post->author_name,
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => 'SIGESC',
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => 'https://admin.sisgesc.net/logo.png',
                ],
            ],
            'articleSection' => $post->category,
            'keywords' => $keywords,
            'wordCount' => str_word_count(strip_tags((string) $post->content)),
            'inLanguage' => 'pt-AO',
        ];

        $breadcrumbLd = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                [
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Início',
                    'item' => rtrim(config('app.url') ?: 'https://www.sisgesc.net', '/'),
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => 'Blog',
                    'item' => route('blog.posts', absolute: true),
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 3,
                    'name' => $post->title,
                    'item' => $url,
                ],
            ],
        ];

        $videoLd = collect($post->media ?? [])
            ->where('type', 'video')
            ->map(function (array $video) use ($post, $image) {
                return [
                    '@context' => 'https://schema.org',
                    '@type' => 'VideoObject',
                    'name' => $video['title'] ?? $post->title,
                    'description' => $post->excerpt,
                    'thumbnailUrl' => [$image],
                    'contentUrl' => $video['url'] ?? null,
                    'embedUrl' => $video['embed_url'] ?? null,
                    'uploadDate' => optional($post->publish_date)->toAtomString(),
                ];
            })
            ->values()
            ->all();

        return $this->defaults([
            'title' => $title.' | Blog SIGESC',
            'description' => $description,
            'keywords' => $keywords !== '' ? $keywords : null,
            'canonical' => $url,
            'og_type' => 'article',
            'og_image' => $image,
            'article' => [
                'published_time' => optional($post->publish_date)->toAtomString(),
                'modified_time' => optional($post->updated_at)->toAtomString(),
                'author' => $post->author_name,
                'section' => $post->category,
                'tags' => $post->tags ?? [],
            ],
            'json_ld' => array_values(array_filter(array_merge([$articleLd, $breadcrumbLd], $videoLd))),
        ]);
    }

    protected function absoluteUrl(?string $url): string
    {
        if (! $url) {
            return 'https://admin.sisgesc.net/logo.png';
        }

        if (Str::startsWith($url, ['http://', 'https://'])) {
            return $url;
        }

        return rtrim(config('app.url') ?: 'https://www.sisgesc.net', '/').'/'.ltrim($url, '/');
    }
}
