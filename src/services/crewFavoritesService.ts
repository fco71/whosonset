import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface FavoriteCrew {
  id: string;
  userId: string;
  crewId: string;
  crewName: string;
  jobTitle?: string;
  location?: string;
  profileImageUrl?: string;
  addedAt: Date;
}

export class CrewFavoritesService {
  private static COLLECTION_NAME = 'crewFavorites';

  static async addToFavorites(crewId: string, crewData: {
    crewName: string;
    jobTitle?: string;
    location?: string;
    profileImageUrl?: string;
  }): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const favoriteId = `${user.uid}_${crewId}`;
    const favoriteData = {
      userId: user.uid,
      crewId,
      crewName: crewData.crewName,
      jobTitle: crewData.jobTitle,
      location: crewData.location,
      profileImageUrl: crewData.profileImageUrl,
      addedAt: new Date()
    };

    await setDoc(doc(db, this.COLLECTION_NAME, favoriteId), favoriteData);
  }

  static async removeFromFavorites(crewId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const favoriteId = `${user.uid}_${crewId}`;
    await deleteDoc(doc(db, this.COLLECTION_NAME, favoriteId));
  }

  static async isFavorite(crewId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const favoriteId = `${user.uid}_${crewId}`;
      const favoriteDoc = await getDoc(doc(db, this.COLLECTION_NAME, favoriteId));
      return favoriteDoc.exists();
    } catch (error) {
      console.error('Error checking if crew is favorite:', error);
      return false;
    }
  }

  static async getFavorites(): Promise<FavoriteCrew[]> {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const favoritesQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', user.uid),
        orderBy('addedAt', 'asc')
      );
      const snapshot = await getDocs(favoritesQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : data.addedAt
        } as FavoriteCrew;
      });
    } catch (error) {
      console.error('Error getting crew favorites:', error);
      return [];
    }
  }

  static async getFavoriteCrewIds(): Promise<string[]> {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const favoritesQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(favoritesQuery);
      return snapshot.docs.map(doc => doc.data().crewId);
    } catch (error) {
      console.error('Error getting favorite crew IDs:', error);
      return [];
    }
  }
}
