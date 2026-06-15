<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class costumerContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'surname',
        'email',
        'user_id',
        'phone',
        'message'
    ];
}
