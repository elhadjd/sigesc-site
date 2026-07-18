import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const StateChatToggleContext = createContext(void 0);
const StateChatToggleProvider = ({ children }) => {
  const [stateToggleChat, setStateToggleChat] = useState(false);
  return /* @__PURE__ */ jsx(StateChatToggleContext.Provider, { value: { stateToggleChat, setStateToggleChat }, children });
};
const useStateChatToggle = () => {
  const context = useContext(StateChatToggleContext);
  if (!context) {
    throw new Error("useStateChatToggle must be used within a StateChatToggleProvider");
  }
  return context;
};
const loggedUserContext = createContext(void 0);
const useLoggedUser = () => {
  const context = useContext(loggedUserContext);
  if (!context) {
    throw new Error("useFormState deve ser usado dentro de um FormStateProvider");
  }
  return context;
};
const UserLoggedProvider = ({ children }) => {
  const [local, setLocal] = useState("en");
  const [user, setUser] = useState();
  return /* @__PURE__ */ jsx(StateChatToggleProvider, { children: /* @__PURE__ */ jsx(loggedUserContext.Provider, { value: { user, setUser, local, setLocal }, children }) });
};
export {
  UserLoggedProvider as U,
  useStateChatToggle as a,
  useLoggedUser as u
};
