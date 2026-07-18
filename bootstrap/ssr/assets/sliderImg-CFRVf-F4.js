import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Keyboard, EffectCreative } from "swiper";
import { FiZoomIn, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
function SliderImg() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const images = [
    {
      path: "/img/billing/SIGESC Software de Gestao Empresarial .png",
      name: "Relatórios Financeiros Analíticos",
      category: "Financeiro"
    },
    {
      path: "/img/Sigesc Paineies proficionais.png",
      name: "Painéis Profissionais Personalizáveis",
      category: "Dashboard"
    },
    {
      path: "/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png",
      name: "Análises Financeiras Detalhadas",
      category: "Financeiro"
    },
    {
      path: "/img/stock/Sigesc software de gestao comercial gratis relatorios-stock.png",
      name: "Cálculo de Custos e Margens",
      category: "Estoque"
    },
    {
      path: "/img/stock/Sigesc software de gestao comercial gratis gestao de stock.png",
      name: "Gestão Completa de Produtos",
      category: "Estoque"
    },
    {
      path: "/img/point-of-sale/SIGESC Software de Gestao Empresarial Pdv Pos Ponto de venda Software gratuito.png",
      name: "Sistema de Ponto de Venda (PDV)",
      category: "PDV"
    },
    {
      path: "/img/billing/SIGESC Software de Gestao Empresarial Lista de faturas.png",
      name: "Gestão de Faturas ",
      category: "Vendas"
    },
    {
      path: "/img/employee/sigesc controlo-ponto.png",
      name: "Controlo de Ponto",
      category: "RH"
    },
    {
      path: "/img/billing/SIGESC Software de Gestao Empresarial emissao-de-fatura.png",
      name: "Emissão de Faturas Personalizadas",
      category: "Vendas"
    },
    {
      path: "/img/point-of-sale/software de gestao angola Gestao de promocoes e descontos.png",
      name: "Gestão de Promoções e Descontos",
      category: "PDV"
    },
    {
      path: "/img/point-of-sale/software de gestao angola pdv-vendas-rapidas.png",
      name: "Sistema de Vendas Rápidas",
      category: "PDV"
    },
    {
      path: "/img/point-of-sale/software de gestao angola pdv-multi-pagamentos.png",
      name: "Suporte a Múltiplos Métodos de Pagamento",
      category: "PDV"
    },
    {
      path: "/img/stock/Sigesc software de gestao comercial gratis Gestao de variants e attributes.png",
      name: "Gestão de Variantes e Atributos",
      category: "Estoque"
    },
    {
      path: "/img/stock/Sigesc software de gestao comercial gratis gestao de tranferencia de produtos entre armagens.png",
      name: "Gestão de Transferência de Produtos entre Armazéns",
      category: "Estoque"
    },
    {
      path: "/img/purchase/gestao-compras-dashboard.png",
      name: "Gestão de Compras e Fornecedores",
      category: "Compras"
    },
    {
      category: "logistica",
      name: "Gestão de Alertas Automáticos",
      path: "/img/logistics/SIGESC Software de Gestao Empresarial Logistica gestao de alertas automaticas.png"
    },
    {
      path: "/img/employee/sigesc Calculo de horas e salarios.png",
      name: "Cálculo de Horas e Salários",
      category: "RH"
    },
    {
      path: "/img/employee/sigesc pagamentos de funcionarios.png",
      name: "Pagamentos de Funcionários",
      category: "RH"
    },
    {
      category: "logistica",
      name: "Gestão de Logística e Entregas",
      path: "/img/logistics/SIGESC Software de Gestao Empresarial Logistica gestao de frota.png"
    }
  ];
  const categories = [...new Set(images.map((img) => img.category))];
  const [activeCategory, setActiveCategory] = useState("Todos");
  const filteredImages = activeCategory === "Todos" ? images : images.filter((img) => img.category === activeCategory);
  const toggleAutoplay = () => {
    if (swiperInstance) {
      if (isPlaying) {
        swiperInstance.autoplay.stop();
      } else {
        swiperInstance.autoplay.start();
      }
      setIsPlaying(!isPlaying);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AnimatePresence, { children: selectedImage && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4",
        onClick: () => setSelectedImage(null),
        children: /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { scale: 0.8 },
            animate: { scale: 1 },
            exit: { scale: 0.8 },
            className: "relative max-w-6xl max-h-full",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: selectedImage.path,
                  alt: selectedImage.name,
                  loading: "eager",
                  decoding: "sync",
                  className: "w-full h-auto rounded-lg shadow-2xl"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg", children: selectedImage.name }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "absolute top-4 left-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors",
                  onClick: () => setSelectedImage(null),
                  children: "✕"
                }
              )
            ]
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveCategory("Todos"),
          className: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === "Todos" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
          children: "Todos"
        }
      ),
      categories.map((category) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveCategory(category),
          className: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
          children: category
        },
        category
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsx(
        Swiper,
        {
          onSwiper: setSwiperInstance,
          autoplay: {
            delay: 3e3,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          },
          slidesPerView: 1,
          spaceBetween: 20,
          centeredSlides: true,
          loop: true,
          grabCursor: true,
          keyboard: { enabled: true },
          breakpoints: {
            640: {
              slidesPerView: 1,
              spaceBetween: 20
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40
            }
          },
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
          },
          pagination: {
            clickable: true,
            el: ".swiper-pagination",
            renderBullet: (index, className) => {
              return `<span class="${className} bg-white/50 hover:bg-white/80 transition-colors"></span>`;
            }
          },
          modules: [Autoplay, Navigation, Pagination, Keyboard, EffectCreative],
          effect: "creative",
          creativeEffect: {
            prev: {
              shadow: true,
              translate: ["-120%", 0, -500]
            },
            next: {
              shadow: true,
              translate: ["120%", 0, -500]
            }
          },
          className: "mySwiper",
          children: filteredImages.map((image, index) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsxs(
            motion.div,
            {
              whileHover: { scale: 1.02 },
              className: "relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "aspect-video relative overflow-hidden", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: image.path,
                      alt: image.name,
                      className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                      loading: "lazy"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setSelectedImage(image),
                      className: "bg-white/90 p-3 rounded-full hover:bg-white transition-colors",
                      title: "Ampliar imagem",
                      children: /* @__PURE__ */ jsx(FiZoomIn, { className: "text-gray-800 text-lg" })
                    }
                  ) }) }),
                  /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: "bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium", children: image.category }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-800 mb-1 text-sm line-clamp-2", children: image.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-xs", children: [
                    "Sistema SIGESC - ",
                    image.category
                  ] })
                ] })
              ]
            }
          ) }, index))
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "swiper-button-prev !hidden md:!flex !w-12 !h-12 !bg-white/90 !rounded-full !shadow-lg !text-gray-800 hover:!bg-white transition-all duration-300", children: /* @__PURE__ */ jsx(FiChevronLeft, { className: "text-xl" }) }),
      /* @__PURE__ */ jsx("div", { className: "swiper-button-next !hidden md:!flex !w-12 !h-12 !bg-white/90 !rounded-full !shadow-lg !text-gray-800 hover:!bg-white transition-all duration-300", children: /* @__PURE__ */ jsx(FiChevronRight, { className: "text-xl" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 right-4 z-10 flex items-center gap-2", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleAutoplay,
          className: "bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors",
          title: isPlaying ? "Pausar slideshow" : "Continuar slideshow",
          children: isPlaying ? /* @__PURE__ */ jsx(FiPause, { className: "text-gray-800 text-lg" }) : /* @__PURE__ */ jsx(FiPlay, { className: "text-gray-800 text-lg" })
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "swiper-pagination !bottom-2" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center mt-6", children: /* @__PURE__ */ jsxs("span", { className: "text-gray-600 text-sm", children: [
      "Mostrando ",
      filteredImages.length,
      " de ",
      images.length,
      " imagens",
      activeCategory !== "Todos" && ` na categoria ${activeCategory}`
    ] }) })
  ] });
}
const styles = `
.mySwiper {
  padding: 20px 10px 60px !important;
}

.swiper-button-prev,
.swiper-button-next {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover .swiper-button-prev,
.group:hover .swiper-button-next {
  opacity: 1;
}

.swiper-pagination-bullet-active {
  background: white !important;
  transform: scale(1.2);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.group:hover .float-animation {
  animation: float 2s ease-in-out infinite;
}
`;
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
export {
  SliderImg as default
};
