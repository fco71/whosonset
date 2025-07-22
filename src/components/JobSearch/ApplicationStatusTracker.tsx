import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { JobApplication } from '../../types/JobApplication';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import Card, { CardHeader, CardBody, CardTitle } from '../ui/Card';
import { MessageSquare, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ApplicationStatusTrackerProps {
  applicationId: string;
}

const ApplicationStatusTracker: React.FC<ApplicationStatusTrackerProps> = ({ applicationId }) => {
  const navigate = useNavigate();
  const { applicationId: urlApplicationId } = useParams<{ applicationId: string }>();
  const { currentUser } = useAuth();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<any | null>(null); // Changed to any for now as JobPosting type is removed
  const [messages, setMessages] = useState<any[]>([]); // Changed to any for now
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (applicationId) {
      loadApplicationDetails();
      subscribeToMessages();
    }
  }, [applicationId]);

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
          } as any); // Changed to any for now
        }
      }
    } catch (error) {
      console.error('Error loading application details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const messagesQuery = collection(db, 'jobApplications', applicationId, 'messages');
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[]; // Changed to any for now
      setMessages(messagesData.sort((a, b) => 
        (a.timestamp?.toDate?.() || new Date(a.timestamp)).getTime() - 
        (b.timestamp?.toDate?.() || new Date(b.timestamp)).getTime()
      ));
    });

    return unsubscribe;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !application || !currentUser) return;

    try {
      setIsSendingMessage(true);
      
      const messageData = {
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email || 'Unknown User',
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        applicationId: applicationId
      };

      // Add message to the messages subcollection
      await addDoc(collection(db, 'jobApplications', applicationId, 'messages'), messageData);
      
      setNewMessage('');
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getStatusTimeline = () => {
    if (!application) return [];

    const timeline = [
      {
        status: 'Application Submitted',
        date: application.appliedAt,
        icon: '📝',
        color: 'bg-blue-500',
        completed: true
      }
    ];

    if (application.reviewedAt) {
      timeline.push({
        status: 'Application Reviewed',
        date: application.reviewedAt,
        icon: '👁️',
        color: 'bg-green-500',
        completed: true
      });
    }

    if (application.status === 'shortlisted') {
      timeline.push({
        status: 'Shortlisted',
        date: application.lastUpdated,
        icon: '⭐',
        color: 'bg-yellow-500',
        completed: true
      });
    }

    if (application.status === 'interviewed') {
      timeline.push({
        status: 'Interview Scheduled',
        date: application.interviewScheduled,
        icon: '📅',
        color: 'bg-purple-500',
        completed: true
      });
    }

    if (application.status === 'hired') {
      timeline.push({
        status: 'Hired',
        date: application.lastUpdated,
        icon: '✅',
        color: 'bg-green-600',
        completed: true
      });
    }

    if (application.status === 'rejected') {
      timeline.push({
        status: 'Application Rejected',
        date: application.lastUpdated,
        icon: '❌',
        color: 'bg-red-500',
        completed: true
      });
    }

    return timeline;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-green-100 text-green-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-light text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">❌</div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/applications')}
            className="px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const timeline = getStatusTimeline();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/applications')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            ← Back to Applications
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Application Status
              </h1>
              <p className="text-gray-600">
                {job.title} • {job.department}
              </p>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-light text-gray-900 mb-6">Application Timeline</h2>
              
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1`}>
                      {item.icon}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.status}</h3>
                      <p className="text-gray-600">{formatDate(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-light text-gray-900 mb-6">Messages</h2>
              
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4 opacity-20">💬</div>
                  <p className="text-gray-600">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {message.senderName.charAt(0)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{message.senderName}</span>
                          <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                        </div>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Send Message */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={isSendingMessage || !newMessage.trim()}
                  className="px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingMessage ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Summary</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Application ID</span>
                  <p className="text-gray-900 font-mono text-sm">{application.id.slice(-8)}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Submitted</span>
                  <p className="text-gray-900">{formatDate(application.appliedAt)}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Last Updated</span>
                  <p className="text-gray-900">{formatDate(application.lastUpdated)}</p>
                </div>
                
                {application.expectedSalary && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expected Salary</span>
                    <p className="text-gray-900">${application.expectedSalary.toLocaleString()}</p>
                  </div>
                )}
                
                {application.availabilityDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Available From</span>
                    <p className="text-gray-900">{application.availabilityDate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Position</span>
                  <p className="text-gray-900">{job.title}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Department</span>
                  <p className="text-gray-900">{job.department}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Location</span>
                  <p className="text-gray-900">{job.location}</p>
                </div>
                
                {job.salary && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Salary Range</span>
                    <p className="text-gray-900">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="w-full px-4 py-2 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Job Posting
                </button>
                
                <button
                  onClick={() => navigate('/applications')}
                  className="w-full px-4 py-2 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors"
                >
                  All Applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatusTracker; 