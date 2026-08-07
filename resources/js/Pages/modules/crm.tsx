import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';
import { SIGESC_GETTING_STARTED_URL } from '@/services/public/domains';

type Screenshot = {
    key: string;
    src: string;
    title: string;
    alt: string;
    summary: string;
};

type Capability = {
    key: string;
    title: string;
    body: string;
};

type CrmModule = {
    name: string;
    slug: string;
    agt_cert: string;
    headline: string;
    lead: string;
    description: string;
    highlights: string[];
    screenshots: Screenshot[];
    hero_image: string | null;
    capabilities: Capability[];
    integrations: string[];
};

const faqs = [
    {
        q: 'O que é o CRM do SIGESC?',
        a: 'É o módulo comercial para organizar leads, pipeline, follow-ups e comunicação com clientes — no mesmo sistema da faturação AGT.',
    },
    {
        q: 'Integra WhatsApp e email?',
        a: 'Sim. As conversas ficam ligadas ao contacto e ao negócio no funil.',
    },
    {
        q: 'Serve para PME em Angola?',
        a: 'Sim. Fluxos pensados para equipas comerciais em Luanda e noutras províncias.',
    },
];

function shotFor(module: CrmModule, key: string): Screenshot | undefined {
    return module.screenshots.find((s) => s.key === key) || module.screenshots[0];
}

