import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  projectName: string;
  productionCompany?: string;
  country?: string;
  status: string;
  logline?: string;
  director?: string;
  producer?: string;
  genres?: string[];
  coverImageUrl?: string;
  startDate?: string;
  endDate?: string;
  showDetails?: boolean; // For All Projects page to show more details
  onBookmark?: (projectId: string, isBookmarked: boolean) => void;
  isBookmarked?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  projectName,
  productionCompany,
  country,
  status,
  logline,
  director,
  producer,
  genres,
  coverImageUrl,
  startDate,
  endDate,
  showDetails = false,
  onBookmark,
  isBookmarked = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadgeColor = (rawStatus: string) => {
    switch (rawStatus.toLowerCase()) {
      case 'in production':
      case 'production':
        return 'bg-green-100 text-green-800';
      case 'pre-production':
      case 'pre_production':
        return 'bg-blue-100 text-blue-800';
      case 'post-production':
      case 'post_production':
        return 'bg-purple-100 text-purple-800';
      case 'development':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) =>
    status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(id, !isBookmarked);
    }
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-96 flex flex-col animate-card-entrance hover:scale-[1.02] relative">
      {/* Bookmark Button */}
      {onBookmark && (
        <button
          onClick={handleBookmarkClick}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${
            isBookmarked 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          } backdrop-blur-sm`}
          title={isBookmarked ? "Remove from favorites" : "Add to favorites"}
        >
          <svg 
            className={`w-5 h-5 transition-all duration-300 ${isBookmarked ? 'fill-current' : 'stroke-current fill-none'}`}
            viewBox="0 0 24 24"
            strokeWidth={isBookmarked ? 0 : 2}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      )}

      {/* Image Section - Fixed Height */}
      <div className="h-48 overflow-hidden flex-shrink-0">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={projectName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/movie-production-avatar.svg';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <img
              src="/movie-production-avatar.svg"
              alt="Movie Production"
              className="w-16 h-16 opacity-50"
            />
          </div>
        )}
      </div>

      {/* Content Section - Flexible Height */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Project Name */}
        <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors">
          <Link to={`/projects/${id}`} className="hover:underline">
            {projectName}
          </Link>
        </h3>

        {/* Company & Location */}
        {(productionCompany || country) && (
          <p className="text-sm font-medium text-gray-500 mb-3 tracking-wider uppercase">
            {productionCompany && country ? `${productionCompany} • ${country}` : productionCompany || country}
          </p>
        )}

        {/* Director & Producer (for All Projects page) */}
        {showDetails && (director || producer) && (
          <div className="space-y-1 mb-3">
            {director && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Director:</span> {director}
              </p>
            )}
            {producer && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Producer:</span> {producer}
              </p>
            )}
          </div>
        )}

        {/* Logline with Fade Effect */}
        {logline && (
          <div className="relative mb-4 flex-1">
            <div
              className={`text-gray-600 leading-relaxed transition-all duration-300 ${
                isExpanded ? '' : 'line-clamp-3'
              }`}
              style={{ minHeight: '3.6em' }}
            >
              {logline}
            </div>
            {!isExpanded && (
              <>
                <div className="absolute bottom-0 right-0 left-0 h-8 pointer-events-none" style={{background: 'linear-gradient(to top, #fff 80%, rgba(255,255,255,0))'}} />
                <button
                  onClick={handleCardClick}
                  className="absolute bottom-0 right-2 z-10 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors bg-white/80 px-2 py-1 rounded pointer-events-auto"
                  style={{transform: 'translateY(50%)'}}
                >
                  ...more
                </button>
              </>
            )}
            {isExpanded && (
              <button
                onClick={handleCardClick}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors mt-2"
              >
                Show less
              </button>
            )}
          </div>
        )}

        {/* Genres (for All Projects page) */}
        {showDetails && genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium"
              >
                {genre}
              </span>
            ))}
            {genres.length > 3 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                +{genres.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bottom Section - Status Badge */}
        <div className="mt-auto">
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full tracking-wider ${getStatusBadgeColor(status)}`}>
            {formatStatus(status)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
