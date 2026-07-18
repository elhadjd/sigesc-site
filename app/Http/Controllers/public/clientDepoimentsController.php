<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class clientDepoimentsController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function index(Request $request, $page)
    {
        $seo = $this->seo->forClients($page);
        $prerender = [
            'kicker' => 'Clientes',
            'headline' => 'Clientes e depoimentos SIGESC',
            'lead' => 'Empresas em Angola que confiam no SIGESC para gerir vendas, stock e operações do dia a dia.',
            'links' => [
                ['href' => url('/solutions'), 'label' => 'Ver soluções'],
                ['href' => url('/prices'), 'label' => 'Ver preços'],
                ['href' => url('/contact'), 'label' => 'Falar connosco'],
            ],
        ];

        return $this->renderPublicPage($request, "clients/{$page}", [
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }
}
