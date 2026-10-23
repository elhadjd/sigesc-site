import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';
import { SIGESC_GETTING_STARTED_URL } from '@/services/public/domains';

type Product = {
    key: string;
    name: string;
    tagline: string;
    description: string;
    href: string;
    external_url: string;
    cta: string;
    image: string;
    badge: string;
};

export default function ProdutosIndex({
    auth,
    seo,
    products,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    products: Product[];
}) {
    const [ready, setReady] = useState(false);
    const list = products?.length ? products : [];
    const heroImage = list[0]?.image || '/img/dashboard-sigesc-angola.png';

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setReady(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="Produtos SIGESC | Faturação, Hospitalar e HUB"
                    fallbackDescription="Conheça os produtos SIGESC: faturação e gestão, Hospitalar para clínicas e HUB multiempresa com contabilidade."
                />
                <HeaderComponent auth={auth as any} />

                <main
                    className="produtos-page text-[#12202a]"
                    style={
                        {
                            '--pr-ink': '#12202a',
                            '--pr-deep': '#0c2f38',
                            '--pr-accent': '#0d9488',
                            '--pr-mist': '#eef6f7',
                        } as React.CSSProperties
                    }
                >
                    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--pr-deep)] text-white">
                        <div
                            className="absolute inset-0 scale-105 bg-cover bg-center"
                            style={{ backgroundImage: `url('${heroImage}')` }}
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(12,47,56,.96)_0%,rgba(12,47,56,.82)_50%,rgba(12,47,56,.45)_100%)]" />

                        <div className="relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-14 pt-20 sm:px-6 sm:pb-20">
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55 }}
                                className="font-serif text-5xl tracking-[0.08em] text-[#99f6e4] sm:text-7xl"
                            >
                                SIGESC
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.6, delay: 0.08 }}
                                className="mt-4 max-w-3xl font-serif text-3xl leading-[1.12] sm:text-5xl"
                            >
                                Outros produtos do ecossistema
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 14 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55, delay: 0.16 }}
                                className="mt-5 max-w-xl text-base text-white/85 sm:text-lg"
                            >
                                Além da faturação e gestão de empresas: Hospitalar para clínicas e
                                hospitais, e HUB para várias empresas com contabilidade.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.5, delay: 0.24 }}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <Link
                                    href="/produtos/hospitalar"
                                    className="bg-[var(--pr-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f766e] sm:px-6"
                                >
                                    SIGESC Hospitalar
                                </Link>
                                <Link
                                    href="/produtos/hub"
                                    className="border border-white/45 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6"
                                >
                                    SIGESC HUB
                                </Link>
                            </motion.div>
                        </div>
                    </section>

                    <section className="bg-[var(--pr-mist)]">
                        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
                            <h2 className="font-serif text-3xl text-[var(--pr-ink)] sm:text-4xl">
                                Três produtos, um ecossistema
                            </h2>
                            <p className="mt-4 max-w-2xl text-base text-[var(--pr-ink)]/70 sm:text-lg">
                                Escolha o produto certo para o seu contexto — ou combine-os.
                            </p>

                            <div className="mt-12 space-y-16 sm:mt-14 sm:space-y-20">
                                {list.map((product, index) => {
                                    const reverse = index % 2 === 1;
                                    return (
                                        <motion.div
                                            key={product.key}
                                            initial={{ opacity: 0, y: 24 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.28 }}
                                            transition={{ duration: 0.48 }}
                                            className="grid items-center gap-6 lg:grid-cols-2 lg:gap-14"
                                        >
                                            <div className={reverse ? 'lg:order-2' : undefined}>
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pr-accent)]">
                                                    {product.badge}
                                                </p>
                                                <h3 className="mt-3 font-serif text-2xl text-[var(--pr-ink)] sm:text-3xl">
                                                    {product.name}
                                                </h3>
                                                <p className="mt-2 text-sm font-medium text-[var(--pr-ink)]/55">
                                                    {product.tagline}
                                                </p>
                                                <p className="mt-4 text-base leading-relaxed text-[var(--pr-ink)]/75 sm:text-lg">
                                                    {product.description}
                                                </p>
                                                <div className="mt-6 flex flex-wrap gap-3">
                                                    <Link
                                                        href={product.href}
                                                        className="bg-[var(--pr-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3d48]"
                                                    >
                                                        {product.cta}
                                                    </Link>
                                                    <a
                                                        href={product.external_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="border border-[var(--pr-deep)]/25 px-5 py-2.5 text-sm font-semibold text-[var(--pr-ink)] transition hover:bg-white"
                                                    >
                                                        Abrir site
                                                    </a>
                                                </div>
                                            </div>
                                            <div className={reverse ? 'lg:order-1' : undefined}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full border border-[var(--pr-deep)]/10 object-cover"
                                                    loading={index === 0 ? 'eager' : 'lazy'}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    <section className="bg-[var(--pr-deep)] text-white">
                        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
                            <h2 className="font-serif text-3xl sm:text-4xl">Pronto para começar?</h2>
                            <p className="mt-4 max-w-xl text-white/75">
                                Experimente o SIGESC, o Hospitalar ou o HUB — ou fale connosco para
                                escolher o caminho certo.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <a
                                    href={SIGESC_GETTING_STARTED_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[var(--pr-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0f766e]"
                                >
                                    Testar SIGESC
                                </a>
                                <Link
                                    href="/contact"
                                    className="border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
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
