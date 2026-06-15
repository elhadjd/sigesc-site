import React, { useEffect, useState } from "react";
interface dataType {
  surname: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  newsletter:boolean,
  account:boolean
}
import { toast } from "react-toastify";
import { useForm } from "@inertiajs/react";
export const contactsServices = () => {
  const [buttonSubmitDisable,setButtonSubmitDisable] = useState<boolean>(false)
  const {data, setData,reset, post,hasErrors,wasSuccessful, processing,errors} = useForm<dataType>({
    surname: "",
    name: "",
    phone: "",
    email: "",
    message: "",
    newsletter:false,
    account: false
  });

  const handelSubmitForm = (event: React.FormEvent<HTMLElement>) => {
    if(buttonSubmitDisable) return
    event.preventDefault();
    if(buttonSubmitDisable) return toast.info('Formulario enviado',{position: 'top-right'})
    post("/contact/sendMessage",{onSuccess:()=>reset(),onError:(errors)=>{
console.log(errors)
toast.error('Erro ao enviar o formulario, verifique os campos e tente novamente',{position: 'top-right'})
}});
    // setButtonSubmitDisable(true)
  };
  return { setData,data,errors,wasSuccessful,hasErrors, handelSubmitForm,processing };
};
