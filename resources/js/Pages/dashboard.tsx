import React, { useEffect } from 'react'
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { FormStateProvider } from '@/contexts/stateForm';
import style from '@/../css/index.module.scss'
import { HeaderComponent } from '../Components/home/Header';
import { Demonstration } from '@/Components/home/Demonstration';
import FooterComponent from '@/Components/home/Footer';
import { User } from '@/types';
export default function dashboard(props: { auth: { user: User } }) {

    // window.Echo.private(`User.${props.auth?.user?.id}`)
    //     .listen('.user.created', (e: any) => {
    //         console.log(e);
    //     });

    return (
        <UserLoggedProvider>
            <div className={`${style.App} relative`}>
                <FormStateProvider>
                    <HeaderComponent auth={props.auth} />
                    <Demonstration auth={props.auth} />
                    {/* <Progress/> */}
                    <FooterComponent />
                </FormStateProvider>
            </div>
        </UserLoggedProvider>
    )
}
