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
  
  const [activeTab, setActiveTab] = useState<'feed' | 'analytics' | 'messaging'>('feed');
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
        <div className="main-content">
          {activeTab === 'feed' && (
            <ActivityFeed currentUserId={currentUserId} currentUserName={currentUserName} />
          )}
          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <SocialAnalytics 
                userId={currentUserId}
              />
            </div>
          )}
          {activeTab === 'messaging' && (
            <div className="messaging-section">
              <ChatInterface 
                currentUserId={currentUserId}
                currentUserName={currentUserName}
              />
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="user-info-card">
            <div className="user-avatar-section">
              <img 
                src={currentUserAvatar || '/default-avatar.png'} 
                alt={currentUserName}
                className="user-avatar"
              />
              <div className="user-details">
                <h3>{currentUserName}</h3>
                <p className="user-handle">@{currentUserId.slice(-8)}</p>
              </div>
            </div>
            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">{followers.length}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{following.length}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>

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
                        className="accept-btn"
                        onClick={() => SocialService.respondToFollowRequest(request.id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => SocialService.respondToFollowRequest(request.id, 'rejected')}
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
              <p>No pending requests</p>
            )}
          </div>

          <div className="members-card">
            <h3>Members ({filteredProfiles.length})</h3>
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <div className="members-list">
              {filteredProfiles.map(profile => (
                <div key={profile.uid} className="member-item">
                  <div className="member-info">
                    <img 
                      src={profile.profileImageUrl || '/default-avatar.png'} 
                      alt={profile.name}
                      className="member-avatar"
                    />
                    <div>
                      <h4>{profile.name}</h4>
                      <p>{profile.jobTitles.map(job => job.title).join(', ')}</p>
                    </div>
                  </div>
                  <div className="member-actions">
                    <FollowButton 
                      currentUserId={currentUserId}
                      targetUserId={profile.uid}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
