<?php

namespace Tests\Unit;

use App\Models\AiContent\ResearchSource;
use App\Services\AiContentEngine\Research\TrustScorer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrustScorerTest extends TestCase
{
    use RefreshDatabase;

    public function test_scores_official_source_at_100(): void
    {
        $source = ResearchSource::create([
            'name' => 'AGT',
            'domain' => 'agt.minfin.gov.ao',
            'url' => 'https://agt.minfin.gov.ao',
            'type' => 'official',
            'category' => 'official',
            'priority' => 100,
            'country' => 'AO',
            'trust_score' => 100,
            'is_trusted' => true,
            'is_active' => true,
        ]);

        $scorer = new TrustScorer;

        $this->assertSame(100, $scorer->score('https://agt.minfin.gov.ao/iva', $source));
    }

    public function test_scores_world_bank_and_blogs(): void
    {
        $scorer = new TrustScorer;

        $this->assertSame(90, $scorer->score('https://www.worldbank.org/en/country/angola'));
        $this->assertSame(50, $scorer->score('https://medium.com/@someone/angola-tax'));
        $this->assertSame(85, $scorer->score('https://www.uan.ac.ao/pesquisa'));
    }

    public function test_category_map_matches_config(): void
    {
        $scorer = new TrustScorer;

        $this->assertSame(100, $scorer->scoreByCategory('official'));
        $this->assertSame(70, $scorer->scoreByCategory('specialized'));
        $this->assertSame(50, $scorer->scoreByCategory('blog'));
    }
}
