import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiShield, FiLock, FiUser, FiMail, FiDatabase, FiGlobe, FiArrowUp } from 'react-icons/fi';

export default function PrivacyComponent() {
    const [openSections, setOpenSections] = useState({});
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Abrir a primeira seção por padrão
    useEffect(() => {
        setOpenSections({ 'introduction': true });

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const privacySections = [
        {
            id: 'introduction',
            icon: <FiShield className="text-blue-500" />,
            title: "1. Introdução",
            content: "A SIGESC TECH valoriza e respeita a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos as informações pessoais dos usuários do nosso software de gestão comercial e website. Estamos comprometidos com a transparência e conformidade com a Lei de Proteção de Dados angolana."
        },
        {
            id: 'information-collected',
            icon: <FiDatabase className="text-blue-500" />,
            title: "2. Informações que Coletamos",
            content: "Coletamos informações pessoais e não pessoais que você fornece ao utilizar nossos serviços, incluindo:",
            list: [
                "Dados de identificação (nome, email, telefone)",
                "Informações da empresa (CNI, endereço, atividade)",
                "Dados de transações comerciais",
                "Dados de uso da plataforma",
                "Informações técnicas (IP, browser, dispositivo)"
            ]
        },
        {
            id: 'information-use',
            icon: <FiUser className="text-blue-500" />,
            title: "3. Como Utilizamos suas Informações",
            content: "Utilizamos suas informações para:",
            list: [
                "Fornecer e melhorar nossos serviços",
                "Processar transações e faturação",
                "Comunicação sobre produtos e serviços",
                "Suporte técnico e atendimento ao cliente",
                "Análise e desenvolvimento de novos recursos",
                "Cumprimento de obrigações legais"
            ]
        },
        {
            id: 'information-sharing',
            icon: <FiGlobe className="text-blue-500" />,
            title: "4. Partilha de Informações",
            content: "As suas informações podem ser partilhadas apenas nas seguintes situações:",
            list: [
                "Prestadores de serviços essenciais (hospedagem, pagamentos)",
                "Cumprimento de obrigações legais ou regulamentares",
                "Com seu consentimento explícito",
                "Proteção de direitos e segurança da SIGESC"
            ],
            note: "Nunca vendemos ou alugamos seus dados pessoais a terceiros."
        },
        {
            id: 'data-security',
            icon: <FiLock className="text-blue-500" />,
            title: "5. Segurança de Dados",
            content: "Implementamos medidas robustas de segurança para proteger suas informações:",
            list: [
                "Criptografia SSL/TLS de 256-bit",
                "Backups automáticos e redundância",
                "Controlo de acesso com autenticação de dois fatores",
                "Monitorização contínua de segurança",
                "Conformidade com melhores práticas internacionais"
            ]
        },
        {
            id: 'user-rights',
            icon: <FiUser className="text-blue-500" />,
            title: "6. Seus Direitos",
            content: "De acordo com a legislação de proteção de dados, você tem o direito de:",
            list: [
                "Acessar seus dados pessoais",
                "Retificar informações incorretas",
                "Eliminar dados pessoais",
                "Opor-se ao tratamento de dados",
                "Portabilidade de dados",
                "Limitar o tratamento de dados"
            ],
            note: "Para exercer estes direitos, contacte-nos através do email: privacidade@sisgesc.net"
        },
        {
            id: 'cookies',
            icon: "🍪",
            title: "7. Cookies e Tecnologias Similares",
            content: "Utilizamos cookies para melhorar a experiência do usuário:",
            list: [
                "Cookies essenciais (funcionamento da plataforma)",
                "Cookies de desempenho (análise de uso)",
                "Cookies de funcionalidade (preferências)",
                "Cookies de marketing (publicidade)"
            ],
            note: "Pode gerir as preferências de cookies através das definições do seu browser."
        },
        {
            id: 'data-retention',
            icon: "💾",
            title: "8. Conservação de Dados",
            content: "Conservamos seus dados pessoais apenas pelo tempo necessário:",
            list: [
                "Dados de clientes ativos: Durante a relação contratual",
                "Dados para fins fiscais: 10 anos conforme lei angolana",
                "Dados de marketing: Até revogação do consentimento",
                "Dados de backup: Período limitado com segurança"
            ]
        },
        {
            id: 'changes',
            icon: "🔄",
            title: "9. Alterações à Política de Privacidade",
            content: "Esta política pode ser atualizada periodicamente. Alterações significativas serão comunicadas:",
            list: [
                "Notificação por email aos usuários registados",
                "Aviso destacado no website e aplicação",
                "Atualização da data de revisão nesta página"
            ],
            note: "Última atualização: 01 de Fevereiro de 2024"
        },
        {
            id: 'contact',
            icon: <FiMail className="text-blue-500" />,
            title: "10. Contacto",
            content: "Para questões sobre privacidade ou proteção de dados:",
            list: [
                "Email: comercial.sisgesc@gmail.com",
                "Telefone: +244 923 456 789",
                "Endereço: Luanda, Angola",
                "Horário: Seg-Sex, 8h-18h"
            ]
        }
    ];

    return (
        <>
            <Head>
                <title>Política de Privacidade | SIGESC TECH</title>
                <meta name="description" content="Conheça nossa Política de Privacidade. Comprometidos com a proteção de dados e transparência no tratamento das informações dos nossos usuários." />
                <meta name="keywords" content="política de privacidade, proteção de dados, SIGESC, segurança de dados, Angola" />
                <meta property="og:title" content="Política de Privacidade | SIGESC TECH" />
                <meta property="og:description" content="Conheça nossa Política de Privacidade e como protegemos seus dados." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://seusite.com/privacy" />
            </Head>

            <div className="mt-10 bg-gradient-to-b from-gray-50 to-gray-100 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <header className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 shadow-md">
                            <FiShield className="w-10 h-10 text-blue-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Política de <span className="text-blue-500">Privacidade</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
                            Comprometidos com a proteção e transparência no tratamento dos seus dados pessoais
                        </p>
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-500 px-4 py-2 rounded-full shadow-sm">
                            <span className="text-sm font-medium">Última atualização: 01/02/2024</span>
                        </div>
                    </header>

                    {/* Quick Navigation */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-blue-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Navegação Rápida
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {privacySections.map((section, index) => (
                                <button
                                    key={section.id}
                                    onClick={() => {
                                        const element = document.getElementById(section.id);
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-left text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-lg transition-all duration-200 flex items-start"
                                >
                                    <span className="bg-blue-100 text-blue-500 rounded-md px-2 py-1 text-xs font-medium mr-2">
                                        {index + 1}
                                    </span>
                                    <span>{section.title.replace(/^\d+\.\s/, '')}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Privacy Sections */}
                    <div className="space-y-6">
                        {privacySections.map((section, index) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                            >
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                                    aria-expanded={openSections[section.id]}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl flex-shrink-0">{section.icon}</span>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {section.title}
                                        </h2>
                                    </div>
                                    {openSections[section.id] ? (
                                        <FiChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    ) : (
                                        <FiChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    )}
                                </button>

                                <div className={`px-6 pb-6 transition-all duration-300 ${openSections[section.id] ? 'block' : 'hidden'}`}>
                                    <div className="prose prose-blue max-w-none">
                                        <p className="text-gray-700 mb-4">{section.content}</p>

                                        {section.list && (
                                            <ul className="space-y-3 mb-4">
                                                {section.list.map((item, itemIndex) => (
                                                    <li key={itemIndex} className="flex items-start">
                                                        <span className="text-blue-500 mr-3 mt-1">•</span>
                                                        <span className="text-gray-700">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {section.note && (
                                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r">
                                                <p className="text-blue-700 text-sm">{section.note}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Compliance Badges */}
                    <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                            Conformidade e Certificações
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm text-center transition-transform duration-300 hover:scale-105">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiLock className="w-8 h-8 text-blue-500" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">SSL 256-bit</h4>
                                <p className="text-sm text-gray-600">Criptografia avançada para proteção de dados</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm text-center transition-transform duration-300 hover:scale-105">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiDatabase className="w-8 h-8 text-blue-500" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">Backup Diário</h4>
                                <p className="text-sm text-gray-600">Proteção contra perda de informação</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm text-center transition-transform duration-300 hover:scale-105">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiGlobe className="w-8 h-8 text-blue-500" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">Suporte 24/7</h4>
                                <p className="text-sm text-gray-600">Assistência técnica permanente</p>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="mt-12 text-center">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ainda com dúvidas?</h3>
                        <p className="text-gray-600 mb-6">Entre em contacto com a nossa equipa de proteção de dados</p>
                        <a
                            href="/contact"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                        >
                            <FiMail className="mr-2" />
                            Contactar Agora
                        </a>
                    </div>
                </div>

                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 z-10"
                        aria-label="Voltar ao topo"
                    >
                        <FiArrowUp className="w-6 h-6" />
                    </button>
                )}
            </div>
        </>
    );
}
