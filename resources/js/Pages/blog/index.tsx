import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router, usePage } from '@inertiajs/react';
import { User } from '@/types';
import { HeaderComponent } from '@/Components/home/Header';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import FooterComponent from '@/Components/home/Footer';
import SeoHead, { SeoPayload } from '@/Components/seo/SeoHead';
import {
    FiSearch,
    FiFilter,
    FiClock,
    FiUser,
    FiArrowRight,
    FiCalendar,
    FiBookmark,
    FiShare2,
    FiTag,
    FiChevronDown,
    FiHeart,
    FiEye,
    FiMessageSquare,
    FiTrendingUp,
    FiBookOpen,
    FiMail,
    FiArrowLeft,
    FiArrowRight as FiNextArrow,
    FiLoader
} from 'react-icons/fi';
import axios from 'axios';

// Types para os posts
interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author_name: string;
    author_avatar: string;
    author_role: string;
    publish_date: string;
    read_time: number;
    tags: string[];
    is_featured: boolean;
    is_published: boolean;
    views: number;
    likes: number;
    comments_count?: number;
    created_at: string;
    updated_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface BlogPageProps {
    auth: { user: User };
    local: string;
    posts: Post[];
    categories: string[];
    featuredPosts: Post[];
    recentPosts: Post[];
    trendingPosts: Post[];
    pagination: Pagination;
    filters: {
        category: string;
        search: string;
        sort: string;
    };
    seo?: SeoPayload;
}

// Componente Skeleton para loading
const BlogPostSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 animate-pulse">
        <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200"></div>
        <div className="p-6">
            <div className="h-4 bg-gray-200 rounded-full mb-4 w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="flex items-center mt-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="ml-3 flex-1">
                    <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    </div>
);

