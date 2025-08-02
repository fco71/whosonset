"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[3029],{

/***/ 3029:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ JobSearch_ApplicationDashboard)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./src/utilities/jobApplicationService.ts
var jobApplicationService = __webpack_require__(6093);
// EXTERNAL MODULE: ./src/components/JobSearch/ApplicationStatusBadge.tsx
var ApplicationStatusBadge = __webpack_require__(7278);
// EXTERNAL MODULE: ./src/components/ui/Card.tsx
var Card = __webpack_require__(4948);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./src/theme/ThemeProvider.tsx + 1 modules
var ThemeProvider = __webpack_require__(3049);
// EXTERNAL MODULE: ./node_modules/react-icons/fi/index.mjs + 4 modules
var fi = __webpack_require__(1489);
;// ./src/components/ui/Select.tsx




const Select = (0,react.forwardRef)(({ label, error, options, leftIcon, className = '', containerClassName = '', labelClassName = '', errorClassName = '', variant = 'outline', selectSize = 'md', placeholder = 'Select an option', id, value, disabled, onFocus, onBlur, ...props }, ref) => {
    const { theme } = (0,ThemeProvider/* useTheme */.DP)();
    const [isFocused, setIsFocused] = (0,react.useState)(false);
    const [isOpen, setIsOpen] = (0,react.useState)(false);
    const [selectedOption, setSelectedOption] = (0,react.useState)(options.find((opt) => opt.value === value) || null);
    const inputId = id || react.useId();
    // Size classes
    const sizeClasses = {
        sm: 'h-8 text-xs px-2.5 py-1.5',
        md: 'h-10 text-sm px-3 py-2',
        lg: 'h-12 text-base px-4 py-3',
    }[selectSize];
    // Variant classes
    const variantClasses = {
        outline: `bg-white dark:bg-neutral-50 border ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'border-gray-200 dark:border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50'} shadow-sm hover:border-gray-300 dark:hover:border-gray-400 transition-colors`,
        filled: `bg-gray-50 dark:bg-gray-100 border border-gray-200 dark:border-gray-300 ${error
            ? 'focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : 'focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50'} hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors`,
        flushed: `bg-transparent border-0 border-b ${error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-200 dark:border-gray-300 focus:border-primary-500'} rounded-none px-0 hover:border-gray-300 dark:hover:border-gray-400 transition-colors`,
        unstyled: 'bg-transparent border-0 p-0 focus:ring-0',
    }[variant];
    // Label classes
    const labelSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }[selectSize];
    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };
    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };
    const handleOptionClick = (option) => {
        if (option.disabled)
            return;
        setSelectedOption(option);
        setIsOpen(false);
        // Trigger onChange event
        const fakeEvent = {
            target: { value: option.value, name: props.name },
        };
        props.onChange?.(fakeEvent);
    };
    return ((0,jsx_runtime.jsxs)("div", { className: `relative w-full ${containerClassName}`, children: [label && ((0,jsx_runtime.jsx)("label", { htmlFor: inputId, className: `block mb-1.5 font-medium text-gray-700 dark:text-gray-200 ${labelSizeClasses} ${labelClassName} ${error ? 'text-red-600 dark:text-red-400' : ''}`, children: label })), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsxs)("div", { className: `relative flex items-center ${sizeClasses} ${variantClasses} ${isFocused ? 'ring-1 ring-primary-500/50' : ''} rounded-md transition-all duration-150 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'} ${className}`, onClick: () => !disabled && setIsOpen(!isOpen), onKeyDown: (e) => !disabled && (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen), role: "button", tabIndex: disabled ? -1 : 0, "aria-haspopup": "listbox", "aria-expanded": isOpen, "aria-disabled": disabled, children: [leftIcon && ((0,jsx_runtime.jsx)("div", { className: "absolute left-3 flex items-center justify-center text-gray-400 dark:text-gray-400", children: leftIcon })), (0,jsx_runtime.jsx)("span", { className: `flex-1 text-left truncate ${leftIcon ? 'pl-9' : 'pl-3'} pr-8 text-gray-800 dark:text-gray-800`, children: selectedOption?.label || (0,jsx_runtime.jsx)("span", { className: "text-gray-500", children: placeholder }) }), (0,jsx_runtime.jsx)(fi/* FiChevronDown */.fK4, { className: `absolute right-3 h-4 w-4 text-gray-500 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`, "aria-hidden": "true" })] }), isOpen && ((0,jsx_runtime.jsx)("div", { className: "absolute z-10 w-full mt-1 bg-white dark:bg-white rounded-md shadow-lg border border-gray-200 dark:border-gray-200 max-h-60 overflow-auto py-1 focus:outline-none", role: "listbox", tabIndex: -1, children: options.map((option) => ((0,jsx_runtime.jsx)("div", { className: `px-3 py-2 text-sm text-gray-800 dark:text-gray-800 hover:bg-gray-50 dark:hover:bg-gray-100 cursor-pointer transition-colors ${option.disabled
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'} ${selectedOption?.value === option.value
                                ? 'bg-blue-50 dark:bg-blue-50 text-blue-700 dark:text-blue-800 font-medium'
                                : ''}`, onClick: () => handleOptionClick(option), role: "option", "aria-selected": selectedOption?.value === option.value, "aria-disabled": option.disabled, children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsx)("span", { className: "truncate", children: option.label }), selectedOption?.value === option.value && ((0,jsx_runtime.jsx)(fi/* FiCheck */.YrT, { className: "h-4 w-4 text-blue-600 dark:text-blue-700 flex-shrink-0 ml-2" }))] }) }, option.value))) }))] }), error && ((0,jsx_runtime.jsx)("p", { className: `mt-1.5 text-sm text-red-600 dark:text-red-400 ${errorClassName}`, children: error }))] }));
});
Select.displayName = 'Select';
/* harmony default export */ const ui_Select = (Select);

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/search.js
var search = __webpack_require__(8445);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/arrow-up-down.js
var arrow_up_down = __webpack_require__(8645);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/building.js
var building = __webpack_require__(1393);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/map-pin.js
var map_pin = __webpack_require__(8450);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var dist = __webpack_require__(888);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
;// ./src/components/JobSearch/ApplicationDashboard.tsx













