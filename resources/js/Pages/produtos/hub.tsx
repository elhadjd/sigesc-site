import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';
import { SIGESC_HUB_URL } from '@/services/public/domains';

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

type HubProduct = {
    name: string;
    slug: string;
    product_url: string;
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
        q: 'Para quem é o SIGESC HUB?',
        a: 'Para quem tem várias empresas ou contas SIGESC e quer gerir tudo num único lugar — grupos, gabinetes e contabilidades.',
    },
    {
        q: 'O HUB tem contabilidade?',
        a: 'Sim. Plano de contas, diários, lançamentos, razão, balancetes e reconciliação — um sistema completo de contabilidade.',
    },
    {
        q: 'Onde aceder?',
        a: 'Em hub.sisgesc.net — também a partir desta página.',
    },
];

function shotFor(product: HubProduct, key: string): Screenshot | undefined {
    return product.screenshots.find((s) => s.key === key) || product.screenshots[0];
}

export default function HubPage({
    auth,
    seo,
    product,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    product: HubProduct;
}) {
    const [ready, setReady] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const shots = product.screenshots?.length ? product.screenshots : [];
    const hero = product.hero_image || shots[0]?.src || '/img/produtos/hub/hero.jpg';
    const productUrl = product.product_url || SIGESC_HUB_URL;

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setReady(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (shots.length < 2) return;
        const timer = window.setInterval(() => {
            setActiveIndex((i) => (i + 1) % shots.length);
        }, 5000);
        return () => window.clearInterval(timer);
    }, [shots.length]);

    const active = shots[activeIndex] || shots[0];

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="SIGESC HUB | Multiempresa e Contabilidade"
                    fallbackDescription={product.description}
                />
                <HeaderComponent auth={auth as any} />

                <main
                    className="hub-page text-[#12151a]"
                    style={
                        {
                            '--hb-ink': '#12151a',
                            '--hb-deep': '#0b1f20',
                            '--hb-accent': '#2dd4bf',
                            '--hb-soft': '#e8f3f3',
                            '--hb-mist': '#f3f7f7',
                        } as React.CSSProperties
                    }
                >
                    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--hb-deep)] text-white">
                        <div
                            className="absolute inset-0 scale-105 bg-cover bg-center"
                            style={{ backgroundImage: `url('${hero}')` }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(11,31,32,.96)_0%,rgba(11,31,32,.84)_46%,rgba(11,31,32,.42)_100%)]" />

                        <div className="relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:px-6 sm:pb-20">
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55 }}
                                className="font-serif text-5xl tracking-[0.08em] text-[#5eead4] sm:text-7xl"
                            >
                                SIGESC HUB
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 22 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.6, delay: 0.08 }}
                                className="mt-4 max-w-3xl font-serif text-3xl leading-[1.12] sm:text-5xl"
                            >
                                {product.headline}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55, delay: 0.16 }}
                                className="mt-5 max-w-xl text-base text-white/85 sm:text-lg"
                            >
                                {product.lead}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.5, delay: 0.24 }}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <a
                                    href={productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[var(--hb-accent)] px-5 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4] sm:px-6"
                                >
                                    Abrir hub.sisgesc.net
                                </a>
                                <Link
                                    href="/produtos"
                                    className="border border-white/45 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6"
                                >
                                    Todos os produtos
                                </Link>
                            </motion.div>
                        </div>
                    </section>

                    <section className="bg-[var(--hb-mist)]">
                        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--hb-ink)] sm:text-4xl">
                                Do SIGESC ao painel do grupo
                            </h2>
                            <p className="mt-4 max-w-2xl text-base text-[var(--hb-ink)]/70 sm:text-lg">
                                O SIGESC fatura e gere cada empresa. O HUB consolida várias e
                                acrescenta contabilidade — no mesmo ecossistema.
                            </p>

                            <div className="relative mt-8 overflow-hidden border border-[var(--hb-deep)]/10 bg-[var(--hb-deep)] sm:mt-10">
                                <div className="relative aspect-[16/10] bg-[#061314]">
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
                                                className="absolute inset-0 h-full w-full object-cover object-top"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5eead4]">
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
                                                        ? 'scale-125 bg-[var(--hb-accent)]'
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
                            <h2 className="font-serif text-3xl text-[var(--hb-ink)] sm:text-4xl">
                                Multiempresa e contabilidade
                            </h2>
                            <p className="mt-4 max-w-2xl text-base text-[var(--hb-ink)]/70 sm:text-lg">
                                Vista do grupo, vista por empresa, e lançamentos contabilísticos no
                                mesmo produto.
                            </p>

                            <div className="mt-12 space-y-16 sm:mt-14 sm:space-y-20">
                                {(product.capabilities || []).map((cap, index) => {
                                    const shot = shotFor(product, cap.key);
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
                                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">
                                                    {String(index + 1).padStart(2, '0')}
                                                </p>
                                                <h3 className="mt-3 font-serif text-2xl text-[var(--hb-ink)] sm:text-3xl">
                                                    {cap.title}
                                                </h3>
                                                <p className="mt-4 text-base leading-relaxed text-[var(--hb-ink)]/75 sm:text-lg">
                                                    {cap.body}
                                                </p>
                                            </div>
                                            {shot && (
                                                <div className={reverse ? 'lg:order-1' : undefined}>
                                                    <img
                                                        src={shot.src}
                                                        alt={shot.alt}
                                                        className="w-full border border-[var(--hb-deep)]/10 object-cover object-top"
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

                    {product.highlights?.length > 0 && (
                        <section className="bg-[var(--hb-soft)]">
                            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
                                <h2 className="font-serif text-3xl text-[var(--hb-ink)]">
                                    Porque usar o SIGESC HUB
                                </h2>
                                <ul className="mt-8 grid gap-x-10 gap-y-4 md:grid-cols-2">
                                    {product.highlights.map((item) => (
                                        <li
                                            key={item}
                                            className="flex gap-3 text-[var(--hb-ink)]/85"
                                        >
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}

                    <section className="bg-[var(--hb-deep)] text-white">
                        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
                            <h2 className="font-serif text-3xl sm:text-4xl">
                                Ligado ao SIGESC certificado AGT
                            </h2>
                            <p className="mt-4 max-w-2xl text-white/75">
                                Sincroniza com o SIGESC (AGT {product.agt_cert}) e completa o
                                ecossistema com Hospitalar e Marketplace.
                            </p>
                            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                                {(product.integrations || []).map((item) => (
                                    <li
                                        key={item}
                                        className="border-l-2 border-[var(--hb-accent)] pl-4 text-base text-white/90"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-10 inline-flex bg-[var(--hb-accent)] px-6 py-3 text-sm font-semibold text-[#042f2e] transition hover:bg-[#5eead4]"
                            >
                                Ir para hub.sisgesc.net
                            </a>
                        </div>
                    </section>

                    <section className="bg-white">
                        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--hb-ink)]">
                                Perguntas frequentes
                            </h2>
                            <div className="mt-8 space-y-8">
                                {faqs.map((faq) => (
                                    <div key={faq.q}>
                                        <h3 className="text-lg font-semibold text-[var(--hb-ink)]">
                                            {faq.q}
                                        </h3>
                                        <p className="mt-2 text-[var(--hb-ink)]/75">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 flex flex-wrap gap-3">
                                <a
                                    href={productUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[var(--hb-deep)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#143334]"
                                >
                                    Abrir HUB
                                </a>
                                <Link
                                    href="/contact"
                                    className="border border-[var(--hb-deep)]/25 px-6 py-3 text-sm font-semibold text-[var(--hb-ink)] transition hover:bg-[var(--hb-mist)]"
                                >
                                    Falar com a equipa
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
