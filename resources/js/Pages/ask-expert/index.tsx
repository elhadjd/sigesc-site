import React, { FormEvent, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

export default function AskExpertIndex({
    auth,
    seo,
}: {
    auth: { user: User | null };
    seo?: SeoPayload;
}) {
    const [question, setQuestion] = useState('');
    const [askerName, setAskerName] = useState('');
    const [askerEmail, setAskerEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const flash = (usePage().props as any).flash;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        router.post(
            '/pergunte-ao-especialista',
            {
                question,
                asker_name: askerName,
                asker_email: askerEmail,
            },
            {
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead seo={seo} fallbackTitle="Pergunte ao Especialista | SIGESC" />
                <HeaderComponent auth={auth as any} />
                <main className="relative overflow-hidden bg-[#f4efe6]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#d9e2f1,transparent_40%),radial-gradient(circle_at_80%_0%,#f0d9b5,transparent_35%)]" />
                    <section className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0b3d91]">
                            SIGESC · Conhecimento
                        </p>
                        <h1 className="mt-3 font-serif text-4xl text-[#14213d] sm:text-5xl">
                            Pergunte ao Especialista
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            Pergunte sobre vendas online, anúncios, sistemas de gestão, AGT, IVA, faturação ou
                            empreendedorismo em Angola. A resposta é preparada com pesquisa e pode virar artigo no
                            blog.
                        </p>

                        {flash?.success && (
                            <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-10 space-y-4 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700">A sua pergunta</span>
                                <textarea
                                    required
                                    minLength={12}
                                    rows={5}
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none ring-[#0b3d91] focus:ring-2"
                                    placeholder="Ex.: Qual o melhor sistema de gestão comercial para PME em Angola? Ou: como fazer anúncios de sucesso no Instagram?"
                                />
                            </label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Nome (opcional)</span>
                                    <input
                                        value={askerName}
                                        onChange={(e) => setAskerName(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Email (opcional)</span>
                                    <input
                                        type="email"
                                        value={askerEmail}
                                        onChange={(e) => setAskerEmail(e.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
                                        placeholder="nome@empresa.ao"
                                    />
                                </label>
                            </div>
                            <p className="rounded-xl bg-[#e8eef8] px-4 py-3 text-sm leading-relaxed text-slate-700">
                                Se indicar o email, enviamos a resposta quando estiver pronta — e o link do artigo no
                                blog, se a pergunta der origem a um post. Sem email, pode acompanhar a resposta nesta
                                página.
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-[#0b3d91] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a347c] disabled:opacity-60"
                            >
                                {loading ? 'A enviar a pergunta…' : 'Obter resposta'}
                            </button>
                        </form>
                    </section>
                </main>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
