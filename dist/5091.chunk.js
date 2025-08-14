"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[5091],{

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

/***/ 697:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Plus)
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
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("plus", __iconNode);


//# sourceMappingURL=plus.js.map


/***/ }),

/***/ 774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7106);
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

/***/ 835:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lx: () => (/* binding */ getProfileId),
/* harmony export */   Mn: () => (/* binding */ getDisplayName),
/* harmony export */   ed: () => (/* binding */ getPhotoUrl),
/* harmony export */   pu: () => (/* binding */ isCrewProfile)
/* harmony export */ });
/* unused harmony export isUserProfile */
// Type guard to check if a profile is a CrewProfile
function isCrewProfile(profile) {
    return 'jobTitles' in profile && 'residences' in profile;
}
// Type guard to check if a profile is a UserProfile
function isUserProfile(profile) {
    return !isCrewProfile(profile);
}
// Helper function to get a display name from any profile type
function getDisplayName(profile) {
    // Try all possible name/display fields for maximum compatibility
    if (isCrewProfile(profile)) {
        return (profile.name ||
            profile.displayName ||
            'Unknown Crew');
    }
    return (profile.displayName ||
        profile.name ||
        profile.firstName ||
        profile.username ||
        (typeof profile.email === 'string' ? profile.email.split('@')[0] : undefined) ||
        'Unknown User');
}
// Helper function to get a photo URL from any profile type
function getPhotoUrl(profile) {
    // Try all possible image fields for maximum compatibility, fallback to default
    let url = undefined;
    if (isCrewProfile(profile)) {
        url = profile.profileImageUrl || profile.photoURL || profile.avatarUrl;
    }
    else {
        url = profile.avatarUrl || profile.photoURL || profile.profileImageUrl;
    }
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return '/default-avatar.svg';
    }
    return url;
}
// Helper to get the ID from any profile type
function getProfileId(profile) {
    if (isCrewProfile(profile)) {
        return profile.uid || profile.id;
    }
    return profile.id;
}


/***/ }),

/***/ 5091:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_SocialPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user-x.js
var user_x = __webpack_require__(6079);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user-check.js
var user_check = __webpack_require__(7623);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/x.js
var x = __webpack_require__(8697);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/user-plus.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = (0,createLucideIcon/* default */.A)("user-plus", __iconNode);


//# sourceMappingURL=user-plus.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bell.js
var bell = __webpack_require__(9436);
;// ./node_modules/lucide-react/dist/esm/icons/message-circle.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const message_circle_iconNode = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = (0,createLucideIcon/* default */.A)("message-circle", message_circle_iconNode);


//# sourceMappingURL=message-circle.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/plus.js
var plus = __webpack_require__(697);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/search.js
var search = __webpack_require__(8445);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/send.js
var send = __webpack_require__(7775);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./src/utilities/socialService.ts
var socialService = __webpack_require__(9505);
// EXTERNAL MODULE: ./src/utilities/messagingService.ts
var messagingService = __webpack_require__(4672);
// EXTERNAL MODULE: ./src/types/Profile.ts
var Profile = __webpack_require__(835);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./src/components/ui/Input.tsx
var Input = __webpack_require__(6680);
// EXTERNAL MODULE: ./src/components/ui/Avatar.tsx
var Avatar = __webpack_require__(633);
// EXTERNAL MODULE: ./src/lib/utils.ts
var utils = __webpack_require__(9973);
;// ./src/components/ui/Badge.tsx


const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground border-border',
};
function Badge({ className, variant = 'default', ...props }) {
    return ((0,jsx_runtime.jsx)("div", { className: (0,utils.cn)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variantClasses[variant], className), ...props }));
}


;// ./src/components/ui/Skeleton.tsx


function Skeleton({ className, ...props }) {
    return ((0,jsx_runtime.jsx)("div", { className: (0,utils.cn)("animate-pulse rounded-md bg-gray-100", className), ...props }));
}


// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var react_hot_toast_dist = __webpack_require__(888);
;// ./src/pages/SocialPage.tsx















