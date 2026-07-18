import { jsx, jsxs } from "react/jsx-runtime";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CTrR7x_e.js";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { router } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
function VerifyEmail({ status, local, auth }) {
  const submit = async (e) => {
    e.preventDefault();
    router.get(`/notify-user-to-verify-email/${auth.user.id}`);
  };
  async function logout() {
    router.get(`/authenticate/logout`);
  }
  useEffect(() => {
    window.Echo.private(`user.email.verified.${auth.user.id}`).listen(".email.verified", (e) => {
      toast.success("Email verified successfully", { position: "top-right" });
      router.get(`/`);
    });
  }, []);
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [
      /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Email Verification" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm text-gray-600", children: "Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another." }),
        status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mb-4 font-medium text-sm text-green-600", children: "A new verification link has been sent to the email address you provided during registration." }),
        /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: submit, children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50",
              disabled: false,
              children: "Resend Verification Email"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              onClick: logout,
              className: "underline cursor-pointer text-sm text-gray-600 hover:text-gray-900",
              children: "Log Out"
            }
          ) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  VerifyEmail as default
};
