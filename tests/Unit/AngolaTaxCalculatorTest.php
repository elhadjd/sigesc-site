<?php

namespace Tests\Unit;

use App\Services\Tax\AngolaTaxCalculator;
use App\Services\Tax\Money;
use Tests\TestCase;

class AngolaTaxCalculatorTest extends TestCase
{
    private AngolaTaxCalculator $tax;

    protected function setUp(): void
    {
        parent::setUp();
        $this->tax = new AngolaTaxCalculator();
    }

    public function test_irt_exempt_up_to_150000(): void
    {
        $result = $this->tax->irtGroupA(150000);
        $this->assertSame('0.00', $result['result']['irt']);
        $this->assertSame('150000.00', $result['result']['net']);
    }

    public function test_irt_second_bracket_formula(): void
    {
        // 180000 => 12500 + 16% * (180000-150000) = 12500 + 4800 = 17300
        $result = $this->tax->irtGroupA(180000);
        $this->assertSame('17300.00', $result['result']['irt']);
        $this->assertSame('162700.00', $result['result']['net']);
    }

    public function test_irt_third_bracket_boundary(): void
    {
        // 250000 => 31250 + 18% * (250000-200000) = 31250 + 9000 = 40250
        $result = $this->tax->irtGroupA(250000);
        $this->assertSame('40250.00', $result['result']['irt']);
    }

    public function test_irt_continuity_from_bracket_4_to_5(): void
    {
        // At 500000 (end of 4): 49250 + 19%*(500000-300000) = 49250 + 38000 = 87250
        $at500k = $this->tax->irtGroupA(500000);
        $this->assertSame('87250.00', $at500k['result']['irt']);

        // Just into 5th: 500000.01 => 87250 + 20%*0.01 ≈ 87250.00 after round
        $into5 = $this->tax->irtGroupA('500000.01');
        $this->assertSame('87250.00', $into5['result']['irt']);
    }

    public function test_iva_add_and_extract_round_trip(): void
    {
        $added = $this->tax->iva(100000, 'geral', 'add');
        $this->assertSame('14000.00', $added['result']['iva']);
        $this->assertSame('114000.00', $added['result']['gross']);

        $extracted = $this->tax->iva(114000, 'geral', 'extract');
        $this->assertSame('100000.00', $extracted['result']['net']);
        $this->assertSame('14000.00', $extracted['result']['iva']);
    }

    public function test_iva_simplified_7_percent(): void
    {
        $result = $this->tax->iva(200000, 'simplificado', 'add');
        $this->assertSame('14000.00', $result['result']['iva']);
        $this->assertSame('214000.00', $result['result']['gross']);
    }

    public function test_imposto_industrial_rates(): void
    {
        $geral = $this->tax->impostoIndustrial(1_000_000, 'geral');
        $this->assertSame('250000.00', $geral['result']['tax']);

        $agro = $this->tax->impostoIndustrial(1_000_000, 'agricola');
        $this->assertSame('100000.00', $agro['result']['tax']);

        $bank = $this->tax->impostoIndustrial(1_000_000, 'banca_seguros_telecom_petroleo');
        $this->assertSame('350000.00', $bank['result']['tax']);
    }

    public function test_imposto_industrial_loss_is_zero(): void
    {
        $result = $this->tax->impostoIndustrial(-50000, 'geral');
        $this->assertSame('0.00', $result['result']['tax']);
    }

    public function test_retencao_servicos_6_5(): void
    {
        $result = $this->tax->retencaoServicos(1_000_000);
        $this->assertSame('65000.00', $result['result']['withheld']);
        $this->assertSame('935000.00', $result['result']['net_payable']);
    }

    public function test_cambio_rates(): void
    {
        $singular = $this->tax->cambio(1_000_000, 'pessoa_singular');
        $this->assertSame('25000.00', $singular['result']['contribution']);

        $colectiva = $this->tax->cambio(1_000_000, 'pessoa_colectiva');
        $this->assertSame('100000.00', $colectiva['result']['contribution']);
    }

    public function test_irt_group_c_simplified(): void
    {
        $result = $this->tax->irtGroupC(8_000_000, false);
        $this->assertFalse($result['blocked'] ?? false);
        $this->assertSame('520000.00', $result['result']['irt']);
    }

    public function test_irt_group_c_blocks_non_primary_above_limit(): void
    {
        $result = $this->tax->irtGroupC(12_000_000, false);
        $this->assertTrue($result['blocked']);
        $this->assertNull($result['result']);
    }

    public function test_irt_group_c_primary_above_limit(): void
    {
        $result = $this->tax->irtGroupC(12_000_000, true);
        $this->assertSame('1200000.00', $result['result']['irt']);
    }

    public function test_money_avoids_float_drift(): void
    {
        $a = Money::of('0.1');
        $b = Money::of('0.2');
        $this->assertSame('0.3000', Money::add($a, $b));
    }
}
