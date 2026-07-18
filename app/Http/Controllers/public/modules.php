<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
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
}
