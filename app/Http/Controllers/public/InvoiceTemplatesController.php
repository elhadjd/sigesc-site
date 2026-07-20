<?php

namespace App\Http\Controllers\public;

use App\Http\Controllers\Controller;
use App\Services\InvoiceTemplates\InvoiceTemplateRenderer;
use App\Services\Seo\PublicPageContent;
use App\Services\Seo\SeoBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class InvoiceTemplatesController extends Controller
{
    public function __construct(
        protected SeoBuilder $seo,
        protected PublicPageContent $content,
        protected InvoiceTemplateRenderer $renderer
    ) {}

    public function index(Request $request)
    {
        $templates = $this->catalog();

        return $this->renderPublicPage(
            $request,
            'invoice-templates/index',
            [
                'seo' => $this->seo->forInvoiceTemplates(),
                'prerender' => $this->content->invoiceTemplates($templates),
                'templates' => $templates,
                'levels' => config('invoice_templates.levels'),
                'categories' => config('invoice_templates.categories'),
            ],
            'seo.invoice-templates-index',
            [
                'templates' => $templates,
                'levels' => config('invoice_templates.levels'),
                'categories' => config('invoice_templates.categories'),
            ]
        );
    }

    public function show(string $slug): Response
    {
        $template = $this->find($slug);
        abort_unless($template, 404);

        $path = $this->filePath($slug);
        if (! File::exists($path)) {
            File::ensureDirectoryExists(dirname($path));
            File::put($path, $this->renderer->render($template));
        }

        return response(File::get($path), 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    public function download(string $slug): BinaryFileResponse
    {
        $template = $this->find($slug);
        abort_unless($template, 404);

        $path = $this->filePath($slug);
        if (! File::exists($path)) {
            File::ensureDirectoryExists(dirname($path));
            File::put($path, $this->renderer->render($template));
        }

        $filename = $slug.'-modelo-fatura-angola.html';

        return response()->download($path, $filename, [
            'Content-Type' => 'text/html; charset=UTF-8',
        ]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    protected function catalog(): array
    {
        $base = rtrim((string) config('sigesc.site_url', config('app.url')), '/');
        $path = trim((string) config('invoice_templates.path', 'modelos-fatura'), '/');

        return collect(config('invoice_templates.templates', []))
            ->map(function (array $template) use ($base, $path) {
                $slug = (string) $template['slug'];
                $template['file'] = $slug.'.html';
                $template['preview_url'] = url('/modelos-de-fatura/'.$slug);
                $template['download_url'] = url('/modelos-de-fatura/'.$slug.'/download');
                $template['public_url'] = $base.'/'.$path.'/'.$slug.'.html';
                $template['level_label'] = config('invoice_templates.levels.'.$template['level'].'.label', $template['level']);
                $template['category_label'] = config('invoice_templates.categories.'.$template['category'], $template['category']);

                return $template;
            })
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>|null
     */
    protected function find(string $slug): ?array
    {
        return collect(config('invoice_templates.templates', []))
            ->first(fn (array $t) => ($t['slug'] ?? null) === $slug);
    }

    protected function filePath(string $slug): string
    {
        $relative = trim((string) config('invoice_templates.path', 'modelos-fatura'), '/');

        return public_path($relative.'/'.$slug.'.html');
    }
}
