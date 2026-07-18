import React from 'react';
import { Link } from '@inertiajs/react';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

export default function AskExpertShow({
    auth,
    question,
    seo,
}: {
    auth: { user: User | null };
    question: any;
    seo?: SeoPayload;
}) {
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
                        <h1 className="mt-4 font-serif text-3xl text-[#14213d] sm:text-4xl">
                            {question.question}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Qualidade estimada: {question.quality_score ?? '—'} · estado: {question.status}
                        </p>
                        <div
                            className="prose mt-8 max-w-none rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
                            dangerouslySetInnerHTML={{ __html: question.answer_html || '' }}
                        />
                        {question.article && (
                            <p className="mt-8 text-slate-700">
                                Esta resposta gerou um artigo no blog:{' '}
                                <Link
                                    href={`/blog/posts/${question.article.slug}`}
                                    className="font-semibold text-[#0b3d91]"
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
