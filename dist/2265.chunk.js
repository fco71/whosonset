"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[2265],{

/***/ 1181:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Star)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("star", __iconNode);


//# sourceMappingURL=star.js.map


/***/ }),

/***/ 2265:
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
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
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
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/heart.js
var heart = __webpack_require__(3345);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/arrow-right.js
var arrow_right = __webpack_require__(8635);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/book-open.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = (0,createLucideIcon/* default */.A)("book-open", __iconNode);


//# sourceMappingURL=book-open.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/star.js
var star = __webpack_require__(1181);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/search.js
var search = __webpack_require__(8445);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/funnel.js
var funnel = __webpack_require__(5333);
;// ./src/pages/FavoritesPage.tsx









const FavoritesPage = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
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
                summary: '', // We don't store synopsis in favorites, would need to fetch from projects collection
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
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "container mx-auto px-4 py-24", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-md mx-auto text-center", children: [(0,jsx_runtime.jsx)("div", { className: "w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg", children: (0,jsx_runtime.jsx)(heart/* default */.A, { className: "w-12 h-12 text-white" }) }), (0,jsx_runtime.jsx)("h2", { className: "text-3xl font-bold text-gray-900 mb-4", children: t('favorites.auth.signInRequired') }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-8 leading-relaxed", children: t('favorites.auth.signInDescription') }), (0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: "/login", className: "inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5", children: [t('favorites.auth.signInButton'), (0,jsx_runtime.jsx)(arrow_right/* default */.A, { className: "w-4 h-4 ml-2" })] })] }) }) }));
    }
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "container mx-auto px-4 py-24", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-md mx-auto text-center", children: [(0,jsx_runtime.jsx)("div", { className: "w-16 h-16 mx-auto mb-6", children: (0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600" }) }), (0,jsx_runtime.jsx)("p", { className: "text-lg text-gray-600", children: t('favorites.loading') })] }) }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-gray-100", children: [(0,jsx_runtime.jsx)("div", { className: "bg-white shadow-sm border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "container mx-auto px-4 py-12", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto text-center", children: [(0,jsx_runtime.jsx)("div", { className: "inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-6 shadow-lg", children: (0,jsx_runtime.jsx)(heart/* default */.A, { className: "w-10 h-10 text-white fill-white stroke-white" }) }), (0,jsx_runtime.jsx)("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-4", children: t('favorites.title') }), (0,jsx_runtime.jsx)("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto", children: t('favorites.subtitle') })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "container mx-auto px-4 py-12", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto", children: favorites.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-20", children: [(0,jsx_runtime.jsx)("div", { className: "w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center", children: (0,jsx_runtime.jsx)(BookOpen, { className: "w-16 h-16 text-gray-400" }) }), (0,jsx_runtime.jsx)("h3", { className: "text-2xl font-bold text-gray-900 mb-4", children: t('favorites.empty.title') }), (0,jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-md mx-auto mb-8", children: t('favorites.empty.description') }), (0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: "/projects", className: "inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5", children: [(0,jsx_runtime.jsx)(star/* default */.A, { className: "w-5 h-5 mr-2" }), t('favorites.empty.exploreButton')] })] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8", children: (0,jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [(0,jsx_runtime.jsx)("div", { className: "flex items-center space-x-4", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [(0,jsx_runtime.jsx)(star/* default */.A, { className: "w-5 h-5 text-yellow-500 fill-current" }), (0,jsx_runtime.jsxs)("span", { className: "text-lg font-semibold text-gray-900", children: [favorites.length, " ", favorites.length === 1 ? t('favorites.count.singular') : t('favorites.count.plural')] })] }) }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [(0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search favorites...", className: "pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200" })] }), (0,jsx_runtime.jsxs)("button", { className: "flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200", children: [(0,jsx_runtime.jsx)(funnel/* default */.A, { className: "w-4 h-4 text-gray-500" }), (0,jsx_runtime.jsx)("span", { className: "text-sm text-gray-700", children: "Filter" })] })] })] }) }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: projects.map((project, index) => ((0,jsx_runtime.jsx)("div", { className: "opacity-0 animate-fade-in-up", style: {
                                        animationDelay: `${index * 100}ms`,
                                        animationFillMode: 'forwards'
                                    }, children: (0,jsx_runtime.jsx)(ProjectCard/* default */.A, { id: project.id, projectName: project.projectName, productionCompany: project.productionCompany, country: project.country, productionLocations: project.productionLocations, status: project.status, summary: project.summary, director: project.director, producer: project.producer, coverImageUrl: project.coverImageUrl, genres: project.genres, showDetails: true, onBookmark: handleBookmark, isBookmarked: true }) }, project.id))) })] })) }) }), (0,jsx_runtime.jsx)("style", { children: `
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        ` })] }));
};
/* harmony default export */ const pages_FavoritesPage = (FavoritesPage);


/***/ }),

/***/ 3345:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Heart)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("heart", __iconNode);


//# sourceMappingURL=heart.js.map


/***/ }),

/***/ 5333:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Funnel)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("funnel", __iconNode);


//# sourceMappingURL=funnel.js.map


/***/ }),

/***/ 8635:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ArrowRight)
/* harmony export */ });
/* unused harmony export __iconNode */
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9407);
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("arrow-right", __iconNode);


//# sourceMappingURL=arrow-right.js.map


/***/ })

}]);
//# sourceMappingURL=2265.chunk.js.map