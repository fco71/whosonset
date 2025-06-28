import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { performanceMonitor } from '../../utilities/performanceUtils';
import './AdvancedMessaging.scss';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  reactions: { [key: string]: string[] }; // emoji: userId[]
  isEdited: boolean;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  attachments?: {
    type: 'image' | 'file' | 'link';
    url: string;
    name?: string;
    size?: number;
  }[];
}

interface AdvancedMessagingProps {
  currentUserId: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export const AdvancedMessaging: React.FC<AdvancedMessagingProps> = ({
  currentUserId,
  recipientId,
  recipientName,
  recipientAvatar
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        performanceMonitor.start('loadMessages');
        setLoading(true);
        setError(null);

        // Create a unique conversation ID
        const conversationId = [currentUserId, recipientId].sort().join('_');
        
        const messagesQuery = query(
          collection(db, `conversations/${conversationId}/messages`),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          try {
            const loadedMessages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate() || new Date()
            })) as Message[];
            
            setMessages(loadedMessages.reverse());
            performanceMonitor.end('loadMessages');
          } catch (err) {
            console.error('Error processing messages snapshot:', err);
            setError('Failed to load messages');
          } finally {
            setLoading(false);
          }
        }, (err) => {
          console.error('Messages listener error:', err);
          setError('Failed to load messages');
          setLoading(false);
        });

        return unsubscribe;
      } catch (err) {
        console.error('Error setting up messages listener:', err);
        setError('Failed to load messages');
        setLoading(false);
      }
    };

    loadMessages();
  }, [currentUserId, recipientId]);

  // Typing indicator
  const handleTyping = useCallback(() => {
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() && !replyTo) return;

    try {
      performanceMonitor.start('sendMessage');
      
      const conversationId = [currentUserId, recipientId].sort().join('_');
      
      const messageData = {
        senderId: currentUserId,
        senderName: 'Current User', // This would come from user profile
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
        reactions: {},
        isEdited: false,
        replyTo: replyTo ? {
          messageId: replyTo.id,
          content: replyTo.content,
          senderName: replyTo.senderName
        } : undefined
      };

      await addDoc(collection(db, `conversations/${conversationId}/messages`), messageData);
      
      setNewMessage('');
      setReplyTo(null);
      performanceMonitor.end('sendMessage');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Add reaction
  const addReaction = async (messageId: string, emoji: string) => {
    try {
      const conversationId = [currentUserId, recipientId].sort().join('_');
      const messageRef = doc(db, `conversations/${conversationId}/messages`, messageId);
      
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const updatedReactions = { ...message.reactions };
      if (!updatedReactions[emoji]) {
        updatedReactions[emoji] = [];
      }

      const userIndex = updatedReactions[emoji].indexOf(currentUserId);
      if (userIndex > -1) {
        updatedReactions[emoji].splice(userIndex, 1);
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji];
        }
      } else {
        updatedReactions[emoji].push(currentUserId);
      }

      await updateDoc(messageRef, { reactions: updatedReactions });
      setShowReactions(null);
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real implementation, you would upload the file to Firebase Storage
    console.log('File selected:', file.name);
    
    // For now, just add a placeholder message
    setNewMessage(`📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
  };

  // Handle key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="advanced-messaging">
        <div className="messaging-header">
          <div className="recipient-info">
            <div className="avatar">
              {recipientAvatar ? (
                <img src={recipientAvatar} alt={recipientName} />
              ) : (
                <div className="avatar-placeholder">{recipientName[0]}</div>
              )}
              <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></div>
            </div>
            <div className="recipient-details">
              <h3>{recipientName}</h3>
              <span className="status">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
        <div className="messages-container">
          <div className="loading-messages">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="advanced-messaging">
      <div className="messaging-header">
        <div className="recipient-info">
          <div className="avatar">
            {recipientAvatar ? (
              <img src={recipientAvatar} alt={recipientName} />
            ) : (
              <div className="avatar-placeholder">{recipientName[0]}</div>
            )}
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></div>
          </div>
          <div className="recipient-details">
            <h3>{recipientName}</h3>
            <span className="status">
              {typingUsers.length > 0 ? 'typing...' : isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="action-btn" title="Voice Call">
            📞
          </button>
          <button className="action-btn" title="Video Call">
            📹
          </button>
          <button className="action-btn" title="More Options">
            ⋯
          </button>
        </div>
      </div>

      <div className="messages-container">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <div className="messages-list">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.senderId === currentUserId ? 'sent' : 'received'}`}
            >
              {message.replyTo && (
                <div className="reply-preview">
                  <span className="reply-label">Replying to {message.replyTo.senderName}</span>
                  <span className="reply-content">{message.replyTo.content}</span>
                </div>
              )}
              
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="attachments">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="attachment">
                          {attachment.type === 'image' ? (
                            <img src={attachment.url} alt={attachment.name} />
                          ) : (
                            <div className="file-attachment">
                              <span className="file-icon">📎</span>
                              <span className="file-name">{attachment.name}</span>
                              <span className="file-size">{attachment.size} KB</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="message-meta">
                  <span className="timestamp">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.isEdited && <span className="edited">(edited)</span>}
                  
                  <button
                    className="reaction-btn"
                    onClick={() => setShowReactions(showReactions === message.id ? null : message.id)}
                  >
                    😊
                  </button>
                </div>

                {showReactions === message.id && (
                  <div className="reactions-panel">
                    {REACTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        className="reaction-option"
                        onClick={() => addReaction(message.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {Object.keys(message.reactions).length > 0 && (
                  <div className="message-reactions">
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        className="reaction-badge"
                        onClick={() => addReaction(message.id, emoji)}
                      >
                        {emoji} {users.length}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="message-input-container">
        {replyTo && (
          <div className="reply-indicator">
            <span>Replying to {replyTo.senderName}</span>
            <button onClick={() => setReplyTo(null)}>✕</button>
          </div>
        )}
        
        <div className="input-actions">
          <button
            className="action-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Attach File"
          >
            📎
          </button>
          <button className="action-btn" title="Emoji">
            😊
          </button>
        </div>

        <div className="message-input-wrapper">
          <textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="message-input"
          />
        </div>

        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={!newMessage.trim() && !replyTo}
        >
          ➤
        </button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </div>
  );
}; 