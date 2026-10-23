import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';
import type { CareerJob } from './index';

function Paragraphs({ text }: { text?: string | null }) {
    if (!text) return null;
    return (
        <div className="space-y-3 text-[15px] leading-relaxed text-teal-50/85 whitespace-pre-wrap">
            {text}
        </div>
    );
}

export default function CareersShow({
    auth,
    seo,
    job,
    canManageCareers,
    flash,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    job: CareerJob;
    canManageCareers?: boolean;
    flash?: { success?: string | null; error?: string | null };
}) {
    const [ready, setReady] = useState(false);
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        portfolio_url: '',
        cover_letter: '',
    });

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setReady(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        form.post(`/carreiras/${job.slug}/candidatar`, { preserveScroll: true });
    };

    const open = job.status === 'open';

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle={`${job.title} | Carreiras SIGESC`}
                    fallbackDescription={job.summary || job.description.slice(0, 150)}
                />
                <HeaderComponent auth={auth as any} />

                <main className="careers-page bg-[#06241f] text-white">
                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');
                        .careers-page { font-family: Manrope, sans-serif; }
                        .careers-page .display { font-family: Fraunces, Georgia, serif; }
                    `}</style>

                    <section className="relative overflow-hidden border-b border-teal-900/50">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(115deg, rgba(6,36,31,.95) 0%, rgba(6,36,31,.82) 50%, rgba(6,36,31,.55) 100%), url('/img/dashboard-sigesc-angola.png')",
                            }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(45,212,191,.22),transparent_40%)]" />

                        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                            >
                                <Link href="/carreiras" className="text-sm font-medium text-teal-300 hover:text-teal-200">
                                    ← Todas as vagas
                                </Link>
                                <p className="display mt-6 text-4xl tracking-[0.06em] text-teal-200 sm:text-5xl">SIGESC</p>
                                {job.department && (
                                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-teal-300/90">
                                        {job.department}
                                    </p>
                                )}
                                <h1 className="display mt-2 max-w-3xl text-3xl leading-tight text-white sm:text-5xl">
                                    {job.title}
                                </h1>
                                <p className="mt-4 max-w-2xl text-base text-teal-50/80 sm:text-lg">
                                    {[job.location, job.employment_type_label, job.work_mode_label, job.salary_range]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </p>
                                {canManageCareers && (
                                    <Link
                                        href={`/admin/carreiras/${job.id}/editar`}
                                        className="mt-6 inline-flex text-sm font-semibold text-teal-300 hover:underline"
                                    >
                                        Editar no painel →
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </section>

                    <section className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={ready ? { opacity: 1, y: 0 } : undefined}
                            transition={{ delay: 0.08 }}
                            className="space-y-10"
                        >
                            {job.summary && (
                                <div>
                                    <h2 className="display text-2xl text-white">Resumo</h2>
                                    <p className="mt-3 text-[15px] leading-relaxed text-teal-50/85">{job.summary}</p>
                                </div>
                            )}
                            <div>
                                <h2 className="display text-2xl text-white">Descrição</h2>
                                <div className="mt-3">
                                    <Paragraphs text={job.description} />
                                </div>
                            </div>
                            {job.requirements && (
                                <div>
                                    <h2 className="display text-2xl text-white">Requisitos</h2>
                                    <div className="mt-3">
                                        <Paragraphs text={job.requirements} />
                                    </div>
                                </div>
                            )}
                            {job.benefits && (
                                <div>
                                    <h2 className="display text-2xl text-white">Benefícios</h2>
                                    <div className="mt-3">
                                        <Paragraphs text={job.benefits} />
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        <motion.aside
                            initial={{ opacity: 0, y: 18 }}
                            animate={ready ? { opacity: 1, y: 0 } : undefined}
                            transition={{ delay: 0.14 }}
                            id="candidatar"
                            className="lg:sticky lg:top-24 lg:self-start"
                        >
                            <div className="rounded-2xl border border-teal-800/80 bg-[#08332c] p-6 sm:p-7">
                                <h2 className="display text-2xl text-white">Candidatar-se</h2>
                                <p className="mt-2 text-sm text-teal-100/70">
                                    Enviamos confirmação para o seu e-mail e notificamos a equipa SIGESC.
                                </p>

                                {(flash?.success || form.recentlySuccessful) && (
                                    <p className="mt-4 rounded-lg bg-teal-400/15 px-3 py-2 text-sm text-teal-100">
                                        {flash?.success || 'Candidatura enviada com sucesso.'}
                                    </p>
                                )}
                                {flash?.error && (
                                    <p className="mt-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">
                                        {flash.error}
                                    </p>
                                )}

                                {!open ? (
                                    <p className="mt-6 text-sm text-amber-200/90">
                                        Esta vaga não está a aceitar candidaturas de momento.
                                    </p>
                                ) : (
                                    <form onSubmit={submit} className="mt-6 space-y-4">
                                        <label className="block text-sm">
                                            <span className="text-teal-100/80">Nome completo</span>
                                            <input
                                                value={form.data.name}
                                                onChange={(e) => form.setData('name', e.target.value)}
                                                required
                                                className="mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                                            />
                                            {form.errors.name && (
                                                <span className="mt-1 block text-xs text-red-300">{form.errors.name}</span>
                                            )}
                                        </label>
                                        <label className="block text-sm">
                                            <span className="text-teal-100/80">E-mail</span>
                                            <input
                                                type="email"
                                                value={form.data.email}
                                                onChange={(e) => form.setData('email', e.target.value)}
                                                required
                                                className="mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                                            />
                                            {form.errors.email && (
                                                <span className="mt-1 block text-xs text-red-300">{form.errors.email}</span>
                                            )}
                                        </label>
                                        <label className="block text-sm">
                                            <span className="text-teal-100/80">Telefone</span>
                                            <input
                                                value={form.data.phone}
                                                onChange={(e) => form.setData('phone', e.target.value)}
                                                className="mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                                            />
                                        </label>
                                        <label className="block text-sm">
                                            <span className="text-teal-100/80">LinkedIn (opcional)</span>
                                            <input
                                                type="url"
                                                value={form.data.linkedin_url}
                                                onChange={(e) => form.setData('linkedin_url', e.target.value)}
                                                placeholder="https://"
                                                className="mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                                            />
                                        </label>
                                        <label className="block text-sm">
                                            <span className="text-teal-100/80">Portfólio / CV online (opcional)</span>
                                            <input
                                                type="url"
                                                value={form.data.portfolio_url}
                                                onChange={(e) => form.setData('portfolio_url', e.target.value)}
                                                placeholder="https://"
                                                className="mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                                            />
                                        </label>
                                        <label className="block text-sm">
                                            <span className="text-teal-100/80">Carta de apresentação</span>
                                            <textarea
                                                value={form.data.cover_letter}
                                                onChange={(e) => form.setData('cover_letter', e.target.value)}
                                                required
                                                rows={6}
                                                minLength={40}
                                                className="mt-1.5 w-full rounded-lg border border-teal-700/70 bg-[#06241f] px-3 py-2.5 text-white outline-none ring-teal-400/40 focus:ring-2"
                                            />
                                            {form.errors.cover_letter && (
                                                <span className="mt-1 block text-xs text-red-300">
                                                    {form.errors.cover_letter}
                                                </span>
                                            )}
                                        </label>
                                        <button
                                            type="submit"
                                            disabled={form.processing}
                                            className="w-full rounded-md bg-teal-300 px-4 py-3 text-sm font-semibold text-[#06241f] transition hover:bg-teal-200 disabled:opacity-60"
                                        >
                                            {form.processing ? 'A enviar…' : 'Enviar candidatura'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.aside>
                    </section>
                </main>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
