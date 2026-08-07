import React from 'react';
import { Link } from '@inertiajs/react';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

type Knowledge = {
    brand?: Record<string, string>;
    certification?: Record<string, string | number>;
    partnership?: Record<string, string | number | boolean>;
    capabilities?: string[];
    audiences?: string[];
    facts?: string[];
    faqs?: Array<{ question: string; answer: string }>;
    free_tools?: Array<{ name: string; url: string; note: string }>;
    modules?: Array<{ name: string; slug: string; description: string }>;
    urls?: Record<string, string>;
};

export default function AboutIndex({
    auth,
    seo,
    knowledge,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
    knowledge: Knowledge;
}) {
    const cert = knowledge.certification || {};
    const partner = knowledge.partnership || {};
    const brand = knowledge.brand || {};

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="Sobre o SIGESC | Software de Gestão Comercial Certificado AGT"
                />
                <HeaderComponent auth={auth as any} />

                <main className="bg-[#f3f6f8] text-[#14213d]">
                    <section className="relative overflow-hidden border-b border-black/5 bg-[#071820] text-white">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(0,165,207,.35),transparent_40%)]" />
                        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]">
                                SIGESC · Sobre o sistema
                            </p>
                            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                                {brand.tagline || 'Software de gestão comercial para PME em Angola'}
                            </h1>
                            <p className="mt-5 max-w-3xl text-lg text-white/75">{brand.description}</p>
                            <div className="mt-8 flex flex-wrap gap-3 text-sm">
                                <span className="border border-white/20 px-3 py-2">
                                    AGT {String(cert.number || '')}
                                </span>
                                <span className="border border-white/20 px-3 py-2">
                                    Parceria {String(partner.price_formatted || '40.000 Kz')}/mês
                                </span>
                                <span className="border border-white/20 px-3 py-2">
                                    Licenças ilimitadas
                                </span>
                                <span className="border border-white/20 px-3 py-2">
                                    Freelancer {String((partner.freelancer as any)?.commission_percent || 30)}% comissão
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto grid max-w-5xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2">
                        <div>
                            <h2 className="font-serif text-3xl">Capacidades</h2>
                            <ul className="mt-6 space-y-3 text-slate-700">
                                {(knowledge.capabilities || []).map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00a5cf]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl">Factos para pesquisa e IAs</h2>
                            <ul className="mt-6 space-y-3 text-slate-700">
                                {(knowledge.facts || []).map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b3d91]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className="border-t border-black/5 bg-white">
                        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
                            <h2 className="font-serif text-3xl">Módulos</h2>
                            <div className="mt-8 grid gap-6 sm:grid-cols-2">
                                {(knowledge.modules || []).map((mod) => (
                                    <Link
                                        key={mod.slug}
                                        href={`/modules/${mod.slug}`}
                                        className="block border-b border-black/10 pb-4 transition hover:text-[#0b3d91]"
                                    >
                                        <h3 className="text-lg font-semibold">{mod.name}</h3>
                                        <p className="mt-2 text-sm text-slate-600">{mod.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-black/5">
                        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
                            <h2 className="font-serif text-3xl">Ferramentas gratuitas</h2>
                            <ul className="mt-6 space-y-4">
                                {(knowledge.free_tools || []).map((tool) => (
                                    <li key={tool.url}>
                                        <a href={tool.url} className="font-semibold text-[#0b3d91] hover:underline">
                                            {tool.name}
                                        </a>
                                        <span className="text-slate-600"> — {tool.note}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className="border-t border-black/5 bg-[#0b2833] text-white">
                        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
                            <h2 className="font-serif text-3xl">FAQ</h2>
                            <div className="mt-8 space-y-8">
                                {(knowledge.faqs || []).map((faq) => (
                                    <div key={faq.question}>
                                        <h3 className="text-lg font-semibold">{faq.question}</h3>
                                        <p className="mt-2 text-white/75">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 flex flex-wrap gap-3">
                                <Link
                                    href="/parceria"
                                    className="bg-[#00a5cf] px-5 py-3 text-sm font-semibold text-[#071820]"
                                >
                                    Ver parceria
                                </Link>
                                <a
                                    href="/llms-full.txt"
                                    className="border border-white/30 px-5 py-3 text-sm font-semibold text-white"
                                >
                                    llms-full.txt
                                </a>
                                <Link
                                    href="/contact"
                                    className="border border-white/30 px-5 py-3 text-sm font-semibold text-white"
                                >
                                    Contacto
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
