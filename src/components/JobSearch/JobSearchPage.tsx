import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import JobCard from './JobCard';
import JobSearchFilters from './JobSearchFilters';
import { Button } from '../ui/Button';
import { JobPosting, JobSearchFilter } from '../../types/JobApplication';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';

interface Job extends JobPosting {
  id: string;
}

const JobSearchPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobSearchFilter>({});

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const jobsRef = collection(db, 'jobs');
      const q = query(jobsRef, orderBy('postedDate', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      
      const jobsData: Job[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        jobsData.push({
          id: doc.id,
          title: data.title || '',
          jobTitle: data.jobTitle || '',
          department: data.department || '',
          description: data.description || '',
          location: data.location || '',
          contractType: data.contractType || 'full_time',
          experienceLevel: data.experienceLevel || 'entry',
          salary: data.salary || undefined,
          isRemote: data.isRemote || false,
          isUrgent: data.isUrgent || false,
          postedAt: data.postedAt || new Date(),
          deadline: data.deadline || undefined,
          responsibilities: data.responsibilities || [],
          requirements: data.requirements || [],
          tags: data.tags || [],
          projectId: data.projectId || '',
          status: data.status || 'active',
          startDate: data.startDate || undefined,
          postedBy: data.postedBy || '',
          applicationsCount: data.applicationsCount || 0,
          views: data.views || 0,
          saves: data.saves || 0,
          shares: data.shares || 0,
          shortlistedCount: data.shortlistedCount || 0,
          interviewedCount: data.interviewedCount || 0,
          hiredCount: data.hiredCount || 0
        });
      });
      
      setJobs(jobsData);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.department) {
      filtered = filtered.filter(job => 
        job.department.toLowerCase().includes(filters.department!.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.contractType) {
      filtered = filtered.filter(job => job.contractType === filters.contractType);
    }

    if (filters.experienceLevel) {
      filtered = filtered.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    if (filters.isRemote) {
      filtered = filtered.filter(job => job.isRemote);
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const stats = [
    { icon: <Briefcase className="w-5 h-5" />, label: 'Total Jobs', value: jobs.length },
    { icon: <MapPin className="w-5 h-5" />, label: 'Locations', value: new Set(jobs.map(job => job.location)).size },
    { icon: <Users className="w-5 h-5" />, label: 'Departments', value: new Set(jobs.map(job => job.department)).size },
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Active', value: jobs.filter(job => new Date(job.postedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="card-modern">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading jobs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Search</h1>
        <p className="text-gray-600">Find your next opportunity in the film industry</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card-modern text-center">
            <div className="p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-3">
                {stat.icon}
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card-modern mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <JobSearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </h2>
          {Object.values(filters).some(filter => filter !== '' && filter !== false) && (
            <p className="text-sm text-gray-600 mt-1">
              Showing filtered results
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="recent">Most Recent</option>
            <option value="title">Job Title</option>
            <option value="company">Company</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <div className="card-modern text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {Object.values(filters).some(filter => filter !== '' && filter !== false)
              ? 'Try adjusting your filters to see more results.'
              : 'Check back later for new opportunities.'
            }
          </p>
          {Object.values(filters).some(filter => filter !== '' && filter !== false) && (
            <Button variant="secondary" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Load More */}
      {filteredJobs.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="secondary" size="lg">
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobSearchPage; 