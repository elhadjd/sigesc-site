<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Mail\JobApplicationConfirmationMail;
use App\Mail\JobApplicationProducerMail;
use App\Models\Careers\JobApplication;
use App\Models\Careers\JobListing;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class CareersController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo
    ) {}

    public function index(Request $request)
    {
        $listings = JobListing::query()
            ->publiclyVisible()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn (JobListing $job) => $job->toPublicArray())
            ->values();

        $seo = $this->seo->forCareers($listings->all());

        $prerender = [
            'kicker' => 'Carreiras',
            'headline' => 'Trabalhe connosco no SIGESC',
            'lead' => 'Vagas abertas em produto, engenharia, comercial e operações — ajude empresas angolanas a digitalizar a gestão.',
            'sections' => [
                [
                    'heading' => 'Vagas abertas',
                    'items' => $listings->isEmpty()
                        ? ['Neste momento não há vagas abertas. Volte em breve ou envie uma candidatura espontânea pelo contacto.']
                        : $listings->map(fn (array $j) => $j['title'].' · '.($j['location'] ?? '').' · '.($j['employment_type_label'] ?? ''))->all(),
                ],
            ],
            'links' => [
                ['href' => url('/contact'), 'label' => 'Contacto'],
                ['href' => url('/parceria'), 'label' => 'Parceria'],
                ['href' => url('/sobre'), 'label' => 'Sobre o SIGESC'],
            ],
        ];

        return $this->renderPublicPage($request, 'careers/index', [
            'seo' => $seo,
            'prerender' => $prerender,
            'jobs' => $listings,
            'canManageCareers' => (bool) $request->user()
                && $this->userCanManageCareers($request),
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $listing = JobListing::query()
            ->where('slug', $slug)
            ->firstOrFail();

        if (! $listing->isOpen() && ! $this->userCanManageCareers($request)) {
            abort(404);
        }

        $seo = $this->seo->forCareerJob($listing);

        $prerender = [
            'kicker' => 'Carreiras · '.$listing->department,
            'headline' => $listing->title,
            'lead' => $listing->summary ?: str($listing->description)->limit(180)->toString(),
            'sections' => [
                [
                    'heading' => 'Detalhes',
                    'items' => array_filter([
                        $listing->location,
                        $listing->employmentTypeLabel(),
                        $listing->workModeLabel(),
                        $listing->salary_range,
                    ]),
                ],
                [
                    'heading' => 'Descrição',
                    'items' => [str($listing->description)->limit(400)->toString()],
                ],
            ],
            'links' => [
                ['href' => route('careers.index'), 'label' => 'Todas as vagas'],
                ['href' => url('/contact'), 'label' => 'Contacto'],
            ],
        ];

        return $this->renderPublicPage($request, 'careers/show', [
            'seo' => $seo,
            'prerender' => $prerender,
            'job' => $listing->toPublicArray(),
            'canManageCareers' => $this->userCanManageCareers($request),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }

    public function apply(Request $request, string $slug)
    {
        $listing = JobListing::query()
            ->where('slug', $slug)
            ->publiclyVisible()
            ->firstOrFail();

        $data = $request->validate([
            'name' => 'required|string|min:2|max:120',
            'email' => 'required|email|max:180',
            'phone' => 'nullable|string|max:40',
            'linkedin_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'cover_letter' => 'required|string|min:40|max:5000',
        ]);

        $recentDuplicate = JobApplication::query()
            ->where('job_listing_id', $listing->id)
            ->where('email', strtolower($data['email']))
            ->where('created_at', '>=', now()->subDay())
            ->exists();

        if ($recentDuplicate) {
            throw ValidationException::withMessages([
                'email' => 'Já recebemos uma candidatura sua para esta vaga nas últimas 24 horas.',
            ]);
        }

        $application = DB::transaction(function () use ($listing, $data) {
            $application = JobApplication::create([
                'job_listing_id' => $listing->id,
                'name' => $data['name'],
                'email' => strtolower($data['email']),
                'phone' => $data['phone'] ?? null,
                'linkedin_url' => $data['linkedin_url'] ?? null,
                'portfolio_url' => $data['portfolio_url'] ?? null,
                'cover_letter' => $data['cover_letter'],
                'status' => 'received',
            ]);

            $listing->increment('applications_count');

            return $application;
        });

        $producer = (string) config('careers.notify_email');

        Mail::to($application->email)->send(new JobApplicationConfirmationMail($application, $listing));

        if (filled($producer)) {
            Mail::to($producer)->send(new JobApplicationProducerMail($application, $listing));
        }

        $application->forceFill(['notified_at' => now()])->save();

        return redirect()
            ->route('careers.show', $listing->slug)
            ->with('success', 'Candidatura enviada. Enviámos um e-mail de confirmação para si e notificámos a equipa SIGESC.');
    }

    protected function userCanManageCareers(Request $request): bool
    {
        $user = $request->user();
        if (! $user) {
            return false;
        }

        $admins = array_filter(config('ai_content_engine.admin_emails', []));
        $isAllowlisted = in_array(
            strtolower((string) $user->email),
            array_map('strtolower', $admins),
            true
        );

        return $isAllowlisted
            || (app()->environment(['local', 'testing']) && empty($admins));
    }
}
