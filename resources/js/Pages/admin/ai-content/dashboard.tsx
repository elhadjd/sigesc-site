import React from 'react';
import { Link, router } from '@inertiajs/react';
import AiContentLayout from './Layout';

type Stats = {
    total: number;
    published: number;
    needs_review: number;
    scheduled: number;
    failed: number;
    avg_seo: number;
    jobs_running: number;
    jobs_failed: number;
    expert_questions: number;
    views: number;
};

type Article = {
    id: number;
    title: string;
    status: string;
    seo_score?: number;
    category?: { name: string };
};

export default function AiContentDashboard({
    stats,
    recentArticles,
    recentJobs,
    recentLogs,
    categories,
    config,
}: {
    stats: Stats;
    recentArticles: Article[];
    recentJobs: any[];
    recentLogs: any[];
    categories: { name: string; articles_count: number }[];
    config: {
        auto_publish: boolean;
        topics_per_day: number;
        enabled: boolean;
        llm_provider?: string | null;
        llm_ready?: boolean;
        tavily_ready?: boolean;
        openai_ready?: boolean;
    };
}) {
    const cards = [
        { label: 'Artigos', value: stats.total },
        { label: 'Publicados', value: stats.published },
        { label: 'Em revisão', value: stats.needs_review },
        { label: 'Agendados', value: stats.scheduled },
        { label: 'SEO médio', value: stats.avg_seo },
        { label: 'Filas ativas', value: stats.jobs_running },
        { label: 'Falhas', value: stats.failed + stats.jobs_failed },
        { label: 'Visitas', value: stats.views },
    ];

    return (
        <AiContentLayout title="Painel operacional">
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    onClick={() => router.post('/admin/ai-content/run-daily')}
                    disabled={!config.llm_ready}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Correr pipeline diário
                </button>
                <span className="text-sm text-slate-400">
                    Engine {config.enabled ? 'ativa' : 'desligada'} · {config.topics_per_day} temas/dia ·
                    auto-publish {config.auto_publish ? 'on' : 'off'} · LLM{' '}
                    {config.llm_provider ?? 'não configurado'}
                </span>
            </div>

            <div className="mb-6 flex flex-wrap gap-2 text-xs">
                <span className={`rounded-full px-3 py-1 ${config.tavily_ready ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    Tavily {config.tavily_ready ? 'ok' : 'falta TAVILY_API_KEY'}
                </span>
                <span className={`rounded-full px-3 py-1 ${config.openai_ready ? 'bg-slate-500/20 text-slate-300' : 'bg-slate-700/40 text-slate-500'}`}>
                    OpenAI {config.openai_ready ? 'opcional ativa' : 'opcional (não necessária)'}
                </span>
                {!config.llm_ready && (
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-200">
                        Defina TAVILY_API_KEY no .env para correr o pipeline
                    </span>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                        <p className="mt-2 font-serif text-3xl text-white">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg text-white">Artigos recentes</h3>
                        <Link href="/admin/ai-content/articles" className="text-sm text-amber-300">
                            Ver todos
                        </Link>
                    </div>
                    <ul className="space-y-3">
                        {recentArticles.map((article) => (
                            <li key={article.id}>
                                <Link
                                    href={`/admin/ai-content/articles/${article.id}`}
                                    className="block rounded-lg px-2 py-2 hover:bg-white/5"
                                >
                                    <p className="text-sm text-white">{article.title}</p>
                                    <p className="text-xs text-slate-400">
                                        {article.status}
                                        {article.category ? ` · ${article.category.name}` : ''}
                                        {article.seo_score != null ? ` · SEO ${article.seo_score}` : ''}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="mb-4 text-lg text-white">Categorias</h3>
                    <ul className="space-y-2">
                        {categories.map((cat) => (
                            <li key={cat.name} className="flex justify-between text-sm">
                                <span className="text-slate-300">{cat.name}</span>
                                <span className="text-slate-500">{cat.articles_count}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="mb-4 text-lg text-white">Jobs IA</h3>
                    <ul className="space-y-2 text-sm">
                        {recentJobs.map((job) => (
                            <li key={job.id} className="flex justify-between gap-3 border-b border-white/5 py-2">
                                <span className="text-slate-300">{job.type}</span>
                                <span className="text-slate-500">{job.status} · {job.progress}%</span>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <h3 className="mb-4 text-lg text-white">Logs</h3>
                    <ul className="space-y-2 text-sm">
                        {recentLogs.map((log) => (
                            <li key={log.id} className="border-b border-white/5 py-2">
                                <p className="text-slate-300">{log.message}</p>
                                <p className="text-xs text-slate-500">
                                    {log.agent || 'system'} · {log.level}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </AiContentLayout>
    );
}
