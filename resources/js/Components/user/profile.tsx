import React, { useEffect } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { useLoggedUser } from '@/contexts/loggedUser';
import { UserServices } from './services';
import { User } from '@/types';

export default function ProfileComponent({props,openForEdit}:{props:{auth: {user:User},local:string},openForEdit:VoidFunction}) {
    const { user, setUser } = useLoggedUser();
    const { verifyUserEmail } = UserServices(props.local);

    useEffect(() => {
        setUser({ ...props.auth.user });
    }, []);

    const services = [
        { name: 'Gestão de PDV', description: 'Melhore a eficiência das suas vendas.', icon: AiOutlineCheckCircle },
        { name: 'Controle Financeiro', description: 'Simplifique a emissão de faturas.', icon: AiOutlineCheckCircle },
        { name: 'Gestão de Compras', description: 'Otimize o seu processo de compra.', icon: AiOutlineCheckCircle },
    ];

    return (
        <motion.div className="min-h-screen bg-gray-100 mt-8 p-6 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-5">
                <div className="md:flex">
                    <div className="md:w-1/3 p-4 flex items-center justify-center">
                        <img src={props.auth.user.user_profile.image} alt="Profile" className="rounded-full border-2 border-gray-300 shadow-sm"/>
                    </div>
                    <div className="md:w-2/3 p-4">
                        <h2 className="text-xl md:text-2xl font-bold mb-2">{user?.name}</h2>
                        <p className="text-gray-600 mb-4">{user?.email}</p>
                        <div className="flex flex-wrap mb-4">
                            {services.map((service, index) => (
                                <motion.div key={index} className="w-full md:w-1/2 p-2"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow">
                                        <service.icon className="text-2xl text-blue-500 mr-4"/>
                                        <div>
                                            <h3 className="font-semibold">{service.name}</h3>
                                            <p className="text-sm text-gray-600">{service.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={openForEdit}>Editar Perfil</button>
                            <Link href={route('password.update-request')} className="text-blue-500 hover:underline">Mudar senha</Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}






