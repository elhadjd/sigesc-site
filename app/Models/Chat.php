<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session'
    ];

    protected $with = ['conversations'];

    function conversations() : HasMany {
        return $this->hasMany(ChatConversation::class);
    }
}
