import { Register } from '@/Components/auth/RegisterComponent'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import React from 'react'

export default function RegisterPage() {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <Register />
            </FormStateProvider>
        </UserLoggedProvider>
    )
}
