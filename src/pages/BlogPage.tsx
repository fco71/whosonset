import React, { Suspense, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BlogPostCard from '../components/Blog/BlogPostCard';
import { useAuth } from '../contexts/AuthContext';
import { fetchBlogPostsPage } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { buildBlogListStructuredData } from '../utilities/blogSeo';
import { trackConversion } from '../utilities/conversionTracking';
import {
  clearPaginationLinks,
  removeStructuredData,
  setPageSeo,
  setPaginationLinks,
  setStructuredData,
} from '../utilities/seo';

const BLOG_LIST_SCHEMA_ID = 'blog-list-structured-data';
const POSTS_PER_PAGE = 18;
const BlogCommentSection = React.lazy(() => import('../components/Blog/BlogCommentSection'));

const BlogPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { pageNumber } = useParams<{ pageNumber?: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);

  const parsedPageNumber = pageNumber ? Number.parseInt(pageNumber, 10) : 1;
  const currentPage = Number.isFinite(parsedPageNumber) && parsedPageNumber > 0 ? parsedPageNumber : 1;
  const canonicalPath = currentPage === 1 ? '/blog' : `/blog/page/${currentPage}`;
  const canonicalUrl = `https://myfilmjobs.com${canonicalPath}`;

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await fetchBlogPostsPage(currentPage, POSTS_PER_PAGE);
      setPosts(result.posts);
      setHasNextPage(result.hasNextPage);
      setExpandedPostId('');
    } catch (loadError) {
      console.error('[BlogPage] Failed to load blog posts:', loadError);
      setError('Could not load industry updates right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pageNumber) {
      return;
    }
    if (!Number.isFinite(parsedPageNumber) || parsedPageNumber < 1) {
      navigate('/blog', { replace: true });
    }
  }, [navigate, pageNumber, parsedPageNumber]);

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const previewImage = posts.find((item) => Boolean(item.imageUrl))?.imageUrl || 'https://myfilmjobs.com/my-icon.png';

  useEffect(() => {
    const pageTitle = currentPage === 1
      ? 'Film Industry News Blog | Jobs and Collaboration Insights'
      : `Film Industry News Blog | Page ${currentPage} | Jobs and Collaboration Insights`;

    setPageSeo({
      title: pageTitle,
      description: 'Read film industry news and turn insights into action with job opportunities and collaboration tools on My Film Jobs.',
      canonicalUrl,
      ogImage: previewImage,
    });
  }, [canonicalUrl, currentPage, previewImage]);

  useEffect(() => {
    const previousPath = currentPage > 1 ? getBlogPagePath(currentPage - 1) : undefined;
    const nextPath = hasNextPage ? getBlogPagePath(currentPage + 1) : undefined;

    setPaginationLinks({
      prevUrl: previousPath ? `https://myfilmjobs.com${previousPath}` : undefined,
      nextUrl: nextPath ? `https://myfilmjobs.com${nextPath}` : undefined,
    });

    return () => {
      clearPaginationLinks();
    };
  }, [currentPage, hasNextPage]);

  useEffect(() => {
    if (loading || error || posts.length === 0) {
      removeStructuredData(BLOG_LIST_SCHEMA_ID);
      return;
    }

    setStructuredData(BLOG_LIST_SCHEMA_ID, buildBlogListStructuredData(posts, {
      pageUrl: canonicalUrl,
      pageName: currentPage === 1
        ? 'Film Industry News and Insights'
        : `Film Industry News and Insights - Page ${currentPage}`,
    }));
  }, [canonicalUrl, currentPage, loading, error, posts]);

  useEffect(() => {
    return () => {
      clearPaginationLinks();
      removeStructuredData(BLOG_LIST_SCHEMA_ID);
    };
  }, []);

  const getBlogPagePath = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`);
  const visiblePageNumbers = Array.from(new Set([
    1,
    ...(currentPage > 2 ? [currentPage - 1] : []),
    ...(currentPage > 1 ? [currentPage] : []),
    ...(hasNextPage ? [currentPage + 1] : []),
  ])).sort((left, right) => left - right);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Film Industry News and Insights</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600">
            Fresh film-industry updates with practical takeaways for your next job, project, or collaboration.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/jobs"
              onClick={() => trackConversion('blog_internal_cta_click', { placement: 'header_browse_jobs', page: currentPage })}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-black"
            >
              Browse Film Jobs
            </Link>
            <Link
              to="/collaboration"
              onClick={() => trackConversion('blog_internal_cta_click', { placement: 'header_collaboration', page: currentPage })}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Explore Collaboration
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-sm text-gray-600" role="status" aria-live="polite">Loading posts...</p>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600" role="status" aria-live="polite">
            No posts available yet.
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const expanded = expandedPostId === post.id;
              return (
                <div key={post.id}>
                  <BlogPostCard
                    post={post}
                    expanded={expanded}
                    onToggleComments={() => {
                      setExpandedPostId((current) => (current === post.id ? '' : post.id));
                    }}
                  />
                  {expanded && (
                    <div
                      id={`blog-comments-${post.id}`}
                      className="rounded-b-xl border border-t-0 border-gray-200 bg-white px-4 pb-6 sm:px-6"
                    >
                      <Suspense fallback={<p className="text-sm text-gray-500">Loading comments...</p>}>
                        <BlogCommentSection postId={post.id} currentUser={currentUser} />
                      </Suspense>
                    </div>
                  )}
                </div>
              );
            })}
            {(currentPage > 1 || hasNextPage) && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                <nav aria-label="Blog pagination" className="flex flex-wrap items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      to={getBlogPagePath(currentPage - 1)}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      onClick={() => trackConversion('blog_pagination_click', { direction: 'previous', fromPage: currentPage, toPage: currentPage - 1 })}
                      rel="prev"
                    >
                      Previous
                    </Link>
                  )}

                  {visiblePageNumbers.map((page) => (
                    <Link
                      key={page}
                      to={getBlogPagePath(page)}
                      className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => trackConversion('blog_pagination_click', { fromPage: currentPage, toPage: page })}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </Link>
                  ))}

                  {hasNextPage && (
                    <Link
                      to={getBlogPagePath(currentPage + 1)}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      onClick={() => trackConversion('blog_pagination_click', { direction: 'next', fromPage: currentPage, toPage: currentPage + 1 })}
                      rel="next"
                    >
                      Next
                    </Link>
                  )}
                </nav>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Turn Insights Into Opportunities</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Use the latest industry signals to find jobs faster, connect with collaborators, and build momentum for your next production.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/jobs"
              onClick={() => trackConversion('blog_internal_cta_click', { placement: 'footer_find_open_roles', page: currentPage })}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Find Open Roles
            </Link>
            <Link
              to={currentUser ? '/crew' : '/crew-public'}
              onClick={() => trackConversion('blog_internal_cta_click', { placement: 'footer_discover_crew', page: currentPage })}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
            >
              Discover Crew
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
