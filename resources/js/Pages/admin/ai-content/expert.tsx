import React from 'react';
import { Link } from '@inertiajs/react';
import AiContentLayout from './Layout';

export default function AiContentExpert({ questions }: { questions: any }) {
    return (
        <AiContentLayout title="Pergunte ao Especialista">
            <ul className="space-y-3">
                {questions.data.map((q: any) => (
                    <li key={q.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-white">{q.question}</p>
                        <p className="mt-2 text-xs text-slate-500">
                            {q.status} · qualidade {q.quality_score ?? '—'}
                            {q.article ? (
                                <>
                                    {' · '}
                                    <Link
                                        href={`/admin/ai-content/articles/${q.article.id}`}
                                        className="text-amber-300"
                                    >
                                        artigo gerado
                                    </Link>
                                </>
                            ) : null}
                        </p>
                    </li>
                ))}
            </ul>
        </AiContentLayout>
    );
}
