"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[1415],{

/***/ 1415:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_HomePage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/users.js
var users = __webpack_require__(3893);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/film.js
var film = __webpack_require__(6163);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/trending-up.js
var trending_up = __webpack_require__(6316);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/globe.js
var globe = __webpack_require__(684);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/briefcase.js
var briefcase = __webpack_require__(2201);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/award.js
var award = __webpack_require__(4180);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/zap.js
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
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = (0,createLucideIcon/* default */.A)("zap", __iconNode);


//# sourceMappingURL=zap.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/arrow-right.js
var arrow_right = __webpack_require__(8635);
;// ./node_modules/lucide-react/dist/esm/icons/play.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const play_iconNode = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = (0,createLucideIcon/* default */.A)("play", play_iconNode);


//# sourceMappingURL=play.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/heart.js
var heart = __webpack_require__(3345);
;// ./node_modules/lucide-react/dist/esm/icons/clapperboard.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const clapperboard_iconNode = [
  [
    "path",
    { d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z", key: "1tn4o7" }
  ],
  ["path", { d: "m6.2 5.3 3.1 3.9", key: "iuk76l" }],
  ["path", { d: "m12.4 3.4 3.1 4", key: "6hsd6n" }],
  ["path", { d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z", key: "ltgou9" }]
];
const Clapperboard = (0,createLucideIcon/* default */.A)("clapperboard", clapperboard_iconNode);


//# sourceMappingURL=clapperboard.js.map

// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
;// ./src/pages/HomePage.tsx







const HomePage = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const [stats, setStats] = (0,react.useState)([
        { number: t('home.loading'), label: t('home.stats.activeProfessionals'), icon: (0,jsx_runtime.jsx)(users/* default */.A, { className: "w-5 h-5" }) },
        { number: t('home.loading'), label: t('home.stats.projectsCompleted'), icon: (0,jsx_runtime.jsx)(film/* default */.A, { className: "w-5 h-5" }) },
        { number: t('home.loading'), label: t('home.stats.successRate'), icon: (0,jsx_runtime.jsx)(trending_up/* default */.A, { className: "w-5 h-5" }) },
        { number: t('home.loading'), label: t('home.stats.countries'), icon: (0,jsx_runtime.jsx)(globe/* default */.A, { className: "w-5 h-5" }) }
    ]);
    const [loading, setLoading] = (0,react.useState)(true);
    const features = [
        {
            icon: (0,jsx_runtime.jsx)(film/* default */.A, { className: "w-6 h-6" }),
            title: t('home.features.projectShowcase.title'),
            description: t('home.features.projectShowcase.desc')
        },
        {
            icon: (0,jsx_runtime.jsx)(users/* default */.A, { className: "w-6 h-6" }),
            title: t('home.features.crewNetworking.title'),
            description: t('home.features.crewNetworking.desc')
        },
        {
            icon: (0,jsx_runtime.jsx)(briefcase/* default */.A, { className: "w-6 h-6" }),
            title: t('home.features.jobBoard.title'),
            description: t('home.features.jobBoard.desc')
        },
        {
            icon: (0,jsx_runtime.jsx)(globe/* default */.A, { className: "w-6 h-6" }),
            title: t('home.features.globalReach.title'),
            description: t('home.features.globalReach.desc')
        },
        {
            icon: (0,jsx_runtime.jsx)(award/* default */.A, { className: "w-6 h-6" }),
            title: t('home.features.industryRecognition.title'),
            description: t('home.features.industryRecognition.desc')
        },
        {
            icon: (0,jsx_runtime.jsx)(Zap, { className: "w-6 h-6" }),
            title: t('home.features.realTimeCollab.title'),
            description: t('home.features.realTimeCollab.desc')
        }
    ];
    // Fetch real statistics from Firestore
    (0,react.useEffect)(() => {
        const fetchStats = async () => {
            try {
                // Get crew profiles count
                const crewRef = (0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles');
                const crewQuery = (0,index_esm/* query */.P)(crewRef, (0,index_esm/* where */._M)('isPublished', '==', true));
                const crewSnapshot = await (0,index_esm/* getDocs */.GG)(crewQuery);
                const crewCount = crewSnapshot.size;
                // Get projects count
                const projectsRef = (0,index_esm/* collection */.rJ)(firebase.db, 'Projects');
                const projectsSnapshot = await (0,index_esm/* getDocs */.GG)(projectsRef);
                const projectsCount = projectsSnapshot.size;
                // Get unique countries from crew profiles
                const countries = new Set();
                crewSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.residences && data.residences.length > 0) {
                        data.residences.forEach((residence) => {
                            if (residence.country) {
                                countries.add(residence.country);
                            }
                        });
                    }
                });
                // Calculate success rate based on completed projects
                const completedProjects = projectsSnapshot.docs.filter(doc => {
                    const data = doc.data();
                    return data.status === 'Completed' || data.status === 'Released';
                }).length;
                const successRate = projectsCount > 0 ? Math.round((completedProjects / projectsCount) * 100) : 0;
                setStats([
                    { number: `${crewCount}+`, label: t('home.stats.activeProfessionals'), icon: (0,jsx_runtime.jsx)(users/* default */.A, { className: "w-5 h-5" }) },
                    { number: `${projectsCount}+`, label: t('home.stats.projectsCompleted'), icon: (0,jsx_runtime.jsx)(film/* default */.A, { className: "w-5 h-5" }) },
                    { number: `${successRate}%`, label: t('home.stats.successRate'), icon: (0,jsx_runtime.jsx)(trending_up/* default */.A, { className: "w-5 h-5" }) },
                    { number: `${countries.size}+`, label: t('home.stats.countries'), icon: (0,jsx_runtime.jsx)(globe/* default */.A, { className: "w-5 h-5" }) }
                ]);
            }
            catch (error) {
                console.error('Error fetching stats:', error);
                // Show empty state instead of fake data
                setStats([
                    { number: '—', label: t('home.stats.activeProfessionals'), icon: (0,jsx_runtime.jsx)(users/* default */.A, { className: "w-5 h-5" }) },
                    { number: '—', label: t('home.stats.projectsCompleted'), icon: (0,jsx_runtime.jsx)(film/* default */.A, { className: "w-5 h-5" }) },
                    { number: '—', label: t('home.stats.successRate'), icon: (0,jsx_runtime.jsx)(trending_up/* default */.A, { className: "w-5 h-5" }) },
                    { number: '—', label: t('home.stats.countries'), icon: (0,jsx_runtime.jsx)(globe/* default */.A, { className: "w-5 h-5" }) }
                ]);
            }
        };
        fetchStats();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]);
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,jsx_runtime.jsxs)("section", { className: "relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50", children: [(0,jsx_runtime.jsxs)("div", { className: "absolute inset-0", children: [(0,jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" }), (0,jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" }), (0,jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000" })] }), (0,jsx_runtime.jsx)("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "mb-8", children: (0,jsx_runtime.jsxs)("div", { className: "inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-200", children: [(0,jsx_runtime.jsx)(users/* default */.A, { className: "w-4 h-4 mr-2" }), t('home.hero.banner')] }) }), (0,jsx_runtime.jsxs)("h1", { className: "text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight", children: [t('home.hero.title1'), (0,jsx_runtime.jsxs)("span", { className: "relative inline-block ml-4", children: [(0,jsx_runtime.jsx)("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: t('home.hero.title2') }), (0,jsx_runtime.jsx)("div", { className: "absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-30" })] })] }), (0,jsx_runtime.jsx)("p", { className: "text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed", children: t('home.hero.subtitle') }), (0,jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center mb-16", children: [(0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: "/register", className: "group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center text-lg", children: [t('home.hero.ctaPrimary'), (0,jsx_runtime.jsx)(arrow_right/* default */.A, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })] }), (0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: "/jobs", className: "group px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:border-gray-300 flex items-center text-lg", children: [(0,jsx_runtime.jsx)(Play, { className: "mr-2 w-5 h-5 group-hover:scale-110 transition-transform" }), t('home.hero.ctaSecondary')] })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto", children: stats.map((stat, index) => ((0,jsx_runtime.jsxs)("div", { className: "text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 hover:bg-white/80 transition-all duration-300", children: [(0,jsx_runtime.jsx)("div", { className: "flex justify-center mb-2 text-blue-600", children: stat.icon }), (0,jsx_runtime.jsx)("div", { className: `text-2xl lg:text-3xl font-bold mb-1 ${stat.number === t('home.loading') ? "text-gray-300 animate-pulse" :
                                                    stat.number === "—" ? "text-gray-400" : "text-gray-900"}`, children: stat.number }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600 font-medium", children: stat.label })] }, index))) })] }) })] }), (0,jsx_runtime.jsx)("section", { className: "py-24 bg-gray-50", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center mb-16", children: [(0,jsx_runtime.jsx)("h2", { className: "text-4xl font-bold text-gray-900 mb-4", children: t('home.features.title') }), (0,jsx_runtime.jsx)("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: t('home.features.subtitle') })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: features.map((feature, index) => ((0,jsx_runtime.jsxs)("div", { className: "group bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300", children: [(0,jsx_runtime.jsx)("div", { className: "w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-200 transition-colors", children: feature.icon }), (0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 mb-3", children: feature.title }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 leading-relaxed", children: feature.description })] }, index))) })] }) }), (0,jsx_runtime.jsx)("section", { className: "py-24 bg-white", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center mb-16", children: [(0,jsx_runtime.jsx)("h2", { className: "text-4xl font-bold text-gray-900 mb-4", children: t('home.howItWorks.title') }), (0,jsx_runtime.jsx)("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: t('home.howItWorks.subtitle') })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
                                {
                                    step: "01",
                                    title: t('home.howItWorks.step1.title'),
                                    description: t('home.howItWorks.step1.desc')
                                },
                                {
                                    step: "02",
                                    title: t('home.howItWorks.step2.title'),
                                    description: t('home.howItWorks.step2.desc')
                                },
                                {
                                    step: "03",
                                    title: t('home.howItWorks.step3.title'),
                                    description: t('home.howItWorks.step3.desc')
                                }
                            ].map((item, index) => ((0,jsx_runtime.jsxs)("div", { className: "text-center relative", children: [(0,jsx_runtime.jsx)("div", { className: "w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-6 shadow-lg", children: item.step }), (0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 mb-3", children: item.title }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 leading-relaxed", children: item.description }), index < 2 && ((0,jsx_runtime.jsx)("div", { className: "hidden md:block absolute top-8 left-3/4 w-1/2 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200" }))] }, index))) })] }) }), (0,jsx_runtime.jsx)("section", { className: "py-24 bg-gradient-to-r from-blue-600 to-purple-600", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-3xl mx-auto", children: [(0,jsx_runtime.jsx)("h2", { className: "text-4xl font-bold text-white mb-6", children: t('home.cta.title') }), (0,jsx_runtime.jsx)("p", { className: "text-xl text-blue-100 mb-8", children: t('home.cta.subtitle') }), (0,jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [(0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: "/register", className: "group px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-lg", children: [(0,jsx_runtime.jsx)(heart/* default */.A, { className: "mr-2 w-5 h-5 group-hover:scale-110 transition-transform" }), t('home.cta.ctaPrimary')] }), (0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: "/crew", className: "group px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center text-lg", children: [(0,jsx_runtime.jsx)(Clapperboard, { className: "mr-2 w-5 h-5 group-hover:scale-110 transition-transform" }), t('home.cta.ctaSecondary')] })] })] }) }) })] }));
};
/* harmony default export */ const pages_HomePage = (HomePage);


/***/ }),

/***/ 2201:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Briefcase)
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
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("briefcase", __iconNode);


//# sourceMappingURL=briefcase.js.map


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

/***/ 3893:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Users)
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
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const Users = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("users", __iconNode);


//# sourceMappingURL=users.js.map


/***/ }),

/***/ 4180:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Award)
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
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("award", __iconNode);


//# sourceMappingURL=award.js.map


/***/ }),

/***/ 6163:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Film)
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
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("film", __iconNode);


//# sourceMappingURL=film.js.map


/***/ }),

/***/ 6316:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ TrendingUp)
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
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("trending-up", __iconNode);


//# sourceMappingURL=trending-up.js.map


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
//# sourceMappingURL=1415.chunk.js.map