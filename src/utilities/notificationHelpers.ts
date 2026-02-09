import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { AppNotification } from '../types/notifications';

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
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

function deriveLink(type: string, data: Record<string, unknown>): string {
  const explicitLink = asText(data.link) || asText(data.actionUrl);
  if (explicitLink) {
    return explicitLink;
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

  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const maybeDate = (value as { toDate?: () => Date }).toDate;
    if (typeof maybeDate === 'function') {
      const converted = maybeDate();
      return Number.isNaN(converted.getTime()) ? null : converted;
    }
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
  const isRead = Boolean(input.isRead ?? input.read ?? false);
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
    metadata: (input.metadata && typeof input.metadata === 'object')
      ? (input.metadata as Record<string, unknown>)
      : undefined,
  };
}

export function normalizeNotificationDocument(
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): AppNotification {
  const data = docSnapshot.data() as Record<string, unknown>;
  return normalizeNotificationData(docSnapshot.id, data);
}
