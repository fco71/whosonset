"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[758],{

/***/ 835:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lx: () => (/* binding */ getProfileId),
/* harmony export */   Mn: () => (/* binding */ getDisplayName),
/* harmony export */   ed: () => (/* binding */ getPhotoUrl),
/* harmony export */   pu: () => (/* binding */ isCrewProfile)
/* harmony export */ });
/* unused harmony export isUserProfile */
// Type guard to check if a profile is a CrewProfile
function isCrewProfile(profile) {
    return 'jobTitles' in profile && 'residences' in profile;
}
// Type guard to check if a profile is a UserProfile
function isUserProfile(profile) {
    return !isCrewProfile(profile);
}
// Helper function to get a display name from any profile type
function getDisplayName(profile) {
    // Try all possible name/display fields for maximum compatibility
    if (isCrewProfile(profile)) {
        return (profile.name ||
            profile.displayName ||
            'Unknown Crew');
    }
    return (profile.displayName ||
        profile.name ||
        profile.firstName ||
        profile.username ||
        (typeof profile.email === 'string' ? profile.email.split('@')[0] : undefined) ||
        'Unknown User');
}
// Helper function to get a photo URL from any profile type
function getPhotoUrl(profile) {
    // Try all possible image fields for maximum compatibility, fallback to default
    let url = undefined;
    if (isCrewProfile(profile)) {
        url = profile.profileImageUrl || profile.photoURL || profile.avatarUrl;
    }
    else {
        url = profile.avatarUrl || profile.photoURL || profile.profileImageUrl;
    }
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return '/bust-avatar.svg';
    }
    return url;
}
// Helper to get the ID from any profile type
function getProfileId(profile) {
    if (isCrewProfile(profile)) {
        return profile.uid || profile.id;
    }
    return profile.id;
}


/***/ }),

/***/ 4672:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ MessagingService)
/* harmony export */ });
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9487);
/* harmony import */ var _socialService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9505);
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2539);





