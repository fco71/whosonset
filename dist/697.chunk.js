"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[697],{

/***/ 684:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Globe)
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
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("globe", __iconNode);


//# sourceMappingURL=globe.js.map


/***/ }),

/***/ 774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3490);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4164);




// Button size classes
const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 py-3 text-base',
};
// Button variant classes
const variantClasses = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 border border-transparent',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 border border-transparent',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 border border-transparent',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-400',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-300 border border-transparent',
    link: 'bg-transparent text-blue-600 hover:underline p-0 focus-visible:ring-0 border-0',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 border border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 border border-transparent',
};
// Rounded classes
const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
};
const Button = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ variant = 'default', size = 'md', isLoading = false, loadingText, leftIcon, rightIcon, children, className, disabled = false, fullWidth = false, rounded = 'md', type = 'button', as: Component = framer_motion__WEBPACK_IMPORTED_MODULE_2__/* .motion */ .P.button, ...props }, ref) => {
    const isDisabled = isLoading || disabled;
    // Generate class names
    const buttonClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('inline-flex items-center justify-center font-medium', 'focus-visible:outline-none focus-visible:ring-offset-2', 'transition-all duration-200 ease-in-out', variantClasses[variant], sizeClasses[size], roundedClasses[rounded], {
        'w-full': fullWidth,
        'opacity-60 cursor-not-allowed pointer-events-none': isDisabled,
    }, className);
    // Loading spinner
    const loadingSpinner = ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { className: "animate-spin h-4 w-4 text-current flex-shrink-0", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Component, { ref: ref, type: type, className: buttonClasses, disabled: isDisabled, "aria-busy": isLoading, "aria-disabled": isDisabled, whileTap: !isDisabled ? { scale: 0.98 } : undefined, whileHover: !isDisabled ? { scale: 1.02 } : undefined, transition: { duration: 0.2 }, ...props, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "flex items-center justify-center", children: [loadingSpinner, loadingText && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-2", children: loadingText })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [leftIcon && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "mr-2", children: leftIcon }), children, rightIcon && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-2", children: rightIcon })] })) }));
});
Button.displayName = 'Button';



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

/***/ 2307:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Calendar)
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
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("calendar", __iconNode);


//# sourceMappingURL=calendar.js.map


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

/***/ 4697:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ JobsPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/building.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", ry: "2", key: "76otgf" }],
  ["path", { d: "M9 22v-4h6v4", key: "r93iot" }],
  ["path", { d: "M8 6h.01", key: "1dz90k" }],
  ["path", { d: "M16 6h.01", key: "1x0f13" }],
  ["path", { d: "M12 6h.01", key: "1vi96p" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }]
];
const Building = (0,createLucideIcon/* default */.A)("building", __iconNode);


//# sourceMappingURL=building.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/map-pin.js
var map_pin = __webpack_require__(8450);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/globe.js
var globe = __webpack_require__(684);
;// ./node_modules/lucide-react/dist/esm/icons/dollar-sign.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const dollar_sign_iconNode = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = (0,createLucideIcon/* default */.A)("dollar-sign", dollar_sign_iconNode);


//# sourceMappingURL=dollar-sign.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/calendar.js
var calendar = __webpack_require__(2307);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/arrow-right.js
var arrow_right = __webpack_require__(8635);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/briefcase.js
var briefcase = __webpack_require__(2201);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/users.js
var users = __webpack_require__(3893);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/search.js
var search = __webpack_require__(8445);
;// ./node_modules/lucide-react/dist/esm/icons/funnel.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const funnel_iconNode = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = (0,createLucideIcon/* default */.A)("funnel", funnel_iconNode);


//# sourceMappingURL=funnel.js.map

;// ./node_modules/lucide-react/dist/esm/icons/plus.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const plus_iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = (0,createLucideIcon/* default */.A)("plus", plus_iconNode);


//# sourceMappingURL=plus.js.map

