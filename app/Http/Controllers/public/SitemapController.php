<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $base = rtrim(config('app.url') ?: 'https://www.sisgesc.net', '/');

        $staticUrls = [
            ['loc' => $base.'/', 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => route('blog.posts', absolute: true), 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => route('ask-expert.index', absolute: true), 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => $base.'/solutions', 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => $base.'/prices', 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => $base.'/contact', 'changefreq' => 'yearly', 'priority' => '0.5'],
        ];

        $posts = Cache::remember('sitemap_blog_posts', 3600, function () {
            return Post::published()
                ->orderByDesc('publish_date')
                ->get(['slug', 'publish_date', 'updated_at', 'image']);
        });

        $xml = view('seo.sitemap', [
            'staticUrls' => $staticUrls,
            'posts' => $posts,
        ])->render();

        return response($xml, 200)->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
