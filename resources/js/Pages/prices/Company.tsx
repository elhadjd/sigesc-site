import React, { useEffect, useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HeaderComponent } from '@/Components/home/Header';
import FooterComponent from '@/Components/home/Footer';
import { BiCaretDown, BiSearch } from 'react-icons/bi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User } from '@/types';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { FormStateProvider } from '@/contexts/stateForm';
import { DataTs, newCompanyService } from '@/services/newCompanyService';
import axios from 'axios';
import { spawn } from 'child_process';

export default function CompanyRegistration({ plan, auth, local }: { auth: { user: User }, local: string, plan: number }) {

    const { data, setShowActivityDropdown, errors, processing, setData,
        handleSelectActivity, handleSelectCountry, handleSubmit, showActivityDropdown, setShowCountryDropdown, showCountryDropdown } = newCompanyService(plan, local)

    const countries = useRef([])
    const activities = useRef([])
    useEffect(() => {
        (async () => {
            await axios.get('/data/country.json')
                .then((response) => {
                    countries.current = response.data
                }).catch((err) => {
                    console.log(err);
                });
            await axios.get('/data/activities.json')
                .then((response) => {
                    activities.current = response.data
                }).catch((err) => {
                    console.log(err);
                });
        })()
    }, [])
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={auth} />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mt-28 mb-10 mx-auto bg-white p-8 rounded-lg shadow mt-12"
                >
                    <h1 className="text-2xl font-bold mb-4">Cadastro de Empresa</h1>
                    <p className="mb-8">Preencha as informações abaixo para registrar sua empresa no nosso sistema e começar a desfrutar de todos os recursos disponíveis.</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField type='text' errors={errors} label="Nome" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputField type='text' errors={errors} label="Identificação Fiscal (NIF)" name="nif" value={data.nif} onChange={(e) => setData('nif', e.target.value)} />
                        <InputField type='text' errors={errors} label="Telefone" name="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        <InputField label="E-mail" errors={errors} type="email" name="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <DropdownSelect errors={errors}
                            label="País"
                            placeholder="Escolha seu país"
                            value={data.country}
                            showDropdown={showCountryDropdown}
                            setShowDropdown={setShowCountryDropdown}
                            items={countries.current}
                            onSelectItem={handleSelectCountry}
                        />

                        <DropdownSelect errors={errors}
                            label="Tipo de Atividade"
                            placeholder="Escolha a atividade"
                            value={data.activity}
                            showDropdown={showActivityDropdown}
                            setShowDropdown={setShowActivityDropdown}
                            items={activities.current}
                            onSelectItem={handleSelectActivity}
                        />
                        <InputField errors={errors} type='text' label="Cidade" name="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary"
                            disabled={processing}
                        >
                            Cadastrar
                        </motion.button>
                    </form>
                    <ToastContainer />
                </motion.div>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}

function InputField({ label, name, errors, type, value, onChange }: { label: string, name: string, type: string, value: string, errors: any, onChange(e: any): void }) {
    return (
        <>
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
            </div>
            {errors[name] != null && <span className='text-red-600'>{errors[name]}</span>}
        </>
    );
}


function DropdownSelect({ label, placeholder, value, showDropdown, errors, setShowDropdown, items, onSelectItem }
    : {
        label: string, placeholder: string, value: string, setShowDropdown(e: boolean): void,
        items: any, onSelectItem(e: any): void, errors: any, showDropdown: boolean
    }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    useEffect(() => {
        const results = items.filter((item: any) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(results);
    }, [searchTerm, items]);

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1">
                {errors[items.name] != null && <span className='text-red-600'>{errors[items.name]}</span>}
                <button type="button" className="input input-bordered w-full text-left border rounded-md p-2 flex justify-between items-center" onClick={() => setShowDropdown(!showDropdown)}>
                    {value || placeholder} <BiCaretDown />
                </button>
                {showDropdown && (
                    <div className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg">
                        <div className="p-2">
                            <div className="flex items-center border-b border-gray-300">
                                <BiSearch className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    className="input input-bordered w-full p-2"
                                    placeholder="Pesquisar..."
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-auto">
                            {filteredItems.map((item: DataTs) => (
                                <div key={item.name} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => onSelectItem(item)}>
                                    {item.name}
                                </div>
                            ))}
                            {filteredItems.length === 0 && (
                                <div className="p-2 text-gray-500">Nenhum item encontrado.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
