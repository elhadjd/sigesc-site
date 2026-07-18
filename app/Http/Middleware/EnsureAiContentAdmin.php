<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAiContentAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->guest('/auth');
        }

        $admins = array_filter(config('ai_content_engine.admin_emails', []));
        $isAllowlisted = in_array(
            strtolower((string) $user->email),
            array_map('strtolower', $admins),
            true
        );

        // Partners can access when marked in allowlist; in local/testing with empty
        // allowlist, any authenticated user can open the dashboard for development.
        if (! $isAllowlisted) {
            if (app()->environment(['local', 'testing']) && empty($admins)) {
                return $next($request);
            }

            abort(403, 'Acesso restrito ao AI Content Engine.');
        }

        return $next($request);
    }
}
