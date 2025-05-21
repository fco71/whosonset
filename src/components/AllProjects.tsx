import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

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
    const [statusFilter, setStatusFilter] = useState('');

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

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
    };

    const filteredProjects = projects.filter(project => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            project.projectName.toLowerCase().includes(query) ||
            project.productionCompany.toLowerCase().includes(query);
        const matchesStatus =
            statusFilter === '' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
                {filteredProjects.map(project => (
                    <div
                        key={project.id}
                        className="flex flex-col md:flex-row bg-gray-800 rounded-xl overflow-hidden border border-blue-500/20 hover:border-blue-500/70 shadow-md hover:shadow-blue-500/30 transition duration-300 transform hover:scale-[1.01] min-h-[220px]"
                    >
                        {/* Image */}
                        <div className="w-full md:w-[200px] h-[220px] md:h-auto bg-black flex items-center justify-center shrink-0">
                            <img
                                src={project.posterImageUrl || '/my-icon.png'}
                                alt={project.projectName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/my-icon.png';
                                }}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 p-5 flex flex-col justify-between">
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold text-pink-400 truncate">
                                    {project.projectName}
                                </h2>
                                <p className="text-white font-medium truncate">
                                    {project.productionCompany}
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
                    </div>
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
