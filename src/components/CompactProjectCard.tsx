import React from 'react';
import { Link } from 'react-router-dom';

interface CompactProjectCardProps {
  id: string;
  projectName: string;
  country: string;
  productionCompany: string;
  status: string;
  logline: string;
  coverImageUrl?: string;
}

const CompactProjectCard: React.FC<CompactProjectCardProps> = ({
  id,
  projectName,
  country,
  productionCompany,
  status,
  logline,
  coverImageUrl,
}) => {
  return (
    <div className="max-w-4xl mx-auto rounded-lg shadow-md border bg-white hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Image Container */}
        <div className="sm:w-48 sm:h-36 w-full h-64 overflow-hidden rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={projectName}
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <img
                src="/movie-production-avatar.svg"
                alt="Movie Production"
                className="w-16 h-16 opacity-60"
              />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="p-4 flex flex-col justify-between w-full">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              <Link to={`/projects/${id}`} className="hover:underline">
                {projectName}
              </Link>
            </h3>
            <div className="text-sm text-gray-600 mb-2">
              <span className="mr-4"><strong>Status:</strong> {status}</span>
              <span className="mr-4"><strong>Country:</strong> {country}</span>
              <span className="mr-4"><strong>Company:</strong> {productionCompany}</span>
            </div>
            <p className="text-gray-700 italic line-clamp-2">
              "{logline}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactProjectCard;
