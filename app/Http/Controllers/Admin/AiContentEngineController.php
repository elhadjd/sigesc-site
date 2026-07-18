<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\AiContent\ProcessArticlePipeline;
use App\Jobs\AiContent\RunDailyContentPipeline;
use App\Models\AiContent\AiJob;
use App\Models\AiContent\AiLog;
use App\Models\AiContent\Article;
use App\Models\AiContent\Category;
use App\Models\AiContent\ExpertQuestion;
use App\Services\AiContentEngine\Agents\PublisherAgent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AiContentEngineController extends Controller
{
    public function dashboard()
    {
        $stats = Cache::remember('ai_content_dashboard_stats', 60, function () {
            return [
                'total' => Article::count(),
                'published' => Article::where('status', Article::STATUS_PUBLISHED)->count(),
                'needs_review' => Article::where(function ($q) {
                    $q->where('status', Article::STATUS_NEEDS_REVIEW)
                        ->orWhere('needs_human_review', true);
                })->count(),
                'scheduled' => Article::where('status', Article::STATUS_SCHEDULED)->count(),
                'failed' => Article::where('status', Article::STATUS_FAILED)->count(),
                'avg_seo' => round((float) Article::whereNotNull('seo_score')->avg('seo_score'), 1),
                'jobs_running' => AiJob::where('status', 'running')->count(),
                'jobs_failed' => AiJob::where('status', 'failed')->count(),
                'expert_questions' => ExpertQuestion::count(),
                'views' => (int) Article::sum('views'),
            ];
        });

        $recentArticles = Article::with('category')
            ->latest()
            ->limit(10)
            ->get();

        $recentJobs = AiJob::latest()->limit(10)->get();
        $recentLogs = AiLog::latest()->limit(20)->get();

        $categories = Category::query()
            ->orderByDesc('articles_count')
            ->limit(12)
            ->get(['name', 'slug', 'articles_count']);

        return Inertia::render('admin/ai-content/dashboard', [
            'stats' => $stats,
            'recentArticles' => $recentArticles,
            'recentJobs' => $recentJobs,
            'recentLogs' => $recentLogs,
            'categories' => $categories,
            'config' => [
                'auto_publish' => config('ai_content_engine.pipeline.auto_publish'),
                'topics_per_day' => config('ai_content_engine.pipeline.topics_per_day'),
                'enabled' => config('ai_content_engine.enabled'),
            ],
        ]);
    }

    public function articles(Request $request)
    {
        $query = Article::with('category')->latest();

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', "%{$term}%")
                    ->orWhere('focus_keyword', 'like', "%{$term}%");
            });
        }

        $articles = $query->paginate(15)->withQueryString();

        return Inertia::render('admin/ai-content/articles', [
            'articles' => $articles,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
            'statuses' => [
                'all', 'discovered', 'draft', 'needs_review', 'scheduled', 'published', 'failed',
            ],
        ]);
    }

    public function show(Article $article)
    {
        $article->load([
            'category', 'sections', 'sources', 'keywords', 'tags',
            'images', 'faqs', 'glossary', 'revisions', 'researchResults',
        ]);

        return Inertia::render('admin/ai-content/show', [
            'article' => $article,
        ]);
    }

    public function runDaily()
    {
        RunDailyContentPipeline::dispatch();

        return back()->with('success', 'Pipeline diário enviado para a fila.');
    }

    public function processArticle(Article $article)
    {
        ProcessArticlePipeline::dispatch($article->id);

        return back()->with('success', 'Pipeline do artigo enviado para a fila.');
    }

    public function approve(Article $article, PublisherAgent $publisher)
    {
        $article->update([
            'needs_human_review' => false,
            'status' => Article::STATUS_DRAFT,
        ]);

        $publisher->publishNow($article);
        Cache::forget('ai_content_dashboard_stats');

        return back()->with('success', 'Artigo aprovado e publicado.');
    }

    public function schedule(Request $request, Article $article)
    {
        $data = $request->validate([
            'scheduled_at' => 'required|date|after:now',
        ]);

        $article->update([
            'status' => Article::STATUS_SCHEDULED,
            'scheduled_at' => $data['scheduled_at'],
            'needs_human_review' => false,
        ]);

        Cache::forget('ai_content_dashboard_stats');

        return back()->with('success', 'Artigo agendado.');
    }

    public function jobs()
    {
        return Inertia::render('admin/ai-content/jobs', [
            'jobs' => AiJob::with('article:id,title,slug,status')
                ->latest()
                ->paginate(20),
            'queueStats' => [
                'pending' => AiJob::where('status', 'pending')->count(),
                'running' => AiJob::where('status', 'running')->count(),
                'failed' => AiJob::where('status', 'failed')->count(),
                'completed' => AiJob::where('status', 'completed')->count(),
            ],
        ]);
    }

    public function logs()
    {
        return Inertia::render('admin/ai-content/logs', [
            'logs' => AiLog::with(['article:id,title', 'job:id,uuid,type'])
                ->latest()
                ->paginate(40),
        ]);
    }

    public function expertQuestions()
    {
        return Inertia::render('admin/ai-content/expert', [
            'questions' => ExpertQuestion::with('article:id,title,slug,status')
                ->latest()
                ->paginate(20),
        ]);
    }
}
