import React, { useEffect, useState } from 'react';
import BlogPostCard from '../components/Blog/BlogPostCard';
import BlogCommentSection from '../components/Blog/BlogCommentSection';
import { useAuth } from '../contexts/AuthContext';
import { fetchBlogPosts } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { setPageSeo } from '../utilities/seo';

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

  useEffect(() => {
    setPageSeo({
      title: 'Film Industry Blog | News and Insights',
      description: 'Curated film industry news and insights with links to original sources. Sign in to join the conversation.',
      canonicalUrl: 'https://myfilmjobs.com/blog',
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Film Industry News and Insights</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600">
            Curated updates from across the film industry, with ongoing archived posts and discussion.
          </p>
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
    </div>
  );
};

export default BlogPage;
