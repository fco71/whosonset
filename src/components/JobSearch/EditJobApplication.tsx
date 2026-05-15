import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { JobApplicationService } from '../../services/jobApplicationService';
import { JobApplication } from '../../types/JobApplication';
import { toast } from 'react-hot-toast';

interface EditJobApplicationData {
  coverLetter: string;
  expectedSalary?: number;
  availabilityDate: string;
  notes: string;
}

const EditJobApplication: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EditJobApplicationData>({
    coverLetter: '',
    expectedSalary: undefined,
    availabilityDate: '',
    notes: ''
  });

  useEffect(() => {
    if (applicationId) {
      loadApplication();
    }
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setIsLoading(true);
      const app = await JobApplicationService.getApplication(applicationId!);
      
      if (!app) {
        setError('Application not found');
        return;
      }

      // Check if user owns this application
      if (app.applicantId !== currentUser?.uid) {
        setError('You can only edit your own applications');
        return;
      }

      setApplication(app);
      setFormData({
        coverLetter: app.coverLetter || '',
        expectedSalary: app.expectedSalary,
        availabilityDate: app.availabilityDate || '',
        notes: app.notes || ''
      });
    } catch (error) {
      console.error('Error loading application:', error);
      setError('Failed to load application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof EditJobApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!application || !currentUser) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await JobApplicationService.updateApplication(applicationId!, {
        coverLetter: formData.coverLetter,
        expectedSalary: formData.expectedSalary,
        availabilityDate: formData.availabilityDate,
        notes: formData.notes
      });
      
      toast.success('Application updated successfully');
      navigate('/applications');
    } catch (error) {
      console.error('Error updating application:', error);
      setError('Failed to update application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!application || !currentUser) return;
    
    if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await JobApplicationService.deleteApplication(applicationId!);
      
      toast.success('Application withdrawn successfully');
      navigate('/applications');
    } catch (error) {
      console.error('Error deleting application:', error);
      setError('Failed to withdraw application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-light text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">❌</div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Application not found'}</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/applications')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Applications
          </button>
          <h1 className="text-3xl font-light text-gray-900">Edit Application</h1>
          <p className="text-gray-600 mt-2">Update your job application details</p>
        </div>

        {/* Application Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-light text-gray-900 mb-4">Application Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {application.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Applied:</span>
              <span className="ml-2">
                {application.appliedAt?.toDate ? 
                  application.appliedAt.toDate().toLocaleDateString() : 
                  'N/A'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Cover Letter */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cover Letter
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none font-light"
            />
            <p className="text-sm text-gray-500 mt-2">
              Recommended: 300-500 words
            </p>
          </div>

          {/* Expected Salary */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Expected Salary (Optional)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={formData.expectedSalary || ''}
                onChange={(e) => handleInputChange('expectedSalary', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 75000"
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none font-light"
                min="0"
              />
              <span className="text-gray-500">per year</span>
            </div>
          </div>

          {/* Availability Date */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              When are you available to start?
            </label>
            <input
              type="date"
              value={formData.availabilityDate}
              onChange={(e) => handleInputChange('availabilityDate', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none font-light"
            />
          </div>

          {/* Additional Notes */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information you'd like to share..."
              className="w-full h-24 p-4 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none font-light"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Application'}
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Withdrawing...' : 'Withdraw Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobApplication; 