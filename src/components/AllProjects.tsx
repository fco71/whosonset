import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';

interface Project {
  id: string;
  projectName: string;
  productionCompany: string;
  status: string;
  logline: string;
  director?: string;
  producer?: string;
  posterImageUrl?: string;
}

const getStatusBadgeColor = (rawStatus: string) => {
  const status = rawStatus.toLowerCase();

  if (status.includes('development')) return 'bg-indigo-600 text-white';
  if (status.includes('pre')) return 'bg-yellow-500 text-black';
  if (status.includes('filming') || status.includes('production')) return 'bg-green-500 text-white';
  if (status.includes('post')) return 'bg-orange-500 text-white';
  if (status.includes('completed')) return 'bg-blue-500 text-white';
  if (status.includes('cancel')) return 'bg-red-500 text-white';

  return 'bg-gray-600 text-white';
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Projects'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };

  const filteredProjects = projects.filter((project) => {
    const query = debouncedQuery.toLowerCase();
    const matchesSearch =
      project.projectName.toLowerCase().includes(query) ||
      project.productionCompany.toLowerCase().includes(query);
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
        <mark key={i} className="bg-yellow-300 text-gray-900 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return <div className="text-white p-8">Loading projects...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Projects</h1>
        {authUser && (
          <Link
            to="/projects/add"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or company"
          className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="In Development">In Development</option>
          <option value="Pre-Production">Pre-Production</option>
          <option value="Production">Production</option>
          <option value="Post-Production">Post-Production</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest</option>
          <option value="a-z">A–Z</option>
          <option value="z-a">Z–A</option>
        </select>

        {(searchQuery || statusFilter) && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition"
          >
            Reset
          </button>
        )}
      </div>

      {/* Animated Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {sortedProjects.map((project) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Link
              to={`/projects/${project.id}`}
              className="flex flex-col md:flex-row bg-gray-800 rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-500/70 shadow-md hover:shadow-blue-500/30 transition duration-300 transform hover:scale-[1.01] min-h-[220px] cursor-pointer"
            >
              <div className="w-full md:w-[200px] h-[200px] bg-black flex items-center justify-center shrink-0">
                <img
                  src={project.posterImageUrl || '/my-icon.png'}
                  alt={project.projectName}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/my-icon.png';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0 p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-pink-400 truncate">
                    {highlightMatch(project.projectName, debouncedQuery)}
                  </h2>
                  <p className="text-white font-medium truncate">
                    {highlightMatch(project.productionCompany, debouncedQuery)}
                  </p>
                  {project.director && (
                    <p className="text-sm text-gray-300 truncate">
                      <span className="font-semibold">Director:</span> {project.director}
                    </p>
                  )}
                  {project.producer && (
                    <p className="text-sm text-gray-300 truncate">
                      <span className="font-semibold">Producer:</span> {project.producer}
                    </p>
                  )}
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.logline}</p>
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(
                      project.status
                    )}`}
                  >
                    {formatStatus(project.status)}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center text-gray-400 mt-8 col-span-full">
            No projects match your filters.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AllProjects;
