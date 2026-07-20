<?php

namespace App\Console\Commands;

use App\Services\InvoiceTemplates\InvoiceTemplateRenderer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateInvoiceTemplatesCommand extends Command
{
    protected $signature = 'invoice-templates:generate {--force : Sobrescrever ficheiros existentes}';

    protected $description = 'Gera os HTML print-ready dos modelos de fatura em public/modelos-fatura';

    public function handle(InvoiceTemplateRenderer $renderer): int
    {
        $relative = trim((string) config('invoice_templates.path', 'modelos-fatura'), '/');
        $dir = public_path($relative);
        File::ensureDirectoryExists($dir);

        $count = 0;
        foreach (config('invoice_templates.templates', []) as $template) {
            $slug = (string) ($template['slug'] ?? '');
            if ($slug === '') {
                continue;
            }

            $path = $dir.'/'.$slug.'.html';
            if (File::exists($path) && ! $this->option('force')) {
                $this->line("skip {$slug}");

                continue;
            }

            File::put($path, $renderer->render($template));
            $this->info("wrote {$slug}.html");
            $count++;
        }

        $this->info("Generated {$count} invoice templates in public/{$relative}");

        return self::SUCCESS;
    }
}
