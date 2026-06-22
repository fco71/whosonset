import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessagingService, ConversationSummary } from '../../services/messagingService';
import { DirectMessage } from '../../types/Chat';
import { collection, getDocs, where, limit, query as firestoreQuery, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { imageErrorFallback } from '../../utilities/imageErrorFallback';
import { useTranslation } from 'react-i18next';
import EmailNotificationService from '../../services/emailNotificationService';
import './ChatInterface.scss';

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  demoUsers?: Record<string, any>;
  initialSelectedUser?: string; // For deep linking to specific conversations
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentUserId, 
  currentUserName,
  currentUserAvatar,
  demoUsers = {},
  initialSelectedUser
}) => {
  const { t } = useTranslation();
  
  // State
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(initialSelectedUser || null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatSearchQuery, setNewChatSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    company?: string;
    location?: string;
    type: 'crew';
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [pendingAttachment, setPendingAttachment] = useState<File | null>(null);
  const [pendingAttachmentType, setPendingAttachmentType] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationListenerRef = useRef<(() => void) | null>(null);
  const messageListenerRef = useRef<(() => void) | null>(null);
  const typingListenerRef = useRef<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Emoji picker - memoized to prevent re-creation
  const emojis = useMemo(() => ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙏', '😎', '🤝', '💪', '🚀', '⭐'], []);
  
  // Reaction emojis - commonly used reactions
  const reactionEmojis = useMemo(() => ['👍', '❤️', '😂', '😮', '😢', '😡'], []);

  // Initialize chat
  useEffect(() => {
    if (!currentUserId) return;
    
    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set up conversation listener
        const unsubscribe = MessagingService.subscribeToConversations(
          currentUserId,
          (conversations) => {
            setConversations(conversations);
            setLoading(false);
          }
        );
        
        conversationListenerRef.current = unsubscribe;
        
      } catch (error) {
        console.error('Error initializing chat:', error);
        setError('Failed to load conversations');
        setLoading(false);
      }
    };
    
    initializeChat();
    
    return () => {
      cleanup();
    };
  }, [currentUserId]);

  // Handle initial selected user from URL parameter
  useEffect(() => {
    if (initialSelectedUser && currentUserId) {
      // Ensure the conversation exists by trying to get/create the conversation ID
      const ensureConversationExists = async () => {
        try {
          // This will create the conversation if it doesn't exist
          await MessagingService.getConversationId(currentUserId, initialSelectedUser);
          console.log('[ChatInterface] Conversation ensured for users:', currentUserId, initialSelectedUser);
        } catch (error) {
          console.error('[ChatInterface] Error ensuring conversation exists:', error);
        }
      };
      
      ensureConversationExists();
    }
  }, [initialSelectedUser, currentUserId]);

  // Mark conversation as read when selected user changes
  useEffect(() => {
    if (selectedUser && conversations.length > 0) {
      const conversation = conversations.find(c => c.userId === selectedUser);
      if (conversation && conversation.unreadCount > 0) {
        const markAsRead = async () => {
          try {
            await MessagingService.markConversationAsRead(currentUserId, selectedUser);
          } catch (error) {
            console.error('Error marking conversation as read:', error);
          }
        };
        markAsRead();
      }
    }
  }, [selectedUser, conversations, currentUserId]);

  // Set up message listener when user is selected
  useEffect(() => {
    if (!selectedUser || !currentUserId) return;
    
    const setupMessageListener = () => {
      const unsubscribe = MessagingService.subscribeToConversation(
        currentUserId,
        selectedUser,
        (messages) => {
          setMessages(messages);
          // Scroll to bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          
          // Mark conversation as read when messages are loaded
          if (messages.length > 0) {
            MessagingService.markConversationAsRead(currentUserId, selectedUser).catch(error => {
              console.error('[ChatInterface] Error marking conversation as read:', error);
            });
          }
        }
      );
      
      messageListenerRef.current = unsubscribe;
    };
    
    setupMessageListener();
    
    // Set up typing indicator listener
    const typingUnsubscribe = MessagingService.subscribeToTypingIndicators(
      selectedUser,
      (typingUsers) => {
        setTypingUsers(typingUsers);
      }
    );
    
    typingListenerRef.current = typingUnsubscribe;
    
    return () => {
      if (messageListenerRef.current) {
        messageListenerRef.current();
        messageListenerRef.current = null;
      }
      if (typingListenerRef.current) {
        typingListenerRef.current();
        typingListenerRef.current = null;
      }
    };
  }, [selectedUser, currentUserId]);

  // Mark messages as read when they are viewed
  useEffect(() => {
    if (!selectedUser || !currentUserId || messages.length === 0) return;

    // Mark unread messages from the other user as read
    const unreadMessages = messages.filter(
      message => 
        message.senderId === selectedUser && 
        !message.isRead && 
        message.status !== 'read'
    );

    if (unreadMessages.length > 0) {
      console.log('[ChatInterface] Marking messages as read:', unreadMessages.length);
      
      // Mark each unread message as read
      unreadMessages.forEach(async (message) => {
        try {
          await MessagingService.markMessageAsRead(message.id);
        } catch (error) {
          console.error('[ChatInterface] Error marking message as read:', error);
        }
      });
    }
  }, [messages, selectedUser, currentUserId]);

  // Cleanup
  const cleanup = useCallback(() => {
    try {
      if (conversationListenerRef.current) {
        conversationListenerRef.current();
        conversationListenerRef.current = null;
      }
      if (messageListenerRef.current) {
        messageListenerRef.current();
        messageListenerRef.current = null;
      }
      if (typingListenerRef.current) {
        typingListenerRef.current();
        typingListenerRef.current = null;
      }
      MessagingService.cleanup();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }, []);

  // Search for users to start new chat - memoized to prevent unnecessary re-renders
  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const crewQuery = firestoreQuery(
        collection(db, 'crewProfiles'),
        where('isPublished', '==', true),
        limit(20)
      );

      const crewSnapshot = await getDocs(crewQuery);

      const results: Array<{
        id: string;
        name: string;
        avatar?: string;
        role?: string;
        company?: string;
        location?: string;
        type: 'crew';
      }> = [];

      crewSnapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        const name = data.name || data.displayName || data.firstName || '';
        
        if (doc.id !== currentUserId && 
            name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: doc.id,
            name: name || `Crew Member ${doc.id.slice(-4)}`,
            avatar: data.profileImageUrl || data.avatarUrl,
            role: data.role,
            company: data.company,
            location: data.residences?.[0]?.city || data.location,
            type: 'crew'
          });
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [currentUserId]);

  const startNewConversation = useCallback(async (userId: string, userName: string) => {
    setSelectedUser(userId);
    setShowNewChat(false);
    setNewChatSearchQuery('');
    setSearchResults([]);
    
    // Mark conversation as read when starting a new conversation
    try {
      await MessagingService.markConversationAsRead(currentUserId, userId);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }, [currentUserId]);

  const handleNewChatSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setNewChatSearchQuery(query);
    
    if (query.trim()) {
      const timeoutId = setTimeout(() => searchUsers(query), 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchUsers]);

  const getUserInfo = useCallback((userId: string) => {
    const conv = conversations.find(c => c.userId === userId);
    return conv || null;
  }, [conversations]);

  // Get user email for notifications
  const getUserEmail = useCallback(async (userId: string): Promise<string | null> => {
    try {
      console.log('[ChatInterface] Getting email for user:', userId);
      
      // Read from the users collection only. The crewProfiles doc no longer
      // carries email (it's public when published); the signed-in-readable
      // users/{uid}.email is the recipient source for notifications.
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const email = userDoc.data()?.email;
        console.log('[ChatInterface] Found email in users collection:', email);
        return email || null;
      }

      console.log('[ChatInterface] No email found for user:', userId);
      return null;
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  }, []);

  // File handling - optimized
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedUser) {
      setPendingAttachment(file);
      setPendingAttachmentType(file.type);
    }
    event.target.value = '';
  }, [selectedUser]);

  const cancelPendingAttachment = useCallback(() => {
    setPendingAttachment(null);
    setPendingAttachmentType(null);
  }, []);

  const sendPendingAttachment = useCallback(async () => {
    if (!pendingAttachment || !selectedUser || sending) return;

    setSending(true);
    try {
      // Upload file to storage first
      let fileUrl = '';
      if (pendingAttachmentType?.startsWith('audio/')) {
        // For voice messages, upload to storage
        fileUrl = await MessagingService.uploadFileToStorage(pendingAttachment, 'voice-messages', currentUserId);
      } else {
        // For other files, use existing logic
        fileUrl = await MessagingService.uploadFileToStorage(pendingAttachment, 'chat-uploads', currentUserId);
      }

      const content = pendingAttachmentType?.startsWith('audio/') 
        ? 'Voice message' 
        : pendingAttachment.name;
      
      const messageType = pendingAttachmentType?.startsWith('audio/') 
        ? 'voice' 
        : pendingAttachmentType?.startsWith('image/') 
        ? 'image' 
        : 'file';

      const optimisticMessage: DirectMessage = {
        id: `temp_${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedUser,
        content,
        timestamp: new Date(),
        isRead: false,
        status: 'sending',
        messageType,
        fileUrl,
        fileName: pendingAttachment.name,
        fileSize: pendingAttachment.size,
        fileType: pendingAttachment.type
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      await MessagingService.sendDirectMessage(currentUserId, selectedUser, content, messageType, undefined, fileUrl);
      setMessages(prev => prev.map(msg =>
        msg.id === optimisticMessage.id
          ? { ...msg, status: 'sent' as any }
          : msg
      ));
      
      // Clear pending attachment
      setPendingAttachment(null);
      setPendingAttachmentType(null);
    } catch (error) {
      console.error('Error sending file:', error);
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
      setError('Failed to send attachment. Please try again.');
    } finally {
      setSending(false);
    }
  }, [pendingAttachment, selectedUser, sending, currentUserId]);

  // Voice recording - optimized
  const startRecording = useCallback(async () => {
    try {
      // Check if microphone is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Microphone not supported in this browser. Please use a modern browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], `voice-message-${Date.now()}.wav`, { type: 'audio/wav' });
        setPendingAttachment(file);
        setPendingAttachmentType('audio/wav');
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setRecordingTime(0);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      mediaRecorderRef.current = mediaRecorder;
      recordingTimerRef.current = timer;
      
    } catch (error: any) {
      console.error('Error starting recording:', error);
      
      // Provide specific guidance based on error type
      let errorMessage = 'Could not access microphone';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and try again.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Microphone is already in use by another application. Please close other apps using the microphone and try again.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Microphone does not meet the required constraints. Please try a different microphone.';
      }
      
      setError(errorMessage);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const formatRecordingTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Emoji handling
  const addEmoji = useCallback((emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  // Reaction handling
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      await MessagingService.addMessageReaction(messageId, currentUserId, currentUserName, emoji);
      setShowReactionPicker(null);
    } catch (error) {
      console.error('Error adding reaction:', error);
      setError('Failed to add reaction');
    }
  }, [currentUserId, currentUserName]);

  const toggleReactionPicker = useCallback((messageId: string) => {
    setShowReactionPicker(showReactionPicker === messageId ? null : messageId);
  }, [showReactionPicker]);

  const sendMessage = useCallback(async () => {
    if (!selectedUser || sending || !messageInput.trim()) return;
    
    const content = messageInput.trim();
    setSending(true);
    setMessageInput('');
    
    try {
      const optimisticMessage: DirectMessage = {
        id: `temp_${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedUser,
        content,
        timestamp: new Date(),
        isRead: false,
        messageType: 'text',
        status: 'sending'
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      await MessagingService.sendDirectMessage(currentUserId, selectedUser, content, 'text');
      setMessages(prev => prev.map(msg =>
        msg.id === optimisticMessage.id
          ? { ...msg, status: 'sent' as any }
          : msg
      ));

      // Send email notification
      try {
        const recipientEmail = await getUserEmail(selectedUser);
        if (recipientEmail) {
          console.log('[ChatInterface] Sending email notification to:', recipientEmail);
          const messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
          await EmailNotificationService.sendChatNotification(
            recipientEmail,
            currentUserName,
            messagePreview,
            undefined, // conversationUrl
            selectedUser // userId
          );
          console.log('[ChatInterface] Email notification sent successfully to:', recipientEmail);
        } else {
          console.log('[ChatInterface] No email found for recipient:', selectedUser);
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the message send if email notification fails
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
    } finally {
      setSending(false);
    }
  }, [selectedUser, sending, currentUserId, messageInput, currentUserName, getUserEmail]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const formatTime = useCallback((date: Date | undefined | null) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);

  // Memoized message rendering to improve performance
  const renderMessage = useCallback((message: DirectMessage) => {
    try {
      const isSent = message.senderId === currentUserId;
      
      // Defensive programming - ensure message has required properties
      if (!message || !message.id) {
        return null;
      }
      
      return (
        <div
          key={message.id}
          className={`message ${isSent ? 'sent' : 'received'}`}
          style={{ position: 'relative' }}
        >
          <div className="message-content">
            {['deleted_text', 'deleted_image', 'deleted_audio', 'deleted_file'].includes(message.messageType) ? (
              <div className="deleted-message-placeholder" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: '#b0b6be',
                fontStyle: 'italic',
                fontSize: 13,
                background: 'none',
                borderRadius: 0,
                padding: 0,
                margin: '2px 0 0 0',
                boxShadow: 'none',
                minHeight: 0
              }}>
                <span style={{ fontSize: 15, opacity: 0.7, marginRight: 2 }}>🗑️</span>
                {message.content}
              </div>
            ) : message.messageType === 'image' && message.fileUrl && !message.fileUrl.startsWith('FILE_TOO_LARGE:') && !message.fileUrl.startsWith('UPLOAD_FAILED:') ? (
              <div className="message-image">
                <img 
                  src={message.fileUrl} 
                  alt={message.fileName || 'Image'} 
                  className="message-image-content"
                  onError={imageErrorFallback}
                />
                {message.content && <p className="image-caption">{message.content}</p>}
              </div>
            ) : message.messageType === 'voice' && message.fileUrl && !message.fileUrl.startsWith('FILE_TOO_LARGE:') && !message.fileUrl.startsWith('UPLOAD_FAILED:') ? (
              <div className="message-voice">
                <div className="voice-player">
                  <div className="custom-audio-player">
                    <button 
                      className="play-button"
                      onClick={(e) => {
                        e.preventDefault();
                        const audioElement = e.currentTarget.parentElement?.querySelector('audio') as HTMLAudioElement;
                        if (audioElement) {
                          if (audioElement.paused) {
                            audioElement.play().catch(err => {
                              console.error('Error playing audio:', err);
                            });
                            e.currentTarget.innerHTML = '⏸️';
                          } else {
                            audioElement.pause();
                            e.currentTarget.innerHTML = '▶️';
                          }
                        }
                      }}
                      type="button"
                    >
                      ▶️
                    </button>
                    <audio 
                      src={message.fileUrl} 
                      preload="metadata"
                      onEnded={(e) => {
                        const button = e.currentTarget.parentElement?.querySelector('.play-button') as HTMLButtonElement;
                        if (button) button.innerHTML = '▶️';
                      }}
                      onError={(e) => {
                        console.error('Audio error:', e);
                      }}
                    />
                    <div className="audio-info">
                      <span className="audio-duration">Voice message</span>
                    </div>
                  </div>
                </div>
                {message.content && <p className="voice-caption">{message.content}</p>}
              </div>
            ) : (
              <div className="message-text">
                {message.content}
              </div>
            )}
            
            <div className="message-meta">
              <span className="message-time">
                {formatTime(message.timestamp)}
              </span>
              {isSent && (
                <span className="message-status">
                  {message.status === 'sending' && '⏳'}
                  {message.status === 'sent' && '✓'}
                  {message.status === 'delivered' && '✓✓'}
                  {message.status === 'read' && '✓✓'}
                </span>
              )}
            </div>

            {/* Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="message-reactions">
                {/* Group reactions by emoji */}
                {Object.entries(
                  message.reactions.reduce((acc, reaction) => {
                    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([emoji, count], index) => (
                  <span key={index} className="reaction">
                    {emoji}
                    <span className="reaction-count">{count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="message-actions">
            {/* Reaction button */}
            <button
              title="Add reaction"
              className="reaction-button"
              onClick={() => toggleReactionPicker(message.id)}
            >
              😀
            </button>

            {/* Delete button for sender's messages */}
            {isSent && !['deleted_text', 'deleted_image', 'deleted_audio', 'deleted_file'].includes(message.messageType) && (
              <button
                title="Delete message"
                className="delete-message-button"
                onClick={async () => {
                  const confirmMessage = 'Delete this message for everyone?';
                  if (window.confirm(confirmMessage)) {
                    try {
                      await MessagingService.deleteMessage(message.id, message.fileUrl, message.messageType, currentUserId);
                      // The message will be updated via the listener, no need to manually update state
                    } catch (error) {
                      console.error('Error deleting message:', error);
                      setError('Failed to delete message. Please try again.');
                    }
                  }
                }}
              >
                🗑️
              </button>
            )}
          </div>

          {/* Reaction picker */}
          {showReactionPicker === message.id && (
            <div className="reaction-picker">
              {reactionEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => addReaction(message.id, emoji)}
                  className="reaction-option"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    } catch (error) {
      console.error('Error rendering message:', error);
      return null; // Return null to avoid rendering a broken message
    }
  }, [currentUserId, formatTime, showReactionPicker, reactionEmojis, addReaction, toggleReactionPicker]);

  if (loading) {
    return (
      <div className="chat-interface">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)} 
            className="error-close-btn"
            title="Dismiss error"
            type="button"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <button
              onClick={() => setShowNewChat(!showNewChat)}
              className="new-chat-button"
            >
              ➕
            </button>
          </div>

          {/* New Chat Section */}
          {showNewChat && (
            <div className="new-chat-section">
              <h3>Start New Chat</h3>
              <input
                type="text"
                placeholder="Search users..."
                value={newChatSearchQuery}
                onChange={handleNewChatSearch}
                className="search-input"
              />
              
              {isSearching && (
                <div className="search-loading">Searching...</div>
              )}
              
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="search-result-item"
                      onClick={() => startNewConversation(user.id, user.name)}
                    >
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            onError={imageErrorFallback}
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-info">
                        <h4>{user.name}</h4>
                        {user.role && <p>{user.role}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Conversations List */}
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p>No conversations yet</p>
                <p>Start a new chat to begin messaging</p>
              </div>
            ) : (
              // Deduplicate conversations by userId to prevent React key conflicts
              conversations
                .filter((conversation, index, self) => 
                  index === self.findIndex(c => c.userId === conversation.userId)
                )
                .map((conversation) => {
                  const isSelected = selectedUser === conversation.userId;
                  return (
                    <div
                      key={conversation.userId}
                      className={`conversation-item ${isSelected ? 'selected' : ''}`}
                      onClick={async () => {
                        console.log('[ChatInterface] Selecting conversation:', conversation.userId, 'Unread count:', conversation.unreadCount);
                        setSelectedUser(conversation.userId);
                        
                        // Mark conversation as read when selected
                        if (conversation.unreadCount > 0) {
                          try {
                            console.log('[ChatInterface] Marking conversation as read:', conversation.userId);
                            
                            // Add a small delay to make the unread count visible before clearing
                            setTimeout(async () => {
                              await MessagingService.markConversationAsRead(currentUserId, conversation.userId);
                              console.log('[ChatInterface] Conversation marked as read successfully');
                              
                              // Update the conversation list to reflect the change
                              setConversations(prev => prev.map(conv => 
                                conv.userId === conversation.userId 
                                  ? { ...conv, unreadCount: 0 }
                                  : conv
                              ));
                            }, 100); // 100ms delay
                          } catch (error) {
                            console.error('Error marking conversation as read:', error);
                          }
                        }
                      }}
                    >
                    <div className="conversation-avatar">
                      {conversation.userAvatar ? (
                        <img
                          src={conversation.userAvatar}
                          alt={conversation.userName}
                          onError={imageErrorFallback}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {conversation.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {conversation.isOnline && (
                        <div className="online-indicator"></div>
                      )}
                    </div>
                    
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <h4>{conversation.userName}</h4>
                        {conversation.lastMessageTime && (
                          <span>{formatTime(conversation.lastMessageTime)}</span>
                        )}
                      </div>
                      
                      <div className="conversation-preview">
                        <p>{conversation.lastMessage || 'No messages yet'}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="unread-badge">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedUser ? (
            <div className="chat-messages-container">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  {selectedUser ? (
                    <img 
                      src={getUserInfo(selectedUser)?.userAvatar || ''} 
                      alt={getUserInfo(selectedUser)?.userName || ''}
                      onError={imageErrorFallback}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {selectedUser ? getUserInfo(selectedUser)?.userName?.charAt(0).toUpperCase() : ''}
                    </div>
                  )}
                  <div>
                    <h3>{selectedUser ? getUserInfo(selectedUser)?.userName : ''}</h3>
                    {typingUsers.includes(selectedUser) && (
                      <p className="typing-indicator">typing...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.map(renderMessage)}
                
                {/* Typing Indicator */}
                {typingUsers.includes(selectedUser) && (
                  <div className="typing-indicator-message">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-wrapper">
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="recording-indicator">
                    <div className="recording-dot"></div>
                    <span>Recording... {formatRecordingTime(recordingTime)}</span>
                    <button onClick={stopRecording} className="stop-recording">
                      Stop
                    </button>
                  </div>
                )}

                {/* Attachment Preview */}
                {pendingAttachment && (
                  <div className="attachment-preview">
                    <div className="preview-header">
                      <span>📎 Attachment Preview</span>
                      <button onClick={cancelPendingAttachment} className="close-preview">✕</button>
                    </div>
                    
                    <div className="preview-content">
                      {pendingAttachmentType?.startsWith('image/') ? (
                        <img 
                          src={URL.createObjectURL(pendingAttachment)} 
                          alt="Preview" 
                          className="image-preview"
                        />
                      ) : pendingAttachmentType?.startsWith('audio/') ? (
                        <div className="audio-preview">
                          <audio controls src={URL.createObjectURL(pendingAttachment)} />
                          <span>🎤 Voice Message</span>
                        </div>
                      ) : (
                        <div className="file-preview">
                          <span>📄 {pendingAttachment.name}</span>
                          <span className="file-size">({(pendingAttachment.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="preview-actions">
                      <button 
                        onClick={sendPendingAttachment} 
                        disabled={sending}
                        className="send-attachment-btn"
                      >
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                      <button 
                        onClick={cancelPendingAttachment}
                        className="cancel-attachment-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="emoji-button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <div className="message-input-container">
                  {/* Action Buttons */}
                  <div className="input-actions">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="action-button"
                      title={t('chat.attachFile')}
                    >
                      📎
                    </button>
                    
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="action-button"
                      title={t('chat.emoji')}
                    >
                      😀
                    </button>
                    
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`action-button ${isRecording ? 'recording' : ''}`}
                      title={isRecording ? t('chat.stopRecording') : t('chat.voiceMessage')}
                    >
                      {isRecording ? '⏹️' : '🎤'}
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder={t('chat.typeMessage')}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    className="message-input"
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={sending || !messageInput.trim()}
                    className="send-button"
                  >
                    {sending ? t('chat.sending') : t('chat.send')}
                  </button>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                />
              </div>
            </div>
          ) : (
            <div className="no-conversation">
              <div className="no-conversation-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
