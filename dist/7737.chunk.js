"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[7737],{

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

/***/ 697:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Plus)
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
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("plus", __iconNode);


//# sourceMappingURL=plus.js.map


/***/ }),

/***/ 774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7106);
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

/***/ 1393:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Building)
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
const Building = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("building", __iconNode);


//# sourceMappingURL=building.js.map


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

/***/ 3657:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ SavedJobsService)
/* harmony export */ });
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9487);


class SavedJobsService {
    // Save a job for a user
    static async saveJob(userId, jobId, notes) {
        try {
            const savedJobData = {
                userId,
                jobId,
                savedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
            };
            // Only include notes if it's not undefined
            if (notes !== undefined) {
                savedJobData.notes = notes;
            }
            const docRef = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'savedJobs'), savedJobData);
            console.log('[SavedJobsService] Job saved successfully:', docRef.id);
            return docRef.id;
        }
        catch (error) {
            console.error('Error saving job:', error);
            throw error;
        }
    }
    // Remove a saved job
    static async removeSavedJob(savedJobId) {
        try {
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .deleteDoc */ .kd)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'savedJobs', savedJobId));
            console.log('[SavedJobsService] Job removed from saved list');
        }
        catch (error) {
            console.error('Error removing saved job:', error);
            throw error;
        }
    }
    // Get all saved jobs for a user
    static async getSavedJobs(userId) {
        try {
            const savedJobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'savedJobs'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('userId', '==', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('savedAt', 'desc'));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(savedJobsQuery);
            const savedJobs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log('[SavedJobsService] Loaded saved jobs:', savedJobs.length);
            return savedJobs;
        }
        catch (error) {
            console.error('Error getting saved jobs:', error);
            throw error;
        }
    }
    // Get saved jobs with full job data
    static async getSavedJobsWithData(userId) {
        try {
            const savedJobs = await this.getSavedJobs(userId);
            // Fetch job data for each saved job
            const savedJobsWithData = await Promise.all(savedJobs.map(async (savedJob) => {
                try {
                    const jobDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'jobPostings'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('__name__', '==', savedJob.jobId)));
                    if (!jobDoc.empty) {
                        const jobData = {
                            id: jobDoc.docs[0].id,
                            ...jobDoc.docs[0].data()
                        };
                        return {
                            ...savedJob,
                            jobData
                        };
                    }
                    return savedJob;
                }
                catch (error) {
                    console.error('Error fetching job data for saved job:', error);
                    return savedJob;
                }
            }));
            return savedJobsWithData;
        }
        catch (error) {
            console.error('Error getting saved jobs with data:', error);
            throw error;
        }
    }
    // Check if a job is saved by a user
    static async isJobSaved(userId, jobId) {
        try {
            const savedJobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'savedJobs'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('userId', '==', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('jobId', '==', jobId));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(savedJobsQuery);
            if (!snapshot.empty) {
                return {
                    saved: true,
                    savedJobId: snapshot.docs[0].id
                };
            }
            return { saved: false };
        }
        catch (error) {
            console.error('Error checking if job is saved:', error);
            return { saved: false };
        }
    }
    // Update notes for a saved job
    static async updateSavedJobNotes(savedJobId, notes) {
        try {
            const savedJobRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'savedJobs', savedJobId);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)(savedJobRef, {
                notes,
                updatedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .serverTimestamp */ .O5)()
            });
            console.log('[SavedJobsService] Saved job notes updated');
        }
        catch (error) {
            console.error('Error updating saved job notes:', error);
            throw error;
        }
    }
    // Subscribe to saved jobs changes
    static subscribeToSavedJobs(userId, callback) {
        try {
            const savedJobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'savedJobs'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('userId', '==', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('savedAt', 'desc'));
            return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(savedJobsQuery, (snapshot) => {
                const savedJobs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(savedJobs);
            });
        }
        catch (error) {
            console.error('Error setting up saved jobs listener:', error);
            return () => { };
        }
    }
    // Subscribe to saved status for a specific job
    static subscribeToJobSaveStatus(userId, jobId, callback) {
        try {
            const savedJobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'savedJobs'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('userId', '==', userId), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('jobId', '==', jobId));
            return (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .onSnapshot */ .aQ)(savedJobsQuery, (snapshot) => {
                if (!snapshot.empty) {
                    callback(true, snapshot.docs[0].id);
                }
                else {
                    callback(false);
                }
            });
        }
        catch (error) {
            console.error('Error setting up job save status listener:', error);
            return () => { };
        }
    }
    // Get saved jobs count for a user
    static async getSavedJobsCount(userId) {
        try {
            const savedJobs = await this.getSavedJobs(userId);
            return savedJobs.length;
        }
        catch (error) {
            console.error('Error getting saved jobs count:', error);
            return 0;
        }
    }
}


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

