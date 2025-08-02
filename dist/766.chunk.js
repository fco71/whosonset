"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[766],{

/***/ 633:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BK: () => (/* binding */ AvatarImage),
/* harmony export */   eu: () => (/* binding */ Avatar),
/* harmony export */   q5: () => (/* binding */ AvatarFallback)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9973);



const Avatar = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base"
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("relative flex items-center justify-center overflow-hidden rounded-full bg-gray-100", sizeClasses[size], className), ...props }));
});
Avatar.displayName = "Avatar";
const AvatarImage = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { ref: ref, className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("h-full w-full object-cover", className), ...props })));
AvatarImage.displayName = "AvatarImage";
const AvatarFallback = react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_2__.cn)("flex h-full w-full items-center justify-center bg-gray-100 text-gray-600", className), ...props })));
AvatarFallback.displayName = "AvatarFallback";



/***/ }),

/***/ 766:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ JobSearch_JobApplicantsPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./src/utilities/fileUploadService.ts
var fileUploadService = __webpack_require__(3549);
// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var react_hot_toast_dist = __webpack_require__(888);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./src/components/ui/Card.tsx
var Card = __webpack_require__(4948);
// EXTERNAL MODULE: ./src/components/ui/Avatar.tsx
var Avatar = __webpack_require__(633);
// EXTERNAL MODULE: ./src/components/JobSearch/ApplicationMessaging.tsx
var ApplicationMessaging = __webpack_require__(3797);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/clock.js
var clock = __webpack_require__(7235);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/eye.js
var eye = __webpack_require__(3160);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/star.js
var star = __webpack_require__(1181);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/calendar.js
var calendar = __webpack_require__(2307);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-check-big.js
var circle_check_big = __webpack_require__(4471);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-x.js
var circle_x = __webpack_require__(180);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/search.js
var search = __webpack_require__(8445);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user.js
var user = __webpack_require__(8686);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/briefcase.js
var briefcase = __webpack_require__(2201);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/map-pin.js
var map_pin = __webpack_require__(6069);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/dollar-sign.js
var dollar_sign = __webpack_require__(6589);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/message-square.js
var message_square = __webpack_require__(7504);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/heart.js
var heart = __webpack_require__(3345);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/users.js
var users = __webpack_require__(3893);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/mail.js
var mail = __webpack_require__(3954);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/phone.js
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
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = (0,createLucideIcon/* default */.A)("phone", __iconNode);


//# sourceMappingURL=phone.js.map

;// ./node_modules/lucide-react/dist/esm/icons/external-link.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const external_link_iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = (0,createLucideIcon/* default */.A)("external-link", external_link_iconNode);


//# sourceMappingURL=external-link.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/download.js
var download = __webpack_require__(8309);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/paperclip.js
var paperclip = __webpack_require__(8117);
;// ./src/components/JobSearch/JobApplicantsPage.tsx













