import React from 'react';

type Project = {
  projectName: string;
  status: string;
  genres?: string[];
  productionCompany?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  productionLocations?: Array<{
    country: string;
    city?: string;
  }>;
  logline?: string;
  synopsis?: string;
  coverImageUrl?: string; // Changed from posterImageUrl to coverImageUrl
  ownerId?: string;
};

type Props = {
  project: Project;
  userId?: string;
  onEditClick: () => void;
};

const ProjectShowcase: React.FC<Props> = ({ project, userId, onEditClick }) => {
  const handleSuggestClick = () => {
    const subject = `Suggestion for project: ${project.projectName}`;
    const body = encodeURIComponent(
      `I would like to suggest an update to "${project.projectName}".\n\nDetails:\n`
    );
    window.location.href = `mailto:admin@example.com?subject=${subject}&body=${body}`;
  };

  // Only show fields that have data
  const hasProductionInfo = project.productionCompany || project.country || project.startDate || project.endDate || (project.productionLocations && project.productionLocations.length > 0);
  const hasStoryInfo = project.logline || project.synopsis;

  return (
    <div className="space-y-8">
      {/* Project Info Section - only show if there's data */}
      {hasProductionInfo && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.productionCompany && (
              <Field label="Production Company" value={project.productionCompany} />
            )}
            {project.country && (
              <Field label="Country" value={project.country} />
            )}
            {project.startDate && (
              <Field label="Start Date" value={project.startDate} />
            )}
            {project.endDate && (
              <Field label="End Date" value={project.endDate} />
            )}
            {project.productionLocations && project.productionLocations.length > 0 && (
              <Field label="Location" value={
                project.productionLocations[0].city 
                  ? `${project.productionLocations[0].city}, ${project.productionLocations[0].country}`
                  : project.productionLocations[0].country
              } />
            )}
          </div>
        </div>
      )}

      {/* Story Information - only show if there's data */}
      {hasStoryInfo && (
        <div className="space-y-6">
          {project.logline && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Logline</h3>
              <p className="text-gray-700 leading-relaxed">{project.logline}</p>
            </div>
          )}

          {project.synopsis && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Synopsis</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.synopsis}</p>
            </div>
          )}
        </div>
      )}

      {/* Show message if no additional info */}
      {!hasProductionInfo && !hasStoryInfo && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No additional project information available.</p>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
    <dd className="text-sm text-gray-900">{value}</dd>
  </div>
);

export default ProjectShowcase;