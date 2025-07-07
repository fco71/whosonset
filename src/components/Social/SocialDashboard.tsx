import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { toast } from 'react-hot-toast';
import { Unsubscribe } from 'firebase/auth';

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
  // State management with proper types
  const [activeTab, setActiveTab] = useState<'overview' | 'followers' | 'following' | 'requests' | 'notifications' | 'members' | 'messaging'>('overview');
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CrewProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followingProfiles, setFollowingProfiles] = useState<Record<string, UserProfile | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [followersSearch, setFollowersSearch] = useState('');
  const [followingSearch, setFollowingSearch] = useState('');
  // Memoize the props to prevent unnecessary re-renders
  const memoizedProps = useMemo(() => ({
    currentUserId,
    currentUserName,
    currentUserAvatar: currentUserAvatar || '/default-avatar.svg' // Provide fallback avatar
  }), [currentUserId, currentUserName, currentUserAvatar]);

  // Only log when props actually change
  useEffect(() => {
    console.log('[SocialDashboard] Component rendered with props:', memoizedProps);
  }, [memoizedProps]);

  // Set up all listeners when component mounts or userId changes
  useEffect(() => {
    if (!memoizedProps.currentUserId) {
      setIsLoading(false);
      return () => {};
    }

    console.log('[SocialDashboard] Setting up real-time listeners for user:', memoizedProps.currentUserId);
    
    let unsubscribeFunctions: (() => void)[] = [];
    let isMounted = true;
    
    const setupListeners = async () => {
      try {
        // Set up listeners using static methods
        const [unsubRequests, unsubNotifications, unsubFollowers, unsubFollowing] = await Promise.all([
          SocialService.subscribeToFollowRequests(memoizedProps.currentUserId, (requests: FollowRequest[]) => {
            if (isMounted) setFollowRequests(requests);
          }),
          SocialService.subscribeToNotifications(memoizedProps.currentUserId, (notifications: SocialNotification[]) => {
            if (isMounted) setNotifications(notifications);
          }),
          SocialService.subscribeToFollowers(memoizedProps.currentUserId, (followersData: Follow[]) => {
            if (isMounted) setFollowers(followersData);
          }),
          SocialService.subscribeToFollowing(memoizedProps.currentUserId, (followingData: Follow[]) => {
            if (isMounted) setFollowing(followingData);
          })
        ]);
        
        unsubscribeFunctions = [
          unsubRequests,
          unsubNotifications,
          unsubFollowers,
          unsubFollowing
        ].filter(Boolean) as (() => void)[];
        
        // Load crew profiles
        const profiles = await SocialService.getCrewProfiles();
        if (isMounted) setCrewProfiles(profiles);
        
        if (isMounted) setIsLoading(false);
      } catch (error) {
        console.error('Error setting up listeners:', error);
        if (isMounted) {
          setError('Failed to load social data. Please try again.');
          setIsLoading(false);
        }
      }
    };
    
    setupListeners();
    
    // Cleanup function
    return () => {
      console.log('[SocialDashboard] Cleaning up listeners');
      isMounted = false;
      unsubscribeFunctions.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          try {
            unsubscribe();
          } catch (err) {
            console.error('Error during cleanup:', err);
          }
        }
      });
    };
  }, [memoizedProps.currentUserId]);

  useEffect(() => {
    // Fetch profiles for all following users with error handling
    const fetchProfiles = async () => {
      try {
        const ids = following.map(f => f.followingId);
        if (ids.length === 0) return;
        const profilesMap = await UserUtils.getMultipleUserProfiles(ids);
        const profiles: Record<string, UserProfile | null> = {};
        ids.forEach(id => {
          profiles[id] = profilesMap.get(id) || null;
        });
        setFollowingProfiles(profiles);
      } catch (error) {
        console.error('[SocialDashboard] Error fetching following profiles:', error);
      }
    };
    fetchProfiles();
  }, [following]);

  const filteredProfiles = crewProfiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.jobTitles.some(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTabChange = (tab: 'overview' | 'followers' | 'following' | 'requests' | 'notifications' | 'members' | 'messaging') => {
    setActiveTab(tab);
  };

  const handleNotificationClick = (notification: SocialNotification) => {
    try {
      // Mark notification as read
      SocialService.markNotificationAsRead(notification.id);
      
      // Navigate based on notification type
      switch (notification.type) {
        case 'follow_request':
          setActiveTab('requests');
          break;
        case 'follow_accepted':
          setActiveTab('followers');
          break;
        case 'message':
          setActiveTab('messaging');
          break;
        default:
          setActiveTab('notifications');
      }
    } catch (error) {
      console.error('[SocialDashboard] Error handling notification click:', error);
      toast.error('Failed to process notification');
    }
  };

  const handleFollowRequestResponse = async (requestId: string, response: 'accepted' | 'rejected') => {
    try {
      await SocialService.respondToFollowRequest(requestId, response);
      // Remove the request from the list after response
      setFollowRequests(prev => prev.filter(req => req.id !== requestId));
      // Mark related notifications as read
      setNotifications(prev => prev.filter(notif => 
        !(notif.type === 'follow_request' && notif.relatedEventId === requestId)
      ));
      toast.success(`Follow request ${response}`);
    } catch (error) {
      console.error('Error responding to follow request:', error);
      toast.error('Failed to respond to follow request');
    }
  };

  if (error) {
    return (
      <div className="social-dashboard">
        <div className="error-state">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="social-dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading social dashboard...</p>
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

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => handleTabChange('overview')}
        >
          📰 Activity Feed
        </button>
        <button
          className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => handleTabChange('followers')}
        >
          👥 Followers
        </button>
        <button
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => handleTabChange('following')}
        >
          👤 Following
        </button>
        <button
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => handleTabChange('requests')}
        >
          📨 Requests
        </button>
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => handleTabChange('notifications')}
        >
          🔔 Notifications
        </button>
        <button
          className={`tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => handleTabChange('members')}
        >
          👥 Members
        </button>
        <button
          className={`tab ${activeTab === 'messaging' ? 'active' : ''}`}
          onClick={() => handleTabChange('messaging')}
        >
          💬 Messaging
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <ActivityFeed 
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              currentUserAvatar={currentUserAvatar}
            />
          </div>
        )}
        
        {activeTab === 'followers' && (
          <div className="followers-tab">
            <h3>Followers</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search followers..."
                value={followersSearch}
                onChange={e => setFollowersSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="followers-list">
              {followers
                .filter(follow => {
                  const profile = followingProfiles[follow.followerId];
                  return (
                    (profile?.displayName || `User ${follow.followerId.slice(-4)}`)
                      .toLowerCase()
                      .includes(followersSearch.toLowerCase())
                  );
                })
                .map(follow => {
                  const profile = followingProfiles[follow.followerId];
                  return (
                    <div key={follow.id} className="follower-item crew-card">
                      <img
                        src={profile?.avatarUrl || "/bust-avatar.svg"}
                        alt={profile?.displayName || `User ${follow.followerId.slice(-4)}`}
                        className="follower-avatar crew-avatar"
                        onError={e => (e.currentTarget.src = "/bust-avatar.svg")}
                      />
                      <div className="follower-info crew-info">
                        <span className="follower-name crew-name">{profile?.displayName || `User ${follow.followerId.slice(-4)}`}</span>
                        <span className="follower-title crew-title">{profile?.jobTitle || ''}</span>
                        <span className="follower-location crew-location">{profile?.location || ''}</span>
                      </div>
                      <button className="message-btn"><span>💬</span> Message</button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {activeTab === 'following' && (
          <div className="following-tab">
            <h3>Following</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search following..."
                value={followingSearch}
                onChange={e => setFollowingSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="following-list">
              {following
                .filter(follow => {
                  const profile = followingProfiles[follow.followingId];
                  return (
                    (profile?.displayName || `User ${follow.followingId.slice(-6)}`)
                      .toLowerCase()
                      .includes(followingSearch.toLowerCase())
                  );
                })
                .map(follow => {
                  const profile = followingProfiles[follow.followingId];
                  return (
                    <div key={`following-${follow.id}`} className="following-item crew-card">
                      <img
                        src={profile?.avatarUrl || "/bust-avatar.svg"}
                        alt={profile?.displayName || `User ${follow.followingId.slice(-6)}`}
                        className="following-avatar crew-avatar"
                        onError={e => (e.currentTarget.src = "/bust-avatar.svg")}
                      />
                      <div className="follower-info crew-info">
                        <span className="follower-name crew-name">{profile?.displayName || `User ${follow.followingId.slice(-6)}`}</span>
                        <span className="follower-title crew-title">{profile?.jobTitle || ''}</span>
                        <span className="follower-location crew-location">{profile?.location || ''}</span>
                      </div>
                      <button className="message-btn"><span>💬</span> Message</button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        
        {activeTab === 'requests' && (
          <div className="requests-tab">
            <h3>Follow Requests ({followRequests.length})</h3>
            {followRequests.length === 0 ? (
              <div className="empty-state" style={{ color: '#374151', fontWeight: 500, fontSize: 16, background: 'rgba(55,65,81,0.04)', borderRadius: 8, padding: 24 }}>
                No pending follow requests
              </div>
            ) : (
              <div className="requests-list">
                {followRequests.map(request => (
                  <div key={request.id} className="request-item">
                    <div className="request-user-info">
                      <img 
                        src="/bust-avatar.svg" 
                        alt="User"
                        className="request-avatar"
                        onError={(e) => {
                          e.currentTarget.src = "/bust-avatar.svg";
                        }}
                      />
                      <div className="request-user-details">
                        <span className="request-username">
                          {request.fromUserName || `User ${request.fromUserId.slice(-6)}`}
                        </span>
                        <span className="request-handle">
                          @{request.fromUserId.slice(-8)}
                        </span>
                      </div>
                    </div>
                    <div className="request-actions">
                      <button 
                        onClick={() => handleFollowRequestResponse(request.id, 'accepted')}
                        className="accept-btn"
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        ✓ Accept
                      </button>
                      <button 
                        onClick={() => handleFollowRequestResponse(request.id, 'rejected')}
                        className="reject-btn"
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        ✕ Reject
                      </button>
                      <QuickMessage 
                        currentUserId={currentUserId}
                        targetUserId={request.fromUserId}
                        targetUserName={request.fromUserName || `User ${request.fromUserId.slice(-6)}`}
                        className="ml-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <h3>Notifications ({notifications.length})</h3>
            {notifications.length === 0 ? (
              <div className="empty-state" style={{ color: '#374151', fontWeight: 500, fontSize: 16, background: 'rgba(55,65,81,0.04)', borderRadius: 8, padding: 24 }}>
                No notifications
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className="notification-item" style={{ color: '#374151', fontWeight: 500, fontSize: 16, background: 'rgba(55,65,81,0.04)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                    <div>{notif.title}</div>
                    <div style={{ color: '#6b7280', fontWeight: 400, fontSize: 14 }}>{notif.message || notif.title}</div>
                    <div style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>{notif.createdAt && new Date(notif.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="members-tab">
            <div className="members-header">
              <h3>Crew Directory</h3>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search crew members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="members-grid">
              {filteredProfiles.map((profile) => (
                <div key={`member-${profile.uid}`} className="member-card crew-card">
                  <img 
                    src={profile.profileImageUrl || "/bust-avatar.svg"} 
                    alt={profile.name}
                    className="member-avatar crew-avatar"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/bust-avatar.svg";
                    }}
                  />
                  <div className="member-info crew-info">
                    <span className="member-name crew-name">{profile.name}</span>
                    <span className="member-title crew-title">{profile.jobTitles?.[0]?.title || 'Professional'}</span>
                    <span className="member-location crew-location">{profile.residences?.[0]?.city}, {profile.residences?.[0]?.country}</span>
                  </div>
                  <button className="message-btn"><span>💬</span> Message</button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'messaging' && (
          <div className="messaging-tab">
            <h3>Direct Messages</h3>
            <div className="messaging-container">
              <ChatInterface 
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                currentUserAvatar={currentUserAvatar}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(SocialDashboard);
