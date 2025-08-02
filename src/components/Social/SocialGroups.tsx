import React from 'react';

const SocialGroups: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Professional Groups
          </h1>
          <p className="text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with film professionals, share knowledge, and grow your network.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">👥</div>
            <h3 className="text-xl font-light text-gray-900 mb-2">Groups coming soon</h3>
            <p className="text-gray-600">Professional networking groups and communities will be available here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialGroups; 