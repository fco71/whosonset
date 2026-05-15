import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  DocumentData,
  getDoc,
  limit
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

    console.log('[FavoritesService] Adding to favorites:', { projectId, userId: user.uid });

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

    console.log('[FavoritesService] Favorite data:', favoriteData);
    await setDoc(doc(db, this.COLLECTION_NAME, favoriteData.id), favoriteData);
    console.log('[FavoritesService] Successfully added to favorites');
  }

  /**
   * Remove a project from user's favorites
   */
  static async removeFromFavorites(projectId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to remove favorites');
    }

    try {
      console.log('[FavoritesService] Removing from favorites:', { projectId, userId: user.uid });
      const favoriteId = `${user.uid}_${projectId}`;
      await deleteDoc(doc(db, this.COLLECTION_NAME, favoriteId));
      console.log('[FavoritesService] Successfully removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }

  /**
   * Check if a project is in user's favorites
   */
  static async isFavorite(projectId: string): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const favoriteId = `${user.uid}_${projectId}`;
      const favoriteDoc = await getDoc(doc(db, this.COLLECTION_NAME, favoriteId));
      return favoriteDoc.exists();
    } catch (error) {
      console.error('Error checking if project is favorite:', error);
      return false;
    }
  }

  /**
   * Get all user's favorite projects
   */
  static async getFavorites(): Promise<FavoriteProject[]> {
    const user = auth.currentUser;
    console.log('[FavoritesService] Getting favorites for user:', user?.uid);
    
    if (!user) {
      console.log('[FavoritesService] No user, returning empty array');
      return [];
    }

    try {
      console.log('[FavoritesService] Querying favorites collection...');
      
      // Test if we can access the collection at all
      try {
        const testQuery = query(collection(db, this.COLLECTION_NAME), limit(1));
        const testSnapshot = await getDocs(testQuery);
        console.log('[FavoritesService] Can access favorites collection, test query returned:', testSnapshot.docs.length, 'documents');
      } catch (testError) {
        console.error('[FavoritesService] Cannot access favorites collection:', testError);
        return [];
      }
      
      const favoritesQuery = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', user.uid),
        orderBy('addedAt', 'asc'),
        orderBy('__name__', 'asc')
      );

      const snapshot = await getDocs(favoritesQuery);
      console.log('[FavoritesService] Found favorites documents:', snapshot.docs.length);
      
      const favorites = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : data.addedAt
        } as FavoriteProject;
      });
      
      console.log('[FavoritesService] Processed favorites:', favorites.map(f => ({ id: f.id, projectId: f.projectId })));
      return favorites;
    } catch (error) {
      console.error('[FavoritesService] Error getting favorites:', error);
      return [];
    }
  }

  /**
   * Get favorite project IDs for a user
   */
  static async getFavoriteProjectIds(): Promise<string[]> {
    console.log('[FavoritesService] Getting favorite project IDs...');
    const user = auth.currentUser;
    console.log('[FavoritesService] Current user:', user?.uid);
    
    if (!user) {
      console.log('[FavoritesService] No user authenticated, returning empty array');
      return [];
    }

    try {
      const favorites = await this.getFavorites();
      const favoriteIds = favorites.map(fav => fav.projectId);
      console.log('[FavoritesService] Found favorite IDs:', favoriteIds);
      return favoriteIds;
    } catch (error) {
      console.error('[FavoritesService] Error getting favorite project IDs:', error);
      return [];
    }
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