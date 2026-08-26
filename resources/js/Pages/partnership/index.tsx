import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

type FreelancerPlan = {
    enabled: boolean;
    commission_percent: number;
    commission_formatted: string;
    label: string;
    summary: string;
};

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
    freelancer: FreelancerPlan;
};

const partnerBenefits = [
    'Revenda e implantação do SIGESC junto de PME',
    '10 Licenças (cloud e offline) inclusas',
    'Faturação eletrónica certificada AGT',
    'PDV, stock, finanças, compras e RH',
    'Suporte comercial para o seu território',
];

const freelancerBenefits = [
    'Indique o SIGESC a empresas e empresários',
    'Ganhe 30% de comissão sobre cada venda fechada',
    'Sem mensalidade — só comissão',
    'Ideal para consultores, contabilistas e comerciais',
    'Acompanhe as indicações com a equipa SIGESC',
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
    const freelancer = plan.freelancer;
    const commission = freelancer?.commission_formatted || '30%';

    const faqs = [
        {
            q: 'Quanto custa a parceria Parceiro?',
            a: `A mensalidade do programa Parceiro SIGESC é de ${plan.price_formatted}, com 10 licenças inclusas.`,
        },
        {
            q: 'As licenças são limitadas?',
            a: 'Sim. No plano Parceiro são 10 licenças para cloud e versão offline.',
        },
        {
            q: 'O que é a parceria Freelancer?',
            a: `Freelancers indicam o SIGESC a clientes e ganham ${commission} de comissão sobre as vendas fechadas. Não há mensalidade.`,
        },
        {
            q: 'Como me candidatar?',
            a: 'Peça parceria pelo contacto ou registe uma conta. Indique se pretende o plano Parceiro ou Freelancer.',
        },
    ];

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setReady(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle={`Parceria SIGESC | ${plan.price_formatted}/mês · Freelancer ${commission}`}
                    fallbackDescription={`Parceiro SIGESC: ${plan.price_formatted}/mês com 10 licenças. Freelancer: indique clientes e ganhe ${commission} de comissão.`}
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

                        <div className="relative mx-auto flex min-h-[calc(100svh-5.75rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-16 sm:min-h-[calc(100svh-6.25rem)] sm:px-6 sm:pb-20 sm:pt-20">
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
                                Dois caminhos de parceria com o nosso sistema
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 18 }}
                                animate={ready ? { opacity: 1, y: 0 } : undefined}
                                transition={{ duration: 0.55, delay: 0.16 }}
                                className="mt-5 max-w-xl text-lg text-white/80"
                            >
                                Parceiro: {plan.price_formatted}/mês com 10 licenças. Freelancer:
                                indique clientes e ganhe {commission} de comissão.
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
                                    Registar conta
                                </a>
                            </motion.div>
                        </div>
                    </section>

                    <section className="relative border-t border-white/10 bg-[#0b2833]">
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                            <h2 className="font-serif text-3xl text-white sm:text-4xl">
                                Escolha o tipo de parceria
                            </h2>
                            <p className="mt-4 max-w-2xl text-white/75">
                                Revenda e implantar como Parceiro, ou indicar clientes como Freelancer.
                            </p>

                            <div className="mt-10 grid gap-6 lg:grid-cols-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.35 }}
                                    transition={{ duration: 0.45 }}
                                    className="border border-white/15 bg-[#071820] p-8 sm:p-10"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]">
                                        Parceiro
                                    </p>
                                    <p className="mt-3 font-serif text-5xl text-white sm:text-6xl">
                                        {plan.price_formatted}
                                        <span className="ml-2 text-xl text-white/60">/mês</span>
                                    </p>
                                    <p className="mt-4 text-white/80">10 licenças inclusas (cloud e offline)</p>
                                    <ul className="mt-8 space-y-3 text-white/85">
                                        {partnerBenefits.map((item) => (
                                            <li key={item} className="flex gap-3">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a5cf]" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-5 text-sm text-white/55">
                                        Certificação AGT {plan.agt_cert}
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="mt-8 inline-flex bg-white px-5 py-3 text-sm font-semibold text-[#071820] transition hover:bg-[#7fd4e8]"
                                    >
                                        Quero ser parceiro (10 licenças)
                                    </Link>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.35 }}
                                    transition={{ duration: 0.45, delay: 0.08 }}
                                    className="border border-[#00a5cf]/35 bg-[#071820] p-8 sm:p-10"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]">
                                        {freelancer?.label || 'Freelancer'}
                                    </p>
                                    <p className="mt-3 font-serif text-5xl text-white sm:text-6xl">
                                        {commission}
                                        <span className="ml-2 text-xl text-white/60">comissão</span>
                                    </p>
                                    <p className="mt-4 text-white/80">
                                        {freelancer?.summary ||
                                            'Indique o SIGESC a clientes e ganhe comissão sobre as vendas fechadas.'}
                                    </p>
                                    <ul className="mt-8 space-y-3 text-white/85">
                                        {freelancerBenefits.map((item) => (
                                            <li key={item} className="flex gap-3">
                                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7fd4e8]" />
                                                <span>{item.replace('30%', commission)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-5 text-sm text-white/55">Sem mensalidade · só comissão</p>
                                    <Link
                                        href="/contact"
                                        className="mt-8 inline-flex bg-[#00a5cf] px-5 py-3 text-sm font-semibold text-[#071820] transition hover:bg-[#3ec4e6]"
                                    >
                                        Quero ser freelancer
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    <section className="relative overflow-hidden border-t border-white/10">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30"
                            style={{
                                backgroundImage:
                                    "url('/img/point-of-sale/software de gestao angola pdv-vendas-rapidas.png')",
                            }}
                        />
                        <div className="absolute inset-0 bg-[#071820]/85" />
                        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
                            <h2 className="font-serif text-3xl text-white sm:text-4xl">
                                10 licenças para parceiros
                            </h2>
                            <p className="mt-4 max-w-2xl text-lg text-white/75">
                                No plano Parceiro, você recebe 10 licenças (cloud e offline) — ideais
                                para começar a sua carteira de clientes em Angola.
                            </p>
                            <div className="mt-10 grid gap-8 sm:grid-cols-3">
                                {[
                                    {
                                        title: 'Cloud e offline',
                                        body: 'Implante no posto do cliente ou na nuvem, com sincronização quando houver rede.',
                                    },
                                    {
                                        title: '10 licenças inclusas',
                                        body: 'Comece com 10 licenças no plano Parceiro, sem custos adicionais por elas.',
                                    },
                                    {
                                        title: 'Freelancer à parte',
                                        body: `Se preferir só indicar clientes, o modelo Freelancer paga ${commission} de comissão.`,
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
                                        <p className="mt-2 text-white/75">{faq.a}</p>
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
