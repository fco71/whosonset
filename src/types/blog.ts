export type BlogCategory = 'technology' | 'business' | 'industry' | 'careers';

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
  contentPolicy: 'metadata_only';
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
