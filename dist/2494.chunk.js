"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[2494],{

/***/ 2494:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ components_PublicResumePage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./src/components/ResumeView.tsx + 1 modules
var ResumeView = __webpack_require__(3542);
// EXTERNAL MODULE: ./src/components/Social/FollowButton.tsx
var FollowButton = __webpack_require__(6024);
// EXTERNAL MODULE: ./src/utilities/crewFavoritesService.ts
var crewFavoritesService = __webpack_require__(6838);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
;// ./src/components/CrewProfileHeader.tsx







const CrewProfileHeader = ({ profile }) => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [isBookmarked, setIsBookmarked] = (0,react.useState)(false);
    const [bookmarking, setBookmarking] = (0,react.useState)(false);
    (0,react.useEffect)(() => {
        const checkFavorite = async () => {
            if (currentUser && profile?.uid) {
                setIsBookmarked(await crewFavoritesService/* CrewFavoritesService */.e.isFavorite(profile.uid));
            }
        };
        checkFavorite();
    }, [currentUser, profile?.uid]);
    const handleBookmark = async () => {
        if (!currentUser)
            return;
        setBookmarking(true);
        try {
            if (isBookmarked) {
                await crewFavoritesService/* CrewFavoritesService */.e.removeFromFavorites(profile.uid);
                setIsBookmarked(false);
            }
            else {
                await crewFavoritesService/* CrewFavoritesService */.e.addToFavorites(profile.uid, {
                    crewName: profile.name,
                    jobTitle: profile.jobTitles?.[0]?.title,
                    location: profile.residences?.[0] ?
                        `${profile.residences[0].city}, ${profile.residences[0].country}` : undefined,
                    profileImageUrl: profile.profileImageUrl,
                });
                setIsBookmarked(true);
            }
        }
        catch (error) {
            console.error('Error toggling bookmark:', error);
        }
        finally {
            setBookmarking(false);
        }
    };
    const getAvailabilityText = (availability) => {
        switch (availability.toLowerCase()) {
            case 'available':
                return t('crew.available');
            case 'soon':
                return t('crew.soon');
            case 'unavailable':
                return t('crew.unavailable');
            default:
                return availability;
        }
    };
    const mainTitle = profile.jobTitles?.[0]?.title || '';
    const mainLocation = profile.residences?.[0]
        ? `${profile.residences[0].city ? profile.residences[0].city + ', ' : ''}${profile.residences[0].country || ''}`
        : '';
    // Fallback: use photoURL if profileImageUrl is missing
    const imageUrl = profile.profileImageUrl || profile.photoURL || '/default-avatar.svg';
    const availability = profile.availability || '';
    return ((0,jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow-lg px-8 py-6 mb-8 border border-gray-100 animate-fade-in", children: [(0,jsx_runtime.jsx)("img", { src: imageUrl, alt: profile.name, className: "w-24 h-24 rounded-full object-cover border-2 border-gray-200", onError: imageErrorFallback/* imageErrorFallback */.i, style: { flexShrink: 0 } }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0 text-center md:text-left", children: [(0,jsx_runtime.jsx)("div", { className: "font-bold text-2xl text-gray-900 mb-1", children: profile.name }), (0,jsx_runtime.jsxs)("div", { className: "text-sm text-gray-500 mb-1", children: [mainTitle, mainLocation ? ' · ' + mainLocation : ''] }), availability && ((0,jsx_runtime.jsx)("span", { className: `inline-block px-2 py-1 rounded-full text-xs font-medium ${availability.toLowerCase() === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`, children: getAvailabilityText(availability) }))] }), (0,jsx_runtime.jsx)("div", { className: "flex flex-col gap-2 items-center md:items-end", children: currentUser && currentUser.uid !== profile.uid && ((0,jsx_runtime.jsxs)("div", { className: "flex gap-2 items-center", children: [(0,jsx_runtime.jsx)(FollowButton/* default */.A, { currentUserId: currentUser.uid, targetUserId: profile.uid, size: "sm" }), (0,jsx_runtime.jsx)("button", { onClick: handleBookmark, disabled: bookmarking, className: `p-2 rounded-full border border-gray-200 bg-white hover:bg-yellow-50 transition-all duration-200 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} ${bookmarking ? 'opacity-50' : ''}`, title: isBookmarked ? t('crew.removeFromBookmarks') : t('crew.addToBookmarks'), style: { lineHeight: 0 }, children: isBookmarked ? ((0,jsx_runtime.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 24 24", className: "w-6 h-6", children: (0,jsx_runtime.jsx)("path", { d: "M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" }) })) : ((0,jsx_runtime.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", className: "w-6 h-6", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" }) })) })] })) })] }));
};
/* harmony default export */ const components_CrewProfileHeader = (CrewProfileHeader);

;// ./src/components/PublicResumePage.tsx








// Use enum-like object with uppercase keys for better type safety
const LOADING_STATES = {
    IDLE: 'IDLE',
    LOADING: 'LOADING',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};
const PublicResumePage = () => {
    const { uid } = (0,dist/* useParams */.g)();
    const { t } = (0,es/* useTranslation */.Bd)();
    const [profile, setProfile] = (0,react.useState)(null);
    const [status, setStatus] = (0,react.useState)(LOADING_STATES.LOADING);
    const [error, setError] = (0,react.useState)(null);
    (0,react.useEffect)(() => {
        const fetchResume = async () => {
            if (!uid) {
                setStatus(LOADING_STATES.ERROR);
                setError('No user ID provided');
                return;
            }
            try {
                setStatus(LOADING_STATES.LOADING);
                const docRef = (0,index_esm.doc)(firebase.db, 'crewProfiles', uid);
                const docSnap = await (0,index_esm.getDoc)(docRef);
                if (!docSnap.exists()) {
                    throw new Error('Profile not found');
                }
                let profileData = docSnap.data();
                // Fallback: use photoURL if profileImageUrl is missing
                if (!profileData.profileImageUrl && profileData.photoURL) {
                    profileData = { ...profileData, profileImageUrl: profileData.photoURL };
                }
                console.log('[PublicResumePage] Fetched profile data:', {
                    hasProfileImage: !!profileData.profileImageUrl,
                    profileImageUrl: profileData.profileImageUrl,
                    isBlobUrl: profileData.profileImageUrl?.startsWith('blob:'),
                    profileData: { ...profileData, profileImageUrl: '...' }
                });
                if (!profileData.isPublished) {
                    throw new Error('Profile is not published');
                }
                setProfile(profileData);
                setStatus(LOADING_STATES.SUCCESS);
            }
            catch (err) {
                console.error('Error fetching resume:', err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setStatus(LOADING_STATES.ERROR);
            }
        };
        fetchResume();
    }, [uid]);
    // Always call hooks in the same order
    (0,react.useEffect)(() => {
        if (profile) {
            console.log('[PublicResumePage] Rendering ResumeView with profile:', {
                hasProfileImage: !!profile?.profileImageUrl,
                isBlobUrl: profile?.profileImageUrl?.startsWith('blob:'),
                profileId: uid
            });
        }
    }, [profile, uid]);
    if (status === LOADING_STATES.LOADING) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-900 text-white flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4", "aria-label": "Loading" }), (0,jsx_runtime.jsx)("p", { children: t('resume.loading') }),  false && (0)] }) }));
    }
    if (status === LOADING_STATES.ERROR) {
        console.error('[PublicResumePage] Error loading profile:', { error, profile });
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-900 text-white flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center max-w-md mx-auto p-6", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4", role: "img", "aria-hidden": "true", children: error?.includes('not found') ? '🔍' : '🔒' }), (0,jsx_runtime.jsx)("h1", { className: "text-2xl font-bold mb-4", children: error?.includes('not found')
                            ? t('resume.errors.notFound')
                            : t('resume.errors.notAvailable') }), (0,jsx_runtime.jsx)("p", { className: "text-gray-300", children: error || (error?.includes('not found')
                            ? t('resume.errors.notFoundDescription')
                            : t('resume.errors.notAvailableDescription')) }),  false && (0)] }) }));
    }
    if (!profile) {
        return null; // Should be handled by error state, but TypeScript needs this check
    }
    return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "max-w-3xl mx-auto px-4 pt-8", children: [(0,jsx_runtime.jsx)(components_CrewProfileHeader, { profile: profile }), (0,jsx_runtime.jsx)(ResumeView/* default */.A, { profile: profile, isOwnResume: false })] }),  false && (0)] }));
};
/* harmony default export */ const components_PublicResumePage = (PublicResumePage);


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

