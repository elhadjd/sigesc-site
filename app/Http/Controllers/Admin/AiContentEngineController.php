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
use App\Models\AiContent\ResearchLog;
use App\Models\AiContent\ResearchSetting;
use App\Models\AiContent\ResearchSource;
use App\Services\AiContentEngine\Agents\FactCheckerAgent;
use App\Services\AiContentEngine\Agents\PublisherAgent;
use App\Services\AiContentEngine\Research\TavilyClient;
use App\Services\AiContentEngine\Support\LlmGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AiContentEngineController extends Controller
{
    public function dashboard(LlmGateway $llm, TavilyClient $tavily)
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
                'llm_provider' => $llm->provider(),
                'llm_ready' => $llm->configured(),
                'tavily_ready' => $tavily->configured(),
                'openai_ready' => filled(config('ai_content_engine.openai.api_key')),
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

    public function runDaily(Request $request, LlmGateway $llm)
    {
        if (! $llm->configured()) {
            return $this->actionResponse($request, false, $llm->missingConfigMessage(), 422);
        }

        // afterResponse: even with QUEUE_CONNECTION=sync, axios gets JSON before the long pipeline runs
        RunDailyContentPipeline::dispatch()->afterResponse();

        $provider = $llm->provider();
        $message = 'Pipeline diário enviado para a fila (LLM: '.($provider ?? 'n/d').').';

        $driver = (string) config('queue.default');
        if ($driver === 'database') {
            $message .= ' Com QUEUE_CONNECTION=database, mantenha `php artisan queue:work database --timeout=3600` a correr.';
        }

        return $this->actionResponse($request, true, $message, 200, [
            'provider' => $provider,
            'queue' => $driver,
        ]);
    }

    public function processArticle(Request $request, Article $article)
    {
        ProcessArticlePipeline::dispatch($article->id)->afterResponse();

        return $this->actionResponse($request, true, 'Pipeline do artigo enviado para a fila.');
    }

    public function approve(Request $request, Article $article, PublisherAgent $publisher)
    {
        $article->update([
            'needs_human_review' => false,
            'fact_check_status' => FactCheckerAgent::STATUS_VERIFIED,
            'status' => Article::STATUS_DRAFT,
        ]);

        $publisher->publishNow($article);
        Cache::forget('ai_content_dashboard_stats');

        return $this->actionResponse($request, true, 'Artigo aprovado e publicado.', 200, [
            'article_id' => $article->id,
            'status' => $article->fresh()->status,
        ]);
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
            'fact_check_status' => FactCheckerAgent::STATUS_VERIFIED,
        ]);

        Cache::forget('ai_content_dashboard_stats');

        return $this->actionResponse($request, true, 'Artigo agendado.', 200, [
            'article_id' => $article->id,
            'scheduled_at' => $article->fresh()->scheduled_at,
        ]);
    }

    /**
     * Prefer JSON for axios admin actions; keep Inertia redirect fallback.
     *
     * @param  array<string, mixed>  $extra
     */
    protected function actionResponse(Request $request, bool $ok, string $message, int $status = 200, array $extra = [])
    {
        if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
            return response()->json(array_merge([
                'ok' => $ok,
                'message' => $message,
            ], $extra), $status);
        }

        $flash = $ok ? 'success' : 'error';

        return back()->with($flash, $message);
    }

    public function jobs()
    {
        $driver = (string) config('queue.default');
        $laravelPending = 0;
        $laravelFailed = 0;

        try {
            if ($driver === 'database') {
                $laravelPending = (int) DB::table('jobs')->count();
                $laravelFailed = (int) DB::table('failed_jobs')->count();
            }
        } catch (\Throwable) {
            // tables may not exist yet
        }

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
            'queueDriver' => $driver,
            'laravelQueue' => [
                'pending' => $laravelPending,
                'failed' => $laravelFailed,
            ],
            'workerHint' => $driver === 'database'
                ? 'php artisan queue:work database --timeout=3600 --tries=1 --sleep=2'
                : null,
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

    public function researchSettings()
    {
        return Inertia::render('admin/ai-content/research-settings', [
            'settings' => ResearchSetting::allMapped(),
            'sources' => ResearchSource::query()
                ->orderByDesc('priority')
                ->orderByDesc('trust_score')
                ->get(),
            'recentLogs' => ResearchLog::query()
                ->latest()
                ->limit(25)
                ->get(['id', 'agent', 'action', 'provider', 'status', 'execution_time_ms', 'error', 'created_at']),
            'defaults' => [
                'cache_days' => (int) config('ai_content_engine.research.cache_days', 30),
                'max_sources' => (int) config('ai_content_engine.research.max_sources', 12),
                'min_trust_score' => (int) config('ai_content_engine.research.min_trust_score', 50),
                'tavily_enabled' => (bool) config('ai_content_engine.tavily.enabled', true),
            ],
        ]);
    }

    public function updateResearchSettings(Request $request)
    {
        $data = $request->validate([
            'tavily_enabled' => 'required|boolean',
            'news_enabled' => 'required|boolean',
            'internal_knowledge_enabled' => 'required|boolean',
            'max_sources' => 'required|integer|min:1|max:40',
            'min_trust_score' => 'required|integer|min:0|max:100',
            'cache_days' => 'required|integer|min:1|max:365',
        ]);

        foreach ($data as $key => $value) {
            ResearchSetting::setValue($key, $value);
        }

        return back()->with('success', 'Research Engine Settings atualizadas.');
    }

    public function toggleResearchSource(Request $request, ResearchSource $source)
    {
        $data = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $source->update(['is_active' => $data['is_active']]);

        return back()->with('success', 'Fonte atualizada: '.$source->name);
    }
}
