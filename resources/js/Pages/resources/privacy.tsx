import FooterComponent from '@/Components/home/Footer'
import { HeaderComponent } from '@/Components/home/Header'
import PrivacyComponent from '@/Components/policies/privacyComponent'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import { User } from '@/types'
import React from 'react'

export default function Privacy({ auth, local }: { auth: { user: User }, local: string }) {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={auth} />
                <PrivacyComponent />
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    )
}
