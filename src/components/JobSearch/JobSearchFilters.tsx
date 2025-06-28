import React from 'react';
import { JobSearchFilter } from '../../types/JobApplication';

interface JobSearchFiltersProps {
  filters: JobSearchFilter;
  onFilterChange: (filters: JobSearchFilter) => void;
}

const JobSearchFilters: React.FC<JobSearchFiltersProps> = ({ filters, onFilterChange }) => {
  const departments = [
    'Camera',
    'Sound',
    'Lighting',
    'Art',
    'Costume',
    'Makeup',
    'Hair',
    'Production',
    'Post-Production',
    'VFX',
    'Stunts',
    'Transportation',
    'Catering',
    'Other'
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive Level' }
  ];

  const contractTypes = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];

  const projectDurations = [
    { value: 'short_term', label: 'Short Term (< 3 months)' },
    { value: 'long_term', label: 'Long Term (3+ months)' },
    { value: 'ongoing', label: 'Ongoing' }
  ];

  const teamSizes = [
    { value: 'small', label: 'Small (1-10 people)' },
    { value: 'medium', label: 'Medium (11-50 people)' },
    { value: 'large', label: 'Large (50+ people)' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const handleFilterChange = (key: keyof JobSearchFilter, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-light text-gray-900 tracking-wide">Filters</h3>
      
      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Department
        </label>
        <select
          value={filters.department || ''}
          onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Experience Level
        </label>
        <select
          value={filters.experienceLevel || ''}
          onChange={(e) => handleFilterChange('experienceLevel', e.target.value || undefined)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
        >
          <option value="">All Levels</option>
          {experienceLevels.map(level => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Contract Type
        </label>
        <select
          value={filters.contractType || ''}
          onChange={(e) => handleFilterChange('contractType', e.target.value || undefined)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
        >
          <option value="">All Types</option>
          {contractTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Location
        </label>
        <input
          type="text"
          placeholder="Enter location..."
          value={filters.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Salary Range
        </label>
        <div className="grid grid-cols-3 gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.salaryMin || ''}
            onChange={(e) => handleFilterChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
          />
          <span className="text-center text-sm font-light text-gray-500">to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.salaryMax || ''}
            onChange={(e) => handleFilterChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Project Duration
        </label>
        <select
          value={filters.projectDuration || ''}
          onChange={(e) => handleFilterChange('projectDuration', e.target.value || undefined)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
        >
          <option value="">Any Duration</option>
          {projectDurations.map(duration => (
            <option key={duration.value} value={duration.value}>{duration.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Team Size
        </label>
        <select
          value={filters.teamSize || ''}
          onChange={(e) => handleFilterChange('teamSize', e.target.value || undefined)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
        >
          <option value="">Any Size</option>
          {teamSizes.map(size => (
            <option key={size.value} value={size.value}>{size.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Job Type
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filters.isRemote || false}
              onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
              className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
            />
            <span className="text-sm font-light text-gray-900">Remote Work</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filters.isUrgent || false}
              onChange={(e) => handleFilterChange('isUrgent', e.target.checked)}
              className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
            />
            <span className="text-sm font-light text-gray-900">Urgent Positions</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filters.hasBenefits || false}
              onChange={(e) => handleFilterChange('hasBenefits', e.target.checked)}
              className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
            />
            <span className="text-sm font-light text-gray-900">Has Benefits</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filters.travelRequired || false}
              onChange={(e) => handleFilterChange('travelRequired', e.target.checked)}
              className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
            />
            <span className="text-sm font-light text-gray-900">Travel Required</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Posted Date
        </label>
        <select
          value={filters.datePosted || 'all'}
          onChange={(e) => handleFilterChange('datePosted', e.target.value)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
        >
          {dateOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Application Status Filter (for applicants) */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
          Application Status
        </label>
        <select
          value={filters.applicationStatus || ''}
          onChange={(e) => handleFilterChange('applicationStatus', e.target.value || undefined)}
          className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02] text-sm"
        >
          <option value="">All Applications</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interviewed">Interviewed</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
};

export default JobSearchFilters; 