<?php

namespace Tests\Unit;

use App\Services\AiContentEngine\Support\AngolaSearchInterest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AngolaSearchInterestTest extends TestCase
{
    public function test_for_bucket_uses_google_suggest_and_filters_sports_trends(): void
    {
        Cache::flush();

        Http::fake([
            'trends.google.com/*' => Http::response(<<<'XML'
<?xml version="1.0"?>
<rss><channel>
<title>Daily Search Trends</title>
<item><title><![CDATA[jogo de hoje do mundial]]></title></item>
<item><title><![CDATA[IVA Angola AGT]]></title></item>
<item><title><![CDATA[shakira]]></title></item>
</channel></rss>
XML, 200),
            'suggestqueries.google.com/*' => Http::response([
                'IVA Angola',
                ['IVA Angola AGT', 'IVA Angola taxa', 'IVA Angola PME'],
            ], 200),
        ]);

        $result = app(AngolaSearchInterest::class)->forBucket('fiscal', 5);

        $this->assertContains('IVA Angola AGT', $result['suggestions']);
        $this->assertContains('IVA Angola AGT', $result['trends']);
        $this->assertNotContains('shakira', $result['trends']);
        $this->assertNotContains('jogo de hoje do mundial', $result['trends']);
        $this->assertNotEmpty($result['queries']);
    }

    public function test_failures_are_soft_and_return_empty(): void
    {
        Cache::flush();
        Http::fake([
            '*' => Http::response('down', 500),
        ]);

        $result = app(AngolaSearchInterest::class)->forBucket('marketing', 3);

        $this->assertSame([], $result['suggestions']);
        $this->assertSame([], $result['trends']);
    }
}
