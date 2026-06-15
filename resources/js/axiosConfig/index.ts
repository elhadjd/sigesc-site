import axios from "axios";
import { Auth, User } from "firebase/auth";

export const Api = axios.create({
    baseURL: `/`
    // headers: {
    //     'Authorization': `Bearer `
    // }
});

export const routeApi = ()=>{
    const loginWithSocial = async(type: string)=>{
        return await Api.get(`loginWithSocial/${type}`)
    }

    const checkLoggedUser = ((data:User)=>{
        return Api.post('checkLoggedUser',{...data})
    })

    const Login = async(data:any)=>{
        return Api.post(`auth/login`,{...data})
    }

    const RoutePost = (async(route:string,data:any)=>{
        return await Api.post(route,{...data})
    })

    const RouteGet = (async(route:string)=>{
        return await Api.get(route)
    })

    const RouteDelete = (async(route:string)=>{
        return await Api.get(route)
    })

    return {
        loginWithSocial,
        checkLoggedUser,
        Login,
        RoutePost,
        RouteGet,
        RouteDelete
    }
}
