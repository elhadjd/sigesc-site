
import React from 'react';
import { BiCaretDown, BiSearch } from 'react-icons/bi';
import { AiOutlineUserAdd } from 'react-icons/ai'; // Ícone de adição de usuário
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { userRegisterServices } from '../../services/register';
import { PreviewImage } from '@/services/public/previewImage';
import LoadingButtons from '@/ui/loadingButtons';
import { useFormState } from '@/contexts/stateForm';
import { ToastContainer } from 'react-toastify';
import { BsGithub, BsGoogle } from 'react-icons/bs';

export const Register = () => {
    const { countries, formData, handelSubmitForm, handleCHangeCountry, handleCHangeInput, handlerSearchCountry, stateFormListCountry, setStateFormListCountry } = userRegisterServices();
    const { onFileChange, createImg, image } = PreviewImage();
    const { isFormSubmitted } = useFormState();

    return (
        <motion.div style={{ width: "300px !importante" }} className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-400 to-blue-600 min-h-screen">
            <ToastContainer />
            <Link href='/' className='font-bold text-4xl text-white'>SIGESC</Link>
            <h1 className='p-2 text-white'>Cadastro de usuario</h1>
            <motion.div className='w-full flex justify-center items-center' initial={{ y: -250, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                <form onSubmit={(e) => handelSubmitForm(e, image)} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md w-full">
                    <div className="text-center mb-4">
                        <AiOutlineUserAdd className="mx-auto text-5xl" />
                        <h2 className="text-2xl font-bold">Crie sua conta</h2>
                    </div>
                    {/* Campos do formulário */}
                    <div className="space-y-4">
                        <div className="mt-4">
                            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Apelido:</label>
                            <input type="text" id='surname' required onChange={(e) => handleCHangeInput(e)} value={formData.surname}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo:</label>
                            <input type="text" id='name' required onChange={(e) => handleCHangeInput(e)} value={formData.name}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                            <input type="email" id='email' required onChange={(e) => handleCHangeInput(e)} value={formData.email}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300" />
                        </div>
                        <div className="mt-4 relative">
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">País:</label>
                            <button type="button" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left">
                                <span onClick={() => setStateFormListCountry(!stateFormListCountry)} className="flex justify-between items-center">
                                    {formData.country.name !== '' ? formData.country.name : 'Escolha seu país'} <BiCaretDown />
                                </span>
                            </button>
                            {stateFormListCountry && (
                                <div className="absolute z-10 bg-white w-full mt-1 rounded-md shadow-lg">
                                    <span className="px-3 flex space-x-2 items-center py-2">
                                        <BiSearch />
                                        <input
                                            onChange={(e) => handlerSearchCountry(e.target.value)}
                                            type="search"
                                            placeholder="Pesquisar..."
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                                        />
                                    </span>
                                    <ul className="max-h-60 overflow-auto">
                                        {countries.list.map((country) => (
                                            <li
                                                key={country.code}
                                                onClick={() => handleCHangeCountry(country)}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {country.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Tipo de conta:
                            </label>
                            <div className='flex flex-row justify-around items-center bg-white border border-gray-300 rounded-md p-2'>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id='accountType'
                                        name="accountType"
                                        onChange={(e) => handleCHangeInput(e)}
                                        value="client"
                                        checked={formData.accountType === 'client'}
                                        className="text-indigo-600 border-gray-300"
                                    />
                                    Cliente
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="accountType"
                                        value="partner"
                                        id='accountType'
                                        onChange={(e) => handleCHangeInput(e)}
                                        checked={formData.accountType === 'partner'}
                                        className="text-indigo-600 border-gray-300"
                                    />
                                    Parceiro
                                </label>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha:</label>
                            <input type="password" required onChange={(e) => handleCHangeInput(e)} value={formData.password} id='password' placeholder='Digite a sua senha'
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300" />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirmar senha:
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                required
                                onChange={(e) => handleCHangeInput(e)}
                                placeholder="Confirma a sua senha"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                            />
                        </div>

                    </div>
                    <div className="mt-6">
                        <button type='submit' className="w-full flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out">
                            {!isFormSubmitted ? 'Registrar' : <LoadingButtons />}
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-sm">Já tem uma conta? <Link href={`/auth`} className="text-blue-700 hover:underline">Entrar</Link></p>
                    </div>
                    <div className='flex p-4 space-x-6 text-3xl justify-center'>
                        <a href={`/loginWithSocial/google`}><BsGoogle /></a>
                        <a href={`/loginWithSocial/github`}><BsGithub /></a>
                    </div>
                </form>

            </motion.div>
        </motion.div>
    );
};
