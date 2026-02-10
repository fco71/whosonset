import { BlogPost } from '../types/blog';

const BLOG_BASE_URL = 'https://myfilmjobs.com';
const POLICY_SUFFIX_PATTERN = /\s*links to the original publisher for full context\.?$/i;
const MAX_META_DESCRIPTION_LENGTH = 160;

function trimWithEllipsis(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export function sanitizeBlogSummary(summary: string): string {
  return (summary || '')
    .replace(POLICY_SUFFIX_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getBlogPostPath(postId: string): string {
  return `/blog/${encodeURIComponent(postId)}`;
}

export function getBlogPostCanonicalUrl(postId: string): string {
  return `${BLOG_BASE_URL}${getBlogPostPath(postId)}`;
}

export function buildBlogMetaDescription(input: Pick<BlogPost, 'title' | 'summary'>): string {
  const cleanedSummary = sanitizeBlogSummary(input.summary || '');
  const fallback = `Read "${input.title}" and discover related film jobs and collaboration opportunities on My Film Jobs.`;
  const description = cleanedSummary || fallback;
  return trimWithEllipsis(description, MAX_META_DESCRIPTION_LENGTH);
}

function toIsoDate(value?: Date): string | undefined {
  if (!value) {
    return undefined;
  }
  const time = value.getTime();
  if (Number.isNaN(time)) {
    return undefined;
  }
  return new Date(time).toISOString();
}

export function buildBlogListStructuredData(
  posts: BlogPost[],
  options?: {
    pageUrl?: string;
    pageName?: string;
    pageDescription?: string;
  }
): Record<string, unknown> {
  const listItems = posts.slice(0, 24).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: getBlogPostCanonicalUrl(post.id),
    name: post.title,
    datePublished: toIsoDate(post.publishedAt),
  }));

  const pageUrl = options?.pageUrl || `${BLOG_BASE_URL}/blog`;
  const pageName = options?.pageName || 'Film Industry News and Insights';
  const pageDescription = options?.pageDescription || 'Film industry stories with practical takeaways for jobs and collaboration.';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageName,
    description: pageDescription,
    url: pageUrl,
    publisher: {
      '@type': 'Organization',
      name: 'My Film Jobs',
      url: BLOG_BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BLOG_BASE_URL}/my-icon.png`,
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: listItems,
    },
  };
}

export function buildBlogPostStructuredData(post: BlogPost): Record<string, unknown> {
  const publishedAt = toIsoDate(post.publishedAt);
  const modifiedAt = toIsoDate(post.updatedAt || post.createdAt || post.publishedAt);
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: buildBlogMetaDescription(post),
    datePublished: publishedAt,
    dateModified: modifiedAt,
    articleSection: post.category,
    isAccessibleForFree: true,
    mainEntityOfPage: getBlogPostCanonicalUrl(post.id),
    url: getBlogPostCanonicalUrl(post.id),
    publisher: {
      '@type': 'Organization',
      name: 'My Film Jobs',
      url: BLOG_BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BLOG_BASE_URL}/my-icon.png`,
      },
    },
    author: {
      '@type': 'Organization',
      name: post.sourceName || 'My Film Jobs',
      url: post.sourceUrl || BLOG_BASE_URL,
    },
    isBasedOn: post.originalUrl,
    potentialAction: {
      '@type': 'ReadAction',
      target: post.originalUrl,
    },
    keywords: post.tags.join(', '),
  };

  if (post.imageUrl) {
    schema.image = [post.imageUrl];
  }

  return schema;
}

export function buildBlogPostBreadcrumbStructuredData(
  post: Pick<BlogPost, 'id' | 'title'>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BLOG_BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BLOG_BASE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: getBlogPostCanonicalUrl(post.id),
      },
    ],
  };
}
