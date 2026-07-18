<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleKeyword extends Model
{
    protected $table = 'ai_article_keywords';

    protected $fillable = ['article_id', 'keyword', 'type', 'score'];

    protected $casts = ['score' => 'integer'];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
