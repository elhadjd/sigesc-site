<?php

namespace Tests\Unit;

use Tests\TestCase;

class AiBlogConfigTest extends TestCase
{
    public function test_weekly_topics_include_agt_and_gestao_comercial(): void
    {
        $topics = collect(config('ai_blog.topics'))->pluck('key');

        $this->assertTrue($topics->contains('agt_faturamento_eletronico'));
        $this->assertTrue($topics->contains('software_gestao_comercial_angola'));
    }
}
