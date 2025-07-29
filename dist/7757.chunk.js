"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[7757],{

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
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7106);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4164);




const Card = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ variant = 'elevated', hoverable = false, rounded = 'lg', shadow = 'md', padding = 'md', className = '', children, ...props }, ref) => {
    // Base card classes
    const baseClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(
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
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_2__/* .motion */ .P.div, { ref: ref, className: baseClasses, initial: "hidden", animate: "visible", whileHover: hoverAnimation, variants: variants, ...props, children: children }));
});
Card.displayName = 'Card';
const CardHeader = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', withBorder = true, children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('px-4 py-3', withBorder && 'border-b border-gray-100', className), ...props, children: children })));
CardHeader.displayName = 'CardHeader';
const CardBody = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', padding = 'md', children, ...props }, ref) => {
    const paddingClass = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    }[padding];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(paddingClass, className), ...props, children: children }));
});
CardBody.displayName = 'CardBody';
const CardFooter = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', withBorder = true, children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('px-4 py-3', withBorder && 'border-t border-gray-100', className), ...props, children: children })));
CardFooter.displayName = 'CardFooter';
const CardTitle = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ as: Tag = 'h3', className = '', children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Tag, { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('text-lg font-semibold text-gray-900', className), ...props, children: children })));
CardTitle.displayName = 'CardTitle';
const CardDescription = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('text-sm text-gray-600 mt-1', className), ...props, children: children })));
CardDescription.displayName = 'CardDescription';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Card);


/***/ }),

/***/ 7235:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Clock)
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
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Clock = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("clock", __iconNode);


//# sourceMappingURL=clock.js.map


/***/ }),

/***/ 7278:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7946);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4471);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(180);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2307);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7235);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7504);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7623);


