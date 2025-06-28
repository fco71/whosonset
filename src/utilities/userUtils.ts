import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface UserProfile {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  jobTitle?: string;
  company?: string;
}

export class UserUtils {
  private static userCache = new Map<string, UserProfile | null>();

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Check cache first
      if (this.userCache.has(userId)) {
        return this.userCache.get(userId) || null;
      }

      // Try to get from users collection first
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const profile: UserProfile = {
          id: userId,
          displayName: userData.displayName || userData.firstName || userData.email?.split('@')[0],
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          avatarUrl: userData.avatarUrl,
          bio: userData.bio,
          location: userData.location,
          jobTitle: userData.jobTitle,
          company: userData.company
        };
        
        this.userCache.set(userId, profile);
        return profile;
      }

      // Try crewProfiles collection as fallback
      const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
      if (crewDoc.exists()) {
        const crewData = crewDoc.data();
        const profile: UserProfile = {
          id: userId,
          displayName: crewData.name || crewData.firstName || `Crew Member ${userId.slice(-4)}`,
          firstName: crewData.firstName,
          lastName: crewData.lastName,
          email: crewData.email,
          avatarUrl: crewData.avatarUrl,
          bio: crewData.bio,
          location: crewData.location,
          jobTitle: crewData.jobTitle,
          company: crewData.company
        };
        
        this.userCache.set(userId, profile);
        return profile;
      }

      // Return null if user not found
      this.userCache.set(userId, null);
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static async getUserDisplayName(userId: string): Promise<string> {
    const profile = await this.getUserProfile(userId);
    return profile?.displayName || `User ${userId.slice(-4)}`;
  }

  static async getUserAvatar(userId: string): Promise<string | undefined> {
    const profile = await this.getUserProfile(userId);
    return profile?.avatarUrl;
  }

  static async getMultipleUserProfiles(userIds: string[]): Promise<Map<string, UserProfile>> {
    try {
      const profiles = new Map<string, UserProfile>();
      const uncachedIds: string[] = [];

      // Check cache first
      userIds.forEach(userId => {
        if (this.userCache.has(userId)) {
          const cached = this.userCache.get(userId);
          if (cached) {
            profiles.set(userId, cached);
          }
        } else {
          uncachedIds.push(userId);
        }
      });

      if (uncachedIds.length === 0) {
        return profiles;
      }

      // Batch fetch uncached profiles
      const batchSize = 10; // Firestore batch limit
      for (let i = 0; i < uncachedIds.length; i += batchSize) {
        const batch = uncachedIds.slice(i, i + batchSize);
        
        // Try users collection first
        const userPromises = batch.map(async (userId) => {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const profile: UserProfile = {
                id: userId,
                displayName: userData.displayName || userData.firstName || userData.email?.split('@')[0],
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                avatarUrl: userData.avatarUrl,
                bio: userData.bio,
                location: userData.location,
                jobTitle: userData.jobTitle,
                company: userData.company
              };
              this.userCache.set(userId, profile);
              return { userId, profile };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return null;
          }
        });

        const userResults = await Promise.all(userPromises);
        userResults.forEach(result => {
          if (result) {
            profiles.set(result.userId, result.profile);
          }
        });

        // For users not found in users collection, try crewProfiles
        const notFoundIds = batch.filter(userId => !profiles.has(userId));
        const crewPromises = notFoundIds.map(async (userId) => {
          try {
            const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
            if (crewDoc.exists()) {
              const crewData = crewDoc.data();
              const profile: UserProfile = {
                id: userId,
                displayName: crewData.name || crewData.firstName || `Crew Member ${userId.slice(-4)}`,
                firstName: crewData.firstName,
                lastName: crewData.lastName,
                email: crewData.email,
                avatarUrl: crewData.avatarUrl,
                bio: crewData.bio,
                location: crewData.location,
                jobTitle: crewData.jobTitle,
                company: crewData.company
              };
              this.userCache.set(userId, profile);
              return { userId, profile };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching crew profile ${userId}:`, error);
            return null;
          }
        });

        const crewResults = await Promise.all(crewPromises);
        crewResults.forEach(result => {
          if (result) {
            profiles.set(result.userId, result.profile);
          }
        });

        // Cache null for users not found
        batch.forEach(userId => {
          if (!profiles.has(userId)) {
            this.userCache.set(userId, null);
          }
        });
      }

      return profiles;
    } catch (error) {
      console.error('Error fetching multiple user profiles:', error);
      return new Map();
    }
  }

  static clearCache(): void {
    this.userCache.clear();
  }

  static clearUserFromCache(userId: string): void {
    this.userCache.delete(userId);
  }
} 