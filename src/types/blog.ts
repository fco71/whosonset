export type BlogCategory = 'technology' | 'business' | 'industry' | 'careers';

// 'curated' = auto-collected headline that links out to another publisher (noindex).
// 'original' = our own article, published from content/blog/*.md (indexable).
export type BlogPostType = 'curated' | 'original';

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  sourceFeedUrl?: string;
  originalUrl: string;
  imageUrl?: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  curatedDate: string;
  commentsCount: number;
  isPublic: boolean;
  postType: BlogPostType;
  contentPolicy: 'metadata_only' | 'original';
  // Original posts only.
  bodyHtml?: string;
  lang?: 'es' | 'en';
  authorName?: string;
  // Slug of the same article in the other language (es ↔ en), if any.
  translationSlug?: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
