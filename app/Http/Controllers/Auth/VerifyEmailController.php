<?php

namespace App\Http\Controllers\Auth;

use App\Events\emailVerifiedEvent;
use App\Events\welcomeUserEvent;
use App\Http\Controllers\Controller;
use App\Mail\EmailVerify;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request)
    {
        $user = User::find($request->route('id'));

        if (! $user) {
            return redirect()->intended(RouteServiceProvider::HOME . '?verified=0');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(RouteServiceProvider::HOME . '?verified=1');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        event(new welcomeUserEvent($user));

        if (!Auth::check()) {
            Auth::login($user);
        }

        event(new emailVerifiedEvent($user->id));
        return redirect()->intended(RouteServiceProvider::HOME . '?verified=1');
    }

    function emailVerifyPage()
    {
        if (!auth()->check() || auth()->user()->hasVerifiedEmail()) {
            return redirect()->intended(RouteServiceProvider::HOME . '?verified=0');
        }
        return Inertia::render('Auth/VerifyEmail', [
            'status' => 'verification-link-sent'
        ]);
    }

    function notifyUserToVerifyEmail(Request $request)
    {
        $user = User::find($request->route('id'));
        $data = [
            'userName' => $user->name,
            'id' => $user->id,
        ];
        Mail::to($user->email)->send(new EmailVerify($data));
        return $this->emailVerifyPage();
    }
}
