import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessagingService, ConversationSummary } from '../../utilities/messagingService';
import { DirectMessage } from '../../types/Chat';
import { collection, getDocs, where, limit, query as firestoreQuery } from 'firebase/firestore';
import { db } from '../../firebase';
import { imageErrorFallback } from '../../utilities/imageErrorFallback';
import './ChatInterface.scss';

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  demoUsers?: Record<string, any>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentUserId, 
  currentUserName,
  currentUserAvatar,
  demoUsers = {}
}) => {
  // State
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
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
  }, []);

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
    if (conv && conv.userName) {
      return { name: conv.userName, avatar: conv.userAvatar };
    }
    
    if (demoUsers[userId]) {
      return { name: demoUsers[userId].displayName, avatar: demoUsers[userId].avatar };
    }
    
    return { name: `User ${userId.slice(-6)}`, avatar: undefined };
  }, [conversations, demoUsers]);

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
      let content = `📎 ${pendingAttachment.name}`;
      let messageType: 'text' | 'image' | 'file' | 'voice' = 'file';
      let fileUrl: string | undefined;
      
      // Determine message type and content
      if (pendingAttachment.type.startsWith('image/')) {
        content = `📷 ${pendingAttachment.name}`;
        messageType = 'image';
      } else if (pendingAttachment.type.startsWith('audio/')) {
        content = `🎤 ${pendingAttachment.name}`;
        messageType = 'voice';
      }
      
      // Upload file to storage
      try {
        fileUrl = await MessagingService.uploadFileToStorage(pendingAttachment, 'chat-uploads');
        console.log('File uploaded successfully:', fileUrl);
      } catch (uploadError) {
        console.error('File upload failed:', uploadError);
        // Continue with message even if upload fails
      }
      
      const optimisticMessage: DirectMessage = {
        id: `temp_${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedUser,
        content,
        timestamp: new Date(),
        isRead: false,
        messageType,
        status: 'sending',
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
    } finally {
      setSending(false);
    }
  }, [pendingAttachment, selectedUser, sending, currentUserId]);

  // Voice recording - optimized
  const startRecording = useCallback(async () => {
    try {
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
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not access microphone');
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
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
    } finally {
      setSending(false);
    }
  }, [selectedUser, sending, currentUserId, messageInput]);

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
    const isSent = message.senderId === currentUserId;
    
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
                <audio controls>
                  <source src={message.fileUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
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
                    await MessagingService.deleteMessage(message.id, message.fileUrl, message.messageType);
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
          {error}
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
              conversations.map((conversation) => {
                const isSelected = selectedUser === conversation.userId;
                return (
                  <div
                    key={conversation.userId}
                    className={`conversation-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedUser(conversation.userId)}
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
                      src={getUserInfo(selectedUser).avatar || ''} 
                      alt={getUserInfo(selectedUser).name}
                      onError={imageErrorFallback}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {selectedUser ? getUserInfo(selectedUser).name.charAt(0).toUpperCase() : ''}
                    </div>
                  )}
                  <div>
                    <h3>{selectedUser ? getUserInfo(selectedUser).name : ''}</h3>
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
                      title="Attach file"
                    >
                      📎
                    </button>
                    
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="action-button"
                      title="Emoji"
                    >
                      😀
                    </button>
                    
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`action-button ${isRecording ? 'recording' : ''}`}
                      title={isRecording ? 'Stop recording' : 'Voice message'}
                    >
                      {isRecording ? '⏹️' : '🎤'}
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Type a message..."
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
                    {sending ? 'Sending...' : 'Send'}
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
