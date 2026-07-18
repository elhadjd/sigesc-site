import React, { useEffect, useState } from 'react'
import {useFormState} from '../contexts/stateForm'
import { routeApi } from '../axiosConfig'
import { toast } from "react-toastify";
import { router } from '@inertiajs/react'
interface dataType{
  email: string,
  password: string,
  weekConnect: boolean
}
interface StateForm{
    register: boolean,
}
export const loginServices = () => {
    const [formData ,setFormData] = useState<dataType>({
        email: '',
        password: '',
        weekConnect: false
    })
    const {Login} = routeApi()
    const {setIsFormSubmitted} = useFormState()
    const [stateForm, setStateForm] = useState<StateForm>({
        register: true
    })
    const handlerChangeForm = ((state: boolean)=>{
        stateForm.register = state
        setStateForm({...stateForm})
    })


    const handleCHangeInput = ((event:any)=>{
        formData[event.target.id] = event.target.id == 'weekConnect' ? event.target.checked : event.target.value
        setFormData({...formData})
    })

    const handelSubmitForm = (async(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        setStateForm({...stateForm});
        setIsFormSubmitted(true);
        try {
            const response = await Login(formData);
            if (response.data?.message) {
                toast.success(response.data.message, { position: 'top-right' });
            }
            if (response.data?.type === 'success') {
                router.get('/');
            }
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.email?.[0] ||
                'Não foi possível iniciar sessão.';
            toast.error(message, { position: 'top-right' });
        } finally {
            setIsFormSubmitted(false);
        }
    })

    return {
        formData,
        stateForm,
        handelSubmitForm,
        handleCHangeInput,
        handlerChangeForm,
    }
}
