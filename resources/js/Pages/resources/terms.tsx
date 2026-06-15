import FooterComponent from '@/Components/home/Footer'
import { HeaderComponent } from '@/Components/home/Header'
import TermsComponent from '@/Components/policies/termsComponent'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import { User } from '@/types'
import React from 'react'

export default function Terms({ auth, local }: { auth: { user: User }, local: string }) {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={auth} />
                <TermsComponent />
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    )
}
