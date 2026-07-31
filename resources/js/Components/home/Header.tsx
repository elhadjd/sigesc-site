import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineClose, AiOutlineDown, AiOutlineMenu } from 'react-icons/ai';
import {
    BsBuilding,
    BsCalculator,
    BsChatDots,
    BsFileEarmarkText,
    BsPerson,
    BsQuestionCircle,
    BsShop,
    BsTag,
} from 'react-icons/bs';
import { FaRegNewspaper, FaRobot, FaTools } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { RiCustomerService2Line } from 'react-icons/ri';
import { Link, usePage } from '@inertiajs/react';
import { useLoggedUser } from '@/contexts/loggedUser';
import { features } from '@/services/public/veriables';
import {
    SIGESC_ADMIN_LOGIN_URL,
    SIGESC_AGT_CERT_LABEL,
    SIGESC_AGT_CERT_NUMBER,
    SIGESC_GETTING_STARTED_URL,
} from '@/services/public/domains';

type NavItem = {
    href: string;
    icon: React.ReactNode;
    text: string;
    dropdown?: Array<{ name: string; href: string; desc?: string }>;
};

const ICON = 'h-3.5 w-3.5 shrink-0';
const NAV_LINK =
    'inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium leading-none text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#00a5cf]';
const MOBILE_LINK =
    'flex min-h-11 items-center gap-3 rounded-lg px-3 text-[15px] font-medium leading-none text-slate-700 transition-colors hover:bg-sky-50 hover:text-[#00a5cf]';
const DROPDOWN_LINK =
    'block px-3.5 py-2.5 text-[13px] font-medium leading-snug text-slate-700 transition-colors hover:bg-sky-50 hover:text-[#00a5cf]';

