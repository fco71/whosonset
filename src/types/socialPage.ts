import { Profile } from './Profile';

export type TabType = 'following' | 'followers' | 'discover' | 'requests' | 'notifications';

export interface SocialUser {
  id: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  jobTitle?: string;
  location?: string;
  isFollowing?: boolean;
  isFollower?: boolean;
  status?: 'pending' | 'accepted' | 'rejected';
  // Profile compatibility
  name?: string;
  username?: string;
  profileImageUrl?: string;
  jobTitles?: Array<{ title: string; department?: string }>;
}

export interface FollowData {
  id: string;
  followerId: string;
  followingId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialPageState {
  activeTab: TabType;
  searchQuery: string;
  isLoading: boolean;
  following: SocialUser[];
  followers: SocialUser[];
  suggestedUsers: SocialUser[];
  followRequests: SocialUser[];
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'follow_request' | 'follow_accepted' | 'mention' | 'like' | 'comment';
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface UserCardProps {
  profile: SocialUser;
  action?: React.ReactNode;
  showBio?: boolean;
  className?: string;
}

export interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  children: React.ReactNode;
}
