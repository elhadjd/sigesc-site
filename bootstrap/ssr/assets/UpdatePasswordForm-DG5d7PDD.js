import { jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { useForm, Link } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { I as InputLabel } from "./InputLabel-Czj3fUl0.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { H as HeaderComponent, F as FooterComponent } from "./Header-D07wN13G.js";
import { L as LoadingButtons } from "./loadingButtons-CO2cJ9-s.js";
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
function UpdatePasswordForm({ auth, local }) {
  const passwordInput = useRef();
  const currentPasswordInput = useRef();
  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const updatePassword = (e) => {
    e.preventDefault();
    put(route("password.update"), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors2) => {
        if (errors2.password) {
          reset("password", "password_confirmation");
        }
        if (errors2.current_password) {
          reset("current_password");
        }
      }
    });
  };
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col mt-20 sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { href: ``, children: /* @__PURE__ */ jsx("img", { src: "https://admin.sisgesc.net/favicon.ico", className: "w-20 h-20 rounded-full", alt: "SIGESC FAVICON" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg", children: /* @__PURE__ */ jsxs("section", { children: [
        /* @__PURE__ */ jsxs("header", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Update Password" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Ensure your account is using a long, random password to stay secure." })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: updatePassword, className: "mt-6 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "current_password", value: "Current Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "current_password",
                ref: currentPasswordInput,
                value: data.current_password,
                onChange: (e) => setData("current_password", e.target.value),
                type: "password",
                className: "mt-1 block w-full appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                autoComplete: "current-password"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password", value: "New Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "password",
                ref: passwordInput,
                value: data.password,
                onChange: (e) => setData("password", e.target.value),
                type: "password",
                className: "mt-1 block w-full appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                autoComplete: "new-password"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "password_confirmation", value: "Confirm Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "password_confirmation",
                value: data.password_confirmation,
                onChange: (e) => setData("password_confirmation", e.target.value),
                type: "password",
                className: "mt-1 block w-full appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                autoComplete: "new-password"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-red-500", children: [
            errors.password,
            " ",
            errors.current_password
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("button", { type: "submit", className: "p-2 w-48 flex justify-center text-white rounded", style: { backgroundColor: "var(--buttonsColor)" }, children: processing ? /* @__PURE__ */ jsx(LoadingButtons, {}) : "Save" }),
            /* @__PURE__ */ jsx(
              Transition,
              {
                show: recentlySuccessful,
                enter: "transition ease-in-out",
                enterFrom: "opacity-0",
                leave: "transition ease-in-out",
                leaveTo: "opacity-0",
                children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 ", children: "Saved." })
              }
            )
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  UpdatePasswordForm as default
};
