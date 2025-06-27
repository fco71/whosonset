import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  writeBatch,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { FollowRequest, Follow, SocialNotification, ActivityFeedItem } from '../types/Social';

export class SocialService {
  // Follow Request Operations
  static async sendFollowRequest(fromUserId: string, toUserId: string, message?: string): Promise<void> {
    try {
      // Check if request already exists
      const existingRequest = await this.getFollowRequest(fromUserId, toUserId);
      if (existingRequest) {
        throw new Error('Follow request already exists');
      }

      // Check if already following
      const existingFollow = await this.getFollow(fromUserId, toUserId);
      if (existingFollow) {
        throw new Error('Already following this user');
      }

      const requestData = {
        fromUserId,
        toUserId,
        status: 'pending' as const,
        message: message || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'followRequests'), requestData);

      // Create notification for the target user
      await this.createNotification({
        userId: toUserId,
        type: 'follow_request',
        title: 'New Follow Request',
        message: `Someone wants to follow you`,
        relatedUserId: fromUserId,
        isRead: false,
        createdAt: new Date(),
        actionUrl: `/social/requests`
      });

    } catch (error) {
      console.error('Error sending follow request:', error);
      throw error;
    }
  }

  static async getFollowRequest(fromUserId: string, toUserId: string): Promise<FollowRequest | null> {
    try {
      const requestsQuery = query(
        collection(db, 'followRequests'),
        where('fromUserId', '==', fromUserId),
        where('toUserId', '==', toUserId)
      );
      const snapshot = await getDocs(requestsQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        } as FollowRequest;
      }
      return null;
    } catch (error) {
      console.error('Error getting follow request:', error);
      return null;
    }
  }

  static async respondToFollowRequest(requestId: string, status: 'accepted' | 'rejected'): Promise<void> {
    try {
      const batch = writeBatch(db);
      const requestRef = doc(db, 'followRequests', requestId);
      
      // Update request status
      batch.update(requestRef, { 
        status, 
        updatedAt: serverTimestamp() 
      });

      // Get the request data
      const requestDoc = await getDoc(requestRef);
      if (!requestDoc.exists()) {
        throw new Error('Follow request not found');
      }

      const requestData = requestDoc.data();
      const { fromUserId, toUserId } = requestData;

      if (status === 'accepted') {
        // Create follow relationship
        const followData = {
          followerId: fromUserId,
          followingId: toUserId,
          status: 'active' as const,
          createdAt: serverTimestamp()
        };
        const followRef = doc(collection(db, 'follows'));
        batch.set(followRef, followData);

        // Create notification for the requester
        await this.createNotification({
          userId: fromUserId,
          type: 'follow_accepted',
          title: 'Follow Request Accepted',
          message: 'Your follow request was accepted',
          relatedUserId: toUserId,
          isRead: false,
          createdAt: new Date(),
          actionUrl: `/social/profile/${toUserId}`
        });

        // Create activity feed item
        await this.createActivityFeedItem({
          userId: fromUserId,
          type: 'follow_made',
          title: 'New Follower',
          description: 'You gained a new follower',
          relatedUserId: toUserId,
          likes: 0,
          comments: 0,
          createdAt: new Date(),
          isPublic: true
        });
      }

      await batch.commit();

    } catch (error) {
      console.error('Error responding to follow request:', error);
      throw error;
    }
  }

  // Follow Operations
  static async getFollow(followerId: string, followingId: string): Promise<Follow | null> {
    try {
      const followQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', followerId),
        where('followingId', '==', followingId),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(followQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          lastInteraction: doc.data().lastInteraction?.toDate()
        } as Follow;
      }
      return null;
    } catch (error) {
      console.error('Error getting follow:', error);
      return null;
    }
  }

  static async unfollow(followerId: string, followingId: string): Promise<void> {
    try {
      const follow = await this.getFollow(followerId, followingId);
      if (!follow) {
        throw new Error('Not following this user');
      }

      await deleteDoc(doc(db, 'follows', follow.id));
    } catch (error) {
      console.error('Error unfollowing:', error);
      throw error;
    }
  }

  // Real-time Listeners
  static subscribeToFollowRequests(userId: string, callback: (requests: FollowRequest[]) => void) {
    const requestsQuery = query(
      collection(db, 'followRequests'),
      where('toUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(requestsQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as FollowRequest[];
      callback(requests);
    });
  }

  static subscribeToFollowers(userId: string, callback: (follows: Follow[]) => void) {
    const followersQuery = query(
      collection(db, 'follows'),
      where('followingId', '==', userId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(followersQuery, (snapshot) => {
      const follows = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastInteraction: doc.data().lastInteraction?.toDate()
      })) as Follow[];
      callback(follows);
    });
  }

  static subscribeToFollowing(userId: string, callback: (follows: Follow[]) => void) {
    const followingQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', userId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(followingQuery, (snapshot) => {
      const follows = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        lastInteraction: doc.data().lastInteraction?.toDate()
      })) as Follow[];
      callback(follows);
    });
  }

  static subscribeToNotifications(userId: string, callback: (notifications: SocialNotification[]) => void) {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as SocialNotification[];
      callback(notifications);
    });
  }

  // Notification Operations
  static async createNotification(notification: Omit<SocialNotification, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Activity Feed Operations
  static async createActivityFeedItem(item: Omit<ActivityFeedItem, 'id'>): Promise<void> {
    try {
      await addDoc(collection(db, 'activityFeed'), {
        ...item,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating activity feed item:', error);
    }
  }

  // Utility Methods
  static async getFollowStatus(currentUserId: string, targetUserId: string): Promise<'none' | 'pending' | 'following' | 'blocked'> {
    try {
      // Check if following
      const follow = await this.getFollow(currentUserId, targetUserId);
      if (follow) return 'following';

      // Check if request pending
      const request = await this.getFollowRequest(currentUserId, targetUserId);
      if (request && request.status === 'pending') return 'pending';

      return 'none';
    } catch (error) {
      console.error('Error getting follow status:', error);
      return 'none';
    }
  }

  static async getFollowersCount(userId: string): Promise<number> {
    try {
      const followersQuery = query(
        collection(db, 'follows'),
        where('followingId', '==', userId),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(followersQuery);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting followers count:', error);
      return 0;
    }
  }

  static async getFollowingCount(userId: string): Promise<number> {
    try {
      const followingQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', userId),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(followingQuery);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting following count:', error);
      return 0;
    }
  }
} 