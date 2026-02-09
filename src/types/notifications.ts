export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  message: string;
  isRead: boolean;
  read: boolean;
  link?: string;
  createdAt: unknown;
  timestamp: unknown;
  relatedId?: string;
  applicationId?: string;
  senderId?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}
