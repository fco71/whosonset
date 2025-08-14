"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[786],{

/***/ 676:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ imageErrorFallback)
/* harmony export */ });
// Utility for robust <img> error fallback
function imageErrorFallback(e, fallback = '/bust-avatar.svg') {
    const target = e.target;
    if (!target.src.endsWith(fallback)) {
        target.src = fallback;
    }
}


/***/ }),

/***/ 786:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_ProducerView)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./src/components/Social/FollowButton.tsx
var FollowButton = __webpack_require__(6024);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
// EXTERNAL MODULE: ./src/utilities/crewFavoritesService.ts
var crewFavoritesService = __webpack_require__(6838);
// EXTERNAL MODULE: ./node_modules/react-firebase-hooks/auth/dist/index.esm.js
var dist_index_esm = __webpack_require__(6354);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bookmark-check.js
var bookmark_check = __webpack_require__(4316);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bookmark.js
var bookmark = __webpack_require__(7157);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/grid-3x3.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }]
];
const Grid3x3 = (0,createLucideIcon/* default */.A)("grid-3x3", __iconNode);


//# sourceMappingURL=grid-3x3.js.map

;// ./node_modules/lucide-react/dist/esm/icons/list.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const list_iconNode = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List = (0,createLucideIcon/* default */.A)("list", list_iconNode);


//# sourceMappingURL=list.js.map

// EXTERNAL MODULE: ./src/lib/utils.ts
var utils = __webpack_require__(9973);
;// ./src/components/CrewViewSwitcher.tsx



