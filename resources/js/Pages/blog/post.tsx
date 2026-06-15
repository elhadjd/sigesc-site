import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePage, router } from '@inertiajs/react';
import { HeaderComponent } from '@/Components/home/Header';
import { FormStateProvider } from '@/contexts/stateForm';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import FooterComponent from '@/Components/home/Footer';
import { Helmet } from 'react-helmet';
import {
    FiClock,
    FiCalendar,
    FiEye,
    FiHeart,
    FiShare2,
    FiMessageSquare,
    FiBookmark,
    FiArrowLeft,
    FiUser,
    FiTag,
    FiFacebook,
    FiTwitter,
    FiLinkedin,
    FiLink,
    FiLoader,
    FiSend,
    FiEdit,
    FiTrash2,
    FiChevronDown,
    FiChevronUp,
    FiCornerUpLeft,
    FiX
} from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    isAdmin?: boolean;
}

interface Comment {
    id: number;
    content: string;
    author_name: string;
    author_email: string;
    author_avatar: string;
    user_id?: number;
    status: string;
    likes_count: number;
    replies_count: number;
    created_at: string;
    updated_at: string;
    user?: User;
    replies?: Comment[];
    isLiked?: boolean;
}

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
    views: number;
    likes: number;
    comments_count?: number;
}

interface RelatedPost {
    id: number;
    title: string;
    slug: string;
    image: string;
    category: string;
    publish_date: string;
    read_time: number;
}

interface BlogShowProps {
    auth: { user: User | null };
    local: string;
    post: Post;
    relatedPosts: RelatedPost[];
    popularPosts: RelatedPost[];
}

