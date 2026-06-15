


import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import LoadingButtons from '@/ui/loadingButtons';
import { loginServices } from '@/services/login';
import { useFormState } from '@/contexts/stateForm';
import { SiAuth0 } from 'react-icons/si';
import { ToastContainer } from 'react-toastify';
// ... Outras importações

export const Login = () => {
    const { formData, handelSubmitForm, handleCHangeInput } = loginServices();
    const { isFormSubmitted } = useFormState()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-8">
            <ToastContainer />
            <Link href='/' className='static text-3xl font-bold'>
                <span className='text-[--app_color]'>S</span>
                <span className='text-[--buttonsColor]'>IGESC</span>
            </Link>
            <h1 className='text-gray-600 p-2'>Login</h1>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg"
            >
                <div className='flex justify-center text-3xl text-[--buttonsColor]'>
                    <SiAuth0 />
                </div>

                <form onSubmit={handelSubmitForm} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id='email'
                            required
                            onChange={handleCHangeInput}
                            value={formData.email}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password:
                        </label>
                        <input
                            type="password"
                            id='password'
                            required
                            onChange={handleCHangeInput}
                            value={formData.password}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <button type='submit' className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[--buttonsColor] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {isFormSubmitted ? <LoadingButtons /> : 'Logar'}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <div className="flex justify-center items-center space-x-2">
                        <span className="text-gray-700 text-sm">Não tem uma conta?</span>
                        <Link href='/auth/register' className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                            Registre-se.
                        </Link>
                    </div>
                    <Link
                        href={route('password.request')}
                        className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    >
                        Esqueceu sua senha?
                    </Link>
                </div>


                <div className="flex items-center justify-around">
                    <a href={`/loginWithSocial/google`} className="text-sm text-gray-600 hover:text-gray-500">
                        <BsGoogle className="text-3xl" />
                    </a>
                    <a href={`/loginWithSocial/github`} className="text-sm text-gray-600 hover:text-gray-500">
                        <BsGithub className="text-3xl" />
                    </a>
                </div>
            </motion.div>
        </div>
    );
};
