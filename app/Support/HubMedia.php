<?php

namespace App\Support;

/**
 * Imagens do produto SIGESC HUB em public/img/produtos/hub.
 */
class HubMedia
{
    /**
     * @var list<array{key: string, file: string, title: string, alt: string, summary: string}>
     */
    protected static array $catalog = [
        [
            'key' => 'hero',
            'file' => 'hero.jpg',
            'title' => 'SIGESC HUB',
            'alt' => 'SIGESC HUB — multiempresa e contabilidade',
            'summary' => 'Um painel para várias empresas SIGESC com contabilidade completa.',
        ],
        [
            'key' => 'dashboard',
            'file' => 'dashboard.jpg',
            'title' => 'Painel multiempresa',
            'alt' => 'Dashboard consolidado do SIGESC HUB',
            'summary' => 'Veja o crescimento do grupo e entre em cada empresa sem trocar de conta.',
        ],
        [
            'key' => 'vendas',
            'file' => 'vendas.jpg',
            'title' => 'Vendas consolidadas',
            'alt' => 'Vendas sincronizadas do SIGESC no HUB',
            'summary' => 'Histórico, detalhes e exportações das vendas de todas as empresas.',
        ],
        [
            'key' => 'clientes',
            'file' => 'clientes.jpg',
            'title' => 'Clientes e volumes',
            'alt' => 'Clientes multiempresa no SIGESC HUB',
            'summary' => 'Fichas enriquecidas com volumes, documentos e histórico comercial.',
        ],
        [
            'key' => 'produtos',
            'file' => 'produtos.jpg',
            'title' => 'Produtos e catálogo',
            'alt' => 'Catálogo e produtos no SIGESC HUB',
            'summary' => 'Catálogo com stock disponível ligado ao inventário de cada empresa.',
        ],
        [
            'key' => 'inventario',
            'file' => 'inventario.jpg',
            'title' => 'Inventário do grupo',
            'alt' => 'Inventário multiempresa no SIGESC HUB',
            'summary' => 'Visão consolidada de stock e movimentos importados do SIGESC.',
        ],
        [
            'key' => 'rh',
            'file' => 'rh.jpg',
            'title' => 'RH e colaboradores',
            'alt' => 'RH consolidado no SIGESC HUB',
            'summary' => 'Fichas, relatórios e exports de colaboradores e encargos.',
        ],
        [
            'key' => 'contabilidade',
            'file' => 'contabilidade.jpg',
            'title' => 'Contabilidade completa',
            'alt' => 'Contabilidade no SIGESC HUB — plano de contas, diários e balancetes',
            'summary' => 'Plano de contas, diários, lançamentos, razão, balancete e reconciliação.',
        ],
    ];

    /**
     * @return list<array{key: string, src: string, title: string, alt: string, summary: string}>
     */
    public static function all(): array
    {
        $dir = public_path('img/produtos/hub');
        $items = [];

        foreach (self::$catalog as $item) {
            $path = $dir.DIRECTORY_SEPARATOR.$item['file'];
            if (! is_file($path)) {
                continue;
            }

            $items[] = [
                'key' => $item['key'],
                'src' => '/img/produtos/hub/'.$item['file'],
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
