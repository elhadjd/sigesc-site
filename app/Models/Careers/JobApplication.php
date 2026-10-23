<?php

namespace App\Models\Careers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    use HasFactory;

    protected $table = 'career_job_applications';

    protected $fillable = [
        'job_listing_id',
        'name',
        'email',
        'phone',
        'linkedin_url',
        'portfolio_url',
        'cover_letter',
        'cv_path',
        'status',
        'notified_at',
    ];

    protected $casts = [
        'notified_at' => 'datetime',
    ];

    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class, 'job_listing_id');
    }

    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'linkedin_url' => $this->linkedin_url,
            'portfolio_url' => $this->portfolio_url,
            'cover_letter' => $this->cover_letter,
            'status' => $this->status,
            'created_at' => optional($this->created_at)?->toIso8601String(),
            'job' => $this->relationLoaded('jobListing') && $this->jobListing
                ? [
                    'id' => $this->jobListing->id,
                    'title' => $this->jobListing->title,
                    'slug' => $this->jobListing->slug,
                ]
                : null,
        ];
    }
}
