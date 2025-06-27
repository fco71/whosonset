import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { FriendRequest, SocialNotification, ActivityFeedItem, SocialConnection } from '../../types/Social';
import { CrewProfile } from '../../types/CrewProfile';
import './SocialDashboard.scss';

interface SocialDashboardProps {
  currentUserId: string;
  currentUser: any;
}

const SocialDashboard: React.FC<SocialDashboardProps> = ({ currentUserId, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'requests' | 'notifications' | 'discover'>('feed');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CrewProfile | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let unsubscribeFriendRequests: (() => void) | undefined;
    let unsubscribeNotifications: (() => void) | undefined;
    let unsubscribeActivityFeed: (() => void) | undefined;
    let unsubscribeConnections: (() => void) | undefined;

    const setupListeners = async () => {
      unsubscribeFriendRequests = await loadFriendRequests();
      unsubscribeNotifications = await loadNotifications();
      unsubscribeActivityFeed = await loadActivityFeed();
      unsubscribeConnections = await loadConnections();
      loadCrewProfiles(); // This one does not use onSnapshot
    };

    setupListeners();

    return () => {
      if (unsubscribeFriendRequests) unsubscribeFriendRequests();
      if (unsubscribeNotifications) unsubscribeNotifications();
      if (unsubscribeActivityFeed) unsubscribeActivityFeed();
      if (unsubscribeConnections) unsubscribeConnections();
    };
  }, [currentUserId]);

  useEffect(() => {
    // Calculate unread notifications
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const loadFriendRequests = async () => {
    try {
      const requestsQuery = query(
        collection(db, 'friendRequests'),
        where('toUserId', '==', currentUserId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as FriendRequest[];
        setFriendRequests(requests);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', currentUserId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        })) as SocialNotification[];
        setNotifications(notificationsData);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadActivityFeed = async () => {
    try {
      const feedQuery = query(
        collection(db, 'activityFeed'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(feedQuery, (snapshot) => {
        const feedData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        })) as ActivityFeedItem[];
        setActivityFeed(feedData);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading activity feed:', error);
    }
  };

  const loadConnections = async () => {
    try {
      const connectionsQuery = query(
        collection(db, 'connections'),
        where('userId', '==', currentUserId),
        where('status', '==', 'connected')
      );

      const unsubscribe = onSnapshot(connectionsQuery, (snapshot) => {
        const connectionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          lastInteraction: doc.data().lastInteraction?.toDate()
        })) as SocialConnection[];
        setConnections(connectionsData);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading connections:', error);
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

  const sendFriendRequest = async (targetUserId: string, message: string) => {
    try {
      const requestData = {
        fromUserId: currentUserId,
        toUserId: targetUserId,
        status: 'pending',
        message,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'friendRequests'), requestData);
      setShowRequestModal(false);
      setRequestMessage('');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const respondToFriendRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      await updateDoc(requestRef, { 
        status, 
        updatedAt: serverTimestamp() 
      });

      if (status === 'accepted') {
        // Create connection
        const request = friendRequests.find(r => r.id === requestId);
        if (request) {
          const connectionData = {
            userId: currentUserId,
            connectedUserId: request.fromUserId,
            status: 'connected',
            mutualConnections: 0,
            createdAt: serverTimestamp()
          };
          await addDoc(collection(db, 'connections'), connectionData);
        }
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getConnectionStatus = (userId: string) => {
    const connection = connections.find(c => c.connectedUserId === userId);
    const request = friendRequests.find(r => 
      (r.fromUserId === userId && r.toUserId === currentUserId) ||
      (r.fromUserId === currentUserId && r.toUserId === userId)
    );
    
    if (connection) return 'connected';
    if (request) return request.status;
    return null;
  };

  const filteredProfiles = crewProfiles.filter(profile => {
    const isCurrentUser = profile.uid === currentUserId;
    const hasConnection = getConnectionStatus(profile.uid);
    const matchesSearch = searchQuery === '' || 
      profile.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return !isCurrentUser && !hasConnection && matchesSearch;
  });

  const renderActivityFeed = () => (
    <div className="activity-feed">
      <div className="feed-header">
        <h3>🎬 Industry Activity</h3>
        <p>Stay updated with your network's latest projects and achievements</p>
      </div>
      
      <div className="feed-items">
        {activityFeed.map(item => (
          <div key={item.id} className="feed-item">
            <div className="feed-avatar">
              <img src="/default-avatar.png" alt="" />
            </div>
            <div className="feed-content">
              <div className="feed-header">
                <span className="user-name">{item.title}</span>
                <span className="feed-time">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="feed-description">{item.description}</p>
              <div className="feed-actions">
                <button className="action-btn like-btn">
                  ❤️ {item.likes}
                </button>
                <button className="action-btn comment-btn">
                  💬 {item.comments}
                </button>
                <button className="action-btn share-btn">
                  📤 Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFriends = () => (
    <div className="friends-section">
      <div className="friends-header">
        <h3>👥 Your Connections</h3>
        <p>{connections.length} professional connections</p>
      </div>
      
      <div className="friends-grid">
        {connections.map(connection => {
          const connectedProfile = crewProfiles.find(p => p.uid === connection.connectedUserId);
          if (!connectedProfile) return null;

          return (
            <div key={connection.id} className="friend-card">
              <div className="friend-avatar">
                <img src={connectedProfile.profileImageUrl || '/default-avatar.png'} alt="" />
                <div className="online-indicator"></div>
              </div>
              <div className="friend-info">
                <h4>{connectedProfile.name}</h4>
                <p>{connectedProfile.jobTitles?.[0]?.title}</p>
                <span className="location">
                  📍 {connectedProfile.residences?.[0]?.city}
                </span>
              </div>
              <div className="friend-actions">
                <button className="message-btn">Message</button>
                <button className="view-profile-btn">View Profile</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFriendRequests = () => (
    <div className="requests-section">
      <div className="requests-header">
        <h3>📨 Friend Requests</h3>
        <p>{friendRequests.length} pending requests</p>
      </div>
      
      <div className="requests-list">
        {friendRequests.map(request => {
          const fromProfile = crewProfiles.find(p => p.uid === request.fromUserId);
          if (!fromProfile) return null;

          return (
            <div key={request.id} className="request-item">
              <div className="request-avatar">
                <img src={fromProfile.profileImageUrl || '/default-avatar.png'} alt="" />
              </div>
              <div className="request-info">
                <h4>{fromProfile.name}</h4>
                <p>{fromProfile.jobTitles?.[0]?.title}</p>
                {request.message && <p className="request-message">"{request.message}"</p>}
                <span className="request-time">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="request-actions">
                <button 
                  className="accept-btn"
                  onClick={() => respondToFriendRequest(request.id, 'accepted')}
                >
                  Accept
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => respondToFriendRequest(request.id, 'rejected')}
                >
                  Decline
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="notifications-section">
      <div className="notifications-header">
        <h3>🔔 Notifications</h3>
        <p>{unreadCount} unread notifications</p>
      </div>
      
      <div className="notifications-list">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            onClick={() => markNotificationAsRead(notification.id)}
          >
            <div className="notification-icon">
              {notification.type === 'friend_request' && '👥'}
              {notification.type === 'project_invite' && '🎬'}
              {notification.type === 'message' && '��'}
              {notification.type === 'mention' && '📢'}
              {notification.type === 'like' && '❤️'}
              {notification.type === 'comment' && '💭'}
              {notification.type === 'project_update' && '📝'}
            </div>
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.message}</p>
              <span className="notification-time">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </div>
            {!notification.isRead && <div className="unread-indicator"></div>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiscover = () => (
    <div className="discover-section">
      <div className="discover-header">
        <h3>🔍 Discover People</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, role, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="discover-grid">
        {filteredProfiles.map(profile => (
          <div key={profile.uid} className="discover-card">
            <div className="discover-avatar">
              <img src={profile.profileImageUrl || '/default-avatar.png'} alt="" />
            </div>
            <div className="discover-info">
              <h4>{profile.name}</h4>
              <p>{profile.jobTitles?.[0]?.title}</p>
              <span className="location">
                📍 {profile.residences?.[0]?.city}, {profile.residences?.[0]?.country}
              </span>
            </div>
            <div className="discover-actions">
              <button 
                className="connect-btn"
                onClick={() => {
                  setSelectedProfile(profile);
                  setShowRequestModal(true);
                }}
              >
                Connect
              </button>
              <button className="view-profile-btn">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="social-dashboard">
      <div className="dashboard-header">
        <h1>🎬 Film Industry Network</h1>
        <p>Connect, collaborate, and stay updated with your professional network</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          📰 Activity Feed
        </button>
        <button 
          className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          👥 Friends ({connections.length})
        </button>
        <button 
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📨 Requests ({friendRequests.length})
        </button>
        <button 
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notifications ({unreadCount})
        </button>
        <button 
          className={`tab ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          🔍 Discover
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'feed' && renderActivityFeed()}
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'requests' && renderFriendRequests()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'discover' && renderDiscover()}
      </div>

      {showRequestModal && selectedProfile && (
        <div className="request-modal">
          <div className="modal-content">
            <h3>Connect with {selectedProfile.name}</h3>
            <div className="profile-preview">
              <img src={selectedProfile.profileImageUrl || '/default-avatar.png'} alt="" />
              <div>
                <h4>{selectedProfile.name}</h4>
                <p>{selectedProfile.jobTitles?.[0]?.title}</p>
              </div>
            </div>
            <textarea
              placeholder="Add a personal message (optional)..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="request-message"
            />
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </button>
              <button 
                className="send-btn"
                onClick={() => sendFriendRequest(selectedProfile.uid, requestMessage)}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialDashboard;
