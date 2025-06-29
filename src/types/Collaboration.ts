export interface CollaborationWorkspace {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'project' | 'department' | 'general';
  members: WorkspaceMember[];
  channels: CollaborationChannel[];
  documents: CollaborativeDocument[];
  whiteboards: Whiteboard[];
  createdAt: any;
  updatedAt: any;
  settings: WorkspaceSettings;
}

export interface WorkspaceMember {
  userId: string;
  email?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: any;
  permissions: string[];
  isOnline: boolean;
  lastSeen: any;
}

export interface CollaborationChannel {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  type: 'text' | 'voice' | 'video' | 'announcement';
  members: string[]; // User IDs
  messages: ChannelMessage[];
  isPrivate: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface ChannelMessage {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'voice' | 'system';
  attachments?: MessageAttachment[];
  reactions: MessageReaction[];
  thread?: ChannelMessage[]; // For threaded replies
  createdAt: any;
  editedAt?: any;
  isEdited: boolean;
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  thumbnail?: string;
}

export interface MessageReaction {
  emoji: string;
  userIds: string[];
}

export interface CollaborativeDocument {
  id: string;
  workspaceId: string;
  title: string;
  content: string;
  type: 'script' | 'storyboard' | 'schedule' | 'budget' | 'notes';
  version: number;
  collaborators: DocumentCollaborator[];
  changes: DocumentChange[];
  createdAt: any;
  updatedAt: any;
  lastEditedBy: string;
}

export interface DocumentCollaborator {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  cursorPosition?: CursorPosition;
  isTyping: boolean;
  lastActivity: any;
}

export interface CursorPosition {
  line: number;
  column: number;
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface DocumentChange {
  id: string;
  userId: string;
  type: 'insert' | 'delete' | 'format';
  position: number;
  content?: string;
  length?: number;
  timestamp: any;
}

export interface Whiteboard {
  id: string;
  workspaceId: string;
  name: string;
  elements: WhiteboardElement[];
  collaborators: WhiteboardCollaborator[];
  createdAt: any;
  updatedAt: any;
}

export interface WhiteboardElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'line' | 'sticky';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: any;
  style: any;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

export interface WhiteboardCollaborator {
  userId: string;
  cursor: { x: number; y: number };
  isDrawing: boolean;
  lastActivity: any;
}

export interface WorkspaceSettings {
  allowGuestAccess: boolean;
  requireApproval: boolean;
  autoArchive: boolean;
  retentionDays: number;
  maxFileSize: number;
  allowedFileTypes: string[];
}

export interface VideoCall {
  id: string;
  workspaceId: string;
  channelId?: string;
  participants: VideoCallParticipant[];
  status: 'scheduled' | 'active' | 'ended';
  startTime: any;
  endTime?: any;
  recordingUrl?: string;
  settings: VideoCallSettings;
}

export interface VideoCallParticipant {
  userId: string;
  role: 'host' | 'participant';
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  joinedAt: any;
  leftAt?: any;
}

export interface VideoCallSettings {
  maxParticipants: number;
  allowRecording: boolean;
  allowScreenSharing: boolean;
  allowChat: boolean;
  waitingRoom: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'task' | 'document' | 'call' | 'system';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: any;
  actionUrl?: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  assignedTo: string[];
  createdBy: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: any;
  completedAt?: any;
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  createdAt: any;
  updatedAt: any;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: any;
  updatedAt?: any;
}

export interface CalendarEvent {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  startTime: any;
  endTime: any;
  location?: string;
  attendees: string[];
  organizer: string;
  type: 'meeting' | 'shoot' | 'deadline' | 'other';
  isAllDay: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: any;
  updatedAt: any;
} 