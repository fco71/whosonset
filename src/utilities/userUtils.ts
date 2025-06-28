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

      console.log(`[UserUtils] Loading ${uncachedIds.length} uncached profiles`);

      // Optimize batch loading with better chunking and parallel processing
      const batchSize = 20; // Increased batch size for better performance
      const chunks = [];
      
      for (let i = 0; i < uncachedIds.length; i += batchSize) {
        chunks.push(uncachedIds.slice(i, i + batchSize));
      }

      // Process chunks in parallel for better performance
      const chunkPromises = chunks.map(async (chunk) => {
        const chunkProfiles = new Map<string, UserProfile>();
        
        // Try users collection first for the entire chunk
        const userPromises = chunk.map(async (userId) => {
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
            chunkProfiles.set(result.userId, result.profile);
          }
        });

        // For users not found in users collection, try crewProfiles
        const notFoundIds = chunk.filter(userId => !chunkProfiles.has(userId));
        if (notFoundIds.length > 0) {
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
              chunkProfiles.set(result.userId, result.profile);
            }
          });
        }

        // Cache null for users not found
        chunk.forEach(userId => {
          if (!chunkProfiles.has(userId)) {
            this.userCache.set(userId, null);
          }
        });

        return chunkProfiles;
      });

      // Wait for all chunks to complete
      const chunkResults = await Promise.all(chunkPromises);
      
      // Merge all chunk results
      chunkResults.forEach(chunkProfiles => {
        chunkProfiles.forEach((profile, userId) => {
          profiles.set(userId, profile);
        });
      });

      console.log(`[UserUtils] Successfully loaded ${profiles.size} profiles`);
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

  // Cache warming strategy for better performance
  static async warmCache(userIds: string[]): Promise<void> {
    try {
      console.log(`[UserUtils] Warming cache for ${userIds.length} users`);
      await this.getMultipleUserProfiles(userIds);
    } catch (error) {
      console.error('Error warming cache:', error);
    }
  }

  // Get cache statistics for debugging
  static getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.userCache.size,
      hitRate: 0 // Could be calculated if we track hits/misses
    };
  }

  // Preload profiles for common users (e.g., current user's connections)
  static async preloadCommonProfiles(currentUserId: string, connectionIds: string[]): Promise<void> {
    try {
      const profilesToPreload = connectionIds.filter(id => !this.userCache.has(id));
      if (profilesToPreload.length > 0) {
        console.log(`[UserUtils] Preloading ${profilesToPreload.length} common profiles`);
        await this.getMultipleUserProfiles(profilesToPreload);
      }
    } catch (error) {
      console.error('Error preloading common profiles:', error);
    }
  }

  // Cache management methods
  static clearUserCache() {
    console.log('[UserUtils] Clearing user cache');
    this.userCache.clear();
  }

  static warmUserCache(userIds: string[]) {
    console.log('[UserUtils] Warming cache for', userIds.length, 'users');
    // This could be used to preload user profiles in the background
    // For now, just log the intention
    userIds.forEach(userId => {
      if (!this.userCache.has(userId)) {
        // Could implement background loading here
        console.log('[UserUtils] Would preload user:', userId);
      }
    });
  }
} 