import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import { User } from '@/types';

const PENDING = new Set(['queued', 'pending', 'researching']);

type ExpertPayload = {
    uuid: string;
    status: string;
    quality_score?: number | null;
    answer_html?: string | null;
    article?: {
        id: number;
        title: string;
        slug: string;
        status: string;
    } | null;
};

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
    const [live, setLive] = useState<ExpertPayload | null>(null);

    const status = live?.status ?? question.status;
    const answerHtml = live?.answer_html ?? question.answer_html;
    const qualityScore = live?.quality_score ?? question.quality_score;
    const article = live?.article ?? question.article;
    const processing = PENDING.has(status);
    const failed = status === 'rejected';

    useEffect(() => {
        if (!PENDING.has(question.status) || !window.Echo) {
            return;
        }

        const channelName = `AskExpert.${question.uuid}`;
        const channel = window.Echo.channel(channelName);

        channel.listen('.ask-expert.ready', (payload: ExpertPayload) => {
            setLive(payload);
        });

        return () => {
            window.Echo.leave(channelName);
        };
    }, [question.uuid, question.status]);

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
                        {!processing && !failed && (
                            <p className="mt-2 text-sm text-slate-500">
                                Qualidade estimada: {qualityScore ?? '—'}
                            </p>
                        )}

                        {processing ? (
                            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                                <p className="text-lg font-medium text-[#14213d]">A preparar a sua resposta…</p>
                                <p className="mt-2 text-slate-600">
                                    Estamos a pesquisar fontes e a organizar a informação. Assim que estiver pronta,
                                    aparece aqui automaticamente.
                                    {question.asker_email
                                        ? ' Também enviamos o resultado para o seu email.'
                                        : ''}
                                </p>
                            </div>
                        ) : failed ? (
                            <div className="mt-8 rounded-3xl bg-rose-50 p-6 text-rose-900 ring-1 ring-rose-100">
                                <p className="text-lg font-medium">Não foi possível gerar a resposta agora.</p>
                                <p className="mt-2 text-sm text-rose-800/90">
                                    Tente novamente dentro de momentos ou reformule a pergunta.
                                </p>
                                <Link
                                    href="/pergunte-ao-especialista"
                                    className="mt-4 inline-block text-sm font-semibold text-[#0b3d91] underline"
                                >
                                    Nova pergunta
                                </Link>
                            </div>
                        ) : (
                            <div
                                className="prose blog-prose mt-8 max-w-none rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
                                dangerouslySetInnerHTML={{ __html: answerHtml || '' }}
                            />
                        )}

                        {article && (
                            <p className="mt-8 text-slate-700">
                                Esta resposta gerou um artigo no blog:{' '}
                                <Link
                                    href={`/blog/posts/${article.slug}`}
                                    className="font-semibold text-[#0b3d91] underline"
                                >
                                    {article.title}
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