// Enhanced tab component with better styling
const TabButton = ({ active, onClick, children, count, icon: Icon }) => ((0,jsx_runtime.jsxs)("button", { onClick: onClick, className: `flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-lg transition-all relative ${active
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`, children: [(0,jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${active ? 'text-blue-600' : 'text-gray-500'}` }), (0,jsx_runtime.jsx)("span", { children: children }), count !== undefined && count > 0 && ((0,jsx_runtime.jsx)("span", { className: "ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700", children: count }))] }));
const SocialPage = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const auth = (0,AuthContext/* useAuth */.A)();
    const user = auth?.currentUser; // Access currentUser instead of user
    const navigate = (0,dist/* useNavigate */.Zp)();
    const location = (0,dist/* useLocation */.zy)();
    const [activeTab, setActiveTab] = (0,react.useState)('connections');
    const [searchQuery, setSearchQuery] = (0,react.useState)('');
    // Define the profile state with proper typing
    const [allProfiles, setAllProfiles] = (0,react.useState)([]);
    const [filteredProfiles, setFilteredProfiles] = (0,react.useState)([]);
    const [connectionRequests, setConnectionRequests] = (0,react.useState)([]);
    const [sentRequests, setSentRequests] = (0,react.useState)([]);
    const [connections, setConnections] = (0,react.useState)([]);
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    // Messaging state
    const [showMessagePane, setShowMessagePane] = (0,react.useState)(false);
    const [showStartConversation, setShowStartConversation] = (0,react.useState)(false);
    const [conversations, setConversations] = (0,react.useState)([]);
    const [messageSearchQuery, setMessageSearchQuery] = (0,react.useState)('');
    // Load initial data
    const loadData = (0,react.useCallback)(async () => {
        const currentUser = auth?.currentUser;
        if (!currentUser?.uid)
            return;
        setIsLoading(true);
        try {
            // Only fetch crew profiles for discovery tab
            const profiles = await socialService/* SocialService */.l.getCrewProfiles();
            // Map the profiles to the correct shape for discovery
            const mappedProfiles = profiles.map((profile) => {
                const id = profile.id || '';
                const displayName = profile.displayName || profile.name || 'Unknown User';
                const photoURL = profile.photoURL || profile.profileImageUrl || '';
                const bio = profile.bio || '';
                if ((0,Profile/* isCrewProfile */.pu)(profile)) {
                    // Create a CrewProfile
                    const crewProfile = {
                        id,
                        type: 'crew',
                        uid: profile.uid || id,
                        displayName,
                        photoURL,
                        bio,
                        name: profile.name || displayName,
                        username: profile.username ||
                            profile.email ? String(profile.email).split('@')[0] : '',
                        jobTitles: Array.isArray(profile.jobTitles) ? [...profile.jobTitles] : [],
                        residences: Array.isArray(profile.residences) ? [...profile.residences] : [],
                        isPublished: profile.isPublished !== undefined ? Boolean(profile.isPublished) : true,
                    };
                    return crewProfile;
                }
                else {
                    // Create a UserProfile
                    const userProfile = {
                        id,
                        type: 'user',
                        displayName,
                        photoURL,
                        bio,
                        email: profile.email || '',
                        phoneNumber: profile.phoneNumber,
                    };
                    return userProfile;
                }
            });
            // Set profiles for discovery only
            setAllProfiles(mappedProfiles);
            setFilteredProfiles(mappedProfiles);
            // Load ACTUAL user-specific social data
            try {
                // Helper function to fetch user profile data (using only crewProfiles)
                const fetchUserProfile = async (userId) => {
                    try {
                        // Only use crewProfiles collection (single source of truth)
                        const { getDoc, doc } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 7594));
                        const { db } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 9487));
                        const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
                        if (crewDoc.exists()) {
                            const crewData = crewDoc.data();
                            // Use the same logic as discover section
                            const id = crewData.id || userId;
                            const displayName = crewData.displayName || crewData.name || 'Unknown User';
                            const photoURL = crewData.photoURL || crewData.profileImageUrl || '';
                            const bio = crewData.bio || '';
                            return {
                                id,
                                type: 'crew',
                                uid: userId,
                                displayName,
                                photoURL,
                                bio,
                                name: crewData.name || displayName,
                                username: crewData.username || (crewData.email ? String(crewData.email).split('@')[0] : ''),
                                jobTitles: Array.isArray(crewData.jobTitles) ? [...crewData.jobTitles] : [],
                                residences: Array.isArray(crewData.residences) ? [...crewData.residences] : [],
                                isPublished: crewData.isPublished !== undefined ? Boolean(crewData.isPublished) : true,
                            };
                        }
                        // Fallback if no profile found in crewProfiles
                        return {
                            id: userId,
                            type: 'user',
                            displayName: `User ${userId.slice(0, 6)}`,
                            photoURL: '',
                            bio: '',
                            email: ''
                        };
                    }
                    catch (error) {
                        console.error('Error fetching user profile:', error);
                        return {
                            id: userId,
                            type: 'user',
                            displayName: `User ${userId.slice(0, 6)}`,
                            photoURL: '',
                            bio: '',
                            email: ''
                        };
                    }
                };
                // Load incoming requests (incoming) - use subscription once
                const incomingRequestsPromise = new Promise((resolve) => {
                    const unsubscribe = socialService/* SocialService */.l.subscribeToFollowRequests(currentUser.uid, (requests) => {
                        unsubscribe();
                        resolve(requests);
                    });
                });
                const realIncomingRequests = await incomingRequestsPromise;
                const mappedIncomingRequests = await Promise.all(realIncomingRequests.map(async (req) => {
                    const userProfile = await fetchUserProfile(req.fromUserId);
                    return userProfile;
                }));
                setConnectionRequests(mappedIncomingRequests);
                // Load real sent requests (outgoing) - use subscription once
                const outgoingRequestsPromise = new Promise((resolve) => {
                    const unsubscribe = socialService/* SocialService */.l.subscribeToOutgoingFollowRequests(currentUser.uid, (requests) => {
                        unsubscribe();
                        resolve(requests);
                    });
                });
                const realSentRequests = await outgoingRequestsPromise;
                const mappedSentRequests = await Promise.all(realSentRequests.map(async (req) => {
                    const userProfile = await fetchUserProfile(req.toUserId);
                    return userProfile;
                }));
                setSentRequests(mappedSentRequests);
            }
            catch (socialError) {
                console.log('Social data loading (expected for new users):', socialError);
                // For new users, these should be empty
                setConnectionRequests([]);
                setSentRequests([]);
                setConnections([]);
            }
        }
        catch (error) {
            console.error('Error loading profiles:', error);
            // Clear all data on error
            setAllProfiles([]);
            setFilteredProfiles([]);
            setConnectionRequests([]);
            setSentRequests([]);
            setConnections([]);
        }
        finally {
            setIsLoading(false);
        }
    }, [auth]);
    // Load data on component mount and when active tab changes
    (0,react.useEffect)(() => {
        // Clear the user cache to ensure new logic takes effect
        const clearCache = async () => {
            try {
                const { UserUtils } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 1055));
                UserUtils.refreshUserCache();
            }
            catch (error) {
                console.error('Error clearing user cache:', error);
            }
        };
        clearCache();
        loadData();
    }, [activeTab, user?.uid]);
    // Handle URL parameters for tab navigation
    (0,react.useEffect)(() => {
        const searchParams = new URLSearchParams(location.search);
        const tabParam = searchParams.get('tab');
        if (tabParam && ['connections', 'requests', 'discover', 'notifications'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [location.search]);
    // Set up ongoing subscriptions for real-time updates
    (0,react.useEffect)(() => {
        const currentUser = auth?.currentUser;
        if (!currentUser?.uid)
            return;
        // Helper function to fetch user profile data
        const fetchUserProfile = async (userId) => {
            try {
                const { getDoc, doc } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 7594));
                const { db } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 9487));
                const crewDoc = await getDoc(doc(db, 'crewProfiles', userId));
                if (crewDoc.exists()) {
                    const crewData = crewDoc.data();
                    const id = crewData.id || userId;
                    const displayName = crewData.displayName || crewData.name || 'Unknown User';
                    const photoURL = crewData.photoURL || crewData.profileImageUrl || '';
                    const bio = crewData.bio || '';
                    return {
                        id,
                        type: 'crew',
                        uid: userId,
                        displayName,
                        photoURL,
                        bio,
                        name: crewData.name || displayName,
                        username: crewData.username || (crewData.email ? String(crewData.email).split('@')[0] : ''),
                        jobTitles: Array.isArray(crewData.jobTitles) ? [...crewData.jobTitles] : [],
                        residences: Array.isArray(crewData.residences) ? [...crewData.residences] : [],
                        isPublished: crewData.isPublished !== undefined ? Boolean(crewData.isPublished) : true,
                    };
                }
                return {
                    id: userId,
                    type: 'user',
                    displayName: `User ${userId.slice(0, 6)}`,
                    photoURL: '',
                    bio: '',
                    email: ''
                };
            }
            catch (error) {
                console.error('Error fetching user profile:', error);
                return {
                    id: userId,
                    type: 'user',
                    displayName: `User ${userId.slice(0, 6)}`,
                    photoURL: '',
                    bio: '',
                    email: ''
                };
            }
        };
        // Set up subscription for incoming requests
        const incomingUnsubscribe = socialService/* SocialService */.l.subscribeToFollowRequests(currentUser.uid, async (requests) => {
            const mappedRequests = await Promise.all(requests.map(async (req) => {
                const userProfile = await fetchUserProfile(req.fromUserId);
                return { ...userProfile, requestId: req.id };
            }));
            setConnectionRequests(mappedRequests);
        });
        // Set up subscription for sent requests
        const outgoingUnsubscribe = socialService/* SocialService */.l.subscribeToOutgoingFollowRequests(currentUser.uid, async (requests) => {
            const mappedRequests = await Promise.all(requests.map(async (req) => {
                const userProfile = await fetchUserProfile(req.toUserId);
                return userProfile;
            }));
            setSentRequests(mappedRequests);
        });
        // Set up subscription for connections (people I'm following)
        const connectionsUnsubscribe = socialService/* SocialService */.l.subscribeToFollowing(currentUser.uid, async (follows) => {
            const mappedConnections = await Promise.all(follows.map(async (conn) => {
                const userProfile = await fetchUserProfile(conn.followingId);
                return userProfile;
            }));
            setConnections(mappedConnections);
        });
        // Cleanup subscriptions on unmount or when user changes
        return () => {
            incomingUnsubscribe();
            outgoingUnsubscribe();
            connectionsUnsubscribe();
        };
    }, [auth?.currentUser?.uid]);
    // Filter profiles based on search query and active tab
    const filteredItems = (0,react.useMemo)(() => {
        const items = {
            connections: [...connections],
            requests: [...connectionRequests, ...sentRequests],
            discover: [...filteredProfiles],
            notifications: []
        }[activeTab] || [];
        if (!searchQuery.trim())
            return items;
        const query = searchQuery.toLowerCase();
        return items.filter((p) => {
            const name = (0,Profile/* getDisplayName */.Mn)(p).toLowerCase();
            const bio = p.bio ? p.bio.toLowerCase() : '';
            return name.includes(query) || bio.includes(query);
        });
    }, [activeTab, connections, connectionRequests, sentRequests, filteredProfiles, searchQuery]);
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    // Handle tab change
    const handleTabChange = (value) => {
        setActiveTab(value);
        setSearchQuery('');
        // Update URL with tab parameter
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('tab', value);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    };
    // Handle follow/unfollow action
    const handleFollowChange = async (profileId, follow) => {
        if (!user?.uid)
            return;
        try {
            if (follow) {
                await socialService/* SocialService */.l.sendFollowRequest(user.uid, profileId);
                react_hot_toast_dist/* toast */.oR.success('Follow request sent!');
            }
            else {
                await socialService/* SocialService */.l.unfollow(user.uid, profileId);
                react_hot_toast_dist/* toast */.oR.success('Unfollowed successfully');
            }
            await loadData();
        }
        catch (error) {
            console.error('Error updating follow status:', error);
            react_hot_toast_dist/* toast */.oR.error(follow ? 'Failed to send follow request' : 'Failed to unfollow');
        }
    };
    // Handle follow request response (accept/reject)
    const handleFollowRequest = async (userId, action) => {
        // Find the follow request for this user
        const request = connectionRequests.find(p => (0,Profile/* getProfileId */.Lx)(p) === userId);
        if (!request)
            return;
        try {
            await socialService/* SocialService */.l.respondToFollowRequest(request.requestId, action === 'accept' ? 'accepted' : 'rejected');
            // Update local state after backend call
            if (action === 'accept') {
                setConnections(prev => [...prev, request]);
                react_hot_toast_dist/* toast */.oR.success('Follow request accepted!');
            }
            else {
                react_hot_toast_dist/* toast */.oR.success('Follow request rejected.');
            }
            setConnectionRequests(prev => prev.filter(p => (0,Profile/* getProfileId */.Lx)(p) !== userId));
        }
        catch (error) {
            console.error(`Error ${action}ing follow request:`, error);
            react_hot_toast_dist/* toast */.oR.error(`Failed to ${action} follow request. Please try again.`);
        }
    };
    // Handle canceling sent follow requests
    const handleCancelSentRequest = async (userId) => {
        if (!user?.uid)
            return;
        try {
            await socialService/* SocialService */.l.cancelFollowRequest(user.uid, userId);
            react_hot_toast_dist/* toast */.oR.success('Follow request canceled successfully');
            // The sentRequests will be updated automatically by the subscription
        }
        catch (error) {
            console.error('Error canceling follow request:', error);
            react_hot_toast_dist/* toast */.oR.error('Failed to cancel follow request. Please try again.');
        }
    };
    // Messaging functions
    const loadConversations = (0,react.useCallback)(async () => {
        if (!user?.uid)
            return;
        const unsubscribe = messagingService.MessagingService.subscribeToConversations(user.uid, (conversations) => {
            setConversations(conversations);
        });
        return unsubscribe;
    }, [user?.uid]);
    const handleStartConversation = (userId) => {
        if (!userId) {
            setShowStartConversation(true);
            setShowMessagePane(false);
        }
        else {
            // Navigate to chat or open chat interface
            setShowMessagePane(false);
            setShowStartConversation(false);
            console.log('Starting conversation with:', userId);
        }
    };
    const formatTime = (date) => {
        if (!date)
            return '';
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        else if (days === 1) {
            return 'Yesterday';
        }
        else if (days < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };
    // Load conversations when component mounts or when message pane is opened
    (0,react.useEffect)(() => {
        if (user?.uid && showMessagePane) {
            loadConversations();
        }
    }, [user?.uid, showMessagePane, loadConversations]);
    // Helper function to render user cards
    const renderUserCard = (profile, action) => {
        const avatarUrl = profile.photoURL || profile.profileImageUrl || '/default-avatar.svg';
        const displayName = profile.displayName || profile.name || 'User';
        const jobTitle = profile.type === 'crew' ? profile.jobTitles?.[0]?.title : undefined;
        return ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-4", children: [(0,jsx_runtime.jsx)("img", { src: avatarUrl, alt: displayName, className: "h-12 w-12 rounded-full object-cover object-center flex-shrink-0", onError: (e) => {
                                const target = e.target;
                                target.src = '/default-avatar.svg';
                            } }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: displayName }), jobTitle && (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 font-medium", children: jobTitle }), profile.bio && (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500 line-clamp-1", children: profile.bio })] })] }), action] }, (0,Profile/* getProfileId */.Lx)(profile)));
    };
    // Render content based on active tab
    const renderTabContent = () => {
        if (!user) {
            return ((0,jsx_runtime.jsx)("div", { className: "text-center py-12", children: (0,jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Please sign in to view this page" }) }));
        }
        if (isLoading) {
            return ((0,jsx_runtime.jsx)("div", { className: "flex justify-center py-12", children: (0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }) }));
        }
        switch (activeTab) {
            case 'connections':
                return ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold mb-4", children: "Your Connections" }), connections.length > 0 ? ((0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: connections.map((profile) => ((0,jsx_runtime.jsx)(UserCard, { profile: profile, action: (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", className: "whitespace-nowrap text-xs px-3 py-1.5", onClick: () => handleFollowChange((0,Profile/* getProfileId */.Lx)(profile), false), children: [(0,jsx_runtime.jsx)(user_x/* default */.A, { className: "h-3.5 w-3.5 mr-1.5" }), t('social.actions.unfollow')] }) }, (0,Profile/* getProfileId */.Lx)(profile)))) })) : ((0,jsx_runtime.jsx)("p", { className: "text-gray-500", children: "You don't have any connections yet." }))] }));
            case 'requests':
                return ((0,jsx_runtime.jsxs)("div", { className: "space-y-4", children: [connectionRequests.length > 0 && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium mb-2", children: t('social.headers.connectionRequests') }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6", children: connectionRequests.map((profile) => ((0,jsx_runtime.jsx)(UserCard, { profile: profile, action: (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "default", size: "sm", className: "whitespace-nowrap", onClick: () => handleFollowRequest((0,Profile/* getProfileId */.Lx)(profile), 'accept'), children: [(0,jsx_runtime.jsx)(user_check/* default */.A, { className: "h-4 w-4 mr-2" }), t('social.actions.accept')] }) }, (0,Profile/* getProfileId */.Lx)(profile)))) })] })), sentRequests.length > 0 && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium mb-2", children: t('social.headers.sentRequests') }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: sentRequests.map((profile) => ((0,jsx_runtime.jsx)(UserCard, { profile: profile, action: (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", className: "whitespace-nowrap", onClick: () => handleCancelSentRequest((0,Profile/* getProfileId */.Lx)(profile)), children: [(0,jsx_runtime.jsx)(x/* default */.A, { className: "h-4 w-4 mr-2" }), "Cancel"] }) }, (0,Profile/* getProfileId */.Lx)(profile)))) })] })), connectionRequests.length === 0 && sentRequests.length === 0 && ((0,jsx_runtime.jsx)("p", { className: "text-gray-500", children: t('social.empty.noRequests') }))] }));
            case 'discover':
                return ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold mb-4", children: t('social.headers.discoverPeople') }), filteredProfiles.length > 0 ? ((0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredProfiles.map((profile) => ((0,jsx_runtime.jsx)(UserCard, { profile: profile, action: (0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "default", size: "sm", className: "whitespace-nowrap", onClick: () => handleFollowChange((0,Profile/* getProfileId */.Lx)(profile), true), children: [(0,jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4 mr-2" }), t('social.actions.follow')] }) }, (0,Profile/* getProfileId */.Lx)(profile)))) })) : ((0,jsx_runtime.jsx)("p", { className: "text-gray-500", children: "No suggestions found." }))] }));
            case 'notifications':
            default:
                return ((0,jsx_runtime.jsxs)("div", { className: "text-center py-12", children: [(0,jsx_runtime.jsx)(bell/* default */.A, { className: "h-12 w-12 text-gray-300 mx-auto mb-4" }), (0,jsx_runtime.jsx)("h2", { className: "text-xl font-semibold text-gray-700 mb-2", children: t('social.empty.noNotifications') }), (0,jsx_runtime.jsx)("p", { className: "text-gray-500", children: t('social.headers.yourNotifications') })] }));
        }
    };
    // User card component
    const UserCard = ({ profile, action, showBio = true }) => {
        // Get the proper avatar and display name like crew cards do
        const avatarUrl = profile.photoURL || profile.profileImageUrl || '/default-avatar.svg';
        const displayName = profile.displayName || profile.name || 'User';
        const jobTitle = profile.type === 'crew' ? profile.jobTitles?.[0]?.title : undefined;
        return ((0,jsx_runtime.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow", children: (0,jsx_runtime.jsx)("div", { className: "p-4", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-start justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-3", children: [(0,jsx_runtime.jsx)("img", { src: avatarUrl, alt: displayName, className: "h-12 w-12 rounded-full object-cover object-center flex-shrink-0", onError: (e) => {
                                        const target = e.target;
                                        target.src = '/default-avatar.svg';
                                    } }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,jsx_runtime.jsx)("h3", { className: "font-medium text-gray-900", children: displayName }), jobTitle && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 font-medium", children: jobTitle })), showBio && profile.bio && ((0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500 line-clamp-2 mt-1", children: profile.bio }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex-shrink-0 ml-2 flex items-center space-x-2", children: [action, activeTab === 'connections' && ((0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "ghost", size: "sm", className: "h-9 w-9 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700", onClick: () => handleStartConversation((0,Profile/* getProfileId */.Lx)(profile)), children: (0,jsx_runtime.jsx)(MessageCircle, { className: "h-5 w-5" }) }))] })] }) }) }));
    };
    // Loading skeleton
    if (isLoading) {
        return ((0,jsx_runtime.jsx)("div", { className: "container mx-auto px-4 py-8", children: (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [...Array(6)].map((_, i) => ((0,jsx_runtime.jsx)("div", { className: "bg-white rounded-xl border border-gray-200 p-4", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [(0,jsx_runtime.jsx)(Skeleton, { className: "h-12 w-12 rounded-full" }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 space-y-2", children: [(0,jsx_runtime.jsx)(Skeleton, { className: "h-4 w-3/4" }), (0,jsx_runtime.jsx)(Skeleton, { className: "h-3 w-full" }), (0,jsx_runtime.jsx)(Skeleton, { className: "h-3 w-1/2" })] })] }) }, i))) }) }));
    }
    // Message Pane Component
    const MessagePane = () => {
        if (!showMessagePane)
            return null;
        const filteredConversations = conversations.filter(conv => !messageSearchQuery.trim() ||
            conv.userName.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
            (conv.lastMessage && conv.lastMessage.toLowerCase().includes(messageSearchQuery.toLowerCase())));
        return ((0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4", children: (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Messages" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [(0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "ghost", size: "sm", onClick: () => handleStartConversation(''), className: "h-8 w-8 p-0", children: (0,jsx_runtime.jsx)(plus/* default */.A, { className: "h-4 w-4" }) }), (0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "ghost", size: "sm", onClick: () => setShowMessagePane(false), className: "h-8 w-8 p-0", children: (0,jsx_runtime.jsx)(x/* default */.A, { className: "h-4 w-4" }) })] })] }), (0,jsx_runtime.jsx)("div", { className: "p-4 border-b border-gray-200", children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { type: "text", placeholder: "Search conversations...", value: messageSearchQuery, onChange: (e) => setMessageSearchQuery(e.target.value), className: "pl-10" })] }) }), (0,jsx_runtime.jsx)("div", { className: "flex-1 overflow-y-auto", children: filteredConversations.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "p-8 text-center", children: [(0,jsx_runtime.jsx)(MessageCircle, { className: "h-12 w-12 mx-auto text-gray-300 mb-4" }), (0,jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: messageSearchQuery ? 'No conversations found' : 'No messages yet' }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: messageSearchQuery
                                        ? 'Try a different search term'
                                        : 'Start a conversation with someone to see messages here' })] })) : ((0,jsx_runtime.jsx)("div", { className: "p-2", children: filteredConversations.map((conversation) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors", onClick: () => handleStartConversation(conversation.userId), children: [(0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsxs)(Avatar/* Avatar */.eu, { className: "h-10 w-10", children: [(0,jsx_runtime.jsx)(Avatar/* AvatarImage */.BK, { src: conversation.userAvatar, alt: conversation.userName }), (0,jsx_runtime.jsx)(Avatar/* AvatarFallback */.q5, { className: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm", children: conversation.userName
                                                            .split(' ')
                                                            .map(n => n[0])
                                                            .join('')
                                                            .toUpperCase() })] }), conversation.isOnline && ((0,jsx_runtime.jsx)("div", { className: "absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" }))] }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsx)("h4", { className: "text-sm font-medium text-gray-900 truncate", children: conversation.userName }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [conversation.unreadCount > 0 && ((0,jsx_runtime.jsx)(Badge, { className: "h-5 w-5 p-0 text-xs bg-blue-600 text-white", children: conversation.unreadCount })), (0,jsx_runtime.jsx)("span", { className: "text-xs text-gray-500", children: formatTime(conversation.lastMessageTime) })] })] }), conversation.lastMessage && ((0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-600 truncate mt-1", children: conversation.lastMessage })), conversation.userRole && ((0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: conversation.userRole }))] })] }, conversation.userId))) })) })] }) }));
    };
    // Start Conversation Modal Component
    const StartConversationModal = () => {
        if (!showStartConversation)
            return null;
        const [searchResults, setSearchResults] = (0,react.useState)([]);
        const [isSearching, setIsSearching] = (0,react.useState)(false);
        const searchUsers = (0,react.useCallback)(async (query) => {
            if (!query.trim() || !user?.uid) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                // Search through connections and discover profiles
                const allUsers = [...connections, ...filteredProfiles];
                const filtered = allUsers.filter(profile => (0,Profile/* getProfileId */.Lx)(profile) !== user.uid &&
                    (profile.displayName?.toLowerCase().includes(query.toLowerCase()) ||
                        profile.name?.toLowerCase().includes(query.toLowerCase()) ||
                        profile.email?.toLowerCase().includes(query.toLowerCase())));
                setSearchResults(filtered.slice(0, 10));
            }
            catch (error) {
                console.error('Error searching users:', error);
                setSearchResults([]);
            }
            finally {
                setIsSearching(false);
            }
        }, [connections, filteredProfiles, user?.uid]);
        (0,react.useEffect)(() => {
            const timeoutId = setTimeout(() => {
                searchUsers(messageSearchQuery);
            }, 300);
            return () => clearTimeout(timeoutId);
        }, [messageSearchQuery, searchUsers]);
        return ((0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4", children: (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "New Message" }), (0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "ghost", size: "sm", onClick: () => setShowStartConversation(false), className: "h-8 w-8 p-0", children: (0,jsx_runtime.jsx)(x/* default */.A, { className: "h-4 w-4" }) })] }), (0,jsx_runtime.jsx)("div", { className: "p-4 border-b border-gray-200", children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { type: "text", placeholder: "Search people...", value: messageSearchQuery, onChange: (e) => setMessageSearchQuery(e.target.value), className: "pl-10" })] }) }), (0,jsx_runtime.jsx)("div", { className: "flex-1 overflow-y-auto", children: isSearching ? ((0,jsx_runtime.jsx)("div", { className: "p-4 space-y-3", children: Array.from({ length: 3 }).map((_, i) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [(0,jsx_runtime.jsx)(Skeleton, { className: "h-10 w-10 rounded-full" }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 space-y-2", children: [(0,jsx_runtime.jsx)(Skeleton, { className: "h-4 w-24" }), (0,jsx_runtime.jsx)(Skeleton, { className: "h-3 w-32" })] })] }, i))) })) : searchResults.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "p-8 text-center", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "h-12 w-12 mx-auto text-gray-300 mb-4" }), (0,jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: messageSearchQuery ? 'No people found' : 'Search for people to message' }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: messageSearchQuery
                                        ? 'Try a different search term'
                                        : 'Start typing to search for people in your network' })] })) : ((0,jsx_runtime.jsx)("div", { className: "p-2", children: searchResults.map((profile) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors", onClick: () => {
                                    handleStartConversation((0,Profile/* getProfileId */.Lx)(profile));
                                    setShowStartConversation(false);
                                }, children: [(0,jsx_runtime.jsxs)(Avatar/* Avatar */.eu, { className: "h-10 w-10", children: [(0,jsx_runtime.jsx)(Avatar/* AvatarImage */.BK, { src: profile.photoURL || profile.profileImageUrl, alt: profile.displayName }), (0,jsx_runtime.jsx)(Avatar/* AvatarFallback */.q5, { className: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm", children: profile.displayName
                                                    .split(' ')
                                                    .map(n => n[0])
                                                    .join('')
                                                    .toUpperCase() })] }), (0,jsx_runtime.jsxs)("div", { className: "flex-1 min-w-0", children: [(0,jsx_runtime.jsx)("h4", { className: "text-sm font-medium text-gray-900 truncate", children: profile.displayName }), profile.type === 'crew' && profile.jobTitles?.[0]?.title && ((0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 truncate", children: profile.jobTitles[0].title }))] }), (0,jsx_runtime.jsx)(Button/* Button */.$, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", children: (0,jsx_runtime.jsx)(send/* default */.A, { className: "h-4 w-4" }) })] }, (0,Profile/* getProfileId */.Lx)(profile)))) })) })] }) }));
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "container mx-auto px-4 py-6 max-w-7xl", children: [(0,jsx_runtime.jsxs)("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: t('social.title') }), (0,jsx_runtime.jsx)("p", { className: "text-gray-500", children: t('social.subtitle') })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [(0,jsx_runtime.jsxs)(Button/* Button */.$, { variant: "outline", size: "sm", onClick: () => {
                                    // Navigate to full messaging environment
                                    navigate('/chat');
                                }, className: "flex items-center space-x-2", children: [(0,jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), (0,jsx_runtime.jsx)("span", { children: t('social.messages') })] }), (0,jsx_runtime.jsx)("div", { className: "w-full md:w-96", children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { type: "text", placeholder: t('social.searchPeople'), className: "pl-10 w-full", value: searchQuery, onChange: handleSearchChange })] }) })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex space-x-4 mb-6 overflow-x-auto pb-2", children: [(0,jsx_runtime.jsx)(TabButton, { active: activeTab === 'connections', onClick: () => handleTabChange('connections'), icon: user_check/* default */.A, children: t('social.tabs.connections') }), (0,jsx_runtime.jsx)(TabButton, { active: activeTab === 'requests', onClick: () => handleTabChange('requests'), count: connectionRequests.length, icon: user_x/* default */.A, children: t('social.tabs.requests') }), (0,jsx_runtime.jsx)(TabButton, { active: activeTab === 'discover', onClick: () => handleTabChange('discover'), icon: UserPlus, children: t('social.tabs.discover') }), (0,jsx_runtime.jsx)(TabButton, { active: activeTab === 'notifications', onClick: () => handleTabChange('notifications'), icon: bell/* default */.A, children: t('social.tabs.notifications') })] }), (0,jsx_runtime.jsx)("div", { className: "space-y-6", children: renderTabContent() }), (0,jsx_runtime.jsx)(MessagePane, {}), (0,jsx_runtime.jsx)(StartConversationModal, {})] }));
};
/* harmony default export */ const pages_SocialPage = (SocialPage);


/***/ }),

/***/ 6079:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ UserX)
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
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("user-x", __iconNode);


//# sourceMappingURL=user-x.js.map


/***/ }),

/***/ 6680:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _theme_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3049);



const Input = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ label, error, leftIcon, rightIcon, className = '', containerClassName = '', labelClassName = '', errorClassName = '', variant = 'outline', inputSize = 'md', id, disabled, onFocus, onBlur, ...props }, ref) => {
    const { theme } = (0,_theme_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__/* .useTheme */ .DP)();
    const [isFocused, setIsFocused] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const inputId = id || react__WEBPACK_IMPORTED_MODULE_1__.useId();
    // Map our custom size to the appropriate classes
    const sizeClasses = {
        sm: 'h-8 text-xs px-2.5 py-1.5',
        md: 'h-10 text-sm px-3 py-2',
        lg: 'h-12 text-base px-4 py-3',
    }[inputSize || 'md'];
    // Variant classes
    const variantClasses = {
        outline: `bg-transparent border ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500'}`,
        filled: `bg-gray-50 dark:bg-neutral-700/30 border border-transparent ${error
            ? 'focus:border-red-500 focus:ring-red-500'
            : 'focus:border-primary-500 focus:ring-primary-500'}`,
        flushed: `bg-transparent border-0 border-b ${error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 dark:border-neutral-600 focus:border-primary-500'} rounded-none px-0`,
        unstyled: 'bg-transparent border-0 p-0 focus:ring-0',
    }[variant];
    // Label classes
    const labelSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }[inputSize || 'md'];
    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };
    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `w-full ${containerClassName}`, children: [label && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: inputId, className: `block mb-1.5 font-medium text-gray-700 dark:text-gray-200 ${labelSizeClasses} ${labelClassName} ${error ? 'text-red-600 dark:text-red-400' : ''}`, children: label })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative flex items-center ${sizeClasses} ${variantClasses} ${isFocused ? 'ring-1 ring-primary-500' : ''} rounded-md transition-all duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`, children: [leftIcon && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute left-3 flex items-center justify-center text-gray-400 dark:text-gray-400", children: leftIcon })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { ref: ref, id: inputId, className: `w-full h-full bg-transparent border-0 focus:outline-none focus:ring-0 ${leftIcon ? 'pl-9' : 'pl-3'} ${rightIcon ? 'pr-9' : 'pr-3'} ${disabled ? 'cursor-not-allowed' : ''} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`, disabled: disabled, onFocus: handleFocus, onBlur: handleBlur, ...props }), rightIcon && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute right-3 flex items-center justify-center text-gray-400 dark:text-gray-400", children: rightIcon }))] }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: `mt-1.5 text-sm text-red-600 dark:text-red-400 ${errorClassName}`, children: error }))] }));
});
// Add display name for better debugging
Input.displayName = 'Input';

// Also provide a default export for backward compatibility
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (Input)));


/***/ }),

/***/ 7623:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ UserCheck)
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
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("user-check", __iconNode);


//# sourceMappingURL=user-check.js.map


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
//# sourceMappingURL=5091.chunk.js.map