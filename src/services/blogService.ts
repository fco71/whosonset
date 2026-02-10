import {
  db,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  addDoc,
  serverTimestamp,
} from '../firebase';
import { BlogComment, BlogPost } from '../types/blog';

const BLOG_POSTS_COLLECTION = 'blogPosts';
const MAX_POST_RESULTS = 180;
const MAX_COMMENT_RESULTS = 150;
const MAX_COMMENT_LENGTH = 1000;

function toDate(value: any): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed;
}

function mapBlogPostData(postId: string, data: Record<string, any>): BlogPost {
  return {
    id: postId,
    title: data.title || 'Untitled update',
    summary: data.summary || '',
    sourceName: data.sourceName || 'Source',
    sourceUrl: data.sourceUrl || '',
    sourceFeedUrl: data.sourceFeedUrl || '',
    originalUrl: data.originalUrl || '',
    imageUrl: data.imageUrl || '',
    category: data.category || 'industry',
    tags: Array.isArray(data.tags) ? data.tags : [],
    publishedAt: toDate(data.publishedAt) || new Date(0),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    curatedDate: data.curatedDate || '',
    commentsCount: typeof data.commentsCount === 'number' ? data.commentsCount : 0,
    isPublic: data.isPublic === true,
    contentPolicy: data.contentPolicy === 'metadata_only' ? 'metadata_only' : 'metadata_only',
  } as BlogPost;
}

function mapBlogPostsFromSnapshot(snapshot: any, maxPosts: number): BlogPost[] {
  return snapshot.docs
    .map((docSnap: any) => {
      const data = docSnap.data() as Record<string, any>;
      return mapBlogPostData(docSnap.id, data);
    })
    .filter((post: BlogPost) => post.isPublic)
    .sort((a: BlogPost, b: BlogPost) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, maxPosts);
}

export async function fetchBlogPosts(maxPosts = 30): Promise<BlogPost[]> {
  const queryLimit = Math.min(Math.max(maxPosts * 2, 20), MAX_POST_RESULTS);
  const postsRef = collection(db, BLOG_POSTS_COLLECTION);

  try {
    const postsQuery = query(
      postsRef,
      where('isPublic', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(queryLimit)
    );
    const snapshot = await getDocs(postsQuery);
    return mapBlogPostsFromSnapshot(snapshot, maxPosts);
  } catch (error: any) {
    const code = String(error?.code || '');
    const message = String(error?.message || '');
    const missingIndex = code === 'failed-precondition' || /index/i.test(message);

    if (!missingIndex) {
      throw error;
    }

    // Fallback keeps blog functional while composite index is being created.
    const fallbackQuery = query(
      postsRef,
      where('isPublic', '==', true),
      limit(MAX_POST_RESULTS)
    );
    const fallbackSnapshot = await getDocs(fallbackQuery);
    return mapBlogPostsFromSnapshot(fallbackSnapshot, maxPosts);
  }
}

export async function fetchBlogPostsPage(
  pageNumber = 1,
  pageSize = 18
): Promise<{ posts: BlogPost[]; hasNextPage: boolean }> {
  const safePageNumber = Math.max(1, Math.floor(pageNumber));
  const safePageSize = Math.min(Math.max(Math.floor(pageSize), 1), 30);
  const startIndex = (safePageNumber - 1) * safePageSize;
  const endIndex = startIndex + safePageSize;
  const queryLimit = Math.min(endIndex + 1, MAX_POST_RESULTS);
  const postsRef = collection(db, BLOG_POSTS_COLLECTION);

  const buildResult = (items: BlogPost[]) => ({
    posts: items.slice(startIndex, endIndex),
    hasNextPage: items.length > endIndex,
  });

  try {
    const postsQuery = query(
      postsRef,
      where('isPublic', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(queryLimit)
    );
    const snapshot = await getDocs(postsQuery);
    return buildResult(mapBlogPostsFromSnapshot(snapshot, queryLimit));
  } catch (error: any) {
    const code = String(error?.code || '');
    const message = String(error?.message || '');
    const missingIndex = code === 'failed-precondition' || /index/i.test(message);

    if (!missingIndex) {
      throw error;
    }

    const fallbackQuery = query(
      postsRef,
      where('isPublic', '==', true),
      limit(queryLimit)
    );
    const fallbackSnapshot = await getDocs(fallbackQuery);
    return buildResult(mapBlogPostsFromSnapshot(fallbackSnapshot, queryLimit));
  }
}

export async function fetchBlogPostById(postId: string): Promise<BlogPost | null> {
  if (!postId?.trim()) {
    return null;
  }

  const postSnapshot = await getDoc(doc(db, BLOG_POSTS_COLLECTION, postId));
  if (!postSnapshot.exists()) {
    return null;
  }

  const post = mapBlogPostData(postSnapshot.id, postSnapshot.data() as Record<string, any>);
  if (!post.isPublic) {
    return null;
  }

  return post;
}

export async function fetchBlogComments(postId: string): Promise<BlogComment[]> {
  const commentsQuery = query(
    collection(db, BLOG_POSTS_COLLECTION, postId, 'comments'),
    orderBy('createdAt', 'desc'),
    limit(MAX_COMMENT_RESULTS)
  );

  const snapshot = await getDocs(commentsQuery);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      postId,
      userId: data.userId || '',
      userDisplayName: data.userDisplayName || 'Member',
      userPhotoURL: data.userPhotoURL || '',
      content: data.content || '',
      createdAt: toDate(data.createdAt) || new Date(),
      updatedAt: toDate(data.updatedAt),
    } as BlogComment;
  });
}

export async function addBlogComment(input: {
  postId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  content: string;
}): Promise<void> {
  const normalizedContent = input.content.trim();
  if (!normalizedContent) {
    throw new Error('Comment cannot be empty.');
  }
  if (normalizedContent.length > MAX_COMMENT_LENGTH) {
    throw new Error(`Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.`);
  }

  await addDoc(collection(db, BLOG_POSTS_COLLECTION, input.postId, 'comments'), {
    userId: input.userId,
    userDisplayName: input.userDisplayName || 'Member',
    userPhotoURL: input.userPhotoURL || '',
    content: normalizedContent,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
