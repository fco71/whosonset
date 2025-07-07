import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SocialService } from '../utilities/socialService.v2';
import { SocialUser, TabType, UserCardProps, TabButtonProps, Notification } from '../types/socialPage';
import { Button } from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Search, UserCheck, Users, UserPlus, UserX, Bell, Check, X, MoreHorizontal } from 'lucide-react';

// Helper function to get display name from profile
const getDisplayName = (profile: SocialUser): string => {
  return profile.displayName || profile.name || 'User';
};

// Helper function to get photo URL from profile
const getPhotoUrl = (profile: SocialUser): string | undefined => {
  return profile.photoURL || profile.profileImageUrl;
};

// Memoized UserCard component for better performance
const UserCard = React.memo(({ profile, action, showBio = true, className = '' }: UserCardProps) => {
  const displayName = getDisplayName(profile);
  const photoUrl = getPhotoUrl(profile);
  const jobTitle = profile.jobTitles?.[0]?.title || profile.jobTitle;
  
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={photoUrl} alt={displayName} />
              <AvatarFallback className="bg-blue-50 text-blue-600">
                {displayName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{displayName}</h3>
              {showBio && profile.bio && (
                <p className="text-sm text-gray-500 line-clamp-2">{profile.bio}</p>
              )}
              {jobTitle && (
                <p className="text-xs text-gray-500 mt-1">
                  {jobTitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0 ml-2">{action}</div>}
        </div>
      </div>
    </div>
  );
});

// TabButton component
const TabButton: React.FC<TabButtonProps> = ({ 
  active, 
  onClick, 
  icon: Icon, 
  count, 
  children 
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-lg transition-all relative ${
      active 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
    <span>{children}</span>
    {count !== undefined && count > 0 && (
      <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        {count > 99 ? '99+' : count}
      </span>
    )}
  </button>
);

// Skeleton loader for user cards
const UserCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div className="p-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  </div>
);

const SocialPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for different data types
  const [following, setFollowing] = useState<SocialUser[]>([]);
  const [followers, setFollowers] = useState<SocialUser[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SocialUser[]>([]);
  const [followRequests, setFollowRequests] = useState<SocialUser[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load data based on active tab
  const loadData = useCallback(async () => {
    if (!currentUser?.uid) return;
    
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'following':
          const followingData = await SocialService.getFollowing(currentUser.uid);
          setFollowing(followingData);
          break;
          
        case 'followers':
          const followersData = await SocialService.getFollowers(currentUser.uid);
          setFollowers(followersData);
          break;
          
        case 'discover':
          const suggested = await SocialService.getSuggestedUsers(currentUser.uid);
          setSuggestedUsers(suggested as SocialUser[]);
          break;
          
        case 'requests':
          const requests = await SocialService.getFollowRequests(currentUser.uid);
          setFollowRequests(requests);
          break;
          
        case 'notifications':
          // TODO: Implement notifications
          setNotifications([]);
          break;
      }
    } catch (error) {
      console.error(`Error loading ${activeTab} data:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentUser?.uid]);

  // Load data when tab changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle follow action
  const handleFollow = async (userId: string) => {
    if (!currentUser?.uid) return;
    
    try {
      await SocialService.sendFollowRequest(currentUser.uid, userId);
      // Update UI optimistically
      if (activeTab === 'discover') {
        setSuggestedUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, isFollowing: true, status: 'pending' } : user
          )
        );
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  // Handle unfollow action
  const handleUnfollow = async (userId: string) => {
    if (!currentUser?.uid) return;
    
    try {
      await SocialService.unfollow(currentUser.uid, userId);
      // Update UI optimistically
      if (activeTab === 'following') {
        setFollowing(prev => prev.filter(user => user.id !== userId));
      } else if (activeTab === 'discover') {
        setSuggestedUsers(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, isFollowing: false, status: undefined } : user
          )
        );
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  // Handle follow request response
  const handleFollowRequest = async (userId: string, accept: boolean) => {
    if (!currentUser?.uid) return;
    
    try {
      // Find the follow request
      const request = followRequests.find(req => req.id === userId);
      if (!request) return;
      
      // Update UI optimistically
      setFollowRequests(prev => prev.filter(req => req.id !== userId));
      
      // Call the service
      await SocialService.respondToFollowRequest(request.id, accept);
      
      // If accepted, add to followers
      if (accept) {
        const profile = await SocialService.getProfile(userId);
        if (profile) {
          setFollowers(prev => [
            { ...profile, isFollower: true },
            ...prev
          ]);
        }
      }
    } catch (error) {
      console.error('Error responding to follow request:', error);
      // Revert UI on error
      loadData();
    }
  };

  // Filter users based on search query
  const filterUsers = (users: SocialUser[]) => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(user => {
      const displayName = user.displayName || user.name || '';
      const jobTitle = user.jobTitles?.[0]?.title || '';
      
      return (
        displayName.toLowerCase().includes(query) ||
        (user.bio && user.bio.toLowerCase().includes(query)) ||
        jobTitle.toLowerCase().includes(query) ||
        (user.jobTitles?.some(job => 
          job.title?.toLowerCase().includes(query) || 
          (job.department && job.department.toLowerCase().includes(query))
        ) || false)
      );
    });
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    let data: SocialUser[] = [];
    
    switch (activeTab) {
      case 'following':
        data = following;
        break;
      case 'followers':
        data = followers;
        break;
      case 'discover':
        data = suggestedUsers;
        break;
      case 'requests':
        data = followRequests;
        break;
      case 'notifications':
        return []; // Notifications are handled separately
      default:
        return [];
    }
    
    return filterUsers(data);
  };

  // Render action button based on user status
  const renderActionButton = (user: SocialUser) => {
    if (activeTab === 'requests') {
      return (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-xs"
            onClick={() => handleFollowRequest(user.id, true)}
          >
            <Check className="h-3.5 w-3.5 mr-1" /> Accept
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-xs text-gray-600 hover:bg-gray-100"
            onClick={() => handleFollowRequest(user.id, false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      );
    }
    
    if (user.isFollowing) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-3 text-xs"
          onClick={() => handleUnfollow(user.id)}
        >
          <UserCheck className="h-3.5 w-3.5 mr-1" /> Following
        </Button>
      );
    }
    
    if (user.status === 'pending') {
      return (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-3 text-xs text-gray-500"
          disabled
        >
          <UserPlus className="h-3.5 w-3.5 mr-1" /> Requested
        </Button>
      );
    }
    
    return (
      <Button 
        variant="primary" 
        size="sm" 
        className="h-8 px-3 text-xs"
        onClick={() => handleFollow(user.id)}
      >
        <UserPlus className="h-3.5 w-3.5 mr-1" /> Follow
      </Button>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    const currentData = getCurrentData();
    
    if (activeTab === 'notifications') {
      return (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">When you get notifications, they'll appear here.</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      );
    }
    
    if (currentData.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'discover' 
              ? 'Try searching for something else.'
              : `You don't have any ${activeTab} yet.`}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentData.map(user => (
          <UserCard 
            key={user.id} 
            profile={user} 
            action={renderActionButton(user)}
            showBio={activeTab !== 'notifications' as TabType}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with other professionals in your network
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="relative rounded-md shadow-sm max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
          <TabButton
            active={activeTab === 'following'}
            onClick={() => setActiveTab('following')}
            icon={UserCheck}
            count={following.length}
          >
            Following
          </TabButton>
          
          <TabButton
            active={activeTab === 'followers'}
            onClick={() => setActiveTab('followers')}
            icon={Users}
            count={followers.length}
          >
            Followers
          </TabButton>
          
          <TabButton
            active={activeTab === 'discover'}
            onClick={() => setActiveTab('discover')}
            icon={Search}
          >
            Discover
          </TabButton>
          
          <TabButton
            active={activeTab === 'requests'}
            onClick={() => setActiveTab('requests')}
            icon={UserPlus}
            count={followRequests.length}
          >
            Requests
          </TabButton>
          
          <TabButton
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
            icon={Bell}
            count={notifications.length}
          >
            Notifications
          </TabButton>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default SocialPage;
