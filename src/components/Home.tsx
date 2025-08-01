import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, orderBy, limit, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ProjectCard from './ProjectCard';
import { FavoritesService } from '../utilities/favoritesService';
import GridSkeleton from './GridSkeleton';
import { CrewFavoritesService } from '../utilities/crewFavoritesService';


import CrewProfileCard from './CrewProfileCard';
import { CrewProfile } from '../types/CrewProfile';
import { getHighlightedProjects, getHighlightedCrew, ProjectEntry } from '../utilities/highlightUtils';
import { toast } from 'react-hot-toast';

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
    startDate?: string;
    endDate?: string;
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
    // Crew favorites state
    const [favoriteCrewIds, setFavoriteCrewIds] = useState<string[]>([]);
    // Toggle for showing only bookmarked crew
    const [showOnlyBookmarkedCrew, setShowOnlyBookmarkedCrew] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                loadFavorites();
                loadCrewFavorites();
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch highlighted projects and crew for homepage
    useEffect(() => {
        console.log("Attempting Firestore fetch");
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
            const newStatus = await FavoritesService.toggleFavorite(projectId, project);
            setFavoriteIds(prev => {
                if (newStatus) {
                    return [...prev, projectId];
                } else {
                    return prev.filter(id => id !== projectId);
                }
            });
            
            // Show success notification
            if (newStatus) {
                toast.success('Project added to favorites!');
            } else {
                toast.success('Project removed from favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Failed to update favorites. Please try again.');
        }
    };

    // Crew favorites logic
    const loadCrewFavorites = async () => {
        try {
            const ids = await CrewFavoritesService.getFavoriteCrewIds();
            setFavoriteCrewIds(ids);
        } catch (error) {
            console.error('Error loading crew favorites:', error);
        }
    };

    const handleCrewBookmark = async (crewId: string, isBookmarked: boolean, crewData: any) => {
        try {
            if (isBookmarked) {
                await CrewFavoritesService.removeFromFavorites(crewId);
                setFavoriteCrewIds(prev => prev.filter(id => id !== crewId));
            } else {
                await CrewFavoritesService.addToFavorites(crewId, crewData);
                setFavoriteCrewIds(prev => [...prev, crewId]);
            }
        } catch (error) {
            console.error('Error toggling crew favorite:', error);
        }
    };

    // Removed redundant fetchProjects useEffect. All project highlights now come from highlightUtils.

    if (loading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="min-h-screen" style={{ background: '#f6f7fa' }} role="main">
            {/* Hero Section */}
            <div style={{ borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} aria-label="Hero section">
                <div className="container-base section-padding-large">
                    <div className="text-center mb-16 animate-fade">
                        <h1 className="text-5xl font-bold text-white mb-6 animate-slide tracking-tight">
                            whosonset
                        </h1>
                        <h2 className="text-2xl font-light text-white/90 mb-8 animate-slide">
                            The Film Industry's Professional Network
                        </h2>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto animate-slide leading-relaxed">
                            Connect with talented film professionals, discover exciting productions, and build your career in the entertainment industry. 
                            Join thousands of filmmakers, crew members, and industry leaders.
                        </p>
                        <div className="mt-12 animate-slide space-x-4">
                            <Link 
                                to="/projects" 
                                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
                            >
                                🎬 Explore Projects
                            </Link>
                            <Link 
                                to="/social" 
                                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/10 transition-colors"
                            >
                                👥 Meet the Crew
                            </Link>
                        </div>
                    </div>
                </div>
            </div>



            {/* Stats Section */}
            <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderBottom: '1px solid #e2e8f0' }} aria-label="Platform Statistics">
                <div className="container-base section-padding" style={{paddingLeft: 32, paddingRight: 32, maxWidth: 1200, margin: '0 auto'}}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="animate-fade">
                                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                            {projects.length > 0 ? projects.length + '+' : '—'}
                        </div>
                            <div className="text-gray-600 font-medium">Active Projects</div>
                        </div>
                        <div className="animate-fade" style={{animationDelay: '0.1s'}}>
                                                    <div className="text-3xl font-bold text-purple-600 mb-2">
                            {crew.length > 0 ? crew.length + '+' : '—'}
                        </div>
                            <div className="text-gray-600 font-medium">Industry Professionals</div>
                        </div>
                        <div className="animate-fade" style={{animationDelay: '0.2s'}}>
                            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                            <div className="text-gray-600 font-medium">Network Access</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Highlighted Projects Section */}
            <div style={{ background: 'transparent' }} aria-label="Project Highlights">
                <div className="container-base section-padding" style={{paddingLeft: 32, paddingRight: 32, maxWidth: 1200, margin: '0 auto'}}>
                    <div className="mb-12 animate-fade text-center">
                        <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-4" id="project-highlights-heading">
                            Featured Productions
                        </h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover the latest film projects, from major studio productions to independent films making waves in the industry
                        </p>
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
                        <div className="text-center py-16 animate-fade" aria-live="polite">
                            <div className="text-6xl mb-6 opacity-20">🎬</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Featured Projects</h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                Check back soon for the latest film productions and industry highlights
                            </p>
                            <Link to="/projects" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                Browse All Projects
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-live="polite" aria-labelledby="project-highlights-heading" style={{marginLeft: 0, marginRight: 0}}>
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
                                        <div className="rounded-3xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-200 border border-gray-100" style={{overflow: 'hidden'}}>
                                            <ProjectCard
                                                id={project.id}
                                                projectName={project.projectName || 'Untitled Project'}
                                                productionCompany={project.productionCompany}
                                                country={project.country}
                                                productionLocations={project.productionLocations}
                                                status={project.status}
                                                summary={project.synopsis}
                                                coverImageUrl={project.coverImageUrl}
                                                startDate={project.startDate}
                                                endDate={project.endDate}
                                                showDetails={false}
                                                onBookmark={user ? handleBookmark : () => alert('Please log in to bookmark projects.')}
                                                isBookmarked={favoriteIds.includes(project.id)}
                                            />
                                        </div>
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
            <div style={{ background: 'transparent', borderBottom: '1px solid #f3f4f6', paddingTop: 32 }} aria-label="Crew Highlights">
                <div className="container-base section-padding" style={{paddingLeft: 32, paddingRight: 32, maxWidth: 1200, margin: '0 auto'}}>
                    <div className="mb-12 animate-fade text-center">
                        <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-4" id="crew-highlights-heading">Industry Professionals</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Connect with experienced filmmakers, talented crew members, and industry leaders from around the world
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
                        <div className="relative w-full sm:w-1/4 flex items-center gap-2">
                            {/* Toggle for bookmarked crew */}
                            {user && (
                                <label className="flex items-center cursor-pointer select-none mr-2" style={{minWidth: 120}}>
                                    <span className="text-xs font-medium text-gray-700 mr-2">Bookmarked</span>
                                    <span className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            checked={showOnlyBookmarkedCrew}
                                            onChange={() => setShowOnlyBookmarkedCrew(v => !v)}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer transition-all duration-200 checked:bg-yellow-400 checked:border-yellow-500"
                                            style={{ left: 0, top: 0 }}
                                            aria-pressed={showOnlyBookmarkedCrew}
                                            aria-label={showOnlyBookmarkedCrew ? 'Show all crew' : 'Show only bookmarked crew'}
                                        />
                                        <span className="toggle-bg block w-10 h-6 rounded-full bg-gray-200 transition-all duration-200" />
                                    </span>
                                </label>
                            )}
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
                            <div className="text-6xl mb-6 opacity-20">👥</div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">No Featured Crew</h4>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                Discover talented film industry professionals and connect with the community
                            </p>
                            <Link to="/social" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                Explore Crew Network
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade" aria-live="polite" aria-labelledby="crew-highlights-heading" style={{paddingLeft: 0, paddingRight: 0}}>
                            {crew
                                .filter(profile => {
                                    // Bookmarked filter
                                    if (showOnlyBookmarkedCrew && !favoriteCrewIds.includes(profile.uid)) return false;
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
                                    const isBookmarked = favoriteCrewIds.includes(profile.uid);
                                    return (
                                        <div key={profile.uid} className="relative group flex items-center bg-white rounded-2xl border border-gray-100 shadow-lg px-5 py-4 gap-4 hover:shadow-xl transition-shadow duration-200 cursor-pointer" style={{minHeight: 68, textDecoration: 'none'}}>
                                            {/* Bookmark button - upper right */}
                                            {user && (
                                                <button
                                                    onClick={e => { e.preventDefault(); handleCrewBookmark(profile.uid, isBookmarked, profile); }}
                                                    className="absolute top-2 right-2 z-20 hover:scale-110 transition-transform duration-200"
                                                    style={{background: 'none', border: 'none', padding: 0, lineHeight: 1, boxShadow: 'none'}}
                                                    title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                                                >
                                                    <svg className={`w-6 h-6 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                </button>
                                            )}
                                            <a href={`/resume/${profile.uid}`} target="_blank" rel="noopener noreferrer" className="flex items-center flex-1 min-w-0 gap-4" style={{textDecoration: 'none'}}>
                                                <img src={imageUrl} alt={profile.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-200" style={{flexShrink: 0}} onError={e => { (e.target as HTMLImageElement).src = '/default-avatar.svg'; }} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-gray-900 truncate group-hover:text-blue-700" style={{fontSize: 17, letterSpacing: '-0.01em'}}>{profile.name}</div>
                                                    <div className="text-xs text-gray-500 truncate" style={{fontWeight: 500}}>{mainTitle}{mainLocation ? ' · ' + mainLocation : ''}</div>
                                                </div>
                                            </a>
                                            {/* Availability badge - lower right */}
                                            {availability && (
                                                <span className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${availability.toLowerCase() === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{availability}</span>
                                            )}
                                        </div>
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