import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobPosting, JobApplication } from '../../types/JobApplication';
import { JobApplicationService } from '../../utilities/jobApplicationService';

interface JobApplicationFormData {
  coverLetter: string;
  expectedSalary?: number;
  availabilityDate: string;
  notes: string;
  resumeId: string;
  attachments: File[];
}

const JobApplicationForm: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<JobApplicationFormData>({
    coverLetter: '',
    expectedSalary: undefined,
    availabilityDate: '',
    notes: '',
    resumeId: '',
    attachments: []
  });

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setIsLoading(true);
      const jobDoc = await getDoc(doc(db, 'jobPostings', jobId!));
      
      if (jobDoc.exists()) {
        setJob({
          id: jobDoc.id,
          ...jobDoc.data()
        } as JobPosting);
      } else {
        setError('Job not found');
      }
    } catch (error) {
      console.error('Error loading job details:', error);
      setError('Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof JobApplicationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files: File[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.coverLetter.trim()) {
      setError('Cover letter is required');
      return false;
    }
    
    if (!formData.availabilityDate) {
      setError('Availability date is required');
      return false;
    }
    
    if (!formData.resumeId) {
      setError('Resume is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !job) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // TODO: Upload attachments to storage and get URLs
      const attachmentUrls: string[] = [];
      
      const applicationData = {
        jobId: job.id,
        applicantId: 'current-user-id', // TODO: Get from auth context
        projectId: job.projectId,
        status: 'pending' as const,
        coverLetter: formData.coverLetter,
        expectedSalary: formData.expectedSalary,
        availabilityDate: formData.availabilityDate,
        notes: formData.notes,
        resumeId: formData.resumeId,
        attachments: attachmentUrls.map((url, index) => ({
          id: `attachment-${index}`,
          name: formData.attachments[index]?.name || 'Attachment',
          url,
          type: 'other' as const,
          size: formData.attachments[index]?.size || 0,
          uploadedAt: new Date()
        }))
      };
      
      const applicationId = await JobApplicationService.submitApplication(applicationData);
      
      setSuccess(true);
      
      // Redirect to success page after a short delay
      setTimeout(() => {
        navigate(`/applications/${applicationId}/success`);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg font-light text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">❌</div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">Your application has been successfully submitted.</p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
          </div>
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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            ← Back to Job
          </button>
          
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Apply for {job?.title}
          </h1>
          <p className="text-gray-600">
            Complete your application for this position
          </p>
        </div>

        {/* Job Summary */}
        {job && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-light text-gray-900 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-1">{job.department} • {job.location}</p>
                {job.salary && (
                  <p className="text-gray-600">
                    ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                  </p>
                )}
              </div>
              {job.isUrgent && (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  Urgent
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {job.tags.slice(0, 5).map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Cover Letter */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cover Letter *
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => handleInputChange('coverLetter', e.target.value)}
              placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none font-light"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Minimum 100 characters. Recommended: 300-500 words.
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
            <p className="text-sm text-gray-500 mt-2">
              This helps us understand your salary expectations
            </p>
          </div>

          {/* Availability Date */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              When are you available to start? *
            </label>
            <input
              type="date"
              value={formData.availabilityDate}
              onChange={(e) => handleInputChange('availabilityDate', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none font-light"
              required
            />
          </div>

          {/* Resume Upload */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Resume *
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4 opacity-20">📄</div>
              <p className="text-gray-600 mb-2">Upload your resume</p>
              <p className="text-sm text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // TODO: Upload to storage and get ID
                    handleInputChange('resumeId', 'resume-id');
                  }
                }}
                className="mt-4"
              />
            </div>
          </div>

          {/* Additional Attachments */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Additional Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4 opacity-20">📎</div>
              <p className="text-gray-600 mb-2">Upload portfolio, references, or other documents</p>
              <p className="text-sm text-gray-500">PDF, DOC, DOCX, or images (max 10MB each)</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleFileUpload(files);
                }}
                className="mt-4"
              />
            </div>
            {formData.attachments.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            attachments: prev.attachments.filter((_, i) => i !== index)
                          }));
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-light transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm; 