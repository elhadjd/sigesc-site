<?php

namespace Tests\Feature;

use App\Mail\JobApplicationConfirmationMail;
use App\Mail\JobApplicationProducerMail;
use App\Models\Careers\JobApplication;
use App\Models\Careers\JobListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class CareersPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        config([
            'careers.notify_email' => 'produtor@example.com',
            'ai_content_engine.admin_emails' => ['admin@sigesc.test'],
        ]);
    }

    public function test_public_careers_index_lists_only_open_jobs(): void
    {
        JobListing::create($this->jobAttrs(['title' => 'Engenheiro Backend', 'status' => 'open']));
        JobListing::create($this->jobAttrs(['title' => 'Vaga Pausada', 'status' => 'paused', 'slug' => 'vaga-pausada']));
        JobListing::create($this->jobAttrs(['title' => 'Vaga Fechada', 'status' => 'closed', 'slug' => 'vaga-fechada']));

        $this->get('/carreiras')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('careers/index')
                ->has('seo')
                ->has('jobs', 1)
                ->where('jobs.0.title', 'Engenheiro Backend')
                ->where('seo.title', fn ($title) => str_contains((string) $title, 'Carreiras SIGESC'))
            );
    }

    public function test_candidate_can_apply_and_emails_are_sent(): void
    {
        Mail::fake();

        $job = JobListing::create($this->jobAttrs([
            'title' => 'Comercial Luanda',
            'slug' => 'comercial-luanda',
        ]));

        $this->post('/carreiras/comercial-luanda/candidatar', [
            'name' => 'Ana Silva',
            'email' => 'ana@example.com',
            'phone' => '+244900000000',
            'cover_letter' => str_repeat('Quero juntar-me à equipa SIGESC. ', 4),
        ])
            ->assertRedirect(route('careers.show', 'comercial-luanda'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('career_job_applications', [
            'job_listing_id' => $job->id,
            'email' => 'ana@example.com',
            'name' => 'Ana Silva',
        ]);

        $this->assertSame(1, $job->fresh()->applications_count);

        Mail::assertSent(JobApplicationConfirmationMail::class, function ($mail) {
            return $mail->hasTo('ana@example.com');
        });

        Mail::assertSent(JobApplicationProducerMail::class, function ($mail) {
            return $mail->hasTo('produtor@example.com');
        });
    }

    public function test_paused_job_is_not_public_and_cannot_receive_applications(): void
    {
        JobListing::create($this->jobAttrs([
            'title' => 'Pausada',
            'slug' => 'pausada',
            'status' => 'paused',
        ]));

        $this->get('/carreiras/pausada')->assertNotFound();

        $this->post('/carreiras/pausada/candidatar', [
            'name' => 'Ana Silva',
            'email' => 'ana@example.com',
            'cover_letter' => str_repeat('Texto suficiente para validar. ', 3),
        ])->assertNotFound();
    }

    public function test_admin_email_can_manage_jobs(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@sigesc.test',
            'socialType' => 'sisgesc.net',
        ]);

        $this->actingAs($admin)
            ->get('/admin/carreiras')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('admin/careers/index')
                ->has('jobs')
            );

        $payload = $this->jobAttrs([
            'title' => 'Product Designer',
        ]);
        unset($payload['slug'], $payload['published_at']);

        $this->actingAs($admin)
            ->post('/admin/carreiras', $payload)
            ->assertRedirect(route('admin.careers.index'));

        $job = JobListing::query()->where('title', 'Product Designer')->first();
        $this->assertNotNull($job);
        $this->assertSame('open', $job->status);

        $this->actingAs($admin)
            ->post("/admin/carreiras/{$job->id}/pausar")
            ->assertRedirect();
        $this->assertSame('paused', $job->fresh()->status);

        $this->actingAs($admin)
            ->post("/admin/carreiras/{$job->id}/fechar")
            ->assertRedirect();
        $this->assertSame('closed', $job->fresh()->status);

        $this->actingAs($admin)
            ->post("/admin/carreiras/{$job->id}/reabrir")
            ->assertRedirect();
        $this->assertSame('open', $job->fresh()->status);

        $this->actingAs($admin)
            ->delete("/admin/carreiras/{$job->id}")
            ->assertRedirect(route('admin.careers.index'));

        $this->assertDatabaseMissing('career_job_listings', ['id' => $job->id]);
    }

    public function test_guest_cannot_access_careers_admin(): void
    {
        $this->get('/admin/carreiras')->assertRedirect();
    }

    public function test_non_admin_user_cannot_access_careers_admin(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'socialType' => 'sisgesc.net',
        ]);

        $this->actingAs($user)
            ->get('/admin/carreiras')
            ->assertForbidden();
    }

    public function test_sitemap_includes_careers(): void
    {
        JobListing::create($this->jobAttrs([
            'title' => 'DevOps',
            'slug' => 'devops',
        ]));

        $xml = $this->get('/sitemap.xml')->assertOk()->getContent();

        $this->assertStringContainsString('/carreiras', $xml);
        $this->assertStringContainsString('/carreiras/devops', $xml);
    }

    public function test_crawler_gets_ssr_careers_page(): void
    {
        JobListing::create($this->jobAttrs([
            'title' => 'Analista QA',
            'slug' => 'analista-qa',
        ]));

        $html = $this->withHeaders([
            'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1)',
        ])->get('/carreiras')
            ->assertOk()
            ->assertSee('Analista QA', false)
            ->assertSee('Carreiras', false)
            ->assertSee('vagas emprego Luanda', false)
            ->assertSee('ItemList', false)
            ->assertSee('FAQPage', false)
            ->assertSee('BreadcrumbList', false)
            ->assertSee('CollectionPage', false)
            ->getContent();

        $this->assertStringContainsString('Conteúdo indexável gerado no servidor', $html);
        $this->assertStringNotContainsString('data-page=', $html);
    }

    public function test_careers_seo_keywords_and_discovery_files(): void
    {
        $seo = app(\App\Services\Seo\SeoBuilder::class)->forCareers([]);
        $this->assertStringContainsString('vagas emprego Luanda', (string) $seo['keywords']);
        $this->assertStringContainsString('consultor comercial B2B Angola', (string) $seo['keywords']);
        $this->assertStringContainsString('Carreiras SIGESC', (string) $seo['title']);

        $types = collect($seo['json_ld'])->pluck('@type')->all();
        $this->assertContains('CollectionPage', $types);
        $this->assertContains('BreadcrumbList', $types);
        $this->assertContains('FAQPage', $types);

        foreach (['/llms.txt', '/llms-full.txt', '/ai.txt', '/agents.md', '/humans.txt'] as $path) {
            $body = $this->get($path)->assertOk()->getContent();
            $this->assertStringContainsString('/carreiras', $body, "Expected /carreiras in {$path}");
            $this->assertStringContainsString('vagas emprego Luanda', $body, "Expected career keyword in {$path}");
        }

        $robots = file_get_contents(public_path('robots.txt'));
        $this->assertStringContainsString('Allow: /carreiras', (string) $robots);
    }

    public function test_duplicate_application_within_a_day_is_rejected(): void
    {
        Mail::fake();

        $job = JobListing::create($this->jobAttrs(['slug' => 'dup-test']));

        JobApplication::create([
            'job_listing_id' => $job->id,
            'name' => 'Ana',
            'email' => 'ana@example.com',
            'cover_letter' => str_repeat('Já candidatei-me ontem. ', 3),
            'status' => 'received',
        ]);

        $this->from('/carreiras/dup-test')
            ->post('/carreiras/dup-test/candidatar', [
                'name' => 'Ana Silva',
                'email' => 'ana@example.com',
                'cover_letter' => str_repeat('Quero juntar-me à equipa SIGESC. ', 4),
            ])
            ->assertRedirect('/carreiras/dup-test')
            ->assertSessionHasErrors('email');
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    protected function jobAttrs(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Vaga de teste',
            'slug' => 'vaga-de-teste',
            'department' => 'Produto',
            'location' => 'Luanda, Angola',
            'employment_type' => 'full_time',
            'work_mode' => 'hybrid',
            'status' => 'open',
            'summary' => 'Resumo da vaga para testes.',
            'description' => str_repeat('Descrição completa da vaga SIGESC. ', 4),
            'requirements' => 'Experiência relevante.',
            'benefits' => 'Equipa jovem e produto com impacto.',
            'salary_range' => 'A combinar',
            'published_at' => now(),
        ], $overrides);
    }
}
