<?php

namespace App\Models\AiContent;

use App\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Article extends Model
{
    use SoftDeletes;

    protected $table = 'ai_articles';

    public const STATUS_DISCOVERED = 'discovered';
    public const STATUS_RESEARCHING = 'researching';
    public const STATUS_DRAFTING = 'drafting';
    public const STATUS_REVIEWING = 'reviewing';
    public const STATUS_FACT_CHECKING = 'fact_checking';
    public const STATUS_SEO = 'seo';
    public const STATUS_IMAGING = 'imaging';
    public const STATUS_SOCIAL = 'social';
    public const STATUS_DRAFT = 'draft';
    public const STATUS_NEEDS_REVIEW = 'needs_review';
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_FAILED = 'failed';
    public const STATUS_ARCHIVED = 'archived';

    protected $fillable = [
        'uuid', 'category_id', 'post_id', 'title', 'slug', 'status', 'priority',
        'focus_keyword', 'excerpt', 'content_html', 'content_markdown',
        'featured_image', 'read_time', 'seo_score', 'fact_confidence',
        'needs_human_review', 'is_ai_generated', 'author_name', 'author_role',
        'author_avatar', 'meta_title', 'meta_description', 'canonical_url',
        'open_graph', 'twitter_card', 'schema_json_ld', 'social_posts',
        'pipeline_meta', 'toc', 'scheduled_at', 'published_at', 'views',
    ];

    protected $casts = [
        'priority' => 'integer',
        'read_time' => 'integer',
        'seo_score' => 'float',
        'fact_confidence' => 'float',
        'needs_human_review' => 'boolean',
        'is_ai_generated' => 'boolean',
        'open_graph' => 'array',
        'twitter_card' => 'array',
        'schema_json_ld' => 'array',
        'social_posts' => 'array',
        'pipeline_meta' => 'array',
        'toc' => 'array',
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
        'views' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Article $article) {
            if (blank($article->uuid)) {
                $article->uuid = (string) Str::uuid();
            }
            if (blank($article->slug) && filled($article->title)) {
                $article->slug = static::uniqueSlug($article->title);
            }
        });
    }

    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (static::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(ArticleSection::class, 'article_id')->orderBy('position');
    }

    public function sources(): HasMany
    {
        return $this->hasMany(ArticleSource::class, 'article_id');
    }

    public function keywords(): HasMany
    {
        return $this->hasMany(ArticleKeyword::class, 'article_id');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(ArticleTag::class, 'article_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ArticleImage::class, 'article_id');
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(ArticleRevision::class, 'article_id')->latest();
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(ArticleFaq::class, 'article_id')->orderBy('position');
    }

    public function glossary(): HasMany
    {
        return $this->hasMany(ArticleGlossary::class, 'article_id')->orderBy('position');
    }

    public function researchResults(): HasMany
    {
        return $this->hasMany(ResearchResult::class, 'article_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', self::STATUS_PUBLISHED)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeDueForPublish($query)
    {
        return $query->where('status', self::STATUS_SCHEDULED)
            ->whereNotNull('scheduled_at')
            ->where('scheduled_at', '<=', now());
    }

    public function markRevision(string $stage, ?string $html = null, array $payload = []): ArticleRevision
    {
        return $this->revisions()->create([
            'stage' => $stage,
            'content_html' => $html ?? $this->content_html,
            'payload' => $payload,
            'created_by' => 'ai',
        ]);
    }
}
