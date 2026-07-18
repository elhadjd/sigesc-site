<?php

namespace App\Http\Controllers\Auth;

use App\Events\welcomeUserEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Throwable;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/index', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request (email/password).
     */
    public function store(LoginRequest $request)
    {
        $checkUser = User::where('email', $request->email)->first();

        if (! $checkUser) {
            return $this->RespondWarn(__('User not found'));
        }

        if ($checkUser->socialType && $checkUser->socialType !== 'sisgesc.net') {
            return $this->RespondWarn(
                "A sua conta esta registrada com o provedor {$checkUser->socialType}, por favor clique no icon abaixo para iniciar a sesão"
            );
        }

        $request->authenticate();
        $request->session()->regenerate();

        return $this->RespondSuccess(__('success'));
    }

    public function authenticateWithSocial(Request $request, string $drive)
    {
        $drives = ['google', 'github'];

        if (! in_array($drive, $drives, true)) {
            return redirect('/auth')->with('error', 'Tipo de autenticação não suportada');
        }

        // Prefer session (survives OAuth round-trip); keep IP cache as soft fallback.
        $request->session()->put('oauth_provider', $drive);
        $request->session()->save();

        return Socialite::driver($drive)->redirect();
    }

    public function authenticateWithSocialCallback(Request $request)
    {
        $provider = $request->session()->pull('oauth_provider');

        if (! $provider || ! in_array($provider, ['google', 'github'], true)) {
            return redirect('/auth')->with('error', 'Sessão de autenticação social expirada. Tente novamente.');
        }

        try {
            try {
                $socialUser = Socialite::driver($provider)->user();
            } catch (InvalidStateException $e) {
                // Common on XAMPP / localhost when the OAuth "state" cookie/session is lost.
                Log::warning('Socialite InvalidStateException — retrying stateless', [
                    'provider' => $provider,
                    'error' => $e->getMessage(),
                ]);
                $socialUser = Socialite::driver($provider)->stateless()->user();
            }
        } catch (Throwable $e) {
            Log::error('Social login failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
            ]);

            return redirect('/auth')->with('error', 'Falha ao autenticar com '.$provider.'. Tente novamente.');
        }

        if (blank($socialUser->getEmail())) {
            return redirect('/auth')->with('error', 'A conta social não devolveu um email válido.');
        }

        $user = User::updateOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'social_id' => $socialUser->getId(),
                'socialType' => $provider,
                'accountType' => 'client',
                'name' => $socialUser->getName() ?: ($socialUser->getNickname() ?: 'Utilizador'),
                'social_token' => $socialUser->token,
                'social_refresh_token' => $socialUser->refreshToken,
            ]
        );

        Auth::login($user, true);

        if (! $user->hasVerifiedEmail()) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        $user->userProfile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'surname' => $user->name,
                'image' => $socialUser->getAvatar(),
            ]
        );

        event(new welcomeUserEvent($user));

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json(['type' => 'success', 'message' => 'Logout']);
        }

        return Inertia::location('/');
    }
}
