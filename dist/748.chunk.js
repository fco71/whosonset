"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[748],{

/***/ 7748:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5788);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(888);
/* harmony import */ var _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6093);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2584);






const JobApplicationDashboard = () => {
    const { currentUser } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__/* .useAuth */ .A)();
    const [applications, setApplications] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [stats, setStats] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        interviewScheduled: 0,
        responseRate: 0,
        avgResponseTime: 0
    });
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('overview');
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        loadApplications();
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        calculateStats();
    }, [applications]);
    const loadApplications = async () => {
        if (!currentUser)
            return;
        setIsLoading(true);
        try {
            const userApplications = await _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_3__/* .JobApplicationService */ .l.getUserApplications(currentUser.uid);
            setApplications(userApplications);
            console.log('Loaded applications:', userApplications.length);
        }
        catch (error) {
            console.error('Error loading applications:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDeleteApplication = async (applicationId) => {
        if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
            return;
        }
        try {
            await _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_3__/* .JobApplicationService */ .l.deleteApplication(applicationId);
            react_hot_toast__WEBPACK_IMPORTED_MODULE_2__/* .toast */ .oR.success('Application withdrawn successfully');
            // Reload applications to update the list
            loadApplications();
        }
        catch (error) {
            console.error('Error deleting application:', error);
            react_hot_toast__WEBPACK_IMPORTED_MODULE_2__/* .toast */ .oR.error('Failed to withdraw application');
        }
    };
    const calculateStats = () => {
        const total = applications.length;
        const pending = applications.filter(app => app.status === 'pending').length;
        const reviewed = applications.filter(app => app.status === 'reviewed').length;
        const shortlisted = applications.filter(app => app.status === 'shortlisted').length;
        const interviewed = applications.filter(app => app.status === 'interviewed').length;
        const hired = applications.filter(app => app.status === 'hired').length;
        const rejected = applications.filter(app => app.status === 'rejected').length;
        const responseRate = total > 0 ? ((reviewed + shortlisted + interviewed + hired + rejected) / total) * 100 : 0;
        // Calculate average response time using reviewedAt
        const respondedApps = applications.filter(app => app.status !== 'pending' && app.reviewedAt && app.appliedAt);
        let avgResponseTime = 0;
        if (respondedApps.length > 0) {
            const totalDays = respondedApps.reduce((sum, app) => {
                const appliedDate = app.appliedAt?.toDate ? app.appliedAt.toDate() : new Date(app.appliedAt);
                const reviewedDate = app.reviewedAt?.toDate ? app.reviewedAt.toDate() : new Date(app.reviewedAt);
                return sum + (reviewedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24);
            }, 0);
            avgResponseTime = totalDays / respondedApps.length;
        }
        setStats({
            total,
            pending,
            accepted: hired, // Map hired to accepted for display
            rejected,
            interviewScheduled: interviewed,
            responseRate,
            avgResponseTime
        });
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
    const renderOverview = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Total Applications" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-3xl font-light text-gray-900", children: stats.total })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\uD83D\uDCCB" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Response Rate" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-3xl font-light text-gray-900", children: [stats.responseRate.toFixed(1), "%"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\uD83D\uDCCA" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Avg Response Time" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-3xl font-light text-gray-900", children: [stats.avgResponseTime.toFixed(1), " days"] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\u23F1\uFE0F" })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm font-light text-gray-600", children: "Interviews Scheduled" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-3xl font-light text-gray-900", children: stats.interviewScheduled })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl opacity-20", children: "\uD83D\uDCC5" })] }) })] }));
    const renderApplications = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6 border-b border-gray-100", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900", children: "Recent Applications" }) }), applications.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDCDD" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "No applications yet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "Start applying to jobs to track your progress here." })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "divide-y divide-gray-100", children: applications.slice(0, 10).map((application) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6 hover:bg-gray-50 transition-colors duration-200", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: `/applications/${application.id}`, className: "text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors", children: ["Job #", application.jobId.slice(-6)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`, children: [getStatusIcon(application.status), " ", application.status.replace('_', ' ')] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mb-1", children: application.projectId ? `Project #${application.projectId.slice(-6)}` : 'General Application' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500", children: ["Applied on ", formatDate(application.appliedAt)] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-right", children: [application.reviewedAt && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-500", children: ["Reviewed ", formatDate(application.reviewedAt)] })), application.interviewScheduled && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-blue-600 font-medium", children: ["Interview: ", formatDate(application.interviewScheduled)] })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2 mt-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: `/applications/${application.id}`, className: "px-4 py-2 text-sm bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "View Details" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: `/applications/${application.id}/edit`, className: "px-4 py-2 text-sm bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors", children: "Edit" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => handleDeleteApplication(application.id), className: "px-4 py-2 text-sm bg-red-600 text-white font-light rounded-lg hover:bg-red-700 transition-colors", children: "Withdraw" })] })] })] }) }, application.id))) }))] }));
    const renderAnalytics = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-6", children: "Application Status" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-600", children: "Pending" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-yellow-500 h-2 rounded-full", style: { width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` } }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-gray-900", children: stats.pending })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-600", children: "Accepted" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-green-500 h-2 rounded-full", style: { width: `${stats.total > 0 ? (stats.accepted / stats.total) * 100 : 0}%` } }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-gray-900", children: stats.accepted })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-600", children: "Rejected" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-red-500 h-2 rounded-full", style: { width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` } }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-gray-900", children: stats.rejected })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-600", children: "Interview Scheduled" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-purple-500 h-2 rounded-full", style: { width: `${stats.total > 0 ? (stats.interviewScheduled / stats.total) * 100 : 0}%` } }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-sm font-medium text-gray-900", children: stats.interviewScheduled })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-6", children: "Performance Metrics" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: "Response Rate" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-3xl font-light text-gray-900", children: [stats.responseRate.toFixed(1), "%"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-sm text-gray-500", children: stats.total > 0 ? `${stats.accepted + stats.rejected + stats.interviewScheduled} of ${stats.total} applications` : 'No applications yet' })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: "Average Response Time" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-3xl font-light text-gray-900", children: stats.avgResponseTime.toFixed(1) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-sm text-gray-500", children: "days" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-2", children: "Success Rate" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-3xl font-light text-gray-900", children: [stats.total > 0 ? ((stats.accepted + stats.interviewScheduled) / stats.total * 100).toFixed(1) : 0, "%"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-sm text-gray-500", children: stats.total > 0 ? `${stats.accepted + stats.interviewScheduled} positive outcomes` : 'No positive outcomes yet' })] })] })] })] })] }));
    const renderSavedJobs = () => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-6 border-b border-gray-100", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900", children: "Saved Jobs" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDCBE" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "Saved Jobs" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mb-4", children: "Save interesting job postings to apply later." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .N_, { to: "/jobs", className: "px-6 py-3 bg-blue-600 text-white font-light rounded-lg hover:bg-blue-700 transition-colors", children: "Browse Jobs" })] })] }));
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-7xl mx-auto px-8 py-16", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center mb-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-4xl font-light text-gray-900 mb-4 tracking-tight", children: "Application Dashboard" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed", children: "Track your job applications, view statistics, and manage your career progress." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex space-x-2", children: [
                            { id: 'overview', label: 'Overview', icon: '📊' },
                            { id: 'applications', label: 'Applications', icon: '📝' },
                            { id: 'analytics', label: 'Analytics', icon: '📈' },
                            { id: 'saved', label: 'Saved Jobs', icon: '💾' }
                        ].map((tab) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { onClick: () => setActiveTab(tab.id), className: `flex-1 py-3 px-4 rounded-lg font-light transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "mr-2", children: tab.icon }), tab.label] }, tab.id))) }) }), isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading dashboard..." })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [activeTab === 'overview' && renderOverview(), activeTab === 'applications' && renderApplications(), activeTab === 'analytics' && renderAnalytics(), activeTab === 'saved' && renderSavedJobs()] }))] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JobApplicationDashboard);


/***/ })

}]);
//# sourceMappingURL=748.chunk.js.map