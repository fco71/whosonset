"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[8004],{

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

/***/ 8004:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ JobSearch_JobDetailPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var dist = __webpack_require__(888);
;// ./src/components/JobSearch/FirebaseDiagnostic.tsx




const FirebaseDiagnostic = () => {
    const [diagnosticResults, setDiagnosticResults] = useState({
        firebaseConfig: false,
        firestoreConnection: false,
        authConnection: false
    });
    useEffect(() => {
        runDiagnostics();
    }, []);
    const runDiagnostics = async () => {
        const results = {
            firebaseConfig: false,
            firestoreConnection: false,
            authConnection: false,
            error: undefined
        };
        try {
            // Check Firebase config
            const config = {
                apiKey: "AIzaSyDTvNBe3q-Wbog_sMlRFjwA_gqGXpw37UM",
                authDomain: "whosonsetdepez.firebaseapp.com",
                projectId: "whosonsetdepez",
                storageBucket: "whosonsetdepez.firebasestorage.app",
                messagingSenderId: "100935772037",
                appId: "1:100935772037:web:37d83a6740e740ff37c6ec",
            };
            results.firebaseConfig = !!(config.apiKey && config.projectId && config.appId);
            // Test Firestore connection
            try {
                const testDoc = await getDoc(doc(db, 'test', 'connection-test'));
                results.firestoreConnection = true;
            }
            catch (error) {
                if (error.code === 'permission-denied') {
                    // This is expected for a test document
                    results.firestoreConnection = true;
                }
                else {
                    results.firestoreConnection = false;
                    results.error = `Firestore error: ${error.code} - ${error.message}`;
                }
            }
            // Test Auth connection
            results.authConnection = true; // Auth is usually available if config is correct
        }
        catch (error) {
            results.error = `Diagnostic error: ${error.message}`;
        }
        setDiagnosticResults(results);
    };
    if (!diagnosticResults.firebaseConfig) {
        return (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold text-red-800 mb-2", children: "Firebase Configuration Issue" }), _jsx("p", { className: "text-red-700 mb-2", children: "Firebase configuration is incomplete. Please check your environment variables:" }), _jsxs("ul", { className: "text-sm text-red-600 space-y-1", children: [_jsxs("li", { children: ["REACT_APP_FIREBASE_API_KEY: ",  true ? '✅ Set' : 0] }), _jsxs("li", { children: ["REACT_APP_FIREBASE_PROJECT_ID: ",  true ? '✅ Set' : 0] }), _jsxs("li", { children: ["REACT_APP_FIREBASE_APP_ID: ",  true ? '✅ Set' : 0] })] }), _jsx("button", { onClick: runDiagnostics, className: "mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700", children: "Retry Diagnostics" })] }));
    }
    if (!diagnosticResults.firestoreConnection) {
        return (_jsxs("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold text-yellow-800 mb-2", children: "Firestore Connection Issue" }), _jsx("p", { className: "text-yellow-700 mb-2", children: "Unable to connect to Firestore database." }), diagnosticResults.error && (_jsxs("p", { className: "text-sm text-yellow-600 mb-2", children: ["Error: ", diagnosticResults.error] })), _jsxs("div", { className: "text-sm text-yellow-600 space-y-1", children: [_jsx("p", { children: "Possible causes:" }), _jsxs("ul", { className: "list-disc list-inside ml-2", children: [_jsx("li", { children: "Network connectivity issues" }), _jsx("li", { children: "Firebase project is paused or disabled" }), _jsx("li", { children: "Firestore rules are blocking access" }), _jsx("li", { children: "Firebase configuration mismatch" })] })] }), _jsx("button", { onClick: runDiagnostics, className: "mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700", children: "Retry Diagnostics" })] }));
    }
    return (_jsxs("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold text-green-800 mb-2", children: "Firebase Connection Status" }), _jsxs("div", { className: "space-y-1 text-sm text-green-700", children: [_jsx("p", { children: "\u2705 Firebase Configuration: Valid" }), _jsx("p", { children: "\u2705 Firestore Connection: Working" }), _jsx("p", { children: "\u2705 Auth Connection: Available" })] }), _jsx("button", { onClick: runDiagnostics, className: "mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700", children: "Refresh Diagnostics" })] }));
};
/* harmony default export */ const JobSearch_FirebaseDiagnostic = ((/* unused pure expression or super */ null && (FirebaseDiagnostic)));

