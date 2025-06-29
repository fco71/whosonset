export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'project_invite';
  relatedProjectId?: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastActivity: Date;
  isGroupChat: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'project_invite';
  relatedProjectId?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'project_invite';
  relatedProjectId?: string;
  reactions?: MessageReaction[];
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  voiceDuration?: number;
  voiceWaveform?: number[];
}

export interface ChatNotification {
  id: string;
  userId: string;
  senderId: string;
  messageId: string;
  isRead: boolean;
  timestamp: Date;
}

export interface ChatSettings {
  userId: string;
  allowMessagesFrom: 'followers' | 'everyone' | 'none';
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  autoReply?: string;
  isAway: boolean;
  awayMessage?: string;
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
