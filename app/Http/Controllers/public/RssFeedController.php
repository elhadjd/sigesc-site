<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class RssFeedController extends Controller
{
    public function blog(): Response
    {
        $posts = Cache::remember('rss_blog_posts', 900, function () {
            return Post::published()
                ->orderByDesc('publish_date')
                ->limit(50)
                ->get();
        });

        $xml = view('seo.rss', [
            'title' => 'Blog SIGESC — Conteúdo empresarial Angola',
            'link' => route('blog.posts', absolute: true),
            'description' => 'Artigos sobre AGT, IVA, IRT, gestão comercial e empreendedorismo em Angola.',
            'posts' => $posts,
        ])->render();

        return response($xml, 200)->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }
}
