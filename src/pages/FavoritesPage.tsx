import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { auth } from '../firebase';
import { Project } from '../types/Project';
import { FavoritesService, FavoriteProject } from '../utilities/favoritesService';
import ProjectCard from '../components/ProjectCard';
import { Heart, Star, BookOpen, ArrowRight, Filter, Search } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<FavoriteProject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        loadFavorites();
      } else {
        setFavorites([]);
        setProjects([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const userFavorites = await FavoritesService.getFavorites();
      setFavorites(userFavorites);
      
      // Convert favorites to project format for display
      const projectData = userFavorites.map(fav => ({
        id: fav.projectId,
        projectName: fav.projectData?.projectName || 'Unknown Project',
        productionCompany: fav.projectData?.productionCompany,
        status: fav.projectData?.status || 'Unknown',
        coverImageUrl: fav.projectData?.coverImageUrl,
        summary: '', // We don't store synopsis in favorites, would need to fetch from projects collection
      }));
      
      setProjects(projectData);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (projectId: string, isBookmarked: boolean) => {
    try {
      if (isBookmarked) {
        await FavoritesService.removeFromFavorites(projectId);
        setFavorites(prev => prev.filter(fav => fav.projectId !== projectId));
        setProjects(prev => prev.filter(project => project.id !== projectId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('favorites.auth.signInRequired')}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {t('favorites.auth.signInDescription')}
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t('favorites.auth.signInButton')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
            <p className="text-lg text-gray-600">{t('favorites.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-6 shadow-lg">
              <Heart className="w-10 h-10 text-white fill-current" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('favorites.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('favorites.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('favorites.empty.title')}
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                {t('favorites.empty.description')}
              </p>
              <Link 
                to="/projects" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Star className="w-5 h-5 mr-2" />
                {t('favorites.empty.exploreButton')}
              </Link>
            </div>
          ) : (
            <>
              {/* Stats and Filters Bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-semibold text-gray-900">
                        {favorites.length} {favorites.length === 1 ? t('favorites.count.singular') : t('favorites.count.plural')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search favorites..."
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Filter</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div 
                    key={project.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <ProjectCard
                      id={project.id}
                      projectName={project.projectName}
                      productionCompany={project.productionCompany}
                      country={project.country}
                      productionLocations={project.productionLocations}
                      status={project.status}
                      summary={project.summary}
                      director={project.director}
                      producer={project.producer}
                      coverImageUrl={project.coverImageUrl}
                      genres={project.genres}
                      showDetails={true}
                      onBookmark={handleBookmark}
                      isBookmarked={true}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>
        {`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        `}
      </style>
    </div>
  );
};

export default FavoritesPage; 