import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, writeBatch, deleteDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: any;
  createdAt?: any; // Add createdAt for compatibility
  read: boolean;
  userId: string;
  relatedId?: string;
  applicationId?: string;
  applicantId?: string;
  extra?: any;
}

export function useNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, "users", currentUser.uid, "notifications"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(notifs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (notificationId: string) => {
    if (!currentUser) return;
    try {
      const notifRef = doc(db, "users", currentUser.uid, "notifications", notificationId);
      await updateDoc(notifRef, { read: true });
      
      // Update local state to mark as read (don't remove)
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Don't throw - just log the error
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    
    try {
      // Mark all unread notifications as read in Firestore
      const batch = writeBatch(db);
      const unreadNotifications = notifications.filter(notification => !notification.read);
      
      unreadNotifications.forEach(notification => {
        const notifRef = doc(db, "users", currentUser.uid, "notifications", notification.id);
        batch.update(notifRef, { read: true });
      });
      await batch.commit();
      
      // Update local state to mark as read
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
      // Don't throw - just log the error
    }
  };

  const clearAll = async () => {
    if (!currentUser) return;
    
    try {
      // Delete all notifications from Firestore
      const batch = writeBatch(db);
      notifications.forEach(notification => {
        const notifRef = doc(db, "users", currentUser.uid, "notifications", notification.id);
        batch.delete(notifRef);
      });
      await batch.commit();
      
      // Clear from local state immediately
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      // Don't throw - just log the error
    }
  };

  const deleteOldNotifications = async (daysOld: number = 30) => {
    if (!currentUser) return;
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const oldNotifications = notifications.filter(notification => {
        const notificationDate = notification.timestamp?.toDate?.() || new Date(notification.timestamp);
        return notificationDate < cutoffDate;
      });
      
      if (oldNotifications.length === 0) return;
      
      const batch = writeBatch(db);
      oldNotifications.forEach(notification => {
        const notifRef = doc(db, "users", currentUser.uid, "notifications", notification.id);
        batch.delete(notifRef);
      });
      await batch.commit();
      
      // Remove from local state
      setNotifications(prev => prev.filter(notification => {
        const notificationDate = notification.timestamp?.toDate?.() || new Date(notification.timestamp);
        return notificationDate >= cutoffDate;
      }));
      
      console.log(`Deleted ${oldNotifications.length} old notifications`);
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      // Don't throw - just log the error
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "notifications", notificationId));
      // Remove from local state immediately
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Don't throw - just log the error
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return { notifications, loading, markAsRead, markAllAsRead, clearAll, deleteNotification, deleteOldNotifications, unreadCount };
} 