<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\SeoBuilder;
use App\Support\CrawlerDetector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class pricesController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function index(Request $request)
    {
        $seo = $this->seo->forPrices();
        $prerender = [
            'kicker' => 'Planos',
            'headline' => 'Preços SIGESC para PME em Angola',
            'lead' => 'Escolha o plano adequado ao tamanho e às necessidades da sua empresa. Software de gestão comercial com PDV, stock e faturação.',
            'sections' => [
                [
                    'heading' => 'O que está incluído',
                    'items' => [
                        'Gestão comercial e PDV',
                        'Controlo de inventário',
                        'Relatórios e apoio à decisão',
                        'Atualizações e suporte',
                    ],
                ],
            ],
            'links' => [
                ['href' => url('/solutions'), 'label' => 'Ver soluções'],
                ['href' => url('/contact'), 'label' => 'Pedir proposta'],
                ['href' => url('/downloads'), 'label' => 'Download'],
            ],
        ];

        $plans = null;
        try {
            $location = app()->getLocale();
            $response = Http::timeout(12)
                ->acceptJson()
                ->get("https://bo.sisgesc.net/api/{$location}/55/plans/");

            if ($response->successful()) {
                $plans = $response->json() ?? json_decode($response->body());
            }
        } catch (\Throwable $e) {
            Log::warning('Failed to load SIGESC plans', ['error' => $e->getMessage()]);
        }

        // Crawlers always get indexable HTML even if the plans API is down.
        if (CrawlerDetector::isSearchCrawler($request)) {
            return $this->renderPublicPage($request, 'prices/index', [
                'plans' => $plans,
                'seo' => $seo,
                'prerender' => $prerender,
            ]);
        }

        if ($plans === null) {
            return back()->withErrors(['error' => 'Não foi possível carregar os planos neste momento.']);
        }

        return $this->renderPublicPage($request, 'prices/index', [
            'plans' => $plans,
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }

    public function newCompanyPage(Request $request, $plan)
    {
        $seo = $this->seo->forPage([
            'title' => 'Criar empresa | SIGESC',
            'description' => 'Inicie o registo da sua empresa no SIGESC e escolha o plano adequado.',
            'path' => '/CreateCompany/'.$plan,
            'keywords' => 'criar empresa SIGESC, registo',
        ]);

        return $this->renderPublicPage($request, 'prices/Company', [
            'plan' => $plan,
            'seo' => $seo,
            'prerender' => [
                'headline' => 'Criar empresa no SIGESC',
                'lead' => 'Complete o registo para começar a usar o software de gestão comercial.',
                'links' => [
                    ['href' => url('/prices'), 'label' => 'Voltar aos preços'],
                    ['href' => url('/contact'), 'label' => 'Precisa de ajuda?'],
                ],
            ],
        ]);
    }
}
