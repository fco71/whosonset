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
  Filter,
  Heart,
  Star
} from 'lucide-react';

const SocialDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'following' | 'followers'>('requests');
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FollowRequest[]>([]);
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadSocialData();
    }
  }, [currentUser]);

  const loadSocialData = () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Set up real-time subscriptions
      SocialService.subscribeToFollowRequests(currentUser.uid, (requests) => {
        setFollowRequests(requests);
        setLoading(false);
      });
      
      SocialService.subscribeToOutgoingFollowRequests(currentUser.uid, (requests) => {
        setOutgoingRequests(requests);
      });
      
      SocialService.subscribeToFollowing(currentUser.uid, (follows) => {
        setFollowing(follows);
      });
      
      SocialService.subscribeToFollowers(currentUser.uid, (follows) => {
        setFollowers(follows);
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
  const getUserData = (item: FollowRequest | Follow, type: 'request' | 'following' | 'follower') => {
    let userId = '';
    let userName = '';
    
    if (type === 'request') {
      const request = item as FollowRequest;
      userId = request.fromUserId;
      userName = request.fromUserName || 'Unknown User';
    } else if (type === 'following') {
      const follow = item as Follow;
      userId = follow.followingId;
      userName = 'User'; // We'll need to fetch user details
    } else {
      const follow = item as Follow;
      userId = follow.followerId;
      userName = 'User'; // We'll need to fetch user details
    }
    
    return {
      id: userId,
      displayName: userName,
      avatar: '', // We'll need to fetch user avatar
      department: 'Film Industry'
    };
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'requests':
        return {
          title: 'Follow Requests',
          icon: <UserPlus className="w-5 h-5" />,
          data: followRequests,
          emptyMessage: 'No pending follow requests',
          showActions: true
        };
      case 'following':
        return {
          title: 'Following',
          icon: <UserCheck className="w-5 h-5" />,
          data: following,
          emptyMessage: 'Not following anyone yet',
          showActions: false
        };
      case 'followers':
        return {
          title: 'Followers',
          icon: <Users className="w-5 h-5" />,
          data: followers,
          emptyMessage: 'No followers yet',
          showActions: false
        };
      default:
        return {
          title: 'Follow Requests',
          icon: <UserPlus className="w-5 h-5" />,
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
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <span className="ml-4 text-lg text-gray-700 font-medium">Loading your social connections...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Social Dashboard
              </h1>
              <p className="text-gray-600 text-lg">Connect with your film industry network</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <span className="text-blue-700 font-semibold">{followRequests.length} Pending</span>
              </div>
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <span className="text-green-700 font-semibold">{following.length} Following</span>
              </div>
              <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
                <span className="text-purple-700 font-semibold">{followers.length} Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900">{followRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Outgoing Requests</p>
                <p className="text-3xl font-bold text-gray-900">{outgoingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Following</p>
                <p className="text-3xl font-bold text-gray-900">{following.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Followers</p>
                <p className="text-3xl font-bold text-gray-900">{followers.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
          <nav className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Requests ({followRequests.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('following')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 ${
                activeTab === 'following'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Following ({following.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('followers')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 ${
                activeTab === 'followers'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Followers ({followers.length})</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <div className="text-white">
                    {tabData.icon}
                  </div>
                </div>
                <span>{tabData.title}</span>
              </h2>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                  />
                </div>
                <Button variant="ghost" size="sm" className="bg-white/50 backdrop-blur-sm">
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* User List */}
            {tabData.data.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-gray-400">
                    {tabData.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No users found</h3>
                <p className="text-gray-600 text-lg">{tabData.emptyMessage}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tabData.data.map((item) => {
                  const userData = getUserData(item, activeTab === 'requests' ? 'request' : activeTab === 'following' ? 'following' : 'follower');
                  return (
                    <div 
                      key={userData.id} 
                      className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:bg-white/80 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={userData.avatar || '/bust-avatar.svg'}
                              alt={userData.displayName || 'User'}
                              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                              onError={e => (e.currentTarget.src = '/bust-avatar.svg')}
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {userData.displayName || 'Unknown User'}
                            </h3>
                            <p className="text-gray-600 mb-1">{userData.department || 'Film Industry'}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>4.8</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4 text-red-500" />
                                <span>24</span>
                              </span>
                              <span>•</span>
                              <span className="text-blue-600 font-medium">
                                {activeTab === 'requests' ? 'Wants to follow you' : 
                                 activeTab === 'following' ? 'You are following' : 
                                 'Following you'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {activeTab === 'requests' && (
                            <>
                              <Button
                                onClick={() => handleFollowRequest(userData.id, 'accept')}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                              >
                                Accept
                              </Button>
                              <Button
                                onClick={() => handleFollowRequest(userData.id, 'reject')}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          
                          {activeTab === 'following' && (
                            <Button
                              onClick={() => handleUnfollow(userData.id)}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                              Unfollow
                            </Button>
                          )}
                          
                          {activeTab === 'followers' && (
                            <Button
                              onClick={() => handleFollow(userData.id)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                              Follow Back
                            </Button>
                          )}
                          
                          <Button 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
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