/***/ 6838:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ CrewFavoritesService)
/* harmony export */ });
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9487);


class CrewFavoritesService {
    static async addToFavorites(crewId, crewData) {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            throw new Error('User not authenticated');
        const favoriteId = `${user.uid}_${crewId}`;
        const favoriteData = {
            userId: user.uid,
            crewId,
            crewName: crewData.crewName,
            jobTitle: crewData.jobTitle,
            location: crewData.location,
            profileImageUrl: crewData.profileImageUrl,
            addedAt: new Date()
        };
        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME, favoriteId), favoriteData);
    }
    static async removeFromFavorites(crewId) {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            throw new Error('User not authenticated');
        const favoriteId = `${user.uid}_${crewId}`;
        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .deleteDoc */ .kd)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME, favoriteId));
    }
    static async isFavorite(crewId) {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            return false;
        try {
            const favoriteId = `${user.uid}_${crewId}`;
            const favoriteDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME, favoriteId));
            return favoriteDoc.exists();
        }
        catch (error) {
            console.error('Error checking if crew is favorite:', error);
            return false;
        }
    }
    static async getFavorites() {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            return [];
        try {
            const favoritesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('userId', '==', user.uid), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .orderBy */ .My)('addedAt', 'asc'));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(favoritesQuery);
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    addedAt: data.addedAt?.toDate ? data.addedAt.toDate() : data.addedAt
                };
            });
        }
        catch (error) {
            console.error('Error getting crew favorites:', error);
            return [];
        }
    }
    static async getFavoriteCrewIds() {
        const user = _firebase__WEBPACK_IMPORTED_MODULE_1__/* .auth */ .j2.currentUser;
        if (!user)
            return [];
        try {
            const favoritesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, this.COLLECTION_NAME), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('userId', '==', user.uid));
            const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(favoritesQuery);
            return snapshot.docs.map(doc => doc.data().crewId);
        }
        catch (error) {
            console.error('Error getting favorite crew IDs:', error);
            return [];
        }
    }
}
CrewFavoritesService.COLLECTION_NAME = 'crewFavorites';


/***/ })

}]);
//# sourceMappingURL=2494.chunk.js.map