export const HeaderComponent = ({ auth }: { auth?: { user?: any } }) => {
    const { user, setUser } = useLoggedUser();
    const { canAccessAiContent } = usePage().props as { canAccessAiContent?: boolean };
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);

    useEffect(() => {
        setUser({ ...auth?.user });

        const handleScroll = () => setIsScrolled(window.scrollY > 12);
        const handleResize = () => {
            if (window.innerWidth >= 1280) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [auth, setUser]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const solutionItems = features.map((item) => ({
        name: item.name,
        href: item.href,
        desc: item.desc,
    }));

    const toolItems = [
        { name: 'Calculadoras fiscais', href: '/calculadoras', desc: 'IVA, IRT e impostos' },
        { name: 'Criar fatura', href: '/gerador-de-fatura', desc: 'Gerador online grátis' },
        { name: 'QR / Código de barras', href: '/gerador-de-codigo-barras', desc: 'Com logotipo' },
        { name: 'Modelos de fatura', href: '/modelos-de-fatura', desc: 'Templates para descarregar' },
        { name: 'Pergunte ao Especialista', href: '/pergunte-ao-especialista', desc: 'Dúvidas fiscais' },
    ];

    const primaryItems: NavItem[] = [
        {
            href: '/solutions',
            icon: <FaTools className={ICON} />,
            text: 'Soluções',
            dropdown: solutionItems,
        },
        { href: '/prices', icon: <BsTag className={ICON} />, text: 'Preços' },
        { href: '/parceria', icon: <BsBuilding className={ICON} />, text: 'Parceria' },
        { href: '/blog/posts', icon: <FaRegNewspaper className={ICON} />, text: 'Blog' },
        {
            href: '/calculadoras',
            icon: <BsCalculator className={ICON} />,
            text: 'Ferramentas',
            dropdown: toolItems,
        },
        { href: '/sobre', icon: <BsQuestionCircle className={ICON} />, text: 'Sobre' },
        { href: '/clients/depoiments', icon: <BsPerson className={ICON} />, text: 'Clientes' },
        { href: route('shop', { page: '' }), icon: <BsShop className={ICON} />, text: 'Loja' },
    ];

    if (canAccessAiContent) {
        primaryItems.push({
            href: '/admin/ai-content',
            icon: <FaRobot className={ICON} />,
            text: 'AI Content',
        });
    }

    const mobileItems: NavItem[] = [
        ...primaryItems.filter((item) => item.text !== 'Ferramentas'),
        {
            href: '/calculadoras',
            icon: <BsCalculator className={ICON} />,
            text: 'Calculadoras',
        },
        {
            href: '/gerador-de-fatura',
            icon: <BsFileEarmarkText className={ICON} />,
            text: 'Criar fatura',
        },
        {
            href: '/gerador-de-codigo-barras',
            icon: <BsFileEarmarkText className={ICON} />,
            text: 'QR / Código barras',
        },
        {
            href: '/modelos-de-fatura',
            icon: <BsFileEarmarkText className={ICON} />,
            text: 'Modelos de fatura',
        },
        {
            href: '/pergunte-ao-especialista',
            icon: <BsChatDots className={ICON} />,
            text: 'Especialista',
        },
    ];

    const supportItems = [
        { href: '/contact', icon: <RiCustomerService2Line className={ICON} />, text: 'Suporte' },
        { href: route('download-page'), icon: <FaDownload className={ICON} />, text: 'Downloads' },
        { href: route('resources', { resource: 'help' }), icon: <BsQuestionCircle className={ICON} />, text: 'Ajuda' },
    ];

    const closeMenu = () => setIsMenuOpen(false);

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
        const content = (
            <>
                <span className="inline-flex shrink-0 text-current">{item.icon}</span>
                <span className="truncate">{item.text}</span>
            </>
        );

        if (isExternal) {
            return (
                <a href={item.href} className={className} onClick={onClick}>
                    {content}
                </a>
            );
        }

        return (
            <Link href={item.href} className={className} onClick={onClick}>
                {content}
            </Link>
        );
    };

    return (
        <>
            <motion.header
                className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
                    isScrolled ? 'border-slate-200/80 bg-white/95 shadow-sm backdrop-blur' : 'border-slate-100 bg-white'
                }`}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            >
                <div className="h-9 bg-[#0b3d91] text-white">
                    <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                        <span className="inline-flex min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]">
                            <span className="truncate rounded bg-white/15 px-2 py-0.5">
                                {SIGESC_AGT_CERT_LABEL}
                            </span>
                            <span className="hidden truncate text-[11px] font-medium normal-case tracking-normal text-sky-100 sm:inline">
                                Faturação eletrónica · Angola
                            </span>
                        </span>
                        <span className="shrink-0 font-mono text-[12px] font-bold tracking-wider text-amber-200 sm:text-[13px]">
                            {SIGESC_AGT_CERT_NUMBER}
                        </span>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
                        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-2" onClick={closeMenu}>
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#00a5cf] text-[15px] font-bold text-white transition-colors group-hover:bg-[#0090b5]">
                                S
                            </span>
                            <span className="text-[17px] font-bold leading-none tracking-tight text-slate-900 sm:text-[18px]">
                                IGESC
                            </span>
                            <span
                                className="ml-0.5 hidden rounded border border-amber-300/80 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none text-amber-900 xl:inline"
                                title={`${SIGESC_AGT_CERT_LABEL} — ${SIGESC_AGT_CERT_NUMBER}`}
                            >
                                {SIGESC_AGT_CERT_NUMBER}
                            </span>
                        </Link>

                        <nav
                            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex"
                            aria-label="Principal"
                            onMouseLeave={() => setOpenDesktopMenu(null)}
                        >
                            {primaryItems.map((item) => (
                                <div
                                    key={item.text}
                                    className="relative"
                                    onMouseEnter={() => setOpenDesktopMenu(item.dropdown ? item.text : null)}
                                >
                                    {item.dropdown ? (
                                        <a href={item.href} className={NAV_LINK}>
                                            <span className="inline-flex shrink-0">{item.icon}</span>
                                            <span>{item.text}</span>
                                            <AiOutlineDown
                                                className={`h-3 w-3 shrink-0 transition-transform ${
                                                    openDesktopMenu === item.text ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </a>
                                    ) : (
                                        <NavLink item={item} className={NAV_LINK} />
                                    )}

                                    {item.dropdown && openDesktopMenu === item.text && (
                                        <div className="absolute left-0 top-full z-50 pt-1">
                                            <div className="w-64 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                                {item.dropdown.map((dropdownItem) => (
                                                    <a
                                                        key={dropdownItem.href + dropdownItem.name}
                                                        href={dropdownItem.href}
                                                        title={dropdownItem.desc}
                                                        className={DROPDOWN_LINK}
                                                    >
                                                        {dropdownItem.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                            <div className="hidden items-center gap-0.5 md:flex">
                                {supportItems.map((item) => (
                                    <Link
                                        key={item.text}
                                        href={item.href}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#00a5cf]"
                                        title={item.text}
                                        aria-label={item.text}
                                    >
                                        {item.icon}
                                    </Link>
                                ))}
                            </div>

                            {user?.id ? (
                                <Link href="/profile" className="inline-flex h-9 w-9 items-center justify-center">
                                    <img
                                        src={user.user_profile?.image || '/img/avatar-placeholder.svg'}
                                        alt="Perfil"
                                        className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                                    />
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <a
                                        href={SIGESC_ADMIN_LOGIN_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-9 items-center rounded-lg bg-[#00a5cf] px-3 text-[13px] font-semibold leading-none text-white transition-colors hover:bg-[#0090b5] sm:px-3.5"
                                    >
                                        Entrar
                                    </a>
                                    <a
                                        href={SIGESC_GETTING_STARTED_URL}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hidden h-9 items-center rounded-lg border border-slate-300 px-3 text-[13px] font-semibold leading-none text-slate-700 transition-colors hover:border-[#00a5cf] hover:text-[#00a5cf] sm:inline-flex"
                                    >
                                        Demo
                                    </a>
                                </div>
                            )}

                            <button
                                onClick={() => setIsMenuOpen((open) => !open)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#00a5cf] xl:hidden"
                                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                                aria-expanded={isMenuOpen}
                                type="button"
                            >
                                {isMenuOpen ? (
                                    <AiOutlineClose className="h-5 w-5" />
                                ) : (
                                    <AiOutlineMenu className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Reserva espaço do header fixo (barra AGT + barra principal) */}
            <div className="h-[5.75rem] sm:h-[6.25rem]" aria-hidden="true" />

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Fechar menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.45 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-slate-900 xl:hidden"
                            onClick={closeMenu}
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[20rem] flex-col bg-white shadow-2xl xl:hidden"
                        >
                            <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4">
                                <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#00a5cf] text-[15px] font-bold text-white">
                                        S
                                    </span>
                                    <span className="text-[17px] font-bold leading-none text-slate-900">IGESC</span>
                                </Link>
                                <button
                                    onClick={closeMenu}
                                    type="button"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                                    aria-label="Fechar"
                                >
                                    <AiOutlineClose className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="border-b border-slate-100 bg-[#0b3d91] px-4 py-3 text-center text-white">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-100">
                                    {SIGESC_AGT_CERT_LABEL}
                                </p>
                                <p className="mt-1 font-mono text-[13px] font-bold tracking-wider text-amber-200">
                                    {SIGESC_AGT_CERT_NUMBER}
                                </p>
                            </div>

                            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-3" aria-label="Mobile">
                                <div className="space-y-0.5">
                                    {mobileItems.map((item) => (
                                        <div key={item.text}>
                                            <NavLink item={item} className={MOBILE_LINK} onClick={closeMenu} />
                                            {item.dropdown && (
                                                <div className="mb-1 ml-8 space-y-0.5 border-l border-slate-200 pl-3">
                                                    {item.dropdown.map((dropdownItem) => (
                                                        <Link
                                                            key={dropdownItem.href + dropdownItem.name}
                                                            href={dropdownItem.href}
                                                            className="flex min-h-10 items-center text-[14px] font-medium leading-none text-slate-600 transition-colors hover:text-[#00a5cf]"
                                                            onClick={closeMenu}
                                                        >
                                                            {dropdownItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 border-t border-slate-200 pt-3">
                                    <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                        Recursos
                                    </p>
                                    {supportItems.map((item) => (
                                        <Link
                                            key={item.text}
                                            href={item.href}
                                            className={MOBILE_LINK}
                                            onClick={closeMenu}
                                        >
                                            <span className="inline-flex shrink-0 text-[#00a5cf]">{item.icon}</span>
                                            <span>{item.text}</span>
                                        </Link>
                                    ))}
                                </div>

                                {!user?.id && (
                                    <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                                        <a
                                            href={SIGESC_ADMIN_LOGIN_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-11 items-center justify-center rounded-lg bg-[#00a5cf] text-[15px] font-semibold text-white hover:bg-[#0090b5]"
                                            onClick={closeMenu}
                                        >
                                            Entrar
                                        </a>
                                        <a
                                            href={SIGESC_GETTING_STARTED_URL}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex h-11 items-center justify-center rounded-lg border border-slate-300 text-[15px] font-semibold text-slate-700 hover:border-[#00a5cf] hover:text-[#00a5cf]"
                                            onClick={closeMenu}
                                        >
                                            Solicitar Demo
                                        </a>
                                    </div>
                                )}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
