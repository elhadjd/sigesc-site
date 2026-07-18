import { jsx, jsxs } from "react/jsx-runtime";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CTrR7x_e.js";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { useForm, Link, Head } from "@inertiajs/react";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
function ForgotPassword(props) {
  const { data, setData, post, processing, errors } = useForm({
    email: ""
  });
  const submit = (e) => {
    e.preventDefault();
    post(route("password.email", props.local));
  };
  window.Echo.private(`resetPassword.${data.email}`).listen(".password.reset", (e) => {
    console.log(e);
  });
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { href: `/${props.local}`, children: /* @__PURE__ */ jsx("img", { src: "https://admin.sisgesc.net/favicon.ico", className: "w-20 h-20 rounded-full", alt: "SIGESC FAVICON" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg", children: [
        /* @__PURE__ */ jsx(Head, { title: "Forgot Password" }),
        /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-gray-600", children: "Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one." }),
        props.status && /* @__PURE__ */ jsx("div", { className: "mb-4 font-medium text-sm text-green-600", children: props.status }),
        /* @__PURE__ */ jsx("span", { className: "text-red-500", children: errors.email }),
        errors.email != null && /* @__PURE__ */ jsx(Link, { href: `/${props.local}/auth`, className: "underline ", style: { color: "var(--buttonsColor)" }, children: " Create a new account" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-8 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email address" }),
            /* @__PURE__ */ jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsx(
              "input",
              {
                id: "email",
                type: "email",
                name: "email",
                autoComplete: "email",
                required: true,
                className: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                value: data.email,
                onChange: (e) => setData("email", e.target.value)
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-end mt-4", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50",
              disabled: processing,
              children: "Email Password Reset Link"
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  ForgotPassword as default
};
