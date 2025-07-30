import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { useTranslation } from 'react-i18next';
import { FavoritesService, FavoriteProject } from '../utilities/favoritesService';
import { ProjectCrewService } from '../services/ProjectCrewService';

interface Project {
  id: string;
  projectName: string;
  productionCompany: string;
  status: string;
  synopsis: string;
  director?: string;
  producer?: string;
  coverImageUrl?: string;
  genres?: string[];
  country?: string;
  productionLocations?: Array<{ country: string; city?: string }>;
  owner_uid?: string;
  isFavorite?: boolean;
  startDate?: string;
  endDate?: string;
  projectType?: 'owned' | 'crew' | 'favorite' | 'all';
}

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [ownedProjects, setOwnedProjects] = useState<Project[]>([]);
  const [crewProjects, setCrewProjects] = useState<Project[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'mine' | 'favorites'>('all');
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'Projects'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        
        // Mark projects as favorites if they're in the user's favorites
        if (user) {
          const favoriteIds = await FavoritesService.getFavoriteProjectIds();
          const projectsWithFavorites = data.map(project => ({
            ...project,
            isFavorite: favoriteIds.includes(project.id)
          }));
          setProjects(projectsWithFavorites);
        } else {
          setProjects(data);
        }
      } catch (err: any) {
        setError(t('projects.errorLoading'));
      } finally {
        setLoading(false);
      }
    };
    
    const fetchMyProjects = async () => {
      if (!user) return;
      
      try {
        // Fetch owned projects
        const ownedQuery = query(collection(db, 'Projects'), where('owner_uid', '==', user.uid));
        const ownedSnapshot = await getDocs(ownedQuery);
        const ownedData = ownedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
        setOwnedProjects(ownedData);

        // Fetch projects where user is a crew member
        const crewProjectsData = await ProjectCrewService.getProjectsForCrewMember(user.uid);
        setCrewProjects(crewProjectsData);
      } catch (err: any) {
        console.error('Error fetching my projects:', err);
      }
    };
    
    const loadFavorites = async () => {
      if (user) {
        try {
          const userFavorites = await FavoritesService.getFavorites();
          setFavorites(userFavorites);
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavorites([]); // Set empty array on error
        }
      } else {
        setFavorites([]); // Clear favorites when no user
      }
    };

    fetchProjects();
    fetchMyProjects();
    loadFavorites();
  }, [t, user]);

  const handleEdit = (projectId: string) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm(t('projects.confirmDelete'))) return;
    try {
      await deleteDoc(doc(db, 'Projects', projectId));
      setProjects(projects => projects.filter(p => p.id !== projectId));
    } catch (err) {
      alert(t('projects.deleteFailed'));
    }
  };

  const handleBookmark = async (projectId: string, isBookmarked: boolean) => {
    if (!user) {
      alert('You must be logged in to bookmark projects');
      return;
    }

    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      if (isBookmarked) {
        await FavoritesService.removeFromFavorites(projectId);
        setFavorites(prev => prev.filter(fav => fav.projectId !== projectId));
      } else {
        await FavoritesService.addToFavorites(projectId, {
          projectName: project.projectName,
          productionCompany: project.productionCompany,
          status: project.status,
          coverImageUrl: project.coverImageUrl,
        });
        // Refresh favorites list
        const userFavorites = await FavoritesService.getFavorites();
        setFavorites(userFavorites);
      }

      // Update the project's favorite status in the local state
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, isFavorite: !isBookmarked } : p
      ));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark');
    }
  };

  const handleRemoveFromFavorites = async (projectId: string) => {
    if (!user) return;
    
    try {
      await FavoritesService.removeFromFavorites(projectId);
      setFavorites(prev => prev.filter(fav => fav.projectId !== projectId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites');
    }
  };

  const filteredProjects = (() => {
    if (tab === 'mine' && user) {
      // Combine owned and crew projects, marking them appropriately
      const ownedWithType = ownedProjects.map(p => ({ ...p, projectType: 'owned' as const }));
      const crewWithType = crewProjects.map(p => ({ ...p, projectType: 'crew' as const }));
      return [...ownedWithType, ...crewWithType];
    } else if (tab === 'favorites' && user) {
      // Convert favorites to project format for display
      return favorites.map(fav => ({
        id: fav.projectId,
        projectName: fav.projectData?.projectName || 'Unknown Project',
        productionCompany: fav.projectData?.productionCompany || '',
        status: fav.projectData?.status || 'active',
        synopsis: '', // Not stored in favorites
        director: undefined,
        producer: undefined,
        coverImageUrl: fav.projectData?.coverImageUrl,
        genres: undefined,
        country: undefined,
        productionLocations: undefined,
        owner_uid: undefined,
        isFavorite: true,
        projectType: 'favorite' as const
      })) as Project[];
    } else {
      return projects.map(p => ({ ...p, projectType: 'all' as const }));
    }
  })();

  return (
    <div className="min-h-screen bg-white">
      <div className="section-gradient border-b border-gray-100">
        <div className="container-base section-padding-large">
          <div className="text-center mb-8 animate-fade">
            <h1 className="heading-primary mb-2 animate-slide">{t('projects.title')}</h1>
            <p className="body-large max-w-2xl mx-auto animate-slide">
              {user ? t('projects.subtitle') : t('projects.subtitleLoggedOut')}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
                onClick={() => setTab('all')}
              >
                {t('projects.allProjects')}
              </button>
              {user && (
                <button
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'mine' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
                  onClick={() => setTab('mine')}
                >
                  {t('projects.myProjects')}
                </button>
              )}
              {user && (
                <button
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'favorites' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
                  onClick={() => setTab('favorites')}
                >
                  ❤️ {t('nav.favorites')}
                </button>
              )}
              <button
                onClick={() => navigate('/projects/create')}
                className="btn-primary ml-4"
              >
                {t('projects.createNewProject')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="section-gray">
        <div className="container-base section-padding">
          {loading ? (
            <div className="text-center py-24 animate-fade">{t('projects.loading')}</div>
          ) : error ? (
            <div className="text-center py-24 text-red-600 animate-fade">{error}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24 animate-fade">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
              <h3 className="heading-card mb-4">{t('projects.noProjectsFound')}</h3>
              <p className="body-medium max-w-md mx-auto">
                {tab === 'mine' ? t('projects.noProjectsYet') : 
                 tab === 'favorites' ? 'No favorite projects yet. Start exploring projects and add them to your favorites!' :
                 t('projects.noProjectsAvailable')}
              </p>
            </div>
          ) : (
            <div className="grid-cards">
              {filteredProjects.map((project, index) => (
                <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }} className="relative group">
                  <ProjectCard
                    id={project.id}
                    projectName={project.projectName}
                    productionCompany={project.productionCompany}
                    country={project.country}
                    productionLocations={project.productionLocations}
                    status={project.status}
                    summary={project.synopsis}
                    director={project.director}
                    producer={project.producer}
                    coverImageUrl={project.coverImageUrl}
                    genres={project.genres}
                    startDate={project.startDate}
                    endDate={project.endDate}
                    showDetails={true}
                    onBookmark={handleBookmark}
                    isBookmarked={project.isFavorite}
                  />
                  {tab === 'mine' && user && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.projectType === 'owned' ? (
                        <>
                          <button
                            onClick={() => handleEdit(project.id)}
                            className="btn-secondary px-3 py-1 text-xs"
                          >
                            {t('projects.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="btn-danger px-3 py-1 text-xs"
                          >
                            {t('projects.delete')}
                          </button>
                        </>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          Crew Member
                        </span>
                      )}
                    </div>
                  )}
                  {tab === 'favorites' && user && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleRemoveFromFavorites(project.id)}
                        className="btn-danger px-3 py-1 text-xs"
                      >
                        ❤️ Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage; 