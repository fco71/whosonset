import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  writeBatch,
  getDoc,
  deleteDoc,
  limit,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  setDoc,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { DirectMessage, ChatRoom, ChatSettings, MessageReaction, ChatPresence } from '../types/Chat';
import { SocialService } from './socialService';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, ref as storageRef, deleteObject } from 'firebase/storage';

const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args);
  }
};

export interface ConversationSummary {
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  userCompany?: string;
  userLocation?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline?: boolean;
  lastSeen?: Date;
  conversationId?: string;
}

export interface MessageStatus {
  messageId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
}

export class MessagingService {
  private static listeners = new Map<string, () => void>();
  private static messageCache = new Map<string, DirectMessage[]>();
  private static conversationCache = new Map<string, ConversationSummary[]>();
  private static typingUsers = new Map<string, Set<string>>();

  // ===== CONVERSATION MANAGEMENT =====
  
  // Get or create conversation ID between two users
  static async getConversationId(userId1: string, userId2: string): Promise<string> {
    const participants = [userId1, userId2].sort(); // Sort for consistent ordering
    
    // Check if conversation already exists
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', '==', participants)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    
    // Create new conversation
    const conversationData = {
      participants,
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
      lastMessage: '',
      unreadCount: 0
    };
    
    const docRef = await addDoc(conversationsRef, conversationData);
    return docRef.id;
  }

  // ===== DIRECT MESSAGE OPERATIONS =====
  
