import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, updateDoc, doc, writeBatch, deleteDoc, where } from "firebase/firestore";
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
    console.log('[useNotifications] Effect triggered with currentUser:', currentUser?.uid);
    
    if (!currentUser) {
      console.log('[useNotifications] No current user, clearing notifications');
      setNotifications([]);
      setLoading(false);
      return;
    }
    
    try {
      console.log('[useNotifications] Setting up Firestore listener for user:', currentUser.uid);
      
      // Query notifications from the main notifications collection for the current user
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log('[useNotifications] Received snapshot with', snapshot.docs.length, 'notifications');
        const notifs: Notification[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[];
        setNotifications(notifs);
        setLoading(false);
      }, (error) => {
        console.error('[useNotifications] Error fetching notifications:', error);
        setLoading(false);
        // Set empty notifications on error
        setNotifications([]);
      });
      
      return () => {
        console.log('[useNotifications] Cleaning up listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('[useNotifications] Error setting up listener:', error);
      setLoading(false);
      setNotifications([]);
    }
  }, [currentUser]);

  const markAsRead = async (notificationId: string) => {
    if (!currentUser) return;
    try {
      console.log('[useNotifications] Marking notification as read:', notificationId);
      const notifRef = doc(db, "notifications", notificationId);
      await updateDoc(notifRef, { read: true });
      
      // Update local state to mark as read (don't remove)
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
      console.log('[useNotifications] Notification marked as read successfully');
    } catch (error) {
      console.error('[useNotifications] Error marking notification as read:', error);
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
        const notifRef = doc(db, "notifications", notification.id);
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
        const notifRef = doc(db, "notifications", notification.id);
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
        const notificationDate = notification.createdAt?.toDate?.() || notification.timestamp?.toDate?.();
        return notificationDate && notificationDate < cutoffDate;
      });
      
      if (oldNotifications.length === 0) {
        console.log('No old notifications to delete');
        return;
      }
      
      const batch = writeBatch(db);
      oldNotifications.forEach(notification => {
        const notifRef = doc(db, "notifications", notification.id);
        batch.delete(notifRef);
      });
      await batch.commit();
      
      // Remove from local state
      setNotifications(prev => prev.filter(notification => {
        const notificationDate = notification.createdAt?.toDate?.() || notification.timestamp?.toDate?.();
        return !notificationDate || notificationDate >= cutoffDate;
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
      const notifRef = doc(db, "notifications", notificationId);
      await deleteDoc(notifRef);
      
      // Remove from local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Don't throw - just log the error
    }
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    deleteOldNotifications,
    deleteNotification
  };
} 