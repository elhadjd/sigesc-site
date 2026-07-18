<?php

namespace App\Services\Tax;

use InvalidArgumentException;

class AngolaTaxCalculator
{
    /**
     * IRT Grupo A — retenção mensal (Lei n.º 14/25 / OGE 2026).
     *
     * @return array<string, mixed>
     */
    public function irtGroupA(int|float|string $grossMonthly): array
    {
        $gross = Money::of($grossMonthly);
        if (Money::comp($gross, '0') < 0) {
            throw new InvalidArgumentException('O rendimento bruto mensal não pode ser negativo.');
        }

        $brackets = config('angola_tax.irt.group_a.brackets');
        $matched = null;

        foreach ($brackets as $bracket) {
            $min = Money::of($bracket['min']);
            $max = $bracket['max'] === null ? null : Money::of($bracket['max']);

            $gteMin = Money::comp($gross, $min) >= 0;
            $lteMax = $max === null || Money::comp($gross, $max) <= 0;

            if ($gteMin && $lteMax) {
                $matched = $bracket;
                break;
            }
        }

        if (! $matched) {
            throw new InvalidArgumentException('Não foi possível enquadrar o rendimento na tabela IRT configurada.');
        }

        $rate = Money::of($matched['rate']);
        $fixed = Money::of($matched['fixed']);
        $excessOver = Money::of($matched['excess_over']);

        $taxableExcess = Money::max(Money::sub($gross, $excessOver), '0');
        $tax = Money::add($fixed, Money::mul($rate, $taxableExcess));
        $tax = Money::roundKz($tax);
        $net = Money::roundKz(Money::sub($gross, $tax));

        // Effective rate on gross
        $effective = Money::comp($gross, '0') === 0
            ? '0.0000'
            : Money::div($tax, $gross);

        return [
            'calculator' => 'irt_grupo_a',
            'input' => [
                'gross_monthly' => Money::roundKz($gross),
                'gross_monthly_formatted' => Money::formatKz($gross),
            ],
            'bracket' => [
                'label' => $matched['label'],
                'rate' => (float) $matched['rate'],
                'fixed' => Money::roundKz($fixed),
                'excess_over' => Money::roundKz($excessOver),
            ],
            'result' => [
                'irt' => $tax,
                'irt_formatted' => Money::formatKz($tax),
                'net' => $net,
                'net_formatted' => Money::formatKz($net),
                'effective_rate' => Money::roundKz(Money::mul($effective, '100')).'%',
            ],
            'formula' => 'IRT = Parcela Fixa + Taxa × (Rendimento − Limite do excesso)',
            'legal' => config('angola_tax.legal_refs.irt'),
            'effective_from' => config('angola_tax.effective_from'),
            'disclaimer' => config('angola_tax.disclaimer'),
        ];
    }

    /**
     * IRT Grupo C simplificado (6,5% sobre volume de vendas elegível).
     *
     * @return array<string, mixed>
     */
    public function irtGroupC(int|float|string $annualTurnover, bool $primarySector = false): array
    {
        $turnover = Money::of($annualTurnover);
        if (Money::comp($turnover, '0') < 0) {
            throw new InvalidArgumentException('O volume de negócios não pode ser negativo.');
        }

        $limit = Money::of(config('angola_tax.irt.group_c.simplified_turnover_limit'));
        $simplifiedRate = Money::of(config('angola_tax.irt.group_c.simplified_rate'));
        $primaryRate = Money::of(config('angola_tax.irt.group_c.primary_sector_rate'));

        $overLimit = Money::comp($turnover, $limit) > 0;

        if (! $overLimit) {
            $rate = $simplifiedRate;
            $regime = 'Grupo C simplificado (≤ limite legal)';
        } elseif ($primarySector) {
            $rate = $primaryRate;
            $regime = 'Grupo C — sector primário (> limite)';
        } else {
            // Acima do limite e fora do sector primário: não aplicar taxa simplificada automaticamente.
            return [
                'calculator' => 'irt_grupo_c',
                'input' => [
                    'annual_turnover' => Money::roundKz($turnover),
                    'primary_sector' => $primarySector,
                ],
                'result' => null,
                'blocked' => true,
                'message' => 'Volume acima do limite do regime simplificado. Enquadramento sujeito a regras do Imposto Industrial / contabilidade organizada — consulte um contabilista e a AGT.',
                'legal' => config('angola_tax.legal_refs.irt'),
                'disclaimer' => config('angola_tax.disclaimer'),
            ];
        }

        $tax = Money::roundKz(Money::mul($turnover, $rate));

        return [
            'calculator' => 'irt_grupo_c',
            'input' => [
                'annual_turnover' => Money::roundKz($turnover),
                'annual_turnover_formatted' => Money::formatKz($turnover),
                'primary_sector' => $primarySector,
            ],
            'regime' => $regime,
            'rate' => (float) $rate,
            'result' => [
                'irt' => $tax,
                'irt_formatted' => Money::formatKz($tax),
            ],
            'legal' => config('angola_tax.legal_refs.irt'),
            'effective_from' => config('angola_tax.effective_from'),
            'disclaimer' => config('angola_tax.disclaimer'),
        ];
    }

