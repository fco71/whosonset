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
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { DirectMessage, ChatRoom, ChatSettings } from '../types/Chat';
import { SocialService } from './socialService';

export class MessagingService {
  // Direct Message Operations
  static async sendDirectMessage(senderId: string, receiverId: string, content: string, messageType: 'text' | 'image' | 'file' | 'project_invite' = 'text', relatedProjectId?: string): Promise<void> {
    try {
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
        isRead: false
      };

      await addDoc(collection(db, 'directMessages'), messageData);

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

  static async getDirectMessages(userId1: string, userId2: string): Promise<DirectMessage[]> {
    try {
      const messagesQuery = query(
        collection(db, 'directMessages'),
        where('senderId', 'in', [userId1, userId2]),
        where('receiverId', 'in', [userId1, userId2]),
        orderBy('timestamp', 'asc')
      );
      
      const snapshot = await getDocs(messagesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as DirectMessage[];
    } catch (error) {
      console.error('Error getting direct messages:', error);
      return [];
    }
  }

  static async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const messageRef = doc(db, 'directMessages', messageId);
      await updateDoc(messageRef, { isRead: true });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  // Chat Room Operations
  static async createChatRoom(participants: string[], isGroupChat: boolean = false, groupName?: string): Promise<string> {
    try {
      const chatRoomData = {
        participants,
        isGroupChat,
        groupName,
        lastActivity: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'chatRooms'), chatRoomData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  }

  static async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const chatRoomsQuery = query(
        collection(db, 'chatRooms'),
        where('participants', 'array-contains', userId),
        orderBy('lastActivity', 'desc')
      );
      
      const snapshot = await getDocs(chatRoomsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActivity: doc.data().lastActivity?.toDate()
      })) as ChatRoom[];
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      return [];
    }
  }

  // Real-time Listeners
  static subscribeToDirectMessages(userId: string, callback: (messages: DirectMessage[]) => void) {
    const messagesQuery = query(
      collection(db, 'directMessages'),
      where('receiverId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as DirectMessage[];
      callback(messages);
    });
  }

  static subscribeToChatRoom(chatRoomId: string, callback: (messages: DirectMessage[]) => void) {
    const messagesQuery = query(
      collection(db, 'directMessages'),
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as DirectMessage[];
      callback(messages);
    });
  }

  // Chat Settings Operations
  static async getChatSettings(userId: string): Promise<ChatSettings | null> {
    try {
      const settingsQuery = query(
        collection(db, 'chatSettings'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(settingsQuery);
      
      if (!snapshot.empty) {
        return snapshot.docs[0].data() as ChatSettings;
      }
      
      // Return default settings
      return {
        userId,
        allowMessagesFrom: 'everyone',
        showOnlineStatus: true,
        showLastSeen: true,
        isAway: false
      };
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
      const snapshot = await getDocs(settingsQuery);
      
      if (!snapshot.empty) {
        const docRef = doc(db, 'chatSettings', snapshot.docs[0].id);
        await updateDoc(docRef, settings);
      } else {
        await addDoc(collection(db, 'chatSettings'), {
          userId,
          ...settings
        });
      }
    } catch (error) {
      console.error('Error updating chat settings:', error);
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
      const sentMessages = await getDocs(messagesQuery);
      
      const receivedQuery = query(
        collection(db, 'directMessages'),
        where('receiverId', '==', userId)
      );
      const receivedMessages = await getDocs(receivedQuery);
      
      const participants = new Set<string>();
      
      sentMessages.docs.forEach(doc => {
        participants.add(doc.data().receiverId);
      });
      
      receivedMessages.docs.forEach(doc => {
        participants.add(doc.data().senderId);
      });
      
      return Array.from(participants);
    } catch (error) {
      console.error('Error getting conversation participants:', error);
      return [];
    }
  }
} 