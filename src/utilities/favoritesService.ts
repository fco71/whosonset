import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  DocumentData 
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface FavoriteProject {
  id: string;
  projectId: string;
  userId: string;
  addedAt: Date;
  projectData?: {
    projectName: string;
    productionCompany?: string;
    status: string;
    coverImageUrl?: string;
  };
}

export class FavoritesService {
  private static COLLECTION_NAME = 'favorites';

  /**
   * Add a project to user's favorites
   */
  static async addToFavorites(projectId: string, projectData?: any): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to add favorites');
    }

    const favoriteData: FavoriteProject = {
      id: `${user.uid}_${projectId}`,
      projectId,
      userId: user.uid,
      addedAt: new Date(),
      projectData: projectData ? {
        projectName: projectData.projectName,
        productionCompany: projectData.productionCompany,
        status: projectData.status,
        coverImageUrl: projectData.coverImageUrl,
      } : undefined
    };

    await setDoc(doc(db, this.COLLECTION_NAME, favoriteData.id), favoriteData);
  }

  /**
   * Remove a project from user's favorites
   */
  static async removeFromFavorites(projectId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to remove favorites');
    }

    const favoriteId = `${user.uid}_${projectId}`;
    await deleteDoc(doc(db, this.COLLECTION_NAME, favoriteId));
  }

  /**
   * Check if a project is in user's favorites
   */
  static async isFavorite(projectId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    const favoriteId = `${user.uid}_${projectId}`;
    const favoriteDoc = await getDocs(query(
      collection(db, this.COLLECTION_NAME),
      where('id', '==', favoriteId)
    ));

    return !favoriteDoc.empty;
  }

  /**
   * Get all user's favorite projects
   */
  static async getFavorites(): Promise<FavoriteProject[]> {
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
    } as FavoriteProject));
  }

  /**
   * Get favorite project IDs for a user
   */
  static async getFavoriteProjectIds(): Promise<string[]> {
    const favorites = await this.getFavorites();
    return favorites.map(fav => fav.projectId);
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(projectId: string, projectData?: any): Promise<boolean> {
    const isCurrentlyFavorite = await this.isFavorite(projectId);
    
    if (isCurrentlyFavorite) {
      await this.removeFromFavorites(projectId);
      return false;
    } else {
      await this.addToFavorites(projectId, projectData);
      return true;
    }
  }
} 