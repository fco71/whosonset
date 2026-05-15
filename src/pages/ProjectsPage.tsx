import React, { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { useTranslation } from 'react-i18next';
import { FavoritesService, FavoriteProject } from '../services/favoritesService';
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
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'newest'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();
  const user = auth.currentUser;

  console.log('[ProjectsPage] Component rendered, user:', user?.uid, 'authenticated:', !!user);

  // Test authentication
  useEffect(() => {
    console.log('[ProjectsPage] Auth state check:', {
      user: user?.uid,
      userEmail: user?.email,
      isAuthenticated: !!user,
      authCurrentUser: auth.currentUser?.uid
    });
    
    // Test bookmark functionality
    if (user && projects.length > 0) {
      console.log('[ProjectsPage] Testing bookmark functionality...');
      const testProject = projects[0];
      console.log('[ProjectsPage] Test project:', { id: testProject.id, name: testProject.projectName, isFavorite: testProject.isFavorite });
    }
  }, [user, projects]);

  const fetchProjects = useCallback(async () => {
    console.log('[ProjectsPage] fetchProjects called');
    setLoading(true);
    setError(null);
    try {
      console.log('[ProjectsPage] Starting to fetch projects, user:', user?.uid);
      const q = query(collection(db, 'Projects'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      console.log('[ProjectsPage] Found projects:', data.length);
      
      // Mark projects as favorites if they're in the user's favorites
      if (user) {
        console.log('[ProjectsPage] User is authenticated, loading favorites...');
        try {
          const favoriteIds = await FavoritesService.getFavoriteProjectIds();
          console.log('[ProjectsPage] Favorite IDs:', favoriteIds);
          const projectsWithFavorites = data.map(project => ({
            ...project,
            isFavorite: favoriteIds.includes(project.id)
          }));
          console.log('[ProjectsPage] Projects with favorites:', projectsWithFavorites.map(p => ({ id: p.id, name: p.projectName, isFavorite: p.isFavorite })));
          setProjects(projectsWithFavorites);
        } catch (favoritesError) {
          console.error('[ProjectsPage] Error loading favorites:', favoritesError);
          // Set projects without favorites if there's an error
          setProjects(data);
        }
      } else {
        console.log('[ProjectsPage] No user authenticated, setting projects without favorites');
        setProjects(data);
      }
    } catch (err: any) {
      console.error('[ProjectsPage] Error fetching projects:', err);
      setError(t('projects.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  const fetchMyProjects = useCallback(async () => {
    if (!user) return;
    
    try {
      // Fetch owned projects
      const ownedQuery = query(collection(db, 'Projects'), where('owner_uid', '==', user.uid));
      const ownedSnapshot = await getDocs(ownedQuery);
      const ownedData = ownedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      
      // Fetch projects where user is a crew member
      const crewProjectsData = await ProjectCrewService.getProjectsForCrewMember(user.uid);
      
      // Mark projects as favorites if they're in the user's favorites
      const favoriteIds = await FavoritesService.getFavoriteProjectIds();
      
      const ownedWithFavorites = ownedData.map(project => ({
        ...project,
        isFavorite: favoriteIds.includes(project.id)
      }));
      
      const crewWithFavorites = crewProjectsData.map(project => ({
        ...project,
        isFavorite: favoriteIds.includes(project.id)
      }));
      
      console.log('[ProjectsPage] Owned projects with favorites:', ownedWithFavorites.map(p => ({ id: p.id, name: p.projectName, isFavorite: p.isFavorite })));
      console.log('[ProjectsPage] Crew projects with favorites:', crewWithFavorites.map(p => ({ id: p.id, name: p.projectName, isFavorite: p.isFavorite })));
      
      setOwnedProjects(ownedWithFavorites);
      setCrewProjects(crewWithFavorites);
    } catch (err: any) {
      console.error('Error fetching my projects:', err);
    }
  }, [user]);

  const loadFavorites = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    console.log('[ProjectsPage] Component rendered, user:', user?.uid, 'authenticated:', !!user);
    if (user) {
      console.log('[ProjectsPage] User authenticated, calling fetchProjects and fetchMyProjects');
      fetchProjects();
      fetchMyProjects();
      loadFavorites();
    } else {
      console.log('[ProjectsPage] No user, only calling fetchProjects');
      fetchProjects();
    }
  }, [user, fetchProjects, fetchMyProjects, loadFavorites]);

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
    console.log('[ProjectsPage] Bookmark clicked:', { projectId, isBookmarked, user: user?.uid });
    
    if (!user) {
      console.log('[ProjectsPage] No user authenticated');
      alert('You must be logged in to bookmark projects');
      return;
    }

    console.log('[ProjectsPage] User authenticated:', user.uid);

    try {
      // Find the project in any of the project arrays
      const allProjects = [...projects, ...ownedProjects, ...crewProjects];
      const project = allProjects.find(p => p.id === projectId);
      
      if (!project) {
        console.error('[ProjectsPage] Project not found:', projectId);
        return;
      }

      console.log('[ProjectsPage] Found project:', project.projectName);

      if (isBookmarked) {
        console.log('[ProjectsPage] Adding to favorites...');
        await FavoritesService.addToFavorites(projectId, {
          projectName: project.projectName,
          productionCompany: project.productionCompany,
          status: project.status,
          coverImageUrl: project.coverImageUrl,
        });
        // Refresh favorites list
        const userFavorites = await FavoritesService.getFavorites();
        setFavorites(userFavorites);
        console.log('[ProjectsPage] Added to favorites');
      } else {
        console.log('[ProjectsPage] Removing from favorites...');
        await FavoritesService.removeFromFavorites(projectId);
        setFavorites(prev => prev.filter(fav => fav.projectId !== projectId));
        console.log('[ProjectsPage] Removed from favorites');
      }

      // Update the project's favorite status in ALL relevant states
      // isBookmarked is the NEW state we want to set
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, isFavorite: isBookmarked } : p
      ));
      
      setOwnedProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, isFavorite: isBookmarked } : p
      ));
      
      setCrewProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, isFavorite: isBookmarked } : p
      ));
      
      console.log('[ProjectsPage] Updated all project states with isFavorite:', isBookmarked);
    } catch (error) {
      console.error('[ProjectsPage] Error toggling bookmark:', error);
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
    let projectsList: Project[];
    
    if (tab === 'mine' && user) {
      // Combine owned and crew projects, marking them appropriately
      const ownedWithType = ownedProjects.map(p => ({ ...p, projectType: 'owned' as const }));
      const crewWithType = crewProjects.map(p => ({ ...p, projectType: 'crew' as const }));
      projectsList = [...ownedWithType, ...crewWithType];
    } else if (tab === 'favorites' && user) {
      // Convert favorites to project format for display
      projectsList = favorites.map(fav => ({
        id: fav.projectId,
        projectName: fav.projectData?.projectName || 'Unknown Project',
        productionCompany: fav.projectData?.productionCompany || '',
        status: fav.projectData?.status || 'active',
        synopsis: '', // Not stored in favorites
        director: undefined as any,
        producer: undefined as any,
        coverImageUrl: fav.projectData?.coverImageUrl,
        genres: undefined as any,
        country: undefined as any,
        productionLocations: undefined as any,
        owner_uid: undefined as any,
        isFavorite: true,
        projectType: 'favorite' as const
      })) as Project[];
    } else {
      projectsList = projects.map(p => ({ ...p, projectType: 'all' as const }));
    }

    // Sort the projects
    return projectsList.sort((a, b) => {
      if (sortBy === 'relevance') {
        // Calculate relevance score based on multiple factors
        const getRelevanceScore = (project: Project) => {
          let score = 0;
          
          // Status bonus (active projects get higher priority)
          if (project.status === 'production') score += 50;
          else if (project.status === 'pre-production') score += 40;
          else if (project.status === 'development') score += 30;
          else if (project.status === 'post-production') score += 25;
          else if (project.status === 'completed') score += 20;
          
          // Production company bonus (major companies get higher priority)
          const majorCompanies = ['Warner Bros.', 'Disney', 'Netflix', 'Amazon', 'Paramount', 'Universal', 'Sony', '20th Century Fox'];
          if (project.productionCompany && majorCompanies.some(company => 
            project.productionCompany.toLowerCase().includes(company.toLowerCase())
          )) {
            score += 30;
          }
          
          // Genre diversity bonus
          if (project.genres && project.genres.length > 1) score += 10;
          
          // Location diversity bonus
          if (project.productionLocations && project.productionLocations.length > 1) score += 10;
          
          // Recent activity bonus (if createdAt exists)
          const createdAt = (project as any).createdAt?.toDate?.();
          if (createdAt) {
            const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceCreation < 30) score += 20; // New projects get bonus
            else if (daysSinceCreation < 90) score += 15;
          }
          
          // Favorite status bonus
          if (project.isFavorite) score += 15;
          
          return score;
        };

        const aScore = getRelevanceScore(a);
        const bScore = getRelevanceScore(b);
        return bScore - aScore; // Higher scores first
      } else if (sortBy === 'name') {
        const comparison = a.projectName.localeCompare(b.projectName);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else if (sortBy === 'newest') {
        // Sort by creation date
        const aDate = (a as any).createdAt?.toDate?.() || new Date(0);
        const bDate = (b as any).createdAt?.toDate?.() || new Date(0);
        const comparison = bDate.getTime() - aDate.getTime();
        return sortOrder === 'asc' ? -comparison : comparison;
      }
      
      return 0;
    });
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
            
            {/* Sorting Controls */}
            <div className="mt-6 flex justify-center items-center gap-2">
              {/* Sort By Toggle */}
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setSortBy('relevance')}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    sortBy === 'relevance' 
                      ? 'bg-blue-600 text-white border-r border-gray-300' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {t('projects.mostPopular')}
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('name')}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    sortBy === 'name' 
                      ? 'bg-blue-600 text-white border-r border-gray-300' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {t('projects.alphabetical')}
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    sortBy === 'newest' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {t('projects.newestFirst')}
                </button>
              </div>
              
              {/* Sort Order Toggle - Hidden for relevance sorting */}
              {sortBy !== 'relevance' && (
                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
                  title={sortOrder === 'asc' ? t('projects.sortDescending') : t('projects.sortAscending')}
                >
                  {sortOrder === 'asc' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              )}
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