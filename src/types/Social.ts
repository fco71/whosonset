export interface FollowRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName?: string;
  toUserName?: string;
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
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  location: string;
  department: string;
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skills: string[];
  portfolio: PortfolioItem[];
  availability: 'available' | 'busy' | 'unavailable';
  verified: boolean;
  followersCount: number;
  followingCount: number;
  projectsCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'document';
  projectId?: string;
  tags: string[];
  featured: boolean;
  createdAt: any;
}

export interface SocialConnection {
  id: string;
  followerId: string;
  followingId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: any;
  updatedAt: any;
}

export interface SocialPost {
  id: string;
  authorId: string;
  content: string;
  media?: PostMedia[];
  projectId?: string;
  location?: string;
  tags: string[];
  visibility: 'public' | 'connections' | 'department' | 'private';
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document';
  caption?: string;
}

export interface SocialComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
  likesCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface SocialLike {
  id: string;
  postId: string;
  userId: string;
  createdAt: any;
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
  content: string;
  media?: PostMedia[];
  likesCount: number;
  commentsCount: number;
  createdAt: any;
  updatedAt: any;
}

export interface SocialEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: any;
  endDate: any;
  organizerId: string;
  attendees: string[];
  maxAttendees?: number;
  eventType: 'meetup' | 'workshop' | 'screening' | 'networking' | 'conference';
  department?: string;
  tags: string[];
  coverImage?: string;
  createdAt: any;
  updatedAt: any;
}

export interface EventAttendee {
  id: string;
  eventId: string;
  userId: string;
  status: 'attending' | 'maybe' | 'declined';
  registeredAt: any;
}

export interface SocialRecommendation {
  id: string;
  userId: string;
  recommendedUserId: string;
  reason: string;
  strength: number; // 0-1 score
  factors: string[]; // ['skills_match', 'location', 'project_history', etc.]
  createdAt: any;
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

export interface FriendRequest extends FollowRequest {}

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

export interface IndustryGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage?: string;
  department: string;
  visibility: 'public' | 'private' | 'invite_only';
  membersCount: number;
  postsCount: number;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: any;
}

export interface SocialMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  media?: PostMedia[];
  read: boolean;
  createdAt: any;
}

export interface SkillEndorsement {
  id: string;
  endorserId: string;
  endorseeId: string;
  skill: string;
  projectId?: string;
  message?: string;
  createdAt: any;
}

export interface SocialActivity {
  id: string;
  userId: string;
  type: 'post' | 'comment' | 'like' | 'follow' | 'project_join' | 'skill_endorsement';
  relatedId?: string;
  metadata?: any;
  createdAt: any;
}

export interface SocialSearchFilter {
  keywords?: string;
  department?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  availability?: string;
  verified?: boolean;
  projectHistory?: string[];
}

export interface SocialFeedItem {
  id: string;
  type: 'post' | 'project_update' | 'event' | 'recommendation';
  content: any;
  author: SocialProfile;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: any;
}
