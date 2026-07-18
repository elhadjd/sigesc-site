import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CTrR7x_e.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "react";
import "./index-DJUNAe3r.js";
import "axios";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
const ProductCard = ({ product }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      whileHover: { scale: 1.05 },
      transition: { type: "spring", stiffness: 300 },
      className: "rounded-lg shadow-lg overflow-hidden bg-white",
      children: /* @__PURE__ */ jsxs(Link, { href: `/shop/${product.id}`, children: [
        /* @__PURE__ */ jsx("img", { src: product.image, alt: product.name, className: "w-full h-56 object-cover object-center" }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: product.name }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: product.description }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold", children: product.price }),
            /* @__PURE__ */ jsx("button", { className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded", children: "Comprar" })
          ] })
        ] })
      ] })
    }
  );
};
const products = [
  // { id: 1, name: "Computador Gamer XYZ", description: "Alta performance para jogos", price: "R$ 5.000,00", image: "/images/computador-gamer.jpg", category: "Computadores" },
  // { id: 2, name: "Notebook Profissional ABC", description: "Ideal para trabalho e estudo", price: "R$ 3.200,00", image: "/images/notebook-profissional.jpg", category: "Notebooks" },
  // { id: 3, name: "Impressora LaserJet 123", description: "Impressões rápidas e de qualidade", price: "R$ 800,00", image: "/images/impressora-laser.jpg", category: "Impressoras" },
  // { id: 4, name: "Monitor UltraWide 49\"", description: "Expanda sua visão de trabalho", price: "R$ 2.200,00", image: "/images/monitor-ultrawide.jpg", category: "Monitores" },
  // { id: 5, name: "Teclado Mecânico RGB", description: "Precisão e conforto para gamers", price: "R$ 350,00", image: "/images/teclado-mecanico.jpg", category: "Acessórios" },
  // { id: 6, name: "Mouse Gamer XYZ", description: "Alta precisão e resposta rápida", price: "R$ 150,00", image: "/images/mouse-gamer.jpg", category: "Acessórios" },
  // { id: 7, name: "Headset 7.1 Canais", description: "Imersão total com áudio de alta qualidade", price: "R$ 420,00", image: "/images/headset.jpg", category: "Acessórios" },
  // { id: 8, name: "Cadeira Gamer Reclinável", description: "Conforto extremo para longas sessões", price: "R$ 1.200,00", image: "/images/cadeira-gamer.jpg", category: "Móveis" },
  // { id: 9, name: "Tablet XYZ 10\"", description: "Portabilidade e desempenho", price: "R$ 1.000,00", image: "/images/tablet.jpg", category: "Tablets" },
  // { id: 10, name: "Smartphone ABC Plus", description: "Tecnologia e inovação na palma da sua mão", price: "R$ 2.500,00", image: "/images/smartphone.jpg", category: "Smartphones" },
  // { id: 11, name: "SSD 1TB - Super Veloz", description: "Upgrade significativo de velocidade", price: "R$ 600,00", image: "/images/ssd.jpg", category: "Componentes" },
  // { id: 12, name: "HD Externo 2TB", description: "Amplie facilmente seu armazenamento", price: "R$ 450,00", image: "/images/hd-externo.jpg", category: "Armazenamento" },
  // { id: 13, name: "Webcam Full HD", description: "Imagem nítida para suas videoconferências", price: "R$ 320,00", image: "/images/webcam.jpg", category: "Acessórios" },
  // { id: 14, name: "Microfone Condensador", description: "Áudio profissional para gravações", price: "R$ 500,00", image: "/images/microfone.jpg", category: "Acessórios" },
  // { id: 15, name: "Roteador Wi-Fi 6", description: "Internet rápida e estável", price: "R$ 750,00", image: "/images/roteador.jpg", category: "Redes" },
  // { id: 16, name: "Pen Drive 128GB", description: "Compacto e com grande capacidade", price: "R$ 100,00", image: "/images/pen-drive.jpg", category: "Armazenamento" },
];
function StorePage(props) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsxs("div", { className: "container mt-10 mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-center mb-12", children: "Loja SIGESC-TECH" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8", children: products.map((product, index) => /* @__PURE__ */ jsx(ProductCard, { product }, index)) })
    ] }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  StorePage as default
};
