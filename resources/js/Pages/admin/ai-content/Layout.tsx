import React, { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';

const nav = [
    { href: '/admin/ai-content', label: 'Dashboard', routeName: 'admin.ai-content.dashboard' },
    { href: '/admin/ai-content/articles', label: 'Artigos', routeName: 'admin.ai-content.articles' },
    { href: '/admin/ai-content/jobs', label: 'Processamentos', routeName: 'admin.ai-content.jobs' },
    { href: '/admin/ai-content/logs', label: 'Logs', routeName: 'admin.ai-content.logs' },
    { href: '/admin/ai-content/research-settings', label: 'Research Engine', routeName: 'admin.ai-content.research-settings' },
    { href: '/admin/ai-content/expert', label: 'Especialista', routeName: 'admin.ai-content.expert' },
];

export default function AiContentLayout({ title, children }: PropsWithChildren<{ title: string }>) {
    const url = usePage().url;

    return (
        <div className="min-h-screen bg-[#0f1419] text-slate-100">
            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8">
                <aside className="hidden w-56 shrink-0 md:block">
                    <div className="sticky top-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                            SIGESC
                        </p>
                        <h1 className="mt-2 font-serif text-2xl text-white">AI Content Engine</h1>
                        <nav className="mt-8 space-y-1">
                            {nav.map((item) => {
                                const active = url === item.href || url.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                                            active
                                                ? 'bg-amber-500/15 text-amber-200'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>
                <main className="min-w-0 flex-1">
                    <header className="mb-8 border-b border-white/10 pb-4">
                        <h2 className="font-serif text-3xl text-white">{title}</h2>
                    </header>
                    {children}
                </main>
            </div>
        </div>
    );
}
