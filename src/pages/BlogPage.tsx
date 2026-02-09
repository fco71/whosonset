import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogPostCard from '../components/Blog/BlogPostCard';
import BlogCommentSection from '../components/Blog/BlogCommentSection';
import { useAuth } from '../contexts/AuthContext';
import { fetchBlogPosts } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { buildBlogListStructuredData } from '../utilities/blogSeo';
import { removeStructuredData, setPageSeo, setStructuredData } from '../utilities/seo';

const BLOG_LIST_SCHEMA_ID = 'blog-list-structured-data';

const BlogPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string>('');

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const loadedPosts = await fetchBlogPosts(45);
      setPosts(loadedPosts);
    } catch (loadError) {
      console.error('[BlogPage] Failed to load blog posts:', loadError);
      setError('Could not load industry updates right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const previewImage = posts.find((item) => Boolean(item.imageUrl))?.imageUrl || 'https://myfilmjobs.com/my-icon.png';

  useEffect(() => {
    setPageSeo({
      title: 'Film Industry News Blog | Jobs and Collaboration Insights',
      description: 'Read film industry news and turn insights into action with job opportunities and collaboration tools on My Film Jobs.',
      canonicalUrl: 'https://myfilmjobs.com/blog',
      ogImage: previewImage,
    });
  }, [previewImage]);

  useEffect(() => {
    if (loading || error || posts.length === 0) {
      removeStructuredData(BLOG_LIST_SCHEMA_ID);
      return;
    }

    setStructuredData(BLOG_LIST_SCHEMA_ID, buildBlogListStructuredData(posts));
  }, [loading, error, posts]);

  useEffect(() => {
    return () => {
      removeStructuredData(BLOG_LIST_SCHEMA_ID);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Film Industry News and Insights</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600">
            Fresh film-industry updates with practical takeaways for your next job, project, or collaboration.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/jobs"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
            >
              Browse Film Jobs
            </Link>
            <Link
              to="/collaboration"
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Explore Collaboration
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-sm text-gray-600">Loading posts...</p>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
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
                    <div className="rounded-b-xl border border-t-0 border-gray-200 bg-white px-6 pb-6">
                      <BlogCommentSection postId={post.id} currentUser={currentUser} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900">Turn Insights Into Opportunities</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Use the latest industry signals to find jobs faster, connect with collaborators, and build momentum for your next production.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/jobs"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Find Open Roles
            </Link>
            <Link
              to="/crew-public"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
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
