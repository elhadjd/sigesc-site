import React, { useState } from 'react';
import { Api } from '@/axiosConfig';
import AiContentLayout from './Layout';

type Settings = {
    tavily_enabled: boolean;
    news_enabled: boolean;
    internal_knowledge_enabled: boolean;
    max_sources: number;
    min_trust_score: number;
    cache_days: number;
};

type Source = {
    id: number;
    name: string;
    url?: string;
    domain?: string;
    category?: string;
    priority?: number;
    country?: string;
    trust_score?: number;
    is_active: boolean;
};

type LogRow = {
    id: number;
    agent: string;
    action: string;
    provider?: string;
    status: string;
    execution_time_ms: number;
    error?: string;
    created_at: string;
};

export default function ResearchSettingsPage({
    settings,
    sources,
    recentLogs,
}: {
    settings: Settings;
    sources: Source[];
    recentLogs: LogRow[];
    defaults: Partial<Settings>;
}) {
    const [form, setForm] = useState({
        tavily_enabled: !!settings.tavily_enabled,
        news_enabled: !!settings.news_enabled,
        internal_knowledge_enabled: !!settings.internal_knowledge_enabled,
        max_sources: Number(settings.max_sources ?? 12),
        min_trust_score: Number(settings.min_trust_score ?? 50),
        cache_days: Number(settings.cache_days ?? 30),
    });
    const [sourceRows, setSourceRows] = useState(sources);
    const [busy, setBusy] = useState(false);
    const [flash, setFlash] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
    const [filter, setFilter] = useState('');

    const filteredSources = sourceRows.filter((s) => {
        if (!filter.trim()) return true;
        const q = filter.toLowerCase();
        return (
            s.name.toLowerCase().includes(q) ||
            (s.domain || '').toLowerCase().includes(q) ||
            (s.category || '').toLowerCase().includes(q)
        );
    });

    const saveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setBusy(true);
        setFlash(null);
        try {
            const { data } = await Api.put('/admin/ai-content/research-settings', form);
            setFlash({ type: 'ok', text: data.message || 'Settings guardadas.' });
        } catch (error: any) {
            setFlash({
                type: 'error',
                text: error?.response?.data?.message || error?.message || 'Falha ao guardar.',
            });
        } finally {
            setBusy(false);
        }
    };

    const toggleSource = async (source: Source) => {
        try {
            const { data } = await Api.put(`/admin/ai-content/research-sources/${source.id}`, {
                is_active: !source.is_active,
            });
            setSourceRows((rows) =>
                rows.map((row) =>
                    row.id === source.id ? { ...row, is_active: !source.is_active } : row
                )
            );
            setFlash({ type: 'ok', text: data.message || 'Fonte atualizada.' });
        } catch (error: any) {
            setFlash({
                type: 'error',
                text: error?.response?.data?.message || error?.message || 'Falha ao atualizar fonte.',
            });
        }
    };

    return (
        <AiContentLayout title="Research Engine Settings">
            <p className="mb-6 max-w-2xl text-sm text-slate-400">
                Configura o Hybrid Research Engine. A pesquisa web usa Tavily AI; fontes oficiais
                angolanas mantêm prioridade máxima no ranking de confiança.
            </p>

            {flash && (
                <div
                    className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                        flash.type === 'ok'
                            ? 'bg-emerald-500/15 text-emerald-200'
                            : 'bg-rose-500/15 text-rose-200'
                    }`}
                >
                    {flash.text}
                </div>
            )}

            <form
                onSubmit={saveSettings}
                className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
                <h3 className="mb-4 text-lg text-white">Parâmetros do motor</h3>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex items-center gap-3 text-sm text-slate-200">
                        <input
                            type="checkbox"
                            checked={form.tavily_enabled}
                            onChange={(e) => setForm((f) => ({ ...f, tavily_enabled: e.target.checked }))}
                            className="h-4 w-4 rounded border-white/20 bg-transparent"
                        />
                        Ativar Tavily AI (pesquisa web principal)
                    </label>

                    <label className="flex items-center gap-3 text-sm text-slate-200">
                        <input
                            type="checkbox"
                            checked={form.news_enabled}
                            onChange={(e) => setForm((f) => ({ ...f, news_enabled: e.target.checked }))}
                            className="h-4 w-4 rounded border-white/20 bg-transparent"
                        />
                        Ativar pesquisa de notícias
                    </label>

                    <label className="flex items-center gap-3 text-sm text-slate-200 sm:col-span-2">
                        <input
                            type="checkbox"
                            checked={form.internal_knowledge_enabled}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, internal_knowledge_enabled: e.target.checked }))
                            }
                            className="h-4 w-4 rounded border-white/20 bg-transparent"
                        />
                        Usar base de conhecimento interna (blog + artigos)
                    </label>

                    <label className="block text-sm text-slate-300">
                        Máximo de fontes
                        <input
                            type="number"
                            min={1}
                            max={40}
                            value={form.max_sources}
                            onChange={(e) => setForm((f) => ({ ...f, max_sources: Number(e.target.value) }))}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        Score mínimo permitido
                        <input
                            type="number"
                            min={0}
                            max={100}
                            value={form.min_trust_score}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, min_trust_score: Number(e.target.value) }))
                            }
                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                        />
                    </label>

                    <label className="block text-sm text-slate-300 sm:col-span-2">
                        Tempo de cache (dias)
                        <input
                            type="number"
                            min={1}
                            max={365}
                            value={form.cache_days}
                            onChange={(e) => setForm((f) => ({ ...f, cache_days: Number(e.target.value) }))}
                            className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                        />
                        <span className="mt-1 block text-xs text-slate-500">
                            RESEARCH_CACHE_DAYS — evita repetir pesquisas recentes (ex.: IVA Angola
                            2026).
                        </span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={busy}
                    className="mt-6 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:opacity-60"
                >
                    {busy ? 'A guardar…' : 'Guardar definições'}
                </button>
            </form>

            <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg text-white">Fontes oficiais ativas</h3>
                    <input
                        type="search"
                        placeholder="Filtrar fontes…"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-2 py-2">Fonte</th>
                                <th className="px-2 py-2">Categoria</th>
                                <th className="px-2 py-2">Prioridade</th>
                                <th className="px-2 py-2">Trust</th>
                                <th className="px-2 py-2">País</th>
                                <th className="px-2 py-2">Ativa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSources.map((source) => (
                                <tr key={source.id} className="border-t border-white/5">
                                    <td className="px-2 py-3">
                                        <p className="text-white">{source.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {source.domain || source.url}
                                        </p>
                                    </td>
                                    <td className="px-2 py-3 text-slate-300">
                                        {source.category || '—'}
                                    </td>
                                    <td className="px-2 py-3 text-slate-300">
                                        {source.priority ?? '—'}
                                    </td>
                                    <td className="px-2 py-3 text-amber-200">
                                        {source.trust_score ?? '—'}
                                    </td>
                                    <td className="px-2 py-3 text-slate-300">
                                        {source.country || '—'}
                                    </td>
                                    <td className="px-2 py-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleSource(source)}
                                            className={`rounded px-2 py-1 text-xs font-medium ${
                                                source.is_active
                                                    ? 'bg-emerald-500/20 text-emerald-300'
                                                    : 'bg-slate-500/20 text-slate-400'
                                            }`}
                                        >
                                            {source.is_active ? 'Ativa' : 'Off'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="mb-4 text-lg text-white">Research logs recentes</h3>
                <ul className="space-y-2 text-sm">
                    {recentLogs.length === 0 ? (
                        <li className="text-slate-500">Sem logs ainda.</li>
                    ) : (
                        recentLogs.map((log) => (
                            <li
                                key={log.id}
                                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 py-2"
                            >
                                <span className="text-slate-300">
                                    {log.agent} · {log.action}
                                    {log.provider ? ` · ${log.provider}` : ''}
                                </span>
                                <span
                                    className={
                                        log.status === 'ok' ? 'text-emerald-300' : 'text-rose-300'
                                    }
                                >
                                    {log.status} · {log.execution_time_ms}ms
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            </section>
        </AiContentLayout>
    );
}
