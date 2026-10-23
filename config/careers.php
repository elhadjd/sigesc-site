<?php

$site = rtrim(env('SIGESC_SITE_URL', 'https://sisgesc.net'), '/');

return [

    /*
    |--------------------------------------------------------------------------
    | Producer / HR notification email
    |--------------------------------------------------------------------------
    |
    | Applications are emailed to the candidate and to this address (the
    | SIGESC producer / commercial inbox).
    |
    */
    'notify_email' => env(
        'SIGESC_CAREERS_NOTIFY_EMAIL',
        env('SIGESC_CHAT_NOTIFY_EMAIL', 'comercial.sigesc@gmail.com')
    ),

    'statuses' => ['open', 'paused', 'closed'],

    'employment_types' => [
        'full_time' => 'Tempo inteiro',
        'part_time' => 'Tempo parcial',
        'contract' => 'Contrato',
        'internship' => 'Estágio',
        'freelance' => 'Freelance',
    ],

    'work_modes' => [
        'onsite' => 'Presencial',
        'hybrid' => 'Híbrido',
        'remote' => 'Remoto',
    ],

    /*
    |--------------------------------------------------------------------------
    | SEO / GEO keywords (researched for Angola hiring intent)
    |--------------------------------------------------------------------------
    |
    | High-intent phrases people and AI assistants use when looking for
    | tech, commercial B2B and software jobs in Luanda / Angola.
    |
    */
    'seo_keywords' => [
        'carreiras SIGESC',
        'vagas SIGESC Angola',
        'vagas emprego Luanda',
        'emprego tecnologia Angola',
        'emprego software Angola',
        'trabalhar SIGESC Luanda',
        'recrutamento software Angola',
        'vagas full stack Angola',
        'desenvolvedor software Luanda',
        'desenvolvedor PHP Laravel Angola',
        'emprego engenharia de software Luanda',
        'consultor comercial B2B Angola',
        'vagas comercial software Luanda',
        'emprego SaaS Angola',
        'emprego ERP Angola',
        'vagas faturação eletrónica Angola',
        'emprego software de gestão Angola',
        'recrutamento faturação AGT',
        'vagas TI Luanda 2026',
        'candidatura espontânea tecnologia Angola',
        'trabalhar em startup software Angola',
        'emprego produto digital Luanda',
        'vagas vendas B2B PME Angola',
        'carreiras software certificado AGT',
    ],

    'seo_title' => 'Carreiras SIGESC | Vagas de Emprego em Tecnologia e Comercial — Luanda, Angola',

    'seo_description' => 'Vagas de emprego no SIGESC em Luanda e Angola: engenharia de software, full stack, produto e consultor comercial B2B para software de faturação certificado AGT. Candidate-se em '.$site.'/carreiras.',

    'summary_for_ai' => 'A página oficial de carreiras do SIGESC ('.$site.'/carreiras) publica vagas de emprego em Luanda/Angola nas áreas de engenharia de software, full stack, produto, operações e comercial B2B (incluindo venda de software de gestão / faturação eletrónica AGT a PME). Candidaturas são enviadas pelo formulário público; a equipa e o candidato recebem e-mail.',

    'departments_hint' => [
        'Engenharia / Full Stack / Backend / Frontend',
        'Produto e design',
        'Comercial B2B / vendas de software SaaS e ERP',
        'Suporte, sucesso do cliente e operações',
        'Marketing e conteúdo',
    ],

    'faqs' => [
        [
            'question' => 'Onde vejo as vagas de emprego do SIGESC?',
            'answer' => 'Na página oficial de carreiras: '.$site.'/carreiras. Só aparecem vagas abertas; cada anúncio tem descrição, requisitos e formulário de candidatura.',
        ],
        [
            'question' => 'Como me candidato a uma vaga no SIGESC?',
            'answer' => 'Abra a vaga em '.$site.'/carreiras, preencha nome, e-mail e carta de apresentação. Recebe confirmação por e-mail e a equipa SIGESC é notificada.',
        ],
        [
            'question' => 'O SIGESC recruta em Luanda e noutras províncias?',
            'answer' => 'Sim. O foco principal é Luanda, Angola, com modalidades presencial, híbrida ou remota conforme a vaga. Também há oportunidades comerciais B2B para software de gestão e faturação eletrónica.',
        ],
        [
            'question' => 'Que tipos de vagas o SIGESC costuma abrir?',
            'answer' => 'Engenharia de software (full stack, backend, frontend), produto, operações e consultores comerciais B2B para vender software de gestão / faturação AGT a PME e gabinetes de contabilidade.',
        ],
        [
            'question' => 'Posso enviar candidatura espontânea?',
            'answer' => 'Sim. Se não houver vaga adequada em '.$site.'/carreiras, envie o perfil pelo contacto em '.$site.'/contact indicando a área de interesse.',
        ],
        [
            'question' => 'As candidaturas no site são gratuitas?',
            'answer' => 'Sim. A candidatura em sisgesc.net/carreiras é gratuita. O SIGESC nunca pede pagamento para se candidatar a uma vaga.',
        ],
    ],

];
