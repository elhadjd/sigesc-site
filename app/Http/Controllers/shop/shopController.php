<?php

namespace App\Http\Controllers\shop;

use App\Http\Controllers\Controller;
use App\Models\book;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;

class shopController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function index(Request $request, $page = null)
    {
        $seo = $this->seo->forShop($page);
        $prerender = [
            'kicker' => 'Loja',
            'headline' => $page ? ucwords(str_replace(['-', '_'], ' ', $page)).' | Loja SIGESC' : 'Loja SIGESC',
            'lead' => 'Livros, recursos e produtos para empresários e gestores que usam o SIGESC em Angola.',
            'links' => [
                ['href' => url('/shop'), 'label' => 'Início da loja'],
                ['href' => url('/shop/books/audio-books'), 'label' => 'Audiolivros'],
                ['href' => url('/blog/posts'), 'label' => 'Blog'],
                ['href' => url('/contact'), 'label' => 'Contacto'],
            ],
        ];

        $component = $page ? "shop/{$page}" : 'shop/index';

        return $this->renderPublicPage($request, $component, [
            'local' => app()->getLocale(),
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }

    public function audioBooksPage(Request $request)
    {
        $seo = $this->seo->forShop('audio-books');
        $books = book::all();

        return $this->renderPublicPage($request, 'shop/books/audio-books', [
            'local' => app()->getLocale(),
            'books' => $books,
            'seo' => $seo,
            'prerender' => [
                'headline' => 'Audiolivros SIGESC',
                'lead' => 'Recursos em áudio para formação e gestão empresarial.',
                'links' => [
                    ['href' => url('/shop'), 'label' => 'Voltar à loja'],
                ],
            ],
        ]);
    }

    public function downloadAudioBooks($local, book $book)
    {
        $filePath = storage_path("app/public/videos/{$book->url_download}");

        if (! file_exists($filePath)) {
            abort(404);
        }

        $book->downloads()->create([
            'ip_client' => request()->ip(),
        ]);

        return response()->download($filePath);
    }
}