export default function CrmModulePage({
    auth,
    seo,
    module,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    module: CrmModule;
}) {
    const [ready, setReady] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const shots = module.screenshots?.length ? module.screenshots : [];
    const hero = module.hero_image || shots[0]?.src || '/img/dashboard-sigesc-angola.png';

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setReady(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (shots.length < 2) return;
        const timer = window.setInterval(() => {
            setActiveIndex((i) => (i + 1) % shots.length);
        }, 4500);
        return () => window.clearInterval(timer);
    }, [shots.length]);

    const active = shots[activeIndex] || shots[0];

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="CRM SIGESC | Pipeline, WhatsApp e Gestão de Clientes em Angola"
                    fallbackDescription={module.description}
                />
                <HeaderComponent auth={auth as any} />

                <main
                    className="crm-page text-[#102a32]"
                    style={
                        {
                            '--crm-ink': '#102a32',
                            '--crm-deep': '#0a3a44',
                            '--crm-mid': '#125a68',
                            '--crm-accent': '#1f9bb0',
                            '--crm-mist': '#e8f4f6',
                            '--crm-sand': '#f3f0e8',
                        } as React.CSSProperties
                    }
                >
                    {/* Hero — full-bleed product plane */}
                    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--crm-deep)] text-white">
                        <div
                            className="absolute inset-0 bg-cover bg-center scale-105"
                            style={{
                                backgroundImage: `url('${hero}')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,58,68,.94)_0%,rgba(10,58,68,.78)_48%,rgba(10,58,68,.42)_100%)]" />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_18%,rgba(31,155,176,.35),transparent_40%)]" />
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.12]"
                            style={{
                                backgroundImage:
                                    'linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)',
                                backgroundSize: '48px 48px',
                            }}
                        />

                        <div className="relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-20 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20">
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.6 }}
                                className="font-serif text-5xl tracking-[0.1em] text-[#9fd8e2] sm:text-7xl"
                            >
                                SIGESC
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.65, delay: 0.08 }}
                                className="mt-4 max-w-3xl font-serif text-3xl leading-[1.12] text-white sm:text-5xl"
                            >
                                {module.headline}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55, delay: 0.16 }}
                                className="mt-5 max-w-xl text-lg text-white/82"
                            >
                                {module.lead}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.5, delay: 0.24 }}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <Link
                                    href="/contact"
                                    className="bg-[var(--crm-accent)] px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#2eb3c8]"
                                >
                                    Pedir demonstração
                                </Link>
                                <a
                                    href={SIGESC_GETTING_STARTED_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-white/45 px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:border-white hover:bg-white/10"
                                >
                                    Testar online
                                </a>
                            </motion.div>
                        </div>
                    </section>

                    {/* Product theatre */}
                    <section className="relative overflow-hidden bg-[var(--crm-sand)]">
                        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--crm-deep)]/10 to-transparent" />
                        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--crm-ink)] sm:text-4xl">
                                Veja o CRM em ação
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg text-[var(--crm-ink)]/70">
                                Ecrãs reais do módulo: painel, pipeline, contactos, WhatsApp, email e
                                relatórios.
                            </p>

                            <div className="relative mt-10 overflow-hidden border border-[var(--crm-deep)]/10 bg-[var(--crm-deep)] shadow-[0_30px_80px_-40px_rgba(10,58,68,.55)]">
                                <div className="relative aspect-[16/10] bg-[#071820]">
                                    <AnimatePresence mode="wait">
                                        {active && (
                                            <motion.img
                                                key={active.src}
                                                src={active.src}
                                                alt={active.alt}
                                                initial={{ opacity: 0, scale: 1.02 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.55 }}
                                                className="absolute inset-0 h-full w-full object-contain object-top"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9fd8e2]">
                                            {active?.title}
                                        </p>
                                        <p className="mt-1 text-white/75">{active?.summary}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {shots.map((shot, index) => (
                                            <button
                                                key={shot.key}
                                                type="button"
                                                onClick={() => setActiveIndex(index)}
                                                aria-label={shot.title}
                                                className={`h-2.5 w-2.5 rounded-full transition ${
                                                    index === activeIndex
                                                        ? 'bg-[var(--crm-accent)] scale-125'
                                                        : 'bg-white/35 hover:bg-white/70'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Capabilities with real imagery */}
                    <section className="bg-white">
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--crm-ink)] sm:text-4xl">
                                Tudo o que a equipa comercial precisa
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg text-[var(--crm-ink)]/70">
                                Do primeiro contacto ao fecho — com comunicação e indicadores no mesmo
                                sítio.
                            </p>

                            <div className="mt-14 space-y-20">
                                {(module.capabilities || []).map((cap, index) => {
                                    const shot = shotFor(module, cap.key);
                                    const reverse = index % 2 === 1;
                                    return (
                                        <motion.div
                                            key={cap.key}
                                            initial={{ opacity: 0, y: 28 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.5 }}
                                            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
                                        >
                                            <div className={reverse ? 'lg:order-2' : undefined}>
                                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--crm-accent)]">
                                                    {String(index + 1).padStart(2, '0')}
                                                </p>
                                                <h3 className="mt-3 font-serif text-3xl text-[var(--crm-ink)]">
                                                    {cap.title}
                                                </h3>
                                                <p className="mt-4 text-lg leading-relaxed text-[var(--crm-ink)]/75">
                                                    {cap.body}
                                                </p>
                                            </div>
                                            {shot && (
                                                <div className={`relative ${reverse ? 'lg:order-1' : ''}`}>
                                                    <div className="absolute -inset-3 bg-[var(--crm-mist)] rotate-1" />
                                                    <img
                                                        src={shot.src}
                                                        alt={shot.alt}
                                                        className="relative w-full border border-[var(--crm-deep)]/10 bg-[var(--crm-deep)] object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Integration */}
                    <section className="relative overflow-hidden bg-[var(--crm-deep)] text-white">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-25"
                            style={{
                                backgroundImage: `url('${shotFor(module, 'relatorios')?.src || hero}')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-[var(--crm-deep)]/88" />
                        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl sm:text-4xl">
                                CRM ligado à faturação AGT
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg text-white/75">
                                O comercial fecha no CRM; a empresa fatura e opera no SIGESC — certificado
                                AGT {module.agt_cert}.
                            </p>
                            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                                {(module.integrations || []).map((item, index) => (
                                    <motion.li
                                        key={item}
                                        initial={{ opacity: 0, y: 16 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.4, delay: index * 0.06 }}
                                        className="border-l-2 border-[var(--crm-accent)] pl-4 text-lg text-white/90"
                                    >
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Highlights strip */}
                    {module.highlights?.length > 0 && (
                        <section className="bg-[var(--crm-mist)]">
                            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                                <h2 className="font-serif text-3xl text-[var(--crm-ink)]">
                                    Porque escolher o CRM SIGESC
                                </h2>
                                <ul className="mt-8 grid gap-x-10 gap-y-5 md:grid-cols-2">
                                    {module.highlights.map((item) => (
                                        <li key={item} className="flex gap-3 text-[var(--crm-ink)]/85">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--crm-accent)]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}

                    {/* FAQ + CTA */}
                    <section className="bg-white">
                        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--crm-ink)]">
                                Perguntas frequentes
                            </h2>
                            <div className="mt-8 space-y-8">
                                {faqs.map((faq) => (
                                    <div key={faq.q}>
                                        <h3 className="text-lg font-semibold text-[var(--crm-ink)]">
                                            {faq.q}
                                        </h3>
                                        <p className="mt-2 text-[var(--crm-ink)]/75">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 flex flex-wrap gap-3">
                                <Link
                                    href="/contact"
                                    className="bg-[var(--crm-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2eb3c8]"
                                >
                                    Falar com especialista
                                </Link>
                                <Link
                                    href="/solutions"
                                    className="border border-[var(--crm-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--crm-ink)] transition hover:bg-[var(--crm-mist)]"
                                >
                                    Ver todas as soluções
                                </Link>
                                <a
                                    href={SIGESC_GETTING_STARTED_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-[var(--crm-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--crm-ink)] transition hover:bg-[var(--crm-mist)]"
                                >
                                    Testar grátis
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
