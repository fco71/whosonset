import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { FollowRequest, SocialNotification, ActivityFeedItem, Follow } from '../../types/Social';
import { CrewProfile } from '../../types/CrewProfile';
import { SocialService } from '../../utilities/socialService';
import QuickMessage from './QuickMessage';
import FollowButton from './FollowButton';
import ActivityFeed from './ActivityFeed';

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
  const [activeTab, setActiveTab] = useState<'activity' | 'followers' | 'following' | 'requests' | 'notifications' | 'discover'>('activity');
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      {followers.map((follow) => (
        <div key={follow.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {follow.followerId?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{follow.followerId}</h4>
                <p className="text-xs font-light text-gray-500">Following since {follow.createdAt?.toLocaleDateString()}</p>
              </div>
            </div>
            <QuickMessage 
              currentUserId={currentUserId}
              targetUserId={follow.followerId}
              targetUserName={follow.followerId}
              className="ml-2"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderFollowing = () => (
    <div className="space-y-6">
      {following.map((follow) => (
        <div key={follow.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {follow.followingId?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{follow.followingId}</h4>
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
      ))}
    </div>
  );

  const renderFollowRequests = () => (
    <div className="space-y-6">
      {followRequests.map((request) => (
        <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {request.fromUserId?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{request.fromUserId}</h4>
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
      ))}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {notifications.map((notification) => (
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
              <p className="text-sm font-medium text-gray-900 mb-1">{notification.title}</p>
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
      ))}
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 tracking-wide mb-2">Social Hub</h1>
          <p className="text-gray-600 font-light">Connect with film professionals and stay updated</p>
        </div>

        {/* Help Banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-lg">💡</div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">How to connect with professionals:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Go to <strong>Discover</strong> tab to find professionals</li>
                <li>• Click <strong>Follow</strong> to send a connection request</li>
                <li>• Check <strong>Requests</strong> tab to approve incoming requests</li>
                <li>• Use <strong>Messages</strong> to chat with your connections</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8">
          <div className="flex space-x-1">
            {[
              { id: 'activity', label: 'Activity Feed', count: null },
              { id: 'followers', label: 'Followers', count: followers.length },
              { id: 'following', label: 'Following', count: following.length },
              { id: 'requests', label: 'Requests', count: followRequests.length },
              { id: 'notifications', label: 'Notifications', count: unreadCount },
              { id: 'discover', label: 'Discover', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-3 text-sm font-light tracking-wide rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {activeTab === 'activity' && renderActivityFeed()}
          {activeTab === 'followers' && renderFollowers()}
          {activeTab === 'following' && renderFollowing()}
          {activeTab === 'requests' && renderFollowRequests()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'discover' && renderDiscover()}
        </div>

        {/* Follow Request Modal */}
        {showRequestModal && selectedProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                Send Follow Request
              </h3>
              <p className="text-sm font-light text-gray-600 mb-4">
                Send a message to {selectedProfile.name} along with your follow request.
              </p>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Write a brief message..."
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] resize-none mb-6"
                rows={4}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => sendFollowRequest(selectedProfile.uid, requestMessage)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestMessage('');
                    setSelectedProfile(null);
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialDashboard;
