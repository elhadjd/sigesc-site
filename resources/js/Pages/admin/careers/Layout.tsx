import React, { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';

const nav = [
    { href: '/admin/carreiras', label: 'Vagas', exact: true },
    { href: '/admin/carreiras/nova', label: 'Nova vaga' },
    { href: '/carreiras', label: 'Ver página pública' },
    { href: '/admin/ai-content', label: 'AI Content' },
];

export default function CareersAdminLayout({
    title,
    children,
}: PropsWithChildren<{ title: string }>) {
    const url = usePage().url;

    return (
        <div className="min-h-screen bg-[#0a1614] text-slate-100">
            <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8">
                <aside className="hidden w-56 shrink-0 md:block">
                    <div className="sticky top-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400/90">
                            SIGESC
                        </p>
                        <h1 className="mt-2 font-serif text-2xl text-white">Carreiras</h1>
                        <nav className="mt-8 space-y-1">
                            {nav.map((item) => {
                                const active = item.exact
                                    ? url === item.href || url.startsWith('/admin/carreiras?')
                                    : url === item.href || url.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                                            active
                                                ? 'bg-teal-500/15 text-teal-200'
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
