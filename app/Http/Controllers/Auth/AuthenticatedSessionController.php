<?php

namespace App\Http\Controllers\Auth;

use App\Events\welcomeUserEvent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Mail\welcomeUser;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

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
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $checkUser = User::where('email', $request->email)->first();
        if ($checkUser) {
            if ($checkUser->socialType != 'sisgesc.net') {
                return $this->RespondWarn("A sua conta esta registrada com o provedor $checkUser->socialType, por favor clique no icon abaixo para iniciar a sesão");
            } else {
                $request->authenticate();
                $request->session()->regenerate();
                return $this->RespondSuccess(__('success'));
            }
        }
        return $this->RespondWarn(__('User not found'));
    }

    public function authenticateWithSocial(Request $request, string $drive)
    {
        $drives = ['google', 'github'];
        if (!in_array($drive, $drives)) return redirect($request->getLocale() . "/auth")->with('Tipo de authenticação não suportada');
        Cache::put('provider_' . $request->ip(), $drive, now()->addMinutes(5));
        return Socialite::driver($drive)->redirect();
    }

    function authenticateWithSocialCallback(Request $request)
    {
        if (!Cache::has('provider_' . $request->ip())) return redirect('/auth');
        $provider = Cache::get('provider_' . $request->ip());
        $socialUser = Socialite::driver($provider)->user();
        $user = User::updateOrCreate([
            'email' => $socialUser->email
        ], [
            'social_id' => $socialUser->id,
            'socialType' => $provider,
            'accountType' => 'client',
            'name' => $socialUser->name == null ? $socialUser->getNickname() : $socialUser->name,
            'email' => $socialUser->email,
            'social_token' => $socialUser->token,
            'social_refresh_token' => $socialUser->refreshToken,
        ]);

        Auth::login($user);

        if (!$request->user()->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        $request->user()->userProfile()
            ->updateOrCreate([
                'user_id' => $request->user()->id
            ], [
                'surname' => $user->name,
                'image' => $socialUser->avatar,
            ]);

        event(new welcomeUserEvent($user));

        return redirect()->intended(RouteServiceProvider::HOME);
    }



    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();
        Auth::logout();

        return Auth::user();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return Inertia::location($request->getLocale() . '/');
    }
}
