<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ExpertQuestion extends Model
{
    protected $table = 'ai_expert_questions';

    protected $fillable = [
        'uuid', 'asker_name', 'asker_email', 'question', 'answer_html',
        'status', 'quality_score', 'article_id', 'research', 'convert_to_article',
        'email_notified_at', 'article_email_notified_at',
    ];

    protected $casts = [
        'quality_score' => 'float',
        'research' => 'array',
        'convert_to_article' => 'boolean',
        'email_notified_at' => 'datetime',
        'article_email_notified_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (ExpertQuestion $q) {
            if (blank($q->uuid)) {
                $q->uuid = (string) Str::uuid();
            }
        });
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
