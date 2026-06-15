import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useFormState } from '../contexts/stateForm'
import { routeApi } from '@/axiosConfig'
import { router } from '@inertiajs/react'
interface dataType{
  name: string,
  surname: string,
  email: string,
  password: string,
  password_confirmation: string,
  providerId: string,
  accountType: string,
  image: string,
  country: {
    name: string,
    code: string
  }
}

interface countriesTs{
    list: {code: string,name:string}[],
    store: {code: string,name:string}[],
}
export const userRegisterServices = () => {
  const [stateSubmit,setStateSubmit] = useState<boolean>(false)
  const {setIsFormSubmitted} = useFormState()
  const {RoutePost} = routeApi()
  const [formData ,setFormData] = useState<dataType>({
    name: '',
    surname: '',
    email: '',
    image: '',
    accountType: '',
    providerId: 'sisgesc.net',
    country: {
      name: '',
      code: ''
    },
    password: '',
    password_confirmation: ''
  })
  const [stateFormListCountry,setStateFormListCountry] = useState<boolean>(false)

  const handleCHangeInput = ((event: {target:{id: string,value: string}})=>{
    formData[event.target.id] = event.target.value
    setFormData({...formData})
  })

  const handleCHangeCountry = ((country: {name: string,code: string})=>{
    formData.country = country
    setFormData({...formData})
    setStateFormListCountry(false)
  })

  const handelSubmitForm = ((event: React.FormEvent<HTMLElement>,image:any)=>{
    if(image != undefined) formData.image = image
    setFormData({...formData})
    event.preventDefault()
    if (stateSubmit) return
    if (formData.password != formData.password_confirmation) return toast.warning('As duas senha não estão egual, por favor verifica e tenta novamente !!!')
    setIsFormSubmitted(true)
    RoutePost(`auth/registerUser`,{...formData})
    .then((response) => {
      toast.success(response.data.message,{position: 'top-right'})
      if(response.data.message && response.data.type == 'success') router.get('/verificar-email')
    }).catch((err) => {
      toast.warning(err.response.data.message,{position: 'top-right'})
      console.log(err);
    }).finally(()=>{
      setIsFormSubmitted(false)
    });
  })

  const [countries, setCountries] = useState<countriesTs>({
    store:[],
    list:[]
  })

  useEffect(()=>{
    (async ()=>{
        await axios.get('/data/country.json')
        .then((response) => {
          countries.list = response.data
          countries.store = response.data
          setCountries({...countries})
        }).catch((err) => {
          console.log(err);
        });
    })()
  },[])

  const handlerSearchCountry  = ((name: string)=>{
    countries.list = countries.store.filter((country: {name: string})=>{
      return String(country.name).toLocaleLowerCase().includes(String(name.toLocaleLowerCase()))
    })
    setCountries({...countries})
  })

  return {
    formData,
    countries,
    handleCHangeInput,
    handelSubmitForm,
    handleCHangeCountry,
    handlerSearchCountry,
    stateFormListCountry,
    setStateFormListCountry
  }
}
