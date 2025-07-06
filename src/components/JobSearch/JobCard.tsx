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
      className={cn(
        'group transition-all duration-200 hover:shadow-lg overflow-hidden',
        'hover:-translate-y-0.5',
        className
      )}
      hoverable
    >
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {job.title}
              </h3>
              {job.isUrgent && (
                <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full whitespace-nowrap">
                  Urgent
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1" />
                {job.department}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {job.location}
              </span>
              {job.isRemote && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-blue-600">Remote</span>
                </>
              )}
            </div>
          </div>
          
          {onSave && (
            <button
              type="button"
              className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              onClick={handleSave}
              aria-label={isSaved ? 'Unsave job' : 'Save job'}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-yellow-500 fill-current" />
              ) : (
                <Bookmark className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
        
        {/* Match score */}
        {showMatchScore && job.matchScore !== undefined && (
          <div className="absolute top-2 right-2">
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              getMatchScoreColor(job.matchScore)
            )}>
              {Math.round(job.matchScore * 100)}% Match
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardBody className="py-3">
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {job.description}
        </p>
        
        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="font-medium text-gray-700 mr-1">Salary:</span>
            <span>{formatSalary(job.salary)}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="font-medium text-gray-700 mr-1">Posted:</span>
            <span>{postedDate}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="font-medium text-gray-700 mr-1">Type:</span>
            <span className={cn('text-xs px-2 py-0.5 rounded-full', contractType.color)}>
              {contractType.text}
            </span>
          </div>
          
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <span className="font-medium text-gray-700 mr-1">Level:</span>
            <span className={cn('text-xs px-2 py-0.5 rounded-full', experienceLevel.color)}>
              {experienceLevel.text}
            </span>
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
      
      <CardFooter className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleApply}
          >
            <ExternalLink className="w-4 h-4" />
            Apply Now
          </Button>
          
          <Link 
            to={`/jobs/${job.id}`}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors"
          >
            View Details
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard; 