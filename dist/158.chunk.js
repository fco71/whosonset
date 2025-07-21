"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[158],{

/***/ 8158:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5788);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9487);
/* harmony import */ var _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6093);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2584);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(888);








const JobApplicationsPage = () => {
    const { jobId } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .useParams */ .g)();
    const { currentUser } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_5__/* .useAuth */ .A)();
    const [job, setJob] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [applications, setApplications] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('all');
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (jobId) {
            loadJobAndApplications();
        }
    }, [jobId]);
    const loadJobAndApplications = async () => {
        if (!jobId)
            return;
        setIsLoading(true);
        try {
            // Load job details
            const jobDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_3__.db, 'jobPostings', jobId));
            if (jobDoc.exists()) {
                const jobData = {
                    id: jobDoc.id,
                    ...jobDoc.data()
                };
                setJob(jobData);
                // Check if current user is the job poster
                if (jobData.postedBy !== currentUser?.uid) {
                    react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('You can only view applications for jobs you posted');
                    return;
                }
            }
            else {
                react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('Job not found');
                return;
            }
            // Load applications
            const jobApplications = await _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_4__/* .JobApplicationService */ .l.getJobApplications(jobId);
            setApplications(jobApplications);
        }
        catch (error) {
            console.error('Error loading job and applications:', error);
            react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('Failed to load applications');
        }
        finally {
            setIsLoading(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'shortlisted': return 'bg-green-100 text-green-800';
            case 'interviewed': return 'bg-purple-100 text-purple-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'withdrawn': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return '⏳';
            case 'reviewed': return '👁️';
            case 'shortlisted': return '⭐';
            case 'interviewed': return '📅';
            case 'hired': return '✅';
            case 'rejected': return '❌';
            case 'withdrawn': return '↩️';
            default: return '📋';
        }
    };
    const formatDate = (date) => {
        if (!date)
            return 'N/A';
        const dateObj = date?.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString();
    };
    const filteredApplications = applications.filter(app => {
        if (activeTab === 'all')
            return true;
        return app.status === activeTab;
    });
    const stats = {
        total: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        interviewed: applications.filter(app => app.status === 'interviewed').length,
        hired: applications.filter(app => app.status === 'hired').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
    };
    if (isLoading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "max-w-7xl mx-auto px-8 py-16", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading applications..." })] }) }) }));
    }
    if (!job) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "max-w-7xl mx-auto px-8 py-16", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "Job not found" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: "/jobs", className: "text-blue-600 hover:text-blue-700", children: "Back to Jobs" })] }) }) }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-7xl mx-auto px-8 py-16", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mb-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h1", { className: "text-4xl font-light text-gray-900 mb-2 tracking-tight", children: ["Applications for ", job.title] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-xl font-light text-gray-600", children: [job.department, " \u2022 ", job.location, " \u2022 ", applications.length, " applications"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/jobs/${job.id}`, className: "px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "View Job" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-light text-gray-900", children: stats.total }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Total" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-light text-yellow-600", children: stats.pending }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Pending" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-light text-blue-600", children: stats.reviewed }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Reviewed" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-light text-green-600", children: stats.shortlisted }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Shortlisted" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-light text-purple-600", children: stats.interviewed }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Interviewed" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-light text-green-600", children: stats.hired }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Hired" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-2xl font-light text-red-600", children: stats.rejected }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Rejected" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex space-x-2 overflow-x-auto", children: [
                            { id: 'all', label: 'All', count: stats.total },
                            { id: 'pending', label: 'Pending', count: stats.pending },
                            { id: 'reviewed', label: 'Reviewed', count: stats.reviewed },
                            { id: 'shortlisted', label: 'Shortlisted', count: stats.shortlisted },
                            { id: 'hired', label: 'Hired', count: stats.hired },
                            { id: 'rejected', label: 'Rejected', count: stats.rejected }
                        ].map((tab) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2 py-3 px-4 rounded-lg font-light transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: tab.label }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-600'}`, children: tab.count })] }, tab.id))) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", children: filteredApplications.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDCDD" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "No applications found" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: activeTab === 'all'
                                    ? 'No applications have been submitted for this job yet.'
                                    : `No ${activeTab} applications found.` })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "divide-y divide-gray-100", children: filteredApplications.map((application) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6 hover:bg-gray-50 transition-colors duration-200", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-lg font-medium text-gray-900", children: ["Applicant #", application.applicantId.slice(0, 8), "..."] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`, children: [getStatusIcon(application.status), " ", application.status.replace('_', ' ')] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-gray-600 mb-1", children: ["Applied on ", formatDate(application.appliedAt)] }), application.expectedSalary && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500", children: ["Expected salary: $", application.expectedSalary.toLocaleString()] })), application.availabilityDate && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500", children: ["Available from: ", application.availabilityDate] }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-right", children: [application.reviewedAt && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500 mb-2", children: ["Reviewed ", formatDate(application.reviewedAt)] })), application.interviewScheduled && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-blue-600 font-medium mb-2", children: ["Interview: ", formatDate(application.interviewScheduled)] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/applications/${application.id}`, className: "px-4 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "View Application" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_7__/* .Link */ .N_, { to: `/applications/${application.id}/edit`, className: "px-4 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors", children: "Update Status" })] })] })] }) }, application.id))) })) })] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JobApplicationsPage);


/***/ })

}]);
//# sourceMappingURL=158.chunk.js.map