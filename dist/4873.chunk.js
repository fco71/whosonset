"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[4873],{

/***/ 2864:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ChartColumn)
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
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("chart-column", __iconNode);


//# sourceMappingURL=chart-column.js.map


/***/ }),

/***/ 4180:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Award)
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
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
      key: "1yiouv"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6", key: "1vp47v" }]
];
const Award = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("award", __iconNode);


//# sourceMappingURL=award.js.map


/***/ }),

/***/ 4873:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ JobSearch_ApplicationAnalytics)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./src/utilities/jobApplicationService.ts
var jobApplicationService = __webpack_require__(6093);
// EXTERNAL MODULE: ./src/components/ui/Card.tsx
var Card = __webpack_require__(4948);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/clock.js
var clock = __webpack_require__(7235);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/activity.js
var activity = __webpack_require__(6844);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/target.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "6", key: "1vlfrh" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }]
];
const Target = (0,createLucideIcon/* default */.A)("target", __iconNode);


//# sourceMappingURL=target.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/chart-column.js
var chart_column = __webpack_require__(2864);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-check-big.js
var circle_check_big = __webpack_require__(4471);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-x.js
var circle_x = __webpack_require__(180);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/award.js
var award = __webpack_require__(4180);
;// ./node_modules/lucide-react/dist/esm/icons/clock-3.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const clock_3_iconNode = [
  ["path", { d: "M12 6v6h4", key: "135r8i" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Clock3 = (0,createLucideIcon/* default */.A)("clock-3", clock_3_iconNode);


//# sourceMappingURL=clock-3.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/trending-up.js
var trending_up = __webpack_require__(6316);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
;// ./src/components/JobSearch/ApplicationAnalytics.tsx








const ApplicationAnalytics = () => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [applications, setApplications] = (0,react.useState)([]);
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    const [timeRange, setTimeRange] = (0,react.useState)('90d');
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
                            }
                        };
                    }
                    return { application: app, job: null };
                }));
                setApplications(jobs);
            }
            catch (error) {
                console.error('Error fetching applications:', error);
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
    const analyticsData = (0,react.useMemo)(() => {
        if (applications.length === 0) {
            return {
                totalApplications: 0,
                successRate: 0,
                averageResponseTime: 0,
                statusBreakdown: {},
                monthlyTrends: [],
                topCompanies: [],
                topDepartments: [],
                responseTimeByStatus: {},
                conversionRates: {}
            };
        }
        // Filter by time range
        const now = new Date();
        const timeRangeDays = {
            '30d': 30,
            '90d': 90,
            '6m': 180,
            '1y': 365
        };
        const cutoffDate = new Date(now.getTime() - timeRangeDays[timeRange] * 24 * 60 * 60 * 1000);
        const filteredApplications = applications.filter(app => {
            const appliedDate = app.application.appliedAt?.toDate?.() || new Date(0);
            return appliedDate >= cutoffDate;
        });
        // Status breakdown
        const statusBreakdown = {};
        filteredApplications.forEach(app => {
            const status = app.application.status || 'pending';
            statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
        });
        // Success rate (hired / total)
        const totalApplications = filteredApplications.length;
        const hiredCount = statusBreakdown['hired'] || 0;
        const successRate = totalApplications > 0 ? (hiredCount / totalApplications) * 100 : 0;
        // Average response time
        const responseTimes = [];
        filteredApplications.forEach(app => {
            if (app.application.reviewedAt && app.application.appliedAt) {
                const appliedDate = app.application.appliedAt.toDate?.() || new Date(0);
                const reviewedDate = app.application.reviewedAt.toDate?.() || new Date(0);
                const responseTime = (reviewedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24); // days
                if (responseTime > 0) {
                    responseTimes.push(responseTime);
                }
            }
        });
        const averageResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
            : 0;
        // Monthly trends
        const monthlyData = {};
        filteredApplications.forEach(app => {
            const appliedDate = app.application.appliedAt?.toDate?.() || new Date(0);
            const monthKey = `${appliedDate.getFullYear()}-${String(appliedDate.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
        });
        const monthlyTrends = Object.entries(monthlyData)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));
        // Top companies
        const companyCounts = {};
        filteredApplications.forEach(app => {
            const company = app.job?.companyName || 'Unknown';
            companyCounts[company] = (companyCounts[company] || 0) + 1;
        });
        const topCompanies = Object.entries(companyCounts)
            .map(([company, count]) => ({ company, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        // Top departments
        const departmentCounts = {};
        filteredApplications.forEach(app => {
            const department = app.job?.department || 'Unknown';
            departmentCounts[department] = (departmentCounts[department] || 0) + 1;
        });
        const topDepartments = Object.entries(departmentCounts)
            .map(([department, count]) => ({ department, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        // Response time by status
        const responseTimeByStatus = {};
        const statusResponseTimes = {};
        filteredApplications.forEach(app => {
            const status = app.application.status || 'pending';
            if (app.application.reviewedAt && app.application.appliedAt) {
                const appliedDate = app.application.appliedAt.toDate?.() || new Date(0);
                const reviewedDate = app.application.reviewedAt.toDate?.() || new Date(0);
                const responseTime = (reviewedDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24);
                if (responseTime > 0) {
                    if (!statusResponseTimes[status])
                        statusResponseTimes[status] = [];
                    statusResponseTimes[status].push(responseTime);
                }
            }
        });
        Object.entries(statusResponseTimes).forEach(([status, times]) => {
            responseTimeByStatus[status] = times.reduce((sum, time) => sum + time, 0) / times.length;
        });
        // Conversion rates
        const conversionRates = {};
        const statusTransitions = {};
        filteredApplications.forEach(app => {
            const status = app.application.status || 'pending';
            statusTransitions[status] = (statusTransitions[status] || 0) + 1;
        });
        const total = Object.values(statusTransitions).reduce((sum, count) => sum + count, 0);
        Object.entries(statusTransitions).forEach(([status, count]) => {
            conversionRates[status] = total > 0 ? (count / total) * 100 : 0;
        });
        return {
            totalApplications,
            successRate,
            averageResponseTime,
            statusBreakdown,
            monthlyTrends,
            topCompanies,
            topDepartments,
            responseTimeByStatus,
            conversionRates
        };
    }, [applications, timeRange]);
    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-600',
            reviewed: 'text-blue-600',
            shortlisted: 'text-purple-600',
            interviewed: 'text-indigo-600',
            hired: 'text-green-600',
            rejected: 'text-red-600',
            withdrawn: 'text-gray-600'
        };
        return colors[status] || 'text-gray-600';
    };
    const getStatusIcon = (status) => {
        const icons = {
            pending: clock/* default */.A,
            reviewed: activity/* default */.A,
            shortlisted: Target,
            interviewed: chart_column/* default */.A,
            hired: circle_check_big/* default */.A,
            rejected: circle_x/* default */.A,
            withdrawn: circle_x/* default */.A
        };
        return icons[status] || clock/* default */.A;
    };
    if (isLoading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 py-12 px-4 md:px-8", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto", children: (0,jsx_runtime.jsxs)("div", { className: "text-center py-12", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading analytics..." })] }) }) }));
    }
    return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 py-12 px-4 md:px-8", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("h1", { className: "text-3xl font-light text-gray-900 mb-2", children: "Application Analytics" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Insights into your job application performance" })] }), (0,jsx_runtime.jsx)("div", { className: "mb-6", children: (0,jsx_runtime.jsx)("div", { className: "flex gap-2", children: ['30d', '90d', '6m', '1y'].map((range) => ((0,jsx_runtime.jsx)("button", { onClick: () => setTimeRange(range), className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`, children: range === '30d' ? '30 Days' :
                                range === '90d' ? '90 Days' :
                                    range === '6m' ? '6 Months' : '1 Year' }, range))) }) }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [(0,jsx_runtime.jsx)(Card/* default */.Ay, { variant: "elevated", children: (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { className: "p-6", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Total Applications" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: analyticsData.totalApplications })] }), (0,jsx_runtime.jsx)("div", { className: "p-3 bg-blue-100 rounded-full", children: (0,jsx_runtime.jsx)(chart_column/* default */.A, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0,jsx_runtime.jsx)(Card/* default */.Ay, { variant: "elevated", children: (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { className: "p-6", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Success Rate" }), (0,jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-gray-900", children: [analyticsData.successRate.toFixed(1), "%"] })] }), (0,jsx_runtime.jsx)("div", { className: "p-3 bg-green-100 rounded-full", children: (0,jsx_runtime.jsx)(award/* default */.A, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0,jsx_runtime.jsx)(Card/* default */.Ay, { variant: "elevated", children: (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { className: "p-6", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Avg Response Time" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: analyticsData.averageResponseTime > 0
                                                        ? `${analyticsData.averageResponseTime.toFixed(1)} days`
                                                        : 'N/A' })] }), (0,jsx_runtime.jsx)("div", { className: "p-3 bg-purple-100 rounded-full", children: (0,jsx_runtime.jsx)(Clock3, { className: "w-6 h-6 text-purple-600" }) })] }) }) }), (0,jsx_runtime.jsx)(Card/* default */.Ay, { variant: "elevated", children: (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { className: "p-6", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Active Applications" }), (0,jsx_runtime.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: (analyticsData.statusBreakdown['pending'] || 0) +
                                                        (analyticsData.statusBreakdown['reviewed'] || 0) +
                                                        (analyticsData.statusBreakdown['shortlisted'] || 0) +
                                                        (analyticsData.statusBreakdown['interviewed'] || 0) })] }), (0,jsx_runtime.jsx)("div", { className: "p-3 bg-yellow-100 rounded-full", children: (0,jsx_runtime.jsx)(activity/* default */.A, { className: "w-6 h-6 text-yellow-600" }) })] }) }) })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [(0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", children: [(0,jsx_runtime.jsx)(Card/* CardHeader */.aR, { children: (0,jsx_runtime.jsx)(Card/* CardTitle */.ZB, { children: "Application Status Breakdown" }) }), (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { children: (0,jsx_runtime.jsx)("div", { className: "space-y-4", children: Object.entries(analyticsData.statusBreakdown).map(([status, count]) => {
                                            const Icon = getStatusIcon(status);
                                            const percentage = analyticsData.totalApplications > 0
                                                ? (count / analyticsData.totalApplications) * 100
                                                : 0;
                                            return ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)(Icon, { className: `w-5 h-5 ${getStatusColor(status)}` }), (0,jsx_runtime.jsx)("span", { className: "font-medium capitalize", children: status })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("div", { className: "w-24 bg-gray-200 rounded-full h-2", children: (0,jsx_runtime.jsx)("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${percentage}%` } }) }), (0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-600 w-12 text-right", children: [count, " (", percentage.toFixed(1), "%)"] })] })] }, status));
                                        }) }) })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", children: [(0,jsx_runtime.jsx)(Card/* CardHeader */.aR, { children: (0,jsx_runtime.jsx)(Card/* CardTitle */.ZB, { children: "Monthly Application Trends" }) }), (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { children: (0,jsx_runtime.jsx)("div", { className: "space-y-3", children: analyticsData.monthlyTrends.map(({ month, count }) => {
                                            const [year, monthNum] = month.split('-');
                                            const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                                            return ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-600", children: monthName }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("div", { className: "w-20 bg-gray-200 rounded-full h-2", children: (0,jsx_runtime.jsx)("div", { className: "bg-green-600 h-2 rounded-full transition-all duration-300", style: {
                                                                        width: `${analyticsData.monthlyTrends.length > 0
                                                                            ? (count / Math.max(...analyticsData.monthlyTrends.map(m => m.count))) * 100
                                                                            : 0}%`
                                                                    } }) }), (0,jsx_runtime.jsx)("span", { className: "text-sm text-gray-600 w-8 text-right", children: count })] })] }, month));
                                        }) }) })] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [(0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", children: [(0,jsx_runtime.jsx)(Card/* CardHeader */.aR, { children: (0,jsx_runtime.jsx)(Card/* CardTitle */.ZB, { children: "Top Companies Applied To" }) }), (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { children: (0,jsx_runtime.jsx)("div", { className: "space-y-3", children: analyticsData.topCompanies.map(({ company, count }, index) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsxs)("span", { className: "text-sm font-medium text-gray-500 w-6", children: ["#", index + 1] }), (0,jsx_runtime.jsx)("span", { className: "font-medium", children: company })] }), (0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-600", children: [count, " applications"] })] }, company))) }) })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", children: [(0,jsx_runtime.jsx)(Card/* CardHeader */.aR, { children: (0,jsx_runtime.jsx)(Card/* CardTitle */.ZB, { children: "Top Departments" }) }), (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { children: (0,jsx_runtime.jsx)("div", { className: "space-y-3", children: analyticsData.topDepartments.map(({ department, count }, index) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsxs)("span", { className: "text-sm font-medium text-gray-500 w-6", children: ["#", index + 1] }), (0,jsx_runtime.jsx)("span", { className: "font-medium", children: department })] }), (0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-600", children: [count, " applications"] })] }, department))) }) })] })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", className: "mb-8", children: [(0,jsx_runtime.jsx)(Card/* CardHeader */.aR, { children: (0,jsx_runtime.jsx)(Card/* CardTitle */.ZB, { children: "Response Time by Status" }) }), (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { children: (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: Object.entries(analyticsData.responseTimeByStatus).map(([status, avgTime]) => ((0,jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-gray-50 rounded-lg", children: [(0,jsx_runtime.jsxs)("div", { className: `text-2xl font-bold ${getStatusColor(status)}`, children: [avgTime.toFixed(1), "d"] }), (0,jsx_runtime.jsx)("div", { className: "text-sm text-gray-600 capitalize", children: status })] }, status))) }) })] }), (0,jsx_runtime.jsxs)(Card/* default */.Ay, { variant: "elevated", children: [(0,jsx_runtime.jsx)(Card/* CardHeader */.aR, { children: (0,jsx_runtime.jsx)(Card/* CardTitle */.ZB, { children: "Key Insights" }) }), (0,jsx_runtime.jsx)(Card/* CardBody */.bw, { children: (0,jsx_runtime.jsxs)("div", { className: "space-y-4", children: [analyticsData.successRate > 0 && ((0,jsx_runtime.jsxs)("div", { className: "flex items-start gap-3 p-4 bg-green-50 rounded-lg", children: [(0,jsx_runtime.jsx)(circle_check_big/* default */.A, { className: "w-5 h-5 text-green-600 mt-0.5" }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-green-800", children: "Success Rate" }), (0,jsx_runtime.jsxs)("p", { className: "text-sm text-green-700", children: ["You have a ", analyticsData.successRate.toFixed(1), "% success rate in getting hired from your applications."] })] })] })), analyticsData.averageResponseTime > 0 && ((0,jsx_runtime.jsxs)("div", { className: "flex items-start gap-3 p-4 bg-blue-50 rounded-lg", children: [(0,jsx_runtime.jsx)(clock/* default */.A, { className: "w-5 h-5 text-blue-600 mt-0.5" }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-blue-800", children: "Response Time" }), (0,jsx_runtime.jsxs)("p", { className: "text-sm text-blue-700", children: ["Companies typically respond within ", analyticsData.averageResponseTime.toFixed(1), " days on average."] })] })] })), analyticsData.topCompanies.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "flex items-start gap-3 p-4 bg-purple-50 rounded-lg", children: [(0,jsx_runtime.jsx)(trending_up/* default */.A, { className: "w-5 h-5 text-purple-600 mt-0.5" }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-purple-800", children: "Top Company" }), (0,jsx_runtime.jsxs)("p", { className: "text-sm text-purple-700", children: ["You've applied most frequently to ", analyticsData.topCompanies[0]?.company, " (", analyticsData.topCompanies[0]?.count, " applications)."] })] })] }))] }) })] })] }) }));
};
/* harmony default export */ const JobSearch_ApplicationAnalytics = (ApplicationAnalytics);


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

/***/ 6316:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ TrendingUp)
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
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("trending-up", __iconNode);


//# sourceMappingURL=trending-up.js.map


/***/ }),

/***/ 6844:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Activity)
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
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("activity", __iconNode);


//# sourceMappingURL=activity.js.map


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


/***/ })

}]);
//# sourceMappingURL=4873.chunk.js.map