import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MessagingService, ConversationSummary } from '../../utilities/messagingService';
import { DirectMessage, ChatSettings, MessageReaction } from '../../types/Chat';
import { SocialService } from '../../utilities/socialService';
import './ChatInterface.scss';

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentUserId, 
  currentUserName,
  currentUserAvatar 
}) => {
  // State
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const conversationListenerRef = useRef<(() => void) | null>(null);
  const messageListenerRef = useRef<(() => void) | null>(null);
  const typingListenerRef = useRef<(() => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    return () => cleanup();
  }, [currentUserId]);

  // Handle conversation selection
  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser);
      markConversationAsRead(selectedUser);
      setupTypingListener(selectedUser);
      focusInput();
    }
  }, [selectedUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat system
  const initializeChat = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load chat settings
      const settings = await MessagingService.getChatSettings(currentUserId);
      setChatSettings(settings);

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

  // Send message
  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser || sending) return;

    const messageContent = messageText.trim();
    setMessageText('');
    setIsTyping(false);
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
  };

  // Handle typing
  const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    if (!isTyping && selectedUser) {
      setIsTyping(true);
      MessagingService.setTypingStatus(currentUserId, selectedUser, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (selectedUser) {
        MessagingService.setTypingStatus(currentUserId, selectedUser, false);
      }
    }, 2000);
  }, [isTyping, selectedUser, currentUserId]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Mark conversation as read
  const markConversationAsRead = async (otherUserId: string) => {
    try {
      await MessagingService.markConversationAsRead(currentUserId, otherUserId);
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  // Add reaction to message
  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await MessagingService.addMessageReaction(messageId, currentUserId, currentUserName, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
      setError('Failed to add reaction. Please try again.');
    }
  };

  // Utility functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const focusInput = () => {
    setTimeout(() => inputRef.current?.focus(), 100);
  };

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
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    MessagingService.cleanup();
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
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2 className="text-xl font-light text-gray-900 tracking-wide">Messages</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="settings-button"
              title="Chat Settings"
            >
              ⚙️
            </button>
          </div>

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
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  onClick={() => setSelectedUser(conversation.userId)}
                  className={`conversation-item ${selectedUser === conversation.userId ? 'active' : ''}`}
                >
                  <div className="user-avatar">
                    {conversation.userAvatar ? (
                      <img 
                        src={conversation.userAvatar} 
                        alt={conversation.userName}
                        className="w-10 h-10 rounded-full object-cover"
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
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h4 className="user-name">{conversation.userName}</h4>
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
              ))
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
                  {selectedConversation?.userAvatar ? (
                    <img 
                      src={selectedConversation.userAvatar} 
                      alt={selectedConversation.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {selectedConversation?.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="user-name">{selectedConversation?.userName}</h3>
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
                                onClick={() => addReaction(message.id, emoji)}
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
                          onClick={() => addReaction(message.id, emoji)}
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
              <div className="message-input">
                <input
                  ref={inputRef}
                  type="text"
                  value={messageText}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="message-input-field"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim() || sending}
                  className="send-button"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
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
    </div>
  );
};

export default ChatInterface; 