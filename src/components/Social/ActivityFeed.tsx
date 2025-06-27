import React, { useState, useEffect } from 'react';
import { SocialService } from '../../utilities/socialService';
import { ActivityFeedItem, SocialComment, SocialLike } from '../../types/Social';

interface ActivityFeedProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  currentUserId, 
  currentUserName, 
  currentUserAvatar,
  className = '' 
}) => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: SocialComment[] }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!currentUserId) return;

    let unsubscribeActivities: (() => void) | undefined;
    let unsubscribeComments: { [key: string]: (() => void) } = {};

    const setupListeners = async () => {
      try {
        console.log('[ActivityFeed] Setting up activity feed listener for user:', currentUserId);
        
        unsubscribeActivities = SocialService.subscribeToActivityFeed(currentUserId, (items) => {
          console.log('[ActivityFeed] Activities updated:', items.length);
          setActivities(items);
          setLoading(false);
          
          // Check user likes for each activity
          items.forEach(async (item) => {
            const userLike = await SocialService.getLike(item.id, currentUserId);
            setUserLikes(prev => ({
              ...prev,
              [item.id]: !!userLike
            }));
          });
        });
      } catch (error) {
        console.error('[ActivityFeed] Error setting up listeners:', error);
        setLoading(false);
      }
    };

    setupListeners();

    return () => {
      try {
        if (unsubscribeActivities) {
          unsubscribeActivities();
        }
        Object.values(unsubscribeComments).forEach(unsubscribe => {
          if (unsubscribe) unsubscribe();
        });
      } catch (error) {
        console.error('[ActivityFeed] Error cleaning up listeners:', error);
      }
    };
  }, [currentUserId]);

  const handleLike = async (activityId: string) => {
    try {
      if (userLikes[activityId]) {
        await SocialService.unlikeActivity(activityId, currentUserId);
        setUserLikes(prev => ({ ...prev, [activityId]: false }));
      } else {
        await SocialService.likeActivity(activityId, currentUserId, currentUserName);
        setUserLikes(prev => ({ ...prev, [activityId]: true }));
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = async (activityId: string) => {
    const text = commentText[activityId]?.trim();
    if (!text) return;

    try {
      await SocialService.addComment(activityId, currentUserId, currentUserName, currentUserAvatar, text);
      setCommentText(prev => ({ ...prev, [activityId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleComments = async (activityId: string) => {
    const newShowComments = !showComments[activityId];
    setShowComments(prev => ({ ...prev, [activityId]: newShowComments }));

    if (newShowComments && !comments[activityId]) {
      try {
        const activityComments = await SocialService.getCommentsForActivity(activityId);
        setComments(prev => ({ ...prev, [activityId]: activityComments }));
        
        // Set up real-time listener for comments
        const unsubscribe = SocialService.subscribeToActivityComments(activityId, (newComments) => {
          setComments(prev => ({ ...prev, [activityId]: newComments }));
        });
        
        // Store unsubscribe function (in a real app, you'd manage this better)
        setTimeout(() => {
          unsubscribe();
        }, 30000); // Auto-unsubscribe after 30 seconds
      } catch (error) {
        console.error('Error loading comments:', error);
      }
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_created':
        return '🎬';
      case 'project_joined':
        return '👥';
      case 'profile_updated':
        return '📝';
      case 'follow_made':
        return '👤';
      case 'achievement_earned':
        return '🏆';
      default:
        return '📢';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
          <div className="text-4xl mb-4">📢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
          <p className="text-gray-600">When you and your connections start sharing projects and updates, they'll appear here.</p>
        </div>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Activity Header */}
            <div className="flex items-start space-x-3 mb-4">
              <div className="text-2xl flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(activity.createdAt)}
                </p>
              </div>
            </div>

            {/* Activity Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(activity.id)}
                  className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
                    userLikes[activity.id] 
                      ? 'text-red-600 hover:text-red-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-lg">{userLikes[activity.id] ? '❤️' : '🤍'}</span>
                  <span>{activity.likes}</span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => toggleComments(activity.id)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <span>💬</span>
                  <span>{activity.comments}</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {showComments[activity.id] && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                {/* Add Comment */}
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={commentText[activity.id] || ''}
                    onChange={(e) => setCommentText(prev => ({ ...prev, [activity.id]: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment(activity.id)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleComment(activity.id)}
                    disabled={!commentText[activity.id]?.trim()}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Post
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  {comments[activity.id]?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {comment.userName}
                          </p>
                          <p className="text-sm text-gray-700">
                            {comment.content}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityFeed; 