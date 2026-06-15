import { Link } from '@inertiajs/react'
import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiFileText, FiUser, FiLock, FiCode, FiRefreshCw, FiMail, FiHome, FiCheck } from 'react-icons/fi'

export default function TermsComponent() {
    const [openSections, setOpenSections] = useState({
        'introduction': true,
        'usage': false,
        'accounts': false,
        'intellectual-property': false,
        'changes': false,
        'contact': false
    });

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="mt-6 bg-gradient-to-b from-gray-50 to-gray-100 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6 shadow-md">
                        <FiFileText className="w-10 h-10 text-blue-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Termos de <span className="text-blue-500">Serviço</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        Conheça os termos que regem o uso do SIGESC
                    </p>
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-500 px-4 py-2 rounded-full">
                        <span className="text-sm font-medium">Última atualização: 01/01/2024</span>
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            { id: 'introduction', title: 'Introdução' },
                            { id: 'usage', title: 'Uso do Serviço' },
                            { id: 'accounts', title: 'Contas' },
                            { id: 'intellectual-property', title: 'Propriedade Intelectual' },
                            { id: 'changes', title: 'Alterações' },
                            { id: 'contact', title: 'Contato' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    const element = document.getElementById(item.id);
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-left text-sm text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-lg transition-all duration-200 flex items-start"
                            >
                                <span className="bg-blue-100 text-blue-500 rounded-md px-2 py-1 text-xs font-medium mr-2">
                                    {item.id === 'introduction' && '1'}
                                    {item.id === 'usage' && '2'}
                                    {item.id === 'accounts' && '3'}
                                    {item.id === 'intellectual-property' && '4'}
                                    {item.id === 'changes' && '5'}
                                    {item.id === 'contact' && '6'}
                                </span>
                                <span>{item.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="space-y-6">
                    {/* Introduction */}
                    <section id="introduction" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleSection('introduction')}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                            aria-expanded={openSections['introduction']}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-blue-500 text-2xl flex-shrink-0">
                                    <FiFileText />
                                </span>
                                <h2 className="text-2xl font-semibold text-gray-900">1. Introdução</h2>
                            </div>
                            {openSections['introduction'] ? (
                                <FiChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                                <FiChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                        </button>

                        <div className={`px-6 pb-6 transition-all duration-300 ${openSections['introduction'] ? 'block' : 'hidden'}`}>
                            <div className="pl-10">
                                <p className="text-gray-700 mb-4">
                                    Bem-vindo ao SIGESC. Ao acessar nosso software ou utilizar nossos serviços, você concorda em estar vinculado por estes Termos de Serviço. Estes Termos aplicam-se a todos os visitantes, usuários e outros que desejam acessar ou usar o serviço.
                                </p>
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                                    <p className="text-blue-700 text-sm">
                                        Ao utilizar nossos serviços, você confirma que leu, compreendeu e concorda com estes termos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Usage */}
                    <section id="usage" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleSection('usage')}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                            aria-expanded={openSections['usage']}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-blue-500 text-2xl flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </span>
                                <h2 className="text-2xl font-semibold text-gray-900">2. Uso do Serviço</h2>
                            </div>
                            {openSections['usage'] ? (
                                <FiChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                                <FiChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                        </button>

                        <div className={`px-6 pb-6 transition-all duration-300 ${openSections['usage'] ? 'block' : 'hidden'}`}>
                            <div className="pl-10">
                                <p className="text-gray-700 mb-4">
                                    O SIGESC fornece um conjunto de ferramentas para gestão comercial, incluindo, mas não limitado a, ponto de venda, faturamento, gerenciamento de compras, estoque e funcionários. Ao usar nosso software, você concorda em utilizá-lo de maneira responsável e conforme as leis aplicáveis.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-medium text-gray-900 mb-2">Permitido:</h3>
                                    <ul className="space-y-1">
                                        <li className="flex items-start">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm">Uso para gestão do seu negócio</span>
                                        </li>
                                        <li className="flex items-start">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm">Acesso através de múltiplos dispositivos autorizados</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Accounts */}
                    <section id="accounts" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleSection('accounts')}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                            aria-expanded={openSections['accounts']}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-blue-500 text-2xl flex-shrink-0">
                                    <FiUser />
                                </span>
                                <h2 className="text-2xl font-semibold text-gray-900">3. Contas</h2>
                            </div>
                            {openSections['accounts'] ? (
                                <FiChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                                <FiChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                        </button>

                        <div className={`px-6 pb-6 transition-all duration-300 ${openSections['accounts'] ? 'block' : 'hidden'}`}>
                            <div className="pl-10">
                                <p className="text-gray-700 mb-4">
                                    Quando você cria uma conta conosco, você garante que as informações fornecidas são precisas, completas e atualizadas em todos os momentos. A inobservância desta condição constitui uma violação dos Termos, o que pode resultar no encerramento imediato de sua conta em nosso serviço.
                                </p>
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r mb-4">
                                    <p className="text-yellow-700 text-sm">
                                        Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades que ocorrem em sua conta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section id="intellectual-property" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleSection('intellectual-property')}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                            aria-expanded={openSections['intellectual-property']}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-blue-500 text-2xl flex-shrink-0">
                                    <FiLock />
                                </span>
                                <h2 className="text-2xl font-semibold text-gray-900">4. Propriedade Intelectual</h2>
                            </div>
                            {openSections['intellectual-property'] ? (
                                <FiChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                                <FiChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                        </button>

                        <div className={`px-6 pb-6 transition-all duration-300 ${openSections['intellectual-property'] ? 'block' : 'hidden'}`}>
                            <div className="pl-10">
                                <p className="text-gray-700 mb-4">
                                    O software, seus elementos originais, recursos e funcionalidades são e permanecerão propriedade exclusiva do SIGESC e seus licenciadores. Nosso software é fornecido sob licença e não é vendido, concedendo-lhe direitos limitados de uso sob estes Termos.
                                </p>
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                                    <p className="text-red-700 text-sm">
                                        É expressamente proibida a reprodução, modificação, distribuição ou engenharia reversa do software sem autorização prévia por escrito.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Changes */}
                    <section id="changes" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleSection('changes')}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                            aria-expanded={openSections['changes']}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-blue-500 text-2xl flex-shrink-0">
                                    <FiRefreshCw />
                                </span>
                                <h2 className="text-2xl font-semibold text-gray-900">5. Alterações</h2>
                            </div>
                            {openSections['changes'] ? (
                                <FiChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                                <FiChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                        </button>

                        <div className={`px-6 pb-6 transition-all duration-300 ${openSections['changes'] ? 'block' : 'hidden'}`}>
                            <div className="pl-10">
                                <p className="text-gray-700 mb-4">
                                    Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento, a nosso exclusivo critério. Se uma revisão for material, forneceremos um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor.
                                </p>
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                                    <p className="text-blue-700 text-sm">
                                        O uso continuado de nossos serviços após quaisquer alterações constitui aceitação dos novos termos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section id="contact" className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleSection('contact')}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                            aria-expanded={openSections['contact']}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-blue-500 text-2xl flex-shrink-0">
                                    <FiMail />
                                </span>
                                <h2 className="text-2xl font-semibold text-gray-900">6. Contato</h2>
                            </div>
                            {openSections['contact'] ? (
                                <FiChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                                <FiChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                        </button>

                        <div className={`px-6 pb-6 transition-all duration-300 ${openSections['contact'] ? 'block' : 'hidden'}`}>
                            <div className="pl-10">
                                <p className="text-gray-700 mb-4">
                                    Se você tiver alguma dúvida sobre estes Termos, por favor, entre em contato conosco através de:
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <FiMail className="w-4 h-4 text-blue-500 mr-2" />
                                            <span className="text-gray-700">comercial.sisgesc@gmail.com</span>
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span className="text-gray-700">+244 923 456 789</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Acceptance Section */}
                <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-200">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Aceitação dos Termos</h3>
                    <p className="text-gray-700 text-center mb-6">
                        Ao utilizar nossos serviços, você confirma que leu, compreendeu e concorda com estes Termos de Serviço em sua totalidade.
                    </p>
                    <div className="text-center">
                        <div className="inline-flex items-center bg-white px-4 py-2 rounded-lg border border-gray-300">
                            <span className="text-sm text-gray-600 mr-2">Última atualização:</span>
                            <span className="text-sm font-medium text-gray-900">01 de Janeiro de 2024</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
