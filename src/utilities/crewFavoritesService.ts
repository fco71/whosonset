import { collection, doc, setDoc, deleteDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { CrewProfile } from '../types/CrewProfile';

export interface FavoriteCrewProfile {
  id: string;
  crewId: string;
  userId: string;
  addedAt: Date;
  crewData?: {
    name: string;
    profileImageUrl?: string;
    jobTitles?: string[];
    residences?: string[];
    availability?: string;
  };
}

export class CrewFavoritesService {
  private static COLLECTION_NAME = 'crewFavorites';

  /**
   * Add a crew profile to user's favorites
   */
  static async addToFavorites(crewId: string, crewData?: CrewProfile): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to add favorites');
    }
    const favoriteData: FavoriteCrewProfile = {
      id: `${user.uid}_${crewId}`,
      crewId,
      userId: user.uid,
      addedAt: new Date(),
      crewData: crewData ? {
        name: crewData.name,
        profileImageUrl: crewData.profileImageUrl,
        jobTitles: crewData.jobTitles?.map(jt => jt.title),
        residences: crewData.residences?.map(r => `${r.city}, ${r.country}`),
        availability: crewData.availability,
      } : undefined
    };
    await setDoc(doc(db, this.COLLECTION_NAME, favoriteData.id), favoriteData);
  }

  /**
   * Remove a crew profile from user's favorites
   */
  static async removeFromFavorites(crewId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to remove favorites');
    }
    const favoriteId = `${user.uid}_${crewId}`;
    await deleteDoc(doc(db, this.COLLECTION_NAME, favoriteId));
  }

  /**
   * Check if a crew profile is in user's favorites
   */
  static async isFavorite(crewId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    const favoriteId = `${user.uid}_${crewId}`;
    const favoriteDoc = await getDocs(query(
      collection(db, this.COLLECTION_NAME),
      where('id', '==', favoriteId)
    ));
    return !favoriteDoc.empty;
  }

  /**
   * Get all user's favorite crew profiles
   */
  static async getFavorites(): Promise<FavoriteCrewProfile[]> {
    const user = auth.currentUser;
    if (!user) return [];
    const favoritesQuery = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', user.uid),
      orderBy('addedAt', 'asc'),
      orderBy('__name__', 'asc')
    );
    const snapshot = await getDocs(favoritesQuery);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      addedAt: doc.data().addedAt.toDate()
    } as FavoriteCrewProfile));
  }

  /**
   * Get favorite crew profile IDs for a user
   */
  static async getFavoriteCrewIds(): Promise<string[]> {
    const favorites = await this.getFavorites();
    return favorites.map(fav => fav.crewId);
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(crewId: string, crewData?: CrewProfile): Promise<boolean> {
    const isCurrentlyFavorite = await this.isFavorite(crewId);
    if (isCurrentlyFavorite) {
      await this.removeFromFavorites(crewId);
      return false;
    } else {
      await this.addToFavorites(crewId, crewData);
      return true;
    }
  }
}
