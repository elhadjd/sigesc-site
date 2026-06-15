import axios from "axios"
import React, { useRef, useState } from "react"
import { toast } from "react-toastify"
import { useFormState } from "../contexts/stateForm"
import { router } from "@inertiajs/react"
interface FormPayment{
    email: string,
    nif: string,

}
interface Product{
    description: string,
    price: number,
    total: number,
    discount: number
}
export const PaymentsLicense = (({fiscalIdentification,email}:{email?: string,fiscalIdentification?:string})=>{
    const {setIsFormSubmitted} = useFormState()
    const [formPayment,setFormPayment] = useState<FormPayment>({
        email: email?email:'',
        nif: fiscalIdentification ? fiscalIdentification : ''
    })
    const [product,setProduct] = useState<Product>({
        description: '',
        price: 0,
        total: 0,
        discount: 0
    })

    const [paid,setPaid] = useState<boolean>(false)
    const [loaded,setLoaded] = useState<boolean>(false)

    const handlerChangeInput = ((id:string,value: string)=>{
        formPayment[id] = value
        setFormPayment({...formPayment})
    })

    async function handlerSubmitForm(e: React.FormEvent<HTMLFormElement>):Promise <void>{
        e.preventDefault()
        setIsFormSubmitted(true)
        return await axios.post('https://bosgc.sisgesc.net/api/RequestAmount',{
            ...formPayment
        },{
            headers: {
                Authorization: 'oEn34JE6gDfVuZlR6QRWX8Q2byn9repjspVFWoz2SZdncBYePGc7XoKZ8Noo',
            }
        }).then((response) => {
            if (response.data.client) {
                return dataAtribuite(response)
            }
            toast.warn('Dados não encontrado, por favor verifica os dados e tenta novamente ')
        }).catch((err) => {
          console.log(err);
        }).finally(()=>{
            setIsFormSubmitted(false)
        });
    }

    const dataAtribuite = ((data: any)=>{
        product.description = data.data.client.license.license_type.name
        product.price = data.data.client.account_client[0].restPayable
        product.total = data.data.client.account_client[0].total
        product.discount = data.data.client.account_client[0].discount
        setProduct({...product})
    })

    return {formPayment,paid,setPaid,loaded,setLoaded,dataAtribuite,handlerChangeInput,product,handlerSubmitForm}
})
