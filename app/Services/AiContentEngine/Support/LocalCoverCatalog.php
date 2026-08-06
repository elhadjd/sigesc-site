<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\Article;
use Illuminate\Support\Str;

/**
 * Maps article topics to editorial blog covers under public/img/blog-covers.
 *
 * Never returns SIGESC module / product screenshots (billing, PDV, stock, etc.).
 */
class LocalCoverCatalog
{
    /**
     * Product UI directories that must never be used as blog covers.
     *
     * @var list<string>
     */
    public const FORBIDDEN_IMG_PREFIXES = [
        '/img/billing/',
        '/img/finance/',
        '/img/point-of-sale/',
        '/img/stock/',
        '/img/marketing/',
        '/img/e-commerce/',
        '/img/logistics/',
        '/img/employee/',
        '/img/purchase/',
        '/img/appointment/',
        '/img/dropshipping/',
        '/img/crm/',
        '/img/dashboard',
        '/img/sigesc',
        '/img/Sigesc',
    ];

    /**
     * @return array{url: string, source: string, attribution: array<string, mixed>, stored: bool}|null
     */
    public function match(Article $article): ?array
    {
        $haystack = Str::lower(trim(implode(' ', array_filter([
            $article->focus_keyword,
            $article->category?->name,
            $article->title,
            $article->slug,
        ]))));

        $candidates = $this->candidatesFor($haystack);
        if ($candidates === []) {
            $candidates = $this->defaultPool();
        }

        $index = abs(crc32(Str::slug($article->focus_keyword ?: $article->title ?: 'blog'))) % max(1, count($candidates));
        $ordered = array_merge(
            array_slice($candidates, $index),
            array_slice($candidates, 0, $index)
        );

        foreach ($ordered as $path) {
            if ($this->isForbiddenProductPath($path)) {
                continue;
            }

            if ($this->existsOnServer($path)) {
                return [
                    'url' => $path,
                    'source' => 'editorial-catalog',
                    'attribution' => [
                        'provider' => 'editorial-local',
                        'note' => 'Editorial blog cover matched to article topic (not a product screenshot)',
                    ],
                    'stored' => true,
                ];
            }
        }

        return null;
    }

    /**
     * True when a path points at SIGESC product UI / brand marketing shots.
     */
    public function isForbiddenProductPath(string $urlPath): bool
    {
        $path = '/'.ltrim(parse_url($urlPath, PHP_URL_PATH) ?: $urlPath, '/');
        $lower = Str::lower($path);

        foreach (self::FORBIDDEN_IMG_PREFIXES as $prefix) {
            if (str_starts_with($lower, Str::lower($prefix))) {
                return true;
            }
        }

        // Loose filename brand shots at /img root
        if (preg_match('#^/img/[^/]*(sigesc|dashboard)[^/]*\.(png|jpe?g|webp|gif)$#i', $path) === 1) {
            return true;
        }

        return false;
    }

    /**
     * All catalog paths that currently exist on disk.
     *
     * @return list<string>
     */
    public function existingPaths(): array
    {
        $paths = [];
        foreach ($this->allMappedPaths() as $path) {
            if ($this->existsOnServer($path) && ! $this->isForbiddenProductPath($path)) {
                $paths[] = $path;
            }
        }

        return array_values(array_unique($paths));
    }

    public function existsOnServer(string $urlPath): bool
    {
        if (! Str::startsWith($urlPath, '/img/')) {
            return false;
        }

        if ($this->isForbiddenProductPath($urlPath)) {
            return false;
        }

        $relative = ltrim($urlPath, '/');
        $full = public_path($relative);

        return is_file($full) && filesize($full) > 0;
    }

    /**
     * @return list<string>
     */
    protected function candidatesFor(string $haystack): array
    {
        $groups = [
            'faturacao' => [
                'iva', 'agt', 'fatura', 'factura', 'fiscal', 'imposto', 'irt', 'nif', 'tribut', 'selo', 'retenção', 'retencao', 'documento fiscal', 'eletrón', 'eletron',
            ],
            'fluxo-caixa' => [
                'fluxo', 'caixa', 'finanç', 'financ', 'banco', 'crédito', 'credito', 'lucro', 'margem', 'tesouraria',
            ],
            'pdv-stock' => [
                'pdv', 'pos', 'ponto de venda', 'loja', 'venda', 'stock', 'estoque', 'inventário', 'inventario', 'armazém', 'armazem',
            ],
            'marketing' => [
                'marketing', 'anúncio', 'anuncio', 'ads', 'facebook', 'instagram', 'email', 'digital',
            ],
            'whatsapp' => [
                'whatsapp', 'whats', 'mensagem', 'chat business',
            ],
            'ecommerce' => [
                'e-commerce', 'ecommerce', 'loja online', 'loja virtual', 'dropshipping', 'marketplace', 'vendas online',
            ],
            'logistica' => [
                'logística', 'logistica', 'entrega', 'frota', 'transporte', 'delivery', 'rastreamento',
            ],
            'folha' => [
                'rh', 'salário', 'salario', 'folha', 'funcionário', 'funcionario', 'ponto', 'trabalho', 'recursos humanos',
            ],
        ];

        $matched = [];
        foreach ($groups as $group => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($haystack, $keyword)) {
                    $matched = array_merge($matched, $this->pathsByGroup($group));
                    break;
                }
            }
        }

        return array_values(array_unique($matched));
    }

    /**
     * @return list<string>
     */
    protected function pathsByGroup(string $group): array
    {
        return match ($group) {
            'faturacao' => [
                '/img/blog-covers/capa-faturacao-eletronica.svg',
            ],
            'fluxo-caixa' => [
                '/img/blog-covers/capa-fluxo-caixa.svg',
            ],
            'pdv-stock' => [
                '/img/blog-covers/capa-pdv-stock.svg',
            ],
            'marketing' => [
                '/img/blog-covers/capa-marketing-digital.svg',
            ],
            'whatsapp' => [
                '/img/blog-covers/capa-whatsapp-business.svg',
            ],
            'ecommerce' => [
                '/img/blog-covers/capa-ecommerce-angola.svg',
            ],
            'logistica' => [
                '/img/blog-covers/capa-logistica-entregas.svg',
            ],
            'folha' => [
                '/img/blog-covers/capa-folha-pagamento.svg',
            ],
            default => $this->defaultPool(),
        };
    }

    /**
     * @return list<string>
     */
    protected function defaultPool(): array
    {
        return [
            '/img/blog-covers/capa-faturacao-eletronica.svg',
            '/img/blog-covers/capa-fluxo-caixa.svg',
            '/img/blog-covers/capa-pdv-stock.svg',
            '/img/blog-covers/capa-marketing-digital.svg',
            '/img/blog-covers/capa-ecommerce-angola.svg',
            '/img/blog-covers/capa-folha-pagamento.svg',
            '/img/blog-covers/capa-logistica-entregas.svg',
            '/img/blog-covers/capa-whatsapp-business.svg',
            '/img/placeholder-blog.svg',
        ];
    }

    /**
     * @return list<string>
     */
    protected function allMappedPaths(): array
    {
        $all = $this->defaultPool();
        foreach (['faturacao', 'fluxo-caixa', 'pdv-stock', 'marketing', 'whatsapp', 'ecommerce', 'logistica', 'folha'] as $group) {
            $all = array_merge($all, $this->pathsByGroup($group));
        }

        return array_values(array_unique($all));
    }
}
