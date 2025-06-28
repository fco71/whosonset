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
      <div className="min-h-screen section-gray">
        <div className="container-base section-padding">
          <div className="text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="heading-card mb-4">
              Sign in to view your favorites
            </h2>
            <p className="body-medium max-w-md mx-auto mb-8">
              Create an account or sign in to save and view your favorite projects
            </p>
            <Link 
              to="/login" 
              className="btn-primary"
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
      <div className="min-h-screen section-gray">
        <div className="container-base section-padding">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="body-medium">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="section-gradient border-b border-gray-100">
        <div className="container-base section-padding-large">
          <div className="text-center mb-16">
            <div className="text-6xl mb-6">❤️</div>
            <h1 className="heading-secondary mb-4">
              Your Favorite Projects
            </h1>
            <p className="body-medium max-w-2xl mx-auto">
              All the projects you've bookmarked for easy access
            </p>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="section-gray">
        <div className="container-base section-padding">
          {favorites.length === 0 ? (
            <div className="text-center py-24 animate-fade">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">💔</div>
              <h3 className="heading-card mb-4">
                No favorites yet
              </h3>
              <p className="body-medium max-w-md mx-auto mb-8">
                Start exploring projects and bookmark the ones you like
              </p>
              <Link 
                to="/projects" 
                className="btn-primary"
              >
                Explore Projects
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-12 animate-fade">
                <h3 className="heading-tertiary">
                  {favorites.length} {favorites.length === 1 ? 'Favorite' : 'Favorites'}
                </h3>
              </div>

              <div className="grid-cards">
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