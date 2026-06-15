import { Login } from '@/Components/auth/LogIn'
import { UserLoggedProvider } from '@/contexts/loggedUser'
import { FormStateProvider } from '@/contexts/stateForm'
import React from 'react'

export default function AuthComponent(props: {local: string}) {
  return (
    <UserLoggedProvider>
        <FormStateProvider>
            <Login />
        </FormStateProvider>
    </UserLoggedProvider>

  )
}