class MessagingService {
    // ===== DIRECT MESSAGE OPERATIONS =====
    static async sendDirectMessage(senderId, receiverId, content, messageType = 'text', relatedProjectId, fileUrl) {
        try {
            console.log('[MessagingService] Sending direct message from', senderId, 'to', receiverId);
            // Check permissions
            const canMessage = await this.canSendMessage(senderId, receiverId);
            if (!canMessage) {
                throw new Error('Cannot send message to this user. They may not allow messages from non-followers.');
            }
            // Create message data, filtering out undefined values
            const messageData = {
                senderId,
                receiverId,
                content,
                messageType,
                timestamp: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
                isRead: false,
                reactions: [],
                status: 'sent'
            };
            // Only add relatedProjectId if it's defined
            if (relatedProjectId) {
                messageData.relatedProjectId = relatedProjectId;
            }
            // Only add fileUrl if it's defined and not too long
            if (fileUrl) {
                // Check if fileUrl is too long for Firestore (limit to 500KB to be safe)
                if (fileUrl.length > 500 * 1024) {
                    console.warn('[MessagingService] File URL too long, truncating:', fileUrl.length, 'bytes');
                    messageData.fileUrl = `FILE_TOO_LARGE:${fileUrl.split('/').pop() || 'file'}`;
                }
                else {
                    messageData.fileUrl = fileUrl;
                }
            }
            // Add to Firestore
            const docRef = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages'), messageData);
            console.log('[MessagingService] Message sent successfully with ID:', docRef.id);
            // Update conversation cache
            this.updateConversationCache(senderId, receiverId, content, new Date());
            // Create notification for receiver
            await _socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.createNotification({
                userId: receiverId,
                type: 'message',
                title: 'New Message',
                message: `You have a new message`,
                relatedUserId: senderId,
                isRead: false,
                createdAt: new Date(),
                actionUrl: `/chat`
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error sending direct message:', error);
            throw error;
        }
    }
    static async canSendMessage(senderId, receiverId) {
        try {
            // For now, allow all authenticated users to send messages to each other
            // This can be enhanced later with proper permission checking
            console.log('[MessagingService] Allowing message from', senderId, 'to', receiverId);
            return true;
        }
        catch (error) {
            console.error('Error checking message permissions:', error);
            return false;
        }
    }
    static async getDirectMessages(userId1, userId2, limitCount = 50) {
        try {
            console.log('[MessagingService] Getting direct messages between', userId1, 'and', userId2);
            const cacheKey = `${userId1}_${userId2}`;
            const cachedMessages = this.messageCache.get(cacheKey);
            if (cachedMessages && cachedMessages.length >= limitCount) {
                console.log('[MessagingService] Returning cached messages');
                return cachedMessages.slice(-limitCount);
            }
            // Use a simpler approach: get messages where current user is sender
            const messagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('senderId', '==', userId1), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('timestamp', 'desc'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .limit */ .AB)(50));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(messagesQuery);
            // Filter messages for this conversation in memory
            const conversationMessages = snapshot.docs.filter(doc => {
                const data = doc.data();
                return (data.senderId === userId1 && data.receiverId === userId2) ||
                    (data.senderId === userId2 && data.receiverId === userId1);
            });
            const messages = conversationMessages.map(doc => {
                const data = doc.data();
                let timestamp;
                if (data.timestamp) {
                    if (data.timestamp instanceof Date) {
                        timestamp = data.timestamp;
                    }
                    else if (typeof data.timestamp === 'object' && 'toDate' in data.timestamp) {
                        // Firestore timestamp
                        timestamp = data.timestamp.toDate();
                    }
                    else if (typeof data.timestamp === 'number') {
                        // Unix timestamp
                        timestamp = new Date(data.timestamp);
                    }
                }
                return {
                    id: doc.id,
                    ...data,
                    timestamp
                };
            });
            // Cache the messages
            this.messageCache.set(cacheKey, messages.reverse());
            console.log('[MessagingService] Retrieved', messages.length, 'messages');
            return messages.reverse(); // Return in chronological order
        }
        catch (error) {
            console.error('Error getting direct messages:', error);
            // Return empty array on error to prevent crashes
            return [];
        }
    }
    // ===== REAL-TIME LISTENERS =====
    static subscribeToConversation(userId1, userId2, callback) {
        console.log('[MessagingService] Subscribing to conversation between', userId1, 'and', userId2);
        const cacheKey = `${userId1}_${userId2}`;
        // Return cached messages immediately if available
        const cachedMessages = this.messageCache.get(cacheKey);
        if (cachedMessages) {
            callback(cachedMessages);
        }
        let allMessages = [];
        // Set up real-time listener for messages where current user is sender
        const sentMessagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('senderId', '==', userId1), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('timestamp', 'asc'));
        const sentUnsubscribe = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(sentMessagesQuery, (snapshot) => {
            const sentMessages = snapshot.docs
                .map(doc => {
                const data = doc.data();
                let timestamp;
                if (data.timestamp) {
                    if (data.timestamp instanceof Date) {
                        timestamp = data.timestamp;
                    }
                    else if (typeof data.timestamp === 'object' && 'toDate' in data.timestamp) {
                        timestamp = data.timestamp.toDate();
                    }
                    else if (typeof data.timestamp === 'number') {
                        timestamp = new Date(data.timestamp);
                    }
                }
                return {
                    id: doc.id,
                    ...data,
                    timestamp
                };
            })
                .filter(msg => msg.receiverId === userId2)
                .filter(msg => {
                // Filter out messages deleted for the current user
                if (msg.senderId === userId1 && msg.deletedForSender)
                    return false;
                if (msg.receiverId === userId1 && msg.deletedForReceiver)
                    return false;
                return true;
            });
            // Combine with received messages and sort
            const combinedMessages = [...sentMessages, ...allMessages.filter(msg => msg.senderId === userId2)]
                .sort((a, b) => {
                if (!a.timestamp && !b.timestamp)
                    return 0;
                if (!a.timestamp)
                    return 1;
                if (!b.timestamp)
                    return -1;
                return a.timestamp.getTime() - b.timestamp.getTime();
            });
            // Cache the messages
            this.messageCache.set(cacheKey, combinedMessages);
            callback(combinedMessages);
        }, (error) => {
            console.error('Error in sent messages listener:', error);
        });
        // Set up real-time listener for messages where current user is receiver
        const receivedMessagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('receiverId', '==', userId1), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('timestamp', 'asc'));
        const receivedUnsubscribe = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(receivedMessagesQuery, (snapshot) => {
            const receivedMessages = snapshot.docs
                .map(doc => {
                const data = doc.data();
                let timestamp;
                if (data.timestamp) {
                    if (data.timestamp instanceof Date) {
                        timestamp = data.timestamp;
                    }
                    else if (typeof data.timestamp === 'object' && 'toDate' in data.timestamp) {
                        timestamp = data.timestamp.toDate();
                    }
                    else if (typeof data.timestamp === 'number') {
                        timestamp = new Date(data.timestamp);
                    }
                }
                return {
                    id: doc.id,
                    ...data,
                    timestamp
                };
            })
                .filter(msg => msg.senderId === userId2)
                .filter(msg => {
                // Filter out messages deleted for the current user
                if (msg.senderId === userId1 && msg.deletedForSender)
                    return false;
                if (msg.receiverId === userId1 && msg.deletedForReceiver)
                    return false;
                return true;
            });
            allMessages = receivedMessages;
            // Get sent messages from cache to combine
            const sentMessages = this.messageCache.get(cacheKey)?.filter(msg => msg.senderId === userId1) || [];
            // Combine and sort
            const combinedMessages = [...sentMessages, ...receivedMessages]
                .sort((a, b) => {
                if (!a.timestamp && !b.timestamp)
                    return 0;
                if (!a.timestamp)
                    return 1;
                if (!b.timestamp)
                    return -1;
                return a.timestamp.getTime() - b.timestamp.getTime();
            });
            // Cache the messages
            this.messageCache.set(cacheKey, combinedMessages);
            callback(combinedMessages);
        }, (error) => {
            console.error('Error in received messages listener:', error);
        });
        // Store the unsubscribe functions
        const listenerKey = `conversation_${cacheKey}`;
        this.listeners.set(listenerKey, () => {
            sentUnsubscribe();
            receivedUnsubscribe();
        });
        return () => {
            sentUnsubscribe();
            receivedUnsubscribe();
            this.listeners.delete(listenerKey);
        };
    }
    static subscribeToConversations(userId, callback) {
        console.log('[MessagingService] Subscribing to conversations for user:', userId);
        const listenerKey = `conversations_${userId}`;
        // Clean up existing listener
        if (this.listeners.has(listenerKey)) {
            this.listeners.get(listenerKey)();
        }
        let allConversations = [];
        // Set up real-time listener for sent messages
        const sentMessagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('senderId', '==', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('timestamp', 'desc'));
        const sentUnsubscribe = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(sentMessagesQuery, async (snapshot) => {
            try {
                const sentConversations = await Promise.all(snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const receiverId = data.receiverId;
                    // Get user profile
                    const userProfile = await this.getUserProfile(receiverId);
                    return {
                        userId: receiverId,
                        userName: userProfile.displayName,
                        userAvatar: userProfile.avatarUrl,
                        userRole: userProfile.role,
                        userCompany: userProfile.company,
                        userLocation: userProfile.location,
                        lastMessage: data.content,
                        lastMessageTime: data.timestamp?.toDate?.() || new Date(),
                        unreadCount: 0, // TODO: Calculate unread count
                        isOnline: false,
                        lastSeen: undefined
                    };
                }));
                // Combine with received conversations and sort
                const combinedConversations = [...sentConversations, ...allConversations]
                    .filter((conv, index, arr) => arr.findIndex(c => c.userId === conv.userId) === index)
                    .sort((a, b) => {
                    if (!a.lastMessageTime && !b.lastMessageTime)
                        return 0;
                    if (!a.lastMessageTime)
                        return 1;
                    if (!b.lastMessageTime)
                        return -1;
                    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
                });
                callback(combinedConversations);
            }
            catch (error) {
                console.error('Error processing sent conversations:', error);
            }
        }, (error) => {
            console.error('Error in sent conversations listener:', error);
        });
        // Set up real-time listener for received messages
        const receivedMessagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('receiverId', '==', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('timestamp', 'desc'));
        const receivedUnsubscribe = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(receivedMessagesQuery, async (snapshot) => {
            try {
                const receivedConversations = await Promise.all(snapshot.docs.map(async (doc) => {
                    const data = doc.data();
                    const senderId = data.senderId;
                    // Get user profile
                    const userProfile = await this.getUserProfile(senderId);
                    return {
                        userId: senderId,
                        userName: userProfile.displayName,
                        userAvatar: userProfile.avatarUrl,
                        userRole: userProfile.role,
                        userCompany: userProfile.company,
                        userLocation: userProfile.location,
                        lastMessage: data.content,
                        lastMessageTime: data.timestamp?.toDate?.() || new Date(),
                        unreadCount: 0, // TODO: Calculate unread count
                        isOnline: false,
                        lastSeen: undefined
                    };
                }));
                allConversations = receivedConversations;
                // Get sent conversations from cache to combine
                const sentConversations = this.conversationCache.get(userId) || [];
                // Combine and sort
                const combinedConversations = [...sentConversations, ...receivedConversations]
                    .filter((conv, index, arr) => arr.findIndex(c => c.userId === conv.userId) === index)
                    .sort((a, b) => {
                    if (!a.lastMessageTime && !b.lastMessageTime)
                        return 0;
                    if (!a.lastMessageTime)
                        return 1;
                    if (!b.lastMessageTime)
                        return -1;
                    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
                });
                callback(combinedConversations);
            }
            catch (error) {
                console.error('Error processing received conversations:', error);
            }
        }, (error) => {
            console.error('Error in received conversations listener:', error);
        });
        // Store the unsubscribe functions
        this.listeners.set(listenerKey, () => {
            sentUnsubscribe();
            receivedUnsubscribe();
        });
        return () => {
            sentUnsubscribe();
            receivedUnsubscribe();
            this.listeners.delete(listenerKey);
        };
    }
    static subscribeToConversationsWithQueries(userId, callback) {
        // Offline fallback: return empty conversations immediately
        console.log('[MessagingService] Using offline fallback for subscribeToConversationsWithQueries');
        const listenerKey = `conversations_${userId}`;
        // Clean up existing listener
        if (this.listeners.has(listenerKey)) {
            this.listeners.get(listenerKey)();
        }
        // Return empty conversations immediately
        callback([]);
        const unsubscribe = () => {
            this.listeners.delete(listenerKey);
        };
        this.listeners.set(listenerKey, unsubscribe);
        return unsubscribe;
    }
    // ===== MESSAGE STATUS & REACTIONS =====
    static async markMessageAsRead(messageId) {
        // Offline fallback: do nothing to prevent permission errors
        console.log('[MessagingService] Using offline fallback for markMessageAsRead', { messageId });
    }
    static async markConversationAsRead(userId1, userId2) {
        // Offline fallback: do nothing to prevent permission errors
        console.log('[MessagingService] Using offline fallback for markConversationAsRead', { userId1, userId2 });
    }
    static async addMessageReaction(messageId, userId, userName, emoji) {
        // Offline fallback: do nothing to prevent permission errors
        console.log('[MessagingService] Using offline fallback for addMessageReaction', { messageId, userId, userName, emoji });
    }
    // ===== TYPING INDICATORS =====
    static async setTypingStatus(userId, receiverId, isTyping) {
        // Offline fallback: do nothing to prevent permission errors
        console.log('[MessagingService] Using offline fallback for setTypingStatus', { userId, receiverId, isTyping });
    }
    static subscribeToTypingIndicators(receiverId, callback) {
        // Offline fallback: return empty array immediately
        console.log('[MessagingService] Using offline fallback for subscribeToTypingIndicators');
        callback([]);
        // Return a no-op unsubscribe function
        return () => {
            console.log('[MessagingService] Unsubscribed from typing indicators (offline mode)');
        };
    }
    // ===== CHAT SETTINGS =====
    static async getChatSettings(userId) {
        // Offline fallback: return default settings to prevent permission errors
        console.log('[MessagingService] Using offline fallback for getChatSettings');
        return {
            userId,
            allowMessagesFrom: 'everyone',
            showOnlineStatus: true,
            showLastSeen: true,
            isAway: false
        };
    }
    static async updateChatSettings(userId, settings) {
        // Offline fallback: do nothing to prevent permission errors
        console.log('[MessagingService] Using offline fallback for updateChatSettings');
    }
    // ===== UTILITY METHODS =====
    static async getUnreadCount(userId, otherUserId) {
        // Offline fallback: return 0 to prevent permission errors
        console.log('[MessagingService] Using offline fallback for getUnreadCount');
        return 0;
    }
    static async getConversationParticipants(userId) {
        // Offline fallback: return empty array to prevent permission errors
        console.log('[MessagingService] Using offline fallback for getConversationParticipants');
        return [];
    }
    static async getUserProfile(userId) {
        try {
            // Try to get from users collection first
            const userDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    displayName: userData.displayName || userData.firstName || userData.lastName || `User ${userId.slice(-4)}`,
                    avatarUrl: userData.avatarUrl || userData.photoURL,
                    role: userData.role,
                    company: userData.company,
                    location: userData.location
                };
            }
            // Try crewProfiles collection as fallback
            const crewDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'crewProfiles', userId));
            if (crewDoc.exists()) {
                const crewData = crewDoc.data();
                return {
                    displayName: crewData.name || crewData.firstName || crewData.lastName || `Crew Member ${userId.slice(-4)}`,
                    avatarUrl: crewData.profileImageUrl || crewData.avatarUrl,
                    role: crewData.role,
                    company: crewData.company,
                    location: crewData.residences?.[0]?.city || crewData.location
                };
            }
            // If no user data found, return a fallback
            return {
                displayName: `User ${userId.slice(-4)}`,
                avatarUrl: undefined,
                role: 'Crew Member',
                company: undefined,
                location: undefined
            };
        }
        catch (error) {
            console.error('Error getting user profile:', error);
            return {
                displayName: `User ${userId.slice(-4)}`,
                avatarUrl: undefined,
                role: 'Crew Member',
                company: undefined,
                location: undefined
            };
        }
    }
    static updateConversationCache(userId1, userId2, lastMessage, timestamp) {
        const cacheKey = `${userId1}_${userId2}`;
        const conversations = this.conversationCache.get(userId1) || [];
        const existingIndex = conversations.findIndex(c => c.userId === userId2);
        if (existingIndex >= 0) {
            conversations[existingIndex].lastMessage = lastMessage;
            conversations[existingIndex].lastMessageTime = timestamp;
        }
        this.conversationCache.set(userId1, conversations);
    }
    // ===== CLEANUP =====
    static cleanup() {
        // Clean up all listeners
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners.clear();
        // Clear caches
        this.messageCache.clear();
        this.conversationCache.clear();
        this.typingUsers.clear();
    }
    static async uploadFileToStorage(file, pathPrefix = 'chat-uploads') {
        try {
            console.log('[MessagingService] Uploading file to storage:', file.name, 'Size:', file.size, 'bytes');
            // Check file size - limit to 5MB for Firebase Storage (more generous than Firestore)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error(`File size (${file.size} bytes) exceeds maximum allowed size (${maxSize} bytes)`);
            }
            const fileRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .ref */ .KR)(_firebase__WEBPACK_IMPORTED_MODULE_1__/* .storage */ .IG, `${pathPrefix}/${Date.now()}-${file.name}`);
            await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .uploadBytes */ .D)(fileRef, file);
            const downloadURL = await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .getDownloadURL */ .qk)(fileRef);
            console.log('[MessagingService] File uploaded successfully:', downloadURL);
            return downloadURL;
        }
        catch (error) {
            console.error('[MessagingService] Error uploading file:', error);
            console.error('[MessagingService] Error details:', {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : 'No stack trace'
            });
            // Check if it's a size-related error
            const isSizeError = error instanceof Error && error.message.includes('exceeds maximum allowed size');
            const isPermissionError = error instanceof Error && (error.message.includes('unauthorized') ||
                error.message.includes('permission') ||
                error.message.includes('403'));
            if (isSizeError) {
                // If it's a size error, use placeholder
                console.warn('[MessagingService] File size error, using placeholder');
                return `FILE_TOO_LARGE:${file.name}`;
            }
            if (isPermissionError) {
                // If it's a permission error, use data URL fallback for small files
                console.warn('[MessagingService] Storage permission error, trying data URL fallback');
                const maxDataUrlSize = 300 * 1024; // 300KB for permission errors
                if (file.size <= maxDataUrlSize) {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const dataUrl = reader.result;
                            if (dataUrl.length > 500 * 1024) {
                                console.warn('[MessagingService] Data URL too long, using placeholder');
                                resolve(`UPLOAD_FAILED:${file.name}`);
                            }
                            else {
                                console.log('[MessagingService] Using data URL fallback for permission error');
                                resolve(dataUrl);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }
                else {
                    return `UPLOAD_FAILED:${file.name}`;
                }
            }
            // For other errors (network, permissions, etc.), try data URL fallback for small files
            const maxDataUrlSize = 200 * 1024; // 200KB - increased for better fallback
            if (file.size <= maxDataUrlSize) {
                console.log('[MessagingService] Upload failed, trying data URL fallback for small file');
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const dataUrl = reader.result;
                        // Check if data URL is too long for Firestore (limit to 500KB to be safe)
                        if (dataUrl.length > 500 * 1024) {
                            console.warn('[MessagingService] Data URL too long, using placeholder');
                            resolve(`FILE_TOO_LARGE:${file.name}`);
                        }
                        else {
                            console.log('[MessagingService] Using data URL fallback successfully');
                            resolve(dataUrl);
                        }
                    };
                    reader.readAsDataURL(file);
                });
            }
            else {
                // For larger files that fail to upload due to non-size issues, return a placeholder
                console.warn('[MessagingService] Upload failed for large file, using placeholder');
                return `UPLOAD_FAILED:${file.name}`;
            }
        }
    }
    // Optional storage connectivity test (non-blocking)
    static async testStorageConnection() {
        try {
            console.log('[MessagingService] Testing Firebase Storage connection...');
            // Create a simple test file
            const testContent = 'Hello Firebase Storage!';
            const testBlob = new Blob([testContent], { type: 'text/plain' });
            const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
            // Use a path that's allowed by storage rules
            const fileRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .ref */ .KR)(_firebase__WEBPACK_IMPORTED_MODULE_1__/* .storage */ .IG, 'chat-uploads/test-connection.txt');
            await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .uploadBytes */ .D)(fileRef, testFile);
            const downloadURL = await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .getDownloadURL */ .qk)(fileRef);
            console.log('[MessagingService] Storage test successful:', downloadURL);
            return true;
        }
        catch (error) {
            console.warn('[MessagingService] Storage test failed (this is normal if not authenticated):', error);
            return false;
        }
    }
    static async deleteMessage(messageId, fileUrl, messageType, deletedByUserId) {
        try {
            console.log('[MessagingService] Deleting message:', { messageId, fileUrl, messageType, deletedByUserId });
            // Get the message to check if it's a sender or receiver deletion
            const messageDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages', messageId));
            if (!messageDoc.exists()) {
                console.warn('[MessagingService] Message not found, may have been already deleted');
                return;
            }
            const messageData = messageDoc.data();
            const isSenderDeletion = deletedByUserId === messageData.senderId;
            if (isSenderDeletion) {
                // Sender deletion: Delete for everyone
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .deleteDoc */ .kd)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages', messageId));
                console.log('[MessagingService] Message deleted from Firestore for everyone');
                // If there's a file URL and it's not a placeholder, delete from Firebase Storage
                if (fileUrl &&
                    !fileUrl.startsWith('data:') &&
                    !fileUrl.startsWith('FILE_TOO_LARGE:') &&
                    fileUrl.includes('firebase')) {
                    try {
                        const fileRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .ref */ .KR)(_firebase__WEBPACK_IMPORTED_MODULE_1__/* .storage */ .IG, fileUrl);
                        await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .deleteObject */ .XR)(fileRef);
                        console.log('[MessagingService] File deleted from Firebase Storage');
                    }
                    catch (storageError) {
                        console.warn('[MessagingService] Could not delete file from storage:', storageError);
                        // Don't throw error if file deletion fails, message deletion is more important
                    }
                }
            }
            else {
                // Receiver deletion: Mark as deleted for receiver but keep for sender
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'directMessages', messageId), {
                    deletedForReceiver: true,
                    deletedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
                });
                console.log('[MessagingService] Message marked as deleted for receiver');
            }
            console.log('[MessagingService] Message deletion completed successfully');
        }
        catch (error) {
            console.error('[MessagingService] Error deleting message:', error);
            throw error;
        }
    }
}
MessagingService.listeners = new Map();
MessagingService.messageCache = new Map();
MessagingService.conversationCache = new Map();
MessagingService.typingUsers = new Map();


/***/ })

}]);
//# sourceMappingURL=758.chunk.js.map