<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\Article;
use Illuminate\Support\Str;

/**
 * Maps article topics to product screenshots already shipped under public/img.
 */
class LocalCoverCatalog
{
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

        $index = abs(crc32(Str::slug($article->focus_keyword ?: $article->title ?: 'sigesc'))) % count($candidates);
        $ordered = array_merge(
            array_slice($candidates, $index),
            array_slice($candidates, 0, $index)
        );

        foreach ($ordered as $path) {
            if ($this->existsOnServer($path)) {
                return [
                    'url' => $path,
                    'source' => 'local-catalog',
                    'attribution' => [
                        'provider' => 'sigesc-local',
                        'note' => 'Product screenshot from public/img matched to article topic',
                    ],
                    'stored' => true,
                ];
            }
        }

        return null;
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
            if ($this->existsOnServer($path)) {
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
            'billing' => [
                'iva', 'agt', 'fatura', 'factura', 'fiscal', 'imposto', 'irt', 'nif', 'tribut', 'selo', 'retenção', 'retencao', 'documento fiscal',
            ],
            'finance' => [
                'fluxo', 'caixa', 'finanç', 'financ', 'banco', 'crédito', 'credito', 'lucro', 'margem', 'preçário', 'precario',
            ],
            'point-of-sale' => [
                'pdv', 'pos', 'ponto de venda', 'loja', 'venda', 'promoção', 'promocao', 'desconto', 'multicaixa', 'tpa',
            ],
            'stock' => [
                'stock', 'estoque', 'inventário', 'inventario', 'armazém', 'armazem', 'produto', 'farmácia', 'farmacia',
            ],
            'marketing' => [
                'marketing', 'anúncio', 'anuncio', 'ads', 'facebook', 'instagram', 'whatsapp', 'email', 'meta', 'merchant', 'catálogo', 'catalogo',
            ],
            'e-commerce' => [
                'e-commerce', 'ecommerce', 'loja online', 'loja virtual', 'dropshipping', 'marketplace', 'vendas online',
            ],
            'logistics' => [
                'logística', 'logistica', 'entrega', 'frota', 'transporte', 'delivery', 'rastreamento',
            ],
            'employee' => [
                'rh', 'salário', 'salario', 'folha', 'funcionário', 'funcionario', 'ponto', 'trabalho', 'irt', 'recursos humanos',
            ],
            'purchase' => [
                'compra', 'fornecedor', 'import', 'export', 'encomenda',
            ],
            'appointment' => [
                'agenda', 'marcação', 'marcacao', 'salão', 'salao', 'clínica', 'clinica', 'agendamento',
            ],
            'software' => [
                'software', 'erp', 'crm', 'gestão', 'gestao', 'sigesc', 'sistema',
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
            'billing' => [
                '/img/billing/SIGESC Software de Gestao Empresarial emissao-de-fatura.png',
                '/img/billing/SIGESC Software de Gestao Empresarial Lista de faturas.png',
                '/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png',
                '/img/dashboard-sigesc-angola.png',
            ],
            'finance' => [
                '/img/finance/Fluxo de caixa.png',
                '/img/finance/gestao-financeira-dashboard.png',
                '/img/finance/Gestao de contas bancarias.png',
            ],
            'point-of-sale' => [
                '/img/point-of-sale/SIGESC Software de Gestao Empresarial Pdv Pos Ponto de venda Software gratuito.png',
                '/img/point-of-sale/software de gestao angola pdv-vendas-rapidas.png',
                '/img/point-of-sale/software de gestao angola pdv-multi-pagamentos.png',
                '/img/point-of-sale/software de gestao angola Gestao de promocoes e descontos.png',
            ],
            'stock' => [
                '/img/stock/Sigesc software de gestao comercial gratis gestao de stock.png',
                '/img/stock/Sigesc software de gestao comercial gratis controle-inventario.png',
                '/img/stock/Sigesc software de gestao comercial gratis relatorios-stock.png',
                '/img/stock/Sigesc software de gestao comercial gratis gestao de tranferencia de produtos entre armagens.png',
            ],
            'marketing' => [
                '/img/marketing/marketing-dashboard.png',
                '/img/marketing/gestao de contas whatsapp ecatalogos.png',
                '/img/marketing/Integracao com meta facebook.png',
                '/img/marketing/email-marketing.png',
                '/img/marketing/Integracao com google merchant center.png',
            ],
            'e-commerce' => [
                '/img/e-commerce/loja-virtual-dashboard.png',
                '/img/e-commerce/catalogo-produtos.png',
                '/img/e-commerce/Gestao de entregas e pagamentos.png',
                '/img/e-commerce/Gestao de entregas e logistica Rastreamento em tempo real.png',
            ],
            'logistics' => [
                '/img/logistics/SIGESC Software de Gestao Empresarial Logistica Transporte Frota Entregas Rotas.png',
                '/img/logistics/SIGESC Software de Gestao Empresarial Logistica Acompanhamento em tempo real.png',
                '/img/logistics/SIGESC Software de Gestao Empresarial Logistica gestao de frota.png',
            ],
            'employee' => [
                '/img/employee/sigesc folha-pagamento.png',
                '/img/employee/sigesc gestao-funcionarios-dashboard.png',
                '/img/employee/sigesc controlo-ponto.png',
                '/img/employee/sigesc Calculo de horas e salarios.png',
            ],
            'purchase' => [
                '/img/purchase/gestao-compras-dashboard.png',
                '/img/purchase/gestao-compras-controlo-fornecedores.png',
            ],
            'appointment' => [
                '/img/appointment/Dashboard de Agendamentos SIGESC Visao completa da agenda.png',
                '/img/appointment/agenda-online.png',
                '/img/appointment/confirmacoes-automaticas.png',
            ],
            'software' => [
                '/img/dashboard-sigesc-angola.png',
                '/img/Sigesc Paineies proficionais.png',
                '/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png',
                '/img/point-of-sale/SIGESC Software de Gestao Empresarial Pdv Pos Ponto de venda Software gratuito.png',
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
            '/img/dashboard-sigesc-angola.png',
            '/img/sigesc capa.png',
            '/img/Sigesc Paineies proficionais.png',
            '/img/billing/SIGESC Software de Gestao Empresarial emissao-de-fatura.png',
            '/img/point-of-sale/software de gestao angola pdv-vendas-rapidas.png',
            '/img/finance/gestao-financeira-dashboard.png',
            '/img/stock/Sigesc software de gestao comercial gratis gestao de stock.png',
            '/img/marketing/marketing-dashboard.png',
        ];
    }

    /**
     * @return list<string>
     */
    protected function allMappedPaths(): array
    {
        $all = $this->defaultPool();
        foreach (['billing', 'finance', 'point-of-sale', 'stock', 'marketing', 'e-commerce', 'logistics', 'employee', 'purchase', 'appointment', 'software'] as $group) {
            $all = array_merge($all, $this->pathsByGroup($group));
        }

        return array_values(array_unique($all));
    }
}
