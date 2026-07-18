import { FiShoppingCart, FiPackage, FiUsers, FiTruck, FiCalendar, FiBarChart2, FiShoppingBag, FiDollarSign, FiGlobe } from "react-icons/fi";

export const features = [
    {
        icon: FiShoppingCart,
        className: "text-lg",
        desc: "Gerencie vendas, clientes e produtos com eficiência em um sistema completo.",
        name: "Ponto de Venda",
        color: "blue",
        href: route('modules', { module: 'ponto de venda' })
    },
    {
        icon: FiPackage,
        className: "text-lg",
        desc: "Tenha controle total do inventário e dos níveis de estoque.",
        name: "Gestão de Estoque",
        color: "green",
        href: route('modules', { module: 'gestao de stock' })
    },
    {
        icon: FiUsers,
        className: "text-lg",
        desc: "Administre funcionários e equipes de forma prática.",
        name: "Gestão de Funcionários",
        color: "purple",
        href: route('modules', { module: 'gestao de funcionarios' })
    },
    {
        icon: FiTruck,
        className: "text-lg",
        desc: "Otimize processos logísticos e melhore a eficiência.",
        name: "Logística",
        color: "orange",
        href: route('modules', { module: 'logisticas' })
    },
    {
        icon: FiCalendar,
        className: "text-lg",
        desc: "Agende tarefas e compromissos com facilidade.",
        name: "Agendamentos",
        color: "pink",
        href: route('modules', { module: 'agendamentos' })
    },
    {
        icon: FiBarChart2,
        className: "text-lg",
        desc: "Analise dados e gere relatórios de desempenho detalhados.",
        name: "Marketing",
        color: "red",
        href: route('modules', { module: 'marketing' })
    },
    {
        icon: FiShoppingBag,
        className: "text-lg",
        desc: "Crie e gerencie sua loja virtual de maneira simples.",
        name: "Loja Virtual",
        color: "indigo",
        href: route('modules', { module: 'loja virtual' })
    },
    {
        icon: FiDollarSign,
        className: "text-lg",
        desc: "Gerencie finanças e contabilidade com ferramentas completas.",
        name: "Gestao Financeira",
        color: "emerald",
        href: route('modules', { module: 'Gestao Financeira' })
    },
    {
        icon: FiDollarSign,
        className: "text-lg",
        desc: "Emita faturas, gerencie clientes e controle financeiro de forma integrada.",
        name: "Faturamento",
        color: "teal",
        href: route('modules', { module: 'faturamento' })
    },
    {
        icon: FiShoppingCart,
        className: "text-lg",
        desc: "Gerencie compras e suprimentos de maneira eficiente.",
        name: "Compras",
        color: "blue",
        href: route('modules', { module: 'gestao de compras' })
    },
    {
        icon: FiGlobe,
        className: "text-lg",
        desc: "Venda online sem stock próprio: fornecedores, encomendas e entregas integradas.",
        name: "Dropshipping",
        color: "cyan",
        href: route('modules', { module: 'dropshipping' })
    }
];