    /**
     * IVA — extrair ou acrescentar imposto.
     *
     * @return array<string, mixed>
     */
    public function iva(int|float|string $amount, string $rateKey = 'geral', string $mode = 'add'): array
    {
        $rates = config('angola_tax.iva.rates');
        if (! isset($rates[$rateKey])) {
            throw new InvalidArgumentException("Taxa IVA desconhecida: {$rateKey}");
        }

        $base = Money::of($amount);
        if (Money::comp($base, '0') < 0) {
            throw new InvalidArgumentException('O valor não pode ser negativo.');
        }

        $rate = Money::of($rates[$rateKey]['rate']);
        $onePlus = Money::add('1', $rate);

        if ($mode === 'extract') {
            // Valor com IVA → base + imposto
            $net = Money::roundKz(Money::div($base, $onePlus));
            $tax = Money::roundKz(Money::sub($base, $net));
            $gross = Money::roundKz($base);
        } elseif ($mode === 'add') {
            $net = Money::roundKz($base);
            $tax = Money::roundKz(Money::mul($net, $rate));
            $gross = Money::roundKz(Money::add($net, $tax));
        } else {
            throw new InvalidArgumentException('Modo IVA inválido. Use add|extract.');
        }

        return [
            'calculator' => 'iva',
            'input' => [
                'amount' => Money::roundKz($base),
                'rate_key' => $rateKey,
                'rate_label' => $rates[$rateKey]['label'],
                'rate' => (float) $rates[$rateKey]['rate'],
                'mode' => $mode,
            ],
            'result' => [
                'net' => $net,
                'net_formatted' => Money::formatKz($net),
                'iva' => $tax,
                'iva_formatted' => Money::formatKz($tax),
                'gross' => $gross,
                'gross_formatted' => Money::formatKz($gross),
            ],
            'legal' => config('angola_tax.legal_refs.iva'),
            'effective_from' => config('angola_tax.effective_from'),
            'disclaimer' => config('angola_tax.disclaimer'),
        ];
    }

    /**
     * Imposto Industrial sobre lucro tributável.
     *
     * @return array<string, mixed>
     */
    public function impostoIndustrial(int|float|string $taxableProfit, string $rateKey = 'geral'): array
    {
        $rates = config('angola_tax.imposto_industrial.rates');
        if (! isset($rates[$rateKey])) {
            throw new InvalidArgumentException("Taxa de Imposto Industrial desconhecida: {$rateKey}");
        }

        $profit = Money::of($taxableProfit);
        $rate = Money::of($rates[$rateKey]['rate']);

        if (Money::comp($profit, '0') < 0) {
            // Prejuízo fiscal → imposto 0 (simplificação educativa; regras de reporte à parte)
            $tax = '0.00';
        } else {
            $tax = Money::roundKz(Money::mul($profit, $rate));
        }

        return [
            'calculator' => 'imposto_industrial',
            'input' => [
                'taxable_profit' => Money::roundKz($profit),
                'taxable_profit_formatted' => Money::formatKz($profit),
                'rate_key' => $rateKey,
                'rate_label' => $rates[$rateKey]['label'],
                'rate' => (float) $rates[$rateKey]['rate'],
            ],
            'result' => [
                'tax' => $tax,
                'tax_formatted' => Money::formatKz($tax),
                'after_tax' => Money::roundKz(Money::sub(Money::max($profit, '0'), $tax)),
                'after_tax_formatted' => Money::formatKz(Money::sub(Money::max($profit, '0'), $tax)),
            ],
            'legal' => config('angola_tax.legal_refs.imposto_industrial'),
            'effective_from' => config('angola_tax.effective_from'),
            'disclaimer' => config('angola_tax.disclaimer'),
        ];
    }

