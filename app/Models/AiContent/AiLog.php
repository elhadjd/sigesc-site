<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiLog extends Model
{
    protected $table = 'ai_logs';

    protected $fillable = [
        'ai_job_id', 'article_id', 'agent', 'level', 'message', 'context',
    ];

    protected $casts = ['context' => 'array'];

    public function job(): BelongsTo
    {
        return $this->belongsTo(AiJob::class, 'ai_job_id');
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
