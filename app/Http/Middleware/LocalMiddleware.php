<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LocalMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supportedLanguages = ['en', 'fr', 'pt'];
        $currentPath = $request->path();
        $pathParts = explode('/', $currentPath, 2);
        $firstPart = $pathParts[0];
        $authRoute = ['reset-password','forgot-password','password'];

        if(in_array($firstPart, $authRoute)){
            return $next($request);
        }

        if (!in_array($firstPart, $supportedLanguages)) {
            $preferredLanguage = $request->getPreferredLanguage($supportedLanguages);

            $newUrl = "/{$preferredLanguage}/{$currentPath}";
            $request->setLocale($preferredLanguage);

            return redirect($newUrl);
        }

        app()->setLocale($firstPart);
        return $next($request);
    }
}
