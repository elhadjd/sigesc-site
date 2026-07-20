<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class InvoiceGeneratorController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    public function index(Request $request)
    {
        $taxOptions = $this->taxOptions();
        $documentTypes = $this->documentTypes();

        return $this->renderPublicPage(
            $request,
            'invoice-generator/index',
            [
                'seo' => $this->seo->forInvoiceGenerator(),
                'prerender' => $this->content->invoiceGenerator(),
                'taxOptions' => $taxOptions,
                'documentTypes' => $documentTypes,
                'disclaimer' => 'As facturas criadas neste gerador gratuito NÃO são guardadas em nenhum servidor. Os dados ficam apenas no seu navegador. Ao fechar ou limpar a página, perde-se o conteúdo — imprima ou guarde em PDF antes de sair.',
            ],
            'seo.invoice-generator',
            [
                'taxOptions' => $taxOptions,
                'documentTypes' => $documentTypes,
            ]
        );
    }

    /**
     * @return list<array{key: string, label: string, rate: float}>
     */
    protected function taxOptions(): array
    {
        $options = [
            ['key' => 'isento', 'label' => 'Isento / sem IVA (0%)', 'rate' => 0.0],
        ];

        foreach (config('angola_tax.iva.rates', []) as $key => $rate) {
            $options[] = [
                'key' => (string) $key,
                'label' => (string) ($rate['label'] ?? $key),
                'rate' => (float) ($rate['rate'] ?? 0),
            ];
        }

        $options[] = [
            'key' => 'custom',
            'label' => 'Taxa personalizada (%)',
            'rate' => -1,
        ];

        return $options;
    }

    /**
     * @return list<array{key: string, label: string}>
     */
    protected function documentTypes(): array
    {
        return [
            ['key' => 'factura', 'label' => 'Factura'],
            ['key' => 'factura_recibo', 'label' => 'Factura-Recibo'],
            ['key' => 'proforma', 'label' => 'Factura Proforma'],
            ['key' => 'recibo', 'label' => 'Recibo'],
            ['key' => 'orcamento', 'label' => 'Orçamento'],
            ['key' => 'nota_credito', 'label' => 'Nota de Crédito'],
            ['key' => 'nota_debito', 'label' => 'Nota de Débito'],
        ];
    }
}
