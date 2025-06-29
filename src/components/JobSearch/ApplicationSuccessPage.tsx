import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobApplication, JobPosting } from '../../types/JobApplication';

const ApplicationSuccessPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (applicationId) {
      loadApplicationDetails();
    }
  }, [applicationId]);

  const loadApplicationDetails = async () => {
    try {
      setIsLoading(true);
      
      // Load application details
      const applicationDoc = await getDoc(doc(db, 'jobApplications', applicationId!));
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
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">✅</div>
          </div>
          
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Application Submitted!
          </h1>
          
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your application has been successfully submitted. We'll review it and get back to you soon.
          </p>
        </div>

        {/* Application Summary */}
        {application && job && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Application Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
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
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
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
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      ⏳ Pending Review
                    </span>
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
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-6">What Happens Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">👁️</div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Review</h3>
              <p className="text-gray-600 text-sm">
                Our team will review your application and qualifications within 3-5 business days.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">📧</div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Notification</h3>
              <p className="text-gray-600 text-sm">
                You'll receive an email update about your application status and next steps.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">📅</div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interview</h3>
              <p className="text-gray-600 text-sm">
                If selected, we'll schedule an interview to discuss the role and your experience.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/applications"
            className="px-8 py-4 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 text-center"
          >
            View All Applications
          </Link>
          
          <Link
            to="/jobs"
            className="px-8 py-4 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Browse More Jobs
          </Link>
          
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Keep your profile updated with the latest skills and experience</li>
            <li>• Follow up on your application after 1 week if you haven't heard back</li>
            <li>• Prepare for potential interviews by researching the company and role</li>
            <li>• Consider applying to similar positions to increase your chances</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessPage; 