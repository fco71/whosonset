import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, where, enableNetwork, disableNetwork } from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../../firebase';
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const departments = [
    'Camera', 'Sound', 'Lighting', 'Art', 'Costume', 'Makeup', 'Hair', 
    'Production', 'Directing', 'Editing', 'VFX', 'Stunts', 'Transport'
  ];

  // Initialize Firestore connection
  useEffect(() => {
    let unsubscribeRooms: (() => void) | undefined;
    let unsubscribeCallouts: (() => void) | undefined;
    const listenerId = Math.random().toString(36).substr(2, 9);
    console.log(`[Chat] Setting up chatRooms and callouts listeners (id=${listenerId})`);

    const initializeFirestore = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await enableNetwork(db);
        // Set up listeners and store unsubscribe functions
        unsubscribeRooms = await loadChatRooms(listenerId);
        unsubscribeCallouts = await loadCallouts(listenerId);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing Firestore:', err);
        setError('Failed to connect to chat service. Please refresh the page.');
        setIsLoading(false);
      }
    };

    if (currentUserId) {
      initializeFirestore();
    }

    return () => {
      console.log(`[Chat] Cleaning up chatRooms and callouts listeners (id=${listenerId})`);
      if (unsubscribeRooms) unsubscribeRooms();
      if (unsubscribeCallouts) unsubscribeCallouts();
    };
  }, [currentUserId]);

  const loadChatRooms = async (listenerId?: string) => {
    try {
      const roomsQuery = query(
        collection(db, 'chatRooms'),
        where('participants', 'array-contains', currentUserId),
        orderBy('updatedAt', 'desc')
      );
      console.log(`[Chat] Setting up chatRooms onSnapshot (id=${listenerId})`);
      const unsubscribeRooms = onSnapshot(roomsQuery, 
        (snapshot) => {
          const roomsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ChatRoom[];
          setRooms(roomsData);
        },
        (error) => {
          console.error('Error loading chat rooms:', error);
          handleFirestoreError(error);
        }
      );
      return () => {
        console.log(`[Chat] Unsubscribing chatRooms onSnapshot (id=${listenerId})`);
        unsubscribeRooms();
      };
    } catch (error) {
      console.error('Error setting up chat rooms listener:', error);
      handleFirestoreError(error);
      return () => {};
    }
  };

  const loadCallouts = async (listenerId?: string) => {
    try {
      const calloutsQuery = query(
        collection(db, 'callouts'),
        orderBy('createdAt', 'desc')
      );
      console.log(`[Chat] Setting up callouts onSnapshot (id=${listenerId})`);
      const unsubscribeCallouts = onSnapshot(calloutsQuery, 
        (snapshot) => {
          const calloutsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ChatCallout[];
          setCallouts(calloutsData);
        },
        (error) => {
          console.error('Error loading callouts:', error);
          handleFirestoreError(error);
        }
      );
      return () => {
        console.log(`[Chat] Unsubscribing callouts onSnapshot (id=${listenerId})`);
        unsubscribeCallouts();
      };
    } catch (error) {
      console.error('Error setting up callouts listener:', error);
      handleFirestoreError(error);
      return () => {};
    }
  };

  useEffect(() => {
    if (currentRoom) {
      let unsubscribe: (() => void) | undefined;
      const listenerId = Math.random().toString(36).substr(2, 9);
      console.log(`[Chat] Setting up messages listener for room ${currentRoom.id} (id=${listenerId})`);
      const loadMessages = async () => {
        try {
          const messagesQuery = query(
            collection(db, `chatRooms/${currentRoom.id}/messages`),
            orderBy('timestamp', 'asc')
          );
          unsubscribe = onSnapshot(messagesQuery, 
            (snapshot) => {
              const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as ChatMessage[];
              setMessages(messagesData);
            },
            (error) => {
              console.error('Error loading messages:', error);
              handleFirestoreError(error);
            }
          );
        } catch (error) {
          console.error('Error setting up messages listener:', error);
          handleFirestoreError(error);
        }
      };
      loadMessages();
      return () => {
        console.log(`[Chat] Cleaning up messages listener for room ${currentRoom.id} (id=${listenerId})`);
        if (unsubscribe) unsubscribe();
      };
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
      chatRoomId: currentRoom.id,
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date(),
      messageType: 'text',
      isRead: false
    };

    try {
      await addDoc(collection(db, `chatRooms/${currentRoom.id}/messages`), messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      handleFirestoreError(error);
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
      handleFirestoreError(error);
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
      handleFirestoreError(error);
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

  if (isLoading) {
    return (
      <div className="chat-interface">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Connecting to chat service...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-interface">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Connection Error</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="p-8 text-center">
        <h2 className="text-2xl font-light text-gray-900 mb-4">Chat Interface</h2>
        <p className="text-gray-600 mb-4">
          Chat interface is temporarily disabled while we focus on testing the social system.
        </p>
        <p className="text-sm text-gray-500">
          Please test the social features at <a href="/social" className="text-blue-600 hover:underline">/social</a>
        </p>
      </div>
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