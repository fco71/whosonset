"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[1263],{

/***/ 1263:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_ProjectsPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./src/components/ProjectCard.tsx + 1 modules
var ProjectCard = __webpack_require__(1928);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
;// ./src/utilities/favoritesService.ts


class FavoritesService {
    /**
     * Add a project to user's favorites
     */
    static async addToFavorites(projectId, projectData) {
        const user = firebase/* auth */.j2.currentUser;
        if (!user) {
            throw new Error('User must be authenticated to add favorites');
        }
        console.log('[FavoritesService] Adding to favorites:', { projectId, userId: user.uid });
        const favoriteData = {
            id: `${user.uid}_${projectId}`,
            projectId,
            userId: user.uid,
            addedAt: new Date(),
            projectData: projectData ? {
                projectName: projectData.projectName,
                productionCompany: projectData.productionCompany,
                status: projectData.status,
                coverImageUrl: projectData.coverImageUrl,
            } : undefined
        };
        console.log('[FavoritesService] Favorite data:', favoriteData);
        await (0,index_esm/* setDoc */.BN)((0,index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteData.id), favoriteData);
        console.log('[FavoritesService] Successfully added to favorites');
    }
    /**
     * Remove a project from user's favorites
     */
    static async removeFromFavorites(projectId) {
        const user = firebase/* auth */.j2.currentUser;
        if (!user) {
            throw new Error('User must be authenticated to remove favorites');
        }
        try {
            console.log('[FavoritesService] Removing from favorites:', { projectId, userId: user.uid });
            const favoriteId = `${user.uid}_${projectId}`;
            await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteId));
            console.log('[FavoritesService] Successfully removed from favorites');
        }
        catch (error) {
            console.error('Error removing from favorites:', error);
            throw error;
        }
    }
    /**
     * Check if a project is in user's favorites
     */
    static async isFavorite(projectId) {
        const user = firebase/* auth */.j2.currentUser;
        if (!user)
            return false;
        try {
            const favoriteId = `${user.uid}_${projectId}`;
            const favoriteDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteId));
            return favoriteDoc.exists();
        }
        catch (error) {
            console.error('Error checking if project is favorite:', error);
            return false;
        }
    }
    /**
     * Get all user's favorite projects
     */
    static async getFavorites() {
        const user = firebase/* auth */.j2.currentUser;
        console.log('[FavoritesService] Getting favorites for user:', user?.uid);
        if (!user) {
            console.log('[FavoritesService] No user, returning empty array');
            return [];
        }
        try {
            console.log('[FavoritesService] Querying favorites collection...');
            // Test if we can access the collection at all
            try {
                const testQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, this.COLLECTION_NAME), (0,index_esm/* limit */.AB)(1));
                const testSnapshot = await (0,index_esm/* getDocs */.GG)(testQuery);
                console.log('[FavoritesService] Can access favorites collection, test query returned:', testSnapshot.docs.length, 'documents');
            }
            catch (testError) {
                console.error('[FavoritesService] Cannot access favorites collection:', testError);
                return [];
            }
            const favoritesQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, this.COLLECTION_NAME), (0,index_esm/* where */._M)('userId', '==', user.uid), (0,index_esm/* orderBy */.My)('addedAt', 'asc'), (0,index_esm/* orderBy */.My)('__name__', 'asc'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(favoritesQuery);
            console.log('[FavoritesService] Found favorites documents:', snapshot.docs.length);
            const favorites = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : data.addedAt
                };
            });
            console.log('[FavoritesService] Processed favorites:', favorites.map(f => ({ id: f.id, projectId: f.projectId })));
            return favorites;
        }
        catch (error) {
            console.error('[FavoritesService] Error getting favorites:', error);
            return [];
        }
    }
    /**
     * Get favorite project IDs for a user
     */
    static async getFavoriteProjectIds() {
        console.log('[FavoritesService] Getting favorite project IDs...');
        const user = firebase/* auth */.j2.currentUser;
        console.log('[FavoritesService] Current user:', user?.uid);
        if (!user) {
            console.log('[FavoritesService] No user authenticated, returning empty array');
            return [];
        }
        try {
            const favorites = await this.getFavorites();
            const favoriteIds = favorites.map(fav => fav.projectId);
            console.log('[FavoritesService] Found favorite IDs:', favoriteIds);
            return favoriteIds;
        }
        catch (error) {
            console.error('[FavoritesService] Error getting favorite project IDs:', error);
            return [];
        }
    }
    /**
     * Toggle favorite status
     */
    static async toggleFavorite(projectId, projectData) {
        const isCurrentlyFavorite = await this.isFavorite(projectId);
        if (isCurrentlyFavorite) {
            await this.removeFromFavorites(projectId);
            return false;
        }
        else {
            await this.addToFavorites(projectId, projectData);
            return true;
        }
    }
}
FavoritesService.COLLECTION_NAME = 'favorites';

