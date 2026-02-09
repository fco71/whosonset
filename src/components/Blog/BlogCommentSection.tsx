import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogComment } from '../../types/blog';
import { addBlogComment, fetchBlogComments } from '../../services/blogService';

interface BlogCommentSectionProps {
  postId: string;
  currentUser: any;
}

const BlogCommentSection: React.FC<BlogCommentSectionProps> = ({ postId, currentUser }) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const loadComments = async () => {
    try {
      setLoading(true);
      const items = await fetchBlogComments(postId);
      setComments(items);
    } catch (loadError) {
      console.error('[BlogCommentSection] Failed to load comments:', loadError);
      setError('Could not load comments right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Please sign in to post a comment.');
      return;
    }

    try {
      setSubmitting(true);
      await addBlogComment({
        postId,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Member',
        userPhotoURL: currentUser.photoURL || '',
        content: newComment,
      });
      setNewComment('');
      await loadComments();
    } catch (submitError: any) {
      console.error('[BlogCommentSection] Failed to post comment:', submitError);
      setError(submitError?.message || 'Could not post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-6 border-t border-gray-200 pt-6">
      <h4 className="text-lg font-semibold text-gray-900">Comments</h4>

      {currentUser ? (
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Share your thoughts about this story..."
            rows={3}
            maxLength={1000}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{newComment.length}/1000</span>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <Link to="/login" className="font-medium underline">
            Sign in
          </Link>{' '}
          to join the discussion.
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No comments yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{comment.userDisplayName}</p>
                <p className="text-xs text-gray-500">
                  {comment.createdAt.toLocaleString()}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BlogCommentSection;
