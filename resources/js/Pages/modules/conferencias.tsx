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

type ConferenceModule = {
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
        q: 'O cliente precisa de conta no SIGESC?',
        a: 'Não. Crie o link da conferência, envie ao cliente e ele entra na reunião sem registo.',
    },
    {
        q: 'Posso ligar só a um colega?',
        a: 'Sim. Além das salas, há chamadas diretas entre utilizadores da empresa.',
    },
    {
        q: 'Dá para partilhar e gravar o ecrã?',
        a: 'Sim. Partilhe o ecrã com a sala e grave a sessão quando precisar de arquivo ou formação.',
    },
];

function shotFor(module: ConferenceModule, key: string): Screenshot | undefined {
    return module.screenshots.find((s) => s.key === key) || module.screenshots[0];
}

export default function ConferenciasPage({
    auth,
    seo,
    module,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    module: ConferenceModule;
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
        }, 4800);
        return () => window.clearInterval(timer);
    }, [shots.length]);

    const active = shots[activeIndex] || shots[0];

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="Chamadas e Conferências SIGESC | Videoconferência para PME em Angola"
                    fallbackDescription={module.description}
                />
                <HeaderComponent auth={auth as any} />

                <main
                    className="conferencias-page text-[#0f2740]"
                    style={
                        {
                            '--cf-ink': '#0f2740',
                            '--cf-deep': '#0c2f3d',
                            '--cf-accent': '#1496ad',
                            '--cf-soft': '#e7f3f6',
                            '--cf-warm': '#f2efe6',
                        } as React.CSSProperties
                    }
                >
                    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--cf-deep)] text-white">
                        <div
                            className="absolute inset-0 scale-105 bg-cover bg-center"
                            style={{ backgroundImage: `url('${hero}')` }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(12,47,61,.94)_0%,rgba(12,47,61,.78)_50%,rgba(12,47,61,.4)_100%)]" />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(20,150,173,.38),transparent_42%)]" />

                        <div className="relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20">
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55 }}
                                className="font-serif text-5xl tracking-[0.1em] text-[#9ed7e3] sm:text-7xl"
                            >
                                SIGESC
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 22 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.6, delay: 0.08 }}
                                className="mt-4 max-w-3xl font-serif text-3xl leading-[1.12] text-white sm:text-5xl"
                            >
                                {module.headline}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55, delay: 0.16 }}
                                className="mt-5 max-w-xl text-base text-white/85 sm:text-lg"
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
                                    className="bg-[var(--cf-accent)] px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#1fb0c9] sm:px-6"
                                >
                                    Pedir demonstração
                                </Link>
                                <a
                                    href={SIGESC_GETTING_STARTED_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-white/45 px-5 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-white/10 sm:px-6"
                                >
                                    Testar online
                                </a>
                            </motion.div>
                        </div>
                    </section>

                    <section className="bg-[var(--cf-warm)]">
                        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--cf-ink)] sm:text-4xl">
                                Veja o módulo em ação
                            </h2>
                            <p className="mt-4 max-w-2xl text-base text-[var(--cf-ink)]/70 sm:text-lg">
                                Conferências, link para convidados, chamadas diretas, partilha e gravação
                                de ecrã.
                            </p>

                            <div className="relative mt-8 overflow-hidden border border-[var(--cf-deep)]/10 bg-[var(--cf-deep)] shadow-[0_28px_70px_-36px_rgba(12,47,61,.55)] sm:mt-10">
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
                                                transition={{ duration: 0.5 }}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9ed7e3]">
                                            {active?.title}
                                        </p>
                                        <p className="mt-1 text-sm text-white/75 sm:text-base">
                                            {active?.summary}
                                        </p>
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
                                                        ? 'scale-125 bg-[var(--cf-accent)]'
                                                        : 'bg-white/35 hover:bg-white/70'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white">
                        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--cf-ink)] sm:text-4xl">
                                Do link ao fecho da reunião
                            </h2>
                            <p className="mt-4 max-w-2xl text-base text-[var(--cf-ink)]/70 sm:text-lg">
                                Interno ou com cliente — áudio, vídeo, partilha e gravação no mesmo fluxo.
                            </p>

                            <div className="mt-12 space-y-16 sm:mt-14 sm:space-y-20">
                                {(module.capabilities || []).map((cap, index) => {
                                    const shot = shotFor(module, cap.key);
                                    const reverse = index % 2 === 1;
                                    return (
                                        <motion.div
                                            key={cap.key}
                                            initial={{ opacity: 0, y: 26 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.28 }}
                                            transition={{ duration: 0.48 }}
                                            className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14"
                                        >
                                            <div className={reverse ? 'lg:order-2' : undefined}>
                                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cf-accent)]">
                                                    {String(index + 1).padStart(2, '0')}
                                                </p>
                                                <h3 className="mt-3 font-serif text-2xl text-[var(--cf-ink)] sm:text-3xl">
                                                    {cap.title}
                                                </h3>
                                                <p className="mt-4 text-base leading-relaxed text-[var(--cf-ink)]/75 sm:text-lg">
                                                    {cap.body}
                                                </p>
                                            </div>
                                            {shot && (
                                                <div
                                                    className={`relative ${reverse ? 'lg:order-1' : ''}`}
                                                >
                                                    <div className="absolute -inset-2 bg-[var(--cf-soft)] rotate-1 sm:-inset-3" />
                                                    <img
                                                        src={shot.src}
                                                        alt={shot.alt}
                                                        className="relative w-full border border-[var(--cf-deep)]/10 object-cover"
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

                    <section className="relative overflow-hidden bg-[var(--cf-deep)] text-white">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-25"
                            style={{
                                backgroundImage: `url('${shotFor(module, 'partilha')?.src || hero}')`,
                            }}
                        />
                        <div className="absolute inset-0 bg-[var(--cf-deep)]/88" />
                        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl sm:text-4xl">
                                No mesmo software da faturação AGT
                            </h2>
                            <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
                                Reuniões comerciais junto do CRM e da gestão — certificado AGT{' '}
                                {module.agt_cert}.
                            </p>
                            <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
                                {(module.integrations || []).map((item, index) => (
                                    <motion.li
                                        key={item}
                                        initial={{ opacity: 0, y: 14 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        className="border-l-2 border-[var(--cf-accent)] pl-4 text-base text-white/90 sm:text-lg"
                                    >
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {module.highlights?.length > 0 && (
                        <section className="bg-[var(--cf-soft)]">
                            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
                                <h2 className="font-serif text-3xl text-[var(--cf-ink)]">
                                    Porque usar conferências no SIGESC
                                </h2>
                                <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
                                    {module.highlights.map((item) => (
                                        <li
                                            key={item}
                                            className="flex gap-3 text-[var(--cf-ink)]/85"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cf-accent)]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}

                    <section className="bg-white">
                        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--cf-ink)]">
                                Perguntas frequentes
                            </h2>
                            <div className="mt-8 space-y-8">
                                {faqs.map((faq) => (
                                    <div key={faq.q}>
                                        <h3 className="text-lg font-semibold text-[var(--cf-ink)]">
                                            {faq.q}
                                        </h3>
                                        <p className="mt-2 text-[var(--cf-ink)]/75">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 flex flex-wrap gap-3">
                                <Link
                                    href="/contact"
                                    className="bg-[var(--cf-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb0c9]"
                                >
                                    Falar com especialista
                                </Link>
                                <Link
                                    href="/modules/crm"
                                    className="border border-[var(--cf-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--cf-ink)] transition hover:bg-[var(--cf-soft)]"
                                >
                                    Ver CRM
                                </Link>
                                <Link
                                    href="/solutions"
                                    className="border border-[var(--cf-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--cf-ink)] transition hover:bg-[var(--cf-soft)]"
                                >
                                    Todas as soluções
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
