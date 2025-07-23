import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  getDocs,
  where
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { JobApplication } from '../../types/JobApplication';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Eye, 
  XCircle,
  Paperclip,
  Smile,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: any;
  applicationId: string;
  read: boolean;
}

interface ApplicationMessagingProps {
  applicationId: string;
  onClose?: () => void;
  isModal?: boolean;
}

const ApplicationMessaging: React.FC<ApplicationMessagingProps> = ({ 
  applicationId, 
  onClose, 
  isModal = false 
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<any>(null);
  const [applicantProfile, setApplicantProfile] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (applicationId) {
      loadApplicationDetails();
      subscribeToMessages();
    }
  }, [applicationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadApplicationDetails = async () => {
    try {
      setIsLoading(true);
      
      // Load application details
      const applicationDoc = await getDoc(doc(db, 'jobApplications', applicationId));
      if (applicationDoc.exists()) {
        const applicationData = {
          id: applicationDoc.id,
          ...applicationDoc.data()
        } as JobApplication;
        setApplication(applicationData);
        
        // Load job details
        const jobDoc = await getDoc(doc(db, 'jobPostings', applicationData.jobId));
        if (jobDoc.exists()) {
          setJob({
            id: jobDoc.id,
            ...jobDoc.data()
          });
        }

        // Load applicant profile
        try {
          const profileQuery = query(
            collection(db, 'crewProfiles'),
            where('uid', '==', applicationData.applicantId)
          );
          const profileSnapshot = await getDocs(profileQuery);
          
          if (!profileSnapshot.empty) {
            const profileData = profileSnapshot.docs[0].data();
            setApplicantProfile({
              uid: profileData.uid || applicationData.applicantId,
              name: profileData.name || 'Unknown Applicant',
              username: profileData.username || profileData.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
              bio: profileData.bio || '',
              jobTitles: profileData.jobTitles || [],
              experience: profileData.experience || 'Not specified',
              location: profileData.location || 'Not specified',
              skills: profileData.skills || [],
              availability: profileData.availability || 'Not specified',
              phone: profileData.phone,
              email: profileData.email
            });
          } else {
            setApplicantProfile({
              uid: applicationData.applicantId,
              name: 'Unknown Applicant',
              username: 'unknown',
              bio: 'Profile not available',
              jobTitles: [],
              experience: 'Not specified',
              location: 'Not specified',
              skills: [],
              availability: 'Not specified'
            });
          }
        } catch (error) {
          console.error('Error loading applicant profile:', error);
          setApplicantProfile({
            uid: applicationData.applicantId,
            name: 'Unknown Applicant',
            username: 'unknown',
            bio: 'Profile not available',
            jobTitles: [],
            experience: 'Not specified',
            location: 'Not specified',
            skills: [],
            availability: 'Not specified'
          });
        }
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      toast.error('Failed to load application details');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const messagesQuery = query(
      collection(db, 'jobApplications', applicationId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
    });

    return unsubscribe;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !application || !currentUser) return;

    // Defensive: ensure applicationId is a string and matches parent
    if (!applicationId || typeof applicationId !== 'string') {
      toast.error('Invalid application ID');
      console.error('Invalid applicationId:', applicationId);
      return;
    }
    if (!currentUser.uid) {
      toast.error('User not authenticated');
      console.error('No currentUser.uid');
      return;
    }
    // Check parent document existence
    try {
      const parentDoc = await getDoc(doc(db, 'jobApplications', applicationId));
      if (!parentDoc.exists()) {
        toast.error('Application does not exist. Cannot send message.');
        console.error('Parent jobApplications doc does not exist:', applicationId);
        return;
      }
    } catch (err) {
      toast.error('Error checking application existence');
      console.error('Error checking parent doc existence:', err);
      return;
    }

    const messageData = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email || 'Unknown User',
      message: newMessage.trim(),
      timestamp: serverTimestamp(),
      applicationId: applicationId,
      read: false
    };

    try {
      console.log('Attempting to send message:', messageData);
      await addDoc(collection(db, 'jobApplications', applicationId, 'messages'), messageData);
      setNewMessage('');
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error, '\nMessage data:', messageData, '\napplicationId:', applicationId, '\ncurrentUser:', currentUser);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleString();
  };

  const isCurrentUser = (senderId: string) => {
    return senderId === currentUser?.uid;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!application || !job) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4 opacity-20">❌</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Not Found</h2>
        <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/applications')}>
          Back to Applications
        </Button>
      </div>
    );
  }

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {applicantProfile?.name || 'Unknown Applicant'}
            </h3>
            <p className="text-sm text-gray-600">
              {job.title} • {job.department}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isModal && onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No messages yet</p>
            <p className="text-sm text-gray-500">Start a conversation about this application</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${isCurrentUser(message.senderId) ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isCurrentUser(message.senderId)
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <div className={`text-xs mb-1 ${
                    isCurrentUser(message.senderId) ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.senderName} • {formatDate(message.timestamp)}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(); }}
            disabled={isSendingMessage}
          />
          <Button 
            onClick={sendMessage} 
            disabled={isSendingMessage || !newMessage.trim()}
            className="px-4 py-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {content}
    </Card>
  );
};

export default ApplicationMessaging; 