import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const FormStateContext = createContext(void 0);
const useFormState = () => {
  const context = useContext(FormStateContext);
  if (!context) {
    throw new Error("useFormState deve ser usado dentro de um FormStateProvider");
  }
  return context;
};
const FormStateProvider = ({ children }) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  return /* @__PURE__ */ jsx(FormStateContext.Provider, { value: { isFormSubmitted, setIsFormSubmitted }, children });
};
export {
  FormStateProvider as F,
  useFormState as u
};
