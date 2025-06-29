import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessagingService, ConversationSummary } from '../../utilities/messagingService';
import { DirectMessage, ChatSettings, MessageReaction } from '../../types/Chat';
import { SocialService } from '../../utilities/socialService';
import './ChatInterface.scss';
import { collection, getDocs, where, limit, query as firestoreQuery } from 'firebase/firestore';
import { db } from '../../firebase';

// Create a completely independent message input component
const MessageInput = React.forwardRef<{
  setSendCallback: (callback: (message: string) => void) => void;
  setCurrentUser: (userId: string) => void;
  setSelectedUser: (userId: string | null) => void;
  setSendingState: (isSending: boolean) => void;
}, {}>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const sendCallbackRef = useRef<((message: string) => void) | null>(null);
  const currentUserIdRef = useRef<string>('');
  const selectedUserRef = useRef<string | null>(null);
  const sendingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef<boolean>(false);
  
  // Expose methods to parent component
  const setSendCallback = useCallback((callback: (message: string) => void) => {
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
    if (inputRef.current) {
      inputRef.current.disabled = isSending;
    }
  }, []);
  
  // Expose these methods to parent
  React.useImperativeHandle(ref, () => ({
    setSendCallback,
    setCurrentUser,
    setSelectedUser,
    setSendingState
  }), [setSendCallback, setCurrentUser, setSelectedUser, setSendingState]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTypingRef.current && selectedUserRef.current) {
      isTypingRef.current = true;
      MessagingService.setTypingStatus(currentUserIdRef.current, selectedUserRef.current, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      if (selectedUserRef.current) {
        MessagingService.setTypingStatus(currentUserIdRef.current, selectedUserRef.current, false);
      }
    }, 2000);
  }, []);

  const handleSend = useCallback(() => {
    if (!inputRef.current || !selectedUserRef.current || sendingRef.current) return;
    
    const messageContent = inputRef.current.value.trim();
    if (!messageContent) return;
    
    // Clear input immediately
    inputRef.current.value = '';
    
    // Send the message via callback
    if (sendCallbackRef.current) {
      sendCallbackRef.current(messageContent);
    }
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="message-input">
      <input
        ref={inputRef}
        type="text"
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="message-input-field"
      />
      <button
        onClick={handleSend}
        disabled={sendingRef.current}
        className="send-button"
      >
        {sendingRef.current ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

// Interface for the main component
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
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    userId: currentUserId,
    allowMessagesFrom: 'everyone',
    showOnlineStatus: true,
    showLastSeen: true,
    isAway: false
  });
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [profileUser, setProfileUser] = useState<ConversationSummary | null>(null);
  const [newChatSearchQuery, setNewChatSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false); // Track if user is actively typing

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationListenerRef = useRef<(() => void) | null>(null);
  const messageListenerRef = useRef<(() => void) | null>(null);
  const typingListenerRef = useRef<(() => void) | null>(null);
  const messageInputRef = useRef<{
    setSendCallback: (callback: (message: string) => void) => void;
    setCurrentUser: (userId: string) => void;
    setSelectedUser: (userId: string | null) => void;
    setSendingState: (isSending: boolean) => void;
  }>(null);

  // Memoized values
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(conv => 
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const selectedConversation = useMemo(() => 
    conversations.find(c => c.userId === selectedUser), 
    [conversations, selectedUser]
  );

  // Initialize chat
  useEffect(() => {
    initializeChat();
    return cleanup;
  }, []);

  // Handle conversation selection
  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser);
      markConversationAsRead(selectedUser);
      setupTypingListener(selectedUser);
    }
  }, [selectedUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await MessagingService.getChatSettings(currentUserId);
        if (settings) {
          setChatSettings(settings);
        }
      } catch (error) {
        console.error('Error loading chat settings:', error);
      }
    };
    loadSettings();
  }, [currentUserId]);

  // Initialize chat system
  const initializeChat = async () => {
    try {
      setLoading(true);
      setError(null);

      // Setup real-time listeners
      setupConversationListener();
    } catch (error) {
      console.error('Error initializing chat:', error);
      setError('Failed to initialize chat. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time conversation listener
  const setupConversationListener = () => {
    if (conversationListenerRef.current) {
      conversationListenerRef.current();
    }

    conversationListenerRef.current = MessagingService.subscribeToConversations(
      currentUserId,
      (conversations) => {
        setConversations(conversations);
      }
    );
  };

  // Load conversation messages
  const loadConversation = (otherUserId: string) => {
    // Clean up existing message listener
    if (messageListenerRef.current) {
      messageListenerRef.current();
    }

    // Setup real-time message listener
    messageListenerRef.current = MessagingService.subscribeToConversation(
      currentUserId,
      otherUserId,
      (messages) => {
        setMessages(messages);
      }
    );
  };

  // Setup typing indicator listener
  const setupTypingListener = (otherUserId: string) => {
    if (typingListenerRef.current) {
      typingListenerRef.current();
    }

    typingListenerRef.current = MessagingService.subscribeToTypingIndicators(
      currentUserId,
      (users) => {
        setTypingUsers(users.filter(user => user !== currentUserId));
      }
    );
  };

  // Mark conversation as read
  const markConversationAsRead = async (otherUserId: string) => {
    try {
      await MessagingService.markConversationAsRead(currentUserId, otherUserId);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  // Add reaction to message - memoized with useCallback
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      await MessagingService.addMessageReaction(messageId, currentUserId, currentUserName, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
      setError('Failed to add reaction. Please try again.');
    }
  }, [currentUserId, currentUserName]);

  // Create memoized reaction handlers to prevent re-renders
  const createReactionHandler = useCallback((messageId: string, emoji: string) => {
    return () => addReaction(messageId, emoji);
  }, [addReaction]);

  // Create stable reaction handlers map to prevent re-renders
  const reactionHandlersRef = useRef<Map<string, () => void>>(new Map());
  
  const getReactionHandler = useCallback((messageId: string, emoji: string) => {
    const key = `${messageId}-${emoji}`;
    if (!reactionHandlersRef.current.has(key)) {
      reactionHandlersRef.current.set(key, () => addReaction(messageId, emoji));
    }
    return reactionHandlersRef.current.get(key)!;
  }, [addReaction]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Utility functions
  const formatTime = (date: Date | undefined | null) => {
    // Handle undefined, null, or invalid dates
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
    if (conversationListenerRef.current) conversationListenerRef.current();
    if (messageListenerRef.current) messageListenerRef.current();
    if (typingListenerRef.current) typingListenerRef.current();
    MessagingService.cleanup();
  };

  // Search for users to start new chat
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search in users collection
      const usersQuery = firestoreQuery(
        collection(db, 'users'),
        where('displayName', '>=', query),
        where('displayName', '<=', query + '\uf8ff'),
        limit(10)
      );
      
      // Search in crewProfiles collection
      const crewQuery = firestoreQuery(
        collection(db, 'crewProfiles'),
        where('name', '>=', query),
        where('name', '<=', query + '\uf8ff'),
        limit(10)
      );

      const [usersSnapshot, crewSnapshot] = await Promise.all([
        getDocs(usersQuery),
        getDocs(crewQuery)
      ]);

      const results: Array<{
        id: string;
        name: string;
        avatar?: string;
        role?: string;
        company?: string;
        location?: string;
        type: 'user' | 'crew';
      }> = [];

      // Add users
      usersSnapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        if (doc.id !== currentUserId) { // Don't show current user
          results.push({
            id: doc.id,
            name: data.displayName || data.firstName || `User ${doc.id.slice(-4)}`,
            avatar: data.avatarUrl,
            role: data.role,
            company: data.company,
            location: data.location,
            type: 'user'
          });
        }
      });

      // Add crew members
      crewSnapshot.docs.forEach(doc => {
        const data = doc.data() as any;
        if (doc.id !== currentUserId) { // Don't show current user
          results.push({
            id: doc.id,
            name: data.name || data.firstName || `Crew ${doc.id.slice(-4)}`,
            avatar: data.avatarUrl,
            role: data.role,
            company: data.company,
            location: data.location,
            type: 'crew'
          });
        }
      });

      // Remove duplicates and limit results
      const uniqueResults = results.filter((result, index, self) => 
        index === self.findIndex(r => r.id === result.id)
      ).slice(0, 10);

      setSearchResults(uniqueResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Start new conversation
  const startNewConversation = async (userId: string, userName: string) => {
    setSelectedUser(userId);
    setShowNewChat(false);
    setNewChatSearchQuery('');
    setSearchResults([]);
    
    // MessageInput component will handle its own focus
  };

  // Handle new chat search input
  const handleNewChatSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setNewChatSearchQuery(query);
    
    // Debounce search
    if (query.trim()) {
      setTimeout(() => searchUsers(query), 300);
    } else {
      setSearchResults([]);
    }
  };

  // Helper to get user info for conversations/messages
  const getUserInfo = (userId: string) => {
    // Try to find in conversations (from Firestore)
    const conv = conversations.find(c => c.userId === userId);
    if (conv && conv.userName && conv.userAvatar) {
      return { name: conv.userName, avatar: conv.userAvatar };
    }
    // Try demo users
    if (demoUsers[userId]) {
      return { name: demoUsers[userId].displayName, avatar: demoUsers[userId].avatar };
    }
    // Fallback
    return { name: 'Unknown User', avatar: undefined };
  };

  // Send message function - memoized with useCallback
  const sendMessage = useCallback(async (messageContent: string) => {
    if (!selectedUser || sending) return;

    setSending(true);

    try {
      // Optimistically add message to UI
      const optimisticMessage: DirectMessage = {
        id: `temp_${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedUser,
        content: messageContent,
        timestamp: new Date(),
        isRead: false,
        messageType: 'text',
        status: 'sending'
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Send actual message
      await MessagingService.sendDirectMessage(currentUserId, selectedUser, messageContent);
      
      // Update optimistic message status
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...msg, status: 'sent' as any }
          : msg
      ));

      // Stop typing indicator
      MessagingService.setTypingStatus(currentUserId, selectedUser, false);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== `temp_${Date.now()}`));
    } finally {
      setSending(false);
    }
  }, [selectedUser, sending, currentUserId]);

  // Set up MessageInput communication - moved after sendMessage is defined
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.setCurrentUser(currentUserId);
      messageInputRef.current.setSendCallback(sendMessage);
    }
  }, [currentUserId, sendMessage]);

  // Update MessageInput when selectedUser changes
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.setSelectedUser(selectedUser);
    }
  }, [selectedUser]);

  // Update MessageInput sending state
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.setSendingState(sending);
    }
  }, [sending]);

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
                        <div className="flex-shrink-0">
                          <span className="text-xs text-blue-600">💬</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {newChatSearchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="text-xs text-gray-500 text-center py-2">
                    No users found. Try a different search term.
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Find users by name, role, or company
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Chat Settings */}
          {showSettings && (
            <div className="settings-panel">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Chat Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Allow messages from:</label>
                  <select
                    value={chatSettings?.allowMessagesFrom || 'everyone'}
                    onChange={(e) => {
                      const newSettings: ChatSettings = { 
                        userId: currentUserId,
                        allowMessagesFrom: e.target.value as 'followers' | 'everyone' | 'none',
                        showOnlineStatus: chatSettings?.showOnlineStatus ?? true,
                        showLastSeen: chatSettings?.showLastSeen ?? true,
                        autoReply: chatSettings?.autoReply || '',
                        isAway: chatSettings?.isAway ?? false,
                        awayMessage: chatSettings?.awayMessage || ''
                      };
                      setChatSettings(newSettings);
                      MessagingService.updateChatSettings(currentUserId, newSettings);
                    }}
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="followers">Followers Only</option>
                    <option value="none">No One</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showOnline"
                    checked={chatSettings?.showOnlineStatus || false}
                    onChange={(e) => {
                      const newSettings: ChatSettings = { 
                        userId: currentUserId,
                        allowMessagesFrom: chatSettings?.allowMessagesFrom || 'everyone',
                        showOnlineStatus: e.target.checked,
                        showLastSeen: chatSettings?.showLastSeen ?? true,
                        autoReply: chatSettings?.autoReply || '',
                        isAway: chatSettings?.isAway ?? false,
                        awayMessage: chatSettings?.awayMessage || ''
                      };
                      setChatSettings(newSettings);
                      MessagingService.updateChatSettings(currentUserId, newSettings);
                    }}
                  />
                  <label htmlFor="showOnline" className="text-xs text-gray-600">Show online status</label>
                </div>
              </div>
            </div>
          )}

          {/* Conversations List */}
          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="empty-state">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm text-gray-500">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
                <p className="text-xs text-gray-400">
                  {searchQuery ? 'Try a different search term' : 'Start messaging your connections'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const { name, avatar } = getUserInfo(conversation.userId);
                return (
                  <div
                    key={conversation.userId}
                    className={`conversation-item ${selectedUser === conversation.userId ? 'active' : ''}`}
                  >
                    <div 
                      className="conversation-content"
                      onClick={() => setSelectedUser(conversation.userId)}
                    >
                      <div className="user-avatar">
                        {avatar ? (
                          <img 
                            src={avatar} 
                            alt={name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {conversation.isOnline && (
                          <div className="online-indicator"></div>
                        )}
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-header">
                          <h4 className="user-name">{name}</h4>
                          {conversation.lastMessageTime && (
                            <span className="message-time">{formatTime(conversation.lastMessageTime)}</span>
                          )}
                        </div>
                        <div className="conversation-preview">
                          {conversation.lastMessage && (
                            <p className="last-message">{conversation.lastMessage}</p>
                          )}
                          {conversation.unreadCount > 0 && (
                            <span className="unread-badge">{conversation.unreadCount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
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
              <span>{error}</span>
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="user-info">
                  {selectedUser ? (
                    <img 
                      src={selectedUser ? getUserInfo(selectedUser).avatar : ''} 
                      alt={selectedUser ? getUserInfo(selectedUser).name : ''}
                      className="w-8 h-8 rounded-full object-cover"
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
                      <p className="message-text">{message.content}</p>
                      <div className="message-meta">
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                        {message.senderId === currentUserId && (
                          <span className="message-status">
                            {message.status === 'sending' && '⏳'}
                            {message.status === 'sent' && '✓'}
                            {message.status === 'delivered' && '✓✓'}
                            {message.status === 'read' && '✓✓'}
                          </span>
                        )}
                      </div>
                      
                      {/* Message Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="message-reactions">
                          {['👍', '❤️', '😊', '🎉'].map((emoji) => {
                            const count = getReactionCount(message.reactions, emoji);
                            if (count === 0) return null;
                            
                            return (
                              <button
                                key={emoji}
                                onClick={getReactionHandler(message.id, emoji)}
                                className={`reaction-button ${hasUserReacted(message.reactions, emoji) ? 'reacted' : ''}`}
                              >
                                <span className="emoji">{emoji}</span>
                                <span className="count">{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Reaction Buttons */}
                    <div className="reaction-buttons">
                      {['👍', '❤️', '😊', '🎉'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={getReactionHandler(message.id, emoji)}
                          className="reaction-option"
                        >
                          {emoji}
                        </button>
                      ))}
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
              <MessageInput key="stable-message-input" ref={messageInputRef} />
            </>
          ) : (
            <div className="no-conversation">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-light text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a contact to start messaging</p>
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