import { routeApi } from "@/axiosConfig";
import { useLoggedUser } from "@/contexts/loggedUser";
import { useFormState } from "@/contexts/stateForm";
import { User } from "@/types";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

export const UserServices = ((local:string)=>{
    const {setIsFormSubmitted} = useFormState()
    const {user,setUser} = useLoggedUser()
    const {RoutePost,RouteGet} = routeApi()
    const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        if(name == 'country'|| name == 'phone'||name == 'surname'|| name == 'address'){
            setUser({ ...user,user_profile:{...user.user_profile, [name]: value }});
        }else{
            setUser({ ...user, [name]: value });
        }

    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        setIsFormSubmitted(true)
        RoutePost(`${local}/editUserInfo/${user.id}`,{...user})
        .then((response:{data:{message:string,type:string,data:User}}) => {
            toast[response.data.type](response.data.message,{position: 'top-right'})
            if(response.data.type == 'success') setUser({...response.data.data})
        }).catch((err:any) => {
            toast.error(err.response.data.message,{position: 'top-right'})
            console.log(err);
        }).finally(()=>{
            setIsFormSubmitted(false)
        });
    };

    const verifyUserEmail = (()=>{
        RouteGet(`${local}/notify-user-to-verify-email/${user.id}`)
        .then((response:{data: {message: string,type:string}}) => {
            console.log(response.data);
        }).catch((err) => {

        });
    })

    return {
        verifyUserEmail,
        handleSubmit,
        handleInputChange
    }
})
