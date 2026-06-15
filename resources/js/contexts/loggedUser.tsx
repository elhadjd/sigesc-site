import { User } from "@/types";
import React, { ReactNode, createContext, useContext, useState } from "react";
import { StateChatToggleProvider } from "./stateChatToggleContext";

interface LoggedUserData {
    user: User,
    setUser: (value: User) => void,
    local: string,
    setLocal: (value: string) => void
}

interface UserLoggedProviderProps {
    children: ReactNode
}

const loggedUserContext = createContext<LoggedUserData | undefined>(undefined)

export const useLoggedUser = () => {
    const context = useContext(loggedUserContext)
    if (!context) {
        throw new Error('useFormState deve ser usado dentro de um FormStateProvider')
    }
    return context
}

export const UserLoggedProvider: React.FC<UserLoggedProviderProps> = ({ children }) => {
    const [local, setLocal] = useState('en')
    const [user, setUser] = useState<User>()
    return (
        <StateChatToggleProvider>
            <loggedUserContext.Provider value={{ user, setUser, local, setLocal, }}>
                {children}
            </loggedUserContext.Provider>
        </StateChatToggleProvider>

    )
}
