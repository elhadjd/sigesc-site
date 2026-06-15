import FooterComponent from '@/Components/home/Footer'
import { HeaderComponent } from '@/Components/home/Header'
import Payment from '@/Components/listPrices/Payment'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import { User } from '@/types'
import React from 'react'

export default function paymentsComponent(props: { auth: { user: User }, local: string }, { fiscalIdentification, email }: { email?: string, fiscalIdentification?: string }) {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={props.auth} />
                <Payment email={email} fiscalIdentification={fiscalIdentification} />
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    )
}
