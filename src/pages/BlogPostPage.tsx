import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BlogCommentSection from '../components/Blog/BlogCommentSection';
import { useAuth } from '../contexts/AuthContext';
import { fetchBlogPostById, fetchBlogPosts } from '../services/blogService';
import { BlogPost } from '../types/blog';
import {
  buildBlogMetaDescription,
  buildBlogPostStructuredData,
  getBlogPostCanonicalUrl,
  getBlogPostPath,
  sanitizeBlogSummary,
} from '../utilities/blogSeo';
import { removeStructuredData, setPageSeo, setStructuredData } from '../utilities/seo';

const BLOG_POST_SCHEMA_ID = 'blog-post-structured-data';

const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { currentUser } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
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
        setError('Post not found.');
        setPost(null);
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
            setError('Post not found.');
            setPost(null);
            setRelatedPosts([]);
          }
          return;
        }

        const nearbyPosts = await fetchBlogPosts(16);
        const related = nearbyPosts
          .filter((item) => item.id !== loadedPost.id)
          .slice(0, 4);

        if (!cancelled) {
          setPost(loadedPost);
          setRelatedPosts(related);
        }
      } catch (loadError) {
        console.error('[BlogPostPage] Failed to load blog post:', loadError);
        if (!cancelled) {
          setError('Could not load this post right now.');
          setPost(null);
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
        ogImage: 'https://myfilmjobs.com/my-icon.png',
      });
      removeStructuredData(BLOG_POST_SCHEMA_ID);
      return;
    }

    setPageSeo({
      title: `${post.title} | Film Industry Blog | My Film Jobs`,
      description: buildBlogMetaDescription(post),
      canonicalUrl: getBlogPostCanonicalUrl(post.id),
      ogType: 'article',
      ogImage: post.imageUrl || 'https://myfilmjobs.com/my-icon.png',
    });
    setStructuredData(BLOG_POST_SCHEMA_ID, buildBlogPostStructuredData(post));

    return () => {
      removeStructuredData(BLOG_POST_SCHEMA_ID);
    };
  }, [postId, loading, error, post]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-semibold text-gray-900">Post not found</h1>
          <p className="mt-2 text-sm text-gray-600">{error || 'This post is not available.'}</p>
          <Link to="/blog" className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const summary = sanitizeBlogSummary(post.summary || '');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <nav className="text-sm text-gray-500">
          <Link to="/blog" className="font-medium text-blue-700 hover:underline">
            Blog
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="capitalize">{post.category}</span>
        </nav>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span>{post.publishedAt.toLocaleDateString()}</span>
          <span className="text-gray-300">•</span>
          <a
            href={post.sourceUrl || post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-700 hover:underline"
          >
            {post.sourceName}
          </a>
        </div>

        {post.imageUrl && (
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-auto w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

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
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Read Article
          </a>
          <Link
            to="/jobs"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
          >
            Browse Film Jobs
          </Link>
          {!currentUser && (
            <Link
              to="/register"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              Join Free
            </Link>
          )}
        </div>

        <section className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Grow Faster With My Film Jobs</h2>
          <p className="mt-2 text-sm text-gray-700">
            Find relevant roles, connect with crew, and collaborate on production work from one platform.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/jobs"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Jobs
            </Link>
            <Link
              to="/collaboration"
              className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Open Collaboration Tools
            </Link>
          </div>
        </section>

        <BlogCommentSection postId={post.id} currentUser={currentUser} />
      </article>

      {relatedPosts.length > 0 && (
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">More From the Blog</h2>
          <ul className="mt-4 space-y-3">
            {relatedPosts.map((relatedPost) => (
              <li key={relatedPost.id}>
                <Link
                  to={getBlogPostPath(relatedPost.id)}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  {relatedPost.title}
                </Link>
                <p className="mt-1 text-sm text-gray-600">
                  {relatedPost.publishedAt.toLocaleDateString()}
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
