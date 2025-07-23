import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessagingService, ConversationSummary } from '../../utilities/messagingService';
import { DirectMessage, ChatSettings, MessageReaction } from '../../types/Chat';
import { SocialService } from '../../utilities/socialService';
import './ChatInterface.scss';
import { collection, getDocs, where, limit, query as firestoreQuery, orderBy, or, doc as docRef, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaTrash } from 'react-icons/fa';
import { imageErrorFallback } from '../../utilities/imageErrorFallback';

// Create a completely independent message input component with rich features
const MessageInput = React.forwardRef<{
  setSendCallback: (callback: (message: string, type?: string, file?: File) => void) => void;
  setCurrentUser: (userId: string) => void;
  setSelectedUser: (userId: string | null) => void;
  setSendingState: (isSending: boolean) => void;
}, {}>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceRecorderRef = useRef<HTMLButtonElement>(null);
  const sendCallbackRef = useRef<((message: string, type?: string, file?: File) => void) | null>(null);
  const currentUserIdRef = useRef<string>('');
  const selectedUserRef = useRef<string | null>(null);
  const sendingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordedAudioFile, setRecordedAudioFile] = useState<File | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Expose methods to parent component
  const setSendCallback = useCallback((callback: (message: string, type?: string, file?: File) => void) => {
    sendCallbackRef.current = callback;
  }, []);
  
  const setCurrentUser = useCallback((userId: string) => {
    currentUserIdRef.current = userId;
  }, []);
  
  const setSelectedUser = useCallback((userId: string | null) => {
    selectedUserRef.current = userId;
  }, []);
  
  const setSendingState = useCallback((isSending: boolean) => {
    sendingRef.current = isSending;
  }, []);
  
  // Expose these methods to parent
  React.useImperativeHandle(ref, () => ({
    setSendCallback,
    setCurrentUser,
    setSelectedUser,
    setSendingState
  }), [setSendCallback, setCurrentUser, setSelectedUser, setSendingState]);

  // Emoji picker
  const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '👏', '🙏', '😎', '🤝', '💪', '🚀', '⭐'];
  
  const addEmoji = useCallback((emoji: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      const value = inputRef.current.value;
      const newValue = value.substring(0, start) + emoji + value.substring(end);
      inputRef.current.value = newValue;
      inputRef.current.selectionStart = inputRef.current.selectionEnd = start + emoji.length;
      inputRef.current.focus();
    }
    setShowEmojiPicker(false);
  }, []);

  // File handling
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && sendCallbackRef.current) {
      sendCallbackRef.current('', undefined, file);
    }
    event.target.value = '';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && sendCallbackRef.current) {
      sendCallbackRef.current('', undefined, file);
    }
  }, []);

  // Voice recording
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
        setRecordedAudioFile(file);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setRecordingError(null);
      
      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      mediaRecorderRef.current = mediaRecorder;
      recordingChunksRef.current = chunks;
      recordingTimerRef.current = timer;
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingError('Could not access microphone');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  }, [isRecording]);

  const sendVoiceMessage = useCallback(() => {
    if (recordedAudioFile && sendCallbackRef.current) {
      sendCallbackRef.current('', 'voice', recordedAudioFile);
      setRecordedAudioFile(null);
      setRecordingTime(0);
    }
  }, [recordedAudioFile]);

  const cancelVoiceMessage = useCallback(() => {
    setRecordedAudioFile(null);
    setRecordingTime(0);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Typing indicator
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      // Send typing indicator
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      // Stop typing indicator
    }, 1000);
  }, []);

  // Send message
  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current || !sendCallbackRef.current || sendingRef.current) return;
    
    const message = inputRef.current.value.trim();
    if (!message && !recordedAudioFile) return;
    
    if (recordedAudioFile) {
      sendVoiceMessage();
    } else {
      sendCallbackRef.current(message);
      inputRef.current.value = '';
    }
  }, [recordedAudioFile, sendVoiceMessage]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="message-input-container">
      {recordingError && (
        <div className="recording-error">
          {recordingError}
          <button onClick={() => setRecordingError(null)}>×</button>
        </div>
      )}
      
      {recordedAudioFile && (
        <div className="voice-message-preview">
          <div className="voice-preview-content">
            <span>🎤 Voice Message ({formatRecordingTime(recordingTime)})</span>
            <div className="voice-preview-actions">
              <button onClick={sendVoiceMessage} className="send-voice-btn">Send</button>
              <button onClick={cancelVoiceMessage} className="cancel-voice-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="input-actions">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="action-button"
            title="Attach file"
          >
            📎
          </button>
          
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="action-button"
            title="Emoji"
          >
            😀
          </button>
          
          <button
            ref={voiceRecorderRef}
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`action-button ${isRecording ? 'recording' : ''}`}
            title={isRecording ? 'Stop recording' : 'Voice message'}
          >
            {isRecording ? '⏹️' : '🎤'}
          </button>
        </div>
        
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            onChange={handleInputChange}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`message-input ${dragOver ? 'drag-over' : ''}`}
            disabled={sendingRef.current}
          />
          
          <button
            type="submit"
            className="send-button"
            disabled={sendingRef.current}
          >
            ➤
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
        />
      </form>
      
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
      
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          Recording... {formatRecordingTime(recordingTime)}
        </div>
      )}
    </div>
  );
});

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  demoUsers?: Record<string, any>; // fallback demo users
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
  const [showSettings, setShowSettings] = useState(false);
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
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [profileUser, setProfileUser] = useState<ConversationSummary | null>(null);
  const [notification, setNotification] = useState<{ type: 'error' | 'success' | 'warning'; message: string } | null>(null);

  // Refs
  const messageInputRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationListenerRef = useRef<(() => void) | null>(null);
  const messageListenerRef = useRef<(() => void) | null>(null);
  const typingListenerRef = useRef<(() => void) | null>(null);

  // Initialize chat
  useEffect(() => {
    if (!currentUserId) return;
    
    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load chat settings
        const settings = await MessagingService.getChatSettings(currentUserId);
        if (settings) {
          // Apply settings if needed
        }
        
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

  // Set up message input callback
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.setSendCallback(sendMessage);
      messageInputRef.current.setCurrentUser(currentUserId);
      messageInputRef.current.setSelectedUser(selectedUser);
      messageInputRef.current.setSendingState(sending);
    }
  }, [currentUserId, selectedUser, sending]);

  // Utility functions
  const formatTime = (date: Date | undefined | null) => {
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
  };

  const getReactionCount = (reactions: MessageReaction[] = [], emoji: string) => {
    return reactions.filter(r => r.emoji === emoji).length;
  };

  const hasUserReacted = (reactions: MessageReaction[] = [], emoji: string) => {
    return reactions.some(r => r.userId === currentUserId && r.emoji === emoji);
  };

  // Cleanup
  const cleanup = () => {
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
  };

  // Search for users to start new chat
  const searchUsers = async (query: string) => {
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
  };

  const startNewConversation = async (userId: string, userName: string) => {
    setSelectedUser(userId);
    setShowNewChat(false);
    setNewChatSearchQuery('');
    setSearchResults([]);
  };

  const handleNewChatSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setNewChatSearchQuery(query);
    
    if (query.trim()) {
      setTimeout(() => searchUsers(query), 300);
    } else {
      setSearchResults([]);
    }
  };

  const getUserInfo = (userId: string) => {
    const conv = conversations.find(c => c.userId === userId);
    if (conv && conv.userName) {
      return { name: conv.userName, avatar: conv.userAvatar };
    }
    
    if (demoUsers[userId]) {
      return { name: demoUsers[userId].displayName, avatar: demoUsers[userId].avatar };
    }
    
    return { name: `User ${userId.slice(-6)}`, avatar: undefined };
  };

  const sendMessage = useCallback(async (messageContent: string, messageType: string = 'text', file?: File) => {
    if (!selectedUser || sending) return;
    setSending(true);
    try {
      let content = messageContent;
      let type = messageType as 'text' | 'image' | 'file' | 'voice' | 'project_invite';
      let fileUrl: string | undefined = undefined;
      
      if (file) {
        if (file.type.startsWith('image/')) {
          type = 'image';
          content = `📷 ${file.name}`;
          fileUrl = await MessagingService.uploadFileToStorage(file, 'chat-images');
        } else if (file.type.startsWith('audio/')) {
          type = 'voice';
          content = `Voice Message (${(file.size / 1024).toFixed(1)} KB)`;
          fileUrl = await MessagingService.uploadFileToStorage(file, 'chat-audio');
        } else {
          type = 'file';
          content = `📎 ${file.name}`;
          fileUrl = await MessagingService.uploadFileToStorage(file, 'chat-files');
        }
        if (!fileUrl) fileUrl = URL.createObjectURL(file);
      }
      
      const optimisticMessage: DirectMessage = {
        id: `temp_${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedUser,
        content,
        timestamp: new Date(),
        isRead: false,
        messageType: type,
        status: 'sending',
        fileUrl,
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      await MessagingService.sendDirectMessage(currentUserId, selectedUser, content, type, undefined, fileUrl);
      setMessages(prev => prev.map(msg =>
        msg.id === optimisticMessage.id
          ? { ...msg, status: 'sent' as any }
          : msg
      ));
      MessagingService.setTypingStatus(currentUserId, selectedUser, false);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('exceeds maximum allowed size')) {
          setNotification({ type: 'error', message: 'File is too large. Please choose a file smaller than 5MB.' });
        } else if (error.message.includes('Cannot send message')) {
          setNotification({ type: 'error', message: 'Cannot send message to this user. They may not allow messages from non-followers.' });
        } else {
          setNotification({ type: 'error', message: 'Failed to send message. Please try again.' });
        }
      } else {
        setNotification({ type: 'error', message: 'An unexpected error occurred.' });
      }
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  }, [selectedUser, sending, currentUserId]);

  const showNotification = (type: 'error' | 'success' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const isValidFileUrl = (url: string) => {
    return url && !url.startsWith('FILE_TOO_LARGE:') && !url.startsWith('UPLOAD_FAILED:');
  };

  if (loading) {
    return (
      <div className="chat-interface">
        <div className="chat-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === 'error' && '❌'}
              {notification.type === 'success' && '✅'}
              {notification.type === 'warning' && '⚠️'}
            </span>
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2 className="text-xl font-light text-gray-900 tracking-wide">Messages</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNewChat(!showNewChat)}
                className="new-chat-button"
                title="New Chat"
              >
                ➕
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="settings-button"
                title="Chat Settings"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* New Chat Section */}
          {showNewChat && (
            <div className="new-chat-section">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Start New Chat</h3>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users to chat with..."
                    value={newChatSearchQuery}
                    onChange={handleNewChatSearch}
                    className="w-full text-sm border border-gray-200 rounded px-3 py-2"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                
                {searchResults.length > 0 && (
                  <div className="search-results max-h-48 overflow-y-auto space-y-2">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
                        onClick={() => startNewConversation(user.id, user.name)}
                      >
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={imageErrorFallback}
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{user.name}</h4>
                          {user.role && (
                            <p className="text-xs text-gray-600 truncate">{user.role}</p>
                          )}
                          {user.company && (
                            <p className="text-xs text-gray-500 truncate">{user.company}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p className="text-gray-500 text-sm">No conversations yet</p>
                <p className="text-gray-400 text-xs">Start a new chat to begin messaging</p>
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
                          className="w-10 h-10 rounded-full object-cover"
                          onError={imageErrorFallback}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {conversation.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {conversation.isOnline && (
                        <div className="online-indicator"></div>
                      )}
                    </div>
                    
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <h4 className="conversation-name">{conversation.userName}</h4>
                        {conversation.lastMessageTime && (
                          <span className="conversation-time">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      
                      <div className="conversation-preview">
                        <p className="conversation-message">
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="unread-badge">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileUser(conversation);
                        setShowUserProfile(true);
                      }}
                      className="profile-button"
                      title="View Profile"
                    >
                      👤
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          {selectedUser ? (
            <div className="chat-messages-container">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  {selectedUser ? (
                    <img 
                      src={getUserInfo(selectedUser).avatar || ''} 
                      alt={getUserInfo(selectedUser).name}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={imageErrorFallback}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {selectedUser ? getUserInfo(selectedUser).name.charAt(0).toUpperCase() : ''}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="user-name">{selectedUser ? getUserInfo(selectedUser).name : ''}</h3>
                    {typingUsers.includes(selectedUser) && (
                      <p className="typing-indicator">typing...</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      {message.messageType === 'image' && message.fileUrl ? (
                        <div className="message-image">
                          {!isValidFileUrl(message.fileUrl) ? (
                            <div className="upload-failed-message">
                              <div className="upload-failed-icon">⚠️</div>
                              <div className="upload-failed-content">
                                <div className="upload-failed-title">Upload Failed</div>
                                <div className="upload-failed-name">{message.fileName || 'Image'}</div>
                              </div>
                            </div>
                          ) : (
                            <img 
                              src={message.fileUrl} 
                              alt={message.fileName || 'Image'} 
                              className="message-image-content"
                              onClick={() => window.open(message.fileUrl, '_blank')}
                              onError={imageErrorFallback}
                            />
                          )}
                          {message.content && <p className="image-caption">{message.content}</p>}
                        </div>
                      ) : message.messageType === 'file' && message.fileUrl ? (
                        <div className="message-file">
                          <div className="file-info">
                            <div className="file-icon">📎</div>
                            <div className="file-details">
                              <div className="file-name">{message.fileName || 'File'}</div>
                              <div className="file-size">
                                {message.fileSize ? `${(message.fileSize / 1024).toFixed(1)} KB` : 'Unknown size'}
                              </div>
                            </div>
                          </div>
                          {isValidFileUrl(message.fileUrl) && (
                            <a 
                              href={message.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="file-download"
                            >
                              Download
                            </a>
                          )}
                        </div>
                      ) : message.messageType === 'voice' ? (
                        <div className="message-voice">
                          <div className="voice-message">
                            <span className="voice-icon">🎤</span>
                            <span className="voice-duration">
                              {message.fileSize ? `${Math.round(message.fileSize / 1024)} KB` : 'Voice Message'}
                            </span>
                          </div>
                          {message.fileUrl && isValidFileUrl(message.fileUrl) && (
                            <audio controls className="voice-player">
                              <source src={message.fileUrl} type="audio/wav" />
                              Your browser does not support the audio element.
                            </audio>
                          )}
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
                        {message.senderId === currentUserId && (
                          <span className="message-status">
                            {message.status === 'sending' && '⏳'}
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'read' && '✓✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
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
                <MessageInput ref={messageInputRef} />
              </div>
            </div>
          ) : (
            <div className="no-conversation">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Select a conversation</h3>
              <p className="text-gray-500 text-sm">Choose a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && profileUser && (
        <div className="profile-modal-overlay" onClick={() => setShowUserProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header">
              <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
              <button
                onClick={() => setShowUserProfile(false)}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="profile-content">
              <div className="profile-avatar-section">
                {profileUser.userAvatar ? (
                  <img 
                    src={profileUser.userAvatar} 
                    alt={profileUser.userName}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={imageErrorFallback}
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-medium text-gray-600">
                      {profileUser.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="profile-status">
                  {profileUser.isOnline ? (
                    <span className="online-status">🟢 Online</span>
                  ) : (
                    <span className="offline-status">⚫ Offline</span>
                  )}
                </div>
              </div>
              
              <div className="profile-info">
                <h4 className="profile-name">{profileUser.userName}</h4>
                <p className="profile-role">{profileUser.userRole || 'Film Industry Professional'}</p>
                <p className="profile-location">Location: {profileUser.userLocation || 'Not specified'}</p>
                <p className="profile-company">Company: {profileUser.userCompany || 'Not specified'}</p>
              </div>
              
              <div className="profile-actions">
                <button
                  onClick={() => {
                    setSelectedUser(profileUser.userId);
                    setShowUserProfile(false);
                  }}
                  className="start-chat-button"
                >
                  💬 Start Chat
                </button>
                <button className="view-full-profile-button">
                  👁️ View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
