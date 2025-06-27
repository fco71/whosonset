export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  messageType: 'text' | 'file' | 'callout' | 'schedule' | 'script' | 'location' | 'equipment';
  attachments?: ChatAttachment[];
  reactions?: MessageReaction[];
  isEdited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  mentions?: string[];
  projectId?: string;
  department?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  readBy?: string[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'audio' | 'script' | 'storyboard' | 'schedule' | 'budget';
  size: number;
  thumbnail?: string;
}

export interface MessageReaction {
  userId: string;
  userName: string;
  emoji: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'project' | 'department' | 'crew' | 'location' | 'production';
  participants: string[];
  projectId?: string;
  department?: string;
  location?: string;
  avatarUrl?: string;
  lastMessage?: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  settings: ChatRoomSettings;
  pinnedMessages?: string[];
}

export interface ChatRoomSettings {
  notifications: boolean;
  soundEnabled: boolean;
  autoArchive: boolean;
  readReceipts: boolean;
  typingIndicators: boolean;
}

export interface ChatCallout {
  id: string;
  type: 'crew' | 'equipment' | 'location' | 'schedule' | 'emergency';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  department?: string;
  location?: string;
  startDate?: Date;
  rate?: number;
  requiredSkills?: string[];
  equipment?: string[];
  timeWindow?: {
    start: Date;
    end: Date;
  };
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  responses: CalloutResponse[];
  status: 'open' | 'in-progress' | 'filled' | 'closed';
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface CalloutResponse {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  availability: {
    start: Date;
    end: Date;
  };
  rate?: number;
  experience: string;
  portfolio?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  timestamp: Date;
}

export interface ChatNotification {
  id: string;
  userId: string;
  type: 'message' | 'callout' | 'mention' | 'project' | 'schedule' | 'emergency';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface ChatPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline' | 'on-set' | 'in-meeting';
  lastSeen: Date;
  currentProject?: string;
  location?: string;
  availability?: {
    start: Date;
    end: Date;
  };
}

export interface ChatStats {
  totalMessages: number;
  activeConversations: number;
  unreadMessages: number;
  responseTime: number; // average in minutes
  calloutsPosted: number;
  calloutsResponded: number;
  projectsCollaborated: number;
}
