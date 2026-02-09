import {
  db,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from '../firebase';
import { BlogComment, BlogPost } from '../types/blog';

const BLOG_POSTS_COLLECTION = 'blogPosts';
const MAX_POST_RESULTS = 60;
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

export async function fetchBlogPosts(maxPosts = 30): Promise<BlogPost[]> {
  const queryLimit = Math.min(Math.max(maxPosts * 2, 20), MAX_POST_RESULTS);
  const postsQuery = query(
    collection(db, BLOG_POSTS_COLLECTION),
    orderBy('publishedAt', 'desc'),
    limit(queryLimit)
  );

  const snapshot = await getDocs(postsQuery);

  const posts = snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data();

      return {
        id: docSnap.id,
        title: data.title || 'Untitled update',
        summary: data.summary || '',
        sourceName: data.sourceName || 'Source',
        sourceUrl: data.sourceUrl || '',
        sourceFeedUrl: data.sourceFeedUrl || '',
        originalUrl: data.originalUrl || '',
        imageUrl: data.imageUrl || '',
        category: data.category || 'industry',
        tags: Array.isArray(data.tags) ? data.tags : [],
        publishedAt: toDate(data.publishedAt) || new Date(),
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        curatedDate: data.curatedDate || '',
        commentsCount: typeof data.commentsCount === 'number' ? data.commentsCount : 0,
        isPublic: data.isPublic !== false,
        contentPolicy: data.contentPolicy === 'metadata_only' ? 'metadata_only' : 'metadata_only',
      } as BlogPost;
    })
    .filter((post) => post.isPublic)
    .slice(0, maxPosts);

  return posts;
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
