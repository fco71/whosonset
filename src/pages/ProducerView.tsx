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
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading crew profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Crew Directory</h1>
          <p className="text-gray-400">
            Browse and filter crew profiles to find the perfect team for your project
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Clear All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
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
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <select
                value={filters.jobTitle}
                onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                disabled={!filters.department}
              >
                <option value="">All Titles</option>
                {getAvailableJobTitles().map(title => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
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
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Enter city name"
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
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
            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Availability</option>
                <option value="available">Available</option>
                <option value="soon">Available Soon</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Results ({filteredProfiles.length} crew members)
            </h2>
            {Object.values(filters).some(f => f) && (
              <div className="text-sm text-gray-400">
                Showing filtered results
              </div>
            )}
          </div>
        </div>

        {/* Crew Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No crew members found</h3>
            <p className="text-gray-400">
              Try adjusting your filters or check back later for new profiles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile) => (
              <CrewProfileCard key={profile.uid} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Crew Profile Card Component
const CrewProfileCard: React.FC<{ profile: CrewProfile }> = ({ profile }) => {
  const primaryJob = profile.jobTitles[0];
  const primaryResidence = profile.residences[0];

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer">
      <div className="flex items-start gap-4 mb-4">
        {profile.profileImageUrl ? (
          <img
            src={profile.profileImageUrl}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-2xl text-gray-400">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{profile.name}</h3>
          {primaryJob && (
            <p className="text-blue-400 text-sm">
              {primaryJob.department} • {primaryJob.title}
            </p>
          )}
          {primaryResidence && (
            <p className="text-gray-400 text-sm">
              📍 {primaryResidence.city}, {primaryResidence.country}
            </p>
          )}
        </div>
      </div>

      {profile.bio && (
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {profile.bio}
        </p>
      )}

      {profile.availability && (
        <div className="mb-4">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            profile.availability === 'available' 
              ? 'bg-green-900 text-green-300' 
              : profile.availability === 'soon'
              ? 'bg-yellow-900 text-yellow-300'
              : 'bg-red-900 text-red-300'
          }`}>
            {profile.availability === 'available' ? '✅ Available' :
             profile.availability === 'soon' ? '⏰ Available Soon' : '❌ Unavailable'}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          {profile.projects?.length || 0} projects
        </div>
        <a
          href={`/resume/${profile.uid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          View Resume →
        </a>
      </div>
    </div>
  );
};

export default ProducerView; 