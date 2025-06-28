import React from "react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  projectName: string;
  productionCompany?: string;
  country?: string;
  status: string;
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
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  projectName,
  productionCompany,
  country,
  status,
  summary,
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
  const navigate = useNavigate();

  const getStatusBadgeColor = (rawStatus: string) => {
    switch (rawStatus.toLowerCase()) {
      case 'in production':
      case 'production':
        return 'badge-success';
      case 'pre-production':
      case 'pre_production':
        return 'badge-info';
      case 'post-production':
      case 'post_production':
        return 'badge-purple';
      case 'development':
        return 'badge-orange';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-gray';
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
    navigate(`/projects/${id}`);
  };

  return (
    <div
      className="group card-base card-hover h-96 flex flex-col animate-entrance relative cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${projectName}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
    >
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
      <div className="h-48 card-image-container">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={projectName}
            className="card-image"
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
      <div className="card-padding flex-1 flex flex-col">
        {/* Project Name */}
        <h3 className="heading-card mb-3 group-hover:text-gray-700 transition-colors">
          {projectName}
        </h3>

        {/* Company & Location */}
        {(productionCompany || country) && (
          <p className="body-small mb-3">
            {productionCompany && country ? `${productionCompany} • ${country}` : productionCompany || country}
          </p>
        )}

        {/* Director & Producer (for All Projects page) */}
        {showDetails && (director || producer) && (
          <div className="space-y-1 mb-3">
            {director && (
              <p className="meta-text">
                <span className="font-medium">Director:</span> {director}
              </p>
            )}
            {producer && (
              <p className="meta-text">
                <span className="font-medium">Producer:</span> {producer}
              </p>
            )}
          </div>
        )}

        {/* Summary (single field) */}
        {summary && (
          <div className="mb-4 flex-1 text-gray-600 leading-relaxed line-clamp-3">
            {summary}
          </div>
        )}

        {/* Genres (for All Projects page) */}
        {showDetails && genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="badge-base badge-gray"
              >
                {genre}
              </span>
            ))}
            {genres.length > 3 && (
              <span className="badge-base badge-gray">
                +{genres.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bottom Section - Status Badge */}
        <div className="mt-auto">
          <span className={`badge-base ${getStatusBadgeColor(status)}`}>
            {formatStatus(status)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
