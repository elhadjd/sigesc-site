import { jsx, jsxs } from "react/jsx-runtime";
import { H as HeaderComponent, F as FooterComponent } from "./Header-D07wN13G.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { Helmet } from "react-helmet";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "@inertiajs/react";
import "react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/ri";
import "react-icons/fi";
function DownloadThanks(props) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("script", { type: "text/javascript", children: `
          _linkedin_partner_id = "6855762";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        ` }),
      /* @__PURE__ */ jsx("script", { type: "text/javascript", children: `
          (function(l) {
            if (!l) {
              window.lintrk = function(a, b) {
                window.lintrk.q.push([a, b]);
              };
              window.lintrk.q = [];
            }
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";
            b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);
          })(window.lintrk);
        ` }),
      /* @__PURE__ */ jsx("noscript", { children: `
          <img
            height="1"
            width="1"
            style="display:none;"
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=6855762&fmt=gif"
          />
        ` })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-br from-blue-50 to-purple-100 flex items-center h-full overflow-y-auto pt-16 justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center my-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://admin.sisgesc.net/favicon.ico",
          alt: "Logo SIGESC",
          className: "w-24 h-24 animate-bounce"
        }
      ) }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-4", children: "Obrigado por baixar o SIGESC! 🎉" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 mb-8", children: "Agradecemos por escolher o SIGESC para gerenciar seu negocio. Estamos aqui para ajudar você a alcançar seus objetivos de forma eficiente e moderna." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 text-sm text-gray-500", children: [
        /* @__PURE__ */ jsx("p", { children: "Siga-nos nas redes sociais:" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center space-x-4 mt-2", children: [
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-gray-500 hover:text-blue-500", children: /* @__PURE__ */ jsx(FaFacebook, {}) }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-gray-500 hover:text-purple-500", children: /* @__PURE__ */ jsx(FaInstagram, {}) }),
          /* @__PURE__ */ jsx("a", { href: "#", className: "text-gray-500 hover:text-blue-400", children: /* @__PURE__ */ jsx(FaLinkedin, {}) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  DownloadThanks as default
};
