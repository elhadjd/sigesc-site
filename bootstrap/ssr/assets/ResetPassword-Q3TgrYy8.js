import { jsx, jsxs } from "react/jsx-runtime";
import { H as HeaderComponent, F as FooterComponent } from "./Header-DS1KgxT3.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { I as InputLabel } from "./InputLabel-Czj3fUl0.js";
import { L as LoadingButtons } from "./loadingButtons-CO2cJ9-s.js";
import { useForm, Link, Head } from "@inertiajs/react";
import { useEffect } from "react";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
import "react-icons/vsc";
function ResetPassword(props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: props.token,
    email: props.email,
    password: "",
    password_confirmation: ""
  });
  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);
  const submit = (e) => {
    e.preventDefault();
    post(route("password.store"));
  };
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen mt-20 flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { href: `/${props.local}`, children: /* @__PURE__ */ jsx("img", { src: "https://admin.sisgesc.net/favicon.ico", className: "w-20 h-20 rounded-full", alt: "SIGESC FAVICON" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg", children: [
        /* @__PURE__ */ jsx(Head, { title: "Reset Password" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "email", value: "Email" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "email",
                type: "email",
                name: "email",
                value: data.email,
                className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                autoComplete: "username",
                onChange: (e) => setData("email", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: "Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "password",
                type: "password",
                name: "password",
                value: data.password,
                className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                autoComplete: "new-password",
                onChange: (e) => setData("password", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password_confirmation", value: "Confirm Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                name: "password_confirmation",
                value: data.password_confirmation,
                className: "mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm",
                autoComplete: "new-password",
                onChange: (e) => setData("password_confirmation", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-red-600", children: `${errors.email ? errors.email : ""} ${errors.password ? errors.password : ""}` }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end mt-4", children: /* @__PURE__ */ jsx("button", { className: "ms-4", children: processing ? /* @__PURE__ */ jsx(LoadingButtons, {}) : "Reset Password" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  ResetPassword as default
};
