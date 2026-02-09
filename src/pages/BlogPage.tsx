import React, { useEffect, useMemo, useState } from 'react';
import BlogPostCard from '../components/Blog/BlogPostCard';
import BlogCommentSection from '../components/Blog/BlogCommentSection';
import { useAuth } from '../contexts/AuthContext';
import { fetchBlogPosts } from '../services/blogService';
import { BlogCategory, BlogPost } from '../types/blog';
import { setPageSeo } from '../utilities/seo';

const BLOG_CATEGORIES: Array<'all' | BlogCategory> = ['all', 'industry', 'technology', 'business', 'careers'];

const BlogPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | BlogCategory>('all');
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

  useEffect(() => {
    setPageSeo({
      title: 'Film Industry Blog | Daily Curated News',
      description: 'Daily curated film industry updates with links to original sources. Sign in to comment and join the conversation.',
      canonicalUrl: 'https://myfilmjobs.com/blog',
    });
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return posts;
    }
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Public Blog</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Film Industry Daily Briefing</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600">
            We publish a small curated set of daily stories from public RSS feeds. We only display source metadata,
            our own short summary, and a direct link back to the original publisher.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {BLOG_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All' : category[0].toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-gray-600">Loading daily posts...</p>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
            No posts available for this category yet.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
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
    </div>
  );
};

export default BlogPage;
