import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AiContentLayout from './Layout';

export default function AiContentArticles({
    articles,
    filters,
    statuses,
}: {
    articles: any;
    filters: { status: string; search: string };
    statuses: string[];
}) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    const apply = () => {
        router.get('/admin/ai-content/articles', { search, status }, { preserveState: true });
    };

    return (
        <AiContentLayout title="Artigos">
            <div className="mb-6 flex flex-wrap gap-3">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar título ou keyword"
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                >
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={apply}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black"
                >
                    Filtrar
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400">
                        <tr>
                            <th className="px-4 py-3">Título</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">SEO</th>
                            <th className="px-4 py-3">Confiança</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.data.map((article: any) => (
                            <tr key={article.id} className="border-t border-white/5">
                                <td className="px-4 py-3 text-white">{article.title}</td>
                                <td className="px-4 py-3 text-slate-400">{article.status}</td>
                                <td className="px-4 py-3 text-slate-400">{article.seo_score ?? '—'}</td>
                                <td className="px-4 py-3 text-slate-400">{article.fact_confidence ?? '—'}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/ai-content/articles/${article.id}`}
                                        className="text-amber-300 hover:underline"
                                    >
                                        Abrir
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AiContentLayout>
    );
}
