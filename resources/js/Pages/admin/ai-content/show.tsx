import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Api } from '@/axiosConfig';
import AiContentLayout from './Layout';

export default function AiContentShow({ article }: { article: any }) {
    const [scheduledAt, setScheduledAt] = useState('');
    const [busy, setBusy] = useState<string | null>(null);
    const [flash, setFlash] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

    const runAction = async (key: string, request: () => Promise<{ data: any }>) => {
        if (busy) {
            return;
        }

        setBusy(key);
        setFlash(null);

        try {
            const { data } = await request();
            setFlash({ type: 'ok', text: data.message || 'Operação concluída.' });
        } catch (error: any) {
            setFlash({
                type: 'error',
                text: error?.response?.data?.message || error?.message || 'Falha na operação.',
            });
        } finally {
            setBusy(null);
        }
    };

    return (
        <AiContentLayout title={article.title}>
            <div className="mb-6 flex flex-wrap gap-3">
                <button
                    type="button"
                    disabled={!!busy}
                    onClick={() =>
                        runAction('process', () => Api.post(`/admin/ai-content/articles/${article.id}/process`))
                    }
                    className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50"
                >
                    {busy === 'process' ? 'A enviar…' : 'Reprocessar pipeline'}
                </button>
                <button
                    type="button"
                    disabled={!!busy}
                    onClick={() =>
                        runAction('approve', () => Api.post(`/admin/ai-content/articles/${article.id}/approve`))
                    }
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
                >
                    {busy === 'approve' ? 'A publicar…' : 'Aprovar e publicar'}
                </button>
                <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                />
                <button
                    type="button"
                    disabled={!scheduledAt || !!busy}
                    onClick={() =>
                        runAction('schedule', () =>
                            Api.post(`/admin/ai-content/articles/${article.id}/schedule`, {
                                scheduled_at: scheduledAt,
                            })
                        )
                    }
                    className="rounded-lg bg-sky-500/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                >
                    {busy === 'schedule' ? 'A agendar…' : 'Agendar'}
                </button>
                {article.post_id && (
                    <Link
                        href={`/blog/posts/${article.slug}`}
                        className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200"
                    >
                        Ver no blog
                    </Link>
                )}
            </div>

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

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-sm text-slate-400">{article.excerpt}</p>
                    <div
                        className="prose prose-invert mt-6 max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content_html || '' }}
                    />
                </section>
                <aside className="space-y-4">
                    <MetaCard title="Estado" value={article.status} />
                    <MetaCard title="SEO score" value={article.seo_score ?? '—'} />
                    <MetaCard title="Fact confidence" value={article.fact_confidence ?? '—'} />
                    <MetaCard title="Focus keyword" value={article.focus_keyword || '—'} />
                    <MetaCard title="Needs review" value={article.needs_human_review ? 'Sim' : 'Não'} />

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <h3 className="mb-2 text-sm text-slate-400">Fontes</h3>
                        <ul className="space-y-2 text-sm">
                            {(article.sources || []).map((s: any) => (
                                <li key={s.id}>
                                    <a href={s.url} target="_blank" rel="noreferrer" className="text-amber-200">
                                        {s.title || s.url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <h3 className="mb-2 text-sm text-slate-400">Social</h3>
                        <pre className="overflow-auto text-xs text-slate-300">
                            {JSON.stringify(article.social_posts || {}, null, 2)}
                        </pre>
                    </div>
                </aside>
            </div>
        </AiContentLayout>
    );
}

function MetaCard({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">{title}</p>
            <p className="mt-1 text-sm text-white">{value}</p>
        </div>
    );
}
