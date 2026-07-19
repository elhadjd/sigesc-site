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
                <SeoHead
                    seo={seo}
                    fallbackTitle="Pergunte ao Especialista Angola | Dúvidas Fiscais AGT, IVA e Gestão"
                />
                <HeaderComponent auth={auth as any} />
                <main className="relative overflow-hidden bg-[#f4efe6]">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#d9e2f1,transparent_40%),radial-gradient(circle_at_80%_0%,#f0d9b5,transparent_35%)]" />
                    <section className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0b3d91]">
                            SIGESC · Consultoria informativa Angola
                        </p>
                        <h1 className="mt-3 font-serif text-4xl text-[#14213d] sm:text-5xl">
                            Pergunte ao Especialista Angola — dúvidas fiscais AGT, IVA e gestão
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            Tire dúvidas sobre AGT, IVA, IRT 2026, Imposto Industrial, faturação eletrónica, PDV,
                            stock ou abertura de empresa. Resposta com pesquisa de fontes — gratuita para PME em
                            Angola.
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

                        <section className="mt-14 space-y-6 text-slate-700">
                            <h2 className="font-serif text-2xl text-[#14213d]">
                                Dúvidas fiscais e empresariais em Angola
                            </h2>
                            <p>
                                Use este espaço se procura ajuda sobre impostos AGT, calculadora de IVA/IRT, faturação
                                eletrónica ou gestão comercial. Exemplos: taxas de IVA, tabela IRT 2026, retenção na
                                fonte 6,5%, Imposto Industrial, PDV e stock em Luanda.
                            </p>
                            <h2 className="font-serif text-2xl text-[#14213d]">Perguntas frequentes</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-[#14213d]">
                                        É gratuito tirar dúvidas com o especialista SIGESC?
                                    </h3>
                                    <p className="mt-1 text-sm leading-relaxed">
                                        Sim. O Pergunte ao Especialista é gratuito para orientação informativa sobre
                                        fiscalidade e gestão em Angola.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#14213d]">
                                        Substitui um contabilista ou a AGT?
                                    </h3>
                                    <p className="mt-1 text-sm leading-relaxed">
                                        Não. Confirme sempre a legislação no portal AGT, no Quiosque do Contribuinte ou
                                        com um profissional certificado.
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm">
                                Prefere simular valores? Veja as{' '}
                                <a href="/calculadoras" className="font-medium text-[#0b3d91] underline">
                                    calculadoras de IVA e IRT Angola
                                </a>
                                .
                            </p>
                        </section>
                    </section>
                </main>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
