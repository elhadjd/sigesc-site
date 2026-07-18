<?php

namespace App\Http\Controllers;

use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    public function index(Request $request)
    {
        return $this->renderPublicPage($request, 'dashboard', [
            'local' => $request->getLocale(),
            'seo' => $this->seo->forHome(),
            'prerender' => $this->content->home(),
            'modules' => $this->content->modules(),
        ]);
    }
}
