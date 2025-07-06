import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SocialService } from '../utilities/socialService';
import { Profile, getProfileId, getDisplayName, getPhotoUrl, isCrewProfile } from '../types/Profile';
import { Button } from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';
import { Search, UserCheck, Users, UserPlus, UserX, Bell, Check, X, MoreHorizontal } from 'lucide-react';

type TabType = 'following' | 'followers' | 'discover' | 'requests' | 'notifications';

interface UserCardProps {
  profile: Profile & { photoURL?: string; bio?: string };
  action?: React.ReactNode;
  showBio?: boolean;
  className?: string;
}

const UserCard = React.memo(({ profile, action, showBio = true, className = '' }: UserCardProps) => (
  <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={getPhotoUrl(profile)} alt={getDisplayName(profile)} />
            <AvatarFallback className="bg-blue-50 text-blue-600">
              {getDisplayName(profile)
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{getDisplayName(profile)}</h3>
            {showBio && profile.bio && (
              <p className="text-sm text-gray-500 line-clamp-2">{profile.bio}</p>
            )}
            {isCrewProfile(profile) && profile.jobTitles?.[0]?.title && (
              <p className="text-xs text-gray-500 mt-1">
                {profile.jobTitles[0].title}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex-shrink-0 ml-2">{action}</div>}
      </div>
    </div>
  </div>
));

const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  children: React.ReactNode;
}> = ({ active, onClick, icon: Icon, count, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-lg transition-all ${
      active 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
    <span>{children}</span>
    {count !== undefined && count > 0 && (
      <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        {count}
      </span>
    )}
  </button>
);

const SocialPage: React.FC = () => {
  const { currentUser: user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState<Profile[]>([]);
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<Profile[]>([]);
  const [followRequests, setFollowRequests] = useState<Profile[]>([]);

  const loadData = useCallback(async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    try {
      const crewProfiles = await SocialService.getCrewProfiles();
      
      // Convert to Profile type with proper type safety
      const profiles = crewProfiles.map(profile => {
        const id = ('id' in profile ? profile.id : profile.uid || `crew-${Math.random().toString(36).substr(2, 9)}`) as string;
        const displayName = ('name' in profile ? profile.name : 'displayName' in profile ? profile.displayName : 'Unknown User') as string;
        const photoURL = ('profileImageUrl' in profile ? profile.profileImageUrl : 'photoURL' in profile ? profile.photoURL : '') as string;
        const bio = ('bio' in profile ? profile.bio : '') as string;
        
        return {
          ...profile,
          id,
          uid: 'uid' in profile ? profile.uid : id,
          displayName,
          photoURL,
          bio,
        } as Profile;
      });
      
      // Set sample data for demonstration
      setFollowing(profiles.slice(0, 5));
      setFollowers(profiles.slice(5, 10));
      setSuggestedUsers(profiles.slice(10, 15));
      setFollowRequests(profiles.slice(15, 20));
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFollowChange = async (userId: string, follow: boolean) => {
    try {
      if (follow) {
        await SocialService.sendFollowRequest(userId);
      } else {
        await SocialService.unfollow(userId);
      }
      await loadData(); // Refresh data after change
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  const handleFollowRequest = async (userId: string, action: 'accept' | 'reject') => {
    try {
      await SocialService.respondToFollowRequest(userId, action === 'accept');
      await loadData(); // Refresh data after change
    } catch (error) {
      console.error(`Error ${action}ing follow request:`, error);
    }
  };

  const filteredFollowing = following.filter(profile =>
    getDisplayName(profile).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (isCrewProfile(profile) && profile.jobTitles?.[0]?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredFollowers = followers.filter(profile =>
    getDisplayName(profile).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (isCrewProfile(profile) && profile.jobTitles?.[0]?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSuggested = suggestedUsers.filter(profile =>
    getDisplayName(profile).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (isCrewProfile(profile) && profile.jobTitles?.[0]?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRequests = followRequests.filter(profile =>
    getDisplayName(profile).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (isCrewProfile(profile) && profile.jobTitles?.[0]?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Network</h1>
          <p className="text-gray-500">Connect with crew members and discover new professionals</p>
        </div>
        <div className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search people..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-8 p-1 bg-gray-100 rounded-xl w-full overflow-x-auto">
        <TabButton 
          active={activeTab === 'following'}
          onClick={() => setActiveTab('following')}
          icon={UserCheck}
        >
          Following
        </TabButton>
        <TabButton 
          active={activeTab === 'followers'}
          onClick={() => setActiveTab('followers')}
          icon={Users}
        >
          Followers
        </TabButton>
        <TabButton 
          active={activeTab === 'discover'}
          onClick={() => setActiveTab('discover')}
          icon={UserPlus}
        >
          Discover
        </TabButton>
        <TabButton 
          active={activeTab === 'requests'}
          onClick={() => setActiveTab('requests')}
          count={followRequests.length}
          icon={UserX}
        >
          Requests
        </TabButton>
        <TabButton 
          active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
          icon={Bell}
        >
          Notifications
        </TabButton>
      </div>

      <div className="space-y-6">
        {activeTab === 'following' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">People You Follow</h2>
            {filteredFollowing.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFollowing.map(profile => (
                  <UserCard
                    key={getProfileId(profile)}
                    profile={profile}
                    action={
                      <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => handleFollowChange(getProfileId(profile), false)}
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Unfollow
                      </Button>
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Not following anyone yet</h3>
                <p className="text-gray-500 mt-1">When you follow people, they'll appear here</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('discover')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Discover People
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'followers' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Followers</h2>
            {filteredFollowers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFollowers.map(profile => {
                  const isFollowingUser = following.some(p => getProfileId(p) === getProfileId(profile));
                  return (
                    <UserCard
                      key={getProfileId(profile)}
                      profile={profile}
                      action={
                        <Button
                          variant={isFollowingUser ? 'outline' : 'default'}
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => handleFollowChange(getProfileId(profile), !isFollowingUser)}
                        >
                          {isFollowingUser ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Unfollow
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Follow Back
                            </>
                          )}
                        </Button>
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No followers yet</h3>
                <p className="text-gray-500 mt-1">When people follow you, they'll appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'discover' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Discover People</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600"
                onClick={loadData}
              >
                Refresh
              </Button>
            </div>
            {filteredSuggested.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSuggested.map(profile => {
                  const isFollowingUser = following.some(p => getProfileId(p) === getProfileId(profile));
                  return (
                    <UserCard
                      key={getProfileId(profile)}
                      profile={profile}
                      action={
                        <Button
                          variant={isFollowingUser ? 'outline' : 'default'}
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => handleFollowChange(getProfileId(profile), !isFollowingUser)}
                        >
                          {isFollowingUser ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Unfollow
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No suggestions found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or check back later</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Follow Requests</h2>
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map(profile => (
                  <div key={getProfileId(profile)} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={getPhotoUrl(profile)} alt={getDisplayName(profile)} />
                          <AvatarFallback className="bg-blue-50 text-blue-600">
                            {getDisplayName(profile)
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-gray-900">{getDisplayName(profile)}</h3>
                          <p className="text-sm text-gray-500">Wants to follow you</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleFollowRequest(getProfileId(profile), 'reject')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleFollowRequest(getProfileId(profile), 'accept')}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                <UserCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No pending requests</h3>
                <p className="text-gray-500 mt-1">When someone requests to follow you, it will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No new notifications</h3>
            <p className="text-gray-500 mt-1">When you have notifications, they'll appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPage;
