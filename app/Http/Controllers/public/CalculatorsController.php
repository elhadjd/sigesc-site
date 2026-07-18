<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use App\Services\Tax\AngolaTaxCalculator;
use App\Support\CrawlerDetector;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CalculatorsController extends Controller
{
    public function __construct(
        protected AngolaTaxCalculator $tax,
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    public function index(Request $request)
    {
        $seo = $this->seo->defaults([
            'title' => 'Calculadoras Fiscais Angola (IVA, IRT 2026, Imposto Industrial) | SIGESC',
            'description' => 'Simule IRT 2026 (Lei n.º 14/25), IVA, Imposto Industrial, retenção na fonte 6,5% e contribuição cambial. Cálculos no servidor com base na legislação angolana configurada — para PME e gestores.',
            'canonical' => route('calculators.index', absolute: true),
            'keywords' => 'calculadora IRT Angola 2026, calculadora IVA Angola, Imposto Industrial, retenção na fonte 6.5%, contribuição cambial, AGT, OGE 2026',
            'og_type' => 'website',
        ]);

        $meta = $this->tax->meta();
        $prerender = $this->content->calculators($meta);

        if (CrawlerDetector::isSearchCrawler($request)) {
            return response()->view('seo.calculators-index', [
                'seo' => $seo,
                'meta' => $meta,
                'page' => $prerender,
            ]);
        }

        return $this->renderPublicPage($request, 'calculators/index', [
            'meta' => $meta,
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }

    public function calculate(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', Rule::in([
                'irt_grupo_a', 'irt_grupo_c', 'iva', 'imposto_industrial', 'retencao_servicos', 'cambio',
            ])],
            'gross_monthly' => 'nullable|numeric|min:0|max:1000000000',
            'annual_turnover' => 'nullable|numeric|min:0|max:100000000000',
            'primary_sector' => 'nullable|boolean',
            'amount' => 'nullable|numeric|min:0|max:100000000000',
            'rate_key' => 'nullable|string|max:80',
            'mode' => 'nullable|in:add,extract',
            'taxable_profit' => 'nullable|numeric|min:-100000000000|max:100000000000',
            'invoice_amount' => 'nullable|numeric|min:0|max:100000000000',
            'transfer_amount' => 'nullable|numeric|min:0|max:100000000000',
            'person_type' => 'nullable|in:pessoa_singular,pessoa_colectiva',
        ]);

        try {
            $result = match ($data['type']) {
                'irt_grupo_a' => $this->tax->irtGroupA($data['gross_monthly'] ?? 0),
                'irt_grupo_c' => $this->tax->irtGroupC(
                    $data['annual_turnover'] ?? 0,
                    (bool) ($data['primary_sector'] ?? false)
                ),
                'iva' => $this->tax->iva(
                    $data['amount'] ?? 0,
                    $data['rate_key'] ?? 'geral',
                    $data['mode'] ?? 'add'
                ),
                'imposto_industrial' => $this->tax->impostoIndustrial(
                    $data['taxable_profit'] ?? 0,
                    $data['rate_key'] ?? 'geral'
                ),
                'retencao_servicos' => $this->tax->retencaoServicos($data['invoice_amount'] ?? 0),
                'cambio' => $this->tax->cambio(
                    $data['transfer_amount'] ?? 0,
                    $data['person_type'] ?? 'pessoa_colectiva'
                ),
            };
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json($result);
    }
}
