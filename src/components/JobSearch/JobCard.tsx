import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JobPosting } from '../../types/JobApplication';

interface JobCardProps {
  job: JobPosting & { matchScore?: number };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  showMatchScore?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onSave, 
  showMatchScore = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const formatSalary = (salary: any) => {
    if (!salary) return 'Salary not specified';
    const { min, max, currency = 'USD' } = salary;
    if (min === max) {
      return `${currency} ${min.toLocaleString()}`;
    }
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return dateObj.toLocaleDateString();
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-blue-100 text-blue-800';
      case 'mid': return 'bg-green-100 text-green-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-green-100 text-green-800';
      case 'part_time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'freelance': return 'bg-orange-100 text-orange-800';
      case 'internship': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-[1.02] border border-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-light text-gray-900 tracking-wide group-hover:text-gray-700 transition-colors">
              {job.title}
            </h3>
            {job.isUrgent && (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full tracking-wider">
                Urgent
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
              {job.department}
            </span>
            <span className="text-sm font-light text-gray-600">
              📍 {job.location}
            </span>
            {job.isRemote && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full tracking-wider">
                Remote
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
          {job.description.length > 150 
            ? `${job.description.substring(0, 150)}...` 
            : job.description
          }
        </p>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Salary:</span>
            <span className="text-sm font-light text-gray-900">{formatSalary(job.salary)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Start Date:</span>
            <span className="text-sm font-light text-gray-900">{new Date(job.startDate).toLocaleDateString()}</span>
          </div>

          {job.endDate && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">End Date:</span>
              <span className="text-sm font-light text-gray-900">{new Date(job.endDate).toLocaleDateString()}</span>
            </div>
          )}

          {job.deadline && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Deadline:</span>
              <span className="text-sm font-light text-red-600">
                {new Date(job.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {job.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full tracking-wider">
              {tag}
            </span>
          ))}
          {job.tags.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full tracking-wider">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm font-light text-gray-500">
            <span>
              {job.applicationsCount} application{job.applicationsCount !== 1 ? 's' : ''}
            </span>
            <span>Posted {formatDate(job.postedAt)}</span>
          </div>
          
          <div className="flex gap-3">
            <Link 
              to={`/jobs/${job.id}`} 
              className="px-4 py-2 bg-gray-100 text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 text-sm"
            >
              View Details
            </Link>
            <Link 
              to={`/jobs/${job.id}/apply`} 
              className="px-4 py-2 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 text-sm"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 