const viewModes = [
    {
        mode: 'cards',
        icon: (0,jsx_runtime.jsx)(Grid3x3, { className: "h-4 w-4" }),
        description: 'Detailed profile cards'
    },
    {
        mode: 'banners',
        icon: (0,jsx_runtime.jsx)(List, { className: "h-4 w-4" }),
        description: 'Compact crew banners'
    },
];
const CrewViewSwitcher = ({ viewMode, onViewModeChange, className, }) => {
    return ((0,jsx_runtime.jsx)("div", { className: (0,utils.cn)("flex items-center space-x-0.5 p-1 bg-gray-50 rounded-lg border border-gray-200", className), children: viewModes.map(({ mode, icon, description }) => ((0,jsx_runtime.jsx)("button", { type: "button", className: (0,utils.cn)('flex items-center justify-center p-2 rounded-md transition-all duration-200', viewMode === mode
                ? 'bg-white shadow-sm text-gray-900 border border-gray-200'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'), onClick: () => onViewModeChange(mode), title: description, children: (0,jsx_runtime.jsx)("span", { className: "text-gray-500", children: icon }) }, mode))) }));
};
/* harmony default export */ const components_CrewViewSwitcher = (CrewViewSwitcher);

// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var dist = __webpack_require__(4976);
// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
;// ./src/components/CrewBannerCard.tsx






const CrewBannerCard = ({ profile, index = 0, isFiltering = false, currentUserId, isBookmarked = false, onBookmark, className = '' }) => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const [isBookmarking, setIsBookmarking] = (0,react.useState)(false);
    const handleBookmarkClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUserId || !onBookmark || isBookmarking)
            return;
        setIsBookmarking(true);
        try {
            await onBookmark(profile.uid, !isBookmarked);
        }
        catch (error) {
            console.error('Error toggling bookmark:', error);
        }
        finally {
            setIsBookmarking(false);
        }
    };
    const getAvailabilityColor = (availability) => {
        switch (availability.toLowerCase()) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'soon':
                return 'bg-yellow-100 text-yellow-800';
            case 'unavailable':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };
    const getAvailabilityText = (availability) => {
        switch (availability.toLowerCase()) {
            case 'available':
                return t('crew.available');
            case 'soon':
                return t('crew.soon');
            case 'unavailable':
                return t('crew.unavailable');
            default:
                return availability;
        }
    };
    const mainTitle = profile.jobTitles?.[0]?.title || t('crew.crewMember');
    const mainLocation = profile.residences?.[0] ?
        `${profile.residences[0].city ? profile.residences[0].city + ', ' : ''}${profile.residences[0].country || ''}` : '';
    const imageUrl = profile.profileImageUrl || '/bust-avatar.svg';
    const availability = profile.availability || '';
    return ((0,jsx_runtime.jsxs)("div", { className: `
        relative group flex items-center bg-white rounded-2xl border border-gray-100 
        shadow-lg px-5 py-4 gap-4 hover:shadow-xl transition-all duration-300 cursor-pointer
        ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100 hover:scale-[1.02]'}
        ${className}
      `, style: {
            minHeight: 68,
            textDecoration: 'none',
            animationDelay: `${index * 0.05}s`
        }, children: [currentUserId && onBookmark && ((0,jsx_runtime.jsx)("button", { onClick: handleBookmarkClick, disabled: isBookmarking, className: "absolute top-2 right-2 z-20 hover:scale-110 transition-transform duration-200 p-1 rounded-full hover:bg-gray-100", title: isBookmarked ? t('crew.removeFromBookmarks') : t('crew.addToBookmarks'), children: isBookmarked ? ((0,jsx_runtime.jsx)(bookmark_check/* default */.A, { size: 16, className: "text-blue-600 fill-current" })) : ((0,jsx_runtime.jsx)(bookmark/* default */.A, { size: 16, className: "text-gray-400 hover:text-blue-500" })) })), (0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: `/resume/${profile.uid}`, className: "flex items-center flex-1 min-w-0 gap-4", style: { textDecoration: 'none' }, children: [(0,jsx_runtime.jsx)("img", { src: imageUrl, alt: profile.name, className: "w-14 h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0", onError: imageErrorFallback/* imageErrorFallback */.i }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,jsx_runtime.jsx)("div", { className: "font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200", style: { fontSize: 17, letterSpacing: '-0.01em' }, children: profile.name }), (0,jsx_runtime.jsxs)("div", { className: "text-xs text-gray-500 truncate", style: { fontWeight: 500 }, children: [mainTitle, mainLocation ? ' · ' + mainLocation : ''] })] })] }), availability && ((0,jsx_runtime.jsx)("span", { className: `absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(availability)}`, children: getAvailabilityText(availability) }))] }));
};
/* harmony default export */ const components_CrewBannerCard = (CrewBannerCard);

;// ./src/pages/ProducerView.tsx












const ProducerView = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const [user] = (0,dist_index_esm/* useAuthState */.hD)(firebase/* auth */.j2);
    const [crewProfiles, setCrewProfiles] = (0,react.useState)([]);
    const [filteredProfiles, setFilteredProfiles] = (0,react.useState)([]);
    const [departments, setDepartments] = (0,react.useState)([]);
    const [countries, setCountries] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    const [isFiltering, setIsFiltering] = (0,react.useState)(false);
    const [currentUserId, setCurrentUserId] = (0,react.useState)('');
    const [favoriteCrewIds, setFavoriteCrewIds] = (0,react.useState)([]);
    // Filter states
    const [filters, setFilters] = (0,react.useState)({
        department: '',
        jobTitle: '',
        country: '',
        city: '',
        availability: '',
        searchQuery: ''
    });
    const [appliedFilters, setAppliedFilters] = (0,react.useState)({
        department: '',
        jobTitle: '',
        country: '',
        city: '',
        availability: '',
        searchQuery: ''
    });
    const [isSearching, setIsSearching] = (0,react.useState)(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = (0,react.useState)(false);
    const [viewMode, setViewMode] = (0,react.useState)(() => {
        const saved = localStorage.getItem('crewViewMode');
        return (saved === 'banners' || saved === 'cards') ? saved : 'cards';
    });
    // Load favorite crew IDs
    (0,react.useEffect)(() => {
        const loadFavoriteCrewIds = async () => {
            if (user) {
                try {
                    const favoriteIds = await crewFavoritesService/* CrewFavoritesService */.e.getFavoriteCrewIds();
                    setFavoriteCrewIds(favoriteIds);
                }
                catch (error) {
                    console.error('Error loading favorite crew IDs:', error);
                }
            }
        };
        loadFavoriteCrewIds();
    }, [user]);
    // Filter profiles by favorites when toggle is enabled
    (0,react.useEffect)(() => {
        if (showFavoritesOnly) {
            const favoriteProfiles = crewProfiles.filter(profile => favoriteCrewIds.includes(profile.uid));
            setFilteredProfiles(favoriteProfiles);
        }
        else {
            setFilteredProfiles(crewProfiles);
        }
    }, [showFavoritesOnly, crewProfiles, favoriteCrewIds]);
    // Handle crew bookmarking
    const handleCrewBookmark = async (crewId, isBookmarked) => {
        if (!user)
            return;
        try {
            const crewProfile = crewProfiles.find(p => p.uid === crewId);
            if (!crewProfile)
                return;
            if (isBookmarked) {
                await crewFavoritesService/* CrewFavoritesService */.e.addToFavorites(crewId, {
                    crewName: crewProfile.name,
                    jobTitle: crewProfile.jobTitles?.[0]?.title,
                    location: crewProfile.residences?.[0] ?
                        `${crewProfile.residences[0].city}, ${crewProfile.residences[0].country}` : undefined,
                    profileImageUrl: crewProfile.profileImageUrl,
                });
                setFavoriteCrewIds(prev => [...prev, crewId]);
            }
            else {
                await crewFavoritesService/* CrewFavoritesService */.e.removeFromFavorites(crewId);
                setFavoriteCrewIds(prev => prev.filter(id => id !== crewId));
            }
        }
        catch (error) {
            console.error('Error toggling crew bookmark:', error);
        }
    };
    // Handle view mode changes with persistence
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        localStorage.setItem('crewViewMode', mode);
    };
    // Fetch departments and countries
    (0,react.useEffect)(() => {
        const fetchLookupData = async () => {
            try {
                // Fetch departments
                const deptSnapshot = await (0,index_esm/* getDocs */.GG)((0,index_esm/* collection */.rJ)(firebase.db, 'jobDepartments'));
                const deptData = deptSnapshot.docs.map(doc => ({
                    name: doc.data().name,
                    titles: doc.data().titles || []
                }));
                // Fetch countries
                const countrySnapshot = await (0,index_esm/* getDocs */.GG)((0,index_esm/* collection */.rJ)(firebase.db, 'countries'));
                const countryData = countrySnapshot.docs.map(doc => ({
                    name: doc.data().name,
                    cities: doc.data().cities || []
                }));
                setDepartments(deptData);
                setCountries(countryData);
            }
            catch (error) {
                console.error('Error fetching lookup data:', error);
            }
        };
        fetchLookupData();
    }, []);
    // Get current user ID
    (0,react.useEffect)(() => {
        const unsubscribe = firebase/* auth */.j2.onAuthStateChanged((user) => {
            setCurrentUserId(user?.uid || '');
        });
        return () => unsubscribe();
    }, []);
    // Fetch crew profiles with optimized queries
    (0,react.useEffect)(() => {
        const fetchCrewProfiles = async () => {
            try {
                setLoading(true);
                setIsFiltering(true);
                // Start with base query for published profiles
                let q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* where */._M)('isPublished', '==', true));
                // Add availability filter to Firestore query if specified
                if (appliedFilters.availability) {
                    q = (0,index_esm/* query */.P)(q, (0,index_esm/* where */._M)('availability', '==', appliedFilters.availability));
                }
                const snapshot = await (0,index_esm/* getDocs */.GG)(q);
                let results = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                }));
                // Client-side filtering for complex fields
                // Filter by search query
                if (appliedFilters.searchQuery) {
                    const query = appliedFilters.searchQuery.toLowerCase();
                    results = results.filter(profile => profile.name.toLowerCase().includes(query) ||
                        profile.jobTitles?.some(job => job.title.toLowerCase().includes(query) ||
                            job.department.toLowerCase().includes(query)) ||
                        profile.bio?.toLowerCase().includes(query) ||
                        profile.projects?.some(project => project.projectName.toLowerCase().includes(query) ||
                            project.role.toLowerCase().includes(query)));
                }
                // Filter by department
                if (appliedFilters.department) {
                    results = results.filter(profile => profile.jobTitles?.some(job => job.department === appliedFilters.department));
                }
                // Filter by job title
                if (appliedFilters.jobTitle) {
                    results = results.filter(profile => profile.jobTitles?.some(job => job.title === appliedFilters.jobTitle));
                }
                // Filter by country
                if (appliedFilters.country) {
                    results = results.filter(profile => profile.residences?.some(residence => residence.country === appliedFilters.country));
                }
                // Filter by city (case-insensitive partial match)
                if (appliedFilters.city) {
                    results = results.filter(profile => profile.residences?.some(residence => residence.city.toLowerCase().includes(appliedFilters.city.toLowerCase())));
                }
                setCrewProfiles(results);
                setFilteredProfiles(results);
            }
            catch (error) {
                console.error('Error fetching crew profiles:', error);
            }
            finally {
                setLoading(false);
                // Add delay for smooth transition
                setTimeout(() => setIsFiltering(false), 300);
            }
        };
        fetchCrewProfiles();
    }, [appliedFilters]); // Re-run when appliedFilters change
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
        // Reset dependent filters
        if (filterName === 'department') {
            setFilters(prev => ({ ...prev, jobTitle: '' }));
        }
        if (filterName === 'country') {
            setFilters(prev => ({ ...prev, city: '' }));
        }
        // Instantly update appliedFilters for dropdowns, not for searchQuery
        if (["department", "jobTitle", "country", "availability"].includes(filterName)) {
            setAppliedFilters(prev => ({
                ...prev,
                [filterName]: value,
                // Reset dependent filters in appliedFilters as well
                ...(filterName === 'department' ? { jobTitle: '' } : {}),
                ...(filterName === 'country' ? { city: '' } : {})
            }));
        }
    };
    const handleSearch = () => {
        setIsSearching(true);
        setAppliedFilters(filters);
        setTimeout(() => setIsSearching(false), 500);
    };
    const clearFilters = () => {
        const emptyFilters = {
            department: '',
            jobTitle: '',
            country: '',
            city: '',
            availability: '',
            searchQuery: ''
        };
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
    };
    const getAvailableJobTitles = () => {
        if (!filters.department)
            return [];
        const dept = departments.find(d => d.name === filters.department);
        return dept?.titles || [];
    };
    const getAvailableCities = () => {
        if (!filters.country)
            return [];
        const country = countries.find(c => c.name === filters.country);
        return country?.cities || [];
    };
    if (loading) {
        return (0,jsx_runtime.jsx)(LoadingSkeleton, {});
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gradient-to-br from-gray-50 to-white border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8", children: (0,jsx_runtime.jsxs)("div", { className: "text-center animate-fade-in", children: [(0,jsx_runtime.jsx)("h1", { className: "text-2xl md:text-3xl font-light text-gray-900 tracking-tight animate-slide-up mb-2", children: t('crew.discoverTalent') }), (0,jsx_runtime.jsx)("p", { className: "text-sm md:text-base font-light text-gray-600 max-w-xl mx-auto leading-relaxed animate-slide-up-delay", children: t('crew.discoverSubtitle') })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("div", { className: "w-48 sm:w-56", children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none", children: (0,jsx_runtime.jsx)("svg", { className: "h-4 w-4 text-gray-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: (0,jsx_runtime.jsx)("path", { fillRule: "evenodd", d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z", clipRule: "evenodd" }) }) }), (0,jsx_runtime.jsx)("input", { type: "text", id: "search-crew", name: "searchCrew", value: filters.searchQuery || '', onChange: (e) => handleFilterChange('searchQuery', e.target.value), placeholder: t('crew.searchPlaceholder'), className: "w-full pl-7 pr-3 py-1.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all duration-200 text-sm", onKeyPress: (e) => e.key === 'Enter' && handleSearch() })] }) }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsxs)("select", { id: "department-filter", name: "department", value: filters.department, onChange: (e) => handleFilterChange('department', e.target.value), className: "pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none w-28", "aria-label": "Filter by department", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Dept" }), departments.map(dept => ((0,jsx_runtime.jsx)("option", { value: dept.name, children: dept.name }, dept.name)))] }), (0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none", children: (0,jsx_runtime.jsx)("svg", { className: "h-3 w-3 text-gray-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: (0,jsx_runtime.jsx)("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsxs)("select", { id: "role-filter", name: "role", value: filters.jobTitle, onChange: (e) => handleFilterChange('jobTitle', e.target.value), className: "pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed w-28", disabled: !filters.department, "aria-label": "Filter by role", "aria-disabled": !filters.department, children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Role" }), getAvailableJobTitles().map(title => ((0,jsx_runtime.jsx)("option", { value: title, children: title }, title)))] }), (0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none", children: (0,jsx_runtime.jsx)("svg", { className: "h-3 w-3 text-gray-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: (0,jsx_runtime.jsx)("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsxs)("select", { id: "country-filter", name: "country", value: filters.country, onChange: (e) => handleFilterChange('country', e.target.value), className: "pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none w-28", "aria-label": "Filter by country", autoComplete: "country", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Country" }), countries.map(country => ((0,jsx_runtime.jsx)("option", { value: country.name, children: country.name }, country.name)))] }), (0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none", children: (0,jsx_runtime.jsx)("svg", { className: "h-3 w-3 text-gray-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: (0,jsx_runtime.jsx)("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsxs)("select", { id: "availability-filter", name: "availability", value: filters.availability, onChange: (e) => handleFilterChange('availability', e.target.value), className: "pl-2 pr-6 py-1 text-xs bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none w-28", "aria-label": "Filter by availability", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Status" }), (0,jsx_runtime.jsx)("option", { value: "available", children: t('crew.available') }), (0,jsx_runtime.jsx)("option", { value: "soon", children: t('crew.soon') }), (0,jsx_runtime.jsx)("option", { value: "unavailable", children: t('crew.unavailable') })] }), (0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none", children: (0,jsx_runtime.jsx)("svg", { className: "h-3 w-3 text-gray-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: (0,jsx_runtime.jsx)("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }) })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 ml-auto", children: [(0,jsx_runtime.jsx)(components_CrewViewSwitcher, { viewMode: viewMode, onViewModeChange: handleViewModeChange, className: "hidden sm:flex" }), (0,jsx_runtime.jsx)("div", { className: "sm:hidden", children: (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => handleViewModeChange(viewMode === 'cards' ? 'banners' : 'cards'), className: "p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50", title: viewMode === 'cards' ? 'Switch to banners' : 'Switch to cards', children: viewMode === 'cards' ? ((0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 10h16M4 14h16M4 18h16" }) })) : ((0,jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }) })) }) }), user && ((0,jsx_runtime.jsxs)("button", { type: "button", onClick: () => setShowFavoritesOnly(!showFavoritesOnly), className: `px-2 py-1.5 text-xs font-medium transition-colors duration-200 flex items-center border rounded-md ${showFavoritesOnly
                                            ? 'text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100'
                                            : 'text-gray-500 border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-700'}`, title: showFavoritesOnly ? 'Show all profiles' : 'Show favorites only', children: [(0,jsx_runtime.jsx)("svg", { className: "w-3 h-3 mr-1", fill: showFavoritesOnly ? 'currentColor' : 'none', stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) }), showFavoritesOnly ? 'Favorites' : 'Favs'] })), (0,jsx_runtime.jsxs)("button", { type: "button", onClick: clearFilters, className: "px-2 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center border border-gray-200 rounded-md hover:bg-gray-50", children: [(0,jsx_runtime.jsx)("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), "Clear"] }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: handleSearch, disabled: isSearching, className: "px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center", children: isSearching ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("svg", { className: "animate-spin -ml-1 mr-1 h-3 w-3 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0,jsx_runtime.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0,jsx_runtime.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Loading..."] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("svg", { className: "w-3 h-3 mr-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), "Search"] })) })] })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "bg-gray-50 py-8", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [Object.values(appliedFilters).some(f => f) && ((0,jsx_runtime.jsx)("div", { className: "mb-6", children: (0,jsx_runtime.jsx)("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsxs)("h2", { className: "text-sm font-medium text-gray-600", children: [filteredProfiles.length, " ", filteredProfiles.length === 1 ? 'talent found' : 'talents found'] }), (0,jsx_runtime.jsx)("p", { className: "mt-1 text-xs text-gray-500", children: t('crew.showingResults', 'Showing results matching your filters') })] }) }) })), filteredProfiles.length === 0 ? ((0,jsx_runtime.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: (0,jsx_runtime.jsxs)("div", { className: "text-center py-16 px-4 sm:px-6 lg:px-8", children: [(0,jsx_runtime.jsx)("div", { className: "mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-indigo-50 mb-6", children: (0,jsx_runtime.jsx)("svg", { className: "h-12 w-12 text-indigo-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), (0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: t('crew.noResults') }), (0,jsx_runtime.jsx)("p", { className: "text-gray-500 max-w-md mx-auto mb-6", children: t('crew.tryAdjusting') }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: clearFilters, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200", children: t('crew.clearFilters') })] }) })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [viewMode === 'cards' && ((0,jsx_runtime.jsx)("div", { className: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`, children: filteredProfiles.map((profile, index) => ((0,jsx_runtime.jsx)("div", { className: `transform transition-all duration-300 ${isFiltering ? 'scale-95' : 'scale-100 hover:scale-[1.02]'}`, style: {
                                            transitionDelay: isFiltering ? '0ms' : `${Math.min(index * 30, 300)}ms`,
                                            opacity: isFiltering ? 0.7 : 1
                                        }, children: (0,jsx_runtime.jsx)(CrewProfileCard, { profile: profile, index: index, isFiltering: isFiltering, currentUserId: currentUserId, isBookmarked: favoriteCrewIds.includes(profile.uid), onBookmarkToggle: handleCrewBookmark }) }, profile.uid))) })), viewMode === 'banners' && ((0,jsx_runtime.jsx)("div", { className: `grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${isFiltering ? 'opacity-50' : 'opacity-100'}`, children: filteredProfiles.map((profile, index) => ((0,jsx_runtime.jsx)("div", { className: `transform transition-all duration-300 ${isFiltering ? 'scale-95' : 'scale-100 hover:scale-[1.02]'}`, style: {
                                            transitionDelay: isFiltering ? '0ms' : `${Math.min(index * 20, 200)}ms`,
                                            opacity: isFiltering ? 0.7 : 1
                                        }, children: (0,jsx_runtime.jsx)(components_CrewBannerCard, { profile: profile, index: index, isFiltering: isFiltering, currentUserId: currentUserId, isBookmarked: favoriteCrewIds.includes(profile.uid), onBookmark: handleCrewBookmark }) }, profile.uid))) }))] })), filteredProfiles.length > 0 && ((0,jsx_runtime.jsx)("div", { className: "mt-10 flex justify-center", children: (0,jsx_runtime.jsx)("button", { type: "button", className: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200", children: t('crew.loadMore') }) }))] }) })] }));
};
// Loading Skeleton Component
const LoadingSkeleton = () => {
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gradient-to-br from-gray-50 to-white border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-8 py-24", children: (0,jsx_runtime.jsxs)("div", { className: "text-center mb-16", children: [(0,jsx_runtime.jsx)("div", { className: "h-16 bg-gray-200 rounded-lg mb-6 animate-pulse" }), (0,jsx_runtime.jsx)("div", { className: "h-12 bg-gray-200 rounded-lg mb-8 animate-pulse" }), (0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse" })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "bg-white border-b border-gray-100", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-8 py-12", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-8", children: [(0,jsx_runtime.jsx)("div", { className: "h-8 bg-gray-200 rounded w-32 animate-pulse" }), (0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-20 animate-pulse" })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6", children: [...Array(5)].map((_, i) => ((0,jsx_runtime.jsxs)("div", { className: "animate-pulse", children: [(0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-20 mb-3" }), (0,jsx_runtime.jsx)("div", { className: "h-14 bg-gray-200 rounded-lg" })] }, i))) })] }) }), (0,jsx_runtime.jsx)("div", { className: "bg-gray-50", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-8 py-16", children: [(0,jsx_runtime.jsx)("div", { className: "mb-12", children: (0,jsx_runtime.jsx)("div", { className: "h-10 bg-gray-200 rounded w-48 animate-pulse" }) }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", children: [...Array(8)].map((_, i) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-2xl p-8 animate-pulse", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start gap-6 mb-6", children: [(0,jsx_runtime.jsx)("div", { className: "w-20 h-20 bg-gray-200 rounded-full" }), (0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded mb-2" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded mb-1" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-3/4" })] })] }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded mb-2" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded mb-6 w-2/3" }), (0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-20 mb-6" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between pt-4 border-t border-gray-100", children: [(0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-16" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-24" })] })] }, i))) })] }) })] }));
};
// Crew Profile Card Component with Animations
const CrewProfileCard = ({ profile, index, isFiltering, currentUserId, isBookmarked, onBookmarkToggle }) => {
    const primaryJob = profile.jobTitles[0];
    const primaryResidence = profile.residences[0];
    const [isBookmarking, setIsBookmarking] = (0,react.useState)(false);
    const handleBookmarkClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUserId || isBookmarking)
            return;
        setIsBookmarking(true);
        try {
            await onBookmarkToggle(profile.uid, !isBookmarked);
        }
        catch (error) {
            console.error('Error toggling bookmark:', error);
        }
        finally {
            setIsBookmarking(false);
        }
    };
    return ((0,jsx_runtime.jsxs)("div", { className: `group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-700 cursor-pointer border border-gray-100 hover:border-gray-200 animate-card-entrance relative`, style: {
            animationDelay: `${index * 100}ms`,
            transform: isFiltering ? 'scale(0.95) opacity(0.5)' : 'scale(1) opacity(1)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }, children: [currentUserId && ((0,jsx_runtime.jsx)("button", { onClick: handleBookmarkClick, disabled: isBookmarking, className: `absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 ${isBookmarked
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 shadow-sm'}`, title: isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks', style: { pointerEvents: 'auto' }, children: isBookmarked ? ((0,jsx_runtime.jsx)(bookmark_check/* default */.A, { size: 16, className: "text-blue-600 fill-current" })) : ((0,jsx_runtime.jsx)(bookmark/* default */.A, { size: 16, className: "text-gray-600 hover:text-blue-500" })) })), (0,jsx_runtime.jsxs)("div", { className: "flex items-start gap-6 mb-6", children: [profile.profileImageUrl ? ((0,jsx_runtime.jsx)("img", { src: profile.profileImageUrl, alt: profile.name, className: "w-20 h-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-110" })) : ((0,jsx_runtime.jsx)("div", { className: "w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center transition-transform duration-300 group-hover:scale-110", children: (0,jsx_runtime.jsx)("span", { className: "text-2xl text-gray-500 font-light", children: profile.name.charAt(0).toUpperCase() }) })), (0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2 tracking-wide group-hover:text-black transition-all duration-300 group-hover:scale-105", children: profile.name }), primaryJob && ((0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-600 mb-1 tracking-wide transition-colors duration-300 group-hover:text-gray-800", children: primaryJob.title })), primaryResidence && ((0,jsx_runtime.jsxs)("p", { className: "text-sm font-light text-gray-500 tracking-wide transition-colors duration-300 group-hover:text-gray-600", children: ["\uD83D\uDCCD ", primaryResidence.city, ", ", primaryResidence.country] }))] })] }), profile.availability && ((0,jsx_runtime.jsx)("div", { className: "mb-6", children: (0,jsx_runtime.jsx)("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all duration-300 group-hover:scale-105 ${profile.availability === 'available'
                        ? 'bg-green-100 text-green-800 group-hover:bg-green-200'
                        : profile.availability === 'soon'
                            ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200'
                            : 'bg-red-100 text-red-800 group-hover:bg-red-200'}`, children: profile.availability === 'available' ? 'Available' :
                        profile.availability === 'soon' ? 'Available Soon' : 'Unavailable' }) })), currentUserId && currentUserId !== profile.uid && ((0,jsx_runtime.jsx)("div", { className: "mb-6", children: (0,jsx_runtime.jsx)(FollowButton/* default */.A, { currentUserId: currentUserId, targetUserId: profile.uid, size: "sm", className: "w-full" }) })), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between pt-4 border-t border-gray-100", children: [(0,jsx_runtime.jsxs)("div", { className: "text-sm font-light text-gray-500 tracking-wide transition-colors duration-300 group-hover:text-gray-600", children: [profile.projects?.length || 0, " projects"] }), (0,jsx_runtime.jsx)("a", { href: `/resume/${profile.uid}`, target: "_blank", rel: "noopener noreferrer", className: "text-sm font-medium text-gray-900 hover:text-black transition-all duration-300 tracking-wide group-hover:underline group-hover:scale-105", children: "View Profile \u2192" })] })] }));
};
/* harmony default export */ const pages_ProducerView = (ProducerView);


/***/ }),

/***/ 4164:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ clsx),
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f)}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (clsx);

/***/ }),

/***/ 4316:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ BookmarkCheck)
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
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z", key: "169p4p" }],
  ["path", { d: "m9 10 2 2 4-4", key: "1gnqz4" }]
];
const BookmarkCheck = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("bookmark-check", __iconNode);


//# sourceMappingURL=bookmark-check.js.map


/***/ }),

/***/ 6024:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9505);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(888);




const FollowButton = ({ currentUserId, targetUserId, onFollowRequest, className = '', size = 'md', showCount = false }) => {
    const [followStatus, setFollowStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('none');
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [followersCount, setFollowersCount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const checkStatus = async () => {
            const status = await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.getFollowStatus(currentUserId, targetUserId);
            setFollowStatus(status);
        };
        checkStatus();
    }, [currentUserId, targetUserId]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (showCount) {
            const getCount = async () => {
                const count = await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.getFollowersCount(targetUserId);
                setFollowersCount(count);
            };
            getCount();
        }
    }, [targetUserId, showCount]);
    const handleFollow = async () => {
        if (onFollowRequest) {
            onFollowRequest();
            return;
        }
        try {
            setLoading(true);
            if (followStatus === 'pending' || followStatus === 'following') {
                (0,react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR)('Follow request already sent or you are already following.');
                return;
            }
            console.log('[FollowButton] Sending follow request from', currentUserId, 'to', targetUserId);
            await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.sendFollowRequest(currentUserId, targetUserId);
            console.log('[FollowButton] Follow request sent successfully');
            setFollowStatus('pending');
        }
        catch (error) {
            if (error?.message && error.message.includes('already exists')) {
                setFollowStatus('pending');
                (0,react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR)('Follow request already sent.');
            }
            else {
                console.error('[FollowButton] Error sending follow request:', error);
                react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR.error('Error sending follow request.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleUnfollow = async () => {
        try {
            setLoading(true);
            await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.unfollow(currentUserId, targetUserId);
            setFollowStatus('none');
            if (showCount) {
                setFollowersCount(prev => Math.max(0, prev - 1));
            }
        }
        catch (error) {
            console.error('Error unfollowing:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-1.5 text-xs';
            case 'lg':
                return 'px-6 py-3 text-base';
            default:
                return 'px-4 py-2 text-sm';
        }
    };
    const renderButton = () => {
        const baseClasses = `font-light tracking-wide rounded-lg transition-all duration-300 disabled:opacity-50 ${getSizeClasses()} ${className}`;
        switch (followStatus) {
            case 'following':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleUnfollow, disabled: loading, className: `bg-red-600 text-white hover:bg-red-700 hover:scale-105 ${baseClasses} flex items-center gap-2`, title: "Click to unfollow", children: loading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Unfollowing..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "\u2713" }), "Following"] })) }));
            case 'pending':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { disabled: true, className: `bg-yellow-100 text-yellow-800 font-medium rounded-full tracking-wider ${getSizeClasses()} ${className} flex items-center gap-2 cursor-not-allowed`, title: "Request sent, waiting for approval", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "\u23F3" }), "Request Sent"] }));
            default:
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleFollow, disabled: loading, className: `bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 ${baseClasses} flex items-center gap-2`, title: "Click to send follow request", children: loading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Sending..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "+" }), "Follow"] })) }));
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [renderButton(), showCount && followersCount > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs text-gray-500", children: [followersCount, " follower", followersCount !== 1 ? 's' : ''] }))] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FollowButton);


/***/ }),

/***/ 6838:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ CrewFavoritesService)
/* harmony export */ });
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9487);


class CrewFavoritesService {
    static async addToFavorites(crewId, crewData) {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            throw new Error('User not authenticated');
        const favoriteId = `${user.uid}_${crewId}`;
        const favoriteData = {
            userId: user.uid,
            crewId,
            crewName: crewData.crewName,
            jobTitle: crewData.jobTitle,
            location: crewData.location,
            profileImageUrl: crewData.profileImageUrl,
            addedAt: new Date()
        };
        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME, favoriteId), favoriteData);
    }
    static async removeFromFavorites(crewId) {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            throw new Error('User not authenticated');
        const favoriteId = `${user.uid}_${crewId}`;
        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .deleteDoc */ .kd)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME, favoriteId));
    }
    static async isFavorite(crewId) {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            return false;
        try {
            const favoriteId = `${user.uid}_${crewId}`;
            const favoriteDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME, favoriteId));
            return favoriteDoc.exists();
        }
        catch (error) {
            console.error('Error checking if crew is favorite:', error);
            return false;
        }
    }
    static async getFavorites() {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            return [];
        try {
            const favoritesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('userId', '==', user.uid), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('addedAt', 'asc'));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(favoritesQuery);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : data.addedAt
                };
            });
        }
        catch (error) {
            console.error('Error getting crew favorites:', error);
            return [];
        }
    }
    static async getFavoriteCrewIds() {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            return [];
        try {
            const favoritesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('userId', '==', user.uid));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(favoritesQuery);
            return snapshot.docs.map(doc => doc.data().crewId);
        }
        catch (error) {
            console.error('Error getting favorite crew IDs:', error);
            return [];
        }
    }
}
CrewFavoritesService.COLLECTION_NAME = 'crewFavorites';


/***/ }),

/***/ 7157:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Bookmark)
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
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z", key: "1fy3hk" }]
];
const Bookmark = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("bookmark", __iconNode);


//# sourceMappingURL=bookmark.js.map


/***/ }),

/***/ 9973:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cn: () => (/* binding */ cn)
/* harmony export */ });
/* unused harmony exports formatNumber, truncate, debounce, generateId, isMobileDevice, toKebabCase, isValidEmail */
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4164);
/* harmony import */ var tailwind_merge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(856);


/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class names to be combined
 * @returns A single string of combined and merged class names
 */
function cn(...inputs) {
    return (0,tailwind_merge__WEBPACK_IMPORTED_MODULE_1__/* .twMerge */ .QP)((0,clsx__WEBPACK_IMPORTED_MODULE_0__/* .clsx */ .$)(inputs));
}
/**
 * Formats a number with commas as thousand separators
 * @param num - The number to format
 * @returns Formatted number as string
 */
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}
/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * @param str - The string to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
function truncate(str, length) {
    if (str.length <= length)
        return str;
    return `${str.slice(0, length)}...`;
}
/**
 * Debounce a function call
 * @param func - The function to debounce
 * @param wait - Time to wait in milliseconds
 * @returns Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
/**
 * Generates a unique ID
 * @returns A unique string ID
 */
function generateId() {
    return Math.random().toString(36).substring(2, 11);
}
/**
 * Checks if the current device is a mobile device
 * @returns Boolean indicating if the device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
/**
 * Converts a string to kebab-case
 * @param str - The string to convert
 * @returns kebab-cased string
 */
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
/**
 * Validates an email address
 * @param email - The email to validate
 * @returns Boolean indicating if the email is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


/***/ })

}]);
//# sourceMappingURL=786.chunk.js.map