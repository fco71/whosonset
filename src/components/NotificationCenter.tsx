import React, { useMemo, useState } from 'react';
import {
  Bell,
  Check,
  ExternalLink,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { doc, updateDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { AppNotification } from '../types/notifications';
import { getNotificationDateValue, getNotificationTitle, getNotificationBody } from '../utilities/notificationHelpers';
import { app, db } from '../firebase';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

function resolveFallbackRoute(notification: AppNotification): string {
  const type = notification.type.toLowerCase();

  if (type === 'message' || type === 'message_received') {
    if (notification.senderId) {
      return `/chat?user=${encodeURIComponent(notification.senderId)}`;
    }
    return '/chat';
  }

  if (type === 'follow_request') {
    return '/social?tab=requests';
  }

  if (type === 'follow_accepted') {
    return '/social?tab=connections';
  }

  if (type === 'application_status_update' || type === 'status_update') {
    if (notification.applicationId) {
      return `/applications/${encodeURIComponent(notification.applicationId)}`;
    }
    return '/jobs/applied';
  }

  if (type === 'application_message') {
    if (notification.applicationId) {
      return `/applications/${encodeURIComponent(notification.applicationId)}`;
    }
    return '/applications';
  }

  if (type.includes('job')) {
    if (notification.relatedId) {
      return `/jobs/${encodeURIComponent(notification.relatedId)}/applications`;
    }
    return '/jobs';
  }

  if (type.includes('project')) {
    if (notification.relatedId) {
      return `/projects/${encodeURIComponent(notification.relatedId)}`;
    }
    return '/projects';
  }

  // Supervisor-authored screenplay comments / tags (G6). The viewer itself isn't a
  // routable URL yet, so we land the user on the collaboration hub where they can
  // open the relevant screenplay.
  if (
    type === 'supervisor_annotation' ||
    type === 'supervisor_tag' ||
    type === 'workspace_invite' ||
    type === 'workspace_invitation' ||
    type === 'workspace_invitation_accepted' ||
    type === 'workspace_invitation_declined' ||
    type === 'review_submitted' ||
    type === 'review_changes_requested' ||
    type === 'review_approved' ||
    type === 'mention_annotation' ||
    type === 'mention_tag'
  ) {
    return '/collaboration';
  }

  return '/';
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case 'supervisor_annotation':
    case 'supervisor_tag':
      return '🎓';
    case 'workspace_invite':
    case 'workspace_invitation':
    case 'workspace_invitation_accepted':
    case 'workspace_invitation_declined':
      return '🤝';
    case 'review_submitted':
      return '📤';
    case 'review_changes_requested':
      return '📝';
    case 'review_approved':
      return '✅';
    case 'mention_annotation':
    case 'mention_tag':
      return '🔔';
    case 'job_application':
      return '💼';
    case 'project_invitation':
      return '🎬';
    case 'task_assignment':
      return '📋';
    case 'message':
    case 'message_received':
    case 'application_message':
      return '💬';
    case 'application_status_update':
      return '📊';
    case 'follow_request':
    case 'follow_accepted':
      return '👥';
    default:
      return '🔔';
  }
}

function getNotificationColor(type: string): string {
  switch (type) {
    case 'job_application':
      return 'bg-blue-100 text-blue-800';
    case 'project_invitation':
      return 'bg-green-100 text-green-800';
    case 'task_assignment':
      return 'bg-purple-100 text-purple-800';
    case 'message':
    case 'message_received':
    case 'application_message':
      return 'bg-indigo-100 text-indigo-800';
    case 'application_status_update':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotifications();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [respondingInvitationId, setRespondingInvitationId] = useState<string | null>(null);

  const getMetadataString = (notification: AppNotification, key: string): string => {
    const value = notification.metadata?.[key];
    return typeof value === 'string' ? value : '';
  };

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && !notification.isRead) ||
        (filter === 'read' && notification.isRead);

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        notification.title,
        notification.body,
        notification.message,
        notification.type,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [filter, notifications, searchTerm]);

  if (!isOpen) return null;

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if ((notification.type === 'message' || notification.type === 'message_received') && notification.senderId && currentUser?.uid) {
      const uid = currentUser.uid;
      const senderId = notification.senderId;
      import('../services/messagingService').then(({ MessagingService }) => {
        MessagingService
          .markConversationAsRead(uid, senderId)
          .catch((error: unknown) => {
            console.error('[NotificationCenter] Failed to mark conversation as read:', error);
          });
      });
    }

    navigate(notification.link || resolveFallbackRoute(notification));
    onClose();
  };

  const handleWorkspaceInvitationResponse = async (
    event: React.MouseEvent<HTMLButtonElement>,
    notification: AppNotification,
    response: 'accept' | 'decline'
  ) => {
    event.stopPropagation();
    if (!currentUser) return;

    const invitationId = getMetadataString(notification, 'invitationId');
    if (!invitationId) {
      toast.error('Invitation details are missing.');
      return;
    }

    setRespondingInvitationId(invitationId);
    try {
      const functions = getFunctions(app, 'us-central1');
      const respondToWorkspaceInvitation = httpsCallable(functions, 'respondToWorkspaceInvitation');
      await respondToWorkspaceInvitation({ invitationId, response });
      // Single write — status + read flags in one updateDoc. The previous
      // followup `await markAsRead(...)` was a redundant second write to the
      // same fields and could race the optimistic state in useNotifications.
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: response === 'accept' ? 'accepted' : 'declined',
        isRead: true,
        read: true,
      });
      toast.success(response === 'accept' ? 'Workspace invitation accepted.' : 'Workspace invitation declined.');
    } catch (error) {
      console.error('[NotificationCenter] Failed to respond to workspace invitation:', error);
      // Surface the real cause. Firebase callable errors carry a code/message
      // ('functions/not-found' or 'internal' usually means the function isn't deployed;
      // HttpsError messages like "This invitation has already been handled" are actionable).
      const detail = (error as { message?: string; code?: string } | null)?.message
        || (error as { code?: string } | null)?.code;
      toast.error(detail ? `Could not respond to invitation: ${detail}` : 'Could not update the workspace invitation.');
    } finally {
      setRespondingInvitationId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t('notifications.title', 'Notifications')}
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 p-4">
          <div className="mb-3 flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('notifications.search', 'Search notifications...')}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as 'all' | 'unread' | 'read')}
                className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter notifications"
              >
                <option value="all">{t('notifications.all', 'All')}</option>
                <option value="unread">{t('notifications.unread', 'Unread')}</option>
                <option value="read">{t('notifications.read', 'Read')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">
                {searchTerm || filter !== 'all'
                  ? t('notifications.noResults', 'No notifications match your criteria')
                  : t('notifications.empty', 'No notifications yet')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const timestamp =
                  getNotificationDateValue(notification.createdAt) ||
                  getNotificationDateValue(notification.timestamp);
                const invitationId = getMetadataString(notification, 'invitationId');
                const isPendingWorkspaceInvitation =
                  notification.type === 'workspace_invitation' &&
                  invitationId &&
                  notification.status !== 'accepted' &&
                  notification.status !== 'declined';

                return (
                  <div
                    key={notification.id}
                    className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                      notification.isRead
                        ? 'border-gray-200 bg-gray-100/90'
                        : 'border-blue-500 bg-blue-50 ring-2 ring-blue-100 shadow-sm'
                    }`}
                    onClick={() => {
                      void handleNotificationClick(notification);
                    }}
                  >
                    {!notification.isRead && (
                      <span
                        className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-blue-500"
                        aria-hidden="true"
                      />
                    )}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-2xl">{getNotificationIcon(notification.type)}</div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`flex items-center gap-2 text-sm font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                              {getNotificationTitle(notification, t)}
                              {!notification.isRead && (
                                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" aria-hidden="true" />
                              )}
                            </p>
                            {getNotificationBody(notification, t) && (
                              <p className={`mt-1 text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-800'}`}>
                                {getNotificationBody(notification, t)}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {notification.link && (
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void markAsRead(notification.id);
                                }}
                                className="p-1 text-gray-400 transition-colors hover:text-green-600"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={(event) => {
                                event.stopPropagation();
                                void deleteNotification(notification.id);
                              }}
                              className="p-1 text-gray-400 transition-colors hover:text-red-600"
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getNotificationColor(notification.type)}`}>
                            {notification.type.replace(/_/g, ' ')}
                          </span>
                          {!notification.isRead && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                              New
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {timestamp ? formatDistanceToNow(timestamp, { addSuffix: true }) : 'Unknown time'}
                          </span>
                        </div>

                        {isPendingWorkspaceInvitation && (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              disabled={respondingInvitationId === invitationId}
                              onClick={(event) => void handleWorkspaceInvitationResponse(event, notification, 'accept')}
                              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              disabled={respondingInvitationId === invitationId}
                              onClick={(event) => void handleWorkspaceInvitationResponse(event, notification, 'decline')}
                              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 text-sm text-gray-500">
          {filteredNotifications.length} notification(s)
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
