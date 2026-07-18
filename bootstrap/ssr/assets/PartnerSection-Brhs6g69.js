import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
function BecomePartnerSection() {
  return /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-blue-500 to-teal-400 py-12 px-4", style: { gridArea: "P" }, children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "max-w-4xl mx-auto text-center rounded-lg bg-white shadow-xl p-8",
      children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-4", children: "Torne-se um Parceiro" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "Junte-se ao nosso programa de parcerias e explore novas oportunidades de crescimento. Beneficie de nosso suporte dedicado, treinamentos exclusivos e acesso a recursos que impulsionarão seu sucesso." }),
        /* @__PURE__ */ jsx(motion.div, { whileHover: { scale: 1.05 }, children: /* @__PURE__ */ jsx(Link, { href: "en/auth/register", className: "inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors", children: "Cadastre-se Agora" }) })
      ]
    }
  ) });
}
export {
  BecomePartnerSection as default
};
