import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { f as features } from "./Header-DF037L4K.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "./loggedUser-DyDIPP3j.js";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
function Apps() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "py-12 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        className: "text-center mb-10",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: [
            "Módulos do",
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: "SIGESC" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Conheça todas as funcionalidades integradas da nossa plataforma completa" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4",
        children: features.filter((app) => app.name !== "Faturamento" && app.name !== "Gestão Financeira" && app.name !== "Compras" && app.name !== "Agendamentos").map((app, index) => /* @__PURE__ */ jsx(
          motion.div,
          {
            variants: itemVariants,
            whileHover: { y: -4 },
            className: "group",
            children: /* @__PURE__ */ jsxs(
              Link,
              {
                href: app.href,
                className: "block bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200/60 hover:border-blue-300/50 hover:shadow-md transition-all duration-300 h-full",
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-12 h-12 bg-${app.color}-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`, children: /* @__PURE__ */ jsx(app.icon, { className: `text-${app.color}-600 text-xl` }) }),
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 text-sm mb-2 line-clamp-2", children: app.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-xs leading-tight line-clamp-2", children: app.desc }),
                  /* @__PURE__ */ jsx("div", { className: "mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsx(FiArrowRight, { className: `text-${app.color}-600 text-sm` }) })
                ]
              }
            )
          },
          index
        ))
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.4 },
        className: "text-center mt-8",
        children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/modules",
            className: "inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm",
            children: [
              /* @__PURE__ */ jsx("span", { children: "Ver todos os módulos em detalhe" }),
              /* @__PURE__ */ jsx(FiArrowRight, { className: "text-lg" })
            ]
          }
        )
      }
    )
  ] }) });
}
export {
  Apps as default
};
