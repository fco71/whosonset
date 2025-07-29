import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, Film, Calendar, Bookmark, BookmarkCheck, ImageOff } from 'lucide-react';
import Card, { CardHeader, CardBody, CardFooter, CardTitle, CardDescription } from "./ui/Card";
import { Button } from "./ui/Button";
import { imageErrorFallback } from '../utilities/imageErrorFallback';
import { useTranslation } from 'react-i18next';

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
    'completed': { bg: 'bg-gray-200', text: 'text-gray-800', icon: <Film size={14} /> },
    'cancelled': { bg: 'bg-red-100', text: 'text-red-800', icon: <Clock size={14} /> },
  };
  return statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: <Clock size={14} /> };
};

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  const { t } = useTranslation();
  const {
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
  } = props;

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
    : country || '';

  // Handle card click
  const handleCardClick = () => {
    navigate(`/projects/${id}`);
  };

  // Handle bookmark click
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent navigation if inside a link
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

  // Get a placeholder image URL based on the project name or genre
  const getPlaceholderImage = (): string => {
    // Use a simple SVG data URL as a placeholder to avoid external dependencies
    const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3E${encodeURIComponent(projectName || 'Project Image')}%3C/text%3E%3C/svg%3E`;
    return placeholderSvg;
  };

  const loadImage = (url: string, isRetry = false) => {
    // Skip if no URL or invalid URL
    if (!url || typeof url !== 'string') {
      setCoverImageUrl(getPlaceholderImage());
      setImageError(true);
      return;
    }

    // Log the exact URL being loaded
    console.log('[ProjectCard] Attempting to load image URL:', url);

    // For blob URLs or invalid URLs, use a placeholder
    if (url.startsWith('blob:') || !url.startsWith('http')) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Using placeholder for invalid or blob URL');
      }
      setCoverImageUrl(getPlaceholderImage());
      setImageError(false);
      return;
    }

    // Set a timeout for image loading (10 seconds)
    const timeoutId = setTimeout(() => {
      console.warn(`[ProjectCard] Image load timed out: ${url}`);
      setCoverImageUrl(getPlaceholderImage());
      setImageError(true);
      // Retry logic
      if (!isRetry && retryCount < maxRetries) {
        console.log(`[ProjectCard] Retrying image load (attempt ${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
      }
    }, 10000);

    // Create a new image object to test loading
    const testImage = new Image();

    // Handle successful load
    testImage.onload = () => {
      clearTimeout(timeoutId);
      setCoverImageUrl(url);
      setImageError(false);
    };

    // Handle image load errors
    testImage.onerror = () => {
      clearTimeout(timeoutId);
      console.warn(`[ProjectCard] Failed to load image: ${url}`);
      setCoverImageUrl(getPlaceholderImage());
      setImageError(true);
      // Retry logic
      if (!isRetry && retryCount < maxRetries) {
        console.log(`[ProjectCard] Retrying image load (attempt ${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
      }
    };

    // Start loading the image
    testImage.src = url;
  };

  const handleImageLoadError = (url: string, isRetry: boolean) => {
    if (url === lastProcessedUrlRef.current) {
      console.warn(`[ProjectCard] Failed to load image: ${url}`);
      
      // If this wasn't a retry and we haven't exceeded max retries, schedule a retry
      if (!isRetry && retryCount < maxRetries) {
        console.log(`[ProjectCard] Scheduling retry in 1 second...`);
        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 1000);
      } else {
        // If we've exhausted retries or this was a retry attempt, use placeholder
        setCoverImageUrl(getPlaceholderImage());
        setImageError(false); // Don't show error state since we have a fallback
      }
    }
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
      // If we haven't retried yet, schedule a retry
      if (retryCount < maxRetries) {
        console.log(`[ProjectCard] Scheduling retry from onError handler...`);
        setRetryCount(prev => prev + 1);
      } else {
        // If we've exhausted retries, use placeholder
        setCoverImageUrl(getPlaceholderImage());
        setImageError(false);
      }
    }
  };

  // Helper to format status text using translations
  const formatStatusText = (status: ProjectStatus) => {
    const statusKey = status.toLowerCase().replace(/-/g, '').replace(/_/g, '');
    switch (statusKey) {
      case 'inproduction':
      case 'production':
        return t('projectStatus.inProduction');
      case 'preproduction':
        return t('projectStatus.preProduction');
      case 'postproduction':
        return t('projectStatus.postProduction');
      case 'development':
        return t('projectStatus.development');
      case 'completed':
        return t('projectStatus.completed');
      case 'cancelled':
        return t('projectStatus.cancelled');
      case 'canceled':
        return t('projectStatus.canceled');
      case 'filming':
        return t('projectStatus.filming');
      default:
        return t('projectStatus.unknown');
    }
  };

  const formatDateWithFallback = (dateString?: string): string => {
    if (!dateString) return t('projectStatus.tbd');
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col ${className}`}
      style={{ padding: 20, minHeight: 340, maxWidth: 370, margin: 'auto', boxSizing: 'border-box' }}
      hoverable
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${projectName || 'Untitled Project'}`}
      onKeyDown={e => { 
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Cover Image with subtle project name overlay */}
      <div style={{ width: '100%', height: 180, position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 12, background: '#f8fafc' }}>
        {coverImageUrl && !imageError ? (
          <img
            key={coverImageUrl} // Force re-render when URL changes
            src={coverImageUrl}
            alt={`${projectName || 'Untitled Project'} cover`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={e => { handleImageError(e); imageErrorFallback(e, getPlaceholderImage()); }}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center text-center p-4">
            <ImageOff size={32} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              {retryCount > 0 && retryCount <= maxRetries 
                ? `${t('projectStatus.loadingImage', { count: retryCount, max: maxRetries })}` 
                : t('projectStatus.imageNotAvailable')}
            </p>
            <p className="text-xs text-gray-500">
              {initialCoverImageUrl ? t('projectStatus.failedToLoadImage') : t('projectStatus.noImageAvailable')}
            </p>
          </div>
        )}
      </div>
      {/* Card Content */}
      <CardBody className="flex-1 flex flex-col">
        <div className="flex-1">
          {/* Project Name (always visible, using CardTitle) */}
          <>
            <div
              className="text-base font-medium mb-2 leading-tight truncate"
              title={projectName && projectName.trim() ? projectName : 'Untitled Project'}
              style={{
                minHeight: 20,
                letterSpacing: '-0.01em',
                background: 'rgba(250,252,255,0.92)',
                color: '#23272f',
                padding: '5px 10px',
                borderRadius: 8,
                marginBottom: 8,
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
                border: '1px solid #e5e7eb',
                maxWidth: '96%',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: 500,
                zIndex: 2,
                textShadow: 'none'
              }}
            >
              {projectName && projectName.trim() ? projectName : 'Untitled Project'}
            </div>
          </>
          {/* Status Badge (below project name, left-aligned) */}
          <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${statusStyles.bg} ${statusStyles.text}`}
            style={{ minHeight: 24 }}>
            {statusStyles.icon}
            <span>{formatStatusText(status)}</span>
          </div>
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
                {startDate ? formatDateWithFallback(startDate) : 'TBD'} - {endDate ? formatDateWithFallback(endDate) : 'TBD'}
              </span>
            </div>
            {/* View Details Button */}
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {t('projectStatus.viewDetails')} →
            </Button>
          </div>
        </CardFooter>
      </CardBody>
    </Card>
  );
};

export default ProjectCard;