const JobApplicantsPage = ({ jobId: propJobId }) => {
    const navigate = (0,dist/* useNavigate */.Zp)();
    const { jobId: urlJobId } = (0,dist/* useParams */.g)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [job, setJob] = (0,react.useState)(null);
    const [applications, setApplications] = (0,react.useState)([]);
    const [applicantProfiles, setApplicantProfiles] = (0,react.useState)({});
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    const [selectedApplication, setSelectedApplication] = (0,react.useState)(null);
    const [showApplicantModal, setShowApplicantModal] = (0,react.useState)(false);
    const [showMessageModal, setShowMessageModal] = (0,react.useState)(false);
    const [filterStatus, setFilterStatus] = (0,react.useState)('all');
    const [searchQuery, setSearchQuery] = (0,react.useState)('');
    const [sortBy, setSortBy] = (0,react.useState)('date');
    const actualJobId = propJobId || urlJobId;
    (0,react.useEffect)(() => {
        if (actualJobId) {
            loadJobAndApplications();
        }
    }, [actualJobId]);
    const loadJobAndApplications = async () => {
        try {
            setIsLoading(true);
            // Load job details
            const jobDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'jobPostings', actualJobId));
            if (jobDoc.exists()) {
                setJob({ id: jobDoc.id, ...jobDoc.data() });
            }
            // Load applications
            const applicationsQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'jobApplications'), (0,index_esm/* where */._M)('jobId', '==', actualJobId));
            const applicationsSnapshot = await (0,index_esm/* getDocs */.GG)(applicationsQuery);
            const applicationsData = applicationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setApplications(applicationsData);
            // Load applicant profiles
            const applicantIds = applicationsData.map(app => app.applicantId);
            const profilesMap = {};
            for (const applicantId of applicantIds) {
                try {
                    const profileQuery = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, 'crewProfiles'), (0,index_esm/* where */._M)('uid', '==', applicantId));
                    const profileSnapshot = await (0,index_esm/* getDocs */.GG)(profileQuery);
                    if (!profileSnapshot.empty) {
                        const profileData = profileSnapshot.docs[0].data();
                        profilesMap[applicantId] = {
                            uid: profileData.uid || applicantId,
                            name: profileData.name || 'Unknown',
                            username: profileData.username || profileData.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
                            bio: profileData.bio || '',
                            jobTitles: profileData.jobTitles || [],
                            experience: profileData.experience || 'Not specified',
                            location: profileData.location || 'Not specified',
                            skills: profileData.skills || [],
                            availability: profileData.availability || 'Not specified',
                            expectedSalary: profileData.expectedSalary,
                            portfolio: profileData.portfolio,
                            phone: profileData.phone,
                            email: profileData.email,
                            profileImageUrl: profileData.profileImageUrl || profileData.photoURL || profileData.avatarUrl
                        };
                    }
                    else {
                        // Create a basic profile if none exists
                        profilesMap[applicantId] = {
                            uid: applicantId,
                            name: 'Unknown Applicant',
                            username: 'unknown',
                            bio: 'Profile not available',
                            jobTitles: [],
                            experience: 'Not specified',
                            location: 'Not specified',
                            skills: [],
                            availability: 'Not specified'
                        };
                    }
                }
                catch (error) {
                    console.error('Error fetching profile for applicantId:', applicantId, error);
                    profilesMap[applicantId] = {
                        uid: applicantId,
                        name: 'Unknown Applicant',
                        username: 'unknown',
                        bio: 'Profile not available',
                        jobTitles: [],
                        experience: 'Not specified',
                        location: 'Not specified',
                        skills: [],
                        availability: 'Not specified'
                    };
                }
            }
            setApplicantProfiles(profilesMap);
        }
        catch (error) {
            console.error('Error loading job and applications:', error);
            react_hot_toast_dist/* toast */.oR.error('Failed to load applications');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'jobApplications', applicationId), {
                status: newStatus,
                lastUpdated: (0,index_esm/* serverTimestamp */.O5)()
            });
            // Update local state
            setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app));
            // Fetch the application to get applicantId
            const applicationDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'jobApplications', applicationId));
            const applicationData = applicationDoc.data();
            if (applicationData && applicationData.applicantId) {
                await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'users', applicationData.applicantId, 'notifications'), {
                    type: 'application_status_update',
                    message: `Your application status has been updated to: ${newStatus}`,
                    timestamp: (0,index_esm/* serverTimestamp */.O5)(),
                    read: false,
                    userId: applicationData.applicantId,
                    applicationId: applicationId,
                    status: newStatus
                });
            }
            react_hot_toast_dist/* toast */.oR.success(`Application ${newStatus.replace('_', ' ')}`);
        }
        catch (error) {
            console.error('Error updating application status:', error);
            react_hot_toast_dist/* toast */.oR.error('Failed to update status');
        }
    };
    const handleFavorite = async (applicationId) => {
        try {
            // Add to favorites collection
            await (0,index_esm/* addDoc */.gS)((0,index_esm/* collection */.rJ)(firebase.db, 'users', currentUser.uid, 'favoriteApplicants'), {
                applicationId,
                addedAt: (0,index_esm/* serverTimestamp */.O5)()
            });
            react_hot_toast_dist/* toast */.oR.success('Applicant added to favorites');
        }
        catch (error) {
            console.error('Error adding to favorites:', error);
            react_hot_toast_dist/* toast */.oR.error('Failed to add to favorites');
        }
    };
    const handleShortlist = async (applicationId) => {
        try {
            await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'jobApplications', applicationId), {
                shortlisted: true,
                shortlistedAt: (0,index_esm/* serverTimestamp */.O5)()
            });
            react_hot_toast_dist/* toast */.oR.success('Applicant shortlisted');
        }
        catch (error) {
            console.error('Error shortlisting applicant:', error);
            react_hot_toast_dist/* toast */.oR.error('Failed to shortlist');
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'shortlisted': return 'bg-purple-100 text-purple-800';
            case 'interviewed': return 'bg-indigo-100 text-indigo-800';
            case 'hired': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return (0,jsx_runtime.jsx)(clock/* default */.A, { className: "w-4 h-4" });
            case 'reviewed': return (0,jsx_runtime.jsx)(eye/* default */.A, { className: "w-4 h-4" });
            case 'shortlisted': return (0,jsx_runtime.jsx)(star/* default */.A, { className: "w-4 h-4" });
            case 'interviewed': return (0,jsx_runtime.jsx)(calendar/* default */.A, { className: "w-4 h-4" });
            case 'hired': return (0,jsx_runtime.jsx)(circle_check_big/* default */.A, { className: "w-4 h-4" });
            case 'rejected': return (0,jsx_runtime.jsx)(circle_x/* default */.A, { className: "w-4 h-4" });
            default: return (0,jsx_runtime.jsx)(clock/* default */.A, { className: "w-4 h-4" });
        }
    };
    const formatDate = (date) => {
        if (!date)
            return 'N/A';
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleDateString();
    };
    const formatSalary = (salary) => {
        if (!salary)
            return 'Not specified';
        return `$${salary.toLocaleString()}`;
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
    const filteredAndSortedApplications = applications
        .filter(app => {
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        const matchesSearch = searchQuery === '' ||
            applicantProfiles[app.applicantId]?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            applicantProfiles[app.applicantId]?.jobTitles.some(title => title.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    })
        .sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return applicantProfiles[a.applicantId]?.name.localeCompare(applicantProfiles[b.applicantId]?.name || '');
            case 'status':
                return a.status.localeCompare(b.status);
            case 'date':
            default:
                return (b.appliedAt?.toDate?.() || new Date(b.appliedAt)).getTime() -
                    (a.appliedAt?.toDate?.() || new Date(a.appliedAt)).getTime();
        }
    });
    if (isLoading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading applicants..." })] }) }));
    }
    if (!job) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\u274C" }), (0,jsx_runtime.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Job Not Found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "The job you're looking for doesn't exist." }), (0,jsx_runtime.jsx)(Button/* Button */.$, { onClick: () => navigate('/jobs'), children: "Back to Jobs" })] }) }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50", children: [(0,jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [(0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("button", { onClick: () => navigate(`/jobs/${actualJobId}`), className: "flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors", children: "\u2190 Back to Job" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsxs)("h1", { className: "text-3xl font-light text-gray-900 mb-2", children: ["Applicants for ", job.title] }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-600", children: [applications.length, " application", applications.length !== 1 ? 's' : '', " \u2022 ", job.department, " \u2022 ", job.location] })] }), (0,jsx_runtime.jsx)("div", { className: "flex items-center gap-3", children: (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", onClick: () => navigate(`/jobs/${actualJobId}`), children: [(0,jsx_runtime.jsx)(eye/* default */.A, { className: "w-4 h-4 mr-2" }), "View Job"] }) })] })] }), (0,jsx_runtime.jsx)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6", children: (0,jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row gap-4", children: [(0,jsx_runtime.jsx)("div", { className: "flex-1", children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: "Search applicants by name or skills...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200" })] }) }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-3", children: [(0,jsx_runtime.jsxs)("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200", children: [(0,jsx_runtime.jsx)("option", { value: "all", children: "All Status" }), (0,jsx_runtime.jsx)("option", { value: "pending", children: "Pending" }), (0,jsx_runtime.jsx)("option", { value: "reviewed", children: "Reviewed" }), (0,jsx_runtime.jsx)("option", { value: "shortlisted", children: "Shortlisted" }), (0,jsx_runtime.jsx)("option", { value: "interviewed", children: "Interviewed" }), (0,jsx_runtime.jsx)("option", { value: "hired", children: "Hired" }), (0,jsx_runtime.jsx)("option", { value: "rejected", children: "Rejected" })] }), (0,jsx_runtime.jsxs)("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200", children: [(0,jsx_runtime.jsx)("option", { value: "date", children: "Sort by Date" }), (0,jsx_runtime.jsx)("option", { value: "name", children: "Sort by Name" }), (0,jsx_runtime.jsx)("option", { value: "status", children: "Sort by Status" })] })] })] }) }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredAndSortedApplications.map((application) => {
                            const profile = applicantProfiles[application.applicantId];
                            return ((0,jsx_runtime.jsxs)(Card/* default */.Ay, { className: "p-6 hover:shadow-lg transition-shadow", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsxs)(Avatar/* Avatar */.eu, { className: "w-12 h-12", children: [(0,jsx_runtime.jsx)(Avatar/* AvatarImage */.BK, { src: profile?.profileImageUrl || '/bust-avatar.svg', alt: profile?.name || 'Applicant' }), (0,jsx_runtime.jsx)(Avatar/* AvatarFallback */.q5, { className: "bg-blue-100 text-blue-600", children: (0,jsx_runtime.jsx)(user/* default */.A, { className: "w-6 h-6" }) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-semibold text-gray-900", children: profile?.name }), (0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: ["@", profile?.username] })] })] }), (0,jsx_runtime.jsxs)("span", { className: `px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(application.status)}`, children: [getStatusIcon(application.status), application.status.replace('_', ' ')] })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3 mb-4", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0,jsx_runtime.jsx)(briefcase/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: profile?.jobTitles?.slice(0, 2).join(', ') || 'No titles specified' })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0,jsx_runtime.jsx)(map_pin/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: profile?.location || 'Location not specified' })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0,jsx_runtime.jsx)(dollar_sign/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsxs)("span", { children: ["Expected: ", formatSalary(application.expectedSalary)] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0,jsx_runtime.jsx)(clock/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsxs)("span", { children: ["Applied ", formatDate(application.appliedAt)] })] })] }), profile?.skills && profile.skills.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "mb-4", children: [(0,jsx_runtime.jsx)("p", { className: "text-xs font-medium text-gray-700 mb-2", children: "Skills" }), (0,jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-1", children: [profile.skills.slice(0, 3).map((skill, index) => ((0,jsx_runtime.jsx)("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full", children: skill }, index))), profile.skills.length > 3 && ((0,jsx_runtime.jsxs)("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full", children: ["+", profile.skills.length - 3, " more"] }))] })] })), (0,jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2", children: [(0,jsx_runtime.jsxs)(Button/* Button */.$, { size: "sm", onClick: () => {
                                                    setSelectedApplication(application);
                                                    setShowApplicantModal(true);
                                                }, children: [(0,jsx_runtime.jsx)(eye/* default */.A, { className: "w-4 h-4 mr-1" }), "View Details"] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", onClick: () => {
                                                    setSelectedApplication(application);
                                                    setShowMessageModal(true);
                                                }, children: [(0,jsx_runtime.jsx)(message_square/* default */.A, { className: "w-4 h-4 mr-1" }), "Message"] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", onClick: () => handleFavorite(application.id), children: [(0,jsx_runtime.jsx)(heart/* default */.A, { className: "w-4 h-4 mr-1" }), "Favorite"] })] }), (0,jsx_runtime.jsx)("div", { className: "mt-3 pt-3 border-t border-gray-100", children: (0,jsx_runtime.jsxs)("div", { className: "flex gap-1", children: [(0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", onClick: () => handleStatusUpdate(application.id, 'shortlisted'), className: "flex-1 text-xs", children: [(0,jsx_runtime.jsx)(star/* default */.A, { className: "w-3 h-3 mr-1" }), "Shortlist"] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", onClick: () => handleStatusUpdate(application.id, 'interviewed'), className: "flex-1 text-xs", children: [(0,jsx_runtime.jsx)(calendar/* default */.A, { className: "w-3 h-3 mr-1" }), "Interview"] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", onClick: () => handleStatusUpdate(application.id, 'hired'), className: "flex-1 text-xs", children: [(0,jsx_runtime.jsx)(circle_check_big/* default */.A, { className: "w-3 h-3 mr-1" }), "Hire"] })] }) })] }, application.id));
                        }) }), filteredAndSortedApplications.length === 0 && ((0,jsx_runtime.jsxs)("div", { className: "text-center py-12", children: [(0,jsx_runtime.jsx)(users/* default */.A, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No applicants found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: applications.length === 0
                                    ? "No one has applied to this job yet."
                                    : "No applicants match your current filters." })] }))] }), showApplicantModal && selectedApplication && ((0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => setShowApplicantModal(false), children: (0,jsx_runtime.jsx)("div", { className: "bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: (0,jsx_runtime.jsxs)("div", { className: "p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Applicant Details" }), (0,jsx_runtime.jsx)("button", { onClick: () => setShowApplicantModal(false), className: "p-2 hover:bg-gray-100 rounded-full transition-colors", children: (0,jsx_runtime.jsx)(circle_x/* default */.A, { className: "w-5 h-5 text-gray-500" }) })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900 mb-2", children: "Contact Information" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-2 text-sm", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(mail/* default */.A, { className: "w-4 h-4 text-gray-400" }), (0,jsx_runtime.jsx)("span", { children: applicantProfiles[selectedApplication.applicantId]?.email || 'Not provided' })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(Phone, { className: "w-4 h-4 text-gray-400" }), (0,jsx_runtime.jsx)("span", { children: applicantProfiles[selectedApplication.applicantId]?.phone || 'Not provided' })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)(map_pin/* default */.A, { className: "w-4 h-4 text-gray-400" }), (0,jsx_runtime.jsx)("span", { children: applicantProfiles[selectedApplication.applicantId]?.location || 'Not specified' })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900 mb-2", children: "Professional Info" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-2 text-sm", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Experience:" }), (0,jsx_runtime.jsx)("span", { className: "ml-2", children: applicantProfiles[selectedApplication.applicantId]?.experience })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Expected Salary:" }), (0,jsx_runtime.jsx)("span", { className: "ml-2", children: formatSalary(selectedApplication.expectedSalary) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Availability:" }), (0,jsx_runtime.jsx)("span", { className: "ml-2", children: applicantProfiles[selectedApplication.applicantId]?.availability })] })] })] })] }), applicantProfiles[selectedApplication.applicantId]?.bio && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900 mb-2", children: "Bio" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: applicantProfiles[selectedApplication.applicantId]?.bio })] })), applicantProfiles[selectedApplication.applicantId]?.skills &&
                                        applicantProfiles[selectedApplication.applicantId]?.skills.length > 0 && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900 mb-2", children: "Skills" }), (0,jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: applicantProfiles[selectedApplication.applicantId]?.skills.map((skill, index) => ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full", children: skill }, index))) })] })), applicantProfiles[selectedApplication.applicantId]?.portfolio && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900 mb-2", children: "Portfolio" }), (0,jsx_runtime.jsxs)("a", { href: applicantProfiles[selectedApplication.applicantId]?.portfolio, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-2 text-blue-600 hover:text-blue-700", children: [(0,jsx_runtime.jsx)(ExternalLink, { className: "w-4 h-4" }), "View Portfolio"] })] })), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900 mb-2", children: "Application Details" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Applied:" }), (0,jsx_runtime.jsx)("span", { className: "ml-2", children: formatDate(selectedApplication.appliedAt) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Status:" }), (0,jsx_runtime.jsx)("span", { className: `ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`, children: selectedApplication.status.replace('_', ' ') })] }), selectedApplication.availabilityDate && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Available from:" }), (0,jsx_runtime.jsx)("span", { className: "ml-2", children: selectedApplication.availabilityDate })] }))] })] }), selectedApplication.attachments && selectedApplication.attachments.length > 0 && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900 mb-2", children: "Uploaded Documents" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-2", children: [selectedApplication.attachments.find(att => att.type === 'resume') && ((0,jsx_runtime.jsx)("div", { className: "p-3 bg-blue-50 rounded-lg border border-blue-200", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("span", { className: "text-xl", children: "\uD83D\uDCC4" }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900 text-sm", children: "Resume" }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-600", children: "Submitted with application" })] })] }), (0,jsx_runtime.jsx)("div", { className: "flex gap-2", children: (() => {
                                                                        const resumeAttachment = selectedApplication.attachments?.find(att => att.type === 'resume');
                                                                        return resumeAttachment ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleViewFile(resumeAttachment.url), className: "p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors", title: "View Resume", children: (0,jsx_runtime.jsx)(eye/* default */.A, { className: "w-4 h-4" }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDownloadFile(resumeAttachment.url, resumeAttachment.name), className: "p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors", title: "Download Resume", children: (0,jsx_runtime.jsx)(download/* default */.A, { className: "w-4 h-4" }) })] })) : null;
                                                                    })() })] }) })), selectedApplication.attachments.filter(att => att.type !== 'resume').length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "space-y-2", children: [(0,jsx_runtime.jsxs)("p", { className: "text-sm font-medium text-gray-700 mb-2", children: ["Additional Documents (", selectedApplication.attachments.filter(att => att.type !== 'resume').length, ")"] }), selectedApplication.attachments.filter(att => att.type !== 'resume').map((attachment, index) => ((0,jsx_runtime.jsx)("div", { className: "p-3 bg-gray-50 rounded-lg border border-gray-200", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [(0,jsx_runtime.jsx)("span", { className: "text-lg", children: getFileIcon(attachment.name) }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900 text-sm", children: attachment.name }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-600", children: formatFileSize(attachment.size) })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [(0,jsx_runtime.jsx)("button", { onClick: () => handleViewFile(attachment.url), className: "p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", title: "View Document", children: (0,jsx_runtime.jsx)(eye/* default */.A, { className: "w-4 h-4" }) }), (0,jsx_runtime.jsx)("button", { onClick: () => handleDownloadFile(attachment.url, attachment.name), className: "p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", title: "Download Document", children: (0,jsx_runtime.jsx)(download/* default */.A, { className: "w-4 h-4" }) })] })] }) }, attachment.id)))] }))] })] })), (!selectedApplication.attachments || selectedApplication.attachments.length === 0) && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900 mb-2", children: "Uploaded Documents" }), (0,jsx_runtime.jsxs)("div", { className: "text-center py-4 text-gray-500", children: [(0,jsx_runtime.jsx)(paperclip/* default */.A, { className: "w-8 h-8 mx-auto mb-2 text-gray-300" }), (0,jsx_runtime.jsx)("p", { className: "text-sm", children: "No documents uploaded" })] })] })), (0,jsx_runtime.jsxs)("div", { className: "flex gap-3 pt-4 border-t border-gray-200", children: [(0,jsx_runtime.jsxs)(Button/* Button */.$, { onClick: () => {
                                                    setShowApplicantModal(false);
                                                    setShowMessageModal(true);
                                                }, className: "flex-1", children: [(0,jsx_runtime.jsx)(message_square/* default */.A, { className: "w-4 h-4 mr-2" }), "Send Message"] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", onClick: () => handleShortlist(selectedApplication.id), children: [(0,jsx_runtime.jsx)(star/* default */.A, { className: "w-4 h-4 mr-2" }), "Shortlist"] }), (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", onClick: () => handleFavorite(selectedApplication.id), children: [(0,jsx_runtime.jsx)(heart/* default */.A, { className: "w-4 h-4 mr-2" }), "Favorite"] })] })] })] }) }) })), showMessageModal && selectedApplication && ((0,jsx_runtime.jsx)(ApplicationMessaging/* default */.A, { applicationId: selectedApplication.id, isModal: true, onClose: () => setShowMessageModal(false) }))] }));
};
/* harmony default export */ const JobSearch_JobApplicantsPage = (JobApplicantsPage);


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

