<?php

namespace App\Support;

/**
 * Imagens do módulo Marketplace em public/img/marketplace.
 */
class MarketplaceMedia
{
    /**
     * @var list<array{key: string, file: string, title: string, alt: string, summary: string}>
     */
    protected static array $catalog = [
        [
            'key' => 'hero',
            'file' => 'hero.jpg',
            'title' => 'Marketplace local SIGESC',
            'alt' => 'Marketplace SIGESC — descobrir empresas, produtos e serviços locais em Angola',
            'summary' => 'Clientes encontram negócios perto de si e compram ou agendam online.',
        ],
        [
            'key' => 'listar',
            'file' => 'listar-empresa.jpg',
            'title' => 'Listar empresa ou negócio',
            'alt' => 'Empresa a listar produtos no Marketplace SIGESC',
            'summary' => 'Empresas e pessoas singulares publicam o perfil e o catálogo na cidade.',
        ],
        [
            'key' => 'comprar',
            'file' => 'comprar-produtos.jpg',
            'title' => 'Comprar produtos',
            'alt' => 'Compra de produtos locais no Marketplace SIGESC',
            'summary' => 'Os clientes comparam e compram produtos publicados pelos negócios locais.',
        ],
        [
            'key' => 'agendar',
            'file' => 'agendar-servico.jpg',
            'title' => 'Agendar serviços',
            'alt' => 'Agendamento de serviços locais no Marketplace SIGESC',
            'summary' => 'Marque serviços — salões, consultoria, prestadores — na cidade do negócio.',
        ],
        [
            'key' => 'descobrir',
            'file' => 'descobrir-local.jpg',
            'title' => 'Descobrir por cidade',
            'alt' => 'Pesquisa de negócios locais por cidade no Marketplace SIGESC',
            'summary' => 'Pesquise por categoria, país, cidade ou nome da empresa.',
        ],
    ];

    /**
     * @return list<array{key: string, src: string, title: string, alt: string, summary: string}>
     */
    public static function all(): array
    {
        $dir = public_path('img/marketplace');
        $items = [];

        foreach (self::$catalog as $item) {
            $path = $dir.DIRECTORY_SEPARATOR.$item['file'];
            if (! is_file($path)) {
                continue;
            }

            $items[] = [
                'key' => $item['key'],
                'src' => '/img/marketplace/'.$item['file'],
                'title' => $item['title'],
                'alt' => $item['alt'],
                'summary' => $item['summary'],
            ];
        }

        return $items;
    }

    public static function heroSrc(): ?string
    {
        $all = self::all();
        foreach ($all as $item) {
            if ($item['key'] === 'hero') {
                return $item['src'];
            }
        }

        return $all[0]['src'] ?? null;
    }
}
