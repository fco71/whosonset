import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SocialService } from '../../utilities/socialService';
import { ActivityFeedItem, SocialComment, SocialLike } from '../../types/Social';
import { useDebounce, useIntersectionObserver, performanceMonitor } from '../../utilities/performanceUtils';
import { UserUtils, UserProfile } from '../../utilities/userUtils';
import './ActivityFeed.scss';

interface ActivityFeedProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  className?: string;
}

const ITEMS_PER_PAGE = 20;
const VIRTUAL_ITEM_HEIGHT = 120; // Estimated height of each activity item

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  currentUserId, 
  currentUserName, 
  currentUserAvatar,
  className = '' 
}) => {
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: SocialComment[] }>({});
  const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});
  
  // User profiles cache
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());

  // Performance optimizations
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { elementRef: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Optimized user profile loading with batching and debouncing
  const loadUserProfiles = useCallback(async (userIds: string[]) => {
    try {
      performanceMonitor.start('loadUserProfiles');
      const profiles = await UserUtils.getMultipleUserProfiles(userIds);
      setUserProfiles(prev => new Map([...prev, ...profiles]));
      performanceMonitor.end('loadUserProfiles');
    } catch (error) {
      console.error('Error loading user profiles:', error);
    }
  }, []);

  // Debounced version of loadUserProfiles
  const debouncedLoadUserProfiles = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (userIds: string[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          loadUserProfiles(userIds);
        }, 300);
      };
    })(),
    [loadUserProfiles]
  );

  const getUserDisplayName = useCallback((userId: string): string => {
    const profile = userProfiles.get(userId);
    return profile?.displayName || `User ${userId.slice(-4)}`;
  }, [userProfiles]);

  const getUserAvatar = useCallback((userId: string): string | undefined => {
    const profile = userProfiles.get(userId);
    return profile?.avatarUrl;
  }, [userProfiles]);

  // Load user profiles when activities change, but with better batching
  useEffect(() => {
    const userIds = new Set<string>();
    
    // Collect all unique user IDs from activities
    activities.forEach(activity => {
      userIds.add(activity.userId);
    });
    
    const userIdsToLoad = Array.from(userIds).filter(id => !userProfiles.has(id));
    
    if (userIdsToLoad.length > 0) {
      debouncedLoadUserProfiles(userIdsToLoad);
    }
  }, [activities, userProfiles, debouncedLoadUserProfiles]);

  // Memoized filtered activities
  const filteredActivities = useMemo(() => {
    performanceMonitor.start('filterActivities');
    
    let filtered = activities;
    
    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query)
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type.includes(filterType));
    }
    
    performanceMonitor.end('filterActivities');
    return filtered;
  }, [activities, debouncedSearchQuery, filterType]);

  // Load initial activities with better performance
  useEffect(() => {
    const loadInitialActivities = async () => {
      if (!currentUserId) return;
      
      performanceMonitor.start('loadActivities');
      setLoading(true);
      setError(null);

      try {
        const newActivities = await SocialService.getActivityFeed(currentUserId, ITEMS_PER_PAGE);
        setActivities(newActivities);
        setLastDoc(newActivities[newActivities.length - 1] || null);
        setHasMore(newActivities.length === ITEMS_PER_PAGE);
        performanceMonitor.end('loadActivities');
      } catch (err) {
        console.error('Error loading activities:', err);
        setError('Failed to load activities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialActivities();
  }, [currentUserId]);

  // Optimized load more function
  const loadMoreActivities = useCallback(async () => {
    if (loading || !hasMore || !lastDoc) return;
    
    performanceMonitor.start('loadMoreActivities');
    setLoading(true);

    try {
      const newActivities = await SocialService.getActivityFeed(currentUserId, ITEMS_PER_PAGE);
      setActivities(prev => [...prev, ...newActivities]);
      setLastDoc(newActivities[newActivities.length - 1] || null);
      setHasMore(newActivities.length === ITEMS_PER_PAGE);
      performanceMonitor.end('loadMoreActivities');
    } catch (err) {
      console.error('Error loading more activities:', err);
      setError('Failed to load more activities. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, lastDoc, loading, hasMore]);

  // Auto-load more when intersection observer triggers
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMoreActivities();
    }
  }, [isIntersecting, hasMore, loading, loadMoreActivities]);

  const handleLike = useCallback(async (activityId: string) => {
    try {
      performanceMonitor.start('handleLike');
      await SocialService.likeActivity(activityId, currentUserId, currentUserName);
      
      // Optimistically update the UI
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, likes: activity.likes + 1 }
          : activity
      ));
      
      performanceMonitor.end('handleLike');
    } catch (error) {
      console.error('Error liking activity:', error);
    }
  }, [currentUserId, currentUserName]);

  const handleComment = useCallback(async (activityId: string, comment: string) => {
    if (!comment.trim()) return;
    
    try {
      performanceMonitor.start('handleComment');
      await SocialService.addComment(activityId, currentUserId, currentUserName, currentUserAvatar, comment);
      
      // Optimistically update the UI
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, comments: activity.comments + 1 }
          : activity
      ));
      
      performanceMonitor.end('handleComment');
    } catch (error) {
      console.error('Error commenting on activity:', error);
    }
  }, [currentUserId, currentUserName, currentUserAvatar]);

  const handleShare = useCallback(async (activityId: string) => {
    try {
      performanceMonitor.start('handleShare');
      // Share functionality not implemented yet - just log for now
      console.log('Sharing activity:', activityId);
      performanceMonitor.end('handleShare');
    } catch (error) {
      console.error('Error sharing activity:', error);
    }
  }, [currentUserId]);

  // Memoized activity item component for better performance
  const ActivityItem = useMemo(() => React.memo(({ activity }: { activity: ActivityFeedItem }) => {
    const displayName = getUserDisplayName(activity.userId);
    const avatarUrl = getUserAvatar(activity.userId);
    
    return (
      <div className="activity-item" key={activity.id}>
        <div className="activity-header">
          <div className="user-avatar">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/bust-avatar.svg';
                }}
              />
            ) : (
              <img 
                src="/bust-avatar.svg" 
                alt={displayName}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/bust-avatar.svg';
                }}
              />
            )}
          </div>
          <div className="activity-info">
            <div className="user-name">{displayName}</div>
            <div className="activity-time">
              {new Date(activity.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="activity-type-badge">
            {activity.type.replace('_', ' ')}
          </div>
        </div>
        
        <div className="activity-content">
          <h3 className="activity-title">{activity.title}</h3>
          <p className="activity-description">{activity.description}</p>
          
          {activity.imageUrl && (
            <div className="activity-image">
              <img 
                src={activity.imageUrl} 
                alt="Activity"
                loading="lazy"
              />
            </div>
          )}
        </div>
        
        <div className="activity-actions">
          <button
            onClick={() => handleLike(activity.id)}
            className="action-button"
          >
            <span className="icon">❤️</span>
            <span className="count">{activity.likes}</span>
          </button>
          
          <button className="action-button">
            <span className="icon">💬</span>
            <span className="count">{activity.comments}</span>
          </button>
          
          <button
            onClick={() => handleShare(activity.id)}
            className="action-button"
          >
            <span className="icon">📤</span>
            <span>Share</span>
          </button>
        </div>
      </div>
    );
  }), [getUserDisplayName, getUserAvatar, handleLike, handleShare]);

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

  if (error) {
    return (
      <div className="activity-feed-error">
        <div className="error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={() => loadMoreActivities()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`activity-feed ${className}`}>
      {/* Search and Filter Controls */}
      <div className="activity-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Activities</option>
            <option value="likes">Likes</option>
            <option value="comments">Comments</option>
            <option value="follows">Follows</option>
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="activities-list">
        {filteredActivities.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No activities found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {filteredActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
            
            {/* Load More Trigger */}
            {hasMore && (
              <div ref={loadMoreRef as React.RefObject<HTMLDivElement>} className="load-more-trigger">
                {loading && (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    <span>Loading more activities...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Performance Stats (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="performance-stats">
          <small>
            Loaded {activities.length} activities | 
            Filtered: {filteredActivities.length} | 
            Memory: {Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0)}MB
          </small>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed; 