import React from 'react';
import { TaskFilterOptions, TaskStatus, TaskPriority } from '../types';
import { Input } from '../../ui/Input';
import Select from '../../ui/Select';
import { Button } from '../../ui/Button';
import { X } from 'lucide-react';

interface TaskFiltersProps {
  filterOptions: TaskFilterOptions;
  onFilterChange: (filters: Partial<TaskFilterOptions>) => void;
  onClearFilters: () => void;
}

const priorityOptions = [
  { value: 'all' as const, label: 'All Priorities' },
  { value: 'low' as const, label: 'Low' },
  { value: 'medium' as const, label: 'Medium' },
  { value: 'high' as const, label: 'High' },
  { value: 'critical' as const, label: 'Critical' },
];

const statusOptions = [
  { value: 'all' as const, label: 'All Statuses' },
  { value: 'pending' as const, label: 'Pending' },
  { value: 'in_progress' as const, label: 'In Progress' },
  { value: 'completed' as const, label: 'Completed' },
  { value: 'cancelled' as const, label: 'Cancelled' },
  { value: 'overdue' as const, label: 'Overdue' },
];

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filterOptions,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = 
    filterOptions.searchTerm ||
    filterOptions.priorities.length > 0 ||
    filterOptions.statuses.length > 0 ||
    filterOptions.assignees.length > 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search tasks
          </label>
          <Input
            id="search"
            type="text"
            placeholder="Search tasks..."
            value={filterOptions.searchTerm || ''}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            value={filterOptions.priorities[0] || 'all'}
            onChange={(e) => {
              const value = e.target.value as TaskPriority | 'all';
              onFilterChange({ 
                priorities: value === 'all' ? [] : [value as TaskPriority] 
              });
            }}
            options={priorityOptions}
            placeholder="Priority"
            className="w-[180px]"
          />

          <Select
            value={filterOptions.statuses[0] || 'all'}
            onChange={(e) => {
              const value = e.target.value as TaskStatus | 'all';
              onFilterChange({ 
                statuses: value === 'all' ? [] : [value as TaskStatus]
              });
            }}
            options={statusOptions}
            placeholder="Status"
            className="w-[180px]"
          />
        </div>
        
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="h-10"
          >
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {filterOptions.searchTerm && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: {filterOptions.searchTerm}
              <button
                type="button"
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                onClick={() => onFilterChange({ searchTerm: '' })}
              >
                <span className="sr-only">Remove search</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          )}
          
          {filterOptions.priorities.length > 0 && filterOptions.priorities.map(priority => (
            <span key={priority} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Priority: {priorityOptions.find(p => p.value === priority)?.label || priority}
              <button
                type="button"
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                onClick={() => onFilterChange({ 
                  priorities: filterOptions.priorities.filter(p => p !== priority) 
                })}
              >
                <span className="sr-only">Remove priority filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}
          
          {filterOptions.statuses.length > 0 && filterOptions.statuses.map(status => (
            <span key={status} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Status: {statusOptions.find(s => s.value === status)?.label || status}
              <button
                type="button"
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                onClick={() => onFilterChange({ 
                  statuses: filterOptions.statuses.filter(s => s !== status) 
                })}
              >
                <span className="sr-only">Remove status filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