const ApplicationDashboard = () => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [applications, setApplications] = (0,react.useState)([]);
    const [filteredApplications, setFilteredApplications] = (0,react.useState)([]);
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    // Filter and sort state
    const [statusFilter, setStatusFilter] = (0,react.useState)('all');
    const [searchTerm, setSearchTerm] = (0,react.useState)('');
    const [sortBy, setSortBy] = (0,react.useState)('appliedAt');
    const [sortOrder, setSortOrder] = (0,react.useState)('desc');
    // Stats
    const [stats, setStats] = (0,react.useState)({
        total: 0,
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        interviewed: 0,
        hired: 0,
        rejected: 0,
        withdrawn: 0
    });
    (0,react.useEffect)(() => {
        if (!currentUser)
            return;
        setIsLoading(true);
        const unsubscribe = jobApplicationService/* JobApplicationService */.l.subscribeToUserApplications(currentUser.uid, async (applications) => {
            try {
                const jobs = await Promise.all(applications.map(async (app) => {
                    if (!app.jobId)
                        return { application: app, job: null };
                    const jobDoc = await (0,index_esm/* getDocs */.GG)((0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'jobPostings'), (0,index_esm/* where */._M)('__name__', '==', app.jobId)));
                    if (!jobDoc.empty) {
                        const jobData = jobDoc.docs[0].data();
                        return {
                            application: app,
                            job: {
                                id: jobDoc.docs[0].id,
                                title: jobData.title || 'Untitled Job',
                                companyName: jobData.companyName || jobData.company || '',
                                department: jobData.department || '',
                                location: jobData.location || '',
                                status: jobData.status || '',
                                postedAt: jobData.postedAt || null,
                                postedById: jobDoc.docs[0].id, // Assuming jobId is the document ID
                            }
                        };
                    }
                    return { application: app, job: null };
                }));
                setApplications(jobs);
                // Calculate stats
                const newStats = {
                    total: jobs.length,
                    pending: jobs.filter(j => j.application.status === 'pending').length,
                    reviewed: jobs.filter(j => j.application.status === 'reviewed').length,
                    shortlisted: jobs.filter(j => j.application.status === 'shortlisted').length,
                    interviewed: jobs.filter(j => j.application.status === 'interviewed').length,
                    hired: jobs.filter(j => j.application.status === 'hired').length,
                    rejected: jobs.filter(j => j.application.status === 'rejected').length,
                    withdrawn: jobs.filter(j => j.application.status === 'withdrawn').length
                };
                setStats(newStats);
            }
            catch (error) {
                console.error('Error fetching applications:', error);
                dist/* toast */.oR.error('Failed to load applications');
            }
            finally {
                setIsLoading(false);
            }
        });
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [currentUser]);
    // Filter and sort applications
    (0,react.useEffect)(() => {
        let filtered = applications;
        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.application.status === statusFilter);
        }
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(app => app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job?.location?.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'appliedAt':
                    aValue = a.application.appliedAt?.toDate?.() || new Date(0);
                    bValue = b.application.appliedAt?.toDate?.() || new Date(0);
                    break;
                case 'company':
                    aValue = a.job?.companyName || '';
                    bValue = b.job?.companyName || '';
                    break;
                case 'title':
                    aValue = a.job?.title || '';
                    bValue = b.job?.title || '';
                    break;
                case 'status':
                    aValue = a.application.status;
                    bValue = b.application.status;
                    break;
                default:
                    aValue = a.application.appliedAt?.toDate?.() || new Date(0);
                    bValue = b.application.appliedAt?.toDate?.() || new Date(0);
            }
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            else {
                return aValue < bValue ? 1 : -1;
            }
        });
        setFilteredApplications(filtered);
    }, [applications, statusFilter, searchTerm, sortBy, sortOrder]);
    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            reviewed: 'bg-blue-100 text-blue-800',
            shortlisted: 'bg-purple-100 text-purple-800',
            interviewed: 'bg-indigo-100 text-indigo-800',
            hired: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            withdrawn: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };
    return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 py-12 px-4 md:px-8", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0,jsx_runtime.jsx)("div", { className: "mb-8", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h1", { className: "text-3xl font-light text-gray-900 mb-2", children: "Application Dashboard" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Track and manage your job applications" })] }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/applications/analytics", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium", children: "View Analytics" })] }) }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8", children: [(0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "text-center p-4", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: stats.total }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Total" })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "text-center p-4", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-yellow-600", children: stats.pending }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Pending" })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "text-center p-4", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: stats.reviewed }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Reviewed" })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "text-center p-4", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: stats.shortlisted }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Shortlisted" })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "text-center p-4", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-indigo-600", children: stats.interviewed }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Interviewed" })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "text-center p-4", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-green-600", children: stats.hired }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Hired" })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "text-center p-4", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-red-600", children: stats.rejected }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Rejected" })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "text-center p-4", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-gray-600", children: stats.withdrawn }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Withdrawn" })] })] }), (0,jsx_runtime.jsx)(Card/* default */.Ay, { variant: "elevated", className: "mb-6", children: (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { className: "p-6", children: (0,jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row gap-4", children: [(0,jsx_runtime.jsx)("div", { className: "flex-1", children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search jobs, companies, or locations...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }) }), (0,jsx_runtime.jsx)("div", { className: "w-full md:w-48", children: (0,jsx_runtime.jsx)(ui_Select, { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), options: [
                                            { value: 'all', label: 'All Statuses' },
                                            { value: 'pending', label: 'Pending' },
                                            { value: 'reviewed', label: 'Reviewed' },
                                            { value: 'shortlisted', label: 'Shortlisted' },
                                            { value: 'interviewed', label: 'Interviewed' },
                                            { value: 'hired', label: 'Hired' },
                                            { value: 'rejected', label: 'Rejected' },
                                            { value: 'withdrawn', label: 'Withdrawn' }
                                        ] }) }), (0,jsx_runtime.jsx)("div", { className: "w-full md:w-48", children: (0,jsx_runtime.jsx)(ui_Select, { value: sortBy, onChange: (e) => setSortBy(e.target.value), options: [
                                            { value: 'appliedAt', label: 'Applied Date' },
                                            { value: 'company', label: 'Company' },
                                            { value: 'title', label: 'Job Title' },
                                            { value: 'status', label: 'Status' }
                                        ] }) }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", onClick: () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'), className: "w-full md:w-auto", children: [(0,jsx_runtime.jsx)(arrow_up_down/* default */.A, { className: "w-4 h-4 mr-2" }), sortOrder === 'asc' ? 'A-Z' : 'Z-A'] })] }) }) }), isLoading ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-12", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading applications..." })] })) : filteredApplications.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-12", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDCDD" }), (0,jsx_runtime.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "No applications found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: applications.length === 0
                                ? "You haven't applied to any jobs yet."
                                : "No applications match your current filters." })] })) : ((0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: filteredApplications.map(({ application, job }) => {
                        const enhancedStatus = {
                            status: application.status || 'pending',
                            lastUpdated: application.lastUpdated?.toDate(),
                            timeline: {
                                applied: application.appliedAt?.toDate() || new Date(),
                                reviewed: application.reviewedAt?.toDate(),
                                shortlisted: application.reviewedAt?.toDate(),
                                interviewed: application.interviewScheduled?.toDate(),
                                decision: application.lastUpdated?.toDate(),
                            },
                            notes: application.notes,
                            nextStep: application.interviewNotes
                        };
                        return ((0,jsx_runtime.jsx)(Card/* default */.Ay, { variant: "elevated", hoverable: true, children: (0,jsx_runtime.jsxs)(Card/* CardBody */.bw, { className: "p-6", children: [(0,jsx_runtime.jsx)("div", { className: "flex items-start justify-between mb-4", children: (0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)(Card/* CardTitle */.ZB, { className: "text-lg font-medium text-gray-900 mb-2", children: (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: job ? `/jobs/${job.id}` : '#', className: "hover:text-blue-600 transition-colors", children: job?.title || 'Untitled Job' }) }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-600 mb-3", children: [job?.companyName && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(building/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: job.companyName })] })), job?.location && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(map_pin/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: job.location })] }))] })] }) }), (0,jsx_runtime.jsx)(ApplicationStatusBadge/* default */.A, { status: enhancedStatus, showProgress: true, className: "mb-4" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 pt-4 border-t border-gray-100", children: [(0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: job ? `/jobs/${job.id}` : '#', className: "flex-1 px-3 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors text-center", children: "View Job" }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: `/applications/${application.id}`, className: "flex-1 px-3 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors text-center", children: "View Application" })] })] }) }, application.id));
                    }) }))] }) }));
};
/* harmony default export */ const JobSearch_ApplicationDashboard = (ApplicationDashboard);


