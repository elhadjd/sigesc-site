import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { HeaderComponent } from '@/Components/home/Header';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { User } from '@/types';
import FooterComponent from '@/Components/home/Footer';

const ProductCard = ({ product }: { product: any }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="rounded-lg shadow-lg overflow-hidden bg-white"
        >
            <Link href={`/shop/${product.id}`}>
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover object-center" />
                <div className="p-4">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-bold">{product.price}</span>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                            Comprar
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
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

export default function StorePage(props: { auth: { user: User }, local: string }) {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={props.auth} />
                <div className="container mt-10 mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-center mb-12">Loja SIGESC-TECH</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <ProductCard key={index} product={product} />
                        ))}
                    </div>
                </div>
                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
