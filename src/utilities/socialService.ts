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
  getDoc,
  increment,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { FollowRequest, Follow, SocialNotification, ActivityFeedItem, SocialLike, SocialComment } from '../types/Social';

export class SocialService {
  // Follow Request Operations
  static async sendFollowRequest(fromUserId: string, toUserId: string, message?: string): Promise<void> {
    try {
      console.log('[SocialService] Sending follow request:', { fromUserId, toUserId, message });
      
      // Check if request already exists
      const existingRequest = await this.getFollowRequest(fromUserId, toUserId);
      if (existingRequest) {
        console.log('[SocialService] Follow request already exists');
        throw new Error('Follow request already exists');
      }

      // Check if already following
      const existingFollow = await this.getFollow(fromUserId, toUserId);
      if (existingFollow) {
        console.log('[SocialService] Already following this user');
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

      console.log('[SocialService] Creating follow request with data:', requestData);
      await addDoc(collection(db, 'followRequests'), requestData);
      console.log('[SocialService] Follow request created successfully');

      // Create notification for the target user
      console.log('[SocialService] Creating notification for user:', toUserId);
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
      console.log('[SocialService] Notification created successfully');

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
    try {
      console.log('[SocialService] Setting up follow requests listener for user:', userId);
      const requestsQuery = query(
        collection(db, 'followRequests'),
        where('toUserId', '==', userId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(requestsQuery, (snapshot) => {
        try {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as FollowRequest[];
          console.log('[SocialService] Follow requests updated:', requests.length);
          callback(requests);
        } catch (error) {
          console.error('[SocialService] Error processing follow requests snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[SocialService] Follow requests listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('[SocialService] Error setting up follow requests listener:', error);
      return () => {};
    }
  }

  static subscribeToFollowers(userId: string, callback: (follows: Follow[]) => void) {
    try {
      console.log('[SocialService] Setting up followers listener for user:', userId);
      const followersQuery = query(
        collection(db, 'follows'),
        where('followingId', '==', userId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(followersQuery, (snapshot) => {
        try {
          const follows = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            lastInteraction: doc.data().lastInteraction?.toDate()
          })) as Follow[];
          console.log('[SocialService] Followers updated:', follows.length);
          callback(follows);
        } catch (error) {
          console.error('[SocialService] Error processing followers snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[SocialService] Followers listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('[SocialService] Error setting up followers listener:', error);
      return () => {};
    }
  }

  static subscribeToFollowing(userId: string, callback: (follows: Follow[]) => void) {
    try {
      console.log('[SocialService] Setting up following listener for user:', userId);
      const followingQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', userId),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(followingQuery, (snapshot) => {
        try {
          const follows = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            lastInteraction: doc.data().lastInteraction?.toDate()
          })) as Follow[];
          console.log('[SocialService] Following updated:', follows.length);
          callback(follows);
        } catch (error) {
          console.error('[SocialService] Error processing following snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[SocialService] Following listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('[SocialService] Error setting up following listener:', error);
      return () => {};
    }
  }

  static subscribeToNotifications(userId: string, callback: (notifications: SocialNotification[]) => void) {
    try {
      console.log('[SocialService] Setting up notifications listener for user:', userId);
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(notificationsQuery, (snapshot) => {
        try {
          const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
          })) as SocialNotification[];
          console.log('[SocialService] Notifications updated:', notifications.length);
          callback(notifications);
        } catch (error) {
          console.error('[SocialService] Error processing notifications snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[SocialService] Notifications listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('[SocialService] Error setting up notifications listener:', error);
      return () => {};
    }
  }

  // Notification Operations
  static async createNotification(notification: Omit<SocialNotification, 'id'>): Promise<void> {
    try {
      console.log('[SocialService] Creating notification:', notification);
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: serverTimestamp()
      });
      console.log('[SocialService] Notification created with ID:', docRef.id);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
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
      console.log('[SocialService] Creating activity feed item:', item);
      await addDoc(collection(db, 'activityFeed'), {
        ...item,
        createdAt: serverTimestamp()
      });
      console.log('[SocialService] Activity feed item created successfully');
    } catch (error) {
      console.error('Error creating activity feed item:', error);
      throw error;
    }
  }

  static async getActivityFeed(userId: string, itemLimit: number = 20): Promise<ActivityFeedItem[]> {
    try {
      console.log('[SocialService] Getting activity feed for user:', userId);
      const feedQuery = query(
        collection(db, 'activityFeed'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(itemLimit)
      );
      
      const snapshot = await getDocs(feedQuery);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as ActivityFeedItem[];
      
      console.log('[SocialService] Retrieved', items.length, 'activity feed items');
      return items;
    } catch (error) {
      console.error('Error getting activity feed:', error);
      return [];
    }
  }

  static subscribeToActivityFeed(userId: string, callback: (items: ActivityFeedItem[]) => void) {
    try {
      console.log('[SocialService] Setting up activity feed listener for user:', userId);
      const feedQuery = query(
        collection(db, 'activityFeed'),
        where('isPublic', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      return onSnapshot(feedQuery, (snapshot) => {
        try {
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
          })) as ActivityFeedItem[];
          console.log('[SocialService] Activity feed updated:', items.length, 'items');
          callback(items);
        } catch (error) {
          console.error('[SocialService] Error processing activity feed snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[SocialService] Activity feed listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('[SocialService] Error setting up activity feed listener:', error);
      return () => {};
    }
  }

  // Like Operations
  static async likeActivity(activityId: string, userId: string, userName: string): Promise<void> {
    try {
      console.log('[SocialService] Liking activity:', activityId, 'by user:', userId);
      
      // Check if already liked
      const existingLike = await this.getLike(activityId, userId);
      if (existingLike) {
        console.log('[SocialService] User already liked this activity');
        return;
      }

      // Create like
      const likeData = {
        activityId,
        userId,
        userName,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'likes'), likeData);
      
      // Update activity feed item likes count
      const activityRef = doc(db, 'activityFeed', activityId);
      await updateDoc(activityRef, {
        likes: increment(1)
      });
      
      console.log('[SocialService] Activity liked successfully');
    } catch (error) {
      console.error('Error liking activity:', error);
      throw error;
    }
  }

  static async unlikeActivity(activityId: string, userId: string): Promise<void> {
    try {
      console.log('[SocialService] Unliking activity:', activityId, 'by user:', userId);
      
      // Find and delete like
      const like = await this.getLike(activityId, userId);
      if (like) {
        await deleteDoc(doc(db, 'likes', like.id));
        
        // Update activity feed item likes count
        const activityRef = doc(db, 'activityFeed', activityId);
        await updateDoc(activityRef, {
          likes: increment(-1)
        });
      }
      
      console.log('[SocialService] Activity unliked successfully');
    } catch (error) {
      console.error('Error unliking activity:', error);
      throw error;
    }
  }

  static async getLike(activityId: string, userId: string): Promise<SocialLike | null> {
    try {
      const likeQuery = query(
        collection(db, 'likes'),
        where('activityId', '==', activityId),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(likeQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        } as SocialLike;
      }
      return null;
    } catch (error) {
      console.error('Error getting like:', error);
      return null;
    }
  }

  static async getLikesForActivity(activityId: string): Promise<SocialLike[]> {
    try {
      const likesQuery = query(
        collection(db, 'likes'),
        where('activityId', '==', activityId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(likesQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as SocialLike[];
    } catch (error) {
      console.error('Error getting likes for activity:', error);
      return [];
    }
  }

  // Comment Operations
  static async addComment(activityId: string, userId: string, userName: string, userAvatar: string | undefined, content: string): Promise<void> {
    try {
      console.log('[SocialService] Adding comment to activity:', activityId);
      
      const commentData = {
        activityId,
        userId,
        userName,
        userAvatar,
        content,
        likes: 0,
        createdAt: serverTimestamp(),
        replies: []
      };
      
      await addDoc(collection(db, 'comments'), commentData);
      
      // Update activity feed item comments count
      const activityRef = doc(db, 'activityFeed', activityId);
      await updateDoc(activityRef, {
        comments: increment(1)
      });
      
      console.log('[SocialService] Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  static async getCommentsForActivity(activityId: string): Promise<SocialComment[]> {
    try {
      const commentsQuery = query(
        collection(db, 'comments'),
        where('activityId', '==', activityId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(commentsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as SocialComment[];
    } catch (error) {
      console.error('Error getting comments for activity:', error);
      return [];
    }
  }

  static subscribeToActivityComments(activityId: string, callback: (comments: SocialComment[]) => void) {
    try {
      console.log('[SocialService] Setting up comments listener for activity:', activityId);
      const commentsQuery = query(
        collection(db, 'comments'),
        where('activityId', '==', activityId),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(commentsQuery, (snapshot) => {
        try {
          const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
          })) as SocialComment[];
          console.log('[SocialService] Comments updated for activity', activityId, ':', comments.length, 'comments');
          callback(comments);
        } catch (error) {
          console.error('[SocialService] Error processing comments snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[SocialService] Comments listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('[SocialService] Error setting up comments listener:', error);
      return () => {};
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