/***/ 3345:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Heart)
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
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("heart", __iconNode);


//# sourceMappingURL=heart.js.map


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

/***/ 3954:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Mail)
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
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("mail", __iconNode);


//# sourceMappingURL=mail.js.map


/***/ }),

/***/ 4471:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ CircleCheckBig)
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
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("circle-check-big", __iconNode);


//# sourceMappingURL=circle-check-big.js.map


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


/***/ }),

/***/ 9973:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cn: () => (/* binding */ cn)
/* harmony export */ });
/* unused harmony exports formatNumber, truncate, debounce, generateId, isMobileDevice, toKebabCase, isValidEmail */
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4164);
/* harmony import */ var tailwind_merge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(856);


/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class names to be combined
 * @returns A single string of combined and merged class names
 */
function cn(...inputs) {
    return (0,tailwind_merge__WEBPACK_IMPORTED_MODULE_1__/* .twMerge */ .QP)((0,clsx__WEBPACK_IMPORTED_MODULE_0__/* .clsx */ .$)(inputs));
}
/**
 * Formats a number with commas as thousand separators
 * @param num - The number to format
 * @returns Formatted number as string
 */
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}
/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * @param str - The string to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
function truncate(str, length) {
    if (str.length <= length)
        return str;
    return `${str.slice(0, length)}...`;
}
/**
 * Debounce a function call
 * @param func - The function to debounce
 * @param wait - Time to wait in milliseconds
 * @returns Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
/**
 * Generates a unique ID
 * @returns A unique string ID
 */
function generateId() {
    return Math.random().toString(36).substring(2, 11);
}
/**
 * Checks if the current device is a mobile device
 * @returns Boolean indicating if the device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
/**
 * Converts a string to kebab-case
 * @param str - The string to convert
 * @returns kebab-cased string
 */
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
/**
 * Validates an email address
 * @param email - The email to validate
 * @returns Boolean indicating if the email is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


/***/ })

}]);
//# sourceMappingURL=766.chunk.js.map