import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, limit, startAfter } from 'firebase/firestore';
import { db } from '../../firebase';
import { JobPosting, JobSearchFilter } from '../../types/JobApplication';
import JobSearchFilters from './JobSearchFilters';
import JobCard from './JobCard';
import './JobSearchPage.scss';

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
    <div className="job-search-page">
      <div className="job-search-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search jobs by title, department, location, or keywords..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
        
        <div className="search-stats">
          <span>{filteredJobs.length} jobs found</span>
          {Object.keys(filters).length > 0 && (
            <button onClick={clearFilters} className="clear-filters">
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="job-search-content">
        <aside className="filters-sidebar">
          <JobSearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <main className="jobs-main">
          <div className="jobs-grid">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && !isLoading && (
            <div className="no-jobs">
              <div className="no-jobs-content">
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {hasMore && (
            <div className="load-more">
              <button
                onClick={loadMoreJobs}
                disabled={isLoading}
                className="load-more-btn"
              >
                {isLoading ? 'Loading...' : 'Load more jobs'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobSearchPage; 