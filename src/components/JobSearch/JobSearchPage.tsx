import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobPosting, JobSearchFilter } from '../../types/JobApplication';
import JobSearchFilters from './JobSearchFilters';
import JobCard from './JobCard';
import { Link } from 'react-router-dom';

const JobSearchPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [filters, setFilters] = useState<JobSearchFilter>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters, searchQuery]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const jobsQuery = query(
        collection(db, 'jobPostings'),
        where('status', '==', 'active'),
        orderBy('postedAt', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(jobsQuery);
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as JobPosting));

      setJobs(jobsData);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreJobs = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const moreJobsQuery = query(
        collection(db, 'jobPostings'),
        where('status', '==', 'active'),
        orderBy('postedAt', 'desc'),
        startAfter(lastDoc),
        limit(20)
      );

      const snapshot = await getDocs(moreJobsQuery);
      const moreJobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as JobPosting));

      setJobs(prev => [...prev, ...moreJobsData]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error('Error loading more jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...jobs];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.jobTitle.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.department) {
      filtered = filtered.filter(job => job.department === filters.department);
    }

    if (filters.jobTitle) {
      filtered = filtered.filter(job => job.jobTitle === filters.jobTitle);
    }

    if (filters.location) {
      filtered = filtered.filter(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }

    if (filters.salaryMin !== undefined) {
      filtered = filtered.filter(job => job.salary && job.salary.min >= filters.salaryMin!);
    }

    if (filters.salaryMax !== undefined) {
      filtered = filtered.filter(job => job.salary && job.salary.max <= filters.salaryMax!);
    }

    if (filters.isRemote !== undefined) {
      filtered = filtered.filter(job => job.isRemote === filters.isRemote);
    }

    if (filters.isUrgent !== undefined) {
      filtered = filtered.filter(job => job.isUrgent === filters.isUrgent);
    }

    if (filters.datePosted) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.datePosted) {
        case 'today':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }

      if (filters.datePosted !== 'all') {
        filtered = filtered.filter(job => {
          const postedDate = job.postedAt?.toDate ? job.postedAt.toDate() : new Date(job.postedAt);
          return postedDate >= filterDate;
        });
      }
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (newFilters: JobSearchFilter) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight animate-slide-up">
            Job Search
          </h1>
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
            Find your next opportunity in the film industry. Browse through available positions and connect with production teams.
          </p>
          <div className="mt-8 animate-slide-up-delay">
            <Link 
              to="/post-job" 
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Post a Job
            </Link>
          </div>
        </div>

        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 animate-slide-up-delay">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs by title, department, location, or keywords..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-light text-gray-600">
                {filteredJobs.length} jobs found
              </span>
              {Object.keys(filters).length > 0 && (
                <button 
                  onClick={clearFilters} 
                  className="px-4 py-2 text-sm font-light text-gray-600 hover:text-gray-900 transition-colors duration-300"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <JobSearchFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Jobs List */}
          <main className="lg:col-span-3">
            {isLoading && jobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-lg font-light text-gray-600">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-20">💼</div>
                <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                  No jobs found
                </h3>
                <p className="text-lg font-light text-gray-500 max-w-md mx-auto leading-relaxed">
                  Try adjusting your search criteria or filters to find more opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
                
                {hasMore && (
                  <div className="text-center pt-8">
                    <button
                      onClick={loadMoreJobs}
                      disabled={isLoading}
                      className="px-8 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? 'Loading...' : 'Load More Jobs'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage; 