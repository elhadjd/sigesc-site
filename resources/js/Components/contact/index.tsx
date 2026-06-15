import React, { useEffect } from 'react';
import { BiMap, BiPhone, BiEnvelope, } from 'react-icons/bi';
import { motion } from 'framer-motion';
import WhatsApp from '../public/whatsApp';
import { ToastContainer, toast } from 'react-toastify';
import LoadingButtons from '@/ui/loadingButtons';
import { User } from '@/types';
import { contactsServices } from '@/services/contacts';

interface ContactsProps {
    auth: { user: User };
    errors?: any;
    compact?: boolean;
    showTitle?: boolean;
}

export default function Contacts({ compact = false, showTitle = true }: ContactsProps) {
    const { data, handelSubmitForm, setData, wasSuccessful, processing, errors: formErrors } = contactsServices();

    useEffect(() => {
        if (wasSuccessful) {
            toast.success('Email enviado com sucesso!', {
                position: 'top-right',
                autoClose: 3000
            });
        }
    }, [wasSuccessful]);

    if (compact) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                {showTitle && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Formulário de <span className="text-blue-600">Contato</span>
                    </h2>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações de Contato Compactas */}
                    <div className="space-y-4">
                        <ContactInfoItem
                            icon={<BiMap className="text-xl text-blue-600" />}
                            title="Escritório"
                            content="Newark, NJ, Estados Unidos"
                        />

                        <ContactInfoItem
                            icon={<BiPhone className="text-xl text-green-600" />}
                            title="Telefones"
                            content={
                                <>
                                    +1 9735249725 (EUA)<br />
                                    +244 929147445 (Angola)
                                </>
                            }
                        />

                        <ContactInfoItem
                            icon={<BiEnvelope className="text-xl text-purple-600" />}
                            title="E-mail"
                            content="comercial.sisgesc@gmail.com"
                        />

                        <div className="pt-2">
                            <WhatsApp />
                        </div>
                    </div>

                    {/* Formulário Compacto */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Envie uma mensagem</h3>

                        <form onSubmit={handelSubmitForm} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <InputComponent
                                    id="name"
                                    label="Nome"
                                    placeholder="Seu nome"
                                    setData={(e) => setData('name', e)}
                                    type="text"
                                    value={data.name}
                                    error={formErrors.name}
                                    compact
                                />
                                <InputComponent
                                    id="surname"
                                    label="Apelido"
                                    placeholder="Seu apelido"
                                    setData={(e) => setData('surname', e)}
                                    type="text"
                                    value={data.surname}
                                    error={formErrors.surname}
                                    compact
                                />
                            </div>

                            <InputComponent
                                id="email"
                                label="E-mail"
                                placeholder="seu@email.com"
                                setData={(e) => setData('email', e)}
                                type="email"
                                value={data.email}
                                error={formErrors.email}
                                compact
                            />

                            <InputComponent
                                id="phone"
                                label="Telefone"
                                placeholder="(XX) XXXXX-XXXX"
                                setData={(e) => setData('phone', e)}
                                type="tel"
                                value={data.phone}
                                error={formErrors.phone}
                                compact
                            />

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mensagem
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    rows={3}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                    placeholder="Como podemos ajudar?"
                                />
                                {formErrors.message && (
                                    <span className="text-red-600 text-xs mt-1">{formErrors.message}</span>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm disabled:opacity-50"
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? <LoadingButtons /> : 'Enviar Mensagem'}
                            </motion.button>
                        </form>
                    </div>
                </div>

                <ToastContainer />
            </div>
        );
    }

    // Versão padrão (mais completa)
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {showTitle && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Formulário de <span className="text-blue-600">Contato</span>
                    </h2>
                    <p className="text-gray-600">Estamos aqui para ajudar sua empresa a crescer</p>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Informações de Contato */}
                <div className="space-y-4">
                    <ContactInfoItem
                        icon={<BiMap className="text-2xl text-blue-600" />}
                        title="Nosso Escritório"
                        content="Newark, NJ, Estados Unidos"
                        description="Horário comercial: Seg-Sex, 8h-18h (EST)"
                    />

                    <ContactInfoItem
                        icon={<BiPhone className="text-2xl text-green-600" />}
                        title="Telefones"
                        content={
                            <div className="space-y-1">
                                <p>+1 9735249725 (EUA)</p>
                                <p>+244 929147445 (Angola)</p>
                            </div>
                        }
                        description="Atendimento em inglês e português"
                    />

                    <ContactInfoItem
                        icon={<BiEnvelope className="text-2xl text-purple-600" />}
                        title="E-mail"
                        content="comercial.sisgesc@gmail.com"
                        description="Respondemos em até 24 horas"
                    />

                    <div className="pt-4">
                        <WhatsApp />
                    </div>
                </div>

                {/* Formulário de Contato */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Envie uma Mensagem</h3>

                    <form onSubmit={handelSubmitForm} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputComponent
                                id="name"
                                label="Nome"
                                placeholder="Seu nome completo"
                                setData={(e) => setData('name', e)}
                                type="text"
                                value={data.name}
                                error={formErrors.name}
                            />
                            <InputComponent
                                id="surname"
                                label="Apelido"
                                placeholder="Seu apelido"
                                setData={(e) => setData('surname', e)}
                                type="text"
                                value={data.surname}
                                error={formErrors.surname}
                            />
                        </div>

                        <InputComponent
                            id="email"
                            label="E-mail"
                            placeholder="seu@email.com"
                            setData={(e) => setData('email', e)}
                            type="email"
                            value={data.email}
                            error={formErrors.email}
                        />

                        <InputComponent
                            id="phone"
                            label="Telefone"
                            placeholder="(XX) XXXXX-XXXX"
                            setData={(e) => setData('phone', e)}
                            type="tel"
                            value={data.phone}
                            error={formErrors.phone}
                        />

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                Mensagem
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                required
                                placeholder="Descreva como podemos ajudá-lo..."
                            />
                            {formErrors.message && (
                                <span className="text-red-600 text-sm mt-1">{formErrors.message}</span>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? <LoadingButtons /> : 'Enviar Mensagem'}
                        </motion.button>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

// Componente para itens de informação de contato
function ContactInfoItem({ icon, title, content, description }: {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
    description?: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-start bg-gray-50 p-4 rounded-lg"
        >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm mr-4 flex-shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <div className="text-gray-700 mt-1">{content}</div>
                {description && (
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
            </div>
        </motion.div>
    );
}

// Componente de input
function InputComponent(props: {
    id: string;
    label: string;
    type: string;
    value: string;
    setData(e: any): void;
    placeholder: string;
    error?: string;
    compact?: boolean;
}) {
    return (
        <div>
            <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
                {props.label}
            </label>
            <input
                type={props.type}
                id={props.id}
                className={`w-full ${props.compact ? 'p-2 text-sm' : 'p-3'} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={props.value}
                onChange={(e) => props.setData(e.target.value)}
                placeholder={props.placeholder}
                required
            />
            {props.error && (
                <span className="text-red-600 text-xs mt-1">{props.error}</span>
            )}
        </div>
    );
}
