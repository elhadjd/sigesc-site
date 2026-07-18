import React from 'react';
import AiContentLayout from './Layout';

const statusLabel: Record<string, string> = {
    pending: 'Em espera',
    running: 'A processar',
    failed: 'Falhou',
    completed: 'Concluído',
};

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
        <AiContentLayout title="Processamentos">
            <div className="mb-6 space-y-3 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm text-sky-50">
                <p>
                    Aqui vê o estado dos processamentos da IA (artigos, pipeline diário e perguntas ao especialista).
                </p>
                {laravelQueue ? (
                    <p>
                        Em segundo plano agora: <strong>{laravelQueue.pending}</strong>
                        {laravelQueue.failed > 0 ? (
                            <>
                                {' · '}
                                falhas técnicas: <strong>{laravelQueue.failed}</strong>
                            </>
                        ) : null}
                        {laravelQueue.pending === 0 ? (
                            <span className="text-sky-100/80"> — nada à espera; o trabalhador já consumiu a lista.</span>
                        ) : (
                            <span className="text-sky-100/80"> — a serem tratados pelo trabalhador em segundo plano.</span>
                        )}
                    </p>
                ) : null}
                {workerHint ? (
                    <p className="text-xs text-sky-100/85">
                        Para o segundo plano funcionar com driver <strong>{queueDriver}</strong>, mantenha num terminal:{' '}
                        <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono">{workerHint}</code>
                    </p>
                ) : (
                    <p className="text-xs text-sky-100/80">
                        Modo atual ({queueDriver || 'n/d'}): o processamento corre no próprio pedido HTTP.
                    </p>
                )}
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                {Object.entries(queueStats).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs uppercase text-slate-500">{statusLabel[key] || key}</p>
                        <p className="mt-1 font-serif text-2xl text-white">{value as number}</p>
                    </div>
                ))}
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-slate-400">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Tipo</th>
                            <th className="px-4 py-3 text-left">Artigo</th>
                            <th className="px-4 py-3 text-left">Etapa</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Progresso</th>
                            <th className="px-4 py-3 text-left">Detalhe</th>
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
                                <td className="px-4 py-3 text-slate-400">{statusLabel[job.status] || job.status}</td>
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
