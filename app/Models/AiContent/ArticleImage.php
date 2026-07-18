<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleImage extends Model
{
    protected $table = 'ai_article_images';

    protected $fillable = [
        'article_id', 'role', 'url', 'alt', 'storage_path', 'meta',
    ];

    protected $casts = ['meta' => 'array'];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
