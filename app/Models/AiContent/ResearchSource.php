<?php

namespace App\Models\AiContent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResearchSource extends Model
{
    protected $table = 'research_sources';

    protected $fillable = [
        'name', 'domain', 'url', 'type', 'is_trusted', 'is_active', 'meta',
    ];

    protected $casts = [
        'is_trusted' => 'boolean',
        'is_active' => 'boolean',
        'meta' => 'array',
    ];

    public function articleSources(): HasMany
    {
        return $this->hasMany(ArticleSource::class, 'research_source_id');
    }
}
