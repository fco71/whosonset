"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[1132],{

/***/ 1132:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4976);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2389);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9487);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7594);






const PublicCrewPage = () => {
    const { t } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__/* .useTranslation */ .Bd)();
    const [crewProfiles, setCrewProfiles] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const loadPublicCrewProfiles = async () => {
            try {
                const crewQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_5__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_5__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'crewProfiles'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_5__/* .limit */ .AB)(12) // Limit for public demo
                );
                const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_5__/* .getDocs */ .GG)(crewQuery);
                const profiles = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.isPublished !== false) { // Only show published profiles
                        profiles.push({
                            uid: doc.id,
                            name: data.name || 'Unknown',
                            displayName: data.displayName || data.name || 'Unknown',
                            photoURL: data.photoURL || data.profileImageUrl,
                            jobTitles: data.jobTitles || [],
                            residences: data.residences || [],
                            bio: data.bio,
                            availability: data.availability
                        });
                    }
                });
                setCrewProfiles(profiles);
            }
            catch (error) {
                console.error('Error loading crew profiles:', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadPublicCrewProfiles();
    }, []);
    const getAvailabilityColor = (availability) => {
        switch (availability) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'soon':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getAvailabilityText = (availability) => {
        switch (availability) {
            case 'available':
                return 'Available';
            case 'soon':
                return 'Available Soon';
            default:
                return 'Contact for Availability';
        }
    };
    if (loading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" }) }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "container mx-auto px-4 py-12", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-6xl mx-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center mb-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-4xl font-bold text-gray-900 mb-6", children: "Film Industry Professionals" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto mb-8", children: "Discover talented crew members for your next production" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-blue-50 rounded-lg p-4 mb-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-blue-800", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Demo:" }), " This is a sample of our crew directory.", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .Link */ .N_, { to: "/register", className: "text-blue-600 hover:underline ml-1", children: "Sign up to see the full directory and connect with professionals." })] }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12", children: crewProfiles.map((profile) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start gap-4 mb-4", children: [profile.photoURL ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: profile.photoURL, alt: profile.displayName, className: "w-16 h-16 rounded-full object-cover" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-xl text-gray-500 font-light", children: profile.displayName.charAt(0).toUpperCase() }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: profile.displayName }), profile.jobTitles.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: typeof profile.jobTitles[0] === 'string'
                                                        ? profile.jobTitles[0]
                                                        : profile.jobTitles[0]?.title || 'Film Professional' })), profile.residences.length > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500", children: ["\uD83D\uDCCD ", typeof profile.residences[0] === 'string'
                                                            ? profile.residences[0]
                                                            : `${profile.residences[0]?.city || 'Unknown'}, ${profile.residences[0]?.country || 'Unknown'}`] }))] })] }), profile.availability && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mb-4", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(profile.availability)}`, children: getAvailabilityText(profile.availability) }) })), profile.bio && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 text-sm mb-4 line-clamp-3", children: profile.bio })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between items-center pt-4 border-t border-gray-100", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-sm text-gray-500", children: [profile.jobTitles.length, " specialties"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .Link */ .N_, { to: "/register", className: "text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors", children: "View Full Profile \u2192" })] })] }, profile.uid))) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-3xl font-semibold mb-4", children: "Need More Crew Members?" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xl mb-6 opacity-90", children: "Access our full directory of thousands of film professionals" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-x-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .Link */ .N_, { to: "/register", className: "inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors", children: "Sign Up Free" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .Link */ .N_, { to: "/jobs", className: "inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors", children: "Post a Job" })] })] })] }) }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PublicCrewPage);


/***/ })

}]);
//# sourceMappingURL=1132.chunk.js.map