// src/components/AllProjects.tsx
import React from "react";

const mockProjects = [
  {
    id: 1,
    title: "Project Alpha",
    description: "A short film about the future.",
    coverImageUrl: "https://via.placeholder.com/400x200",
  },
  {
    id: 2,
    title: "Project Beta",
    description: "Behind the scenes of an indie drama.",
    coverImageUrl: "https://via.placeholder.com/400x200",
  },
  {
    id: 3,
    title: "Project Gamma",
    description: "A feature-length sci-fi thriller.",
    coverImageUrl: "https://via.placeholder.com/400x200",
  },
];

const AllProjects = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        All Projects
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {project.title}
              </h2>
              <p className="text-gray-600">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