/***/ }),

/***/ 4948:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   BT: () => (/* binding */ CardDescription),
/* harmony export */   ZB: () => (/* binding */ CardTitle),
/* harmony export */   aR: () => (/* binding */ CardHeader),
/* harmony export */   bw: () => (/* binding */ CardBody),
/* harmony export */   wL: () => (/* binding */ CardFooter)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3490);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4164);




const Card = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ variant = 'elevated', hoverable = false, rounded = 'lg', shadow = 'md', padding = 'md', className = '', children, ...props }, ref) => {
    // Base card classes
    const baseClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(
    // Base styles
    'transition-all duration-200', 'overflow-hidden', 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2', 
    // Variant styles
    variant === 'elevated' && 'bg-white border border-gray-100', variant === 'outline' && 'bg-white border border-gray-200', variant === 'filled' && 'bg-gray-50', variant === 'unstyled' && 'bg-transparent', 
    // Shadow
    shadow === 'sm' && 'shadow-sm', shadow === 'md' && 'shadow', shadow === 'lg' && 'shadow-md', shadow === 'xl' && 'shadow-lg', shadow === '2xl' && 'shadow-xl', shadow === 'inner' && 'shadow-inner', 
    // Rounded corners
    rounded === 'sm' && 'rounded-sm', rounded === 'md' && 'rounded', rounded === 'lg' && 'rounded-lg', rounded === 'xl' && 'rounded-xl', rounded === '2xl' && 'rounded-2xl', rounded === 'full' && 'rounded-full', 
    // Padding
    padding === 'sm' && 'p-3', padding === 'md' && 'p-4', padding === 'lg' && 'p-6', 
    // Hover effects
    hoverable && [
        'hover:shadow-lg',
        'hover:-translate-y-0.5',
        'transform transition-transform duration-200',
        'hover:ring-2 hover:ring-blue-100',
    ], 
    // Custom class names
    className);
    // Animation variants with proper typing
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };
    // Hover animation
    const hoverAnimation = hoverable ? { scale: 1.01 } : {};
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_3__/* .motion */ .P.div, { ref: ref, className: baseClasses, initial: "hidden", animate: "visible", whileHover: hoverAnimation, variants: variants, ...props, children: children }));
});
Card.displayName = 'Card';
const CardHeader = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', withBorder = true, children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)('px-4 py-3', withBorder && 'border-b border-gray-100', className), ...props, children: children })));
CardHeader.displayName = 'CardHeader';
const CardBody = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', padding = 'md', children, ...props }, ref) => {
    const paddingClass = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    }[padding];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)(paddingClass, className), ...props, children: children }));
});
CardBody.displayName = 'CardBody';
const CardFooter = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', withBorder = true, children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)('px-4 py-3', withBorder && 'border-t border-gray-100', className), ...props, children: children })));
CardFooter.displayName = 'CardFooter';
const CardTitle = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ as: Tag = 'h3', className = '', children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Tag, { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)('text-lg font-semibold text-gray-900', className), ...props, children: children })));
CardTitle.displayName = 'CardTitle';
const CardDescription = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A)('text-sm text-gray-600 mt-1', className), ...props, children: children })));
CardDescription.displayName = 'CardDescription';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Card);


