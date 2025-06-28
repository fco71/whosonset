import React from "react";
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
}) => {
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

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-96 flex flex-col animate-card-entrance hover:scale-[1.02]">
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
        <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors line-clamp-2">
          <Link to={`/projects/${id}`} className="hover:underline">
            {projectName}
          </Link>
        </h3>

        {/* Company & Location */}
        {(productionCompany || country) && (
          <p className="text-sm font-medium text-gray-500 mb-3 tracking-wider uppercase line-clamp-1">
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

        {/* Logline */}
        {logline && (
          <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4 flex-1">
            {logline}
          </p>
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
