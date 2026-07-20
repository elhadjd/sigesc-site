import React from 'react';
import { AiFillInstagram, AiFillYoutube, AiOutlineContacts, AiOutlineMail } from 'react-icons/ai';
import { BiLogIn, BiLogoTiktok, BiStore, BiTag } from 'react-icons/bi';
import { BsBuilding, BsCash, BsFacebook, BsPhone } from 'react-icons/bs';
import { FaDownload, FaUsers } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import { useLoggedUser } from '@/contexts/loggedUser';
import ChatComponent from '@/ui/chat';
import { SIGESC_ADMIN_LOGIN_URL, SIGESC_ADMIN_URL, SIGESC_GETTING_STARTED_URL } from '@/services/public/domains';

export default function FooterComponent() {
    const { local } = useLoggedUser();

    return (
        <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
            <ChatComponent />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Company Info */}
                    <div className="lg:pr-6">
                        <Link href={``} className="inline-block mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="bg-blue-500 p-2 rounded-lg">
                                    <span className="text-white font-bold text-xl">S</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">IGESC</span>
                            </div>
                        </Link>
                        <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                            Transformando a gestão comercial com tecnologia inovadora e soluções inteligentes para o seu negócio.
                        </p>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center space-x-3 text-gray-600">
                                <BsPhone className="text-blue-500" />
                                <span className="text-sm">+244 929147445</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-600">
                                <AiOutlineMail className="text-blue-500" />
                                <span className="text-sm">comercial.sigesc@gmail.com</span>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <a href="https://www.facebook.com/Sisgesc" target="_blank" rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300">
                                <BsFacebook className="text-lg" />
                            </a>
                            <a href="https://www.tiktok.com/@sigesc" target="_blank" rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300">
                                <BiLogoTiktok className="text-lg" />
                            </a>
                            <a href="https://www.instagram.com/leonardo_vandunen/" target="_blank" rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300">
                                <AiFillInstagram className="text-lg" />
                            </a>
                            <a href="https://www.youtube.com/@sigescTech" target="_blank" rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300">
                                <AiFillYoutube className="text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-gray-900">Links Rápidos</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/blog/posts" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <span className="text-sm">Blog</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/calculadoras" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <span className="text-sm">Calculadoras fiscais</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/gerador-de-fatura" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <span className="text-sm">Criar fatura online</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/modelos-de-fatura" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <span className="text-sm">Modelos de fatura</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/pergunte-ao-especialista" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <span className="text-sm">Pergunte ao Especialista</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <AiOutlineContacts className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Contato</span>
                                </Link>
                            </li>
                            <li>
                                <Link href={route('download-page')} className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <FaDownload className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Downloads</span>
                                </Link>
                            </li>
                            <li>
                                <a href="https://store.sisgesc.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <BiStore className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Loja</span>
                                </a>
                            </li>
                            <li>
                                <Link href="/prices" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <BiTag className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Lista de Preço</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/payments" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <BsCash className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Pagamentos</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-gray-900">Sua Conta</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href={SIGESC_ADMIN_LOGIN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group"
                                >
                                    <BiLogIn className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Entrar</span>
                                </a>
                            </li>
                            <li>
                                <a href={SIGESC_ADMIN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <FaUsers className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Área do Cliente</span>
                                </a>
                            </li>
                            <li>
                                <a href={SIGESC_GETTING_STARTED_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors duration-300 group">
                                    <BsBuilding className="text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm">Crie sua empresa</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-5 text-gray-900">Recursos</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href={route('resources', { resource: 'privacy' })} className="text-gray-600 hover:text-blue-500 transition-colors duration-300 block py-1 text-sm">
                                    Política de Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link href={route('resources', { resource: 'terms' })} className="text-gray-600 hover:text-blue-500 transition-colors duration-300 block py-1 text-sm">
                                    Termos de Serviço
                                </Link>
                            </li>
                            <li>
                                <Link href={route('resources', { resource: 'faq' })} className="text-gray-600 hover:text-blue-500 transition-colors duration-300 block py-1 text-sm">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href={route('resources', { resource: 'help' })} className="text-gray-600 hover:text-blue-500 transition-colors duration-300 block py-1 text-sm">
                                    Centro de Ajuda
                                </Link>
                            </li>
                            <li>
                                <Link href={route('resources', { resource: 'learningCenter' })} className="text-gray-600 hover:text-blue-500 transition-colors duration-300 block py-1 text-sm">
                                    Aprenda sobre SIGESC
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-2 text-gray-900">Fique por dentro das novidades</h4>
                            <p className="text-gray-600 text-sm">Receba atualizações e dicas exclusivas para seu negócio</p>
                        </div>
                        <div className="flex flex-1 gap-3">
                            <input
                                type="email"
                                placeholder="Seu e-mail"
                                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button className="px-5 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-300 whitespace-nowrap">
                                Assinar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-center md:text-left text-gray-500 text-xs mb-3 md:mb-0">
                            &copy; {new Date().getFullYear()} SIGESC. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center space-x-4 text-gray-500 text-xs">
                            <span>NIF: 5000659738</span>
                            <span>•</span>
                            <span>Feito com ❤️ para o seu negócio</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