/***/ }),

/***/ 7278:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7235);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7946);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7623);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7504);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4471);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(180);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2307);


const statusConfig = {
    pending: {
        label: 'Pending Review',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,
        progress: 0
    },
    reviewed: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,
        progress: 25
    },
    shortlisted: {
        label: 'Shortlisted',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,
        progress: 50
    },
    interviewed: {
        label: 'Interviewing',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A,
        progress: 75
    },
    hired: {
        label: 'Hired',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A,
        progress: 100
    },
    rejected: {
        label: 'Not Selected',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A,
        progress: 100
    },
    withdrawn: {
        label: 'Withdrawn',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A,
        progress: 100
    }
};
const ApplicationStatusBadge = ({ status, showProgress = true, className = '' }) => {
    const config = statusConfig[status.status];
    const Icon = config.icon;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `space-y-2 ${className}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, { className: "w-3.5 h-3.5" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: config.label })] }), showProgress && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-full", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between text-xs text-gray-500 mb-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Progress" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [config.progress, "%"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out", style: { width: `${config.progress}%` } }) })] })), status.timeline && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-xs text-gray-500 space-y-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A, { className: "w-3 h-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Applied: ", status.timeline.applied.toLocaleDateString()] })] }), status.timeline.reviewed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A, { className: "w-3 h-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Reviewed: ", status.timeline.reviewed.toLocaleDateString()] })] })), status.timeline.shortlisted && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, { className: "w-3 h-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Shortlisted: ", status.timeline.shortlisted.toLocaleDateString()] })] })), status.timeline.interviewed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, { className: "w-3 h-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Interviewed: ", status.timeline.interviewed.toLocaleDateString()] })] })), status.timeline.decision && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [status.status === 'hired' ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A, { className: "w-3 h-3 text-green-600" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, { className: "w-3 h-3 text-red-600" })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Decision: ", status.timeline.decision.toLocaleDateString()] })] }))] })), status.nextStep && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Next:" }), " ", status.nextStep] })), status.notes && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded", children: status.notes }))] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ApplicationStatusBadge);


/***/ })

}]);
//# sourceMappingURL=3029.chunk.js.map