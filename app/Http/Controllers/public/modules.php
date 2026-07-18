<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class modules extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function page(Request $request)
    {
        $seo = $this->seo->forSolutions();
        $prerender = [
            'kicker' => 'Soluções',
            'headline' => 'Soluções SIGESC para a sua empresa',
            'lead' => 'Módulos integrados de gestão comercial: vendas, stock, RH, finanças e operações — pensados para o mercado angolano.',
            'sections' => [
                [
                    'heading' => 'Módulos principais',
                    'items' => [
                        'Ponto de Venda',
                        'Gestão de Estoque',
                        'Gestão de Funcionários',
                        'Logística',
                        'Agendamentos',
                        'Relatórios e finanças',
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/modules/ponto-de-venda'), 'label' => 'Ponto de Venda'],
                ['href' => url('/modules/gestao-de-stock'), 'label' => 'Gestão de Estoque'],
                ['href' => url('/modules/gestao-de-funcionarios'), 'label' => 'Gestão de Funcionários'],
                ['href' => url('/prices'), 'label' => 'Ver preços'],
                ['href' => url('/contact'), 'label' => 'Falar com a equipa'],
            ],
        ];

        return $this->renderPublicPage($request, 'modules/index', [
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }

    public function index(Request $request, $module)
    {
        $moduleName = ucwords(str_replace(['-', '_'], ' ', $module));
        $seo = $this->seo->forModule($moduleName);
        $prerender = [
            'kicker' => 'Módulo SIGESC',
            'headline' => "Módulo {$moduleName}",
            'lead' => "O módulo {$moduleName} do SIGESC ajuda a organizar processos e aumentar a produtividade da sua empresa em Angola.",
            'sections' => [
                [
                    'heading' => 'Porquê usar este módulo',
                    'body' => 'Integrado com o restante do SIGESC: dados partilhados, relatórios e conformidade com práticas de gestão comercial modernas.',
                ],
            ],
            'links' => [
                ['href' => url('/solutions'), 'label' => 'Todas as soluções'],
                ['href' => url('/prices'), 'label' => 'Planos e preços'],
                ['href' => url('/pregunte-ao-especialista'), 'label' => 'Pergunte ao Especialista'],
            ],
        ];

        return $this->renderPublicPage($request, 'modules/sigesc-modules', [
            'moduleName' => $moduleName,
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }
}
