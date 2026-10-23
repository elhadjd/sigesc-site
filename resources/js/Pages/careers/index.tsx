import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

export type CareerJob = {
    id: number;
    title: string;
    slug: string;
    department?: string | null;
    location?: string | null;
    employment_type: string;
    employment_type_label: string;
    work_mode: string;
    work_mode_label: string;
    status: string;
    summary?: string | null;
    description: string;
    requirements?: string | null;
    benefits?: string | null;
    salary_range?: string | null;
    published_at?: string | null;
};

export default function CareersIndex({
    auth,
    seo,
    jobs,
    canManageCareers,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    jobs: CareerJob[];
    canManageCareers?: boolean;
}) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setReady(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="Carreiras SIGESC | Vagas em Angola"
                    fallbackDescription="Trabalhe no SIGESC — vagas em produto, engenharia, comercial e operações em Angola."
                />
                <HeaderComponent auth={auth as any} />

                <main className="careers-page bg-[#06241f] text-white">
                    <style>{`
                        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700&display=swap');
                        .careers-page { font-family: Manrope, sans-serif; }
                        .careers-page .display { font-family: Fraunces, Georgia, serif; }
                    `}</style>

                    <section className="relative min-h-[100svh] overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(115deg, rgba(6,36,31,.94) 0%, rgba(6,36,31,.78) 45%, rgba(6,36,31,.42) 100%), url('/img/dashboard-sigesc-angola.png')",
                            }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,.28),transparent_44%)]" />

                        <div className="relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-16 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20 sm:pt-20">
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55 }}
                                className="display text-5xl tracking-[0.08em] text-teal-200 sm:text-7xl"
                            >
                                SIGESC
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 22 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.6, delay: 0.08 }}
                                className="display mt-4 max-w-3xl text-3xl leading-tight text-white sm:text-5xl"
                            >
                                Carreiras
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55, delay: 0.16 }}
                                className="mt-5 max-w-xl text-base leading-relaxed text-teal-50/85 sm:text-lg"
                            >
                                Ajude empresas angolanas a digitalizar a gestão — vagas em produto, engenharia e comercial.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.5, delay: 0.24 }}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <a
                                    href="#vagas"
                                    className="inline-flex items-center rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-[#06241f] transition hover:bg-teal-200"
                                >
                                    Ver vagas abertas
                                </a>
                                {canManageCareers && (
                                    <Link
                                        href="/admin/carreiras"
                                        className="inline-flex items-center rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                                    >
                                        Gerir vagas
                                    </Link>
                                )}
                            </motion.div>
                        </div>
                    </section>

                    <section id="vagas" className="relative border-t border-teal-900/60 bg-[#08332c] px-4 py-20 sm:px-6">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-teal-400/10 to-transparent" />
                        <div className="relative mx-auto max-w-6xl">
                            <h2 className="display text-3xl text-white sm:text-4xl">Vagas abertas</h2>
                            <p className="mt-3 max-w-2xl text-teal-100/75">
                                {jobs.length === 0
                                    ? 'Não há vagas abertas neste momento. Volte em breve ou contacte-nos.'
                                    : `${jobs.length} oportunidade${jobs.length === 1 ? '' : 's'} para crescer com a equipa SIGESC.`}
                            </p>

                            {jobs.length === 0 ? (
                                <div className="mt-12 max-w-xl">
                                    <Link
                                        href="/contact"
                                        className="inline-flex rounded-md bg-teal-300 px-5 py-3 text-sm font-semibold text-[#06241f] hover:bg-teal-200"
                                    >
                                        Enviar candidatura espontânea
                                    </Link>
                                </div>
                            ) : (
                                <ul className="mt-12 divide-y divide-teal-800/80 border-y border-teal-800/80">
                                    {jobs.map((job, index) => (
                                        <motion.li
                                            key={job.id}
                                            initial={{ opacity: 0, y: 18 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: '-40px' }}
                                            transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
                                        >
                                            <Link
                                                href={`/carreiras/${job.slug}`}
                                                className="group flex flex-col gap-3 py-7 transition sm:flex-row sm:items-end sm:justify-between sm:gap-8"
                                            >
                                                <div className="min-w-0">
                                                    {job.department && (
                                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-300/90">
                                                            {job.department}
                                                        </p>
                                                    )}
                                                    <h3 className="display mt-1 text-2xl text-white transition group-hover:text-teal-200 sm:text-3xl">
                                                        {job.title}
                                                    </h3>
                                                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-teal-100/70">
                                                        {job.summary ||
                                                            (job.description.length > 140
                                                                ? `${job.description.slice(0, 140)}…`
                                                                : job.description)}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-sm text-teal-100/80 sm:text-right">
                                                    <p>{job.location}</p>
                                                    <p className="mt-1">
                                                        {job.employment_type_label} · {job.work_mode_label}
                                                    </p>
                                                    <span className="mt-3 inline-flex text-teal-300 group-hover:underline">
                                                        Candidatar-se →
                                                    </span>
                                                </div>
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    <section className="border-t border-teal-900/50 bg-[#06241f] px-4 py-16 sm:px-6">
                        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="display text-2xl text-white sm:text-3xl">Porquê o SIGESC?</h2>
                                <p className="mt-3 max-w-xl text-teal-100/75">
                                    Produto certificado AGT, impacto real em PME angolanas e uma equipa que constrói software com propósito.
                                </p>
                            </div>
                            <Link
                                href="/sobre"
                                className="inline-flex text-sm font-semibold text-teal-300 hover:text-teal-200"
                            >
                                Conhecer a marca →
                            </Link>
                        </div>
                    </section>

                    <section className="border-t border-teal-900/40 bg-[#08332c] px-4 py-14 sm:px-6" aria-label="SEO carreiras Angola">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="display text-2xl text-white sm:text-3xl">
                                Emprego em software e comercial B2B em Angola
                            </h2>
                            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-teal-100/80 sm:text-base">
                                A página de carreiras SIGESC concentra vagas de emprego em Luanda e Angola nas áreas de
                                engenharia de software, full stack, produto e consultor comercial B2B para software de
                                gestão e faturação eletrónica certificada AGT. Candidate-se gratuitamente — sem taxas
                                de recrutamento.
                            </p>
                            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-teal-200/70 sm:text-sm">
                                {[
                                    'vagas emprego Luanda',
                                    'emprego tecnologia Angola',
                                    'desenvolvedor software Luanda',
                                    'consultor comercial B2B Angola',
                                    'emprego SaaS / ERP Angola',
                                    'vagas faturação eletrónica',
                                ].map((kw) => (
                                    <li key={kw}>{kw}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </main>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
