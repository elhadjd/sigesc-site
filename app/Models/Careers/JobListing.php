<?php

namespace App\Models\Careers;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class JobListing extends Model
{
    use HasFactory;

    protected $table = 'career_job_listings';

    protected $fillable = [
        'created_by',
        'title',
        'slug',
        'department',
        'location',
        'employment_type',
        'work_mode',
        'status',
        'summary',
        'description',
        'requirements',
        'benefits',
        'salary_range',
        'applications_count',
        'published_at',
        'closed_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'closed_at' => 'datetime',
        'applications_count' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (JobListing $listing) {
            if (blank($listing->slug)) {
                $listing->slug = static::uniqueSlug($listing->title);
            }

            if ($listing->status === 'open' && blank($listing->published_at)) {
                $listing->published_at = now();
            }
        });

        static::updating(function (JobListing $listing) {
            if ($listing->isDirty('title') && blank($listing->getOriginal('slug'))) {
                $listing->slug = static::uniqueSlug($listing->title, $listing->id);
            }

            if ($listing->isDirty('status')) {
                if ($listing->status === 'open' && blank($listing->published_at)) {
                    $listing->published_at = now();
                    $listing->closed_at = null;
                }

                if ($listing->status === 'closed') {
                    $listing->closed_at = now();
                }
            }
        });
    }

    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'vaga';
        $slug = $base;
        $i = 2;

        while (
            static::query()
                ->when($ignoreId, fn (Builder $q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', 'open');
    }

    public function scopePubliclyVisible(Builder $query): Builder
    {
        return $query->where('status', 'open');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'job_listing_id');
    }

    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    public function employmentTypeLabel(): string
    {
        return (string) (config('careers.employment_types.'.$this->employment_type) ?? $this->employment_type);
    }

    public function workModeLabel(): string
    {
        return (string) (config('careers.work_modes.'.$this->work_mode) ?? $this->work_mode);
    }

    public function statusLabel(): string
    {
        return match ($this->status) {
            'open' => 'Aberta',
            'paused' => 'Pausada',
            'closed' => 'Fechada',
            default => $this->status,
        };
    }

    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'department' => $this->department,
            'location' => $this->location,
            'employment_type' => $this->employment_type,
            'employment_type_label' => $this->employmentTypeLabel(),
            'work_mode' => $this->work_mode,
            'work_mode_label' => $this->workModeLabel(),
            'status' => $this->status,
            'summary' => $this->summary,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'benefits' => $this->benefits,
            'salary_range' => $this->salary_range,
            'published_at' => optional($this->published_at)?->toIso8601String(),
        ];
    }

    public function toAdminArray(): array
    {
        return array_merge($this->toPublicArray(), [
            'status_label' => $this->statusLabel(),
            'applications_count' => $this->applications_count,
            'closed_at' => optional($this->closed_at)?->toIso8601String(),
            'created_at' => optional($this->created_at)?->toIso8601String(),
            'updated_at' => optional($this->updated_at)?->toIso8601String(),
        ]);
    }
}
