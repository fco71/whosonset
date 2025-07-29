import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('home.hero.title1')} <span className="text-blue-600">{t('home.hero.title2')}</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center text-lg"
              >
                {t('home.hero.ctaPrimary')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/jobs"
                className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center text-lg"
              >
                {t('home.hero.ctaSecondary')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Test Section to verify routing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            This is the HomePage - Test Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              to="/crew" 
              className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Crew</h3>
              <p className="text-gray-600">Click to test navigation</p>
            </Link>
            <Link 
              to="/projects" 
              className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h3 className="text-xl font-semibold text-green-600 mb-2">Projects</h3>
              <p className="text-gray-600">Click to test navigation</p>
            </Link>
            <Link 
              to="/jobs" 
              className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h3 className="text-xl font-semibold text-purple-600 mb-2">Jobs</h3>
              <p className="text-gray-600">Click to test navigation</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
