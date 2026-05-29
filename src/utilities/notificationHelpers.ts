import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { AppNotification } from '../types/notifications';

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asOptionalBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  return null;
}

function toLower(text: string): string {
  return text.trim().toLowerCase();
}

function toTitleFromType(type: string): string {
  const normalized = toLower(type);
  if (!normalized) {
    return 'Notification';
  }

  const labels: Record<string, string> = {
    job_application: 'New Job Application',
    application_status_update: 'Application Status Updated',
    application_message: 'New Application Message',
    message: 'New Message',
    message_received: 'New Message',
    follow_request: 'New Follow Request',
    follow_accepted: 'Follow Request Accepted',
    project_invitation: 'Project Invitation',
    project_update: 'Project Update',
    task_assignment: 'Task Assignment',
    status_update: 'Status Update',
  };

  if (labels[normalized]) {
    return labels[normalized];
  }

  return normalized
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeKnownLink(link: string): string {
  if (link === '/social/requests') {
    return '/social?tab=requests';
  }

  if (/^\/social\/profile\/[^/]+$/.test(link)) {
    return '/social?tab=connections';
  }

  return link;
}

function deriveLink(type: string, data: Record<string, unknown>): string {
  const explicitLink = asText(data.link) || asText(data.actionUrl);
  if (explicitLink) {
    return normalizeKnownLink(explicitLink);
  }

  const normalizedType = toLower(type);
  const relatedId = asText(data.relatedId);
  const applicationId = asText(data.applicationId) || asText(data.relatedApplicationId);
  const jobId = asText(data.jobId) || asText(data.relatedJobId);
  const senderId = asText(data.senderId);

  if (normalizedType === 'job_application' && relatedId) {
    return `/jobs/${encodeURIComponent(relatedId)}/applications`;
  }

  if (normalizedType === 'application_status_update' || normalizedType === 'status_update') {
    if (applicationId) {
      return `/applications/${encodeURIComponent(applicationId)}`;
    }
    if (jobId) {
      return `/jobs/${encodeURIComponent(jobId)}`;
    }
    return '/jobs/applied';
  }

  if (normalizedType === 'application_message') {
    if (applicationId) {
      return `/applications/${encodeURIComponent(applicationId)}`;
    }
  }

  if (normalizedType === 'message' || normalizedType === 'message_received') {
    if (senderId) {
      return `/chat?user=${encodeURIComponent(senderId)}`;
    }
    return '/chat';
  }

  if (normalizedType === 'follow_request') {
    return '/social?tab=requests';
  }

  if (normalizedType === 'follow_accepted') {
    return '/social?tab=connections';
  }

  if ((normalizedType === 'project_invitation' || normalizedType === 'project_update') && relatedId) {
    return `/projects/${encodeURIComponent(relatedId)}`;
  }

  if (normalizedType === 'task_assignment' && relatedId) {
    return `/projects/${encodeURIComponent(relatedId)}/tasks`;
  }

  return '';
}

export function getNotificationDateValue(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'object' && value !== null) {
    const candidate = value as Record<string, unknown>;

    // Firestore Timestamp objects expose toDate()/toMillis() and rely on method binding.
    if (typeof candidate.toDate === 'function') {
      try {
        const converted = (candidate.toDate as () => Date).call(value);
        if (converted instanceof Date && !Number.isNaN(converted.getTime())) {
          return converted;
        }
      } catch {
        // Fall through to alternate parsing paths.
      }
    }

    if (typeof candidate.toMillis === 'function') {
      try {
        const millis = Number((candidate.toMillis as () => number).call(value));
        if (Number.isFinite(millis)) {
          const converted = new Date(millis);
          return Number.isNaN(converted.getTime()) ? null : converted;
        }
      } catch {
        // Fall through to alternate parsing paths.
      }
    }

    const seconds = typeof candidate.seconds === 'number' ? candidate.seconds : null;
    const nanoseconds = typeof candidate.nanoseconds === 'number' ? candidate.nanoseconds : 0;
    if (seconds !== null) {
      const millis = (seconds * 1000) + Math.floor(nanoseconds / 1_000_000);
      const converted = new Date(millis);
      return Number.isNaN(converted.getTime()) ? null : converted;
    }
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const converted = new Date(value);
    return Number.isNaN(converted.getTime()) ? null : converted;
  }

  const converted = new Date(String(value));
  return Number.isNaN(converted.getTime()) ? null : converted;
}

export function normalizeNotificationData(
  id: string,
  input: Record<string, unknown>
): AppNotification {
  const type = asText(input.type) || 'system';
  const title = asText(input.title) || toTitleFromType(type);
  const body = asText(input.body) || asText(input.message);
  const message = body || title;
  const normalizedIsRead = asOptionalBoolean(input.isRead);
  const normalizedRead = asOptionalBoolean(input.read);
  const hasExplicitReadState = normalizedIsRead !== null || normalizedRead !== null;
  // Legacy notifications without read flags should not flood current unread count.
  const isRead = hasExplicitReadState
    ? Boolean(normalizedIsRead ?? normalizedRead)
    : true;
  const createdAt = input.createdAt ?? input.timestamp ?? null;
  const timestamp = input.timestamp ?? input.createdAt ?? null;

  return {
    id,
    userId: asText(input.userId),
    type,
    title,
    body,
    message,
    isRead,
    read: isRead,
    link: deriveLink(type, input) || undefined,
    createdAt,
    timestamp,
    relatedId: asText(input.relatedId) || undefined,
    applicationId: asText(input.applicationId) || asText(input.relatedApplicationId) || undefined,
    senderId: asText(input.senderId) || undefined,
    status: asText(input.status) || undefined,
    titleKey: asText(input.titleKey) || undefined,
    bodyKey: asText(input.bodyKey) || undefined,
    i18nParams: (input.i18nParams && typeof input.i18nParams === 'object')
      ? (input.i18nParams as Record<string, unknown>)
      : undefined,
    metadata: (input.metadata && typeof input.metadata === 'object')
      ? (input.metadata as Record<string, unknown>)
      : undefined,
  };
}

type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

// Resolve i18nParams for display: any param whose key ends in "Key" (e.g. roleKey) is
// itself a translation key and gets resolved via t(), exposed under the base name
// (roleKey -> role). Everything else passes through as data (names, counts).
function resolveNotificationParams(t: TranslateFn, params?: Record<string, unknown>): Record<string, unknown> {
  if (!params) return {};
  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (key.endsWith('Key') && typeof value === 'string' && value) {
      resolved[key.slice(0, -3)] = t(value);
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

// Title/body for display: prefer the i18n key (rendered in the reader's locale) and fall
// back to the stored string (frozen in the sender's locale) for legacy notifications.
export function getNotificationTitle(notification: AppNotification, t: TranslateFn): string {
  if (notification.titleKey) return t(notification.titleKey, resolveNotificationParams(t, notification.i18nParams));
  return notification.title;
}

export function getNotificationBody(notification: AppNotification, t: TranslateFn): string {
  if (notification.bodyKey) return t(notification.bodyKey, resolveNotificationParams(t, notification.i18nParams));
  return notification.body || notification.message;
}

export function normalizeNotificationDocument(
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): AppNotification {
  const data = docSnapshot.data() as Record<string, unknown>;
  return normalizeNotificationData(docSnapshot.id, data);
}
