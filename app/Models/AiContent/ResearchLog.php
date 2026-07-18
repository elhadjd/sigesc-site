<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchLog extends Model
{
    protected $table = 'research_logs';

    protected $fillable = [
        'agent', 'action', 'provider', 'status', 'execution_time_ms',
        'error', 'context', 'article_id',
    ];

    protected $casts = [
        'execution_time_ms' => 'integer',
        'context' => 'array',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
