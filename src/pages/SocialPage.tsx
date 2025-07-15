import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserCheck, UserPlus, Search, Bell } from 'lucide-react';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { SocialService } from '../utilities/socialService.v2';
import { SocialUser } from '../types/socialPage';


const TABS = [
  { key: 'following', label: 'Following', icon: UserCheck },
  { key: 'followers', label: 'Followers', icon: Users },
  { key: 'discover', label: 'Discover', icon: Search },
  { key: 'requests', label: 'Requests', icon: UserPlus },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

const SocialPage: React.FC = () => {

  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState<SocialUser[]>([]);
  const [followers, setFollowers] = useState<SocialUser[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SocialUser[]>([]);
  const [followRequests, setFollowRequests] = useState<SocialUser[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]); // Adjust type if needed

  // UserCard skeleton
  const UserCardSkeleton = () => (
    <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col items-center animate-pulse">
      <div className="h-16 w-16 rounded-full bg-gray-200 mb-2" />
      <div className="h-4 w-24 bg-gray-200 mb-1 rounded" />
      <div className="h-3 w-16 bg-gray-100 rounded" />
    </div>
  );

  // UserCard
  const UserCard = ({ user }: { user: SocialUser }) => (
    <div className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col items-center">
      <div className="h-16 w-16 rounded-full bg-gray-100 mb-2 flex items-center justify-center text-xl font-bold text-blue-500">
        {user.displayName?.[0] || user.name?.[0] || '?'}
      </div>
      <div className="font-semibold text-gray-900 mb-1">{user.displayName || user.name}</div>
      <div className="text-xs text-gray-500">{user.bio || user.email || ''}</div>
    </div>
  );

  // Filter users by search
  const filterUsers = (users: SocialUser[]) => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u =>
      (u.displayName || u.name || '').toLowerCase().includes(q) ||
      (u.bio && u.bio.toLowerCase().includes(q))
    );
  };

  // Load data for the current tab
  const loadData = useCallback(async () => {
    if (!currentUser?.uid) return;
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'following':
          setFollowing(await SocialService.getFollowing(currentUser.uid));
          break;
        case 'followers':
          setFollowers(await SocialService.getFollowers(currentUser.uid));
          break;
        case 'discover':
          setSuggestedUsers(await SocialService.getSuggestedUsers(currentUser.uid));
          break;
        case 'requests':
          setFollowRequests(await SocialService.getFollowRequests(currentUser.uid));
          break;
        case 'notifications':
          setNotifications([]); // Implement if you have notifications
          break;
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentUser?.uid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Get current data for tab
  let currentData: SocialUser[] = [];
  if (activeTab === 'following') currentData = following;
  if (activeTab === 'followers') currentData = followers;
  if (activeTab === 'discover') currentData = suggestedUsers;
  if (activeTab === 'requests') currentData = followRequests;

  // Render user list or skeletons/empty
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      );
    }
    const filtered = filterUsers(currentData);
    if (!filtered.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-400">
          <span className="mb-2">
            {activeTab === 'following' && <UserCheck className="h-10 w-10" />}
            {activeTab === 'followers' && <Users className="h-10 w-10" />}
            {activeTab === 'discover' && <Search className="h-10 w-10" />}
            {activeTab === 'requests' && <UserPlus className="h-10 w-10" />}
            {activeTab === 'notifications' && <Bell className="h-10 w-10" />}
          </span>
          <div className="text-lg font-semibold text-gray-700 mb-1">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </div>
          <div className="text-sm text-gray-500">
            {activeTab === 'discover'
              ? 'Try searching for someone to connect with.'
              : `No ${activeTab} found.`}
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Social</h1>
          <p className="text-gray-600 text-base">Connect with other professionals in your network.</p>
        </div>
        <div className="mt-4 sm:mt-0 w-full sm:w-auto relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <Input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10"
            aria-label="Search for people to connect with"
          />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-1 -mx-2 px-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-300 ${activeTab === tab.key ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'}`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default SocialPage;