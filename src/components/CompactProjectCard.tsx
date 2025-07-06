import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types/Project';
import { Film, Calendar, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import Card, { CardBody, CardTitle } from './ui/Card';

interface CompactProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

/**
 * Get status badge styles based on project status
 */
const getStatusStyles = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string }> = {
    'in_production': { bg: 'bg-green-100', text: 'text-green-800' },
    'production': { bg: 'bg-green-100', text: 'text-green-800' },
    'pre_production': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'pre-production': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'post_production': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'post-production': { bg: 'bg-purple-100', text: 'text-purple-800' },
    'development': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'completed': { bg: 'bg-green-100', text: 'text-green-800' },
    'cancelled': { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const normalizedStatus = status.toLowerCase().replace('-', '_');
  return statusMap[normalizedStatus] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

/**
 * Format status text for display
 */
const formatStatusText = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CompactProjectCard: React.FC<CompactProjectCardProps> = ({ 
  project, 
  onClick,
  className = '' 
}) => {
  const navigate = useNavigate();
  const statusStyles = project.status ? getStatusStyles(project.status) : null;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick();
      } else {
        navigate(`/projects/${project.id}`);
      }
    }
  };

  // Get primary production location
  const primaryLocation = project.productionLocations?.[0]?.city 
    ? `${project.productionLocations[0].city}, ${project.productionLocations[0].country || project.country}`
    : project.country;

  return (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-md overflow-hidden',
        'hover:-translate-y-0.5',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.projectName} project details`}
    >
      <div className="flex flex-col h-full">
        {/* Cover Image */}
        <div className="relative h-32 bg-gray-100 overflow-hidden">
          {project.coverImageUrl ? (
            <img
              src={project.coverImageUrl}
              alt={`${project.projectName} cover`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-project.jpg';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <Film className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <CardBody className="flex-1 flex flex-col p-3">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold mb-1 line-clamp-2">
              {project.projectName}
            </CardTitle>
            
            {/* Production Company */}
            {project.productionCompany && (
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Film size={12} className="mr-1 text-gray-400" />
                <span className="truncate">{project.productionCompany}</span>
              </div>
            )}
            
            {/* Location */}
            {primaryLocation && (
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <MapPin size={12} className="mr-1 text-gray-400" />
                <span className="truncate">{primaryLocation}</span>
              </div>
            )}
            
            {/* Logline */}
            {project.logline && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {project.logline}
              </p>
            )}
          </div>
          
          {/* Year */}
          {project.startDate && (
            <div className="flex items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
              <Calendar size={12} className="mr-1 text-gray-400" />
              <span>{new Date(project.startDate).getFullYear()}</span>
            </div>
          )}
        </CardBody>
        
        {/* Status Badge */}
        {project.status && (
          <div 
            className={cn(
              'absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium',
              statusStyles?.bg,
              statusStyles?.text
            )}
          >
            {formatStatusText(project.status)}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CompactProjectCard;
