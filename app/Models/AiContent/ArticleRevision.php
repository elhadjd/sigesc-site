<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleRevision extends Model
{
    protected $table = 'ai_article_revisions';

    protected $fillable = [
        'article_id', 'stage', 'content_html', 'payload', 'created_by',
    ];

    protected $casts = ['payload' => 'array'];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
