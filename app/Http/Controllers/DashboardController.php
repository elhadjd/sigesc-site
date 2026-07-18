<?php

namespace App\Http\Controllers;

use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function index(Request $request)
    {
        $seo = $this->seo->forHome();
        $prerender = [
            'kicker' => 'Software de gestão Angola',
            'headline' => 'SIGESC — gestão comercial completa para PME',
            'lead' => 'Gerencie PDV, estoque, finanças, compras e faturação eletrónica AGT numa única plataforma feita para empresas em Angola.',
            'sections' => [
                [
                    'heading' => 'O que pode fazer com o SIGESC',
                    'items' => [
                        'Ponto de venda (PDV) e faturação',
                        'Controlo de stock e inventário',
                        'Finanças, fluxo de caixa e relatórios',
                        'Gestão de funcionários e operações',
                        'Conformidade com AGT e legislação angolana',
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/solutions'), 'label' => 'Ver soluções', 'description' => 'Módulos e funcionalidades'],
                ['href' => url('/prices'), 'label' => 'Ver preços', 'description' => 'Planos para o seu negócio'],
                ['href' => url('/blog/posts'), 'label' => 'Blog', 'description' => 'AGT, IVA, gestão e empreendedorismo'],
                ['href' => url('/calculadoras'), 'label' => 'Calculadoras fiscais', 'description' => 'IRT, IVA, Imposto Industrial'],
                ['href' => url('/pergunte-ao-especialista'), 'label' => 'Pergunte ao Especialista', 'description' => 'Respostas com base em fontes'],
                ['href' => url('/downloads'), 'label' => 'Downloads', 'description' => 'Instalar o SIGESC'],
            ],
        ];

        return $this->renderPublicPage($request, 'dashboard', [
            'local' => $request->getLocale(),
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }
}
