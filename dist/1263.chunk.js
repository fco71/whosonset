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
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
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
        await (0,index_esm/* setDoc */.BN)((0,index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteData.id), favoriteData);
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
            const favoriteId = `${user.uid}_${projectId}`;
            await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteId));
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
        const favoriteId = `${user.uid}_${projectId}`;
        const favoriteDoc = await (0,index_esm/* getDocs */.GG)((0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, this.COLLECTION_NAME), (0,index_esm/* where */._M)('id', '==', favoriteId)));
        return !favoriteDoc.empty;
    }
    /**
     * Get all user's favorite projects
     */
    static async getFavorites() {
        const user = firebase/* auth */.j2.currentUser;
        if (!user)
            return [];
        try {
            const favoritesQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, this.COLLECTION_NAME), (0,index_esm/* where */._M)('userId', '==', user.uid), (0,index_esm/* orderBy */.My)('addedAt', 'asc'), (0,index_esm/* orderBy */.My)('__name__', 'asc'));
            const snapshot = await (0,index_esm/* getDocs */.GG)(favoritesQuery);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : data.addedAt
                };
            });
        }
        catch (error) {
            console.error('Error getting favorites:', error);
            return [];
        }
    }
    /**
     * Get favorite project IDs for a user
     */
    static async getFavoriteProjectIds() {
        const favorites = await this.getFavorites();
        return favorites.map(fav => fav.projectId);
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

;// ./src/pages/ProjectsPage.tsx








const ProjectsPage = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const [projects, setProjects] = (0,react.useState)([]);
    const [favorites, setFavorites] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [tab, setTab] = (0,react.useState)('all');
    const navigate = (0,chunk_QMGIS6GS/* useNavigate */.Zp)();
    const user = firebase/* auth */.j2.currentUser;
    (0,react.useEffect)(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'Projects'));
                const snapshot = await (0,index_esm/* getDocs */.GG)(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(data);
            }
            catch (err) {
                setError(t('projects.errorLoading'));
            }
            finally {
                setLoading(false);
            }
        };
        const loadFavorites = async () => {
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
        };
        fetchProjects();
        loadFavorites();
    }, [t, user]);
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
            return projects.filter(p => p.owner_uid === user.uid);
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
                isFavorite: true
            }));
        }
        else {
            return projects;
        }
    })();
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,jsx_runtime.jsx)("div", { className: "section-gradient border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding-large", children: (0,jsx_runtime.jsxs)("div", { className: "text-center mb-8 animate-fade", children: [(0,jsx_runtime.jsx)("h1", { className: "heading-primary mb-2 animate-slide", children: t('projects.title') }), (0,jsx_runtime.jsx)("p", { className: "body-large max-w-2xl mx-auto animate-slide", children: user ? t('projects.subtitle') : t('projects.subtitleLoggedOut') }), (0,jsx_runtime.jsxs)("div", { className: "mt-8 flex justify-center gap-4", children: [(0,jsx_runtime.jsx)("button", { className: `px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`, onClick: () => setTab('all'), children: t('projects.allProjects') }), user && ((0,jsx_runtime.jsx)("button", { className: `px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'mine' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`, onClick: () => setTab('mine'), children: t('projects.myProjects') })), user && ((0,jsx_runtime.jsxs)("button", { className: `px-6 py-2 rounded-lg font-medium transition-colors ${tab === 'favorites' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`, onClick: () => setTab('favorites'), children: ["\u2764\uFE0F ", t('nav.favorites')] })), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/projects/add'), className: "btn-primary ml-4", children: t('projects.createNewProject') })] })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "section-gray", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding", children: loading ? ((0,jsx_runtime.jsx)("div", { className: "text-center py-24 animate-fade", children: t('projects.loading') })) : error ? ((0,jsx_runtime.jsx)("div", { className: "text-center py-24 text-red-600 animate-fade", children: error })) : filteredProjects.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-24 animate-fade", children: [(0,jsx_runtime.jsx)("div", { className: "text-8xl mb-8 opacity-20 animate-bounce-slow", children: "\uD83C\uDFAC" }), (0,jsx_runtime.jsx)("h3", { className: "heading-card mb-4", children: t('projects.noProjectsFound') }), (0,jsx_runtime.jsx)("p", { className: "body-medium max-w-md mx-auto", children: tab === 'mine' ? t('projects.noProjectsYet') :
                                    tab === 'favorites' ? 'No favorite projects yet. Start exploring projects and add them to your favorites!' :
                                        t('projects.noProjectsAvailable') })] })) : ((0,jsx_runtime.jsx)("div", { className: "grid-cards", children: filteredProjects.map((project, index) => ((0,jsx_runtime.jsxs)("div", { style: { animationDelay: `${index * 0.1}s` }, className: "relative group", children: [(0,jsx_runtime.jsx)(ProjectCard/* default */.A, { id: project.id, projectName: project.projectName, productionCompany: project.productionCompany, country: project.country, productionLocations: project.productionLocations, status: project.status, summary: project.synopsis, director: project.director, producer: project.producer, coverImageUrl: project.coverImageUrl, genres: project.genres, showDetails: true }), tab === 'mine' && user && project.owner_uid === user.uid && ((0,jsx_runtime.jsxs)("div", { className: "absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleEdit(project.id), className: "btn-secondary px-3 py-1 text-xs", children: t('projects.edit') }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDelete(project.id), className: "btn-danger px-3 py-1 text-xs", children: t('projects.delete') })] })), tab === 'favorites' && user && ((0,jsx_runtime.jsx)("div", { className: "absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: (0,jsx_runtime.jsx)("button", { onClick: () => handleRemoveFromFavorites(project.id), className: "btn-danger px-3 py-1 text-xs", children: "\u2764\uFE0F Remove" }) }))] }, project.id))) })) }) })] }));
};
/* harmony default export */ const pages_ProjectsPage = (ProjectsPage);


/***/ })

}]);
//# sourceMappingURL=1263.chunk.js.map