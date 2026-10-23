import React, { Suspense, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { ensureLanguageLoaded } from '../i18n';
import { fetchBlogPostById, fetchBlogPosts, fetchOriginalBlogPosts } from '../services/blogService';
import { BlogPost } from '../types/blog';
import {
  buildBlogPostBreadcrumbStructuredData,
  buildBlogMetaDescription,
  buildBlogPostStructuredData,
  getBlogPostCanonicalUrl,
  getBlogPostPath,
  getBlogPostRobots,
  sanitizeBlogSummary,
} from '../utilities/blogSeo';
import { trackConversion } from '../utilities/conversionTracking';
import { DEFAULT_OG_IMAGE_URL, clearPaginationLinks, removeStructuredData, setPageSeo, setStructuredData } from '../utilities/seo';

const BLOG_POST_SCHEMA_ID = 'blog-post-structured-data';
// Article typography for original posts (no @tailwindcss/typography in this project).
const ORIGINAL_BODY_CLASSES = [
  'mt-6 text-base leading-7 text-gray-800',
  '[&_p]:mt-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900',
  '[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900',
  '[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1',
  '[&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline',
  '[&_blockquote]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic',
  '[&_table]:mt-4 [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full [&_table]:text-sm [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:p-2 [&_th]:text-left',
  '[&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_img]:mt-4 [&_img]:rounded-lg [&_hr]:my-8',
  '[&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:text-sm',
].join(' ');

const BlogCommentSection = React.lazy(() => import('../components/Blog/BlogCommentSection'));

const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { currentUser } = useAuth();
  const { i18n } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  // The same article in the other language (es ↔ en), when it exists and is public.
  const [translation, setTranslation] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPost = async () => {
      let safePostId = '';
      if (postId) {
        try {
          safePostId = decodeURIComponent(postId);
        } catch {
          safePostId = postId;
        }
      }

      if (!safePostId) {
        setError('blog.notFoundBody');
        setPost(null);
        setTranslation(null);
        setRelatedPosts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const loadedPost = await fetchBlogPostById(safePostId);

        if (!loadedPost) {
          if (!cancelled) {
            setError('blog.notFoundBody');
            setPost(null);
            setTranslation(null);
            setRelatedPosts([]);
          }
          return;
        }

        const isOriginal = loadedPost.postType === 'original';
        // Original articles render their page chrome in the article's language, so
        // make sure that locale bundle is loaded before the first paint.
        const [nearbyPosts, translatedPost] = await Promise.all([
          // Originals link to other originals in the same language; curated posts to the latest feed.
          isOriginal ? fetchOriginalBlogPosts(12) : fetchBlogPosts(16),
          isOriginal && loadedPost.translationSlug
            ? fetchBlogPostById(loadedPost.translationSlug).catch(() => null)
            : Promise.resolve(null),
          isOriginal ? ensureLanguageLoaded(loadedPost.lang) : Promise.resolve(),
        ]);
        const related = nearbyPosts
          .filter((item) => item.id !== loadedPost.id)
          .filter((item) => !isOriginal || item.lang === loadedPost.lang)
          .slice(0, 4);

        if (!cancelled) {
          setPost(loadedPost);
          setTranslation(translatedPost && translatedPost.postType === 'original' ? translatedPost : null);
          setRelatedPosts(related);
        }
      } catch (loadError) {
        console.error('[BlogPostPage] Failed to load blog post:', loadError);
        if (!cancelled) {
          setError('blog.loadError');
          setPost(null);
          setTranslation(null);
          setRelatedPosts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  useEffect(() => {
    clearPaginationLinks();

    const fallbackCanonical = postId ? getBlogPostCanonicalUrl(postId) : 'https://myfilmjobs.com/blog';
    if (loading) {
      return;
    }

    if (error || !post) {
      setPageSeo({
        title: 'Blog Post Not Found | My Film Jobs',
        description: 'The requested blog post is not available.',
        canonicalUrl: fallbackCanonical,
        robots: 'noindex, nofollow',
      });
      removeStructuredData(BLOG_POST_SCHEMA_ID);
      return;
    }

    const isOriginal = post.postType === 'original';
    const selfUrl = getBlogPostCanonicalUrl(post.id);
    // Originals: explicit hreflang between the es/en versions (x-default → Spanish).
    // Without a translation, list only itself so no ?lang= variant is advertised.
    let alternates: { es?: string; en?: string; xDefault?: string } | undefined;
    if (isOriginal) {
      if (translation?.lang && translation.lang !== post.lang) {
        const otherUrl = getBlogPostCanonicalUrl(translation.id);
        const esUrl = post.lang === 'es' ? selfUrl : otherUrl;
        alternates = { es: esUrl, en: post.lang === 'es' ? otherUrl : selfUrl, xDefault: esUrl };
      } else {
        alternates = { [post.lang || 'en']: selfUrl };
      }
    }

    setPageSeo({
      title: isOriginal ? `${post.title} | My Film Jobs` : `${post.title} | Film Industry Blog | My Film Jobs`,
      description: buildBlogMetaDescription(post),
      canonicalUrl: selfUrl,
      ogType: 'article',
      ogImage: post.imageUrl || DEFAULT_OG_IMAGE_URL,
      robots: getBlogPostRobots(post),
      alternates,
    });
    setStructuredData(BLOG_POST_SCHEMA_ID, {
      '@context': 'https://schema.org',
      '@graph': [
        buildBlogPostStructuredData(post),
        buildBlogPostBreadcrumbStructuredData({
          id: post.id,
          title: post.title,
        }),
      ],
    });

    return () => {
      clearPaginationLinks();
      removeStructuredData(BLOG_POST_SCHEMA_ID);
    };
  }, [postId, loading, error, post, translation]);

  // Original articles set <html lang> to their own language while on screen.
  const articleLang = post?.postType === 'original' ? post.lang : undefined;
  useEffect(() => {
    if (!articleLang) return;
    document.documentElement.lang = articleLang;
    return () => {
      document.documentElement.lang = (i18n.language || 'en').split('-')[0];
    };
  }, [articleLang, i18n]);

  const t = i18n.getFixedT(articleLang || i18n.language);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-600" role="status" aria-live="polite">{t('blog.loadingPost')}</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-gray-900">{t('blog.notFoundTitle')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t(error || 'blog.notFoundBody')}</p>
          <Link to="/blog" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>
    );
  }

  const summary = sanitizeBlogSummary(post.summary || '');
  const isOriginal = post.postType === 'original';
  const trackExternalRead = (placement: string) => {
    trackConversion('blog_external_open', {
      postId: post.id,
      postTitle: post.title,
      sourceName: post.sourceName,
      placement,
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <nav className="text-sm text-gray-500">
          <Link to="/blog" className="font-medium text-blue-700 hover:underline">
            {t('blog.breadcrumb')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span>{t(`blog.categories.${post.category}`, { defaultValue: post.category })}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>{post.publishedAt.toLocaleDateString(articleLang)}</span>
          {isOriginal ? (
            <>
              {post.authorName && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="font-semibold text-gray-800">{post.authorName}</span>
                </>
              )}
              {translation?.lang && (
                <>
                  <span className="text-gray-300">•</span>
                  <Link
                    to={getBlogPostPath(translation.id)}
                    lang={translation.lang}
                    hrefLang={translation.lang}
                    className="font-semibold text-blue-700 hover:underline"
                    onClick={() => trackConversion('blog_translation_click', { fromPostId: post.id, toPostId: translation.id })}
                  >
                    {t(`blog.readIn.${translation.lang}`)}
                  </Link>
                </>
              )}
            </>
          ) : (
          <>
          <span className="text-gray-300">•</span>
          <a
            href={post.sourceUrl || post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-700 hover:underline"
            aria-label={`Open source website ${post.sourceName} in a new tab`}
          >
            {post.sourceName}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          </>
          )}
        </div>

        {post.imageUrl && (
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-auto w-full object-cover"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>
        )}

        {isOriginal ? (
          <div
            lang={post.lang}
            className={ORIGINAL_BODY_CLASSES}
            // bodyHtml is written only by scripts/publish-original-post.cjs (Admin SDK;
            // rules block client writes) and built from Markdown with raw HTML rejected.
            dangerouslySetInnerHTML={{ __html: post.bodyHtml || '' }}
          />
        ) : (
        <>
        <div className="mt-6 space-y-4 text-base leading-7 text-gray-700">
          <p>
            {summary || 'Review this film industry update and use it to guide your next project or career move.'}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
            onClick={() => trackExternalRead('post_read_button')}
            aria-label={`Read original article in a new tab: ${post.title}`}
          >
            Read Article
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link
            to="/jobs"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            onClick={() => trackConversion('blog_internal_cta_click', { placement: 'post_browse_jobs', postId: post.id })}
          >
            Browse Film Jobs
          </Link>
        </div>
        </>
        )}

        <section className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-lg font-semibold text-gray-900">{t('blog.ctaTitle')}</h2>
          <p className="mt-2 text-sm text-gray-700">
            {t('blog.ctaBody')}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/jobs"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              onClick={() => trackConversion('blog_internal_cta_click', { placement: 'post_explore_jobs', postId: post.id })}
            >
              {t('blog.exploreJobs')}
            </Link>
            <Link
              to="/collaboration"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              onClick={() => trackConversion('blog_internal_cta_click', { placement: 'post_collaboration', postId: post.id })}
            >
              {t('blog.openCollaboration')}
            </Link>
          </div>
        </section>

        <Suspense fallback={<p className="mt-6 text-sm text-gray-500">{t('blog.comments.loading')}</p>}>
          <BlogCommentSection postId={post.id} currentUser={currentUser} lang={articleLang} />
        </Suspense>
      </article>

      {relatedPosts.length > 0 && (
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('blog.moreFromBlog')}</h2>
          <ul className="mt-4 space-y-3">
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.id}>
                <Link
                  to={getBlogPostPath(relatedPost.id)}
                  className="font-semibold text-blue-700 hover:underline"
                  onClick={() => trackConversion('blog_related_post_click', {
                    fromPostId: post.id,
                    toPostId: relatedPost.id,
                  })}
                >
                  {relatedPost.title}
                </Link>
                <p className="mt-1 text-sm text-gray-600">
                  {relatedPost.publishedAt.toLocaleDateString(articleLang)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;
