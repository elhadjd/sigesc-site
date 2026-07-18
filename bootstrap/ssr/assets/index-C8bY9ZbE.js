import { jsxs, jsx } from "react/jsx-runtime";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { router, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { L as LoadingButtons } from "./loadingButtons-CO2cJ9-s.js";
import { useState } from "react";
import { u as useFormState, F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { r as routeApi } from "./index-DJUNAe3r.js";
import { toast, ToastContainer } from "react-toastify";
import { SiAuth0 } from "react-icons/si";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import "react-icons/vsc";
import "axios";
const loginServices = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    weekConnect: false
  });
  const { Login: Login2 } = routeApi();
  const { setIsFormSubmitted } = useFormState();
  const [stateForm, setStateForm] = useState({
    register: true
  });
  const handlerChangeForm = (state) => {
    stateForm.register = state;
    setStateForm({ ...stateForm });
  };
  const handleCHangeInput = (event) => {
    formData[event.target.id] = event.target.id == "weekConnect" ? event.target.checked : event.target.value;
    setFormData({ ...formData });
  };
  const handelSubmitForm = async (event) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    event.preventDefault();
    setStateForm({ ...stateForm });
    setIsFormSubmitted(true);
    try {
      const response = await Login2(formData);
      if ((_a = response.data) == null ? void 0 : _a.message) {
        toast.success(response.data.message, { position: "top-right" });
      }
      if (((_b = response.data) == null ? void 0 : _b.type) === "success") {
        router.get("/");
      }
    } catch (err) {
      const message = ((_d = (_c = err == null ? void 0 : err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) || ((_h = (_g = (_f = (_e = err == null ? void 0 : err.response) == null ? void 0 : _e.data) == null ? void 0 : _f.errors) == null ? void 0 : _g.email) == null ? void 0 : _h[0]) || "Não foi possível iniciar sessão.";
      toast.error(message, { position: "top-right" });
    } finally {
      setIsFormSubmitted(false);
    }
  };
  return {
    formData,
    stateForm,
    handelSubmitForm,
    handleCHangeInput,
    handlerChangeForm
  };
};
const Login = () => {
  const { formData, handelSubmitForm, handleCHangeInput } = loginServices();
  const { isFormSubmitted } = useFormState();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-8", children: [
    /* @__PURE__ */ jsx(ToastContainer, {}),
    /* @__PURE__ */ jsxs(Link, { href: "/", className: "static text-3xl font-bold", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[--app_color]", children: "S" }),
      /* @__PURE__ */ jsx("span", { className: "text-[--buttonsColor]", children: "IGESC" })
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "text-gray-600 p-2", children: "Login" }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 },
        className: "max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center text-3xl text-[--buttonsColor]", children: /* @__PURE__ */ jsx(SiAuth0, {}) }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handelSubmitForm, className: "space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "text-sm font-medium text-gray-700", children: "Email:" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  id: "email",
                  required: true,
                  onChange: handleCHangeInput,
                  value: formData.email,
                  className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "text-sm font-medium text-gray-700", children: "Password:" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  id: "password",
                  required: true,
                  onChange: handleCHangeInput,
                  value: formData.password,
                  className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("button", { type: "submit", className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[--buttonsColor] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: isFormSubmitted ? /* @__PURE__ */ jsx(LoadingButtons, {}) : "Logar" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center space-x-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-700 text-sm", children: "Não tem uma conta?" }),
              /* @__PURE__ */ jsx(Link, { href: "/auth/register", className: "text-blue-600 hover:text-blue-800 text-sm font-semibold", children: "Registre-se." })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("password.request"),
                className: "mt-4 inline-block text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md",
                children: "Esqueceu sua senha?"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-around", children: [
            /* @__PURE__ */ jsx("a", { href: `/loginWithSocial/google`, className: "text-sm text-gray-600 hover:text-gray-500", children: /* @__PURE__ */ jsx(BsGoogle, { className: "text-3xl" }) }),
            /* @__PURE__ */ jsx("a", { href: `/loginWithSocial/github`, className: "text-sm text-gray-600 hover:text-gray-500", children: /* @__PURE__ */ jsx(BsGithub, { className: "text-3xl" }) })
          ] })
        ]
      }
    )
  ] });
};
function AuthComponent(props) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsx(FormStateProvider, { children: /* @__PURE__ */ jsx(Login, {}) }) });
}
export {
  AuthComponent as default
};
