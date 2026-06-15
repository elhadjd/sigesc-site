import { useLoggedUser } from '@/contexts/loggedUser';
import { PreviewImage } from '@/services/public/previewImage';
import { User } from '@/types';
import React, { useEffect, useState } from 'react'
import { UserServices } from './services';
import { BiCheck } from 'react-icons/bi';
import { useFormState } from '@/contexts/stateForm';
import LoadingButtons from '@/ui/loadingButtons';

export default function EditProfile({Props,closeForEdit}:{Props:{auth:{user:User},local: string},closeForEdit:VoidFunction}) {
    const {handleSubmit,handleInputChange} = UserServices(Props.local)
    const {user,setUser} = useLoggedUser()
    const {image,onFileChange,setImage} = PreviewImage()
    const {isFormSubmitted} = useFormState()

    useEffect(()=>{
        setUser({...Props.auth.user})
        setImage(Props.auth.user.user_profile.image)
    },[])

    useEffect(()=>{
        user.user_profile.image = image || null
    },[image])

  return (
    <div className="max-w-screen-md mx-auto p-5 mt-24">
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" name="nome" defaultValue={Props.auth.user.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Apelido</label>
                <input type="text" name="surname" defaultValue={Props.auth.user.user_profile.surname} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <span className='flex flex-row space-x-2 items-center'>
                    <input type="email" name="surname" disabled defaultValue={Props.auth.user.email} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                    {
                        user.email_verified_at == null ? <button type='button'>Verificar</button>:<BiCheck className='text-3xl text-green-500'/>
                    }
                </span>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input type="text" name="phone" defaultValue={Props.auth.user.user_profile.phone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Pais</label>
                <input type="text" name="country" defaultValue={Props.auth.user.user_profile.country} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Morada</label>
                <input type="text" name="address" defaultValue={Props.auth.user.user_profile.address} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Editar imagem</label>
                <input type="file" name="imagemPerfil" onChange={onFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>
            {Props.auth.user.user_profile.image && (
                <div className="mt-4">
                    <img src={image} alt="Pré-visualização" className="w-32 h-32 rounded-full"/>
                </div>
            )}
            <div className='flex flex-row justify-around'>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700" style={{backgroundColor: "var(--buttonsColor)"}}>
                    {isFormSubmitted ? <LoadingButtons/>:"Salvar Alterações"}
                </button>
                <button type='button' onClick={closeForEdit} className='px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700'>Voltar</button>
            </div>
        </form>
    </div>
  )
}
