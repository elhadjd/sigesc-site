import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMenu, AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import { BsPerson, BsShop, BsTag, BsQuestionCircle, BsCalculator, BsChatDots, BsFileEarmarkText } from 'react-icons/bs';
import { Link, usePage } from '@inertiajs/react';
import { useLoggedUser } from '@/contexts/loggedUser';
import { FaRegNewspaper, FaTools, FaRobot } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { RiCustomerService2Line } from 'react-icons/ri';
import { features } from '@/services/public/veriables';
import { SIGESC_ADMIN_LOGIN_URL, SIGESC_GETTING_STARTED_URL } from '@/services/public/domains';

type NavItem = {
    href: string;
    icon: React.ReactNode;
    text: string;
    dropdown?: typeof features;
};

export const HeaderComponent = ({ auth }: { auth?: { user?: any } }) => {
    const { user, setUser } = useLoggedUser();
    const { canAccessAiContent } = usePage().props as { canAccessAiContent?: boolean };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    useEffect(() => {
        setUser({ ...auth?.user });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [auth, setUser]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuItems: NavItem[] = [
        {
            href: '/solutions',
            icon: <FaTools className="text-base" />,
            text: 'Soluções',
            dropdown: features,
        },
        { href: route('shop', { page: '' }), icon: <BsShop className="text-base" />, text: 'Loja' },
        { href: '/prices', icon: <BsTag className="text-base" />, text: 'Preços' },
        { href: '/clients/depoiments', icon: <BsPerson className="text-base" />, text: 'Clientes' },
        { href: '/blog/posts', icon: <FaRegNewspaper className="text-base" />, text: 'Blog' },
        { href: '/calculadoras', icon: <BsCalculator className="text-base" />, text: 'Calculadoras' },
        {
            href: '/gerador-de-fatura',
            icon: <BsFileEarmarkText className="text-base" />,
            text: 'Criar fatura',
        },
        {
            href: '/gerador-de-codigo-barras',
            icon: <BsFileEarmarkText className="text-base" />,
            text: 'QR / Código barras',
        },
        {
            href: '/modelos-de-fatura',
            icon: <BsFileEarmarkText className="text-base" />,
            text: 'Modelos de fatura',
        },
        {
            href: '/pergunte-ao-especialista',
            icon: <BsChatDots className="text-base" />,
            text: 'Especialista',
        },
    ];

    if (canAccessAiContent) {
        menuItems.push({
            href: '/admin/ai-content',
            icon: <FaRobot className="text-base" />,
            text: 'AI Content',
        });
    }

    const supportItems = [
        { href: '/contact', icon: <RiCustomerService2Line className="text-base" />, text: 'Suporte' },
        { href: route('download-page'), icon: <FaDownload className="text-base" />, text: 'Downloads' },
        { href: route('resources', { resource: 'help' }), icon: <BsQuestionCircle className="text-base" />, text: 'Ajuda' },
    ];

    const NavLink = ({
        item,
        className,
        onClick,
    }: {
        item: NavItem;
        className: string;
        onClick?: () => void;
    }) => {
        const isExternal = item.href.startsWith('http');
        if (isExternal) {
            return (
                <a href={item.href} className={className} onClick={onClick}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                </a>
            );
        }

        return (
            <Link href={item.href} className={className} onClick={onClick}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
            </Link>
        );
    };

    return (
        <motion.header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-white shadow-md' : 'bg-white border-b border-gray-100'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2 group shrink-0">
                        <div className="bg-blue-500 p-2 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">IGESC</span>
                        <span className="text-xs text-gray-500 hidden xl:block ml-2">
                            Sistema de Gestão
                        </span>
                    </Link>

                    <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
                        {menuItems.map((item, index) => (
                            <div key={item.text} className="relative group">
                                {item.dropdown ? (
                                    <a
                                        href={item.href}
                                        className="flex items-center space-x-1 px-2.5 xl:px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors duration-300 font-medium text-sm whitespace-nowrap"
                                        onMouseEnter={() => setActiveDropdown(index)}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                        <AiOutlineDown className="text-xs ml-0.5 transition-transform duration-300 group-hover:rotate-180" />
                                    </a>
                                ) : (
                                    <NavLink
                                        item={item}
                                        className="flex items-center space-x-1 px-2.5 xl:px-3 py-2 text-gray-700 hover:text-blue-500 transition-colors duration-300 font-medium text-sm whitespace-nowrap"
                                    />
                                )}

                                {item.dropdown && (
                                    <div
                                        className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50"
                                        onMouseLeave={() => setActiveDropdown(null)}
                                    >
                                        {item.dropdown.map((dropdownItem, idx) => (
                                            <a
                                                key={idx}
                                                href={dropdownItem.href}
                                                title={dropdownItem.desc}
                                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                                            >
                                                {dropdownItem.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                        <div className="hidden md:flex items-center space-x-1">
                            {supportItems.map((item) => (
                                <Link
                                    key={item.text}
                                    href={item.href}
                                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors duration-300"
                                    title={item.text}
                                >
                                    {item.icon}
                                </Link>
                            ))}
                        </div>

                        {user?.id ? (
                            <Link href="/profile" className="flex items-center space-x-2 group">
                                <div className="relative">
                                    <img
                                        src={user.user_profile?.image || '/img/avatar-placeholder.png'}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm group-hover:border-blue-300 transition-colors duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                                </div>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <a
                                    href={SIGESC_ADMIN_LOGIN_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 xl:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium text-sm shadow-sm hover:shadow-md"
                                >
                                    Entrar
                                </a>
                                <a
                                    href={SIGESC_GETTING_STARTED_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 xl:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors duration-300 font-medium text-sm hidden sm:block"
                                >
                                    Solicitar Demo
                                </a>
                            </div>
                        )}

                        <button
                            onClick={toggleMenu}
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-gray-100 transition-colors duration-300"
                            aria-label="Menu"
                            type="button"
                        >
                            {isMenuOpen ? (
                                <AiOutlineClose className="text-xl" />
                            ) : (
                                <AiOutlineMenu className="text-xl" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black lg:hidden z-40"
                            onClick={toggleMenu}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed top-0 right-0 w-80 h-screen bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <Link href="/" className="flex items-center space-x-2" onClick={toggleMenu}>
                                        <div className="bg-blue-500 p-2 rounded-lg">
                                            <span className="text-white font-bold text-xl">S</span>
                                        </div>
                                        <span className="text-xl font-bold text-gray-900">IGESC</span>
                                    </Link>
                                    <button
                                        onClick={toggleMenu}
                                        type="button"
                                        className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100"
                                    >
                                        <AiOutlineClose className="text-xl" />
                                    </button>
                                </div>

                                <nav className="space-y-1">
                                    {menuItems.map((item) => (
                                        <div key={item.text}>
                                            <NavLink
                                                item={item}
                                                className="flex items-center space-x-3 p-3 text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                onClick={toggleMenu}
                                            />
                                            {item.dropdown && (
                                                <div className="pl-11 space-y-1">
                                                    {item.dropdown.map((dropdownItem, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={dropdownItem.href}
                                                            className="block py-2 px-4 text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                            onClick={toggleMenu}
                                                        >
                                                            {dropdownItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="pt-4 mt-4 border-t border-gray-200">
                                        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Recursos
                                        </p>
                                        {supportItems.map((item) => (
                                            <Link
                                                key={item.text}
                                                href={item.href}
                                                className="flex items-center space-x-3 p-3 text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                onClick={toggleMenu}
                                            >
                                                <span className="text-blue-500">{item.icon}</span>
                                                <span className="font-medium">{item.text}</span>
                                            </Link>
                                        ))}
                                    </div>

                                    {!user?.id && (
                                        <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                                            <a
                                                href={SIGESC_ADMIN_LOGIN_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium"
                                                onClick={toggleMenu}
                                            >
                                                Entrar
                                            </a>
                                            <a
                                                href={SIGESC_GETTING_STARTED_URL}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block w-full text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors duration-300 font-medium"
                                                onClick={toggleMenu}
                                            >
                                                Solicitar Demo
                                            </a>
                                        </div>
                                    )}
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
