import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { AppNotification } from '../types/notifications';
import {
  getNotificationDateValue,
  normalizeNotificationDocument,
} from '../utilities/notificationHelpers';

export function useNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const normalized = snapshot.docs.map(normalizeNotificationDocument);
        normalized.sort((left, right) => {
          const leftDate = getNotificationDateValue(left.createdAt) || getNotificationDateValue(left.timestamp);
          const rightDate = getNotificationDateValue(right.createdAt) || getNotificationDateValue(right.timestamp);

          const leftTime = leftDate ? leftDate.getTime() : 0;
          const rightTime = rightDate ? rightDate.getTime() : 0;
          return rightTime - leftTime;
        });
        setNotifications(normalized);
        setLoading(false);
      },
      (error) => {
        console.error('[useNotifications] Failed to load notifications:', error);
        setNotifications([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (notificationId: string) => {
    if (!currentUser) return;

    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, {
        isRead: true,
        read: true,
      });

      setNotifications((prev) => prev.map((notification) => (
        notification.id === notificationId
          ? { ...notification, isRead: true, read: true }
          : notification
      )));
    } catch (error) {
      console.error('[useNotifications] Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;

    try {
      const unread = notifications.filter((notification) => !notification.isRead);
      if (unread.length === 0) {
        return;
      }

      const batch = writeBatch(db);
      unread.forEach((notification) => {
        batch.update(doc(db, 'notifications', notification.id), {
          isRead: true,
          read: true,
        });
      });
      await batch.commit();

      setNotifications((prev) => prev.map((notification) => ({
        ...notification,
        isRead: true,
        read: true,
      })));
    } catch (error) {
      console.error('[useNotifications] Failed to mark all as read:', error);
    }
  };

  const clearAll = async () => {
    if (!currentUser) return;

    try {
      const batch = writeBatch(db);
      notifications.forEach((notification) => {
        batch.delete(doc(db, 'notifications', notification.id));
      });
      await batch.commit();
      setNotifications([]);
    } catch (error) {
      console.error('[useNotifications] Failed to clear notifications:', error);
    }
  };

  const deleteOldNotifications = async (daysOld = 30) => {
    if (!currentUser) return;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);

    const oldNotifications = notifications.filter((notification) => {
      const date = getNotificationDateValue(notification.createdAt) || getNotificationDateValue(notification.timestamp);
      return Boolean(date && date < cutoff);
    });

    if (oldNotifications.length === 0) {
      return;
    }

    try {
      const batch = writeBatch(db);
      oldNotifications.forEach((notification) => {
        batch.delete(doc(db, 'notifications', notification.id));
      });
      await batch.commit();

      setNotifications((prev) => prev.filter((notification) => {
        const date = getNotificationDateValue(notification.createdAt) || getNotificationDateValue(notification.timestamp);
        return !(date && date < cutoff);
      }));
    } catch (error) {
      console.error('[useNotifications] Failed to delete old notifications:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
    } catch (error) {
      console.error('[useNotifications] Failed to delete notification:', error);
    }
  };

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteOldNotifications,
    deleteNotification,
  };
}
