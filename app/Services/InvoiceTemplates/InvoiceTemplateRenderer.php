<?php

namespace App\Services\InvoiceTemplates;

class InvoiceTemplateRenderer
{
    /**
     * @param  array<string, mixed>  $template
     */
    public function render(array $template): string
    {
        $style = (string) ($template['style'] ?? 'classic');
        $theme = $this->theme($style);
        $title = e((string) $template['title']);
        $category = e((string) (config('invoice_templates.categories')[$template['category']] ?? 'Factura'));
        $docLabel = $this->documentLabel($template);
        $sample = $this->sampleData($template);

        $rows = '';
        foreach ($sample['items'] as $item) {
            $rows .= '<tr>'
                .'<td>'.e($item['desc']).'</td>'
                .'<td class="num">'.e($item['qty']).'</td>'
                .'<td class="num">'.e($item['price']).'</td>'
                .(isset($item['iva']) ? '<td class="num">'.e($item['iva']).'</td>' : '')
                .'<td class="num">'.e($item['total']).'</td>'
                .'</tr>';
        }

        $ivaCol = $sample['show_iva'] ? '<th>IVA</th>' : '';
        $extras = '';
        foreach ($sample['totals'] as $label => $value) {
            $extras .= '<div class="tot-row"><span>'.e($label).'</span><strong>'.e($value).'</strong></div>';
        }

        $agtBlock = $sample['agt']
            ? '<section class="agt"><h3>Dados para faturação eletrónica (AGT)</h3>'
                .'<p><strong>Tipo de documento:</strong> '.$docLabel.' · <strong>Série:</strong> A · <strong>N.º:</strong> 2026/0001</p>'
                .'<p><strong>Software:</strong> SIGESC / modelo editável · <strong>Hash:</strong> — (preencher no software certificado)</p>'
                .'<div class="qr">QR AGT</div></section>'
            : '';

        $badge = $sample['badge']
            ? '<div class="badge">'.e($sample['badge']).'</div>'
            : '';

        return <<<HTML
<!DOCTYPE html>
<html lang="pt-AO">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{$title} — Modelo gratuito SIGESC</title>
<style>
  :root {
    --ink: {$theme['ink']};
    --accent: {$theme['accent']};
    --accent-soft: {$theme['accent_soft']};
    --line: {$theme['line']};
    --muted: {$theme['muted']};
    --paper: {$theme['paper']};
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: #e8edf3; color: var(--ink);
    font-family: "Segoe UI", system-ui, sans-serif; line-height: 1.45;
  }
  .sheet {
    width: 210mm; min-height: 297mm; margin: 18px auto; padding: 16mm 16mm 14mm;
    background: var(--paper); box-shadow: 0 12px 40px rgba(15,23,42,.12);
    position: relative;
  }
  .topbar { height: 6px; background: linear-gradient(90deg, var(--accent), var(--accent-soft)); margin: -16mm -16mm 10mm; }
  header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; }
  .brand h1 { margin: 0; font-size: 22px; letter-spacing: .02em; }
  .brand p { margin: 4px 0 0; color: var(--muted); font-size: 12px; }
  .doc-meta { text-align: right; }
  .doc-meta .type {
    display: inline-block; padding: 6px 12px; border-radius: 999px;
    background: var(--accent); color: #fff; font-size: 12px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
  }
  .doc-meta .num { margin-top: 10px; font-size: 13px; color: var(--muted); }
  .badge {
    margin-top: 10px; display: inline-block; border: 2px solid var(--accent);
    color: var(--accent); font-weight: 800; letter-spacing: .12em; padding: 4px 10px;
    transform: rotate(-6deg);
  }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 22px 0 18px; }
  .card { border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; background: #fff; }
  .card h2 { margin: 0 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: var(--accent); }
  .card p { margin: 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12.5px; }
  th { text-align: left; background: var(--accent); color: #fff; padding: 9px 10px; font-weight: 600; }
  td { padding: 9px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
  td.num, th.num { text-align: right; white-space: nowrap; }
  .totals { margin-top: 16px; margin-left: auto; width: 280px; }
  .tot-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed var(--line); font-size: 13px; }
  .tot-row:last-child { border-bottom: 0; font-size: 16px; color: var(--accent); }
  .notes { margin-top: 22px; font-size: 12px; color: var(--muted); border-top: 1px solid var(--line); padding-top: 12px; }
  .bank { margin-top: 14px; padding: 12px; border-radius: 10px; background: #f8fafc; border: 1px solid var(--line); font-size: 12px; }
  .agt { margin-top: 18px; padding: 12px; border: 1px dashed var(--accent); border-radius: 10px; font-size: 12px; }
  .agt h3 { margin: 0 0 8px; font-size: 12px; color: var(--accent); }
  .qr {
    width: 64px; height: 64px; margin-top: 8px; border: 2px solid var(--ink);
    display: grid; place-items: center; font-size: 10px; font-weight: 700;
  }
  .sign { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 36px; }
  .sign .line { border-top: 1px solid var(--ink); padding-top: 6px; font-size: 12px; color: var(--muted); }
  footer.sheet-foot {
    margin-top: 28px; font-size: 10px; color: var(--muted); text-align: center;
  }
  .toolbar {
    position: sticky; top: 0; z-index: 5; background: #0b3d91; color: #fff;
    display: flex; justify-content: space-between; gap: 12px; align-items: center;
    padding: 10px 16px; font-size: 13px;
  }
  .toolbar a, .toolbar button {
    color: #fff; background: transparent; border: 1px solid rgba(255,255,255,.45);
    border-radius: 8px; padding: 7px 12px; text-decoration: none; cursor: pointer; font-weight: 600;
  }
  @media print {
    body { background: #fff; }
    .toolbar { display: none !important; }
    .sheet { margin: 0; box-shadow: none; width: auto; min-height: auto; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <span>Modelo gratuito SIGESC · {$category} · Imprima ou guarde como PDF</span>
    <span>
      <button onclick="window.print()">Imprimir / PDF</button>
      <a href="/modelos-de-fatura">Voltar à biblioteca</a>
    </span>
  </div>
  <article class="sheet">
    <div class="topbar"></div>
    <header>
      <div class="brand">
        <h1>{$sample['company']}</h1>
        <p>{$sample['company_meta']}</p>
      </div>
      <div class="doc-meta">
        <div class="type">{$docLabel}</div>
        {$badge}
        <div class="num">N.º {$sample['number']}<br>Data: {$sample['date']}<br>Vencimento: {$sample['due']}</div>
      </div>
    </header>

    <div class="grid">
      <div class="card">
        <h2>Emitente</h2>
        <p>{$sample['issuer']}</p>
      </div>
      <div class="card">
        <h2>Cliente</h2>
        <p>{$sample['client']}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th class="num">Qtd</th>
          <th class="num">Preço</th>
          {$ivaCol}
          <th class="num">Total</th>
        </tr>
      </thead>
      <tbody>{$rows}</tbody>
    </table>

    <div class="totals">{$extras}</div>

    {$sample['extra_html']}
    {$agtBlock}

    <div class="sign">
      <div class="line">O emitente</div>
      <div class="line">O cliente</div>
    </div>

    <div class="notes">
      <p><strong>Notas:</strong> {$sample['notes']}</p>
      <p>Modelo gratuito editável da biblioteca SIGESC (sisgesc.net). Personalize com os dados da sua empresa. Confirme sempre os requisitos legais na AGT.</p>
    </div>
    <footer class="sheet-foot">SIGESC · Modelos de fatura Angola · Documento modelo para edição</footer>
  </article>
</body>
</html>
HTML;
    }

    /**
     * @return array{ink: string, accent: string, accent_soft: string, line: string, muted: string, paper: string}
     */
    protected function theme(string $style): array
    {
        return match ($style) {
            'minimal' => [
                'ink' => '#1e293b',
                'accent' => '#334155',
                'accent_soft' => '#64748b',
                'line' => '#e2e8f0',
                'muted' => '#64748b',
                'paper' => '#ffffff',
            ],
            'angola' => [
                'ink' => '#111827',
                'accent' => '#b91c1c',
                'accent_soft' => '#ca8a04',
                'line' => '#e7e5e4',
                'muted' => '#57534e',
                'paper' => '#fffdf8',
            ],
            'modern' => [
                'ink' => '#0f172a',
                'accent' => '#0b3d91',
                'accent_soft' => '#1d4ed8',
                'line' => '#dbe3f0',
                'muted' => '#475569',
                'paper' => '#ffffff',
            ],
            'corporate' => [
                'ink' => '#0b1324',
                'accent' => '#0f3d68',
                'accent_soft' => '#1e5a8a',
                'line' => '#d7e0ea',
                'muted' => '#52606d',
                'paper' => '#ffffff',
            ],
            default => [
                'ink' => '#14213d',
                'accent' => '#0b3d91',
                'accent_soft' => '#2563eb',
                'line' => '#e2e8f0',
                'muted' => '#64748b',
                'paper' => '#ffffff',
            ],
        };
    }

    /**
     * @param  array<string, mixed>  $template
     */
    protected function documentLabel(array $template): string
    {
        return match ($template['category'] ?? 'factura') {
            'factura-recibo' => 'Factura-Recibo',
            'proforma' => 'Factura Proforma',
            'recibo' => 'Recibo',
            'orcamento' => 'Orçamento',
            'nota-credito' => 'Nota de Crédito',
            'nota-debito' => 'Nota de Débito',
            default => 'Factura',
        };
    }

    /**
     * @param  array<string, mixed>  $template
     * @return array<string, mixed>
     */
    protected function sampleData(array $template): array
    {
        $slug = (string) $template['slug'];
        $showIva = str_contains($slug, 'iva') || str_contains($slug, 'agt') || str_contains($slug, 'retencao') || ($template['level'] ?? '') === 'avancado';
        $agt = str_contains($slug, 'agt') || $slug === 'factura-corporativa-angola';

        $items = [
            ['desc' => 'Prestação de serviços de gestão comercial', 'qty' => '1', 'price' => '150.000,00 Kz', 'iva' => '14%', 'total' => '171.000,00 Kz'],
            ['desc' => 'Licença software / suporte mensal', 'qty' => '1', 'price' => '45.000,00 Kz', 'iva' => '14%', 'total' => '51.300,00 Kz'],
            ['desc' => 'Material de escritório (exemplo)', 'qty' => '5', 'price' => '3.500,00 Kz', 'iva' => '14%', 'total' => '19.950,00 Kz'],
        ];

        if (str_contains($slug, 'retalho')) {
            $items = [
                ['desc' => 'Produto A — código SKU-1001', 'qty' => '12', 'price' => '2.500,00 Kz', 'iva' => '14%', 'total' => '34.200,00 Kz'],
                ['desc' => 'Produto B — código SKU-2044', 'qty' => '4', 'price' => '8.750,00 Kz', 'iva' => '14%', 'total' => '39.900,00 Kz'],
                ['desc' => 'Produto C — código SKU-3090', 'qty' => '2', 'price' => '15.000,00 Kz', 'iva' => '14%', 'total' => '34.200,00 Kz'],
            ];
        }

        if (str_contains($slug, 'restaurante')) {
            $items = [
                ['desc' => 'Menu executivo (2 pax)', 'qty' => '2', 'price' => '6.500,00 Kz', 'iva' => '14%', 'total' => '14.820,00 Kz'],
                ['desc' => 'Bebidas', 'qty' => '4', 'price' => '1.200,00 Kz', 'iva' => '14%', 'total' => '5.472,00 Kz'],
                ['desc' => 'Taxa de serviço 10%', 'qty' => '1', 'price' => '1.780,00 Kz', 'iva' => '—', 'total' => '1.780,00 Kz'],
            ];
        }

        if (str_contains($slug, 'transporte')) {
            $items = [
                ['desc' => 'Transporte Luanda → Benguela (carga geral)', 'qty' => '1', 'price' => '280.000,00 Kz', 'iva' => '14%', 'total' => '319.200,00 Kz'],
                ['desc' => 'Taxa de manuseamento / seguro', 'qty' => '1', 'price' => '35.000,00 Kz', 'iva' => '14%', 'total' => '39.900,00 Kz'],
            ];
        }

        if (! $showIva) {
            $items = array_map(function ($item) {
                unset($item['iva']);

                return $item;
            }, $items);
        }

        $totals = [
            'Subtotal' => '195.000,00 Kz',
            'IVA' => '27.300,00 Kz',
            'Total' => '222.300,00 Kz',
        ];

        if (str_contains($slug, 'retencao')) {
            $totals = [
                'Subtotal' => '200.000,00 Kz',
                'IVA 14%' => '28.000,00 Kz',
                'Retenção 6,5%' => '-13.000,00 Kz',
                'Total a receber' => '215.000,00 Kz',
            ];
        }

        if (str_contains($slug, 'desconto')) {
            $totals = [
                'Subtotal' => '250.000,00 Kz',
                'Desconto 10%' => '-25.000,00 Kz',
                'Base tributável' => '225.000,00 Kz',
                'IVA 14%' => '31.500,00 Kz',
                'Total' => '256.500,00 Kz',
            ];
        }

        if (! $showIva && ! str_contains($slug, 'retencao') && ! str_contains($slug, 'desconto')) {
            $totals = [
                'Subtotal' => '195.000,00 Kz',
                'Total' => '195.000,00 Kz',
            ];
        }

        $badge = match (true) {
            ($template['category'] ?? '') === 'proforma' => 'PROFORMA',
            str_contains($slug, 'orcamento') => 'ORÇAMENTO',
            default => null,
        };

        $extra = '';
        if (str_contains($slug, 'recorrente')) {
            $extra = '<div class="bank"><strong>Período de faturação:</strong> 01/07/2026 a 31/07/2026 · Contrato CT-2026/18</div>';
        }
        if (str_contains($slug, 'importacao')) {
            $extra = '<div class="bank"><strong>Incoterms:</strong> CIF Luanda · <strong>Moeda:</strong> USD · <strong>Porto:</strong> Porto de Luanda</div>';
        }
        if (str_contains($slug, 'corporativa') || $agt) {
            $extra .= '<div class="bank"><strong>Dados bancários:</strong> Banco Exemplo · IBAN AO06 0000 0000 0000 0000 0000 0 · Swift XXXXAOLU</div>';
        }

        return [
            'company' => 'Empresa Exemplo, Lda.',
            'company_meta' => 'Luanda, Angola · comercial@empresa.ao · +244 900 000 000',
            'number' => 'FR 2026/0001',
            'date' => '20/07/2026',
            'due' => '05/08/2026',
            'issuer' => 'Empresa Exemplo, Lda.<br>NIF: 5000000000<br>Rua Exemplo, Ingombota, Luanda<br>Tel: +244 900 000 000',
            'client' => 'Cliente Exemplo, Lda.<br>NIF: 5000000001<br>Talatona, Luanda<br>compras@cliente.ao',
            'items' => $items,
            'show_iva' => $showIva,
            'totals' => $totals,
            'notes' => 'Este é um modelo editável. Substitua os dados de exemplo pelos da sua empresa. Pagamento por transferência ou TPA.',
            'badge' => $badge,
            'agt' => $agt,
            'extra_html' => $extra,
        ];
    }
}
