<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Cache key baseada apenas nos parâmetros relevantes (não serializar o Request completo)
        $cacheKey = 'blog_posts_' . md5(json_encode([
            'category' => $request->category,
            'search' => $request->search,
            'sort' => $request->sort,
            'page' => $request->page
        ]));

        // Dados em cache por 15 minutos para melhor performance
        // Query base para posts publicados
        $query = Post::published()
            ->orderBy('publish_date', 'desc');

        // Filtro por categoria se fornecido
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Busca por termo
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                    ->orWhere('excerpt', 'like', '%' . $searchTerm . '%')
                    ->orWhere('content', 'like', '%' . $searchTerm . '%')
                    ->orWhereJsonContains('tags', $searchTerm);
            });
        }

        // Ordenação
        switch ($request->get('sort', 'newest')) {
            case 'oldest':
                $query->orderBy('publish_date', 'asc');
                break;
            case 'popular':
                $query->orderBy('views', 'desc');
                break;
            case 'views':
                $query->orderBy('views', 'desc');
                break;
            default:
                $query->orderBy('publish_date', 'desc');
        }

        // Paginação - 9 posts por página para o grid 3x3
        $posts = $query->paginate(9);

        // Dados adicionais para a página
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

        $data = [
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
            'categories' => $categories,
            'featuredPosts' => $featuredPosts,
            'recentPosts' => $recentPosts,
            'trendingPosts' => $trendingPosts,
        ];

        if ($request->header('X-Requested-With') === 'XMLHttpRequest') {
            return response()->json($data);
        }

        // Retornar view completa para carga inicial com Inertia
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
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        // Cache individual do post por 30 minutos
        $cacheKey = 'blog_post_' . $slug;

        $data = Cache::remember($cacheKey, 1800, function () use ($slug) {
            $post = Post::published()
                ->where('slug', $slug)
                ->firstOrFail();

            // Incrementar visualizações de forma otimizada
            $post->increment('views');

            // Posts relacionados (mesma categoria)
            $relatedPosts = Post::published()
                ->where('category', $post->category)
                ->where('id', '!=', $post->id)
                ->orderBy('publish_date', 'desc')
                ->limit(3)
                ->get();

            return [
                'post' => $post,
                'relatedPosts' => $relatedPosts,
            ];
        });

        return Inertia::render('blog/post', $data);
    }

    /**
     * API para buscar posts com filtros
     */
    public function apiIndex(Request $request)
    {
        $query = Post::published()
            ->withCount('comments')
            ->orderBy('publish_date', 'desc');

        // Filtro por categoria
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Busca por termo
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', '%' . $searchTerm . '%')
                    ->orWhere('excerpt', 'like', '%' . $searchTerm . '%')
                    ->orWhere('content', 'like', '%' . $searchTerm . '%')
                    ->orWhereJsonContains('tags', $searchTerm);
            });
        }

        // Ordenação
        switch ($request->get('sort', 'newest')) {
            case 'oldest':
                $query->orderBy('publish_date', 'asc');
                break;
            case 'popular':
                $query->orderBy('views', 'desc');
                break;
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
            ]
        ]);
    }

    /**
     * Get featured posts (API)
     */
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

    /**
     * Get recent posts (API)
     */
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

    /**
     * Get trending posts (API)
     */
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

    /**
     * Get all categories (API)
     */
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

    /**
     * Increment post likes (API)
     */
    public function like($id)
    {
        $post = Post::published()->findOrFail($id);

        // Usar cache para evitar spam
        $ip = request()->ip();
        $cacheKey = 'post_like_' . $id . '_' . $ip;

        if (Cache::has($cacheKey)) {
            return response()->json([
                'message' => 'Você já curtiu este post recentemente',
                'likes' => $post->likes
            ], 429);
        }

        $post->increment('likes');
        Cache::put($cacheKey, true, 3600); // Bloquear por 1 hora

        return response()->json([
            'message' => 'Post curtido com sucesso',
            'likes' => $post->fresh()->likes
        ]);
    }

    /**
     * Search posts (API)
     */
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100'
        ]);

        $posts = Post::published()
            ->where(function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->q . '%')
                    ->orWhere('excerpt', 'like', '%' . $request->q . '%')
                    ->orWhere('content', 'like', '%' . $request->q . '%')
                    ->orWhereJsonContains('tags', $request->q);
            })
            ->orderBy('publish_date', 'desc')
            ->limit(10)
            ->get();

        return response()->json($posts);
    }
}
