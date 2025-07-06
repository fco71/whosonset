import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  writeBatch,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { Profile, isCrewProfile } from '../types/Profile';
import { SocialUser } from '../types/socialPage';

type FollowStatus = 'pending' | 'accepted' | 'rejected';

interface FollowData {
  id: string;
  followerId: string;
  followingId: string;
  status: FollowStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationData {
  id: string;
  type: 'follow_request' | 'follow_accepted' | 'mention' | 'like' | 'comment';
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}

// Cache for storing profile data
const profileCache = new Map<string, { data: SocialUser; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class SocialService {
  /**
   * Get a list of crew profiles (paginated)
   */
  static async getCrewProfiles(limitCount: number = 20, lastDocId?: string): Promise<SocialUser[]> {
    try {
      let q = query(
        collection(db, 'crewProfiles'),
        orderBy('name'),
        limit(limitCount)
      );

      // Add cursor for pagination if provided
      if (lastDocId) {
        const lastDoc = await getDoc(doc(db, 'crewProfiles', lastDocId));
        if (lastDoc.exists()) {
          q = query(q, where('name', '>', lastDoc.data().name));
        }
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapProfileData(doc));
    } catch (error) {
      console.error('Error getting crew profiles:', error);
      return [];
    }
  }

  /**
   * Send a follow request to another user
   */
  static async sendFollowRequest(followerId: string, followingId: string): Promise<void> {
    try {
      // Check if follow relationship already exists
      const existingFollow = await this.getFollow(followerId, followingId);
      if (existingFollow) {
        if (existingFollow.status === 'pending') {
          throw new Error('Follow request already sent');
        } else if (existingFollow.status === 'accepted') {
          throw new Error('Already following this user');
        }
      }

      // Create new follow request
      const followRef = doc(collection(db, 'follows'));
      await setDoc(followRef, {
        followerId,
        followingId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Create notification for the user being followed
      await this.createNotification({
        userId: followingId,
        type: 'follow_request',
        message: 'sent you a follow request',
        metadata: { followerId }
      });
    } catch (error) {
      console.error('Error sending follow request:', error);
      throw error;
    }
  }

  /**
   * Respond to a follow request
   */
  static async respondToFollowRequest(
    followId: string, 
    accept: boolean
  ): Promise<void> {
    try {
      const followRef = doc(db, 'follows', followId);
      const followDoc = await getDoc(followRef);
      
      if (!followDoc.exists()) {
        throw new Error('Follow request not found');
      }

      const followData = followDoc.data() as FollowData;
      
      if (accept) {
        await updateDoc(followRef, {
          status: 'accepted',
          updatedAt: serverTimestamp(),
        });

        // Create notification for the follower
        await this.createNotification({
          userId: followData.followerId,
          type: 'follow_accepted',
          message: 'accepted your follow request',
          metadata: { followingId: followData.followingId }
        });
      } else {
        await deleteDoc(followRef);
      }
    } catch (error) {
      console.error('Error responding to follow request:', error);
      throw error;
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollow(followerId: string, followingId: string): Promise<void> {
    try {
      // Find the follow document
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', followerId),
        where('followingId', '==', followingId)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Delete all matching follow documents (should only be one)
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  /**
   * Get a user's followers
   */
  static async getFollowers(userId: string): Promise<SocialUser[]> {
    try {
      const q = query(
        collection(db, 'follows'),
        where('followingId', '==', userId),
        where('status', '==', 'accepted'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const followerIds = querySnapshot.docs.map(doc => doc.data().followerId);
      
      // Get profiles for all followers
      const followers = await Promise.all(
        followerIds.map(id => this.getProfile(id))
      );
      
      return followers.filter(Boolean) as SocialUser[];
    } catch (error) {
      console.error('Error getting followers:', error);
      return [];
    }
  }

  /**
   * Get users that a user is following
   */
  static async getFollowing(userId: string): Promise<SocialUser[]> {
    try {
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', userId),
        where('status', '==', 'accepted'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const followingIds = querySnapshot.docs.map(doc => doc.data().followingId);
      
      // Get profiles for all followed users
      const following = await Promise.all(
        followingIds.map(id => this.getProfile(id))
      );
      
      return following.filter(Boolean) as SocialUser[];
    } catch (error) {
      console.error('Error getting following:', error);
      return [];
    }
  }

  /**
   * Get pending follow requests for a user
   */
  static async getFollowRequests(userId: string): Promise<SocialUser[]> {
    try {
      const q = query(
        collection(db, 'follows'),
        where('followingId', '==', userId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const requesterIds = querySnapshot.docs.map(doc => doc.data().followerId);
      
      // Get profiles for all requesters
      const requesters = await Promise.all(
        requesterIds.map(id => this.getProfile(id))
      );
      
      return requesters.filter(Boolean) as SocialUser[];
    } catch (error) {
      console.error('Error getting follow requests:', error);
      return [];
    }
  }

  /**
   * Get suggested users to follow (currently returns random crew members)
   */
  static async getSuggestedUsers(userId: string, limitCount: number = 10): Promise<SocialUser[]> {
    try {
      // Get users that the current user is already following
      const following = await this.getFollowing(userId);
      const followingIds = new Set(following.map(user => user.id));
      
      // Get random crew members that the user isn't already following
      const q = query(
        collection(db, 'crewProfiles'),
        orderBy('name'),
        limit(limitCount * 2) // Get more than needed to have enough after filtering
      );
      
      const querySnapshot = await getDocs(q);
      const profiles = querySnapshot.docs
        .map(doc => this.mapProfileData(doc))
        .filter(profile => !followingIds.has(profile.id));
      
      // Shuffle and return the requested number of profiles
      return this.shuffleArray(profiles).slice(0, limitCount);
    } catch (error) {
      console.error('Error getting suggested users:', error);
      return [];
    }
  }

  /**
   * Get a user's notifications
   */
  static async getNotifications(userId: string): Promise<NotificationData[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as NotificationData[];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  /**
   * Mark notifications as read
   */
  static async markNotificationsAsRead(notificationIds: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      notificationIds.forEach(id => {
        const ref = doc(db, 'notifications', id);
        batch.update(ref, { isRead: true });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  /**
   * Get a user's profile by ID
   */
  static async getProfile(userId: string): Promise<SocialUser | null> {
    // Check cache first
    const cached = profileCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      // Try to get crew profile first
      const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
      if (crewDoc.exists()) {
        const profile = this.mapProfileData(crewDoc);
        this.cacheProfile(profile);
        return profile;
      }

      // If not a crew profile, try to get a regular user profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data() || {};
        const profile: SocialUser = {
          id: userDoc.id,
          name: data.name,
          displayName: data.displayName || data.name || data.email?.split('@')[0] || 'User',
          username: data.username,
          photoURL: data.photoURL || data.profileImageUrl,
          bio: data.bio,
          jobTitles: data.jobTitles,
          isFollowing: false,
          isFollower: false,
        };
        
        this.cacheProfile(profile);
        return profile;
      }

      return null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  /**
   * Get follow relationship between two users
   */
  static async getFollow(followerId: string, followingId: string): Promise<FollowData | null> {
    try {
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', followerId),
        where('followingId', '==', followingId),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as FollowData;
    } catch (error) {
      console.error('Error getting follow relationship:', error);
      return null;
    }
  }

  /**
   * Create a notification
   */
  private static async createNotification(data: Omit<NotificationData, 'id' | 'createdAt' | 'isRead'>): Promise<void> {
    try {
      await setDoc(doc(collection(db, 'notifications')), {
        ...data,
        isRead: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Map Firestore document to SocialUser
   */
  private static mapProfileData(doc: QueryDocumentSnapshot | DocumentSnapshot): SocialUser {
    const data = doc.data() as Record<string, any>;
    const id = doc.id;
    
    // Map common fields
    const user: SocialUser = {
      id,
      name: data.name || data.displayName,
      displayName: data.displayName || data.name || 'User',
      username: data.username,
      photoURL: data.photoURL || data.profileImageUrl,
      bio: data.bio,
      jobTitle: data.jobTitles?.[0]?.title,
      location: data.location,
      jobTitles: data.jobTitles,
      isFollowing: false,
      isFollower: false,
    };
    
    return user;
  }

  /**
   * Cache a profile
   */
  private static cacheProfile(profile: SocialUser): void {
    profileCache.set(profile.id, {
      data: profile,
      timestamp: Date.now(),
    });
  }

  /**
   * Shuffle an array (Fisher-Yates algorithm)
   */
  private static shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

export default SocialService;
