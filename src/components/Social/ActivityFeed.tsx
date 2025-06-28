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

const ITEMS_PER_PAGE = 10;
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
      // Filter out users that are already loaded or being loaded
      const uniqueUserIds = userIds.filter(id => !userProfiles.has(id));
      
      if (uniqueUserIds.length === 0) {
        return; // No new profiles to load
      }

      console.log(`[ActivityFeed] Loading ${uniqueUserIds.length} user profiles`);
      
      await performanceMonitor.measureAsync('loadUserProfiles', async () => {
        const profiles = await UserUtils.getMultipleUserProfiles(uniqueUserIds);
        setUserProfiles(prev => new Map([...prev, ...profiles]));
      });
    } catch (error) {
      console.error('Error loading user profiles:', error);
    }
  }, [userProfiles]);

  // Debounced version of loadUserProfiles with longer delay for better batching
  const debouncedLoadUserProfiles = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      let pendingUserIds: Set<string> = new Set();
      
      return (userIds: string[]) => {
        // Add new user IDs to pending set
        userIds.forEach(id => pendingUserIds.add(id));
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const idsToLoad = Array.from(pendingUserIds);
          pendingUserIds.clear();
          if (idsToLoad.length > 0) {
            loadUserProfiles(idsToLoad);
          }
        }, 500); // Increased delay for better batching
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

  // Optimized user profile loading with better batching
  useEffect(() => {
    if (!activities.length) return;
    
    // Extract unique user IDs that we don't have profiles for
    const userIdsToLoad = activities
      .map(activity => activity.userId)
      .filter(userId => userId && !userProfiles.has(userId))
      .filter((userId, index, array) => array.indexOf(userId) === index) // Remove duplicates
      .slice(0, 10); // Limit to 10 at a time to avoid overwhelming the system
    
    if (userIdsToLoad.length > 0) {
      // Only load if we have a reasonable number of profiles to load
      // or if we have many activities but few profiles
      const shouldLoad = userIdsToLoad.length >= 3 || 
                        (activities.length > 15 && userProfiles.size < 5);
      
      if (shouldLoad) {
        console.log('[ActivityFeed] Loading profiles for', userIdsToLoad.length, 'users');
        debouncedLoadUserProfiles(userIdsToLoad);
      }
    }
  }, [activities, userProfiles, debouncedLoadUserProfiles]);

  // Memoized filtered activities with pagination for better performance
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
    
    // Limit the number of activities to render for better performance
    // We'll load more as needed through pagination
    const limitedActivities = filtered.slice(0, 50);
    
    performanceMonitor.end('filterActivities');
    return limitedActivities;
  }, [activities, debouncedSearchQuery, filterType]);

  // Load initial activities with better performance
  useEffect(() => {
    const loadInitialActivities = async () => {
      if (!currentUserId) return;
      
      // Don't reload if we already have activities and they're recent (within 3 minutes)
      if (activities.length > 0 && !loading) {
        const lastActivityTime = activities[0]?.createdAt;
        if (lastActivityTime && Date.now() - lastActivityTime.getTime() < 3 * 60 * 1000) {
          console.log('[ActivityFeed] Using existing activities (recent, within 3 minutes)');
          return;
        }
      }
      
      setLoading(true);
      setError(null);

      try {
        console.log('[ActivityFeed] Starting to load activities...');
        // Use the improved async performance monitoring
        const newActivities = await performanceMonitor.measureAsync('loadActivities', async () => {
          console.log('[ActivityFeed] Executing activity feed query...');
          return await SocialService.getActivityFeed(currentUserId, ITEMS_PER_PAGE);
        });
        
        console.log('[ActivityFeed] Successfully loaded', newActivities.length, 'activities');
        setActivities(newActivities);
        setLastDoc(newActivities[newActivities.length - 1] || null);
        setHasMore(newActivities.length === ITEMS_PER_PAGE);
      } catch (err) {
        console.error('[ActivityFeed] Error loading activities:', err);
        setError('Failed to load activities. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialActivities();
  }, [currentUserId]); // Removed activities and loading from dependencies to prevent loops

  // Optimized load more function with better error handling
  const loadMoreActivities = useCallback(async () => {
    if (loading || !hasMore || !lastDoc || !currentUserId) return;
    
    setLoading(true);

    try {
      const newActivities = await performanceMonitor.measureAsync('loadMoreActivities', async () => {
        return await SocialService.getActivityFeed(currentUserId, ITEMS_PER_PAGE);
      });
      
      // Deduplicate activities to prevent duplicates
      const existingIds = new Set(activities.map(a => a.id));
      const uniqueNewActivities = newActivities.filter((activity: ActivityFeedItem) => !existingIds.has(activity.id));
      
      if (uniqueNewActivities.length > 0) {
        setActivities(prev => [...prev, ...uniqueNewActivities]);
        setLastDoc(uniqueNewActivities[uniqueNewActivities.length - 1] || lastDoc);
        setHasMore(uniqueNewActivities.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more activities:', err);
      setError('Failed to load more activities. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, lastDoc, loading, hasMore, activities]);

  // Auto-load more when intersection observer triggers (with debouncing)
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      const timeoutId = setTimeout(() => {
        loadMoreActivities();
      }, 100); // Small delay to prevent rapid successive calls
      
      return () => clearTimeout(timeoutId);
    }
  }, [isIntersecting, hasMore, loading, loadMoreActivities]);

  const handleLike = useCallback(async (activityId: string) => {
    try {
      await performanceMonitor.measureAsync('handleLike', async () => {
        await SocialService.likeActivity(activityId, currentUserId, currentUserName);
      });
      
      // Optimistically update the UI
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, likes: activity.likes + 1 }
          : activity
      ));
    } catch (error) {
      console.error('Error liking activity:', error);
    }
  }, [currentUserId, currentUserName]);

  const handleComment = useCallback(async (activityId: string, comment: string) => {
    if (!comment.trim()) return;
    
    try {
      await performanceMonitor.measureAsync('handleComment', async () => {
        await SocialService.addComment(activityId, currentUserId, currentUserName, currentUserAvatar, comment);
      });
      
      // Optimistically update the UI
      setActivities(prev => prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, comments: activity.comments + 1 }
          : activity
      ));
    } catch (error) {
      console.error('Error commenting on activity:', error);
    }
  }, [currentUserId, currentUserName, currentUserAvatar]);

  const handleShare = useCallback(async (activityId: string) => {
    try {
      await performanceMonitor.measureAsync('handleShare', async () => {
        // Share functionality not implemented yet - just log for now
        console.log('Sharing activity:', activityId);
      });
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

  // Loading skeleton component for better perceived performance
  const ActivitySkeleton = useMemo(() => () => (
    <div className="activity-item skeleton">
      <div className="activity-header">
        <div className="user-avatar skeleton-avatar"></div>
        <div className="activity-info">
          <div className="user-name skeleton-text"></div>
          <div className="activity-time skeleton-text-small"></div>
        </div>
        <div className="activity-type-badge skeleton-badge"></div>
      </div>
      <div className="activity-content">
        <div className="activity-title skeleton-text"></div>
        <div className="activity-description skeleton-text"></div>
        <div className="activity-description skeleton-text-short"></div>
      </div>
      <div className="activity-actions">
        <div className="action-button skeleton-button"></div>
        <div className="action-button skeleton-button"></div>
        <div className="action-button skeleton-button"></div>
      </div>
    </div>
  ), []);

  // Render loading skeletons
  const renderLoadingSkeletons = () => {
    return Array.from({ length: 3 }, (_, index) => (
      <ActivitySkeleton key={`skeleton-${index}`} />
    ));
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
        {loading && activities.length === 0 ? (
          // Show skeletons during initial load
          renderLoadingSkeletons()
        ) : filteredActivities.length === 0 && !loading ? (
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