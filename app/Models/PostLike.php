<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostLike extends Model
{
    protected $fillable = [
        'post_id',
        'user_id',
        'ip_address',
        'user_agent',
        'session_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
     * Scope para curtidas de um IP específico
     */
    public function scopeFromIp($query, $ip)
    {
        return $query->where('ip_address', $ip);
    }

    /**
     * Scope para curtidas de uma sessão específica
     */
    public function scopeFromSession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }
}
