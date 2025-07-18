"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[997],{

/***/ 6997:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  l: () => (/* binding */ SocialService)
});

// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
;// ./src/utilities/userUtils.ts


class UserUtils {
    static async getUserProfile(userId) {
        try {
            // Check cache first
            if (this.userCache.has(userId)) {
                return this.userCache.get(userId) || null;
            }
            // Try to get from users collection first
            const userDoc = await (0,index_esm/* getDoc */.x7)((0,index_esm/* doc */.H9)(firebase.db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const profile = {
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
            const crewDoc = await (0,index_esm/* getDoc */.x7)((0,index_esm/* doc */.H9)(firebase.db, 'crewProfiles', userId));
            if (crewDoc.exists()) {
                const crewData = crewDoc.data();
                const profile = {
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
        }
        catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }
    static async getUserDisplayName(userId) {
        const profile = await this.getUserProfile(userId);
        return profile?.displayName || `User ${userId.slice(-4)}`;
    }
    static async getUserAvatar(userId) {
        const profile = await this.getUserProfile(userId);
        return profile?.avatarUrl;
    }
    static async getMultipleUserProfiles(userIds) {
        try {
            const profiles = new Map();
            const uncachedIds = [];
            // Check cache first
            userIds.forEach(userId => {
                if (this.userCache.has(userId)) {
                    const cached = this.userCache.get(userId);
                    if (cached) {
                        profiles.set(userId, cached);
                    }
                }
                else {
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
                const chunkProfiles = new Map();
                // Try users collection first for the entire chunk
                const userPromises = chunk.map(async (userId) => {
                    try {
                        const userDoc = await (0,index_esm/* getDoc */.x7)((0,index_esm/* doc */.H9)(firebase.db, 'users', userId));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            const profile = {
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
                    }
                    catch (error) {
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
                            const crewDoc = await (0,index_esm/* getDoc */.x7)((0,index_esm/* doc */.H9)(firebase.db, 'crewProfiles', userId));
                            if (crewDoc.exists()) {
                                const crewData = crewDoc.data();
                                const profile = {
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
                        }
                        catch (error) {
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
        }
        catch (error) {
            console.error('Error fetching multiple user profiles:', error);
            return new Map();
        }
    }
    static clearCache() {
        this.userCache.clear();
    }
    static clearUserFromCache(userId) {
        this.userCache.delete(userId);
    }
    // Cache warming strategy for better performance
    static async warmCache(userIds) {
        try {
            console.log(`[UserUtils] Warming cache for ${userIds.length} users`);
            await this.getMultipleUserProfiles(userIds);
        }
        catch (error) {
            console.error('Error warming cache:', error);
        }
    }
    // Get cache statistics for debugging
    static getCacheStats() {
        return {
            size: this.userCache.size,
            hitRate: 0 // Could be calculated if we track hits/misses
        };
    }
    // Preload profiles for common users (e.g., current user's connections)
    static async preloadCommonProfiles(currentUserId, connectionIds) {
        try {
            const profilesToPreload = connectionIds.filter(id => !this.userCache.has(id));
            if (profilesToPreload.length > 0) {
                console.log(`[UserUtils] Preloading ${profilesToPreload.length} common profiles`);
                await this.getMultipleUserProfiles(profilesToPreload);
            }
        }
        catch (error) {
            console.error('Error preloading common profiles:', error);
        }
    }
    // Cache management methods
    static clearUserCache() {
        console.log('[UserUtils] Clearing user cache');
        this.userCache.clear();
    }
    static warmUserCache(userIds) {
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
UserUtils.userCache = new Map();

;// ./src/utilities/socialService.ts



class SocialService {
    // Follow Request Operations
    static async sendFollowRequest(fromUserId, toUserId, message) {
        try {
            console.log('[SocialService] Sending follow request:', { fromUserId, toUserId, message });
            // Check if request already exists
            const existingRequest = await this.getFollowRequest(fromUserId, toUserId);
            if (existingRequest) {
                console.log('[SocialService] Follow request already exists');
                throw new Error('Follow request already exists');
            }
            // Check if already following
            const existingFollow = await this.getFollow(fromUserId, toUserId);
            if (existingFollow) {
                console.log('[SocialService] Already following this user');
                throw new Error('Already following this user');
            }
            // Get user names for display
            const fromUserName = await UserUtils.getUserDisplayName(fromUserId);
            const toUserName = await UserUtils.getUserDisplayName(toUserId);
            const requestData = {
                fromUserId,
                toUserId,
                fromUserName,
                toUserName,
                status: 'pending',
                message: message || '',
                createdAt: (0,index_esm/* serverTimestamp */.O5)(),
                updatedAt: (0,index_esm/* serverTimestamp */.O5)()
            };
            console.log('[SocialService] Creating follow request with data:', requestData);
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'followRequests'), requestData);
            console.log('[SocialService] Follow request created successfully');
            // Create notification for the target user
            console.log('[SocialService] Creating notification for user:', toUserId);
            await this.createNotification({
                userId: toUserId,
                type: 'follow_request',
                title: 'New Follow Request',
                message: `${fromUserName} wants to follow you`,
                relatedUserId: fromUserId,
                isRead: false,
                createdAt: new Date(),
                actionUrl: `/social/requests`
            });
            console.log('[SocialService] Notification created successfully');
        }
        catch (error) {
            console.error('Error sending follow request:', error);
            throw error;
        }
    }
    static async getFollowRequest(fromUserId, toUserId) {
        try {
            const requestsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'followRequests'), (0,index_esm/* where */._M)('fromUserId', '==', fromUserId), (0,index_esm/* where */._M)('toUserId', '==', toUserId), (0,index_esm/* where */._M)('status', '==', 'pending'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(requestsQuery);
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                    updatedAt: doc.data().updatedAt?.toDate()
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error getting follow request:', error);
            return null;
        }
    }
    static async respondToFollowRequest(requestId, status) {
        try {
            const batch = (0,index_esm/* writeBatch */.wP)(firebase.db);
            const requestRef = (0,index_esm/* doc */.H9)(firebase.db, 'followRequests', requestId);
            // Update request status instead of deleting
            batch.update(requestRef, {
                status,
                updatedAt: (0,index_esm/* serverTimestamp */.O5)()
            });
            // Get the request data
            const requestDoc = await (0,index_esm/* getDoc */.x7)(requestRef);
            if (!requestDoc.exists()) {
                throw new Error('Follow request not found');
            }
            const requestData = requestDoc.data();
            const { fromUserId, toUserId } = requestData;
            if (status === 'accepted') {
                // Create follow relationship
                const followData = {
                    followerId: fromUserId,
                    followingId: toUserId,
                    status: 'active',
                    createdAt: (0,index_esm/* serverTimestamp */.O5)()
                };
                const followRef = (0,index_esm/* doc */.H9)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'));
                batch.set(followRef, followData);
                // Create notification for the requester
                await this.createNotification({
                    userId: fromUserId,
                    type: 'follow_accepted',
                    title: 'Follow Request Accepted',
                    message: 'Your follow request was accepted',
                    relatedUserId: toUserId,
                    isRead: false,
                    createdAt: new Date(),
                    actionUrl: `/social/profile/${toUserId}`
                });
                // Create activity feed item
                await this.createActivityFeedItem({
                    userId: fromUserId,
                    type: 'follow_made',
                    title: 'New Follower',
                    description: 'You gained a new follower',
                    relatedUserId: toUserId,
                    likes: 0,
                    comments: 0,
                    createdAt: new Date(),
                    isPublic: true
                });
            }
            await batch.commit();
        }
        catch (error) {
            console.error('Error responding to follow request:', error);
            throw error;
        }
    }
    // Follow Operations
    static async getFollow(followerId, followingId) {
        try {
            const followQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followerId', '==', followerId), (0,index_esm/* where */._M)('followingId', '==', followingId), (0,index_esm/* where */._M)('status', '==', 'active'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(followQuery);
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                const data = doc.data();
                return {
                    id: doc.id,
                    followerId: data.followerId || followerId,
                    followingId: data.followingId || followingId,
                    status: data.status || 'active',
                    createdAt: data.createdAt?.toDate() || new Date(),
                    lastInteraction: data.lastInteraction?.toDate()
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error getting follow:', error);
            return null;
        }
    }
    static async unfollow(followerId, followingId) {
        try {
            const follow = await this.getFollow(followerId, followingId);
            if (!follow) {
                throw new Error('Not following this user');
            }
            await (0,index_esm/* deleteDoc */.kd)((0,index_esm/* doc */.H9)(firebase.db, 'follows', follow.id));
        }
        catch (error) {
            console.error('Error unfollowing:', error);
            throw error;
        }
    }
    // Real-time Listeners
    static subscribeToFollowRequests(userId, callback) {
        try {
            console.log('[SocialService] Setting up follow requests listener for user:', userId);
            const requestsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'followRequests'), (0,index_esm/* where */._M)('toUserId', '==', userId), (0,index_esm/* where */._M)('status', '==', 'pending'), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            return (0,index_esm/* onSnapshot */.aQ)(requestsQuery, (snapshot) => {
                try {
                    const requests = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate(),
                        updatedAt: doc.data().updatedAt?.toDate()
                    }));
                    console.log('[SocialService] Follow requests updated:', requests.length);
                    callback(requests);
                }
                catch (error) {
                    console.error('[SocialService] Error processing follow requests snapshot:', error);
                    callback([]);
                }
            }, (error) => {
                console.error('[SocialService] Follow requests listener error:', error);
                callback([]);
            });
        }
        catch (error) {
            console.error('[SocialService] Error setting up follow requests listener:', error);
            return () => { };
        }
    }
    static subscribeToFollowers(userId, callback) {
        try {
            console.log('[SocialService] Setting up followers listener for user:', userId);
            const followersQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followingId', '==', userId), (0,index_esm/* where */._M)('status', '==', 'active'), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            return (0,index_esm/* onSnapshot */.aQ)(followersQuery, (snapshot) => {
                try {
                    const follows = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            followerId: data.followerId || '',
                            followingId: data.followingId || '',
                            status: data.status || 'active',
                            createdAt: data.createdAt?.toDate() || new Date(),
                            lastInteraction: data.lastInteraction?.toDate()
                        };
                    });
                    console.log('[SocialService] Followers updated:', follows.length);
                    callback(follows);
                }
                catch (error) {
                    console.error('[SocialService] Error processing followers snapshot:', error);
                    callback([]);
                }
            }, (error) => {
                console.error('[SocialService] Followers listener error:', error);
                callback([]);
            });
        }
        catch (error) {
            console.error('[SocialService] Error setting up followers listener:', error);
            return () => { };
        }
    }
    static subscribeToFollowing(userId, callback) {
        try {
            console.log('[SocialService] Setting up following listener for user:', userId);
            const followingQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followerId', '==', userId), (0,index_esm/* where */._M)('status', '==', 'active'), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            return (0,index_esm/* onSnapshot */.aQ)(followingQuery, (snapshot) => {
                try {
                    const follows = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            followerId: data.followerId || '',
                            followingId: data.followingId || '',
                            status: data.status || 'active',
                            createdAt: data.createdAt?.toDate() || new Date(),
                            lastInteraction: data.lastInteraction?.toDate()
                        };
                    });
                    console.log('[SocialService] Following updated:', follows.length);
                    callback(follows);
                }
                catch (error) {
                    console.error('[SocialService] Error processing following snapshot:', error);
                    callback([]);
                }
            }, (error) => {
                console.error('[SocialService] Following listener error:', error);
                callback([]);
            });
        }
        catch (error) {
            console.error('[SocialService] Error setting up following listener:', error);
            return () => { };
        }
    }
    static subscribeToNotifications(userId, callback) {
        try {
            console.log('[SocialService] Setting up notifications listener for user:', userId);
            const notificationsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'notifications'), (0,index_esm/* where */._M)('userId', '==', userId), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            return (0,index_esm/* onSnapshot */.aQ)(notificationsQuery, (snapshot) => {
                try {
                    const notifications = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate()
                    }));
                    console.log('[SocialService] Notifications updated:', notifications.length);
                    callback(notifications);
                }
                catch (error) {
                    console.error('[SocialService] Error processing notifications snapshot:', error);
                    callback([]);
                }
            }, (error) => {
                console.error('[SocialService] Notifications listener error:', error);
                callback([]);
            });
        }
        catch (error) {
            console.error('[SocialService] Error setting up notifications listener:', error);
            return () => { };
        }
    }
    // Notification Operations
    static async createNotification(notification) {
        try {
            console.log('[SocialService] Creating notification:', notification);
            const docRef = await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'notifications'), {
                ...notification,
                createdAt: (0,index_esm/* serverTimestamp */.O5)()
            });
            console.log('[SocialService] Notification created with ID:', docRef.id);
        }
        catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }
    static async markNotificationAsRead(notificationId) {
        try {
            const notificationRef = (0,index_esm/* doc */.H9)(firebase.db, 'notifications', notificationId);
            await (0,index_esm/* updateDoc */.mZ)(notificationRef, { isRead: true });
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }
    // Activity Feed Operations
    static async createActivityFeedItem(item) {
        try {
            console.log('[SocialService] Creating activity feed item:', item);
            const activityData = {
                ...item,
                createdAt: (0,index_esm/* serverTimestamp */.O5)()
            };
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'activityFeed'), activityData);
            // Clear activity feed cache to ensure fresh data
            this.clearActivityFeedCache();
            console.log('[SocialService] Activity feed item created successfully');
        }
        catch (error) {
            console.error('Error creating activity feed item:', error);
            throw error;
        }
    }
    static async getActivityFeed(userId, itemLimit = 20) {
        try {
            console.log('[SocialService] Getting activity feed for user:', userId);
            // Check cache first
            const cacheKey = `activityFeed_${userId}_${itemLimit}`;
            const cached = this.activityFeedCache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
                console.log('[SocialService] Returning cached activity feed (cache hit)');
                return cached.data;
            }
            // Request deduplication - if same request is in progress, wait for it
            if (this.pendingRequests.has(cacheKey)) {
                console.log('[SocialService] Request already in progress, waiting...');
                return await this.pendingRequests.get(cacheKey);
            }
            // Create the request promise
            const requestPromise = this.executeActivityFeedQuery(userId, itemLimit);
            this.pendingRequests.set(cacheKey, requestPromise);
            try {
                const items = await requestPromise;
                // Cache the result with size management
                this.activityFeedCache.set(cacheKey, {
                    data: items,
                    timestamp: Date.now(),
                    ttl: this.CACHE_TTL
                });
                // Clean up cache if it gets too large (remove oldest entries)
                if (this.activityFeedCache.size > this.MAX_CACHE_SIZE) {
                    const entries = Array.from(this.activityFeedCache.entries());
                    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
                    const toDelete = entries.slice(0, entries.length - this.MAX_CACHE_SIZE + 5);
                    toDelete.forEach(([key]) => this.activityFeedCache.delete(key));
                }
                return items;
            }
            finally {
                // Clean up pending request
                this.pendingRequests.delete(cacheKey);
            }
        }
        catch (error) {
            console.error('Error getting activity feed:', error);
            return [];
        }
    }
    static async executeActivityFeedQuery(userId, itemLimit) {
        try {
            console.log('[SocialService] Executing optimized activity feed query for user:', userId);
            // Use a single, efficient query with better performance
            // Focus on recent public activities for better performance
            const now = new Date();
            const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // Reduced to 2 days
            const feedQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'activityFeed'), (0,index_esm/* where */._M)('isPublic', '==', true), (0,index_esm/* where */._M)('createdAt', '>=', twoDaysAgo), (0,index_esm/* orderBy */.My)('createdAt', 'desc'), (0,index_esm/* limit */.AB)(itemLimit));
            const snapshot = await (0,index_esm/* getDocs */.GG)(feedQuery);
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
            console.log('[SocialService] Retrieved', items.length, 'activity feed items (optimized single query)');
            return items;
        }
        catch (error) {
            console.error('Error executing activity feed query:', error);
            // Fallback to simplest query if the optimized one fails
            try {
                console.log('[SocialService] Falling back to simple query...');
                const fallbackQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'activityFeed'), (0,index_esm/* where */._M)('isPublic', '==', true), (0,index_esm/* orderBy */.My)('createdAt', 'desc'), (0,index_esm/* limit */.AB)(itemLimit));
                const snapshot = await (0,index_esm/* getDocs */.GG)(fallbackQuery);
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate()
                }));
                console.log('[SocialService] Fallback query returned', items.length, 'items');
                return items;
            }
            catch (fallbackError) {
                console.error('Error in fallback query:', fallbackError);
                throw error;
            }
        }
    }
    static subscribeToActivityFeed(userId, callback) {
        try {
            console.log('[SocialService] Setting up activity feed listener for user:', userId);
            const feedQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'activityFeed'), (0,index_esm/* where */._M)('isPublic', '==', true), (0,index_esm/* orderBy */.My)('createdAt', 'desc'), (0,index_esm/* limit */.AB)(20));
            return (0,index_esm/* onSnapshot */.aQ)(feedQuery, (snapshot) => {
                try {
                    const items = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate()
                    }));
                    console.log('[SocialService] Activity feed updated:', items.length, 'items');
                    callback(items);
                }
                catch (error) {
                    console.error('[SocialService] Error processing activity feed snapshot:', error);
                    callback([]);
                }
            }, (error) => {
                console.error('[SocialService] Activity feed listener error:', error);
                callback([]);
            });
        }
        catch (error) {
            console.error('[SocialService] Error setting up activity feed listener:', error);
            return () => { };
        }
    }
    // Like Operations
    static async likeActivity(activityId, userId, userName) {
        try {
            console.log('[SocialService] Liking activity:', activityId, 'by user:', userId);
            // Check if already liked
            const existingLike = await this.getLike(activityId, userId);
            if (existingLike) {
                console.log('[SocialService] User already liked this activity');
                return;
            }
            // Create like
            const likeData = {
                activityId,
                userId,
                userName,
                createdAt: (0,index_esm/* serverTimestamp */.O5)()
            };
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'likes'), likeData);
            // Update activity feed item likes count
            const activityRef = (0,index_esm/* doc */.H9)(firebase.db, 'activityFeed', activityId);
            await (0,index_esm/* updateDoc */.mZ)(activityRef, {
                likes: (0,index_esm/* increment */.GV)(1)
            });
            console.log('[SocialService] Activity liked successfully');
        }
        catch (error) {
            console.error('Error liking activity:', error);
            throw error;
        }
    }
    static async unlikeActivity(activityId, userId) {
        try {
            console.log('[SocialService] Unliking activity:', activityId, 'by user:', userId);
            // Find and delete like
            const like = await this.getLike(activityId, userId);
            if (like) {
                await (0,index_esm/* deleteDoc */.kd)((0,index_esm/* doc */.H9)(firebase.db, 'likes', like.id));
                // Update activity feed item likes count
                const activityRef = (0,index_esm/* doc */.H9)(firebase.db, 'activityFeed', activityId);
                await (0,index_esm/* updateDoc */.mZ)(activityRef, {
                    likes: (0,index_esm/* increment */.GV)(-1)
                });
            }
            console.log('[SocialService] Activity unliked successfully');
        }
        catch (error) {
            console.error('Error unliking activity:', error);
            throw error;
        }
    }
    static async getLike(activityId, userId) {
        try {
            const likeQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'likes'), (0,index_esm/* where */._M)('activityId', '==', activityId), (0,index_esm/* where */._M)('userId', '==', userId));
            const snapshot = await (0,index_esm/* getDocs */.GG)(likeQuery);
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                return {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate()
                };
            }
            return null;
        }
        catch (error) {
            console.error('Error getting like:', error);
            return null;
        }
    }
    static async getLikesForActivity(activityId) {
        try {
            const likesQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'likes'), (0,index_esm/* where */._M)('activityId', '==', activityId), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(likesQuery);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
        }
        catch (error) {
            console.error('Error getting likes for activity:', error);
            return [];
        }
    }
    // Comment Operations
    static async addComment(activityId, userId, userName, userAvatar, content) {
        try {
            console.log('[SocialService] Adding comment to activity:', activityId);
            const commentData = {
                activityId,
                userId,
                userName,
                userAvatar,
                content,
                likes: 0,
                createdAt: (0,index_esm/* serverTimestamp */.O5)(),
                replies: []
            };
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'comments'), commentData);
            // Update activity feed item comments count
            const activityRef = (0,index_esm/* doc */.H9)(firebase.db, 'activityFeed', activityId);
            await (0,index_esm/* updateDoc */.mZ)(activityRef, {
                comments: (0,index_esm/* increment */.GV)(1)
            });
            console.log('[SocialService] Comment added successfully');
        }
        catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }
    static async getCommentsForActivity(activityId) {
        try {
            const commentsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'comments'), (0,index_esm/* where */._M)('activityId', '==', activityId), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(commentsQuery);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
        }
        catch (error) {
            console.error('Error getting comments for activity:', error);
            return [];
        }
    }
    static subscribeToActivityComments(activityId, callback) {
        try {
            console.log('[SocialService] Setting up comments listener for activity:', activityId);
            const commentsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'comments'), (0,index_esm/* where */._M)('activityId', '==', activityId), (0,index_esm/* orderBy */.My)('createdAt', 'desc'));
            return (0,index_esm/* onSnapshot */.aQ)(commentsQuery, (snapshot) => {
                try {
                    const comments = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate()
                    }));
                    console.log('[SocialService] Comments updated for activity', activityId, ':', comments.length, 'comments');
                    callback(comments);
                }
                catch (error) {
                    console.error('[SocialService] Error processing comments snapshot:', error);
                    callback([]);
                }
            }, (error) => {
                console.error('[SocialService] Comments listener error:', error);
                callback([]);
            });
        }
        catch (error) {
            console.error('[SocialService] Error setting up comments listener:', error);
            return () => { };
        }
    }
    // Utility Methods
    static async getFollowStatus(currentUserId, targetUserId) {
        try {
            // Check if following
            const follow = await this.getFollow(currentUserId, targetUserId);
            if (follow)
                return 'following';
            // Check if request pending
            const request = await this.getFollowRequest(currentUserId, targetUserId);
            if (request && request.status === 'pending')
                return 'pending';
            return 'none';
        }
        catch (error) {
            console.error('Error getting follow status:', error);
            return 'none';
        }
    }
    static async getFollowersCount(userId) {
        try {
            const followersQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followingId', '==', userId), (0,index_esm/* where */._M)('status', '==', 'active'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(followersQuery);
            return snapshot.size;
        }
        catch (error) {
            console.error('Error getting followers count:', error);
            return 0;
        }
    }
    static async getFollowingCount(userId) {
        try {
            const followingQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'follows'), (0,index_esm/* where */._M)('followerId', '==', userId), (0,index_esm/* where */._M)('status', '==', 'active'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(followingQuery);
            return snapshot.size;
        }
        catch (error) {
            console.error('Error getting following count:', error);
            return 0;
        }
    }
    // Clear activity feed cache when new items are added
    static clearActivityFeedCache() {
        console.log('[SocialService] Clearing activity feed cache');
        this.activityFeedCache.clear();
    }
    static clearUserActivityFeedCache(userId) {
        console.log('[SocialService] Clearing activity feed cache for user:', userId);
        const keysToDelete = [];
        for (const [key] of this.activityFeedCache) {
            if (key.includes(`activityFeed_${userId}_`)) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.activityFeedCache.delete(key));
    }
    static clearAllActivityFeedCache() {
        console.log('[SocialService] Clearing all activity feed cache');
        this.activityFeedCache.clear();
        this.pendingRequests.clear();
    }
    // Crew Profile Operations
    static async getCrewProfiles() {
        try {
            console.log('[SocialService] Fetching crew profiles');
            const profilesQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* where */._M)('isPublished', '==', true));
            const snapshot = await (0,index_esm/* getDocs */.GG)(profilesQuery);
            const profiles = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));
            // Sort in memory instead of using orderBy to avoid index requirement
            profiles.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            console.log('[SocialService] Fetched crew profiles:', profiles.length);
            return profiles;
        }
        catch (error) {
            console.error('[SocialService] Error fetching crew profiles:', error);
            return [];
        }
    }
    /**
     * Send a collaboration request notification to a user for a screenplay/project.
     * This does NOT add them to teamMembers directly; approval is required.
     */
    static async sendCollaborationRequest({ inviteeId, inviterId, screenplayId, screenplayName, inviterName }) {
        try {
            // Check for existing pending request
            const notificationsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'notifications'), (0,index_esm/* where */._M)('userId', '==', inviteeId), (0,index_esm/* where */._M)('type', '==', 'collaboration_request'), (0,index_esm/* where */._M)('relatedScreenplayId', '==', screenplayId), (0,index_esm/* where */._M)('relatedUserId', '==', inviterId));
            const existing = await (0,index_esm/* getDocs */.GG)(notificationsQuery);
            if (!existing.empty) {
                throw new Error('A collaboration request is already pending for this user and screenplay.');
            }
            // Create the notification
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'notifications'), {
                userId: inviteeId,
                type: 'collaboration_request',
                title: 'Collaboration Request',
                message: `${inviterName} has invited you to collaborate on "${screenplayName}".`,
                relatedScreenplayId: screenplayId,
                relatedUserId: inviterId,
                isRead: false,
                createdAt: (0,index_esm/* serverTimestamp */.O5)(),
                actionUrl: `/screenplays/${screenplayId}/collab-request`
            });
        }
        catch (error) {
            console.error('Error sending collaboration request:', error);
            throw error;
        }
    }
    static subscribeToOutgoingFollowRequests(userId, callback) {
        try {
            console.log('[SocialService] Setting up outgoing follow requests listener for user:', userId);
            const requestsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'followRequests'), (0,index_esm/* where */._M)('fromUserId', '==', userId)
            // Temporarily remove orderBy to avoid index requirement
            // orderBy('createdAt', 'desc')
            );
            return (0,index_esm/* onSnapshot */.aQ)(requestsQuery, (snapshot) => {
                try {
                    const requests = snapshot.docs
                        .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate(),
                        updatedAt: doc.data().updatedAt?.toDate()
                    }))
                        .filter(request => request.status === 'pending' && request.createdAt) // Filter in memory, only with valid createdAt
                        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort in memory
                    console.log('[SocialService] Outgoing follow requests updated:', requests.length);
                    callback(requests);
                }
                catch (error) {
                    console.error('[SocialService] Error processing outgoing follow requests snapshot:', error);
                    callback([]);
                }
            }, (error) => {
                console.error('[SocialService] Outgoing follow requests listener error:', error);
                callback([]);
            });
        }
        catch (error) {
            console.error('[SocialService] Error setting up outgoing follow requests listener:', error);
            return () => { };
        }
    }
}
// Cache for activity feed
SocialService.activityFeedCache = new Map();
SocialService.CACHE_TTL = 3 * 60 * 1000; // 3 minutes (increased for better caching)
SocialService.pendingRequests = new Map();
SocialService.MAX_CACHE_SIZE = 30; // Reduced cache size for better memory management


/***/ })

}]);
//# sourceMappingURL=997.chunk.js.map