<?php

namespace App\Services\AiContentEngine\Support;

use App\Models\AiContent\Article;
use Illuminate\Support\Str;

/**
 * Creates unique editorial SVG cover images under public/img/blog-covers.
 * No product screenshots and no brand logos — title + category only.
 */
class BlogCoverGenerator
{
    /**
     * @return array{url: string, source: string, attribution: array<string, mixed>, stored: bool}
     */
    public function ensureFor(Article $article): array
    {
        $dir = trim((string) config('ai_content_engine.images.blog_covers_dir', 'img/blog-covers'), '/');
        $slug = Str::slug($article->slug ?: ($article->title ?: 'artigo-blog'));
        if ($slug === '') {
            $slug = 'artigo-blog-'.Str::random(6);
        }

        $relative = $dir.'/'.$slug.'.svg';
        $full = public_path($relative);
        $url = '/'.$relative;

        if (! is_file($full) || filesize($full) === 0) {
            $directory = dirname($full);
            if (! is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            file_put_contents($full, $this->svgMarkup($article));
        }

        return [
            'url' => $url,
            'source' => 'generated-local',
            'attribution' => [
                'provider' => 'editorial-cover-generator',
                'note' => 'Generated editorial SVG cover (no product UI, no brand logo)',
            ],
            'stored' => true,
        ];
    }

    /**
     * Force-regenerate the SVG even if a file already exists.
     *
     * @return array{url: string, source: string, attribution: array<string, mixed>, stored: bool}
     */
    public function regenerateFor(Article $article): array
    {
        $dir = trim((string) config('ai_content_engine.images.blog_covers_dir', 'img/blog-covers'), '/');
        $slug = Str::slug($article->slug ?: ($article->title ?: 'artigo-blog'));
        if ($slug === '') {
            $slug = 'artigo-blog-'.Str::random(6);
        }

        $relative = $dir.'/'.$slug.'.svg';
        $full = public_path($relative);
        $directory = dirname($full);
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        file_put_contents($full, $this->svgMarkup($article));

        return [
            'url' => '/'.$relative,
            'source' => 'generated-local',
            'attribution' => [
                'provider' => 'editorial-cover-generator',
                'note' => 'Regenerated editorial SVG cover',
            ],
            'stored' => true,
        ];
    }

    protected function svgMarkup(Article $article): string
    {
        $title = trim((string) ($article->title ?: 'Artigo de gestão'));
        $category = trim((string) ($article->category?->name ?: $article->focus_keyword ?: 'Gestão empresarial'));
        $seed = abs(crc32(Str::slug($article->slug ?: $title)));

        $palettes = [
            ['#0B3D2E', '#1F7A5A', '#C8F0DE'],
            ['#12324A', '#2F6F9F', '#D6EAF8'],
            ['#3A2415', '#A65B2A', '#F6E3CF'],
            ['#1C2333', '#3D5A80', '#E0E7F1'],
            ['#2C1810', '#8B4513', '#F0D9C8'],
            ['#0F2A24', '#2A9D8F', '#E8F6F3'],
        ];
        $palette = $palettes[$seed % count($palettes)];

        $titleLines = $this->wrapText($title, 34, 3);
        $safeCategory = e($this->truncate($category, 48));
        $line1 = e($titleLines[0] ?? $title);
        $line2 = e($titleLines[1] ?? '');
        $line3 = e($titleLines[2] ?? '');

        $y2 = $line2 !== '' ? '<text x="80" y="292" fill="#FFFFFF" font-family="Georgia, \'Times New Roman\', serif" font-size="42" font-weight="700">'.$line2.'</text>' : '';
        $y3 = $line3 !== '' ? '<text x="80" y="348" fill="#FFFFFF" font-family="Georgia, \'Times New Roman\', serif" font-size="42" font-weight="700">'.$line3.'</text>' : '';

        $accentX = 120 + ($seed % 40);
        $circleR = 180 + ($seed % 80);

        // Editorial cover: category + title only — no brand wordmark / product UI.
        return <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="{$line1}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{$palette[0]}"/>
      <stop offset="55%" stop-color="{$palette[1]}"/>
      <stop offset="100%" stop-color="{$palette[0]}"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="28%" r="45%">
      <stop offset="0%" stop-color="{$palette[2]}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="{$palette[0]}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <circle cx="1280" cy="220" r="{$circleR}" fill="url(#glow)"/>
  <rect x="80" y="72" width="120" height="8" rx="4" fill="{$palette[2]}"/>
  <text x="80" y="130" fill="{$palette[2]}" font-family="Arial, Helvetica, sans-serif" font-size="24" letter-spacing="3" font-weight="700">BLOG</text>
  <text x="80" y="178" fill="#FFFFFF" fill-opacity="0.78" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="1">{$safeCategory}</text>
  <text x="80" y="236" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="700">{$line1}</text>
  {$y2}
  {$y3}
  <rect x="{$accentX}" y="760" width="220" height="6" rx="3" fill="{$palette[2]}"/>
  <text x="80" y="820" fill="#FFFFFF" fill-opacity="0.65" font-family="Arial, Helvetica, sans-serif" font-size="18">Gestão · Finanças · Negócios em Angola</text>
</svg>
SVG;
    }

    /**
     * @return list<string>
     */
    protected function wrapText(string $text, int $width, int $maxLines): array
    {
        $words = preg_split('/\s+/u', trim($text)) ?: [];
        $lines = [];
        $current = '';

        foreach ($words as $word) {
            $trial = $current === '' ? $word : $current.' '.$word;
            if (mb_strlen($trial) > $width && $current !== '') {
                $lines[] = $current;
                $current = $word;
                if (count($lines) >= $maxLines - 1) {
                    break;
                }
            } else {
                $current = $trial;
            }
        }

        if ($current !== '' && count($lines) < $maxLines) {
            $lines[] = $current;
        }

        if (count($lines) === $maxLines) {
            $lines[$maxLines - 1] = $this->truncate($lines[$maxLines - 1], $width);
        }

        return $lines;
    }

    protected function truncate(string $text, int $max): string
    {
        $text = trim($text);
        if (mb_strlen($text) <= $max) {
            return $text;
        }

        return rtrim(mb_substr($text, 0, $max - 1)).'…';
    }
}
