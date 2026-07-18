<?php

/**
 * Taxas e parâmetros fiscais de Angola — versão controlada.
 *
 * Fonte principal IRT 2026: Lei n.º 14/25 (OGE 2026), em vigor desde 01/01/2026.
 * Fonte IVA: Código do IVA (alteração Lei n.º 14/23).
 * Fonte Imposto Industrial: Código do Imposto Industrial (taxas art. 64.º).
 *
 * ATUALIZE este ficheiro quando a lei mudar. Os cálculos usam apenas estes valores
 * (bcmath), nunca taxas “adivinhadas” pelo frontend.
 */
return [

    'currency' => 'AOA',
    'currency_label' => 'Kz',
    'effective_from' => '2026-01-01',
    'timezone' => 'Africa/Luanda',

    'legal_refs' => [
        'irt' => [
            'name' => 'Lei n.º 14/25, de 30 de Dezembro (OGE 2026) — Tabela de retenção IRT Grupo A',
            'url' => 'https://portaldocontribuinte.minfin.gov.ao',
            'simulator' => 'https://quiosqueagt.minfin.gov.ao/simulador/irt',
        ],
        'iva' => [
            'name' => 'Código do IVA — Lei n.º 14/23 (taxas)',
            'url' => 'https://agt.minfin.gov.ao',
        ],
        'imposto_industrial' => [
            'name' => 'Código do Imposto Industrial — art. 64.º (taxas)',
            'url' => 'https://agt.minfin.gov.ao',
        ],
        'retencao' => [
            'name' => 'IRT Grupo C / retenções e Imposto Industrial (serviços) — regimes legais aplicáveis',
            'url' => 'https://agt.minfin.gov.ao',
        ],
        'cambio' => [
            'name' => 'Contribuição Especial sobre Operações Cambiais — OGE 2026 (Lei n.º 14/25)',
            'url' => 'https://www.bna.ao',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | IRT — Grupo A (trabalho por conta de outrem)
    | Formula: parcela_fixa + taxa × (rendimento − excesso_sobre)
    | Escalões com "ate" inclusivo; o 1.º é isento.
    |--------------------------------------------------------------------------
    */
    'irt' => [
        'group_a' => [
            'brackets' => [
                ['min' => 0, 'max' => 150_000, 'rate' => 0, 'fixed' => 0, 'excess_over' => 0, 'label' => '1.º Escalão (isento)'],
                ['min' => 150_000.01, 'max' => 200_000, 'rate' => 0.16, 'fixed' => 12_500, 'excess_over' => 150_000, 'label' => '2.º Escalão'],
                ['min' => 200_000.01, 'max' => 300_000, 'rate' => 0.18, 'fixed' => 31_250, 'excess_over' => 200_000, 'label' => '3.º Escalão'],
                ['min' => 300_000.01, 'max' => 500_000, 'rate' => 0.19, 'fixed' => 49_250, 'excess_over' => 300_000, 'label' => '4.º Escalão'],
                ['min' => 500_000.01, 'max' => 1_000_000, 'rate' => 0.20, 'fixed' => 87_250, 'excess_over' => 500_000, 'label' => '5.º Escalão'],
                ['min' => 1_000_000.01, 'max' => 1_500_000, 'rate' => 0.21, 'fixed' => 187_250, 'excess_over' => 1_000_000, 'label' => '6.º Escalão'],
                ['min' => 1_500_000.01, 'max' => 2_000_000, 'rate' => 0.22, 'fixed' => 292_250, 'excess_over' => 1_500_000, 'label' => '7.º Escalão'],
                ['min' => 2_000_000.01, 'max' => 2_500_000, 'rate' => 0.23, 'fixed' => 402_250, 'excess_over' => 2_000_000, 'label' => '8.º Escalão'],
                ['min' => 2_500_000.01, 'max' => 5_000_000, 'rate' => 0.24, 'fixed' => 517_250, 'excess_over' => 2_500_000, 'label' => '9.º Escalão'],
                ['min' => 5_000_000.01, 'max' => 10_000_000, 'rate' => 0.245, 'fixed' => 1_117_250, 'excess_over' => 5_000_000, 'label' => '10.º Escalão'],
                ['min' => 10_000_000.01, 'max' => null, 'rate' => 0.25, 'fixed' => 2_342_250, 'excess_over' => 10_000_000, 'label' => '11.º Escalão'],
            ],
        ],
        'group_c' => [
            'simplified_rate' => 0.065, // 6,5% sobre volume de vendas (≤ 10M no exercício de referência)
            'simplified_turnover_limit' => 10_000_000,
            'primary_sector_rate' => 0.10, // 10% sector primário acima do limite
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | IVA — Código do IVA
    |--------------------------------------------------------------------------
    */
    'iva' => [
        'rates' => [
            'geral' => ['rate' => 0.14, 'label' => 'Taxa geral (14%)'],
            'simplificado' => ['rate' => 0.07, 'label' => 'Regime simplificado (7%)'],
            'hotelaria_restauracao' => ['rate' => 0.07, 'label' => 'Hotelaria e restauração (7%)'],
            'bens_essenciais' => ['rate' => 0.05, 'label' => 'Bens alimentares / insumos agrícolas (5%)'],
            'cabinda' => ['rate' => 0.01, 'label' => 'Regime especial Cabinda (1%)'],
            'equipamento_industrial_oge2026' => ['rate' => 0.05, 'label' => 'Equipamentos industriais (5% — OGE 2026, sujeito a aprovação AGT)'],
        ],
        'default' => 'geral',
    ],

    /*
    |--------------------------------------------------------------------------
    | Imposto Industrial
    |--------------------------------------------------------------------------
    */
    'imposto_industrial' => [
        'rates' => [
            'geral' => ['rate' => 0.25, 'label' => 'Taxa geral (25%)'],
            'agricola' => ['rate' => 0.10, 'label' => 'Actividades agrícolas/pecuárias/piscatórias/silvícolas (10%)'],
            'banca_seguros_telecom_petroleo' => ['rate' => 0.35, 'label' => 'Banca, seguros, telecom e petrolíferas (35%)'],
            'servicos_acidentais_nao_residentes' => ['rate' => 0.065, 'label' => 'Serviços acidentais (não residentes) — 6,5%'],
        ],
        'default' => 'geral',
    ],

    /*
    |--------------------------------------------------------------------------
    | Retenção na fonte (serviços) — taxa habitual de mercado/compliance
    |--------------------------------------------------------------------------
    */
    'retencao_fonte' => [
        'servicos_6_5' => ['rate' => 0.065, 'label' => 'Retenção 6,5% sobre serviços'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Contribuição Especial sobre Operações Cambiais (OGE 2026)
    |--------------------------------------------------------------------------
    */
    'cambio' => [
        'pessoa_singular' => ['rate' => 0.025, 'label' => 'Pessoa singular (2,5%)'],
        'pessoa_colectiva' => ['rate' => 0.10, 'label' => 'Pessoa colectiva (10%)'],
    ],

    'disclaimer' => 'Ferramenta de apoio à decisão com base na legislação configurada (OGE 2026 / Códigos fiscais). Não substitui parecer de contabilista certificado nem a liquidação oficial da AGT. Confirme sempre no Portal do Contribuinte / simulador AGT.',

];
