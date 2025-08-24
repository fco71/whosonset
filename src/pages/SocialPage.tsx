import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, UserCheck, Users, UserPlus, UserX, Bell, Check, X, MoreHorizontal, MessageCircle, Send, Plus, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SocialService } from '../utilities/socialService';
import { MessagingService, ConversationSummary } from '../utilities/messagingService';
import { getProfileId, getDisplayName, getPhotoUrl, isCrewProfile } from '../types/Profile';
import { useTranslation } from 'react-i18next';

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
import { toast } from 'react-hot-toast';

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
  const { t } = useTranslation();
  const auth = useAuth();
  const user = auth?.currentUser; // Access currentUser instead of user
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'connections' | 'requests' | 'discover' | 'notifications'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  // Define the profile state with proper typing
  const [allProfiles, setAllProfiles] = useState<AppProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<AppProfile[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<AppProfile[]>([]);
  const [sentRequests, setSentRequests] = useState<AppProfile[]>([]);
  const [connections, setConnections] = useState<AppProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Messaging state
  const [showMessagePane, setShowMessagePane] = useState(false);
  const [showStartConversation, setShowStartConversation] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');

  // Load initial data
  const loadData = useCallback(async () => {
    const currentUser = auth?.currentUser;
    if (!currentUser?.uid) return;
    
    setIsLoading(true);
    try {
      // Only fetch crew profiles for discovery tab
      const profiles = await SocialService.getCrewProfiles();
      
      // Map the profiles to the correct shape for discovery
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
      
      // Set profiles for discovery only
      setAllProfiles(mappedProfiles);
      setFilteredProfiles(mappedProfiles);
      
      // Load ACTUAL user-specific social data
      try {
        // Helper function to fetch user profile data (using only crewProfiles)
        const fetchUserProfile = async (userId: string): Promise<AppProfile> => {
          try {
            // Only use crewProfiles collection (single source of truth)
            const { getDoc, doc } = await import('firebase/firestore');
            const { db } = await import('../firebase');
            
            const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
            if (crewDoc.exists()) {
              const crewData = crewDoc.data();
              // Use the same logic as discover section
              const id = crewData.id || userId;
              const displayName = crewData.displayName || crewData.name || 'Unknown User';
              const photoURL = crewData.photoURL || crewData.profileImageUrl || '';
              const bio = crewData.bio || '';
              
              return {
                id,
                type: 'crew' as const,
                uid: userId,
                displayName,
                photoURL,
                bio,
                name: crewData.name || displayName,
                username: crewData.username || (crewData.email ? String(crewData.email).split('@')[0] : ''),
                jobTitles: Array.isArray(crewData.jobTitles) ? [...crewData.jobTitles] : [],
                residences: Array.isArray(crewData.residences) ? [...crewData.residences] : [],
                isPublished: crewData.isPublished !== undefined ? Boolean(crewData.isPublished) : true,
              };
            }
            
            // Fallback if no profile found in crewProfiles
            return {
              id: userId,
              type: 'user' as const,
              displayName: `User ${userId.slice(0, 6)}`,
              photoURL: '',
              bio: '',
              email: ''
            };
          } catch (error) {
            console.error('Error fetching user profile:', error);
            return {
              id: userId,
              type: 'user' as const,
              displayName: `User ${userId.slice(0, 6)}`,
              photoURL: '',
              bio: '',
              email: ''
            };
          }
        };

        // Load incoming requests (incoming) - use subscription once
        const incomingRequestsPromise = new Promise<any[]>((resolve) => {
          const unsubscribe = SocialService.subscribeToFollowRequests(currentUser.uid, (requests) => {
            unsubscribe();
            resolve(requests);
          });
        });
        
        const realIncomingRequests = await incomingRequestsPromise;
        const mappedIncomingRequests = await Promise.all(
          realIncomingRequests.map(async (req: any) => {
            const userProfile = await fetchUserProfile(req.fromUserId);
            return { ...userProfile, requestId: req.id };
          })
        );
        setConnectionRequests(mappedIncomingRequests);
        
        // Load real sent requests (outgoing) - use subscription once
        const outgoingRequestsPromise = new Promise<any[]>((resolve) => {
          const unsubscribe = SocialService.subscribeToOutgoingFollowRequests(currentUser.uid, (requests) => {
            unsubscribe();
            resolve(requests);
          });
        });
        
        const realSentRequests = await outgoingRequestsPromise;
        const mappedSentRequests = await Promise.all(
          realSentRequests.map(async (req: any) => {
            const userProfile = await fetchUserProfile(req.toUserId);
            return userProfile;
          })
        );
        setSentRequests(mappedSentRequests);
        
      } catch (socialError) {
        console.log('Social data loading (expected for new users):', socialError);
        // For new users, these should be empty
        setConnectionRequests([]);
        setSentRequests([]);
        setConnections([]);
      }
      
    } catch (error) {
      console.error('Error loading profiles:', error);
      // Clear all data on error
      setAllProfiles([]);
      setFilteredProfiles([]);
      setConnectionRequests([]);
      setSentRequests([]);
      setConnections([]);
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  // Load data on component mount and when active tab changes
  useEffect(() => {
    // Clear the user cache to ensure new logic takes effect
    const clearCache = async () => {
      try {
        const { UserUtils } = await import('../utilities/userUtils');
        UserUtils.refreshUserCache();
      } catch (error) {
        console.error('Error clearing user cache:', error);
      }
    };
    clearCache();
    
    loadData();
  }, [activeTab, user?.uid]);

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam && ['connections', 'requests', 'discover', 'notifications'].includes(tabParam)) {
      setActiveTab(tabParam as 'connections' | 'requests' | 'discover' | 'notifications');
    }
  }, [location.search]);

  // Set up ongoing subscriptions for real-time updates
  useEffect(() => {
    const currentUser = auth?.currentUser;
    if (!currentUser?.uid) return;

    // Helper function to fetch user profile data
    const fetchUserProfile = async (userId: string): Promise<AppProfile> => {
      try {
        const { getDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        
        const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
        if (crewDoc.exists()) {
          const crewData = crewDoc.data();
          const id = crewData.id || userId;
          const displayName = crewData.displayName || crewData.name || 'Unknown User';
          const photoURL = crewData.photoURL || crewData.profileImageUrl || '';
          const bio = crewData.bio || '';
          
          return {
            id,
            type: 'crew' as const,
            uid: userId,
            displayName,
            photoURL,
            bio,
            name: crewData.name || displayName,
            username: crewData.username || (crewData.email ? String(crewData.email).split('@')[0] : ''),
            jobTitles: Array.isArray(crewData.jobTitles) ? [...crewData.jobTitles] : [],
            residences: Array.isArray(crewData.residences) ? [...crewData.residences] : [],
            isPublished: crewData.isPublished !== undefined ? Boolean(crewData.isPublished) : true,
          };
        }
        
        return {
          id: userId,
          type: 'user' as const,
          displayName: `User ${userId.slice(0, 6)}`,
          photoURL: '',
          bio: '',
          email: ''
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
          id: userId,
          type: 'user' as const,
          displayName: `User ${userId.slice(0, 6)}`,
          photoURL: '',
          bio: '',
          email: ''
        };
      }
    };

    // Set up subscription for incoming requests
    const incomingUnsubscribe = SocialService.subscribeToFollowRequests(currentUser.uid, async (requests) => {
      console.log('[SocialPage] Incoming follow requests updated:', requests.length);
      const mappedRequests = await Promise.all(
        requests.map(async (req: any) => {
          const userProfile = await fetchUserProfile(req.fromUserId);
          const result = { ...userProfile, requestId: req.id };
          console.log('[SocialPage] Mapped request:', { userId: req.fromUserId, requestId: req.id, profileId: getProfileId(result) });
          return result;
        })
      );
      console.log('[SocialPage] Setting connectionRequests:', mappedRequests.length);
      setConnectionRequests(mappedRequests);
    });

    // Set up subscription for sent requests
    const outgoingUnsubscribe = SocialService.subscribeToOutgoingFollowRequests(currentUser.uid, async (requests) => {
      const mappedRequests = await Promise.all(
        requests.map(async (req: any) => {
          const userProfile = await fetchUserProfile(req.toUserId);
          return userProfile;
        })
      );
      setSentRequests(mappedRequests);
    });

    // Set up subscription for connections (people I'm following)
    const connectionsUnsubscribe = SocialService.subscribeToFollowing(currentUser.uid, async (follows) => {
      const mappedConnections = await Promise.all(
        follows.map(async (conn: any) => {
          const userProfile = await fetchUserProfile(conn.followingId);
          return userProfile;
        })
      );
      setConnections(mappedConnections);
    });

    // Cleanup subscriptions on unmount or when user changes
    return () => {
      incomingUnsubscribe();
      outgoingUnsubscribe();
      connectionsUnsubscribe();
    };
  }, [auth?.currentUser?.uid]);

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
    
    // Update URL with tab parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', value);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  // Handle follow/unfollow action
  const handleFollowChange = async (profileId: string, follow: boolean) => {
    if (!user?.uid) return;
    
    try {
      if (follow) {
        await SocialService.sendFollowRequest(user.uid, profileId);
        toast.success('Follow request sent!');
      } else {
        await SocialService.unfollow(user.uid, profileId);
        toast.success('Unfollowed successfully');
      }
      await loadData();
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error(follow ? 'Failed to send follow request' : 'Failed to unfollow');
    }
  };

  // Handle follow request response (accept/reject)
  const handleFollowRequest = async (userId: string, action: 'accept' | 'reject') => {
    // Find the follow request for this user
    const request = connectionRequests.find(p => getProfileId(p) === userId);
    if (!request) {
      console.error('[handleFollowRequest] Request not found for userId:', userId);
      console.log('[handleFollowRequest] Available requests:', connectionRequests.map(p => ({ id: getProfileId(p), requestId: (p as any).requestId })));
      return;
    }
    
    const requestId = (request as any).requestId;
    if (!requestId) {
      console.error('[handleFollowRequest] Request ID not found for request:', request);
      return;
    }
    
    try {
      console.log('[handleFollowRequest] Processing request:', { userId, action, requestId });
      await SocialService.respondToFollowRequest(requestId, action === 'accept' ? 'accepted' : 'rejected');
      // Update local state after backend call
      if (action === 'accept') {
        setConnections(prev => [...prev, request]);
        toast.success('Follow request accepted!');
      } else {
        toast.success('Follow request rejected.');
      }
      setConnectionRequests(prev => prev.filter(p => getProfileId(p) !== userId));
    } catch (error) {
      console.error(`Error ${action}ing follow request:`, error);
      toast.error(`Failed to ${action} follow request. Please try again.`);
    }
  };

  // Handle canceling sent follow requests
  const handleCancelSentRequest = async (userId: string) => {
    if (!user?.uid) return;
    
    try {
      await SocialService.cancelFollowRequest(user.uid, userId);
      toast.success('Follow request canceled successfully');
      // The sentRequests will be updated automatically by the subscription
    } catch (error) {
      console.error('Error canceling follow request:', error);
      toast.error('Failed to cancel follow request. Please try again.');
    }
  };

  // Messaging functions
  const loadConversations = useCallback(async () => {
    if (!user?.uid) return;
    
    const unsubscribe = MessagingService.subscribeToConversations(
      user.uid,
      (conversations) => {
        setConversations(conversations);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  const handleStartConversation = (userId: string) => {
    if (!userId) {
      setShowStartConversation(true);
      setShowMessagePane(false);
    } else {
      // Navigate to chat or open chat interface
      setShowMessagePane(false);
      setShowStartConversation(false);
      console.log('Starting conversation with:', userId);
    }
  };

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

  // Load conversations when component mounts or when message pane is opened
  useEffect(() => {
    if (user?.uid && showMessagePane) {
      loadConversations();
    }
  }, [user?.uid, showMessagePane, loadConversations]);

  // Helper function to render user cards
  const renderUserCard = (profile: AppProfile, action?: React.ReactNode) => {
    const avatarUrl = (profile as any).profileImageUrl || '/bust-avatar.svg';
    const displayName = profile.displayName || (profile as any).name || 'User';
    const jobTitle = profile.type === 'crew' ? (profile as any).jobTitles?.[0]?.title : undefined;
    
    return (
      <div key={getProfileId(profile)} className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center space-x-4">
          <img 
            src={avatarUrl} 
            alt={displayName}
            className="h-12 w-12 rounded-full object-cover object-center flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/bust-avatar.svg';
            }}
          />
          <div>
            <p className="font-medium text-gray-900">{displayName}</p>
            {jobTitle && <p className="text-sm text-gray-600 font-medium">{jobTitle}</p>}
            {profile.bio && <p className="text-sm text-gray-500 line-clamp-1">{profile.bio}</p>}
          </div>
        </div>
        {action}
      </div>
    );
  };

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
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((profile: AppProfile) => (
                  <UserCard
                    key={getProfileId(profile)}
                    profile={profile}
                    action={
                      <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap text-xs px-3 py-1.5 border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => handleFollowChange(getProfileId(profile), false)}
                      >
                        <UserX className="h-3.5 w-3.5 mr-1.5" />
                        {t('social.actions.unfollow')}
                      </Button>
                    }
                  />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <p className="text-gray-500">No connections found matching "{searchQuery}"</p>
            ) : (
              <p className="text-gray-500">You don't have any connections yet.</p>
            )}
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((profile: AppProfile) => (
                  <UserCard
                    key={getProfileId(profile)}
                    profile={profile}
                    action={
                      (profile as any).requestId ? (
                        <Button
                          variant="default"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => handleFollowRequest(getProfileId(profile), 'accept')}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          {t('social.actions.accept')}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => handleCancelSentRequest(getProfileId(profile))}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )
                    }
                  />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <p className="text-gray-500">No requests found matching "{searchQuery}"</p>
            ) : (
              <p className="text-gray-500">{t('social.empty.noRequests')}</p>
            )}
          </div>
        );

      case 'discover':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('social.headers.discoverPeople')}</h2>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((profile: AppProfile) => (
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
                        {t('social.actions.follow')}
                      </Button>
                    }
                  />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <p className="text-gray-500">No people found matching "{searchQuery}"</p>
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
                          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('social.empty.noNotifications')}</h2>
              <p className="text-gray-500">{t('social.headers.yourNotifications')}</p>
          </div>
        );
    }
  };

  // User card component - Exact copy of CrewBannerCard style
  const UserCard = ({ profile, action, showBio = true }: { 
    profile: AppProfile; 
    action?: React.ReactNode;
    showBio?: boolean;
  }) => {
    // Get the proper avatar and display name like crew cards do
    const avatarUrl = (profile as any).profileImageUrl || '/bust-avatar.svg';
    const displayName = profile.displayName || (profile as any).name || 'User';
    const jobTitle = profile.type === 'crew' ? (profile as any).jobTitles?.[0]?.title : undefined;
    const location = (profile as any).residences?.[0]?.city || (profile as any).location;
    
    return (
      <div 
        className={`
          relative group flex items-center bg-white rounded-2xl border border-gray-100 
          shadow-lg px-5 py-4 gap-4 hover:shadow-xl transition-all duration-300 cursor-pointer
        `}
        style={{ 
          minHeight: 68, 
          textDecoration: 'none',
          animationDelay: `${0 * 0.05}s`
        }}
      >
        {/* Main Content */}
        <div className="flex items-center flex-1 min-w-0 gap-4">
          {/* Avatar */}
          <img 
            src={avatarUrl} 
            alt={displayName}
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/bust-avatar.svg';
            }}
          />
          
          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200" 
                 style={{ fontSize: 17, letterSpacing: '-0.01em' }}
                 title={displayName}>
              {displayName}
            </div>
            <div className="text-xs text-gray-500 truncate" style={{ fontWeight: 500 }}
                 title={`${jobTitle || ''}${location ? ' · ' + location : ''}`}>
              {jobTitle}{location ? ' · ' + location : ''}
            </div>
          </div>
        </div>

        {/* Action Buttons - Right Side */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Action Button (Unfollow) - Left */}
          {action && (
            <div className="flex items-center">
              {action}
            </div>
          )}
          
          {/* Chat Button - Right, Red styling */}
          {activeTab === 'connections' && (
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
              onClick={() => {
                // Navigate to chat page with the user
                navigate(`/chat?user=${getProfileId(profile)}`);
              }}
            >
              Chat
            </Button>
          )}
        </div>
      </div>
    );
  };

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

  // Message Pane Component
  const MessagePane = () => {
    if (!showMessagePane) return null;

    const filteredConversations = conversations.filter(conv => 
      !messageSearchQuery.trim() || 
      conv.userName.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
      (conv.lastMessage && conv.lastMessage.toLowerCase().includes(messageSearchQuery.toLowerCase()))
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStartConversation('')}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMessagePane(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {messageSearchQuery ? 'No conversations found' : 'No messages yet'}
                </h3>
                <p className="text-xs text-gray-500">
                  {messageSearchQuery 
                    ? 'Try a different search term'
                    : 'Start a conversation with someone to see messages here'
                  }
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleStartConversation(conversation.userId)}
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
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
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
                        <p className="text-xs text-gray-600 truncate mt-1">
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

  // Start Conversation Modal Component
  const StartConversationModal = () => {
    if (!showStartConversation) return null;

    const [searchResults, setSearchResults] = useState<AppProfile[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [popularContacts, setPopularContacts] = useState<AppProfile[]>([]);

    // Load popular contacts when modal opens
    useEffect(() => {
      if (!user?.uid) return;

      const loadPopularContacts = async () => {
        try {
          // Start with connections as they're most likely to be messaged
          const connectionProfiles = connections.filter(profile => 
            getProfileId(profile) !== user.uid
          ).slice(0, 8);

          // If we don't have enough connections, add some recent crew members
          if (connectionProfiles.length < 8) {
            const remainingSlots = 8 - connectionProfiles.length;
            const recentCrew = filteredProfiles
              .filter(profile => 
                getProfileId(profile) !== user.uid &&
                !connectionProfiles.some(conn => getProfileId(conn) === getProfileId(profile))
              )
              .slice(0, remainingSlots);
            
            setPopularContacts([...connectionProfiles, ...recentCrew]);
          } else {
            setPopularContacts(connectionProfiles);
          }
        } catch (error) {
          console.error('Error loading popular contacts:', error);
          setPopularContacts([]);
        }
      };

      loadPopularContacts();
    }, [connections, filteredProfiles, user?.uid]);

    const searchUsers = useCallback(async (query: string) => {
      if (!user?.uid) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // If no query, show popular contacts
        if (!query.trim()) {
          setSearchResults(popularContacts);
          setIsSearching(false);
          return;
        }

        // Search through all available profiles (connections, discover, and crew)
        const allUsers = [...connections, ...filteredProfiles];
        
        // Also search through crew profiles from Firestore for more comprehensive results
        const { collection, query: firestoreQuery, where, getDocs, limit } = await import('firebase/firestore');
        const { db } = await import('../firebase');
        
        // Get ALL crew profiles without filtering by isPublished first
        const allCrewQuery = firestoreQuery(
          collection(db, 'crewProfiles'),
          limit(100)
        );
        
        const allCrewSnapshot = await getDocs(allCrewQuery);
        let crewProfiles: AppProfile[] = allCrewSnapshot.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            type: 'crew' as const,
            uid: doc.id,
            displayName: data.name || data.displayName || `Crew Member ${doc.id.slice(-4)}`,
            photoURL: data.profileImageUrl || data.avatarUrl || '',
            bio: data.bio || '',
            name: data.name || data.displayName || `Crew Member ${doc.id.slice(-4)}`,
            username: data.username || '',
            jobTitles: Array.isArray(data.jobTitles) ? [...data.jobTitles] : [],
            residences: Array.isArray(data.residences) ? [...data.residences] : [],
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
          };
        });

        // Combine all sources and filter
        const allAvailableUsers = [...allUsers, ...crewProfiles];
        const uniqueUsers = allAvailableUsers.filter((profile, index, self) => 
          index === self.findIndex(p => getProfileId(p) === getProfileId(profile))
        );

        // Create search terms from query for more flexible matching
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        // Add debugging for search
        console.log('🔍 Search Debug:', {
          query,
          searchTerms,
          totalUsers: uniqueUsers.length,
          userEmails: uniqueUsers.map(u => (u as any).email).filter(Boolean),
          userNames: uniqueUsers.map(u => (u as any).name || u.displayName).filter(Boolean)
        });
        
        const filtered = uniqueUsers.filter(profile => {
          if (getProfileId(profile) === user.uid) return false;
          
          const profileText = [
            profile.displayName,
            (profile as any).name,
            (profile as any).email,
            (profile as any).username,
            (profile as any).jobTitles?.[0]?.title,
            profile.bio
          ].filter(Boolean).join(' ').toLowerCase();
          
          // Check if any search term matches any part of the profile
          const matches = searchTerms.some(term => profileText.includes(term));
          
          // Debug logging for specific searches
          if (query.toLowerCase().includes('myfilmjobs') || query.toLowerCase().includes('iam') || query.toLowerCase().includes('francisco')) {
            console.log('🔍 Profile Check:', {
              name: (profile as any).name,
              email: (profile as any).email,
              profileText,
              searchTerms,
              matches
            });
          }
          
          return matches;
        });

        setSearchResults(filtered.slice(0, 15));
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, [connections, filteredProfiles, user?.uid, popularContacts]);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        searchUsers(messageSearchQuery);
      }, 200); // Reduced debounce time for better responsiveness

      return () => clearTimeout(timeoutId);
    }, [messageSearchQuery, searchUsers]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStartConversation(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, role, email, or username..."
                value={messageSearchQuery}
                onChange={(e) => setMessageSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            {!messageSearchQuery && (
              <p className="text-xs text-gray-500 mt-2">
                Start typing to search or browse popular contacts below
              </p>
            )}
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
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {messageSearchQuery ? 'No people found' : 'Popular Contacts'}
                </h3>
                <p className="text-xs text-gray-500">
                  {messageSearchQuery 
                    ? 'Try a different search term or browse popular contacts'
                    : 'Start typing to search or select from popular contacts below'
                  }
                </p>
                {!messageSearchQuery && popularContacts.length > 0 && (
                  <div className="mt-4 p-2">
                    <h4 className="text-xs font-medium text-gray-700 mb-2 text-left">Popular Contacts</h4>
                    <div className="space-y-2">
                      {popularContacts.map((profile) => (
                        <div
                          key={getProfileId(profile)}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            handleStartConversation(getProfileId(profile));
                            setShowStartConversation(false);
                          }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile.photoURL || (profile as any).profileImageUrl} alt={profile.displayName} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                              {profile.displayName
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {profile.displayName}
                            </h4>
                            {profile.type === 'crew' && (profile as any).jobTitles?.[0]?.title && (
                              <p className="text-xs text-gray-500 truncate">
                                {(profile as any).jobTitles[0].title}
                              </p>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2">
                {searchResults.map((profile) => (
                  <div
                    key={getProfileId(profile)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      handleStartConversation(getProfileId(profile));
                      setShowStartConversation(false);
                    }}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.photoURL || (profile as any).profileImageUrl} alt={profile.displayName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                        {profile.displayName
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {profile.displayName}
                        </h4>
                        {connections.some(conn => getProfileId(conn) === getProfileId(profile)) && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            Connected
                          </span>
                        )}
                      </div>
                      {profile.type === 'crew' && (profile as any).jobTitles?.[0]?.title && (
                        <p className="text-xs text-gray-500 truncate">
                          {(profile as any).jobTitles[0].title}
                        </p>
                      )}
                      {profile.bio && (
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {profile.bio}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('social.title')}</h1>
          <p className="text-gray-500">{t('social.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Navigate to full messaging environment
              navigate('/chat');
            }}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t('social.messages')}</span>
          </Button>
          <div className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={t('social.searchPeople')}
                className="pl-10 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        <TabButton 
          active={activeTab === 'connections'}
          onClick={() => handleTabChange('connections')}
          icon={UserCheck}
        >
          {t('social.tabs.connections')}
        </TabButton>
        <TabButton 
          active={activeTab === 'requests'}
          onClick={() => handleTabChange('requests')}
          count={connectionRequests.length}
          icon={UserX}
        >
          {t('social.tabs.requests')}
        </TabButton>
        <TabButton 
          active={activeTab === 'discover'}
          onClick={() => handleTabChange('discover')}
          icon={UserPlus}
        >
          {t('social.tabs.discover')}
        </TabButton>
        <TabButton 
          active={activeTab === 'notifications'}
          onClick={() => handleTabChange('notifications')}
          icon={Bell}
        >
          {t('social.tabs.notifications')}
        </TabButton>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {renderTabContent()}
      </div>

      {/* Message Pane */}
      <MessagePane />

      {/* Start Conversation Modal */}
      <StartConversationModal />
    </div>
  );
};

export default SocialPage;