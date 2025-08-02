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
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { CrewProfile } from '../types/CrewProfile';
import { Profile } from '../types/Profile';

type FollowStatus = 'pending' | 'accepted' | 'rejected';

interface FollowData {
  id: string;
  followerId: string;
  followingId: string;
  status: FollowStatus;
  createdAt: any;
  updatedAt: any;
}

export class SocialService {
  // Cache for frequently accessed data with separate timestamp tracking
  private static profileCache = new Map<string, { profile: Profile; cachedAt: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get a list of crew profiles (paginated)
   */
  static async getCrewProfiles(limitCount: number = 20, lastDocId?: string): Promise<CrewProfile[]> {
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid || doc.id,
          name: data.name || '',
          username: data.username || '',
          bio: data.bio,
          profileImageUrl: data.profileImageUrl,
          jobTitles: data.jobTitles || [],
          residences: data.residences || [],
          projects: data.projects || [],
          education: data.education || [],
          contactInfo: data.contactInfo,
          otherInfo: data.otherInfo,
          isPublished: Boolean(data.isPublished),
          availability: data.availability,
          languages: data.languages || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as CrewProfile;
      });
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
      const followRef = doc(collection(db, 'follows'));
      await setDoc(followRef, {
        followerId,
        followingId,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
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
      await updateDoc(followRef, {
        status: accept ? 'accepted' : 'rejected',
        updatedAt: serverTimestamp(),
      });
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
  static async getFollowers(userId: string): Promise<FollowData[]> {
    try {
      const q = query(
        collection(db, 'follows'),
        where('followingId', '==', userId),
        where('status', '==', 'accepted'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as FollowData[];
    } catch (error) {
      console.error('Error getting followers:', error);
      return [];
    }
  }

  /**
   * Get users that a user is following
   */
  static async getFollowing(userId: string): Promise<FollowData[]> {
    try {
      const q = query(
        collection(db, 'follows'),
        where('followerId', '==', userId),
        where('status', '==', 'accepted'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as FollowData[];
    } catch (error) {
      console.error('Error getting following:', error);
      return [];
    }
  }

  /**
   * Get pending follow requests for a user
   */
  static async getFollowRequests(userId: string): Promise<FollowData[]> {
    try {
      const q = query(
        collection(db, 'follows'),
        where('followingId', '==', userId),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as FollowData[];
    } catch (error) {
      console.error('Error getting follow requests:', error);
      return [];
    }
  }

  /**
   * Get suggested users to follow (currently returns random crew members)
   */
  static async getSuggestedUsers(userId: string, limitCount: number = 10): Promise<CrewProfile[]> {
    try {
      // In a real app, you'd want to implement a proper recommendation algorithm
      // For now, we'll just return random crew members
      const q = query(
        collection(db, 'crewProfiles'),
        orderBy('name'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const profiles = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid || doc.id,
          name: data.name || '',
          username: data.username || '',
          bio: data.bio,
          profileImageUrl: data.profileImageUrl,
          jobTitles: data.jobTitles || [],
          residences: data.residences || [],
          projects: data.projects || [],
          education: data.education || [],
          contactInfo: data.contactInfo,
          otherInfo: data.otherInfo,
          isPublished: Boolean(data.isPublished),
          availability: data.availability,
          languages: data.languages || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as CrewProfile;
      });
      
      // Shuffle and return the first few profiles
      return profiles.sort(() => 0.5 - Math.random()).slice(0, 5);
    } catch (error) {
      console.error('Error getting suggested users:', error);
      return [];
    }
  }

  /**
   * Get a user's profile by ID
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      // Check cache first
      const cached = this.profileCache.get(userId);
      if (cached && Date.now() - cached.cachedAt < this.CACHE_TTL) {
        return cached.profile;
      }

      // Try to get crew profile first
      const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
      if (crewDoc.exists()) {
        const data = crewDoc.data();
        const profile: Profile = {
          id: crewDoc.id,
          uid: data.uid || crewDoc.id,
          name: data.name || '',
          username: data.username || '',
          bio: data.bio,
          profileImageUrl: data.profileImageUrl,
          jobTitles: data.jobTitles || [],
          residences: data.residences || [],
          projects: data.projects || [],
          education: data.education || [],
          contactInfo: data.contactInfo,
          otherInfo: data.otherInfo,
          isPublished: Boolean(data.isPublished),
          availability: data.availability,
          languages: data.languages || []
        };
        
        // Cache the result with timestamp
        this.profileCache.set(userId, {
          profile,
          cachedAt: Date.now(),
        });
        
        return profile;
      }

      // If not a crew profile, try to get a regular user profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data() || {};
        const profile: Profile = {
          id: userDoc.id,
          displayName: data.displayName || data.email?.split('@')[0] || 'User',
          email: data.email,
          photoURL: data.photoURL,
        };
        
        // Cache the result with timestamp
        this.profileCache.set(userId, {
          profile,
          cachedAt: Date.now(),
        });
        
        return profile;
      }

      return null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }
}

export default SocialService;
