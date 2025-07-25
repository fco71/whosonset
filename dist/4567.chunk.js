"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[4567],{

/***/ 4567:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_ApplicationDetailPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/message-square.js
var message_square = __webpack_require__(7504);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/eye.js
var eye = __webpack_require__(3160);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/download.js
var download = __webpack_require__(8309);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/paperclip.js
var paperclip = __webpack_require__(8117);
// EXTERNAL MODULE: ./src/components/JobSearch/ApplicationMessaging.tsx
var ApplicationMessaging = __webpack_require__(3797);
// EXTERNAL MODULE: ./src/utilities/fileUploadService.ts
var fileUploadService = __webpack_require__(3549);
;// ./src/components/JobSearch/ApplicationStatusTracker.tsx










const ApplicationStatusTracker = ({ applicationId }) => {
    const navigate = (0,chunk_QMGIS6GS/* useNavigate */.Zp)();
    const { applicationId: urlApplicationId } = (0,chunk_QMGIS6GS/* useParams */.g)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [application, setApplication] = (0,react.useState)(null);
    const [job, setJob] = (0,react.useState)(null); // Changed to any for now as JobPosting type is removed
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    const [showMessaging, setShowMessaging] = (0,react.useState)(false);
    (0,react.useEffect)(() => {
        if (applicationId) {
            loadApplicationDetails();
        }
    }, [applicationId]);
    const loadApplicationDetails = async () => {
        try {
            setIsLoading(true);
            // Load application details
            const applicationDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'jobApplications', applicationId));
            if (applicationDoc.exists()) {
                const applicationData = {
                    id: applicationDoc.id,
                    ...applicationDoc.data()
                };
                setApplication(applicationData);
                // Load job details
                const jobDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'jobPostings', applicationData.jobId));
                if (jobDoc.exists()) {
                    setJob({
                        id: jobDoc.id,
                        ...jobDoc.data()
                    }); // Changed to any for now
                }
            }
        }
        catch (error) {
            console.error('Error loading application details:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const getStatusTimeline = () => {
        if (!application)
            return [];
        const timeline = [
            {
                status: 'Application Submitted',
                date: application.appliedAt,
                icon: '📝',
                color: 'bg-blue-500',
                completed: true
            }
        ];
        if (application.reviewedAt) {
            timeline.push({
                status: 'Application Reviewed',
                date: application.reviewedAt,
                icon: '👁️',
                color: 'bg-green-500',
                completed: true
            });
        }
        if (application.status === 'shortlisted') {
            timeline.push({
                status: 'Shortlisted',
                date: application.lastUpdated,
                icon: '⭐',
                color: 'bg-yellow-500',
                completed: true
            });
        }
        if (application.status === 'interviewed') {
            timeline.push({
                status: 'Interview Scheduled',
                date: application.interviewScheduled,
                icon: '📅',
                color: 'bg-purple-500',
                completed: true
            });
        }
        if (application.status === 'hired') {
            timeline.push({
                status: 'Hired',
                date: application.lastUpdated,
                icon: '✅',
                color: 'bg-green-600',
                completed: true
            });
        }
        if (application.status === 'rejected') {
            timeline.push({
                status: 'Application Rejected',
                date: application.lastUpdated,
                icon: '❌',
                color: 'bg-red-500',
                completed: true
            });
        }
        return timeline;
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'shortlisted': return 'bg-green-100 text-green-800';
            case 'interviewed': return 'bg-purple-100 text-purple-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatDate = (date) => {
        if (!date)
            return 'N/A';
        const dateObj = date?.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const formatFileSize = (bytes) => {
        return fileUploadService/* FileUploadService */.P.formatFileSize(bytes);
    };
    const getFileIcon = (fileName) => {
        return fileUploadService/* FileUploadService */.P.getFileIcon(fileName);
    };
    const handleDownloadFile = (url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleViewFile = (url) => {
        window.open(url, '_blank');
    };
    if (isLoading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading application details..." })] }) }));
    }
    if (!application || !job) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\u274C" }), (0,jsx_runtime.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Application Not Found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "The application you're looking for doesn't exist." }), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/applications'), className: "px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "Back to Applications" })] }) }));
    }
    const timeline = getStatusTimeline();
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0,jsx_runtime.jsxs)("div", { className: "max-w-6xl mx-auto px-8 py-16", children: [(0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("button", { onClick: () => navigate('/applications'), className: "flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors", children: "\u2190 Back to Applications" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h1", { className: "text-3xl font-light text-gray-900 mb-2", children: "Application Status" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-600", children: [job.title, " \u2022 ", job.department] })] }), (0,jsx_runtime.jsx)("span", { className: `px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`, children: application.status.replace('_', ' ').toUpperCase() })] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [(0,jsx_runtime.jsxs)("div", { className: "lg:col-span-2 space-y-8", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-light text-gray-900 mb-6", children: "Application Timeline" }), (0,jsx_runtime.jsx)("div", { className: "space-y-6", children: timeline.map((item, index) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-start gap-4", children: [(0,jsx_runtime.jsx)("div", { className: `w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1`, children: item.icon }), (0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: item.status }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: formatDate(item.date) })] })] }, index))) })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(message_square/* default */.A, { className: "w-5 h-5 text-gray-600" }), (0,jsx_runtime.jsx)("h2", { className: "text-xl font-light text-gray-900", children: "Messages" })] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", onClick: () => setShowMessaging(true), children: [(0,jsx_runtime.jsx)(message_square/* default */.A, { className: "w-4 h-4 mr-2" }), "Open Chat"] })] }), (0,jsx_runtime.jsxs)("div", { className: "text-center py-8", children: [(0,jsx_runtime.jsx)(message_square/* default */.A, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "Messages are now in a dedicated chat interface" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500 mb-4", children: "Click \"Open Chat\" to start messaging" })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Application Summary" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Application ID" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900 font-mono text-sm", children: application.id.slice(-8) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Submitted" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: formatDate(application.appliedAt) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Last Updated" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: formatDate(application.lastUpdated) })] }), application.expectedSalary && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Expected Salary" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-900", children: ["$", application.expectedSalary.toLocaleString()] })] })), application.availabilityDate && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Available From" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: application.availabilityDate })] }))] })] }), (application.attachments && application.attachments.length > 0) && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Uploaded Documents" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [application.attachments?.find(att => att.type === 'resume') && ((0,jsx_runtime.jsx)("div", { className: "p-3 bg-blue-50 rounded-lg border border-blue-200", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("span", { className: "text-2xl", children: "\uD83D\uDCC4" }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Resume" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Submitted with application" })] })] }), (0,jsx_runtime.jsx)("div", { className: "flex gap-2", children: (() => {
                                                                        const resumeAttachment = application.attachments?.find(att => att.type === 'resume');
                                                                        return resumeAttachment ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleViewFile(resumeAttachment.url), className: "p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors", title: "View Resume", children: (0,jsx_runtime.jsx)(eye/* default */.A, { className: "w-4 h-4" }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDownloadFile(resumeAttachment.url, resumeAttachment.name), className: "p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors", title: "Download Resume", children: (0,jsx_runtime.jsx)(download/* default */.A, { className: "w-4 h-4" }) })] })) : null;
                                                                    })() })] }) })), application.attachments?.filter(att => att.type !== 'resume').length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "space-y-2", children: [(0,jsx_runtime.jsxs)("p", { className: "text-sm font-medium text-gray-700 mb-2", children: ["Additional Documents (", application.attachments?.filter(att => att.type !== 'resume').length || 0, ")"] }), application.attachments?.filter(att => att.type !== 'resume').map((attachment, index) => ((0,jsx_runtime.jsx)("div", { className: "p-3 bg-gray-50 rounded-lg border border-gray-200", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("span", { className: "text-xl", children: getFileIcon(attachment.name) }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900 text-sm", children: attachment.name }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-600", children: formatFileSize(attachment.size) })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleViewFile(attachment.url), className: "p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", title: "View Document", children: (0,jsx_runtime.jsx)(eye/* default */.A, { className: "w-4 h-4" }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDownloadFile(attachment.url, attachment.name), className: "p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", title: "Download Document", children: (0,jsx_runtime.jsx)(download/* default */.A, { className: "w-4 h-4" }) })] })] }) }, attachment.id)))] })), (!application.attachments || application.attachments.length === 0) && ((0,jsx_runtime.jsxs)("div", { className: "text-center py-4 text-gray-500", children: [(0,jsx_runtime.jsx)(paperclip/* default */.A, { className: "w-8 h-8 mx-auto mb-2 text-gray-300" }), (0,jsx_runtime.jsx)("p", { className: "text-sm", children: "No documents uploaded" })] }))] })] })), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Job Details" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Position" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: job.title })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Department" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: job.department })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Location" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: job.location })] }), job.salary && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Salary Range" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-900", children: ["$", job.salary.min.toLocaleString(), " - $", job.salary.max.toLocaleString()] })] }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Actions" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsx)("button", { onClick: () => navigate(`/jobs/${job.id}`), className: "w-full px-4 py-2 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors", children: "View Job Posting" }), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/applications'), className: "w-full px-4 py-2 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors", children: "All Applications" })] })] })] })] })] }), showMessaging && applicationId && ((0,jsx_runtime.jsx)(ApplicationMessaging/* default */.A, { applicationId: applicationId, isModal: true, onClose: () => setShowMessaging(false) }))] }));
};
/* harmony default export */ const JobSearch_ApplicationStatusTracker = (ApplicationStatusTracker);

;// ./src/pages/ApplicationDetailPage.tsx



const ApplicationDetailPage = () => {
    const { applicationId } = (0,chunk_QMGIS6GS/* useParams */.g)();
    if (!applicationId) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\u274C" }), (0,jsx_runtime.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Invalid Application" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Application ID is required." })] }) }));
    }
    return (0,jsx_runtime.jsx)(JobSearch_ApplicationStatusTracker, { applicationId: applicationId });
};
/* harmony default export */ const pages_ApplicationDetailPage = (ApplicationDetailPage);


/***/ })

}]);
//# sourceMappingURL=4567.chunk.js.map