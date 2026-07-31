<?php

namespace App\Support;

use Illuminate\Http\Request;
use Jenssegers\Agent\Agent;

class CrawlerDetector
{
    /**
     * Detect search-engine / social crawlers that need fully rendered HTML.
     */
    public static function isSearchCrawler(?Request $request = null): bool
    {
        $request ??= request();

        if ($request->boolean('ssr_preview') && app()->environment(['local', 'development', 'staging'])) {
            return true;
        }

        $agent = new Agent();
        $agent->setUserAgent($request->userAgent() ?? '');

        if ($agent->isRobot()) {
            return true;
        }

        $ua = strtolower((string) $request->userAgent());

        $signatures = [
            'googlebot',
            'bingbot',
            'slurp',
            'duckduckbot',
            'baiduspider',
            'yandexbot',
            'facebookexternalhit',
            'twitterbot',
            'linkedinbot',
            'whatsapp',
            'telegrambot',
            'applebot',
            'applebot-extended',
            'semrushbot',
            'ahrefsbot',
            'mj12bot',
            'petalbot',
            'bytespider',
            // Generative Engine Optimization (GEO) — AI answer engines
            'gptbot',
            'chatgpt-user',
            'oai-searchbot',
            'claudebot',
            'anthropic-ai',
            'perplexitybot',
            'google-extended',
            'googleother',
            'amazonbot',
            'cohere-ai',
            'meta-externalagent',
            'youbot',
            'diffbot',
            'ccbot',
        ];

        foreach ($signatures as $signature) {
            if (str_contains($ua, $signature)) {
                return true;
            }
        }

        return false;
    }
}
