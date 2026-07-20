import React, { useMemo, useState } from 'react';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

type Template = {
    slug: string;
    title: string;
    level: string;
    category: string;
    style: string;
    description: string;
    features: string[];
    level_label?: string;
    category_label?: string;
    preview_url: string;
    download_url: string;
};

type LevelMeta = Record<string, { label: string; description: string }>;

export default function InvoiceTemplatesIndex({
    auth,
    seo,
    templates,
    levels,
    categories,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    templates: Template[];
    levels: LevelMeta;
    categories: Record<string, string>;
}) {
    const [level, setLevel] = useState<string>('all');
    const [category, setCategory] = useState<string>('all');
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return templates.filter((item) => {
            if (level !== 'all' && item.level !== level) return false;
            if (category !== 'all' && item.category !== category) return false;
            if (!q) return true;
            const hay = `${item.title} ${item.description} ${item.features.join(' ')}`.toLowerCase();
            return hay.includes(q);
        });
    }, [templates, level, category, query]);

    const counts = useMemo(() => {
        return {
            basico: templates.filter((t) => t.level === 'basico').length,
            intermedio: templates.filter((t) => t.level === 'intermedio').length,
            avancado: templates.filter((t) => t.level === 'avancado').length,
        };
    }, [templates]);

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="Modelos de Fatura Gratuitos Angola | Factura, Recibo e Proforma"
                />
                <HeaderComponent auth={auth as any} />
                <main className="bg-[#f3f0ea]">
                    <section className="relative overflow-hidden border-b border-black/5">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,#c9d7f0,transparent_38%),radial-gradient(circle_at_88%_10%,#e8c9a0,transparent_32%)]" />
                        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3d91]">
                                SIGESC · Biblioteca gratuita
                            </p>
                            <h1 className="mt-3 max-w-4xl font-serif text-4xl text-[#14213d] sm:text-5xl">
                                Modelos de fatura gratuitos Angola
                            </h1>
                            <p className="mt-4 max-w-2xl text-lg text-slate-600">
                                {templates.length} modelos de factura, factura-recibo, proforma, recibo e orçamento —
                                do básico ao avançado AGT. Descarregue, edite e imprima em PDF.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-700">
                                <div>
                                    <p className="font-serif text-3xl text-[#0b3d91]">{counts.basico}</p>
                                    <p>Básicos</p>
                                </div>
                                <div>
                                    <p className="font-serif text-3xl text-[#0b3d91]">{counts.intermedio}</p>
                                    <p>Intermédios</p>
                                </div>
                                <div>
                                    <p className="font-serif text-3xl text-[#0b3d91]">{counts.avancado}</p>
                                    <p>Avançados</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                        <div className="flex flex-col gap-4 rounded-3xl bg-white/80 p-4 ring-1 ring-black/5 sm:flex-row sm:items-center">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Pesquisar: IVA, AGT, recibo, proforma…"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none ring-[#0b3d91] focus:ring-2"
                            />
                            <select
                                value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            >
                                <option value="all">Todos os níveis</option>
                                {Object.entries(levels).map(([key, meta]) => (
                                    <option key={key} value={key}>
                                        {meta.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                            >
                                <option value="all">Todas as categorias</option>
                                {Object.entries(categories).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((item) => (
                                <article
                                    key={item.slug}
                                    className="flex flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="rounded-full bg-[#e8eef8] px-3 py-1 text-xs font-semibold text-[#0b3d91]">
                                            {item.level_label || item.level}
                                        </span>
                                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            {item.category_label || item.category}
                                        </span>
                                    </div>
                                    <h2 className="mt-4 font-serif text-xl text-[#14213d]">{item.title}</h2>
                                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                                        {item.description}
                                    </p>
                                    <ul className="mt-4 space-y-1 text-xs text-slate-500">
                                        {item.features.slice(0, 3).map((feature) => (
                                            <li key={feature}>· {feature}</li>
                                        ))}
                                    </ul>
                                    <div className="mt-5 flex gap-2">
                                        <a
                                            href={item.preview_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 rounded-xl bg-[#0b3d91] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0a347c]"
                                        >
                                            Ver modelo
                                        </a>
                                        <a
                                            href={item.download_url}
                                            className="flex-1 rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#0b3d91] ring-1 ring-[#0b3d91]/50 hover:bg-[#e8eef8]"
                                        >
                                            Descarregar
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <p className="mt-10 text-center text-slate-600">
                                Nenhum modelo encontrado com esses filtros.
                            </p>
                        )}

                        <div className="mt-14 max-w-3xl space-y-4 text-slate-700">
                            <h2 className="font-serif text-2xl text-[#14213d]">
                                Como usar os modelos de fatura
                            </h2>
                            <p className="text-sm leading-relaxed">
                                Abra o modelo, substitua os dados de exemplo (empresa, NIF, cliente, itens) e use
                                Imprimir → Guardar como PDF. Para emitir documentos fiscais oficiais junto da AGT,
                                use o software de faturação SIGESC.
                            </p>
                            <p className="text-sm">
                                Relacionado:{' '}
                                <a href="/calculadoras" className="font-medium text-[#0b3d91] underline">
                                    calculadoras de IVA
                                </a>{' '}
                                ·{' '}
                                <a href="/pergunte-ao-especialista" className="font-medium text-[#0b3d91] underline">
                                    pergunte ao especialista
                                </a>
                                .
                            </p>
                        </div>
                    </section>
                </main>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