  static async sendDirectMessage(
    senderId: string, 
    receiverId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'file' | 'voice' | 'project_invite' = 'text', 
    relatedProjectId?: string,
    fileUrl?: string
  ): Promise<string> {
    try {
      debugLog('[MessagingService] Sending direct message from', senderId, 'to', receiverId);
      
      // Check permissions
      const canMessage = await this.canSendMessage(senderId, receiverId);
      if (!canMessage) {
        throw new Error('Cannot send message to this user. They may not allow messages from non-followers.');
      }

      // Get or create conversation
      const conversationId = await this.getConversationId(senderId, receiverId);

      // Create message data, filtering out undefined values
      const messageData: any = {
        senderId,
        content,
        messageType,
        timestamp: serverTimestamp(),
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
        } else {
          messageData.fileUrl = fileUrl;
        }
      }

      // Add message to conversation
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const docRef = await addDoc(messagesRef, messageData);
      
      // Update conversation metadata
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        lastMessage: content,
        lastMessageAt: serverTimestamp(),
        unreadCount: increment(1)
      });

      // In-app notification AND the (throttled, ~1 per conversation / 30 min) email
      // are both handled server-side by the notifyNewMessage Cloud Function (Phase 2).
      // The client intentionally sends nothing here — this is what keeps message email
      // sporadic instead of one-per-message.

      debugLog('[MessagingService] Message sent successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('[MessagingService] Error sending message:', error);
      throw error;
    }
  }

  static async canSendMessage(senderId: string, receiverId: string): Promise<boolean> {
    // For now, allow all authenticated users to message each other
    // This can be enhanced with privacy settings later
    return true;
  }

  static async getDirectMessages(userId1: string, userId2: string, limitCount: number = 50): Promise<DirectMessage[]> {
    try {
      const conversationId = await this.getConversationId(userId1, userId2);
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(
        messagesRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const messages: DirectMessage[] = [];
      
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
    } catch (error) {
      console.error('[MessagingService] Error getting messages:', error);
      return [];
    }
  }

  static subscribeToConversation(
    userId1: string, 
    userId2: string, 
    callback: (messages: DirectMessage[]) => void
  ): () => void {
    const cacheKey = `${userId1}-${userId2}`;
    
    // Clean up existing listener
    if (this.listeners.has(cacheKey)) {
      this.listeners.get(cacheKey)?.();
    }

    // Set up the listener immediately
    const setupListener = async () => {
      try {
        const conversationId = await this.getConversationId(userId1, userId2);
        const messagesRef = collection(db, 'conversations', conversationId, 'messages');
        const q = query(
          messagesRef,
          orderBy('timestamp', 'asc')
        );
        
        return onSnapshot(q, (snapshot) => {
          const messages: DirectMessage[] = [];
          
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
      } catch (error) {
        console.error('[MessagingService] Error setting up conversation listener:', error);
        return () => {};
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

  static subscribeToConversations(
    userId: string, 
    callback: (conversations: ConversationSummary[]) => void
  ): () => void {
    const cacheKey = `conversations-${userId}`;
    
    // Clean up existing listener
    if (this.listeners.has(cacheKey)) {
      this.listeners.get(cacheKey)?.();
    }

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const conversations: ConversationSummary[] = [];
      const seenUserIds = new Set<string>(); // Track seen user IDs to prevent duplicates
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        const participants = data.participants || [];
        const otherUserId = participants.find((id: string) => id !== userId);
        
        if (otherUserId && !seenUserIds.has(otherUserId)) {
          seenUserIds.add(otherUserId); // Mark this user as seen
          
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
          } catch (error) {
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

  static subscribeToConversationsWithQueries(
    userId: string, 
    callback: (conversations: ConversationSummary[]) => void
  ): () => void {
    // Offline fallback: return empty conversations immediately
    debugLog('[MessagingService] Using offline fallback for subscribeToConversationsWithQueries');
    
    const listenerKey = `conversations_${userId}`;
    
    // Clean up existing listener
    if (this.listeners.has(listenerKey)) {
      this.listeners.get(listenerKey)!();
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

  static async markMessageAsRead(messageId: string): Promise<void> {
    try {
      debugLog('[MessagingService] Marking message as read:', messageId);

      // Find the message in conversations subcollection
      const conversationsQuery = query(collection(db, 'conversations'));
      const conversationsSnapshot = await getDocs(conversationsQuery);
      
      let messageFound = false;
      let conversationId = '';

      // Search through all conversations to find the message
      for (const conversationDoc of conversationsSnapshot.docs) {
        const messagesQuery = query(
          collection(db, 'conversations', conversationDoc.id, 'messages'),
          where('__name__', '==', messageId)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        
        if (!messagesSnapshot.empty) {
          messageFound = true;
          conversationId = conversationDoc.id;
          break;
        }
      }

      if (!messageFound) {
        console.warn('[MessagingService] Message not found for marking as read:', messageId);
        return;
      }

      // Update the message status to 'read'
      const messageRef = doc(db, 'conversations', conversationId, 'messages', messageId);
      await updateDoc(messageRef, { 
        isRead: true, 
        status: 'read',
        readAt: serverTimestamp() 
      });

      debugLog('[MessagingService] Message marked as read successfully:', messageId);
    } catch (error) {
      console.error('[MessagingService] Error marking message as read:', error);
    }
  }

  static async updateMessageStatus(messageId: string, status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'): Promise<void> {
    try {
      debugLog('[MessagingService] Updating message status:', { messageId, status });

      // Find the message in conversations subcollection
      const conversationsQuery = query(collection(db, 'conversations'));
      const conversationsSnapshot = await getDocs(conversationsQuery);
      
      let messageFound = false;
      let conversationId = '';

      // Search through all conversations to find the message
      for (const conversationDoc of conversationsSnapshot.docs) {
        const messagesQuery = query(
          collection(db, 'conversations', conversationDoc.id, 'messages'),
          where('__name__', '==', messageId)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        
        if (!messagesSnapshot.empty) {
          messageFound = true;
          conversationId = conversationDoc.id;
          break;
        }
      }

      if (!messageFound) {
        console.warn('[MessagingService] Message not found for status update:', messageId);
        return;
      }

      // Update the message status
      const messageRef = doc(db, 'conversations', conversationId, 'messages', messageId);
      const updateData: any = { status };
      
      // If marking as read, also update isRead and readAt
      if (status === 'read') {
        updateData.isRead = true;
        updateData.readAt = serverTimestamp();
      }
      
      await updateDoc(messageRef, updateData);

      debugLog('[MessagingService] Message status updated successfully:', { messageId, status });
    } catch (error) {
      console.error('[MessagingService] Error updating message status:', error);
    }
  }

  static async markConversationAsRead(userId1: string, userId2: string): Promise<void> {
    try {
      const conversationId = await this.getConversationId(userId1, userId2);
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(
        messagesRef,
        where('senderId', '==', userId2),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { 
          isRead: true, 
          readAt: serverTimestamp() 
        });
      });
      
      await batch.commit();
      
      // Update conversation metadata
      const conversationRef = doc(db, 'conversations', conversationId);
      await updateDoc(conversationRef, {
        unreadCount: 0
      });
    } catch (error) {
      console.error('[MessagingService] Error marking conversation as read:', error);
    }
  }

  static async addMessageReaction(messageId: string, userId: string, userName: string, emoji: string): Promise<void> {
    try {
      debugLog('[MessagingService] Adding reaction:', { messageId, userId, userName, emoji });

      // Find the message in conversations subcollection
      const conversationsQuery = query(collection(db, 'conversations'));
      const conversationsSnapshot = await getDocs(conversationsQuery);
      
      let messageFound = false;
      let conversationId = '';

      // Search through all conversations to find the message
      for (const conversationDoc of conversationsSnapshot.docs) {
        const messagesQuery = query(
          collection(db, 'conversations', conversationDoc.id, 'messages'),
          where('__name__', '==', messageId)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        
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
      const messageDoc = await getDoc(doc(db, 'conversations', conversationId, 'messages', messageId));
      if (!messageDoc.exists()) {
        throw new Error('Message not found');
      }

      const messageData = messageDoc.data();
      const currentReactions = messageData.reactions || [];

      debugLog('[MessagingService] Current reactions:', currentReactions);

      // Check if user already reacted with this emoji
      const existingReaction = currentReactions.find(
        (reaction: any) => reaction.userId === userId && reaction.emoji === emoji
      );

      if (existingReaction) {
        // Remove existing reaction by filtering it out
        debugLog('[MessagingService] Removing existing reaction:', existingReaction);
        const updatedReactions = currentReactions.filter(
          (reaction: any) => !(reaction.userId === userId && reaction.emoji === emoji)
        );
        
        await updateDoc(doc(db, 'conversations', conversationId, 'messages', messageId), {
          reactions: updatedReactions
        });
      } else {
        // Add new reaction by appending to array
        const newReaction = {
          userId,
          userName,
          emoji,
          timestamp: new Date().toISOString() // Convert to ISO string for better compatibility
        };
        
        debugLog('[MessagingService] Adding reaction object:', newReaction);
        
        const updatedReactions = [...currentReactions, newReaction];
        
        await updateDoc(doc(db, 'conversations', conversationId, 'messages', messageId), {
          reactions: updatedReactions
        });
      }

      debugLog('[MessagingService] Reaction updated successfully');
    } catch (error) {
      console.error('[MessagingService] Error adding reaction:', error);
      throw error;
    }
  }

  // ===== TYPING INDICATORS =====

  static async setTypingStatus(userId: string, receiverId: string, isTyping: boolean): Promise<void> {
    // Offline fallback: do nothing to prevent permission errors
    debugLog('[MessagingService] Using offline fallback for setTypingStatus', { userId, receiverId, isTyping });
  }

  static subscribeToTypingIndicators(receiverId: string, callback: (typingUsers: string[]) => void) {
    // Offline fallback: return empty array immediately
    debugLog('[MessagingService] Using offline fallback for subscribeToTypingIndicators');
    callback([]);
    
    // Return a no-op unsubscribe function
    return () => {
      debugLog('[MessagingService] Unsubscribed from typing indicators (offline mode)');
    };
  }

  // ===== CHAT SETTINGS =====

  static async getChatSettings(userId: string): Promise<ChatSettings | null> {
    // Offline fallback: return default settings to prevent permission errors
    debugLog('[MessagingService] Using offline fallback for getChatSettings');
    return {
      userId,
      allowMessagesFrom: 'everyone',
      showOnlineStatus: true,
      showLastSeen: true,
      isAway: false
    };
  }

  static async updateChatSettings(userId: string, settings: Partial<ChatSettings>): Promise<void> {
    // Offline fallback: do nothing to prevent permission errors
    debugLog('[MessagingService] Using offline fallback for updateChatSettings');
  }

  // ===== UTILITY METHODS =====

  static async getUnreadCount(userId: string, otherUserId: string): Promise<number> {
    try {
      const conversationId = await this.getConversationId(userId, otherUserId);
      const messagesRef = collection(db, 'conversations', conversationId, 'messages');
      const q = query(
        messagesRef,
        where('senderId', '==', otherUserId),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('[MessagingService] Error getting unread count:', error);
      return 0;
    }
  }

  static async getConversationParticipants(userId: string): Promise<string[]> {
    // Offline fallback: return empty array to prevent permission errors
    debugLog('[MessagingService] Using offline fallback for getConversationParticipants');
    return [];
  }

  private static async getUserProfile(userId: string) {
    try {
      const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
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
    } catch (error) {
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

  private static updateConversationCache(userId1: string, userId2: string, lastMessage: string, timestamp: Date) {
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

  static async uploadFileToStorage(file: File, pathPrefix: string = 'chat-uploads', userId?: string): Promise<string> {
    try {
      debugLog('[MessagingService] Uploading file to storage:', file.name, 'Size:', file.size, 'bytes');
      
      // Check file size - limit to 5MB for Firebase Storage (more generous than Firestore)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(`File size (${file.size} bytes) exceeds maximum allowed size (${maxSize} bytes)`);
      }
      
      const ownerId = userId || auth.currentUser?.uid;
      if (!ownerId) {
        throw new Error('You must be signed in to upload files');
      }

      const fileRef = ref(storage, `${pathPrefix}/${ownerId}/${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      debugLog('[MessagingService] File uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('[MessagingService] Error uploading file:', error);
      console.error('[MessagingService] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Check if it's a size-related error
      const isSizeError = error instanceof Error && error.message.includes('exceeds maximum allowed size');
      const isPermissionError = error instanceof Error && (
        error.message.includes('unauthorized') || 
        error.message.includes('permission') ||
        error.message.includes('403')
      );
      
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
              const dataUrl = reader.result as string;
              if (dataUrl.length > 500 * 1024) {
                console.warn('[MessagingService] Data URL too long, using placeholder');
                resolve(`UPLOAD_FAILED:${file.name}`);
              } else {
                debugLog('[MessagingService] Using data URL fallback for permission error');
                resolve(dataUrl);
              }
            };
            reader.readAsDataURL(file);
          });
        } else {
          return `UPLOAD_FAILED:${file.name}`;
        }
      }
      
      // For other errors (network, permissions, etc.), try data URL fallback for small files
      const maxDataUrlSize = 200 * 1024; // 200KB - increased for better fallback
      if (file.size <= maxDataUrlSize) {
        debugLog('[MessagingService] Upload failed, trying data URL fallback for small file');
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result as string;
            // Check if data URL is too long for Firestore (limit to 500KB to be safe)
            if (dataUrl.length > 500 * 1024) {
              console.warn('[MessagingService] Data URL too long, using placeholder');
              resolve(`FILE_TOO_LARGE:${file.name}`);
            } else {
              debugLog('[MessagingService] Using data URL fallback successfully');
              resolve(dataUrl);
            }
          };
          reader.readAsDataURL(file);
        });
      } else {
        // For larger files that fail to upload due to non-size issues, return a placeholder
        console.warn('[MessagingService] Upload failed for large file, using placeholder');
        return `UPLOAD_FAILED:${file.name}`;
      }
    }
  }

  // Optional storage connectivity test (non-blocking)
  static async testStorageConnection(): Promise<boolean> {
    try {
      debugLog('[MessagingService] Testing Firebase Storage connection...');
      
      // Create a simple test file
      const testContent = 'Hello Firebase Storage!';
      const testBlob = new Blob([testContent], { type: 'text/plain' });
      const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
      
      // Use a path that's allowed by storage rules
      const ownerId = auth.currentUser?.uid;
      if (!ownerId) {
        return false;
      }

      const fileRef = ref(storage, `chat-uploads/${ownerId}/test-connection.txt`);
      await uploadBytes(fileRef, testFile);
      const downloadURL = await getDownloadURL(fileRef);
      
      debugLog('[MessagingService] Storage test successful:', downloadURL);
      return true;
    } catch (error) {
      console.warn('[MessagingService] Storage test failed (this is normal if not authenticated):', error);
      return false;
    }
  }

  static async deleteMessage(messageId: string, fileUrl?: string, messageType?: string, deletedByUserId?: string): Promise<void> {
    try {
      debugLog('[MessagingService] Deleting message:', { messageId, fileUrl, messageType, deletedByUserId });

      // Find the message in conversations subcollection
      // We need to search through all conversations to find this message
      const conversationsQuery = query(collection(db, 'conversations'));
      const conversationsSnapshot = await getDocs(conversationsQuery);
      
      let messageFound = false;
      let conversationId = '';
      let messageData: any = null;

      // Search through all conversations to find the message
      for (const conversationDoc of conversationsSnapshot.docs) {
        const messagesQuery = query(
          collection(db, 'conversations', conversationDoc.id, 'messages'),
          where('__name__', '==', messageId)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        
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
        } else if (messageType === 'voice') {
          placeholder = '[Audio deleted]';
          deletedType = 'deleted_audio';
        } else if (messageType === 'text') {
          placeholder = '[Message deleted]';
          deletedType = 'deleted_text';
        }

        await updateDoc(doc(db, 'conversations', conversationId, 'messages', messageId), {
          content: placeholder,
          fileUrl: null,
          messageType: deletedType,
          deletedAt: serverTimestamp()
        });

        // If there's a file URL and it's not a placeholder, delete from Firebase Storage
        if (fileUrl && 
            !fileUrl.startsWith('data:') && 
            !fileUrl.startsWith('FILE_TOO_LARGE:') &&
            !fileUrl.startsWith('UPLOAD_FAILED:') &&
            fileUrl.includes('firebase')) {
          try {
            const fileRef = ref(storage, fileUrl);
            await deleteObject(fileRef);
            debugLog('[MessagingService] File deleted from Firebase Storage');
          } catch (storageError) {
            console.warn('[MessagingService] Could not delete file from storage:', storageError);
            // Don't throw error if file deletion fails, message deletion is more important
          }
        }

        debugLog('[MessagingService] Message marked as deleted for everyone');
      } else {
        // Receiver deletion: Mark as deleted for receiver but keep for sender
        await updateDoc(doc(db, 'conversations', conversationId, 'messages', messageId), {
          deletedForReceiver: true,
          deletedAt: serverTimestamp()
        });
        debugLog('[MessagingService] Message marked as deleted for receiver');
      }

      debugLog('[MessagingService] Message deletion completed successfully');
    } catch (error) {
      console.error('[MessagingService] Error deleting message:', error);
      throw error;
    }
  }
} 
