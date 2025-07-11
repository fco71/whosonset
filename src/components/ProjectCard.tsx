import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, Film, Calendar, Bookmark, BookmarkCheck, ImageOff } from 'lucide-react';
import Card, { CardHeader, CardBody, CardFooter, CardTitle, CardDescription } from "./ui/Card";
import { Button } from "./ui/Button";

type ProjectStatus = 'in_production' | 'pre_production' | 'post_production' | 'development' | 'completed' | 'cancelled' | string;

interface ProjectCardProps {
  id: string;
  projectName: string;
  productionCompany?: string;
  country?: string;
  productionLocations?: Array<{ country: string; city?: string }>;
  status: ProjectStatus;
  summary?: string;
  director?: string;
  producer?: string;
  genres?: string[];
  coverImageUrl?: string;
  startDate?: string;
  endDate?: string;
  showDetails?: boolean;
  onBookmark?: (projectId: string, isBookmarked: boolean) => void;
  isBookmarked?: boolean;
  className?: string;
}

/**
 * Format a date string to a more readable format
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'TBD';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Get status badge styles based on project status
 */
const getStatusStyles = (status: ProjectStatus) => {
  const statusMap: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    'in_production': { bg: 'bg-green-100', text: 'text-green-800', icon: <Film size={14} /> },
    'production': { bg: 'bg-green-100', text: 'text-green-800', icon: <Film size={14} /> },
    'pre_production': { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={14} /> },
    'pre-production': { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={14} /> },
    'post_production': { bg: 'bg-purple-100', text: 'text-purple-800', icon: <Film size={14} /> },
    'post-production': { bg: 'bg-purple-100', text: 'text-purple-800', icon: <Film size={14} /> },
    'development': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock size={14} /> },
    'completed': { bg: 'bg-green-100', text: 'text-green-800', icon: <Calendar size={14} /> },
    'cancelled': { bg: 'bg-red-100', text: 'text-red-800', icon: <Clock size={14} /> },
  };

  const normalizedStatus = status.toLowerCase().replace('-', '_');
  return statusMap[normalizedStatus] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: <Clock size={14} /> };
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

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  projectName,
  productionCompany,
  country,
  productionLocations,
  status = 'development',
  summary,
  director,
  producer,
  genres = [],
  coverImageUrl: initialCoverImageUrl,
  startDate,
  endDate,
  showDetails = false,
  onBookmark,
  isBookmarked = false,
  className = '',
}) => {
  // State to manage the cover image URL with error handling
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2; // Maximum number of retry attempts

  // Track the last processed URL to prevent duplicate processing
  const lastProcessedUrlRef = useRef<string | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation and other component logic
  const navigate = useNavigate();
  const statusStyles = getStatusStyles(status);
  
  // Get primary production location
  const primaryLocation = productionLocations?.[0]?.city 
    ? `${productionLocations[0].city}, ${productionLocations[0].country || country}`
    : country;

  // Handle card click
  const handleCardClick = () => {
    navigate(`/projects/${id}`);
  };

  // Handle bookmark click
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(id, !isBookmarked);
  };

  // Handle image URL changes and validate
  useEffect(() => {
    // Clear any pending retry timeouts when URL changes
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Skip if no URL
    if (!initialCoverImageUrl) {
      setCoverImageUrl(null);
      setImageError(true);
      return;
    }

    // If URL hasn't changed, no need to reprocess
    if (initialCoverImageUrl === lastProcessedUrlRef.current) {
      return;
    }

    // Reset retry count when URL changes
    setRetryCount(0);
    
    // Update the last processed URL
    lastProcessedUrlRef.current = initialCoverImageUrl;
    loadImage(initialCoverImageUrl);
  }, [initialCoverImageUrl]);

  // Handle retry logic when image loading fails
  useEffect(() => {
    if (retryCount > 0 && retryCount <= maxRetries) {
      console.log(`[ProjectCard] Retrying image load (attempt ${retryCount}/${maxRetries})`);
      if (initialCoverImageUrl) {
        loadImage(initialCoverImageUrl, true);
      }
    }
  }, [retryCount]);

  const loadImage = (url: string, isRetry = false) => {
    // For blob URLs, we'll use a placeholder instead
    if (url.startsWith('blob:')) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Using placeholder for blob URL');
      }
      setCoverImageUrl(null);
      setImageError(true);
      return;
    }

    // For non-blob URLs, use them directly
    setCoverImageUrl(url);
    setImageError(false);

    // Preload the image to check if it's valid
    const img = new Image();
    
    // Add a timestamp to the URL to prevent caching issues
    const timestamp = new Date().getTime();
    const urlWithTimestamp = url.includes('?') 
      ? `${url}&t=${timestamp}` 
      : `${url}?t=${timestamp}`;
    
    img.src = urlWithTimestamp;
    
    img.onload = () => {
      // If we're still on the same URL, mark as loaded
      if (url === lastProcessedUrlRef.current) {
        setImageError(false);
        setRetryCount(0); // Reset retry count on success
      }
    };
    
    img.onerror = () => {
      if (url === lastProcessedUrlRef.current) {
        console.warn(`[ProjectCard] Failed to load image: ${url}`);
        
        // If this wasn't a retry and we haven't exceeded max retries, schedule a retry
        if (!isRetry && retryCount < maxRetries) {
          console.log(`[ProjectCard] Scheduling retry in 1 second...`);
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000);
        } else {
          // If we've exhausted retries or this was a retry attempt, show error
          setCoverImageUrl(null);
          setImageError(true);
        }
      }
    };
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.warn(`[ProjectCard] Image error:`, {
      src: target.src,
      currentSrc: target.currentSrc,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
      complete: target.complete,
      width: target.width,
      height: target.height
    });
    
    // Only update state if this is the current URL we're trying to load
    if (coverImageUrl && target.src.includes(coverImageUrl)) {
      setImageError(true);
      
      // If we haven't retried yet, schedule a retry
      if (retryCount < maxRetries) {
        console.log(`[ProjectCard] Scheduling retry from onError handler...`);
        setRetryCount(prev => prev + 1);
      }
    }
  };

  return (
    <Card 
      className={`card-modern overflow-hidden ${className}`}
      hoverable
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${projectName}`}
      onKeyDown={e => { 
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {coverImageUrl && !imageError ? (
          <img
            key={coverImageUrl} // Force re-render when URL changes
            src={coverImageUrl}
            alt={`${projectName} cover`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={handleImageError}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center text-center p-4">
            <ImageOff size={32} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {retryCount > 0 && retryCount <= maxRetries 
                ? `Loading image... (${retryCount}/${maxRetries})` 
                : 'Image not available'}
            </p>
            <p className="text-xs text-gray-500">
              {initialCoverImageUrl ? 'Failed to load image' : 'No image available'}
            </p>
          </div>
        )}
        
        {/* Status Badge */}
        <div 
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusStyles.bg} ${statusStyles.text}`}
        >
          {statusStyles.icon}
          <span>{formatStatusText(status)}</span>
        </div>
        
        {/* Bookmark Button */}
        {onBookmark && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors"
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-yellow-500" fill="currentColor" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-400" />
            )}
          </Button>
        )}
      </div>

      {/* Card Content */}
      <CardBody className="flex-1 flex flex-col">
        <div className="flex-1">
          <CardTitle className="mb-2 line-clamp-2">{projectName}</CardTitle>
          
          {/* Production Company */}
          {productionCompany && (
            <CardDescription className="flex items-center text-sm mb-3">
              <Film size={14} className="mr-1.5 text-gray-400" />
              {productionCompany}
            </CardDescription>
          )}
          
          {/* Location */}
          {primaryLocation && (
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin size={14} className="mr-1.5 text-gray-400" />
              {primaryLocation}
            </div>
          )}
          
          {/* Summary */}
          {summary && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{summary}</p>
          )}
          
          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 mb-4">
              {genres.slice(0, 3).map((genre, index) => (
                <span
                  key={`${genre}-${index}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {genre}
                </span>
              ))}
              {genres.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{genres.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <CardFooter className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between w-full">
            {/* Dates */}
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={12} className="mr-1" />
              <span>
                {startDate ? formatDate(startDate) : 'TBD'} - {endDate ? formatDate(endDate) : 'TBD'}
              </span>
            </div>
            
            {/* View Details Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              View Details →
            </Button>
          </div>
        </CardFooter>
      </CardBody>
    </Card>
  );
};

export default ProjectCard;
