import React from 'react';
import { JobSearchFilter } from '../../types/JobApplication';
import './JobSearchFilters.scss';

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
    <div className="job-search-filters">
      <h3>Filters</h3>
      
      <div className="filter-section">
        <h4>Department</h4>
        <select
          value={filters.department || ''}
          onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
          className="filter-select"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h4>Experience Level</h4>
        <select
          value={filters.experienceLevel || ''}
          onChange={(e) => handleFilterChange('experienceLevel', e.target.value || undefined)}
          className="filter-select"
        >
          <option value="">All Levels</option>
          {experienceLevels.map(level => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h4>Location</h4>
        <input
          type="text"
          placeholder="Enter location..."
          value={filters.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
          className="filter-input"
        />
      </div>

      <div className="filter-section">
        <h4>Salary Range</h4>
        <div className="salary-range">
          <input
            type="number"
            placeholder="Min"
            value={filters.salaryMin || ''}
            onChange={(e) => handleFilterChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
            className="salary-input"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.salaryMax || ''}
            onChange={(e) => handleFilterChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
            className="salary-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Job Type</h4>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.isRemote || false}
              onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
            />
            Remote Work
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.isUrgent || false}
              onChange={(e) => handleFilterChange('isUrgent', e.target.checked)}
            />
            Urgent Positions
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h4>Posted Date</h4>
        <select
          value={filters.datePosted || 'all'}
          onChange={(e) => handleFilterChange('datePosted', e.target.value)}
          className="filter-select"
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