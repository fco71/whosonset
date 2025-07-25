"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[9009],{

/***/ 9009:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7594);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2584);
/* harmony import */ var _components_ui_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(774);





const DebugJobsPage = () => {
    const [jobs, setJobs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [collectionName, setCollectionName] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('jobPostings');
    const [collectionNames] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(['jobPostings', 'jobs']);
    const [jobCounts, setJobCounts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    const auth = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__/* .useAuth */ .A)();
    // Check job counts in all collections
    const checkAllCollections = async () => {
        console.log('Checking all collections for jobs...');
        const counts = {};
        const db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .getFirestore */ .aU)();
        for (const name of collectionNames) {
            try {
                const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .collection */ .rJ)(db, name));
                const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .getDocs */ .GG)(q);
                counts[name] = snapshot.size;
                console.log(`Found ${snapshot.size} jobs in collection '${name}'`);
            }
            catch (err) {
                console.error(`Error checking collection '${name}':`, err);
                counts[name] = -1; // Indicate error
            }
        }
        setJobCounts(counts);
        return counts;
    };
    // Fetch jobs from the specified collection
    const fetchAllJobs = async (collectionToCheck = collectionName) => {
        try {
            setLoading(true);
            console.log(`Fetching all jobs from collection '${collectionToCheck}'...`);
            const db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .getFirestore */ .aU)();
            const jobsRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .collection */ .rJ)(db, collectionToCheck);
            const querySnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .getDocs */ .GG)(jobsRef);
            console.log(`Found ${querySnapshot.size} jobs in collection '${collectionToCheck}'`);
            const jobsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data();
                const jobData = {
                    id: docSnapshot.id,
                    ...data,
                    // Convert Firestore timestamps to readable dates
                    createdAt: data.createdAt?.toDate?.() || 'No date',
                    updatedAt: data.updatedAt?.toDate?.() || 'No date',
                    // Initialize userData as undefined (will be set if user data is available)
                    userData: undefined
                };
                // Try to get user data if postedById exists
                if (data.postedById) {
                    try {
                        const userDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(db, 'crewProfiles', data.postedById));
                        if (userDoc.exists()) {
                            // Explicitly type the user data
                            const userData = userDoc.data();
                            jobData.userData = userData;
                        }
                    }
                    catch (userErr) {
                        console.log(`Could not fetch user data for ${data.postedById}:`, userErr);
                    }
                }
                return jobData;
            }));
            setJobs(jobsData);
            console.log('Jobs data:', jobsData);
            setError(null);
        }
        catch (err) {
            const errorMessage = `Error fetching jobs from '${collectionToCheck}': ${err instanceof Error ? err.message : String(err)}`;
            console.error(errorMessage, err);
            setError(errorMessage);
            setJobs([]);
        }
        finally {
            setLoading(false);
        }
    };
    // Initial load
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const initialize = async () => {
            // First check all collections
            const counts = await checkAllCollections();
            // Then load jobs from the first non-empty collection
            const nonEmptyCollection = Object.entries(counts).find(([_, count]) => count > 0);
            if (nonEmptyCollection) {
                setCollectionName(nonEmptyCollection[0]);
                await fetchAllJobs(nonEmptyCollection[0]);
            }
            else {
                // If no jobs found, still try to load from default collection
                await fetchAllJobs();
            }
        };
        initialize();
    }, []);
    const handleRefresh = async () => {
        await checkAllCollections();
        await fetchAllJobs(collectionName);
    };
    const handleCollectionChange = (e) => {
        const newCollection = e.target.value;
        setCollectionName(newCollection);
        fetchAllJobs(newCollection);
    };
    if (loading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { padding: '20px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { children: "Debug: Loading Job Data..." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: ["Checking collections: ", JSON.stringify(collectionNames)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "Please wait..." })] }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { padding: '20px', fontFamily: 'monospace' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { children: "Debug: Job Postings" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ui_Button__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .$, { onClick: handleRefresh, style: { marginRight: '10px' }, children: "Refresh" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("select", { value: collectionName, onChange: handleCollectionChange, style: { padding: '5px' }, children: collectionNames.map(name => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("option", { value: name, children: [name, " (", jobCounts[name] ?? '?', ")"] }, name))) })] })] }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    padding: '15px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    borderLeft: '4px solid #c62828'
                }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Error:" }), " ", error] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { marginBottom: '20px' }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: "Collection Status:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("ul", { children: collectionNames.map(name => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("li", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("strong", { children: [name, ":"] }), " ", jobCounts[name] ?? '?', " jobs", name === collectionName && ' (current)'] }, name))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: ["Total jobs: ", jobs.length] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { children: "All Jobs in 'jobPostings' collection:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { marginTop: '20px' }, children: jobs.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { children: "No jobs found in the database." })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { display: 'grid', gap: '20px' }, children: jobs.map((job) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: {
                            border: '1px solid #ccc',
                            padding: '15px',
                            borderRadius: '5px',
                            backgroundColor: job.status === 'published' ? '#f0fff0' : '#fff0f0'
                        }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { children: job.title || 'Untitled Job' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "ID:" }), " ", job.id] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Status:" }), " ", (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { style: {
                                            color: job.status === 'published' ? 'green' : 'red',
                                            fontWeight: 'bold'
                                        }, children: job.status || 'draft' })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Created:" }), " ", job.createdAt?.toString() || 'N/A'] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Updated:" }), " ", job.updatedAt?.toString() || 'N/A'] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("strong", { children: "Posted By:" }), " ", job.postedById || 'N/A'] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { marginTop: '10px', padding: '10px', backgroundColor: '#f8f8f8', borderRadius: '4px' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("pre", { children: JSON.stringify(job, null, 2) }) })] }, job.id))) })) })] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DebugJobsPage);


/***/ })

}]);
//# sourceMappingURL=9009.chunk.js.map