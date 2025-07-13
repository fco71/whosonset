import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ProjectCard from './ProjectCard';
import { FavoritesService } from '../utilities/favoritesService';
import GridSkeleton from './GridSkeleton';


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

const DEPARTMENT_OPTIONS = [
    { value: '', label: 'All Departments' },
    { value: 'Camera', label: 'Camera' },
    { value: 'Lighting', label: 'Lighting' },
    { value: 'Sound', label: 'Sound' },
    { value: 'Art Department', label: 'Art Department' },
    { value: 'Wardrobe', label: 'Wardrobe' },
    { value: 'Hair & Makeup', label: 'Hair & Makeup' },
    { value: 'Production', label: 'Production' },
    { value: 'Post-Production', label: 'Post-Production' },
    { value: 'Other', label: 'Other' },
];

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
    // Search/filter state for crew
    const [crewSearch, setCrewSearch] = useState('');
    const [crewDept, setCrewDept] = useState('');

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

    // Removed redundant fetchProjects useEffect. All project highlights now come from highlightUtils.

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-white" role="main">
            {/* Hero Section */}
            <div style={{ borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(180deg, #f9fafb 0%, #fff 100%)' }} aria-label="Hero section">
                <div className="container-base section-padding-large">
                    <div className="text-center mb-16 animate-fade">
                        <h1 className="heading-primary mb-6 animate-slide">
                            whosonset
                        </h1>
                        <h2 className="heading-secondary mb-8 animate-slide">
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
            <div style={{ background: '#f9fafb' }} aria-label="Project Highlights">
                <div className="container-base section-padding" style={{paddingLeft: 24, paddingRight: 24}}>
                    <div className="mb-12 animate-fade">
                        <h3 className="heading-tertiary text-2xl font-bold tracking-tight text-gray-900" id="project-highlights-heading" style={{ letterSpacing: '-0.01em' }}>
                            Project Highlights
                        </h3>
                        {/* Add spacing below heading for visual balance */}
                        <div style={{ height: 18 }} />
                    </div>
                    {/* Search and filter UI */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade items-center" aria-label="Project search and filter">
                        <div className="relative w-full sm:w-2/3 max-w-xl mx-auto" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}>
                            <span className="mr-2 text-gray-400">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            </span>
                            <input
                                type="text"
                                style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 16, color: '#111827', padding: '0.5rem 0' }}
                                placeholder="Search projects by name or company..."
                                value={projectSearch}
                                onChange={e => setProjectSearch(e.target.value)}
                                aria-label="Search projects by name or company"
                                id="project-search-input"
                            />
                            <select
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: '#6b7280', marginLeft: 12 }}
                                value={projectDept}
                                onChange={e => setProjectDept(e.target.value)}
                                aria-label="Filter projects by department"
                                id="project-department-select"
                            >
                                {DEPARTMENT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {loading ? (
                        <GridSkeleton count={4} height="h-64" />
                    ) : projects.length === 0 ? (
                        <div className="text-center py-24 animate-fade" aria-live="polite">
                            <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">🎬</div>
                            <h3 className="heading-card mb-4">No projects yet</h3>
                            <p className="body-medium max-w-md mx-auto">Be the first to add a project to the platform</p>
                            {/* Fallback: Show example projects if none fetched */}
                            <div className="mt-8">
                                <div className="heading-card mb-2 text-gray-700">Example Projects</div>
                                <div className="grid-cards">
                                    {[{
                                        id: 'example1',
                                        projectName: 'Sample Feature Film',
                                        productionCompany: 'Demo Productions',
                                        country: 'USA',
                                        productionLocations: [{ country: 'USA', city: 'Los Angeles' }],
                                        status: 'In Production',
                                        synopsis: 'A thrilling adventure in the heart of Hollywood.',
                                        coverImageUrl: '',
                                    }, {
                                        id: 'example2',
                                        projectName: 'Indie Short',
                                        productionCompany: 'Indie Studio',
                                        country: 'UK',
                                        productionLocations: [{ country: 'UK', city: 'London' }],
                                        status: 'Completed',
                                        synopsis: 'A touching story of friendship and dreams.',
                                        coverImageUrl: '',
                                    }].map((project, index) => (
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
                                                isBookmarked={false}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite" aria-labelledby="project-highlights-heading" style={{marginLeft: 0, marginRight: 0}}>
                            {projects
                                .filter(project =>
                                    (!projectSearch ||
                                        (project.projectName && project.projectName.toLowerCase().includes(projectSearch.toLowerCase())) ||
                                        (project.productionCompany && project.productionCompany.toLowerCase().includes(projectSearch.toLowerCase()))
                                    ) &&
                                    (!projectDept || (project.department && project.department === projectDept))
                                )
                                .map((project, index) => (
                                    <div key={project.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                        <ProjectCard
                                            id={project.id}
                                            projectName={project.projectName || 'Untitled Project'}
                                            productionCompany={project.productionCompany}
                                            country={project.country}
                                            productionLocations={project.productionLocations}
                                            status={project.status}
                                            summary={project.synopsis}
                                            coverImageUrl={project.coverImageUrl}
                                            showDetails={false}
                                            onBookmark={user ? handleBookmark : () => alert('Please log in to bookmark projects.')}
                                            isBookmarked={favoriteIds.includes(project.id)}
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                    {projects.length > 0 && (
                        <div className="text-center mt-12 animate-fade" style={{ paddingBottom: 36 }}>
                            <Link to="/projects" className="btn-secondary">View All Projects →</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Highlighted Crew Section */}
            <div style={{ background: '#fff', borderBottom: '1px solid #f3f4f6', paddingTop: 32 }} aria-label="Crew Highlights">
                <div className="container-base section-padding">
                    <div className="mb-12 animate-fade text-center">
                        <h3 className="heading-tertiary mb-2" id="crew-highlights-heading">Crew Highlights</h3>
                        <p className="body-medium max-w-2xl mx-auto text-gray-500">
                            Meet some of the talented professionals on whosonset
                        </p>
                    </div>
                    {/* Search and filter UI for crew */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade items-center" aria-label="Crew search and filter" style={{paddingLeft: 8, paddingRight: 8}}>
                        <div className="relative w-full sm:w-1/2" style={{marginLeft: 'auto', marginRight: 'auto', maxWidth: 420}}>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                            </span>
                            <input
                                type="text"
                                className="input-base pl-10 pr-3 py-2 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition"
                                placeholder="Search crew by name, title, or location..."
                                value={crewSearch}
                                onChange={e => setCrewSearch(e.target.value)}
                                aria-label="Search crew by name, title, or location"
                                id="crew-search-input"
                            />
                        </div>
                        <div className="relative w-full sm:w-1/4">
                            <select
                                className="input-base w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white text-gray-900 py-2 pl-3 pr-8 shadow-sm transition appearance-none"
                                value={crewDept}
                                onChange={e => setCrewDept(e.target.value)}
                                aria-label="Filter crew by department"
                                id="crew-department-select"
                            >
                                {DEPARTMENT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                            </span>
                        </div>
                    </div>
                    {crewLoading ? (
                        <GridSkeleton count={4} height="h-64" />
                    ) : crew.length === 0 ? (
                        <div className="text-center py-16 animate-fade" aria-live="polite">
                            <div className="text-7xl mb-6 opacity-20">🎬</div>
                            <h4 className="heading-card mb-2">No crew profiles yet</h4>
                            <p className="body-medium max-w-md mx-auto">Be the first to create a crew profile!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade" aria-live="polite" aria-labelledby="crew-highlights-heading" style={{paddingLeft: 8, paddingRight: 8}}>
                            {crew
                                .filter(profile => {
                                    // Search by name
                                    const matchesName = !crewSearch || (profile.name && profile.name.toLowerCase().includes(crewSearch.toLowerCase()));
                                    // Search by job title
                                    const matchesJobTitle = !crewSearch || (profile.jobTitles && profile.jobTitles.some(jt => jt.title.toLowerCase().includes(crewSearch.toLowerCase())));
                                    // Search by city or country
                                    const matchesResidence = !crewSearch || (profile.residences && profile.residences.some(res =>
                                        (res.city && res.city.toLowerCase().includes(crewSearch.toLowerCase())) ||
                                        (res.country && res.country.toLowerCase().includes(crewSearch.toLowerCase()))
                                    ));
                                    // Department filter
                                    const matchesDept = !crewDept || (profile.jobTitles && profile.jobTitles.some(jt => jt.department === crewDept));
                                    return (matchesName || matchesJobTitle || matchesResidence) && matchesDept;
                                })
                                .map((profile, index) => {
                                    const mainTitle = profile.jobTitles && profile.jobTitles.length > 0 ? profile.jobTitles[0].title : '';
                                    const mainLocation = profile.residences && profile.residences.length > 0 ? `${profile.residences[0].city ? profile.residences[0].city + ', ' : ''}${profile.residences[0].country || ''}` : '';
                                    const imageUrl = profile.profileImageUrl || '/default-avatar.svg';
                                    const availability = profile.availability || '';
                                    return (
                                        <Link to={`/crew/${profile.uid}`} key={profile.uid} className="group flex items-center bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 gap-4 hover:shadow-md transition-shadow duration-200 cursor-pointer" style={{minHeight: 64, textDecoration: 'none'}}>
                                            <img src={imageUrl} alt={profile.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" style={{flexShrink: 0}} onError={e => { (e.target as HTMLImageElement).src = '/default-avatar.svg'; }} />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 truncate group-hover:text-blue-700" style={{fontSize: 16}}>{profile.name}</div>
                                                <div className="text-xs text-gray-500 truncate">{mainTitle}{mainLocation ? ' · ' + mainLocation : ''}</div>
                                            </div>
                                            {availability && (
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${availability.toLowerCase() === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{availability}</span>
                                            )}
                                        </Link>
                                    );
                                })}
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

            {/* Social Features Promotion Section Removed */}
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