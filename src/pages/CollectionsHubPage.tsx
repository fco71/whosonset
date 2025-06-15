import React from 'react';
import { useNavigate } from 'react-router-dom';

const CollectionsHubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">My Collections</h1>

      <div className="grid gap-8 w-full max-w-3xl">
        <div
          className="bg-gray-800 hover:bg-gray-700 transition p-6 rounded-lg shadow-lg cursor-pointer"
          onClick={() => navigate('/saved-projects')}
        >
          <h2 className="text-2xl font-semibold mb-2">📁 Saved Projects</h2>
          <p className="text-gray-400">View and manage the film projects you’ve bookmarked.</p>
        </div>

        <div
          className="bg-gray-800 hover:bg-gray-700 transition p-6 rounded-lg shadow-lg cursor-pointer"
          onClick={() => navigate('/saved-crew')}
        >
          <h2 className="text-2xl font-semibold mb-2">👥 Saved Crew</h2>
          <p className="text-gray-400">Browse crew members you've added to your collection.</p>
        </div>
      </div>
    </div>
  );
};

export default CollectionsHubPage;
