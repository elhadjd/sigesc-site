import FooterComponent from '@/Components/home/Footer'
import { HeaderComponent } from '@/Components/home/Header'
import HelpComponent from '@/Components/policies/helpComponent'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import { User } from '@/types'
import React from 'react'

export default function Help({ auth, local }: { auth: { user: User }, local: string }) {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={auth} />
                <HelpComponent />
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    )
}
