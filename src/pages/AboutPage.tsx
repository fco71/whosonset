import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AboutPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About My Film Jobs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connecting film industry professionals with opportunities worldwide
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              My Film Jobs is dedicated to bridging the gap between talented film professionals 
              and exciting opportunities in the entertainment industry. We believe that every 
              project deserves the perfect team, and every professional deserves the perfect role.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're a director looking for your next cinematographer, a producer 
              seeking the perfect editor, or a crew member searching for your next project, 
              we're here to make those connections happen.
            </p>
          </div>

          {/* Services Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                For Film Professionals
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Create detailed professional profiles</li>
                <li>• Showcase your portfolio and experience</li>
                <li>• Connect with industry professionals</li>
                <li>• Find exciting job opportunities</li>
                <li>• Build your network in the film industry</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                For Productions
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Post job opportunities</li>
                <li>• Browse qualified crew profiles</li>
                <li>• Manage applications efficiently</li>
                <li>• Find the perfect team members</li>
                <li>• Streamline your hiring process</li>
              </ul>
            </div>
          </div>

          {/* Industry Focus */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Industry Focus
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Film Production</h4>
                <p className="text-gray-600">Feature films, documentaries, and commercial productions</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Television</h4>
                <p className="text-gray-600">TV series, reality shows, and broadcast content</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Digital Media</h4>
                <p className="text-gray-600">Web series, streaming content, and online productions</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-semibold mb-4">
              {currentUser ? 'Ready for your next move?' : 'Ready to Join?'}
            </h2>
            <p className="text-xl mb-6 opacity-90">
              {currentUser
                ? 'Use My Film Jobs to discover projects, roles, and collaborators faster.'
                : 'Join thousands of film professionals already using My Film Jobs'}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {!currentUser && (
                <Link
                  to="/register"
                  className="inline-block bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100 rounded-lg"
                >
                  Get Started
                </Link>
              )}
              <Link
                to={currentUser ? '/jobs' : '/crew-public'}
                className="inline-block rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-600"
              >
                {currentUser ? 'Browse Film Jobs' : 'Browse Crew'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 
