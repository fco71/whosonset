import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { FollowRequest, SocialNotification, ActivityFeedItem, Follow } from '../../types/Social';
import { CrewProfile } from '../../types/CrewProfile';
import { SocialService } from '../../utilities/socialService';
import { UserUtils, UserProfile } from '../../utilities/userUtils';
import QuickMessage from './QuickMessage';
import FollowButton from './FollowButton';
import ActivityFeed from './ActivityFeed';
import ChatInterface from '../Chat/ChatInterface';
import { SocialAnalytics } from './SocialAnalytics';
import { AdvancedMessaging } from './AdvancedMessaging';
import NotificationBell from './NotificationBell';
import { performanceMonitor } from '../../utilities/performanceUtils';
import './SocialDashboard.scss';

interface SocialDashboardProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
}

const SocialDashboard: React.FC<SocialDashboardProps> = ({ 
  currentUserId, 
  currentUserName,
  currentUserAvatar 
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'analytics' | 'messaging'>('feed');
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CrewProfile | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User profiles cache
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());

  useEffect(() => {
    let unsubscribeFollowRequests: (() => void) | undefined;
    let unsubscribeNotifications: (() => void) | undefined;
    let unsubscribeFollowers: (() => void) | undefined;
    let unsubscribeFollowing: (() => void) | undefined;

    const setupListeners = async () => {
      try {
        console.log('[SocialDashboard] Setting up listeners for user:', currentUserId);
        
        // Clear any existing listeners first
        if (unsubscribeFollowRequests) unsubscribeFollowRequests();
        if (unsubscribeNotifications) unsubscribeNotifications();
        if (unsubscribeFollowers) unsubscribeFollowers();
        if (unsubscribeFollowing) unsubscribeFollowing();
        
        // Small delay to prevent Firestore assertion errors
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Set up listeners with error handling
        unsubscribeFollowRequests = SocialService.subscribeToFollowRequests(currentUserId, (requests) => {
          console.log('[SocialDashboard] Follow requests updated:', requests.length);
          setFollowRequests(requests);
        });
        
        // Small delay between listeners
        await new Promise(resolve => setTimeout(resolve, 50));
        
        unsubscribeNotifications = SocialService.subscribeToNotifications(currentUserId, (notifications) => {
          console.log('[SocialDashboard] Notifications updated:', notifications.length);
          setNotifications(notifications);
        });
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        unsubscribeFollowers = SocialService.subscribeToFollowers(currentUserId, (followers) => {
          console.log('[SocialDashboard] Followers updated:', followers.length);
          setFollowers(followers);
        });
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        unsubscribeFollowing = SocialService.subscribeToFollowing(currentUserId, (following) => {
          console.log('[SocialDashboard] Following updated:', following.length);
          setFollowing(following);
        });
        
        await loadActivityFeed();
        await loadCrewProfiles();
      } catch (error) {
        console.error('[SocialDashboard] Error setting up listeners:', error);
      }
    };

    if (currentUserId) {
      setupListeners();
    }

    return () => {
      console.log('[SocialDashboard] Cleaning up listeners for user:', currentUserId);
      try {
        if (unsubscribeFollowRequests) {
          unsubscribeFollowRequests();
          console.log('[SocialDashboard] Unsubscribed follow requests');
        }
        if (unsubscribeNotifications) {
          unsubscribeNotifications();
          console.log('[SocialDashboard] Unsubscribed notifications');
        }
        if (unsubscribeFollowers) {
          unsubscribeFollowers();
          console.log('[SocialDashboard] Unsubscribed followers');
        }
        if (unsubscribeFollowing) {
          unsubscribeFollowing();
          console.log('[SocialDashboard] Unsubscribed following');
        }
      } catch (error) {
        console.error('[SocialDashboard] Error cleaning up listeners:', error);
      }
    };
  }, [currentUserId]);

  useEffect(() => {
    // Calculate unread notifications
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadActivityFeed = async () => {
    try {
      console.log('[SocialDashboard] Loading activity feed...');
      // Activity feed is now handled by the ActivityFeed component
      // No need to load it here as the component handles its own data
    } catch (error) {
      console.error('Error loading activity feed:', error);
    }
  };

  const loadCrewProfiles = async () => {
    try {
      const profilesQuery = query(
        collection(db, 'crewProfiles'),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(profilesQuery);
      const profiles = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as CrewProfile[];
      setCrewProfiles(profiles);
    } catch (error) {
      console.error('Error loading crew profiles:', error);
    }
  };

  const sendFollowRequest = async (targetUserId: string, message: string) => {
    try {
      setLoading(true);
      setError(null);
      await SocialService.sendFollowRequest(currentUserId, targetUserId, message);
      setShowRequestModal(false);
      setRequestMessage('');
      setSelectedProfile(null);
    } catch (error) {
      console.error('Error sending follow request:', error);
      setError(error instanceof Error ? error.message : 'Failed to send follow request');
    } finally {
      setLoading(false);
    }
  };

  const respondToFollowRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      setError(null);
      await SocialService.respondToFollowRequest(requestId, status);
    } catch (error) {
      console.error('Error responding to follow request:', error);
      setError(error instanceof Error ? error.message : 'Failed to respond to follow request');
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async (followingId: string) => {
    try {
      setLoading(true);
      setError(null);
      await SocialService.unfollow(currentUserId, followingId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setError(error instanceof Error ? error.message : 'Failed to unfollow user');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await SocialService.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getFollowStatus = async (userId: string) => {
    try {
      return await SocialService.getFollowStatus(currentUserId, userId);
    } catch (error) {
      console.error('Error getting follow status:', error);
      return 'none' as const;
    }
  };

  const loadUserProfiles = async (userIds: string[]) => {
    try {
      const profiles = await UserUtils.getMultipleUserProfiles(userIds);
      setUserProfiles(prev => new Map([...prev, ...profiles]));
    } catch (error) {
      console.error('Error loading user profiles:', error);
    }
  };

  const getUserDisplayName = (userId: string): string => {
    const profile = userProfiles.get(userId);
    return profile?.displayName || `User ${userId.slice(-4)}`;
  };

  const getUserAvatar = (userId: string): string | undefined => {
    const profile = userProfiles.get(userId);
    return profile?.avatarUrl;
  };

  // Load user profiles when followers/following/requests change
  useEffect(() => {
    const userIds = new Set<string>();
    
    followers.forEach(follow => userIds.add(follow.followerId));
    following.forEach(follow => userIds.add(follow.followingId));
    followRequests.forEach(request => userIds.add(request.fromUserId));
    notifications.forEach(notification => {
      if (notification.relatedUserId) {
        userIds.add(notification.relatedUserId);
      }
    });
    
    const userIdsToLoad = Array.from(userIds).filter(id => !userProfiles.has(id));
    if (userIdsToLoad.length > 0) {
      loadUserProfiles(userIdsToLoad);
    }
  }, [followers, following, followRequests, notifications]);

  const renderActivityFeed = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900 tracking-wide mb-2">Activity Feed</h2>
        <p className="text-gray-600 font-light">See what's happening in your network</p>
      </div>
      
      <ActivityFeed 
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        currentUserAvatar={currentUserAvatar}
      />
    </div>
  );

  const renderFollowers = () => (
    <div className="space-y-6">
      {followers.map((follow) => {
        const displayName = getUserDisplayName(follow.followerId);
        const avatarUrl = getUserAvatar(follow.followerId);
        
        return (
          <div key={follow.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/bust-avatar.svg';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{displayName}</h4>
                  <p className="text-xs font-light text-gray-500">Following since {follow.createdAt?.toLocaleDateString()}</p>
                </div>
              </div>
              <QuickMessage 
                currentUserId={currentUserId}
                targetUserId={follow.followerId}
                targetUserName={displayName}
                className="ml-2"
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderFollowing = () => (
    <div className="space-y-6">
      {following.map((follow) => {
        const displayName = getUserDisplayName(follow.followingId);
        const avatarUrl = getUserAvatar(follow.followingId);
        
        return (
          <div key={follow.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/bust-avatar.svg';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{displayName}</h4>
                  <p className="text-xs font-light text-gray-500">Following since {follow.createdAt?.toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => unfollowUser(follow.followingId)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white font-light tracking-wide rounded-lg hover:bg-red-700 transition-all duration-300 text-sm disabled:opacity-50"
              >
                Unfollow
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderFollowRequests = () => (
    <div className="space-y-6">
      {followRequests.map((request) => {
        const displayName = getUserDisplayName(request.fromUserId);
        const avatarUrl = getUserAvatar(request.fromUserId);
        
        return (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/bust-avatar.svg';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{displayName}</h4>
                  <p className="text-xs font-light text-gray-500">{request.message}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => respondToFollowRequest(request.id, 'accepted')}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white font-light tracking-wide rounded-lg hover:bg-green-700 transition-all duration-300 text-sm disabled:opacity-50"
                >
                  Accept
                </button>
                <button 
                  onClick={() => respondToFollowRequest(request.id, 'rejected')}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white font-light tracking-wide rounded-lg hover:bg-red-700 transition-all duration-300 text-sm disabled:opacity-50"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {notifications.map((notification) => {
        const relatedUserName = notification.relatedUserId ? getUserDisplayName(notification.relatedUserId) : null;
        
        return (
          <div 
            key={notification.id} 
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all duration-300 ${!notification.isRead ? 'border-blue-200 bg-blue-50' : ''}`}
            onClick={() => markNotificationAsRead(notification.id)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-medium text-gray-600">
                  {notification.title?.charAt(0) || '?'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {notification.title}
                  {relatedUserName && (
                    <span className="text-blue-600 ml-1">from {relatedUserName}</span>
                  )}
                </p>
                <p className="text-sm font-light text-gray-600 mb-2">{notification.message}</p>
                <p className="text-xs font-light text-gray-500">
                  {notification.createdAt?.toLocaleDateString()}
                </p>
              </div>
              {!notification.isRead && (
                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDiscover = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search professionals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crewProfiles
          .filter(profile => 
            profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.jobTitles?.[0]?.title?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((profile) => (
            <div key={profile.uid} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-medium text-gray-600">
                    {profile.name?.charAt(0) || '?'}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{profile.name}</h3>
                <p className="text-sm font-light text-gray-600 mb-2">
                  {profile.jobTitles?.[0]?.title || 'Film Professional'}
                </p>
                <p className="text-xs font-light text-gray-500">
                  📍 {profile.residences?.[0]?.city}, {profile.residences?.[0]?.country}
                </p>
              </div>
              
              <div className="space-y-3">
                {profile.bio && (
                  <p className="text-sm font-light text-gray-600 line-clamp-3">{profile.bio}</p>
                )}
                
                <div className="flex justify-center">
                  <FollowButton 
                    currentUserId={currentUserId}
                    targetUserId={profile.uid}
                    onFollowRequest={() => {
                      setSelectedProfile(profile);
                      setShowRequestModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="social-dashboard">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-content">
            <div className="skeleton-tab"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="social-dashboard">
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="social-dashboard">
      <div className="dashboard-header">
        <h1>Social Hub</h1>
        <div className="header-actions">
          <NotificationBell currentUserId={currentUserId} />
          <div className="stats">
            <span>{followers.length} Followers</span>
            <span>{following.length} Following</span>
            {followRequests.length > 0 && (
              <span className="requests-badge">{followRequests.length} Requests</span>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          📰 Activity Feed
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button
          className={`tab ${activeTab === 'messaging' ? 'active' : ''}`}
          onClick={() => setActiveTab('messaging')}
        >
          💬 Messaging
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'feed' && (
          <div className="feed-section">
            <ActivityFeed currentUserId={currentUserId} currentUserName="Current User" />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <SocialAnalytics userId={currentUserId} />
          </div>
        )}

        {activeTab === 'messaging' && (
          <div className="messaging-section">
            <AdvancedMessaging
              currentUserId={currentUserId}
              recipientId="recipient123"
              recipientName="John Doe"
              recipientAvatar="https://via.placeholder.com/48"
            />
          </div>
        )}
      </div>

      <div className="dashboard-sidebar">
        <div className="sidebar-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn">📝 Create Post</button>
            <button className="action-btn">👥 Find People</button>
            <button className="action-btn">📅 Events</button>
            <button className="action-btn">🏆 Achievements</button>
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Recent Connections</h3>
          <div className="connections-list">
            {followers.slice(0, 5).map((follower) => {
              const profile = userProfiles.get(follower.followerId);
              return (
                <div key={follower.id} className="connection-item">
                  <div className="connection-avatar">
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.displayName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {profile?.displayName?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="connection-info">
                    <span className="connection-name">
                      {profile?.displayName || 'Unknown User'}
                    </span>
                    <span className="connection-status">Recently followed you</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Follow Requests</h3>
          {followRequests.length > 0 ? (
            <div className="requests-list">
              {followRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="request-item">
                  <div className="request-info">
                    <span className="request-name">User {request.fromUserId.slice(-4)}</span>
                    <span className="request-message">{request.message}</span>
                  </div>
                  <div className="request-actions">
                    <QuickMessage
                      currentUserId={currentUserId}
                      targetUserId={request.fromUserId}
                      targetUserName={`User ${request.fromUserId.slice(-4)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-requests">No pending requests</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialDashboard;
