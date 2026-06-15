import React, { useEffect, useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet'
import { router } from '@inertiajs/react'
import { User } from '@/types'
import style from '../../../assets/home/Demonstration.module.scss'

// Componentes serão importados dinamicamente apenas quando necessários
const SliderImg = React.lazy(() => import('./sliderImg'));
const Why = React.lazy(() => import('./Why'));
const Apps = React.lazy(() => import('./apps'));
const Cards = React.lazy(() => import('./Cards'));
const Contacts = React.lazy(() => import('../contact'));
const BecomePartnerSection = React.lazy(() => import('./PartnerSection'));
const CEOSection = React.lazy(() => import('./ceo'));

import {
    FiPlay,
    FiDownload,
    FiChevronDown,
    FiPlayCircle,
    FiGrid,
} from 'react-icons/fi'
import { features, performanceMetrics } from '@/services/public/veriables';

export interface textPreviewTs {
    content: string | null | undefined,
    state: boolean
}

// Componente de placeholder para lazy loading
const LoadingPlaceholder = ({ height = '200px' }) => (
    <div className="bg-gray-100 animate-pulse rounded-lg" style={{ height }}></div>
);

// Hook personalizado para Intersection Observer
const useIsInViewport = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isIntersecting];
};

// Componente que só renderiza children quando está no viewport
const LazyRender = ({ children, height = '200px', options = { threshold: 0.1 } }) => {
    const [ref, isInViewport] = useIsInViewport(options);

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>} style={{ minHeight: height }}>
            {isInViewport ? children : <LoadingPlaceholder height={height} />}
        </div>
    );
};

