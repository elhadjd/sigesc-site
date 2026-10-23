<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use App\Support\HospitalarMedia;
use App\Support\HubMedia;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    public function index(Request $request)
    {
        $products = $this->content->productsCatalog();

        return $this->renderPublicPage(
            $request,
            'produtos/index',
            [
                'seo' => $this->seo->forProducts(),
                'prerender' => $this->content->products(),
                'products' => $products,
            ],
            'seo.produtos',
            [
                'products' => $products,
            ]
        );
    }

    public function hospitalar(Request $request)
    {
        $product = $this->content->hospitalarProduct();

        return $this->renderPublicPage(
            $request,
            'produtos/hospitalar',
            [
                'seo' => $this->seo->forHospitalar(),
                'prerender' => $this->content->hospitalar(),
                'product' => $product,
            ],
            'seo.hospitalar',
            [
                'product' => $product,
                'screenshots' => HospitalarMedia::all(),
            ]
        );
    }

    public function hub(Request $request)
    {
        $product = $this->content->hubProduct();

        return $this->renderPublicPage(
            $request,
            'produtos/hub',
            [
                'seo' => $this->seo->forHub(),
                'prerender' => $this->content->hub(),
                'product' => $product,
            ],
            'seo.hub',
            [
                'product' => $product,
                'screenshots' => HubMedia::all(),
            ]
        );
    }
}
