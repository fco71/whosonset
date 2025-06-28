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
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

interface Project {
  id: string;
  projectName: string;
  productionCompany: string;
  status: string;
  logline: string;
  director?: string;
  producer?: string;
  coverImageUrl?: string;
  genres?: string[];
}

const PROJECTS_PER_PAGE = 48;

const getStatusBadgeColor = (rawStatus: string) => {
  const status = rawStatus.toLowerCase();
  if (status.includes('development')) return 'bg-indigo-100 text-indigo-800';
  if (status.includes('pre')) return 'bg-yellow-100 text-yellow-800';
  if (status.includes('filming') || status.includes('production')) return 'bg-green-100 text-green-800';
  if (status.includes('post')) return 'bg-orange-100 text-orange-800';
  if (status.includes('completed')) return 'bg-blue-100 text-blue-800';
  if (status.includes('cancel')) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
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

  const isInitialLoad = useRef(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setAuthUser(user));
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

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
              All
            </h1>
            <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
              Projects
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
              Discover film projects from around the world. 
              Explore productions in every stage of development.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <h3 className="text-2xl font-light text-gray-900 tracking-wide">Refine Search</h3>
            {authUser && (
              <Link
                to="/projects/add"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add Project
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-delay">
            {/* Search Filter */}
            <div className="animate-slide-up-filter">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or company"
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="animate-slide-up-filter-delay-1">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
              >
                <option value="">All Statuses</option>
                <option value="In Development">In Development</option>
                <option value="Pre-Production">Pre-Production</option>
                <option value="Production">Production</option>
                <option value="Post-Production">Post-Production</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="animate-slide-up-filter-delay-2">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none text-gray-900 font-light transition-all duration-300 hover:border-gray-300 focus:scale-[1.02]"
              >
                <option value="newest">Newest</option>
                <option value="a-z">A–Z</option>
                <option value="z-a">Z–A</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="animate-slide-up-filter-delay-3">
              <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
                Actions
              </label>
              {(searchQuery || statusFilter) && (
                <button
                  onClick={resetFilters}
                  className="w-full p-4 bg-gray-100 text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02]"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-light text-gray-900 tracking-wide">
                {sortedProjects.length} {sortedProjects.length === 1 ? 'Project' : 'Projects'} Found
              </h3>
              {(searchQuery || statusFilter) && (
                <div className="text-sm font-light text-gray-500 tracking-wide">
                  Showing filtered results
                </div>
              )}
            </div>
          </div>

          {/* Projects Grid */}
          {sortedProjects.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
              <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                No projects found
              </h3>
              <p className="text-lg font-light text-gray-500 max-w-md mx-auto leading-relaxed">
                Try adjusting your search criteria or check back later for new projects
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProjects.map((project, index) => (
                <div 
                  key={project.id}
                  className="animate-card-entrance"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link
                    to={`/projects/${project.id}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden block hover:scale-[1.02]"
                  >
                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={project.coverImageUrl || '/movie-production-avatar.svg'}
                        alt={project.projectName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/movie-production-avatar.svg';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-light text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors">
                        {highlightMatch(project.projectName, debouncedQuery)}
                      </h2>
                      <p className="text-sm font-medium text-gray-500 mb-3 tracking-wider uppercase">
                        {project.productionCompany ? highlightMatch(project.productionCompany, debouncedQuery) : 'N/A'}
                      </p>
                      {project.director && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Director:</span> {project.director}
                        </p>
                      )}
                      {project.producer && (
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Producer:</span> {project.producer}
                        </p>
                      )}
                      <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {project.logline}
                      </p>
                      {project.genres && project.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full tracking-wider ${getStatusBadgeColor(
                          project.status
                        )}`}
                      >
                        {formatStatus(project.status)}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-6 mt-16 animate-fade-in-delay">
            <button
              disabled={prevPages.length < 2}
              onClick={() => fetchProjects('prev')}
              className="px-6 py-3 bg-white text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200"
            >
              Previous
            </button>
            <span className="text-gray-600 font-light tracking-wide">Page {pageNumber}</span>
            <button
              disabled={projects.length < PROJECTS_PER_PAGE}
              onClick={() => fetchProjects('next')}
              className="px-6 py-3 bg-white text-gray-700 font-light tracking-wide rounded-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200"
            >
              Next
            </button>
          </div>
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