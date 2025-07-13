import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ProjectCard from './ProjectCard';
import { FavoritesService } from '../utilities/favoritesService';


import CrewProfileCard from './CrewProfileCard';
import { CrewProfile } from '../types/CrewProfile';
import { getHighlightedProjects, getHighlightedCrew, ProjectEntry } from '../utilities/highlightUtils';

interface Project {
    id: string;
    projectName: string;
    country?: string;
    productionLocations?: Array<{ country: string; city?: string }>;
    productionCompany: string;
    status: string;
    logline: string;
    synopsis: string;
    owner_uid: string;
    coverImageUrl: string;
}

const Home: React.FC = () => {
    const [projects, setProjects] = useState<ProjectEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

    // Search/filter state for projects
    const [projectSearch, setProjectSearch] = useState('');
    const [projectDept, setProjectDept] = useState('');

    const [crew, setCrew] = useState<CrewProfile[]>([]);
    const [crewLoading, setCrewLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                loadFavorites();
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch highlighted projects and crew for homepage
    useEffect(() => {
        setLoading(true);
        setCrewLoading(true);
        const fetchHighlights = async () => {
            try {
                const [highlightedProjects, highlightedCrew] = await Promise.all([
                    getHighlightedProjects(),
                    getHighlightedCrew()
                ]);
                setProjects(highlightedProjects);
                setCrew(highlightedCrew);
            } catch (error) {
                console.error('Error fetching highlights:', error);
            } finally {
                setLoading(false);
                setCrewLoading(false);
            }
        };
        fetchHighlights();
    }, []);

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

    useEffect(() => {
        const fetchProjects = async () => {
            const projectsCollectionRef = collection(db, 'Projects');
            try {
                const querySnapshot = await getDocs(projectsCollectionRef);
                const projectsData: ProjectEntry[] = querySnapshot.docs.map(doc => {
                    const data = doc.data() as Omit<Project, 'id'> & { createdAt?: any; views?: number };
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt || null,
                        views: typeof data.views === 'number' ? data.views : 0,
                    };
                });
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
            <div className="section-gradient border-b border-gray-100">
                <div className="container-base section-padding-large">
                    <div className="text-center mb-16 animate-fade">
                        <h1 className="heading-primary mb-6 animate-slide" style={{ color: '#222', opacity: 1 }}>
                            whosonset
                        </h1>
                        <h2 className="heading-secondary mb-8 animate-slide" style={{ color: '#444', opacity: 1 }}>
                            Film Industry Hub
                        </h2>
                        <p className="body-large max-w-2xl mx-auto animate-slide">
                            Discover the latest movie productions and the talented crews behind them. 
                            Connect with industry professionals and explore creative opportunities.
                        </p>
                        <div className="mt-12 animate-slide">
                            <Link 
                                to="/projects" 
                                className="btn-primary"
                            >
                                Explore Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Highlighted Projects Section */}
            <div className="section-gray">
                <div className="container-base section-padding">
                    <div className="mb-12 animate-fade">
                        <h3 className="heading-tertiary">Project Highlights</h3>
                    </div>
                    {/* Search and filter UI */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade">
                        <input
                            type="text"
                            className="input-base w-full sm:w-1/2"
                            placeholder="Search projects by name or company..."
                            value={projectSearch}
                            onChange={e => setProjectSearch(e.target.value)}
                            aria-label="Search projects"
                        />
                        <select
                            className="input-base w-full sm:w-1/4"
                            value={projectDept}
                            onChange={e => setProjectDept(e.target.value)}
                            aria-label="Filter by department"
                        >
                            <option value="">All Departments</option>
                            <option value="Camera">Camera</option>
                            <option value="Lighting">Lighting</option>
                            <option value="Sound">Sound</option>
                            <option value="Art Department">Art Department</option>
                            <option value="Wardrobe">Wardrobe</option>
                            <option value="Hair & Makeup">Hair & Makeup</option>
                            <option value="Production">Production</option>
                            <option value="Post-Production">Post-Production</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-xl h-64" />
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-24 animate-fade">
                            <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
                            <h3 className="heading-card mb-4">No projects yet</h3>
                            <p className="body-medium max-w-md mx-auto">Be the first to add a project to the platform</p>
                        </div>
                    ) : (
                        <div className="grid-cards">
                            {projects
                                .filter(project =>
                                    (!projectSearch ||
                                        project.projectName.toLowerCase().includes(projectSearch.toLowerCase()) ||
                                        (project.productionCompany && project.productionCompany.toLowerCase().includes(projectSearch.toLowerCase()))
                                    ) &&
                                    (!projectDept || (project.department && project.department === projectDept))
                                )
                                .map((project, index) => (
                                    <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                        <ProjectCard
                                            id={project.id}
                                            projectName={project.projectName}
                                            productionCompany={project.productionCompany}
                                            country={project.country}
                                            productionLocations={project.productionLocations}
                                            status={project.status}
                                            summary={project.synopsis}
                                            coverImageUrl={project.coverImageUrl}
                                            showDetails={false}
                                            onBookmark={user ? handleBookmark : undefined}
                                            isBookmarked={favoriteIds.includes(project.id)}
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                    {projects.length > 0 && (
                        <div className="text-center mt-12 animate-fade">
                            <Link to="/projects" className="btn-secondary">View All Projects →</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Highlighted Crew Section */}
            <div className="section-white border-b border-gray-100">
                <div className="container-base section-padding">
                    <div className="mb-12 animate-fade text-center">
                        <h3 className="heading-tertiary mb-2">Crew Highlights</h3>
                        <p className="body-medium max-w-2xl mx-auto text-gray-500">
                            Meet some of the talented professionals on whosonset
                        </p>
                    </div>
                    {crewLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-gray-100 rounded-xl h-64" />
                            ))}
                        </div>
                    ) : crew.length === 0 ? (
                        <div className="text-center py-16 animate-fade">
                            <div className="text-7xl mb-6 opacity-20">🎬</div>
                            <h4 className="heading-card mb-2">No crew profiles yet</h4>
                            <p className="body-medium max-w-md mx-auto">Be the first to create a crew profile!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade">
                            {crew.map((profile, index) => (
                                <CrewProfileCard key={profile.uid} profile={profile} index={index} />
                            ))}
                        </div>
                    )}
                    {crew.length > 0 && (
                        <div className="text-center mt-10 animate-fade">
                            <Link to="/social" className="btn-secondary">
                                View All Crew →
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Social Features Promotion Section */}
            <div className="section-light border-b border-gray-100">
                <div className="container-base section-padding">
                    <div className="text-center mb-12 animate-fade">
                        <div className="text-6xl mb-6">🤝</div>
                        <h3 className="heading-tertiary mb-4">
                            Connect with Industry Professionals
                        </h3>
                        <p className="body-medium max-w-2xl mx-auto">
                            Build your network, discover talented crew members, and stay updated with industry activities
                        </p>
                    </div>

                    <div className="grid-features mb-12">
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                            <div className="text-4xl mb-4">👥</div>
                            <h4 className="heading-card mb-3">Follow & Connect</h4>
                            <p className="body-medium">
                                Send follow requests to professionals you admire and build meaningful connections
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                            <div className="text-4xl mb-4">💬</div>
                            <h4 className="heading-card mb-3">Direct Messaging</h4>
                            <p className="body-medium">
                                Message your followers directly to discuss projects, opportunities, and collaborations
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300">
                            <div className="text-4xl mb-4">📢</div>
                            <h4 className="heading-card mb-3">Activity Feed</h4>
                            <p className="body-medium">
                                Stay updated with the latest activities and announcements from your network
                            </p>
                        </div>
                    </div>

                    <div className="text-center animate-fade">
                        <Link 
                            to="/social" 
                            className="btn-primary"
                        >
                            Join the Community
                        </Link>
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