;// ./src/pages/JobsPage.tsx







const hasValue = (value) => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
const formatDate = (date) => {
    if (!date)
        return 'No date specified';
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};
const formatSalary = (min, max, period) => {
    if (!min && !max)
        return null;
    const formatNumber = (num) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(num);
    if (min && max) {
        return `${formatNumber(min)} - ${formatNumber(max)}`;
    }
    return formatNumber(min || max);
};
const JobCard = ({ job, currentUserId, onEdit }) => {
    const navigate = (0,chunk_QMGIS6GS/* useNavigate */.Zp)();
    const [isHovered, setIsHovered] = (0,react.useState)(false);
    return ((0,jsx_runtime.jsx)("div", { className: "group bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden", onClick: () => navigate(`/jobs/${job.id}`), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: (0,jsx_runtime.jsxs)("div", { className: "p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2", children: job.title || 'Untitled Position' }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-600 mb-3", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(Building, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: job.department || 'Various' })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(map_pin/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: job.location })] }), job.isRemote && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1 text-blue-600", children: [(0,jsx_runtime.jsx)(globe/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: "Remote" })] }))] })] }), currentUserId && job.postedById === currentUserId && ((0,jsx_runtime.jsx)("button", { className: "p-2 rounded-lg hover:bg-gray-100 transition-colors", title: "Edit Job", onClick: e => {
                                e.stopPropagation();
                                onEdit ? onEdit(job) : navigate(`/edit-job/${job.id}`);
                            }, children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" }) }) }))] }), (0,jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2 mb-4", children: [hasValue(job.jobType) && ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full", children: job.jobType?.replace('_', ' ') })), hasValue(job.experienceLevel) && ((0,jsx_runtime.jsxs)("span", { className: "px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full", children: [job.experienceLevel, " level"] })), job.isPaid && ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full", children: "Paid" }))] }), hasValue(job.description) && ((0,jsx_runtime.jsx)("p", { className: "text-gray-600 text-sm mb-4 line-clamp-2", children: job.description })), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-500", children: [job.showSalary && (job.salaryMin || job.salaryMax) && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(DollarSign, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { className: "font-medium", children: formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod) })] })), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(calendar/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsxs)("span", { children: ["Posted ", formatDate(job.createdAt)] })] })] }), (0,jsx_runtime.jsxs)("div", { className: `flex items-center gap-1 text-blue-600 text-sm font-medium transition-transform ${isHovered ? 'translate-x-1' : ''}`, children: [(0,jsx_runtime.jsx)("span", { children: "View Details" }), (0,jsx_runtime.jsx)(arrow_right/* default */.A, { className: "w-4 h-4" })] })] })] }) }));
};
function JobsPage() {
    const [jobs, setJobs] = (0,react.useState)([]);
    const [filteredJobs, setFilteredJobs] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [searchQuery, setSearchQuery] = (0,react.useState)('');
    const [selectedDepartment, setSelectedDepartment] = (0,react.useState)('');
    const [selectedLocation, setSelectedLocation] = (0,react.useState)('');
    const [selectedJobType, setSelectedJobType] = (0,react.useState)('');
    const [showFilters, setShowFilters] = (0,react.useState)(false);
    const [remoteOnly, setRemoteOnly] = (0,react.useState)(false);
    const auth = (0,AuthContext/* useAuth */.A)();
    const navigate = (0,chunk_QMGIS6GS/* useNavigate */.Zp)();
    const departments = [
        'Camera', 'Sound', 'Lighting', 'Art', 'Costume', 'Makeup', 'Hair',
        'Production', 'Post-Production', 'VFX', 'Stunts', 'Transportation', 'Catering'
    ];
    const jobTypes = [
        { value: 'full_time', label: 'Full Time' },
        { value: 'part_time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'temporary', label: 'Temporary' },
        { value: 'internship', label: 'Internship' }
    ];
    const stats = [
        { icon: (0,jsx_runtime.jsx)(briefcase/* default */.A, { className: "w-5 h-5" }), label: 'Active Jobs', value: jobs.length },
        { icon: (0,jsx_runtime.jsx)(Building, { className: "w-5 h-5" }), label: 'Companies', value: new Set(jobs.map(j => j.contactName || j.projectName)).size },
        { icon: (0,jsx_runtime.jsx)(map_pin/* default */.A, { className: "w-5 h-5" }), label: 'Locations', value: new Set(jobs.map(j => j.location)).size },
        { icon: (0,jsx_runtime.jsx)(users/* default */.A, { className: "w-5 h-5" }), label: 'Remote Jobs', value: jobs.filter(j => j.isRemote).length }
    ];
    (0,react.useEffect)(() => {
        console.log('JobsPage mounted, loading jobs...');
        loadJobs();
    }, []);
    (0,react.useEffect)(() => {
        applyFilters();
    }, [jobs, searchQuery, selectedDepartment, selectedLocation, selectedJobType, remoteOnly]);
    const loadJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const db = (0,index_esm/* getFirestore */.aU)();
            const jobsCollection = (0,index_esm/* collection */.rJ)(db, 'jobs');
            const jobsQuery = (0,index_esm/* query */.P)(jobsCollection);
            const querySnapshot = await (0,index_esm/* getDocs */.GG)(jobsQuery);
            const jobsData = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                jobsData.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                });
            });
            setJobs(jobsData);
            console.log('Loaded jobs:', jobsData.length);
        }
        catch (err) {
            console.error('Error loading jobs:', err);
            setError('Failed to load jobs. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const applyFilters = () => {
        let filtered = [...jobs];
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job => job.title?.toLowerCase().includes(query) ||
                job.description?.toLowerCase().includes(query) ||
                job.contactName?.toLowerCase().includes(query) ||
                job.projectName?.toLowerCase().includes(query) ||
                job.location?.toLowerCase().includes(query));
        }
        if (selectedDepartment) {
            filtered = filtered.filter(job => job.department === selectedDepartment);
        }
        if (selectedLocation) {
            filtered = filtered.filter(job => job.location?.toLowerCase().includes(selectedLocation.toLowerCase()));
        }
        if (selectedJobType) {
            filtered = filtered.filter(job => job.jobType === selectedJobType);
        }
        if (remoteOnly) {
            filtered = filtered.filter(job => job.isRemote);
        }
        setFilteredJobs(filtered);
    };
    const clearFilters = () => {
        setSearchQuery('');
        setSelectedDepartment('');
        setSelectedLocation('');
        setSelectedJobType('');
        setRemoteOnly(false);
    };
    const hasActiveFilters = searchQuery || selectedDepartment || selectedLocation || selectedJobType || remoteOnly;
    if (loading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: (0,jsx_runtime.jsxs)("div", { className: "animate-pulse", children: [(0,jsx_runtime.jsx)("div", { className: "h-8 bg-gray-200 rounded w-48 mb-4" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-64 mb-8" }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl border border-gray-200 p-6", children: [(0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-3/4 mb-4" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-full mb-2" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-2/3 mb-4" }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2 mb-4", children: [(0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-16" }), (0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-20" })] }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/2" })] }, i))) })] }) }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center mb-12", children: [(0,jsx_runtime.jsxs)("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-4", children: ["Find Your Next ", (0,jsx_runtime.jsx)("span", { className: "text-blue-600", children: "Film Industry" }), " Role"] }), (0,jsx_runtime.jsx)("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: "Discover opportunities with leading productions, connect with industry professionals, and advance your career in film and television." })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: stats.map((stat, index) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200", children: [(0,jsx_runtime.jsx)("div", { className: "flex justify-center mb-2 text-blue-600", children: stat.icon }), (0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: stat.value }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: stat.label })] }, index))) }), (0,jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto", children: (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row gap-4", children: [(0,jsx_runtime.jsxs)("div", { className: "relative flex-1", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search jobs by title, company, or keywords...", className: "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", onClick: () => setShowFilters(!showFilters), className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(Funnel, { className: "w-4 h-4" }), "Filters", hasActiveFilters && ((0,jsx_runtime.jsx)("span", { className: "bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs", children: [searchQuery, selectedDepartment, selectedLocation, selectedJobType, remoteOnly].filter(Boolean).length }))] }), auth.currentUser && ((0,jsx_runtime.jsxs)(Button/* Button */.$, { onClick: () => navigate('/post-job'), className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "Post Job"] }))] })] }), showFilters && ((0,jsx_runtime.jsxs)("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Department" }), (0,jsx_runtime.jsxs)("select", { value: selectedDepartment, onChange: (e) => setSelectedDepartment(e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "All Departments" }), departments.map(dept => ((0,jsx_runtime.jsx)("option", { value: dept, children: dept }, dept)))] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Location" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Enter location", value: selectedLocation, onChange: (e) => setSelectedLocation(e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Job Type" }), (0,jsx_runtime.jsxs)("select", { value: selectedJobType, onChange: (e) => setSelectedJobType(e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "All Types" }), jobTypes.map(type => ((0,jsx_runtime.jsx)("option", { value: type.value, children: type.label }, type.value)))] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Remote" }), (0,jsx_runtime.jsxs)("label", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: remoteOnly, onChange: (e) => setRemoteOnly(e.target.checked), className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" }), (0,jsx_runtime.jsx)("span", { className: "ml-2 text-sm text-gray-600", children: "Remote only" })] })] })] }), hasActiveFilters && ((0,jsx_runtime.jsxs)("div", { className: "mt-4 flex justify-between items-center", children: [(0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-600", children: [filteredJobs.length, " of ", jobs.length, " jobs match your filters"] }), (0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "ghost", onClick: clearFilters, children: "Clear all filters" })] }))] }))] }) })] }) }), (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [error && ((0,jsx_runtime.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6", children: (0,jsx_runtime.jsx)("p", { className: "text-red-600", children: error }) })), filteredJobs.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-16", children: [(0,jsx_runtime.jsx)("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: (0,jsx_runtime.jsx)(briefcase/* default */.A, { className: "w-8 h-8 text-gray-400" }) }), (0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No jobs found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-6", children: hasActiveFilters
                                    ? "Try adjusting your filters to see more results."
                                    : "Check back later for new opportunities." }), hasActiveFilters && ((0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "outline", onClick: clearFilters, children: "Clear filters" }))] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsxs)("h2", { className: "text-2xl font-bold text-gray-900", children: [filteredJobs.length, " Job", filteredJobs.length !== 1 ? 's' : '', " Available"] }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: hasActiveFilters ? 'Filtered results' : 'All available positions' })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-sm text-gray-600", children: "Sort by:" }), (0,jsx_runtime.jsxs)("select", { className: "px-3 py-1 border border-gray-200 rounded-lg text-sm", children: [(0,jsx_runtime.jsx)("option", { children: "Newest first" }), (0,jsx_runtime.jsx)("option", { children: "Oldest first" }), (0,jsx_runtime.jsx)("option", { children: "Salary high to low" }), (0,jsx_runtime.jsx)("option", { children: "Salary low to high" })] })] })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredJobs.map((job) => ((0,jsx_runtime.jsx)(JobCard, { job: job, currentUserId: auth.currentUser?.uid }, job.id))) }), filteredJobs.length >= 20 && ((0,jsx_runtime.jsx)("div", { className: "text-center mt-12", children: (0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "outline", className: "px-8 py-3", children: "Load More Jobs" }) }))] }))] })] }));
}


/***/ }),

/***/ 8450:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ MapPin)
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
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
];
const MapPin = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("map-pin", __iconNode);


//# sourceMappingURL=map-pin.js.map


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
//# sourceMappingURL=697.chunk.js.map