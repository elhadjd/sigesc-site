<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Careers\JobApplication;
use App\Models\Careers\JobListing;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CareersController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->string('status')->toString();
        $search = $request->string('search')->toString();

        $jobs = JobListing::query()
            ->when($status !== '' && $status !== 'all', fn ($q) => $q->where('status', $status))
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($inner) use ($search) {
                    $inner->where('title', 'like', "%{$search}%")
                        ->orWhere('department', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (JobListing $job) => $job->toAdminArray())
            ->values();

        $recentApplications = JobApplication::query()
            ->with('jobListing:id,title,slug')
            ->orderByDesc('id')
            ->limit(12)
            ->get()
            ->map(fn (JobApplication $app) => $app->toAdminArray())
            ->values();

        return Inertia::render('admin/careers/index', [
            'jobs' => $jobs,
            'recentApplications' => $recentApplications,
            'filters' => [
                'status' => $status ?: 'all',
                'search' => $search,
            ],
            'meta' => [
                'statuses' => config('careers.statuses'),
                'employment_types' => config('careers.employment_types'),
                'work_modes' => config('careers.work_modes'),
                'notify_email' => config('careers.notify_email'),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/careers/form', [
            'job' => null,
            'meta' => $this->formMeta(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['created_by'] = $request->user()?->id;
        $data['slug'] = JobListing::uniqueSlug($data['title']);

        if (($data['status'] ?? 'open') === 'open') {
            $data['published_at'] = now();
        }

        $job = JobListing::create($data);

        return redirect()
            ->route('admin.careers.index')
            ->with('success', 'Vaga «'.$job->title.'» criada.');
    }

    public function edit(JobListing $job)
    {
        return Inertia::render('admin/careers/form', [
            'job' => $job->toAdminArray(),
            'meta' => $this->formMeta(),
        ]);
    }

    public function update(Request $request, JobListing $job)
    {
        $data = $this->validated($request, $job);

        if ($job->title !== $data['title'] && blank($request->input('slug'))) {
            $data['slug'] = JobListing::uniqueSlug($data['title'], $job->id);
        }

        $job->update($data);

        return redirect()
            ->route('admin.careers.index')
            ->with('success', 'Vaga «'.$job->title.'» atualizada.');
    }

    public function pause(JobListing $job)
    {
        $job->update(['status' => 'paused']);

        return redirect()
            ->back()
            ->with('success', 'Vaga «'.$job->title.'» pausada.');
    }

    public function close(JobListing $job)
    {
        $job->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);

        return redirect()
            ->back()
            ->with('success', 'Vaga «'.$job->title.'» fechada.');
    }

    public function reopen(JobListing $job)
    {
        $job->update([
            'status' => 'open',
            'published_at' => $job->published_at ?? now(),
            'closed_at' => null,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Vaga «'.$job->title.'» reaberta.');
    }

    public function destroy(JobListing $job)
    {
        $title = $job->title;
        $job->delete();

        return redirect()
            ->route('admin.careers.index')
            ->with('success', 'Vaga «'.$title.'» eliminada.');
    }

    /**
     * @return array<string, mixed>
     */
    protected function validated(Request $request, ?JobListing $job = null): array
    {
        return $request->validate([
            'title' => 'required|string|min:3|max:160',
            'slug' => [
                'nullable',
                'string',
                'max:180',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('career_job_listings', 'slug')->ignore($job?->id),
            ],
            'department' => 'nullable|string|max:120',
            'location' => 'required|string|max:160',
            'employment_type' => ['required', Rule::in(array_keys(config('careers.employment_types', [])))],
            'work_mode' => ['required', Rule::in(array_keys(config('careers.work_modes', [])))],
            'status' => ['required', Rule::in(config('careers.statuses', ['open', 'paused', 'closed']))],
            'summary' => 'nullable|string|max:500',
            'description' => 'required|string|min:40',
            'requirements' => 'nullable|string',
            'benefits' => 'nullable|string',
            'salary_range' => 'nullable|string|max:120',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function formMeta(): array
    {
        return [
            'statuses' => config('careers.statuses'),
            'employment_types' => config('careers.employment_types'),
            'work_modes' => config('careers.work_modes'),
            'status_labels' => [
                'open' => 'Aberta',
                'paused' => 'Pausada',
                'closed' => 'Fechada',
            ],
        ];
    }
}
