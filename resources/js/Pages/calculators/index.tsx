import React, { FormEvent, useMemo, useState } from 'react';
import axios from 'axios';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

type Meta = {
    disclaimer: string;
    effective_from: string;
    iva_rates: Record<string, { rate: number; label: string }>;
    imposto_industrial_rates: Record<string, { rate: number; label: string }>;
    legal_refs: Record<string, { name: string; url: string; simulator?: string }>;
    irt_brackets: Array<{ label: string; min: number; max: number | null; rate: number; fixed: number }>;
};

const tabs = [
    { id: 'irt_grupo_a', label: 'IRT Salários' },
    { id: 'irt_grupo_c', label: 'IRT Grupo C' },
    { id: 'iva', label: 'IVA' },
    { id: 'imposto_industrial', label: 'Imp. Industrial' },
    { id: 'retencao_servicos', label: 'Retenção 6,5%' },
    { id: 'cambio', label: 'Câmbio' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function CalculatorsIndex({
    auth,
    meta,
    seo,
}: {
    auth: { user: User | null };
    meta: Meta;
    seo?: SeoPayload;
}) {
    const [tab, setTab] = useState<TabId>('irt_grupo_a');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<any>(null);

    const [grossMonthly, setGrossMonthly] = useState('250000');
    const [annualTurnover, setAnnualTurnover] = useState('8000000');
    const [primarySector, setPrimarySector] = useState(false);
    const [ivaAmount, setIvaAmount] = useState('100000');
    const [ivaRate, setIvaRate] = useState('geral');
    const [ivaMode, setIvaMode] = useState<'add' | 'extract'>('add');
    const [profit, setProfit] = useState('5000000');
    const [iiRate, setIiRate] = useState('geral');
    const [invoice, setInvoice] = useState('1000000');
    const [transfer, setTransfer] = useState('1000000');
    const [personType, setPersonType] = useState('pessoa_colectiva');

    const ivaOptions = useMemo(() => Object.entries(meta.iva_rates || {}), [meta]);
    const iiOptions = useMemo(() => Object.entries(meta.imposto_industrial_rates || {}), [meta]);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        const payload: Record<string, unknown> = { type: tab };
        if (tab === 'irt_grupo_a') payload.gross_monthly = Number(grossMonthly);
        if (tab === 'irt_grupo_c') {
            payload.annual_turnover = Number(annualTurnover);
            payload.primary_sector = primarySector;
        }
        if (tab === 'iva') {
            payload.amount = Number(ivaAmount);
            payload.rate_key = ivaRate;
            payload.mode = ivaMode;
        }
        if (tab === 'imposto_industrial') {
            payload.taxable_profit = Number(profit);
            payload.rate_key = iiRate;
        }
        if (tab === 'retencao_servicos') payload.invoice_amount = Number(invoice);
        if (tab === 'cambio') {
            payload.transfer_amount = Number(transfer);
            payload.person_type = personType;
        }

        try {
            const { data } = await axios.post(route('calculators.calculate'), payload);
            setResult(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Não foi possível calcular. Verifique os valores.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead seo={seo} fallbackTitle="Calculadoras Fiscais Angola | SIGESC" />
                <HeaderComponent auth={auth as any} />
                <main className="bg-[#f3f0ea]">
                    <section className="relative overflow-hidden border-b border-black/5">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,#c9d7f0,transparent_35%),radial-gradient(circle_at_90%_20%,#e8c9a0,transparent_30%)]" />
                        <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3d91]">
                                SIGESC · Ferramentas legais
                            </p>
                            <h1 className="mt-3 font-serif text-4xl text-[#14213d] sm:text-5xl">
                                Calculadoras fiscais de Angola
                            </h1>
                            <p className="mt-4 max-w-2xl text-lg text-slate-600">
                                Cálculos feitos no servidor com bcmath, usando taxas da legislação configurada
                                (vigência {meta.effective_from}). Sem arredondamentos “à mão” no browser.
                            </p>
                        </div>
                    </section>

                    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setTab(item.id);
                                        setResult(null);
                                        setError('');
                                    }}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                        tab === item.id
                                            ? 'bg-[#0b3d91] text-white'
                                            : 'bg-white text-slate-700 ring-1 ring-black/10 hover:bg-slate-50'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <form
                            onSubmit={submit}
                            className="mt-8 grid gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 lg:grid-cols-[1.1fr_0.9fr]"
                        >
                            <div className="space-y-4">
                                {tab === 'irt_grupo_a' && (
                                    <Field label="Rendimento bruto mensal (Kz)">
                                        <input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            required
                                            value={grossMonthly}
                                            onChange={(e) => setGrossMonthly(e.target.value)}
                                            className="field"
                                        />
                                    </Field>
                                )}

                                {tab === 'irt_grupo_c' && (
                                    <>
                                        <Field label="Volume de negócios anual (Kz)">
                                            <input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                required
                                                value={annualTurnover}
                                                onChange={(e) => setAnnualTurnover(e.target.value)}
                                                className="field"
                                            />
                                        </Field>
                                        <label className="flex items-center gap-2 text-sm text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={primarySector}
                                                onChange={(e) => setPrimarySector(e.target.checked)}
                                            />
                                            Sector primário (agricultura, pecuária, pescas, silvicultura)
                                        </label>
                                    </>
                                )}

                                {tab === 'iva' && (
                                    <>
                                        <Field label="Valor (Kz)">
                                            <input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                required
                                                value={ivaAmount}
                                                onChange={(e) => setIvaAmount(e.target.value)}
                                                className="field"
                                            />
                                        </Field>
                                        <Field label="Taxa IVA">
                                            <select
                                                value={ivaRate}
                                                onChange={(e) => setIvaRate(e.target.value)}
                                                className="field"
                                            >
                                                {ivaOptions.map(([key, value]) => (
                                                    <option key={key} value={key}>
                                                        {value.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                        <Field label="Modo">
                                            <select
                                                value={ivaMode}
                                                onChange={(e) => setIvaMode(e.target.value as 'add' | 'extract')}
                                                className="field"
                                            >
                                                <option value="add">Acrescentar IVA ao valor líquido</option>
                                                <option value="extract">Extrair IVA de valor com imposto</option>
                                            </select>
                                        </Field>
                                    </>
                                )}

                                {tab === 'imposto_industrial' && (
                                    <>
                                        <Field label="Lucro tributável (Kz)">
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={profit}
                                                onChange={(e) => setProfit(e.target.value)}
                                                className="field"
                                            />
                                        </Field>
                                        <Field label="Taxa">
                                            <select
                                                value={iiRate}
                                                onChange={(e) => setIiRate(e.target.value)}
                                                className="field"
                                            >
                                                {iiOptions.map(([key, value]) => (
                                                    <option key={key} value={key}>
                                                        {value.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    </>
                                )}

                                {tab === 'retencao_servicos' && (
                                    <Field label="Valor da factura de serviços (Kz)">
                                        <input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            required
                                            value={invoice}
                                            onChange={(e) => setInvoice(e.target.value)}
                                            className="field"
                                        />
                                    </Field>
                                )}

                                {tab === 'cambio' && (
                                    <>
                                        <Field label="Montante da transferência (Kz)">
                                            <input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                required
                                                value={transfer}
                                                onChange={(e) => setTransfer(e.target.value)}
                                                className="field"
                                            />
                                        </Field>
                                        <Field label="Tipo de pessoa">
                                            <select
                                                value={personType}
                                                onChange={(e) => setPersonType(e.target.value)}
                                                className="field"
                                            >
                                                <option value="pessoa_singular">Pessoa singular (2,5%)</option>
                                                <option value="pessoa_colectiva">Pessoa colectiva (10%)</option>
                                            </select>
                                        </Field>
                                    </>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl bg-[#0b3d91] px-5 py-3 text-sm font-semibold text-white hover:bg-[#092f70] disabled:opacity-60"
                                >
                                    {loading ? 'A calcular no servidor…' : 'Calcular'}
                                </button>
                            </div>

                            <aside className="rounded-2xl bg-[#f7f4ef] p-5">
                                <h2 className="font-serif text-xl text-[#14213d]">Resultado</h2>
                                {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
                                {!error && !result && (
                                    <p className="mt-3 text-sm text-slate-600">
                                        Introduza os valores e calcule. O motor usa a tabela/lei configurada no
                                        servidor.
                                    </p>
                                )}
                                {result && (
                                    <div className="mt-4 space-y-3 text-sm text-slate-800">
                                        {result.blocked && <p className="text-amber-800">{result.message}</p>}
                                        {result.result &&
                                            Object.entries(result.result).map(([key, value]) => (
                                                <div key={key} className="flex justify-between gap-3 border-b border-black/5 py-2">
                                                    <span className="text-slate-500">{key}</span>
                                                    <span className="font-medium">{String(value)}</span>
                                                </div>
                                            ))}
                                        {result.bracket && (
                                            <p className="text-xs text-slate-500">
                                                Escalão: {result.bracket.label} · taxa{' '}
                                                {(result.bracket.rate * 100).toFixed(1)}%
                                            </p>
                                        )}
                                        {result.formula && (
                                            <p className="text-xs text-slate-500">Fórmula: {result.formula}</p>
                                        )}
                                        {result.legal?.name && (
                                            <p className="text-xs text-slate-500">
                                                Base legal: {result.legal.name}
                                                {result.legal.simulator && (
                                                    <>
                                                        {' · '}
                                                        <a
                                                            href={result.legal.simulator}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-[#0b3d91] underline"
                                                        >
                                                            Simulador AGT
                                                        </a>
                                                    </>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </aside>
                        </form>

                        <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-black/5">
                            <h2 className="font-serif text-2xl text-[#14213d]">Tabela IRT 2026 (Grupo A)</h2>
                            <div className="mt-4 overflow-x-auto">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="text-slate-500">
                                        <tr>
                                            <th className="py-2 pr-4">Escalão</th>
                                            <th className="py-2 pr-4">De</th>
                                            <th className="py-2 pr-4">Até</th>
                                            <th className="py-2 pr-4">Taxa</th>
                                            <th className="py-2">Parcela fixa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meta.irt_brackets?.map((b) => (
                                            <tr key={b.label} className="border-t border-black/5">
                                                <td className="py-2 pr-4">{b.label}</td>
                                                <td className="py-2 pr-4">{b.min.toLocaleString('pt-AO')}</td>
                                                <td className="py-2 pr-4">
                                                    {b.max == null ? '∞' : b.max.toLocaleString('pt-AO')}
                                                </td>
                                                <td className="py-2 pr-4">{(b.rate * 100).toFixed(1)}%</td>
                                                <td className="py-2">{b.fixed.toLocaleString('pt-AO')} Kz</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-6 text-sm text-slate-600">{meta.disclaimer}</p>
                        </div>
                    </section>
                </main>
                <FooterComponent />
                <style>{`
                    .field { width: 100%; border-radius: 0.75rem; border: 1px solid #e2e8f0; padding: 0.75rem 1rem; outline: none; }
                    .field:focus { box-shadow: 0 0 0 2px #0b3d91; }
                `}</style>
            </FormStateProvider>
        </UserLoggedProvider>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="text-sm font-medium text-slate-700">{label}</span>
            <div className="mt-2">{children}</div>
        </label>
    );
}
