import React from 'react';
import { useNavigate } from 'react-router-dom';

const CollectionsHubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
              My
            </h1>
            <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
              Collections
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
              Organize and access your curated content. 
              Keep track of the projects and talent that inspire you.
            </p>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="grid gap-8 animate-fade-in-delay">
            <div
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 cursor-pointer animate-card-entrance hover:scale-[1.02]"
              onClick={() => navigate('/saved-projects')}
            >
              <div className="flex items-start space-x-6">
                <div className="text-4xl opacity-60 group-hover:opacity-80 transition-opacity">
                  📁
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors">
                    Saved Projects
                  </h2>
                  <p className="text-lg font-light text-gray-600 leading-relaxed">
                    View and manage the film projects you've bookmarked. 
                    Keep track of productions that inspire your creative vision.
                  </p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 cursor-pointer animate-card-entrance"
              style={{ animationDelay: '0.1s' }}
              onClick={() => navigate('/saved-crew')}
            >
              <div className="flex items-start space-x-6">
                <div className="text-4xl opacity-60 group-hover:opacity-80 transition-opacity">
                  👥
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors">
                    Saved Crew
                  </h2>
                  <p className="text-lg font-light text-gray-600 leading-relaxed">
                    Browse crew members you've added to your collection. 
                    Connect with talented professionals for your next project.
                  </p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsHubPage;
