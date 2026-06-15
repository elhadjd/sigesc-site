import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StateChatToggleContextType {
    stateToggleChat: boolean;
    setStateToggleChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const StateChatToggleContext = createContext<StateChatToggleContextType | undefined>(undefined);

export const StateChatToggleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stateToggleChat, setStateToggleChat] = useState(false);

    return (
        <StateChatToggleContext.Provider value={{ stateToggleChat, setStateToggleChat }}>
            {children}
        </StateChatToggleContext.Provider>
    );
};

export const useStateChatToggle = (): StateChatToggleContextType => {
    const context = useContext(StateChatToggleContext);
    if (!context) {
        throw new Error('useStateChatToggle must be used within a StateChatToggleProvider');
    }
    return context;
};
