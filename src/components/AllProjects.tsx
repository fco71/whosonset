import React, { useEffect, useState, useRef } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  where,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ProjectCard from './ProjectCard';
import { FavoritesService } from '../utilities/favoritesService';

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
}

const PROJECTS_PER_PAGE = 48;

const getStatusBadgeColor = (rawStatus: string) => {
  const status = rawStatus.toLowerCase();
  if (status.includes('development')) return 'badge-info';
  if (status.includes('pre')) return 'badge-warning';
  if (status.includes('filming') || status.includes('production')) return 'badge-success';
  if (status.includes('post')) return 'badge-orange';
  if (status.includes('completed')) return 'badge-success';
  if (status.includes('cancel')) return 'badge-error';
  return 'badge-gray';
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [firstVisible, setFirstVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [prevPages, setPrevPages] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [authUser, setAuthUser] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      if (user) {
        loadFavorites();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchProjects('reset');
  }, []);

  const fetchProjects = async (direction: 'next' | 'prev' | 'reset' = 'reset') => {
    setLoading(true);
    try {
      let q;

      if (direction === 'next' && lastVisible) {
        q = query(collection(db, 'Projects'), orderBy('projectName'), startAfter(lastVisible), limit(PROJECTS_PER_PAGE));
        setPageNumber((prev) => prev + 1);
      } else if (direction === 'prev' && prevPages.length > 0) {
        const prev = prevPages[prevPages.length - 2];
        q = query(collection(db, 'Projects'), orderBy('projectName'), startAfter(prev), limit(PROJECTS_PER_PAGE));
        setPrevPages((prev) => prev.slice(0, -1));
        setPageNumber((prev) => Math.max(prev - 1, 1));
      } else {
        q = query(collection(db, 'Projects'), orderBy('projectName'), limit(PROJECTS_PER_PAGE));
        setPrevPages([]);
        setPageNumber(1);
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;
      const data = docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Project[];

      setProjects(data);
      setLastVisible(docs[docs.length - 1] || null);
      setFirstVisible(docs[0] || null);

      if (direction === 'next') setPrevPages((prev) => [...prev, docs[0]]);
      if (direction === 'reset') setPrevPages([docs[0]]);
    } catch (error) {
      console.error('Error fetching paginated projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };

  const filteredProjects = projects.filter((project) => {
    const query = debouncedQuery.toLowerCase();
    const matchesSearch =
      project.projectName.toLowerCase().includes(query) ||
      project.productionCompany?.toLowerCase().includes(query);
    const matchesStatus = statusFilter === '' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'a-z') return a.projectName.localeCompare(b.projectName);
    if (sortBy === 'z-a') return b.projectName.localeCompare(a.projectName);
    return b.id.localeCompare(a.id);
  });

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const loadFavorites = async () => {
    try {
      const favoriteIds = await FavoritesService.getFavoriteProjectIds();
      setFavoriteIds(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleBookmark = async (projectId: string, isBookmarked: boolean) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (isBookmarked) {
        await FavoritesService.removeFromFavorites(projectId);
        setFavoriteIds(prev => prev.filter(id => id !== projectId));
      } else {
        await FavoritesService.addToFavorites(projectId, project);
        setFavoriteIds(prev => [...prev, projectId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="section-gradient border-b border-gray-100">
        <div className="container-base section-padding-large">
          <div className="text-center mb-16 animate-fade">
            <h1 className="heading-primary mb-6 animate-slide">
              All
            </h1>
            <h2 className="heading-secondary mb-8 animate-slide">
              Projects
            </h2>
            <p className="body-large max-w-2xl mx-auto animate-slide">
              Discover film projects from around the world. 
              Explore productions in every stage of development.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="section-light border-b border-gray-100">
        <div className="container-base py-8">
          <div className="mb-8">
            <h3 className="heading-tertiary mb-6">
              Search & Filter
            </h3>
            
            {/* Search Box */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search projects by name or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  onClick={() => setDebouncedQuery(searchQuery)}
                  className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Statuses</option>
                  <option value="development">Development</option>
                  <option value="pre-production">Pre-Production</option>
                  <option value="production">Production</option>
                  <option value="post-production">Post-Production</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="a-z">A-Z</option>
                  <option value="z-a">Z-A</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <div className="text-right">
              <button
                onClick={resetFilters}
                className="text-gray-500 hover:text-gray-700 underline text-sm transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Section */}
      <div className="section-gray">
        <div className="container-base section-padding">
          {sortedProjects.length === 0 ? (
            <div className="text-center py-24 animate-fade">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
              <h3 className="heading-card mb-4">
                No projects found
              </h3>
              <p className="body-medium max-w-md mx-auto">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="body-medium text-gray-600">
                  Showing {sortedProjects.length} of {projects.length} projects
                </p>
              </div>

              <div className="grid-cards">
                {sortedProjects.map((project, index) => (
                  <div 
                    key={project.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProjectCard
                      id={project.id}
                      projectName={project.projectName}
                      productionCompany={project.productionCompany}
                      status={project.status}
                      summary={project.synopsis}
                      director={project.director}
                      producer={project.producer}
                      coverImageUrl={project.coverImageUrl}
                      genres={project.genres}
                      showDetails={true}
                      onBookmark={authUser ? handleBookmark : undefined}
                      isBookmarked={favoriteIds.includes(project.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => fetchProjects('prev')}
                  disabled={pageNumber === 1}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Previous
                </button>
                <span className="body-medium text-gray-600">
                  Page {pageNumber}
                </span>
                <button
                  onClick={() => fetchProjects('next')}
                  disabled={sortedProjects.length < PROJECTS_PER_PAGE}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <div className="h-16 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div className="h-4 bg-gray-200 rounded w-16 mb-3 animate-pulse"></div>
                <div className="h-14 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="mb-12">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProjects;