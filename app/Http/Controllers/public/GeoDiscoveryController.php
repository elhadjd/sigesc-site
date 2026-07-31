<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\Seo\GeoManifest;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class GeoDiscoveryController extends Controller
{
    public function __construct(
        protected GeoManifest $geo,
        protected SeoBuilder $seo,
        protected PublicPageContent $content,
    ) {}

    public function about(Request $request)
    {
        $knowledge = [
            'brand' => config('geo.brand', []),
            'certification' => config('geo.certification', []),
            'partnership' => config('geo.partnership', []),
            'capabilities' => config('geo.capabilities', []),
            'audiences' => config('geo.audiences', []),
            'facts' => config('geo.facts', []),
            'faqs' => config('geo.faqs', []),
            'free_tools' => config('geo.free_tools', []),
            'modules' => config('sigesc_modules', []),
            'urls' => config('geo.urls', []),
        ];

        return $this->renderPublicPage(
            $request,
            'about/index',
            [
                'seo' => $this->seo->forAbout(),
                'prerender' => $this->content->about(),
                'knowledge' => $knowledge,
            ],
            'seo.about',
            ['knowledge' => $knowledge]
        );
    }

    public function file(string $name): Response
    {
        $map = [
            'llms.txt' => 'llms.txt',
            'llms-full.txt' => 'llms-full.txt',
            'ai.txt' => 'ai.txt',
            'agents.md' => 'agents.md',
            'humans.txt' => 'humans.txt',
        ];

        abort_unless(isset($map[$name]), 404);

        $body = $this->geo->document($map[$name]);
        abort_if($body === null || $body === '', 404);

        $type = str_ends_with($name, '.md')
            ? 'text/markdown; charset=UTF-8'
            : 'text/plain; charset=UTF-8';

        return response($body, 200, [
            'Content-Type' => $type,
            'Cache-Control' => 'public, max-age=1800',
            'X-Robots-Tag' => 'all',
        ]);
    }

    public function wellKnown(string $file): Response
    {
        $map = [
            'security.txt' => '.well-known/security.txt',
            'ai-plugin.json' => '.well-known/ai-plugin.json',
        ];

        abort_unless(isset($map[$file]), 404);

        $body = $this->geo->document($map[$file]);
        abort_if($body === null || $body === '', 404);

        $type = str_ends_with($file, '.json')
            ? 'application/json; charset=UTF-8'
            : 'text/plain; charset=UTF-8';

        return response($body, 200, [
            'Content-Type' => $type,
            'Cache-Control' => 'public, max-age=1800',
            'X-Robots-Tag' => 'all',
        ]);
    }
}
