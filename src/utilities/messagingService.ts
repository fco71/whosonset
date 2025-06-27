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
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { DirectMessage, ChatRoom, ChatSettings, MessageReaction, ChatPresence } from '../types/Chat';
import { SocialService } from './socialService';

export class MessagingService {
  // Direct Message Operations
  static async sendDirectMessage(senderId: string, receiverId: string, content: string, messageType: 'text' | 'image' | 'file' | 'project_invite' = 'text', relatedProjectId?: string): Promise<string> {
    try {
      console.log('[MessagingService] Sending direct message from', senderId, 'to', receiverId);
      
      // Check if sender can message receiver (based on follow status)
      const canMessage = await this.canSendMessage(senderId, receiverId);
      if (!canMessage) {
        throw new Error('Cannot send message to this user. They may not allow messages from non-followers.');
      }

      const messageData = {
        senderId,
        receiverId,
        content,
        messageType,
        relatedProjectId,
        timestamp: serverTimestamp(),
        isRead: false,
        reactions: []
      };

      const docRef = await addDoc(collection(db, 'directMessages'), messageData);
      console.log('[MessagingService] Message sent successfully with ID:', docRef.id);

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
      
      console.log('[MessagingService] Retrieved', messages.length, 'messages');
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting direct messages:', error);
      return [];
    }
  }

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

  // Message Reactions
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

  // Typing Indicators
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

  // Chat Room Operations
  static async createChatRoom(participants: string[], isGroupChat: boolean = false, groupName?: string): Promise<string> {
    try {
      console.log('[MessagingService] Creating chat room with participants:', participants);
      
      const chatRoomData = {
        participants,
        isGroupChat,
        groupName,
        lastActivity: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'chatRooms'), chatRoomData);
      console.log('[MessagingService] Chat room created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  }

  static async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      console.log('[MessagingService] Getting chat rooms for user:', userId);
      
      const chatRoomsQuery = query(
        collection(db, 'chatRooms'),
        where('participants', 'array-contains', userId),
        orderBy('lastActivity', 'desc')
      );
      
      const snapshot = await getDocs(chatRoomsQuery);
      const chatRooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActivity: doc.data().lastActivity?.toDate()
      })) as ChatRoom[];
      
      console.log('[MessagingService] Retrieved', chatRooms.length, 'chat rooms');
      return chatRooms;
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      return [];
    }
  }

  // Real-time Listeners
  static subscribeToDirectMessages(userId: string, callback: (messages: DirectMessage[]) => void) {
    try {
      console.log('[MessagingService] Setting up direct messages listener for user:', userId);
      
      const messagesQuery = query(
        collection(db, 'directMessages'),
        where('receiverId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(20)
      );

      return onSnapshot(messagesQuery, (snapshot) => {
        try {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          })) as DirectMessage[];
          console.log('[MessagingService] Direct messages updated:', messages.length);
          callback(messages);
        } catch (error) {
          console.error('[MessagingService] Error processing direct messages snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[MessagingService] Direct messages listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('[MessagingService] Error setting up direct messages listener:', error);
      return () => {};
    }
  }

  static subscribeToConversation(userId1: string, userId2: string, callback: (messages: DirectMessage[]) => void) {
    try {
      console.log('[MessagingService] Setting up conversation listener between', userId1, 'and', userId2);
      
      const messagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', 'in', [userId1, userId2]),
        where('receiverId', 'in', [userId1, userId2]),
        orderBy('timestamp', 'asc')
      );

      return onSnapshot(messagesQuery, (snapshot) => {
        try {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate()
          })) as DirectMessage[];
          console.log('[MessagingService] Conversation updated:', messages.length, 'messages');
          callback(messages);
        } catch (error) {
          console.error('[MessagingService] Error processing conversation snapshot:', error);
          callback([]);
        }
      }, (error) => {
        console.error('[MessagingService] Conversation listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('[MessagingService] Error setting up conversation listener:', error);
      return () => {};
    }
  }

  // Chat Settings Operations
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

  // Utility Methods
  static async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      const unreadQuery = query(
        collection(db, 'directMessages'),
        where('receiverId', '==', userId),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(unreadQuery);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }
  }

  static async getConversationParticipants(userId: string): Promise<string[]> {
    try {
      const messagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', '==', userId)
      );
      
      const snapshot = await getDocs(messagesQuery);
      const participants = new Set<string>();
      
      snapshot.docs.forEach(doc => {
        participants.add(doc.data().receiverId);
      });
      
      return Array.from(participants);
    } catch (error) {
      console.error('Error getting conversation participants:', error);
      return [];
    }
  }

  // Presence Management
  static async updatePresence(userId: string, status: ChatPresence['status'], currentProject?: string, location?: string): Promise<void> {
    try {
      const presenceRef = doc(db, 'chatPresence', userId);
      await updateDoc(presenceRef, {
        userId,
        status,
        currentProject,
        location,
        lastSeen: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  static subscribeToUserPresence(userId: string, callback: (presence: ChatPresence | null) => void) {
    const presenceRef = doc(db, 'chatPresence', userId);
    
    return onSnapshot(presenceRef, (doc) => {
      if (doc.exists()) {
        const presence = {
          ...doc.data(),
          lastSeen: doc.data().lastSeen?.toDate()
        } as ChatPresence;
        callback(presence);
      } else {
        callback(null);
      }
    });
  }
} 