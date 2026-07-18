import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

const PENDING = new Set(['queued', 'pending', 'researching']);

export default function AskExpertShow({
    auth,
    question,
    seo,
}: {
    auth: { user: User | null };
    question: any;
    seo?: SeoPayload;
}) {
    const flash = (usePage().props as any).flash;
    const [status, setStatus] = useState(question.status);

    useEffect(() => {
        setStatus(question.status);
    }, [question.status]);

    useEffect(() => {
        if (!PENDING.has(status)) {
            return;
        }

        const timer = window.setInterval(() => {
            router.reload({ only: ['question'], preserveScroll: true });
        }, 4000);

        return () => window.clearInterval(timer);
    }, [status, question.uuid]);

    const processing = PENDING.has(status);

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead seo={seo} fallbackTitle="Resposta do Especialista | SIGESC" />
                <HeaderComponent auth={auth as any} />
                <main className="bg-[#f4efe6]">
                    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                        <Link href="/pergunte-ao-especialista" className="text-sm text-[#0b3d91]">
                            ← Nova pergunta
                        </Link>

                        {flash?.success && (
                            <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">
                                {flash.success}
                            </div>
                        )}

                        <h1 className="mt-4 font-serif text-3xl text-[#14213d] sm:text-4xl">
                            {question.question}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Qualidade estimada: {question.quality_score ?? '—'} · estado: {status}
                        </p>

                        {processing ? (
                            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                                <p className="text-lg font-medium text-[#14213d]">A processar na fila…</p>
                                <p className="mt-2 text-slate-600">
                                    A pesquisa e a resposta correm em background para não pesar o site. Esta página
                                    atualiza automaticamente.
                                    {question.asker_email
                                        ? ' Também enviamos o resultado para o seu email (com link do artigo, se for criado).'
                                        : ''}
                                </p>
                            </div>
                        ) : (
                            <div
                                className="prose blog-prose mt-8 max-w-none rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
                                dangerouslySetInnerHTML={{ __html: question.answer_html || '' }}
                            />
                        )}

                        {question.article && (
                            <p className="mt-8 text-slate-700">
                                Esta resposta gerou um artigo no blog:{' '}
                                <Link
                                    href={`/blog/posts/${question.article.slug}`}
                                    className="font-semibold text-[#0b3d91] underline"
                                >
                                    {question.article.title}
                                </Link>
                            </p>
                        )}
                    </article>
                </main>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
