import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, usePage } from "@inertiajs/react";
import { H as HeaderComponent, F as FooterComponent, S as SIGESC_ADMIN_LOGIN_URL } from "./Header-7tCmCImi.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { S as SeoHead } from "./SeoHead-DDdyn2J1.js";
import { S as SafeCoverImage } from "./SafeCoverImage-y_7M7GQw.js";
import { FiArrowLeft, FiCalendar, FiClock, FiEye, FiUser, FiHeart, FiBookmark, FiShare2, FiFacebook, FiTwitter, FiLinkedin, FiLink, FiTag, FiLoader, FiSend, FiMessageSquare, FiChevronUp, FiChevronDown, FiEdit, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "./index-DJUNAe3r.js";
import "react-icons/fa6";
import "react-icons/ri";
import "react-helmet";
const CommentItem = ({ comment, onReply, onLike, onEdit, onDelete, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  useState(false);
  useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = usePage().props.auth;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const canModify = () => {
    return user && (user.id === comment.user_id || user.isAdmin);
  };
  const handleLike = async () => {
    await onLike(comment.id);
  };
  return /* @__PURE__ */ jsxs("div", { className: `${level > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`, children: [
    /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: comment.author_avatar || "/img/avatar-placeholder.svg",
          alt: comment.author_name,
          className: "w-10 h-10 rounded-full object-cover flex-shrink-0"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900", children: comment.author_name }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: formatDate(comment.created_at) })
          ] }),
          comment.replies_count > 0 && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsExpanded(!isExpanded),
              className: "flex items-center text-sm text-blue-600 hover:text-blue-700",
              children: [
                isExpanded ? /* @__PURE__ */ jsx(FiChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(FiChevronDown, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsxs("span", { className: "ml-1", children: [
                  comment.replies_count,
                  " resposta",
                  comment.replies_count !== 1 ? "s" : ""
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-700 whitespace-pre-wrap", children: comment.content }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4 mt-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleLike,
              disabled: isLoading,
              className: `flex items-center space-x-1 text-sm ${comment.isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"} disabled:opacity-50`,
              children: [
                /* @__PURE__ */ jsx(FiHeart, { className: `w-4 h-4 ${comment.isLiked ? "fill-current" : ""}` }),
                /* @__PURE__ */ jsx("span", { children: comment.likes_count })
              ]
            }
          ),
          canModify() && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => onEdit(comment),
                className: "flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600",
                children: [
                  /* @__PURE__ */ jsx(FiEdit, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Editar" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => onDelete(comment.id),
                className: "flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600",
                children: [
                  /* @__PURE__ */ jsx(FiTrash2, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsx("span", { children: "Excluir" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    isExpanded && comment.replies && comment.replies.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2", children: comment.replies.map((reply) => /* @__PURE__ */ jsx(
      CommentItem,
      {
        comment: reply,
        onReply,
        onLike,
        onEdit,
        onDelete,
        level: level + 1
      },
      reply.id
    )) })
  ] });
};
const CommentsSection = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [commentContent, setCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const { user } = usePage().props.auth;
  useEffect(() => {
    loadComments();
    const handleCommentsUpdated = () => loadComments();
    window.addEventListener("commentsUpdated", handleCommentsUpdated);
    return () => window.removeEventListener("commentsUpdated", handleCommentsUpdated);
  }, [sortBy]);
  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(route("blog.posts.comments", { post: post.id, sort: sortBy }));
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitComment = async (e) => {
    var _a;
    e.preventDefault();
    if (!commentContent.trim())
      return;
    setIsLoading(true);
    try {
      const response = await axios.post(route("blog.posts.comment", { post: post.id }), {
        content: commentContent,
        parent_id: replyingTo == null ? void 0 : replyingTo.id,
        author_name: !user ? prompt("Seu nome:") : void 0,
        author_email: !user ? prompt("Seu email:") : void 0
      });
      if (response.status === 200) {
        setCommentContent("");
        setReplyingTo(null);
        setEditingComment(null);
        window.dispatchEvent(new CustomEvent("commentsUpdated"));
      }
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      if ((_a = error.response.data) == null ? void 0 : _a.errors) {
        toast.error(Object.values(error.response.data.errors).flat().join("\n"));
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleLike = async (commentId) => {
    try {
      const response = await axios.post(route("blog.posts.comment.like", { post: post.id, comment: commentId }));
      if (response.status === 200) {
        loadComments();
      }
    } catch (error) {
      console.error("Erro ao curtir comentário:", error);
    }
  };
  const handleReply = (comment) => {
    setReplyingTo(comment);
    setEditingComment(null);
  };
  const handleEdit = (comment) => {
    setEditingComment(comment);
    setReplyingTo(null);
    setCommentContent(comment.content);
  };
  const handleDelete = async (commentId) => {
    var _a;
    if (!confirm("Tem certeza que deseja excluir este comentário?"))
      return;
    try {
      const response = await fetch(`/engagement/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-TOKEN": ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) || "",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      if (response.ok) {
        window.dispatchEvent(new CustomEvent("commentsUpdated"));
      }
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-gray-200", children: [
    /* @__PURE__ */ jsx(ToastContainer, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-bold text-gray-900", children: [
        "Comentários (",
        post.comments_count || 0,
        ")"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mt-2 sm:mt-0", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Ordenar por:" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: sortBy,
            onChange: (e) => setSortBy(e.target.value),
            className: "text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            disabled: isLoading,
            children: [
              /* @__PURE__ */ jsx("option", { value: "newest", children: "Mais recentes" }),
              /* @__PURE__ */ jsx("option", { value: "popular", children: "Mais populares" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("form", { onSubmit: handleSubmitComment, className: "mb-8", children: /* @__PURE__ */ jsx("div", { className: "flex space-x-3", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: commentContent,
          onChange: (e) => setCommentContent(e.target.value),
          placeholder: editingComment ? "Edite seu comentário..." : replyingTo ? `Respondendo a ${replyingTo.author_name}...` : "Deixe seu comentário...",
          className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",
          rows: 4,
          disabled: isLoading
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mt-2", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          editingComment && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setEditingComment(null);
                setCommentContent("");
              },
              className: "text-sm text-gray-600 hover:text-gray-800 mr-4",
              disabled: isLoading,
              children: "Cancelar edição"
            }
          ),
          replyingTo && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setReplyingTo(null);
                setCommentContent("");
              },
              className: "text-sm text-gray-600 hover:text-gray-800",
              disabled: isLoading,
              children: "Cancelar resposta"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: !commentContent.trim() || isLoading,
            className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2",
            children: [
              isLoading ? /* @__PURE__ */ jsx(FiLoader, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(FiSend, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: editingComment ? "Atualizar" : "Comentar" })
            ]
          }
        )
      ] })
    ] }) }) }),
    isLoading && comments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx(FiLoader, { className: "w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Carregando comentários..." })
    ] }) : comments.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-2xl p-8 text-center", children: [
      /* @__PURE__ */ jsx(FiMessageSquare, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: "Seja o primeiro a comentar!" }),
      !user && /* @__PURE__ */ jsx(
        "a",
        {
          href: SIGESC_ADMIN_LOGIN_URL,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
          children: "Entrar para comentar"
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: comments.map((comment) => /* @__PURE__ */ jsx(
      CommentItem,
      {
        comment,
        onReply: handleReply,
        onLike: handleLike,
        onEdit: handleEdit,
        onDelete: handleDelete
      },
      comment.id
    )) })
  ] });
};
const BlogShowPage = ({ auth, local, post, relatedPosts, popularPosts, seo }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  const handleLike = async () => {
    var _a;
    setIsLoading(true);
    try {
      const response = await fetch(`/engagement/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.getAttribute("content")) || "",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.likes_count);
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Erro ao curtir post:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    encodeURIComponent(post.excerpt);
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank");
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
    setShowShareMenu(false);
  };
  const parseContent = (content) => {
    return { __html: content };
  };
  const estimatedReadTime = Math.max(5, Math.ceil(post.content.split(" ").length / 200));
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: `${post.title} | Blog SIGESC`,
        fallbackDescription: post.excerpt
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsx("main", { className: "mt-10 bg-white", children: /* @__PURE__ */ jsxs("article", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("blog.posts"),
          className: "blog-body inline-flex items-center font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-900",
          children: [
            /* @__PURE__ */ jsx(FiArrowLeft, { className: "mr-2 h-5 w-5" }),
            "Voltar para o Blog"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("header", { className: "mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "blog-body mb-6 flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "rounded-md bg-sky-100 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-sky-800", children: post.category }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
              /* @__PURE__ */ jsx(FiCalendar, { className: "mr-2 h-4 w-4" }),
              formatDate(post.publish_date)
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
              /* @__PURE__ */ jsx(FiClock, { className: "mr-2 h-4 w-4" }),
              estimatedReadTime,
              " min de leitura"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center", children: [
              /* @__PURE__ */ jsx(FiEye, { className: "mr-2 h-4 w-4" }),
              post.views,
              " visualizações"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "blog-display mb-5 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 md:text-5xl lg:text-6xl", children: post.title }),
        /* @__PURE__ */ jsx("p", { className: "blog-body mb-8 max-w-3xl text-xl leading-relaxed text-slate-600 md:text-2xl", children: post.excerpt }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(FiUser, { className: "w-6 h-6 text-white" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: post.author_name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: post.author_role })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleLike,
                disabled: isLoading,
                className: `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"} disabled:opacity-50`,
                children: [
                  /* @__PURE__ */ jsx(FiHeart, { className: `w-5 h-5 ${isLiked ? "fill-current" : ""}` }),
                  /* @__PURE__ */ jsx("span", { children: likesCount })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setIsBookmarked(!isBookmarked),
                className: `p-3 rounded-lg transition-colors ${isBookmarked ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
                children: /* @__PURE__ */ jsx(FiBookmark, { className: `w-5 h-5 ${isBookmarked ? "fill-current" : ""}` })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowShareMenu(!showShareMenu),
                  className: "p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors",
                  children: /* @__PURE__ */ jsx(FiShare2, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsx(AnimatePresence, { children: showShareMenu && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, scale: 0.95 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: 10, scale: 0.95 },
                  className: "absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50",
                  children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleShare("facebook"),
                        className: "p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center",
                        children: /* @__PURE__ */ jsx(FiFacebook, { className: "w-5 h-5" })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleShare("twitter"),
                        className: "p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center",
                        children: /* @__PURE__ */ jsx(FiTwitter, { className: "w-5 h-5" })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleShare("linkedin"),
                        className: "p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center",
                        children: /* @__PURE__ */ jsx(FiLinkedin, { className: "w-5 h-5" })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => handleShare(),
                        className: "p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center",
                        children: /* @__PURE__ */ jsx(FiLink, { className: "w-5 h-5" })
                      }
                    )
                  ] })
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mb-12 rounded-3xl overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          SafeCoverImage,
          {
            src: post.image,
            alt: post.title,
            className: "w-full h-96 object-cover",
            loading: "eager"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "blog-prose blog-body max-w-none",
              dangerouslySetInnerHTML: parseContent(post.content)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mt-12 border-t border-slate-200 pt-8", children: [
            /* @__PURE__ */ jsxs("h3", { className: "blog-display mb-4 flex items-center text-xl font-semibold text-slate-900", children: [
              /* @__PURE__ */ jsx(FiTag, { className: "mr-2 h-5 w-5 text-sky-600" }),
              "Tags"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: post.tags.map((tag, index) => /* @__PURE__ */ jsxs(
              Link,
              {
                href: route("blog.posts", { search: tag }),
                className: "blog-body rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 underline-offset-2 transition-colors hover:bg-sky-100 hover:text-sky-800 hover:underline",
                children: [
                  "#",
                  tag
                ]
              },
              index
            )) })
          ] }),
          /* @__PURE__ */ jsx(CommentsSection, { post })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1 space-y-8", children: relatedPosts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "blog-display mb-4 text-xl font-semibold text-slate-900", children: "Posts Relacionados" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: relatedPosts.map((relatedPost) => /* @__PURE__ */ jsx(
            Link,
            {
              href: route("blog.posts.show", { slug: relatedPost.slug }),
              className: "group block",
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-white", children: [
                /* @__PURE__ */ jsx(
                  SafeCoverImage,
                  {
                    src: relatedPost.image,
                    alt: relatedPost.title,
                    className: "h-16 w-16 rounded-lg object-cover"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx("p", { className: "blog-display text-sm font-semibold leading-snug text-slate-900 underline-offset-2 transition-colors group-hover:text-sky-800 group-hover:underline line-clamp-2", children: relatedPost.title }),
                  /* @__PURE__ */ jsx("p", { className: "blog-body mt-0.5 text-xs capitalize text-slate-500", children: relatedPost.category })
                ] })
              ] })
            },
            relatedPost.id
          )) })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
};
export {
  BlogShowPage as default
};
