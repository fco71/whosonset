"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[269],{

/***/ 7269:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9487);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5788);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(888);
/* harmony import */ var _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6093);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2584);








const JobPosterDashboard = () => {
    const { currentUser } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_6__/* .useAuth */ .A)();
    const [postedJobs, setPostedJobs] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [stats, setStats] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        avgApplicationsPerJob: 0,
        totalViews: 0
    });
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('overview');
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (currentUser) {
            loadPostedJobs();
        }
    }, [currentUser]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        calculateStats();
    }, [postedJobs]);
    const loadPostedJobs = async () => {
        if (!currentUser)
            return;
        setIsLoading(true);
        try {
            // Get jobs posted by current user
            const jobsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_3__.db, 'jobPostings'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .where */ ._M)('postedBy', '==', currentUser.uid), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .orderBy */ .My)('postedAt', 'desc'));
            const jobsSnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .getDocs */ .GG)(jobsQuery);
            const jobsData = [];
            // For each job, get the applications
            for (const jobDoc of jobsSnapshot.docs) {
                const jobData = {
                    id: jobDoc.id,
                    ...jobDoc.data()
                };
                // Get applications for this job
                const applications = await _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_5__/* .JobApplicationService */ .l.getJobApplications(jobDoc.id);
                jobsData.push({
                    ...jobData,
                    applications,
                    applicantCount: applications.length
                });
            }
            setPostedJobs(jobsData);
            console.log('Loaded posted jobs:', jobsData.length);
        }
        catch (error) {
            console.error('Error loading posted jobs:', error);
            react_hot_toast__WEBPACK_IMPORTED_MODULE_4__/* .toast */ .oR.error('Failed to load posted jobs');
        }
        finally {
            setIsLoading(false);
        }
    };
    const calculateStats = () => {
        const totalJobs = postedJobs.length;
        const activeJobs = postedJobs.filter(job => job.status === 'active' || job.status === 'published').length;
        const totalApplications = postedJobs.reduce((sum, job) => sum + job.applicantCount, 0);
        const pendingApplications = postedJobs.reduce((sum, job) => sum + job.applications.filter(app => app.status === 'pending').length, 0);
        const avgApplicationsPerJob = totalJobs > 0 ? totalApplications / totalJobs : 0;
        const totalViews = postedJobs.reduce((sum, job) => sum + (job.views || 0), 0);
        setStats({
            totalJobs,
            activeJobs,
            totalApplications,
            pendingApplications,
            avgApplicationsPerJob,
            totalViews
        });
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'closed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
            case 'published': return '✅';
            case 'draft': return '📝';
            case 'closed': return '🔒';
            default: return '📋';
        }
    };
    const formatDate = (date) => {
        if (!date)
            return 'N/A';
        const dateObj = date?.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString();
    };
    const renderOverview = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Total Jobs Posted" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-3xl font-light text-gray-900", children: stats.totalJobs })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\uD83D\uDCBC" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Active Jobs" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-3xl font-light text-gray-900", children: stats.activeJobs })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\uD83D\uDCCA" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Total Applications" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-3xl font-light text-gray-900", children: stats.totalApplications })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\uD83D\uDCDD" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Pending Applications" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-3xl font-light text-gray-900", children: stats.pendingApplications })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\u23F3" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Avg Applications/Job" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-3xl font-light text-gray-900", children: stats.avgApplicationsPerJob.toFixed(1) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\uD83D\uDCC8" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Total Views" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-3xl font-light text-gray-900", children: stats.totalViews })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\uD83D\uDC41\uFE0F" })] }) })] }));
    const renderPostedJobs = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "p-6 border-b border-gray-100 flex justify-between items-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900", children: "Your Posted Jobs" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: "/jobs/post", className: "px-4 py-2 bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors", children: "Post New Job" })] }), postedJobs.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDCBC" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "No jobs posted yet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mb-4", children: "Start posting jobs to see them here and track applications." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: "/jobs/post", className: "px-6 py-3 bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors", children: "Post Your First Job" })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "divide-y divide-gray-100", children: postedJobs.map((job) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6 hover:bg-gray-50 transition-colors duration-200", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/jobs/${job.id}`, className: "text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors", children: job.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`, children: [getStatusIcon(job.status), " ", job.status.replace('_', ' ')] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-gray-600 mb-1", children: [job.department, " \u2022 ", job.location] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500", children: ["Posted on ", formatDate(job.postedAt)] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-right", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500", children: "Applications" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-light text-gray-900", children: job.applicantCount })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500", children: "Views" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-lg font-light text-gray-900", children: job.views || 0 })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/jobs/${job.id}`, className: "px-4 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "View Job" }), job.applicantCount > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/jobs/${job.id}/applications`, className: "px-4 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors", children: ["View Applications (", job.applicantCount, ")"] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/jobs/${job.id}/edit`, className: "px-4 py-2 text-sm bg-green-600 text-white font-light rounded-lg hover:bg-green-700 transition-colors", children: "Edit" })] })] })] }) }, job.id))) }))] }));
    const renderApplications = () => {
        // Get all applications from all jobs
        const allApplications = postedJobs.flatMap(job => job.applications.map(app => ({ ...app, jobTitle: job.title, jobId: job.id })));
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6 border-b border-gray-100", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900", children: "All Applications" }) }), allApplications.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDCDD" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "No applications yet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "Applications from your job postings will appear here." })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "divide-y divide-gray-100", children: allApplications.slice(0, 20).map((application) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6 hover:bg-gray-50 transition-colors duration-200", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/applications/${application.id}`, className: "text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors", children: application.jobTitle }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`, children: [getStatusIcon(application.status), " ", application.status.replace('_', ' ')] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-gray-600 mb-1", children: ["Applicant: ", application.applicantId.slice(0, 8), "..."] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500", children: ["Applied on ", formatDate(application.appliedAt)] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-right", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/applications/${application.id}`, className: "px-4 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "View Application" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/jobs/${application.jobId}`, className: "px-4 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors", children: "View Job" })] }) })] }) }, application.id))) }))] }));
    };
    const renderAnalytics = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-6", children: "Job Performance" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-4", children: postedJobs.slice(0, 5).map((job) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-medium text-gray-900 truncate", children: job.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xs text-gray-500", children: job.department })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-right", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm font-medium text-gray-900", children: [job.applicantCount, " apps"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-xs text-gray-500", children: [job.views || 0, " views"] })] })] }, job.id))) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-6", children: "Application Status" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-4", children: postedJobs.map((job) => {
                            const pending = job.applications.filter(app => app.status === 'pending').length;
                            const reviewed = job.applications.filter(app => app.status === 'reviewed').length;
                            const shortlisted = job.applications.filter(app => app.status === 'shortlisted').length;
                            const hired = job.applications.filter(app => app.status === 'hired').length;
                            return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "border-b border-gray-100 pb-4 last:border-b-0", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-medium text-gray-900 mb-2", children: job.title }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-4 text-xs", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-yellow-600", children: ["\u23F3 ", pending, " pending"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-blue-600", children: ["\uD83D\uDC41\uFE0F ", reviewed, " reviewed"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-green-600", children: ["\u2B50 ", shortlisted, " shortlisted"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-purple-600", children: ["\u2705 ", hired, " hired"] })] })] }, job.id));
                        }) })] })] }));
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-7xl mx-auto px-8 py-16", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center mb-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-4xl font-light text-gray-900 mb-4 tracking-tight", children: "Job Poster Dashboard" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed", children: "Manage your job postings, track applications, and analyze performance." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex space-x-2", children: [
                            { id: 'overview', label: 'Overview', icon: '📊' },
                            { id: 'jobs', label: 'Posted Jobs', icon: '💼' },
                            { id: 'applications', label: 'Applications', icon: '📝' },
                            { id: 'analytics', label: 'Analytics', icon: '📈' }
                        ].map((tab) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setActiveTab(tab.id), className: `flex-1 py-3 px-4 rounded-lg font-light transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "mr-2", children: tab.icon }), tab.label] }, tab.id))) }) }), isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading dashboard..." })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [activeTab === 'overview' && renderOverview(), activeTab === 'jobs' && renderPostedJobs(), activeTab === 'applications' && renderApplications(), activeTab === 'analytics' && renderAnalytics()] }))] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JobPosterDashboard);


/***/ })

}]);
//# sourceMappingURL=269.chunk.js.map