const statusConfig = {
    pending: {
        label: 'Pending Review',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A,
        progress: 0
    },
    reviewed: {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A,
        progress: 25
    },
    shortlisted: {
        label: 'Shortlisted',
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A,
        progress: 50
    },
    interviewed: {
        label: 'Interviewing',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A,
        progress: 75
    },
    hired: {
        label: 'Hired',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A,
        progress: 100
    },
    rejected: {
        label: 'Not Selected',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,
        progress: 100
    },
    withdrawn: {
        label: 'Withdrawn',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: lucide_react__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A,
        progress: 100
    }
};
const ApplicationStatusBadge = ({ status, showProgress = true, className = '' }) => {
    const config = statusConfig[status.status];
    const Icon = config.icon;
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `space-y-2 ${className}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Icon, { className: "w-3.5 h-3.5" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: config.label })] }), showProgress && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "w-full", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex justify-between text-xs text-gray-500 mb-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "Progress" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: [config.progress, "%"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out", style: { width: `${config.progress}%` } }) })] })), status.timeline && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-xs text-gray-500 space-y-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, { className: "w-3 h-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Applied: ", status.timeline.applied.toLocaleDateString()] })] }), status.timeline.reviewed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A, { className: "w-3 h-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Reviewed: ", status.timeline.reviewed.toLocaleDateString()] })] })), status.timeline.shortlisted && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A, { className: "w-3 h-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Shortlisted: ", status.timeline.shortlisted.toLocaleDateString()] })] })), status.timeline.interviewed && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, { className: "w-3 h-3" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Interviewed: ", status.timeline.interviewed.toLocaleDateString()] })] })), status.timeline.decision && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [status.status === 'hired' ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A, { className: "w-3 h-3 text-green-600" })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, { className: "w-3 h-3 text-red-600" })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { children: ["Decision: ", status.timeline.decision.toLocaleDateString()] })] }))] })), status.nextStep && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Next:" }), " ", status.nextStep] })), status.notes && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded", children: status.notes }))] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ApplicationStatusBadge);


/***/ }),

/***/ 7623:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ UserCheck)
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
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("user-check", __iconNode);


//# sourceMappingURL=user-check.js.map


/***/ }),

/***/ 7757:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2584);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9487);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7594);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4976);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(888);
/* harmony import */ var _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6093);
/* harmony import */ var _ApplicationStatusBadge__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7278);
/* harmony import */ var _ui_Card__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(4948);










const AppliedJobsPage = () => {
    const { currentUser } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__/* .useAuth */ .A)();
    const [appliedJobs, setAppliedJobs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (!currentUser)
            return;
        setIsLoading(true);
        // Subscribe to real-time updates for user applications
        const unsubscribe = _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_7__/* .JobApplicationService */ .l.subscribeToUserApplications(currentUser.uid, async (applications) => {
            try {
                const jobs = await Promise.all(applications.map(async (app) => {
                    if (!app.jobId)
                        return { application: app, job: null };
                    const jobDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_3__.db, 'jobPostings', app.jobId));
                    if (!jobDoc.exists())
                        return { application: app, job: null };
                    const jobData = jobDoc.data();
                    return {
                        application: app,
                        job: {
                            id: jobDoc.id,
                            title: jobData.title || 'Untitled Job',
                            companyName: jobData.companyName || jobData.company || '',
                            department: jobData.department || '',
                            location: jobData.location || '',
                            status: jobData.status || '',
                            postedAt: jobData.postedAt || null,
                        }
                    };
                }));
                setAppliedJobs(jobs);
            }
            catch (error) {
                console.error('Error fetching applied jobs:', error);
                react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('Failed to load applied jobs');
            }
            finally {
                setIsLoading(false);
            }
        });
        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [currentUser]);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50 py-12 px-4 md:px-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8 flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-light text-gray-900", children: "Jobs You've Applied To" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: "/applications/dashboard", className: "text-blue-600 hover:underline text-sm", children: "View Dashboard" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: "/jobs", className: "text-blue-600 hover:underline text-sm", children: "\u2190 Back to Job Search" })] })] }), isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading applied jobs..." })] })) : appliedJobs.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDCDD" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "No applications yet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "Jobs you apply to will appear here." })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: appliedJobs.map(({ application, job }) => {
                        // Create enhanced status object
                        const enhancedStatus = {
                            status: application.status || 'pending',
                            lastUpdated: application.lastUpdated?.toDate(),
                            timeline: {
                                applied: application.appliedAt?.toDate() || new Date(),
                                reviewed: application.reviewedAt?.toDate(),
                                shortlisted: application.reviewedAt?.toDate(), // Use reviewedAt for shortlisted
                                interviewed: application.interviewScheduled?.toDate(),
                                decision: application.lastUpdated?.toDate(),
                            },
                            notes: application.notes,
                            nextStep: application.interviewNotes
                        };
                        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ui_Card__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Ay, { variant: "elevated", hoverable: true, className: "flex flex-col", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_ui_Card__WEBPACK_IMPORTED_MODULE_9__/* .CardBody */ .bw, { className: "p-6 flex flex-col justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-start justify-between mb-3", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ui_Card__WEBPACK_IMPORTED_MODULE_9__/* .CardTitle */ .ZB, { className: "text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors truncate", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: job ? `/jobs/${job.id}` : '#', title: job?.title, children: job?.title || 'Untitled Job' }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_ui_Card__WEBPACK_IMPORTED_MODULE_9__/* .CardDescription */ .BT, { className: "text-gray-600 mb-3", children: [job?.companyName, " \u2022 ", job?.department, " \u2022 ", job?.location] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ApplicationStatusBadge__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A, { status: enhancedStatus, showProgress: true, className: "mb-4" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_ui_Card__WEBPACK_IMPORTED_MODULE_9__/* .CardFooter */ .wL, { className: "flex items-center gap-2 pt-4 border-t border-gray-100", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: job ? `/jobs/${job.id}` : '#', className: "flex-1 px-3 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors text-center", children: "View Job" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: `/applications/${application.id}`, className: "flex-1 px-3 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors text-center", children: "View Application" })] })] }) }, application.id));
                    }) }))] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AppliedJobsPage);


/***/ }),

/***/ 7946:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ CircleAlert)
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
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("circle-alert", __iconNode);


//# sourceMappingURL=circle-alert.js.map


/***/ })

}]);
//# sourceMappingURL=7757.chunk.js.map