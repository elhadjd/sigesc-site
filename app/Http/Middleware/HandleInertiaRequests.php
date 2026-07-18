<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $admins = array_filter(config('ai_content_engine.admin_emails', []));
        $canAccessAiContent = false;

        if ($user) {
            $isAllowlisted = in_array(
                strtolower((string) $user->email),
                array_map('strtolower', $admins),
                true
            );
            $canAccessAiContent = $isAllowlisted
                || (app()->environment(['local', 'testing']) && empty($admins));
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'canAccessAiContent' => $canAccessAiContent,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