// EXTERNAL MODULE: ./src/services/ProjectCrewService.ts
var ProjectCrewService = __webpack_require__(8390);
;// ./src/pages/ProjectsPage.tsx









const ProjectsPage = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const [projects, setProjects] = (0,react.useState)([]);
    const [ownedProjects, setOwnedProjects] = (0,react.useState)([]);
    const [crewProjects, setCrewProjects] = (0,react.useState)([]);
    const [favorites, setFavorites] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [tab, setTab] = (0,react.useState)('all');
    const navigate = (0,dist/* useNavigate */.Zp)();
    const user = firebase/* auth */.j2.currentUser;
    console.log('[ProjectsPage] Component rendered, user:', user?.uid, 'authenticated:', !!user);
    // Test authentication
    (0,react.useEffect)(() => {
        console.log('[ProjectsPage] Auth state check:', {
            user: user?.uid,
            userEmail: user?.email,
            isAuthenticated: !!user,
            authCurrentUser: firebase/* auth */.j2.currentUser?.uid
        });
        // Test bookmark functionality
        if (user && projects.length > 0) {
            console.log('[ProjectsPage] Testing bookmark functionality...');
            const testProject = projects[0];
            console.log('[ProjectsPage] Test project:', { id: testProject.id, name: testProject.projectName, isFavorite: testProject.isFavorite });
        }
    }, [user, projects]);
    const fetchProjects = (0,react.useCallback)(async () => {
        console.log('[ProjectsPage] fetchProjects called');
        setLoading(true);
        setError(null);
        try {
            console.log('[ProjectsPage] Starting to fetch projects, user:', user?.uid);
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'Projects'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                }
                catch (favoritesError) {
                    console.error('[ProjectsPage] Error loading favorites:', favoritesError);
                    // Set projects without favorites if there's an error
                    setProjects(data);
                }
            }
            else {
                console.log('[ProjectsPage] No user authenticated, setting projects without favorites');
                setProjects(data);
            }
        }
        catch (err) {
            console.error('[ProjectsPage] Error fetching projects:', err);
            setError(t('projects.errorLoading'));
        }
        finally {
            setLoading(false);
        }
    }, [user, t]);
    const fetchMyProjects = (0,react.useCallback)(async () => {
        if (!user)
            return;
        try {
            // Fetch owned projects
            const ownedQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'Projects'), (0,index_esm/* where */._M)('owner_uid', '==', user.uid));
            const ownedSnapshot = await (0,index_esm/* getDocs */.GG)(ownedQuery);
            const ownedData = ownedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Fetch projects where user is a crew member
            const crewProjectsData = await ProjectCrewService/* ProjectCrewService */.g.getProjectsForCrewMember(user.uid);
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
        }
        catch (err) {
            console.error('Error fetching my projects:', err);
        }
    }, [user]);
    const loadFavorites = (0,react.useCallback)(async () => {
        if (user) {
            try {
                const userFavorites = await FavoritesService.getFavorites();
                setFavorites(userFavorites);
            }
            catch (error) {
                console.error('Error loading favorites:', error);
                setFavorites([]); // Set empty array on error
            }
        }
        else {
            setFavorites([]); // Clear favorites when no user
        }
    }, [user]);
    (0,react.useEffect)(() => {
        console.log('[ProjectsPage] Component rendered, user:', user?.uid, 'authenticated:', !!user);
        if (user) {
            console.log('[ProjectsPage] User authenticated, calling fetchProjects and fetchMyProjects');
            fetchProjects();
            fetchMyProjects();
            loadFavorites();
        }
        else {
            console.log('[ProjectsPage] No user, only calling fetchProjects');
            fetchProjects();
        }
    }, [user, fetchProjects, fetchMyProjects, loadFavorites]);
    const handleEdit = (projectId) => {
        navigate(`/edit-project/${projectId}`);
    };
    const handleDelete = async (projectId) => {
        if (!window.confirm(t('projects.confirmDelete')))
            return;
        try {
            await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'Projects', projectId));
            setProjects(projects => projects.filter(p => p.id !== projectId));
        }
        catch (err) {
            alert(t('projects.deleteFailed'));
        }
    };
    const handleBookmark = async (projectId, isBookmarked) => {
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
            }
            else {
                console.log('[ProjectsPage] Removing from favorites...');
                await FavoritesService.removeFromFavorites(projectId);
                setFavorites(prev => prev.filter(fav => fav.projectId !== projectId));
                console.log('[ProjectsPage] Removed from favorites');
            }
            // Update the project's favorite status in ALL relevant states
            // isBookmarked is the NEW state we want to set
            setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isFavorite: isBookmarked } : p));
            setOwnedProjects(prev => prev.map(p => p.id === projectId ? { ...p, isFavorite: isBookmarked } : p));
            setCrewProjects(prev => prev.map(p => p.id === projectId ? { ...p, isFavorite: isBookmarked } : p));
            console.log('[ProjectsPage] Updated all project states with isFavorite:', isBookmarked);
        }
        catch (error) {
            console.error('[ProjectsPage] Error toggling bookmark:', error);
            alert('Failed to update bookmark');
        }
    };
    const handleRemoveFromFavorites = async (projectId) => {
        if (!user)
            return;
        try {
            await FavoritesService.removeFromFavorites(projectId);
            setFavorites(prev => prev.filter(fav => fav.projectId !== projectId));
        }
        catch (error) {
            console.error('Error removing from favorites:', error);
            alert('Failed to remove from favorites');
        }
    };
    const filteredProjects = (() => {
        if (tab === 'mine' && user) {
            // Combine owned and crew projects, marking them appropriately
            const ownedWithType = ownedProjects.map(p => ({ ...p, projectType: 'owned' }));
            const crewWithType = crewProjects.map(p => ({ ...p, projectType: 'crew' }));
            return [...ownedWithType, ...crewWithType];
        }
        else if (tab === 'favorites' && user) {
            // Convert favorites to project format for display
            return favorites.map(fav => ({
                id: fav.projectId,
                projectName: fav.projectData?.projectName || 'Unknown Project',
                productionCompany: fav.projectData?.productionCompany || '',
                status: fav.projectData?.status || 'active',
                synopsis: '', // Not stored in favorites
                director: undefined,
                producer: undefined,
                coverImageUrl: fav.projectData?.coverImageUrl,
                genres: undefined,
                country: undefined,
                productionLocations: undefined,
                owner_uid: undefined,
                isFavorite: true,
                projectType: 'favorite'
            }));
        }
        else {
            return projects.map(p => ({ ...p, projectType: 'all' }));
        }
    })();
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,jsx_runtime.jsx)("div", { className: "section-gradient border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding-large", children: (0,jsx_runtime.jsxs)("div", { className: "text-center mb-8 animate-fade", children: [(0,jsx_runtime.jsx)("h1", { className: "heading-primary mb-2 animate-slide", children: t('projects.title') }), (0,jsx_runtime.jsx)("p", { className: "body-large max-w-2xl mx-auto animate-slide", children: user ? t('projects.subtitle') : t('projects.subtitleLoggedOut') }), (0,jsx_runtime.jsxs)("div", { className: "mt-8 flex justify-center gap-4", children: [(0,jsx_runtime.jsx)("button", { className: `px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`, onClick: () => setTab('all'), children: t('projects.allProjects') }), user && ((0,jsx_runtime.jsx)("button", { className: `px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'mine' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`, onClick: () => setTab('mine'), children: t('projects.myProjects') })), user && ((0,jsx_runtime.jsxs)("button", { className: `px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'favorites' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`, onClick: () => setTab('favorites'), children: ["\u2764\uFE0F ", t('nav.favorites')] })), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/projects/create'), className: "btn-primary ml-4", children: t('projects.createNewProject') })] })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "section-gray", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding", children: loading ? ((0,jsx_runtime.jsx)("div", { className: "text-center py-24 animate-fade", children: t('projects.loading') })) : error ? ((0,jsx_runtime.jsx)("div", { className: "text-center py-24 text-red-600 animate-fade", children: error })) : filteredProjects.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-24 animate-fade", children: [(0,jsx_runtime.jsx)("div", { className: "text-8xl mb-8 opacity-20 animate-bounce-slow", children: "\uD83C\uDFAC" }), (0,jsx_runtime.jsx)("h3", { className: "heading-card mb-4", children: t('projects.noProjectsFound') }), (0,jsx_runtime.jsx)("p", { className: "body-medium max-w-md mx-auto", children: tab === 'mine' ? t('projects.noProjectsYet') :
                                    tab === 'favorites' ? 'No favorite projects yet. Start exploring projects and add them to your favorites!' :
                                        t('projects.noProjectsAvailable') })] })) : ((0,jsx_runtime.jsx)("div", { className: "grid-cards", children: filteredProjects.map((project, index) => ((0,jsx_runtime.jsxs)("div", { style: { animationDelay: `${index * 0.1}s` }, className: "relative group", children: [(0,jsx_runtime.jsx)(ProjectCard/* default */.A, { id: project.id, projectName: project.projectName, productionCompany: project.productionCompany, country: project.country, productionLocations: project.productionLocations, status: project.status, summary: project.synopsis, director: project.director, producer: project.producer, coverImageUrl: project.coverImageUrl, genres: project.genres, startDate: project.startDate, endDate: project.endDate, showDetails: true, onBookmark: handleBookmark, isBookmarked: project.isFavorite }), tab === 'favorites' && user && ((0,jsx_runtime.jsx)("div", { className: "absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: (0,jsx_runtime.jsx)("button", { onClick: () => handleRemoveFromFavorites(project.id), className: "btn-danger px-3 py-1 text-xs", children: "\u2764\uFE0F Remove" }) }))] }, project.id))) })) }) })] }));
};
/* harmony default export */ const pages_ProjectsPage = (ProjectsPage);


/***/ })

}]);
//# sourceMappingURL=1263.chunk.js.map