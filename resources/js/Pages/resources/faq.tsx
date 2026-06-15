import FooterComponent from '@/Components/home/Footer'
import { HeaderComponent } from '@/Components/home/Header'
import FaqComponent from '@/Components/policies/faqComponent'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import { User } from '@/types'
import React from 'react'

export default function Faq({ auth, local }: { auth: { user: User }, local: string }) {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={auth} />
                <FaqComponent />
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    )
}
