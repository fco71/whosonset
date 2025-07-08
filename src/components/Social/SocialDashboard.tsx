import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SocialService } from '../../utilities/socialService';
import { FollowRequest, Follow } from '../../types/Social';
import { Button } from '../ui/Button';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  MessageCircle,
  Search,
  Filter
} from 'lucide-react';

interface UserData {
  id: string;
  displayName: string;
  avatar: string;
  department: string;
}

const SocialDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'following' | 'followers'>('requests');
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FollowRequest[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [userDataMap, setUserDataMap] = useState<Map<string, UserData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Add a set to track who the current user is following
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentUser) {
      loadSocialData();
    }
  }, [currentUser]);

  // Update followingSet whenever following changes
  useEffect(() => {
    setFollowingSet(new Set(following.map(f => f.followingId)));
  }, [following]);

  // Fetch user data for a given user ID
  const fetchUserData = async (userId: string): Promise<UserData> => {
    try {
      // Check if we already have this user's data
      if (userDataMap.has(userId)) {
        return userDataMap.get(userId)!;
      }

      // Fetch user data from Firestore
      const { getDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../../firebase');
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userInfo: UserData = {
          id: userId,
          displayName: userData.displayName || userData.name || `User ${userId.slice(0, 6)}`,
          avatar: userData.avatar || userData.photoURL || '',
          department: userData.department || userData.jobTitle || ''
        };
        
        // Cache the user data
        setUserDataMap(prev => new Map(prev).set(userId, userInfo));
        return userInfo;
      } else {
        // Fallback for non-existent users
        const fallbackUser: UserData = {
          id: userId,
          displayName: `User ${userId.slice(0, 6)}`,
          avatar: '',
          department: ''
        };
        setUserDataMap(prev => new Map(prev).set(userId, fallbackUser));
        return fallbackUser;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Return fallback data
      const fallbackUser: UserData = {
        id: userId,
        displayName: `User ${userId.slice(0, 6)}`,
        avatar: '',
        department: ''
      };
      setUserDataMap(prev => new Map(prev).set(userId, fallbackUser));
      return fallbackUser;
    }
  };

  // Fetch user data for multiple users
  const fetchUsersData = async (userIds: string[]) => {
    const uniqueUserIds = [...new Set(userIds)];
    await Promise.all(uniqueUserIds.map(fetchUserData));
  };

  const loadSocialData = () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Set up real-time subscriptions
      SocialService.subscribeToFollowRequests(currentUser.uid, async (requests) => {
        setFollowRequests(requests);
        
        // Fetch user data for requesters
        const requesterIds = requests.map(req => req.fromUserId);
        await fetchUsersData(requesterIds);
        
        setLoading(false);
      });
      
      SocialService.subscribeToOutgoingFollowRequests(currentUser.uid, async (requests) => {
        setOutgoingRequests(requests);
        
        // Fetch user data for recipients
        const recipientIds = requests.map(req => req.toUserId);
        await fetchUsersData(recipientIds);
      });
      
      SocialService.subscribeToFollowing(currentUser.uid, async (follows) => {
        setFollowing(follows);
        
        // Fetch user data for following users
        const followingIds = follows.map(follow => follow.followingId);
        await fetchUsersData(followingIds);
      });
      
      SocialService.subscribeToFollowers(currentUser.uid, async (follows) => {
        setFollowers(follows);
        
        // Fetch user data for followers
        const followerIds = follows.map(follow => follow.followerId);
        await fetchUsersData(followerIds);
      });
    } catch (err) {
      console.error('Error loading social data:', err);
      setError('Failed to load social data. Please try again.');
      setLoading(false);
    }
  };

  const handleFollowRequest = async (requesterId: string, action: 'accept' | 'reject') => {
    if (!currentUser) return;
    
    try {
      const request = followRequests.find(req => req.fromUserId === requesterId);
      if (request) {
        await SocialService.respondToFollowRequest(request.id, action === 'accept' ? 'accepted' : 'rejected');
      }
    } catch (err) {
      console.error(`Error ${action}ing follow request:`, err);
      setError(`Failed to ${action} request. Please try again.`);
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!currentUser) return;
    
    try {
      await SocialService.unfollow(currentUser.uid, userId);
    } catch (err) {
      console.error('Error unfollowing user:', err);
      setError('Failed to unfollow user. Please try again.');
    }
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) return;
    
    try {
      await SocialService.sendFollowRequest(currentUser.uid, userId);
    } catch (err) {
      console.error('Error following user:', err);
      setError('Failed to follow user. Please try again.');
    }
  };

  // Helper function to get user data for display
  const getUserData = (item: FollowRequest | Follow, type: 'request' | 'following' | 'follower'): UserData => {
    let userId = '';
    
    if (type === 'request') {
      const request = item as FollowRequest;
      userId = request.fromUserId;
    } else if (type === 'following') {
      const follow = item as Follow;
      userId = follow.followingId;
    } else {
      const follow = item as Follow;
      userId = follow.followerId;
    }
    
    // Get user data from cache or return fallback
    return userDataMap.get(userId) || {
      id: userId,
      displayName: `User ${userId.slice(0, 6)}`,
      avatar: '',
      department: 'Film Industry'
    };
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'requests':
        return {
          title: 'Follow Requests',
          icon: <UserPlus className="w-4 h-4" />,
          data: followRequests,
          emptyMessage: 'No pending follow requests',
          showActions: true
        };
      case 'following':
        return {
          title: 'Following',
          icon: <UserCheck className="w-4 h-4" />,
          data: following,
          emptyMessage: 'Not following anyone yet',
          showActions: false
        };
      case 'followers':
        return {
          title: 'Followers',
          icon: <Users className="w-4 h-4" />,
          data: followers,
          emptyMessage: 'No followers yet',
          showActions: false
        };
      default:
        return {
          title: 'Follow Requests',
          icon: <UserPlus className="w-4 h-4" />,
          data: followRequests,
          emptyMessage: 'No pending follow requests',
          showActions: true
        };
    }
  };

  const tabData = getTabData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600"></div>
              <span className="ml-3 text-gray-700 font-medium">Loading your social connections...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-1">
                Social Dashboard
              </h1>
              <p className="text-gray-600 text-sm">Connect with your film industry network</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{followRequests.length} pending requests</span>
              <span>•</span>
              <span>{following.length} following</span>
              <span>•</span>
              <span>{followers.length} followers</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <nav className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <UserPlus className="w-3 h-3" />
              <span>Requests ({followRequests.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                activeTab === 'following'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Following ({following.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('followers')}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 ${
                activeTab === 'followers'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Followers ({followers.length})</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <div className="text-white">
                    {tabData.icon}
                  </div>
                </div>
                <span>{tabData.title}</span>
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm"
                  />
                </div>
                <Button variant="ghost" size="sm" className="bg-white/50 backdrop-blur-sm p-2">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* User List */}
            {tabData.data.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-gray-400">
                    {tabData.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">{tabData.emptyMessage}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tabData.data.map((item) => {
                  const userData = getUserData(item, activeTab === 'requests' ? 'request' : activeTab === 'following' ? 'following' : 'follower');
                  // For followers tab, check if we already follow this user
                  const isAlreadyFollowing = activeTab === 'followers' && followingSet.has(userData.id);
                  return (
                    <div 
                      key={userData.id} 
                      className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:bg-white/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={userData.avatar || '/bust-avatar.svg'}
                              alt={userData.displayName || 'User'}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                              onError={e => (e.currentTarget.src = '/bust-avatar.svg')}
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border border-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                              {userData.displayName}
                            </h3>
                            {userData.department && (
                              <p className="text-gray-600 text-sm mb-1">{userData.department}</p>
                            )}
                            <span className="text-blue-600 font-medium text-xs">
                              {activeTab === 'requests' ? 'Wants to follow you' : 
                               activeTab === 'following' ? 'You are following' : 
                               'Following you'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {activeTab === 'requests' && (
                            <>
                              <Button
                                onClick={() => handleFollowRequest(userData.id, 'accept')}
                                className="btn-accept"
                              >
                                Accept
                              </Button>
                              <Button
                                onClick={() => handleFollowRequest(userData.id, 'reject')}
                                className="bg-white hover:bg-gray-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium border border-blue-600 transition-colors"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {activeTab === 'following' && (
                            <button
                              onClick={() => handleUnfollow(userData.id)}
                              className="bg-white hover:bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-medium border border-gray-300 transition-colors mr-2"
                            >
                              Unfollow
                            </button>
                          )}
                          {activeTab === 'followers' && !isAlreadyFollowing && (
                            <Button
                              onClick={() => handleFollow(userData.id)}
                              className="btn-follow-back"
                            >
                              Follow Back
                            </Button>
                          )}
                          {activeTab === 'followers' && isAlreadyFollowing && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">Following</span>
                          )}
                          <Button
                            className="bg-white hover:bg-gray-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium border border-blue-600 transition-colors flex items-center gap-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialDashboard;
