export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any; // Firestore timestamp
  isRead: boolean;
  messageType: 'text' | 'file' | 'project_invite' | 'job_offer';
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface ChatRoom {
  id: string;
  participants: string[]; // Array of user UIDs
  lastMessage?: ChatMessage;
  lastActivity: any; // Firestore timestamp
  isGroupChat: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export interface ChatNotification {
  id: string;
  userId: string;
  messageId: string;
  chatRoomId: string;
  isRead: boolean;
  timestamp: any;
} 