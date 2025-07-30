import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { CrewProfile, Residence, ContactInfo } from '../types/CrewProfile';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { ProjectEntry } from '../types/ProjectEntry';
import { auth } from '../firebase';
import FollowButton from '../components/Social/FollowButton';
import { useTranslation } from 'react-i18next';

interface JobDepartment {
  name: string;
  titles: string[];
}

interface Country {
  name: string;
  cities: string[];
}

const ProducerView: React.FC = () => {
  const { t } = useTranslation();
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<CrewProfile[]>([]);
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Filter states
  const [filters, setFilters] = useState({
    department: '',
    jobTitle: '',
    country: '',
    city: '',
    availability: '',
    searchQuery: ''
  });

  const [appliedFilters, setAppliedFilters] = useState({
    department: '',
    jobTitle: '',
    country: '',
    city: '',
    availability: '',
    searchQuery: ''
  });

  const [isSearching, setIsSearching] = useState(false);

  // Fetch departments and countries
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        // Fetch departments
        const deptSnapshot = await getDocs(collection(db, 'jobDepartments'));
        const deptData = deptSnapshot.docs.map(doc => ({
          name: doc.data().name,
          titles: doc.data().titles || []
        }));

        // Fetch countries
        const countrySnapshot = await getDocs(collection(db, 'countries'));
        const countryData = countrySnapshot.docs.map(doc => ({
          name: doc.data().name,
          cities: doc.data().cities || []
        }));

        setDepartments(deptData);
        setCountries(countryData);
      } catch (error) {
        console.error('Error fetching lookup data:', error);
      }
    };

    fetchLookupData();
  }, []);

  // Get current user ID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUserId(user?.uid || '');
    });
    return () => unsubscribe();
  }, []);

  // Fetch crew profiles with optimized queries
  useEffect(() => {
    const fetchCrewProfiles = async () => {
      try {
        setLoading(true);
        setIsFiltering(true);
        
        // Start with base query for published profiles
        let q = query(
          collection(db, 'crewProfiles'),
          where('isPublished', '==', true)
        );

        // Add availability filter to Firestore query if specified
        if (appliedFilters.availability) {
          q = query(q, where('availability', '==', appliedFilters.availability));
        }

        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as CrewProfile[];

        // Client-side filtering for complex fields
        // Filter by search query
        if (appliedFilters.searchQuery) {
          const query = appliedFilters.searchQuery.toLowerCase();
          results = results.filter(profile =>
            profile.name.toLowerCase().includes(query) ||
            profile.jobTitles?.some(job => 
              job.title.toLowerCase().includes(query) ||
              job.department.toLowerCase().includes(query)
            ) ||
            profile.bio?.toLowerCase().includes(query) ||
            profile.projects?.some(project => 
              project.projectName.toLowerCase().includes(query) ||
              project.role.toLowerCase().includes(query)
            )
          );
        }

        // Filter by department
        if (appliedFilters.department) {
          results = results.filter(profile =>
            profile.jobTitles?.some(job => job.department === appliedFilters.department)
          );
        }

        // Filter by job title
        if (appliedFilters.jobTitle) {
          results = results.filter(profile =>
            profile.jobTitles?.some(job => job.title === appliedFilters.jobTitle)
          );
        }

        // Filter by country
        if (appliedFilters.country) {
          results = results.filter(profile =>
            profile.residences?.some(residence => residence.country === appliedFilters.country)
          );
        }

        // Filter by city (case-insensitive partial match)
        if (appliedFilters.city) {
          results = results.filter(profile =>
            profile.residences?.some(residence => 
              residence.city.toLowerCase().includes(appliedFilters.city.toLowerCase())
            )
          );
        }

        setCrewProfiles(results);
        setFilteredProfiles(results);
      } catch (error) {
        console.error('Error fetching crew profiles:', error);
      } finally {
        setLoading(false);
        // Add delay for smooth transition
        setTimeout(() => setIsFiltering(false), 300);
      }
    };

    fetchCrewProfiles();
  }, [appliedFilters]); // Re-run when appliedFilters change

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));

    // Reset dependent filters
    if (filterName === 'department') {
      setFilters(prev => ({ ...prev, jobTitle: '' }));
    }
    if (filterName === 'country') {
      setFilters(prev => ({ ...prev, city: '' }));
    }

    // Instantly update appliedFilters for dropdowns, not for searchQuery
    if (["department", "jobTitle", "country", "availability"].includes(filterName)) {
      setAppliedFilters(prev => ({
        ...prev,
        [filterName]: value,
        // Reset dependent filters in appliedFilters as well
        ...(filterName === 'department' ? { jobTitle: '' } : {}),
        ...(filterName === 'country' ? { city: '' } : {})
      }));
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setAppliedFilters(filters);
    setTimeout(() => setIsSearching(false), 500);
  };

  const clearFilters = () => {
    const emptyFilters = {
      department: '',
      jobTitle: '',
      country: '',
      city: '',
      availability: '',
      searchQuery: ''
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const getAvailableJobTitles = () => {
    if (!filters.department) return [];
    const dept = departments.find(d => d.name === filters.department);
    return dept?.titles || [];
  };

  const getAvailableCities = () => {
    if (!filters.country) return [];
    const country = countries.find(c => c.name === filters.country);
    return country?.cities || [];
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Ultra compact and focused */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-light text-gray-900 tracking-tight animate-slide-up mb-2">
              {t('crew.discoverTalent')}
            </h1>
            <p className="text-sm md:text-base font-light text-gray-600 max-w-xl mx-auto leading-relaxed animate-slide-up-delay">
              {t('crew.discoverSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section - Ultra compact and sleek */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Compact single row with better organization */}
          <div className="flex items-center gap-3">
            {/* Search Box - Compact */}
            <div className="w-48 sm:w-56">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search-crew"
                  name="searchCrew"
                  value={filters.searchQuery || ''}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  placeholder={t('crew.searchPlaceholder')}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all duration-200 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* Filters Group - Compact and organized */}
            <div className="flex items-center gap-2">
              {/* Department Filter */}
              <div className="relative">
                <select
                  id="department-filter"
                  name="department"
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none w-28"
                  aria-label="Filter by department"
                >
                  <option value="">Dept</option>
                  {departments.map(dept => (
                    <option key={dept.name} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                  <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Job Title Filter */}
              <div className="relative">
                <select
                  id="role-filter"
                  name="role"
                  value={filters.jobTitle}
                  onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                  className="pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed w-28"
                  disabled={!filters.department}
                  aria-label="Filter by role"
                  aria-disabled={!filters.department}
                >
                  <option value="">Role</option>
                  {getAvailableJobTitles().map(title => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                  <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Country Filter */}
              <div className="relative">
                <select
                  id="country-filter"
                  name="country"
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none w-28"
                  aria-label="Filter by country"
                  autoComplete="country"
                >
                  <option value="">Country</option>
                  {countries.map(country => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                  <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="relative">
                <select
                  id="availability-filter"
                  name="availability"
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none w-28"
                  aria-label="Filter by availability"
                >
                  <option value="">Status</option>
                  <option value="available">{t('crew.available')}</option>
                  <option value="soon">{t('crew.soon')}</option>
                  <option value="unavailable">{t('crew.unavailable')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                  <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={clearFilters}
                className="px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear
              </button>
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching}
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section - Enhanced */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Only show results count after a search */}
          {Object.values(appliedFilters).some(f => f) && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-sm font-medium text-gray-600">
                    {filteredProfiles.length} {filteredProfiles.length === 1 ? 'talent found' : 'talents found'}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {t('crew.showingResults', 'Showing results matching your filters')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-50 mb-6">
                  <svg className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('crew.noResults')}</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {t('crew.tryAdjusting')}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {t('crew.clearFilters')}
                </button>
              </div>
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              {filteredProfiles.map((profile, index) => (
                <div 
                  key={profile.uid}
                  className={`transform transition-all duration-300 ${isFiltering ? 'scale-95' : 'scale-100 hover:scale-[1.02]'}`}
                  style={{
                    transitionDelay: isFiltering ? '0ms' : `${Math.min(index * 30, 300)}ms`,
                    opacity: isFiltering ? 0.7 : 1
                  }}
                >
                  <CrewProfileCard 
                    profile={profile}
                    index={index}
                    isFiltering={isFiltering}
                    currentUserId={currentUserId}
                  />
                </div>
              ))}
            </div>
          )}
          
          {filteredProfiles.length > 0 && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {t('crew.loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <div className="h-16 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                <div className="h-14 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Skeleton */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="mb-12">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 animate-pulse">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-20 mb-6"></div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Crew Profile Card Component with Animations
const CrewProfileCard: React.FC<{ 
  profile: CrewProfile; 
  index: number;
  isFiltering: boolean;
  currentUserId: string;
}> = ({ profile, index, isFiltering, currentUserId }) => {
  const primaryJob = profile.jobTitles[0];
  const primaryResidence = profile.residences[0];

  return (
    <div 
      className={`group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-700 cursor-pointer border border-gray-100 hover:border-gray-200 animate-card-entrance`}
      style={{
        animationDelay: `${index * 100}ms`,
        transform: isFiltering ? 'scale(0.95) opacity(0.5)' : 'scale(1) opacity(1)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="flex items-start gap-6 mb-6">
        {profile.profileImageUrl ? (
          <img
            src={profile.profileImageUrl}
            alt={profile.name}
            className="w-20 h-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <span className="text-2xl text-gray-500 font-light">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide group-hover:text-black transition-all duration-300 group-hover:scale-105">
            {profile.name}
          </h3>
          {primaryJob && (
            <p className="text-sm font-medium text-gray-600 mb-1 tracking-wide transition-colors duration-300 group-hover:text-gray-800">
              {primaryJob.title}
            </p>
          )}
          {primaryResidence && (
            <p className="text-sm font-light text-gray-500 tracking-wide transition-colors duration-300 group-hover:text-gray-600">
              📍 {primaryResidence.city}, {primaryResidence.country}
            </p>
          )}
        </div>
      </div>

      {/* Remove bio section to standardize card sizes */}
      {/* {profile.bio && (
        <p className="text-gray-600 font-light leading-relaxed mb-6 line-clamp-3 transition-colors duration-300 group-hover:text-gray-700">
          {profile.bio}
        </p>
      )} */}

      {profile.availability && (
        <div className="mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all duration-300 group-hover:scale-105 ${
            profile.availability === 'available' 
              ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
              : profile.availability === 'soon'
              ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200'
              : 'bg-red-100 text-red-800 group-hover:bg-red-200'
          }`}>
            {profile.availability === 'available' ? 'Available' :
             profile.availability === 'soon' ? 'Available Soon' : 'Unavailable'}
          </span>
        </div>
      )}

      {/* Follow Button - Only show if user is logged in and not viewing their own profile */}
      {currentUserId && currentUserId !== profile.uid && (
        <div className="mb-6">
          <FollowButton 
            currentUserId={currentUserId}
            targetUserId={profile.uid}
            size="sm"
            className="w-full"
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm font-light text-gray-500 tracking-wide transition-colors duration-300 group-hover:text-gray-600">
          {profile.projects?.length || 0} projects
        </div>
        <a
          href={`/resume/${profile.uid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-900 hover:text-black transition-all duration-300 tracking-wide group-hover:underline group-hover:scale-105"
        >
          View Profile →
        </a>
      </div>
    </div>
  );
};

export default ProducerView; 