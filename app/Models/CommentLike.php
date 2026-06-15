<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommentLike extends Model
{
    protected $fillable = [
        'comment_id',
        'user_id',
        'ip_address',
        'session_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relação com o comentário
     */
    public function comment(): BelongsTo
    {
        return $this->belongsTo(PostComment::class);
    }

    /**
     * Relação com o usuário
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