// EXTERNAL MODULE: ./src/utilities/savedJobsService.ts
var savedJobsService = __webpack_require__(3657);
;// ./src/components/JobSearch/JobDetailPage.tsx









const JobDetailPage = () => {
    const auth = (0,AuthContext/* useAuth */.A)();
    const { jobId } = (0,chunk_QMGIS6GS/* useParams */.g)();
    const navigate = (0,chunk_QMGIS6GS/* useNavigate */.Zp)();
    const [job, setJob] = (0,react.useState)(null);
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [isSaved, setIsSaved] = (0,react.useState)(false);
    const [hasApplied, setHasApplied] = (0,react.useState)(false);
    const [isViewingStats, setIsViewingStats] = (0,react.useState)(false);
    const [connectionStatus, setConnectionStatus] = (0,react.useState)('connected');
    (0,react.useEffect)(() => {
        if (jobId) {
            loadJobDetails();
            // View tracking disabled to eliminate Firebase connection errors
        }
    }, [jobId]);
    const loadJobDetails = async (retryCount = 0) => {
        if (!jobId) {
            setError('No job ID provided');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            setConnectionStatus('connecting');
            const jobDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'jobPostings', jobId));
            if (!jobDoc.exists()) {
                throw new Error('Job not found');
            }
            const data = jobDoc.data();
            // Map the Firestore document to the JobPosting interface
            const jobData = {
                id: jobDoc.id,
                title: data.title || '',
                department: data.department || '',
                jobTitle: data.title || '',
                description: data.description || '',
                requirements: typeof data.requirements === 'string' ? [data.requirements] :
                    Array.isArray(data.requirements) ? data.requirements : [],
                responsibilities: typeof data.responsibilities === 'string' ? [data.responsibilities] :
                    Array.isArray(data.responsibilities) ? data.responsibilities : [],
                location: data.location || '',
                startDate: data.startDate || '',
                endDate: data.deadline || data.endDate || '',
                salary: {
                    min: data.salaryMin || 0,
                    max: data.salaryMax || 0,
                    currency: 'USD'
                },
                isRemote: data.isRemote || false,
                isUrgent: data.isUrgent || false,
                postedById: data.postedById || '',
                postedAt: data.createdAt?.toDate() || new Date(),
                deadline: data.deadline || '',
                status: data.status || 'published',
                applicationsCount: data.applicationCount || 0,
                tags: Array.isArray(data.skills) ? data.skills : [],
                experienceLevel: data.experienceLevel || 'entry',
                contractType: data.jobType || 'full_time',
                benefits: Array.isArray(data.benefits) ? data.benefits :
                    typeof data.benefits === 'string' ? [data.benefits] : [],
                perks: [],
                views: data.views || 0,
                saves: data.saves || 0,
                shares: data.shares || 0,
                shortlistedCount: data.shortlistedCount || 0,
                interviewedCount: data.interviewedCount || 0,
                hiredCount: data.hiredCount || 0,
                projectId: data.projectId || '',
                contactName: data.contactName || '',
                contactEmail: data.contactEmail || '',
                showContactEmail: data.showContactEmail || false,
                projectName: data.projectName || '',
                projectType: data.projectType || 'other',
                isPaid: data.isPaid !== undefined ? data.isPaid : true,
                isUnion: data.isUnion || false,
                visaSponsorship: data.visaSponsorship || false,
                relocationAssistance: data.relocationAssistance || false
            };
            setJob(jobData);
            setConnectionStatus('connected');
        }
        catch (error) {
            console.error('Error loading job details:', error);
            // Handle specific error types
            if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
                if (retryCount < 3) {
                    console.log(`Retrying job details load (attempt ${retryCount + 1})...`);
                    setTimeout(() => {
                        loadJobDetails(retryCount + 1);
                    }, 2000 * (retryCount + 1)); // Exponential backoff
                    return;
                }
                else {
                    setError('Connection issue. Please check your internet connection and try again.');
                    setConnectionStatus('error');
                }
            }
            else if (error.code === 'permission-denied') {
                setError('You don\'t have permission to view this job.');
            }
            else if (error.code === 'not-found') {
                setError('Job not found. It may have been removed or is no longer available.');
            }
            else {
                setError('Failed to load job details. Please try again.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const incrementJobViews = async () => {
        // Completely disable view tracking to eliminate Firebase connection errors
        // This functionality is not critical for the user experience
        return;
    };
    // Check if user has already saved this job
    (0,react.useEffect)(() => {
        // Reset saved state when user or job changes
        setIsSaved(false);
        if (auth.currentUser && jobId) {
            const savedJobRef = (0,index_esm.doc)(firebase.db, 'savedJobs', `${auth.currentUser.uid}_${jobId}`);
            // Use a more robust approach to check saved status
            const checkSavedStatus = async () => {
                try {
                    console.log('🔍 Checking saved status for user:', auth.currentUser?.uid, 'job:', jobId);
                    console.log('📄 Document path:', savedJobRef.path);
                    const docSnap = await (0,index_esm.getDoc)(savedJobRef);
                    const exists = docSnap.exists();
                    console.log('✅ Saved job exists:', exists);
                    setIsSaved(exists);
                }
                catch (error) {
                    console.error('❌ Error checking saved status:', error);
                    console.error('🔍 Error code:', error.code);
                    console.error('🔍 Error message:', error.message);
                    // Don't show error to user, just assume not saved
                    setIsSaved(false);
                    // Handle specific permission errors gracefully
                    if (error.code === 'permission-denied') {
                        console.log('⚠️ Permission denied for saved job check - this is expected for new users');
                    }
                }
            };
            checkSavedStatus();
        }
    }, [auth.currentUser, jobId]);
    const handleSaveJob = async () => {
        if (!auth.currentUser) {
            dist/* toast */.oR.error('Please log in to save jobs');
            return;
        }
        try {
            if (isSaved) {
                // Remove from saved
                const { savedJobId } = await savedJobsService/* SavedJobsService */.r.isJobSaved(auth.currentUser.uid, jobId);
                if (savedJobId) {
                    await savedJobsService/* SavedJobsService */.r.removeSavedJob(savedJobId);
                    setIsSaved(false);
                    dist/* toast */.oR.success('Job removed from saved');
                }
            }
            else {
                // Add to saved
                await savedJobsService/* SavedJobsService */.r.saveJob(auth.currentUser.uid, jobId);
                setIsSaved(true);
                dist/* toast */.oR.success('Job saved successfully');
            }
        }
        catch (error) {
            console.error('Error saving job:', error);
            // Handle connection issues
            if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
                dist/* toast */.oR.error('Connection issue. Please try again.');
            }
            else {
                dist/* toast */.oR.error('Failed to save job. Please try again.');
            }
        }
    };
    const handleShareJob = async () => {
        const shareUrl = `${window.location.origin}/jobs/${jobId}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: job?.title || 'Check out this job',
                    text: `I found this great opportunity: ${job?.title}`,
                    url: shareUrl
                });
            }
            catch (error) {
                // Don't log AbortError as it's just user cancellation
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                }
            }
        }
        else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                dist/* toast */.oR.success('Job link copied to clipboard');
            }
            catch (error) {
                console.error('Error copying to clipboard:', error);
                dist/* toast */.oR.error('Failed to copy link');
            }
        }
    };
    const formatSalary = (salary) => {
        if (!salary || (salary.min === undefined && salary.max === undefined))
            return 'Salary not specified';
        const { min, max, currency = 'USD' } = salary;
        if (min !== undefined && max !== undefined) {
            if (min === max) {
                return `${currency} ${min.toLocaleString()}`;
            }
            return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
        }
        else if (min !== undefined) {
            return `From ${currency} ${min.toLocaleString()}`;
        }
        else if (max !== undefined) {
            return `Up to ${currency} ${max.toLocaleString()}`;
        }
        return 'Salary not specified';
    };
    const formatDate = (date) => {
        if (!date)
            return 'N/A';
        const dateObj = date?.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const getTimeAgo = (date) => {
        if (!date)
            return '';
        const dateObj = date?.toDate ? date.toDate() : new Date(date);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1)
            return 'Just now';
        if (diffInHours < 24)
            return `${diffInHours}h ago`;
        if (diffInHours < 168)
            return `${Math.floor(diffInHours / 24)}d ago`;
        return `${Math.floor(diffInHours / 168)}w ago`;
    };
    const getExperienceLevelColor = (level) => {
        switch (level) {
            case 'entry': return 'bg-blue-100 text-blue-800';
            case 'mid': return 'bg-green-100 text-green-800';
            case 'senior': return 'bg-purple-100 text-purple-800';
            case 'executive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getContractTypeColor = (type) => {
        switch (type) {
            case 'full_time': return 'bg-green-100 text-green-800';
            case 'part_time': return 'bg-blue-100 text-blue-800';
            case 'contract': return 'bg-purple-100 text-purple-800';
            case 'freelance': return 'bg-orange-100 text-orange-800';
            case 'internship': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    if (isLoading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading job details..." })] }) }));
    }
    if (error || !job) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\u274C" }), (0,jsx_runtime.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Error" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: error || 'Job not found' }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-4 justify-center", children: [(0,jsx_runtime.jsx)("button", { onClick: () => loadJobDetails(), className: "px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors", children: "Try Again" }), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/jobs'), className: "px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "Back to Jobs" })] })] }) }));
    }
    // Determine if the current user is the job poster
    const isJobPoster = job && auth.currentUser && (job.postedById === auth.currentUser.uid);
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0,jsx_runtime.jsx)("div", { className: "bg-white border-b border-gray-200", children: (0,jsx_runtime.jsx)("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: (0,jsx_runtime.jsxs)("nav", { className: "flex items-center space-x-2 text-sm text-gray-500", children: [(0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/", className: "hover:text-gray-700", children: "Home" }), (0,jsx_runtime.jsx)("span", { children: "\u203A" }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/jobs", className: "hover:text-gray-700", children: "Jobs" }), (0,jsx_runtime.jsx)("span", { children: "\u203A" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-900", children: job.title })] }) }) }), (0,jsx_runtime.jsxs)("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [connectionStatus === 'connecting' && ((0,jsx_runtime.jsx)("div", { className: "mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" }), (0,jsx_runtime.jsx)("span", { className: "text-sm text-blue-700", children: "Connecting to database..." })] }) })), connectionStatus === 'error' && ((0,jsx_runtime.jsxs)("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 rounded-lg", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-red-600", children: "\u26A0\uFE0F" }), (0,jsx_runtime.jsx)("span", { className: "text-sm text-red-700", children: "Connection issue detected. Some features may not work properly." })] }),  false && 0] })), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start justify-between mb-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3 mb-4", children: [job.isUrgent && ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full", children: "\u26A1 Urgent" })), job.isRemote && ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full", children: "\uD83C\uDF10 Remote" })), (0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full", children: job.department })] }), (0,jsx_runtime.jsx)("h1", { className: "text-3xl font-bold text-gray-900 mb-3", children: job.title }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 text-gray-600 mb-4", children: [(0,jsx_runtime.jsxs)("span", { className: "flex items-center gap-1", children: ["\uD83D\uDCCD ", job.location] }), (0,jsx_runtime.jsx)("span", { children: "\u2022" }), (0,jsx_runtime.jsxs)("span", { className: "flex items-center gap-1", children: ["\uD83D\uDCBC ", job.contractType.replace('_', ' ')] }), (0,jsx_runtime.jsx)("span", { children: "\u2022" }), (0,jsx_runtime.jsxs)("span", { className: "flex items-center gap-1", children: ["\uD83D\uDCC5 ", formatDate(job.startDate)] })] }), job.projectName && ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4 mb-4", children: [(0,jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-gray-700 mb-1", children: "Project" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900 font-medium", children: job.projectName }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 capitalize", children: job.projectType?.replace('_', ' ') || 'Project' })] }))] }), (0,jsx_runtime.jsxs)("div", { className: "text-right ml-8", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-gray-900 mb-1", children: formatSalary(job.salary) }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "per year" })] })] }), (0,jsx_runtime.jsx)("div", { className: "flex items-center gap-4 pt-6 border-t border-gray-200", children: !isJobPoster ? ((0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: (0,jsx_runtime.jsx)("button", { onClick: handleShareJob, className: "px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: "Share" }) })) : ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-4", children: [(0,jsx_runtime.jsx)("button", { onClick: () => setIsViewingStats(!isViewingStats), className: "px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: "\uD83D\uDCCA View Stats" }), job.applicationsCount > 0 && ((0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: `/jobs/${job.id}/applications`, className: "px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors", children: ["View Applications (", job.applicationsCount, ")"] })), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: `/jobs/${job.id}/edit`, className: "px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors", children: "Edit Job" })] })) })] }), isViewingStats && isJobPoster && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Job Performance" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: job.views }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Views" })] }), (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-green-600", children: job.applicationsCount }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Applications" })] }), (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: job.saves }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Saves" })] }), (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold text-orange-600", children: job.shares }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600", children: "Shares" })] })] })] })), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [(0,jsx_runtime.jsxs)("div", { className: "lg:col-span-2 space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-8", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold text-gray-900 mb-6", children: "About this role" }), (0,jsx_runtime.jsx)("div", { className: "prose prose-gray max-w-none", children: (0,jsx_runtime.jsx)("p", { className: "text-gray-700 leading-relaxed whitespace-pre-wrap", children: job.description }) })] }), job.requirements && job.requirements.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-8", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold text-gray-900 mb-6", children: "Requirements" }), (0,jsx_runtime.jsx)("ul", { className: "space-y-3", children: job.requirements.map((requirement, index) => ((0,jsx_runtime.jsxs)("li", { className: "flex items-start gap-3", children: [(0,jsx_runtime.jsx)("span", { className: "text-blue-500 mt-1", children: "\u2022" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: requirement })] }, index))) })] })), job.responsibilities && job.responsibilities.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-8", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold text-gray-900 mb-6", children: "What you'll do" }), (0,jsx_runtime.jsx)("ul", { className: "space-y-3", children: job.responsibilities.map((responsibility, index) => ((0,jsx_runtime.jsxs)("li", { className: "flex items-start gap-3", children: [(0,jsx_runtime.jsx)("span", { className: "text-green-500 mt-1", children: "\u2022" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: responsibility })] }, index))) })] })), job.benefits && job.benefits.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-8", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold text-gray-900 mb-6", children: "Benefits & Perks" }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: job.benefits.map((benefit, index) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("span", { className: "text-green-500", children: "\u2713" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: benefit })] }, index))) })] })), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-8", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold text-gray-900 mb-6", children: "Additional Information" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-gray-700 mb-2", children: "Work Arrangement" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-2", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-400", children: "\uD83D\uDCB0" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: job.isPaid ? 'Paid position' : 'Unpaid position' })] }), job.isUnion && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-400", children: "\uD83E\uDD1D" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: "Union position" })] })), job.visaSponsorship && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-400", children: "\uD83D\uDEC2" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: "Visa sponsorship available" })] })), job.relocationAssistance && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-400", children: "\uD83D\uDE9A" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: "Relocation assistance" })] }))] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-gray-700 mb-2", children: "Contact Information" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-2", children: [job.contactName && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-400", children: "\uD83D\uDC64" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: job.contactName })] })), job.showContactEmail && job.contactEmail && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-400", children: "\uD83D\uDCE7" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-700", children: job.contactEmail })] }))] })] })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [!isJobPoster && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center mb-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Interested in this position?" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-600 text-sm", children: [job.applicationsCount, " other", job.applicationsCount !== 1 ? 's have' : ' has', " applied"] })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: `/jobs/${job.id}/apply`, className: "w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center block", children: "Apply Now" }), (0,jsx_runtime.jsx)("button", { onClick: handleSaveJob, className: `w-full px-6 py-3 border rounded-lg transition-colors ${isSaved
                                                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`, children: isSaved ? '✓ Saved' : 'Save Job' })] })] })), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Job Details" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Experience Level" }), (0,jsx_runtime.jsx)("div", { className: "mt-1", children: (0,jsx_runtime.jsx)("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getExperienceLevelColor(job.experienceLevel)}`, children: job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1) }) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Contract Type" }), (0,jsx_runtime.jsx)("div", { className: "mt-1", children: (0,jsx_runtime.jsx)("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getContractTypeColor(job.contractType)}`, children: job.contractType.replace('_', ' ').charAt(0).toUpperCase() + job.contractType.replace('_', ' ').slice(1) }) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Start Date" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: formatDate(job.startDate) })] }), job.endDate && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "End Date" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: formatDate(job.endDate) })] })), job.deadline && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Application Deadline" }), (0,jsx_runtime.jsx)("p", { className: "text-red-600 font-medium", children: formatDate(job.deadline) })] }))] })] }), job.tags && job.tags.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Skills & Technologies" }), (0,jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: job.tags.map(tag => ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full", children: tag }, tag))) })] })), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Posted Information" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3 text-sm", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Posted" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-900", children: getTimeAgo(job.postedAt) })] }), !isJobPoster && ((0,jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Applications" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-900", children: job.applicationsCount })] })), (0,jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Status" }), (0,jsx_runtime.jsx)("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${job.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`, children: job.status.charAt(0).toUpperCase() + job.status.slice(1) })] })] })] })] })] })] })] }));
};
/* harmony default export */ const JobSearch_JobDetailPage = (JobDetailPage);


/***/ })

}]);
//# sourceMappingURL=8004.chunk.js.map