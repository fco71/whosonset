import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { FriendRequest, SocialNotification, ActivityFeedItem, SocialConnection } from '../../types/Social';
import { CrewProfile } from '../../types/CrewProfile';

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
            createdAt: serverTimestamp(),
            lastInteraction: serverTimestamp()
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
    if (connection) return 'connected';
    
    const pendingRequest = friendRequests.find(r => r.fromUserId === userId);
    if (pendingRequest) return 'pending';
    
    return 'none';
  };

  const renderActivityFeed = () => (
    <div className="space-y-6">
      {activityFeed.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-medium text-gray-600">
                {item.title?.charAt(0) || '?'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-light text-gray-900 mb-2">
                <span className="font-medium">{item.title}</span>
              </p>
              <p className="text-sm font-light text-gray-600 mb-2">{item.description}</p>
              <p className="text-xs font-light text-gray-500">
                {item.createdAt?.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFriends = () => (
    <div className="space-y-6">
      {connections.map((connection) => (
        <div key={connection.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">
                  {connection.connectedUserId?.charAt(0) || '?'}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{connection.connectedUserId}</h4>
                <p className="text-xs font-light text-gray-500">Connected since {connection.createdAt?.toLocaleDateString()}</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm">
              Message
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFriendRequests = () => (
    <div className="space-y-6">
      {friendRequests.map((request) => (
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
                onClick={() => respondToFriendRequest(request.id, 'accepted')}
                className="px-4 py-2 bg-green-600 text-white font-light tracking-wide rounded-lg hover:bg-green-700 transition-all duration-300 text-sm"
              >
                Accept
              </button>
              <button 
                onClick={() => respondToFriendRequest(request.id, 'rejected')}
                className="px-4 py-2 bg-red-600 text-white font-light tracking-wide rounded-lg hover:bg-red-700 transition-all duration-300 text-sm"
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
        <div key={notification.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-light text-gray-900 mb-2">{notification.message}</p>
              <p className="text-xs font-light text-gray-500">{notification.createdAt?.toLocaleDateString()}</p>
            </div>
            {!notification.isRead && (
              <button 
                onClick={() => markNotificationAsRead(notification.id)}
                className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition-colors"
              >
                Mark Read
              </button>
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
          placeholder="Search crew members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crewProfiles
          .filter(profile => 
            profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.jobTitles?.some(job => job.title?.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .map((profile) => (
            <div key={profile.uid} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
              <div className="text-center mb-4">
                {profile.profileImageUrl ? (
                  <img 
                    src={profile.profileImageUrl} 
                    alt={profile.name} 
                    className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-600">
                      {profile.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <h4 className="text-lg font-light text-gray-900 tracking-wide">{profile.name}</h4>
                <p className="text-sm font-light text-gray-600">
                  {profile.jobTitles?.[0]?.title || 'Film Professional'}
                </p>
              </div>
              
              <div className="space-y-3">
                {profile.bio && (
                  <p className="text-sm font-light text-gray-600 line-clamp-3">{profile.bio}</p>
                )}
                
                <div className="flex justify-center">
                  {getConnectionStatus(profile.uid) === 'connected' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full tracking-wider">
                      Connected
                    </span>
                  ) : getConnectionStatus(profile.uid) === 'pending' ? (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full tracking-wider">
                      Request Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProfile(profile);
                        setShowRequestModal(true);
                      }}
                      className="px-4 py-2 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 text-sm"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight animate-slide-up">
            Social Hub
          </h1>
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
            Connect with film industry professionals, stay updated on activities, and discover new collaborators.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-100">
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'feed' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('feed')}
            >
              Activity Feed
            </button>
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'friends' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('friends')}
            >
              Friends ({connections.length})
            </button>
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'requests' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              Requests {friendRequests.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  {friendRequests.length}
                </span>
              )}
            </button>
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'notifications' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              className={`px-6 py-4 text-sm font-light tracking-wide transition-colors duration-300 border-b-2 ${
                activeTab === 'discover' 
                  ? 'text-gray-900 border-gray-900' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('discover')}
            >
              Discover
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {activeTab === 'feed' && renderActivityFeed()}
          {activeTab === 'friends' && renderFriends()}
          {activeTab === 'requests' && renderFriendRequests()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'discover' && renderDiscover()}
        </div>

        {/* Friend Request Modal */}
        {showRequestModal && selectedProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                Send Connection Request
              </h3>
              <p className="text-sm font-light text-gray-600 mb-4">
                Send a message to {selectedProfile.name} along with your connection request.
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
                  onClick={() => sendFriendRequest(selectedProfile.uid, requestMessage)}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestMessage('');
                    setSelectedProfile(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm"
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
