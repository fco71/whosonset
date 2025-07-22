import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: any;
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
    const notifRef = doc(db, "users", currentUser.uid, "notifications", notificationId);
    await updateDoc(notifRef, { read: true });
  };

  return { notifications, loading, markAsRead };
} 