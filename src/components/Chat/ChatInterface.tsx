import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { ChatMessage, ChatRoom, ChatCallout, ChatPresence } from '../../types/Chat';
import './ChatInterface.scss';

interface ChatInterfaceProps {
  currentUserId: string;
  currentUser: any;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUserId, currentUser }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [callouts, setCallouts] = useState<ChatCallout[]>([]);
  const [activeTab, setActiveTab] = useState<'chats' | 'callouts' | 'projects'>('chats');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [showCalloutForm, setShowCalloutForm] = useState(false);
  const [presence, setPresence] = useState<ChatPresence[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const departments = [
    'Camera', 'Sound', 'Lighting', 'Art', 'Costume', 'Makeup', 'Hair', 
    'Production', 'Directing', 'Editing', 'VFX', 'Stunts', 'Transport'
  ];

  useEffect(() => {
    // Load chat rooms
    const roomsQuery = query(
      collection(db, 'chatRooms'),
      where('participants', 'array-contains', currentUserId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribeRooms = onSnapshot(roomsQuery, (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatRoom[];
      setRooms(roomsData);
    });

    // Load callouts
    const calloutsQuery = query(
      collection(db, 'callouts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeCallouts = onSnapshot(calloutsQuery, (snapshot) => {
      const calloutsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatCallout[];
      setCallouts(calloutsData);
    });

    return () => {
      unsubscribeRooms();
      unsubscribeCallouts();
    };
  }, [currentUserId]);

  useEffect(() => {
    if (currentRoom) {
      const messagesQuery = query(
        collection(db, `chatRooms/${currentRoom.id}/messages`),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatMessage[];
        setMessages(messagesData);
      });

      return unsubscribe;
    }
  }, [currentRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentRoom) return;

    const messageData: Omit<ChatMessage, 'id'> = {
      senderId: currentUserId,
      senderName: currentUser.displayName || 'Unknown User',
      senderAvatar: currentUser.photoURL,
      content: newMessage,
      timestamp: new Date(),
      messageType: 'text',
      readBy: [currentUserId]
    };

    try {
      await addDoc(collection(db, `chatRooms/${currentRoom.id}/messages`), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const createCallout = async (calloutData: Partial<ChatCallout>) => {
    const newCallout: Omit<ChatCallout, 'id'> = {
      ...calloutData,
      requiredSkills: calloutData.requiredSkills ? 
        (Array.isArray(calloutData.requiredSkills) ? calloutData.requiredSkills : [calloutData.requiredSkills]) : 
        [],
      createdBy: currentUserId,
      createdAt: new Date(),
      responses: [],
      status: 'open'
    } as Omit<ChatCallout, 'id'>;

    try {
      await addDoc(collection(db, 'callouts'), newCallout);
      setShowCalloutForm(false);
    } catch (error) {
      console.error('Error creating callout:', error);
    }
  };

  const respondToCallout = async (calloutId: string, response: any) => {
    const calloutRef = doc(db, 'callouts', calloutId);
    const callout = callouts.find(c => c.id === calloutId);
    
    if (!callout) return;

    const newResponse = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUser.displayName || 'Unknown User',
      userAvatar: currentUser.photoURL,
      ...response,
      status: 'pending',
      timestamp: new Date()
    };

    const updatedResponses = [...callout.responses, newResponse];
    
    try {
      await updateDoc(calloutRef, { responses: updatedResponses });
    } catch (error) {
      console.error('Error responding to callout:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '#ff4444';
      case 'high': return '#ff8800';
      case 'medium': return '#ffbb33';
      case 'low': return '#00C851';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'away': return '🟡';
      case 'busy': return '🔴';
      case 'on-set': return '🎬';
      case 'in-meeting': return '💼';
      default: return '⚫';
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-sidebar">
        <div className="chat-tabs">
          <button 
            className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            💬 Chats
          </button>
          <button 
            className={`tab ${activeTab === 'callouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('callouts')}
          >
            📢 Callouts
          </button>
          <button 
            className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            🎬 Projects
          </button>
        </div>

        {activeTab === 'chats' && (
          <div className="chat-rooms">
            <div className="department-filter">
              <select 
                value={filterDepartment} 
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {rooms
              .filter(room => filterDepartment === 'all' || room.department === filterDepartment)
              .map(room => (
                <div 
                  key={room.id}
                  className={`chat-room ${currentRoom?.id === room.id ? 'active' : ''}`}
                  onClick={() => setCurrentRoom(room)}
                >
                  <div className="room-info">
                    <h4>{room.name}</h4>
                    <p>{room.type}</p>
                    {room.lastMessage && (
                      <p className="last-message">{room.lastMessage.content}</p>
                    )}
                  </div>
                  {room.unreadCount > 0 && (
                    <span className="unread-badge">{room.unreadCount}</span>
                  )}
                </div>
              ))}
          </div>
        )}

        {activeTab === 'callouts' && (
          <div className="callouts-list">
            <button 
              className="create-callout-btn"
              onClick={() => setShowCalloutForm(true)}
            >
              + New Callout
            </button>
            
            {callouts.map(callout => (
              <div key={callout.id} className="callout-item">
                <div className="callout-header">
                  <h4>{callout.title}</h4>
                  <span 
                    className="urgency-badge"
                    style={{ backgroundColor: getUrgencyColor(callout.urgency) }}
                  >
                    {callout.urgency}
                  </span>
                </div>
                <p>{callout.description}</p>
                <div className="callout-meta">
                  <span>{callout.department}</span>
                  <span>{callout.location}</span>
                  <span>{callout.responses.length} responses</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-list">
            {/* Project channels will be populated from user's projects */}
            <div className="project-channel">
              <h4>🎬 Production Hub</h4>
              <p>General production discussions</p>
            </div>
            <div className="project-channel">
              <h4>📹 Camera Department</h4>
              <p>Camera and cinematography</p>
            </div>
            <div className="project-channel">
              <h4>🎤 Sound Department</h4>
              <p>Audio and sound design</p>
            </div>
          </div>
        )}
      </div>

      <div className="chat-main">
        {currentRoom ? (
          <>
            <div className="chat-header">
              <div className="room-details">
                <h3>{currentRoom.name}</h3>
                <p>{currentRoom.type} • {currentRoom.participants.length} participants</p>
              </div>
              <div className="room-actions">
                <button className="action-btn">📞</button>
                <button className="action-btn">📹</button>
                <button className="action-btn">⚙️</button>
              </div>
            </div>

            <div className="messages-container">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.senderId === currentUserId ? 'own' : 'other'}`}
                >
                  <div className="message-avatar">
                    <img src={message.senderAvatar || '/default-avatar.png'} alt="" />
                    <span className="status-indicator">
                      {getStatusIcon('online')}
                    </span>
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="sender-name">{message.senderName}</span>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="message-text">{message.content}</div>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="message-attachments">
                        {message.attachments.map(attachment => (
                          <div key={attachment.id} className="attachment">
                            {attachment.type === 'image' && (
                              <img src={attachment.url} alt={attachment.name} />
                            )}
                            {attachment.type === 'document' && (
                              <div className="document-attachment">
                                📄 {attachment.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
              <div className="input-actions">
                <button className="action-btn">📎</button>
                <button className="action-btn">🎬</button>
                <button className="action-btn">📍</button>
                <button className="action-btn">📅</button>
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="message-input-field"
              />
              <button onClick={sendMessage} className="send-btn">
                ➤
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h2>🎬 Film Industry Chat</h2>
              <p>Connect with crew members, respond to callouts, and collaborate on projects</p>
              <div className="quick-actions">
                <button className="quick-action-btn">
                  📢 Browse Callouts
                </button>
                <button className="quick-action-btn">
                  👥 Find Crew
                </button>
                <button className="quick-action-btn">
                  🎬 Join Projects
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCalloutForm && (
        <div className="callout-modal">
          <div className="callout-form">
            <h3>Create New Callout</h3>
            <CalloutForm onSubmit={createCallout} onCancel={() => setShowCalloutForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

// Callout Form Component
const CalloutForm: React.FC<{
  onSubmit: (data: Partial<ChatCallout>) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'crew' as const,
    urgency: 'medium' as const,
    department: '',
    location: '',
    requiredSkills: '',
    budget: { min: 0, max: 0, currency: 'USD' }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      requiredSkills: formData.requiredSkills ? formData.requiredSkills.split(',').map(s => s.trim()) : []
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="callout-form-content">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value as any})}
          >
            <option value="crew">Crew</option>
            <option value="equipment">Equipment</option>
            <option value="location">Location</option>
            <option value="schedule">Schedule</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Urgency</label>
          <select
            value={formData.urgency}
            onChange={(e) => setFormData({...formData, urgency: e.target.value as any})}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
          >
            <option value="">Select Department</option>
            <option value="Camera">Camera</option>
            <option value="Sound">Sound</option>
            <option value="Lighting">Lighting</option>
            <option value="Art">Art</option>
            <option value="Costume">Costume</option>
            <option value="Makeup">Makeup</option>
            <option value="Hair">Hair</option>
            <option value="Production">Production</option>
            <option value="Directing">Directing</option>
            <option value="Editing">Editing</option>
            <option value="VFX">VFX</option>
            <option value="Stunts">Stunts</option>
            <option value="Transport">Transport</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Required Skills</label>
        <input
          type="text"
          value={formData.requiredSkills}
          onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
          placeholder="e.g., Steadicam, RED Camera, etc."
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Budget Min</label>
          <input
            type="number"
            value={formData.budget.min}
            onChange={(e) => setFormData({
              ...formData, 
              budget: {...formData.budget, min: parseInt(e.target.value)}
            })}
          />
        </div>
        
        <div className="form-group">
          <label>Budget Max</label>
          <input
            type="number"
            value={formData.budget.max}
            onChange={(e) => setFormData({
              ...formData, 
              budget: {...formData.budget, max: parseInt(e.target.value)}
            })}
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          Create Callout
        </button>
      </div>
    </form>
  );
};

export default ChatInterface; 