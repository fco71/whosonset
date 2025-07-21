import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getJobPostings, createJobPosting, JobPosting } from '../services/api/jobService';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Users,
  Building,
  Star,
  ArrowRight,
  Plus,
  X,
  ChevronDown,
  TrendingUp,
  Zap,
  Globe
} from 'lucide-react';

const hasValue = (value: any) => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);

const formatDate = (date: Date | string) => {
  if (!date) return 'No date specified';
  const d = new Date(date);
  return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatSalary = (min?: number, max?: number, period?: string) => {
  if (!min && !max) return null;
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
  
  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }
  return formatNumber(min || max!);
};

interface JobCardProps {
  job: JobPosting;
  currentUserId?: string;
  onEdit?: (job: JobPosting) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, currentUserId, onEdit }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="group bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/jobs/${job.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {job.title || 'Untitled Position'}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{job.department || 'Various'}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
              {job.isRemote && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Globe className="w-4 h-4" />
                  <span>Remote</span>
                </div>
              )}
            </div>
          </div>
          
          {currentUserId && job.postedById === currentUserId && (
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Edit Job"
              onClick={e => { 
                e.stopPropagation(); 
                onEdit ? onEdit(job) : navigate(`/edit-job/${job.id}`); 
              }}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {hasValue(job.jobType) && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {job.jobType?.replace('_', ' ')}
            </span>
          )}
          {hasValue(job.experienceLevel) && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {job.experienceLevel} level
            </span>
          )}
                     {job.isPaid && (
             <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
               Paid
             </span>
           )}
        </div>

        {hasValue(job.description) && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {job.showSalary && (job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
          
          <div className={`flex items-center gap-1 text-blue-600 text-sm font-medium transition-transform ${isHovered ? 'translate-x-1' : ''}`}>
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  const departments = [
    'Camera', 'Sound', 'Lighting', 'Art', 'Costume', 'Makeup', 'Hair',
    'Production', 'Post-Production', 'VFX', 'Stunts', 'Transportation', 'Catering'
  ];

  const jobTypes = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' }
  ];

     const stats = [
     { icon: <Briefcase className="w-5 h-5" />, label: 'Active Jobs', value: jobs.length },
     { icon: <Building className="w-5 h-5" />, label: 'Companies', value: new Set(jobs.map(j => j.contactName || j.projectName)).size },
     { icon: <MapPin className="w-5 h-5" />, label: 'Locations', value: new Set(jobs.map(j => j.location)).size },
     { icon: <Users className="w-5 h-5" />, label: 'Remote Jobs', value: jobs.filter(j => j.isRemote).length }
   ];

  useEffect(() => {
    console.log('JobsPage mounted, loading jobs...');
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, searchQuery, selectedDepartment, selectedLocation, selectedJobType, remoteOnly]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const db = getFirestore();
      const jobsCollection = collection(db, 'jobPostings');
      const jobsQuery = query(jobsCollection);
      const querySnapshot = await getDocs(jobsQuery);
      
      const jobsData: JobPosting[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        jobsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as JobPosting);
      });
      
      setJobs(jobsData);
      console.log('Loaded jobs:', jobsData.length);
      
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

         if (searchQuery) {
       const query = searchQuery.toLowerCase();
       filtered = filtered.filter(job =>
         job.title?.toLowerCase().includes(query) ||
         job.description?.toLowerCase().includes(query) ||
         job.contactName?.toLowerCase().includes(query) ||
         job.projectName?.toLowerCase().includes(query) ||
         job.location?.toLowerCase().includes(query)
       );
     }

    if (selectedDepartment) {
      filtered = filtered.filter(job => job.department === selectedDepartment);
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    if (selectedJobType) {
      filtered = filtered.filter(job => job.jobType === selectedJobType);
    }

    if (remoteOnly) {
      filtered = filtered.filter(job => job.isRemote);
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    setSelectedLocation('');
    setSelectedJobType('');
    setRemoteOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedDepartment || selectedLocation || selectedJobType || remoteOnly;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Next <span className="text-blue-600">Film Industry</span> Role
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover opportunities with leading productions, connect with industry professionals, and advance your career in film and television.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200">
                <div className="flex justify-center mb-2 text-blue-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or keywords..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {[searchQuery, selectedDepartment, selectedLocation, selectedJobType, remoteOnly].filter(Boolean).length}
                      </span>
                    )}
                  </Button>
                  {auth.currentUser && (
                    <>
                      <Button
                        onClick={() => navigate('/jobs/applied')}
                        className="flex items-center gap-2"
                        variant="secondary"
                      >
                        <Briefcase className="w-4 h-4" />
                        My Applications
                      </Button>
                      <Button
                        onClick={() => navigate('/post-job')}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Post Job
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="Enter location"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                      <select
                        value={selectedJobType}
                        onChange={(e) => setSelectedJobType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">All Types</option>
                        {jobTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Remote</label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={remoteOnly}
                          onChange={(e) => setRemoteOnly(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remote only</span>
                      </label>
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {filteredJobs.length} of {jobs.length} jobs match your filters
                      </span>
                      <Button variant="ghost" onClick={clearFilters}>
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "Check back later for new opportunities."
              }
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Available
                </h2>
                <p className="text-gray-600">
                  {hasActiveFilters ? 'Filtered results' : 'All available positions'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
                  <option>Newest first</option>
                  <option>Oldest first</option>
                  <option>Salary high to low</option>
                  <option>Salary low to high</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  currentUserId={auth.currentUser?.uid} 
                />
              ))}
            </div>

            {/* Load More */}
            {filteredJobs.length >= 20 && (
              <div className="text-center mt-12">
                <Button variant="outline" className="px-8 py-3">
                  Load More Jobs
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
