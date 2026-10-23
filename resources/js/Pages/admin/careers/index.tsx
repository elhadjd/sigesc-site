import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import CareersAdminLayout from './Layout';

type Job = {
    id: number;
    title: string;
    slug: string;
    department?: string | null;
    location?: string | null;
    status: string;
    status_label: string;
    employment_type_label: string;
    work_mode_label: string;
    applications_count: number;
    updated_at?: string | null;
};

type Application = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    created_at?: string | null;
    job?: { id: number; title: string; slug: string } | null;
};

const statusTone: Record<string, string> = {
    open: 'bg-teal-500/15 text-teal-200',
    paused: 'bg-amber-500/15 text-amber-200',
    closed: 'bg-slate-500/20 text-slate-300',
};

export default function AdminCareersIndex({
    jobs,
    recentApplications,
    filters,
    meta,
    flash,
}: {
    jobs: Job[];
    recentApplications: Application[];
    filters: { status: string; search: string };
    meta: {
        statuses: string[];
        notify_email?: string;
    };
    flash?: { success?: string | null; error?: string | null };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const applyFilters = () => {
        router.get('/admin/carreiras', { search, status }, { preserveState: true });
    };

    const act = (path: string, method: 'post' | 'delete' = 'post') => {
        if (method === 'delete' && !window.confirm('Eliminar esta vaga e as candidaturas associadas?')) {
            return;
        }
        router[method](path);
    };

    return (
        <CareersAdminLayout title="Vagas de emprego">
            {flash?.success && (
                <p className="mb-4 rounded-lg bg-teal-500/15 px-3 py-2 text-sm text-teal-100">{flash.success}</p>
            )}
            {flash?.error && (
                <p className="mb-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">{flash.error}</p>
            )}

            <div className="mb-6 flex flex-wrap items-center gap-3">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Pesquisar título, departamento…"
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                >
                    <option value="all">Todos os estados</option>
                    {meta.statuses.map((s) => (
                        <option key={s} value={s}>
                            {s === 'open' ? 'Aberta' : s === 'paused' ? 'Pausada' : 'Fechada'}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={applyFilters}
                    className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-black"
                >
                    Filtrar
                </button>
                <Link
                    href="/admin/carreiras/nova"
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
                >
                    Criar vaga
                </Link>
            </div>

            {meta.notify_email && (
                <p className="mb-6 text-xs text-slate-400">
                    Candidaturas notificadas para o e-mail do produtor: {meta.notify_email}
                </p>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Vaga</th>
                            <th className="hidden px-4 py-3 font-medium sm:table-cell">Estado</th>
                            <th className="hidden px-4 py-3 font-medium md:table-cell">Candidaturas</th>
                            <th className="px-4 py-3 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                                    Ainda não há vagas. Crie a primeira.
                                </td>
                            </tr>
                        )}
                        {jobs.map((job) => (
                            <tr key={job.id} className="align-top hover:bg-white/[0.03]">
                                <td className="px-4 py-4">
                                    <Link
                                        href={`/carreiras/${job.slug}`}
                                        className="font-medium text-white hover:text-teal-200"
                                    >
                                        {job.title}
                                    </Link>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {[job.department, job.location, job.employment_type_label]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </p>
                                    <span
                                        className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium sm:hidden ${
                                            statusTone[job.status] || statusTone.closed
                                        }`}
                                    >
                                        {job.status_label}
                                    </span>
                                </td>
                                <td className="hidden px-4 py-4 sm:table-cell">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                            statusTone[job.status] || statusTone.closed
                                        }`}
                                    >
                                        {job.status_label}
                                    </span>
                                </td>
                                <td className="hidden px-4 py-4 md:table-cell">{job.applications_count}</td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={`/admin/carreiras/${job.id}/editar`}
                                            className="rounded-md bg-white/10 px-2.5 py-1.5 text-xs hover:bg-white/15"
                                        >
                                            Editar
                                        </Link>
                                        {job.status !== 'paused' && job.status !== 'closed' && (
                                            <button
                                                type="button"
                                                onClick={() => act(`/admin/carreiras/${job.id}/pausar`)}
                                                className="rounded-md bg-amber-500/20 px-2.5 py-1.5 text-xs text-amber-100 hover:bg-amber-500/30"
                                            >
                                                Pausar
                                            </button>
                                        )}
                                        {job.status !== 'closed' && (
                                            <button
                                                type="button"
                                                onClick={() => act(`/admin/carreiras/${job.id}/fechar`)}
                                                className="rounded-md bg-slate-500/25 px-2.5 py-1.5 text-xs hover:bg-slate-500/35"
                                            >
                                                Fechar
                                            </button>
                                        )}
                                        {job.status !== 'open' && (
                                            <button
                                                type="button"
                                                onClick={() => act(`/admin/carreiras/${job.id}/reabrir`)}
                                                className="rounded-md bg-teal-500/20 px-2.5 py-1.5 text-xs text-teal-100 hover:bg-teal-500/30"
                                            >
                                                Reabrir
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => act(`/admin/carreiras/${job.id}`, 'delete')}
                                            className="rounded-md bg-red-500/20 px-2.5 py-1.5 text-xs text-red-200 hover:bg-red-500/30"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <section className="mt-10">
                <h3 className="mb-4 font-serif text-xl text-white">Candidaturas recentes</h3>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                    <ul className="divide-y divide-white/10">
                        {recentApplications.length === 0 && (
                            <li className="px-4 py-8 text-center text-sm text-slate-400">
                                Ainda sem candidaturas.
                            </li>
                        )}
                        {recentApplications.map((app) => (
                            <li key={app.id} className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-medium text-white">{app.name}</p>
                                    <p className="text-sm text-slate-400">
                                        <a href={`mailto:${app.email}`} className="hover:text-teal-200">
                                            {app.email}
                                        </a>
                                        {app.phone ? ` · ${app.phone}` : ''}
                                    </p>
                                </div>
                                <div className="text-sm text-slate-400">
                                    {app.job ? (
                                        <Link href={`/carreiras/${app.job.slug}`} className="hover:text-teal-200">
                                            {app.job.title}
                                        </Link>
                                    ) : (
                                        '—'
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </CareersAdminLayout>
    );
}
