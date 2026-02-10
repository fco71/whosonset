import React from 'react';
import { BlogPost } from '../../types/blog';
import { sanitizeBlogSummary } from '../../utilities/blogSeo';

interface BlogPostCardProps {
  post: BlogPost;
  expanded: boolean;
  onToggleComments: () => void;
}

const categoryStyles: Record<string, string> = {
  technology: 'bg-indigo-100 text-indigo-800',
  business: 'bg-emerald-100 text-emerald-800',
  industry: 'bg-slate-100 text-slate-800',
  careers: 'bg-amber-100 text-amber-800',
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, expanded, onToggleComments }) => {
  const summary = sanitizeBlogSummary(post.summary || '');
  const commentsRegionId = `blog-comments-${post.id}`;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryStyles[post.category] || categoryStyles.industry}`}>
          {post.category}
        </span>
        <span className="text-xs text-gray-500">{post.publishedAt.toLocaleDateString()}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        {post.imageUrl ? (
          <a
            href={post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block shrink-0 overflow-hidden rounded-lg border border-gray-200"
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-44 w-full object-cover sm:h-24 sm:w-40"
              loading="lazy"
              decoding="async"
            />
          </a>
        ) : null}

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            <a
              href={post.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 hover:underline"
              aria-label={`Open source article: ${post.title}`}
            >
              {post.title}
            </a>
          </h3>
          <p className="mt-3 text-sm leading-6 text-gray-700">{summary}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-600">
        <span>Source:</span>
        <a
          href={post.sourceUrl || post.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-700 hover:text-blue-800 hover:underline"
        >
          {post.sourceName}
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={post.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-black sm:w-auto"
        >
          Read Article
        </a>
        <button
          type="button"
          onClick={onToggleComments}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          aria-expanded={expanded}
          aria-controls={commentsRegionId}
        >
          {expanded ? 'Hide Comments' : `Comments (${post.commentsCount || 0})`}
        </button>
      </div>
    </article>
  );
};

export default BlogPostCard;