export const performanceMetrics = [
    { number: "500+", label: "Clientes Ativos" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Suporte" },
    { number: "100%", label: "Satisfação" }
];


export const moduleData = {
    faturamento: {
        title: "Software de Faturamento SIGESC | Sistema de Gestão Fiscal Automatizado",
        description: "Automatize seu faturamento com o software SIGESC. Emissão de NF-e, relatórios fiscais, controle financeiro e gestão tributária para empresas de todos os tamanhos.",
        keywords: "software faturamento, sistema de faturamento, emissão nf-e, gestão fiscal, controle financeiro, relatórios fiscais, automação fiscal, sigesc, gestão tributária",
        heroTitle: "Software de Faturamento Automatizado para sua Empresa",
        heroSubtitle: "Sistema de gestão fiscal completo com emissão de NF-e, relatórios automáticos e controle financeiro integrado.",
        images: [
            "/img/billing/SIGESC Software de Gestao Empresarial .png",
            "/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png",
            "/img/billing/SIGESC Software de Gestao Empresarial Lista de faturas.png",
            "/img/billing/SIGESC Software de Gestao Empresarial emissao-de-fatura.png"
        ],
        imageAlts: [
            "Software de faturamento SIGESC - Dashboard profissional de gestão fiscal",
            "Sistema de faturamento empresarial - Controle financeiro completo",
            "Relatórios fiscais automatizados - Gestão tributária eficiente",
            "Emissão de notas fiscais eletrônicas - NF-e rápida e segura"
        ],
        features: [
            {
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                title: "Emissão de NF-e",
                description: "Emissão rápida de notas fiscais eletrônicas com validade legal e armazenamento seguro."
            },
            {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
                title: "Gestão Financeira",
                description: "Controle completo de contas a receber, fluxo de caixa "
            },
            {
                icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                title: "Relatórios Fiscais",
                description: "Geração automática de relatórios fiscais detalhados para facilitar a tomada de decisões."
            },

        ],
        benefits: [
            {
                number: "01",
                title: "Conformidade Fiscal Garantida",
                description: "Atualizações automáticas conforme mudanças na legislação tributária."
            }
        ]
    },
    pontodevenda: {
        title: "Sistema PDV SIGESC | Ponto de Venda Completo para seu Negócio em Angola",
        description: "Sistema de ponto de venda completo com gestão de estoque, clientes, múltiplos pagamentos e relatórios integrados. Solução ideal para varejo em Angola.",
        keywords: "sistema pdv angola, ponto de venda, software pdv, gestão de vendas, sigesc pdv, caixa registradora, multi pagamentos, gestão stock",
        heroTitle: "Potencialize suas vendas com nosso Ponto de Venda",
        heroSubtitle: "Solução intuitiva e poderosa para simplificar suas operações de venda e impulsionar seus resultados em Angola.",
        images: [
            "/img/point-of-sale/SIGESC Software de Gestao Empresarial Pdv Pos Ponto de venda Software gratuito.png",
            "/img/point-of-sale/software de gestao angola pdv-vendas-rapidas.png",
            "/img/point-of-sale/software de gestao angola Gestao de promocoes e descontos.png",
            "/img/point-of-sale/software de gestao angola pdv-multi-pagamentos.png"
        ],
        imageAlts: [
            "Interface do Módulo Ponto de Venda SIGESC - Sistema completo de gestão de vendas",
            "Processamento rápido de vendas - Interface otimizada para agilidade",
            "Relatórios detalhados de vendas - Gestão de promoções e descontos",
            "Sistema de múltiplos pagamentos - Cartões, dinheiro, transferência"
        ],
        features: [
            {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                title: "Processamento Rápido",
                description: "Finalize vendas em segundos com interface otimizada para agilidade."
            },
            {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Movimento de Caixa",
                description: "Registro de entradas, saídas e gastos diretamente do PDV com controle total do fluxo de caixa."
            },
            {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Múltiplos Pagamentos",
                description: "Aceite cartões, dinheiro, transferência e outros métodos de pagamento."
            },
            {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "Relatórios Detalhados",
                description: "Acesse análises completas de vendas e desempenho do seu negócio."
            },
            {
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                title: "Gestão de Stock Integrada",
                description: "Controle automático de inventário com atualização em tempo real."
            },
            {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Gestão de Clientes",
                description: "Cadastro completo de clientes com histórico de compras e preferências."
            }
        ],
        benefits: [
            {
                number: "01",
                title: "Interface Intuitiva",
                description: "Design pensado para facilidade de uso, reduzindo o tempo de treinamento e aumentando a produtividade da sua equipe."
            },
            {
                number: "02",
                title: "Integração Completa",
                description: "Conecte-se com outros módulos do SIGESC para uma gestão empresarial integrada e eficiente."
            },
            {
                number: "03",
                title: "Suporte Técnico Local",
                description: "Equipe especializada em Angola pronta para ajudar você a resolver qualquer desafio rapidamente."
            },
            {
                number: "04",
                title: "Atualizações Constantes",
                description: "Sistema em evolução contínua, sempre com novas funcionalidades e melhorias específicas para o mercado angolano."
            },
            {
                number: "05",
                title: "Segurança e Confiabilidade",
                description: "Sistema robusto com backup automático e proteção de dados para garantir a continuidade do seu negócio."
            },
            {
                number: "06",
                title: "Multi-empresa",
                description: "Gerencie múltiplos estabelecimentos em uma única plataforma com controle centralizado."
            }
        ],
        additionalContent: {
            ctaTitle: "Pronto para transformar suas vendas?",
            ctaDescription: "Experimente gratuitamente nosso módulo de Ponto de Venda e descubra como podemos impulsionar seu negócio em Angola.",
            ctaButtons: [
                {
                    text: "Falar com Especialista",
                    link: "/contact",
                    variant: "primary"
                },
                {
                    text: "Testar Grátis",
                    link: "https://admin.sisgesc.net/getting-started",
                    variant: "secondary",
                    external: true
                }
            ]
        }
    },
    gestaodestock: {
        title: "Sistema de Gestão de Stock SIGESC | Controle Total de Inventário em Angola",
        description: "Software completo para gestão de stock com controle de entradas, saídas, inventário em tempo real, alertas automáticos e relatórios detalhados para empresas em Angola.",
        keywords: "gestão stock angola, controle inventário, software estoque, sigesc stock, inventário automático, alertas stock, relatórios inventário, gestão armazém",
        heroTitle: "Gestão Inteligente de Stock para seu Negócio",
        heroSubtitle: "Controle completo do inventário com alertas automáticos, relatórios detalhados e integração total em tempo real.",
        images: [
        "/img/stock/Sigesc software de gestao comercial gratis gestao de stock.png",
        "/img/stock/Sigesc software de gestao comercial gratis controle-inventario.png",
        "/img/stock/Sigesc software de gestao comercial gratis gestao de tranferencia de produtos entre armagens.png",
        "/img/stock/Sigesc software de gestao comercial gratis relatorios-stock.png",
        "/img/stock/Sigesc software de gestao comercial gratis Gestao de variants e attributes.png"
        ],
        imageAlts: [
        "Dashboard de Gestão de Stock SIGESC - Visão completa do inventário",
        "Controle de movimentações - Entradas e saídas em tempo real",
        "Sistema de alertas automáticos - Stock mínimo e vencimentos",
        "Relatórios detalhados de inventário - Análises e métricas",
        "Sigesc software de gestao comercial gratis Gestao de variants e attributes"
        ],
        features: [
        {
            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
            title: "Controle de Inventário",
            description: "Gestão completa de entradas, saídas e saldo em tempo real com atualização automática."
        },
        {
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            title: "Alertas Inteligentes",
            description: "Notificações automáticas para stock mínimo, produtos perto do vencimento e reposição."
        },
        {
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            title: "Relatórios Detalhados",
            description: "Análises completas de movimentação, giro de stock, rentabilidade e performance."
        },
        {
            icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
            title: "Integração Total",
            description: "Conexão automática com PDV, compras e financeiro para fluxo contínuo de informações."
        },
        {
            icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
            title: "Controlo de Validades",
            description: "Gestão de prazos de validade com alertas para produtos perto do vencimento."
        },
        {
            icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
            title: "Gestão de Categorias",
            description: "Organização por categorias, subcategorias e múltiplos armazéns ou locais."
        },
        {
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
            title: "Códigos de Barras",
            description: "Suporte a leitura e geração de códigos de barras para produtos."
        },
        {
            icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Stock Mínimo/Máximo",
            description: "Definição de níveis ideais de stock para cada produto com alertas automáticos."
        }
        ],
        benefits: [
        {
            number: "01",
            title: "Redução de Perdas",
            description: "Diminua em até 40% as perdas por vencimento e obsolescência com controlo rigoroso."
        },
        {
            number: "02",
            title: "Optimização de Capital",
            description: "Mantenha os níveis ideais de stock, evitando excessos ou rupturas de inventário."
        },
        {
            number: "03",
            title: "Processos Automatizados",
            description: "Automatize entradas, saídas e transferências entre armazéns com poucos cliques."
        },
        {
            number: "04",
            title: "Decisões Inteligentes",
            description: "Baseie suas decisões em relatórios precisos sobre giro de stock e rentabilidade."
        },
        {
            number: "05",
            title: "Integração Completa",
            description: "Ligação total com vendas, compras e financeiro para operação sincronizada."
        },
        {
            number: "06",
            title: "Multi-armazém",
            description: "Gerencie múltiplos locais de armazenagem com controlo centralizado e transferências."
        },
        {
            number: "07",
            title: "Mobile Access",
            description: "Acesse e actualize seu inventário de qualquer lugar através de dispositivos móveis."
        },
        {
            number: "08",
            title: "Customização Total",
            description: "Adapte campos, categorias e relatórios às necessidades específicas do seu negócio."
        }
        ],
        stats: [
        { value: "98%", label: "Precisão no Inventário" },
        { value: "40%", label: "Redução de Perdas" },
        { value: "65%", label: "Economia de Tempo" },
        { value: "100%", label: "Disponibilidade 24/7" }
        ],
        additionalContent: {
        ctaTitle: "Pronto para revolucionar sua gestão de stock?",
        ctaDescription: "Experimente gratuitamente nosso módulo de Gestão de Stock e optimize seu inventário.",
        ctaButtons: [
            {
            text: "Falar com Especialista",
            link: "/contact",
            variant: "primary"
            },
            {
            text: "Testar Online",
            link: "https://admin.sisgesc.net/getting-started",
            variant: "secondary",
            external: true
            },
            {
            text: "Baixar Setup",
            link: "/downloads/sigesc-stock-setup.exe",
            variant: "success",
            download: true
            }
        ],
        specifications: [
            "Suporte a múltiplos armazéns e locais",
            "Controlo de lotes e números de série",
            "Gestão de prazos de validade",
            "Integração com leitores de código de barras",
            "Relatórios personalizáveis",
            "App móvel para inventário",
            "Backup automático na nuvem"
        ]
        }
    },
    gestaodefuncionarios: {
        title: "Sistema de Gestão de Funcionários SIGESC | RH Completo para Empresas em Angola",
        description: "Software completo para gestão de recursos humanos com controlo de ponto, folha de pagamento, benefícios, avaliações de desempenho e compliance trabalhista angolano.",
        keywords: "gestão funcionários angola, software rh, folha pagamento, controlo ponto, sigesc rh, gestão pessoal, compliance trabalhista, avaliação desempenho",
        heroTitle: "Gestão Completa de Recursos Humanos",
        heroSubtitle: "Centralize a gestão da sua equipa com controlo de ponto, folha de pagamento, benefícios e avaliações de desempenho integradas.",
        images: [
        "/img/employee/sigesc controlo-ponto.png",
        "/img/employee/sigesc gestao-funcionarios-dashboard.png",
        "/img/employee/sigesc folha-pagamento.png",
        "/img/employee/sigesc Calculo de horas e salarios.png",
        "/img/employee/sigesc pagamentos de funcionarios.png"
        ],
        imageAlts: [
        "Controlo de ponto eletrónico - Registro de entradas e saídas",
        "Dashboard de Gestão de Funcionários SIGESC - Visão completa da equipa",
        "Sistema de folha de pagamento - Cálculos automáticos e relatórios",
        "Gestao de calculo de horas e salários - Horas extras e banco de horas",
        "Gestao de pagamentos de funcionarios - Processamento de salários e benefícios"
        ],
        features: [
        {
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            title: "Cadastro Completo",
            description: "Ficha completa de funcionários com dados pessoais, profissionais, documentos e histórico."
        },
        {
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Controlo de Ponto",
            description: "Registro eletrónico de entradas, saídas, horas extras e banco de horas com relatórios."
        },
        {
            icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
            title: "Folha de Pagamento",
            description: "Cálculo automático de salários, descontos, impostos e benefícios conforme lei angolana."
        },
        // {
        //     icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        //     title: "Avaliação de Desempenho",
        //     description: "Sistema de avaliações periódicas com métricas personalizáveis e feedback contínuo."
        // },
        {
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-8 0h4",
            title: "Gestão de Benefícios",
            description: "Administração de vale transporte, alimentação, saúde e outros benefícios."
        },
        // {
        //     icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
        //     title: "Documentos e Compliance",
        //     description: "Gestão de contratos, documentos obrigatórios e compliance com a legislação trabalhista."
        // },
        // {
        //     icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
        //     title: "Recrutamento e Seleção",
        //     description: "Gestão de candidaturas, processos seletivos e onboarding de novos colaboradores."
        // },
        // {
        //     icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
        //     title: "Plano de Carreira",
        //     description: "Definição de cargos, salários, progressões e planos de desenvolvimento individual."
        // }
        ],
        benefits: [
            // {
            //     number: "01",
            //     title: "Conformidade Legal",
            //     description: "Total compliance com a legislação trabalhista angolana e normas do Ministério do Trabalho."
            // },
            {
                number: "01",
                title: "Redução de Erros",
                description: "Cálculos automáticos eliminam erros manuais em folha de pagamento e benefícios."
            },
            {
                number: "02",
                title: "Economia de Tempo",
                description: "Automatize processos manuais e reduza em 70% o tempo gasto com tarefas de RH."
            },
            {
                number: "03",
                title: "Transparência Total",
                description: "Funcionários acessam seus dados, holerites e benefícios através do portal self-service."
            },
            // {
            //     number: "05",
            //     title: "Gestão de Performance",
            //     description: "Acompanhe e melhore o desempenho da equipa com métricas e avaliações objetivas."
            // },
            // {
            //     number: "06",
            //     title: "Multi-empresa",
            //     description: "Gerencie múltiplas empresas e filiais em uma única plataforma centralizada."
            // },
            {
                number: "04",
                title: "Segurança de Dados",
                description: "Proteção avançada de dados sensíveis com criptografia e backups automáticos."
            },
            {
                number: "05",
                title: "Mobile Access",
                description: "Registro de ponto e acesso a informações via aplicativo móvel."
            }
        ],
        stats: [
            { value: "100%", label: "Compliance Legal" },
            { value: "70%", label: "Economia de Tempo" },
            { value: "0", label: "Erros na Folha" },
            { value: "24/7", label: "Accesso Mobile" }
        ],
        additionalContent: {
            ctaTitle: "Pronto para modernizar sua gestão de RH?",
            ctaDescription: "Experimente gratuitamente nosso módulo de Gestão de Funcionários e transforme sua administração de pessoal.",
            ctaButtons: [
                {
                text: "Agendar Demonstração",
                link: "/contact",
                variant: "primary"
                },
                {
                text: "Testar Online",
                link: "https://admin.sisgesc.net/getting-started",
                variant: "secondary",
                external: true
                },
                {
                text: "Baixar Setup RH",
                link: "/downloads/sigesc-rh-setup.exe",
                variant: "success",
                download: true
                }
            ],
            specifications: [
                "Folha de pagamento conforme lei angolana",
                "Controlo de ponto eletrónico biométrico",
                "Portal self-service para funcionários",
                "Gestão de férias e licenças",
                "Relatórios de encargos sociais",
                "App móvel para registro de ponto",
                "Backup automático na nuvem"
            ],
            legalCompliance: [
                "Lei Geral do Trabalho de Angola",
                "Regulamento do IVA",
                "Normas da Segurança Social",
                "Diretrizes do Ministério do Trabalho"
            ]
        }
    },
     logisticas: {
        title: "Sistema de Gestão Logística SIGESC | Supply Chain Completo para Angola",
        description: "Software completo para gestão logística com controlo de transportes, rotas, entregas, frota e cadeia de suprimentos optimizada para empresas em Angola.",
        keywords: "gestão logística angola, software transporte, controlo entregas, gestão frota, sigesc logística, rotas optimizadas, supply chain, cadeia suprimentos",
        heroTitle: "Gestão Logística Inteligente e Eficiente",
        heroSubtitle: "Optimize sua cadeia de suprimentos com controlo de transportes, rotas inteligentes, gestão de frota e entregas em tempo real.",
        images: [
        "/img/logistics/SIGESC Software de Gestao Empresarial Logistica Transporte Frota Entregas Rotas.png",
        "/img/logistics/SIGESC Software de Gestao Empresarial Logistica gestao de alertas automaticas.png",
        "/img/logistics/SIGESC Software de Gestao Empresarial Logistica Mudanca de status da entrega.png",
        "/img/logistics/SIGESC Software de Gestao Empresarial Logistica Acompanhamento em tempo real.png",
        "/img/logistics/SIGESC Software de Gestao Empresarial Logistica gestao de frota.png"
        ],
        imageAlts: [
        "Dashboard de Gestão Logística SIGESC - Visão completa da cadeia de suprimentos",
        "Sistema de gestão de transportes - Controlo de veículos e motoristas",
        "Controlo de entregas em tempo real - Tracking e status das entregas",
        "Optimização de rotas inteligentes - Menor custo e tempo de entrega",
        "Gestão completa de frota - Manutenção, custos e documentação"
        ],
        features: [
        {
            icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
            title: "Gestão de Transportes",
            description: "Controlo completo de veículos, motoristas, rotas e custos de transporte."
        },
        {
            icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
            title: "Rastreamento de Entregas",
            description: "Tracking em tempo real de entregas com atualizações de status e localização."
        },
        {
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
            title: "Optimização de Rotas",
            description: "Planeamento inteligente de rotas para menor custo e tempo de entrega."
        },
        // {
        //     icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        //     title: "Gestão de Frota",
        //     description: "Controlo de manutenção, seguros, documentação e custos da frota."
        // },
        {
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Controlo de Prazos",
            description: "Gestão de prazos de entrega, SLA's e performance logística."
        },
        {
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
            title: "Custos Logísticos",
            description: "Análise detalhada de custos de transporte, armazenagem e distribuição."
        },
        {
            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
            title: "Integração Stock-Entregas",
            description: "Conexão automática entre gestão de stock e processos de entrega."
        },
        {
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            title: "Alertas Automáticos",
            description: "Notificações para atrasos, problemas de rota e necessidades de manutenção."
        }
        ],
        benefits: [
        {
            number: "01",
            title: "Redução de Custos",
            description: "Diminua em até 30% os custos logísticos com rotas optimizadas e gestão eficiente."
        },
        {
            number: "02",
            title: "Entregas mais Rápidas",
            description: "Tempo de entrega reduzido em 40% com planeamento inteligente de rotas."
        },
        {
            number: "03",
            title: "Visibilidade Total",
            description: "Acompanhamento em tempo real de todas as entregas e veículos."
        },
        {
            number: "04",
            title: "Optimização de Rotas",
            description: "Algoritmos inteligentes para menor distância, tempo e consumo de combustível."
        },
        {
            number: "05",
            title: "Gestão Preventiva",
            description: "Alertas para manutenção preventiva da frota e redução de avarias."
        },
        {
            number: "06",
            title: "Integração Completa",
            description: "Conexão total com stock, vendas e faturação para operação sincronizada."
        },
        {
            number: "07",
            title: "Relatórios Avançados",
            description: "Análises de performance, custos e eficiência logística."
        },
        {
            number: "08",
            title: "Mobile Tracking",
            description: "App para motoristas com navegação, registro de entregas e comunicação."
        }
        ],
        stats: [
        { value: "30%", label: "Redução de Custos" },
        { value: "40%", label: "Entrega mais Rápida" },
        { value: "100%", label: "Rastreamento" },
        { value: "24/7", label: "Monitorização" }
        ],
        additionalContent: {
        ctaTitle: "Pronto para optimizar sua cadeia logística?",
        ctaDescription: "Experimente gratuitamente nosso módulo de Logística e transforme sua gestão de transportes e entregas.",
        ctaButtons: [
            {
            text: "Agendar Demonstração",
            link: "/contact",
            variant: "primary"
            },
            {
            text: "Testar Online",
            link: "https://admin.sisgesc.net/getting-started",
            variant: "secondary",
            external: true
            },
            {
            text: "Baixar Setup Logística",
            link: "/downloads/sigesc-logistica-setup.exe",
            variant: "success",
            download: true
            }
        ],
        specifications: [
            "Gestão de múltiplos armazéns e centros",
            "Optimização de rotas com tráfego em tempo real",
            "Integração com GPS e sistemas de navegação",
            "Controlo de combustível e consumíveis",
            "Relatórios de performance de motoristas",
            "App móvel para motoristas e clientes",
            "Backup automático na nuvem"
        ],
        integrationFeatures: [
            "Conexão com módulo de Stock",
            "Integração com PDV e vendas",
            "Sync com fornecedores e clientes",
            "API para transportadoras externas"
        ]
        }
    },

    agendamentos: {
        title: "Sistema de Agendamentos SIGESC | Gestão de Marcções e Agenda Online",
        description: "Software completo para gestão de agendamentos, marcações online, confirmações automáticas e organização de agenda para serviços em Angola.",
        keywords: "sistema agendamentos angola, marcações online, agenda digital, gestão agenda, sigesc agendamentos, booking online, confirmações automáticas, lembretes",
        heroTitle: "Gestão Inteligente de Agendamentos e Marcações",
        heroSubtitle: "Automatize suas marcações com agenda online, confirmações automáticas, lembretes e organização eficiente da sua equipa.",
        images: [
            "/img/appointment/Dashboard de Agendamentos SIGESC Visao completa da agenda.png",
            "/img/appointment/agenda-online.png",
            "/img/appointment/confirmacoes-automaticas.png",
            "/img/appointment/Cancelar agendamento.png",
        ],
        imageAlts: [
        "Dashboard de Agendamentos SIGESC - Visão completa da agenda",
        "Sistema de marcações online - Reservas em tempo real",
        "Confirmações automáticas - email automáticos",
        "Gestão de cancelamentos - Remarcações fáceis",
        ],
        features: [
        {
            icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            title: "Agenda Online",
            description: "Sistema de marcações online disponível 24/7 com slots de tempo personalizáveis."
        },
        {
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Lembretes Automáticos",
            description: "Confirmações via WhatsApp e email para reduzir faltas e melhorar atendimento."
        },
        {
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            title: "Gestão de Recursos",
            description: "Alocação inteligente de profissionais, salas e equipamentos para cada agendamento."
        },
        {
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
            title: "Pagamentos Online",
            description: "Sistema integrado de pagamentos para reservas antecipadas e confirmações."
        },
        {
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            title: "Cancelamentos e Remarcações",
            description: "Gestão flexível de cancelamentos, remarcações e políticas de agendamento."
        },
        {
            icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
            title: "Calendário Multi-equipa",
            description: "Visualização unificada de múltiplos profissionais e recursos em agenda única."
        },
        {
            icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Bloqueios de Agenda",
            description: "Gestão de feriados, férias e bloqueios de horários não disponíveis."
        },
        {
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            title: "Relatórios de Ocupação",
            description: "Análise de taxa de ocupação, performance e eficiência dos agendamentos."
        }
        ],
        benefits: [
        {
            number: "01",
            title: "Redução de Faltas",
            description: "Diminua em até 80% as faltas com lembretes automáticos e confirmações."
        },
        {
            number: "02",
            title: "Agenda 24/7",
            description: "Clientes marcam horários a qualquer hora, mesmo fora do expediente."
        },
        {
            number: "03",
            title: "Otimização de Recursos",
            description: "Aproveitamento máximo da capacidade da equipa e infraestrutura."
        },
        {
            number: "04",
            title: "Experiência do Cliente",
            description: "Processo de marcação simplificado e profissional para clientes."
        },
        {
            number: "05",
            title: "Pagamento Antecipado",
            description: "Redução de cancelamentos com sistema de pagamentos antecipados."
        },
        {
            number: "06",
            title: "Gestão Multi-locais",
            description: "Controle de várias filiais ou locais de atendimento em agenda única."
        },
        {
            number: "07",
            title: "Integração Completa",
            description: "Conexão com CRM, faturação e gestão de clientes."
        },
        {
            number: "08",
            title: "Mobile Access",
            description: "App para profissionais e clientes gerirem agendamentos em mobilidade."
        }
        ],
        stats: [
        { value: "80%", label: "Redução de Faltas" },
        { value: "50%", label: "Economia de Tempo" },
        { value: "24/7", label: "Disponibilidade" },
        { value: "95%", label: "Satisfação Cliente" }
        ],
        additionalContent: {
        ctaTitle: "Pronto para automatizar suas marcações?",
        ctaDescription: "Experimente gratuitamente nosso módulo de Agendamentos e transforme sua gestão de agenda.",
        ctaButtons: [
            {
            text: "Agendar Demonstração",
            link: "/contact",
            variant: "primary"
            },
            {
            text: "Testar Online",
            link: "https://admin.sisgesc.net/getting-started",
            variant: "secondary",
            external: true
            },
            {
            text: "Baixar Setup Agendamentos",
            link: "/downloads/sigesc-agendamentos-setup.exe",
            variant: "success",
            download: true
            }
        ],
        specifications: [
            "Agenda online personalizável",
            "Lembretes por WhatsApp e email",
            "Pagamentos online integrados",
            "Gestão de múltiplos recursos",
            "Relatórios de performance",
            "App móvel para clientes e profissionais",
            "Integração com Google Calendar"
        ],
        integrationFeatures: [
            "Conexão com módulo de Clientes",
            "Integração com sistema de Pagamentos",
            "Sync com calendários externos",
            "API para websites e apps"
        ],
        targetBusinesses: [
            "Clínicas e consultórios médicos",
            "Salões de beleza e estética",
            "Escolas e centros de formação",
            "Serviços técnicos e manutenção",
            "Restaurantes e esplanadas",
            "Advogados e consultores"
        ]
        }
    },

    lojavirtual: {
        title: "Loja Virtual SIGESC | E-commerce Completo para Angola com Entregas",
        description: "Plataforma de e-commerce completa com catálogo online, pagamentos locais, gestão de entregas e integração total com stock e faturação para Angola.",
        keywords: "loja virtual angola, e-commerce, loja online, vendas online, sigesc ecommerce, pagamentos Angola, entregas delivery, catálogo digital",
        heroTitle: "Sua Loja Virtual Completa para Vender em Todo Angola",
        heroSubtitle: "Plataforma de e-commerce com pagamentos locais, gestão de entregas e integração total com seu stock e faturação.",
        images: [
        "/img/e-commerce/loja-virtual-dashboard.png",
        "/img/e-commerce/catalogo-produtos.png",
        "/img/e-commerce/Gestao de entregas e pagamentos.png",
        "/img/e-commerce/Gestao de entregas e logistica Rastreamento em tempo real.png",
        "/img/e-commerce/Edicao de Produtos.png"
        ],
        imageAlts: [
        "Dashboard da Loja Virtual SIGESC - Visão completa das vendas online",
        "Catálogo de produtos digital - Organização por categorias e filtros",
        "Sistema de pagamentos angolanos - Multicaixa, transferências e mais",
        "Gestão de entregas e logística - Rastreamento em tempo real",
        "Edição fácil de produtos - Preços, descrições e imagens"
        ],
        features: [
            {
                icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                title: "Catálogo Digital",
                description: "Catálogo de produtos organizado por categorias, marcas, filtros e busca avançada."
            },
            {
                icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
                title: "Pagamentos Angolanos",
                description: "Multicaixa, transferências bancárias."
            },
            {
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                title: "Gestão de Entregas",
                description: "Cálculo de portes, gestão de transportadoras e rastreamento de encomendas."
            },
            {
                icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
                title: "Mobile First",
                description: "Loja optimizada para mobile com experiência perfeita em smartphones."
            },
            {
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                title: "Stock em Tempo Real",
                description: "Sincronização automática com stock físico e alertas de disponibilidade."
            },
            {
                icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
                title: "Gestão de Clientes",
                description: "Área do cliente, histórico de compras, wishlist e programas de fidelização."
            },
            {
                icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
                title: "Marketing Digital",
                description: "Cupões de desconto, emails marketing, cross-selling e up-selling."
            },
            {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "Relatórios Avançados",
                description: "Análise de vendas, tráfego, conversão e performance dos produtos."
            }
        ],
        benefits: [
        {
            number: "01",
            title: "Vendas 24/7",
            description: "Receba pedidos a qualquer hora, mesmo fora do horário comercial."
        },
        {
            number: "02",
            title: "Alcance Nacional",
            description: "Venda para todo Angola sem limitações geográficas."
        },
        {
            number: "03",
            title: "Pagamentos Locais",
            description: "Multicaixa, transferências e payment links específicos para Angola."
        },
        {
            number: "04",
            title: "Integração Total",
            description: "Sincronização automática com stock, faturação e clientes."
        },
        {
            number: "05",
            title: "Baixo Investimento",
            description: "Custos reduzidos comparado com loja física, com maior alcance."
        },
        {
            number: "06",
            title: "Marketing Digital",
            description: "Ferramentas integradas para promoções, SEO e redes sociais."
        },
        {
            number: "07",
            title: "Mobile Optimized",
            description: "Experiência perfeita para compras por smartphone."
        },
        {
            number: "08",
            title: "Segurança",
            description: "Loja segura com SSL, backups e proteção de dados."
        }
        ],
        stats: [
            { value: "24/7", label: "Vendas Contínuas" },
            { value: "100%", label: "Integração Stock" },
            { value: "50%", label: "Economia vs Física" },
            { value: "30%", label: "Crescimento Online" }
            ],
            additionalContent: {
            ctaTitle: "Pronto para lançar sua loja virtual?",
            ctaDescription: "Experimente gratuitamente nosso módulo de E-commerce e comece a vender online hoje mesmo.",
            ctaButtons: [
                {
                text: "Ver Demonstração",
                link: "/demo-loja",
                variant: "primary"
                },
                {
                text: "Testar Plataforma",
                link: "https://admin.sisgesc.net/ecommerce-demo",
                variant: "secondary",
                external: true
                },
                {
                text: "Baixar Setup E-commerce",
                link: "/downloads/sigesc-ecommerce-setup.exe",
                variant: "success",
                download: true
                }
            ],
            specifications: [
                "Design responsive e mobile-first",
                "Integração com Multicaixa e pagamentos locais",
                "Gestão de transportadoras angolanas",
                "SEO optimizado para motores de busca",
                "Backup automático e segurança SSL",
                "App mobile para gestão de pedidos",
                "Suporte técnico especializado"
            ],
            paymentMethods: [
                "Multicaixa Express",
                "Transferências bancárias",
                "Dinheiro na entrega",
                "Débito directo"
            ],
            shippingOptions: [
                "Expresso Angola",
                "TAAG Logistics",
                "Transportadoras locais",
                "Retirada em loja",
                "Entregas próprias"
            ],
            targetBusinesses: [
                "Lojas de moda e vestuário",
                "Electrónica e tecnologia",
                "Produtos para casa",
                "Beleza e cosméticos",
                "Alimentação e bebidas",
                "Artigos desportivos"
            ]
        }
    },

    gestaofinanceira: {
        title: "Sistema de Gestão Financeira SIGESC | Controlo Financeiro Completo para Angola",
        description: "Software completo para gestão financeira com fluxo de caixa, contas a pagar/receber, relatórios fiscais, budget e compliance fiscal angolano.",
        keywords: "gestão financeira angola, fluxo caixa, contas pagar receber, relatórios fiscais, sigesc financeiro, budget controlo, compliance fiscal, gestão tesouraria",
        heroTitle: "Controlo Financeiro Completo para seu Negócio",
        heroSubtitle: "Gerencie seu fluxo de caixa, contas, relatórios fiscais e tome decisões financeiras inteligentes com dados em tempo real.",
        images: [
        "/img/finance/gestao-financeira-dashboard.png",
        "/img/finance/Gestao de contas bancarias.png",
        "/img/finance/Fluxo de caixa.png"
        ],
        imageAlts: [
        "Dashboard de Gestão Financeira SIGESC - Visão completa das finanças",
        "Gestão de contas bancárias - Controle total sobre suas contas",
        "Fluxo de caixa - Controlo de entradas e saídas em tempo real",
        ],
        features: [
        {
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            title: "Fluxo de Caixa",
            description: "Controlo diário de entradas, saídas e saldos com projeções futuras automáticas."
        },
        {
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Contas a Pagar/Receber",
            description: "Gestão automatizada de fornecedores, clientes"
        },
        {
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            title: "Relatórios Fiscais",
            description: "Geração automática de IVA, Imposto Industrial, IRPS e obrigações fiscais angolanas."
        },
        {
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
            title: "Controlo Orçamental",
            description: "Planeamento, execução e controlo de budgets por centro de custo."
        },
        {
            icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Tesouraria",
            description: "Gestão de bancos, transferências, aplicações financeiras e posição consolidada."
        },
        // {
        //     icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
        //     title: "Conciliação Bancária",
        //     description: "Importação e conciliação automática de extratos bancários."
        // },
        {
            icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
            title: "Multi-moeda",
            description: "Suporte a USD, EUR e outras moedas com conversão automática."
        },
        {
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            title: "Analytics Financeiro",
            description: "Dashboards interativos com KPIs financeiros e indicadores de performance."
        }
        ],
        benefits: [
        {
            number: "01",
            title: "Controlo Total",
            description: "Visão completa da saúde financeira da empresa em tempo real."
        },
        {
            number: "02",
            title: "Conformidade Fiscal",
            description: "Relatórios automáticos conforme legislação fiscal angolana."
        },
        {
            number: "03",
            title: "Redução de Erros",
            description: "Processos automatizados eliminam erros manuais em cálculos."
        },
        {
            number: "04",
            title: "Economia de Tempo",
            description: "80% menos tempo em tarefas manuais de contabilidade."
        },
        {
            number: "05",
            title: "Melhor Cash Flow",
            description: "Previsões precisas e gestão proativa da tesouraria."
        },
        {
            number: "06",
            title: "Decisões Inteligentes",
            description: "Dados em tempo real para tomada de decisões estratégicas."
        },
        {
            number: "07",
            title: "Multi-empresa",
            description: "Gestão consolidada de várias empresas e filiais."
        },
        {
            number: "08",
            title: "Segurança",
            description: "Backups automáticos e controlo de acessos por níveis."
        }
        ],
        stats: [
        { value: "80%", label: "Economia de Tempo" },
        { value: "100%", label: "Conformidade Fiscal" },
        { value: "0", label: "Erros em Cálculos" },
        { value: "24/7", label: "Accesso Remoto" }
        ],
        additionalContent: {
        ctaTitle: "Pronto para transformar sua gestão financeira?",
        ctaDescription: "Experimente gratuitamente nosso módulo Financeiro e tenha controlo total das suas finanças.",
        ctaButtons: [
            {
            text: "Solicitar Demonstração",
            link: "/contact",
            variant: "primary"
            },
            {
            text: "Testar Online",
            link: "https://admin.sisgesc.net/finance-demo",
            variant: "secondary",
            external: true
            },
            {
            text: "Baixar Setup Financeiro",
            link: "/downloads/sigesc-financeiro-setup.exe",
            variant: "success",
            download: true
            }
        ],
        specifications: [
            "Fluxo de caixa com projeções automáticas",
            "Conciliação bancária integrada",
            "Relatórios fiscais para Angola (IVA, IRPS, II)",
            "Multi-moeda (USD, EUR, AOA)",
            "Controlo orçamental por centros de custo",
            "App mobile para aprovações e consultas",
            "Backup automático na nuvem"
        ],
        fiscalReports: [
            "Declaração de IVA",
            "Imposto Industrial",
            "IRPS (Imposto sobre Rendimentos)",
            "Relatórios à BNA",
            "Obrigações fiscais mensais",
            "Mapas de impostos"
        ],
        integrations: [
            "Bancos angolanos (BAI, BFA, BIC, etc)",
            "Sistema de facturação",
            "Módulo de stock e compras",
            "Módulo de vendas e PDV",
            "API para contabilidade externa"
        ],
        targetBusinesses: [
            "PMEs e grandes empresas",
            "Lojas e retalhistas",
            "Serviços e consultoria",
            "Indústria e manufactura",
            "Importadores e exportadores"
        ]
        }
    },

    gestaodecompras: {
        title: "Sistema de Gestão de Compras SIGESC | Controlo de Compras e Fornecedores para Angola",
        description: "Software completo para gestão de compras com controlo de fornecedores, cotações, ordens de compra, stocks e aprovações para empresas em Angola.",
        keywords: "gestão compras angola, controlo fornecedores, ordens compra, cotações, sigesc compras, aprovações compras, gestão stocks, compras automatizadas",
        heroTitle: "Gestão Inteligente de Compras e Fornecedores",
        heroSubtitle: "Optimize seu processo de compras com controlo de fornecedores, cotações automatizadas, aprovações e integração total com stock.",
        images: [
        "/img/purchase/gestao-compras-dashboard.png",
        "/img/purchase/gestao-compras-controlo-fornecedores.png",
        ],
        imageAlts: [
        "Dashboard de Gestão de Compras SIGESC - Visão completa do processo de compras",
        "Controlo de Fornecedores - Cadastro e avaliação de fornecedores angolanos"
        ],
        features: [
        {
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            title: "Gestão de Fornecedores",
            description: "Cadastro completo de fornecedores com avaliação de performance e histórico de compras."
        },
        {
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            title: "Cotações Automáticas",
            description: "Solicitação e comparação automática de cotações entre múltiplos fornecedores."
        },
        {
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
            title: "Ordens de Compra",
            description: "Emissão e gestão electrónica de ordens de compra com tracking de status."
        },
        {
            icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Aprovações de Compras",
            description: "Fluxos de aprovação personalizáveis por valor, categoria e centro de custo."
        },
        {
            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
            title: "Integração com Stock",
            description: "Sincronização automática com níveis de stock e alertas de reposição."
        },
        {
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Controlo de Preços",
            description: "Histórico de preços, comparação entre fornecedores e alertas de variação."
        },
        {
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            title: "Relatórios de Compras",
            description: "Análise de gastos, performance de fornecedores e indicadores de compras."
        },
        // {
        //     icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
        //     title: "Budget e Centro Custo",
        //     description: "Controlo de compras por budget atribuído e centro de custo."
        // }
        ],
        benefits: [
        {
            number: "01",
            title: "Redução de Custos",
            description: "Economia de até 25% através de cotações competitivas e negociação."
        },
        {
            number: "02",
            title: "Melhor Negociação",
            description: "Dados históricos para negociação mais eficiente com fornecedores."
        },
        {
            number: "03",
            title: "Processos Automatizados",
            description: "Automatização de cotações, aprovações e integração com stock."
        },
        {
            number: "04",
            title: "Controlo Total",
            description: "Visão completa de todo o processo de compras em tempo real."
        },
        {
            number: "05",
            title: "Fornecedores Qualificados",
            description: "Avaliação contínua e seleção dos melhores fornecedores."
        },
        {
            number: "06",
            title: "Conformidade",
            description: "Processos padronizados e conformidade com políticas de compras."
        },
        {
            number: "07",
            title: "Integração Completa",
            description: "Conexão total com stock, financeiro e fornecedores."
        },
        {
            number: "08",
            title: "Decisões Inteligentes",
            description: "Dados analíticos para tomada de decisões estratégicas de compras."
        }
        ],
        stats: [
        { value: "25%", label: "Redução de Custos" },
        { value: "70%", label: "Economia de Tempo" },
        { value: "100%", label: "Controlo Processos" },
        { value: "50%", label: "Melhor Negociação" }
        ],
        additionalContent: {
        ctaTitle: "Pronto para optimizar suas compras?",
        ctaDescription: "Experimente gratuitamente nosso módulo de Gestão de Compras e reduza custos com processos eficientes.",
        ctaButtons: [
            {
            text: "Solicitar Demonstração",
            link: "/contact",
            variant: "primary"
            },
            {
            text: "Testar Online",
            link: "https://admin.sisgesc.net/compras-demo",
            variant: "secondary",
            external: true
            },
            {
            text: "Baixar Setup Compras",
            link: "/downloads/sigesc-compras-setup.exe",
            variant: "success",
            download: true
            }
        ],
        specifications: [
            "Gestão completa de fornecedores locais",
            "Sistema de cotações automáticas",
            "Ordens de compra electrónicas",
            "Fluxos de aprovação personalizáveis",
            "Integração com stock em tempo real",
            "Relatórios de performance de compras",
            "App mobile para aprovações"
        ],
        supplierManagement: [
            "Cadastro completo de fornecedores",
            "Avaliação de performance",
            "Histórico de compras e preços",
            "Certificados e documentação",
            "Classificação por categoria"
        ],
        approvalWorkflows: [
            "Aprovações por valor de compra",
            "Fluxos por categoria de produto",
            "Aprovações por centro de custo",
            "Delegação de aprovações",
            "Alertas e notificações"
        ],
        integrationFeatures: [
            "Sincronização com stock mínimo",
            "Integração com módulo financeiro",
            "Conexão com fornecedores externos",
            "API para marketplaces locais"
        ]
        }
    },

    marketing: {
        title: "Sistema de Marketing SIGESC | Gestão de Campanhas e CRM para Angola",
        description: "Software completo de marketing com gestão de campanhas, email marketing, CRM, análise de clientes e automação para empresas em Angola.",
        keywords: "marketing digital angola, gestão campanhas, email marketing, crm, sigesc marketing, automação marketing, análise clientes",
        heroTitle: "Marketing Inteligente para Crescer seu Negócio",
        heroSubtitle: "Automatize campanhas, gere leads, fidelize clientes e meça resultados com ferramentas de marketing integradas.",
        images: [
        "/img/marketing/marketing-dashboard.png",
        "/img/marketing/email-marketing.png",
        "/img/marketing/Integracao com meta facebook.png",
        "/img/marketing/gestao de contas whatsapp ecatalogos.png",
        "/img/marketing/Integracao com google merchant center.png"
        ],
        imageAlts: [
        "Dashboard de Marketing SIGESC - Visão completa de campanhas e resultados",
        "Email Marketing - Criação e envio de newsletters profissionais",
        "Integração com Meta Facebook - Conexão e gestão de anúncios",
        "Gestão de Contas WhatsApp - Comunicação e atendimento via WhatsApp",
        "Integração com Google Merchant Center - Gestão de produtos e anúncios",
        ],
        features: [
        {
            icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
            title: "Gestão de Campanhas",
            description: "Planeamento, execução e análise de campanhas multicanal com orçamento controlado."
        },
        {
            icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
            title: "Email Marketing",
            description: "Criação de newsletters, automação de envios e análise de taxas de abertura."
        },
        {
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            title: "CRM Marketing",
            description: "Segmentação de clientes, histórico de interações e campanhas personalizadas."
        },
        {
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            title: "Análise de Dados",
            description: "Relatórios de ROI, conversões, funil de vendas e comportamento do cliente."
        },
        {
            icon: "M13 10V3L4 14h7v7l9-11h-7z",
            title: "Automação Marketing",
            description: "Workflows automáticos para nutrição de leads e fidelização de clientes."
        },
        // {
        //     icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
        //     title: "Redes Sociais",
        //     description: "Gestão de publicações, agendamento e análise de performance em redes sociais."
        // },
        // {
        //     icon: "M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z",
        //     title: "Gestão de Leads",
        //     description: "Captura, qualificação e distribuição automática de leads para equipa comercial."
        // },
        // {
        //     icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        //     title: "Web Analytics",
        //     description: "Análise de tráfego, conversões e comportamento no website da empresa."
        // }
        ],
        benefits: [
        {
            number: "01",
            title: "Mais Conversões",
            description: "Aumente em 40% as taxas de conversão com marketing personalizado."
        },
        {
            number: "02",
            title: "Automação Inteligente",
            description: "Automatize 80% das tarefas manuais de marketing e vendas."
        },
        {
            number: "03",
            title: "ROI Mensurável",
            description: "Meça o retorno de cada campanha e optimize seus investimentos."
        },
        {
            number: "04",
            title: "Clientes Fiéis",
            description: "Programas de fidelização que aumentam a retenção em 60%."
        },
        {
            number: "05",
            title: "Dados em Tempo Real",
            description: "Decisões baseadas em analytics atualizados e relatórios precisos."
        },
        {
            number: "06",
            title: "Multi-canal",
            description: "Campanhas integradas across email"
        },
        {
            number: "07",
            title: "Personalização",
            description: "Conteúdo personalizado baseado no comportamento de cada cliente."
        },
        {
            number: "08",
            title: "Escalabilidade",
            description: "Cresça suas campanhas sem aumentar custos operacionais."
        }
        ],
        stats: [
        { value: "40%", label: "Mais Conversões" },
        { value: "60%", label: "Retenção de Clientes" },
        { value: "80%", label: "Tarefas Automatizadas" },
        { value: "3x", label: "ROI de Campanhas" }
        ],
        additionalContent: {
        ctaTitle: "Pronto para transformar seu marketing?",
        ctaDescription: "Experimente gratuitamente nosso módulo de Marketing e impulsione suas vendas com estratégias data-driven.",
        ctaButtons: [
            {
            text: "Ver Demonstração",
            link: "/demo-marketing",
            variant: "primary"
            },
            {
            text: "Testar Ferramentas",
            link: "https://admin.sisgesc.net/marketing-demo",
            variant: "secondary",
            external: true
            },
            {
            text: "Baixar Setup Marketing",
            link: "/downloads/sigesc-marketing-setup.exe",
            variant: "success",
            download: true
            }
        ],
        specifications: [
            "Gestão de campanhas multicanal",
            "Email marketing com templates responsivos",
            "CRM integrado com segmentação avançada",
            "Automação de workflows marketing",
            "Análise de ROI e funil de conversões",
            "Integração com redes sociais",
            "Relatórios personalizáveis"
        ],
        channelFeatures: [
            "Email Marketing profissional",
            "SMS Marketing para Angola",
            "WhatsApp Business integrado",
            "Gestão de redes sociais",
            "Landing pages otimizadas",
            "Popup e forms de captura",
            "Web push notifications"
        ],
        analyticsTools: [
            "Funil de conversões",
            "ROI por campanha",
            "Análise de cliente ideal",
            "Taxa de retenção",
            "Custo de aquisição",
            "Lifetime value",
            "Heatmaps de comportamento"
        ],
        targetBusinesses: [
            "Lojas e e-commerce",
            "Serviços profissionais",
            "Imobiliárias e construtoras",
            "Saúde e bem-estar",
            "Educação e formação",
            "Restauração e hotelaria"
        ]
        }
    },
    dropshipping: {
        title: "Dropshipping SIGESC | Venda Online sem Stock Próprio em Angola",
        description: "Módulo de dropshipping do SIGESC: catálogo de fornecedores, encomendas automáticas, sync com loja virtual, logística e faturação integrada. Ideal para e-commerce e PME em Angola que querem vender sem investir em stock.",
        keywords: "dropshipping Angola, software dropshipping, e-commerce sem stock, fornecedores dropship, loja virtual SIGESC, vendas online Angola, fulfillment, gestão encomendas",
        heroTitle: "Dropshipping integrado ao SIGESC",
        heroSubtitle: "Venda online sem stock próprio: fornecedores, pedidos, entregas e faturação no mesmo sistema que o seu PDV e a sua loja virtual.",
        images: [
            "/img/e-commerce/loja-virtual-dashboard.png",
            "/img/e-commerce/catalogo-produtos.png",
            "/img/e-commerce/Gestao de entregas e pagamentos.png",
            "/img/e-commerce/Gestao de entregas e logistica Rastreamento em tempo real.png",
            "/img/e-commerce/Edicao de Produtos.png"
        ],
        imageAlts: [
            "Dashboard Dropshipping SIGESC - Visão de vendas e encomendas online",
            "Catálogo de produtos de fornecedores para dropshipping",
            "Gestão de pagamentos e portes em operações dropship",
            "Rastreamento de entregas e logística de fornecedores",
            "Edição de produtos e margens no catálogo dropshipping"
        ],
        features: [
            {
                icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                title: "Catálogo de Fornecedores",
                description: "Importe e organize produtos de fornecedores sem manter stock próprio na sua empresa."
            },
            {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
                title: "Encomendas Automáticas",
                description: "Quando o cliente compra, o pedido é encaminhado ao fornecedor com dados de entrega."
            },
            {
                icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                title: "Controlo de Margens",
                description: "Defina preço de venda, custo do fornecedor e margem — veja lucro por produto e pedido."
            },
            {
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                title: "Logística e Entregas",
                description: "Acompanhe status de envio, portes e tracking até a entrega ao cliente final."
            },
            {
                icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Integração Loja Virtual",
                description: "Sincronize catálogo e pedidos com a Loja Virtual SIGESC e canais de venda online."
            },
            {
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                title: "Faturação Integrada",
                description: "Emita documentos comerciais e alinhe o fluxo com faturação e finanças do SIGESC."
            },
            {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "Relatórios de Canal",
                description: "Analise vendas, fornecedores mais rentáveis, devoluções e desempenho do dropshipping."
            },
            {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Baixo Investimento",
                description: "Comece a vender online sem comprar stock antecipadamente — reduza risco e capital imobilizado."
            }
        ],
        benefits: [
            {
                number: "01",
                title: "Sem Stock Próprio",
                description: "Venda produtos sem armazém próprio: o fornecedor trata do fulfillment."
            },
            {
                number: "02",
                title: "Integração Total",
                description: "Dropshipping ligado à loja virtual, faturação, finanças e operações SIGESC."
            },
            {
                number: "03",
                title: "Margens Visíveis",
                description: "Saiba o lucro real de cada venda antes e depois dos portes."
            },
            {
                number: "04",
                title: "Escala Rápida",
                description: "Amplie o catálogo com novos fornecedores sem aumentar stock físico."
            },
            {
                number: "05",
                title: "Entregas Controladas",
                description: "Acompanhe o ciclo do pedido até à entrega ao cliente."
            },
            {
                number: "06",
                title: "Feito para Angola",
                description: "Fluxos pensados para PME e e-commerce no mercado angolano."
            }
        ],
        stats: [
            { value: "0", label: "Stock próprio obrigatório" },
            { value: "1", label: "Plataforma integrada" },
            { value: "24/7", label: "Vendas online" },
            { value: "100%", label: "Visibilidade de margem" }
        ],
        additionalContent: {
            ctaTitle: "Pronto para vender com dropshipping?",
            ctaDescription: "Experimente o módulo Dropshipping do SIGESC e lance o seu canal online sem investir em stock antecipado.",
            ctaButtons: [
                {
                    text: "Falar com Especialista",
                    link: "/contact",
                    variant: "primary"
                },
                {
                    text: "Ver todas as soluções",
                    link: "/solutions",
                    variant: "secondary"
                },
                {
                    text: "Testar Grátis",
                    link: "https://admin.sisgesc.net/getting-started",
                    variant: "success",
                    external: true
                }
            ],
            specifications: [
                "Catálogo multi-fornecedor para dropshipping",
                "Encaminhamento automático de encomendas",
                "Cálculo de margens e portes",
                "Integração com Loja Virtual SIGESC",
                "Tracking de entregas e status de pedido",
                "Ligação a faturação e finanças",
                "Relatórios de canal e fornecedores"
            ],
            targetBusinesses: [
                "Lojas online e e-commerce",
                "Empreendedores sem armazém",
                "Retalho que quer expandir o catálogo",
                "Marketplaces e revendedores",
                "PME em crescimento digital"
            ]
        }
    }

};
