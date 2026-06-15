import Contacts from '@/Components/contact';
import FooterComponent from '@/Components/home/Footer';
import { HeaderComponent } from '@/Components/home/Header';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { FormStateProvider } from '@/contexts/stateForm';
import { User } from '@/types';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

export default function ContactPage(props: { auth: { user: User }, local: string }) {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <>
                    <Helmet>
                        <title>Contato SIGESC - Suporte e Demonstrações</title>

                        <meta
                            name="description"
                            content="Entre em contato com a SIGESC para saber mais sobre nosso software de gestão comercial. Oferecemos suporte dedicado, demonstrações e soluções personalizadas para o seu negócio."
                        />
                        <Helmet>
                            <meta
                                name="keywords"
                                content="contato SIGESC, software de gestão, suporte SIGESC, demonstração SIGESC, gestão comercial, PDV avançado, controle financeiro, gestão de estoque"
                            />
                        </Helmet>
                    </Helmet>

                    <HeaderComponent auth={props.auth} />
                    <motion.main
                        className="mt-16 p-6 bg-gradient-to-r from-blue-50 to-purple-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="container mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                            <h1 className="text-3xl font-bold text-center text-blue-600">
                                Entre em Contato com a SIGESC
                            </h1>
                            <div className="p-6">
                                {/* Descrição com palavras-chave */}
                                <p className="text-gray-700 mb-8 text-center md:text-left">
                                    O <strong>software de gestão SIGESC</strong> é a solução ideal para empresas que buscam <strong>eficiência</strong>, <strong>organização</strong> e <strong>crescimento</strong>. Se você precisa de um <strong>sistema de gestão comercial</strong> completo, entre em contato conosco. Nossa equipe está pronta para ajudar você a alcançar seus objetivos.
                                </p>

                                <Contacts compact={false} auth={props.auth} />
                            </div>
                        </div>
                    </motion.main>
                    <FooterComponent />
                </>
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
