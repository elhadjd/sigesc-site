<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use App\Support\CrawlerDetector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Post::published()
            ->orderBy('publish_date', 'desc');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && ! empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%'.$searchTerm.'%')
                    ->orWhere('excerpt', 'like', '%'.$searchTerm.'%')
                    ->orWhere('content', 'like', '%'.$searchTerm.'%')
                    ->orWhereJsonContains('tags', $searchTerm);
            });
        }

        switch ($request->get('sort', 'newest')) {
            case 'oldest':
                $query->orderBy('publish_date', 'asc');
                break;
            case 'popular':
            case 'views':
                $query->orderBy('views', 'desc');
                break;
            default:
                $query->orderBy('publish_date', 'desc');
        }

        $posts = $query->paginate(9);

        $categories = Post::published()
            ->select('category', DB::raw('count(*) as total'))
            ->groupBy('category')
            ->orderBy('total', 'desc')
            ->pluck('category')
            ->toArray();

        $featuredPosts = Post::published()
            ->featured()
            ->orderBy('publish_date', 'desc')
            ->limit(3)
            ->get();

        $recentPosts = Post::published()
            ->orderBy('publish_date', 'desc')
            ->limit(5)
            ->get();

        $trendingPosts = Post::published()
            ->orderBy('views', 'desc')
            ->limit(5)
            ->get();

        $pagination = [
            'current_page' => $posts->currentPage(),
            'last_page' => $posts->lastPage(),
            'per_page' => $posts->perPage(),
            'total' => $posts->total(),
        ];

        $data = [
            'posts' => $posts->items(),
            'pagination' => $pagination,
            'categories' => $categories,
            'featuredPosts' => $featuredPosts,
            'recentPosts' => $recentPosts,
            'trendingPosts' => $trendingPosts,
        ];

        if ($request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json($data);
        }

        $seo = $this->seo->forBlogIndex();
        $prerender = $this->content->blogIndex($posts->items(), $categories);

        // Full HTML document for search engines / social crawlers.
        if (CrawlerDetector::isSearchCrawler($request)) {
            return response()
                ->view('seo.blog-index', [
                    'posts' => $posts->items(),
                    'pagination' => $pagination,
                    'seo' => $seo,
                    'page' => $prerender,
                    'categories' => $categories,
                ])
                ->header('X-Robots-Tag', 'index, follow');
        }

        return Inertia::render('blog/index', [
            'posts' => $data['posts'],
            'pagination' => $data['pagination'],
            'categories' => $data['categories'],
            'featuredPosts' => $data['featuredPosts'],
            'recentPosts' => $data['recentPosts'],
            'trendingPosts' => $data['trendingPosts'],
            'filters' => [
                'category' => $request->category ?? 'all',
                'search' => $request->search ?? '',
                'sort' => $request->sort ?? 'newest',
            ],
            'seo' => $seo,
            'prerender' => $prerender,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $slug)
    {
        $cacheKey = 'blog_post_'.$slug;

        $data = Cache::remember($cacheKey, 1800, function () use ($slug) {
            $post = Post::published()
                ->where('slug', $slug)
                ->firstOrFail();

            $post->increment('views');

            $relatedPosts = Post::published()
                ->where('category', $post->category)
                ->where('id', '!=', $post->id)
                ->orderBy('publish_date', 'desc')
                ->limit(3)
                ->get();

            return [
                'post' => $post->fresh(),
                'relatedPosts' => $relatedPosts,
            ];
        });

        $seo = $this->seo->forPost($data['post']);

        if (CrawlerDetector::isSearchCrawler($request)) {
            return response()
                ->view('seo.blog-post', [
                    'post' => $data['post'],
                    'relatedPosts' => $data['relatedPosts'],
                    'seo' => $seo,
                ])
                ->header('X-Robots-Tag', 'index, follow')
                ->header('Cache-Control', 'public, max-age=300');
        }

        return Inertia::render('blog/post', [
            'post' => $data['post'],
            'relatedPosts' => $data['relatedPosts'],
            'seo' => $seo,
        ]);
    }

    /**
     * API para buscar posts com filtros
     */
    public function apiIndex(Request $request)
    {
        $query = Post::published()
            ->withCount('comments')
            ->orderBy('publish_date', 'desc');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && ! empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%'.$searchTerm.'%')
                    ->orWhere('excerpt', 'like', '%'.$searchTerm.'%')
                    ->orWhere('content', 'like', '%'.$searchTerm.'%')
                    ->orWhereJsonContains('tags', $searchTerm);
            });
        }

        switch ($request->get('sort', 'newest')) {
            case 'oldest':
                $query->orderBy('publish_date', 'asc');
                break;
            case 'popular':
            case 'views':
                $query->orderBy('views', 'desc');
                break;
            default:
                $query->orderBy('publish_date', 'desc');
        }

        $posts = $query->paginate(9);

        return response()->json([
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    public function featured()
    {
        $featuredPosts = Cache::remember('featured_posts', 3600, function () {
            return Post::published()
                ->featured()
                ->orderBy('publish_date', 'desc')
                ->limit(6)
                ->get();
        });

        return response()->json($featuredPosts);
    }

    public function recent()
    {
        $recentPosts = Cache::remember('recent_posts', 300, function () {
            return Post::published()
                ->orderBy('publish_date', 'desc')
                ->limit(5)
                ->get();
        });

        return response()->json($recentPosts);
    }

    public function trending()
    {
        $trendingPosts = Cache::remember('trending_posts', 1800, function () {
            return Post::published()
                ->orderBy('views', 'desc')
                ->limit(5)
                ->get();
        });

        return response()->json($trendingPosts);
    }

    public function categories()
    {
        $categories = Cache::remember('post_categories', 3600, function () {
            return Post::published()
                ->select('category', DB::raw('count(*) as total'))
                ->groupBy('category')
                ->orderBy('total', 'desc')
                ->get()
                ->pluck('category');
        });

        return response()->json($categories);
    }

    public function like($id)
    {
        $post = Post::published()->findOrFail($id);

        $ip = request()->ip();
        $cacheKey = 'post_like_'.$id.'_'.$ip;

        if (Cache::has($cacheKey)) {
            return response()->json([
                'message' => 'Você já curtiu este post recentemente',
                'likes' => $post->likes,
            ], 429);
        }

        $post->increment('likes');
        Cache::put($cacheKey, true, 3600);

        return response()->json([
            'message' => 'Post curtido com sucesso',
            'likes' => $post->fresh()->likes,
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100',
        ]);

        $posts = Post::published()
            ->where(function ($query) use ($request) {
                $query->where('title', 'like', '%'.$request->q.'%')
                    ->orWhere('excerpt', 'like', '%'.$request->q.'%')
                    ->orWhere('content', 'like', '%'.$request->q.'%')
                    ->orWhereJsonContains('tags', $request->q);
            })
            ->orderBy('publish_date', 'desc')
            ->limit(10)
            ->get();

        return response()->json($posts);
    }
}
