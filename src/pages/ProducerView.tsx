import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { ProjectEntry } from '../types/ProjectEntry';

interface Residence {
  country: string;
  city: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
}

interface CrewProfile {
  uid: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
  projects?: ProjectEntry[];
  education?: string[];
  contactInfo?: ContactInfo;
  otherInfo?: string;
  isPublished: boolean;
  availability?: 'available' | 'unavailable' | 'soon';
}

interface JobDepartment {
  name: string;
  titles: string[];
}

interface Country {
  name: string;
  cities: string[];
}

const ProducerView: React.FC = () => {
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<CrewProfile[]>([]);
  const [departments, setDepartments] = useState<JobDepartment[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    department: '',
    jobTitle: '',
    country: '',
    city: '',
    availability: ''
  });

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
        if (filters.availability) {
          q = query(q, where('availability', '==', filters.availability));
        }

        const snapshot = await getDocs(q);
        let results = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as CrewProfile[];

        // Client-side filtering for complex fields
        // Filter by department
        if (filters.department) {
          results = results.filter(profile =>
            profile.jobTitles?.some(job => job.department === filters.department)
          );
        }

        // Filter by job title
        if (filters.jobTitle) {
          results = results.filter(profile =>
            profile.jobTitles?.some(job => job.title === filters.jobTitle)
          );
        }

        // Filter by country
        if (filters.country) {
          results = results.filter(profile =>
            profile.residences?.some(residence => residence.country === filters.country)
          );
        }

        // Filter by city (case-insensitive partial match)
        if (filters.city) {
          results = results.filter(profile =>
            profile.residences?.some(residence => 
              residence.city.toLowerCase().includes(filters.city.toLowerCase())
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
  }, [filters]); // Re-run when filters change

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
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      jobTitle: '',
      country: '',
      city: '',
      availability: ''
    });
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
              Discover
            </h1>
            <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
              Creative Talent
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
              Connect with exceptional crew members from around the world. 
              Find the perfect collaborators for your next project.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <h3 className="text-2xl font-light text-gray-900 tracking-wide">Refine Search</h3>
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-all duration-300 tracking-wide uppercase hover:scale-105"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 animate-fade-in-delay">
            {/* Department Filter */}
            <div className="animate-slide-up-filter">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.name} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Title Filter */}
            <div className="animate-slide-up-filter-delay-1">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Role
              </label>
              <select
                value={filters.jobTitle}
                onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                disabled={!filters.department}
              >
                <option value="">All Roles</option>
                {getAvailableJobTitles().map(title => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div className="animate-slide-up-filter-delay-2">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Country
              </label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div className="animate-slide-up-filter-delay-3">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Enter city name"
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                list="cities-list"
              />
              {filters.country && (
                <datalist id="cities-list">
                  {getAvailableCities().map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              )}
            </div>

            {/* Availability Filter */}
            <div className="animate-slide-up-filter-delay-4">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="soon">Available Soon</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-light text-gray-900 tracking-wide">
                {filteredProfiles.length} {filteredProfiles.length === 1 ? 'Talent' : 'Talents'} Found
              </h3>
              {Object.values(filters).some(f => f) && (
                <div className="text-sm font-light text-gray-500 tracking-wide">
                  Showing filtered results
                </div>
              )}
            </div>
          </div>

          {/* Crew Profiles Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🔍</div>
              <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                No talent found
              </h3>
              <p className="text-lg font-light text-gray-500 max-w-md mx-auto leading-relaxed">
                Try adjusting your search criteria or check back later for new profiles
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-500 ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              {filteredProfiles.map((profile, index) => (
                <CrewProfileCard 
                  key={profile.uid} 
                  profile={profile} 
                  index={index}
                  isFiltering={isFiltering}
                />
              ))}
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
}> = ({ profile, index, isFiltering }) => {
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
              {primaryJob.department} • {primaryJob.title}
            </p>
          )}
          {primaryResidence && (
            <p className="text-sm font-light text-gray-500 tracking-wide transition-colors duration-300 group-hover:text-gray-600">
              📍 {primaryResidence.city}, {primaryResidence.country}
            </p>
          )}
        </div>
      </div>

      {profile.bio && (
        <p className="text-gray-600 font-light leading-relaxed mb-6 line-clamp-3 transition-colors duration-300 group-hover:text-gray-700">
          {profile.bio}
        </p>
      )}

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