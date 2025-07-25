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
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2539);




class MessagingService {
    // ===== CONVERSATION MANAGEMENT =====
    // Get or create conversation ID between two users
    static async getConversationId(userId1, userId2) {
        const participants = [userId1, userId2].sort(); // Sort for consistent ordering
        // Check if conversation already exists
        const conversationsRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations');
        const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(conversationsRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('participants', '==', participants));
        const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(q);
        if (!snapshot.empty) {
            return snapshot.docs[0].id;
        }
        // Create new conversation
        const conversationData = {
            participants,
            createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
            lastMessageAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
            lastMessage: '',
            unreadCount: 0
        };
        const docRef = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)(conversationsRef, conversationData);
        return docRef.id;
    }
    // ===== DIRECT MESSAGE OPERATIONS =====
    static async sendDirectMessage(senderId, receiverId, content, messageType = 'text', relatedProjectId, fileUrl) {
        try {
            console.log('[MessagingService] Sending direct message from', senderId, 'to', receiverId);
            // Check permissions
            const canMessage = await this.canSendMessage(senderId, receiverId);
            if (!canMessage) {
                throw new Error('Cannot send message to this user. They may not allow messages from non-followers.');
            }
            // Get or create conversation
            const conversationId = await this.getConversationId(senderId, receiverId);
            // Create message data, filtering out undefined values
            const messageData = {
                senderId,
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
            // Add message to conversation
            const messagesRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages');
            const docRef = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)(messagesRef, messageData);
            // Update conversation metadata
            const conversationRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)(conversationRef, {
                lastMessage: content,
                lastMessageAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
                unreadCount: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .increment */ .GV)(1)
            });
            // Create notification for receiver
            await this.createMessageNotification(receiverId, senderId, docRef.id, content, messageType);
            console.log('[MessagingService] Message sent successfully:', docRef.id);
            return docRef.id;
        }
        catch (error) {
            console.error('[MessagingService] Error sending message:', error);
            throw error;
        }
    }
    static async canSendMessage(senderId, receiverId) {
        // For now, allow all authenticated users to message each other
        // This can be enhanced with privacy settings later
        return true;
    }
    static async getDirectMessages(userId1, userId2, limitCount = 50) {
        try {
            const conversationId = await this.getConversationId(userId1, userId2);
            const messagesRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages');
            const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(messagesRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('timestamp', 'desc'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .limit */ .AB)(limitCount));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(q);
            const messages = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                messages.push({
                    id: doc.id,
                    senderId: data.senderId,
                    receiverId: data.senderId === userId1 ? userId2 : userId1, // Determine receiver based on sender
                    content: data.content,
                    timestamp: data.timestamp?.toDate() || new Date(),
                    isRead: data.isRead || false,
                    messageType: data.messageType || 'text',
                    status: data.status || 'sent',
                    fileUrl: data.fileUrl,
                    fileName: data.fileName,
                    fileSize: data.fileSize,
                    fileType: data.fileType,
                    reactions: data.reactions || []
                });
            });
            // Sort by timestamp ascending for display
            return messages.reverse();
        }
        catch (error) {
            console.error('[MessagingService] Error getting messages:', error);
            return [];
        }
    }
    static subscribeToConversation(userId1, userId2, callback) {
        const cacheKey = `${userId1}-${userId2}`;
        // Clean up existing listener
        if (this.listeners.has(cacheKey)) {
            this.listeners.get(cacheKey)?.();
        }
        // Set up the listener immediately
        const setupListener = async () => {
            try {
                const conversationId = await this.getConversationId(userId1, userId2);
                const messagesRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages');
                const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(messagesRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('timestamp', 'asc'));
                return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(q, (snapshot) => {
                    const messages = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        messages.push({
                            id: doc.id,
                            senderId: data.senderId,
                            receiverId: data.senderId === userId1 ? userId2 : userId1,
                            content: data.content,
                            timestamp: data.timestamp?.toDate() || new Date(),
                            isRead: data.isRead || false,
                            messageType: data.messageType || 'text',
                            status: data.status || 'sent',
                            fileUrl: data.fileUrl,
                            fileName: data.fileName,
                            fileSize: data.fileSize,
                            fileType: data.fileType,
                            reactions: data.reactions || []
                        });
                    });
                    this.messageCache.set(cacheKey, messages);
                    callback(messages);
                });
            }
            catch (error) {
                console.error('[MessagingService] Error setting up conversation listener:', error);
                return () => { };
            }
        };
        // Set up the listener and store the cleanup function
        setupListener().then(cleanup => {
            this.listeners.set(cacheKey, cleanup);
        });
        // Return a cleanup function that will be called immediately
        return () => {
            const cleanup = this.listeners.get(cacheKey);
            if (cleanup) {
                cleanup();
                this.listeners.delete(cacheKey);
            }
        };
    }
    static subscribeToConversations(userId, callback) {
        const cacheKey = `conversations-${userId}`;
        // Clean up existing listener
        if (this.listeners.has(cacheKey)) {
            this.listeners.get(cacheKey)?.();
        }
        const conversationsRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations');
        const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(conversationsRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('participants', 'array-contains', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('lastMessageAt', 'desc'));
        const unsubscribe = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(q, async (snapshot) => {
            const conversations = [];
            for (const doc of snapshot.docs) {
                const data = doc.data();
                const participants = data.participants || [];
                const otherUserId = participants.find((id) => id !== userId);
                if (otherUserId) {
                    try {
                        const userProfile = await this.getUserProfile(otherUserId);
                        const unreadCount = await this.getUnreadCount(userId, otherUserId);
                        conversations.push({
                            userId: otherUserId,
                            userName: userProfile?.displayName || `User ${otherUserId.slice(-6)}`,
                            userAvatar: userProfile?.avatarUrl,
                            userRole: userProfile?.role,
                            userCompany: userProfile?.company,
                            userLocation: userProfile?.location,
                            lastMessage: data.lastMessage || '',
                            lastMessageTime: data.lastMessageAt?.toDate(),
                            unreadCount,
                            conversationId: doc.id
                        });
                    }
                    catch (error) {
                        console.error('[MessagingService] Error getting user profile:', error);
                        // Add conversation with minimal info
                        conversations.push({
                            userId: otherUserId,
                            userName: `User ${otherUserId.slice(-6)}`,
                            lastMessage: data.lastMessage || '',
                            lastMessageTime: data.lastMessageAt?.toDate(),
                            unreadCount: 0,
                            conversationId: doc.id
                        });
                    }
                }
            }
            this.conversationCache.set(cacheKey, conversations);
            callback(conversations);
        });
        this.listeners.set(cacheKey, unsubscribe);
        return unsubscribe;
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
        try {
            const conversationId = await this.getConversationId(userId1, userId2);
            const messagesRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages');
            const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(messagesRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('senderId', '==', userId2), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('isRead', '==', false));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(q);
            const batch = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .writeBatch */ .wP)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db);
            snapshot.docs.forEach((doc) => {
                batch.update(doc.ref, {
                    isRead: true,
                    readAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
                });
            });
            await batch.commit();
            // Update conversation metadata
            const conversationRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)(conversationRef, {
                unreadCount: 0
            });
        }
        catch (error) {
            console.error('[MessagingService] Error marking conversation as read:', error);
        }
    }
    static async addMessageReaction(messageId, userId, userName, emoji) {
        try {
            console.log('[MessagingService] Adding reaction:', { messageId, userId, userName, emoji });
            // Find the message in conversations subcollection
            const conversationsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations'));
            const conversationsSnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(conversationsQuery);
            let messageFound = false;
            let conversationId = '';
            // Search through all conversations to find the message
            for (const conversationDoc of conversationsSnapshot.docs) {
                const messagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationDoc.id, 'messages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('__name__', '==', messageId));
                const messagesSnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(messagesQuery);
                if (!messagesSnapshot.empty) {
                    messageFound = true;
                    conversationId = conversationDoc.id;
                    break;
                }
            }
            if (!messageFound) {
                throw new Error('Message not found');
            }
            // Get current message data
            const messageDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages', messageId));
            if (!messageDoc.exists()) {
                throw new Error('Message not found');
            }
            const messageData = messageDoc.data();
            const currentReactions = messageData.reactions || [];
            console.log('[MessagingService] Current reactions:', currentReactions);
            // Check if user already reacted with this emoji
            const existingReaction = currentReactions.find((reaction) => reaction.userId === userId && reaction.emoji === emoji);
            if (existingReaction) {
                // Remove existing reaction by filtering it out
                console.log('[MessagingService] Removing existing reaction:', existingReaction);
                const updatedReactions = currentReactions.filter((reaction) => !(reaction.userId === userId && reaction.emoji === emoji));
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages', messageId), {
                    reactions: updatedReactions
                });
            }
            else {
                // Add new reaction by appending to array
                const newReaction = {
                    userId,
                    userName,
                    emoji,
                    timestamp: new Date().toISOString() // Convert to ISO string for better compatibility
                };
                console.log('[MessagingService] Adding reaction object:', newReaction);
                const updatedReactions = [...currentReactions, newReaction];
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages', messageId), {
                    reactions: updatedReactions
                });
            }
            console.log('[MessagingService] Reaction updated successfully');
        }
        catch (error) {
            console.error('[MessagingService] Error adding reaction:', error);
            throw error;
        }
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
        try {
            const conversationId = await this.getConversationId(userId, otherUserId);
            const messagesRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages');
            const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(messagesRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('senderId', '==', otherUserId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('isRead', '==', false));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(q);
            return snapshot.size;
        }
        catch (error) {
            console.error('[MessagingService] Error getting unread count:', error);
            return 0;
        }
    }
    static async getConversationParticipants(userId) {
        // Offline fallback: return empty array to prevent permission errors
        console.log('[MessagingService] Using offline fallback for getConversationParticipants');
        return [];
    }
    static async getUserProfile(userId) {
        try {
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
                displayName: `Crew Member ${userId.slice(-4)}`,
                avatarUrl: undefined,
                role: 'Crew Member',
                company: undefined,
                location: undefined
            };
        }
        catch (error) {
            console.error('Error getting crew profile:', error);
            return {
                displayName: `Crew Member ${userId.slice(-4)}`,
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
    // ===== NOTIFICATION MANAGEMENT =====
    static async createMessageNotification(receiverId, senderId, messageId, content, messageType) {
        try {
            console.log('[MessagingService] Creating message notification for:', receiverId);
            // Get sender info
            const senderProfile = await this.getUserProfile(senderId);
            const senderName = senderProfile?.displayName || 'Unknown User';
            // Create notification content based on message type
            let notificationMessage = `New message from ${senderName}`;
            if (messageType === 'image') {
                notificationMessage = `${senderName} sent you a photo`;
            }
            else if (messageType === 'voice') {
                notificationMessage = `${senderName} sent you a voice message`;
            }
            else if (messageType === 'file') {
                notificationMessage = `${senderName} sent you a file`;
            }
            else if (content.length > 50) {
                notificationMessage = `${senderName}: ${content.substring(0, 50)}...`;
            }
            else {
                notificationMessage = `${senderName}: ${content}`;
            }
            // Create notification document
            const notificationData = {
                type: 'message',
                message: notificationMessage,
                timestamp: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)(),
                read: false,
                userId: receiverId,
                senderId: senderId,
                messageId: messageId,
                conversationId: await this.getConversationId(senderId, receiverId),
                extra: {
                    content: content,
                    messageType: messageType
                }
            };
            // Add to user's notifications
            const notificationsRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'users', receiverId, 'notifications');
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)(notificationsRef, notificationData);
            console.log('[MessagingService] Message notification created successfully');
        }
        catch (error) {
            console.error('[MessagingService] Error creating message notification:', error);
            // Don't throw error - notification failure shouldn't break message sending
        }
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
            const fileRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_2__/* .ref */ .KR)(_firebase__WEBPACK_IMPORTED_MODULE_1__/* .storage */ .IG, `${pathPrefix}/${Date.now()}-${file.name}`);
            await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_2__/* .uploadBytes */ .D)(fileRef, file);
            const downloadURL = await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_2__/* .getDownloadURL */ .qk)(fileRef);
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
            const fileRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_2__/* .ref */ .KR)(_firebase__WEBPACK_IMPORTED_MODULE_1__/* .storage */ .IG, 'chat-uploads/test-connection.txt');
            await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_2__/* .uploadBytes */ .D)(fileRef, testFile);
            const downloadURL = await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_2__/* .getDownloadURL */ .qk)(fileRef);
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
            // Find the message in conversations subcollection
            // We need to search through all conversations to find this message
            const conversationsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations'));
            const conversationsSnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(conversationsQuery);
            let messageFound = false;
            let conversationId = '';
            let messageData = null;
            // Search through all conversations to find the message
            for (const conversationDoc of conversationsSnapshot.docs) {
                const messagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationDoc.id, 'messages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('__name__', '==', messageId));
                const messagesSnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(messagesQuery);
                if (!messagesSnapshot.empty) {
                    messageFound = true;
                    conversationId = conversationDoc.id;
                    messageData = messagesSnapshot.docs[0].data();
                    break;
                }
            }
            if (!messageFound) {
                console.warn('[MessagingService] Message not found, may have been already deleted');
                return;
            }
            const isSenderDeletion = deletedByUserId === messageData.senderId;
            if (isSenderDeletion) {
                // Sender deletion: Update message to show as deleted
                let placeholder = '[Attachment deleted]';
                let deletedType = 'deleted_file';
                if (messageType === 'image') {
                    placeholder = '[Image deleted]';
                    deletedType = 'deleted_image';
                }
                else if (messageType === 'voice') {
                    placeholder = '[Audio deleted]';
                    deletedType = 'deleted_audio';
                }
                else if (messageType === 'text') {
                    placeholder = '[Message deleted]';
                    deletedType = 'deleted_text';
                }
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages', messageId), {
                    content: placeholder,
                    fileUrl: null,
                    messageType: deletedType,
                    deletedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
                });
                // If there's a file URL and it's not a placeholder, delete from Firebase Storage
                if (fileUrl &&
                    !fileUrl.startsWith('data:') &&
                    !fileUrl.startsWith('FILE_TOO_LARGE:') &&
                    !fileUrl.startsWith('UPLOAD_FAILED:') &&
                    fileUrl.includes('firebase')) {
                    try {
                        const fileRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_2__/* .ref */ .KR)(_firebase__WEBPACK_IMPORTED_MODULE_1__/* .storage */ .IG, fileUrl);
                        await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_2__/* .deleteObject */ .XR)(fileRef);
                        console.log('[MessagingService] File deleted from Firebase Storage');
                    }
                    catch (storageError) {
                        console.warn('[MessagingService] Could not delete file from storage:', storageError);
                        // Don't throw error if file deletion fails, message deletion is more important
                    }
                }
                console.log('[MessagingService] Message marked as deleted for everyone');
            }
            else {
                // Receiver deletion: Mark as deleted for receiver but keep for sender
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'conversations', conversationId, 'messages', messageId), {
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