"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[4567],{

/***/ 774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3490);
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
// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var dist = __webpack_require__(888);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/message-square.js
var message_square = __webpack_require__(7504);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/send.js
var send = __webpack_require__(7775);
;// ./src/components/JobSearch/ApplicationStatusTracker.tsx









const ApplicationStatusTracker = ({ applicationId }) => {
    const navigate = (0,chunk_QMGIS6GS/* useNavigate */.Zp)();
    const { applicationId: urlApplicationId } = (0,chunk_QMGIS6GS/* useParams */.g)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [application, setApplication] = (0,react.useState)(null);
    const [job, setJob] = (0,react.useState)(null); // Changed to any for now as JobPosting type is removed
    const [messages, setMessages] = (0,react.useState)([]); // Changed to any for now
    const [newMessage, setNewMessage] = (0,react.useState)('');
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    const [isSendingMessage, setIsSendingMessage] = (0,react.useState)(false);
    (0,react.useEffect)(() => {
        if (applicationId) {
            loadApplicationDetails();
            subscribeToMessages();
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
    const subscribeToMessages = () => {
        const messagesQuery = (0,index_esm/* collection */.rJ)(firebase.db, 'jobApplications', applicationId, 'messages');
        const unsubscribe = (0,index_esm/* onSnapshot */.aQ)(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })); // Changed to any for now
            setMessages(messagesData.sort((a, b) => (a.timestamp?.toDate?.() || new Date(a.timestamp)).getTime() -
                (b.timestamp?.toDate?.() || new Date(b.timestamp)).getTime()));
        });
        return unsubscribe;
    };
    const sendMessage = async () => {
        if (!newMessage.trim() || !application || !currentUser)
            return;
        try {
            setIsSendingMessage(true);
            const messageData = {
                senderId: currentUser.uid,
                senderName: currentUser.displayName || currentUser.email || 'Unknown User',
                message: newMessage.trim(),
                timestamp: (0,index_esm/* serverTimestamp */.O5)(),
                applicationId: applicationId
            };
            // Add message to the messages subcollection
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'jobApplications', applicationId, 'messages'), messageData);
            setNewMessage('');
            dist/* toast */.oR.success('Message sent successfully!');
        }
        catch (error) {
            console.error('Error sending message:', error);
            dist/* toast */.oR.error('Failed to send message. Please try again.');
        }
        finally {
            setIsSendingMessage(false);
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
    if (isLoading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading application details..." })] }) }));
    }
    if (!application || !job) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\u274C" }), (0,jsx_runtime.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Application Not Found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "The application you're looking for doesn't exist." }), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/applications'), className: "px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "Back to Applications" })] }) }));
    }
    const timeline = getStatusTimeline();
    return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-6xl mx-auto px-8 py-16", children: [(0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("button", { onClick: () => navigate('/applications'), className: "flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors", children: "\u2190 Back to Applications" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h1", { className: "text-3xl font-light text-gray-900 mb-2", children: "Application Status" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-600", children: [job.title, " \u2022 ", job.department] })] }), (0,jsx_runtime.jsx)("span", { className: `px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`, children: application.status.replace('_', ' ').toUpperCase() })] })] }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [(0,jsx_runtime.jsxs)("div", { className: "lg:col-span-2 space-y-8", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-light text-gray-900 mb-6", children: "Application Timeline" }), (0,jsx_runtime.jsx)("div", { className: "space-y-6", children: timeline.map((item, index) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-start gap-4", children: [(0,jsx_runtime.jsx)("div", { className: `w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1`, children: item.icon }), (0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: item.status }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: formatDate(item.date) })] })] }, index))) })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 mb-6", children: [(0,jsx_runtime.jsx)(message_square/* default */.A, { className: "w-5 h-5 text-gray-600" }), (0,jsx_runtime.jsx)("h2", { className: "text-xl font-light text-gray-900", children: "Messages" })] }), messages.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-8", children: [(0,jsx_runtime.jsx)(message_square/* default */.A, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "No messages yet" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Start a conversation about this application" })] })) : ((0,jsx_runtime.jsxs)("div", { className: "space-y-4", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto", children: (0,jsx_runtime.jsx)("div", { className: "space-y-3", children: messages.map(msg => ((0,jsx_runtime.jsx)("div", { className: `flex ${msg.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`, children: (0,jsx_runtime.jsxs)("div", { className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUser?.uid
                                                                    ? 'bg-blue-500 text-white'
                                                                    : 'bg-white text-gray-900 border border-gray-200'}`, children: [(0,jsx_runtime.jsxs)("div", { className: `text-xs mb-1 ${msg.senderId === currentUser?.uid ? 'text-blue-100' : 'text-gray-500'}`, children: [msg.senderName, " \u2022 ", msg.timestamp?.toDate ?
                                                                                new Date(msg.timestamp.seconds * 1000).toLocaleString() :
                                                                                new Date(msg.timestamp).toLocaleString()] }), (0,jsx_runtime.jsx)("div", { className: "text-sm", children: msg.message })] }) }, msg.id))) }) }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsx)("input", { type: "text", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all", placeholder: "Type a message...", value: newMessage, onChange: e => setNewMessage(e.target.value), onKeyDown: e => { if (e.key === 'Enter')
                                                                sendMessage(); }, disabled: isSendingMessage }), (0,jsx_runtime.jsx)(Button/* Button */.$, { onClick: sendMessage, disabled: isSendingMessage || !newMessage.trim(), className: "px-4 py-2", children: (0,jsx_runtime.jsx)(send/* default */.A, { className: "w-4 h-4" }) })] })] }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Application Summary" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Application ID" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900 font-mono text-sm", children: application.id.slice(-8) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Submitted" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: formatDate(application.appliedAt) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Last Updated" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: formatDate(application.lastUpdated) })] }), application.expectedSalary && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Expected Salary" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-900", children: ["$", application.expectedSalary.toLocaleString()] })] })), application.availabilityDate && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Available From" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: application.availabilityDate })] }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Job Details" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Position" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: job.title })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Department" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: job.department })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Location" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-900", children: job.location })] }), job.salary && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-sm font-medium text-gray-700", children: "Salary Range" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-900", children: ["$", job.salary.min.toLocaleString(), " - $", job.salary.max.toLocaleString()] })] }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Actions" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsx)("button", { onClick: () => navigate(`/jobs/${job.id}`), className: "w-full px-4 py-2 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors", children: "View Job Posting" }), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/applications'), className: "w-full px-4 py-2 border border-gray-200 text-gray-700 font-light rounded-lg hover:bg-gray-50 transition-colors", children: "All Applications" })] })] })] })] })] }) }));
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


/***/ }),

/***/ 7504:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ MessageSquare)
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
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("message-square", __iconNode);


//# sourceMappingURL=message-square.js.map


/***/ }),

/***/ 7775:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Send)
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
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("send", __iconNode);


//# sourceMappingURL=send.js.map


/***/ })

}]);
//# sourceMappingURL=4567.chunk.js.map