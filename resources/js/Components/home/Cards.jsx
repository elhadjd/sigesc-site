import React from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiCheckCircle,
  FiBarChart2,
  FiShoppingCart,
  FiDollarSign,
  FiTruck,
  FiUsers,
  FiStar,
  FiAward
} from 'react-icons/fi';
import { performanceMetrics } from '@/services/public/veriables';

export default function Cards() {
  const features = [
    {
      icon: <FiShoppingCart className="text-lg" />,
      title: "PDV Avançado",
      description: "Vendas rápidas com integração total"
    },
    {
      icon: <FiDollarSign className="text-lg" />,
      title: "Gestão Financeira",
      description: "Controle completo do fluxo de caixa"
    },
    {
      icon: <FiTruck className="text-lg" />,
      title: "Compras & Stock",
      description: "Gestão inteligente de inventário"
    },
    {
      icon: <FiUsers className="text-lg" />,
      title: "Equipe Integrada",
      description: "Gestão de funcionários e permissões"
    }
  ];

  const competitiveAdvantages = [
    "Suporte 24/7 em Angola",
    "Implementação em 72h",
    "Treinamento inclusivo",
    "Actualizações gratuitas"
  ];

  return (
    <div className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Compacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full mb-4">
            <FiAward className="text-white" />
            <span className="text-sm font-medium">Solução Premium</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tudo o que sua empresa precisa
            <span className="block text-blue-600">em uma única plataforma</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema completo de gestão empresarial com todos os módulos integrados para maximizar sua produtividade.
          </p>
        </motion.div>

        {/* Card Principal Compacto */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Conteúdo Principal */}
            <div className="space-y-6">
              {/* Vantagens Competitivas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FiStar className="text-blue-600" />
                  Diferenciais Exclusivos
                </h3>
                <div className="grid gap-3">
                  {competitiveAdvantages.map((advantage, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="text-blue-600 text-sm" />
                      </div>
                      <span className="text-gray-700 text-sm">{advantage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white/50 rounded-xl border border-gray-200/30">
                {
                    performanceMetrics.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-xl font-bold text-blue-600">{stat.number}</div>
                            <div className="text-xs text-gray-600">{stat.label}</div>
                        </div>
                    ))}
              </div>

              {/* CTA Principal */}
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://admin.sisgesc.net/getting-started"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>Começar Agora - Grátis</span>
                <FiArrowRight className="text-lg" />
              </motion.a>
            </div>

            {/* Grid de Funcionalidades */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                  className="bg-white rounded-xl p-4 border border-gray-200/60 hover:border-blue-300/50 hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-xs leading-tight">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Rodapé do Card */}
          <div className="bg-white/80 border-t border-gray-200/50 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-green-600 text-sm" />
                </div>
                <span className="text-sm text-gray-600">Teste gratuito por 30 dias</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-400 text-sm" />
                  <FiStar className="text-yellow-400 text-sm" />
                  <FiStar className="text-yellow-400 text-sm" />
                  <FiStar className="text-yellow-400 text-sm" />
                  <FiStar className="text-yellow-400 text-sm" />
                  <span className="text-xs text-gray-600 ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparativo Rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200/50"
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Porque escolher o SIGESC?
            </h3>
            <p className="text-gray-600 text-sm">
              <span className="text-blue-600 font-medium">Preço acessível</span> +{' '}
              <span className="text-blue-600 font-medium">suporte local</span> +{' '}
              <span className="text-blue-600 font-medium">solução completa</span> ={' '}
              <span className="text-green-600 font-semibold">melhor custo-benefício</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
