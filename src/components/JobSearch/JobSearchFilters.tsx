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
    </div>
  );
};

export default JobSearchFilters; 