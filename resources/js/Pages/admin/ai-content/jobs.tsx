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
            <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                <p>
                    Driver atual: <strong>{queueDriver || 'n/d'}</strong>
                    {laravelQueue ? (
                        <>
                            {' '}
                            · Jobs Laravel pendentes: <strong>{laravelQueue.pending}</strong>
                            {' '}
                            · Falhas: <strong>{laravelQueue.failed}</strong>
                        </>
                    ) : null}
                </p>
                {workerHint ? (
                    <p className="mt-2 font-mono text-xs text-amber-50/90">
                        Sem worker os jobs ficam na tabela `jobs` e nada acontece. Corra:{' '}
                        <code className="rounded bg-black/30 px-1.5 py-0.5">{workerHint}</code>
                    </p>
                ) : (
                    <p className="mt-2 text-xs text-amber-50/80">
                        Com sync, os jobs correm no pedido HTTP. Com database/redis precisa de um worker separado.
                    </p>
                )}
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
                            <th className="px-4 py-3 text-left">Agente</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Progresso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.data.map((job: any) => (
                            <tr key={job.id} className="border-t border-white/5">
                                <td className="px-4 py-3 text-slate-400">{job.uuid.slice(0, 8)}</td>
                                <td className="px-4 py-3 text-white">{job.type}</td>
                                <td className="px-4 py-3 text-slate-400">{job.current_agent || '—'}</td>
                                <td className="px-4 py-3 text-slate-400">{job.status}</td>
                                <td className="px-4 py-3 text-slate-400">{job.progress}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AiContentLayout>
    );
}
