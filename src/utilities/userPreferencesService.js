"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferencesService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../firebase");
class UserPreferencesService {
    /**
     * Get user preferences
     */
    static async getUserPreferences(userId) {
        try {
            const currentUser = firebase_1.auth.currentUser;
            const targetUserId = userId || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid);
            if (!targetUserId) {
                console.error('No user ID provided and no authenticated user');
                return null;
            }
            const docRef = (0, firestore_1.doc)(firebase_1.db, this.COLLECTION_NAME, targetUserId);
            const docSnap = await (0, firestore_1.getDoc)(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            else {
                // Return default preferences if none exist
                return this.getDefaultPreferences();
            }
        }
        catch (error) {
            console.error('Error getting user preferences:', error);
            return null;
        }
    }
    /**
     * Save user preferences
     */
    static async saveUserPreferences(preferences, userId) {
        try {
            const currentUser = firebase_1.auth.currentUser;
            const targetUserId = userId || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid);
            if (!targetUserId) {
                console.error('No user ID provided and no authenticated user');
                return false;
            }
            const docRef = (0, firestore_1.doc)(firebase_1.db, this.COLLECTION_NAME, targetUserId);
            await (0, firestore_1.setDoc)(docRef, preferences, { merge: true });
            console.log('User preferences saved successfully');
            return true;
        }
        catch (error) {
            console.error('Error saving user preferences:', error);
            return false;
        }
    }
    /**
     * Update specific user preferences
     */
    static async updateUserPreferences(updates, userId) {
        try {
            const currentUser = firebase_1.auth.currentUser;
            const targetUserId = userId || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid);
            if (!targetUserId) {
                console.error('No user ID provided and no authenticated user');
                return false;
            }
            const docRef = (0, firestore_1.doc)(firebase_1.db, this.COLLECTION_NAME, targetUserId);
            await (0, firestore_1.updateDoc)(docRef, updates);
            console.log('User preferences updated successfully');
            return true;
        }
        catch (error) {
            console.error('Error updating user preferences:', error);
            return false;
        }
    }
    /**
     * Get notification settings specifically
     */
    static async getNotificationSettings(userId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        try {
            const preferences = await this.getUserPreferences(userId);
            if (!preferences)
                return null;
            return {
                emailNotifications: (_a = preferences.emailNotifications) !== null && _a !== void 0 ? _a : true,
                pushNotifications: (_b = preferences.pushNotifications) !== null && _b !== void 0 ? _b : true,
                jobApplicationNotifications: (_c = preferences.jobApplicationNotifications) !== null && _c !== void 0 ? _c : true,
                projectInvitationNotifications: (_d = preferences.projectInvitationNotifications) !== null && _d !== void 0 ? _d : true,
                taskAssignmentNotifications: (_e = preferences.taskAssignmentNotifications) !== null && _e !== void 0 ? _e : true,
                messageNotifications: (_f = preferences.messageNotifications) !== null && _f !== void 0 ? _f : true,
                projectUpdateNotifications: (_g = preferences.projectUpdateNotifications) !== null && _g !== void 0 ? _g : true,
                applicationStatusNotifications: (_h = preferences.applicationStatusNotifications) !== null && _h !== void 0 ? _h : true,
                notificationFrequency: (_j = preferences.notificationFrequency) !== null && _j !== void 0 ? _j : 'immediate'
            };
        }
        catch (error) {
            console.error('Error getting notification settings:', error);
            return null;
        }
    }
    /**
     * Update notification settings
     */
    static async updateNotificationSettings(settings, userId) {
        try {
            return await this.updateUserPreferences(settings, userId);
        }
        catch (error) {
            console.error('Error updating notification settings:', error);
            return false;
        }
    }
    /**
     * Toggle email notifications
     */
    static async toggleEmailNotifications(enabled, userId) {
        try {
            return await this.updateUserPreferences({ emailNotifications: enabled }, userId);
        }
        catch (error) {
            console.error('Error toggling email notifications:', error);
            return false;
        }
    }
    /**
     * Toggle push notifications
     */
    static async togglePushNotifications(enabled, userId) {
        try {
            return await this.updateUserPreferences({ pushNotifications: enabled }, userId);
        }
        catch (error) {
            console.error('Error toggling push notifications:', error);
            return false;
        }
    }
    /**
     * Toggle specific notification type
     */
    static async toggleNotificationType(type, enabled, userId) {
        try {
            const update = { [type]: enabled };
            return await this.updateUserPreferences(update, userId);
        }
        catch (error) {
            console.error(`Error toggling ${type} notifications:`, error);
            return false;
        }
    }
    /**
     * Set notification frequency
     */
    static async setNotificationFrequency(frequency, userId) {
        try {
            return await this.updateUserPreferences({ notificationFrequency: frequency }, userId);
        }
        catch (error) {
            console.error('Error setting notification frequency:', error);
            return false;
        }
    }
    /**
     * Get users with specific notification preferences
     */
    static async getUsersWithNotificationType(type, enabled = true) {
        try {
            const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, this.COLLECTION_NAME), (0, firestore_1.where)(type, '==', enabled));
            const querySnapshot = await (0, firestore_1.getDocs)(q);
            return querySnapshot.docs.map(doc => doc.id);
        }
        catch (error) {
            console.error(`Error getting users with ${type} notifications:`, error);
            return [];
        }
    }
    /**
     * Get default preferences
     */
    static getDefaultPreferences() {
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
            // Daily digest settings
            dailyDigestEnabled: false, // Default to false, user can enable
            messageNotificationFrequency: 'immediate', // Default to immediate for messages
            digestTime: '09:00', // Default to 9 AM
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: 'en',
            theme: 'light'
        };
    }
    /**
     * Initialize user preferences with defaults
     */
    static async initializeUserPreferences(userId) {
        try {
            const currentUser = firebase_1.auth.currentUser;
            const targetUserId = userId || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.uid);
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
        }
        catch (error) {
            console.error('Error initializing user preferences:', error);
            return false;
        }
    }
    /**
     * Reset user preferences to defaults
     */
    static async resetUserPreferences(userId) {
        try {
            const defaultPreferences = this.getDefaultPreferences();
            return await this.saveUserPreferences(defaultPreferences, userId);
        }
        catch (error) {
            console.error('Error resetting user preferences:', error);
            return false;
        }
    }
    /**
     * Check if user has email notifications enabled
     */
    static async hasEmailNotificationsEnabled(userId) {
        var _a;
        try {
            const preferences = await this.getUserPreferences(userId);
            return (_a = preferences === null || preferences === void 0 ? void 0 : preferences.emailNotifications) !== null && _a !== void 0 ? _a : true;
        }
        catch (error) {
            console.error('Error checking email notifications:', error);
            return true; // Default to true if error
        }
    }
    /**
     * Check if user has push notifications enabled
     */
    static async hasPushNotificationsEnabled(userId) {
        var _a;
        try {
            const preferences = await this.getUserPreferences(userId);
            return (_a = preferences === null || preferences === void 0 ? void 0 : preferences.pushNotifications) !== null && _a !== void 0 ? _a : true;
        }
        catch (error) {
            console.error('Error checking push notifications:', error);
            return true; // Default to true if error
        }
    }
}
exports.UserPreferencesService = UserPreferencesService;
UserPreferencesService.COLLECTION_NAME = 'userPreferences';
//# sourceMappingURL=userPreferencesService.js.map