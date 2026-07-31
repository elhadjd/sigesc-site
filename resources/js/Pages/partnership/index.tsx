import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

type Plan = {
    monthly_price: number;
    currency: string;
    currency_label: string;
    price_formatted: string;
    offline_licenses_limited: boolean;
    offline_licenses_note: string;
    contact_url: string;
    register_url: string;
    admin_url: string;
    agt_cert: string;
};

const benefits = [
    'Revenda e implantação do SIGESC junto de PME',
    'Faturação eletrónica certificada AGT',
    'PDV, stock, finanças, compras e RH',
    'Suporte comercial para o seu território',
    'Material para apresentar o sistema a clientes',
];

const faqs = [
    {
        q: 'Quanto custa a parceria?',
        a: 'A mensalidade do programa de parceria com o sistema SIGESC é de 30.000 Kz.',
    },
    {
        q: 'A versão offline tem licenças limitadas?',
        a: 'Sim. Os cupos da versão offline são limitados e atribuídos conforme disponibilidade e região.',
    },
    {
        q: 'Como me candidatar?',
        a: 'Peça parceria pelo contacto ou registe uma conta Parceiro. A equipa confirma o cupo offline e os próximos passos.',
    },
];

export default function PartnershipIndex({
    auth,
    seo,
    plan,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    plan: Plan;
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
                    fallbackTitle="Parceria SIGESC | 30.000 Kz/mês · Licenças Offline Limitadas"
                    fallbackDescription="Torne-se parceiro SIGESC: revenda software de gestão comercial certificado AGT em Angola. Mensalidade 30.000 Kz com licenças offline limitadas."
                />
                <HeaderComponent auth={auth as any} />

                <main className="partnership-page bg-[#071820] text-white">
                    <section className="relative min-h-[100svh] overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "linear-gradient(105deg, rgba(7,24,32,.92) 0%, rgba(7,24,32,.72) 42%, rgba(7,24,32,.35) 100%), url('/img/dashboard-sigesc-angola.png')",
                            }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,165,207,.28),transparent_42%)]" />

                        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32 sm:px-6 sm:pb-20">
                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55 }}
                                className="font-serif text-5xl tracking-[0.08em] text-[#7fd4e8] sm:text-7xl"
                            >
                                SIGESC
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 22 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.6, delay: 0.08 }}
                                className="mt-4 max-w-3xl font-serif text-3xl leading-tight text-white sm:text-5xl"
                            >
                                Parceria com o nosso sistema — {plan.price_formatted}/mês
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55, delay: 0.16 }}
                                className="mt-5 max-w-xl text-lg text-white/80"
                            >
                                Revenda e implemente gestão comercial certificada AGT em Angola.
                                Licenças limitadas para a versão offline.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.5, delay: 0.24 }}
                                className="mt-8 flex flex-wrap gap-3"
                            >
                                <Link
                                    href="/contact"
                                    className="bg-[#00a5cf] px-6 py-3 text-sm font-semibold tracking-wide text-[#071820] transition hover:bg-[#3ec4e6]"
                                >
                                    Pedir parceria
                                </Link>
                                <a
                                    href={plan.register_url}
                                    className="border border-white/40 px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:border-white hover:bg-white/10"
                                >
                                    Registar como parceiro
                                </a>
                            </motion.div>
                        </div>
                    </section>

                    <section className="relative border-t border-white/10 bg-[#0b2833]">
                        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                            <div>
                                <h2 className="font-serif text-3xl text-white sm:text-4xl">
                                    Plano de parceria mensal
                                </h2>
                                <p className="mt-4 max-w-lg text-white/75">
                                    Um valor claro para crescer com o SIGESC: apresente o sistema,
                                    feche clientes e acompanhe implantações na sua região.
                                </p>
                                <ul className="mt-8 space-y-3 text-white/85">
                                    {benefits.map((item) => (
                                        <li key={item} className="flex gap-3">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a5cf]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="relative overflow-hidden border border-white/15 bg-[#071820] p-8 sm:p-10">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]">
                                    Mensalidade
                                </p>
                                <p className="mt-3 font-serif text-5xl text-white sm:text-6xl">
                                    {plan.price_formatted}
                                    <span className="ml-2 text-xl text-white/60">/mês</span>
                                </p>
                                {plan.offline_licenses_limited && (
                                    <p className="mt-5 border-t border-white/10 pt-5 text-white/80">
                                        {plan.offline_licenses_note}
                                    </p>
                                )}
                                <p className="mt-3 text-sm text-white/55">
                                    Certificação AGT {plan.agt_cert}
                                </p>
                                <Link
                                    href="/contact"
                                    className="mt-8 inline-flex bg-white px-5 py-3 text-sm font-semibold text-[#071820] transition hover:bg-[#7fd4e8]"
                                >
                                    Quero ser parceiro
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="relative overflow-hidden border-t border-white/10">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30"
                            style={{
                                backgroundImage: "url('/img/point-of-sale/software de gestao angola pdv-vendas-rapidas.png')",
                            }}
                        />
                        <div className="absolute inset-0 bg-[#071820]/85" />
                        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
                            <h2 className="font-serif text-3xl text-white sm:text-4xl">
                                Versão offline com cupos limitados
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg text-white/75">
                                Ideal para lojas e escritórios com internet instável. A instalação
                                local continua a emitir e gerir o negócio — as licenças offline para
                                parceiros não são ilimitadas.
                            </p>
                            <div className="mt-10 grid gap-8 sm:grid-cols-3">
                                {[
                                    {
                                        title: 'Instalação local',
                                        body: 'Windows ou Linux no posto do cliente, com sincronização quando houver rede.',
                                    },
                                    {
                                        title: 'Cupos por região',
                                        body: 'Distribuição controlada para proteger território e qualidade de suporte.',
                                    },
                                    {
                                        title: 'Aprovação comercial',
                                        body: 'Cada pedido de parceria e licença offline passa por validação da equipa SIGESC.',
                                    },
                                ].map((block, index) => (
                                    <motion.div
                                        key={block.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.45, delay: index * 0.08 }}
                                    >
                                        <h3 className="font-serif text-2xl text-[#7fd4e8]">{block.title}</h3>
                                        <p className="mt-3 text-white/75">{block.body}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-white/10 bg-[#0b2833]">
                        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                            <h2 className="font-serif text-3xl text-white">Perguntas frequentes</h2>
                            <div className="mt-8 space-y-8">
                                {faqs.map((faq) => (
                                    <div key={faq.q}>
                                        <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
                                        <p className="mt-2 text-white/75">
                                            {faq.q.includes('custa')
                                                ? `A mensalidade do programa de parceria com o sistema SIGESC é de ${plan.price_formatted}.`
                                                : faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 flex flex-wrap gap-3">
                                <Link
                                    href="/contact"
                                    className="bg-[#00a5cf] px-6 py-3 text-sm font-semibold text-[#071820] transition hover:bg-[#3ec4e6]"
                                >
                                    Contactar comercial
                                </Link>
                                <Link
                                    href="/prices"
                                    className="border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Ver preços cloud
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
