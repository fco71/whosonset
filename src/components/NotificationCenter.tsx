import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, X, Check, Trash2, Filter, Search, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  let notifications: any[] = [];
  let markAsRead: any = () => {};
  let deleteNotification: any = () => {};
  let unreadCount = 0;
  
  try {
    const notificationsData = useNotifications();
    notifications = notificationsData.notifications || [];
    markAsRead = notificationsData.markAsRead || (() => {});
    deleteNotification = notificationsData.deleteNotification || (() => {});
    unreadCount = notificationsData.unreadCount || 0;
  } catch (error) {
    console.error('[NotificationCenter] Error loading notifications:', error);
    notifications = [];
    markAsRead = () => {};
    deleteNotification = () => {};
    unreadCount = 0;
  }
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedNotifications([]);
      setShowBulkActions(false);
    }
  }, [isOpen]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'read' && notification.read);
    
    const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
      setShowBulkActions(false);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
      setShowBulkActions(true);
    }
  };

  const handleBulkMarkAsRead = async () => {
    try {
      for (const id of selectedNotifications) {
        await markAsRead(id);
      }
      setSelectedNotifications([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedNotifications) {
        await deleteNotification(id);
      }
      setSelectedNotifications([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    try {
      // Always mark as read when clicked, regardless of current status
      if (!notification.read) {
        markAsRead(notification.id);
      }
      
      // For message notifications, also mark the conversation as read
      if (notification.type === 'message' && notification.senderId) {
        // Import MessagingService dynamically to avoid circular dependencies
        import('../utilities/messagingService').then(({ MessagingService }) => {
          MessagingService.markConversationAsRead(currentUser?.uid, notification.senderId).catch(error => {
            console.error('Error marking conversation as read from notification:', error);
          });
        });
      }
      
      // Handle navigation based on notification type
      switch (notification.type) {
        case 'message':
          // Navigate to chat with the sender
          if (notification.senderId) {
            navigate(`/chat?user=${notification.senderId}`);
          } else {
            navigate('/social'); // Fallback to social page
          }
          break;
          
        case 'follow_request':
          // Navigate to social page with requests tab
          navigate('/social?tab=requests');
          break;
          
        case 'follow_accepted':
          // Navigate to social page with connections tab
          navigate('/social?tab=connections');
          break;
          
        case 'job_application':
          // Navigate to job applications page
          if (notification.relatedId) {
            navigate(`/jobs/${notification.relatedId}/applications`);
          } else {
            navigate('/jobs');
          }
          break;
          
        case 'application_status_update':
          // Navigate to application detail
          if (notification.applicationId) {
            navigate(`/applications/${notification.applicationId}`);
          } else {
            navigate('/jobs/applied');
          }
          break;
          
        case 'project_invitation':
          // Navigate to project invitation
          if (notification.relatedId) {
            navigate(`/projects/${notification.relatedId}`);
          } else {
            navigate('/projects');
          }
          break;
          
        case 'task_assignment':
          // Navigate to task management
          if (notification.relatedId) {
            navigate(`/projects/${notification.relatedId}/tasks`);
          } else {
            navigate('/collaboration');
          }
          break;
          
        case 'project_update':
          // Navigate to project detail
          if (notification.relatedId) {
            navigate(`/projects/${notification.relatedId}`);
          } else {
            navigate('/projects');
          }
          break;
          
        case 'mention':
          // Navigate to social page for mentions
          navigate('/social?tab=notifications');
          break;
          
        case 'like':
        case 'comment':
          // Navigate to social page for likes/comments
          navigate('/social?tab=notifications');
          break;
          
        default:
          // Default navigation based on type
          if (notification.type.includes('job')) {
            navigate('/jobs');
          } else if (notification.type.includes('project')) {
            navigate('/projects');
          } else if (notification.type.includes('message')) {
            navigate('/social');
          } else {
            navigate('/'); // Home page as fallback
          }
          break;
      }
      
      // Close the notification center after navigation
      onClose();
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_application':
        return '💼';
      case 'project_invitation':
        return '🎬';
      case 'task_assignment':
        return '📋';
      case 'message':
        return '💬';
      case 'project_update':
        return '🔄';
      case 'application_status_update':
        return '📊';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'job_application':
        return 'bg-blue-100 text-blue-800';
      case 'project_invitation':
        return 'bg-green-100 text-green-800';
      case 'task_assignment':
        return 'bg-purple-100 text-purple-800';
      case 'message':
        return 'bg-indigo-100 text-indigo-800';
      case 'project_update':
        return 'bg-orange-100 text-orange-800';
      case 'application_status_update':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t('notifications.title', 'Notifications')}
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('notifications.search', 'Search notifications...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('notifications.all', 'All')}</option>
              <option value="unread">{t('notifications.unread', 'Unread')}</option>
              <option value="read">{t('notifications.read', 'Read')}</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && selectedNotifications.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
              <span className="text-sm text-blue-800">
                {selectedNotifications.length} notification(s) selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkMarkAsRead}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Read</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
          

        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? t('notifications.noResults', 'No notifications match your criteria')
                  : t('notifications.empty', 'No notifications yet')
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                    notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                  } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Checkbox for bulk selection */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          e.stopPropagation(); // Prevent triggering the card click
                          if (e.target.checked) {
                            setSelectedNotifications(prev => [...prev, notification.id]);
                            setShowBulkActions(true);
                          } else {
                            setSelectedNotifications(prev => {
                              const newSelected = prev.filter(id => id !== notification.id);
                              if (newSelected.length === 0) {
                                setShowBulkActions(false);
                              }
                              return newSelected;
                            });
                          }
                        }}
                        className="mt-1"
                      />
                    </div>

                    {/* Notification Icon */}
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm ${
                            notification.read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.message || 'No message'}
            
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`}>
                              {notification.type.replace('_', ' ')}
                            </span>
                                                                                     <span className="text-xs text-gray-500">
                              {(() => {
                                try {
                                  const timestamp = notification.createdAt?.toDate?.() || notification.createdAt || notification.timestamp?.toDate?.() || notification.timestamp;
                                  if (!timestamp) return 'Unknown time';
                                  const date = new Date(timestamp);
                                  if (isNaN(date.getTime())) return 'Unknown time';
                                  return formatDistanceToNow(date, { addSuffix: true });
                                } catch (error) {
                                  console.error('Error formatting notification timestamp:', error);
                                  return 'Unknown time';
                                }
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the card click
                                markAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the card click
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All'}
              </button>
              {selectedNotifications.length > 0 && (
                <span className="text-sm text-gray-500">
                  {selectedNotifications.length} selected
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {filteredNotifications.length} notification(s)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 