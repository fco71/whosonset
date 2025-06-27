import React, { useState, useEffect, useRef } from 'react';
import { MessagingService } from '../../utilities/messagingService';
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
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [conversations, setConversations] = useState<{ userId: string; userName: string; lastMessage?: string; unreadCount: number }[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSettings, setChatSettings] = useState<ChatSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadConversations();
    loadChatSettings();
  }, [currentUserId]);

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser);
      markConversationAsRead(selectedUser);
      setupTypingListener(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const participants = await MessagingService.getConversationParticipants(currentUserId);
      
      const conversationData = await Promise.all(
        participants.map(async (userId) => {
          const messages = await MessagingService.getDirectMessages(currentUserId, userId, 1);
          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
          const unreadCount = await getUnreadCount(userId);
          
          // Get user name (you might want to fetch from user profiles)
          const userName = `User ${userId.slice(-4)}`; // Placeholder
          
          return {
            userId,
            userName,
            lastMessage: lastMessage?.content,
            unreadCount
          };
        })
      );
      
      setConversations(conversationData);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      const messageList = await MessagingService.getDirectMessages(currentUserId, otherUserId);
      setMessages(messageList);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadChatSettings = async () => {
    try {
      const settings = await MessagingService.getChatSettings(currentUserId);
      setChatSettings(settings);
    } catch (error) {
      console.error('Error loading chat settings:', error);
    }
  };

  const getUnreadCount = async (otherUserId: string): Promise<number> => {
    try {
      const messages = await MessagingService.getDirectMessages(currentUserId, otherUserId);
      return messages.filter(msg => !msg.isRead && msg.senderId === otherUserId).length;
    } catch (error) {
      return 0;
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return;

    try {
      setLoading(true);
      await MessagingService.sendDirectMessage(currentUserId, selectedUser, messageText.trim());
      setMessageText('');
      setIsTyping(false);
      MessagingService.setTypingStatus(currentUserId, selectedUser, false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markConversationAsRead = async (otherUserId: string) => {
    try {
      await MessagingService.markConversationAsRead(currentUserId, otherUserId);
      // Refresh conversations to update unread counts
      loadConversations();
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const setupTypingListener = (otherUserId: string) => {
    const unsubscribe = MessagingService.subscribeToTypingIndicators(currentUserId, (users) => {
      setTypingUsers(users.filter(user => user !== currentUserId));
    });

    return unsubscribe;
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      MessagingService.setTypingStatus(currentUserId, selectedUser!, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      MessagingService.setTypingStatus(currentUserId, selectedUser!, false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addReaction = async (messageId: string, emoji: string) => {
    try {
      await MessagingService.addMessageReaction(messageId, currentUserId, currentUserName, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getReactionCount = (reactions: MessageReaction[] = [], emoji: string) => {
    return reactions.filter(r => r.emoji === emoji).length;
  };

  const hasUserReacted = (reactions: MessageReaction[] = [], emoji: string) => {
    return reactions.some(r => r.userId === currentUserId && r.emoji === emoji);
  };

  return (
    <div className="chat-interface">
      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h2 className="text-xl font-light text-gray-900 tracking-wide">Messages</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-500 hover:text-gray-700"
            >
              ⚙️
            </button>
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
            {loading ? (
              <div className="loading-skeleton">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="conversation-skeleton">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm text-gray-500">No conversations yet</p>
                <p className="text-xs text-gray-400">Start messaging your connections</p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.userId}
                  onClick={() => setSelectedUser(conversation.userId)}
                  className={`conversation-item ${selectedUser === conversation.userId ? 'active' : ''}`}
                >
                  <div className="user-avatar">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {conversation.userName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <h4 className="user-name">{conversation.userName}</h4>
                      {conversation.unreadCount > 0 && (
                        <span className="unread-badge">{conversation.unreadCount}</span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="last-message">{conversation.lastMessage}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="user-info">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {conversations.find(c => c.userId === selectedUser)?.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="user-name">
                      {conversations.find(c => c.userId === selectedUser)?.userName}
                    </h3>
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
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                      
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
                  type="text"
                  value={messageText}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={loading}
                  className="message-input-field"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim() || loading}
                  className="send-button"
                >
                  {loading ? 'Sending...' : 'Send'}
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