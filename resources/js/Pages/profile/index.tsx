import FooterComponent from '@/Components/home/Footer'
import { HeaderComponent } from '@/Components/home/Header'
import EditProfile from '@/Components/user/editProfile'
import ProfileComponent from '@/Components/user/profile'
import { UserServices } from '@/Components/user/services'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import { User } from '@/types'
import React, { useEffect, useState } from 'react'

export default function ProfilePage(props: { auth: { user: User }, local: string }) {
    const [stateForEdit, setStateFormEdit] = useState<boolean>(false)

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={props.auth} />
                {
                    !stateForEdit ? <ProfileComponent openForEdit={() => setStateFormEdit(!stateForEdit)} props={props} />
                        : <EditProfile Props={props} closeForEdit={() => setStateFormEdit(!stateForEdit)} />
                }
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    )
}
