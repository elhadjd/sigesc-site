import React, { useState, useEffect } from 'react';
import FooterComponent from '@/Components/home/Footer';
import { HeaderComponent } from '@/Components/home/Header';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { FormStateProvider } from '@/contexts/stateForm';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { Helmet } from 'react-helmet';
import { moduleData } from '@/services/public/veriables';
import { SIGESC_GETTING_STARTED_URL, SIGESC_SITE_URL } from '@/services/public/domains';

// Dados dinâmicos para todos os módulo

function ModulePage(props: { auth: { user: User }, moduleName: string }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Obter dados do módulo específico
    const module = moduleData[props.moduleName.replace(/[-\s]/g, '').toLowerCase() as keyof typeof moduleData] || moduleData.faturamento;

    const { images, imageAlts } = module;

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const goToNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    // Componente de Ícone SVG
    const FeatureIcon = ({ iconPath }: { iconPath: string }) => (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
        </svg>
    );

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <Helmet>
                    <title>{module.title}</title>
                    <meta name="description" content={module.description} />
                    <meta name="keywords" content={module.keywords} />
                    <meta property="og:title" content={module.title} />
                    <meta property="og:description" content={module.description} />
                    <meta property="og:type" content="website" />
                    <link rel="canonical" href={`${SIGESC_SITE_URL}/${props.moduleName}`} />
                </Helmet>

                <HeaderComponent auth={props.auth} />

                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Hero Section */}
                        <div className={`flex flex-col md:flex-row items-center justify-between mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="md:w-1/2 mb-10 md:mb-0">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                    {module.heroTitle}
                                </h1>
                                <p className="text-xl text-gray-600 mb-8">
                                    {module.heroSubtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
                                    {/* Botão Demonstração */}
                                    <Link
                                        href={`/downloads`}
                                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg group"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path>
                                        </svg>
                                        Solicitar Demonstração
                                    </Link>

                                    {/* Botão Testar Online */}
                                    <a
                                        href={SIGESC_GETTING_STARTED_URL}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-300 group"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                                        </svg>
                                        Testar Online
                                    </a>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-blue-100 rounded-2xl rotate-2 opacity-70"></div>
                                    <img
                                        src={images[0]}
                                        alt={imageAlts[0]}
                                        className="relative rounded-xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery Section */}

                        {
                            images.length > 1 && (<div className="py-12">
                                <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Sistema de {props.moduleName.charAt(0).toUpperCase() + props.moduleName.slice(1)} Completo</h2>
                                <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                                    Conheça as funcionalidades do melhor software para sua empresa
                                </p>
                                <div className="relative rounded-xl overflow-hidden shadow-xl bg-white p-4 mb-8">
                                    <div className="relative h-96 overflow-hidden rounded-lg">
                                        {images.map((image: string, index: number) => (
                                            <div
                                                key={index}
                                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                            >
                                                <img
                                                    src={image}
                                                    alt={imageAlts[index]}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        ))}

                                        <button
                                            onClick={goToPrevImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-300"
                                            aria-label="Imagem anterior"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                            </svg>
                                        </button>

                                        <button
                                            onClick={goToNextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all duration-300"
                                            aria-label="Próxima imagem"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex justify-center mt-4 space-x-2">
                                        {images.map((_: any, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => goToImage(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                                                aria-label={`Ir para imagem ${index + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <div className="text-center mt-4">
                                        <p className="text-gray-700 font-medium">{imageAlts[currentImageIndex]}</p>
                                        <p className="text-gray-500 text-sm">{currentImageIndex + 1} de {images.length}</p>
                                    </div>
                                </div>
                            </div>
                            )
                        }



                        {/* Features Section */}
                        <div className="py-16">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Funcionalidades Principais</h2>
                            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                                Descubra como nosso sistema pode transformar sua gestão
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {module.features.map((feature: any, index: number) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                            <FeatureIcon iconPath={feature.icon} />
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="py-16 bg-white rounded-2xl shadow-sm p-8 mb-16">
                            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Vantagens do Sistema</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {module.benefits.map((benefit: any, index: number) => (
                                    <div key={index} className="flex">
                                        <div className="mr-6">
                                            <div className="flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-xl font-bold text-2xl">
                                                {benefit.number}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                                            <p className="text-gray-600">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 text-center text-white shadow-xl mb-16">
                            <h2 className="text-3xl font-bold mb-4">Pronto para Transformar sua Gestão?</h2>
                            <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
                                Experimente gratuitamente nossa solução completa para seu negócio.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center flex-wrap gap-4">
                                <Link
                                    href={`/contact`}
                                    className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Falar com Especialista
                                </Link>
                                <a
                                    href={SIGESC_GETTING_STARTED_URL}
                                    target='_blank'
                                    rel="noopener noreferrer"
                                    className="border border-white text-white hover:bg-blue-700 font-medium py-3 px-8 rounded-lg transition-all duration-300"
                                >
                                    Testar Grátis por 30 Dias
                                </a>
                                <a
                                    href="/downloads"
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                    </svg>
                                    Baixar Setup
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}

export default ModulePage;