    /**
     * Retenção na fonte 6,5% sobre serviços.
     *
     * @return array<string, mixed>
     */
    public function retencaoServicos(int|float|string $invoiceAmount): array
    {
        $amount = Money::of($invoiceAmount);
        if (Money::comp($amount, '0') < 0) {
            throw new InvalidArgumentException('O valor da factura não pode ser negativo.');
        }

        $rate = Money::of(config('angola_tax.retencao_fonte.servicos_6_5.rate'));
        $withheld = Money::roundKz(Money::mul($amount, $rate));
        $payable = Money::roundKz(Money::sub($amount, $withheld));

        return [
            'calculator' => 'retencao_servicos',
            'input' => [
                'invoice_amount' => Money::roundKz($amount),
                'invoice_amount_formatted' => Money::formatKz($amount),
                'rate' => (float) config('angola_tax.retencao_fonte.servicos_6_5.rate'),
            ],
            'result' => [
                'withheld' => $withheld,
                'withheld_formatted' => Money::formatKz($withheld),
                'net_payable' => $payable,
                'net_payable_formatted' => Money::formatKz($payable),
            ],
            'legal' => config('angola_tax.legal_refs.retencao'),
            'effective_from' => config('angola_tax.effective_from'),
            'disclaimer' => config('angola_tax.disclaimer'),
        ];
    }

    /**
     * Contribuição especial sobre operações cambiais.
     *
     * @return array<string, mixed>
     */
    public function cambio(int|float|string $transferAmount, string $personType = 'pessoa_colectiva'): array
    {
        $rates = config('angola_tax.cambio');
        if (! isset($rates[$personType])) {
            throw new InvalidArgumentException('Tipo de pessoa inválido para contribuição cambial.');
        }

        $amount = Money::of($transferAmount);
        if (Money::comp($amount, '0') < 0) {
            throw new InvalidArgumentException('O montante da transferência não pode ser negativo.');
        }

        $rate = Money::of($rates[$personType]['rate']);
        $contribution = Money::roundKz(Money::mul($amount, $rate));

        return [
            'calculator' => 'cambio',
            'input' => [
                'transfer_amount' => Money::roundKz($amount),
                'transfer_amount_formatted' => Money::formatKz($amount),
                'person_type' => $personType,
                'rate_label' => $rates[$personType]['label'],
                'rate' => (float) $rates[$personType]['rate'],
            ],
            'result' => [
                'contribution' => $contribution,
                'contribution_formatted' => Money::formatKz($contribution),
                'total_with_contribution' => Money::roundKz(Money::add($amount, $contribution)),
                'total_with_contribution_formatted' => Money::formatKz(Money::add($amount, $contribution)),
            ],
            'legal' => config('angola_tax.legal_refs.cambio'),
            'effective_from' => config('angola_tax.effective_from'),
            'disclaimer' => config('angola_tax.disclaimer'),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function meta(): array
    {
        return [
            'currency' => config('angola_tax.currency'),
            'effective_from' => config('angola_tax.effective_from'),
            'disclaimer' => config('angola_tax.disclaimer'),
            'legal_refs' => config('angola_tax.legal_refs'),
            'iva_rates' => config('angola_tax.iva.rates'),
            'imposto_industrial_rates' => config('angola_tax.imposto_industrial.rates'),
            'cambio_rates' => config('angola_tax.cambio'),
            'irt_brackets' => config('angola_tax.irt.group_a.brackets'),
        ];
    }
}
