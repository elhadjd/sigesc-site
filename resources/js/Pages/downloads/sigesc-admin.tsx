import React from "react";
import { motion } from "framer-motion";
import { HeaderComponent } from "@/Components/home/Header";
import { UserLoggedProvider } from "@/contexts/loggedUser";
import { FormStateProvider } from "@/contexts/stateForm";
import FooterComponent from "@/Components/home/Footer";
import { Helmet } from "react-helmet";
import { FiDownload, FiGlobe, FiDatabase, FiTrendingUp, FiUsers, FiStar, FiCheck, FiArrowRight } from "react-icons/fi";

const DownloadPage = (props) => {

    const handleDownload = (appVersion, appType) => {
        const downloadLink = route('download', { appType: appType, appVersion: appVersion });
        window.open(downloadLink, '_blank');

        setTimeout(() => {
            window.location.href = route('download.thanks');
        }, 3000);
    };

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={props.auth} />
                <Helmet>
                    <title>Baixe SIGESC - Software de Gestão Empresarial e Comercial para Windows</title>
                    <meta
                        name="description"
                        content="Transforme a gestão comercial da sua empresa com o SIGESC, um software inovador, eficiente e fácil de usar. Baixe agora para Windows e MacOS."
                    />
                    <link rel="shortcut icon" type="image/x-icon" href="https://admin.sisgesc.net/favicon.ico" />
                    <meta
                        name="keywords"
                        content="SIGESC, software de gestão angola, software de gestão gratuita, gestão empresarial, software para empresas, controle de estoque, SIGESC download"
                    />
                    <meta name="author" content="SIGESC TECH" />
                    <meta property="og:title" content="Baixe SIGESC - Software de Gestão Completo" />
                    <meta property="og:description" content="Transforme a gestão da sua empresa com o SIGESC. Download gratuito disponível." />
                    <meta property="og:image" content="https://admin.sisgesc.net/og-image.jpg" />
                </Helmet>

                <main className="flex-grow">
                    {/* Hero Section */}
                    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-6 overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-40 h-40 bg-white opacity-10 rounded-full"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl mx-auto relative z-10 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm"
                            >
                                <FiDownload className="w-12 h-12 text-white" />
                            </motion.div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
                                Potencialize sua <span className="text-blue-300">Gestão Empresarial</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Baixe o SIGESC e transforme a maneira como você gerencia seu negócio com ferramentas profissionais e intuitivas.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDownload('2_0_3', 'offline')}
                                    className="flex items-center justify-center gap-3 bg-white text-blue-700 font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                                >
                                    <FiDatabase className="w-6 h-6" />
                                    Versão Local
                                    <FiDownload className="w-5 h-5" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDownload('3_0_0', 'online')}
                                    className="flex items-center justify-center gap-3 bg-blue-500 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
                                >
                                    <FiGlobe className="w-6 h-6" />
                                    Versão Online
                                    <FiArrowRight className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <div className="flex flex-wrap justify-center gap-6 text-blue-200">
                                <div className="flex items-center gap-2">
                                    <FiCheck className="w-5 h-5 text-green-300" />
                                    <span>Instalação Rápida</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCheck className="w-5 h-5 text-green-300" />
                                    <span>Suporte 24/7</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCheck className="w-5 h-5 text-green-300" />
                                    <span>Atualizações Gratuitas</span>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* Version Comparison Section */}
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-6xl mx-auto px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Escolha a versão ideal para o seu negócio
                                </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Duas opções poderosas para atender diferentes necessidades empresariais
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                                {/* Local Version Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 relative"
                                >
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                                        Mais Popular
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <FiDatabase className="w-7 h-7 text-blue-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900">Versão Local</h3>
                                        </div>

                                        <p className="text-gray-600 mb-8">
                                            Ideal para empresas que preferem ter total controle dos dados e operar sem dependência de internet.
                                        </p>

                                        <div className="space-y-4 mb-8">
                                            {[
                                                "Dados armazenados localmente",
                                                "Funciona sem internet",
                                                "Maior controle sobre informações",
                                                "Performance otimizada",
                                                "Backup automático"
                                            ].map((feature, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <FiCheck className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <span className="text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleDownload('2_0_3', 'offline')}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-3"
                                        >
                                            <FiDownload className="w-5 h-5" />
                                            Baixar Agora
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Online Version Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
                                >
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                                                <FiGlobe className="w-7 h-7 text-indigo-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900">Versão Online</h3>
                                        </div>

                                        <p className="text-gray-600 mb-8">
                                            Perfeita para quem busca flexibilidade e acesso remoto aos dados da empresa de qualquer lugar.
                                        </p>

                                        <div className="space-y-4 mb-8">
                                            {[
                                                "Acesso de qualquer dispositivo",
                                                "Atualizações automáticas",
                                                "Sem necessidade de instalação",
                                                "Dados em nuvem segura",
                                                "Colaboração em tempo real"
                                            ].map((feature, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <FiCheck className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <span className="text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleDownload('3_0_0', 'online')}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-3"
                                        >
                                            <FiArrowRight className="w-5 h-5" />
                                            Acessar Online
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-6xl mx-auto px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Recursos que transformam sua gestão
                                </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Descubra todas as ferramentas poderosas que o SIGESC oferece para o seu negócio
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: <FiTrendingUp className="w-8 h-8" />,
                                        title: "Gestão Completa",
                                        description: "Controle total sobre vendas, estoque, funcionários e finanças em um único sistema integrado.",
                                        color: "text-blue-600",
                                        bgColor: "bg-blue-100"
                                    },
                                    {
                                        icon: <FiUsers className="w-8 h-8" />,
                                        title: "Multi-usuário",
                                        description: "Trabalhe em equipe com diferentes níveis de acesso e permissões personalizadas.",
                                        color: "text-green-600",
                                        bgColor: "bg-green-100"
                                    },
                                    {
                                        icon: <FiStar className="w-8 h-8" />,
                                        title: "Interface Intuitiva",
                                        description: "Design moderno e fácil de usar, reduzindo a curva de aprendizado e aumentando a produtividade.",
                                        color: "text-purple-600",
                                        bgColor: "bg-purple-100"
                                    }
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className="bg-gray-50 rounded-2xl p-6 text-center group hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <div className={feature.color}>
                                                {feature.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimonials Section */}
                    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                        <div className="max-w-6xl mx-auto px-6">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-16"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    O que nossos clientes dizem
                                </h2>
                                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                    Empresas que transformaram sua gestão com o SIGESC
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    {
                                        name: "João Silva",
                                        company: "Silva Comércio Ltda",
                                        feedback: "O SIGESC revolucionou nossa forma de gerenciar o negócio. A eficiência aumentou em 40% e temos total controle sobre nossas operações.",
                                        rating: 5
                                    },
                                    {
                                        name: "Maria Santos",
                                        company: "P.D.Andre Comercio Geral",
                                        feedback: "Recomendo para qualquer empresa que queira otimizar seus processos. A equipe de suporte é excepcional e sempre pronta para ajudar.",
                                        rating: 5
                                    }
                                ].map((testimonial, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className="bg-gray-800 rounded-2xl p-8 backdrop-blur-sm"
                                    >
                                        <div className="flex items-center gap-2 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-gray-200 italic text-lg mb-6 leading-relaxed">
                                            "{testimonial.feedback}"
                                        </p>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-blue-300">
                                                {testimonial.company}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className="py-20 bg-white">
                        <div className="max-w-4xl mx-auto px-6 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 shadow-2xl"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    Pronto para transformar sua empresa?
                                </h2>
                                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                                    Junte-se a milhares de empresas que já elevam sua gestão a um novo nível com o SIGESC.
                                </p>

                                <div className="flex flex-col sm:flex-row justify-center gap-6">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDownload('2_0_3', 'offline')}
                                        className="bg-white text-blue-700 font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FiDownload className="w-5 h-5" />
                                        Baixar Versão Local
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDownload('3_0_0', 'online')}
                                        className="bg-blue-500 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                                    >
                                        <FiGlobe className="w-5 h-5" />
                                        Acessar Versão Online
                                    </motion.button>
                                </div>

                                <p className="text-blue-200 text-sm mt-8">
                                    Instalação rápida • Suporte 24/7 • Atualizações gratuitas
                                </p>
                            </motion.div>
                        </div>
                    </section>
                </main>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
};

export default DownloadPage;
