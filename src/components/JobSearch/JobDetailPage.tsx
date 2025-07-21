import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobPosting } from '../../types/JobApplication';
import { toast } from 'react-hot-toast';
import FirebaseDiagnostic from './FirebaseDiagnostic';

const JobDetailPage: React.FC = () => {
  const auth = useAuth();
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isViewingStats, setIsViewingStats] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected');

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
      // View tracking disabled to eliminate Firebase connection errors
    }
  }, [jobId]);

  const loadJobDetails = async (retryCount = 0) => {
    if (!jobId) {
      setError('No job ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setConnectionStatus('connecting');
      
      const jobDoc = await getDoc(doc(db, 'jobPostings', jobId));
      
      if (!jobDoc.exists()) {
        throw new Error('Job not found');
      }
      
      const data = jobDoc.data();
      
      // Map the Firestore document to the JobPosting interface
      const jobData: JobPosting = {
        id: jobDoc.id,
        title: data.title || '',
        department: data.department || '',
        jobTitle: data.title || '',
        description: data.description || '',
        requirements: typeof data.requirements === 'string' ? [data.requirements] : 
                     Array.isArray(data.requirements) ? data.requirements : [],
        responsibilities: typeof data.responsibilities === 'string' ? [data.responsibilities] :
                         Array.isArray(data.responsibilities) ? data.responsibilities : [],
        location: data.location || '',
        startDate: data.startDate || '',
        endDate: data.deadline || data.endDate || '',
        salary: {
          min: data.salaryMin || 0,
          max: data.salaryMax || 0,
          currency: 'USD'
        },
        isRemote: data.isRemote || false,
        isUrgent: data.isUrgent || false,
        postedBy: data.postedById || data.contactName || '',
        postedAt: data.createdAt?.toDate() || new Date(),
        deadline: data.deadline || '',
        status: data.status || 'published',
        applicationsCount: data.applicationCount || 0,
        tags: Array.isArray(data.skills) ? data.skills : [],
        experienceLevel: data.experienceLevel || 'entry',
        contractType: data.jobType || 'full_time',
        benefits: Array.isArray(data.benefits) ? data.benefits : 
                 typeof data.benefits === 'string' ? [data.benefits] : [],
        perks: [],
        views: data.views || 0,
        saves: data.saves || 0,
        shares: data.shares || 0,
        shortlistedCount: data.shortlistedCount || 0,
        interviewedCount: data.interviewedCount || 0,
        hiredCount: data.hiredCount || 0,
        projectId: data.projectId || '',
        contactName: data.contactName || '',
        contactEmail: data.contactEmail || '',
        showContactEmail: data.showContactEmail || false,
        projectName: data.projectName || '',
        projectType: data.projectType || 'other',
        isPaid: data.isPaid !== undefined ? data.isPaid : true,
        isUnion: data.isUnion || false,
        visaSponsorship: data.visaSponsorship || false,
        relocationAssistance: data.relocationAssistance || false
      };
      
      setJob(jobData);
      setConnectionStatus('connected');
    } catch (error: any) {
      console.error('Error loading job details:', error);
      
      // Handle specific error types
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        if (retryCount < 3) {
          console.log(`Retrying job details load (attempt ${retryCount + 1})...`);
          setTimeout(() => {
            loadJobDetails(retryCount + 1);
          }, 2000 * (retryCount + 1)); // Exponential backoff
          return;
        } else {
          setError('Connection issue. Please check your internet connection and try again.');
          setConnectionStatus('error');
        }
      } else if (error.code === 'permission-denied') {
        setError('You don\'t have permission to view this job.');
      } else if (error.code === 'not-found') {
        setError('Job not found. It may have been removed or is no longer available.');
      } else {
        setError('Failed to load job details. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const incrementJobViews = async () => {
    // Completely disable view tracking to eliminate Firebase connection errors
    // This functionality is not critical for the user experience
    return;
  };

  // Check if user has already saved this job
  useEffect(() => {
    // Reset saved state when user or job changes
    setIsSaved(false);
    
    if (auth.currentUser && jobId) {
      const savedJobRef = doc(db, 'savedJobs', `${auth.currentUser.uid}_${jobId}`);
      
      // Use a more robust approach to check saved status
      const checkSavedStatus = async () => {
        try {
          console.log('🔍 Checking saved status for user:', auth.currentUser?.uid, 'job:', jobId);
          console.log('📄 Document path:', savedJobRef.path);
          
          const docSnap = await getDoc(savedJobRef);
          const exists = docSnap.exists();
          console.log('✅ Saved job exists:', exists);
          setIsSaved(exists);
        } catch (error: any) {
          console.error('❌ Error checking saved status:', error);
          console.error('🔍 Error code:', error.code);
          console.error('🔍 Error message:', error.message);
          
          // Don't show error to user, just assume not saved
          setIsSaved(false);
          
          // Handle specific permission errors gracefully
          if (error.code === 'permission-denied') {
            console.log('⚠️ Permission denied for saved job check - this is expected for new users');
          }
        }
      };
      
      checkSavedStatus();
    }
  }, [auth.currentUser, jobId]);

  const handleSaveJob = async () => {
    if (!auth.currentUser) {
      toast.error('Please log in to save jobs');
      return;
    }

    try {
      setIsSaved(!isSaved);
      
      // Use a separate collection for saved jobs to avoid permission issues
      const savedJobRef = doc(db, 'savedJobs', `${auth.currentUser.uid}_${jobId}`);
      
      if (isSaved) {
        // Remove from saved
        await deleteDoc(savedJobRef);
        toast.success('Job removed from saved');
      } else {
        // Add to saved
        await setDoc(savedJobRef, {
          jobId: jobId,
          userId: auth.currentUser.uid,
          savedAt: new Date(),
          timestamp: serverTimestamp()
        });
        toast.success('Job saved successfully');
      }
    } catch (error: any) {
      console.error('Error saving job:', error);
      
      // Revert the UI state on error
      setIsSaved(!isSaved);
      
      // Handle connection issues
      if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        toast.error('Connection issue. Please try again.');
      } else {
        toast.error('Failed to save job');
      }
    }
  };

  const handleShareJob = async () => {
    const shareUrl = `${window.location.origin}/jobs/${jobId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title || 'Check out this job',
          text: `I found this great opportunity: ${job?.title}`,
          url: shareUrl
        });
      } catch (error: any) {
        // Don't log AbortError as it's just user cancellation
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Job link copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  const formatSalary = (salary: { min?: number; max?: number; currency?: string } | undefined) => {
    if (!salary || (salary.min === undefined && salary.max === undefined)) return 'Salary not specified';
    const { min, max, currency = 'USD' } = salary;
    if (min !== undefined && max !== undefined) {
      if (min === max) {
        return `${currency} ${min.toLocaleString()}`;
      }
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min !== undefined) {
      return `From ${currency} ${min.toLocaleString()}`;
    } else if (max !== undefined) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Salary not specified';
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTimeAgo = (date: any) => {
    if (!date) return '';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-blue-100 text-blue-800';
      case 'mid': return 'bg-green-100 text-green-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-green-100 text-green-800';
      case 'part_time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'freelance': return 'bg-orange-100 text-orange-800';
      case 'internship': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">❌</div>
          <h2 className="text-2xl font-light text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Job not found'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => loadJobDetails()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine if the current user is the job poster
  const isJobPoster = job && auth.currentUser && (job.postedBy === auth.currentUser.uid);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span>›</span>
            <Link to="/jobs" className="hover:text-gray-700">Jobs</Link>
            <span>›</span>
            <span className="text-gray-900">{job.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        {connectionStatus === 'connecting' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700">Connecting to database...</span>
            </div>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-sm text-red-700">Connection issue detected. Some features may not work properly.</span>
            </div>
            {process.env.NODE_ENV === 'development' && <FirebaseDiagnostic />}
          </div>
        )}
        
        {/* Job Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {job.isUrgent && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                    ⚡ Urgent
                  </span>
                )}
                {job.isRemote && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    🌐 Remote
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  {job.department}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {job.title}
              </h1>
              
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  📍 {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  💼 {job.contractType.replace('_', ' ')}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  📅 {formatDate(job.startDate)}
                </span>
              </div>

              {job.projectName && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Project</h3>
                  <p className="text-gray-900 font-medium">{job.projectName}</p>
                                     <p className="text-sm text-gray-600 capitalize">{job.projectType?.replace('_', ' ') || 'Project'}</p>
                </div>
              )}
            </div>
            
            <div className="text-right ml-8">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {formatSalary(job.salary)}
              </div>
              <p className="text-sm text-gray-600">per year</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            {!isJobPoster ? (
              <>
                <Link
                  to={`/jobs/${job.id}/apply`}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Apply Now
                </Link>
                <button
                  onClick={handleSaveJob}
                  className={`px-4 py-3 border rounded-lg transition-colors ${
                    isSaved 
                      ? 'border-blue-600 text-blue-600 bg-blue-50' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isSaved ? '✓ Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShareJob}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Share
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsViewingStats(!isViewingStats)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  📊 View Stats
                </button>
                {job.applicationsCount > 0 && (
                  <Link
                    to={`/jobs/${job.id}/applications`}
                    className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Applications ({job.applicationsCount})
                  </Link>
                )}
                <Link
                  to={`/jobs/${job.id}/edit`}
                  className="px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Edit Job
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats for Job Poster */}
        {isViewingStats && isJobPoster && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{job.views}</div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{job.applicationsCount}</div>
                <div className="text-sm text-gray-600">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{job.saves}</div>
                <div className="text-sm text-gray-600">Saves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{job.shares}</div>
                <div className="text-sm text-gray-600">Shares</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">About this role</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-500 mt-1">•</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">What you'll do</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">•</span>
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Benefits & Perks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Work Arrangement</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">💰</span>
                      <span className="text-gray-700">{job.isPaid ? 'Paid position' : 'Unpaid position'}</span>
                    </div>
                    {job.isUnion && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🤝</span>
                        <span className="text-gray-700">Union position</span>
                      </div>
                    )}
                    {job.visaSponsorship && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🛂</span>
                        <span className="text-gray-700">Visa sponsorship available</span>
                      </div>
                    )}
                    {job.relocationAssistance && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🚚</span>
                        <span className="text-gray-700">Relocation assistance</span>
                      </div>
                    )}
                  </div>
                </div>
                
                                 <div>
                   <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h3>
                   <div className="space-y-2">
                     {job.contactName && (
                       <div className="flex items-center gap-2">
                         <span className="text-gray-400">👤</span>
                         <span className="text-gray-700">{job.contactName}</span>
                       </div>
                     )}
                     {job.showContactEmail && job.contactEmail && (
                       <div className="flex items-center gap-2">
                         <span className="text-gray-400">📧</span>
                         <span className="text-gray-700">{job.contactEmail}</span>
                       </div>
                     )}
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply Card */}
            {!isJobPoster && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Interested in this position?</h3>
                  <p className="text-gray-600 text-sm">
                    {job.applicationsCount} other{job.applicationsCount !== 1 ? 's have' : ' has'} applied
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    to={`/jobs/${job.id}/apply`}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center block"
                  >
                    Apply Now
                  </Link>
                  <button
                    onClick={handleSaveJob}
                    className={`w-full px-6 py-3 border rounded-lg transition-colors ${
                      isSaved 
                        ? 'border-blue-600 text-blue-600 bg-blue-50' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isSaved ? '✓ Saved' : 'Save Job'}
                  </button>
                </div>
              </div>
            )}

            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Experience Level</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceLevelColor(job.experienceLevel)}`}>
                      {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Contract Type</span>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getContractTypeColor(job.contractType)}`}>
                      {job.contractType.replace('_', ' ').charAt(0).toUpperCase() + job.contractType.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Start Date</span>
                  <p className="text-gray-900">{formatDate(job.startDate)}</p>
                </div>
                
                {job.endDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">End Date</span>
                    <p className="text-gray-900">{formatDate(job.endDate)}</p>
                  </div>
                )}
                
                {job.deadline && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Application Deadline</span>
                    <p className="text-red-600 font-medium">{formatDate(job.deadline)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Skills & Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Posted Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Posted Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="text-gray-900">{getTimeAgo(job.postedAt)}</span>
                </div>
                {!isJobPoster && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applications</span>
                    <span className="text-gray-900">{job.applicationsCount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage; 