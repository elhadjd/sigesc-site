import React from 'react';
import { AiFillCrown, AiFillPieChart, AiOutlineCreditCard, AiOutlineTeam } from 'react-icons/ai';
import { motion } from 'framer-motion';

export default function Why ({ actionPreviewText }) {
  const sections = [
    {
      id: 'text2',
      Icon: AiFillCrown,
      title: "PDV Avançado para Vendas Ágeis",
      description: "Nosso sistema de PDV foi criado para simplificar suas vendas. Com uma interface intuitiva, você consegue gerenciar transações, controlar o estoque em tempo real e oferecer uma experiência de compra incrível para seus clientes. Tudo isso sem complicações.",
    },
    {
      id: 'text3',
      Icon: AiFillPieChart,
      title: "Controle Financeiro sem Dores de Cabeça",
      description: "Emita faturas profissionais, acompanhe pagamentos e gerencie suas contas com facilidade. Com o SIGESC, você tem uma visão clara das finanças da sua empresa, evitando surpresas e mantendo tudo em dia.",
    },
    {
      id: 'text4',
      Icon: AiOutlineCreditCard,
      title: "Compras Inteligentes e Eficientes",
      description: "Gerencie fornecedores, cotações e pedidos de forma integrada. Com análises de custos e estoque em tempo real, você economiza tempo e dinheiro, garantindo que nunca falte o que você precisa.",
    },
    {
      id: 'text5',
      Icon: AiOutlineTeam,
      title: "Estoque e Equipe Sob Controle",
      description: "Mantenha seu estoque sempre organizado e evite excessos ou falta de produtos. Além disso, gerencie sua equipe com facilidade, desde escalas de trabalho até o desempenho de cada colaborador.",
    },
  ];

  return (
    <div className="p-2 md:p-8 bg-gray-50">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-500">Por que escolher o SIGESC?</h2>
        <p className="text-lg text-gray-600 mt-4">
          Descubra como o SIGESC pode transformar a gestão do seu negócio, trazendo eficiência, organização e resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {sections.map(({ id, Icon, title, description }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer"
            onClick={() => actionPreviewText(id)}
          >
            <div className="text-center text-blue-500">
              <Icon className="text-5xl mx-auto" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-800 text-center">{title}</h3>
            <p className="mt-4 text-gray-600 text-center">{description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
