export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  message: string;
  // Optional i18n: when present, the UI renders these with t() in the RECIPIENT's locale
  // instead of the stored title/body (which were frozen in the sender's locale at write
  // time). i18nParams whose key ends in "Key" (e.g. roleKey) are themselves resolved via
  // t() and exposed under the base name (roleKey -> role).
  titleKey?: string;
  bodyKey?: string;
  i18nParams?: Record<string, unknown>;
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
