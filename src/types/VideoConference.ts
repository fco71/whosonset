export interface VideoMeeting {
  id: string;
  title: string;
  description: string;
  hostId: string;
  participants: MeetingParticipant[];
  status: 'scheduled' | 'active' | 'ended' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  maxParticipants: number;
  isRecording: boolean;
  recordingUrl?: string;
  settings: MeetingSettings;
  chat: MeetingMessage[];
  screenShares: ScreenShare[];
  whiteboards: WhiteboardSession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingParticipant {
  userId: string;
  displayName: string;
  avatar?: string;
  role: 'host' | 'co-host' | 'participant';
  status: 'invited' | 'joined' | 'left' | 'declined';
  joinedAt?: Date;
  leftAt?: Date;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  permissions: ParticipantPermission[];
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  bandwidth: number; // Mbps
}

export interface ParticipantPermission {
  canShareScreen: boolean;
  canRecord: boolean;
  canChat: boolean;
  canAnnotate: boolean;
  canManageParticipants: boolean;
  canMuteOthers: boolean;
  canRemoveOthers: boolean;
}

export interface MeetingSettings {
  allowParticipantsToJoinBeforeHost: boolean;
  muteParticipantsOnEntry: boolean;
  enableWaitingRoom: boolean;
  enableChat: boolean;
  enableScreenSharing: boolean;
  enableRecording: boolean;
  enableAnnotations: boolean;
  enableVirtualBackground: boolean;
  enableBackgroundBlur: boolean;
  maxScreenShares: number;
  videoQuality: 'auto' | '720p' | '1080p' | '4k';
  audioQuality: 'standard' | 'high' | 'ultra';
  bandwidthLimit: number; // Mbps
}

export interface MeetingMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'reaction' | 'file' | 'system';
  reactions: MessageReaction[];
  isPrivate: boolean;
  recipientId?: string; // for private messages
}

export interface MessageReaction {
  userId: string;
  reaction: string; // emoji
  timestamp: Date;
}

export interface ScreenShare {
  id: string;
  sharerId: string;
  sharerName: string;
  type: 'fullscreen' | 'application' | 'tab' | 'region';
  title: string;
  startedAt: Date;
  endedAt?: Date;
  isActive: boolean;
  annotations: ScreenAnnotation[];
  viewers: string[]; // participant IDs
  recordingUrl?: string;
}

export interface ScreenAnnotation {
  id: string;
  annotatorId: string;
  type: 'draw' | 'text' | 'arrow' | 'highlight' | 'shape';
  data: any; // annotation data
  timestamp: Date;
  color: string;
  thickness: number;
  position: { x: number; y: number };
  createdAt: Date;
}

export interface WhiteboardSession {
  id: string;
  name: string;
  createdBy: string;
  participants: string[]; // participant IDs
  elements: WhiteboardElement[];
  isActive: boolean;
  startedAt: Date;
  endedAt?: Date;
}

export interface WhiteboardElement {
  id: string;
  type: 'draw' | 'text' | 'shape' | 'image' | 'sticky';
  data: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MeetingInvitation {
  id: string;
  meetingId: string;
  inviteeId: string;
  inviterId: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  sentAt: Date;
  respondedAt?: Date;
  message?: string;
}

export interface MeetingRecording {
  id: string;
  meetingId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  duration: number; // seconds
  quality: 'standard' | 'high' | 'ultra';
  recordedBy: string;
  recordedAt: Date;
  thumbnailUrl?: string;
  transcriptUrl?: string;
  isPublic: boolean;
  views: number;
  downloads: number;
}

export interface MeetingAnalytics {
  meetingId: string;
  totalParticipants: number;
  averageDuration: number;
  peakConcurrentUsers: number;
  engagementMetrics: {
    chatMessages: number;
    reactions: number;
    screenShares: number;
    annotations: number;
  };
  qualityMetrics: {
    averageVideoQuality: string;
    averageAudioQuality: string;
    connectionIssues: number;
    bandwidthUsage: number;
  };
  participantActivity: {
    userId: string;
    joinTime: Date;
    leaveTime?: Date;
    duration: number;
    videoTime: number;
    audioTime: number;
    chatMessages: number;
    screenShareTime: number;
  }[];
}

export interface VirtualBackground {
  id: string;
  name: string;
  type: 'image' | 'video' | 'blur';
  url: string;
  thumbnailUrl: string;
  isDefault: boolean;
  isCustom: boolean;
  createdBy?: string;
  createdAt: Date;
}

export interface MeetingRoom {
  id: string;
  name: string;
  description: string;
  capacity: number;
  isActive: boolean;
  currentMeeting?: string;
  settings: MeetingSettings;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BreakoutSession {
  id: string;
  meetingId: string;
  name: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  chat: MeetingMessage[];
  whiteboard?: WhiteboardSession;
}

export interface MeetingNote {
  id: string;
  meetingId: string;
  authorId: string;
  content: string;
  timestamp: Date;
  isPublic: boolean;
  tags: string[];
}

export interface ActionItem {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
} 