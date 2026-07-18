@extends('seo.layout')

@section('content')
    <p class="kicker">Ferramentas SIGESC</p>
    <h1>Calculadoras fiscais para empresários em Angola</h1>
    <p class="excerpt">
        Simuladores com base na legislação configurada (OGE 2026 / Códigos do IVA e Imposto Industrial):
        IRT, IVA, Imposto Industrial, retenção na fonte e contribuição cambial.
    </p>
    <ul class="card-list">
        <li><h2>IRT Grupo A (salários) — Lei n.º 14/25</h2><p>Tabela progressiva 2026 com isenção até 150.000 Kz.</p></li>
        <li><h2>IRT Grupo C</h2><p>Regime simplificado 6,5% e sector primário 10%.</p></li>
        <li><h2>IVA</h2><p>Taxas 14%, 7%, 5% e 1% (Cabinda), com modos acrescentar/extrair.</p></li>
        <li><h2>Imposto Industrial</h2><p>25%, 10% (agrícola) e 35% (banca/seguros/telecom/petróleo).</p></li>
        <li><h2>Retenção na fonte 6,5%</h2><p>Cálculo sobre facturas de serviços.</p></li>
        <li><h2>Contribuição cambial</h2><p>2,5% (singular) e 10% (colectiva) — OGE 2026.</p></li>
    </ul>
    <p class="meta" style="margin-top:2rem;">{{ $meta['disclaimer'] ?? '' }}</p>
@endsection
