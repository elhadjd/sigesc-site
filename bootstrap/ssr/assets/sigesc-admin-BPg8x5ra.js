import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CFHV1WkI.js";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { Helmet } from "react-helmet";
import { FiDownload, FiDatabase, FiGlobe, FiArrowRight, FiCheck, FiTrendingUp, FiUsers, FiStar } from "react-icons/fi";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "react";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
const DownloadPage = (props) => {
  const handleDownload = (appVersion, appType) => {
    const downloadLink = route("download", { appType, appVersion });
    window.open(downloadLink, "_blank");
    setTimeout(() => {
      window.location.href = route("download.thanks");
    }, 3e3);
  };
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: "Baixe SIGESC - Software de Gestão Empresarial e Comercial para Windows" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Transforme a gestão comercial da sua empresa com o SIGESC, um software inovador, eficiente e fácil de usar. Baixe agora para Windows e MacOS."
        }
      ),
      /* @__PURE__ */ jsx("link", { rel: "shortcut icon", type: "image/x-icon", href: "https://admin.sisgesc.net/favicon.ico" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "keywords",
          content: "SIGESC, software de gestão angola, software de gestão gratuita, gestão empresarial, software para empresas, controle de estoque, SIGESC download"
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "author", content: "SIGESC TECH" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "Baixe SIGESC - Software de Gestão Completo" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Transforme a gestão da sua empresa com o SIGESC. Download gratuito disponível." }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://admin.sisgesc.net/og-image.jpg" })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "flex-grow", children: [
      /* @__PURE__ */ jsxs("section", { className: "relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-6 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black opacity-10" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 -mt-16 -mr-16 w-40 h-40 bg-white opacity-10 rounded-full" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 -mb-16 -ml-16 w-40 h-40 bg-white opacity-10 rounded-full" }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 },
            className: "max-w-4xl mx-auto relative z-10 text-center",
            children: [
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { scale: 0.9 },
                  animate: { scale: 1 },
                  transition: { duration: 0.5, delay: 0.2 },
                  className: "inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm",
                  children: /* @__PURE__ */ jsx(FiDownload, { className: "w-12 h-12 text-white" })
                }
              ),
              /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight", children: [
                "Potencialize sua ",
                /* @__PURE__ */ jsx("span", { className: "text-blue-300", children: "Gestão Empresarial" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed", children: "Baixe o SIGESC e transforme a maneira como você gerencia seu negócio com ferramentas profissionais e intuitivas." }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center items-center gap-6 mb-12", children: [
                /* @__PURE__ */ jsxs(
                  motion.button,
                  {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: () => handleDownload("2_0_3", "offline"),
                    className: "flex items-center justify-center gap-3 bg-white text-blue-700 font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-lg transition-all duration-300 w-full sm:w-auto",
                    children: [
                      /* @__PURE__ */ jsx(FiDatabase, { className: "w-6 h-6" }),
                      "Versão Local",
                      /* @__PURE__ */ jsx(FiDownload, { className: "w-5 h-5" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  motion.button,
                  {
                    whileHover: { scale: 1.05 },
                    whileTap: { scale: 0.95 },
                    onClick: () => handleDownload("3_0_0", "online"),
                    className: "flex items-center justify-center gap-3 bg-blue-500 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-lg transition-all duration-300 w-full sm:w-auto",
                    children: [
                      /* @__PURE__ */ jsx(FiGlobe, { className: "w-6 h-6" }),
                      "Versão Online",
                      /* @__PURE__ */ jsx(FiArrowRight, { className: "w-5 h-5" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-6 text-blue-200", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FiCheck, { className: "w-5 h-5 text-green-300" }),
                  /* @__PURE__ */ jsx("span", { children: "Instalação Rápida" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FiCheck, { className: "w-5 h-5 text-green-300" }),
                  /* @__PURE__ */ jsx("span", { children: "Suporte 24/7" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(FiCheck, { className: "w-5 h-5 text-green-300" }),
                  /* @__PURE__ */ jsx("span", { children: "Atualizações Gratuitas" })
                ] })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("section", { className: "py-20 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "text-center mb-16",
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "Escolha a versão ideal para o seu negócio" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Duas opções poderosas para atender diferentes necessidades empresariais" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -50 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 0.2 },
              className: "bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 relative",
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg", children: "Mais Popular" }),
                /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx(FiDatabase, { className: "w-7 h-7 text-blue-600" }) }),
                    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Versão Local" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "Ideal para empresas que preferem ter total controle dos dados e operar sem dependência de internet." }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-8", children: [
                    "Dados armazenados localmente",
                    "Funciona sem internet",
                    "Maior controle sobre informações",
                    "Performance otimizada",
                    "Backup automático"
                  ].map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FiCheck, { className: "w-4 h-4 text-green-600" }) }),
                    /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: feature })
                  ] }, index)) }),
                  /* @__PURE__ */ jsxs(
                    motion.button,
                    {
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                      onClick: () => handleDownload("2_0_3", "offline"),
                      className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-3",
                      children: [
                        /* @__PURE__ */ jsx(FiDownload, { className: "w-5 h-5" }),
                        "Baixar Agora"
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, x: 50 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 0.4 },
              className: "bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200",
              children: /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx(FiGlobe, { className: "w-7 h-7 text-indigo-600" }) }),
                  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Versão Online" })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: "Perfeita para quem busca flexibilidade e acesso remoto aos dados da empresa de qualquer lugar." }),
                /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-8", children: [
                  "Acesso de qualquer dispositivo",
                  "Atualizações automáticas",
                  "Sem necessidade de instalação",
                  "Dados em nuvem segura",
                  "Colaboração em tempo real"
                ].map((feature, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(FiCheck, { className: "w-4 h-4 text-indigo-600" }) }),
                  /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: feature })
                ] }, index)) }),
                /* @__PURE__ */ jsxs(
                  motion.button,
                  {
                    whileHover: { scale: 1.02 },
                    whileTap: { scale: 0.98 },
                    onClick: () => handleDownload("3_0_0", "online"),
                    className: "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-3",
                    children: [
                      /* @__PURE__ */ jsx(FiArrowRight, { className: "w-5 h-5" }),
                      "Acessar Online"
                    ]
                  }
                )
              ] })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-20 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "text-center mb-16",
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "Recursos que transformam sua gestão" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Descubra todas as ferramentas poderosas que o SIGESC oferece para o seu negócio" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
          {
            icon: /* @__PURE__ */ jsx(FiTrendingUp, { className: "w-8 h-8" }),
            title: "Gestão Completa",
            description: "Controle total sobre vendas, estoque, funcionários e finanças em um único sistema integrado.",
            color: "text-blue-600",
            bgColor: "bg-blue-100"
          },
          {
            icon: /* @__PURE__ */ jsx(FiUsers, { className: "w-8 h-8" }),
            title: "Multi-usuário",
            description: "Trabalhe em equipe com diferentes níveis de acesso e permissões personalizadas.",
            color: "text-green-600",
            bgColor: "bg-green-100"
          },
          {
            icon: /* @__PURE__ */ jsx(FiStar, { className: "w-8 h-8" }),
            title: "Interface Intuitiva",
            description: "Design moderno e fácil de usar, reduzindo a curva de aprendizado e aumentando a produtividade.",
            color: "text-purple-600",
            bgColor: "bg-purple-100"
          }
        ].map((feature, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 50 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5, delay: index * 0.2 },
            className: "bg-gray-50 rounded-2xl p-6 text-center group hover:shadow-xl transition-all duration-300",
            children: [
              /* @__PURE__ */ jsx("div", { className: `w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`, children: /* @__PURE__ */ jsx("div", { className: feature.color, children: feature.icon }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: feature.title }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: feature.description })
            ]
          },
          index
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-6", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "text-center mb-16",
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", children: "O que nossos clientes dizem" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto", children: "Empresas que transformaram sua gestão com o SIGESC" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          {
            name: "João Silva",
            company: "Silva Comércio Ltda",
            feedback: "O SIGESC revolucionou nossa forma de gerenciar o negócio. A eficiência aumentou em 40% e temos total controle sobre nossas operações.",
            rating: 5
          },
          {
            name: "Maria Santos",
            company: "P.D.Andre Comercio Geral",
            feedback: "Recomendo para qualquer empresa que queira otimizar seus processos. A equipe de suporte é excepcional e sempre pronta para ajudar.",
            rating: 5
          }
        ].map((testimonial, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 50 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5, delay: index * 0.2 },
            className: "bg-gray-800 rounded-2xl p-8 backdrop-blur-sm",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-4", children: [...Array(testimonial.rating)].map((_, i) => /* @__PURE__ */ jsx(FiStar, { className: "w-5 h-5 text-yellow-400 fill-current" }, i)) }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-200 italic text-lg mb-6 leading-relaxed", children: [
                '"',
                testimonial.feedback,
                '"'
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-white text-lg", children: testimonial.name }),
                /* @__PURE__ */ jsx("p", { className: "text-blue-300", children: testimonial.company })
              ] })
            ]
          },
          index
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-20 bg-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-6 text-center", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          className: "bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 shadow-2xl",
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-6", children: "Pronto para transformar sua empresa?" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl text-blue-100 mb-10 max-w-2xl mx-auto", children: "Junte-se a milhares de empresas que já elevam sua gestão a um novo nível com o SIGESC." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-6", children: [
              /* @__PURE__ */ jsxs(
                motion.button,
                {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: () => handleDownload("2_0_3", "offline"),
                  className: "bg-white text-blue-700 font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3",
                  children: [
                    /* @__PURE__ */ jsx(FiDownload, { className: "w-5 h-5" }),
                    "Baixar Versão Local"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                motion.button,
                {
                  whileHover: { scale: 1.05 },
                  whileTap: { scale: 0.95 },
                  onClick: () => handleDownload("3_0_0", "online"),
                  className: "bg-blue-500 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3",
                  children: [
                    /* @__PURE__ */ jsx(FiGlobe, { className: "w-5 h-5" }),
                    "Acessar Versão Online"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm mt-8", children: "Instalação rápida • Suporte 24/7 • Atualizações gratuitas" })
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
};
export {
  DownloadPage as default
};
