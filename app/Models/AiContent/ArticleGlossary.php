<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleGlossary extends Model
{
    protected $table = 'ai_article_glossary';

    protected $fillable = ['article_id', 'term', 'definition', 'position'];

    protected $casts = ['position' => 'integer'];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
