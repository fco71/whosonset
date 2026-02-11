import React, { useState } from 'react';
import { BlogPost } from '../../types/blog';
import { sanitizeBlogSummary } from '../../utilities/blogSeo';
import { trackConversion } from '../../utilities/conversionTracking';

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
  const [imageFailed, setImageFailed] = useState(false);
  const hasPreviewImage = Boolean(post.imageUrl) && !imageFailed;

  const trackExternalClick = (placement: string) => {
    trackConversion('blog_external_open', {
      postId: post.id,
      postTitle: post.title,
      sourceName: post.sourceName,
      placement,
    });
  };

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryStyles[post.category] || categoryStyles.industry}`}>
          {post.category}
        </span>
        <span className="text-xs text-gray-500">{post.publishedAt.toLocaleDateString()}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        {hasPreviewImage ? (
          <a
            href={post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block shrink-0 overflow-hidden rounded-lg border border-gray-200"
            onClick={() => trackExternalClick('image')}
            aria-label={`Open source article image in a new tab: ${post.title}`}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-44 w-full object-cover sm:h-24 sm:w-40"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 100vw, 160px"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
            />
          </a>
        ) : (
          <div className="flex h-44 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-xs font-medium text-gray-500 sm:h-24 sm:w-40">
            {post.sourceName}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            <a
              href={post.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 hover:underline"
              aria-label={`Open source article in a new tab: ${post.title}`}
              onClick={() => trackExternalClick('title')}
            >
              {post.title}
              <span className="sr-only"> (opens in a new tab)</span>
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
          onClick={() => trackExternalClick('source')}
          aria-label={`Open source website in a new tab: ${post.sourceName}`}
        >
          {post.sourceName}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={post.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-black sm:w-auto"
          onClick={() => trackExternalClick('read_button')}
          aria-label={`Read full article in a new tab: ${post.title}`}
        >
          Read Article
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <button
          type="button"
          onClick={onToggleComments}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
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
