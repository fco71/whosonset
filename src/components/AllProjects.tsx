import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

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

const AllProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // Added sort state

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Projects'));
        const data = snapshot.docs.map(doc => ({
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

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };

  const filteredProjects = projects.filter(project => {
    const query = debouncedQuery.toLowerCase();
    const matchesSearch =
      project.projectName.toLowerCase().includes(query) ||
      project.productionCompany.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === '' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {  // Added sorting logic
    if (sortBy === 'a-z') {
      return a.projectName.localeCompare(b.projectName);
    } else if (sortBy === 'z-a') {
      return b.projectName.localeCompare(a.projectName);
    } else {
      return b.id.localeCompare(a.id); // Assumes newer projects have higher IDs (Firestore auto IDs are time-based)
    }
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          Add
        </button>
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

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedProjects.map(project => (
          <Link
            to={`/projects/${project.id}`}
            key={project.id}
            className="flex flex-col md:flex-row bg-gray-800 rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-500/70 shadow-md hover:shadow-blue-500/30 transition duration-300 transform hover:scale-[1.01] min-h-[220px] cursor-pointer"
          >
            {/* Fixed Image Container */}
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

            {/* Info Section */}
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
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {project.logline}
                </p>
              </div>
              <div className="mt-3">
                <span className="inline-block text-xs font-semibold px-3 py-1 bg-blue-700 text-white rounded-full">
                  {project.status}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center text-gray-400 mt-8 col-span-full">
            No projects match your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;