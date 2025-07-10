import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JobPosting } from '../../types/JobApplication';
import { cn } from '../../lib/utils';
import Card, { CardHeader, CardBody, CardFooter, CardTitle, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, MapPin, Briefcase, Clock, DollarSign, Tag, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

interface JobCardProps {
  job: JobPosting & { matchScore?: number };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  showMatchScore?: boolean;
  className?: string;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onSave, 
  showMatchScore = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Format date to relative time
  const formatRelativeTime = (date: Date | string | any) => {
    if (!date) return 'N/A';
    
    const dateObj = date?.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return dateObj.toLocaleDateString();
  };

  // Format salary range
  const formatSalary = (salary: { min: number; max: number; currency?: string } | undefined) => {
    if (!salary) return 'Salary not specified';
    const { min, max, currency = 'USD' } = salary;
    if (min === max) return `${currency} ${min.toLocaleString()}`;
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  // Get color classes based on match score
  const getMatchScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500 text-white';
    if (score >= 0.6) return 'bg-blue-500 text-white';
    if (score >= 0.4) return 'bg-yellow-500 text-white';
    return 'bg-gray-200 text-gray-800';
  };

  // Get experience level display text and color
  const getExperienceLevel = (level: string) => {
    const levels: Record<string, { text: string; color: string }> = {
      entry: { text: 'Entry Level', color: 'bg-blue-100 text-blue-800' },
      mid: { text: 'Mid Level', color: 'bg-green-100 text-green-800' },
      senior: { text: 'Senior Level', color: 'bg-purple-100 text-purple-800' },
      executive: { text: 'Executive', color: 'bg-red-100 text-red-800' },
    };
    return levels[level] || { text: level, color: 'bg-gray-100 text-gray-800' };
  };

  // Get contract type display text and color
  const getContractType = (type: string) => {
    const types: Record<string, { text: string; color: string }> = {
      full_time: { text: 'Full-time', color: 'bg-green-100 text-green-800' },
      part_time: { text: 'Part-time', color: 'bg-blue-100 text-blue-800' },
      contract: { text: 'Contract', color: 'bg-purple-100 text-purple-800' },
      freelance: { text: 'Freelance', color: 'bg-orange-100 text-orange-800' },
      internship: { text: 'Internship', color: 'bg-yellow-100 text-yellow-800' },
    };
    return types[type] || { text: type, color: 'bg-gray-100 text-gray-800' };
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    onSave?.(job.id);
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply?.(job.id);
  };

  const experienceLevel = getExperienceLevel(job.experienceLevel || '');
  const contractType = getContractType(job.contractType || '');
  const postedDate = formatRelativeTime(job.postedAt);
  const deadlineDate = job.deadline ? formatRelativeTime(job.deadline) : null;

  return (
    <Card 
      variant="elevated"
      className={cn(
        'overflow-hidden border border-gray-100',
        'transition-all duration-200',
        className
      )}
      hoverable
    >
      <CardHeader className="relative pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {job.title}
              </h3>
              {job.isUrgent && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Urgent
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{job.department}</span>
              </span>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </span>
              {job.isRemote && (
                <>
                  <span className="text-gray-300 hidden sm:inline">•</span>
                  <span className="inline-flex items-center text-blue-600">
                    <span className="w-1 h-1 rounded-full bg-blue-400 mr-1.5"></span>
                    Remote
                  </span>
                </>
              )}
            </div>
          </div>
          
          {onSave && (
            <button
              type="button"
              className="h-8 w-8 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
              onClick={handleSave}
              aria-label={isSaved ? 'Unsave job' : 'Save job'}
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-blue-600 fill-current" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        
        {/* Match score */}
        {showMatchScore && job.matchScore !== undefined && (
          <div className="absolute -top-2 -right-2">
            <span className={cn(
              'inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full shadow-sm',
              getMatchScoreColor(job.matchScore)
            )}>
              {Math.round(job.matchScore * 100)}% Match
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardBody className="py-4">
        {/* Description */}
        <p className="text-gray-600 mb-5 line-clamp-3">
          {job.description}
        </p>
        
        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-start">
            <div className="bg-blue-50 p-1.5 rounded-md mr-3 flex-shrink-0">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-500 text-xs uppercase tracking-wider mb-0.5">Salary</div>
              <div className="text-gray-900">{formatSalary(job.salary)}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-50 p-1.5 rounded-md mr-3 flex-shrink-0">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-500 text-xs uppercase tracking-wider mb-0.5">Posted</div>
              <div className="text-gray-900">{postedDate}</div>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-50 p-1.5 rounded-md mr-3 flex-shrink-0">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-500 text-xs uppercase tracking-wider mb-0.5">Type</div>
              <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', contractType.color)}>
                {contractType.text}
              </span>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-50 p-1.5 rounded-md mr-3 flex-shrink-0">
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-500 text-xs uppercase tracking-wider mb-0.5">Level</div>
              <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', experienceLevel.color)}>
                {experienceLevel.text}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {job.tags.slice(0, 4).map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {job.tags.length > 4 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{job.tags.length - 4} more
              </span>
            )}
          </div>
        )}
        
        {/* Deadline */}
        {deadlineDate && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm text-red-600 font-medium">
              <Clock className="w-4 h-4 mr-2" />
              Apply before {deadlineDate}
            </div>
          </div>
        )}
      </CardBody>
      
      <CardFooter className="pt-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between w-full">
          <Button 
            variant="primary"
            size="sm" 
            className="flex items-center gap-2 px-5 h-10"
            onClick={handleApply}
          >
            <span>Apply Now</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          <Link 
            to={`/jobs/${job.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center"
          >
            View details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard; 