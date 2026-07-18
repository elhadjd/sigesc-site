<?php

namespace App\Services\AiContentEngine\Research\Providers;

use App\Models\AiContent\Article;
use App\Models\AiContent\ResearchFinding;
use App\Models\AiContent\ResearchSetting;
use App\Models\Post;
use App\Services\AiContentEngine\Research\Contracts\ResearchProviderInterface;
use Illuminate\Support\Str;

class InternalKnowledgeProvider implements ResearchProviderInterface
{
    public function name(): string
    {
        return 'internal';
    }

    public function search(string $topic, int $limit = 6): array
    {
        $enabled = ResearchSetting::getValue(
            'internal_knowledge_enabled',
            (bool) config('ai_content_engine.research.internal_knowledge_enabled', true)
        );

        if (! $enabled) {
            return [];
        }

        $results = [];
        $terms = collect(preg_split('/\s+/', Str::lower($topic)) ?: [])
            ->filter(fn ($t) => mb_strlen($t) > 3)
            ->take(5)
            ->values();

        $posts = Post::published()
            ->when($terms->isNotEmpty(), function ($q) use ($terms) {
                $q->where(function ($inner) use ($terms) {
                    foreach ($terms as $term) {
                        $inner->orWhere('title', 'like', "%{$term}%")
                            ->orWhere('excerpt', 'like', "%{$term}%");
                    }
                });
            })
            ->orderByDesc('publish_date')
            ->limit($limit)
            ->get();

        foreach ($posts as $post) {
            $results[] = [
                'title' => $post->title,
                'url' => url('/blog/posts/'.$post->slug),
                'snippet' => $post->excerpt,
                'content' => Str::limit(strip_tags((string) $post->content), 1200, ''),
                'provider' => $this->name(),
                'trust_score' => 80,
                'published_date' => optional($post->publish_date)->toDateString(),
                'metadata' => ['origin' => 'blog_posts', 'slug' => $post->slug],
            ];
        }

        $articles = Article::query()
            ->whereIn('status', [Article::STATUS_PUBLISHED, Article::STATUS_SCHEDULED, Article::STATUS_NEEDS_REVIEW])
            ->when($terms->isNotEmpty(), function ($q) use ($terms) {
                $q->where(function ($inner) use ($terms) {
                    foreach ($terms as $term) {
                        $inner->orWhere('title', 'like', "%{$term}%")
                            ->orWhere('excerpt', 'like', "%{$term}%")
                            ->orWhere('focus_keyword', 'like', "%{$term}%");
                    }
                });
            })
            ->orderByDesc('updated_at')
            ->limit($limit)
            ->get();

        foreach ($articles as $article) {
            $results[] = [
                'title' => $article->title,
                'url' => url('/blog/posts/'.$article->slug),
                'snippet' => $article->excerpt,
                'content' => Str::limit(strip_tags((string) $article->content_html), 1200, ''),
                'provider' => $this->name(),
                'trust_score' => 82,
                'published_date' => optional($article->published_at)->toDateString(),
                'metadata' => ['origin' => 'ai_articles', 'id' => $article->id],
            ];
        }

        // Reuse prior high-trust findings on same topic keywords.
        $prior = ResearchFinding::query()
            ->where('trust_score', '>=', 70)
            ->where(function ($q) use ($terms, $topic) {
                $q->where('topic', 'like', '%'.Str::limit($topic, 80, '').'%');
                foreach ($terms as $term) {
                    $q->orWhere('topic', 'like', "%{$term}%")
                        ->orWhere('title', 'like', "%{$term}%");
                }
            })
            ->orderByDesc('trust_score')
            ->orderByDesc('searched_at')
            ->limit($limit)
            ->get();

        foreach ($prior as $finding) {
            $results[] = [
                'title' => $finding->title,
                'url' => $finding->url,
                'snippet' => $finding->summary ?: Str::limit((string) $finding->content, 400, ''),
                'content' => $finding->content,
                'provider' => $this->name(),
                'source_id' => $finding->source_id,
                'trust_score' => (int) $finding->trust_score,
                'published_date' => optional($finding->published_date)->toDateString(),
                'metadata' => ['origin' => 'research_results_cache', 'finding_id' => $finding->id],
            ];
        }

        usort($results, fn ($a, $b) => ($b['trust_score'] <=> $a['trust_score']));

        // De-dupe by URL/title.
        $unique = [];
        foreach ($results as $item) {
            $key = $item['url'] ?: md5(($item['title'] ?? '').($item['snippet'] ?? ''));
            if (isset($unique[$key])) {
                continue;
            }
            $unique[$key] = $item;
        }

        return array_slice(array_values($unique), 0, $limit);
    }
}
