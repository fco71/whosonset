import React from 'react';

const mockProjects = [
  {
    id: '1',
    name: 'Project A',
    logline: 'A thrilling adventure through unknown lands.',
    imageUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Project B',
    logline: 'A heartfelt story of resilience.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Project C',
    logline: 'Comedy that brings joy to every moment.',
    imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80',
  },
];

const AllProjects: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">All Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">{project.name}</h2>
              <p className="text-gray-600">{project.logline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;
