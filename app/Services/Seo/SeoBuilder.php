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
        $geo = app(GeoManifest::class);
        $coreLd = $geo->coreJsonLd();

        $overrideJsonLd = null;
        if (array_key_exists('json_ld', $overrides)) {
            $overrideJsonLd = $overrides['json_ld'];
            unset($overrides['json_ld']);
        }

        $base = [
            'site_name' => $siteName,
            'title' => 'SIGESC - Software de Gestão Integrado para Empresas',
            'description' => (string) (config('geo.brand.description') ?: 'O SIGESC é o software de gestão comercial completo para pequenas e médias empresas. Gerencie PDV, estoque, finanças e compras em uma única plataforma.'),
            'keywords' => $geo->keywordsCsv(),
            'canonical' => $url,
            'og_type' => 'website',
            'og_image' => config('sigesc.logo_url'),
            'robots' => 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
            'twitter_card' => 'summary_large_image',
            'locale' => 'pt_AO',
            'agt_certification_number' => config('geo.certification.number', config('sigesc.agt_certification.number', 'FE/323/AGT/2026')),
            'geo_links' => $geo->headLinks(),
            'json_ld' => $coreLd,
        ];

        $merged = array_replace_recursive($base, $overrides);

        if (is_array($overrideJsonLd)) {
            $merged['json_ld'] = array_values(array_merge($coreLd, $overrideJsonLd));
        }

        return $merged;
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
        $canonical = rtrim($canonical, '/') ?: $base;

        $jsonLd = [
            [
                '@context' => 'https://schema.org',
                '@type' => 'WebPage',
                'name' => $page['title'],
                'description' => $page['description'],
                'url' => $canonical,
                'isPartOf' => [
                    '@type' => 'WebSite',
                    'name' => 'SIGESC',
                    'url' => $base,
                ],
                'inLanguage' => 'pt-AO',
            ],
        ];

        if (! empty($page['faq']) && is_array($page['faq'])) {
            $jsonLd[] = $this->faqPageJsonLd($page['faq']);
        }

        if (! empty($page['extra_json_ld']) && is_array($page['extra_json_ld'])) {
            $jsonLd = array_values(array_merge($jsonLd, $page['extra_json_ld']));
        }

        $payload = [
            'title' => $page['title'],
            'description' => $page['description'],
            'keywords' => $page['keywords'] ?? null,
            'canonical' => $canonical,
            'og_type' => $page['og_type'] ?? 'website',
            'json_ld' => $jsonLd,
        ];

        if (! empty($page['og_image'])) {
            $payload['og_image'] = $page['og_image'];
        }

        if (! empty($page['robots'])) {
            $payload['robots'] = $page['robots'];
        }

        return $this->defaults($payload);
    }

    public function forHome(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');

        return $this->forPage([
            'title' => "SIGESC — Software de Faturação Certificado AGT {$agt} em Angola",
            'description' => "Software de faturação certificado pela AGT em Angola (n.º {$agt}). PDV, stock, finanças, dropshipping e faturação eletrónica para PME — numa só plataforma.",
            'path' => '/',
            'keywords' => app(GeoManifest::class)->keywordsCsv(),
            'faq' => config('geo.faqs', []),
        ]);
    }

    public function forAbout(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $price = config('geo.partnership.price_formatted', '40.000 Kz');

        return $this->forPage([
            'title' => "Sobre o SIGESC | Software de Faturação Certificado AGT {$agt}",
            'description' => "Conheça o SIGESC: software de faturação certificado pela AGT em Angola (n.º {$agt}). ERP/PDV, stock, finanças e e-commerce. Parceria {$price}/mês com licenças ilimitadas; Freelancer com comissão.",
            'path' => '/sobre',
            'keywords' => app(GeoManifest::class)->keywordsCsv(),
            'faq' => config('geo.faqs', []),
        ]);
    }

    public function forSolutions(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');

        return $this->forPage([
            'title' => "Soluções SIGESC | Faturação Certificada AGT {$agt} e Módulos",
            'description' => "Soluções SIGESC com faturação eletrónica certificada AGT ({$agt}): PDV, stock, RH, finanças, logística, loja virtual e dropshipping para empresas em Angola.",
            'path' => '/solutions',
            'keywords' => app(GeoManifest::class)->keywordsCsv(),
            'faq' => array_slice(config('geo.faqs', []), 0, 4),
        ]);
    }

    public function forModule(string $moduleName): array
    {
        $slug = Str::slug($moduleName);
        $catalog = collect(config('sigesc_modules', []))
            ->first(fn (array $m) => ($m['slug'] ?? '') === $slug
                || strcasecmp((string) ($m['name'] ?? ''), $moduleName) === 0);

        if (($catalog['slug'] ?? $slug) === 'crm') {
            return $this->forCrm();
        }

        if (in_array($catalog['slug'] ?? $slug, ['chamadas-e-conferencias', 'conferencias', 'chamadas'], true)) {
            return $this->forConferences();
        }

        if (($catalog['slug'] ?? $slug) === 'marketplace') {
            return $this->forMarketplace();
        }

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

    public function forMarketplace(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $hero = \App\Support\MarketplaceMedia::heroSrc();
        $base = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');
        $url = $base.'/modules/marketplace';
        $marketplaceUrl = (string) config('sigesc.marketplace_home_url', 'https://marketplace.sisgesc.net/marketplace');

        $faqs = [
            [
                'question' => 'O que é o Marketplace SIGESC?',
                'answer' => 'É a área pública onde empresas e pessoas singulares listam o negócio por cidade, publicam produtos ou serviços, e os clientes pesquisam, compram ou agendam online em marketplace.sisgesc.net.',
            ],
            [
                'question' => 'Quem pode listar no Marketplace?',
                'answer' => 'Empresas e pessoas singulares podem criar o perfil do negócio e publicar produtos ou serviços na cidade onde se encontram.',
            ],
            [
                'question' => 'Os clientes precisam do software SIGESC para comprar?',
                'answer' => 'Não. Os clientes acedem ao Marketplace na internet, encontram o negócio e podem comprar produtos ou agendar serviços sem instalar o painel SIGESC.',
            ],
            [
                'question' => 'Onde aceder ao Marketplace?',
                'answer' => 'Em '.$marketplaceUrl.' — também a partir desta página de apresentação no site sisgesc.net.',
            ],
            [
                'question' => 'O Marketplace está ligado ao SIGESC certificado AGT?',
                'answer' => "Sim. Faz parte do ecossistema SIGESC, software de faturação eletrónica certificado pela AGT (n.º {$agt}), para PME e negócios em Angola.",
            ],
        ];

        $payload = [
            'title' => 'Marketplace SIGESC | Empresas, Produtos e Serviços Locais em Angola',
            'description' => 'Marketplace SIGESC: liste a sua empresa, publique produtos e serviços na sua cidade. Clientes pesquisam, compram e agendam online em marketplace.sisgesc.net — descoberta local para PME em Angola.',
            'path' => '/modules/marketplace',
            'keywords' => implode(', ', [
                'marketplace Angola',
                'marketplace local Angola',
                'marketplace SIGESC',
                'comprar online Angola',
                'agendar serviços online Angola',
                'empresas perto de mim Angola',
                'diretório de empresas Luanda',
                'vender produtos online Angola',
                'serviços locais Angola',
                'marketplace PME Angola',
                'negócios locais online',
                'marketplace.sisgesc.net',
                'encontrar empresas Angola',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'SoftwareApplication',
                    'name' => 'SIGESC Marketplace',
                    'applicationCategory' => 'BusinessApplication',
                    'operatingSystem' => 'Web',
                    'description' => 'Marketplace local do SIGESC: listagem de empresas, produtos e serviços por cidade; compras e agendamentos online em Angola.',
                    'url' => $url,
                    'sameAs' => [$marketplaceUrl, 'https://marketplace.sisgesc.net'],
                    'image' => $hero ? $base.$hero : config('sigesc.logo_url'),
                    'offers' => [
                        '@type' => 'Offer',
                        'url' => $marketplaceUrl,
                        'priceCurrency' => 'AOA',
                        'availability' => 'https://schema.org/InStock',
                        'areaServed' => [
                            '@type' => 'Country',
                            'name' => 'Angola',
                        ],
                    ],
                    'featureList' => [
                        'Listagem de empresas e negócios locais',
                        'Publicação de produtos e serviços por cidade',
                        'Pesquisa por categorias e localização',
                        'Compras online',
                        'Agendamento de serviços',
                    ],
                ],
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebSite',
                    'name' => 'SIGESC Marketplace',
                    'url' => 'https://marketplace.sisgesc.net',
                    'description' => 'Descubra empresas, produtos e serviços locais no Marketplace SIGESC.',
                    'inLanguage' => ['pt-AO', 'en'],
                ],
            ],
        ];

        if ($hero) {
            $payload['og_image'] = $base.$hero;
        }

        return $this->forPage($payload);
    }

    public function forConferences(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $hero = \App\Support\ConferenceMedia::heroSrc();
        $base = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');
        $url = $base.'/modules/chamadas-e-conferencias';

        $faqs = [
            [
                'question' => 'O que são as chamadas e conferências do SIGESC?',
                'answer' => 'É o módulo de videoconferência do SIGESC: as empresas criam reuniões internas ou com convidados externos, fazem chamadas diretas entre utilizadores, partilham ecrã e podem gravar a conferência — tudo dentro do software de gestão.',
            ],
            [
                'question' => 'O cliente precisa de conta SIGESC para entrar na conferência?',
                'answer' => 'Não. Pode criar um link de conferência e enviá-lo ao cliente; o convidado acede pelo link e entra na reunião sem ter conta no sistema.',
            ],
            [
                'question' => 'Posso fazer chamadas diretas entre colaboradores?',
                'answer' => 'Sim. Além das salas de conferência, há chamadas diretas de um utilizador para outro dentro da empresa.',
            ],
            [
                'question' => 'Dá para partilhar e gravar o ecrã?',
                'answer' => 'Sim. Durante a conferência pode partilhar o ecrã com os participantes e gravar a sessão para arquivo, formação ou acompanhamento comercial.',
            ],
            [
                'question' => 'As conferências fazem parte do mesmo SIGESC da faturação AGT?',
                'answer' => "Sim. O módulo está no SIGESC, software de faturação eletrónica certificado pela AGT (n.º {$agt}), junto de CRM, PDV e gestão da PME.",
            ],
        ];

        $payload = [
            'title' => 'Chamadas e Conferências SIGESC | Videoconferência para PME em Angola',
            'description' => 'Videoconferência no SIGESC: reuniões internas, link para clientes sem conta, chamadas diretas, partilha de ecrã e gravação. Reúna a equipa ou o cliente dentro do software de gestão em Angola.',
            'path' => '/modules/chamadas-e-conferencias',
            'keywords' => implode(', ', [
                'videoconferência Angola',
                'software reunião online Angola',
                'conferência de vídeo PME',
                'chamada de vídeo empresa Angola',
                'reunião online com cliente',
                'link de conferência',
                'partilha de ecrã reunião',
                'gravação de videoconferência',
                'software chamadas empresariais Angola',
                'reunião interna online',
                'SIGESC conferências',
                'videoconferência Luanda',
                'meeting online PME Angola',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'SoftwareApplication',
                    'name' => 'SIGESC Chamadas e Conferências',
                    'applicationCategory' => 'BusinessApplication',
                    'operatingSystem' => 'Web, Windows',
                    'description' => 'Módulo de chamadas e videoconferência do SIGESC: reuniões internas e com convidados, chamadas diretas, partilha e gravação de ecrã para PME em Angola.',
                    'url' => $url,
                    'image' => $hero ? $base.$hero : config('sigesc.logo_url'),
                    'offers' => [
                        '@type' => 'Offer',
                        'url' => $base.'/prices',
                        'priceCurrency' => 'AOA',
                        'availability' => 'https://schema.org/InStock',
                        'areaServed' => [
                            '@type' => 'Country',
                            'name' => 'Angola',
                        ],
                    ],
                    'featureList' => [
                        'Conferências internas e com convidados',
                        'Link de acesso sem conta SIGESC',
                        'Chamadas diretas entre utilizadores',
                        'Partilha de ecrã',
                        'Gravação de ecrã na conferência',
                    ],
                ],
            ],
        ];

        if ($hero) {
            $payload['og_image'] = $base.$hero;
        }

        return $this->forPage($payload);
    }

    public function forCrm(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $hero = \App\Support\CrmScreenshots::heroSrc();
        $url = rtrim(config('app.url') ?: config('sigesc.site_url'), '/').'/modules/crm';

        $faqs = [
            [
                'question' => 'O que é o CRM do SIGESC?',
                'answer' => 'É o módulo de gestão comercial do SIGESC para PME em Angola: pipeline de vendas, contactos, atividades, WhatsApp, email e relatórios — no mesmo sistema da faturação eletrónica AGT.',
            ],
            [
                'question' => 'O CRM SIGESC integra WhatsApp e email?',
                'answer' => 'Sim. Pode acompanhar conversas com clientes via WhatsApp e email ligadas ao contacto e ao negócio no funil.',
            ],
            [
                'question' => 'O CRM está ligado à faturação AGT?',
                'answer' => "Sim. O CRM faz parte do SIGESC, software de faturação eletrónica certificado pela AGT (n.º {$agt}), com PDV, stock e finanças na mesma plataforma.",
            ],
            [
                'question' => 'Para quem é o módulo CRM?',
                'answer' => 'Para equipas comerciais, lojas, prestadores de serviços e PME em Luanda e noutras províncias que precisam de organizar leads, follow-ups e fechos de venda.',
            ],
            [
                'question' => 'Como experimentar o CRM SIGESC?',
                'answer' => 'Peça demonstração em sisgesc.net/contact ou inicie o trial em admin.sisgesc.net/getting-started.',
            ],
        ];

        $payload = [
            'title' => 'CRM SIGESC | Pipeline, WhatsApp e Gestão de Clientes em Angola',
            'description' => "CRM comercial do SIGESC para PME em Angola: pipeline de vendas, contactos, atividades, WhatsApp, email e relatórios. Integrado à faturação eletrónica AGT ({$agt}), PDV e gestão da empresa.",
            'path' => '/modules/crm',
            'keywords' => implode(', ', [
                'CRM Angola',
                'software CRM Angola',
                'CRM SIGESC',
                'gestão de clientes Angola',
                'pipeline de vendas Angola',
                'CRM WhatsApp Angola',
                'funil de vendas PME',
                'CRM Luanda',
                'software comercial Angola',
                'gestão de leads Angola',
                'CRM faturação AGT',
                'sistema CRM PME Angola',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'SoftwareApplication',
                    'name' => 'SIGESC CRM',
                    'applicationCategory' => 'BusinessApplication',
                    'operatingSystem' => 'Web, Windows',
                    'description' => 'Módulo CRM do SIGESC: pipeline, contactos, WhatsApp, email e relatórios para PME em Angola.',
                    'url' => $url,
                    'image' => $hero ? (rtrim(config('app.url') ?: config('sigesc.site_url'), '/').$hero) : config('sigesc.logo_url'),
                    'offers' => [
                        '@type' => 'Offer',
                        'url' => rtrim(config('app.url') ?: config('sigesc.site_url'), '/').'/prices',
                        'priceCurrency' => 'AOA',
                        'availability' => 'https://schema.org/InStock',
                        'areaServed' => [
                            '@type' => 'Country',
                            'name' => 'Angola',
                        ],
                    ],
                    'featureList' => [
                        'Pipeline de vendas',
                        'Gestão de contactos e leads',
                        'Atividades e follow-ups',
                        'WhatsApp e email integrados',
                        'Relatórios comerciais',
                        'Integração com faturação AGT',
                    ],
                ],
            ],
        ];

        if ($hero) {
            $payload['og_image'] = rtrim(config('app.url') ?: config('sigesc.site_url'), '/').$hero;
        }

        return $this->forPage($payload);
    }

    public function forPrices(): array
    {
        $price = config('geo.partnership.price_formatted', '40.000 Kz');
        $commission = (int) config('geo.partnership.freelancer.commission_percent', 30);

        return $this->forPage([
            'title' => 'Preços SIGESC | Planos para PME em Angola',
            'description' => "Planos e preços do software de gestão SIGESC para empresas em Angola. Veja também a parceria {$price}/mês com licenças ilimitadas e Freelancer com {$commission}% de comissão.",
            'path' => '/prices',
            'keywords' => 'preços SIGESC, planos ERP Angola, software gestão preço, parceria 40000 Kz, freelancer comissão SIGESC',
            'faq' => [
                [
                    'question' => 'Onde ver o preço da parceria?',
                    'answer' => "A parceria Parceiro custa {$price}/mês com licenças ilimitadas. Freelancers ganham {$commission}% de comissão. Detalhes em sisgesc.net/parceria.",
                ],
                [
                    'question' => 'Os planos cloud estão nesta página?',
                    'answer' => 'Sim. Os planos cloud SIGESC são listados em /prices. Para trial use admin.sisgesc.net/getting-started.',
                ],
            ],
        ]);
    }

    public function forPartnership(): array
    {
        $url = route('partnership.index', absolute: true);
        $cfg = config('sigesc.partnership', []);
        $price = (int) ($cfg['monthly_price'] ?? 40000);
        $priceLabel = number_format($price, 0, ',', '.').' '.($cfg['currency_label'] ?? 'Kz');
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $commission = (int) data_get($cfg, 'freelancer.commission_percent', 30);

        $faqs = [
            [
                'question' => 'Quanto custa a parceria SIGESC?',
                'answer' => "O plano Parceiro custa {$priceLabel} por mês, com licenças ilimitadas. Freelancers que indicam clientes ganham {$commission}% de comissão.",
            ],
            [
                'question' => 'As licenças são ilimitadas?',
                'answer' => 'Sim. No plano Parceiro as licenças cloud e offline são ilimitadas.',
            ],
            [
                'question' => 'O que é a parceria Freelancer?',
                'answer' => "Freelancers indicam o SIGESC a clientes e ganham {$commission}% de comissão sobre as vendas fechadas. Não há mensalidade — só comissão.",
            ],
            [
                'question' => 'O que um parceiro SIGESC pode oferecer aos clientes?',
                'answer' => 'Pode apresentar, implementar e acompanhar o software de gestão comercial SIGESC: faturação eletrónica certificada AGT ('.$agt.'), PDV, stock, finanças, RH e módulos relacionados para empresas angolanas.',
            ],
            [
                'question' => 'Como me candidatar a parceiro ou freelancer SIGESC?',
                'answer' => 'Aceda a sisgesc.net/parceria, escolha Parceiro ou Freelancer e envie o pedido por contacto ou registo de conta.',
            ],
            [
                'question' => 'A parceria cobre Luanda e outras províncias?',
                'answer' => 'Sim. O programa de parceria SIGESC está aberto a consultores, contabilistas, freelancers e revendedores em Luanda e no resto de Angola.',
            ],
        ];

        return $this->forPage([
            'title' => 'Parceria SIGESC | '.$priceLabel.'/mês · Freelancer '.$commission.'%',
            'description' => "Parceiro SIGESC: {$priceLabel}/mês com licenças ilimitadas. Freelancer: indique clientes e ganhe {$commission}% de comissão. Software certificado AGT ({$agt}) em Angola.",
            'path' => '/parceria',
            'keywords' => implode(', ', [
                'parceria SIGESC',
                'parceiro SIGESC Angola',
                'freelancer SIGESC',
                'comissão indicação software Angola',
                'revenda software gestão Angola',
                'licença ilimitada SIGESC',
                'software gestão offline Angola',
                'programa de parceiros ERP Angola',
                'revendedor faturação eletrónica AGT',
                'parceiro PDV Angola',
                'licença SIGESC mensal 40000',
                'implementador SIGESC Luanda',
                'distribuidor ERP Angola',
                'SIGESC versão offline',
                'parceria software PME Angola',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Product',
                    'name' => 'Programa de Parceria SIGESC — Parceiro',
                    'description' => "Parceria mensal com o sistema SIGESC para revenda e implantação em Angola, com licenças ilimitadas. Certificação AGT {$agt}.",
                    'brand' => [
                        '@type' => 'Brand',
                        'name' => 'SIGESC',
                    ],
                    'category' => 'Business partnership / software licensing',
                    'areaServed' => [
                        '@type' => 'Country',
                        'name' => 'Angola',
                    ],
                    'offers' => [
                        '@type' => 'Offer',
                        'url' => $url,
                        'price' => (string) $price,
                        'priceCurrency' => $cfg['currency'] ?? 'AOA',
                        'availability' => 'https://schema.org/InStock',
                        'priceValidUntil' => now()->addYear()->format('Y-m-d'),
                        'eligibleRegion' => 'AO',
                        'description' => 'Mensalidade de parceria com licenças ilimitadas',
                        'priceSpecification' => [
                            '@type' => 'UnitPriceSpecification',
                            'price' => (string) $price,
                            'priceCurrency' => $cfg['currency'] ?? 'AOA',
                            'billingDuration' => $cfg['billing_period'] ?? 'P1M',
                            'unitText' => 'MONTH',
                        ],
                    ],
                ],
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Offer',
                    'name' => 'Parceria Freelancer SIGESC',
                    'description' => "Indique o SIGESC a clientes e ganhe {$commission}% de comissão sobre vendas fechadas.",
                    'url' => $url,
                    'availability' => 'https://schema.org/InStock',
                    'eligibleRegion' => 'AO',
                    'category' => 'Affiliate / referral partnership',
                ],
            ],
        ]);
    }

    public function forProducts(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $clinic = (string) config('sigesc.clinic_url', 'https://clinic.sisgesc.net');
        $hub = (string) config('sigesc.hub_url', 'https://hub.sisgesc.net');

        $faqs = [
            [
                'question' => 'Além da faturação, que produtos a SIGESC tem?',
                'answer' => 'O ecossistema inclui o SIGESC (faturação e gestão de empresas), o SIGESC Hospitalar para clínicas e hospitais (clinic.sisgesc.net) e o SIGESC HUB para multiempresa e contabilidade (hub.sisgesc.net).',
            ],
            [
                'question' => 'O que é o SIGESC Hospitalar?',
                'answer' => 'É o software de gestão hospitalar e clínica: recepção, agenda, triagem, consultas, laboratório, farmácia e faturação — em clinic.sisgesc.net, com teste de 3 dias.',
            ],
            [
                'question' => 'O que é o SIGESC HUB?',
                'answer' => 'É a plataforma multiempresa e de contabilidade: consolida várias empresas SIGESC num único painel e inclui plano de contas, diários, balancetes e reconciliação em hub.sisgesc.net.',
            ],
            [
                'question' => 'Onde ver todos os produtos?',
                'answer' => 'Em sisgesc.net/produtos — com páginas dedicadas a Hospitalar e HUB, além do SIGESC principal.',
            ],
        ];

        return $this->forPage([
            'title' => 'Produtos SIGESC | Faturação, Hospitalar e HUB Multiempresa',
            'description' => "Conheça os produtos SIGESC: faturação e gestão de empresas (certificado AGT {$agt}), SIGESC Hospitalar para clínicas e hospitais, e SIGESC HUB multiempresa com contabilidade.",
            'path' => '/produtos',
            'keywords' => implode(', ', [
                'produtos SIGESC',
                'SIGESC Hospitalar',
                'SIGESC HUB',
                'software clínicas Angola',
                'software hospitalar Angola',
                'multiempresa SIGESC',
                'contabilidade SIGESC',
                'clinic.sisgesc.net',
                'hub.sisgesc.net',
                'ecossistema SIGESC',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'ItemList',
                    'name' => 'Produtos SIGESC',
                    'itemListElement' => [
                        [
                            '@type' => 'ListItem',
                            'position' => 1,
                            'name' => 'SIGESC',
                            'url' => rtrim(config('app.url') ?: config('sigesc.site_url'), '/').'/produtos',
                        ],
                        [
                            '@type' => 'ListItem',
                            'position' => 2,
                            'name' => 'SIGESC Hospitalar',
                            'url' => $clinic,
                        ],
                        [
                            '@type' => 'ListItem',
                            'position' => 3,
                            'name' => 'SIGESC HUB',
                            'url' => $hub,
                        ],
                    ],
                ],
            ],
        ]);
    }

    public function forHospitalar(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $hero = \App\Support\HospitalarMedia::heroSrc();
        $base = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');
        $url = $base.'/produtos/hospitalar';
        $clinicUrl = (string) config('sigesc.clinic_url', 'https://clinic.sisgesc.net');

        $faqs = [
            [
                'question' => 'O que é o SIGESC Hospitalar?',
                'answer' => 'É um sistema de gestão hospitalar (HIS) no navegador para clínicas e hospitais: recepção, agenda, triagem, consultas, laboratório, farmácia e faturação — em clinic.sisgesc.net.',
            ],
            [
                'question' => 'Serve para clínicas pequenas?',
                'answer' => 'Sim. O fluxo é o mesmo em unidades pequenas ou grandes: organizar pacientes, horários e cuidados sem papéis perdidos.',
            ],
            [
                'question' => 'Há período de teste?',
                'answer' => 'Sim. Pode criar conta e experimentar o SIGESC Hospitalar durante 3 dias grátis.',
            ],
            [
                'question' => 'Onde aceder ao produto?',
                'answer' => 'Em '.$clinicUrl.' — também a partir desta página em sisgesc.net/produtos/hospitalar.',
            ],
            [
                'question' => 'Faz parte do ecossistema SIGESC?',
                'answer' => "Sim. É um produto da marca SIGESC, ao lado da faturação eletrónica certificada AGT (n.º {$agt}) e do SIGESC HUB.",
            ],
        ];

        $payload = [
            'title' => 'SIGESC Hospitalar | Software para Clínicas e Hospitais em Angola',
            'description' => 'SIGESC Hospitalar: gestão para clínicas e hospitais — recepção, agenda, triagem, consultas, laboratório, farmácia e faturação. Teste 3 dias em clinic.sisgesc.net.',
            'path' => '/produtos/hospitalar',
            'keywords' => implode(', ', [
                'SIGESC Hospitalar',
                'software hospitalar Angola',
                'software para clínicas Angola',
                'sistema de gestão hospitalar',
                'HIS hospitalar',
                'agenda médica online Angola',
                'prontuário eletrónico Angola',
                'farmácia hospitalar software',
                'faturação clínica Angola',
                'clinic.sisgesc.net',
                'gestão de pacientes Angola',
                'triagem hospitalar software',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'SoftwareApplication',
                    'name' => 'SIGESC Hospitalar',
                    'applicationCategory' => 'HealthApplication',
                    'applicationSubCategory' => 'Hospital Information System',
                    'operatingSystem' => 'Web',
                    'description' => 'Software de gestão hospitalar e clínica: recepção, agenda, triagem, consultas, laboratório, farmácia e faturação.',
                    'url' => $url,
                    'sameAs' => [$clinicUrl],
                    'image' => $hero ? $base.$hero : config('sigesc.logo_url'),
                    'offers' => [
                        '@type' => 'Offer',
                        'url' => $clinicUrl.'/register',
                        'priceCurrency' => 'AOA',
                        'description' => 'Teste grátis 3 dias',
                        'availability' => 'https://schema.org/InStock',
                        'areaServed' => [
                            '@type' => 'Country',
                            'name' => 'Angola',
                        ],
                    ],
                    'featureList' => [
                        'Recepção e gestão de pacientes',
                        'Agenda e marcação de consultas',
                        'Triagem e consulta clínica',
                        'Laboratório e farmácia',
                        'Faturação e relatórios',
                    ],
                ],
            ],
        ];

        if ($hero) {
            $payload['og_image'] = $base.$hero;
        }

        return $this->forPage($payload);
    }

    public function forHub(): array
    {
        $agt = config('sigesc.agt_certification.number', 'FE/323/AGT/2026');
        $hero = \App\Support\HubMedia::heroSrc();
        $base = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');
        $url = $base.'/produtos/hub';
        $hubUrl = (string) config('sigesc.hub_url', 'https://hub.sisgesc.net');

        $faqs = [
            [
                'question' => 'O que é o SIGESC HUB?',
                'answer' => 'É a plataforma SaaS multiempresa e de contabilidade: consolida vendas, clientes, produtos, inventário e RH de várias empresas SIGESC e oferece plano de contas, diários, balancetes e reconciliação num único painel.',
            ],
            [
                'question' => 'Para quem é o HUB?',
                'answer' => 'Para quem tem várias empresas ou contas SIGESC e quer evitar entrar em cada uma individualmente — grupos, gabinetes e contabilidades.',
            ],
            [
                'question' => 'O HUB inclui contabilidade?',
                'answer' => 'Sim. Inclui sistema completo de contabilidade: plano de contas, diários, lançamentos, razão, balancete e reconciliação.',
            ],
            [
                'question' => 'Onde aceder ao HUB?',
                'answer' => 'Em '.$hubUrl.' — apresentação também em sisgesc.net/produtos/hub.',
            ],
            [
                'question' => 'Como se liga ao SIGESC?',
                'answer' => "O HUB sincroniza dados das empresas no SIGESC (faturação certificada AGT n.º {$agt}) via API, com vista consolidada e por empresa.",
            ],
        ];

        $payload = [
            'title' => 'SIGESC HUB | Multiempresa e Contabilidade num Único Painel',
            'description' => 'SIGESC HUB: gira várias empresas SIGESC num só lugar — crescimento consolidado e por empresa, mais contabilidade completa (plano de contas, diários, balancetes e reconciliação). hub.sisgesc.net.',
            'path' => '/produtos/hub',
            'keywords' => implode(', ', [
                'SIGESC HUB',
                'software multiempresa Angola',
                'contabilidade SIGESC',
                'software de contabilidade Angola',
                'plano de contas online',
                'balancete online Angola',
                'diários contabilísticos',
                'reconciliação bancária software',
                'gestão de várias empresas',
                'hub.sisgesc.net',
                'painel consolidado SIGESC',
                'gabinete de contabilidade software',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'SoftwareApplication',
                    'name' => 'SIGESC HUB',
                    'applicationCategory' => 'BusinessApplication',
                    'applicationSubCategory' => 'AccountingApplication',
                    'operatingSystem' => 'Web',
                    'description' => 'Plataforma multiempresa e contabilidade do ecossistema SIGESC: consolidação de empresas e contabilidade completa.',
                    'url' => $url,
                    'sameAs' => [$hubUrl],
                    'image' => $hero ? $base.$hero : config('sigesc.logo_url'),
                    'offers' => [
                        '@type' => 'Offer',
                        'url' => $hubUrl,
                        'priceCurrency' => 'AOA',
                        'description' => 'Teste grátis disponível',
                        'availability' => 'https://schema.org/InStock',
                        'areaServed' => [
                            '@type' => 'Country',
                            'name' => 'Angola',
                        ],
                    ],
                    'featureList' => [
                        'Painel multiempresa consolidado',
                        'Vista individual por empresa',
                        'Sincronização com SIGESC',
                        'Plano de contas e diários',
                        'Balancetes e reconciliação',
                    ],
                ],
            ],
        ];

        if ($hero) {
            $payload['og_image'] = $base.$hero;
        }

        return $this->forPage($payload);
    }

    public function forContact(): array
    {
        return $this->forPage([
            'title' => 'Contacto | SIGESC Angola',
            'description' => 'Fale com a equipa SIGESC. Suporte comercial, técnico e candidaturas ao programa de parceria (40.000 Kz/mês com licenças ilimitadas, ou Freelancer com 30% de comissão) para empresas em Angola.',
            'path' => '/contact',
            'keywords' => 'contacto SIGESC, suporte, parceria SIGESC, Angola',
        ]);
    }

    public function forAskExpert(): array
    {
        $url = route('ask-expert.index', absolute: true);
        $faqs = [
            [
                'question' => 'O que é o Pergunte ao Especialista do SIGESC?',
                'answer' => 'É um serviço gratuito de dúvidas empresariais e fiscais em Angola: pergunta sobre AGT, IVA, IRT, Imposto Industrial, faturação eletrónica, PDV, stock ou abertura de empresa e recebe uma resposta com base em pesquisa de fontes.',
            ],
            [
                'question' => 'Posso tirar dúvidas sobre impostos e AGT em Angola?',
                'answer' => 'Sim. As perguntas mais comuns são sobre taxas de IVA, tabela de IRT 2026, retenção na fonte, Imposto Industrial, faturação eletrónica AGT e obrigações fiscais de PME em Luanda e no resto do país.',
            ],
            [
                'question' => 'A resposta substitui um contabilista ou a AGT?',
                'answer' => 'Não. É apoio informativo com pesquisa. Confirme sempre a legislação vigente na AGT, no Quiosque do Contribuinte ou com um profissional certificado.',
            ],
            [
                'question' => 'Que temas de gestão comercial posso perguntar?',
                'answer' => 'Pode perguntar sobre software de gestão, PDV, controlo de stock, preços, fluxo de caixa, loja virtual, dropshipping e boas práticas para PME em Angola.',
            ],
        ];

        return $this->forPage([
            'title' => 'Pergunte ao Especialista Angola | Dúvidas Fiscais AGT, IVA e Gestão',
            'description' => 'Tire dúvidas fiscais e de gestão em Angola: AGT, IVA, IRT 2026, Imposto Industrial, faturação eletrónica, PDV e abertura de empresa. Consultoria online gratuita com pesquisa de fontes — SIGESC.',
            'path' => '/pergunte-ao-especialista',
            'keywords' => implode(', ', [
                'pergunte ao especialista Angola',
                'dúvidas fiscais Angola',
                'consultoria fiscal online Angola',
                'perguntas AGT',
                'tirar dúvidas IVA Angola',
                'especialista impostos Angola',
                'consultoria empresarial Angola',
                'dúvidas IRT 2026',
                'faturação eletrónica AGT ajuda',
                'contabilidade PME Angola',
                'abrir empresa Angola dúvidas',
                'especialista gestão comercial Luanda',
                'perguntas sobre Imposto Industrial',
                'ajuda fiscal gratuita Angola',
                'SIGESC especialista',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'Service',
                    'name' => 'Pergunte ao Especialista SIGESC',
                    'serviceType' => 'Consultoria informativa fiscal e de gestão empresarial',
                    'provider' => [
                        '@type' => 'Organization',
                        'name' => 'SIGESC',
                        'url' => rtrim(config('app.url') ?: config('sigesc.site_url'), '/'),
                    ],
                    'areaServed' => [
                        '@type' => 'Country',
                        'name' => 'Angola',
                    ],
                    'availableChannel' => [
                        '@type' => 'ServiceChannel',
                        'serviceUrl' => $url,
                        'availableLanguage' => 'pt-AO',
                    ],
                    'description' => 'Serviço gratuito para tirar dúvidas sobre AGT, impostos e gestão comercial em Angola.',
                    'url' => $url,
                ],
            ],
        ]);
    }

    public function forCalculators(): array
    {
        $url = route('calculators.index', absolute: true);
        $faqs = [
            [
                'question' => 'Existe calculadora de IVA gratuita para Angola?',
                'answer' => 'Sim. No SIGESC pode calcular IVA a acrescentar ou a extrair do preço com as taxas do Código do IVA angolano (taxa geral e regimes especiais configurados).',
            ],
            [
                'question' => 'Como calcular o IRT sobre salários em Angola em 2026?',
                'answer' => 'Use a calculadora de IRT Grupo A com a tabela da Lei n.º 14/25 (OGE 2026): isenção até 150.000 Kz e escalões progressivos de retenção na fonte.',
            ],
            [
                'question' => 'Posso simular Imposto Industrial e retenção na fonte?',
                'answer' => 'Sim. Há simuladores de Imposto Industrial por sector, retenção na fonte sobre serviços (6,5%) e contribuição especial sobre operações cambiais.',
            ],
            [
                'question' => 'Estas calculadoras substituem o simulador oficial da AGT?',
                'answer' => 'Não. São ferramentas de apoio com base na legislação configurada. Para declarações oficiais use o Quiosque do Contribuinte / simuladores AGT.',
            ],
        ];

        return $this->forPage([
            'title' => 'Calculadora IVA e IRT Angola 2026 | Impostos AGT Gratuitos',
            'description' => 'Calculadoras fiscais gratuitas para Angola: IVA, IRT 2026 (Lei n.º 14/25), Imposto Industrial, retenção na fonte 6,5% e contribuição cambial. Simule impostos AGT online — PME e contabilistas.',
            'path' => '/calculadoras',
            'keywords' => implode(', ', [
                'calculadora IVA Angola',
                'calculadora IRT Angola 2026',
                'calcular IVA AGT',
                'simulador impostos Angola',
                'calculadora Imposto Industrial Angola',
                'retenção na fonte 6.5% Angola',
                'tabela IRT 2026',
                'calcular salário líquido Angola',
                'imposto sobre o valor acrescentado Angola',
                'ferramentas fiscais gratuitas Angola',
                'simulador IRT online',
                'calculadora salarial Angola',
                'contribuição cambial OGE 2026',
                'calculadoras AGT',
                'SIGESC calculadoras fiscais',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebApplication',
                    'name' => 'Calculadoras Fiscais SIGESC Angola',
                    'applicationCategory' => 'BusinessApplication',
                    'operatingSystem' => 'Web',
                    'offers' => [
                        '@type' => 'Offer',
                        'price' => '0',
                        'priceCurrency' => 'AOA',
                    ],
                    'url' => $url,
                    'inLanguage' => 'pt-AO',
                    'description' => 'Simuladores online de IVA, IRT, Imposto Industrial e retenção na fonte para empresas em Angola.',
                    'provider' => [
                        '@type' => 'Organization',
                        'name' => 'SIGESC',
                    ],
                ],
            ],
        ]);
    }

    public function forBarcodeQrGenerator(): array
    {
        $url = route('barcode-qr-generator.index', absolute: true);
        $faqs = [
            [
                'question' => 'Como criar um QR Code grátis online?',
                'answer' => 'Abra o gerador SIGESC, escolha QR Code, seleccione o tipo de conteúdo (URL, texto, Wi‑Fi, contacto…), personalize cores e logotipo e descarregue em PNG ou SVG. Não precisa de conta.',
            ],
            [
                'question' => 'Posso colocar o logotipo no centro do QR Code?',
                'answer' => 'Sim. Carregue uma imagem (PNG/JPG/SVG) e o gerador coloca-a no centro com fundo branco. Use correção de erro Q ou H para o código continuar legível.',
            ],
            [
                'question' => 'Que códigos de barras posso gerar?',
                'answer' => 'CODE128, CODE39, EAN-13, EAN-8, UPC-A, ITF-14, MSI e Pharmacode — úteis para produtos, inventário e logística.',
            ],
            [
                'question' => 'Os códigos ficam guardados no site?',
                'answer' => 'Não. Nada é armazenado nos servidores. O conteúdo e o logotipo existem só no seu navegador até descarregar ou fechar a página.',
            ],
        ];

        return $this->forPage([
            'title' => 'Gerador de Código de Barras e QR Code Grátis | Com Logotipo',
            'description' => 'Crie QR Code e código de barras online grátis: URL, texto, Wi‑Fi, email, telefone, vCard. Coloque logotipo no centro, escolha cores e descarregue PNG/SVG. Sem conta — nada é guardado no servidor.',
            'path' => '/gerador-de-codigo-barras',
            'keywords' => implode(', ', [
                'gerador de código de barras grátis',
                'gerador qr code online',
                'criar qr code com logo',
                'gerar código de barras online',
                'qr code grátis',
                'criar código de barras EAN',
                'gerador qr code com imagem',
                'código de barras CODE128',
                'qr code wifi grátis',
                'gerar barcode online',
                'qr code para empresa',
                'gerador código de barras Angola',
                'criar qr code URL',
                'download qr code png',
                'SIGESC gerador qr code',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebApplication',
                    'name' => 'Gerador de Código de Barras e QR Code SIGESC',
                    'applicationCategory' => 'BusinessApplication',
                    'operatingSystem' => 'Web',
                    'offers' => [
                        '@type' => 'Offer',
                        'price' => '0',
                        'priceCurrency' => 'AOA',
                    ],
                    'url' => $url,
                    'inLanguage' => 'pt-AO',
                    'description' => 'Gere QR Codes e códigos de barras online grátis, com logotipo no centro, sem criar conta e sem guardar dados no servidor.',
                    'provider' => [
                        '@type' => 'Organization',
                        'name' => 'SIGESC',
                    ],
                ],
            ],
        ]);
    }

    public function forInvoiceGenerator(): array
    {
        $url = route('invoice-generator.index', absolute: true);
        $faqs = [
            [
                'question' => 'Como criar uma fatura online grátis em Angola?',
                'answer' => 'Use o gerador gratuito SIGESC: preencha emitente e cliente, adicione artigos com preço e quantidade, escolha o IVA (14%, 7%, 5% ou isento) e imprima ou guarde em PDF. Não precisa de criar conta.',
            ],
            [
                'question' => 'As facturas ficam guardadas no site?',
                'answer' => 'Não. Nada é armazenado nos servidores. Os dados existem só no seu navegador. Se fechar a página sem imprimir/guardar PDF, perde o conteúdo.',
            ],
            [
                'question' => 'Posso calcular IVA e retenção na fonte?',
                'answer' => 'Sim. Por linha pode aplicar IVA geral 14%, taxas reduzidas ou personalizada, descontos e retenção na fonte 6,5% sobre o total.',
            ],
            [
                'question' => 'Isto substitui a faturação eletrónica AGT?',
                'answer' => 'Não. É uma ferramenta gratuita de apoio para rascunhos e documentos internos. Para documentos fiscais oficiais use software certificado (ex.: SIGESC).',
            ],
        ];

        return $this->forPage([
            'title' => 'Criar Fatura Online Grátis Angola | Gerador de Factura com IVA',
            'description' => 'Crie facturas online grátis sem conta: artigos, preços, quantidades, IVA 14%/7%/5%, descontos e retenção. Nada é guardado no servidor — imprima ou PDF. Gerador de fatura Angola para PME.',
            'path' => '/gerador-de-fatura',
            'keywords' => implode(', ', [
                'criar fatura online grátis',
                'gerador de fatura Angola',
                'fazer factura online',
                'emitir fatura gratuita',
                'criar factura com IVA',
                'gerador factura recibo',
                'fatura online sem registo',
                'calcular fatura IVA 14%',
                'modelo fatura editável online',
                'fazer fatura PME Angola',
                'gerador de factura Luanda',
                'criar proforma online',
                'recibo online grátis',
                'faturação gratuita Angola',
                'SIGESC gerador de fatura',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'WebApplication',
                    'name' => 'Gerador de Fatura Gratuito SIGESC',
                    'applicationCategory' => 'BusinessApplication',
                    'operatingSystem' => 'Web',
                    'offers' => [
                        '@type' => 'Offer',
                        'price' => '0',
                        'priceCurrency' => 'AOA',
                    ],
                    'url' => $url,
                    'inLanguage' => 'pt-AO',
                    'description' => 'Crie facturas online grátis em Angola com IVA, sem criar conta e sem guardar dados no servidor.',
                    'provider' => [
                        '@type' => 'Organization',
                        'name' => 'SIGESC',
                    ],
                ],
            ],
        ]);
    }

    public function forInvoiceTemplates(): array
    {
        $url = route('invoice-templates.index', absolute: true);
        $faqs = [
            [
                'question' => 'Onde descarregar modelos de fatura gratuitos em Angola?',
                'answer' => 'Na biblioteca SIGESC em /modelos-de-fatura encontra mais de 20 modelos de factura, factura-recibo, proforma, recibo e orçamento em HTML print-ready, gratuitos para PME.',
            ],
            [
                'question' => 'Os modelos servem para faturação eletrónica AGT?',
                'answer' => 'São modelos editáveis de apoio. Os layouts avançados incluem campos AGT (NIF, série, número, QR). Para emitir documentos fiscais válidos use software certificado como o SIGESC.',
            ],
            [
                'question' => 'Posso guardar os modelos em PDF?',
                'answer' => 'Sim. Abra o modelo, clique em Imprimir / PDF no navegador e guarde como PDF. Também pode descarregar o ficheiro HTML editável.',
            ],
            [
                'question' => 'Há modelos com IVA e retenção na fonte?',
                'answer' => 'Sim. Existem facturas com IVA 14%, taxa reduzida, retenção na fonte 6,5%, descontos e layouts para retalho, serviços, restauração e logística.',
            ],
        ];

        $itemList = [
            '@context' => 'https://schema.org',
            '@type' => 'CollectionPage',
            'name' => 'Modelos de fatura gratuitos Angola',
            'url' => $url,
            'description' => 'Biblioteca gratuita de modelos de factura e factura-recibo para empresas em Angola.',
            'isPartOf' => [
                '@type' => 'WebSite',
                'name' => 'SIGESC',
                'url' => rtrim(config('app.url') ?: config('sigesc.site_url'), '/'),
            ],
            'mainEntity' => [
                '@type' => 'ItemList',
                'numberOfItems' => count(config('invoice_templates.templates', [])),
                'itemListElement' => collect(config('invoice_templates.templates', []))
                    ->values()
                    ->map(function (array $template, int $index) use ($url) {
                        return [
                            '@type' => 'ListItem',
                            'position' => $index + 1,
                            'url' => $url.'/'.$template['slug'],
                            'name' => $template['title'],
                        ];
                    })
                    ->all(),
            ],
        ];

        return $this->forPage([
            'title' => 'Modelos de Fatura Gratuitos Angola | Factura, Recibo e Proforma',
            'description' => 'Descarregue gratis +20 modelos de fatura para Angola: factura, factura-recibo, proforma, orçamento e nota de crédito. Layouts AGT, IVA 14% e design profissional para PME.',
            'path' => '/modelos-de-fatura',
            'keywords' => implode(', ', [
                'modelo de fatura gratuito Angola',
                'modelo de factura Angola',
                'factura recibo gratuito',
                'modelo factura AGT',
                'template fatura Kwanzas',
                'modelo proforma Angola',
                'baixar modelo de fatura',
                'factura eletrónica modelo',
                'recibo pagamento Angola',
                'orçamento modelo empresa',
                'nota de crédito modelo',
                'factura com IVA 14%',
                'modelo fatura PME Luanda',
                'documento fiscal modelo Angola',
                'faturação AGT templates',
                'SIGESC modelos de fatura',
            ]),
            'faq' => $faqs,
            'extra_json_ld' => [$itemList],
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

    /**
     * @param  array<int, array{question: string, answer: string}>  $faqs
     * @return array<string, mixed>
     */
    protected function faqPageJsonLd(array $faqs): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => collect($faqs)
                ->filter(fn ($faq) => filled($faq['question'] ?? null) && filled($faq['answer'] ?? null))
                ->map(fn (array $faq) => [
                    '@type' => 'Question',
                    'name' => $faq['question'],
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => $faq['answer'],
                    ],
                ])
                ->values()
                ->all(),
        ];
    }
}
