<?php

namespace Tests\Unit;

use App\Support\CrawlerDetector;
use Illuminate\Http\Request;
use Tests\TestCase;

class CrawlerDetectorTest extends TestCase
{
    public function test_detects_googlebot(): void
    {
        $request = Request::create('/blog/posts', 'GET');
        $request->headers->set('User-Agent', 'Googlebot/2.1');

        $this->assertTrue(CrawlerDetector::isSearchCrawler($request));
    }

    public function test_humans_are_not_crawlers(): void
    {
        $request = Request::create('/blog/posts', 'GET');
        $request->headers->set(
            'User-Agent',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        );

        $this->assertFalse(CrawlerDetector::isSearchCrawler($request));
    }
}
