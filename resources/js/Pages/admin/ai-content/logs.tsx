import React from 'react';
import AiContentLayout from './Layout';

export default function AiContentLogs({ logs }: { logs: any }) {
    return (
        <AiContentLayout title="Logs">
            <ul className="space-y-3">
                {logs.data.map((log: any) => (
                    <li key={log.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm text-white">{log.message}</p>
                            <span className="text-xs uppercase text-slate-500">{log.level}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            {log.agent || 'system'}
                            {log.article ? ` · ${log.article.title}` : ''}
                            {' · '}
                            {new Date(log.created_at).toLocaleString('pt-AO')}
                        </p>
                    </li>
                ))}
            </ul>
        </AiContentLayout>
    );
}
