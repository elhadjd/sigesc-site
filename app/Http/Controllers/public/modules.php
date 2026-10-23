<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use App\Support\ConferenceMedia;
use App\Support\CrmScreenshots;
use App\Support\MarketplaceMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class modules extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    public function page(Request $request)
    {
        return $this->renderPublicPage($request, 'modules/index', [
            'seo' => $this->seo->forSolutions(),
            'prerender' => $this->content->solutions(),
            'modules' => $this->content->modules(),
        ]);
    }

    public function index(Request $request, $module)
    {
        $slug = Str::slug(str_replace(['_', ' '], '-', (string) $module));

        if ($slug === 'crm') {
            return $this->crm($request);
        }

        if (in_array($slug, ['chamadas-e-conferencias', 'conferencias', 'chamadas'], true)) {
            return $this->conferencias($request);
        }

        if ($slug === 'marketplace') {
            return $this->marketplace($request);
        }

        $moduleName = collect($this->content->modules())
            ->firstWhere('slug', $slug)['name']
            ?? ucwords(str_replace(['-', '_'], ' ', (string) $module));

        return $this->renderPublicPage($request, 'modules/sigesc-modules', [
            'moduleName' => $moduleName,
            'seo' => $this->seo->forModule($moduleName),
            'prerender' => $this->content->modulePage($moduleName, $slug),
            'modules' => $this->content->modules(),
        ]);
    }

    protected function crm(Request $request)
    {
        $module = $this->content->crmModule();

        return $this->renderPublicPage(
            $request,
            'modules/crm',
            [
                'moduleName' => 'CRM',
                'seo' => $this->seo->forCrm(),
                'prerender' => $this->content->crm(),
                'module' => $module,
                'modules' => $this->content->modules(),
            ],
            'seo.crm',
            [
                'module' => $module,
                'screenshots' => CrmScreenshots::all(),
            ]
        );
    }

    protected function conferencias(Request $request)
    {
        $module = $this->content->conferencesModule();

        return $this->renderPublicPage(
            $request,
            'modules/conferencias',
            [
                'moduleName' => 'Chamadas e Conferências',
                'seo' => $this->seo->forConferences(),
                'prerender' => $this->content->conferences(),
                'module' => $module,
                'modules' => $this->content->modules(),
            ],
            'seo.conferencias',
            [
                'module' => $module,
                'screenshots' => ConferenceMedia::all(),
            ]
        );
    }

    protected function marketplace(Request $request)
    {
        $module = $this->content->marketplaceModule();

        return $this->renderPublicPage(
            $request,
            'modules/marketplace',
            [
                'moduleName' => 'Marketplace',
                'seo' => $this->seo->forMarketplace(),
                'prerender' => $this->content->marketplace(),
                'module' => $module,
                'modules' => $this->content->modules(),
            ],
            'seo.marketplace',
            [
                'module' => $module,
                'screenshots' => MarketplaceMedia::all(),
            ]
        );
    }
}
