import React, { ReactNode, createContext, useContext, useState } from 'react'
interface FormState{
    isFormSubmitted: boolean,
    setIsFormSubmitted: (value: boolean)=>void
}

const FormStateContext = createContext<FormState |undefined>(undefined)

export const useFormState = ()=>{
    const context = useContext(FormStateContext)
    if (!context) {
        throw new Error('useFormState deve ser usado dentro de um FormStateProvider')
    }
    return context
}
interface formStateProviderProps{
    children: ReactNode
}
export const FormStateProvider: React.FC<formStateProviderProps> = ({children})=>{
    const [isFormSubmitted,setIsFormSubmitted] = useState(false)
    return (
        <FormStateContext.Provider value={{isFormSubmitted,setIsFormSubmitted}}>
            {children}
        </FormStateContext.Provider>
    )
}
