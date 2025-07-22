import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, writeBatch, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobApplication, JobPosting } from '../../types/JobApplication';
import Card, { CardHeader, CardBody, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star,
  Send,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BulkApplicationManagerProps {
  applications: JobApplication[];
  onApplicationsUpdated: () => void;
}

const BulkApplicationManager: React.FC<BulkApplicationManagerProps> = ({
  applications,
  onApplicationsUpdated
}) => {
  const { jobId } = useParams<{ jobId: string }>();
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'status' | 'message' | 'interview'>('status');
  const [isProcessing, setIsProcessing] = useState(false);
  const [job, setJob] = useState<JobPosting | null>(null);

  // Bulk action data
  const [newStatus, setNewStatus] = useState<string>('');
  const [bulkMessage, setBulkMessage] = useState<string>('');
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    duration: 60,
    type: 'video' as 'video' | 'phone' | 'in_person',
    notes: ''
  });

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const jobDoc = await getDoc(doc(db, 'jobPostings', jobId!));
      if (jobDoc.exists()) {
        setJob({
          id: jobDoc.id,
          ...jobDoc.data()
        } as JobPosting);
      }
    } catch (error) {
      console.error('Error loading job details:', error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(applications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, applicationId]);
    } else {
      setSelectedApplications(prev => prev.filter(id => id !== applicationId));
    }
  };

  const openBulkModal = (action: 'status' | 'message' | 'interview') => {
    if (selectedApplications.length === 0) {
      toast.error('Please select at least one application');
      return;
    }
    setBulkAction(action);
    setIsBulkModalOpen(true);
  };

  const executeBulkAction = async () => {
    if (selectedApplications.length === 0) {
      toast.error('No applications selected');
      return;
    }

    setIsProcessing(true);
    const batch = writeBatch(db);

    try {
      switch (bulkAction) {
        case 'status':
          await executeBulkStatusUpdate(batch);
          break;
        case 'message':
          await executeBulkMessage(batch);
          break;
        case 'interview':
          await executeBulkInterview(batch);
          break;
      }

      await batch.commit();
      
      toast.success(`Successfully processed ${selectedApplications.length} applications`);
      setSelectedApplications([]);
      setIsBulkModalOpen(false);
      onApplicationsUpdated();
    } catch (error) {
      console.error('Error executing bulk action:', error);
      toast.error('Failed to process applications');
    } finally {
      setIsProcessing(false);
    }
  };

  const executeBulkStatusUpdate = async (batch: any) => {
    if (!newStatus) {
      throw new Error('New status is required');
    }

    for (const applicationId of selectedApplications) {
      const applicationRef = doc(db, 'jobApplications', applicationId);
      batch.update(applicationRef, {
        status: newStatus,
        lastUpdated: serverTimestamp(),
        reviewedAt: serverTimestamp()
      });
    }
  };

  const executeBulkMessage = async (batch: any) => {
    if (!bulkMessage.trim()) {
      throw new Error('Message is required');
    }

    for (const applicationId of selectedApplications) {
      const application = applications.find(app => app.id === applicationId);
      if (!application) continue;

      // Add message to the application's messages subcollection
      const messageRef = collection(db, 'jobApplications', applicationId, 'messages');
      await addDoc(messageRef, {
        senderId: job?.postedById,
        senderName: (job as any)?.companyName || 'Job Poster',
        message: bulkMessage,
        timestamp: serverTimestamp(),
        type: 'system'
      });
    }
  };

  const executeBulkInterview = async (batch: any) => {
    if (!interviewData.date || !interviewData.time) {
      throw new Error('Interview date and time are required');
    }

    for (const applicationId of selectedApplications) {
      const applicationRef = doc(db, 'jobApplications', applicationId);
      
      // Update application status to interviewed
      batch.update(applicationRef, {
        status: 'interviewed',
        lastUpdated: serverTimestamp(),
        interviewScheduled: serverTimestamp()
      });

      // Add interview details
      const interviewRef = collection(db, 'jobApplications', applicationId, 'interviews');
      await addDoc(interviewRef, {
        date: interviewData.date,
        time: interviewData.time,
        duration: interviewData.duration,
        type: interviewData.type,
        notes: interviewData.notes,
        scheduledBy: job?.postedById,
        scheduledAt: serverTimestamp()
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <CheckCircle className="w-4 h-4" />;
      case 'shortlisted': return <Star className="w-4 h-4" />;
      case 'interviewed': return <Calendar className="w-4 h-4" />;
      case 'hired': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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

  if (applications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Bulk Application Manager
          {selectedApplications.length > 0 && (
            <span className="text-sm font-normal text-gray-500">
              ({selectedApplications.length} selected)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardBody>
        {/* Bulk Actions Bar */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedApplications.length === applications.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-700">Select All</span>
            </div>
            
            {selectedApplications.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openBulkModal('status')}
                  disabled={isProcessing}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Update Status
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openBulkModal('message')}
                  disabled={isProcessing}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Send Message
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openBulkModal('interview')}
                  disabled={isProcessing}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule Interview
                </Button>
              </div>
            )}
          </div>
          
          {selectedApplications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedApplications([])}
            >
              Clear Selection
            </Button>
          )}
        </div>

        {/* Applications List */}
        <div className="space-y-2">
          {applications.map((application) => (
            <div
              key={application.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                selectedApplications.includes(application.id)
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-100 hover:bg-gray-50'
              }`}
            >
              <Checkbox
                checked={selectedApplications.includes(application.id)}
                onCheckedChange={(checked) => 
                  handleSelectApplication(application.id, checked as boolean)
                }
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    Applicant #{application.applicantId.slice(0, 8)}...
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)} {application.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Applied on {application.appliedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Action Modal */}
        {isBulkModalOpen && (
          <Modal onClose={() => setIsBulkModalOpen(false)}>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {`Bulk ${bulkAction.charAt(0).toUpperCase() + bulkAction.slice(1)} Action`}
              </h2>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  This action will affect {selectedApplications.length} application(s)
                </span>
              </div>
            </div>

            {bulkAction === 'status' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select new status</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}

            {bulkAction === 'message' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Enter your message to all selected applicants..."
                  rows={4}
                />
              </div>
            )}

            {bulkAction === 'interview' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={interviewData.date}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={interviewData.time}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={interviewData.duration}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      min="15"
                      max="240"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={interviewData.type}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="video">Video Call</option>
                      <option value="phone">Phone Call</option>
                      <option value="in_person">In Person</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <Textarea
                    value={interviewData.notes}
                    onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Interview notes or instructions..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsBulkModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={executeBulkAction}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Execute Action
                  </>
                )}
              </Button>
            </div>
          </div>
            </div>
          </Modal>
        )}
      </CardBody>
    </Card>
  );
};

export default BulkApplicationManager; 