// Componente de Card de Blog
const BlogPostCard = ({ post, index }: { post: Post; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: `${window.location.origin}/blog/${post.slug}`,
                });
            } catch (error) {
                console.log('Erro ao compartilhar:', error);
            }
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
            alert('Link copiado para a área de transferência!');
        }
    };

    const handleLike = async () => {
        try {
            const response = await axios.post(route('blog.posts.like', { post: post.id }));

            if (response.status === 200) {
                const data = response.data;
                setLikesCount(data.likes_count);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Erro ao curtir post:', error);
        }
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="relative overflow-hidden">
                    <motion.img
                        src={post.image || '/img/placeholder-blog.jpg'}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        onError={(e) => {
                            e.currentTarget.src = '/img/placeholder-blog.jpg';
                        }}
                    />
                    <div className="absolute top-4 left-4">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {post.category}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        <span className="mr-4">{formatDate(post.publish_date)}</span>
                        <FiClock className="w-4 h-4 mr-1" />
                        <span>{post.read_time} min de leitura</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700">
                                Por {post.author_name}
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <FiEye className="w-4 h-4" />
                                <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <FiHeart className="w-4 h-4" />
                                <span>{likesCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-4 flex justify-between items-center">
                    <button
                        onClick={handleLike}
                        className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                            } hover:bg-gray-200`}
                    >
                        <FiHeart className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <FiShare2 className="w-4 h-4" />
                    </button>

                    <motion.div
                        animate={{ x: isHovered ? 5 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link
                            href={route('blog.posts.show', { slug: post.slug })}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm"
                        >
                            Ler mais
                            <FiArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.article>
    );
};

// Componente de Hero Section
const BlogHero = ({ featuredPost }: { featuredPost?: Post }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (!featuredPost) {
        return (
            <section className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Blog <span className="text-blue-400">SIGESC</span>
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Descubra insights valiosos, dicas exclusivas e as melhores práticas
                            para transformar a gestão do seu negócio
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        Blog <span className="text-blue-400">SIGESC</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Descubra insights valiosos, dicas exclusivas e as melhores práticas
                        para transformar a gestão do seu negócio
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20"
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                                {featuredPost.category}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                {featuredPost.title}
                            </h2>
                            <p className="text-blue-100 mb-6">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center text-blue-200 mb-6">
                                <FiClock className="w-4 h-4 mr-2" />
                                <span className="text-sm">{featuredPost.read_time} min de leitura</span>
                                <span className="mx-3">•</span>
                                <FiCalendar className="w-4 h-4 mr-2" />
                                <span className="text-sm">{formatDate(featuredPost.publish_date)}</span>
                                <span className="mx-3">•</span>
                                <FiEye className="w-4 h-4 mr-2" />
                                <span className="text-sm">{featuredPost.views} visualizações</span>
                            </div>
                            <Link
                                href={route('blog.posts.show', { slug: featuredPost.slug })}
                                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Ler Artigo Completo
                                <FiArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                        <div className="relative">
                            <motion.img
                                src={featuredPost.image || '/img/placeholder-blog.jpg'}
                                alt={featuredPost.title}
                                className="rounded-xl shadow-2xl w-full h-64 object-cover"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                onError={(e) => {
                                    e.currentTarget.src = '/img/placeholder-blog.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-xl"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// Componente de Filtros
const BlogFilters = ({
    categories,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    onFiltersChange
}) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    useEffect(() => {
        // Debounce para evitar muitas requisições
        onFiltersChange({ category: activeCategory, search: searchTerm, sort: sortBy });

    }, [activeCategory, sortBy]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFiltersChange({ category: activeCategory, search: searchTerm, sort: sortBy });
    };

    return (
        <section className="py-8 bg-white sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative w-full lg:w-96">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar artigos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </form>

                    <div className="flex items-center gap-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="newest">Mais recentes</option>
                            <option value="oldest">Mais antigos</option>
                            <option value="popular">Mais populares</option>
                            <option value="views">Mais visualizados</option>
                        </select>

                        <div className="hidden lg:flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === 'all'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Todos
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
                        >
                            <FiFilter className="w-4 h-4" />
                            Filtros
                            <FiChevronDown className={`w-4 h-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isFiltersOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden mt-4"
                        >
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${activeCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    Todos
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${activeCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

// Componente de Sidebar
const BlogSidebar = ({ recentPosts, trendingPosts, categories, onCategorySelect }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short'
        });
    };



    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FiTag className="w-5 h-5 text-blue-500 mr-2" />
                    Categorias
                </h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategorySelect(category)}
                            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-700">{category}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FiClock className="w-5 h-5 text-blue-500 mr-2" />
                    Recentes
                </h3>
                <div className="space-y-4">
                    {recentPosts.slice(0, 5).map((post) => (
                        <Link
                            key={post.id}
                            href={route('blog.posts.show', { slug: post.slug })}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <img
                                src={post.image || '/img/placeholder-blog.jpg'}
                                alt={post.title}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/img/placeholder-blog.jpg';
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {post.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDate(post.publish_date)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FiTrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                    Em Alta
                </h3>
                <div className="space-y-4">
                    {trendingPosts.slice(0, 5).map((post) => (
                        <Link
                            key={post.id}
                            href={route('blog.posts.show', { slug: post.slug })}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="relative">
                                <img
                                    src={post.image || '/img/placeholder-blog.jpg'}
                                    alt={post.title}
                                    className="w-12 h-12 rounded-lg object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/img/placeholder-blog.jpg';
                                    }}
                                />
                                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded">
                                    {post.views}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {post.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {post.category}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Componente de Paginação
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
    const pages = useMemo(() => {
        const pagesArray = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pagesArray.push(i);
        }

        return pagesArray;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
                <FiArrowLeft className="w-5 h-5" />
            </button>

            {pages[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={isLoading}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        1
                    </button>
                    {pages[0] > 2 && <span className="px-2">...</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    disabled={isLoading}
                    className={`px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 ${currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {page}
                </button>
            ))}

            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && <span className="px-2">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={isLoading}
                        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
                <FiNextArrow className="w-5 h-5" />
            </button>

            {isLoading && (
                <div className="ml-4">
                    <FiLoader className="w-5 h-5 animate-spin text-blue-500" />
                </div>
            )}
        </div>
    );
};

// Componente Principal
export default function BlogPage({ auth, local, posts: initialPosts, categories, featuredPosts, recentPosts, trendingPosts, pagination: initialPagination, filters: initialFilters, seo }: BlogPageProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [isLoading, setIsLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState(initialFilters?.category || 'all');
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || '');
    const [sortBy, setSortBy] = useState(initialFilters?.sort || 'newest');
    const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);
    const [pagination, setPagination] = useState(initialPagination);

    const loadPosts = async (page = 1, filters: { category?: string; search?: string; sort?: string } = {}) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                category: filters.category || activeCategory,
                search: filters.search || searchTerm,
                sort: filters.sort || sortBy
            });

            // Separate URL from the Inertia page (/blog/posts) to avoid SW/browser cache collisions.
            const response = await fetch(`${route('blog.posts.data')}?${params.toString()}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
                cache: 'no-store',
            });
            const data = await response.json();

            setPosts(data.posts);
            setPagination(data.pagination);
            setCurrentPage(data.pagination.current_page);
        } catch (error) {
            console.error('Erro ao carregar posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFiltersChange = (filters: { category: string; search: string; sort: string }) => {
        loadPosts(1, filters);
    };

    const handlePageChange = (page: number) => {
        loadPosts(page);
    };

    const handleCategorySelect = (category: string) => {
        setActiveCategory(category);
        handleFiltersChange({ category, search: searchTerm, sort: sortBy });
    };

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <SeoHead
                    seo={seo}
                    fallbackTitle="Blog SIGESC | Artigos sobre Gestão Empresarial e Tecnologia"
                    fallbackDescription="Blog oficial SIGESC com artigos exclusivos sobre gestão empresarial, produtividade, finanças e tecnologia. Aprenda com especialistas e transforme seu negócio."
                />

                <HeaderComponent auth={auth} />

                <BlogHero featuredPost={featuredPosts[0]} />

                <BlogFilters
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onFiltersChange={handleFiltersChange}
                />

                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1">
                                <BlogSidebar
                                    recentPosts={recentPosts}
                                    trendingPosts={trendingPosts}
                                    categories={categories}
                                    onCategorySelect={handleCategorySelect}
                                />
                            </div>

                            <div className="lg:col-span-3">
                                <div className="flex items-center justify-between mb-8">
                                    <p className="text-gray-600">
                                        Mostrando {posts.length} de {pagination?.total} artigos
                                        {activeCategory !== 'all' && ` em "${activeCategory}"`}
                                        {searchTerm && ` para "${searchTerm}"`}
                                    </p>
                                </div>

                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                            {[...Array(6)].map((_, i) => (
                                                <BlogPostSkeleton key={i} />
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                                {posts.map((post, index) => (
                                                    <BlogPostCard key={post.id} post={post} index={index} />
                                                ))}
                                            </div>

                                            {posts.length === 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-center py-20"
                                                >
                                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <FiSearch className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                        Nenhum artigo encontrado
                                                    </h3>
                                                    <p className="text-gray-600 mb-8">
                                                        {searchTerm
                                                            ? `Não encontramos resultados para "${searchTerm}"`
                                                            : `Não há artigos ${activeCategory !== 'all' ? `na categoria "${activeCategory}"` : 'disponíveis'}`}
                                                    </p>
                                                    <button
                                                        onClick={() => {
                                                            setActiveCategory('all');
                                                            setSearchTerm('');
                                                            setSortBy('newest');
                                                            handleFiltersChange({ category: 'all', search: '', sort: 'newest' });
                                                        }}
                                                        className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                                                    >
                                                        Ver Todos os Artigos
                                                    </button>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </AnimatePresence>

                                {pagination && pagination.last_page > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={pagination.last_page}
                                        onPageChange={handlePageChange}
                                        isLoading={isLoading}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
}