/***/ 6069:
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

/***/ 6589:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ DollarSign)
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
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("dollar-sign", __iconNode);


//# sourceMappingURL=dollar-sign.js.map


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

/***/ 7737:
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
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var react_router_dom_dist = __webpack_require__(4976);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/building.js
var building = __webpack_require__(1393);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/map-pin.js
var map_pin = __webpack_require__(6069);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/globe.js
var globe = __webpack_require__(684);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bookmark-check.js
var bookmark_check = __webpack_require__(4316);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bookmark.js
var bookmark = __webpack_require__(7157);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/dollar-sign.js
var dollar_sign = __webpack_require__(6589);
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
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/funnel.js
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
const Funnel = (0,createLucideIcon/* default */.A)("funnel", __iconNode);


//# sourceMappingURL=funnel.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/star.js
var star = __webpack_require__(1181);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/plus.js
var plus = __webpack_require__(697);
// EXTERNAL MODULE: ./src/utilities/savedJobsService.ts
var savedJobsService = __webpack_require__(3657);
// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var react_hot_toast_dist = __webpack_require__(888);
// EXTERNAL MODULE: ./src/components/ui/Card.tsx
var Card = __webpack_require__(4948);
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
    const navigate = (0,dist/* useNavigate */.Zp)();
    const [isHovered, setIsHovered] = (0,react.useState)(false);
    const [isSaved, setIsSaved] = (0,react.useState)(false);
    const [isSaving, setIsSaving] = (0,react.useState)(false);
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const { t } = (0,es/* useTranslation */.Bd)();
    // Check if job is saved on component mount
    (0,react.useEffect)(() => {
        if (!currentUser || !job.id)
            return;
        // Subscribe to real-time save status updates
        const unsubscribe = savedJobsService/* SavedJobsService */.r.subscribeToJobSaveStatus(currentUser.uid, job.id, (saved, savedJobId) => {
            setIsSaved(saved);
        });
        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [currentUser, job.id]);
    const handleSave = async (e) => {
        e.stopPropagation();
        if (!currentUser) {
            react_hot_toast_dist/* toast */.oR.error(t('auth.errors.loginRequired', 'Please log in to save jobs'));
            return;
        }
        if (!job.id) {
            react_hot_toast_dist/* toast */.oR.error(t('jobs.invalidJobData', 'Invalid job data'));
            return;
        }
        if (isSaving)
            return; // Prevent double-clicks
        setIsSaving(true);
        try {
            if (isSaved) {
                // Remove from saved
                const { savedJobId } = await savedJobsService/* SavedJobsService */.r.isJobSaved(currentUser.uid, job.id);
                if (savedJobId) {
                    await savedJobsService/* SavedJobsService */.r.removeSavedJob(savedJobId);
                    setIsSaved(false);
                    react_hot_toast_dist/* toast */.oR.success(t('jobs.jobRemoved'));
                }
            }
            else {
                // Add to saved
                await savedJobsService/* SavedJobsService */.r.saveJob(currentUser.uid, job.id);
                setIsSaved(true);
                react_hot_toast_dist/* toast */.oR.success(t('jobs.jobSaved'));
            }
        }
        catch (error) {
            console.error('Error saving job:', error);
            react_hot_toast_dist/* toast */.oR.error(t('jobs.failedToSave'));
        }
        finally {
            setIsSaving(false);
        }
    };
    return ((0,jsx_runtime.jsx)(Card/* default */.Ay, { variant: "elevated", hoverable: true, className: "group cursor-pointer overflow-hidden", onClick: () => navigate(`/jobs/${job.id}`), onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: (0,jsx_runtime.jsxs)(Card/* CardBody */.bw, { className: "p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)(Card/* CardTitle */.ZB, { className: "text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2", children: job.title || t('jobs.untitledPosition') }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-600 mb-3", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(building/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: job.department || t('jobs.various') })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(map_pin/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: job.location })] }), job.isRemote && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1 text-blue-600", children: [(0,jsx_runtime.jsx)(globe/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: t('jobs.remote') })] }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [currentUser && ((0,jsx_runtime.jsx)("button", { className: `p-2 rounded-lg transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"} ${isSaved
                                        ? "text-blue-600 hover:text-blue-700"
                                        : "text-gray-400 hover:text-blue-600"}`, title: isSaved ? t('jobs.removeFromSaved') : t('jobs.saveJob'), onClick: handleSave, disabled: isSaving, children: isSaving ? ((0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-current" })) : isSaved ? ((0,jsx_runtime.jsx)(bookmark_check/* default */.A, { className: "w-5 h-5 fill-current" })) : ((0,jsx_runtime.jsx)(bookmark/* default */.A, { className: "w-5 h-5" })) })), currentUserId && job.postedById === currentUserId && ((0,jsx_runtime.jsx)("button", { className: "p-2 rounded-lg hover:bg-gray-100 transition-colors", title: t('jobs.editJob'), onClick: e => {
                                        e.stopPropagation();
                                        onEdit ? onEdit(job) : navigate(`/edit-job/${job.id}`);
                                    }, children: (0,jsx_runtime.jsx)("svg", { className: "w-5 h-5 text-gray-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" }) }) }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2 mb-4", children: [hasValue(job.jobType) && ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full", children: job.jobType?.replace('_', ' ') })), hasValue(job.experienceLevel) && ((0,jsx_runtime.jsxs)("span", { className: "px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full", children: [job.experienceLevel, " ", t('jobs.level')] })), job.isPaid && ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full", children: t('jobs.paid') }))] }), hasValue(job.description) && ((0,jsx_runtime.jsx)(Card/* CardDescription */.BT, { className: "text-gray-600 text-sm mb-4 line-clamp-2", children: job.description })), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 text-sm text-gray-500", children: [job.showSalary && (job.salaryMin || job.salaryMax) && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(dollar_sign/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { className: "font-medium", children: formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod) })] })), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [(0,jsx_runtime.jsx)(calendar/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsxs)("span", { children: [t('jobs.posted'), " ", formatDate(job.createdAt)] })] })] }), (0,jsx_runtime.jsxs)("div", { className: `flex items-center gap-1 text-blue-600 text-sm font-medium transition-transform ${isHovered ? 'translate-x-1' : ''}`, children: [(0,jsx_runtime.jsx)("span", { children: t('jobs.viewDetails') }), (0,jsx_runtime.jsx)(arrow_right/* default */.A, { className: "w-4 h-4" })] })] })] }) }));
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
    const navigate = (0,dist/* useNavigate */.Zp)();
    const { t } = (0,es/* useTranslation */.Bd)();
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
        { icon: (0,jsx_runtime.jsx)(briefcase/* default */.A, { className: "w-5 h-5" }), label: t('jobs.activeJobs'), value: jobs.length },
        { icon: (0,jsx_runtime.jsx)(building/* default */.A, { className: "w-5 h-5" }), label: t('jobs.companies'), value: new Set(jobs.map(j => j.contactName || j.projectName)).size },
        { icon: (0,jsx_runtime.jsx)(map_pin/* default */.A, { className: "w-5 h-5" }), label: t('jobs.locations'), value: new Set(jobs.map(j => j.location)).size },
        { icon: (0,jsx_runtime.jsx)(users/* default */.A, { className: "w-5 h-5" }), label: t('jobs.remoteJobs'), value: jobs.filter(j => j.isRemote).length }
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
            const jobsCollection = (0,index_esm/* collection */.rJ)(db, 'jobPostings');
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
            setError(t('jobs.failedToSave'));
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
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: (0,jsx_runtime.jsxs)("div", { className: "animate-pulse", children: [(0,jsx_runtime.jsx)("div", { className: "h-8 bg-gray-200 rounded w-48 mb-4" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-64 mb-8" }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => ((0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "p-6", children: [(0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-3/4 mb-4" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-full mb-2" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-2/3 mb-4" }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2 mb-4", children: [(0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-16" }), (0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded w-20" })] }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded w-1/2" })] }, i))) })] }) }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center mb-12", children: [(0,jsx_runtime.jsx)("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-4", children: t('jobs.heroTitle', 'Find Your Next Film Industry Role') }), (0,jsx_runtime.jsx)("p", { className: "text-xl text-gray-600 max-w-3xl mx-auto", children: t('jobs.heroSubtitle', 'Discover opportunities with leading productions, connect with industry professionals, and advance your career in film and television.') })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: stats.map((stat, index) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200", children: [(0,jsx_runtime.jsx)("div", { className: "flex justify-center mb-2 text-blue-600", children: stat.icon }), (0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: stat.value }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: stat.label })] }, index))) }), (0,jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto", children: (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-lg border border-gray-200 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row gap-4", children: [(0,jsx_runtime.jsxs)("div", { className: "relative flex-1", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: t('jobs.searchPlaceholder', 'Search jobs by title, company, or keywords...'), className: "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", onClick: () => setShowFilters(!showFilters), className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(Funnel, { className: "w-4 h-4" }), t('jobs.filters'), hasActiveFilters && ((0,jsx_runtime.jsx)("span", { className: "bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs", children: [searchQuery, selectedDepartment, selectedLocation, selectedJobType, remoteOnly].filter(Boolean).length }))] }), auth.currentUser && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)(Button/* Button */.$, { onClick: () => navigate('/jobs/applied'), className: "flex items-center gap-2", variant: "secondary", children: [(0,jsx_runtime.jsx)(briefcase/* default */.A, { className: "w-4 h-4" }), t('jobs.myApplications')] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { onClick: () => navigate('/jobs/saved'), className: "flex items-center gap-2", variant: "secondary", children: [(0,jsx_runtime.jsx)(star/* default */.A, { className: "w-4 h-4" }), t('jobs.savedJobs')] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { onClick: () => navigate('/post-job'), className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(plus/* default */.A, { className: "w-4 h-4" }), t('jobs.postJob')] })] }))] })] }), showFilters && ((0,jsx_runtime.jsxs)("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: t('jobs.department', 'Department') }), (0,jsx_runtime.jsxs)("select", { value: selectedDepartment, onChange: (e) => setSelectedDepartment(e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none", children: [(0,jsx_runtime.jsx)("option", { value: "", children: t('jobs.allDepartments') }), departments.map(dept => ((0,jsx_runtime.jsx)("option", { value: dept, children: dept }, dept)))] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: t('jobs.location', 'Location') }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: t('jobs.enterLocation', 'Enter location'), value: selectedLocation, onChange: (e) => setSelectedLocation(e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: t('jobs.jobType', 'Job Type') }), (0,jsx_runtime.jsxs)("select", { value: selectedJobType, onChange: (e) => setSelectedJobType(e.target.value), className: "w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none", children: [(0,jsx_runtime.jsx)("option", { value: "", children: t('jobs.allJobTypes') }), jobTypes.map(type => ((0,jsx_runtime.jsx)("option", { value: type.value, children: type.label }, type.value)))] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: t('jobs.remote') }), (0,jsx_runtime.jsxs)("label", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("input", { type: "checkbox", checked: remoteOnly, onChange: (e) => setRemoteOnly(e.target.checked), className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500" }), (0,jsx_runtime.jsx)("span", { className: "ml-2 text-sm text-gray-600", children: t('jobs.remoteOnly') })] })] })] }), hasActiveFilters && ((0,jsx_runtime.jsxs)("div", { className: "mt-4 flex justify-between items-center", children: [(0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-600", children: [filteredJobs.length, " of ", jobs.length, " jobs match your filters"] }), (0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "ghost", onClick: clearFilters, children: t('jobs.clearFilters') })] }))] }))] }) })] }) }), (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [error && ((0,jsx_runtime.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6", children: (0,jsx_runtime.jsx)("p", { className: "text-red-600", children: error }) })), filteredJobs.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-16", children: [(0,jsx_runtime.jsx)("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: (0,jsx_runtime.jsx)(briefcase/* default */.A, { className: "w-8 h-8 text-gray-400" }) }), (0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: t('jobs.noJobsFound') }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-6", children: hasActiveFilters
                                    ? "Try adjusting your filters to see more results."
                                    : "Check back later for new opportunities." }), hasActiveFilters && ((0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "outline", onClick: clearFilters, children: "Clear filters" }))] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-4 mb-8 justify-center md:justify-start", children: [(0,jsx_runtime.jsx)(react_router_dom_dist/* Link */.N_, { to: "/jobs/posted", className: "px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow", children: t('jobs.myPostedJobs') }), (0,jsx_runtime.jsx)(react_router_dom_dist/* Link */.N_, { to: "/jobs/analytics", className: "px-5 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow", children: t('jobs.jobAnalytics') }), (0,jsx_runtime.jsx)(react_router_dom_dist/* Link */.N_, { to: "/post-job", className: "px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow", children: t('jobs.postNewJob') })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsxs)("h2", { className: "text-2xl font-bold text-gray-900", children: [filteredJobs.length, " ", t('jobs.jobsAvailable')] }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: hasActiveFilters ? t('jobs.filteredResults', 'Filtered results') : t('jobs.allAvailablePositions') })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-600", children: [t('jobs.sortBy'), ":"] }), (0,jsx_runtime.jsxs)("select", { className: "px-3 py-1 border border-gray-200 rounded-lg text-sm", children: [(0,jsx_runtime.jsx)("option", { children: t('jobs.newestFirst') }), (0,jsx_runtime.jsx)("option", { children: t('jobs.oldestFirst') }), (0,jsx_runtime.jsx)("option", { children: t('jobs.salaryHighToLow') }), (0,jsx_runtime.jsx)("option", { children: t('jobs.salaryLowToHigh') })] })] })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredJobs.map((job) => ((0,jsx_runtime.jsx)(JobCard, { job: job, currentUserId: auth.currentUser?.uid }, job.id))) }), filteredJobs.length > 0 && filteredJobs.length < jobs.length && ((0,jsx_runtime.jsx)("div", { className: "text-center mt-8", children: (0,jsx_runtime.jsx)(Button/* Button */.$, { onClick: () => { }, variant: "outline", className: "px-6 py-2", children: t('jobs.loadMoreJobs') }) }))] }))] })] }));
}


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
//# sourceMappingURL=7737.chunk.js.map