import React from "react";

interface ProjectCardProps {
  title: string;
  status: string;
  country: string;
  startDate: string;
  endDate: string;
  coverImageUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  status,
  country,
  startDate,
  endDate,
  coverImageUrl,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden max-w-sm w-full">
      <img
        src={coverImageUrl}
        alt={title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
          {status}
        </span>
        <p className="text-sm text-gray-600 mt-2">
          {country} | {startDate} – {endDate}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
