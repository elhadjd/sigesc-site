import React, { FormEvent } from 'react';
import { Link, useForm } from '@inertiajs/react';
import CareersAdminLayout from './Layout';

type JobForm = {
    id?: number;
    title: string;
    slug?: string;
    department?: string | null;
    location: string;
    employment_type: string;
    work_mode: string;
    status: string;
    summary?: string | null;
    description: string;
    requirements?: string | null;
    benefits?: string | null;
    salary_range?: string | null;
};

type Meta = {
    statuses: string[];
    employment_types: Record<string, string>;
    work_modes: Record<string, string>;
    status_labels: Record<string, string>;
};

const empty: JobForm = {
    title: '',
    department: '',
    location: 'Luanda, Angola',
    employment_type: 'full_time',
    work_mode: 'onsite',
    status: 'open',
    summary: '',
    description: '',
    requirements: '',
    benefits: '',
    salary_range: '',
};

export default function AdminCareersForm({
    job,
    meta,
}: {
    job: JobForm | null;
    meta: Meta;
}) {
    const editing = Boolean(job?.id);
    const form = useForm({
        ...empty,
        ...(job || {}),
        department: job?.department || '',
        summary: job?.summary || '',
        requirements: job?.requirements || '',
        benefits: job?.benefits || '',
        salary_range: job?.salary_range || '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (editing && job?.id) {
            form.put(`/admin/carreiras/${job.id}`);
        } else {
            form.post('/admin/carreiras');
        }
    };

    const field =
        'mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none ring-teal-400/30 focus:ring-2';

    return (
        <CareersAdminLayout title={editing ? 'Editar vaga' : 'Nova vaga'}>
            <form onSubmit={submit} className="max-w-3xl space-y-5">
                <label className="block text-sm">
                    <span className="text-slate-300">Título</span>
                    <input
                        className={field}
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        required
                    />
                    {form.errors.title && <span className="mt-1 block text-xs text-red-300">{form.errors.title}</span>}
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm">
                        <span className="text-slate-300">Departamento</span>
                        <input
                            className={field}
                            value={form.data.department || ''}
                            onChange={(e) => form.setData('department', e.target.value)}
                        />
                    </label>
                    <label className="block text-sm">
                        <span className="text-slate-300">Localização</span>
                        <input
                            className={field}
                            value={form.data.location}
                            onChange={(e) => form.setData('location', e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block text-sm">
                        <span className="text-slate-300">Tipo</span>
                        <select
                            className={field}
                            value={form.data.employment_type}
                            onChange={(e) => form.setData('employment_type', e.target.value)}
                        >
                            {Object.entries(meta.employment_types).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm">
                        <span className="text-slate-300">Modalidade</span>
                        <select
                            className={field}
                            value={form.data.work_mode}
                            onChange={(e) => form.setData('work_mode', e.target.value)}
                        >
                            {Object.entries(meta.work_modes).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm">
                        <span className="text-slate-300">Estado</span>
                        <select
                            className={field}
                            value={form.data.status}
                            onChange={(e) => form.setData('status', e.target.value)}
                        >
                            {meta.statuses.map((s) => (
                                <option key={s} value={s}>
                                    {meta.status_labels[s] || s}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <label className="block text-sm">
                    <span className="text-slate-300">Faixa salarial (opcional)</span>
                    <input
                        className={field}
                        value={form.data.salary_range || ''}
                        onChange={(e) => form.setData('salary_range', e.target.value)}
                        placeholder="Ex.: a combinar / 250.000–400.000 Kz"
                    />
                </label>

                <label className="block text-sm">
                    <span className="text-slate-300">Resumo curto</span>
                    <textarea
                        className={field}
                        rows={2}
                        value={form.data.summary || ''}
                        onChange={(e) => form.setData('summary', e.target.value)}
                    />
                </label>

                <label className="block text-sm">
                    <span className="text-slate-300">Descrição</span>
                    <textarea
                        className={field}
                        rows={8}
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        required
                        minLength={40}
                    />
                    {form.errors.description && (
                        <span className="mt-1 block text-xs text-red-300">{form.errors.description}</span>
                    )}
                </label>

                <label className="block text-sm">
                    <span className="text-slate-300">Requisitos</span>
                    <textarea
                        className={field}
                        rows={5}
                        value={form.data.requirements || ''}
                        onChange={(e) => form.setData('requirements', e.target.value)}
                    />
                </label>

                <label className="block text-sm">
                    <span className="text-slate-300">Benefícios</span>
                    <textarea
                        className={field}
                        rows={4}
                        value={form.data.benefits || ''}
                        onChange={(e) => form.setData('benefits', e.target.value)}
                    />
                </label>

                <div className="flex flex-wrap gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="rounded-lg bg-teal-400 px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
                    >
                        {form.processing ? 'A guardar…' : editing ? 'Guardar alterações' : 'Publicar vaga'}
                    </button>
                    <Link
                        href="/admin/carreiras"
                        className="rounded-lg border border-white/15 px-5 py-2.5 text-sm text-slate-200 hover:bg-white/5"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </CareersAdminLayout>
    );
}
