import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserCheck, Users, UserPlus, UserX, Bell, Check, X, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SocialService } from '../utilities/socialService';
import { getProfileId, getDisplayName, getPhotoUrl, isCrewProfile } from '../types/Profile';

// Define a discriminated union type for profiles
type BaseProfile = {
  id: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
};

type CrewProfile = BaseProfile & {
  type: 'crew';
  uid: string;
  name: string;
  username: string;
  jobTitles: string[];
  residences: string[];
  isPublished: boolean;
};

type UserProfile = BaseProfile & {
  type: 'user';
  email: string;
  phoneNumber?: string;
};

type AppProfile = CrewProfile | UserProfile;

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

type TabValue = 'following' | 'followers' | 'discover' | 'requests' | 'notifications';

// Enhanced tab component with better styling
const TabButton = ({ 
  active, 
  onClick, 
  children,
  count,
  icon: Icon
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
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
        {count}
      </span>
    )}
  </button>
);

const SocialPage = () => {
  const auth = useAuth();
  const user = auth?.currentUser; // Access currentUser instead of user
  const [activeTab, setActiveTab] = useState<'connections' | 'requests' | 'discover' | 'notifications'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  // Define the profile state with proper typing
  const [allProfiles, setAllProfiles] = useState<AppProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<AppProfile[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<AppProfile[]>([]);
  const [sentRequests, setSentRequests] = useState<AppProfile[]>([]);
  const [connections, setConnections] = useState<AppProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  const loadData = useCallback(async () => {
    const currentUser = auth?.currentUser;
    if (!currentUser?.uid) return;
    
    setIsLoading(true);
    try {
      // Fetch crew profiles from the social service
      const profiles = await SocialService.getCrewProfiles();
      
      // Map the profiles to the correct shape
      const mappedProfiles = profiles.map((profile: any) => {
        const id = profile.id || '';
        const displayName = profile.displayName || profile.name || 'Unknown User';
        const photoURL = profile.photoURL || profile.profileImageUrl || '';
        const bio = profile.bio || '';
        
        if (isCrewProfile(profile as any)) {
          // Create a CrewProfile
          const crewProfile: CrewProfile = {
            id,
            type: 'crew',
            uid: (profile as any).uid || id,
            displayName,
            photoURL,
            bio,
            name: (profile as any).name || displayName,
            username: (profile as any).username || 
                     (profile as any).email ? String((profile as any).email).split('@')[0] : '',
            jobTitles: Array.isArray((profile as any).jobTitles) ? [...(profile as any).jobTitles] : [],
            residences: Array.isArray((profile as any).residences) ? [...(profile as any).residences] : [],
            isPublished: (profile as any).isPublished !== undefined ? Boolean((profile as any).isPublished) : true,
          };
          return crewProfile;
        } else {
          // Create a UserProfile
          const userProfile: UserProfile = {
            id,
            type: 'user',
            displayName,
            photoURL,
            bio,
            email: (profile as any).email || '',
            phoneNumber: (profile as any).phoneNumber,
          };
          return userProfile;
        }
      });
      
      setAllProfiles(mappedProfiles);
      setFilteredProfiles(mappedProfiles);
      setConnectionRequests(mappedProfiles.slice(0, 2));
      setSentRequests(mappedProfiles.slice(2, 4));
      setConnections(mappedProfiles.slice(4, 8));
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  // Load data on component mount and when active tab changes
  useEffect(() => {
    loadData();
  }, [activeTab, user?.uid]);

  // Filter profiles based on search query and active tab
  const filteredItems = useMemo(() => {
    const items = {
      connections: [...connections],
      requests: [...connectionRequests, ...sentRequests],
      discover: [...filteredProfiles],
      notifications: []
    }[activeTab] || [];

    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((p) => {
      const name = getDisplayName(p).toLowerCase();
      const bio = p.bio ? p.bio.toLowerCase() : '';
      return name.includes(query) || bio.includes(query);
    });
  }, [activeTab, connections, connectionRequests, sentRequests, filteredProfiles, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (value: 'connections' | 'requests' | 'discover' | 'notifications') => {
    setActiveTab(value);
    setSearchQuery('');
  };

  // Handle follow/unfollow action
  const handleFollowChange = async (profileId: string, follow: boolean) => {
    if (!user?.uid) return;
    
    try {
      if (follow) {
        await SocialService.sendFollowRequest(user.uid, profileId);
      } else {
        await SocialService.unfollow(user.uid, profileId);
      }
      await loadData();
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  // Handle follow request response (accept/reject)
  const handleFollowRequest = (userId: string, action: 'accept' | 'reject') => {
    // In a real app, you would update the database here
    console.log(`${action}ing follow request from ${userId}`);
    
    // Update local state
    if (action === 'accept') {
      const request = connectionRequests.find(p => getProfileId(p) === userId);
      if (request) {
        setConnections(prev => [...prev, request]);
        setConnectionRequests(prev => prev.filter(p => getProfileId(p) !== userId));
      }
    } else {
      setConnectionRequests(prev => prev.filter(p => getProfileId(p) !== userId));
    }
  };

  // Helper function to render user cards
  const renderUserCard = (profile: AppProfile, action?: React.ReactNode) => (
    <div key={getProfileId(profile)} className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        <img 
          src={getPhotoUrl(profile)} 
          alt={getDisplayName(profile)}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-gray-900">{getDisplayName(profile)}</p>
          {profile.bio && <p className="text-sm text-gray-500 line-clamp-1">{profile.bio}</p>}
        </div>
      </div>
      {action}
    </div>
  );

  // Render content based on active tab
  const renderTabContent = () => {
    if (!user) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Please sign in to view this page</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'connections':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Connections</h2>
            {connections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((profile: AppProfile) => (
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
              <p className="text-gray-500">You don't have any connections yet.</p>
            )}
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-4">
            {connectionRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Connection Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {connectionRequests.map((profile: AppProfile) => (
                    <UserCard
                      key={getProfileId(profile)}
                      profile={profile}
                      action={
                        <Button
                          variant="default"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => handleFollowRequest(getProfileId(profile), 'accept')}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Accept
                        </Button>
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            
            {sentRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Sent Requests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sentRequests.map((profile: AppProfile) => (
                    <UserCard
                      key={getProfileId(profile)}
                      profile={profile}
                      action={
                        <Button
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => handleFollowRequest(getProfileId(profile), 'reject')}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            
            {connectionRequests.length === 0 && sentRequests.length === 0 && (
              <p className="text-gray-500">No pending requests.</p>
            )}
          </div>
        );

      case 'discover':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Discover People</h2>
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map((profile: AppProfile) => (
                  <UserCard
                    key={getProfileId(profile)}
                    profile={profile}
                    action={
                      <Button
                        variant="default"
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => handleFollowChange(getProfileId(profile), true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No suggestions found.</p>
            )}
          </div>
        );

      case 'notifications':
      default:
        return (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No new notifications</h2>
            <p className="text-gray-500">Your notifications will appear here.</p>
          </div>
        );
    }
  };

  // User card component
  const UserCard = ({ profile, action, showBio = true }: { 
    profile: AppProfile; 
    action?: React.ReactNode;
    showBio?: boolean;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={getPhotoUrl(profile)} alt={getDisplayName(profile)} />
              <AvatarFallback>
                {getDisplayName(profile)
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900">{getDisplayName(profile)}</h3>
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
  );

  // Loading skeleton
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
      {/* Header */}
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

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        <TabButton 
          active={activeTab === 'connections'}
          onClick={() => setActiveTab('connections')}
          icon={UserCheck}
        >
          Connections
        </TabButton>
        <TabButton 
          active={activeTab === 'requests'}
          onClick={() => setActiveTab('requests')}
          count={connectionRequests.length}
          icon={UserX}
        >
          Requests
        </TabButton>
        <TabButton 
          active={activeTab === 'discover'}
          onClick={() => setActiveTab('discover')}
          icon={UserPlus}
        >
          Discover
        </TabButton>
        <TabButton 
          active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
          icon={Bell}
        >
          Notifications
        </TabButton>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SocialPage;
