<?php

namespace Tests\Unit;

use Tests\TestCase;

class SigescDomainUrlsTest extends TestCase
{
    public function test_config_exposes_official_sisgesc_domains(): void
    {
        $this->assertSame('sisgesc.net', config('sigesc.site_host'));
        $this->assertSame('https://www.sisgesc.net', config('sigesc.site_url'));
        $this->assertSame('https://admin.sisgesc.net', config('sigesc.admin_url'));
        $this->assertSame('https://admin.sisgesc.net/getting-started', config('sigesc.getting_started_url'));
        $this->assertSame('https://admin.sisgesc.net/auth/login', config('sigesc.admin_login_url'));
        $this->assertStringNotContainsString('sigesc.net', config('sigesc.site_url'));
        $this->assertStringNotContainsString('sigesc.net', config('sigesc.admin_url'));
    }

    public function test_source_tree_never_uses_typo_domain_sigesc_net(): void
    {
        $roots = [
            base_path('app'),
            base_path('config'),
            base_path('resources'),
            base_path('routes'),
            base_path('tests'),
        ];

        $offenders = [];

        foreach ($roots as $root) {
            if (! is_dir($root)) {
                continue;
            }

            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS)
            );

            foreach ($iterator as $file) {
                if (! $file->isFile()) {
                    continue;
                }

                $path = $file->getPathname();
                if (str_contains($path, DIRECTORY_SEPARATOR.'node_modules'.DIRECTORY_SEPARATOR)) {
                    continue;
                }

                $ext = strtolower($file->getExtension());
                if (! in_array($ext, ['php', 'ts', 'tsx', 'js', 'jsx', 'blade.php', 'md', 'env', 'example', 'css', 'json'], true)
                    && ! str_ends_with($path, '.blade.php')
                    && ! str_ends_with($path, '.env.example')
                ) {
                    continue;
                }

                $contents = file_get_contents($path);
                if ($contents === false) {
                    continue;
                }

                // Forbidden typo host used as a real URL/email (missing the second "s").
                if (preg_match('/(?:https?:\/\/|\/\/|@)sigesc\.net\b/i', $contents)) {
                    $offenders[] = str_replace(base_path().DIRECTORY_SEPARATOR, '', $path);
                }
            }
        }

        $this->assertSame([], $offenders, 'Found forbidden typo domain sigesc.net in: '.implode(', ', $offenders));
    }

    public function test_brand_cta_points_trial_users_to_admin_sisgesc(): void
    {
        $cta = (string) config('ai_content_engine.pipeline.brand_cta');
        $this->assertStringContainsString('admin.sisgesc.net', $cta);
        $this->assertStringContainsString('sisgesc.net', $cta);
        $this->assertStringNotContainsString('sigesc.net/solucoes', $cta);
    }
}
