import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { ChatMessage, ChatRoom, ChatAttachment } from '../../types/Chat';
import { User } from '../../models/User';
import './ChatInterface.scss';

interface ChatInterfaceProps {
  selectedRoom?: ChatRoom;
  onRoomSelect: (room: ChatRoom) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedRoom, onRoomSelect }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    // Load user's chat rooms
    const roomsQuery = query(
      collection(db, 'chatRooms'),
      orderBy('lastActivity', 'desc')
    );

    const unsubscribeRooms = onSnapshot(roomsQuery, (snapshot) => {
      const userRooms = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as ChatRoom))
        .filter(room => room.participants.includes(currentUser.uid));
      setRooms(userRooms);
    });

    return () => unsubscribeRooms();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedRoom) return;

    // Load messages for selected room
    const messagesQuery = query(
      collection(db, `chatRooms/${selectedRoom.id}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const roomMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChatMessage));
      setMessages(roomMessages);
    });

    return () => unsubscribeMessages();
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!currentUser || !selectedRoom || !newMessage.trim()) return;

    setIsLoading(true);

    try {
      const messageData: Omit<ChatMessage, 'id'> = {
        senderId: currentUser.uid,
        receiverId: selectedRoom.participants.find(p => p !== currentUser.uid) || '',
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
        isRead: false,
        messageType: 'text'
      };

      await addDoc(collection(db, `chatRooms/${selectedRoom.id}/messages`), messageData);

      // Update room's last activity
      await updateDoc(doc(db, 'chatRooms', selectedRoom.id), {
        lastActivity: serverTimestamp(),
        lastMessage: messageData
      });

      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = (room: ChatRoom) => {
    if (!currentUser) return '';
    return room.participants.find(p => p !== currentUser.uid) || '';
  };

  if (!currentUser) {
    return <div className="chat-interface">Please log in to use chat.</div>;
  }

  return (
    <div className="chat-interface">
      <div className="chat-sidebar">
        <div className="chat-header">
          <h3>Messages</h3>
          <button className="new-chat-btn">+</button>
        </div>
        
        <div className="chat-rooms">
          {rooms.map(room => (
            <div
              key={room.id}
              className={`chat-room ${selectedRoom?.id === room.id ? 'active' : ''}`}
              onClick={() => onRoomSelect(room)}
            >
              <div className="room-avatar">
                {room.isGroupChat ? (
                  <div className="group-avatar">{room.groupName?.[0]}</div>
                ) : (
                  <div className="user-avatar">{getOtherParticipant(room)[0]}</div>
                )}
              </div>
              <div className="room-info">
                <div className="room-name">
                  {room.isGroupChat ? room.groupName : getOtherParticipant(room)}
                </div>
                <div className="room-last-message">
                  {room.lastMessage?.content || 'No messages yet'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {selectedRoom ? (
          <>
            <div className="chat-header">
              <div className="chat-participant">
                {selectedRoom.isGroupChat ? selectedRoom.groupName : getOtherParticipant(selectedRoom)}
              </div>
            </div>

            <div className="chat-messages">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.senderId === currentUser.uid ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="message-attachments">
                        {message.attachments.map(attachment => (
                          <div key={attachment.id} className="attachment">
                            <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                              {attachment.fileName}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              {attachments.length > 0 && (
                <div className="attachments-preview">
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      <span>{file.name}</span>
                      <button onClick={() => removeAttachment(index)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="input-container">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-label">
                  📎
                </label>
                
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="message-input"
                  disabled={isLoading}
                />
                
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !newMessage.trim()}
                  className="send-button"
                >
                  {isLoading ? '...' : '→'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <h3>Select a conversation</h3>
              <p>Choose a chat room from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface; 