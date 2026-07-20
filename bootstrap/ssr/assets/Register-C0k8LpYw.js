import { jsxs, jsx } from "react/jsx-runtime";
import { BiCaretDown, BiSearch } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { motion } from "framer-motion";
import { router, Link } from "@inertiajs/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { u as useFormState, F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { r as routeApi } from "./index-DJUNAe3r.js";
import { P as PreviewImage } from "./previewImage-DUYGizu3.js";
import { L as LoadingButtons } from "./loadingButtons-CO2cJ9-s.js";
import { BsGoogle, BsGithub } from "react-icons/bs";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import "react-icons/vsc";
const userRegisterServices = () => {
  const [stateSubmit, setStateSubmit] = useState(false);
  const { setIsFormSubmitted } = useFormState();
  const { RoutePost } = routeApi();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    image: "",
    accountType: "",
    providerId: "sisgesc.net",
    country: {
      name: "",
      code: ""
    },
    password: "",
    password_confirmation: ""
  });
  const [stateFormListCountry, setStateFormListCountry] = useState(false);
  const handleCHangeInput = (event) => {
    formData[event.target.id] = event.target.value;
    setFormData({ ...formData });
  };
  const handleCHangeCountry = (country) => {
    formData.country = country;
    setFormData({ ...formData });
    setStateFormListCountry(false);
  };
  const handelSubmitForm = (event, image) => {
    if (image != void 0)
      formData.image = image;
    setFormData({ ...formData });
    event.preventDefault();
    if (stateSubmit)
      return;
    if (formData.password != formData.password_confirmation)
      return toast.warning("As duas senha não estão egual, por favor verifica e tenta novamente !!!");
    setIsFormSubmitted(true);
    RoutePost(`auth/registerUser`, { ...formData }).then((response) => {
      toast.success(response.data.message, { position: "top-right" });
      if (response.data.message && response.data.type == "success")
        router.get("/verificar-email");
    }).catch((err) => {
      toast.warning(err.response.data.message, { position: "top-right" });
      console.log(err);
    }).finally(() => {
      setIsFormSubmitted(false);
    });
  };
  const [countries, setCountries] = useState({
    store: [],
    list: []
  });
  useEffect(() => {
    (async () => {
      await axios.get("/data/country.json").then((response) => {
        countries.list = response.data;
        countries.store = response.data;
        setCountries({ ...countries });
      }).catch((err) => {
        console.log(err);
      });
    })();
  }, []);
  const handlerSearchCountry = (name) => {
    countries.list = countries.store.filter((country) => {
      return String(country.name).toLocaleLowerCase().includes(String(name.toLocaleLowerCase()));
    });
    setCountries({ ...countries });
  };
  return {
    formData,
    countries,
    handleCHangeInput,
    handelSubmitForm,
    handleCHangeCountry,
    handlerSearchCountry,
    stateFormListCountry,
    setStateFormListCountry
  };
};
const Register = () => {
  const { countries, formData, handelSubmitForm, handleCHangeCountry, handleCHangeInput, handlerSearchCountry, stateFormListCountry, setStateFormListCountry } = userRegisterServices();
  const { onFileChange, createImg, image } = PreviewImage();
  const { isFormSubmitted } = useFormState();
  return /* @__PURE__ */ jsxs(motion.div, { style: { width: "300px !importante" }, className: "flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-400 to-blue-600 min-h-screen", children: [
    /* @__PURE__ */ jsx(ToastContainer, {}),
    /* @__PURE__ */ jsx(Link, { href: "/", className: "font-bold text-4xl text-white", children: "SIGESC" }),
    /* @__PURE__ */ jsx("h1", { className: "p-2 text-white", children: "Cadastro de usuario" }),
    /* @__PURE__ */ jsx(motion.div, { className: "w-full flex justify-center items-center", initial: { y: -250, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { type: "spring", stiffness: 300 }, children: /* @__PURE__ */ jsxs("form", { onSubmit: (e) => handelSubmitForm(e, image), className: "bg-white p-6 rounded-lg shadow-lg w-full max-w-md w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
        /* @__PURE__ */ jsx(AiOutlineUserAdd, { className: "mx-auto text-5xl" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Crie sua conta" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "surname", className: "block text-sm font-medium text-gray-700", children: "Apelido:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "surname",
              required: true,
              onChange: (e) => handleCHangeInput(e),
              value: formData.surname,
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Nome completo:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "name",
              required: true,
              onChange: (e) => handleCHangeInput(e),
              value: formData.name,
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              id: "email",
              required: true,
              onChange: (e) => handleCHangeInput(e),
              value: formData.email,
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 relative", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "country", className: "block text-sm font-medium text-gray-700", children: "País:" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-left", children: /* @__PURE__ */ jsxs("span", { onClick: () => setStateFormListCountry(!stateFormListCountry), className: "flex justify-between items-center", children: [
            formData.country.name !== "" ? formData.country.name : "Escolha seu país",
            " ",
            /* @__PURE__ */ jsx(BiCaretDown, {})
          ] }) }),
          stateFormListCountry && /* @__PURE__ */ jsxs("div", { className: "absolute z-10 bg-white w-full mt-1 rounded-md shadow-lg", children: [
            /* @__PURE__ */ jsxs("span", { className: "px-3 flex space-x-2 items-center py-2", children: [
              /* @__PURE__ */ jsx(BiSearch, {}),
              /* @__PURE__ */ jsx(
                "input",
                {
                  onChange: (e) => handlerSearchCountry(e.target.value),
                  type: "search",
                  placeholder: "Pesquisar...",
                  className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "max-h-60 overflow-auto", children: countries.list.map((country) => /* @__PURE__ */ jsx(
              "li",
              {
                onClick: () => handleCHangeCountry(country),
                className: "px-3 py-2 hover:bg-gray-100 cursor-pointer",
                children: country.name
              },
              country.code
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Tipo de conta:" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-around items-center bg-white border border-gray-300 rounded-md p-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "radio",
                  id: "accountType",
                  name: "accountType",
                  onChange: (e) => handleCHangeInput(e),
                  value: "client",
                  checked: formData.accountType === "client",
                  className: "text-indigo-600 border-gray-300"
                }
              ),
              "Cliente"
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "radio",
                  name: "accountType",
                  value: "partner",
                  id: "accountType",
                  onChange: (e) => handleCHangeInput(e),
                  checked: formData.accountType === "partner",
                  className: "text-indigo-600 border-gray-300"
                }
              ),
              "Parceiro"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Senha:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              required: true,
              onChange: (e) => handleCHangeInput(e),
              value: formData.password,
              id: "password",
              placeholder: "Digite a sua senha",
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "password_confirmation", className: "block text-sm font-medium text-gray-700", children: "Confirmar senha:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "password",
              id: "password_confirmation",
              required: true,
              onChange: (e) => handleCHangeInput(e),
              placeholder: "Confirma a sua senha",
              className: "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:outline-none focus:shadow-outline transition duration-300"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx("button", { type: "submit", className: "w-full flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out", children: !isFormSubmitted ? "Registrar" : /* @__PURE__ */ jsx(LoadingButtons, {}) }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
        "Já tem uma conta? ",
        /* @__PURE__ */ jsx(Link, { href: `/auth`, className: "text-blue-700 hover:underline", children: "Entrar" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex p-4 space-x-6 text-3xl justify-center", children: [
        /* @__PURE__ */ jsx("a", { href: `/loginWithSocial/google`, children: /* @__PURE__ */ jsx(BsGoogle, {}) }),
        /* @__PURE__ */ jsx("a", { href: `/loginWithSocial/github`, children: /* @__PURE__ */ jsx(BsGithub, {}) })
      ] })
    ] }) })
  ] });
};
function RegisterPage() {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsx(FormStateProvider, { children: /* @__PURE__ */ jsx(Register, {}) }) });
}
export {
  RegisterPage as default
};
