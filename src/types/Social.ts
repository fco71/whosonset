export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'connected' | 'pending' | 'blocked';
  mutualConnections: number;
  createdAt: Date;
  lastInteraction?: Date;
}

export interface SocialNotification {
  id: string;
  userId: string;
  type: 'friend_request' | 'project_invite' | 'message' | 'mention' | 'like' | 'comment' | 'project_update';
  title: string;
  message: string;
  relatedUserId?: string;
  relatedProjectId?: string;
  relatedMessageId?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  type: 'project_created' | 'project_joined' | 'profile_updated' | 'connection_made' | 'achievement_earned';
  title: string;
  description: string;
  imageUrl?: string;
  relatedProjectId?: string;
  relatedUserId?: string;
  likes: number;
  comments: number;
  createdAt: Date;
  isPublic: boolean;
}

export interface SocialProfile {
  userId: string;
  displayName: string;
  profileImageUrl?: string;
  bio?: string;
  location?: string;
  jobTitle?: string;
  company?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    imdb?: string;
  };
  stats: {
    connections: number;
    projects: number;
    recommendations: number;
    followers: number;
    following: number;
  };
  isPublic: boolean;
  lastActive: Date;
  availability: 'available' | 'busy' | 'away' | 'offline';
}

export interface SocialComment {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: Date;
  replies?: SocialComment[];
}

export interface SocialLike {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface SocialMention {
  id: string;
  mentionedUserId: string;
  mentionedByUserId: string;
  context: 'comment' | 'project' | 'message';
  contextId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface SocialSettings {
  userId: string;
  privacy: {
    profileVisibility: 'public' | 'connections' | 'private';
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    allowFriendRequests: boolean;
    allowMessages: boolean;
    allowMentions: boolean;
  };
  notifications: {
    friendRequests: boolean;
    projectInvites: boolean;
    messages: boolean;
    mentions: boolean;
    likes: boolean;
    comments: boolean;
    projectUpdates: boolean;
  };
  blockedUsers: string[];
}
