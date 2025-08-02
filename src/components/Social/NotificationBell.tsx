import React, { useState, useEffect } from 'react';
import { SocialService } from '../../utilities/socialService';
import { SocialNotification } from '../../types/Social';
import { UserUtils, UserProfile } from '../../utilities/userUtils';

interface NotificationBellProps {
  currentUserId: string;
  className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ currentUserId, className = '' }) => {
  const [notifications, setNotifications] = useState<SocialNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());

  useEffect(() => {
    if (!currentUserId) return;

    let unsubscribe: (() => void) | undefined;

    const setupListener = () => {
      try {
        console.log('[NotificationBell] Setting up listener for user:', currentUserId);
        unsubscribe = SocialService.subscribeToNotifications(currentUserId, (notifications) => {
          console.log('[NotificationBell] Received notifications:', notifications.length);
          setNotifications(notifications);
        });
      } catch (error) {
        console.error('[NotificationBell] Error setting up listener:', error);
      }
    };

    setupListener();

    return () => {
      try {
        console.log('[NotificationBell] Cleaning up listener for user:', currentUserId);
        if (unsubscribe) {
          unsubscribe();
        }
      } catch (error) {
        console.error('[NotificationBell] Error cleaning up listener:', error);
      }
    };
  }, [currentUserId]);

  // Load user profiles for notifications
  useEffect(() => {
    const loadUserProfiles = async () => {
      const userIds = new Set<string>();
      notifications.forEach(notification => {
        if (notification.relatedUserId) {
          userIds.add(notification.relatedUserId);
        }
      });
      
      const userIdsToLoad = Array.from(userIds).filter(id => !userProfiles.has(id));
      if (userIdsToLoad.length > 0) {
        try {
          const profiles = await UserUtils.getMultipleUserProfiles(userIdsToLoad);
          setUserProfiles(prev => new Map([...prev, ...profiles]));
        } catch (error) {
          console.error('Error loading user profiles for notifications:', error);
        }
      }
    };

    loadUserProfiles();
  }, [notifications, userProfiles]);

  const getUserDisplayName = (userId: string): string => {
    const profile = userProfiles.get(userId);
    return profile?.displayName || `User ${userId.slice(-4)}`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setLoading(true);
      await SocialService.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(n => SocialService.markNotificationAsRead(n.id))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'follow_request':
        return '👤';
      case 'follow_accepted':
        return '✅';
      case 'project_invite':
        return '🎬';
      case 'message':
        return '💬';
      case 'mention':
        return '📢';
      case 'like':
        return '❤️';
      case 'comment':
        return '💭';
      case 'project_update':
        return '📝';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: SocialNotification) => {
    try {
      // Mark as read first
      await handleMarkAsRead(notification.id);
      
      // Navigate based on notification type
      switch (notification.type) {
        case 'follow_request':
          // Navigate to social page to see follow requests
          window.location.href = '/social';
          break;
        case 'follow_accepted':
          // Navigate to the user's profile who accepted
          if (notification.relatedUserId) {
            window.location.href = `/resume/${notification.relatedUserId}`;
          }
          break;
        case 'project_invite':
          // Navigate to project management
          if (notification.relatedProjectId) {
            window.location.href = `/projects/${notification.relatedProjectId}/manage`;
          }
          break;
        case 'message':
          // Navigate to messaging
          window.location.href = '/social';
          break;
        case 'mention':
          // Navigate to social page for mentions
          window.location.href = '/social';
          break;
        case 'like':
        case 'comment':
          // Navigate to social page for likes/comments
          window.location.href = '/social';
          break;
        case 'project_update':
          // Navigate to project
          if (notification.relatedProjectId) {
            window.location.href = `/projects/${notification.relatedProjectId}`;
          }
          break;
        default:
          // Default to social page
          window.location.href = '/social';
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {loading ? 'Marking...' : 'Mark all read'}
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.slice(0, 10).map((notification) => {
                  const relatedUserName = notification.relatedUserId ? getUserDisplayName(notification.relatedUserId) : null;
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                            {relatedUserName && (
                              <span className="text-blue-600 ml-1">from {relatedUserName}</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notifications.length > 10 && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to full notifications page
                  window.location.href = '/social';
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell; 