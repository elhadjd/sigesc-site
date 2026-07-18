import React from 'react';
import AiContentLayout from './Layout';

export default function AiContentJobs({ jobs, queueStats }: { jobs: any; queueStats: any }) {
    return (
        <AiContentLayout title="Filas da IA">
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
