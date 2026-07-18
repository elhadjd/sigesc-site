import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { router } from '@inertiajs/react';
import { SIGESC_GETTING_STARTED_URL } from '@/services/public/domains';

export const Prices = () => {
    const handleSelectPlan = (route: string) => {
        router.get(route);
    };

    const { props } = usePage<{ plans: any[] }>()

    return (
        <>
            <div className="flex flex-wrap justify-center gap-8 mt-12 px-4">
                {
                    props?.plans.length ? props?.plans.map((plan) => (
                        <PlanCard
                            title={plan.name}
                            price={plan.price}
                            description={plan.description}
                            features={["Todos os módulos", "Venda ilimitada", "Clientes Ilimitado", "Fornecedores Ilimitado"]}
                            onSelectPlan={() => handleSelectPlan('/CreateCompany/0')}
                        />
                    )) : ''
                }
            </div>

            <div className="text-gray-800 mt-12 px-4">
                <p className="text-lg">
                    Precisa de ajuda para escolher o plano ideal?{' '}
                    <Link href="/contact" className="text-blue-500 hover:text-blue-700 underline">
                        Fale conosco
                    </Link>{' '}
                    ou{' '}
                    <a
                        href="https://geral.sisgesc.net/gettingStarted"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline font-semibold"
                    >
                        solicite uma demonstração gratuita
                    </a>.
                </p>
            </div>
        </>
    );
};

const PlanCard = ({ title, description, price, features, onSelectPlan }: { title: string, description: string; price: string; features: string[]; onSelectPlan: () => void }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 shadow-lg rounded-lg p-8 flex flex-col items-center gap-4 w-72 hover:shadow-xl transition-shadow duration-300"
    >
        <h2 className="text-2xl font-bold text-blue-500">{title}</h2>
        <p className='text-xs'>{description}</p>
        <span className="text-xl font-bold text-gray-800">{price}</span>
        <ul className="text-left space-y-2">
            {features.map((feature, index) => (
                <li key={index} className="list-disc list-inside text-gray-700">
                    {feature}
                </li>
            ))}
        </ul>
        <a href={SIGESC_GETTING_STARTED_URL} target='_blank' rel='noopener noreferrer'
            onClick={onSelectPlan}
            className="mt-4 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300 w-full"
        >
            Aderir
        </a>
    </motion.div>
);
