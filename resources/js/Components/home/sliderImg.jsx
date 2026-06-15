import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination, Autoplay, EffectCreative } from "swiper";
import { FiZoomIn, FiPlay, FiPause, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

export default function SliderImg() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const images = [
    {
      path: '/img/billing/SIGESC Software de Gestao Empresarial .png',
      name: 'Relatórios Financeiros Analíticos',
      category: 'Financeiro'
    },
    {
      path: '/img/Sigesc Paineies proficionais.png',
      name: 'Painéis Profissionais Personalizáveis',
      category: 'Dashboard'
    },
    {
      path: '/img/billing/SIGESC Software de Gestao Empresarial Sigesc Paineies proficionais.png',
      name: 'Análises Financeiras Detalhadas',
      category: 'Financeiro'
    },
    {
      path: '/img/stock/Sigesc software de gestao comercial gratis relatorios-stock.png',
      name: 'Cálculo de Custos e Margens',
      category: 'Estoque'
    },
    {
      path: '/img/stock/Sigesc software de gestao comercial gratis gestao de stock.png',
      name: 'Gestão Completa de Produtos',
      category: 'Estoque'
    },
    {
      path: '/img/point-of-sale/SIGESC Software de Gestao Empresarial Pdv Pos Ponto de venda Software gratuito.png',
      name: 'Sistema de Ponto de Venda (PDV)',
      category: 'PDV'
    },
    {
      path: '/img/billing/SIGESC Software de Gestao Empresarial Lista de faturas.png',
      name: 'Gestão de Faturas ',
      category: 'Vendas'
    },
    {
      path:'/img/employee/sigesc controlo-ponto.png',
      name: 'Controlo de Ponto',
      category: 'RH'
    },
    {
      path: '/img/billing/SIGESC Software de Gestao Empresarial emissao-de-fatura.png',
      name: 'Emissão de Faturas Personalizadas',
      category: 'Vendas'
    },
    {
      path: '/img/point-of-sale/software de gestao angola Gestao de promocoes e descontos.png',
      name: 'Gestão de Promoções e Descontos',
      category: 'PDV'
    },
    {
      path: '/img/point-of-sale/software de gestao angola pdv-vendas-rapidas.png',
      name: 'Sistema de Vendas Rápidas',
      category: 'PDV'
    },
    {
      path: '/img/point-of-sale/software de gestao angola pdv-multi-pagamentos.png',
      name: 'Suporte a Múltiplos Métodos de Pagamento',
      category: 'PDV'
    },
    {
      path:'/img/stock/Sigesc software de gestao comercial gratis Gestao de variants e attributes.png',
      name: 'Gestão de Variantes e Atributos',
      category: 'Estoque'
    },
    {
      path:'/img/stock/Sigesc software de gestao comercial gratis gestao de tranferencia de produtos entre armagens.png',
      name: 'Gestão de Transferência de Produtos entre Armazéns',
      category: 'Estoque'
    },
    {
      path:'/img/purchase/gestao-compras-dashboard.png',
      name: 'Gestão de Compras e Fornecedores',
      category: 'Compras'
    },
    {
        category: 'logistica',
        name: 'Gestão de Alertas Automáticos',
        path: '/img/logistics/SIGESC Software de Gestao Empresarial Logistica gestao de alertas automaticas.png'
    },
    {
      path:'/img/employee/sigesc Calculo de horas e salarios.png',
      name: 'Cálculo de Horas e Salários',
      category: 'RH'
    },
    {
      path:'/img/employee/sigesc pagamentos de funcionarios.png',
      name: 'Pagamentos de Funcionários',
      category: 'RH'
    },
    {
        category: 'logistica',
        name: 'Gestão de Logística e Entregas',
        path: '/img/logistics/SIGESC Software de Gestao Empresarial Logistica gestao de frota.png'
    }
  ];

  const categories = [...new Set(images.map(img => img.category))];
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredImages = activeCategory === 'Todos'
    ? images
    : images.filter(img => img.category === activeCategory);

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

  return (
    <>
      {/* Modal de imagem ampliada */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.path}
                alt={selectedImage.name}
                loading="eager" // Carregamento eager para imagem crítica
                decoding="sync"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg">
                {selectedImage.name}
              </div>
              <button
                className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtro de categorias */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveCategory('Todos')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === 'Todos'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Slider principal */}
      <div className="relative group">
        <Swiper
          onSwiper={setSwiperInstance}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          slidesPerView={1}
          spaceBetween={20}
          centeredSlides={true}
          loop={true}
          grabCursor={true}
          keyboard={{ enabled: true }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination',
            renderBullet: (index, className) => {
              return `<span class="${className} bg-white/50 hover:bg-white/80 transition-colors"></span>`;
            },
          }}
          modules={[Autoplay, Navigation, Pagination, Keyboard, EffectCreative]}
          effect="creative"
          creativeEffect={{
            prev: {
              shadow: true,
              translate: ["-120%", 0, -500],
            },
            next: {
              shadow: true,
              translate: ["120%", 0, -500],
            },
          }}
          className="mySwiper"
        >
          {filteredImages.map((image, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={image.path}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Overlay com informações */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                      <button
                        onClick={() => setSelectedImage(image)}
                        className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors"
                        title="Ampliar imagem"
                      >
                        <FiZoomIn className="text-gray-800 text-lg" />
                      </button>
                    </div>
                  </div>

                  {/* Badge de categoria */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {image.category}
                    </span>
                  </div>
                </div>

                {/* Informações da imagem */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm line-clamp-2">
                    {image.name}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    Sistema SIGESC - {image.category}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Controles de navegação personalizados */}
        <div className="swiper-button-prev !hidden md:!flex !w-12 !h-12 !bg-white/90 !rounded-full !shadow-lg !text-gray-800 hover:!bg-white transition-all duration-300">
          <FiChevronLeft className="text-xl" />
        </div>
        <div className="swiper-button-next !hidden md:!flex !w-12 !h-12 !bg-white/90 !rounded-full !shadow-lg !text-gray-800 hover:!bg-white transition-all duration-300">
          <FiChevronRight className="text-xl" />
        </div>

        {/* Controles de autoplay */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={toggleAutoplay}
            className="bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            title={isPlaying ? 'Pausar slideshow' : 'Continuar slideshow'}
          >
            {isPlaying ? (
              <FiPause className="text-gray-800 text-lg" />
            ) : (
              <FiPlay className="text-gray-800 text-lg" />
            )}
          </button>
        </div>

        {/* Paginação personalizada */}
        <div className="swiper-pagination !bottom-2"></div>
      </div>

      {/* Contador de imagens */}
      <div className="text-center mt-6">
        <span className="text-gray-600 text-sm">
          Mostrando {filteredImages.length} de {images.length} imagens
          {activeCategory !== 'Todos' && ` na categoria ${activeCategory}`}
        </span>
      </div>
    </>
  );
};

// CSS adicional para o componente
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

// Adicionar estilos ao documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
