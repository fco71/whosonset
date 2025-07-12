import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobPosting } from '../../types/JobApplication';

const JobDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const loadJobDetails = async () => {
    if (!jobId) {
      setError('No job ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading job details for ID:', jobId, 'from collection: jobs');
      
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      
      if (!jobDoc.exists()) {
        throw new Error('Job not found');
      }
      
      const data = jobDoc.data();
      console.log('Raw job data from Firestore:', data);
      
      // Map the Firestore document to the JobPosting interface
      const jobData: JobPosting = {
        id: jobDoc.id,
        title: data.title || '',
        department: data.department || '',
        jobTitle: data.title || '', // Use title as jobTitle if not specified
        description: data.description || '',
        requirements: typeof data.requirements === 'string' ? [data.requirements] : 
                     Array.isArray(data.requirements) ? data.requirements : [],
        responsibilities: typeof data.responsibilities === 'string' ? [data.responsibilities] :
                         Array.isArray(data.responsibilities) ? data.responsibilities : [],
        location: data.location || '',
        startDate: data.startDate || '',
        endDate: data.deadline || data.endDate || '', // Map deadline to endDate if needed
        salary: {
          min: data.salaryMin || 0,
          max: data.salaryMax || 0,
          currency: 'USD'
        },
        isRemote: data.isRemote || false,
        isUrgent: false, // Default to false if not specified
        postedBy: data.postedBy || data.contactName || '',
        postedAt: data.postedAt?.toDate() || new Date(),
        deadline: data.deadline || '',
        status: data.status || 'published',
        applicationsCount: data.applicationCount || 0,
        tags: Array.isArray(data.skills) ? data.skills : [],
        experienceLevel: data.experienceLevel || 'entry',
        contractType: data.contractType || 'full_time',
        benefits: Array.isArray(data.benefits) ? data.benefits : [],
        perks: Array.isArray(data.perks) ? data.perks : [],
        views: data.views || 0,
        saves: data.saves || 0,
        shares: data.shares || 0,
        shortlistedCount: data.shortlistedCount || 0,
        interviewedCount: data.interviewedCount || 0,
        hiredCount: data.hiredCount || 0,
        projectId: data.projectId || ''
      };
      
      setJob(jobData);
    } catch (error) {
      console.error('Error loading job details:', error);
      setError('Failed to load job details');
    } finally {
      setIsLoading(false);
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
    return dateObj.toLocaleDateString();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/jobs"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            ← Back to Jobs
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
                {job.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <span className="font-medium">{job.department}</span>
                <span>•</span>
                <span>📍 {job.location}</span>
                {job.isRemote && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Remote
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              {job.isUrgent && (
                <span className="px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                  ⚡ Urgent
                </span>
              )}
              <div className="text-right">
                <p className="text-2xl font-light text-gray-900">{formatSalary(job.salary)}</p>
                <p className="text-sm text-gray-600">per year</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-light text-gray-900 mb-6">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits & Perks */}
            {(job.benefits || job.perks) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-light text-gray-900 mb-6">Benefits & Perks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {job.benefits && job.benefits.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Benefits</h3>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {job.perks && job.perks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Perks</h3>
                      <ul className="space-y-2">
                        {job.perks.map((perk, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-blue-500">🎁</span>
                            <span className="text-gray-700">{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-light text-gray-900 mb-2">Interested in this position?</h3>
                <p className="text-gray-600 text-sm">
                  {job.applicationsCount} other{job.applicationsCount !== 1 ? 's have' : ' has'} applied
                </p>
              </div>
              
              <div className="space-y-4">
                <Link
                  to={`/jobs/${job.id}/apply`}
                  className="w-full px-6 py-4 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 text-center block"
                >
                  Apply Now
                </Link>
                
                <button className="w-full px-6 py-3 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors">
                  Save Job
                </button>
                
                <button className="w-full px-6 py-3 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors">
                  Share Job
                </button>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-light text-gray-900 mb-4">Job Details</h3>
              
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
                
                {job.teamSize && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Team Size</span>
                    <p className="text-gray-900">{job.teamSize} people</p>
                  </div>
                )}
                
                {job.projectDuration && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Project Duration</span>
                    <p className="text-gray-900">{job.projectDuration}</p>
                  </div>
                )}
                
                {job.travelRequirements && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Travel Requirements</span>
                    <p className="text-gray-900">{job.travelRequirements}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-light text-gray-900 mb-4">Skills & Tags</h3>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-light text-gray-900 mb-4">Posted Information</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="text-gray-900">{formatDate(job.postedAt)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="text-gray-900">{job.applicationsCount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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