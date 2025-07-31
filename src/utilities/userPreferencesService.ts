import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  jobApplicationNotifications: boolean;
  projectInvitationNotifications: boolean;
  taskAssignmentNotifications: boolean;
  messageNotifications: boolean;
  projectUpdateNotifications: boolean;
  applicationStatusNotifications: boolean;
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
  timezone?: string;
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  jobApplicationNotifications: boolean;
  projectInvitationNotifications: boolean;
  taskAssignmentNotifications: boolean;
  messageNotifications: boolean;
  projectUpdateNotifications: boolean;
  applicationStatusNotifications: boolean;
  notificationFrequency: 'immediate' | 'daily' | 'weekly';
}

export class UserPreferencesService {
  private static readonly COLLECTION_NAME = 'userPreferences';

  /**
   * Get user preferences
   */
  static async getUserPreferences(userId?: string): Promise<UserPreferences | null> {
    try {
      const currentUser = auth.currentUser;
      const targetUserId = userId || currentUser?.uid;

      if (!targetUserId) {
        console.error('No user ID provided and no authenticated user');
        return null;
      }

      const docRef = doc(db, this.COLLECTION_NAME, targetUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserPreferences;
      } else {
        // Return default preferences if none exist
        return this.getDefaultPreferences();
      }
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  }

  /**
   * Save user preferences
   */
  static async saveUserPreferences(preferences: Partial<UserPreferences>, userId?: string): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      const targetUserId = userId || currentUser?.uid;

      if (!targetUserId) {
        console.error('No user ID provided and no authenticated user');
        return false;
      }

      const docRef = doc(db, this.COLLECTION_NAME, targetUserId);
      await setDoc(docRef, preferences, { merge: true });

      console.log('User preferences saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  }

  /**
   * Update specific user preferences
   */
  static async updateUserPreferences(updates: Partial<UserPreferences>, userId?: string): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      const targetUserId = userId || currentUser?.uid;

      if (!targetUserId) {
        console.error('No user ID provided and no authenticated user');
        return false;
      }

      const docRef = doc(db, this.COLLECTION_NAME, targetUserId);
      await updateDoc(docRef, updates);

      console.log('User preferences updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }

  /**
   * Get notification settings specifically
   */
  static async getNotificationSettings(userId?: string): Promise<NotificationSettings | null> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) return null;

      return {
        emailNotifications: preferences.emailNotifications ?? true,
        pushNotifications: preferences.pushNotifications ?? true,
        jobApplicationNotifications: preferences.jobApplicationNotifications ?? true,
        projectInvitationNotifications: preferences.projectInvitationNotifications ?? true,
        taskAssignmentNotifications: preferences.taskAssignmentNotifications ?? true,
        messageNotifications: preferences.messageNotifications ?? true,
        projectUpdateNotifications: preferences.projectUpdateNotifications ?? true,
        applicationStatusNotifications: preferences.applicationStatusNotifications ?? true,
        notificationFrequency: preferences.notificationFrequency ?? 'immediate'
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(settings: Partial<NotificationSettings>, userId?: string): Promise<boolean> {
    try {
      return await this.updateUserPreferences(settings, userId);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return false;
    }
  }

  /**
   * Toggle email notifications
   */
  static async toggleEmailNotifications(enabled: boolean, userId?: string): Promise<boolean> {
    try {
      return await this.updateUserPreferences({ emailNotifications: enabled }, userId);
    } catch (error) {
      console.error('Error toggling email notifications:', error);
      return false;
    }
  }

  /**
   * Toggle push notifications
   */
  static async togglePushNotifications(enabled: boolean, userId?: string): Promise<boolean> {
    try {
      return await this.updateUserPreferences({ pushNotifications: enabled }, userId);
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      return false;
    }
  }

  /**
   * Toggle specific notification type
   */
  static async toggleNotificationType(
    type: keyof NotificationSettings,
    enabled: boolean,
    userId?: string
  ): Promise<boolean> {
    try {
      const update: Partial<NotificationSettings> = { [type]: enabled };
      return await this.updateUserPreferences(update, userId);
    } catch (error) {
      console.error(`Error toggling ${type} notifications:`, error);
      return false;
    }
  }

  /**
   * Set notification frequency
   */
  static async setNotificationFrequency(
    frequency: 'immediate' | 'daily' | 'weekly',
    userId?: string
  ): Promise<boolean> {
    try {
      return await this.updateUserPreferences({ notificationFrequency: frequency }, userId);
    } catch (error) {
      console.error('Error setting notification frequency:', error);
      return false;
    }
  }

  /**
   * Get users with specific notification preferences
   */
  static async getUsersWithNotificationType(type: keyof NotificationSettings, enabled: boolean = true): Promise<string[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where(type, '==', enabled)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error(`Error getting users with ${type} notifications:`, error);
      return [];
    }
  }

  /**
   * Get default preferences
   */
  static getDefaultPreferences(): UserPreferences {
    return {
      emailNotifications: true,
      pushNotifications: true,
      jobApplicationNotifications: true,
      projectInvitationNotifications: true,
      taskAssignmentNotifications: true,
      messageNotifications: true,
      projectUpdateNotifications: true,
      applicationStatusNotifications: true,
      notificationFrequency: 'immediate',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: 'en',
      theme: 'light'
    };
  }

  /**
   * Initialize user preferences with defaults
   */
  static async initializeUserPreferences(userId?: string): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      const targetUserId = userId || currentUser?.uid;

      if (!targetUserId) {
        console.error('No user ID provided and no authenticated user');
        return false;
      }

      const existingPreferences = await this.getUserPreferences(targetUserId);
      if (existingPreferences) {
        console.log('User preferences already exist');
        return true;
      }

      const defaultPreferences = this.getDefaultPreferences();
      return await this.saveUserPreferences(defaultPreferences, targetUserId);
    } catch (error) {
      console.error('Error initializing user preferences:', error);
      return false;
    }
  }

  /**
   * Reset user preferences to defaults
   */
  static async resetUserPreferences(userId?: string): Promise<boolean> {
    try {
      const defaultPreferences = this.getDefaultPreferences();
      return await this.saveUserPreferences(defaultPreferences, userId);
    } catch (error) {
      console.error('Error resetting user preferences:', error);
      return false;
    }
  }

  /**
   * Check if user has email notifications enabled
   */
  static async hasEmailNotificationsEnabled(userId?: string): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(userId);
      return preferences?.emailNotifications ?? true;
    } catch (error) {
      console.error('Error checking email notifications:', error);
      return true; // Default to true if error
    }
  }

  /**
   * Check if user has push notifications enabled
   */
  static async hasPushNotificationsEnabled(userId?: string): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(userId);
      return preferences?.pushNotifications ?? true;
    } catch (error) {
      console.error('Error checking push notifications:', error);
      return true; // Default to true if error
    }
  }
} 