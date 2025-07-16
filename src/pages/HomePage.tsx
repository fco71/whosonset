import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-700">WhosOnSet</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top film and TV production professionals. Find the perfect crew for your next project or discover exciting job opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/jobs" 
              className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
            >
              Browse Jobs
            </Link>
            <Link 
              to="/post-job" 
              className="px-6 py-3 border border-blue-700 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose WhosOnSet?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Find Top Talent',
                description: 'Connect with experienced professionals across all departments in the film and TV industry.'
              },
              {
                title: 'Discover Opportunities',
                description: 'Find your next job opportunity with top production companies and studios.'
              },
              {
                title: 'Build Your Network',
                description: 'Grow your professional network and collaborate with industry peers.'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
