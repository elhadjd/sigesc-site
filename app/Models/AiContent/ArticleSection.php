<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleSection extends Model
{
    protected $table = 'ai_article_sections';

    protected $fillable = [
        'article_id', 'type', 'heading', 'body_html', 'position', 'meta',
    ];

    protected $casts = [
        'meta' => 'array',
        'position' => 'integer',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
