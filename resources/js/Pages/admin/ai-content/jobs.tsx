import React from 'react';
import AiContentLayout from './Layout';

export default function AiContentJobs({
    jobs,
    queueStats,
    queueDriver,
    laravelQueue,
    workerHint,
}: {
    jobs: any;
    queueStats: any;
    queueDriver?: string;
    laravelQueue?: { pending: number; failed: number };
    workerHint?: string | null;
}) {
    return (
        <AiContentLayout title="Filas da IA">
            <div className="mb-6 space-y-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                <p>
                    Esta tabela é o histórico <strong>ai_jobs</strong> (pipeline da IA). O driver Laravel{' '}
                    <strong>{queueDriver || 'n/d'}</strong> usa a tabela <code className="rounded bg-black/30 px-1">jobs</code> só
                    para executar o trabalho em background.
                </p>
                {laravelQueue ? (
                    <p>
                        Laravel pendentes: <strong>{laravelQueue.pending}</strong>
                        {' · '}
                        Falhas Laravel: <strong>{laravelQueue.failed}</strong>
                        {laravelQueue.pending === 0 ? (
                            <span className="text-amber-50/80"> — fila vazia (worker já consumiu ou nada por fazer).</span>
                        ) : null}
                    </p>
                ) : null}
                {workerHint ? (
                    <p className="font-mono text-xs text-amber-50/90">
                        Com QUEUE_CONNECTION=database, mantenha num terminal:{' '}
                        <code className="rounded bg-black/30 px-1.5 py-0.5">{workerHint}</code>
                    </p>
                ) : (
                    <p className="text-xs text-amber-50/80">
                        Com sync, o trabalho corre no pedido HTTP. Com database/redis precisa de worker.
                    </p>
                )}
                <p className="text-xs text-amber-50/80">
                    Se um artigo falhar no Writer (ex.: Tavily output_length inválido ou limite do plano), o artigo fica só com
                    título/fontes — use Reprocessar depois de corrigir a config. Valor válido:{' '}
                    <code className="rounded bg-black/30 px-1">TAVILY_RESEARCH_OUTPUT_LENGTH=short</code> (ou standard/long).
                </p>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                {Object.entries(queueStats).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase text-slate-500">{key}</p>
                        <p className="mt-1 font-serif text-2xl text-white">{value as number}</p>
                    </div>
                ))}
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-slate-400">
                        <tr>
                            <th className="px-4 py-3 text-left">UUID</th>
                            <th className="px-4 py-3 text-left">Tipo</th>
                            <th className="px-4 py-3 text-left">Artigo</th>
                            <th className="px-4 py-3 text-left">Agente</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Progresso</th>
                            <th className="px-4 py-3 text-left">Erro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.data.map((job: any) => (
                            <tr key={job.id} className="border-t border-white/5 align-top">
                                <td className="px-4 py-3 text-slate-400">{job.uuid.slice(0, 8)}</td>
                                <td className="px-4 py-3 text-white">{job.type}</td>
                                <td className="px-4 py-3 text-slate-300">
                                    {job.article?.title ? (
                                        <span className="line-clamp-2 max-w-[220px]">{job.article.title}</span>
                                    ) : (
                                        '—'
                                    )}
                                </td>
                                <td className="px-4 py-3 text-slate-400">{job.current_agent || '—'}</td>
                                <td className="px-4 py-3 text-slate-400">{job.status}</td>
                                <td className="px-4 py-3 text-slate-400">{job.progress}%</td>
                                <td className="px-4 py-3 text-rose-300/90">
                                    {job.error ? (
                                        <span className="line-clamp-3 max-w-[280px] text-xs" title={job.error}>
                                            {job.error}
                                        </span>
                                    ) : (
                                        '—'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AiContentLayout>
    );
}
