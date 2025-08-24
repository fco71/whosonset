import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SocialService } from '../utilities/socialService.v2';
import { MessagingService, ConversationSummary } from '../utilities/messagingService';
import { SocialUser, TabType, UserCardProps, TabButtonProps, Notification } from '../types/socialPage';
import { Button } from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Search, UserCheck, Users, UserPlus, UserX, Bell, Check, X, MoreHorizontal, MessageCircle, Send, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Helper function to get display name from profile
const getDisplayName = (profile: SocialUser): string => {
  return profile.displayName || profile.name || 'User';
};

// Helper function to get photo URL from profile
const getPhotoUrl = (profile: SocialUser): string => {
  return profile.profileImageUrl || profile.photoURL || '/bust-avatar.svg';
};

// Memoized UserCard component for better performance
const UserCard = React.memo(({ profile, action, showBio = true, className = '' }: UserCardProps) => {
  const displayName = getDisplayName(profile);
  const photoUrl = getPhotoUrl(profile);
  const jobTitle = profile.jobTitles?.[0]?.title || profile.jobTitle;
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      className={`relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile header with gradient overlay on hover */}
      <div className="relative h-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-400/10 dark:to-indigo-400/10 transition-opacity duration-300" />
        )}
        <div className="absolute -bottom-8 left-4">
          <div className="relative h-20 w-20 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 overflow-hidden shadow-md">
            <Avatar className="h-full w-full">
              <AvatarImage src={photoUrl} alt={displayName} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                {displayName
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      
      <div className="pt-12 px-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{displayName}</h3>
              {profile.verified && (
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            {jobTitle && (
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                {jobTitle}
              </p>
            )}
            
            {showBio && profile.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {profile.bio}
              </p>
            )}
            
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.skills?.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            {action}
          </div>
        </div>
      </div>
    </div>
  );
});

// TabButton component with improved styling and animations
const TabButton: React.FC<TabButtonProps> = ({ 
  active, 
  onClick, 
  icon: Icon, 
  count, 
  children 
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
      active 
        ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md' 
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
    }`}
  >
    <Icon className={`h-4 w-4 mr-2 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="relative">
      {children}
      {active && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/80 rounded-full" />
      )}
    </span>
    {count !== undefined && count > 0 && (
      <span 
        className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200 ${
          active 
            ? 'bg-white/20 text-white' 
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/70'
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// Skeleton loader for user cards with shimmer effect
const UserCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden relative group">
    {/* Shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700/50 dark:to-gray-800 animate-pulse opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
    
    <div className="relative z-10 p-4">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-gray-800" />
        </div>
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-40 rounded-md" />
          <div className="flex space-x-2 pt-1">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// New MessagePane component
const MessagePane: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => void;
}> = ({ isOpen, onClose, onStartConversation }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load conversations
  useEffect(() => {
    if (!isOpen || !currentUser?.uid) return;

    setIsLoading(true);
    const unsubscribe = MessagingService.subscribeToConversations(
      currentUser.uid,
      (conversations) => {
        setConversations(conversations);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isOpen, currentUser?.uid]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter(conv => 
      conv.userName.toLowerCase().includes(query) ||
      (conv.lastMessage && conv.lastMessage.toLowerCase().includes(query))
    );
  }, [conversations, searchQuery]);

  const formatTime = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('social.messages')}</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartConversation('')}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? t('social.messaging.noConversationsFound') : t('social.empty.noMessages')}
              </h3>
              <p className="text-xs text-gray-500">
                {searchQuery 
                  ? 'Try a different search term'
                  : t('social.messaging.selectContact')
                }
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => onStartConversation(conversation.userId)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.userAvatar} alt={conversation.userName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                        {conversation.userName
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conversation.userName}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {conversation.unreadCount > 0 && (
                          <Badge className="h-5 w-5 p-0 text-xs bg-blue-600 text-white">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                    
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                    )}
                    
                    {conversation.userRole && (
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.userRole}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// New StartConversationModal component
const StartConversationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => void;
}> = ({ isOpen, onClose, onStartConversation }) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SocialUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search for users to start conversation with
  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim() || !currentUser?.uid) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Get following and followers for better results
      const [following, followers] = await Promise.all([
        SocialService.getFollowing(currentUser.uid),
        SocialService.getFollowers(currentUser.uid)
      ]);

      const allUsers = [...following, ...followers];
      const filtered = allUsers.filter(user => 
        user.id !== currentUser.uid &&
        (user.name?.toLowerCase().includes(query.toLowerCase()) ||
         user.displayName?.toLowerCase().includes(query.toLowerCase()) ||
         user.email?.toLowerCase().includes(query.toLowerCase()))
      );

      setSearchResults(filtered.slice(0, 10));
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Message</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No people found' : 'Search for people to message'}
              </h3>
              <p className="text-xs text-gray-500">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Start typing to search for people in your network'
                }
              </p>
            </div>
          ) : (
            <div className="p-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => {
                    onStartConversation(user.id);
                    onClose();
                  }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getPhotoUrl(user)} alt={getDisplayName(user)} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                      {getDisplayName(user)
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getDisplayName(user)}
                    </h4>
                    {user.jobTitles?.[0]?.title && (
                      <p className="text-xs text-gray-500 truncate">
                        {user.jobTitles[0].title}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SocialPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('following');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // New state for messaging
  const [showMessagePane, setShowMessagePane] = useState(false);
  const [showStartConversation, setShowStartConversation] = useState(false);
  
  // State for different data types
  const [following, setFollowing] = useState<SocialUser[]>([]);
  const [followers, setFollowers] = useState<SocialUser[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SocialUser[]>([]);
  const [followRequests, setFollowRequests] = useState<SocialUser[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

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
          // Basic notifications implementation
          const userNotifications = await SocialService.getNotifications?.(currentUser.uid) || [];
          setNotifications(userNotifications);
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
            <Check className="h-3.5 w-3.5 mr-1" /> {t('social.actions.accept')}
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
    
    // For following/followers, show both follow status and message button
    if (user.isFollowing || activeTab === 'followers') {
      return (
        <div className="flex space-x-2">
          {user.isFollowing && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 text-xs"
              onClick={() => handleUnfollow(user.id)}
            >
              <UserCheck className="h-3.5 w-3.5 mr-1" /> {t('social.statusText.following')}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-xs text-blue-600 hover:bg-blue-50"
            onClick={() => handleStartConversation(user.id)}
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>
        </div>
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
    
    // For discover tab, show follow button and message button if already following
    if (activeTab === 'discover' && user.isFollowing) {
      return (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-3 text-xs"
            onClick={() => handleUnfollow(user.id)}
          >
            <UserCheck className="h-3.5 w-3.5 mr-1" /> {t('social.statusText.following')}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-xs text-blue-600 hover:bg-blue-50"
            onClick={() => handleStartConversation(user.id)}
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>
        </div>
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

  // Handle starting a conversation
  const handleStartConversation = (userId: string) => {
    if (!userId) {
      setShowStartConversation(true);
      setShowMessagePane(false);
    } else {
      // Navigate to chat or open chat interface
      // For now, we'll just close the modals
      setShowMessagePane(false);
      setShowStartConversation(false);
      // TODO: Implement actual chat navigation
      console.log('Starting conversation with:', userId);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
            <div className="text-center py-8">
              <Bell className="h-10 w-10 mx-auto text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">{t('social.empty.noNotifications')}</h3>
          <p className="mt-1 text-xs text-gray-500">When you get notifications, they'll appear here.</p>
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
        <div className="text-center py-8">
          <Users className="h-10 w-10 mx-auto text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} found</h3>
          <p className="mt-1 text-xs text-gray-500">
            {activeTab === 'discover' 
              ? 'Try searching for something else.'
              : `You don't have any ${activeTab} yet.`}
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      <div className="sm:flex sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('social.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('social.subtitle')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMessagePane(true)}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t('social.messages')}</span>
          </Button>
          <div className="relative rounded-md shadow-sm max-w-xs">
            <label htmlFor="search-people" className="sr-only">{t('social.searchPlaceholder')}</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              id="search-people"
              name="searchPeople"
              placeholder={t('social.searchPeople')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
              aria-label={t('social.searchPlaceholder')}
            />
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-1 -mx-2 px-2">
          <TabButton
            active={activeTab === 'following'}
            onClick={() => setActiveTab('following')}
            icon={UserCheck}
            count={following.length}
          >
            {t('social.tabs.following')}
          </TabButton>
          
          <TabButton
            active={activeTab === 'followers'}
            onClick={() => setActiveTab('followers')}
            icon={Users}
            count={followers.length}
          >
            {t('social.tabs.followers')}
          </TabButton>
          
          <TabButton
            active={activeTab === 'discover'}
            onClick={() => setActiveTab('discover')}
            icon={Search}
          >
            {t('social.tabs.discover')}
          </TabButton>
          
          <TabButton
            active={activeTab === 'requests'}
            onClick={() => setActiveTab('requests')}
            icon={UserPlus}
            count={followRequests.length}
          >
            {t('social.tabs.requests')}
          </TabButton>
          
          <TabButton
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
            icon={Bell}
            count={notifications.length}
          >
            {t('social.tabs.notifications')}
          </TabButton>
        </div>
      </div>
      
      {renderContent()}

      {/* Message Pane */}
      <MessagePane
        isOpen={showMessagePane}
        onClose={() => setShowMessagePane(false)}
        onStartConversation={handleStartConversation}
      />

      {/* Start Conversation Modal */}
      <StartConversationModal
        isOpen={showStartConversation}
        onClose={() => setShowStartConversation(false)}
        onStartConversation={handleStartConversation}
      />
    </div>
  );
};

export default SocialPage;
