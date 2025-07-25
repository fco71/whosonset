"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[3608],{

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

/***/ 3608:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_SavedCrewProfilesPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/react-firebase-hooks/auth/dist/index.esm.js
var dist_index_esm = __webpack_require__(6354);
// EXTERNAL MODULE: ./src/components/Social/FollowButton.tsx
var FollowButton = __webpack_require__(6024);
// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
;// ./src/components/CrewProfileCard.tsx








const CrewProfileCard = ({ profile, index = 0, isFiltering = false, currentUserId }) => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const [user] = (0,dist_index_esm/* useAuthState */.hD)(firebase/* auth */.j2);
    const [isBookmarked, setIsBookmarked] = (0,react.useState)(false);
    const [isBookmarking, setIsBookmarking] = (0,react.useState)(false);
    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user || !currentUserId)
            return;
        setIsBookmarking(true);
        try {
            const userRef = (0,index_esm.doc)(firebase.db, 'users', currentUserId);
            if (isBookmarked) {
                await (0,index_esm/* updateDoc */.mZ)(userRef, {
                    bookmarkedCrew: (0,index_esm/* arrayRemove */.C3)(profile.uid)
                });
                setIsBookmarked(false);
            }
            else {
                await (0,index_esm/* updateDoc */.mZ)(userRef, {
                    bookmarkedCrew: (0,index_esm/* arrayUnion */.hq)(profile.uid)
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
    const primaryJobTitle = profile.jobTitles?.[0]?.title || t('crew.crewMember');
    const primaryLocation = profile.residences?.[0] ?
        `${profile.residences[0].city}, ${profile.residences[0].country}` : t('crew.locationNotSpecified');
    return ((0,jsx_runtime.jsxs)("div", { className: `group card-base card-hover animate-entrance ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`, style: { animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }, children: [(0,jsx_runtime.jsxs)("div", { className: "h-48 card-image-container", style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }, children: [(0,jsx_runtime.jsx)("img", { src: profile.profileImageUrl || "/default-avatar.svg", alt: profile.name, className: "card-image", style: { width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '3px solid #e5e7eb' }, onError: imageErrorFallback/* imageErrorFallback */.i }), user && currentUserId && ((0,jsx_runtime.jsx)("button", { onClick: handleBookmark, disabled: isBookmarking, className: "absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50", title: isBookmarked ? t('crew.removeFromBookmarks') : t('crew.addToBookmarks'), children: (0,jsx_runtime.jsx)("svg", { className: `w-5 h-5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`, fill: isBookmarked ? 'currentColor' : 'none', stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) }) })), profile.availability && ((0,jsx_runtime.jsx)("div", { className: "absolute bottom-3 left-3", children: (0,jsx_runtime.jsx)("span", { className: `badge-base ${getAvailabilityColor(profile.availability)}`, children: getAvailabilityText(profile.availability) }) }))] }), (0,jsx_runtime.jsxs)("div", { style: { width: '100%', textAlign: 'center', marginBottom: 12 }, children: [(0,jsx_runtime.jsx)("h3", { style: { fontWeight: 600, color: '#1f2937', fontSize: 20, margin: 0 }, children: profile.name }), (0,jsx_runtime.jsx)("div", { style: { color: '#6b7280', fontWeight: 500, fontSize: 15, marginBottom: 4 }, children: primaryJobTitle }), (0,jsx_runtime.jsx)("div", { style: { color: '#9ca3af', fontSize: 14 }, children: primaryLocation })] }), (0,jsx_runtime.jsx)("div", { style: { width: '100%', display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }, children: user && user.uid !== profile.uid && ((0,jsx_runtime.jsx)("div", { className: "btn-secondary", style: { display: 'inline-block' }, children: (0,jsx_runtime.jsx)(FollowButton/* default */.A, { currentUserId: user.uid, targetUserId: profile.uid }) })) })] }));
};
/* harmony default export */ const components_CrewProfileCard = (CrewProfileCard);

;// ./src/pages/SavedCrewProfilesPage.tsx

// src/pages/SavedCrewProfilesPage.tsx






const SavedCrewProfilesPage = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const [user] = (0,dist_index_esm/* useAuthState */.hD)(firebase/* auth */.j2);
    const [savedProfiles, setSavedProfiles] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    (0,react.useEffect)(() => {
        const fetchSavedProfiles = async () => {
            if (!user)
                return;
            try {
                const savedProfilesRef = (0,index_esm/* collection */.rJ)(firebase.db, `collections/${user.uid}/savedCrew`);
                const querySnapshot = await (0,index_esm/* getDocs */.GG)(savedProfilesRef);
                const profiles = querySnapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                }));
                setSavedProfiles(profiles);
            }
            catch (error) {
                console.error('Error fetching saved profiles:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSavedProfiles();
    }, [user]);
    if (loading) {
        return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gradient-to-br from-gray-50 to-white border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-8 py-24", children: (0,jsx_runtime.jsxs)("div", { className: "text-center mb-16 animate-fade-in", children: [(0,jsx_runtime.jsx)("h1", { className: "text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up", children: t('crew.savedCrew') }), (0,jsx_runtime.jsx)("h2", { className: "text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay", children: t('crew.crewProfiles') })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-8 py-16", children: (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", children: [...Array(8)].map((_, i) => ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm p-6 animate-pulse", children: [(0,jsx_runtime.jsx)("div", { className: "h-48 bg-gray-200 rounded-lg mb-4" }), (0,jsx_runtime.jsx)("div", { className: "h-6 bg-gray-200 rounded mb-2" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded mb-4" }), (0,jsx_runtime.jsx)("div", { className: "h-4 bg-gray-200 rounded mb-6" }), (0,jsx_runtime.jsxs)("div", { className: "flex gap-3", children: [(0,jsx_runtime.jsx)("div", { className: "flex-1 h-10 bg-gray-200 rounded-lg" }), (0,jsx_runtime.jsx)("div", { className: "w-20 h-10 bg-gray-200 rounded-lg" })] })] }, i))) }) })] }));
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,jsx_runtime.jsx)("div", { className: "bg-gradient-to-br from-gray-50 to-white border-b border-gray-100", children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-8 py-24", children: (0,jsx_runtime.jsxs)("div", { className: "text-center mb-16 animate-fade-in", children: [(0,jsx_runtime.jsx)("h1", { className: "text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up", children: t('crew.savedCrew') }), (0,jsx_runtime.jsx)("h2", { className: "text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay", children: t('crew.crewProfiles') }), (0,jsx_runtime.jsx)("p", { className: "text-xl font-light text-gray-500 max-w-2xl mx-auto animate-slide-up-delay-2", children: t('crew.curatedCollection') })] }) }) }), (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-8 py-16", children: savedProfiles.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-16", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-6", children: "\uD83D\uDCC1" }), (0,jsx_runtime.jsx)("h3", { className: "text-2xl font-light text-gray-900 mb-4 tracking-wide", children: t('crew.noSavedProfiles') }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 font-light mb-8 max-w-md mx-auto", children: t('crew.startBuilding') }), (0,jsx_runtime.jsxs)("a", { href: "/producer-view", className: "inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-light tracking-wide hover:bg-black transition-all duration-300 hover:scale-105", children: [t('crew.browseCrewProfiles'), " \u2192"] })] })) : ((0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", children: savedProfiles.map((profile, index) => ((0,jsx_runtime.jsx)("div", { className: "animate-card-entrance", style: { animationDelay: `${index * 100}ms` }, children: (0,jsx_runtime.jsx)(components_CrewProfileCard, { profile: profile }) }, profile.uid))) })) })] }));
};
/* harmony default export */ const pages_SavedCrewProfilesPage = (SavedCrewProfilesPage);


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


/***/ })

}]);
//# sourceMappingURL=3608.chunk.js.map