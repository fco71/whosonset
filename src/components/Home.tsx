import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

interface Project {
    id: string;
    projectName: string;
    country: string;
    productionCompany: string;
    status: string;
    logline: string;
    synopsis: string;
    owner_uid: string;
    coverImageUrl: string;
}

const Home: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const projectsCollectionRef = collection(db, 'Projects');
            try {
                const querySnapshot = await getDocs(projectsCollectionRef);
                const projectsData: Project[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data() as Omit<Project, 'id'>,
                }));
                setProjects(projectsData.slice(0, 6)); // Show only 6 recent projects
            } catch (error: any) {
                console.error('Error fetching projects:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

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
                            whosonset
                        </h1>
                        <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
                            Film Industry Hub
                        </h2>
                        <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
                            Discover the latest movie productions and the talented crews behind them. 
                            Connect with industry professionals and explore creative opportunities.
                        </p>
                        <div className="mt-12 animate-slide-up-delay-2">
                            <Link 
                                to="/projects" 
                                className="inline-block px-8 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                            >
                                Explore Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Projects Section */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-8 py-16">
                    <div className="mb-12 animate-fade-in">
                        <h3 className="text-3xl font-light text-gray-900 tracking-wide">
                            Recent Projects
                        </h3>
                    </div>

                    {projects.length === 0 ? (
                        <div className="text-center py-24 animate-fade-in">
                            <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
                            <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                                No projects yet
                            </h3>
                            <p className="text-lg font-light text-gray-500 max-w-md mx-auto leading-relaxed">
                                Be the first to add a project to the platform
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project, index) => (
                                <div 
                                    key={project.id}
                                    className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden animate-card-entrance hover:scale-[1.02]"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {project.coverImageUrl && (
                                        <div className="h-48 overflow-hidden">
                                            <img 
                                                src={project.coverImageUrl} 
                                                alt={project.projectName} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide group-hover:text-gray-700 transition-colors">
                                            <Link to={`/projects/${project.id}`} className="hover:underline">
                                                {project.projectName}
                                            </Link>
                                        </h3>
                                        <p className="text-sm font-medium text-gray-500 mb-3 tracking-wider uppercase">
                                            {project.productionCompany} • {project.country}
                                        </p>
                                        <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                                            {project.logline}
                                        </p>
                                        <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full tracking-wider ${
                                            project.status === 'In Production' ? 'bg-green-100 text-green-800' :
                                            project.status === 'Pre-Production' ? 'bg-blue-100 text-blue-800' :
                                            project.status === 'Post-Production' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="text-center mt-12 animate-fade-in-delay">
                            <Link 
                                to="/projects" 
                                className="inline-block px-6 py-3 text-gray-600 font-light tracking-wide hover:text-gray-900 transition-all duration-300 hover:scale-105"
                            >
                                View All Projects →
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Social Features Promotion Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-8 py-16">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="text-6xl mb-6">🤝</div>
                        <h3 className="text-3xl font-light text-gray-900 tracking-wide mb-4">
                            Connect with Industry Professionals
                        </h3>
                        <p className="text-lg font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Build your network, discover talented crew members, and stay updated with industry activities
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                            <div className="text-4xl mb-4">👥</div>
                            <h4 className="text-xl font-light text-gray-900 mb-3 tracking-wide">Follow & Connect</h4>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Send follow requests to professionals you admire and build meaningful connections
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                            <div className="text-4xl mb-4">💬</div>
                            <h4 className="text-xl font-light text-gray-900 mb-3 tracking-wide">Direct Messaging</h4>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Message your followers directly to discuss projects, opportunities, and collaborations
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                            <div className="text-4xl mb-4">📢</div>
                            <h4 className="text-xl font-light text-gray-900 mb-3 tracking-wide">Activity Feed</h4>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Stay updated with industry news, project updates, and professional achievements
                            </p>
                        </div>
                    </div>

                    <div className="text-center animate-fade-in-delay">
                        <Link 
                            to="/social" 
                            className="inline-block px-8 py-4 bg-gray-900 text-white font-light tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                        >
                            Explore Social Hub
                        </Link>
                        <p className="text-sm text-gray-500 mt-4 font-light">
                            Discover professionals • Send follow requests • Build your network
                        </p>
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
                        <div className="mt-12">
                            <div className="h-12 bg-gray-200 rounded-lg w-48 mx-auto animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Skeleton */}
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

export default Home;