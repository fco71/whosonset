"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[3499],{

/***/ 5880:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_FavoritesPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./node_modules/firebase/auth/dist/esm/index.esm.js + 2 modules
var index_esm = __webpack_require__(474);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var esm_index_esm = __webpack_require__(7594);
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
        await (0,esm_index_esm/* setDoc */.BN)((0,esm_index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteData.id), favoriteData);
    }
    /**
     * Remove a project from user's favorites
     */
    static async removeFromFavorites(projectId) {
        const user = firebase/* auth */.j2.currentUser;
        if (!user) {
            throw new Error('User must be authenticated to remove favorites');
        }
        const favoriteId = `${user.uid}_${projectId}`;
        await (0,esm_index_esm/* deleteDoc */.kd)((0,esm_index_esm.doc)(firebase.db, this.COLLECTION_NAME, favoriteId));
    }
    /**
     * Check if a project is in user's favorites
     */
    static async isFavorite(projectId) {
        const user = firebase/* auth */.j2.currentUser;
        if (!user)
            return false;
        const favoriteId = `${user.uid}_${projectId}`;
        const favoriteDoc = await (0,esm_index_esm/* getDocs */.GG)((0,esm_index_esm/* query */.P)((0,esm_index_esm/* collection */.rJ)(firebase.db, this.COLLECTION_NAME), (0,esm_index_esm/* where */._M)('id', '==', favoriteId)));
        return !favoriteDoc.empty;
    }
    /**
     * Get all user's favorite projects
     */
    static async getFavorites() {
        const user = firebase/* auth */.j2.currentUser;
        if (!user)
            return [];
        const favoritesQuery = (0,esm_index_esm/* query */.P)((0,esm_index_esm/* collection */.rJ)(firebase.db, this.COLLECTION_NAME), (0,esm_index_esm/* where */._M)('userId', '==', user.uid), (0,esm_index_esm/* orderBy */.My)('addedAt', 'asc'), (0,esm_index_esm/* orderBy */.My)('__name__', 'asc'));
        const snapshot = await (0,esm_index_esm/* getDocs */.GG)(favoritesQuery);
        return snapshot.docs.map(doc => ({
            ...doc.data(),
            addedAt: doc.data().addedAt.toDate()
        }));
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

// EXTERNAL MODULE: ./src/components/ProjectCard.tsx + 1 modules
var ProjectCard = __webpack_require__(1928);
;// ./src/pages/FavoritesPage.tsx







const FavoritesPage = () => {
    const [favorites, setFavorites] = (0,react.useState)([]);
    const [projects, setProjects] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    const [user, setUser] = (0,react.useState)(null);
    (0,react.useEffect)(() => {
        const unsubscribe = (0,index_esm/* onAuthStateChanged */.hg)(firebase/* auth */.j2, (user) => {
            setUser(user);
            if (user) {
                loadFavorites();
            }
            else {
                setFavorites([]);
                setProjects([]);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);
    const loadFavorites = async () => {
        try {
            setLoading(true);
            const userFavorites = await FavoritesService.getFavorites();
            setFavorites(userFavorites);
            // Convert favorites to project format for display
            const projectData = userFavorites.map(fav => ({
                id: fav.projectId,
                projectName: fav.projectData?.projectName || 'Unknown Project',
                productionCompany: fav.projectData?.productionCompany,
                status: fav.projectData?.status || 'Unknown',
                coverImageUrl: fav.projectData?.coverImageUrl,
                synopsis: '', // We don't store synopsis in favorites, would need to fetch from projects collection
            }));
            setProjects(projectData);
        }
        catch (error) {
            console.error('Error loading favorites:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleBookmark = async (projectId, isBookmarked) => {
        try {
            if (isBookmarked) {
                await FavoritesService.removeFromFavorites(projectId);
                setFavorites(prev => prev.filter(fav => fav.projectId !== projectId));
                setProjects(prev => prev.filter(project => project.id !== projectId));
            }
        }
        catch (error) {
            console.error('Error removing favorite:', error);
        }
    };
    if (!user) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen section-gray", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-6", children: "\uD83D\uDD10" }), (0,jsx_runtime.jsx)("h2", { className: "heading-card mb-4", children: "Sign in to view your favorites" }), (0,jsx_runtime.jsx)("p", { className: "body-medium max-w-md mx-auto mb-8", children: "Create an account or sign in to save and view your favorite projects" }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/login", className: "btn-primary", children: "Sign In" })] }) }) }));
    }
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen section-gray", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "body-medium", children: "Loading your favorites..." })] }) }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,jsx_runtime.jsx)("div", { className: "section-gradient border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding-large", children: (0,jsx_runtime.jsxs)("div", { className: "text-center mb-16", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-6", children: "\u2764\uFE0F" }), (0,jsx_runtime.jsx)("h1", { className: "heading-secondary mb-4", children: "Your Favorite Projects" }), (0,jsx_runtime.jsx)("p", { className: "body-medium max-w-2xl mx-auto", children: "All the projects you've bookmarked for easy access" })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "section-gray", children: (0,jsx_runtime.jsx)("div", { className: "container-base section-padding", children: favorites.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-24 animate-fade", children: [(0,jsx_runtime.jsx)("div", { className: "text-8xl mb-8 opacity-20 animate-bounce-slow", children: "\uD83D\uDC94" }), (0,jsx_runtime.jsx)("h3", { className: "heading-card mb-4", children: "No favorites yet" }), (0,jsx_runtime.jsx)("p", { className: "body-medium max-w-md mx-auto mb-8", children: "Start exploring projects and bookmark the ones you like" }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/projects", className: "btn-primary", children: "Explore Projects" })] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: "mb-12 animate-fade", children: (0,jsx_runtime.jsxs)("h3", { className: "heading-tertiary", children: [favorites.length, " ", favorites.length === 1 ? 'Favorite' : 'Favorites'] }) }), (0,jsx_runtime.jsx)("div", { className: "grid-cards", children: projects.map((project, index) => ((0,jsx_runtime.jsx)("div", { style: { animationDelay: `${index * 0.1}s` }, children: (0,jsx_runtime.jsx)(ProjectCard/* default */.A, { id: project.id, projectName: project.projectName, productionCompany: project.productionCompany, country: project.country, productionLocations: project.productionLocations, status: project.status, summary: project.synopsis, director: project.director, producer: project.producer, coverImageUrl: project.coverImageUrl, genres: project.genres, showDetails: true, onBookmark: handleBookmark, isBookmarked: true }) }, project.id))) })] })) }) })] }));
};
/* harmony default export */ const pages_FavoritesPage = (FavoritesPage);


/***/ })

}]);
//# sourceMappingURL=3499.chunk.js.map