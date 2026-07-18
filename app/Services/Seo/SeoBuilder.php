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
        $url = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');

        return array_replace_recursive([
            'site_name' => $siteName,
            'title' => 'SIGESC - Software de Gestão Integrado para Empresas',
            'description' => 'O SIGESC é o software de gestão comercial completo para pequenas e médias empresas. Gerencie PDV, estoque, finanças e compras em uma única plataforma.',
            'keywords' => 'software de gestão, ERP Angola, faturação eletrónica AGT, PDV, gestão comercial, SIGESC',
            'canonical' => $url,
            'og_type' => 'website',
            'og_image' => config('sigesc.logo_url'),
            'robots' => 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
            'twitter_card' => 'summary_large_image',
            'locale' => 'pt_AO',
            'json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Organization',
                    'name' => $siteName,
                    'url' => $url,
                    'logo' => config('sigesc.logo_url'),
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
                            'url' => config('sigesc.logo_url'),
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
                    'url' => config('sigesc.logo_url'),
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
                    'item' => rtrim(config('app.url') ?: config('sigesc.site_url'), '/'),
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

    /**
     * Generic marketing / content page SEO.
     *
     * @param  array{title: string, description: string, path?: string, keywords?: string, og_type?: string}  $page
     * @return array<string, mixed>
     */
    public function forPage(array $page): array
    {
        $base = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');
        $path = $page['path'] ?? '/';
        $canonical = str_starts_with($path, 'http') ? $path : $base.'/'.ltrim($path, '/');

        return $this->defaults([
            'title' => $page['title'],
            'description' => $page['description'],
            'keywords' => $page['keywords'] ?? null,
            'canonical' => rtrim($canonical, '/') ?: $base,
            'og_type' => $page['og_type'] ?? 'website',
            'json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebPage',
                    'name' => $page['title'],
                    'description' => $page['description'],
                    'url' => rtrim($canonical, '/') ?: $base,
                    'isPartOf' => [
                        '@type' => 'WebSite',
                        'name' => 'SIGESC',
                        'url' => $base,
                    ],
                    'inLanguage' => 'pt-AO',
                ],
            ],
        ]);
    }

    public function forHome(): array
    {
        return $this->forPage([
            'title' => 'SIGESC - Software de Gestão Integrado para Empresas em Angola',
            'description' => 'Software de gestão comercial completo para PME em Angola: PDV, estoque, finanças, dropshipping, faturação eletrónica AGT e mais — numa só plataforma.',
            'path' => '/',
            'keywords' => 'SIGESC, software gestão Angola, ERP, PDV, dropshipping Angola, faturação eletrónica AGT, PME',
        ]);
    }

    public function forSolutions(): array
    {
        return $this->forPage([
            'title' => 'Soluções SIGESC | Módulos de Gestão Comercial',
            'description' => 'Conheça as soluções SIGESC: ponto de venda, estoque, RH, finanças, logística, loja virtual, dropshipping e módulos feitos para empresas angolanas.',
            'path' => '/solutions',
            'keywords' => 'soluções SIGESC, módulos ERP, PDV Angola, gestão de estoque, dropshipping Angola, loja virtual',
        ]);
    }

    public function forModule(string $moduleName): array
    {
        $slug = Str::slug($moduleName);
        $catalog = collect(config('sigesc_modules', []))
            ->first(fn (array $m) => ($m['slug'] ?? '') === $slug
                || strcasecmp((string) ($m['name'] ?? ''), $moduleName) === 0);

        $description = $catalog['description']
            ?? "Saiba como o módulo {$moduleName} do SIGESC ajuda a gerir o seu negócio em Angola com eficiência e conformidade.";
        $keywords = $catalog['keywords']
            ?? "SIGESC {$moduleName}, módulo gestão, software Angola";

        return $this->forPage([
            'title' => "Módulo {$moduleName} | SIGESC Angola",
            'description' => $description,
            'path' => '/modules/'.($catalog['slug'] ?? $slug),
            'keywords' => $keywords,
        ]);
    }

    public function forPrices(): array
    {
        return $this->forPage([
            'title' => 'Preços SIGESC | Planos para PME em Angola',
            'description' => 'Planos e preços do software de gestão SIGESC. Escolha o plano ideal para a sua empresa em Angola.',
            'path' => '/prices',
            'keywords' => 'preços SIGESC, planos ERP Angola, software gestão preço',
        ]);
    }

    public function forContact(): array
    {
        return $this->forPage([
            'title' => 'Contacto | SIGESC Angola',
            'description' => 'Fale com a equipa SIGESC. Suporte comercial e técnico para empresas em Angola.',
            'path' => '/contact',
            'keywords' => 'contacto SIGESC, suporte, Angola',
        ]);
    }

    public function forAskExpert(): array
    {
        return $this->forPage([
            'title' => 'Pergunte ao Especialista | SIGESC',
            'description' => 'Faça uma pergunta sobre AGT, IVA, gestão comercial ou empreendedorismo em Angola. A IA do SIGESC pesquisa e responde com base em fontes.',
            'path' => '/pergunte-ao-especialista',
            'keywords' => 'pergunte ao especialista, AGT, IVA Angola, SIGESC',
        ]);
    }

    public function forDownloads(): array
    {
        return $this->forPage([
            'title' => 'Downloads SIGESC | Instalar o software',
            'description' => 'Descarregue o SIGESC Admin e comece a gerir a sua empresa com PDV, stock e faturação.',
            'path' => '/downloads',
            'keywords' => 'download SIGESC, instalar ERP, software gestão Angola',
        ]);
    }

    public function forShop(?string $page = null): array
    {
        $path = $page ? '/shop/'.$page : '/shop';

        return $this->forPage([
            'title' => ($page ? Str::headline($page).' | ' : '').'Loja SIGESC',
            'description' => 'Loja SIGESC: livros, recursos e produtos para empresários e gestores em Angola.',
            'path' => $path,
            'keywords' => 'loja SIGESC, livros gestão, recursos empresariais Angola',
        ]);
    }

    public function forClients(string $page): array
    {
        return $this->forPage([
            'title' => 'Clientes SIGESC | '.Str::headline($page),
            'description' => 'Conheça empresas que usam o SIGESC e depoimentos de clientes em Angola.',
            'path' => '/clients/'.$page,
            'keywords' => 'clientes SIGESC, depoimentos, casos de sucesso',
        ]);
    }

    public function forResource(string $resource): array
    {
        $labels = [
            'help' => 'Ajuda',
            'faq' => 'Perguntas frequentes',
            'privacy' => 'Política de privacidade',
            'terms' => 'Termos de uso',
        ];
        $label = $labels[$resource] ?? Str::headline($resource);

        return $this->forPage([
            'title' => "{$label} | SIGESC",
            'description' => "{$label} do SIGESC — informação útil para utilizadores e empresas em Angola.",
            'path' => '/resources/'.$resource,
            'keywords' => "SIGESC {$label}, recursos, suporte",
        ]);
    }

    protected function absoluteUrl(?string $url): string
    {
        if (! $url) {
            return config('sigesc.logo_url');
        }

        if (Str::startsWith($url, ['http://', 'https://'])) {
            return $url;
        }

        return rtrim(config('app.url') ?: config('sigesc.site_url'), '/').'/'.ltrim($url, '/');
    }
}
