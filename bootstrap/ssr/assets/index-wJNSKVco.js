import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { H as HeaderComponent, F as FooterComponent } from "./Header-DF037L4K.js";
import { F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-DyDIPP3j.js";
import { S as SeoHead } from "./SeoHead-DDdyn2J1.js";
import { FiSearch, FiCalendar, FiClock, FiEye, FiHeart, FiShare2, FiArrowRight, FiFilter, FiChevronDown, FiTag, FiTrendingUp, FiArrowLeft, FiLoader } from "react-icons/fi";
import axios from "axios";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "./index-DJUNAe3r.js";
import "react-toastify";
import "react-icons/fa6";
import "react-icons/ri";
import "react-helmet";
const BlogPostSkeleton = () => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-lg overflow-hidden h-96 animate-pulse", children: [
  /* @__PURE__ */ jsx("div", { className: "h-48 bg-gradient-to-r from-blue-100 to-blue-200" }),
  /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded-full mb-4 w-1/3" }),
    /* @__PURE__ */ jsx("div", { className: "h-6 bg-gray-200 rounded mb-3" }),
    /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded mb-2" }),
    /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-2/3" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-gray-200 rounded-full" }),
      /* @__PURE__ */ jsxs("div", { className: "ml-3 flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded mb-1 w-1/2" }),
        /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-200 rounded w-1/3" })
      ] })
    ] })
  ] })
] });
const BlogPostCard = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  const postUrl = route("blog.posts.show", { slug: post.slug });
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const absolute = `${window.location.origin}${postUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: absolute
        });
      } catch (error) {
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      navigator.clipboard.writeText(absolute);
      alert("Link copiado para a área de transferência!");
    }
  };
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.post(route("blog.posts.like", { post: post.id }));
      if (response.status === 200) {
        const data = response.data;
        setLikesCount(data.likes_count);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Erro ao curtir post:", error);
    }
  };
  return /* @__PURE__ */ jsx(
    motion.article,
    {
      initial: { opacity: 0, y: 28 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-40px" },
      transition: { duration: 0.55, delay: index * 0.06 },
      className: "group h-full",
      onHoverStart: () => setIsHovered(true),
      onHoverEnd: () => setIsHovered(false),
      children: /* @__PURE__ */ jsxs(
        Link,
        {
          href: postUrl,
          className: "flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_22px_50px_-28px_rgba(11,92,171,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden", children: [
              /* @__PURE__ */ jsx(
                motion.img,
                {
                  src: post.image || "/img/placeholder-blog.jpg",
                  alt: post.title,
                  className: "h-52 w-full object-cover",
                  whileHover: { scale: 1.04 },
                  transition: { duration: 0.45 },
                  onError: (e) => {
                    e.currentTarget.src = "/img/placeholder-blog.jpg";
                  }
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" }),
              /* @__PURE__ */ jsx("div", { className: "absolute left-4 top-4", children: /* @__PURE__ */ jsx("span", { className: "blog-body rounded-md bg-sky-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white", children: post.category }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col px-5 pb-5 pt-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "blog-body mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500", children: [
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(FiCalendar, { className: "h-3.5 w-3.5" }),
                  formatDate(post.publish_date)
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(FiClock, { className: "h-3.5 w-3.5" }),
                  post.read_time,
                  " min"
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "blog-display mb-3 text-[1.45rem] font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-sky-800 line-clamp-2", children: post.title }),
              /* @__PURE__ */ jsx("p", { className: "blog-body mb-5 flex-grow text-[0.98rem] leading-relaxed text-slate-600 line-clamp-3", children: post.excerpt }),
              /* @__PURE__ */ jsxs("div", { className: "blog-body mt-auto flex items-center justify-between border-t border-slate-100 pt-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-slate-700", children: post.author_name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-500", children: [
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(FiEye, { className: "h-3.5 w-3.5" }),
                    post.views
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(FiHeart, { className: "h-3.5 w-3.5" }),
                    likesCount
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "blog-body mt-4 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleLike,
                      className: `rounded-lg p-2 transition-colors ${isLiked ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                      "aria-label": "Curtir artigo",
                      children: /* @__PURE__ */ jsx(FiHeart, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleShare,
                      className: "rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200",
                      "aria-label": "Partilhar artigo",
                      children: /* @__PURE__ */ jsx(FiShare2, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  motion.span,
                  {
                    animate: { x: isHovered ? 4 : 0 },
                    className: "inline-flex items-center text-sm font-bold text-sky-700 underline decoration-sky-300 underline-offset-4",
                    children: [
                      "Ler artigo",
                      /* @__PURE__ */ jsx(FiArrowRight, { className: "ml-1 h-4 w-4" })
                    ]
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
};
const BlogHero = ({ featuredPost }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  if (!featuredPost) {
    return /* @__PURE__ */ jsx("section", { className: "relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#1d4f91_0%,transparent_45%),radial-gradient(circle_at_80%_0%,#0ea5e9_0%,transparent_35%),linear-gradient(160deg,#0b2748_0%,#123a66_55%,#0f766e_120%)] py-24 text-white", children: /* @__PURE__ */ jsx("div", { className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7 },
        className: "max-w-3xl",
        children: [
          /* @__PURE__ */ jsx("p", { className: "blog-body mb-4 text-xs font-bold uppercase tracking-[0.22em] text-sky-200", children: "Conteúdo SIGESC" }),
          /* @__PURE__ */ jsx("h1", { className: "blog-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl", children: "Blog SIGESC" }),
          /* @__PURE__ */ jsx("p", { className: "blog-body mt-6 max-w-2xl text-lg leading-relaxed text-sky-50/90 md:text-xl", children: "Insights práticos de gestão, fiscalidade e operação para PME em Angola." })
        ]
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-[radial-gradient(circle_at_15%_10%,#1d4f91_0%,transparent_42%),radial-gradient(circle_at_90%_20%,#0891b2_0%,transparent_40%),linear-gradient(165deg,#0b2748_0%,#134e6f_60%,#115e59_130%)] py-20 text-white md:py-24", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[url('/img/sigesc%20capa.png')] bg-cover bg-center opacity-[0.07]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7 },
          className: "mb-10 max-w-3xl",
          children: [
            /* @__PURE__ */ jsx("p", { className: "blog-body mb-3 text-xs font-bold uppercase tracking-[0.22em] text-sky-200", children: "Blog SIGESC" }),
            /* @__PURE__ */ jsx("h1", { className: "blog-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl", children: "Ideias que fazem a gestão andar" }),
            /* @__PURE__ */ jsx("p", { className: "blog-body mt-5 max-w-2xl text-lg text-sky-50/90", children: "Artigos claros sobre AGT, stock, PDV, finanças e crescimento comercial." })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 32 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay: 0.12 },
          children: /* @__PURE__ */ jsxs(
            Link,
            {
              href: route("blog.posts.show", { slug: featuredPost.slug }),
              className: "group grid items-stretch overflow-hidden rounded-3xl border border-white/20 bg-white/[0.08] shadow-2xl backdrop-blur-md transition hover:border-sky-300/50 md:grid-cols-2",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center p-8 md:p-10", children: [
                  /* @__PURE__ */ jsxs("span", { className: "blog-body mb-4 inline-flex w-fit rounded-md bg-sky-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white", children: [
                    "Em destaque · ",
                    featuredPost.category
                  ] }),
                  /* @__PURE__ */ jsx("h2", { className: "blog-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl", children: featuredPost.title }),
                  /* @__PURE__ */ jsx("p", { className: "blog-body mt-4 text-base leading-relaxed text-sky-50/90 md:text-lg", children: featuredPost.excerpt }),
                  /* @__PURE__ */ jsxs("div", { className: "blog-body mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-sky-100/80", children: [
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(FiClock, { className: "h-4 w-4" }),
                      featuredPost.read_time,
                      " min"
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(FiCalendar, { className: "h-4 w-4" }),
                      formatDate(featuredPost.publish_date)
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(FiEye, { className: "h-4 w-4" }),
                      featuredPost.views,
                      " views"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "blog-body mt-8 inline-flex items-center text-sm font-bold text-sky-200 underline decoration-sky-400/70 underline-offset-4 transition group-hover:text-white", children: [
                    "Ler artigo completo",
                    /* @__PURE__ */ jsx(FiArrowRight, { className: "ml-2 h-4 w-4 transition group-hover:translate-x-1" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "relative min-h-[240px] md:min-h-full", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: featuredPost.image || "/img/placeholder-blog.jpg",
                      alt: featuredPost.title,
                      className: "absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]",
                      onError: (e) => {
                        e.currentTarget.src = "/img/placeholder-blog.jpg";
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0b2748]/70 via-transparent to-transparent md:from-[#0b2748]/40" })
                ] })
              ]
            }
          )
        }
      )
    ] })
  ] });
};
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
    onFiltersChange({ category: activeCategory, search: searchTerm, sort: sortBy });
  }, [activeCategory, sortBy]);
  const handleSearch = (e) => {
    e.preventDefault();
    onFiltersChange({ category: activeCategory, search: searchTerm, sort: sortBy });
  };
  return /* @__PURE__ */ jsx("section", { className: "py-8 bg-white sticky top-0 z-10 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "relative w-full lg:w-96", children: [
        /* @__PURE__ */ jsx(FiSearch, { className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar artigos...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: sortBy,
            onChange: (e) => setSortBy(e.target.value),
            className: "bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            children: [
              /* @__PURE__ */ jsx("option", { value: "newest", children: "Mais recentes" }),
              /* @__PURE__ */ jsx("option", { value: "oldest", children: "Mais antigos" }),
              /* @__PURE__ */ jsx("option", { value: "popular", children: "Mais populares" }),
              /* @__PURE__ */ jsx("option", { value: "views", children: "Mais visualizados" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveCategory("all"),
              className: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === "all" ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: "Todos"
            }
          ),
          categories.map((category) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveCategory(category),
              className: `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
              children: category
            },
            category
          ))
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsFiltersOpen(!isFiltersOpen),
            className: "lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium",
            children: [
              /* @__PURE__ */ jsx(FiFilter, { className: "w-4 h-4" }),
              "Filtros",
              /* @__PURE__ */ jsx(FiChevronDown, { className: `w-4 h-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}` })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isFiltersOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        className: "lg:hidden mt-4",
        children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveCategory("all"),
              className: `px-3 py-1 rounded-full text-sm font-medium ${activeCategory === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`,
              children: "Todos"
            }
          ),
          categories.map((category) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveCategory(category),
              className: `px-3 py-1 rounded-full text-sm font-medium ${activeCategory === category ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`,
              children: category
            },
            category
          ))
        ] })
      }
    ) })
  ] }) });
};
const BlogSidebar = ({ recentPosts, trendingPosts, categories, onCategorySelect }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxs("h3", { className: "blog-display mb-4 flex items-center text-xl font-semibold text-slate-900", children: [
        /* @__PURE__ */ jsx(FiTag, { className: "mr-2 h-5 w-5 text-sky-600" }),
        "Categorias"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-1", children: categories.map((category) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onCategorySelect(category),
          className: "blog-body flex w-full items-center justify-between rounded-lg p-2.5 text-left font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-800",
          children: /* @__PURE__ */ jsx("span", { className: "underline decoration-transparent underline-offset-4 hover:decoration-sky-400", children: category })
        },
        category
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxs("h3", { className: "blog-display mb-4 flex items-center text-xl font-semibold text-slate-900", children: [
        /* @__PURE__ */ jsx(FiClock, { className: "mr-2 h-5 w-5 text-sky-600" }),
        "Recentes"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recentPosts.slice(0, 5).map((post) => /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("blog.posts.show", { slug: post.slug }),
          className: "group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sky-50",
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: post.image || "/img/placeholder-blog.jpg",
                alt: post.title,
                className: "h-12 w-12 rounded-lg object-cover",
                onError: (e) => {
                  e.currentTarget.src = "/img/placeholder-blog.jpg";
                }
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "blog-display text-sm font-semibold leading-snug text-slate-900 underline-offset-2 group-hover:text-sky-800 group-hover:underline line-clamp-2", children: post.title }),
              /* @__PURE__ */ jsx("p", { className: "blog-body mt-0.5 text-xs text-slate-500", children: formatDate(post.publish_date) })
            ] })
          ]
        },
        post.id
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxs("h3", { className: "blog-display mb-4 flex items-center text-xl font-semibold text-slate-900", children: [
        /* @__PURE__ */ jsx(FiTrendingUp, { className: "mr-2 h-5 w-5 text-sky-600" }),
        "Em Alta"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: trendingPosts.slice(0, 5).map((post) => /* @__PURE__ */ jsxs(
        Link,
        {
          href: route("blog.posts.show", { slug: post.slug }),
          className: "group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sky-50",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: post.image || "/img/placeholder-blog.jpg",
                  alt: post.title,
                  className: "h-12 w-12 rounded-lg object-cover",
                  onError: (e) => {
                    e.currentTarget.src = "/img/placeholder-blog.jpg";
                  }
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute -right-1 -top-1 rounded bg-sky-600 px-1 text-[10px] font-bold text-white", children: post.views })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "blog-display text-sm font-semibold leading-snug text-slate-900 underline-offset-2 group-hover:text-sky-800 group-hover:underline line-clamp-2", children: post.title }),
              /* @__PURE__ */ jsx("p", { className: "blog-body mt-0.5 text-xs text-slate-500", children: post.category })
            ] })
          ]
        },
        post.id
      )) })
    ] })
  ] });
};
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
  if (totalPages <= 1)
    return null;
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-2 mt-12", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onPageChange(currentPage - 1),
        disabled: currentPage === 1 || isLoading,
        className: "p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors",
        children: /* @__PURE__ */ jsx(FiArrowLeft, { className: "w-5 h-5" })
      }
    ),
    pages[0] > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onPageChange(1),
          disabled: isLoading,
          className: "px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50",
          children: "1"
        }
      ),
      pages[0] > 2 && /* @__PURE__ */ jsx("span", { className: "px-2", children: "..." })
    ] }),
    pages.map((page) => /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onPageChange(page),
        disabled: isLoading,
        className: `px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 ${currentPage === page ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 hover:bg-gray-50"}`,
        children: page
      },
      page
    )),
    pages[pages.length - 1] < totalPages && /* @__PURE__ */ jsxs(Fragment, { children: [
      pages[pages.length - 1] < totalPages - 1 && /* @__PURE__ */ jsx("span", { className: "px-2", children: "..." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onPageChange(totalPages),
          disabled: isLoading,
          className: "px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50",
          children: totalPages
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onPageChange(currentPage + 1),
        disabled: currentPage === totalPages || isLoading,
        className: "p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors",
        children: /* @__PURE__ */ jsx(FiArrowRight, { className: "w-5 h-5" })
      }
    ),
    isLoading && /* @__PURE__ */ jsx("div", { className: "ml-4", children: /* @__PURE__ */ jsx(FiLoader, { className: "w-5 h-5 animate-spin text-blue-500" }) })
  ] });
};
function BlogPage({ auth, local, posts: initialPosts, categories, featuredPosts, recentPosts, trendingPosts, pagination: initialPagination, filters: initialFilters, seo }) {
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState((initialFilters == null ? void 0 : initialFilters.category) || "all");
  const [searchTerm, setSearchTerm] = useState((initialFilters == null ? void 0 : initialFilters.search) || "");
  const [sortBy, setSortBy] = useState((initialFilters == null ? void 0 : initialFilters.sort) || "newest");
  const [currentPage, setCurrentPage] = useState((initialPagination == null ? void 0 : initialPagination.current_page) || 1);
  const [pagination, setPagination] = useState(initialPagination);
  const loadPosts = async (page = 1, filters = {}) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        category: filters.category || activeCategory,
        search: filters.search || searchTerm,
        sort: filters.sort || sortBy
      });
      const response = await fetch(`${route("blog.posts.data")}?${params.toString()}`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json"
        },
        cache: "no-store"
      });
      const data = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
      setCurrentPage(data.pagination.current_page);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFiltersChange = (filters) => {
    loadPosts(1, filters);
  };
  const handlePageChange = (page) => {
    loadPosts(page);
  };
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    handleFiltersChange({ category, search: searchTerm, sort: sortBy });
  };
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(
      SeoHead,
      {
        seo,
        fallbackTitle: "Blog SIGESC | Artigos sobre Gestão Empresarial e Tecnologia",
        fallbackDescription: "Blog oficial SIGESC com artigos exclusivos sobre gestão empresarial, produtividade, finanças e tecnologia. Aprenda com especialistas e transforme seu negócio."
      }
    ),
    /* @__PURE__ */ jsx(HeaderComponent, { auth }),
    /* @__PURE__ */ jsx(BlogHero, { featuredPost: featuredPosts[0] }),
    /* @__PURE__ */ jsx(
      BlogFilters,
      {
        categories,
        activeCategory,
        setActiveCategory,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        onFiltersChange: handleFiltersChange
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "bg-[linear-gradient(180deg,#f8fafc_0%,#eef6fb_45%,#f8fafc_100%)] py-16", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx(
        BlogSidebar,
        {
          recentPosts,
          trendingPosts,
          categories,
          onCategorySelect: handleCategorySelect
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "blog-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl", children: "Últimos artigos" }),
          /* @__PURE__ */ jsxs("p", { className: "blog-body mt-1 text-slate-600", children: [
            "Mostrando ",
            posts.length,
            " de ",
            pagination == null ? void 0 : pagination.total,
            " artigos",
            activeCategory !== "all" && ` em "${activeCategory}"`,
            searchTerm && ` para "${searchTerm}"`
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(BlogPostSkeleton, {}, i)) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8", children: posts.map((post, index) => /* @__PURE__ */ jsx(BlogPostCard, { post, index }, post.id)) }),
          posts.length === 0 && /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-center py-20",
              children: [
                /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6", children: /* @__PURE__ */ jsx(FiSearch, { className: "w-12 h-12 text-gray-400" }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Nenhum artigo encontrado" }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-8", children: searchTerm ? `Não encontramos resultados para "${searchTerm}"` : `Não há artigos ${activeCategory !== "all" ? `na categoria "${activeCategory}"` : "disponíveis"}` }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => {
                      setActiveCategory("all");
                      setSearchTerm("");
                      setSortBy("newest");
                      handleFiltersChange({ category: "all", search: "", sort: "newest" });
                    },
                    className: "px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors",
                    children: "Ver Todos os Artigos"
                  }
                )
              ]
            }
          )
        ] }) }),
        pagination && pagination.last_page > 1 && /* @__PURE__ */ jsx(
          Pagination,
          {
            currentPage,
            totalPages: pagination.last_page,
            onPageChange: handlePageChange,
            isLoading
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  BlogPage as default
};
