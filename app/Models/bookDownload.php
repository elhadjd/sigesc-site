<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class bookDownload extends Model
{
    use HasFactory;
    protected $fillable = ['ip_client'];
    protected $hidden = ['ip_client'];
}
