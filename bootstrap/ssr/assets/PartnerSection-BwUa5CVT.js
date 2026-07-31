import { jsxs, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
function BecomePartnerSection() {
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden bg-[#0b2833] py-16 px-4", style: { gridArea: "P" }, children: [
    /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,165,207,.25),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(127,212,232,.12),transparent_35%)]" }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.5 },
        className: "relative mx-auto max-w-4xl text-center",
        children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.22em] text-[#7fd4e8]", children: "SIGESC" }),
          /* @__PURE__ */ jsx("h2", { className: "mt-3 font-serif text-3xl text-white sm:text-4xl", children: "Torne-se um Parceiro" }),
          /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-2xl text-white/75", children: "Parceria com o nosso sistema por 30.000 Kz/mês. Licenças limitadas para a versão offline — suporte, implantação e crescimento junto de PME em Angola." }),
          /* @__PURE__ */ jsx(motion.div, { whileHover: { scale: 1.03 }, className: "mt-8 inline-block", children: /* @__PURE__ */ jsx(
            Link,
            {
              href: "/parceria",
              className: "inline-block bg-[#00a5cf] px-6 py-3 text-sm font-semibold tracking-wide text-[#071820] transition hover:bg-[#3ec4e6]",
              children: "Ver programa de parceria"
            }
          ) })
        ]
      }
    )
  ] });
}
export {
  BecomePartnerSection as default
};
