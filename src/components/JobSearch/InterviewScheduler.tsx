import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobApplication, JobPosting } from '../../types/JobApplication';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import EmailNotificationService from '../../utilities/emailNotificationService';

interface InterviewSchedulerProps {
  applicationId: string;
  onInterviewScheduled?: (interviewData: any) => void;
}

interface InterviewData {
  date: string;
  time: string;
  duration: number;
  type: 'video' | 'phone' | 'in_person';
  location?: string;
  videoUrl?: string;
  notes: string;
  interviewerName: string;
  interviewerEmail: string;
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ 
  applicationId, 
  onInterviewScheduled 
}) => {
  const navigate = useNavigate();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [interviewData, setInterviewData] = useState<InterviewData>({
    date: '',
    time: '',
    duration: 60,
    type: 'video',
    location: '',
    videoUrl: '',
    notes: '',
    interviewerName: '',
    interviewerEmail: ''
  });

  useEffect(() => {
    if (applicationId) {
      loadApplicationDetails();
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
          } as JobPosting);
        }
      }
    } catch (error) {
      console.error('Error loading application details:', error);
      setError('Failed to load application details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof InterviewData, value: any) => {
    setInterviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!interviewData.date) {
      setError('Interview date is required');
      return false;
    }
    
    if (!interviewData.time) {
      setError('Interview time is required');
      return false;
    }
    
    if (!interviewData.interviewerName) {
      setError('Interviewer name is required');
      return false;
    }
    
    if (!interviewData.interviewerEmail) {
      setError('Interviewer email is required');
      return false;
    }
    
    if (interviewData.type === 'in_person' && !interviewData.location) {
      setError('Location is required for in-person interviews');
      return false;
    }
    
    if (interviewData.type === 'video' && !interviewData.videoUrl) {
      setError('Video URL is required for video interviews');
      return false;
    }
    
    return true;
  };

  const scheduleInterview = async () => {
    if (!validateForm() || !application) return;
    
    try {
      setIsScheduling(true);
      setError(null);
      
      // Create interview datetime
      const interviewDateTime = new Date(`${interviewData.date}T${interviewData.time}`);
      
      // Update application with interview details
      const applicationRef = doc(db, 'jobApplications', applicationId);
      await updateDoc(applicationRef, {
        status: 'interviewed',
        interviewScheduled: interviewDateTime,
        interviewNotes: interviewData.notes,
        lastUpdated: serverTimestamp()
      });
      
      // Create interview record
      const interviewRecord = {
        applicationId,
        jobId: application.jobId,
        applicantId: application.applicantId,
        interviewerName: interviewData.interviewerName,
        interviewerEmail: interviewData.interviewerEmail,
        scheduledAt: interviewDateTime,
        duration: interviewData.duration,
        type: interviewData.type,
        location: interviewData.location,
        videoUrl: interviewData.videoUrl,
        notes: interviewData.notes,
        status: 'scheduled',
        createdAt: serverTimestamp()
      };
      
      const interviewRef = await addDoc(collection(db, 'interviews'), interviewRecord);
      
      // Create notification for applicant
      await addDoc(collection(db, 'notifications'), {
        userId: application.applicantId,
        type: 'interview_scheduled',
        title: 'Interview Scheduled',
        message: `Your interview for ${job?.title} has been scheduled for ${interviewDateTime.toLocaleDateString()} at ${interviewDateTime.toLocaleTimeString()}`,
        isRead: false,
        createdAt: serverTimestamp(),
        actionUrl: `/applications/${applicationId}`,
        interviewId: interviewRef.id
      });

      // Send email notification
      await EmailNotificationService.sendInterviewScheduledEmail(
        application.applicantId, 
        job?.title || 'Unknown Job', 
        interviewDateTime.toLocaleDateString(), 
        interviewDateTime.toLocaleTimeString()
      );
      
      console.log('Interview scheduled successfully:', interviewRef.id);
      
      // Call callback if provided
      if (onInterviewScheduled) {
        onInterviewScheduled(interviewRecord);
      }
      
      // Show success message
      setError(null);
      
    } catch (error) {
      console.error('Error scheduling interview:', error);
      setError('Failed to schedule interview. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const getSuggestedTimes = () => {
    const times = [];
    for (let hour = 9; hour <= 17; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application || !job) {
    return (
      <div className="text-center p-8">
        <div className="text-4xl mb-4 opacity-20">❌</div>
        <p className="text-gray-600">Application not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900 mb-2">Schedule Interview</h2>
        <p className="text-gray-600">
          Schedule an interview for {job.title} • {job.department}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interview Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Date *
            </label>
            <input
              type="date"
              value={interviewData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Time *
            </label>
            <select
              value={interviewData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
            >
              <option value="">Select time</option>
              {getSuggestedTimes().map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <select
              value={interviewData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Type *
            </label>
            <select
              value={interviewData.type}
              onChange={(e) => handleInputChange('type', e.target.value as 'video' | 'phone' | 'in_person')}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
            >
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="in_person">In Person</option>
            </select>
          </div>
        </div>

        {/* Interviewer & Location Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interviewer Name *
            </label>
            <input
              type="text"
              value={interviewData.interviewerName}
              onChange={(e) => handleInputChange('interviewerName', e.target.value)}
              placeholder="Enter interviewer name"
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interviewer Email *
            </label>
            <input
              type="email"
              value={interviewData.interviewerEmail}
              onChange={(e) => handleInputChange('interviewerEmail', e.target.value)}
              placeholder="interviewer@company.com"
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
            />
          </div>

          {interviewData.type === 'in_person' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={interviewData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter interview location"
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
              />
            </div>
          )}

          {interviewData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL *
              </label>
              <input
                type="url"
                value={interviewData.videoUrl}
                onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interview Notes
        </label>
        <textarea
          value={interviewData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any additional notes or instructions for the interview..."
          rows={4}
          className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() => navigate(`/applications/${applicationId}`)}
          className="px-6 py-3 text-gray-600 hover:text-gray-900 font-light transition-colors"
        >
          Cancel
        </button>
        
        <button
          onClick={scheduleInterview}
          disabled={isScheduling}
          className="px-8 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScheduling ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Scheduling...
            </span>
          ) : (
            'Schedule Interview'
          )}
        </button>
      </div>
    </div>
  );
};

export default InterviewScheduler; 