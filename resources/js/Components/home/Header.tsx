import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMenu, AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import { BsPerson, BsShop, BsTag, BsQuestionCircle, BsBoxSeam } from 'react-icons/bs';
import { Link } from '@inertiajs/react';
import { useLoggedUser } from '@/contexts/loggedUser';
import { FaRegNewspaper, FaTools } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { RiCustomerService2Line } from 'react-icons/ri';
import { features } from '@/services/public/veriables';

export const HeaderComponent = ({ auth }) => {
    const { user, setUser } = useLoggedUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        setUser({ ...auth?.user });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [auth, setUser]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuItems = [
        {
            href: "/solutions",
            icon: <FaTools className="text-base" />,
            text: "Soluções",
            dropdown: features
        },
        { href: route('shop', { page: '' }), icon: <BsShop className="text-base" />, text: "Loja" },
        { href: `/prices`, icon: <BsTag className="text-base" />, text: "Preços" },
        { href: `/clients/depoiments`, icon: <BsPerson className="text-base" />, text: "Clientes" },
        { href: route('blog.posts', { post: '' }), icon: <FaRegNewspaper className="text-base" />, text: "Blog" },
    ];

    const supportItems = [
        { href: "/contact", icon: <RiCustomerService2Line className="text-base" />, text: "Suporte" },
        { href: route('download-page', { post: '' }), icon: <FaDownload className="text-base" />, text: "Downloads" },
        { href: route('resources', { resource: 'help' }), icon: <BsQuestionCircle className="text-base" />, text: "Ajuda" },
    ];


    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <motion.header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white shadow-md'
                : 'bg-white border-b border-gray-100'
                }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href={`/`}
                        className="flex items-center space-x-2 group"
                    >
                        <div className="bg-blue-500 p-2 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">IGESC</span>
                        <span className="text-xs text-gray-500 hidden lg:block ml-2">Sistema de Gestão</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {menuItems.map((item, index) => (
                            <div key={index} className="relative group">
                                <a
                                    href={item.href}
                                    className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-500 transition-colors duration-300 font-medium text-sm"
                                    onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.text}</span>
                                    {item.dropdown && (
                                        <AiOutlineDown className="text-xs ml-1 transition-transform duration-300 group-hover:rotate-180" />
                                    )}
                                </a>

                                {/* Dropdown Menu */}
                                {item.dropdown && (
                                    <div
                                        className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2"
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

                    {/* Right Section */}
                    <div className="flex items-center space-x-3">
                        {/* Support Links */}
                        <div className="hidden md:flex items-center space-x-1">
                            {supportItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors duration-300"
                                    title={item.text}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>

                        {/* User Auth */}
                        {user?.id ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/profile"
                                    className="flex items-center space-x-2 group"
                                >
                                    <div className="relative">
                                        <img
                                            src={user.user_profile.image}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm group-hover:border-blue-300 transition-colors duration-300"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <a
                                    target='_blank'
                                    href="https://admin.sisgesc.net/getting-started"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium text-sm shadow-sm hover:shadow-md"
                                >
                                    Entrar
                                </a>
                                <a
                                    href="https://admin.sisgesc.net/getting-started" target='_blank'
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors duration-300 font-medium text-sm hidden sm:block"
                                >
                                    Solicitar Demo
                                </a>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-gray-100 transition-colors duration-300"
                            aria-label="Menu"
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

            {/* Mobile Menu */}
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
                                    <Link href={``} className="flex items-center space-x-2">
                                        <div className="bg-blue-500 p-2 rounded-lg">
                                            <span className="text-white font-bold text-xl">S</span>
                                        </div>
                                        <span className="text-xl font-bold text-gray-900">IGESC</span>
                                    </Link>
                                    <button
                                        onClick={toggleMenu}
                                        className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-100"
                                    >
                                        <AiOutlineClose className="text-xl" />
                                    </button>
                                </div>

                                <nav className="space-y-1">
                                    {menuItems.map((item, index) => (
                                        <div key={index}>
                                            <a
                                                href={item.href}
                                                className="flex items-center justify-between p-3 text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                onClick={toggleMenu}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-blue-500">{item.icon}</span>
                                                    <span className="font-medium">{item.text}</span>
                                                </div>
                                            </a>
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
                                        {supportItems.map((item, index) => (
                                            <Link
                                                key={index}
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
                                                target='_blank'
                                                href="https://admin.sisgesc.net/getting-started"
                                                className="block w-full text-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-medium"
                                                onClick={toggleMenu}
                                            >
                                                Entrar
                                            </a>
                                            <Link
                                                href="/demo"
                                                className="block w-full text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors duration-300 font-medium"
                                                onClick={toggleMenu}
                                            >
                                                Solicitar Demo
                                            </Link>
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
