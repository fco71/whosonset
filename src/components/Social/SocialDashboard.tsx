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
  console.log('[SocialDashboard] Component rendered with props:', { currentUserId, currentUserName, currentUserAvatar });
  
  const [activeTab, setActiveTab] = useState<'overview' | 'followers' | 'following' | 'requests' | 'notifications' | 'members' | 'messaging'>('overview');
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CrewProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time listeners
  useEffect(() => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    console.log('[SocialDashboard] Setting up real-time listeners for user:', currentUserId);
    
    const unsubscribeFollowRequests = SocialService.subscribeToFollowRequests(currentUserId, setFollowRequests);
    const unsubscribeNotifications = SocialService.subscribeToNotifications(currentUserId, setNotifications);
    const unsubscribeFollowers = SocialService.subscribeToFollowers(currentUserId, setFollowers);
    const unsubscribeFollowing = SocialService.subscribeToFollowing(currentUserId, setFollowing);

    // Load crew profiles for member list
    const loadCrewProfiles = async () => {
      try {
        const profiles = await SocialService.getCrewProfiles();
        setCrewProfiles(profiles);
      } catch (error) {
        console.error('[SocialDashboard] Error loading crew profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCrewProfiles();

    return () => {
      console.log('[SocialDashboard] Cleaning up real-time listeners');
      unsubscribeFollowRequests();
      unsubscribeNotifications();
      unsubscribeFollowers();
      unsubscribeFollowing();
    };
  }, [currentUserId]);

  const filteredProfiles = crewProfiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.jobTitles.some(job => job.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTabChange = (tab: 'overview' | 'followers' | 'following' | 'requests' | 'notifications' | 'members' | 'messaging') => {
    setActiveTab(tab);
  };

  const handleNotificationClick = (notification: SocialNotification) => {
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
    } catch (error) {
      console.error('Error responding to follow request:', error);
    }
  };

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
            <h3>Followers ({followers.length})</h3>
            <div className="followers-list">
              {followers.map(follow => (
                <div key={follow.id} className="follower-item">
                  <img src="/default-avatar.png" alt="User" className="follower-avatar" />
                  <span className="follower-name">User {follow.followerId.slice(-4)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'following' && (
          <div className="following-tab">
            <h3>Following ({following.length})</h3>
            <div className="following-list">
              {following.map(follow => (
                <div key={follow.id} className="following-item">
                  <img src="/default-avatar.png" alt="User" className="following-avatar" />
                  <span className="following-name">User {follow.followingId.slice(-4)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'requests' && (
          <div className="requests-tab">
            <div className="follow-requests-card">
              <h3>Follow Requests ({followRequests.length})</h3>
              {followRequests.length > 0 ? (
                <div className="requests-list">
                  {followRequests.map(request => (
                    <div key={request.id} className="request-item">
                      <div className="request-user-info">
                        <img 
                          src="/default-avatar.png" 
                          alt="User"
                          className="request-avatar"
                        />
                        <div className="request-user-details">
                          <span className="request-username">
                            {request.fromUserName || `User ${request.fromUserId.slice(-4)}`}
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
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleFollowRequestResponse(request.id, 'rejected')}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                        <QuickMessage 
                          currentUserId={currentUserId}
                          targetUserId={request.fromUserId}
                          targetUserName={request.fromUserName || `User ${request.fromUserId.slice(-4)}`}
                          className="ml-auto"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No pending follow requests</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="notifications-tab">
            <h3>Notifications ({notifications.length})</h3>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <span className="notification-icon">
                    {notification.type === 'follow_request' ? '👤' : 
                     notification.type === 'message' ? '💬' : '🔔'}
                  </span>
                  <div className="notification-content">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'members' && (
          <div className="members-tab">
            <div className="members-header">
              <h3>Crew Directory ({filteredProfiles.length})</h3>
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
              {filteredProfiles.map((profile, index) => (
                <div key={profile.uid} className="member-card">
                  <div className="member-avatar">
                    <img 
                      src={profile.profileImageUrl || "/default-avatar.png"} 
                      alt={profile.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/default-avatar.png";
                      }}
                    />
                    <button 
                      className="bookmark-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement bookmark functionality
                        console.log('Bookmark clicked for:', profile.name);
                      }}
                      title="Add to favorites"
                    >
                      📖
                    </button>
                  </div>
                  <div className="member-info">
                    <h4>{profile.name}</h4>
                    <p className="member-title">
                      {profile.jobTitles?.[0]?.title || 'Professional'}
                    </p>
                    <p className="member-location">
                      {profile.residences?.[0]?.city}, {profile.residences?.[0]?.country}
                    </p>
                  </div>
                  <div className="member-actions">
                    <FollowButton 
                      currentUserId={currentUserId}
                      targetUserId={profile.uid}
                    />
                    <button 
                      className="message-btn"
                      onClick={() => {
                        setSelectedProfile(profile);
                        setActiveTab('messaging');
                      }}
                    >
                      💬
                    </button>
                  </div>
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

      {/* Debug Information */}
      <div className="debug-info">
        <h4>Debug Information</h4>
        <p><strong>Followers:</strong> {followers.length}</p>
        <p><strong>Following:</strong> {following.length}</p>
        <p><strong>Follow Requests:</strong> {followRequests.length}</p>
        <p><strong>Notifications:</strong> {notifications.length}</p>
        <p><strong>Crew Profiles:</strong> {crewProfiles.length}</p>
        <p><strong>Active Tab:</strong> {activeTab}</p>
      </div>
    </div>
  );
};

export default SocialDashboard;
