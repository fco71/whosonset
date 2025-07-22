"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[662],{

/***/ 676:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ imageErrorFallback)
/* harmony export */ });
// Utility for robust <img> error fallback
function imageErrorFallback(e, fallback = '/default-avatar.svg') {
    const target = e.target;
    if (!target.src.endsWith(fallback)) {
        target.src = fallback;
    }
}


/***/ }),

/***/ 6024:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9505);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(888);




const FollowButton = ({ currentUserId, targetUserId, onFollowRequest, className = '', size = 'md', showCount = false }) => {
    const [followStatus, setFollowStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('none');
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [followersCount, setFollowersCount] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const checkStatus = async () => {
            const status = await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.getFollowStatus(currentUserId, targetUserId);
            setFollowStatus(status);
        };
        checkStatus();
    }, [currentUserId, targetUserId]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (showCount) {
            const getCount = async () => {
                const count = await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.getFollowersCount(targetUserId);
                setFollowersCount(count);
            };
            getCount();
        }
    }, [targetUserId, showCount]);
    const handleFollow = async () => {
        if (onFollowRequest) {
            onFollowRequest();
            return;
        }
        try {
            setLoading(true);
            if (followStatus === 'pending' || followStatus === 'following') {
                (0,react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR)('Follow request already sent or you are already following.');
                return;
            }
            console.log('[FollowButton] Sending follow request from', currentUserId, 'to', targetUserId);
            await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.sendFollowRequest(currentUserId, targetUserId);
            console.log('[FollowButton] Follow request sent successfully');
            setFollowStatus('pending');
        }
        catch (error) {
            if (error?.message && error.message.includes('already exists')) {
                setFollowStatus('pending');
                (0,react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR)('Follow request already sent.');
            }
            else {
                console.error('[FollowButton] Error sending follow request:', error);
                react_hot_toast__WEBPACK_IMPORTED_MODULE_3__/* .toast */ .oR.error('Error sending follow request.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleUnfollow = async () => {
        try {
            setLoading(true);
            await _utilities_socialService__WEBPACK_IMPORTED_MODULE_2__/* .SocialService */ .l.unfollow(currentUserId, targetUserId);
            setFollowStatus('none');
            if (showCount) {
                setFollowersCount(prev => Math.max(0, prev - 1));
            }
        }
        catch (error) {
            console.error('Error unfollowing:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-1.5 text-xs';
            case 'lg':
                return 'px-6 py-3 text-base';
            default:
                return 'px-4 py-2 text-sm';
        }
    };
    const renderButton = () => {
        const baseClasses = `font-light tracking-wide rounded-lg transition-all duration-300 disabled:opacity-50 ${getSizeClasses()} ${className}`;
        switch (followStatus) {
            case 'following':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleUnfollow, disabled: loading, className: `bg-red-600 text-white hover:bg-red-700 hover:scale-105 ${baseClasses} flex items-center gap-2`, title: "Click to unfollow", children: loading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Unfollowing..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "\u2713" }), "Following"] })) }));
            case 'pending':
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { disabled: true, className: `bg-yellow-100 text-yellow-800 font-medium rounded-full tracking-wider ${getSizeClasses()} ${className} flex items-center gap-2 cursor-not-allowed`, title: "Request sent, waiting for approval", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "\u23F3" }), "Request Sent"] }));
            default:
                return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleFollow, disabled: loading, className: `bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 ${baseClasses} flex items-center gap-2`, title: "Click to send follow request", children: loading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Sending..."] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: "+" }), "Follow"] })) }));
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [renderButton(), showCount && followersCount > 0 && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "text-xs text-gray-500", children: [followersCount, " follower", followersCount !== 1 ? 's' : ''] }))] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FollowButton);


/***/ }),

/***/ 6919:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9487);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7594);
/* harmony import */ var react_firebase_hooks_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6354);
/* harmony import */ var _Social_FollowButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6024);
/* harmony import */ var _utilities_imageErrorFallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(676);