// Componente de Comentário Individual
const CommentItem = ({ comment, onReply, onLike, onEdit, onDelete, level = 0 }: {
    comment: Comment;
    onReply: (comment: Comment) => void;
    onLike: (commentId: number) => Promise<void>;
    onEdit: (comment: Comment) => void;
    onDelete: (commentId: number) => Promise<void>;
    level?: number;
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { user } = usePage<{ auth: { user: User | null } }>().props.auth;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };



    const canModify = () => {
        return user && (user.id === comment.user_id || user.isAdmin);
    };

    const handleLike = async () => {
        await onLike(comment.id);
    };

    return (
        <div className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-3">
                    <img
                        src={comment.author_avatar || '/img/avatar-placeholder.png'}
                        alt={comment.author_name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <h4 className="font-semibold text-gray-900">{comment.author_name}</h4>
                                <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                            </div>
                            {comment.replies_count > 0 && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                    <span className="ml-1">{comment.replies_count} resposta{comment.replies_count !== 1 ? 's' : ''}</span>
                                </button>
                            )}
                        </div>

                        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{comment.content}</p>

                        <div className="flex items-center space-x-4 mt-3">
                            <button
                                onClick={handleLike}
                                disabled={isLoading}
                                className={`flex items-center space-x-1 text-sm ${comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'} disabled:opacity-50`}
                            >
                                <FiHeart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                                <span>{comment.likes_count}</span>
                            </button>

                            {canModify() && (
                                <>
                                    <button
                                        onClick={() => onEdit(comment)}
                                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
                                    >
                                        <FiEdit className="w-4 h-4" />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(comment.id)}
                                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                        <span>Excluir</span>
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {isExpanded && comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onLike={onLike}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Componente Principal de Comentários
const CommentsSection = ({ post }: { post: Post }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
    const [commentContent, setCommentContent] = useState('');
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);

    const { user } = usePage<{ auth: { user: User | null } }>().props.auth;

    useEffect(() => {
        loadComments();

        // Listener para atualizações de comentários
        const handleCommentsUpdated = () => loadComments();
        window.addEventListener('commentsUpdated', handleCommentsUpdated);

        return () => window.removeEventListener('commentsUpdated', handleCommentsUpdated);
    }, [sortBy]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(route('blog.posts.comments', { post: post.id, sort: sortBy }));
            if (response.ok) {
                const data = await response.json();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(route('blog.posts.comment', { post: post.id }), {
                content: commentContent,
                parent_id: replyingTo?.id,
                author_name: !user ? prompt('Seu nome:') : undefined,
                author_email: !user ? prompt('Seu email:') : undefined
            });

            if (response.status === 200) {
                setCommentContent('');
                setReplyingTo(null);
                setEditingComment(null);
                // Disparar evento para recarregar comentários
                window.dispatchEvent(new CustomEvent('commentsUpdated'));
            }
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            if (error.response.data?.errors) {
                toast.error(Object.values(error.response.data.errors).flat().join('\n'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (commentId: number) => {
        try {
            const response = await axios.post(route('blog.posts.comment.like', { post: post.id, comment: commentId }));

            if (response.status === 200) {
                loadComments();
            }
        } catch (error) {
            console.error('Erro ao curtir comentário:', error);
        }
    };

    const handleReply = (comment: Comment) => {
        setReplyingTo(comment);
        setEditingComment(null);
    };

    const handleEdit = (comment: Comment) => {
        setEditingComment(comment);
        setReplyingTo(null);
        setCommentContent(comment.content);
    };

    const handleDelete = async (commentId: number) => {
        if (!confirm('Tem certeza que deseja excluir este comentário?')) return;

        try {
            const response = await fetch(`/engagement/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                // Recarregar comentários
                window.dispatchEvent(new CustomEvent('commentsUpdated'));
            }
        } catch (error) {
            console.error('Erro ao excluir comentário:', error);
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <ToastContainer />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                    Comentários ({post.comments_count || 0})
                </h3>

                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                    <span className="text-sm text-gray-600">Ordenar por:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    >
                        <option value="newest">Mais recentes</option>
                        <option value="popular">Mais populares</option>
                    </select>
                </div>
            </div>

            {/* Formulário de Comentário */}
            <form onSubmit={handleSubmitComment} className="mb-8">
                <div className="flex space-x-3">
                    <div className="flex-1">
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder={
                                editingComment ? "Edite seu comentário..." :
                                    replyingTo ? `Respondendo a ${replyingTo.author_name}...` :
                                        "Deixe seu comentário..."
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={4}
                            disabled={isLoading}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div>
                                {editingComment && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingComment(null);
                                            setCommentContent('');
                                        }}
                                        className="text-sm text-gray-600 hover:text-gray-800 mr-4"
                                        disabled={isLoading}
                                    >
                                        Cancelar edição
                                    </button>
                                )}
                                {replyingTo && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReplyingTo(null);
                                            setCommentContent('');
                                        }}
                                        className="text-sm text-gray-600 hover:text-gray-800"
                                        disabled={isLoading}
                                    >
                                        Cancelar resposta
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!commentContent.trim() || isLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {isLoading ? (
                                    <FiLoader className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FiSend className="w-4 h-4" />
                                )}
                                <span>{editingComment ? 'Atualizar' : 'Comentar'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Lista de Comentários */}
            {isLoading && comments.length === 0 ? (
                <div className="text-center py-12">
                    <FiLoader className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Carregando comentários...</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                    <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Seja o primeiro a comentar!</p>
                    {!user && (
                        <Link
                            href="/login"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Fazer login para comentar
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReply={handleReply}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Componente Principal da Página
const BlogShowPage = ({ auth, local, post, relatedPosts, popularPosts }: BlogShowProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleLike = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/engagement/posts/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
            });

            if (response.ok) {
                const data = await response.json();
                setLikesCount(data.likes_count);
                setIsLiked(data.liked);
            }
        } catch (error) {
            console.error('Erro ao curtir post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = (platform?: string) => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);
        const text = encodeURIComponent(post.excerpt);

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };

        if (platform && shareUrls[platform as keyof typeof shareUrls]) {
            window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copiado para a área de transferência!');
        }
        setShowShareMenu(false);
    };

    const parseContent = (content: string) => {
        return { __html: content };
    };

    const estimatedReadTime = Math.max(5, Math.ceil(post.content.split(' ').length / 200));

    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <Helmet>
                    <title>{post.title} | Blog SIGESC</title>
                    <meta name="description" content={post.excerpt} />
                    <meta name="keywords" content={post.tags.join(', ')} />
                    <meta property="og:title" content={post.title} />
                    <meta property="og:description" content={post.excerpt} />
                    <meta property="og:image" content={post.image} />
                    <meta property="og:type" content="article" />
                    <meta property="article:published_time" content={post.publish_date} />
                    <meta property="article:author" content={post.author_name} />
                </Helmet>

                <HeaderComponent auth={auth} />

                <main className="mt-10 bg-white">
                    {/* Hero Section */}
                    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {/* Voltar */}
                        <div className="mb-8">
                            <a
                                href={route('blog.posts')}
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <FiArrowLeft className="w-5 h-5 mr-2" />
                                Voltar para o Blog
                            </a>
                        </div>

                        {/* Cabeçalho do Artigo */}
                        <header className="mb-12">
                            <div className="flex items-center space-x-4 mb-6">
                                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                                    {post.category}
                                </span>
                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <FiCalendar className="w-4 h-4 mr-2" />
                                        {formatDate(post.publish_date)}
                                    </span>
                                    <span className="flex items-center">
                                        <FiClock className="w-4 h-4 mr-2" />
                                        {estimatedReadTime} min de leitura
                                    </span>
                                    <span className="flex items-center">
                                        <FiEye className="w-4 h-4 mr-2" />
                                        {post.views} visualizações
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                {post.excerpt}
                            </p>

                            {/* Autor e Social */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <FiUser className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{post.author_name}</p>
                                        <p className="text-sm text-gray-600">{post.author_role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={handleLike}
                                        disabled={isLoading}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            } disabled:opacity-50`}
                                    >
                                        <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                        <span>{likesCount}</span>
                                    </button>

                                    <button
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                        className={`p-3 rounded-lg transition-colors ${isBookmarked
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <FiShare2 className="w-5 h-5" />
                                        </button>

                                        <AnimatePresence>
                                            {showShareMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50"
                                                >
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => handleShare('facebook')}
                                                            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                        >
                                                            <FiFacebook className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare('twitter')}
                                                            className="p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center"
                                                        >
                                                            <FiTwitter className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare('linkedin')}
                                                            className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center"
                                                        >
                                                            <FiLinkedin className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare()}
                                                            className="p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                                                        >
                                                            <FiLink className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Imagem Destacada */}
                        <div className="relative mb-12 rounded-3xl overflow-hidden">
                            <img
                                src={post.image || '/img/placeholder-blog.jpg'}
                                alt={post.title}
                                className="w-full h-96 object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/img/placeholder-blog.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        {/* Conteúdo do Artigo */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                            {/* Conteúdo Principal */}
                            <div className="lg:col-span-3">
                                <div
                                    className="prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={parseContent(post.content)}
                                />

                                {/* Tags */}
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                                        <FiTag className="w-5 h-5 mr-2 text-blue-600" />
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <a
                                                key={index}
                                                href={route('blog.posts', { search: tag })}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm"
                                            >
                                                #{tag}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* Seção de Comentários */}
                                <CommentsSection post={post} />
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-8">
                                {/* Posts Relacionados */}
                                {relatedPosts.length > 0 && (
                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Posts Relacionados
                                        </h3>
                                        <div className="space-y-4">
                                            {relatedPosts.map((relatedPost) => (
                                                <Link
                                                    key={relatedPost.id}
                                                    href={`/blog/${relatedPost.slug}`}
                                                    className="block group"
                                                >
                                                    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors">
                                                        <img
                                                            src={relatedPost.image || '/img/placeholder-blog.jpg'}
                                                            alt={relatedPost.title}
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/img/placeholder-blog.jpg';
                                                            }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                                                {relatedPost.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 capitalize">
                                                                {relatedPost.category}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    </article>
                </main>

                <FooterComponent />
            </FormStateProvider>
        </UserLoggedProvider>
    );
};

export default BlogShowPage;
