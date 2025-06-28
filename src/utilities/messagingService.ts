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
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { DirectMessage, ChatRoom, ChatSettings, MessageReaction, ChatPresence } from '../types/Chat';
import { SocialService } from './socialService';

export interface ConversationSummary {
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline?: boolean;
  lastSeen?: Date;
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

  // ===== DIRECT MESSAGE OPERATIONS =====
  
  static async sendDirectMessage(
    senderId: string, 
    receiverId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'file' | 'project_invite' = 'text', 
    relatedProjectId?: string
  ): Promise<string> {
    try {
      console.log('[MessagingService] Sending direct message from', senderId, 'to', receiverId);
      
      // Check permissions
      const canMessage = await this.canSendMessage(senderId, receiverId);
      if (!canMessage) {
        throw new Error('Cannot send message to this user. They may not allow messages from non-followers.');
      }

      // Create message data
      const messageData = {
        senderId,
        receiverId,
        content,
        messageType,
        relatedProjectId,
        timestamp: serverTimestamp(),
        isRead: false,
        reactions: [],
        status: 'sent'
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'directMessages'), messageData);
      console.log('[MessagingService] Message sent successfully with ID:', docRef.id);

      // Update conversation cache
      this.updateConversationCache(senderId, receiverId, content, new Date());

      // Create notification for receiver
      await SocialService.createNotification({
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
    } catch (error) {
      console.error('Error sending direct message:', error);
      throw error;
    }
  }

  static async canSendMessage(senderId: string, receiverId: string): Promise<boolean> {
    try {
      // Get receiver's chat settings
      const settingsQuery = query(
        collection(db, 'chatSettings'),
        where('userId', '==', receiverId)
      );
      const settingsSnapshot = await getDocs(settingsQuery);
      
      if (settingsSnapshot.empty) {
        // Default settings: allow messages from everyone
        return true;
      }

      const settings = settingsSnapshot.docs[0].data() as ChatSettings;
      
      switch (settings.allowMessagesFrom) {
        case 'everyone':
          return true;
        case 'followers':
          // Check if sender follows receiver
          const followStatus = await SocialService.getFollowStatus(senderId, receiverId);
          return followStatus === 'following';
        case 'none':
          return false;
        default:
          return true;
      }
    } catch (error) {
      console.error('Error checking message permissions:', error);
      return false;
    }
  }

  static async getDirectMessages(userId1: string, userId2: string, limitCount: number = 50): Promise<DirectMessage[]> {
    try {
      console.log('[MessagingService] Getting direct messages between', userId1, 'and', userId2);
      
      const cacheKey = `${userId1}_${userId2}`;
      const cachedMessages = this.messageCache.get(cacheKey);
      
      if (cachedMessages && cachedMessages.length >= limitCount) {
        console.log('[MessagingService] Returning cached messages');
        return cachedMessages.slice(-limitCount);
      }
      
      const messagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', 'in', [userId1, userId2]),
        where('receiverId', 'in', [userId1, userId2]),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(messagesQuery);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as DirectMessage[];
      
      // Cache the messages
      this.messageCache.set(cacheKey, messages.reverse());
      
      console.log('[MessagingService] Retrieved', messages.length, 'messages');
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting direct messages:', error);
      return [];
    }
  }

  // ===== REAL-TIME LISTENERS =====

  static subscribeToConversation(
    userId1: string, 
    userId2: string, 
    callback: (messages: DirectMessage[]) => void
  ): () => void {
    try {
      console.log('[MessagingService] Setting up conversation listener between', userId1, 'and', userId2);
      
      const listenerKey = `conversation_${userId1}_${userId2}`;
      
      // Clean up existing listener
      if (this.listeners.has(listenerKey)) {
        this.listeners.get(listenerKey)!();
      }
      
      const messagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', 'in', [userId1, userId2]),
        where('receiverId', 'in', [userId1, userId2]),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        try {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          })) as DirectMessage[];
          
          console.log('[MessagingService] Conversation updated:', messages.length, 'messages');
          
          // Update cache
          const cacheKey = `${userId1}_${userId2}`;
          this.messageCache.set(cacheKey, messages);
          
          callback(messages);
        } catch (error) {
          console.error('[MessagingService] Error processing conversation snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[MessagingService] Conversation listener error:', error);
        callback([]);
      });

      this.listeners.set(listenerKey, unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('[MessagingService] Error setting up conversation listener:', error);
      return () => {};
    }
  }

  static subscribeToConversations(
    userId: string, 
    callback: (conversations: ConversationSummary[]) => void
  ): () => void {
    try {
      console.log('[MessagingService] Setting up conversations listener for user:', userId);
      
      const listenerKey = `conversations_${userId}`;
      
      // Clean up existing listener
      if (this.listeners.has(listenerKey)) {
        this.listeners.get(listenerKey)!();
      }

      // Get all messages where user is sender or receiver
      const messagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
        try {
          // Get unique conversation participants
          const participants = new Set<string>();
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            participants.add(data.receiverId);
          });

          // Get conversations where user is receiver
          const receivedMessagesQuery = query(
            collection(db, 'directMessages'),
            where('receiverId', '==', userId),
            orderBy('timestamp', 'desc')
          );

          const receivedSnapshot = await getDocs(receivedMessagesQuery);
          receivedSnapshot.docs.forEach(doc => {
            const data = doc.data();
            participants.add(data.senderId);
          });

          // Build conversation summaries
          const conversations = await Promise.all(
            Array.from(participants).map(async (participantId) => {
              const messages = await this.getDirectMessages(userId, participantId, 1);
              const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
              const unreadCount = await this.getUnreadCount(userId, participantId);
              
              // Get user profile
              const userProfile = await this.getUserProfile(participantId);
              
              return {
                userId: participantId,
                userName: userProfile?.displayName || `User ${participantId.slice(-4)}`,
                userAvatar: userProfile?.avatarUrl,
                lastMessage: lastMessage?.content,
                lastMessageTime: lastMessage?.timestamp,
                unreadCount,
                isOnline: false, // TODO: Implement presence
                lastSeen: undefined
              } as ConversationSummary;
            })
          );

          // Sort by last message time
          conversations.sort((a, b) => {
            if (!a.lastMessageTime && !b.lastMessageTime) return 0;
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
          });

          // Update cache
          this.conversationCache.set(userId, conversations);
          
          console.log('[MessagingService] Conversations updated:', conversations.length);
          callback(conversations);
        } catch (error) {
          console.error('[MessagingService] Error processing conversations snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[MessagingService] Conversations listener error:', error);
        callback([]);
      });

      this.listeners.set(listenerKey, unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('[MessagingService] Error setting up conversations listener:', error);
      return () => {};
    }
  }

  // ===== MESSAGE STATUS & REACTIONS =====

  static async markMessageAsRead(messageId: string): Promise<void> {
    try {
      console.log('[MessagingService] Marking message as read:', messageId);
      const messageRef = doc(db, 'directMessages', messageId);
      await updateDoc(messageRef, { isRead: true });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  static async markConversationAsRead(userId1: string, userId2: string): Promise<void> {
    try {
      console.log('[MessagingService] Marking conversation as read between', userId1, 'and', userId2);
      
      const unreadMessagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', '==', userId2),
        where('receiverId', '==', userId1),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(unreadMessagesQuery);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
      });
      
      await batch.commit();
      console.log('[MessagingService] Marked', snapshot.docs.length, 'messages as read');
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }

  static async addMessageReaction(messageId: string, userId: string, userName: string, emoji: string): Promise<void> {
    try {
      console.log('[MessagingService] Adding reaction to message:', messageId, 'emoji:', emoji);
      
      const messageRef = doc(db, 'directMessages', messageId);
      const messageDoc = await getDoc(messageRef);
      
      if (!messageDoc.exists()) {
        throw new Error('Message not found');
      }
      
      const messageData = messageDoc.data();
      const reactions = messageData.reactions || [];
      
      // Check if user already reacted with this emoji
      const existingReactionIndex = reactions.findIndex((r: MessageReaction) => 
        r.userId === userId && r.emoji === emoji
      );
      
      if (existingReactionIndex >= 0) {
        // Remove existing reaction
        reactions.splice(existingReactionIndex, 1);
      } else {
        // Add new reaction
        reactions.push({
          userId,
          userName,
          emoji,
          timestamp: new Date()
        });
      }
      
      await updateDoc(messageRef, { reactions });
      console.log('[MessagingService] Reaction updated successfully');
    } catch (error) {
      console.error('Error adding message reaction:', error);
      throw error;
    }
  }

  // ===== TYPING INDICATORS =====

  static async setTypingStatus(userId: string, receiverId: string, isTyping: boolean): Promise<void> {
    try {
      const typingRef = doc(db, 'typingIndicators', `${userId}_${receiverId}`);
      
      if (isTyping) {
        await updateDoc(typingRef, {
          userId,
          receiverId,
          isTyping: true,
          timestamp: serverTimestamp()
        });
      } else {
        await deleteDoc(typingRef);
      }
    } catch (error) {
      console.error('Error setting typing status:', error);
    }
  }

  static subscribeToTypingIndicators(receiverId: string, callback: (typingUsers: string[]) => void) {
    const typingQuery = query(
      collection(db, 'typingIndicators'),
      where('receiverId', '==', receiverId)
    );

    return onSnapshot(typingQuery, (snapshot) => {
      const typingUsers = snapshot.docs
        .map(doc => doc.data().userId)
        .filter((userId, index, arr) => arr.indexOf(userId) === index); // Remove duplicates
      callback(typingUsers);
    });
  }

  // ===== CHAT SETTINGS =====

  static async getChatSettings(userId: string): Promise<ChatSettings | null> {
    try {
      const settingsQuery = query(
        collection(db, 'chatSettings'),
        where('userId', '==', userId)
      );
      const settingsSnapshot = await getDocs(settingsQuery);
      
      if (settingsSnapshot.empty) {
        // Return default settings
        return {
          userId,
          allowMessagesFrom: 'everyone',
          showOnlineStatus: true,
          showLastSeen: true,
          isAway: false
        };
      }

      return settingsSnapshot.docs[0].data() as ChatSettings;
    } catch (error) {
      console.error('Error getting chat settings:', error);
      return null;
    }
  }

  static async updateChatSettings(userId: string, settings: Partial<ChatSettings>): Promise<void> {
    try {
      const settingsQuery = query(
        collection(db, 'chatSettings'),
        where('userId', '==', userId)
      );
      const settingsSnapshot = await getDocs(settingsQuery);
      
      if (settingsSnapshot.empty) {
        // Create new settings
        await addDoc(collection(db, 'chatSettings'), {
          userId,
          ...settings
        });
      } else {
        // Update existing settings
        const settingsRef = doc(db, 'chatSettings', settingsSnapshot.docs[0].id);
        await updateDoc(settingsRef, settings);
      }
    } catch (error) {
      console.error('Error updating chat settings:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  static async getUnreadCount(userId: string, otherUserId: string): Promise<number> {
    try {
      const messages = await this.getDirectMessages(userId, otherUserId);
      return messages.filter(msg => !msg.isRead && msg.senderId === otherUserId).length;
    } catch (error) {
      return 0;
    }
  }

  static async getConversationParticipants(userId: string): Promise<string[]> {
    try {
      // Get all messages where user is sender or receiver
      const sentMessagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', '==', userId)
      );
      
      const receivedMessagesQuery = query(
        collection(db, 'directMessages'),
        where('receiverId', '==', userId)
      );

      const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentMessagesQuery),
        getDocs(receivedMessagesQuery)
      ]);

      const participants = new Set<string>();
      
      sentSnapshot.docs.forEach(doc => {
        participants.add(doc.data().receiverId);
      });
      
      receivedSnapshot.docs.forEach(doc => {
        participants.add(doc.data().senderId);
      });

      return Array.from(participants);
    } catch (error) {
      console.error('Error getting conversation participants:', error);
      return [];
    }
  }

  private static async getUserProfile(userId: string) {
    try {
      // Try to get from users collection first
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          displayName: userData.displayName || userData.firstName || `User ${userId.slice(-4)}`,
          avatarUrl: userData.avatarUrl
        };
      }

      // Try crewProfiles collection as fallback
      const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
      if (crewDoc.exists()) {
        const crewData = crewDoc.data();
        return {
          displayName: crewData.name || crewData.firstName || `Crew Member ${userId.slice(-4)}`,
          avatarUrl: crewData.avatarUrl
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
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
} 