import React from 'react';
import { Helmet } from 'react-helmet';

export type SeoPayload = {
    title?: string;
    description?: string;
    keywords?: string | null;
    canonical?: string;
    og_type?: string;
    og_image?: string;
    robots?: string;
    twitter_card?: string;
    article?: {
        published_time?: string;
        modified_time?: string;
        author?: string;
        section?: string;
        tags?: string[];
    };
};

type Props = {
    seo?: SeoPayload | null;
    fallbackTitle?: string;
    fallbackDescription?: string;
};

/**
 * Client-side SEO mirror. Server already injects the same tags in Blade
 * for crawlers; this keeps Inertia client navigations consistent.
 */
export default function SeoHead({ seo, fallbackTitle, fallbackDescription }: Props) {
    const title = seo?.title || fallbackTitle || 'SIGESC';
    const description = seo?.description || fallbackDescription || '';

    return (
        <Helmet>
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {seo?.keywords && <meta name="keywords" content={seo.keywords} />}
            {seo?.robots && <meta name="robots" content={seo.robots} />}
            {seo?.canonical && <link rel="canonical" href={seo.canonical} />}
            <meta property="og:title" content={title} />
            {description && <meta property="og:description" content={description} />}
            {seo?.og_image && <meta property="og:image" content={seo.og_image} />}
            {seo?.og_type && <meta property="og:type" content={seo.og_type} />}
            {seo?.canonical && <meta property="og:url" content={seo.canonical} />}
            {seo?.article?.published_time && (
                <meta property="article:published_time" content={seo.article.published_time} />
            )}
            {seo?.article?.author && (
                <meta property="article:author" content={seo.article.author} />
            )}
            {seo?.article?.section && (
                <meta property="article:section" content={seo.article.section} />
            )}
            <meta name="twitter:card" content={seo?.twitter_card || 'summary_large_image'} />
            <meta name="twitter:title" content={title} />
            {description && <meta name="twitter:description" content={description} />}
            {seo?.og_image && <meta name="twitter:image" content={seo.og_image} />}
        </Helmet>
    );
}
