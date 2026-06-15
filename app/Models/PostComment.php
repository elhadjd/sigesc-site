<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Builder;

class PostComment extends Model
{
    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'author_name',
        'author_email',
        'author_avatar',
        'content',
        'status',
        'ip_address',
        'user_agent',
        'likes_count',
        'replies_count'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'likes_count' => 'integer',
        'replies_count' => 'integer',
    ];

    /**
     * Relação com o post
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Relação com o usuário
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relação com o comentário pai
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(PostComment::class, 'parent_id');
    }

    /**
     * Relação com as respostas
     */
    public function replies(): HasMany
    {
        return $this->hasMany(PostComment::class, 'parent_id')
            ->orderBy('created_at', 'asc');
    }

    /**
     * Relação com os likes
     */
    public function likes(): HasMany
    {
        return $this->hasMany(CommentLike::class);
    }

    /**
     * Scope para comentários aprovados
     */
    public function scopeApproved(Builder $query): void
    {
        $query->where('status', 'approved');
    }

    /**
     * Scope para comentários pendentes
     */
    public function scopePending(Builder $query): void
    {
        $query->where('status', 'pending');
    }

    /**
     * Scope para comentários principais (sem parent)
     */
    public function scopeRoot(Builder $query): void
    {
        $query->whereNull('parent_id');
    }

    /**
     * Verificar se o comentário é aprovado
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Aprovar o comentário
     */
    public function approve(): void
    {
        $this->update([
            'status' => 'approved',
            'approved_at' => now()
        ]);
    }

    /**
     * Incrementar contador de respostas
     */
    public function incrementRepliesCount(): void
    {
        $this->increment('replies_count');
    }

    /**
     * Decrementar contador de respostas
     */
    public function decrementRepliesCount(): void
    {
        $this->decrement('replies_count');
    }
}
