<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningCenter extends Model
{
    use HasFactory;


    function translate() : HasMany {
        return $this->hasMany(LearningCenterTranslate::class);
    }
}
