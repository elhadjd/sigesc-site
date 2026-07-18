<?php

namespace App\Console\Commands;

use App\Services\AiContentEngine\Research\HybridResearchEngine;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ResearchTestCommand extends Command
{
    protected $signature = 'research:test
        {topic : Tema a pesquisar}
        {--fresh : Ignorar cache de pesquisa}';

    protected $description = 'Testa o Hybrid Research Engine (fontes, scores, resumo e tempo)';

    public function handle(HybridResearchEngine $engine): int
    {
        $topic = (string) $this->argument('topic');
        $this->info("Hybrid Research Engine → \"{$topic}\"");
        $this->newLine();

        $started = microtime(true);
        $result = $engine->research($topic, null, (bool) $this->option('fresh'));
        $elapsed = round((microtime(true) - $started) * 1000);

        $this->line('Cache: '.($result['from_cache'] ? 'HIT' : 'MISS'));
        $this->line('Providers: '.implode(', ', $result['providers']));
        $this->line('Avg trust score: '.$result['avg_trust_score']);
        $this->line('Execution: '.$result['execution_time_ms'].' ms (wall '.$elapsed.' ms)');
        $this->newLine();

        $this->info('Fontes encontradas (ordenadas por confiança):');
        $rows = collect($result['findings'])->map(fn ($f) => [
            $f['trust_score'] ?? 0,
            $f['provider'] ?? '-',
            Str::limit($f['title'] ?? '-', 50, '…'),
            Str::limit($f['url'] ?? '-', 60, '…'),
        ])->all();

        if ($rows === []) {
            $this->warn('Nenhuma fonte encontrada.');
        } else {
            $this->table(['Score', 'Provider', 'Title', 'URL'], $rows);
        }

        $this->newLine();
        $this->info('Research Summary:');
        $summary = $result['summary'];
        $this->line('Topic: '.($summary['topic'] ?? $topic));
        $this->line('Confidence: '.($summary['confidence_level'] ?? $result['avg_trust_score']));

        foreach ($summary['main_points'] ?? [] as $i => $point) {
            $this->line('  '.($i + 1).') '.$point);
        }

        if (! empty($summary['laws'])) {
            $this->line('Laws: '.json_encode($summary['laws'], JSON_UNESCAPED_UNICODE));
        }
        if (! empty($summary['important_dates'])) {
            $this->line('Dates: '.json_encode($summary['important_dates'], JSON_UNESCAPED_UNICODE));
        }
        if (! empty($summary['numbers'])) {
            $this->line('Numbers: '.json_encode($summary['numbers'], JSON_UNESCAPED_UNICODE));
        }
        if (! empty($summary['warnings'])) {
            $this->warn('Warnings: '.implode(' | ', $summary['warnings']));
        }

        return self::SUCCESS;
    }
}
