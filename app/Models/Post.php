<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'image',
        'category',
        'author_name',
        'author_avatar',
        'author_role',
        'publish_date',
        'read_time',
        'tags',
        'is_featured',
        'is_published',
        'views',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'publish_date' => 'date',
        'tags' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'read_time' => 'integer',
        'views' => 'integer',
    ];

    /**
     * Boot function for setting up model event handling
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }

            // Garantir que o slug seja único
            $originalSlug = $post->slug;
            $counter = 1;

            while (static::where('slug', $post->slug)->exists()) {
                $post->slug = $originalSlug . '-' . $counter;
                $counter++;
            }
        });

        static::updating(function ($post) {
            if ($post->isDirty('title') && empty($post->slug)) {
                $post->slug = Str::slug($post->title);

                // Garantir que o slug seja único
                $originalSlug = $post->slug;
                $counter = 1;

                while (static::where('slug', $post->slug)
                    ->where('id', '!=', $post->id)
                    ->exists()
                ) {
                    $post->slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }
        });
    }

    /**
     * Scope a query to only include published posts.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where('publish_date', '<=', now());
    }

    /**
     * Scope a query to only include featured posts.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to search in title, excerpt and content.
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->where(function ($q) use ($searchTerm) {
            $q->where('title', 'like', "%{$searchTerm}%")
                ->orWhere('excerpt', 'like', "%{$searchTerm}%")
                ->orWhere('content', 'like', "%{$searchTerm}%")
                ->orWhereJsonContains('tags', $searchTerm);
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Increment the view count
     */
    public function incrementColumn($column, $amount = 1)
    {
        $this->$column += $amount;
        $this->save();
    }

    function decrement($column, $amount = 1, array $extra = [])
    {
        $this->$column -= $amount;
        $this->save();
    }

    /**
     * Get the reading time in a formatted string
     */
    public function getFormattedReadTimeAttribute()
    {
        return "{$this->readTime} min de leitura";
    }

    /**
     * Get the formatted publish date
     */
    public function getFormattedPublishDateAttribute()
    {
        return $this->publish_date->format('d M Y');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(PostLike::class);
    }

    /**
     * Relação com os comentários
     */
    public function comments(): HasMany
    {
        return $this->hasMany(PostComment::class)
            ->whereNull('parent_id') // Apenas comentários principais
            ->orderBy('created_at', 'desc');
    }

    /**
     * Relação com todos os comentários (incluindo respostas)
     */
    public function allComments(): HasMany
    {
        return $this->hasMany(PostComment::class)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Relação com comentários aprovados
     */
    public function approvedComments(): HasMany
    {
        return $this->comments()
            ->approved()
            ->orderBy('created_at', 'desc');
    }

    /**
     * Verificar se o usuário curtiu o post
     */
    public function isLikedByUser($userId = null): bool
    {
        if (!$userId && auth()->check()) {
            $userId = auth()->id();
        }

        return $this->likes()
            ->where('user_id', $userId)
            ->exists();
    }

    /**
     * Verificar se o IP curtiu o post
     */
    public function isLikedByIp($ip = null): bool
    {
        $ip = $ip ?: request()->ip();

        return $this->likes()
            ->where('ip_address', $ip)
            ->exists();
    }

    /**
     * Obter contagem de comentários aprovados
     */
    public function getApprovedCommentsCountAttribute(): int
    {
        return $this->allComments()
            ->approved()
            ->count();
    }

    /**
     * Obter contagem de comentários pendentes
     */
    public function getPendingCommentsCountAttribute(): int
    {
        return $this->allComments()
            ->pending()
            ->count();
    }
}
