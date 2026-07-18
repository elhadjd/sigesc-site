<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class HeaderNavigationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_public_pages_are_reachable(): void
    {
        $this->get('/blog/posts')->assertOk();
        $this->get('/calculadoras')->assertOk();
        $this->get('/pergunte-ao-especialista')->assertOk();
        $this->get('/auth')->assertOk();
    }

    public function test_guest_does_not_get_ai_content_flag(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('canAccessAiContent', false)
            );
    }

    public function test_local_authenticated_user_can_access_ai_content_flag(): void
    {
        config(['ai_content_engine.admin_emails' => []]);

        $user = User::factory()->create([
            'email' => 'editor@example.com',
            'socialType' => 'sisgesc.net',
        ]);

        $this->actingAs($user)
            ->get('/')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('canAccessAiContent', true)
            );

        $this->actingAs($user)
            ->get('/admin/ai-content')
            ->assertOk();
    }
}
