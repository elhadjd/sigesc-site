<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SocialAndLoginRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_auth_login_accepts_post(): void
    {
        $user = User::factory()->create([
            'email' => 'client@example.com',
            'password' => bcrypt('password'),
            'socialType' => 'sisgesc.net',
        ]);

        $this->postJson('/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertOk()
            ->assertJsonPath('type', 'success');

        $this->assertAuthenticatedAs($user);
    }

    public function test_auth_page_accepts_post_login(): void
    {
        $user = User::factory()->create([
            'email' => 'client2@example.com',
            'password' => bcrypt('password'),
            'socialType' => 'sisgesc.net',
        ]);

        $this->postJson('/auth', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertOk()
            ->assertJsonPath('type', 'success');
    }

    public function test_social_login_route_redirects_for_google(): void
    {
        config([
            'services.google.client_id' => 'test-client-id',
            'services.google.client_secret' => 'test-secret',
            'services.google.redirect' => 'http://localhost/auth/callback',
        ]);

        $response = $this->get('/loginWithSocial/google');

        $response->assertRedirect();
        $this->assertStringContainsString('accounts.google.com', $response->headers->get('Location'));
        $this->assertSame('google', session('oauth_provider'));
    }

    public function test_unsupported_social_provider_redirects_to_auth(): void
    {
        $this->get('/loginWithSocial/facebook')
            ->assertRedirect('/auth');
    }
}