export const Demonstration = ({ auth }: { auth: { user: User } }) => {
    const [textPreview, setTextPreview] = useState<textPreviewTs>({
        state: false,
        content: ''
    });

    const [isCriticalContentLoaded, setIsCriticalContentLoaded] = useState(false);

    const handlerPreviewText = ((id: string) => {
        if (id != 'false') {
            const text: string | undefined | null = document.getElementById(id)?.textContent;
            textPreview.content = text;
        }
        textPreview.state = !textPreview.state;
        setTextPreview({ ...textPreview });
    });

    const { width } = useWindowSize();
    const isMobile = width <= 908;

    const title = "SIGESC - Software de Gestão Integrado para Empresas";
    const description = "O SIGESC é um software de gestão completo que simplifica a administração do seu negócio. Com PDV, controle financeiro, estoque e compras integrados, ele centraliza operações para mais eficiência e crescimento. Ideal para otimizar processos e decisões.";

    // Carregar conteúdo crítico primeiro
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCriticalContentLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Otimizar a imagem LCP
    const HeroImage = useMemo(() => (
        <div className="relative rounded-xl overflow-hidden">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/5 to-purple-400/5 blur-xl"></div>
            <div className="relative rounded-xl overflow-hidden border border-gray-200/50 bg-white shadow-2xl">
                <img
                    src="/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png"
                    alt="Dashboard completo do SIGESC mostrando todas as funcionalidades"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-xl"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                    style={{ contentVisibility: 'auto' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => router.get('/demo')}>
                    <div className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform">
                        <FiPlay className="text-blue-600 text-lg" />
                    </div>
                </div>
            </div>
        </div>
    ), []);

    return (
        <main className='bg-gray-50'>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content="software de gestão, sistema de gestão comercial, PDV, controle financeiro, gestão de estoque, ERP, gestão empresarial, software integrado" />
                <meta name="author" content="SIGESC" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />

                {/* Pré-carregar recursos críticos */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preload" href="/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png" as="image" />
            </Helmet>

            <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-24 lg:pt-24 overflow-hidden">
                <div className="absolute top-10% right-10% w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10% left-10% w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pb-10 lg:gap-16">
                        {/* Conteúdo principal - Prioridade máxima para LCP */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 text-center lg:text-left"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6"
                            >
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                <span className="text-blue-700 text-sm font-medium">
                                    Sistema Completo para Empresas em Angola
                                </span>
                            </motion.div>

                            {/* Texto LCP crítico - otimizado */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
                                <span className="text-gray-900">Tudo que sua empresa</span>{' '}
                                <span className="text-blue-600">precisa em um só lugar</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                                Sistema completo de gestão empresarial com 10 módulos integrados
                                para transformar sua gestão em Angola.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.15)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 group"
                                    onClick={() => router.get(route('download-page'))}
                                >
                                    <FiDownload className="text-xl" />
                                    <span>Experimente Grátis</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(37, 99, 235, 0.05)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-3 group"
                                    onClick={() => router.get('/demo')}
                                >
                                    <FiPlayCircle className="text-xl" />
                                    <span>Ver Demonstração</span>
                                </motion.button>
                            </div>

                            {isCriticalContentLoaded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="grid grid-cols-2 gap-4 mb-8"
                                >
                                    {features.filter((feature) => feature.name !== "Compras" && feature.name !== "Gestão de Fornecedores" &&
                                        feature.name !== "Gestão de Funcionários" && feature.name !== "Logísticas" && feature.name !== "Marketing" && feature.name !== "Loja Virtual").map((feature, index) => (
                                            <a href={feature.href}
                                                key={index}
                                                className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
                                            >
                                                <div className={`p-2 rounded-lg bg-${feature.color}-50 text-${feature.color}-600`}>
                                                    {React.createElement(feature.icon)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                    {feature.name}
                                                </span>
                                            </a>
                                        ))}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Visual do Produto */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="lg:w-1/2 relative"
                        >
                            {HeroImage}

                            {isCriticalContentLoaded && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="grid grid-cols-2 gap-4 mt-6"
                                >
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors group"
                                        onClick={() => router.get('/features')}>
                                        <div className="flex items-center gap-3">
                                            <FiGrid className="text-blue-600 group-hover:scale-110 transition-transform" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-900">Ver Todos os Módulos</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors group"
                                        onClick={() => router.get('/demo')}>
                                        <div className="flex items-center gap-3">
                                            <FiPlay className="text-gray-600 group-hover:scale-110 transition-transform" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Tour Guiado</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="animate-bounce">
                        <FiChevronDown className="text-gray-400 text-xl" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {performanceMetrics.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Sections com Lazy Loading e Intersection Observer */}
            <div className="bg-white">
                <LazyRender height="400px">
                    <div className={style.banner}>
                        <React.Suspense fallback={<LoadingPlaceholder height="400px" />}>
                            <SliderImg />
                        </React.Suspense>
                    </div>
                </LazyRender>

                <section className="py-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LazyRender height="300px">
                            <div className={style.Cards}>
                                <React.Suspense fallback={<LoadingPlaceholder height="300px" />}>
                                    <Cards />
                                </React.Suspense>
                            </div>
                        </LazyRender>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LazyRender height="400px">
                            <div className={style.apps}>
                                <React.Suspense fallback={<LoadingPlaceholder height="400px" />}>
                                    <Apps />
                                </React.Suspense>
                            </div>
                        </LazyRender>
                    </div>
                </section>

                <section className="py-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LazyRender height="500px">
                            <div className={style.why}>
                                <React.Suspense fallback={<LoadingPlaceholder height="500px" />}>
                                    <Why actionPreviewText={handlerPreviewText} />
                                </React.Suspense>
                            </div>
                        </LazyRender>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LazyRender height="300px">
                            <React.Suspense fallback={<LoadingPlaceholder height="300px" />}>
                                <BecomePartnerSection />
                            </React.Suspense>
                        </LazyRender>
                    </div>
                </section>

                <section className="py-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <LazyRender height="400px">
                            <React.Suspense fallback={<LoadingPlaceholder height="400px" />}>
                                <CEOSection />
                            </React.Suspense>
                        </LazyRender>
                    </div>
                </section>

                {/* CTA Section */}
                <LazyRender height="250px">
                    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                    Pronto para transformar seu negócio?
                                </h2>
                                <p className="text-xl text-blue-100 mb-8">
                                    Comece hoje mesmo e experimente todos os benefícios do SIGESC
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                                    onClick={() => router.get(route('download-page'))}
                                >
                                    <FiDownload />
                                    Começar Agora - Grátis
                                </motion.button>
                            </motion.div>
                        </div>
                    </section>
                </LazyRender>

                {/* Contact Section */}
                <LazyRender height="500px">
                    <section className="py-16 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg"
                            >
                                <div className={style.contact}>
                                    <React.Suspense fallback={<LoadingPlaceholder height="400px" />}>
                                        <Contacts auth={auth} />
                                    </React.Suspense>
                                </div>
                            </motion.div>
                        </div>
                    </section>
                </LazyRender>
            </div>
        </main>
    )
}

// Hook para tamanho da janela otimizado
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Debounce para melhor performance
        const debouncedResize = debounce(handleResize, 250);
        window.addEventListener("resize", debouncedResize);

        return () => window.removeEventListener("resize", debouncedResize);
    }, []);

    return windowSize;
}

// Função debounce para melhor performance
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
