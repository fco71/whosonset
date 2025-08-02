import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, doc, onSnapshot, addDoc, updateDoc, serverTimestamp, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Users, MessageSquare, FileText, Calendar, Clock, Send, Paperclip, Video, Phone, MoreHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CollaborationMessage {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: any;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
}

interface CollaborationSession {
  id: string;
  projectId: string;
  title: string;
  participants: string[];
  activeUsers: string[];
  createdAt: any;
  lastActivity: any;
}

interface RealTimeCollaborationProps {
  projectId: string;
  projectTitle: string;
  onClose?: () => void;
}

const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({
  projectId,
  projectTitle,
  onClose
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<CollaborationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState<{[key: string]: boolean}>({});
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize or join collaboration session
  useEffect(() => {
    if (!currentUser || !projectId) return;

    const initializeSession = async () => {
      try {
        // Check if session exists
        const sessionQuery = query(
          collection(db, 'collaborationSessions'),
          where('projectId', '==', projectId)
        );

        const unsubscribe = onSnapshot(sessionQuery, (snapshot) => {
          if (!snapshot.empty) {
            const sessionData = snapshot.docs[0].data() as CollaborationSession;
            setSession({ ...sessionData, id: snapshot.docs[0].id });
            
            // Add current user to active users if not already there
            if (!sessionData.activeUsers.includes(currentUser.uid)) {
              updateDoc(doc(db, 'collaborationSessions', snapshot.docs[0].id), {
                activeUsers: [...sessionData.activeUsers, currentUser.uid],
                lastActivity: serverTimestamp()
              });
            }
          } else {
            // Create new session
            createNewSession();
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing collaboration session:', error);
        toast.error('Failed to join collaboration session');
      }
    };

    initializeSession();
  }, [currentUser, projectId]);

  const createNewSession = async () => {
    try {
      const sessionData = {
        projectId,
        title: projectTitle,
        participants: [currentUser!.uid],
        activeUsers: [currentUser!.uid],
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'collaborationSessions'), sessionData);
      setSession({ ...sessionData, id: docRef.id });
    } catch (error) {
      console.error('Error creating collaboration session:', error);
      toast.error('Failed to create collaboration session');
    }
  };

  // Listen to messages
  useEffect(() => {
    if (!session) return;

    const messagesQuery = query(
      collection(db, 'collaborationSessions', session.id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CollaborationMessage[];
      
      setMessages(newMessages);
    });

    return unsubscribe;
  }, [session]);

  // Listen to active users
  useEffect(() => {
    if (!session) return;

    const unsubscribe = onSnapshot(doc(db, 'collaborationSessions', session.id), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setActiveUsers(data.activeUsers || []);
      }
    });

    return unsubscribe;
  }, [session]);

  // Handle typing indicators
  useEffect(() => {
    if (!session || !currentUser) return;

    const typingRef = doc(db, 'collaborationSessions', session.id, 'typing', currentUser.uid);
    
    const handleTyping = () => {
      updateDoc(typingRef, {
        isTyping: true,
        timestamp: serverTimestamp()
      });

      // Clear typing indicator after 3 seconds
      setTimeout(() => {
        updateDoc(typingRef, {
          isTyping: false,
          timestamp: serverTimestamp()
        });
      }, 3000);
    };

    const input = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
    if (input) {
      input.addEventListener('input', handleTyping);
      return () => input.removeEventListener('input', handleTyping);
    }
  }, [session, currentUser]);

  // Listen to typing indicators
  useEffect(() => {
    if (!session) return;

    const unsubscribe = onSnapshot(
      collection(db, 'collaborationSessions', session.id, 'typing'),
      (snapshot) => {
        const typingUsers: {[key: string]: boolean} = {};
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.isTyping && data.timestamp) {
            const timeDiff = Date.now() - data.timestamp.toDate().getTime();
            if (timeDiff < 3000) {
              typingUsers[doc.id] = true;
            }
          }
        });
        setIsTyping(typingUsers);
      }
    );

    return unsubscribe;
  }, [session]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !session || !currentUser) return;

    try {
      await addDoc(collection(db, 'collaborationSessions', session.id, 'messages'), {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        timestamp: serverTimestamp(),
        type: 'text'
      });

      // Update session last activity
      await updateDoc(doc(db, 'collaborationSessions', session.id), {
        lastActivity: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !session || !currentUser) return;

    try {
      // In a real app, you would upload to Firebase Storage
      // For now, we'll simulate file upload
      const fileUrl = URL.createObjectURL(selectedFile);
      
      await addDoc(collection(db, 'collaborationSessions', session.id, 'messages'), {
        text: `Shared file: ${selectedFile.name}`,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        timestamp: serverTimestamp(),
        type: 'file',
        fileUrl,
        fileName: selectedFile.name
      });

      setSelectedFile(null);
      setShowFileUpload(false);
      toast.success('File shared successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTypingIndicator = () => {
    const typingUserIds = Object.keys(isTyping).filter(id => id !== currentUser?.uid);
    if (typingUserIds.length === 0) return null;

    return (
      <div className="text-sm text-gray-500 italic">
        {typingUserIds.length === 1 ? 'Someone is typing...' : 'Multiple people are typing...'}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{projectTitle}</h2>
            <p className="text-sm text-gray-500">
              {activeUsers.length} active user{activeUsers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === currentUser?.uid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.type === 'file' ? (
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    {message.fileName}
                  </a>
                </div>
              ) : (
                <p className="text-sm">{message.text}</p>
              )}
              <div className={`text-xs mt-1 ${
                message.senderId === currentUser?.uid ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.senderName} • {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {getTypingIndicator()}
        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Share File</h3>
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleFileUpload} disabled={!selectedFile}>
                Share
              </Button>
              <Button variant="outline" onClick={() => setShowFileUpload(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              name="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="resize-none"
              rows={2}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFileUpload(true)}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="flex-1"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeCollaboration; 