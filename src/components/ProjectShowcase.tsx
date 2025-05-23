import React from 'react';

type Project = {
  projectName: string;
  status: string;
  genres?: string[];
  productionCompany?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  logline?: string;
  synopsis?: string;
  posterImageUrl?: string;
  coverImageUrl?: string;
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

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto text-white space-y-10">

      {project.coverImageUrl && (
        <img
          src={project.coverImageUrl}
          alt="Cover"
          className="w-full h-64 object-cover rounded-md shadow"
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
        <h1 className="text-3xl font-bold">{project.projectName}</h1>
        <div className="flex gap-2 mt-2 md:mt-0 flex-wrap">
          <span className="text-xs px-2 py-1 rounded bg-blue-700 text-white">{project.status}</span>
          {project.genres?.map((genre) => (
            <span key={genre} className="text-xs px-2 py-1 bg-gray-700 rounded text-white">
              {genre}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {project.posterImageUrl && (
          <img
            src={project.posterImageUrl}
            alt="Poster"
            className="w-full h-auto rounded shadow-md col-span-1"
          />
        )}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <Field label="Production Company" value={project.productionCompany} />
          <Field label="Country" value={project.country} />
          <Field label="Start Date" value={project.startDate} />
          <Field label="End Date" value={project.endDate} />
          <Field label="Location" value={project.location} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Logline</h2>
        <p className="text-gray-300">{project.logline}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
        <p className="text-gray-300 whitespace-pre-line">{project.synopsis}</p>
      </div>

      <div>
        {userId === project.ownerId ? (
          <button
            onClick={onEditClick}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
          >
            Edit Project
          </button>
        ) : (
          <button
            onClick={handleSuggestClick}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
          >
            Suggest Update
          </button>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <dt className="text-sm font-medium text-gray-400">{label}</dt>
    <dd className="text-sm text-white">{value || '—'}</dd>
  </div>
);

export default ProjectShowcase;
