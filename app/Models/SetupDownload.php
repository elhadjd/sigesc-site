<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SetupDownload extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_client',
        'app_type',
        'version',
        'user_id'
    ];
}