const CrewProfileCard = ({ profile, index = 0, isFiltering = false, currentUserId }) => {
    const [user] = (0,react_firebase_hooks_auth__WEBPACK_IMPORTED_MODULE_4__/* .useAuthState */ .hD)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2);
    const [isBookmarked, setIsBookmarked] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [isBookmarking, setIsBookmarking] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user || !currentUserId)
            return;
        setIsBookmarking(true);
        try {
            const userRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'users', currentUserId);
            if (isBookmarked) {
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .updateDoc */ .mZ)(userRef, {
                    bookmarkedCrew: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .arrayRemove */ .C3)(profile.uid)
                });
                setIsBookmarked(false);
            }
            else {
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .updateDoc */ .mZ)(userRef, {
                    bookmarkedCrew: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .arrayUnion */ .hq)(profile.uid)
                });
                setIsBookmarked(true);
            }
        }
        catch (error) {
            console.error('Error updating bookmark:', error);
        }
        finally {
            setIsBookmarking(false);
        }
    };
    const getAvailabilityColor = (availability) => {
        switch (availability.toLowerCase()) {
            case 'available':
                return 'badge-success';
            case 'soon':
                return 'badge-warning';
            case 'unavailable':
                return 'badge-error';
            default:
                return 'badge-gray';
        }
    };
    const primaryJobTitle = profile.jobTitles?.[0]?.title || 'Crew Member';
    const primaryLocation = profile.residences?.[0] ?
        `${profile.residences[0].city}, ${profile.residences[0].country}` : 'Location not specified';
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `group card-base card-hover animate-entrance ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`, style: { animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "h-48 card-image-container", style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", { src: profile.profileImageUrl || "/default-avatar.svg", alt: profile.name, className: "card-image", style: { width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '3px solid #e5e7eb' }, onError: _utilities_imageErrorFallback__WEBPACK_IMPORTED_MODULE_6__/* .imageErrorFallback */ .i }), user && currentUserId && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: handleBookmark, disabled: isBookmarking, className: "absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50", title: isBookmarked ? "Remove from bookmarks" : "Add to bookmarks", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", { className: `w-5 h-5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`, fill: isBookmarked ? 'currentColor' : 'none', stroke: "currentColor", viewBox: "0 0 24 24", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) }) })), profile.availability && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute bottom-3 left-3", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `badge-base ${getAvailabilityColor(profile.availability)}`, children: profile.availability }) }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { width: '100%', textAlign: 'center', marginBottom: 12 }, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { style: { fontWeight: 600, color: '#1f2937', fontSize: 20, margin: 0 }, children: profile.name }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { color: '#6b7280', fontWeight: 500, fontSize: 15, marginBottom: 4 }, children: primaryJobTitle }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { color: '#9ca3af', fontSize: 14 }, children: primaryLocation })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { style: { width: '100%', display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }, children: user && user.uid !== profile.uid && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "btn-secondary", style: { display: 'inline-block' }, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Social_FollowButton__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A, { currentUserId: user.uid, targetUserId: profile.uid }) })) })] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CrewProfileCard);


/***/ }),

/***/ 9662:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5788);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9487);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7594);
/* harmony import */ var _CrewProfileCard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6919);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(888);







const JobApplicantsPage = () => {
    const { jobId } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__/* .useParams */ .g)();
    const [applications, setApplications] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [applicantProfiles, setApplicantProfiles] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const fetchApplicants = async () => {
            setIsLoading(true);
            try {
                // Fetch job applications for this job
                const appsQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'jobApplications'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .where */ ._M)('jobId', '==', jobId));
                const appsSnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .getDocs */ .GG)(appsQuery);
                const apps = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setApplications(apps);
                // Fetch applicant profiles
                const applicantIds = apps.map(app => app.applicantId);
                if (applicantIds.length === 0) {
                    setApplicantProfiles([]);
                    setIsLoading(false);
                    return;
                }
                // Batch fetch profiles
                const profilesSnapshot = await Promise.all(applicantIds.map(async (uid) => {
                    const snap = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .getDocs */ .GG)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'crewProfiles'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .where */ ._M)('uid', '==', uid)));
                    if (snap.docs.length > 0) {
                        const data = snap.docs[0].data();
                        // Map to CrewProfile type, with fallbacks for required fields
                        return {
                            uid: data.uid || uid,
                            name: data.name || 'Unknown',
                            username: data.username || data.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
                            bio: data.bio || '',
                            profileImageUrl: data.profileImageUrl || '',
                            jobTitles: data.jobTitles || [],
                            residences: data.residences || [{ country: '', city: '' }],
                            projects: data.projects || [],
                            education: data.education || [],
                            contactInfo: data.contactInfo || {},
                            otherInfo: data.otherInfo || '',
                            isPublished: data.isPublished ?? true,
                            availability: data.availability || 'available',
                            languages: data.languages || [],
                        };
                    }
                    else {
                        // Fallback for missing profile
                        return {
                            uid,
                            name: 'Unknown',
                            username: 'unknown',
                            bio: '',
                            profileImageUrl: '',
                            jobTitles: [],
                            residences: [{ country: '', city: '' }],
                            projects: [],
                            education: [],
                            contactInfo: {},
                            otherInfo: '',
                            isPublished: false,
                            availability: 'unavailable',
                            languages: [],
                        };
                    }
                }));
                setApplicantProfiles(profilesSnapshot.filter(Boolean));
            }
            catch (error) {
                console.error('Error fetching applicants:', error);
                react_hot_toast__WEBPACK_IMPORTED_MODULE_5__/* .toast */ .oR.error('Failed to load applicants');
            }
            finally {
                setIsLoading(false);
            }
        };
        if (jobId)
            fetchApplicants();
    }, [jobId]);
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50 py-12 px-4 md:px-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-5xl mx-auto", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8 flex items-center justify-between", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-light text-gray-900", children: "Applicants" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_6__/* .Link */ .N_, { to: "/jobs/posted", className: "text-blue-600 hover:underline text-sm", children: "\u2190 Back to Dashboard" })] }), isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading applicants..." })] })) : applicantProfiles.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-12", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDC64" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: "No applicants yet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "Applicants for this job will appear here." })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6", children: applicantProfiles.map(profile => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_CrewProfileCard__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, { profile: profile }, profile.uid))) }))] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (JobApplicantsPage);


/***/ })

}]);
//# sourceMappingURL=662.chunk.js.map