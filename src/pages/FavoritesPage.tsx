import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { FavoritesService, FavoriteProject } from '../utilities/favoritesService';
import ProjectCard from '../components/ProjectCard';

interface Project {
  id: string;
  projectName: string;
  productionCompany?: string;
  country?: string;
  status: string;
  synopsis?: string;
  director?: string;
  producer?: string;
  genres?: string[];
  coverImageUrl?: string;
}

const FavoritesPage: React.FC = () => {
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
        synopsis: '', // We don't store synopsis in favorites, would need to fetch from projects collection
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
              Sign in to view your favorites
            </h2>
            <p className="text-lg font-light text-gray-600 max-w-md mx-auto leading-relaxed mb-8">
              Create an account or sign in to save and view your favorite projects
            </p>
            <Link 
              to="/login" 
              className="inline-block px-8 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg font-light text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">❤️</div>
            <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">
              Your Favorite Projects
            </h1>
            <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              All the projects you've bookmarked for easy access
            </p>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          {favorites.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">💔</div>
              <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                No favorites yet
              </h3>
              <p className="text-lg font-light text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
                Start exploring projects and bookmark the ones you like
              </p>
              <Link 
                to="/projects" 
                className="inline-block px-8 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                Explore Projects
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-12 animate-fade-in">
                <h3 className="text-3xl font-light text-gray-900 tracking-wide">
                  {favorites.length} {favorites.length === 1 ? 'Favorite' : 'Favorites'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div 
                    key={project.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProjectCard
                      id={project.id}
                      projectName={project.projectName}
                      productionCompany={project.productionCompany}
                      country={project.country}
                      status={project.status}
                      summary={project.synopsis}
                      coverImageUrl={project.coverImageUrl}
                      showDetails={false}
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
    </div>
  );
};

export default FavoritesPage; 