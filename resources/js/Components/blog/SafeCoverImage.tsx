import React, { useEffect, useState } from 'react';

/** Existing local asset — never point at a missing file (causes infinite onError loops). */
export const BLOG_COVER_FALLBACK = '/img/placeholder-blog.svg';

const INLINE_FALLBACK =
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect fill="#e2e8f0" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="28">SIGESC</text></svg>'
    );

type Props = {
    src?: string | null;
    alt: string;
    className?: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onError'>;

/**
 * Blog cover that falls back once to a real local asset, then to an inline SVG.
 * Prevents infinite request loops when post.image or a placeholder 404s.
 */
export default function SafeCoverImage({ src, alt, className, ...rest }: Props) {
    const initial = (src && String(src).trim()) || BLOG_COVER_FALLBACK;
    const [current, setCurrent] = useState(initial);
    const [stage, setStage] = useState<'primary' | 'file' | 'inline'>('primary');

    useEffect(() => {
        setCurrent((src && String(src).trim()) || BLOG_COVER_FALLBACK);
        setStage('primary');
    }, [src]);

    return (
        <img
            {...rest}
            src={current}
            alt={alt}
            className={className}
            loading={rest.loading ?? 'lazy'}
            onError={() => {
                if (stage === 'primary') {
                    setStage('file');
                    setCurrent(BLOG_COVER_FALLBACK);
                    return;
                }
                if (stage === 'file') {
                    setStage('inline');
                    setCurrent(INLINE_FALLBACK);
                }
            }}
        />
    );
}
