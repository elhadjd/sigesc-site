<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Models\AiContent\Article;
use App\Models\Post;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $base = rtrim(config('app.url') ?: config('sigesc.site_url'), '/');

        $staticUrls = [
            ['loc' => $base.'/', 'changefreq' => 'weekly', 'priority' => '1.0'],
            ['loc' => route('blog.posts', absolute: true), 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => route('ask-expert.index', absolute: true), 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => route('calculators.index', absolute: true), 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => route('invoice-generator.index', absolute: true), 'changefreq' => 'weekly', 'priority' => '0.95'],
            ['loc' => route('barcode-qr-generator.index', absolute: true), 'changefreq' => 'weekly', 'priority' => '0.95'],
            ['loc' => route('invoice-templates.index', absolute: true), 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => url('/feed.xml'), 'changefreq' => 'hourly', 'priority' => '0.5'],
            ['loc' => $base.'/solutions', 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => $base.'/prices', 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => $base.'/contact', 'changefreq' => 'yearly', 'priority' => '0.5'],
            ['loc' => $base.'/downloads', 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => $base.'/shop', 'changefreq' => 'weekly', 'priority' => '0.6'],
            ['loc' => $base.'/clients/depoiments', 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => $base.'/resources/help', 'changefreq' => 'yearly', 'priority' => '0.4'],
            ['loc' => $base.'/resources/faq', 'changefreq' => 'yearly', 'priority' => '0.4'],
        ];

        foreach (config('sigesc_modules', []) as $module) {
            $staticUrls[] = [
                'loc' => $base.'/modules/'.$module['slug'],
                'changefreq' => 'monthly',
                'priority' => '0.7',
            ];
        }

        $posts = Cache::remember('sitemap_blog_posts', 900, function () {
            return Post::published()
                ->orderByDesc('publish_date')
                ->get(['slug', 'title', 'publish_date', 'updated_at', 'image']);
        });

        // Also list published AI articles (in case sync lag); de-dupe by slug in the view layer.
        $aiArticles = Cache::remember('sitemap_ai_articles', 900, function () {
            return Article::published()
                ->orderByDesc('published_at')
                ->get(['slug', 'title', 'published_at', 'updated_at', 'featured_image']);
        });

        $xml = view('seo.sitemap', [
            'staticUrls' => $staticUrls,
            'posts' => $posts,
            'aiArticles' => $aiArticles,
        ])->render();

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8')
            ->header('X-Robots-Tag', 'noarchive');
    }
}
