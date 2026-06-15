import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  FiArrowRight
} from 'react-icons/fi';
import { features } from '@/services/public/veriables';

export default function Apps() {


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

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Compacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Módulos do{' '}
            <span className="text-blue-600">SIGESC</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conheça todas as funcionalidades integradas da nossa plataforma completa
          </p>
        </motion.div>

        {/* Grid de Módulos Compacto */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {features.filter(app => app.name !== 'Faturamento'&& app.name !== 'Gestão Financeira'&& app.name !== 'Compras'&&app.name !== 'Agendamentos').map((app, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Link
                href={app.href}
                className="block bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200/60 hover:border-blue-300/50 hover:shadow-md transition-all duration-300 h-full"
              >
                {/* Ícone */}
                <div className={`w-12 h-12 bg-${app.color}-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <app.icon className={`text-${app.color}-600 text-xl`} />
                </div>

                {/* Nome do Módulo */}
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                  {app.name}
                </h3>

                {/* Descrição Curta */}
                <p className="text-gray-600 text-xs leading-tight line-clamp-2">
                  {app.desc}
                </p>

                {/* Seta indicativa */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiArrowRight className={`text-${app.color}-600 text-sm`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Minimalista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            <span>Ver todos os módulos em detalhe</span>
            <FiArrowRight className="text-lg" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
