import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import JobCard from './JobCard';
import JobSearchFilters from './JobSearchFilters';
import { Button } from '../ui/Button';
import { JobPosting, JobSearchFilter } from '../../types/JobApplication';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus,
  X
} from 'lucide-react';
import Card from '../ui/Card';
import { Input } from '../ui/Input';
import { Skeleton } from '../ui/Skeleton';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best film industry jobs that match your skills and aspirations
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="relative w-full md:max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                className="pl-10 w-full text-sm"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                {showFilters ? (
                  <>
                    <X size={16} />
                    Hide Filters
                  </>
                ) : (
                  <>
                    <Filter size={16} />
                    Filters
                  </>
                )}
              </Button>
              <Button className="whitespace-nowrap">
                <Plus size={16} className="mr-2" />
                Post a Job
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-6 border-t border-gray-100">
              <JobSearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>
      </div>

      {loading ? (
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