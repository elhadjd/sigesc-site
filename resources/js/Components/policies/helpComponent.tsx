import { useStateChatToggle } from '@/contexts/stateChatToggleContext';
import { Link } from '@inertiajs/react'
import React, { useState } from 'react'
import { FiHome, FiMail, FiMessageSquare, FiHelpCircle, FiArrowRight, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { SIGESC_ADMIN_LOGIN_URL, SIGESC_ADMIN_URL, SIGESC_GETTING_STARTED_URL } from '@/services/public/domains';

export default function HelpComponent() {
    const [openSections, setOpenSections] = useState({
        'getting-started': true,
        'features': false,
        'support': false
    });
    const { setStateToggleChat } = useStateChatToggle()

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    return (
        <div className="mt-10 bg-gradient-to-b from-gray-50 to-gray-100 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 shadow-md">
                        <FiHelpCircle className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Centro de <span className="text-blue-500">Ajuda</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Encontre respostas para suas perguntas e recursos para aproveitar ao máximo o SIGESC
                    </p>
                </header>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-10 border border-blue-100">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Pesquisar tópicos de ajuda..."
                            className="w-full px-4 py-3 pl-12 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Getting Started Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <button
                        onClick={() => toggleSection('getting-started')}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Começando</h2>
                        </div>
                        {openSections['getting-started'] ? (
                            <FiChevronUp className="w-5 h-5 text-blue-500" />
                        ) : (
                            <FiChevronDown className="w-5 h-5 text-blue-500" />
                        )}
                    </button>

                    {openSections['getting-started'] && (
                        <div className="px-6 pb-6">
                            <ul className="space-y-3">
                                <li className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <span className="bg-blue-100 text-blue-500 rounded-md p-2 mr-4">
                                        <FiExternalLink className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <a href={SIGESC_GETTING_STARTED_URL} target="_blank" className="text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors duration-200">
                                            Como criar sua conta no SIGESC
                                        </a>
                                        <p className="text-gray-600 text-sm mt-1">Guia passo a passo para configurar sua conta</p>
                                    </div>
                                </li>
                                <li className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <span className="bg-blue-100 text-blue-500 rounded-md p-2 mr-4">
                                        <FiExternalLink className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <a href={SIGESC_ADMIN_URL} target="_blank" className="text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors duration-200">
                                            Acessar admin SIGESC
                                        </a>
                                        <p className="text-gray-600 text-sm mt-1">Painel administrativo do sistema</p>
                                    </div>
                                </li>
                                <li className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <span className="bg-blue-100 text-blue-500 rounded-md p-2 mr-4">
                                        <FiExternalLink className="w-5 h-5" />
                                    </span>
                                    <div>
                                        <a href={SIGESC_ADMIN_LOGIN_URL} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-gray-900 hover:text-blue-500 transition-colors duration-200">
                                            Entrar no painel SIGESC
                                        </a>
                                        <p className="text-gray-600 text-sm mt-1">Registro para novos usuários</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Features Guides Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <button
                        onClick={() => toggleSection('features')}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Guias de Funcionalidades</h2>
                        </div>
                        {openSections['features'] ? (
                            <FiChevronUp className="w-5 h-5 text-blue-500" />
                        ) : (
                            <FiChevronDown className="w-5 h-5 text-blue-500" />
                        )}
                    </button>

                    {openSections['features'] && (
                        <div className="px-6 pb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Gerenciando seu ponto de venda</h3>
                                    <p className="text-gray-600 text-sm mb-3">Aprenda a configurar e operar seu PDV com eficiência</p>
                                    <button className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                                        Ver guia <FiArrowRight className="ml-1" />
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Usando o sistema de faturamento</h3>
                                    <p className="text-gray-600 text-sm mb-3">Tutorial completo sobre emissão de faturas e relatórios</p>
                                    <button className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                                        Ver guia <FiArrowRight className="ml-1" />
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Otimizando seu estoque</h3>
                                    <p className="text-gray-600 text-sm mb-3">Controle de inventário e gestão de produtos</p>
                                    <button className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                                        Ver guia <FiArrowRight className="ml-1" />
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios e Analytics</h3>
                                    <p className="text-gray-600 text-sm mb-3">Como extrair insights dos seus dados comerciais</p>
                                    <button className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                                        Ver guia <FiArrowRight className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Support Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <button
                        onClick={() => toggleSection('support')}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiMessageSquare className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Suporte e Assistência</h2>
                        </div>
                        {openSections['support'] ? (
                            <FiChevronUp className="w-5 h-5 text-blue-500" />
                        ) : (
                            <FiChevronDown className="w-5 h-5 text-blue-500" />
                        )}
                    </button>

                    {openSections['support'] && (
                        <div className="px-6 pb-6">
                            <p className="text-gray-700 mb-6">Se você precisar de assistência adicional, nossa equipe de suporte está aqui para ajudar.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <FiMessageSquare className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Chat ao Vivo</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">Converse com nossa equipe em tempo real</p>
                                    <button onClick={() => setStateToggleChat(true)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                                        Iniciar conversa →
                                    </button>
                                </div>

                                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <FiMail className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">E-mail</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">Envie-nos uma mensagem detalhada</p>
                                    <a href="mailto:sigesctec@gmail.com" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                                        sigesctec@gmail.com →
                                    </a>
                                </div>

                                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Formulário de Contacto</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">Preencha nosso formulário online</p>
                                    <a href="/contact" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                                        Acessar formulário →
                                    </a>
                                </div>

                                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <FiHelpCircle className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">FAQ</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">Perguntas frequentes e soluções</p>
                                    <a href="/resources/faq" className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                                        Ver perguntas frequentes →
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Resources */}
                <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recursos Adicionais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="https://www.youtube.com/@SigescSistemadeFactura%C3%A7%C3%A3o" target='_blank' className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">Vídeo Tutoriais</span>
                        </a>
                        <a href="#" className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">Documentação</span>
                        </a>
                        <a href="#" className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">Webinars</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
