import React, { useMemo, useState } from 'react';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

type TaxOption = { key: string; label: string; rate: number };
type DocType = { key: string; label: string };

type Party = {
    name: string;
    nif: string;
    address: string;
    city: string;
    phone: string;
    email: string;
};

type LineItem = {
    id: string;
    description: string;
    quantity: string;
    unitPrice: string;
    discount: string;
    taxKey: string;
    customTax: string;
};

const emptyParty = (): Party => ({
    name: '',
    nif: '',
    address: '',
    city: 'Luanda',
    phone: '',
    email: '',
});

const newLine = (defaultTax: string): LineItem => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    description: '',
    quantity: '1',
    unitPrice: '0',
    discount: '0',
    taxKey: defaultTax,
    customTax: '14',
});

const money = (value: number) =>
    value.toLocaleString('pt-AO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function parseNum(value: string): number {
    const n = Number(String(value).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
}

export default function InvoiceGeneratorIndex({
    auth,
    seo,
    taxOptions,
    documentTypes,
    disclaimer,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    taxOptions: TaxOption[];
    documentTypes: DocType[];
    disclaimer: string;
}) {
    const defaultTax = taxOptions.find((t) => t.key === 'geral')?.key || taxOptions[0]?.key || 'isento';

    const [docType, setDocType] = useState(documentTypes[0]?.key || 'factura');
    const [series, setSeries] = useState('A');
    const [number, setNumber] = useState('1');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
    const [dueDate, setDueDate] = useState('');
    const [issuer, setIssuer] = useState<Party>(emptyParty());
    const [client, setClient] = useState<Party>(emptyParty());
    const [items, setItems] = useState<LineItem[]>([newLine(defaultTax)]);
    const [globalDiscount, setGlobalDiscount] = useState('0');
    const [retentionEnabled, setRetentionEnabled] = useState(false);
    const [retentionRate, setRetentionRate] = useState('6.5');
    const [notes, setNotes] = useState('Pagamento por transferência bancária ou TPA.');
    const [paymentMethod, setPaymentMethod] = useState('Transferência bancária');
    const [iban, setIban] = useState('');
    const [bankName, setBankName] = useState('');

    const docLabel = documentTypes.find((d) => d.key === docType)?.label || 'Factura';

    const taxRateFor = (item: LineItem): number => {
        if (item.taxKey === 'custom') return Math.max(0, parseNum(item.customTax)) / 100;
        const opt = taxOptions.find((t) => t.key === item.taxKey);
        return Math.max(0, opt?.rate ?? 0);
    };

    const computed = useMemo(() => {
        const lines = items.map((item) => {
            const qty = Math.max(0, parseNum(item.quantity));
            const price = Math.max(0, parseNum(item.unitPrice));
            const disc = Math.min(100, Math.max(0, parseNum(item.discount)));
            const net = qty * price * (1 - disc / 100);
            const rate = taxRateFor(item);
            const tax = net * rate;
            return { ...item, qty, price, disc, net, rate, tax, total: net + tax };
        });

        const goodsNet = lines.reduce((s, l) => s + l.net, 0);
        const goodsTax = lines.reduce((s, l) => s + l.tax, 0);
        const gDisc = Math.min(100, Math.max(0, parseNum(globalDiscount)));
        const afterDiscNet = goodsNet * (1 - gDisc / 100);
        const afterDiscTax = goodsTax * (1 - gDisc / 100);
        const beforeRetention = afterDiscNet + afterDiscTax;
        const retRate = retentionEnabled ? Math.max(0, parseNum(retentionRate)) / 100 : 0;
        // Retention typically on taxable services net — apply on net after global discount.
        const retention = afterDiscNet * retRate;
        const grand = beforeRetention - retention;

        return {
            lines,
            goodsNet,
            goodsTax,
            gDisc,
            afterDiscNet,
            afterDiscTax,
            retention,
            beforeRetention,
            grand,
        };
    }, [items, globalDiscount, retentionEnabled, retentionRate, taxOptions]);

    const updateParty = (which: 'issuer' | 'client', field: keyof Party, value: string) => {
        if (which === 'issuer') setIssuer((p) => ({ ...p, [field]: value }));
        else setClient((p) => ({ ...p, [field]: value }));
    };

    const updateItem = (id: string, field: keyof LineItem, value: string) => {
        setItems((rows) => rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    };

    const addItem = () => setItems((rows) => [...rows, newLine(defaultTax)]);
    const removeItem = (id: string) =>
        setItems((rows) => (rows.length <= 1 ? rows : rows.filter((r) => r.id !== id)));

    const resetAll = () => {
        if (!window.confirm('Limpar todos os dados desta factura? (nada está guardado no servidor)')) return;
        setIssuer(emptyParty());
        setClient(emptyParty());
        setItems([newLine(defaultTax)]);
        setGlobalDiscount('0');
        setRetentionEnabled(false);
        setNotes('Pagamento por transferência bancária ou TPA.');
        setIban('');
        setBankName('');
    };

    const printInvoice = () => window.print();

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="Criar Fatura Online Grátis Angola | Gerador de Factura com IVA"
                />
                <HeaderComponent auth={auth as any} />
                <main className="bg-[#f3f0ea] print:bg-white">
                    <section className="relative overflow-hidden border-b border-black/5 print:hidden">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,#c9d7f0,transparent_35%),radial-gradient(circle_at_90%_20%,#e8c9a0,transparent_30%)]" />
                        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3d91]">
                                SIGESC · Gerador gratuito · Sem conta
                            </p>
                            <h1 className="mt-3 max-w-4xl font-serif text-4xl text-[#14213d] sm:text-5xl">
                                Criar fatura online grátis — Angola
                            </h1>
                            <p className="mt-4 max-w-3xl text-lg text-slate-600">
                                Adicione artigos, preços, quantidades e IVA. Pré-visualização instantânea. Imprima ou
                                guarde em PDF.
                            </p>
                            <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                                <strong>Privacidade:</strong> {disclaimer}
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.05fr_0.95fr] sm:px-6 print:block print:max-w-none print:px-0">
                        <div className="space-y-6 print:hidden">
                            <Panel title="Documento">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field label="Tipo de documento">
                                        <select
                                            className="field"
                                            value={docType}
                                            onChange={(e) => setDocType(e.target.value)}
                                        >
                                            {documentTypes.map((d) => (
                                                <option key={d.key} value={d.key}>
                                                    {d.label}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="Série">
                                        <input className="field" value={series} onChange={(e) => setSeries(e.target.value)} />
                                    </Field>
                                    <Field label="Número">
                                        <input className="field" value={number} onChange={(e) => setNumber(e.target.value)} />
                                    </Field>
                                    <Field label="Data de emissão">
                                        <input
                                            type="date"
                                            className="field"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Data de vencimento">
                                        <input
                                            type="date"
                                            className="field"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                        />
                                    </Field>
                                    <Field label="Método de pagamento">
                                        <input
                                            className="field"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                    </Field>
                                </div>
                            </Panel>

                            <Panel title="Emitente (a sua empresa)">
                                <PartyFields party={issuer} onChange={(f, v) => updateParty('issuer', f, v)} />
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <Field label="Banco">
                                        <input className="field" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                                    </Field>
                                    <Field label="IBAN">
                                        <input className="field" value={iban} onChange={(e) => setIban(e.target.value)} />
                                    </Field>
                                </div>
                            </Panel>

                            <Panel title="Cliente">
                                <PartyFields party={client} onChange={(f, v) => updateParty('client', f, v)} />
                            </Panel>

                            <Panel
                                title="Artigos / serviços"
                                action={
                                    <button type="button" onClick={addItem} className="btn-secondary">
                                        + Adicionar artigo
                                    </button>
                                }
                            >
                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={item.id} className="rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-black/5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-sm font-semibold text-slate-700">Linha {index + 1}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-xs font-medium text-red-700 hover:underline"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="sm:col-span-2">
                                                    <Field label="Descrição">
                                                        <input
                                                            className="field"
                                                            value={item.description}
                                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                            placeholder="Ex.: Consultoria, produto, serviço…"
                                                        />
                                                    </Field>
                                                </div>
                                                <Field label="Quantidade">
                                                    <input
                                                        className="field"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                                                    />
                                                </Field>
                                                <Field label="Preço unitário (Kz)">
                                                    <input
                                                        className="field"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                                                    />
                                                </Field>
                                                <Field label="Desconto linha (%)">
                                                    <input
                                                        className="field"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        value={item.discount}
                                                        onChange={(e) => updateItem(item.id, 'discount', e.target.value)}
                                                    />
                                                </Field>
                                                <Field label="Imposto / IVA">
                                                    <select
                                                        className="field"
                                                        value={item.taxKey}
                                                        onChange={(e) => updateItem(item.id, 'taxKey', e.target.value)}
                                                    >
                                                        {taxOptions.map((t) => (
                                                            <option key={t.key} value={t.key}>
                                                                {t.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Field>
                                                {item.taxKey === 'custom' && (
                                                    <Field label="Taxa personalizada (%)">
                                                        <input
                                                            className="field"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.customTax}
                                                            onChange={(e) => updateItem(item.id, 'customTax', e.target.value)}
                                                        />
                                                    </Field>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Panel>

                            <Panel title="Totais e retenção">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field label="Desconto global (%)">
                                        <input
                                            className="field"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={globalDiscount}
                                            onChange={(e) => setGlobalDiscount(e.target.value)}
                                        />
                                    </Field>
                                    <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={retentionEnabled}
                                            onChange={(e) => setRetentionEnabled(e.target.checked)}
                                        />
                                        Aplicar retenção na fonte
                                    </label>
                                    {retentionEnabled && (
                                        <Field label="Retenção (%)">
                                            <input
                                                className="field"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={retentionRate}
                                                onChange={(e) => setRetentionRate(e.target.value)}
                                            />
                                        </Field>
                                    )}
                                </div>
                                <Field label="Notas / condições">
                                    <textarea
                                        className="field mt-3"
                                        rows={3}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </Field>
                            </Panel>

                            <div className="flex flex-wrap gap-3">
                                <button type="button" onClick={printInvoice} className="btn-primary">
                                    Imprimir / Guardar PDF
                                </button>
                                <button type="button" onClick={resetAll} className="btn-secondary">
                                    Limpar formulário
                                </button>
                                <a href="/modelos-de-fatura" className="btn-secondary">
                                    Ver modelos para descarregar
                                </a>
                            </div>
                        </div>

                        <aside className="lg:sticky lg:top-6 lg:self-start">
                            <div
                                id="invoice-preview"
                                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 print:rounded-none print:shadow-none print:ring-0"
                            >
                                <div className="mb-4 h-1.5 rounded-full bg-gradient-to-r from-[#0b3d91] to-[#b91c1c] print:mb-6" />
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0b3d91]">
                                            Pré-visualização
                                        </p>
                                        <h2 className="mt-1 font-serif text-2xl text-[#14213d]">
                                            {issuer.name || 'A sua empresa'}
                                        </h2>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {[issuer.address, issuer.city, issuer.phone, issuer.email]
                                                .filter(Boolean)
                                                .join(' · ') || 'Morada e contactos do emitente'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block rounded-full bg-[#0b3d91] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                                            {docLabel}
                                        </span>
                                        <p className="mt-2 text-xs text-slate-600">
                                            {series}/{number}
                                            <br />
                                            Emissão: {issueDate || '—'}
                                            {dueDate ? (
                                                <>
                                                    <br />
                                                    Venc.: {dueDate}
                                                </>
                                            ) : null}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-xl border border-slate-200 p-3 text-sm">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">
                                            Emitente
                                        </p>
                                        <p className="mt-1 font-medium">{issuer.name || '—'}</p>
                                        <p className="text-slate-600">NIF: {issuer.nif || '—'}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 p-3 text-sm">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#0b3d91]">
                                            Cliente
                                        </p>
                                        <p className="mt-1 font-medium">{client.name || '—'}</p>
                                        <p className="text-slate-600">NIF: {client.nif || '—'}</p>
                                        <p className="text-slate-600">
                                            {[client.address, client.city].filter(Boolean).join(', ') || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 overflow-x-auto">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-[#0b3d91] text-white">
                                            <tr>
                                                <th className="px-3 py-2 font-medium">Descrição</th>
                                                <th className="px-3 py-2 text-right font-medium">Qtd</th>
                                                <th className="px-3 py-2 text-right font-medium">Preço</th>
                                                <th className="px-3 py-2 text-right font-medium">IVA</th>
                                                <th className="px-3 py-2 text-right font-medium">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {computed.lines.map((line) => (
                                                <tr key={line.id} className="border-b border-slate-100">
                                                    <td className="px-3 py-2">{line.description || '—'}</td>
                                                    <td className="px-3 py-2 text-right">{money(line.qty)}</td>
                                                    <td className="px-3 py-2 text-right">{money(line.price)}</td>
                                                    <td className="px-3 py-2 text-right">
                                                        {(line.rate * 100).toFixed(1)}%
                                                    </td>
                                                    <td className="px-3 py-2 text-right">{money(line.total)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 ml-auto w-full max-w-xs space-y-1 text-sm">
                                    <Row label="Subtotal (sem IVA)" value={`${money(computed.goodsNet)} Kz`} />
                                    <Row label="IVA" value={`${money(computed.goodsTax)} Kz`} />
                                    {computed.gDisc > 0 && (
                                        <Row label={`Desconto global ${computed.gDisc}%`} value={`−`} />
                                    )}
                                    {retentionEnabled && (
                                        <Row
                                            label={`Retenção ${parseNum(retentionRate)}%`}
                                            value={`− ${money(computed.retention)} Kz`}
                                        />
                                    )}
                                    <Row
                                        label="Total a pagar"
                                        value={`${money(computed.grand)} Kz`}
                                        strong
                                    />
                                </div>

                                {(bankName || iban) && (
                                    <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                                        <strong>Pagamento:</strong> {paymentMethod}
                                        {bankName ? ` · ${bankName}` : ''}
                                        {iban ? ` · IBAN ${iban}` : ''}
                                    </p>
                                )}
                                {notes && <p className="mt-3 text-xs text-slate-500">{notes}</p>}
                                <p className="mt-6 text-[10px] leading-relaxed text-slate-400">
                                    Documento gerado no gerador gratuito SIGESC. Não é armazenado no servidor. Para
                                    faturação eletrónica oficial AGT use software certificado.
                                </p>
                            </div>
                        </aside>
                    </section>
                </main>
                <FooterComponent />
                <style>{`
                    .field { width: 100%; border-radius: 0.75rem; border: 1px solid #e2e8f0; padding: 0.7rem 0.9rem; outline: none; background: #fff; }
                    .field:focus { box-shadow: 0 0 0 2px #0b3d91; }
                    .btn-primary { border-radius: 0.75rem; background: #0b3d91; color: #fff; font-weight: 600; font-size: 0.875rem; padding: 0.7rem 1.1rem; }
                    .btn-primary:hover { background: #0a347c; }
                    .btn-secondary { border-radius: 0.75rem; background: #fff; color: #0b3d91; font-weight: 600; font-size: 0.875rem; padding: 0.7rem 1.1rem; box-shadow: inset 0 0 0 1px rgba(11,61,145,.35); }
                    @media print {
                        body * { visibility: hidden; }
                        #invoice-preview, #invoice-preview * { visibility: visible; }
                        #invoice-preview { position: absolute; left: 0; top: 0; width: 100%; }
                        header, footer, .print\\:hidden { display: none !important; }
                    }
                `}</style>
            </FormStateProvider>
        </UserLoggedProvider>
    );
}

function Panel({
    title,
    children,
    action,
}: {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-serif text-xl text-[#14213d]">{title}</h2>
                {action}
            </div>
            {children}
        </section>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </span>
            {children}
        </label>
    );
}

function PartyFields({
    party,
    onChange,
}: {
    party: Party;
    onChange: (field: keyof Party, value: string) => void;
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nome / Empresa">
                <input className="field" value={party.name} onChange={(e) => onChange('name', e.target.value)} />
            </Field>
            <Field label="NIF">
                <input className="field" value={party.nif} onChange={(e) => onChange('nif', e.target.value)} />
            </Field>
            <Field label="Morada">
                <input className="field" value={party.address} onChange={(e) => onChange('address', e.target.value)} />
            </Field>
            <Field label="Cidade">
                <input className="field" value={party.city} onChange={(e) => onChange('city', e.target.value)} />
            </Field>
            <Field label="Telefone">
                <input className="field" value={party.phone} onChange={(e) => onChange('phone', e.target.value)} />
            </Field>
            <Field label="Email">
                <input
                    className="field"
                    type="email"
                    value={party.email}
                    onChange={(e) => onChange('email', e.target.value)}
                />
            </Field>
        </div>
    );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
    return (
        <div className={`flex justify-between gap-3 ${strong ? 'border-t border-slate-200 pt-2 text-base font-semibold text-[#0b3d91]' : 'text-slate-600'}`}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}
