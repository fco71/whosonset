"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[1603],{

/***/ 1603:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2584);
/* harmony import */ var _utilities_savedJobsService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3657);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5788);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(888);
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(774);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9487);









const SavedJobsPage = () => {
    const { currentUser } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__/* .useAuth */ .A)();
    const [savedJobs, setSavedJobs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (!currentUser)
            return;
        setIsLoading(true);
        // Subscribe to real-time updates
        const unsubscribe = _utilities_savedJobsService__WEBPACK_IMPORTED_MODULE_3__/* .SavedJobsService */ .r.subscribeToSavedJobs(currentUser.uid, async (savedJobs) => {
            try {
                // Get full job data for each saved job
                const jobsWithData = await Promise.all(savedJobs.map(async (savedJob) => {
                    try {
                        const jobDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_6__/* .getDocs */ .GG)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_6__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_6__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_7__.db, 'jobPostings'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_6__/* .where */ ._M)('__name__', '==', savedJob.jobId)));
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
                setSavedJobs(jobsWithData);
            }
            catch (error) {
                console.error('Error loading saved jobs:', error);
                react_hot_toast__WEBPACK_IMPORTED_MODULE_4__/* .toast */ .oR.error('Failed to load saved jobs');
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
    const handleRemove = async (savedJobId) => {
        try {
            await _utilities_savedJobsService__WEBPACK_IMPORTED_MODULE_3__/* .SavedJobsService */ .r.removeSavedJob(savedJobId);
            setSavedJobs(prev => prev.filter(job => job.id !== savedJobId));
            react_hot_toast__WEBPACK_IMPORTED_MODULE_4__/* .toast */ .oR.success('Job removed from saved list');
        }
        catch (error) {
            console.error('Error removing saved job:', error);
            react_hot_toast__WEBPACK_IMPORTED_MODULE_4__/* .toast */ .oR.error('Failed to remove saved job');
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50 py-12 px-4 md:px-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8 flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-light text-gray-900", children: "Saved Jobs" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_8__/* .Link */ .N_, { to: "/jobs", className: "text-blue-600 hover:underline text-sm", children: "\u2190 Back to Job Search" })] }), isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading saved jobs..." })] })) : savedJobs.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDCBE" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "No saved jobs yet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "Jobs you save will appear here." })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: savedJobs.map(({ id, jobData }) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-2 flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_8__/* .Link */ .N_, { to: jobData ? `/jobs/${jobData.id}` : '#', className: "text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors truncate", title: jobData?.title, children: jobData?.title || 'Untitled Job' }), jobData?.status && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-2", children: jobData.status }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-gray-600 mb-1 truncate", children: [jobData ? (jobData.contactName || jobData.projectName || '') : '', " \u2022 ", jobData?.department, " \u2022 ", jobData?.location] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-xs text-gray-500 mb-2", children: ["Saved on ", savedJobs.find(j => j.id === id)?.savedAt?.toDate ? savedJobs.find(j => j.id === id)?.savedAt.toDate().toLocaleDateString() : ''] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2 mt-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_8__/* .Link */ .N_, { to: jobData ? `/jobs/${jobData.id}` : '#', className: "flex-1 px-3 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors text-center", children: "View Job" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .$, { onClick: () => handleRemove(id), variant: "outline", className: "flex-1 text-red-600 border-red-200 hover:bg-red-50", children: "Remove" })] })] }, id))) }))] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SavedJobsPage);


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


/***/ })

}]);
//# sourceMappingURL=1603.chunk.js.map