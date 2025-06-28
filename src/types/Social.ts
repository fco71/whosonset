export interface FollowRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: Date;
  lastInteraction?: Date;
}

export interface SocialNotification {
  id: string;
  userId: string;
  type: 'follow_request' | 'follow_accepted' | 'project_invite' | 'message' | 'mention' | 'like' | 'comment' | 'project_update' | 'group_invite' | 'event_invite' | 'recommendation' | 'achievement';
  title: string;
  message: string;
  relatedUserId?: string;
  relatedProjectId?: string;
  relatedMessageId?: string;
  relatedGroupId?: string;
  relatedEventId?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface ActivityFeedItem {
  id: string;
  userId: string;
  type: 'project_created' | 'project_joined' | 'profile_updated' | 'follow_made' | 'achievement_earned' | 'group_joined' | 'event_created' | 'event_attending' | 'recommendation_given' | 'skill_endorsed';
  title: string;
  description: string;
  imageUrl?: string;
  relatedProjectId?: string;
  relatedUserId?: string;
  relatedGroupId?: string;
  relatedEventId?: string;
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
    followers: number;
    following: number;
    projects: number;
    recommendations: number;
    groups: number;
    events: number;
  };
  isPublic: boolean;
  lastActive: Date;
  availability: 'available' | 'busy' | 'away' | 'offline';
  privacySettings: {
    requireApprovalForFollows: boolean;
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    allowMessages: boolean;
    allowMentions: boolean;
  };
  // Enhanced profile features
  skills: Skill[];
  achievements: Achievement[];
  endorsements: Endorsement[];
  recommendations: Recommendation[];
  badges: Badge[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
  endorsedBy: string[];
  yearsOfExperience?: number;
}

export interface Endorsement {
  id: string;
  skillId: string;
  endorsedByUserId: string;
  endorsedByUserName: string;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'project' | 'social' | 'skill' | 'milestone';
  earnedAt: Date;
  relatedProjectId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'expertise' | 'contribution' | 'leadership' | 'innovation';
  earnedAt: Date;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Recommendation {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  content: string;
  projectContext?: string;
  skills: string[];
  rating: number;
  isPublic: boolean;
  createdAt: Date;
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
  context: 'comment' | 'project' | 'message' | 'group' | 'event';
  contextId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

// Advanced Social Features
export interface SocialGroup {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  coverImageUrl?: string;
  category: 'professional' | 'interest' | 'location' | 'project' | 'skill';
  privacy: 'public' | 'private' | 'secret';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  maxMembers?: number;
  rules?: string[];
  tags: string[];
  location?: string;
  isActive: boolean;
  // Group features
  posts: GroupPost[];
  events: string[]; // Event IDs
  projects: string[]; // Project IDs
  moderators: string[];
  pendingMembers: string[];
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  type: 'text' | 'image' | 'link' | 'poll' | 'event';
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isAnnouncement: boolean;
}

export interface SocialEvent {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: 'networking' | 'workshop' | 'screening' | 'conference' | 'meetup' | 'project';
  startDate: Date;
  endDate: Date;
  location: string;
  isOnline: boolean;
  onlineUrl?: string;
  createdBy: string;
  createdByUserName: string;
  createdAt: Date;
  updatedAt: Date;
  // Event features
  attendees: EventAttendee[];
  maxAttendees?: number;
  isPublic: boolean;
  registrationRequired: boolean;
  tags: string[];
  relatedProjectId?: string;
  relatedGroupId?: string;
}

export interface EventAttendee {
  userId: string;
  userName: string;
  userAvatar?: string;
  status: 'attending' | 'maybe' | 'not_attending' | 'waitlist';
  registeredAt: Date;
  notes?: string;
}

export interface SocialRecommendation {
  id: string;
  type: 'user' | 'project' | 'group' | 'event' | 'job';
  targetId: string;
  targetName: string;
  targetImageUrl?: string;
  score: number;
  reasons: string[];
  category: string;
  tags: string[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface SocialAnalytics {
  userId: string;
  profileViews: number;
  profileViewsHistory: { date: string; views: number }[];
  engagementRate: number;
  topPosts: string[];
  followerGrowth: { date: string; followers: number }[];
  activityScore: number;
  influenceScore: number;
  reachScore: number;
  recommendationsGiven: number;
  recommendationsReceived: number;
  groupsJoined: number;
  eventsAttended: number;
  skillsEndorsed: number;
  achievementsEarned: number;
}

// Legacy types for backward compatibility
export interface FriendRequest extends FollowRequest {}
export interface SocialConnection extends Follow {}

export interface SocialSettings {
  userId: string;
  privacy: {
    profileVisibility: 'public' | 'followers' | 'private';
    showOnlineStatus: boolean;
    showLastSeen: boolean;
    requireApprovalForFollows: boolean;
    allowMessages: boolean;
    allowMentions: boolean;
    allowGroupInvites: boolean;
    allowEventInvites: boolean;
    showRecommendations: boolean;
  };
  notifications: {
    followRequests: boolean;
    projectInvites: boolean;
    messages: boolean;
    mentions: boolean;
    likes: boolean;
    comments: boolean;
    projectUpdates: boolean;
    groupInvites: boolean;
    eventInvites: boolean;
    recommendations: boolean;
    achievements: boolean;
  };
  blockedUsers: string[];
  mutedUsers: string[];
  mutedGroups: string[];
  mutedEvents: string[];
}
