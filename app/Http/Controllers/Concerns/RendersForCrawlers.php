<?php

namespace App\Http\Controllers\Concerns;

use App\Support\CrawlerDetector;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

trait RendersForCrawlers
{
    /**
     * Serve a full Blade HTML document to crawlers; Inertia to humans.
     * Always injects `seo` (+ optional `prerender`) so first HTML paint has content.
     *
     * @param  array<string, mixed>  $props
     * @param  array<string, mixed>  $bladeData
     */
    protected function renderPublicPage(
        Request $request,
        string $inertiaComponent,
        array $props,
        string $seoBlade = 'seo.page',
        array $bladeData = []
    ): Response {
        $seo = $props['seo'] ?? [];
        $prerender = $props['prerender'] ?? ($bladeData['page'] ?? null);

        if ($prerender !== null && ! isset($props['prerender'])) {
            $props['prerender'] = $prerender;
        }

        if (CrawlerDetector::isSearchCrawler($request)) {
            return response()->view($seoBlade, array_merge([
                'seo' => $seo,
                'page' => $prerender ?? [
                    'headline' => $seo['title'] ?? 'SIGESC',
                    'lead' => $seo['description'] ?? '',
                    'sections' => [],
                    'links' => [],
                ],
            ], $bladeData));
        }

        return Inertia::render($inertiaComponent, $props)->toResponse($request);
    }
}
