"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[8792],{

/***/ 2096:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony exports app, appHeader, appLink */
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.d6WLOcTu8Dn56sG4Ft2_{font-family:Arial,sans-serif;text-align:center}.GvY0i97YLza1Rs735ams{background-color:#282c34;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:calc(10px + 2vmin);color:#fff}.guSK97Mqlyv2aKS13j3b{color:#61dafb}`, "",{"version":3,"sources":["webpack://./src/App.module.scss"],"names":[],"mappings":"AAEA,sBACE,4BAAA,CACA,iBAAA,CAGF,sBACE,wBAAA,CACA,gBAAA,CACA,YAAA,CACA,qBAAA,CACA,kBAAA,CACA,sBAAA,CACA,4BAAA,CACA,UAAA,CAGF,sBACE,aAAA","sourcesContent":["/* src/App.module.scss */\n\n.app {\n  font-family: Arial, sans-serif;\n  text-align: center;\n}\n\n.appHeader {\n  background-color: #282c34;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  font-size: calc(10px + 2vmin);\n  color: white;\n}\n\n.appLink {\n  color: #61dafb;\n}"],"sourceRoot":""}]);
// Exports
var app = (/* unused pure expression or super */ null && (`d6WLOcTu8Dn56sG4Ft2_`));
var appHeader = (/* unused pure expression or super */ null && (`GvY0i97YLza1Rs735ams`));
var appLink = (/* unused pure expression or super */ null && (`guSK97Mqlyv2aKS13j3b`));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 2584:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ useAuth),
/* harmony export */   O: () => (/* binding */ AuthProvider)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9487);
/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(474);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7594);





const AuthContext = (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);
const useAuth = () => {
    try {
        const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);
        if (context === undefined) {
            console.error('useAuth must be used within an AuthProvider');
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
    }
    catch (error) {
        console.error('Error in useAuth hook:', error);
        throw error;
    }
};
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [userProfile, setUserProfile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    // Add debugging
    console.log('[AuthProvider] Initializing...');
    const login = async (email, password) => {
        await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .signInWithEmailAndPassword */ .x9)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2, email, password);
    };
    const loginWithGoogle = async () => {
        try {
            console.log('[AuthContext] Starting Google sign-in process');
            // Check if Google Auth is available
            if (typeof firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .GoogleAuthProvider */ .HF === 'undefined') {
                throw new Error('Google authentication is not available. Please enable it in Firebase console.');
            }
            const provider = new firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .GoogleAuthProvider */ .HF();
            const result = await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .signInWithPopup */ .df)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2, provider);
            const user = result.user;
            console.log('[AuthContext] Google sign-in successful for:', user.email);
            // Check if user profile exists, if not create it
            await createUserProfileIfNeeded(user);
        }
        catch (error) {
            console.error('[AuthContext] Google sign-in error:', error);
            // Check if the error is due to provider not being enabled
            if (error.code === 'auth/operation-not-allowed') {
                throw new Error('Google sign-in is not enabled. Please enable it in your Firebase console.');
            }
            throw error;
        }
    };
    const loginWithApple = async () => {
        try {
            console.log('[AuthContext] Starting Apple sign-in process');
            // Check if OAuth provider is available
            if (typeof firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .OAuthProvider */ .LD === 'undefined') {
                throw new Error('Apple authentication is not available. Please enable it in Firebase console.');
            }
            const provider = new firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .OAuthProvider */ .LD('apple.com');
            const result = await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .signInWithPopup */ .df)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2, provider);
            const user = result.user;
            console.log('[AuthContext] Apple sign-in successful for:', user.email);
            // Check if user profile exists, if not create it
            await createUserProfileIfNeeded(user);
        }
        catch (error) {
            console.error('[AuthContext] Apple sign-in error:', error);
            // Check if the error is due to provider not being enabled
            if (error.code === 'auth/operation-not-allowed') {
                throw new Error('Apple sign-in is not enabled. Please enable it in your Firebase console.');
            }
            throw error;
        }
    };
    const createUserProfileIfNeeded = async (user) => {
        try {
            // Check if crew profile already exists
            const crewProfileDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'crewProfiles', user.uid));
            if (!crewProfileDoc.exists()) {
                console.log('[AuthContext] Creating crew profile for OAuth user');
                // Create display name from user info or email fallback
                const displayName = user.displayName || user.email?.split('@')[0] || 'User';
                // Create crew profile
                const crewProfileData = {
                    uid: user.uid,
                    name: displayName,
                    email: user.email,
                    bio: '',
                    profileImageUrl: user.photoURL || '/bust-avatar.svg',
                    username: user.email?.split('@')[0] || '',
                    jobTitles: [],
                    residences: [],
                    contactInfo: {
                        email: user.email || '',
                        phone: '',
                        website: '',
                        instagram: ''
                    },
                    languages: [],
                    projects: [],
                    education: [],
                    otherInfo: '',
                    availability: 'available',
                    isPublished: true,
                    createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)(),
                    updatedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)()
                };
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'crewProfiles', user.uid), crewProfileData);
                console.log('[AuthContext] Crew profile created for OAuth user');
                // Create user collections document
                const userCollectionsData = {
                    savedProjects: [],
                    savedCrew: [],
                    createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)(),
                    updatedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)()
                };
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'UserCollections', user.uid), userCollectionsData);
                console.log('[AuthContext] UserCollections document created for OAuth user');
            }
            else {
                console.log('[AuthContext] Crew profile already exists for OAuth user');
            }
        }
        catch (error) {
            console.error('[AuthContext] Error creating user profile for OAuth:', error);
            // Don't throw error here as the user is already signed in
        }
    };
    const signup = async (email, password, firstName, lastName) => {
        try {
            console.log('[AuthContext] Starting signup process for:', email);
            const userCredential = await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .createUserWithEmailAndPassword */ .eJ)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2, email, password);
            const user = userCredential.user;
            console.log('[AuthContext] Firebase Auth user created with UID:', user.uid);
            // Create display name from first/last name or email fallback
            const displayName = (firstName && lastName)
                ? `${firstName} ${lastName}`
                : user.email?.split('@')[0] || 'User';
            console.log('[AuthContext] Display name set to:', displayName);
            // Update Firebase Auth profile
            await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .updateProfile */ .r7)(user, {
                displayName: displayName
            });
            console.log('[AuthContext] Firebase Auth profile updated');
            // Create ONLY the crew profile (this is the single source of truth)
            const crewProfileData = {
                uid: user.uid,
                name: displayName, // This will autopopulate the resume name
                email: user.email,
                bio: '',
                profileImageUrl: '/bust-avatar.svg', // This is what crewProfiles expects
                username: user.email?.split('@')[0] || '',
                jobTitles: [],
                residences: [],
                contactInfo: {
                    email: user.email || '',
                    phone: '',
                    website: '',
                    instagram: ''
                },
                languages: [],
                projects: [],
                education: [],
                otherInfo: '',
                availability: 'available',
                isPublished: true,
                createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)(),
                updatedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)()
            };
            console.log('[AuthContext] Creating crewProfiles document with data:', crewProfileData);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'crewProfiles', user.uid), crewProfileData);
            console.log('[AuthContext] crewProfiles document created successfully');
            // Verify the document was created
            try {
                const verifyDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'crewProfiles', user.uid));
                if (verifyDoc.exists()) {
                    console.log('[AuthContext] ✅ Verification: crewProfiles document exists in Firestore');
                }
                else {
                    console.error('[AuthContext] ❌ Verification: crewProfiles document does not exist in Firestore');
                }
            }
            catch (verifyError) {
                console.error('[AuthContext] ❌ Verification failed:', verifyError);
            }
            // Create user collections document (for favorites, etc.)
            const userCollectionsData = {
                savedProjects: [],
                savedCrew: [],
                createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)(),
                updatedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)()
            };
            console.log('[AuthContext] Creating UserCollections document');
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'UserCollections', user.uid), userCollectionsData);
            console.log('[AuthContext] UserCollections document created successfully');
            console.log('[AuthContext] User created successfully with crewProfiles document only');
        }
        catch (error) {
            console.error('[AuthContext] Error during signup:', error);
            throw error;
        }
    };
    const logout = async () => {
        await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .signOut */ .CI)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2);
    };
    const deleteAccount = async (password) => {
        if (!currentUser) {
            throw new Error('No user is currently signed in');
        }
        try {
            // Check if re-authentication is required
            try {
                // Try to delete user directly first
                await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .deleteUser */ .hG)(currentUser);
            }
            catch (error) {
                if (error.code === 'auth/requires-recent-login') {
                    // Re-authentication required
                    if (!password) {
                        throw new Error('Re-authentication required. Please provide your password.');
                    }
                    // Re-authenticate with email and password
                    const credential = firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .EmailAuthProvider */ .IX.credential(currentUser.email, password);
                    await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .reauthenticateWithCredential */ .kZ)(currentUser, credential);
                    // Now try to delete user again
                    await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .deleteUser */ .hG)(currentUser);
                }
                else {
                    throw error;
                }
            }
            // Delete user data from Firestore
            const batch = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .writeBatch */ .wP)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db);
            // Delete user profile
            batch.delete((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'users', currentUser.uid));
            // Delete crew profile
            batch.delete((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'crewProfiles', currentUser.uid));
            // Delete user collections
            batch.delete((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'UserCollections', currentUser.uid));
            // Delete email tracking
            batch.delete((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'emailTracking', currentUser.email || ''));
            // Execute the batch
            await batch.commit();
            console.log('[AuthContext] Account deleted successfully');
        }
        catch (error) {
            console.error('[AuthContext] Error deleting account:', error);
            throw error;
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        try {
            console.log('[AuthProvider] Setting up auth state listener...');
            const unsubscribe = _firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2.onAuthStateChanged((user) => {
                try {
                    console.log('[AuthProvider] Auth state changed:', user ? 'User logged in' : 'No user');
                    setCurrentUser(user);
                    setLoading(false);
                    // Mock user profile for analytics
                    if (user) {
                        setUserProfile({
                            id: user.uid,
                            email: user.email,
                            displayName: user.displayName || 'User',
                            photoURL: user.photoURL,
                            role: 'crew_member', // Mock role
                            department: 'production', // Mock department
                            experience: 'intermediate', // Mock experience level
                        });
                    }
                    else {
                        setUserProfile(null);
                    }
                }
                catch (error) {
                    console.error('[AuthProvider] Error in auth state change handler:', error);
                    setLoading(false);
                }
            });
            return unsubscribe;
        }
        catch (error) {
            console.error('[AuthProvider] Error setting up auth state listener:', error);
            setLoading(false);
        }
    }, []);
    const value = {
        currentUser,
        loading,
        userProfile,
        login,
        signup,
        loginWithGoogle,
        loginWithApple,
        logout,
        deleteAccount
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AuthContext.Provider, { value: value, children: children }));
};


/***/ }),

/***/ 2612:
/***/ ((module) => {

module.exports = "data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3e%3c/svg%3e";

/***/ }),

/***/ 3049:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  NP: () => (/* binding */ ThemeProvider),
  DP: () => (/* binding */ useTheme)
});

// UNUSED EXPORTS: default

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
;// ./src/theme/theme.config.ts
// Theme configuration for consistent styling across the application
const colors = {
    // Primary colors
    primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9', // Main primary color
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
    },
    // Secondary colors
    secondary: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6', // Main secondary color
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
    },
    // Success colors
    success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
    },
    // Warning colors
    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
    },
    // Error colors
    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },
    // Neutral colors
    neutral: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },
};
const typography = {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSizes: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem', // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem', // 48px
        '6xl': '3.75rem', // 60px
    },
    fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
};
const spacing = {
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
};
const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};
const shadows = {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
};
const borderRadius = {
    none: '0px',
    sm: '0.125rem', // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
};
const zIndex = {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    60: '60',
    70: '70',
    80: '80',
    90: '90',
    100: '100',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800',
};
const transitions = {
    duration: {
        fastest: '150ms',
        faster: '200ms',
        fast: '250ms',
        normal: '300ms',
        slow: '400ms',
        slower: '500ms',
        slowest: '600ms',
    },
    timing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
    },
};
// Export the complete theme object
const theme = {
    colors,
    typography,
    spacing,
    breakpoints,
    shadows,
    borderRadius,
    zIndex,
    transitions,
    // Add any additional theme properties here
};
/* harmony default export */ const theme_config = ((/* unused pure expression or super */ null && (theme)));

;// ./src/theme/ThemeProvider.tsx



// Create context with default values
const ThemeContext = (0,react.createContext)({
    theme: theme,
});
const useTheme = () => (0,react.useContext)(ThemeContext);
const ThemeProvider = ({ children, }) => {
    return ((0,jsx_runtime.jsx)(ThemeContext.Provider, { value: { theme: theme }, children: children }));
};
/* harmony default export */ const theme_ThemeProvider = ((/* unused pure expression or super */ null && (ThemeProvider)));


/***/ }),

/***/ 3414:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(5072);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(7825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(7659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(5056);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(1113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/styles/globals.css
var globals = __webpack_require__(8321);
;// ./src/styles/globals.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(globals/* default */.A, options);




       /* harmony default export */ const styles_globals = (globals/* default */.A && globals/* default */.A.locals ? globals/* default */.A.locals : undefined);

// EXTERNAL MODULE: ./node_modules/i18next/dist/esm/i18next.js
var i18next = __webpack_require__(2635);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
// EXTERNAL MODULE: ./node_modules/i18next-browser-languagedetector/dist/esm/i18nextBrowserLanguageDetector.js
var i18nextBrowserLanguageDetector = __webpack_require__(4997);
;// ./src/locales/en/translation.json
const translation_namespaceObject = /*#__PURE__*/JSON.parse('{"nav":{"home":"Home","crew":"Crew","jobs":"Jobs","projects":"Projects","collaboration":"Collaboration","social":"Social","favorites":"Favorites","resumeBuilder":"Resume Builder","myPostedJobs":"My Posted Jobs","jobAnalytics":"Job Analytics","postNewJob":"Post New Job","myApplications":"My Applications","postedJobs":"Posted Jobs","settings":"Settings","notificationSettings":"Notification Settings","signOut":"Sign Out","signIn":"Sign In","getStarted":"Get Started","chat":"Chat","profile":"Profile","logout":"Logout"},"notificationSettings":{"title":"Notification Settings","general":"General Settings","specific":"Specific Notifications"},"notifications":{"title":"Notifications","search":"Search notifications...","all":"All","unread":"Unread","read":"Read","noResults":"No notifications match your criteria","empty":"No notifications yet"},"home":{"loading":"Loading...","stats":{"activeProfessionals":"Active Professionals","projectsCompleted":"Projects Completed","successRate":"Success Rate","countries":"Countries"},"hero":{"banner":"The Film Industry\'s Premier Networking Platform","title1":"Connect Film","title2":"Professionals","subtitle":"Join thousands of filmmakers, crew members, and industry professionals connecting, collaborating, and creating amazing projects together.","ctaPrimary":"Start Your Journey","ctaSecondary":"Browse Jobs"},"features":{"title":"Everything You Need to Succeed","subtitle":"From project showcase to real-time collaboration, we provide all the tools you need to advance your film career.","projectShowcase":{"title":"Project Showcase","desc":"Display your best work and connect with industry professionals"},"crewNetworking":{"title":"Crew Networking","desc":"Build meaningful connections with talented filmmakers worldwide"},"jobBoard":{"title":"Job Board","desc":"Find and post film production jobs across all departments"},"globalReach":{"title":"Global Reach","desc":"Connect with professionals from around the world"},"industryRecognition":{"title":"Industry Recognition","desc":"Showcase your awards and achievements to stand out"},"realTimeCollab":{"title":"Real-time Collaboration","desc":"Work together seamlessly with integrated communication tools"}},"howItWorks":{"title":"How It Works","subtitle":"Get started in just three simple steps and join the largest film industry network.","step1":{"title":"Create Your Profile","desc":"Build your professional profile and showcase your best work to stand out from the crowd."},"step2":{"title":"Connect & Network","desc":"Find and connect with industry professionals, join projects, and build your network."},"step3":{"title":"Collaborate & Grow","desc":"Work on amazing projects, share opportunities, and grow your career in the film industry."}},"cta":{"title":"Ready to Take Your Career to the Next Level?","subtitle":"Join thousands of film professionals who are already using our platform to grow their careers.","ctaPrimary":"Join the Community","ctaSecondary":"Explore Profiles"}},"auth":{"login":{"title":"Welcome back","subtitle":"Sign in to your account to continue","email":"Email Address","emailPlaceholder":"Enter your email","password":"Password","passwordPlaceholder":"Enter your password","showPassword":"Show password","hidePassword":"Hide password","signingIn":"Signing in...","signIn":"Sign In","continueWithGoogle":"Continue with Google","continueWithApple":"Continue with Apple","or":"or","noAccount":"Don\'t have an account?","createAccount":"Create one here","termsPrivacy":"By signing in, you agree to our","termsService":"Terms of Service","privacyPolicy":"Privacy Policy","and":"and"},"register":{"title":"Create your account","subtitle":"Join My Film Jobs to connect with the film industry","personalInfo":"Personal Information","firstName":"First Name","firstNamePlaceholder":"John","lastName":"Last Name","lastNamePlaceholder":"Doe","accountDetails":"Account Details","email":"Email Address","emailPlaceholder":"john.doe@example.com","password":"Password","passwordPlaceholder":"Create a strong password","passwordHelper":"Must be at least 6 characters long","confirmPassword":"Confirm Password","confirmPasswordPlaceholder":"Confirm your password","creatingAccount":"Creating account...","createAccount":"Create Account","haveAccount":"Already have an account?","signInHere":"Sign in here","termsPrivacy":"By creating an account, you agree to our"},"errors":{"emailPasswordRequired":"Please enter both email and password.","invalidCredentials":"Invalid email or password.","tooManyRequests":"Too many failed attempts. Please try again later.","loginError":"An error occurred during login. Please try again.","popupClosed":"Sign-in was cancelled. Please try again.","popupBlocked":"Sign-in popup was blocked. Please allow popups and try again.","googleSignInError":"Google sign-in failed. Please try again.","appleSignInError":"Apple sign-in failed. Please try again.","nameRequired":"First name and last name are required","emailRequired":"Email is required","passwordLength":"Password must be at least 6 characters long","passwordMatch":"Passwords do not match","emailInUse":"An account with this email already exists","weakPassword":"Password is too weak. Please choose a stronger password.","invalidEmail":"Please enter a valid email address","registrationError":"An error occurred during registration. Please try again.","accountCreated":"Account created successfully! Redirecting...","loginRequired":"Please log in to save jobs"}},"jobs":{"title":"Jobs","heroTitle":"Find Your Next Film Industry Role","heroSubtitle":"Discover opportunities with leading productions, connect with industry professionals, and advance your career in film and television.","searchPlaceholder":"Search jobs by title, company, or keywords...","search":"Search jobs...","filters":"Filters","showFilters":"Show Filters","hideFilters":"Hide Filters","noJobsFound":"No jobs found","loadingJobs":"Loading jobs...","allDepartments":"All Departments","allLocations":"All Locations","allJobTypes":"All Job Types","remoteOnly":"Remote Only","applyFilters":"Apply Filters","clearFilters":"Clear Filters","saveJob":"Save job for later","removeFromSaved":"Remove from saved jobs","jobSaved":"Job saved successfully","jobRemoved":"Job removed from saved","failedToSave":"Failed to save job. Please try again.","viewDetails":"View Details","editJob":"Edit Job","untitledPosition":"Untitled Position","various":"Various","remote":"Remote","paid":"Paid","level":"level","posted":"Posted","activeJobs":"Active Jobs","companies":"Companies","locations":"Locations","remoteJobs":"Remote Jobs","invalidJobData":"Invalid job data","myApplications":"My Applications","savedJobs":"Saved Jobs","postJob":"Post Job","myPostedJobs":"My Posted Jobs","jobAnalytics":"Job Analytics","postNewJob":"Post New Job","jobsAvailable":"Jobs Available","allAvailablePositions":"All Available Positions","sortBy":"Sort by","newestFirst":"Newest First","oldestFirst":"Oldest First","salaryHighToLow":"Salary: High to Low","salaryLowToHigh":"Salary: Low to High","loadMoreJobs":"Load More Jobs","department":"Department","location":"Location","enterLocation":"Enter location","jobType":"Job Type","filteredResults":"Filtered results","tryAdjustingFilters":"Try adjusting your search or filters to find more opportunities.","departments":{"camera":"Camera","sound":"Sound","lighting":"Lighting","art":"Art","costume":"Costume","makeup":"Makeup","hair":"Hair","production":"Production","postProduction":"Post-Production","vfx":"VFX","stunts":"Stunts","transportation":"Transportation","catering":"Catering"},"jobTypes":{"fullTime":"Full Time","partTime":"Part Time","contract":"Contract","freelance":"Freelance","temporary":"Temporary","internship":"Internship"}},"crew":{"title":"Crew","discoverTalent":"Discover Creative Talent","discoverSubtitle":"Connect with exceptional crew members from around the world.","refineSearch":"Refine Your Search","findPerfectCrew":"Find the perfect crew member for your project","searchCrew":"Search crew members...","searchPlaceholder":"Search by name, role, or skills...","search":"Search","filters":"Filters","clearFilters":"Clear All Filters","resetFilters":"Reset Filters","applyFilters":"Apply Filters","noResults":"No crew members found","tryAdjusting":"Try adjusting your search or filters to find more crew members.","browseAllCrew":"Browse All Crew","viewAllCrew":"View All Crew","crewProfiles":"Crew Profiles","savedCrew":"Saved Crew","savedCrewProfiles":"Saved Crew Profiles","myCrew":"My Crew","teamMembers":"Team Members","loading":"Loading crew...","loadingProfiles":"Loading profiles...","department":"Department","allDepartments":"All Departments","role":"Role","allRoles":"All Roles","jobTitle":"Job Title","allJobTitles":"All Job Titles","location":"Location","allLocations":"All Locations","country":"Country","allCountries":"All Countries","city":"City","availability":"Availability","allAvailability":"All Availability","allStatus":"All Status","available":"Available","soon":"Available Soon","unavailable":"Unavailable","crewMember":"Crew Member","locationNotSpecified":"Location not specified","addToBookmarks":"Add to bookmarks","removeFromBookmarks":"Remove from bookmarks","bookmarkAdded":"Crew member bookmarked","bookmarkRemoved":"Bookmark removed","follow":"Follow","following":"Following","unfollow":"Unfollow","sendMessage":"Send Message","viewProfile":"View Profile","editProfile":"Edit Profile","profileNotFound":"Profile not found","noSavedProfiles":"No Saved Profiles Yet","startBuilding":"Start building your collection by browsing crew profiles and saving the ones you\'re interested in.","browseCrewProfiles":"Browse Crew Profiles","curatedCollection":"Your curated collection of talented crew members","talentsFound":"Talents Found","totalResults":"crew members found","showingResults":"Showing results matching your filters","loadMore":"Load More","sortBy":"Sort by","name":"Name","experience":"Experience","rating":"Rating","recentlyAdded":"Recently Added","alphabetical":"Alphabetical","byAvailability":"By Availability","addCrew":"Add Crew","addCrewMember":"Add Crew Member","editCrewMember":"Edit Crew Member","removeCrewMember":"Remove Crew Member","confirmRemove":"Are you sure you want to remove this crew member?","status":"Status","salary":"Salary","startDate":"Start Date","endDate":"End Date","notes":"Notes","pending":"Pending","confirmed":"Confirmed","active":"Active","completed":"Completed","cancelled":"Cancelled"},"postJob":{"title":"Post a New Job","subtitle":"Fill out the form below to post a new job listing.","postNewJob":"Post a New Job","postJobDescription":"Fill out the form below to post a new job listing.","signInRequired":"Sign in required","signInMessage":"You must be signed in to post a job. Please sign in or register to continue.","signIn":"sign in","register":"register","basicInfo":"Basic Information","jobTitle":"Job Title","jobTitleRequired":"Job Title *","jobTitlePlaceholder":"e.g. Gaffer, Key Grip, Production Designer","department":"Department","departmentRequired":"Department *","selectDepartment":"Select a department","location":"Location","locationRequired":"Location *","locationPlaceholder":"e.g. Los Angeles, CA or Remote","jobType":"Job Type","selectJobType":"Select job type","fullTime":"Full-time","partTime":"Part-time","contract":"Contract","freelance":"Freelance","temporary":"Temporary","internship":"Internship","volunteer":"Volunteer","experienceLevel":"Experience Level","intern":"Intern","entry":"Entry","associate":"Associate","mid":"Mid","senior":"Senior","lead":"Lead","manager":"Manager","director":"Director","executive":"Executive","jobDescription":"Job Description","jobDescriptionRequired":"Job Description *","jobDescriptionPlaceholder":"Detailed description of the job","requirements":"Requirements","requirementsPlaceholder":"List the requirements for this job","responsibilities":"Responsibilities","responsibilitiesPlaceholder":"List the responsibilities for this job","benefits":"Benefits & Perks","perks":"Perks","benefitsPlaceholder":"List the benefits and perks for this job","skills":"Skills","skillsPlaceholder":"List required skills for this job","compensation":"Compensation","minimumSalary":"Minimum Salary","minimumSalaryPlaceholder":"e.g. 50000","maximumSalary":"Maximum Salary","maximumSalaryPlaceholder":"e.g. 70000","salaryPeriod":"Salary Period","perYear":"Per Year","perMonth":"Per Month","perWeek":"Per Week","perDay":"Per Day","perHour":"Per Hour","showSalary":"Show salary on job posting","showSalaryOnJobPosting":"Show salary on job posting","projectInfo":"Project Information","projectName":"Project Name","projectLink":"Project Link","projectType":"Project Type","feature":"Feature","short":"Short","tv":"TV","commercial":"Commercial","musicVideo":"Music Video","corporate":"Corporate","documentary":"Documentary","other":"Other","timeline":"Timeline","startDate":"Start Date","startDateRequired":"Start Date *","endDate":"End Date","contactInfo":"Contact Information","contactInformation":"Contact Information","contactInfoSubtitle":"How should applicants contact you?","howToContact":"How should applicants contact you?","contactName":"Contact Name","contactNameRequired":"Contact Name *","contactEmail":"Contact Email","contactEmailRequired":"Contact Email *","contactPhone":"Contact Phone","showContactEmail":"Show email address publicly on job posting","showEmailOnJobPosting":"Show email address publicly on job posting","showContactEmailNote":"If unchecked, applicants will only see your name and can contact you through the application system.","showEmailExplanation":"If unchecked, applicants will only see your name and can contact you through the application system.","additionalInfo":"Additional Information","isPaid":"Paid position","isUnion":"Union job","isRemote":"Remote work allowed","visaSponsorship":"Visa sponsorship available","relocationAssistance":"Relocation assistance available","cancel":"Cancel","publishJob":"Publish Job","publishing":"Publishing...","pleaseFixErrors":"Please fix the errors in the form before submitting.","fixErrors":"Please fix the errors in the form before submitting.","jobPostedSuccess":"Job posted successfully!","jobPostingFailed":"Failed to post job. Please try again."},"applyJob":{"backToJob":"Back to Job","applyFor":"Apply for","completeApplication":"Complete your application for this position","urgent":"Urgent","coverLetter":"Cover Letter (Optional)","coverLetterPlaceholder":"Tell us why you\'re interested in this position and why you\'d be a great fit... (optional)","coverLetterNote":"Optional: 300-500 words recommended if provided.","expectedSalary":"Expected Salary (Optional)","expectedSalaryPlaceholder":"e.g., 75000","perYear":"per year","salaryNote":"This helps us understand your salary expectations","availabilityDate":"Availability Date","availabilityNote":"When can you start this position?","additionalNotes":"Additional Notes (Optional)","additionalNotesPlaceholder":"Any additional information you\'d like to share...","portfolio":"Portfolio/Website (Optional)","portfolioPlaceholder":"Link to your portfolio or website","submitApplication":"Submit Application","submitting":"Submitting...","applicationSubmitted":"Application submitted successfully!","applicationFailed":"Failed to submit application. Please try again.","pleaseCompleteRequired":"Please complete all required fields.","loading":"Loading job details...","jobNotFound":"Job not found","applicationClosed":"Application period has closed for this position."},"jobDashboard":{"title":"Job Poster Dashboard","subtitle":"Manage your job postings, track applications, and analyze performance.","loading":"Loading dashboard...","overview":"Overview","postedJobs":"Posted Jobs","applications":"Applications","analytics":"Analytics","totalJobsPosted":"Total Jobs Posted","activeJobs":"Active Jobs","totalApplications":"Total Applications","pendingApplications":"Pending Applications","avgApplicationsJob":"Avg Applications/Job","totalViews":"Total Views","yourPostedJobs":"Your Posted Jobs","postNewJob":"+ Post New Job","noJobsPosted":"No jobs posted yet","startPosting":"Start posting jobs to see them here and track applications.","postFirstJob":"Post Your First Job","applicants":"Applicants","views":"Views","view":"View","apps":"Apps","edit":"Edit","allApplications":"All Applications","noApplicationsYet":"No applications yet","applicationsWillAppear":"Applications from your job postings will appear here.","applicant":"Applicant","appliedOn":"Applied on","viewApplication":"View Application","viewJob":"View Job","jobPerformance":"Job Performance","applicationStatus":"Application Status","pending":"pending","reviewed":"reviewed","shortlisted":"shortlisted","hired":"hired","postedBy":"Posted by","postedOn":"Posted on","you":"You"},"jobAnalytics":{"title":"Job Poster Analytics","subtitle":"Insights into your job postings and applicants","backToDashboard":"← Back to Dashboard","totalJobsPosted":"Total Jobs Posted","totalApplications":"Total Applications","avgApplicationsJob":"Avg Applications / Job","avgTimeToFill":"Avg Time to Fill","notAvailable":"N/A","applicationStatusBreakdown":"Application Status Breakdown","topJobsByApplicants":"Top Jobs by Applicants","monthlyApplicationTrends":"Monthly Application Trends","applicants":"applicants","noData":"No data available","performanceMetrics":"Performance Metrics","conversionRate":"Conversion Rate","responseTime":"Response Time","fillRate":"Fill Rate"},"projects":{"title":"Projects","subtitle":"Discover, create, and manage film projects. You can also view and edit your own projects.","subtitleLoggedOut":"Discover, create, and manage film projects.","allProjects":"All Projects","myProjects":"My Projects","createNewProject":"+ Create New Project","loading":"Loading...","loadingProjects":"Loading projects...","errorLoading":"Error loading projects.","noProjectsFound":"No projects found","noProjectsYet":"You haven\'t added any projects yet.","noProjectsAvailable":"No projects available.","edit":"Edit","delete":"Delete","confirmDelete":"Are you sure you want to delete this project? This cannot be undone.","deleteSuccess":"Project deleted successfully.","deleteFailed":"Failed to delete project.","backToProjects":"← Back to All Projects","viewDetails":"View Details","manageProject":"Manage Project","editProject":"Edit Project","suggestUpdate":"Suggest Update","projectNotFound":"Project not found or not available.","mustBeLoggedIn":"You must be logged in to view your projects."},"projectForm":{"generalInfo":"General Information","generalInfoDesc":"Basic project details and company information","creativeInfo":"Creative Information","creativeInfoDesc":"Story details and creative team","basicInfo":"Basic Information","storyInfo":"Story Info","productionTimeline":"Production Timeline","creativeTeam":"Creative Team","media":"Media","additional":"Additional","projectName":"Project Name","projectNamePlaceholder":"Enter project name","productionCompany":"Production Company","productionCompanyPlaceholder":"Enter production company","country":"Country","status":"Status","statusPlaceholder":"Select project status","logline":"Logline","loglinePlaceholder":"Brief one-sentence summary of the project","loglineHelper":"A concise summary that captures the essence of your project","synopsis":"Synopsis","synopsisPlaceholder":"Detailed project description","synopsisHelper":"A comprehensive overview of your project\'s story and vision","startDate":"Start Date","endDate":"End Date","genre":"Genre","genres":"Genres (comma-separated)","genresPlaceholder":"e.g., Action, Comedy","director":"Director","producer":"Producer","coverImage":"Cover Image","website":"Website","budget":"Budget","companyContact":"Company Contact","cancel":"Cancel","saveChanges":"Save Changes","saving":"Saving...","delete":"Delete Project","confirmDelete":"Are you sure you want to delete this project? This action cannot be undone.","deleteFailed":"Failed to delete project. Please try again.","updateSuccess":"Project updated successfully!","updateFailed":"Failed to update project.","createProject":"Create Project","updateProject":"Update Project"},"projectStatus":{"development":"Development","preProduction":"Pre-Production","production":"Production","inProduction":"In Production","filming":"Filming","postProduction":"Post-Production","completed":"Completed","cancelled":"Cancelled","canceled":"Canceled","unknown":"Unknown","tbd":"TBD","loadingImage":"Loading image... ({{count}}/{{max}})","imageNotAvailable":"Image not available","failedToLoadImage":"Failed to load image","noImageAvailable":"No image available","viewDetails":"View Details"},"projectCard":{"viewProject":"View Project","by":"by","directed":"Directed by","produced":"Produced by","bookmark":"Bookmark","bookmarked":"Bookmarked","removeBookmark":"Remove Bookmark","addBookmark":"Add Bookmark","noImage":"No Image Available","untitledProject":"Untitled Project"},"projectDetail":{"backToAllProjects":"Back to All Projects","coverAlt":"Cover","newCoverPreview":"New Cover Preview","currentCover":"Current Cover","reviews":"Reviews","noReviews":"No reviews yet","previous":"← Previous","next":"Next →","page":"Page","loadingReviews":"Loading reviews..."},"myProjects":{"title":"My","subtitle":"Projects","description":"View, edit, or delete your own film projects.","noProjects":"You don\'t have any projects yet.","createFirst":"Create your first project to get started.","loginRequired":"You must be logged in to view your projects.","ownedProjects":"Owned Projects","crewProjects":"Crew Projects"},"crewManagement":{"title":"Crew Members","inviteCrewMember":"Invite Crew Member","sendInvitation":"Send Invitation","cancel":"Cancel","email":"Email","role":"Role","department":"Department","emailPlaceholder":"crew@example.com","rolePlaceholder":"e.g., Camera Operator","departmentPlaceholder":"e.g., Camera","noCrewMembers":"No crew members yet","inviteToGetStarted":"Invite crew members to get started","pendingInvitations":"Pending Invitations","active":"Active","removeFromProject":"Remove from project","accept":"Accept","decline":"Decline","joinedRecently":"Joined Recently","crewMember":"Crew Member","inviteNewCrewMember":"Invite New Crew Member","fillAllFields":"Please fill in all fields","failedToInvite":"Failed to invite crew member","failedToRemove":"Failed to remove crew member","failedToRespond":"Failed to respond to invitation","alreadyCrewMember":"User is already a crew member of this project","alreadyInvited":"User is already invited to this project","insufficientPermissions":"Insufficient permissions to remove crew member","cannotRemoveSelf":"You cannot remove yourself from this project","crewMemberNotFound":"Crew member not found in project","noPendingInvitation":"No pending invitation found for this user"},"collaboration":{"title":"Collaboration Hub","subtitle":"Work together on projects, tasks, and creative content","workspaces":"Workspaces","tasks":"Tasks","screenplays":"Screenplays","loading":"Loading...","noWorkspaces":"No workspaces available","createWorkspace":"Create New Workspace","joinWorkspace":"Join","addMember":"Add Member","settings":"Settings","members":"Members","online":"Online","offline":"Offline","view":"View","delete":"Delete","workspacesTab":{"title":"Workspaces","createWorkspace":"Create Workspace"},"workspaceTypes":{"project":"Project","department":"Department","general":"General"},"createWorkspaceModal":{"title":"Create New Workspace","step1":"Step 1: Workspace Details","step2":"Step 2: Add Members","step3":"Step 3: Workspace Settings","workspaceName":"Workspace Name","workspaceNamePlaceholder":"Enter workspace name","description":"Description","descriptionPlaceholder":"Enter workspace description","workspaceType":"Workspace Type","searchUsers":"Search Users","searchPlaceholder":"Search by name, email, or role...","allowGuestAccess":"Allow Guest Access","requireApproval":"Require Approval for New Members","autoArchive":"Auto-archive Inactive Content","retentionPeriod":"Retention Period (days)","maxFileSize":"Max File Size (MB)","cancel":"Cancel","next":"Next","createWorkspace":"Create Workspace","searching":"Searching...","noFriendsFound":"No friends found.","startTyping":"Start typing to search for users"},"workspaceSettings":{"title":"Workspace Settings","saveSettings":"Save Settings"},"addMemberModal":{"title":"Add Member to Workspace"},"tasksTab":{"title":"Tasks","subtitle":"Manage collaborative tasks and project workflows"},"screenplaysTab":{"title":"Screenplays","subtitle":"Upload and collaborate on screenplay breakdowns","uploadScreenplay":"Upload Screenplay","uploading":"Uploading...","deleteConfirm":"Are you sure you want to delete this screenplay?","deleteSuccess":"Screenplay deleted successfully","deleteFailed":"Failed to delete screenplay","uploadSuccess":"uploaded successfully!","uploadFailed":"Failed to upload screenplay"},"workspaceDeleteConfirm":"Are you sure you want to delete this workspace and all its data? This action cannot be undone."},"tasks":{"title":"Collaborative Tasks","subtitle":"Manage team tasks, deadlines, and reminders","createTask":"Create Task","editTask":"Edit Task","deleteTask":"Delete Task","loading":"Loading tasks...","noTasks":"No tasks found","noTasksDescription":"Create your first task to get started","searchTasks":"Search tasks...","addComment":"Add Comment","viewModes":{"list":"List","calendar":"Calendar","kanban":"Kanban","analytics":"Analytics"},"comingSoon":{"calendar":"Calendar view coming soon...","kanban":"Kanban view coming soon...","analytics":"Analytics view coming soon..."},"stats":{"total":"Total Tasks","completed":"Completed","inProgress":"In Progress","overdue":"Overdue"},"status":{"pending":"Not Started","in_progress":"In Progress","completed":"Completed","cancelled":"Cancelled","overdue":"Overdue","blocked":"Blocked"},"filters":{"allStatus":"All Status","allCategories":"All Categories","pending":"Pending","inProgress":"In Progress","completed":"Completed","cancelled":"Cancelled","overdue":"Overdue"},"categories":{"preProduction":"Pre-Production","production":"Production","postProduction":"Post-Production","marketing":"Marketing","distribution":"Distribution","other":"Other"},"taskForm":{"createTask":"Create New Task","editTask":"Edit Task","taskName":"Task Name","description":"Description","dueDate":"Due Date","assignee":"Assignee","category":"Category","priority":"Priority","status":"Status","cancel":"Cancel","save":"Save Task","update":"Update Task"},"task":{"dueDate":"Due:","assignedTo":"Assigned to:","category":"Category:","priority":"Priority:","createdBy":"Created by:","comments":"Comments","noComments":"No comments yet","addComment":"Add a comment...","showComments":"Show Comments","hideComments":"Hide Comments","expand":"Expand","collapse":"Collapse","completedBadge":"✔ Completed","edit":"Edit","notes":"Notes","tags":"Tags","teamMembers":"Team Members","estimatedHours":"Estimated Hours","location":"Location","subtasks":"Subtasks","subtasksCompleted":"completed","noMembersAssigned":"No members assigned","moreMembers":"more members","due":"Due","noDueDate":"No due date","subtasksCount":"subtasks","changeStatus":"Change task status","editTask":"Edit Task"},"errors":{"loginRequired":"You must be logged in to create tasks","createFailed":"Failed to create task. Please try again.","updateFailed":"Failed to update task. Please try again.","deleteFailed":"Failed to delete task. Please try again.","completeFailed":"Failed to complete task. Please try again.","startFailed":"Failed to start task. Please try again.","restoreFailed":"Failed to restore task. Please try again.","commentFailed":"Failed to add comment. Please try again.","saveFailed":"Failed to save task"}},"social":{"title":"Social","subtitle":"Connect with other professionals in your network","searchPeople":"Search people...","searchPlaceholder":"Search for people to connect with","messages":"Messages","loading":"Loading...","tabs":{"following":"Following","followers":"Followers","discover":"Discover","requests":"Requests","notifications":"Notifications","connections":"Connections"},"actions":{"connect":"Connect","unfollow":"Unfollow","follow":"Follow","viewProfile":"View Profile","message":"Message","accept":"Accept","decline":"Decline","remove":"Remove","block":"Block","report":"Report"},"status":{"online":"Online","offline":"Offline","away":"Away","busy":"Busy"},"networking":{"title":"🎬 Film Industry Network","subtitle":"Connect, collaborate, and grow your career in the film industry","tabs":{"feed":"📰 Activity Feed","discover":"🔍 Discover People","groups":"👥 Industry Groups","events":"📅 Events","connections":"🤝 My Connections","discoverCrew":"🔍 Discover Crew","collaborations":"🤝 Collaborations","industryEvents":"📅 Industry Events"},"search":{"placeholder":"Search by name, skills, or job title...","noResults":"No crew members found","filterBy":"Filter by"},"industryEventsTitle":"Industry Events & Networking","filters":{"allDepartments":"All Departments","allLocations":"All Locations"},"eventActions":{"addEvent":"+ Add Event","rsvp":"RSVP","attending":"attending"},"feed":{"title":"Recent Activity","noActivity":"No recent activity to show"},"discover":{"title":"Discover Amazing Professionals","noProfiles":"No profiles found"},"groups":{"title":"Industry Groups","join":"Join","leave":"Leave","viewDetails":"View Details","members":"members","noGroups":"No groups available"},"events":{"title":"Upcoming Events","attend":"Attend","viewDetails":"View Details","attending":"attending","maxAttendees":"Max","noEvents":"No upcoming events"},"connections":{"title":"My Network","comingSoon":"Connection management coming soon..."}},"profile":{"followers":"followers","following":"following","projects":"projects","connections":"connections","posts":"posts","location":"Location","department":"Department","experience":"Experience","availability":"Availability","skills":"Skills","bio":"Bio","contactInfo":"Contact Information","socialLinks":"Social Links","endorsements":"Endorsements","reviews":"Reviews"},"messaging":{"startConversation":"Start Conversation","typeMessage":"Type a message...","send":"Send","attachFile":"Attach File","emoji":"Emoji","voiceCall":"Voice Call","videoCall":"Video Call","moreOptions":"More Options","edited":"(edited)","newMessage":"New Message","selectContact":"Select a contact to start messaging","noConversationsFound":"No conversations found"},"errors":{"loadFailed":"Failed to load data","connectFailed":"Failed to connect","messageFailed":"Failed to send message","followFailed":"Failed to follow user","unfollowFailed":"Failed to unfollow user","profileLoadFailed":"Failed to load profile"},"empty":{"noConnections":"No connections yet","noRequests":"No pending requests","noNotifications":"No new notifications","noMessages":"No messages yet","noFollowers":"No followers yet","noFollowing":"Not following anyone yet"},"headers":{"connectionRequests":"Connection Requests","sentRequests":"Sent Requests","discoverPeople":"Discover People","yourNotifications":"Your notifications will appear here."},"statusText":{"pendingRequests":"pending requests","following":"following","followers":"followers"}},"screenplay":{"addCollaborator":"Add Collaborator","collaborators":"Collaborators","noCollaborators":"No collaborators yet.","annotations":"Annotations","tags":"Tags","categories":{"cast_member":"Cast Member","background_actors":"Background Actors","stunts":"Stunts","vehicles":"Vehicles","props":"Props","camera":"Camera","special_effects":"Special Effects","wardrobe":"Wardrobe","makeup_hair":"Makeup/Hair","animals":"Animals","animal_wrangler":"Animal Wrangler","music":"Music","sound":"Sound","art_department":"Art Department","set_dressing":"Set Dressing","greenery":"Greenery","special_equipment":"Special Equipment","security":"Security","additional_labor":"Additional Labor","vfx":"VFX - Visual Effects","mechanical_effects":"Mechanical Effects","miscellaneous":"Miscellaneous","notes":"Notes","comments":"Comments","set":"Set","sequence":"Sequence","script_day":"Script Day","unit":"Unit","location":"Location","other":"Other"},"actions":{"goTo":"Go to","delete":"Delete","resolve":"Resolve","reopen":"Reopen","reply":"Reply"},"popup":{"addToSelection":"Add to selection:","addAnnotation":"Add Annotation","addTag":"Add Tag","cancel":"Cancel","save":"Save","enterAnnotation":"Enter your annotation...","enterTag":"Enter tag content...","writeReply":"Write a reply..."},"navigation":{"navigatingTo":"Navigating to annotation..."}},"common":{"loading":"Loading...","error":"Error","success":"Success","cancel":"Cancel","save":"Save","edit":"Edit","delete":"Delete","confirm":"Confirm","yes":"Yes","no":"No","back":"Back","next":"Next","submit":"Submit","close":"Close","search":"Search","filter":"Filter","sort":"Sort","view":"View","select":"Select","required":"Required","optional":"Optional","or":"or","toContinue":"to continue"},"chat":{"typeMessage":"Type a message...","send":"Send","sending":"Sending...","attachFile":"Attach file","emoji":"Emoji","voiceMessage":"Voice message","stopRecording":"Stop recording"},"favorites":{"title":"Your Favorites","subtitle":"Projects you\'ve bookmarked for easy access","auth":{"signInRequired":"Sign in to view your favorites","signInDescription":"Create an account or sign in to save and view your favorite projects","signInButton":"Sign In"},"loading":"Loading your favorites...","empty":{"title":"No favorites yet","description":"Start exploring projects and bookmark the ones you like","exploreButton":"Explore Projects"},"count":{"singular":"Favorite","plural":"Favorites"}},"resume":{"loading":"Loading resume...","errors":{"notFound":"Resume Not Found","notAvailable":"Resume Not Available","notFoundDescription":"This resume could not be found. Please check the link.","notAvailableDescription":"This resume is not available. Please check the link or contact the profile owner."},"sections":{"languages":"Languages","professionalExperience":"Professional Experience","selectedProjects":"Selected Projects","education":"Education","contactInformation":"Contact Information","additionalInformation":"Additional Information"},"labels":{"present":"Present","showingTop":"Showing top {count} {type} - prioritize most relevant first","showingMostRecent":"Showing {count} most recent - prioritize most relevant first"},"types":{"positions":"positions","projects":"projects"},"builder":{"title":"Resume Builder","description":"Easily create, update, and download your professional film industry resume. Showcase your experience, skills, and projects to producers and collaborators.","edit":"Edit","crewProfile":"Crew Profile","updateDescription":"Update your professional information and showcase your experience. Keep your profile current to attract the best opportunities.","profileInformation":"Profile Information","published":"🌐 Published","private":"🔒 Private","fullName":"Full Name","fullNamePlaceholder":"Enter your full name","bio":"Bio","bioPlaceholder":"Tell us about yourself and your experience","languages":"Languages (up to 3, optional)","languagePlaceholder":"e.g., English, Spanish, French","addLanguage":"+ Add Language","projects":"Projects","addProject":"+ Add Project","projectName":"Project Name","projectNamePlaceholder":"Enter project name","yourRole":"Your Role","yourRolePlaceholder":"Enter your role","projectDescription":"Description (Optional)","descriptionPlaceholder":"Short description of your contribution","removeProject":"Remove Project","education":"Education","educationEntries":"{count} {count, plural, one {entry} other {entries}}","noEducationTitle":"No education added","noEducationDescription":"Add your education history to showcase your background","addEducation":"Add Education","save":"Save Profile","cancel":"Cancel","loading":"Saving...","loadingBuilder":"Loading resume builder...","signInRequired":"Please sign in to edit your profile","savedMessage":"Profile saved!","saveError":"Failed to save.","shareResume":"Share Your Resume","copyLink":"Copy","linkCopied":"Link copied to clipboard!","shareDescription":"Share this link with potential employers or collaborators","resumePreview":"Resume Preview","downloadPDF":"Download as PDF"},"page":{"title":"Edit Your Profile","description":"Manage your professional information and build your resume"}},"events":{"title":"Upcoming Events","attend":"Attend","viewDetails":"View Details","attending":"attending","maxAttendees":"Max","noEvents":"No upcoming events"}}');
;// ./src/locales/es/translation.json
const es_translation_namespaceObject = /*#__PURE__*/JSON.parse('{"nav":{"home":"Inicio","crew":"Equipo","jobs":"Trabajos","projects":"Proyectos","collaboration":"Colaboración","social":"Social","favorites":"Favoritos","resumeBuilder":"Constructor de CV","myPostedJobs":"Mis Trabajos Publicados","jobAnalytics":"Analíticas de Trabajos","postNewJob":"Publicar Nuevo Trabajo","myApplications":"Mis Aplicaciones","postedJobs":"Trabajos Publicados","settings":"Configuración","notificationSettings":"Configuración de Notificaciones","signOut":"Cerrar Sesión","signIn":"Iniciar Sesión","getStarted":"Comenzar"},"notificationSettings":{"title":"Configuración de Notificaciones","general":"Configuración General","specific":"Notificaciones Específicas"},"notifications":{"title":"Notificaciones","search":"Buscar notificaciones...","all":"Todas","unread":"No leídas","read":"Leídas","noResults":"No hay notificaciones que coincidan con tu búsqueda","empty":"Aún no hay notificaciones"},"home":{"loading":"Cargando...","stats":{"activeProfessionals":"Profesionales Activos","projectsCompleted":"Proyectos Completados","successRate":"Tasa de Éxito","countries":"Países"},"hero":{"banner":"La Plataforma Premier de Networking de la Industria Cinematográfica","title1":"Conecta Profesionales","title2":"del Cine","subtitle":"Únete a miles de cineastas, miembros del equipo y profesionales de la industria que se conectan, colaboran y crean proyectos increíbles juntos.","ctaPrimary":"Comienza Tu Viaje","ctaSecondary":"Explorar Trabajos"},"features":{"title":"Todo lo que Necesitas para Tener Éxito","subtitle":"Desde el escaparate de proyectos hasta la colaboración en tiempo real, proporcionamos todas las herramientas que necesitas para avanzar en tu carrera cinematográfica.","projectShowcase":{"title":"Escaparate de Proyectos","desc":"Muestra tu mejor trabajo y conecta con profesionales de la industria"},"crewNetworking":{"title":"Red de Equipo","desc":"Construye conexiones significativas con cineastas talentosos de todo el mundo"},"jobBoard":{"title":"Tablero de Trabajos","desc":"Encuentra y publica trabajos de producción cinematográfica en todos los departamentos"},"globalReach":{"title":"Alcance Global","desc":"Conecta con profesionales de todo el mundo"},"industryRecognition":{"title":"Reconocimiento de la Industria","desc":"Muestra tus premios y logros para destacar"},"realTimeCollab":{"title":"Colaboración en Tiempo Real","desc":"Trabaja juntos sin problemas con herramientas de comunicación integradas"}},"howItWorks":{"title":"Cómo Funciona","subtitle":"Comienza en solo tres pasos simples y únete a la red más grande de la industria cinematográfica.","step1":{"title":"Crea Tu Perfil","desc":"Construye tu perfil profesional y muestra tu mejor trabajo para destacar entre la multitud."},"step2":{"title":"Conecta y Haz Networking","desc":"Encuentra y conecta con profesionales de la industria, únete a proyectos y construye tu red."},"step3":{"title":"Colabora y Crece","desc":"Trabaja en proyectos increíbles, comparte oportunidades y haz crecer tu carrera en la industria cinematográfica."}},"cta":{"title":"¿Listo para Llevar Tu Carrera al Siguiente Nivel?","subtitle":"Únete a miles de profesionales del cine que ya están usando nuestra plataforma para hacer crecer sus carreras.","ctaPrimary":"Únete a la Comunidad","ctaSecondary":"Explorar Perfiles"}},"auth":{"login":{"title":"Bienvenido de vuelta","subtitle":"Inicia sesión en tu cuenta para continuar","email":"Dirección de Correo","emailPlaceholder":"Ingresa tu correo","password":"Contraseña","passwordPlaceholder":"Ingresa tu contraseña","showPassword":"Mostrar contraseña","hidePassword":"Ocultar contraseña","signingIn":"Iniciando sesión...","signIn":"Iniciar Sesión","continueWithGoogle":"Continuar con Google","continueWithApple":"Continuar con Apple","or":"o","noAccount":"¿No tienes una cuenta?","createAccount":"Crea una aquí","termsPrivacy":"Al iniciar sesión, aceptas nuestros","termsService":"Términos de Servicio","privacyPolicy":"Política de Privacidad","and":"y"},"register":{"title":"Crea tu cuenta","subtitle":"Únete a My Film Jobs para conectar con la industria cinematográfica","personalInfo":"Información Personal","firstName":"Nombre","firstNamePlaceholder":"Juan","lastName":"Apellido","lastNamePlaceholder":"Pérez","accountDetails":"Detalles de la Cuenta","email":"Dirección de Correo","emailPlaceholder":"juan.perez@ejemplo.com","password":"Contraseña","passwordPlaceholder":"Crea una contraseña fuerte","passwordHelper":"Debe tener al menos 6 caracteres","confirmPassword":"Confirmar Contraseña","confirmPasswordPlaceholder":"Confirma tu contraseña","creatingAccount":"Creando cuenta...","createAccount":"Crear Cuenta","haveAccount":"¿Ya tienes una cuenta?","signInHere":"Inicia sesión aquí","termsPrivacy":"Al crear una cuenta, aceptas nuestros"},"errors":{"emailPasswordRequired":"Por favor ingresa tanto el correo como la contraseña.","invalidCredentials":"Correo o contraseña inválidos.","tooManyRequests":"Demasiados intentos fallidos. Por favor intenta de nuevo más tarde.","loginError":"Ocurrió un error durante el inicio de sesión. Por favor intenta de nuevo.","popupClosed":"El inicio de sesión fue cancelado. Por favor intenta de nuevo.","popupBlocked":"La ventana emergente de inicio de sesión fue bloqueada. Por favor permite ventanas emergentes e intenta de nuevo.","googleSignInError":"El inicio de sesión con Google falló. Por favor intenta de nuevo.","appleSignInError":"El inicio de sesión con Apple falló. Por favor intenta de nuevo.","nameRequired":"El nombre y apellido son requeridos","emailRequired":"El correo es requerido","passwordLength":"La contraseña debe tener al menos 6 caracteres","passwordMatch":"Las contraseñas no coinciden","emailInUse":"Ya existe una cuenta con este correo","weakPassword":"La contraseña es muy débil. Por favor elige una contraseña más fuerte.","invalidEmail":"Por favor ingresa una dirección de correo válida","registrationError":"Ocurrió un error durante el registro. Por favor intenta de nuevo.","accountCreated":"¡Cuenta creada exitosamente! Redirigiendo...","loginRequired":"Por favor inicia sesión para guardar trabajos"}},"jobs":{"title":"Trabajos","heroTitle":"Encuentra Tu Próximo Rol en la Industria Cinematográfica","heroSubtitle":"Descubre oportunidades con producciones líderes, conecta con profesionales de la industria y avanza tu carrera en cine y televisión.","searchPlaceholder":"Buscar trabajos por título, compañía o palabras clave...","search":"Buscar trabajos...","filters":"Filtros","showFilters":"Mostrar Filtros","hideFilters":"Ocultar Filtros","noJobsFound":"No se encontraron trabajos","loadingJobs":"Cargando trabajos...","allDepartments":"Todos los Departamentos","allLocations":"Todas las Ubicaciones","allJobTypes":"Todos los Tipos de Trabajo","remoteOnly":"Solo Remoto","applyFilters":"Aplicar Filtros","clearFilters":"Limpiar Filtros","saveJob":"Guardar trabajo para después","removeFromSaved":"Remover de trabajos guardados","jobSaved":"Trabajo guardado exitosamente","jobRemoved":"Trabajo removido de guardados","failedToSave":"Falló al guardar trabajo. Por favor intenta de nuevo.","viewDetails":"Ver Detalles","editJob":"Editar Trabajo","untitledPosition":"Posición Sin Título","various":"Varios","remote":"Remoto","paid":"Pagado","level":"nivel","posted":"Publicado","activeJobs":"Trabajos Activos","companies":"Compañías","locations":"Ubicaciones","remoteJobs":"Trabajos Remotos","invalidJobData":"Datos de trabajo inválidos","myApplications":"Mis Aplicaciones","savedJobs":"Trabajos Guardados","postJob":"Publicar Trabajo","myPostedJobs":"Mis Trabajos Publicados","jobAnalytics":"Analíticas de Trabajos","postNewJob":"Publicar Nuevo Trabajo","jobsAvailable":"Trabajos Disponibles","allAvailablePositions":"Todas las Posiciones Disponibles","sortBy":"Ordenar por","newestFirst":"Más Recientes Primero","oldestFirst":"Más Antiguos Primero","salaryHighToLow":"Salario: Alto a Bajo","salaryLowToHigh":"Salario: Bajo a Alto","loadMoreJobs":"Cargar Más Trabajos","department":"Departamento","location":"Ubicación","enterLocation":"Ingresa ubicación","jobType":"Tipo de Trabajo","filteredResults":"Resultados filtrados","tryAdjustingFilters":"Intenta ajustar tu búsqueda o filtros para encontrar más oportunidades.","departments":{"camera":"Cámara","sound":"Sonido","lighting":"Iluminación","art":"Arte","costume":"Vestuario","makeup":"Maquillaje","hair":"Cabello","production":"Producción","postProduction":"Post-Producción","vfx":"Efectos Visuales","stunts":"Acrobacias","transportation":"Transporte","catering":"Catering"},"jobTypes":{"fullTime":"Tiempo Completo","partTime":"Tiempo Parcial","contract":"Contrato","freelance":"Freelance","temporary":"Temporal","internship":"Prácticas"}},"crew":{"title":"Equipo","discoverTalent":"Descubre Talento Creativo","discoverSubtitle":"Conecta con miembros excepcionales del equipo de todo el mundo.","refineSearch":"Refina Tu Búsqueda","findPerfectCrew":"Encuentra el miembro perfecto del equipo para tu proyecto","searchCrew":"Buscar miembros del equipo...","searchPlaceholder":"Buscar por nombre, rol o habilidades...","search":"Buscar","filters":"Filtros","clearFilters":"Limpiar Todos los Filtros","resetFilters":"Restablecer Filtros","applyFilters":"Aplicar Filtros","noResults":"No se encontraron miembros del equipo","tryAdjusting":"Intenta ajustar tu búsqueda o filtros para encontrar más miembros del equipo.","browseAllCrew":"Explorar Todo el Equipo","viewAllCrew":"Ver Todo el Equipo","crewProfiles":"Perfiles del Equipo","savedCrew":"Equipo Guardado","savedCrewProfiles":"Perfiles de Equipo Guardados","myCrew":"Mi Equipo","teamMembers":"Miembros del Equipo","loading":"Cargando equipo...","loadingProfiles":"Cargando perfiles...","department":"Departamento","allDepartments":"Todos los Departamentos","role":"Rol","allRoles":"Todos los Roles","jobTitle":"Título del Trabajo","allJobTitles":"Todos los Títulos","location":"Ubicación","allLocations":"Todas las Ubicaciones","country":"País","allCountries":"Todos los Países","city":"Ciudad","availability":"Disponibilidad","allAvailability":"Toda Disponibilidad","allStatus":"Todos los Estados","available":"Disponible","soon":"Disponible Pronto","unavailable":"No Disponible","crewMember":"Miembro del Equipo","locationNotSpecified":"Ubicación no especificada","addToBookmarks":"Agregar a marcadores","removeFromBookmarks":"Remover de marcadores","bookmarkAdded":"Miembro del equipo marcado","bookmarkRemoved":"Marcador removido","follow":"Seguir","following":"Siguiendo","unfollow":"Dejar de seguir","sendMessage":"Enviar Mensaje","viewProfile":"Ver Perfil","editProfile":"Editar Perfil","profileNotFound":"Perfil no encontrado","noSavedProfiles":"No Hay Perfiles Guardados Aún","startBuilding":"Comienza construyendo tu colección navegando perfiles del equipo y guardando los que te interesen.","browseCrewProfiles":"Explorar Perfiles del Equipo","curatedCollection":"Tu colección curada de miembros talentosos del equipo","talentsFound":"Talentos Encontrados","totalResults":"miembros del equipo encontrados","showingResults":"Mostrando resultados que coinciden con tus filtros","loadMore":"Cargar Más","sortBy":"Ordenar por","name":"Nombre","experience":"Experiencia","rating":"Calificación","recentlyAdded":"Agregados Recientemente","alphabetical":"Alfabético","byAvailability":"Por Disponibilidad","addCrew":"Agregar Equipo","addCrewMember":"Agregar Miembro del Equipo","editCrewMember":"Editar Miembro del Equipo","removeCrewMember":"Remover Miembro del Equipo","confirmRemove":"¿Estás seguro de que quieres remover este miembro del equipo?","status":"Estado","salary":"Salario","startDate":"Fecha de Inicio","endDate":"Fecha de Fin","notes":"Notas","pending":"Pendiente","confirmed":"Confirmado","active":"Activo","completed":"Completado","cancelled":"Cancelado"},"postJob":{"title":"Publicar un Nuevo Trabajo","subtitle":"Completa el formulario a continuación para publicar una nueva oferta de trabajo.","postNewJob":"Publicar un Nuevo Trabajo","postJobDescription":"Completa el formulario a continuación para publicar una nueva oferta de trabajo.","signInRequired":"Inicio de sesión requerido","signInMessage":"Debes iniciar sesión para publicar un trabajo. Por favor inicia sesión o regístrate para continuar.","signIn":"iniciar sesión","register":"registrarse","basicInfo":"Información Básica","jobTitle":"Título del Trabajo","jobTitleRequired":"Título del Trabajo *","jobTitlePlaceholder":"ej. Gaffer, Key Grip, Diseñador de Producción","department":"Departamento","departmentRequired":"Departamento *","selectDepartment":"Selecciona un departamento","location":"Ubicación","locationRequired":"Ubicación *","locationPlaceholder":"ej. Los Ángeles, CA o Remoto","jobType":"Tipo de Trabajo","selectJobType":"Selecciona tipo de trabajo","fullTime":"Tiempo completo","partTime":"Tiempo parcial","contract":"Contrato","freelance":"Freelance","temporary":"Temporal","internship":"Prácticas","volunteer":"Voluntario","experienceLevel":"Nivel de Experiencia","intern":"Practicante","entry":"Inicial","associate":"Asociado","mid":"Intermedio","senior":"Senior","lead":"Líder","manager":"Gerente","director":"Director","executive":"Ejecutivo","jobDescription":"Descripción del Trabajo","jobDescriptionRequired":"Descripción del Trabajo *","jobDescriptionPlaceholder":"Descripción detallada del trabajo","requirements":"Requisitos","requirementsPlaceholder":"Lista los requisitos para este trabajo","responsibilities":"Responsabilidades","responsibilitiesPlaceholder":"Lista las responsabilidades para este trabajo","benefits":"Beneficios y Ventajas","perks":"Ventajas","benefitsPlaceholder":"Lista los beneficios y ventajas para este trabajo","skills":"Habilidades","skillsPlaceholder":"Lista las habilidades requeridas para este trabajo","compensation":"Compensación","minimumSalary":"Salario Mínimo","minimumSalaryPlaceholder":"ej. 50000","maximumSalary":"Salario Máximo","maximumSalaryPlaceholder":"ej. 70000","salaryPeriod":"Período de Salario","perYear":"Por Año","perMonth":"Por Mes","perWeek":"Por Semana","perDay":"Por Día","perHour":"Por Hora","showSalary":"Mostrar salario en la publicación del trabajo","showSalaryOnJobPosting":"Mostrar salario en la publicación del trabajo","projectInfo":"Información del Proyecto","projectName":"Nombre del Proyecto","projectLink":"Enlace del Proyecto","projectType":"Tipo de Proyecto","feature":"Largometraje","short":"Cortometraje","tv":"TV","commercial":"Comercial","musicVideo":"Video Musical","corporate":"Corporativo","documentary":"Documental","other":"Otro","timeline":"Cronograma","startDate":"Fecha de Inicio","startDateRequired":"Fecha de Inicio *","endDate":"Fecha de Fin","contactInfo":"Información de Contacto","contactInformation":"Información de Contacto","contactInfoSubtitle":"¿Cómo deben contactarte los solicitantes?","howToContact":"¿Cómo deben contactarte los solicitantes?","contactName":"Nombre de Contacto","contactNameRequired":"Nombre de Contacto *","contactEmail":"Email de Contacto","contactEmailRequired":"Email de Contacto *","contactPhone":"Teléfono de Contacto","showContactEmail":"Mostrar dirección de email públicamente en la publicación del trabajo","showEmailOnJobPosting":"Mostrar dirección de email públicamente en la publicación del trabajo","showContactEmailNote":"Si no está marcado, los solicitantes solo verán tu nombre y podrán contactarte a través del sistema de aplicaciones.","showEmailExplanation":"Si no está marcado, los solicitantes solo verán tu nombre y podrán contactarte a través del sistema de aplicaciones.","additionalInfo":"Información Adicional","isPaid":"Posición pagada","isUnion":"Trabajo sindical","isRemote":"Trabajo remoto permitido","visaSponsorship":"Patrocinio de visa disponible","relocationAssistance":"Asistencia de reubicación disponible","cancel":"Cancelar","publishJob":"Publicar Trabajo","publishing":"Publicando...","pleaseFixErrors":"Por favor corrige los errores en el formulario antes de enviar.","fixErrors":"Por favor corrige los errores en el formulario antes de enviar.","jobPostedSuccess":"¡Trabajo publicado exitosamente!","jobPostingFailed":"Falló al publicar el trabajo. Por favor intenta de nuevo."},"applyJob":{"backToJob":"Volver al Trabajo","applyFor":"Aplicar para","completeApplication":"Completa tu aplicación para esta posición","urgent":"Urgente","coverLetter":"Carta de Presentación (Opcional)","coverLetterPlaceholder":"Cuéntanos por qué estás interesado en esta posición y por qué serías perfecto para el puesto... (opcional)","coverLetterNote":"Opcional: Se recomiendan 300-500 palabras si se proporciona.","expectedSalary":"Salario Esperado (Opcional)","expectedSalaryPlaceholder":"ej., 75000","perYear":"por año","salaryNote":"Esto nos ayuda a entender tus expectativas salariales","availabilityDate":"Fecha de Disponibilidad","availabilityNote":"¿Cuándo puedes comenzar esta posición?","additionalNotes":"Notas Adicionales (Opcional)","additionalNotesPlaceholder":"Cualquier información adicional que te gustaría compartir...","portfolio":"Portafolio/Sitio Web (Opcional)","portfolioPlaceholder":"Enlace a tu portafolio o sitio web","submitApplication":"Enviar Aplicación","submitting":"Enviando...","applicationSubmitted":"¡Aplicación enviada exitosamente!","applicationFailed":"Falló al enviar la aplicación. Por favor intenta de nuevo.","pleaseCompleteRequired":"Por favor completa todos los campos requeridos.","loading":"Cargando detalles del trabajo...","jobNotFound":"Trabajo no encontrado","applicationClosed":"El período de aplicación ha cerrado para esta posición."},"jobDashboard":{"title":"Panel de Publicador de Trabajos","subtitle":"Gestiona tus publicaciones de trabajo, rastrea aplicaciones y analiza el rendimiento.","loading":"Cargando panel...","overview":"Resumen","postedJobs":"Trabajos Publicados","applications":"Aplicaciones","analytics":"Analíticas","totalJobsPosted":"Total de Trabajos Publicados","activeJobs":"Trabajos Activos","totalApplications":"Total de Aplicaciones","pendingApplications":"Aplicaciones Pendientes","avgApplicationsJob":"Promedio Aplicaciones/Trabajo","totalViews":"Total de Vistas","yourPostedJobs":"Tus Trabajos Publicados","postNewJob":"+ Publicar Nuevo Trabajo","noJobsPosted":"No hay trabajos publicados aún","startPosting":"Comienza publicando trabajos para verlos aquí y rastrear aplicaciones.","postFirstJob":"Publica Tu Primer Trabajo","applicants":"Solicitantes","views":"Vistas","view":"Ver","apps":"Apps","edit":"Editar","allApplications":"Todas las Aplicaciones","noApplicationsYet":"No hay aplicaciones aún","applicationsWillAppear":"Las aplicaciones de tus publicaciones de trabajo aparecerán aquí.","applicant":"Solicitante","appliedOn":"Aplicó el","viewApplication":"Ver Aplicación","viewJob":"Ver Trabajo","jobPerformance":"Rendimiento del Trabajo","applicationStatus":"Estado de Aplicación","pending":"pendientes","reviewed":"revisadas","shortlisted":"preseleccionadas","hired":"contratadas","postedBy":"Publicado por","postedOn":"Publicado el","you":"Tú"},"jobAnalytics":{"title":"Analíticas del Publicador de Trabajos","subtitle":"Insights sobre tus publicaciones de trabajo y solicitantes","backToDashboard":"← Volver al Panel","totalJobsPosted":"Total de Trabajos Publicados","totalApplications":"Total de Aplicaciones","avgApplicationsJob":"Promedio Aplicaciones / Trabajo","avgTimeToFill":"Tiempo Promedio para Llenar","notAvailable":"N/D","applicationStatusBreakdown":"Desglose del Estado de Aplicaciones","topJobsByApplicants":"Mejores Trabajos por Solicitantes","monthlyApplicationTrends":"Tendencias Mensuales de Aplicaciones","applicants":"solicitantes","noData":"No hay datos disponibles","performanceMetrics":"Métricas de Rendimiento","conversionRate":"Tasa de Conversión","responseTime":"Tiempo de Respuesta","fillRate":"Tasa de Llenado"},"projects":{"title":"Proyectos","subtitle":"Descubre, crea y gestiona proyectos cinematográficos. También puedes ver y editar tus propios proyectos.","subtitleLoggedOut":"Descubre, crea y gestiona proyectos cinematográficos.","allProjects":"Todos los Proyectos","myProjects":"Mis Proyectos","createNewProject":"+ Crear Nuevo Proyecto","loading":"Cargando...","loadingProjects":"Cargando proyectos...","errorLoading":"Error al cargar proyectos.","noProjectsFound":"No se encontraron proyectos","noProjectsYet":"Aún no has agregado ningún proyecto.","noProjectsAvailable":"No hay proyectos disponibles.","edit":"Editar","delete":"Eliminar","confirmDelete":"¿Estás seguro de que quieres eliminar este proyecto? Esto no se puede deshacer.","deleteSuccess":"Proyecto eliminado exitosamente.","deleteFailed":"Error al eliminar proyecto.","backToProjects":"← Volver a Todos los Proyectos","viewDetails":"Ver Detalles","manageProject":"Gestionar Proyecto","editProject":"Editar Proyecto","suggestUpdate":"Sugerir Actualización","projectNotFound":"Proyecto no encontrado o no disponible.","mustBeLoggedIn":"Debes iniciar sesión para ver tus proyectos."},"projectForm":{"generalInfo":"Información General","generalInfoDesc":"Detalles básicos del proyecto e información de la empresa","creativeInfo":"Información Creativa","creativeInfoDesc":"Detalles de la historia y equipo creativo","basicInfo":"Información Básica","storyInfo":"Información de la Historia","productionTimeline":"Cronograma de Producción","creativeTeam":"Equipo Creativo","media":"Medios","additional":"Adicional","projectName":"Nombre del Proyecto","projectNamePlaceholder":"Ingresa el nombre del proyecto","productionCompany":"Compañía Productora","productionCompanyPlaceholder":"Ingresa la compañía productora","country":"País","status":"Estado","statusPlaceholder":"Selecciona el estado del proyecto","logline":"Sinopsis Breve","loglinePlaceholder":"Resumen breve de una oración del proyecto","loglineHelper":"Un resumen conciso que captura la esencia de tu proyecto","synopsis":"Sinopsis","synopsisPlaceholder":"Descripción detallada del proyecto","synopsisHelper":"Una visión general completa de la historia y visión de tu proyecto","startDate":"Fecha de Inicio","endDate":"Fecha de Fin","genre":"Género","genres":"Géneros (separados por comas)","genresPlaceholder":"ej., Acción, Comedia","director":"Director","producer":"Productor","coverImage":"Imagen de Portada","website":"Sitio Web","budget":"Presupuesto","companyContact":"Contacto de la Empresa","cancel":"Cancelar","saveChanges":"Guardar Cambios","saving":"Guardando...","delete":"Eliminar Proyecto","confirmDelete":"¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.","deleteFailed":"Error al eliminar el proyecto. Por favor, inténtalo de nuevo.","updateSuccess":"¡Proyecto actualizado exitosamente!","updateFailed":"Error al actualizar proyecto.","createProject":"Crear Proyecto","updateProject":"Actualizar Proyecto"},"projectStatus":{"development":"Desarrollo","preProduction":"Pre-Producción","production":"Producción","inProduction":"En Producción","filming":"Filmación","postProduction":"Post-Producción","completed":"Completado","cancelled":"Cancelado","canceled":"Cancelado","unknown":"Desconocido","tbd":"Por Determinar","loadingImage":"Cargando imagen... ({{count}}/{{max}})","imageNotAvailable":"Imagen no disponible","failedToLoadImage":"Error al cargar imagen","noImageAvailable":"No hay imagen disponible","viewDetails":"Ver Detalles"},"projectCard":{"viewProject":"Ver Proyecto","by":"por","directed":"Dirigido por","produced":"Producido por","bookmark":"Marcar","bookmarked":"Marcado","removeBookmark":"Quitar Marca","addBookmark":"Agregar Marca","noImage":"No Hay Imagen Disponible","untitledProject":"Proyecto Sin Título"},"projectDetail":{"backToAllProjects":"Volver a Todos los Proyectos","coverAlt":"Portada","newCoverPreview":"Vista Previa de Nueva Portada","currentCover":"Portada Actual","reviews":"Reseñas","noReviews":"No hay reseñas aún","previous":"← Anterior","next":"Siguiente →","page":"Página","loadingReviews":"Cargando reseñas..."},"myProjects":{"title":"Mis","subtitle":"Proyectos","description":"Ve, edita o elimina tus propios proyectos cinematográficos.","noProjects":"Aún no tienes ningún proyecto.","createFirst":"Crea tu primer proyecto para comenzar.","loginRequired":"Debes iniciar sesión para ver tus proyectos.","ownedProjects":"Proyectos Propios","crewProjects":"Proyectos de Equipo"},"collaboration":{"title":"Centro de Colaboración","subtitle":"Trabaja en conjunto en proyectos, tareas y contenido creativo","workspaces":"Espacios de Trabajo","tasks":"Tareas","screenplays":"Guiones","loading":"Cargando...","noWorkspaces":"No hay espacios de trabajo disponibles","createWorkspace":"Crear Nuevo Espacio de Trabajo","joinWorkspace":"Unirse","addMember":"Agregar Miembro","settings":"Configuración","members":"Miembros","online":"En línea","offline":"Desconectado","view":"Ver","delete":"Eliminar","workspacesTab":{"title":"Espacios de Trabajo","createWorkspace":"Crear Espacio de Trabajo"},"workspaceTypes":{"project":"Proyecto","department":"Departamento","general":"General"},"createWorkspaceModal":{"title":"Crear Nuevo Espacio de Trabajo","step1":"Paso 1: Detalles del Espacio de Trabajo","step2":"Paso 2: Agregar Miembros","step3":"Paso 3: Configuración del Espacio de Trabajo","workspaceName":"Nombre del Espacio de Trabajo","workspaceNamePlaceholder":"Ingrese el nombre del espacio de trabajo","description":"Descripción","descriptionPlaceholder":"Ingrese la descripción del espacio de trabajo","workspaceType":"Tipo de Espacio de Trabajo","searchUsers":"Buscar Usuarios","searchPlaceholder":"Buscar por nombre, email o rol...","allowGuestAccess":"Permitir Acceso de Invitados","requireApproval":"Requerir Aprobación para Nuevos Miembros","autoArchive":"Archivar Automáticamente Contenido Inactivo","retentionPeriod":"Período de Retención (días)","maxFileSize":"Tamaño Máximo de Archivo (MB)","cancel":"Cancelar","next":"Siguiente","createWorkspace":"Crear Espacio de Trabajo","searching":"Buscando...","noFriendsFound":"No se encontraron amigos.","startTyping":"Comience a escribir para buscar usuarios"},"workspaceSettings":{"title":"Configuración del Espacio de Trabajo","saveSettings":"Guardar Configuración"},"addMemberModal":{"title":"Agregar Miembro al Espacio de Trabajo"},"tasksTab":{"title":"Tareas","subtitle":"Gestiona tareas colaborativas y flujos de trabajo del proyecto"},"screenplaysTab":{"title":"Guiones","subtitle":"Sube y colabora en desgloses de guiones","uploadScreenplay":"Subir Guión","uploading":"Subiendo...","deleteConfirm":"¿Estás seguro de que quieres eliminar este guión?","deleteSuccess":"Guión eliminado exitosamente","deleteFailed":"Error al eliminar guión","uploadSuccess":"subido exitosamente!","uploadFailed":"Error al subir guión"},"workspaceDeleteConfirm":"¿Estás seguro de que quieres eliminar este espacio de trabajo y todos sus datos? Esta acción no se puede deshacer."},"tasks":{"title":"Tareas Colaborativas","subtitle":"Gestiona tareas del equipo, fechas límite y recordatorios","createTask":"Crear Tarea","editTask":"Editar Tarea","deleteTask":"Eliminar Tarea","loading":"Cargando tareas...","noTasks":"No se encontraron tareas","noTasksDescription":"Crea tu primera tarea para comenzar","searchTasks":"Buscar tareas...","addComment":"Agregar Comentario","viewModes":{"list":"Lista","calendar":"Calendario","kanban":"Kanban","analytics":"Analíticas"},"comingSoon":{"calendar":"Vista de calendario próximamente...","kanban":"Vista Kanban próximamente...","analytics":"Vista de analíticas próximamente..."},"stats":{"total":"Total de Tareas","completed":"Completadas","inProgress":"En Progreso","overdue":"Vencidas"},"status":{"pending":"Sin Empezar","in_progress":"En Progreso","completed":"Completado","cancelled":"Cancelado","overdue":"Atrasado","blocked":"Bloqueado"},"filters":{"allStatus":"Todos los Estados","allCategories":"Todas las Categorías","pending":"Pendiente","inProgress":"En Progreso","completed":"Completada","cancelled":"Cancelada","overdue":"Vencida"},"categories":{"preProduction":"Pre-Producción","production":"Producción","postProduction":"Post-Producción","marketing":"Marketing","distribution":"Distribución","other":"Otro"},"taskForm":{"createTask":"Crear Nueva Tarea","editTask":"Editar Tarea","taskName":"Nombre de la Tarea","description":"Descripción","dueDate":"Fecha Límite","assignee":"Asignado a","category":"Categoría","priority":"Prioridad","status":"Estado","cancel":"Cancelar","save":"Guardar Tarea","update":"Actualizar Tarea"},"task":{"dueDate":"Vence:","assignedTo":"Asignado a:","category":"Categoría:","priority":"Prioridad:","createdBy":"Creado por:","comments":"Comentarios","noComments":"No hay comentarios aún","addComment":"Agregar un comentario...","showComments":"Mostrar Comentarios","hideComments":"Ocultar Comentarios","expand":"Expandir","collapse":"Contraer","completedBadge":"✔ Completada","edit":"Editar","notes":"Notas","tags":"Etiquetas","teamMembers":"Miembros del Equipo","estimatedHours":"Horas Estimadas","location":"Ubicación","subtasks":"Subtareas","subtasksCompleted":"completadas","noMembersAssigned":"No hay miembros asignados","moreMembers":"más miembros","due":"Vence","noDueDate":"Sin fecha de vencimiento","subtasksCount":"subtareas","changeStatus":"Cambiar estado de la tarea","editTask":"Editar Tarea"},"errors":{"loginRequired":"Debes iniciar sesión para crear tareas","createFailed":"Error al crear la tarea. Inténtalo de nuevo.","updateFailed":"Error al actualizar la tarea. Inténtalo de nuevo.","deleteFailed":"Error al eliminar la tarea. Inténtalo de nuevo.","completeFailed":"Error al completar la tarea. Inténtalo de nuevo.","startFailed":"Error al iniciar la tarea. Inténtalo de nuevo.","restoreFailed":"Error al restaurar la tarea. Inténtalo de nuevo.","commentFailed":"Error al agregar comentario. Inténtalo de nuevo.","saveFailed":"Error al guardar la tarea"}},"social":{"title":"Social","subtitle":"Conecta con otros profesionales en tu red","searchPeople":"Buscar personas...","searchPlaceholder":"Buscar personas para conectar","messages":"Mensajes","loading":"Cargando...","tabs":{"following":"Siguiendo","followers":"Seguidores","discover":"Descubrir","requests":"Solicitudes","notifications":"Notificaciones","connections":"Conexiones"},"actions":{"connect":"Conectar","unfollow":"Dejar de seguir","follow":"Seguir","viewProfile":"Ver Perfil","message":"Mensaje","accept":"Aceptar","decline":"Rechazar","remove":"Eliminar","block":"Bloquear","report":"Reportar"},"status":{"online":"En línea","offline":"Desconectado","away":"Ausente","busy":"Ocupado"},"networking":{"title":"🎬 Red de la Industria Cinematográfica","subtitle":"Conecta, colabora y haz crecer tu carrera en la industria del cine","tabs":{"feed":"📰 Feed de Actividad","discover":"🔍 Descubrir Personas","groups":"👥 Grupos de la Industria","events":"📅 Eventos","connections":"🤝 Mis Conexiones","discoverCrew":"🔍 Descubrir Equipo","collaborations":"🤝 Colaboraciones","industryEvents":"📅 Eventos de la Industria"},"search":{"placeholder":"Buscar por nombre, habilidades o puesto de trabajo...","noResults":"No se encontraron miembros del equipo","filterBy":"Filtrar por"},"industryEventsTitle":"Eventos de la Industria y Networking","filters":{"allDepartments":"Todos los Departamentos","allLocations":"Todas las Ubicaciones"},"eventActions":{"addEvent":"+ Agregar Evento","rsvp":"Confirmar","attending":"asistiendo"},"feed":{"title":"Actividad Reciente","noActivity":"No hay actividad reciente para mostrar"},"discover":{"title":"Descubre Profesionales Increíbles","noProfiles":"No se encontraron perfiles"},"groups":{"title":"Grupos de la Industria","join":"Unirse","leave":"Salir","viewDetails":"Ver Detalles","members":"miembros","noGroups":"No hay grupos disponibles"},"events":{"title":"Próximos Eventos","attend":"Asistir","viewDetails":"Ver Detalles","attending":"asistiendo","maxAttendees":"Máx","noEvents":"No hay próximos eventos"},"connections":{"title":"Mi Red","comingSoon":"Gestión de conexiones próximamente..."}},"profile":{"followers":"seguidores","following":"siguiendo","projects":"proyectos","connections":"conexiones","posts":"publicaciones","location":"Ubicación","department":"Departamento","experience":"Experiencia","availability":"Disponibilidad","skills":"Habilidades","bio":"Biografía","contactInfo":"Información de Contacto","socialLinks":"Enlaces Sociales","endorsements":"Recomendaciones","reviews":"Reseñas"},"messaging":{"startConversation":"Iniciar Conversación","typeMessage":"Escribe un mensaje...","send":"Enviar","attachFile":"Adjuntar Archivo","emoji":"Emoji","voiceCall":"Llamada de Voz","videoCall":"Videollamada","moreOptions":"Más Opciones","edited":"(editado)","newMessage":"Nuevo Mensaje","selectContact":"Selecciona un contacto para comenzar a conversar","noConversationsFound":"No se encontraron conversaciones"},"errors":{"loadFailed":"Error al cargar datos","connectFailed":"Error al conectar","messageFailed":"Error al enviar mensaje","followFailed":"Error al seguir usuario","unfollowFailed":"Error al dejar de seguir usuario","profileLoadFailed":"Error al cargar perfil"},"empty":{"noConnections":"No hay conexiones aún","noRequests":"No hay solicitudes pendientes","noNotifications":"No hay nuevas notificaciones","noMessages":"No hay mensajes aún","noFollowers":"No hay seguidores aún","noFollowing":"No sigues a nadie aún"},"headers":{"connectionRequests":"Solicitudes de Conexión","sentRequests":"Solicitudes Enviadas","discoverPeople":"Descubrir Personas","yourNotifications":"Tus notificaciones aparecerán aquí."},"statusText":{"pendingRequests":"solicitudes pendientes","following":"siguiendo","followers":"seguidores"}},"screenplay":{"addCollaborator":"Agregar Colaborador","collaborators":"Colaboradores","noCollaborators":"Aún no hay colaboradores.","annotations":"Anotaciones","tags":"Etiquetas","categories":{"cast_member":"Miembro del Reparto","background_actors":"Actores de Fondo","stunts":"Acrobacias","vehicles":"Vehículos","props":"Utilería","camera":"Cámara","special_effects":"Efectos Especiales","wardrobe":"Vestuario","makeup_hair":"Maquillaje/Cabello","animals":"Animales","animal_wrangler":"Entrenador de Animales","music":"Música","sound":"Sonido","art_department":"Departamento de Arte","set_dressing":"Decoración de Set","greenery":"Plantas/Vegetación","special_equipment":"Equipo Especial","security":"Seguridad","additional_labor":"Mano de Obra Adicional","vfx":"VFX - Efectos Visuales","mechanical_effects":"Efectos Mecánicos","miscellaneous":"Varios","notes":"Notas","comments":"Comentarios","set":"Set","sequence":"Secuencia","script_day":"Día de Guión","unit":"Unidad","location":"Ubicación","other":"Otro"},"actions":{"goTo":"Ir a","delete":"Eliminar","resolve":"Resolver","reopen":"Reabrir","reply":"Responder"},"popup":{"addToSelection":"Agregar a la selección:","addAnnotation":"Agregar Anotación","addTag":"Agregar Etiqueta","cancel":"Cancelar","save":"Guardar","enterAnnotation":"Ingresa tu anotación...","enterTag":"Ingresa el contenido de la etiqueta...","writeReply":"Escribe una respuesta..."},"navigation":{"navigatingTo":"Navegando a la anotación..."}},"common":{"loading":"Cargando...","error":"Error","success":"Éxito","cancel":"Cancelar","save":"Guardar","edit":"Editar","delete":"Eliminar","confirm":"Confirmar","yes":"Sí","no":"No","back":"Volver","next":"Siguiente","submit":"Enviar","close":"Cerrar","search":"Buscar","filter":"Filtrar","sort":"Ordenar","view":"Ver","select":"Seleccionar","required":"Requerido","optional":"Opcional","or":"o","toContinue":"para continuar"},"chat":{"typeMessage":"Escribe un mensaje...","send":"Enviar","sending":"Enviando...","attachFile":"Adjuntar archivo","emoji":"Emoji","voiceMessage":"Mensaje de voz","stopRecording":"Detener grabación"},"favorites":{"title":"Tus Favoritos","subtitle":"Proyectos que has guardado para fácil acceso","auth":{"signInRequired":"Inicia sesión para ver tus favoritos","signInDescription":"Crea una cuenta o inicia sesión para guardar y ver tus proyectos favoritos","signInButton":"Iniciar Sesión"},"loading":"Cargando tus favoritos...","empty":{"title":"No hay favoritos aún","description":"Comienza a explorar proyectos y marca los que te gusten","exploreButton":"Explorar Proyectos"},"count":{"singular":"Favorito","plural":"Favoritos"}},"resume":{"loading":"Cargando currículum...","errors":{"notFound":"Currículum No Encontrado","notAvailable":"Currículum No Disponible","notFoundDescription":"No se pudo encontrar este currículum. Por favor verifica el enlace.","notAvailableDescription":"Este currículum no está disponible. Por favor verifica el enlace o contacta al propietario del perfil."},"sections":{"languages":"Idiomas","professionalExperience":"Experiencia Profesional","selectedProjects":"Proyectos Seleccionados","education":"Educación","contactInformation":"Información de Contacto","additionalInformation":"Información Adicional"},"labels":{"present":"Presente","showingTop":"Mostrando los {count} {type} principales - prioriza los más relevantes primero","showingMostRecent":"Mostrando los {count} más recientes - prioriza los más relevantes primero"},"types":{"positions":"puestos","projects":"proyectos"},"builder":{"title":"Constructor de Currículum","description":"Crea, actualiza y descarga fácilmente tu currículum profesional de la industria cinematográfica. Muestra tu experiencia, habilidades y proyectos a productores y colaboradores.","edit":"Editar","crewProfile":"Perfil de Equipo","updateDescription":"Actualiza tu información profesional y muestra tu experiencia. Mantén tu perfil actualizado para atraer las mejores oportunidades.","profileInformation":"Información del Perfil","published":"🌐 Publicado","private":"🔒 Privado","fullName":"Nombre Completo","fullNamePlaceholder":"Ingresa tu nombre completo","bio":"Biografía","bioPlaceholder":"Cuéntanos sobre ti y tu experiencia","languages":"Idiomas (hasta 3, opcional)","languagePlaceholder":"ej., Inglés, Español, Francés","addLanguage":"+ Agregar Idioma","projects":"Proyectos","addProject":"+ Agregar Proyecto","projectName":"Nombre del Proyecto","projectNamePlaceholder":"Ingresa el nombre del proyecto","yourRole":"Tu Rol","yourRolePlaceholder":"Ingresa tu rol","projectDescription":"Descripción (Opcional)","descriptionPlaceholder":"Breve descripción de tu contribución","removeProject":"Eliminar Proyecto","education":"Educación","educationEntries":"{count} {count, plural, one {entrada} other {entradas}}","noEducationTitle":"No se ha agregado educación","noEducationDescription":"Agrega tu historial educativo para mostrar tu formación","addEducation":"Agregar Educación","save":"Guardar Perfil","cancel":"Cancelar","loading":"Guardando...","loadingBuilder":"Cargando constructor de currículum...","signInRequired":"Por favor inicia sesión para editar tu perfil","savedMessage":"¡Perfil guardado!","saveError":"Error al guardar.","shareResume":"Compartir Tu Currículum","copyLink":"Copiar","linkCopied":"¡Enlace copiado al portapapeles!","shareDescription":"Comparte este enlace con potenciales empleadores o colaboradores","resumePreview":"Vista Previa del Currículum","downloadPDF":"Descargar como PDF"},"page":{"title":"Editar Tu Perfil","description":"Administra tu información profesional y construye tu currículum"}},"events":{"title":"Próximos Eventos","attend":"Asistir","viewDetails":"Ver Detalles","attending":"asistiendo","maxAttendees":"Máx","noEvents":"No hay próximos eventos"}}');
;// ./src/i18n.ts





const resources = {
    en: { translation: translation_namespaceObject },
    es: { translation: es_translation_namespaceObject },
};
i18next/* default.use */.Ay.use(i18nextBrowserLanguageDetector/* default */.A)
    .use(es/* initReactI18next */.r9)
    .init({
    resources,
    fallbackLng: 'en',
    debug: "production" === 'development',
    interpolation: {
        escapeValue: false, // React already escapes
    },
    detection: {
        order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        caches: ['localStorage'],
    },
});
/* harmony default export */ const src_i18n = ((/* unused pure expression or super */ null && (i18n)));

// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(5338);
// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var dist = __webpack_require__(4976);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var react_router_dist = __webpack_require__(7767);
;// ./src/components/ProtectedRoute.tsx



const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const location = (0,react_router_dist/* useLocation */.zy)();
    if (!currentUser) {
        return (0,jsx_runtime.jsx)(react_router_dist/* Navigate */.C5, { to: redirectTo, state: { from: location.pathname }, replace: true });
    }
    return (0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: children });
};
const PublicRoute = ({ children, redirectTo = '/' }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    if (currentUser) {
        return (0,jsx_runtime.jsx)(react_router_dist/* Navigate */.C5, { to: redirectTo, replace: true });
    }
    return (0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: children });
};

// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var react_hot_toast_dist = __webpack_require__(888);
// EXTERNAL MODULE: ./src/theme/ThemeProvider.tsx + 1 modules
var ThemeProvider = __webpack_require__(3049);
// EXTERNAL MODULE: ./node_modules/@fontsource/inter/400.css
var _400 = __webpack_require__(6019);
// EXTERNAL MODULE: ./node_modules/@fontsource/inter/500.css
var _500 = __webpack_require__(422);
// EXTERNAL MODULE: ./node_modules/@fontsource/inter/600.css
var _600 = __webpack_require__(8765);
// EXTERNAL MODULE: ./node_modules/@fontsource/inter/700.css
var _700 = __webpack_require__(2888);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/App.module.scss
var App_module = __webpack_require__(2096);
;// ./src/App.module.scss

      
      
      
      
      
      
      
      
      

var App_module_options = {};

App_module_options.styleTagTransform = (styleTagTransform_default());
App_module_options.setAttributes = (setAttributesWithoutAttributes_default());
App_module_options.insert = insertBySelector_default().bind(null, "head");
App_module_options.domAPI = (styleDomAPI_default());
App_module_options.insertStyleElement = (insertStyleElement_default());

var App_module_update = injectStylesIntoStyleTag_default()(App_module/* default */.Ay, App_module_options);




       /* harmony default export */ const src_App_module = (App_module/* default */.Ay && App_module/* default */.Ay.locals ? App_module/* default */.Ay.locals : undefined);

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/bell.js
var bell = __webpack_require__(9436);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/chevron-down.js
var chevron_down = __webpack_require__(5107);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/settings.js
var settings = __webpack_require__(964);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/x.js
var x = __webpack_require__(8697);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/menu.js
var menu = __webpack_require__(9230);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
;// ./src/hooks/useNotifications.ts




function useNotifications() {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [notifications, setNotifications] = (0,react.useState)([]);
    const [loading, setLoading] = (0,react.useState)(true);
    (0,react.useEffect)(() => {
        console.log('[useNotifications] Effect triggered with currentUser:', currentUser?.uid);
        if (!currentUser) {
            console.log('[useNotifications] No current user, clearing notifications');
            setNotifications([]);
            setLoading(false);
            return;
        }
        try {
            console.log('[useNotifications] Setting up Firestore listener for user:', currentUser.uid);
            // Query notifications from the main notifications collection for the current user
            const q = (0,index_esm/* query */.P)((0,index_esm/* collection */.rJ)(firebase.db, "notifications"), (0,index_esm/* where */._M)("userId", "==", currentUser.uid), (0,index_esm/* orderBy */.My)("createdAt", "desc"));
            const unsubscribe = (0,index_esm/* onSnapshot */.aQ)(q, (snapshot) => {
                console.log('[useNotifications] Received snapshot with', snapshot.docs.length, 'notifications');
                const notifs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications(notifs);
                setLoading(false);
            }, (error) => {
                console.error('[useNotifications] Error fetching notifications:', error);
                setLoading(false);
                // Set empty notifications on error
                setNotifications([]);
            });
            return () => {
                console.log('[useNotifications] Cleaning up listener');
                unsubscribe();
            };
        }
        catch (error) {
            console.error('[useNotifications] Error setting up listener:', error);
            setLoading(false);
            setNotifications([]);
        }
    }, [currentUser]);
    const markAsRead = async (notificationId) => {
        if (!currentUser)
            return;
        try {
            console.log('[useNotifications] Marking notification as read:', notificationId);
            const notifRef = (0,index_esm.doc)(firebase.db, "notifications", notificationId);
            await (0,index_esm/* updateDoc */.mZ)(notifRef, { read: true });
            // Update local state to mark as read (don't remove)
            setNotifications(prev => prev.map(notif => notif.id === notificationId ? { ...notif, read: true } : notif));
            console.log('[useNotifications] Notification marked as read successfully');
        }
        catch (error) {
            console.error('[useNotifications] Error marking notification as read:', error);
            // Don't throw - just log the error
        }
    };
    const markAllAsRead = async () => {
        if (!currentUser)
            return;
        try {
            // Mark all unread notifications as read in Firestore
            const batch = (0,index_esm/* writeBatch */.wP)(firebase.db);
            const unreadNotifications = notifications.filter(notification => !notification.read);
            unreadNotifications.forEach(notification => {
                const notifRef = (0,index_esm.doc)(firebase.db, "notifications", notification.id);
                batch.update(notifRef, { read: true });
            });
            await batch.commit();
            // Update local state to mark as read
            setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        }
        catch (error) {
            console.error('Error marking all as read:', error);
            // Don't throw - just log the error
        }
    };
    const clearAll = async () => {
        if (!currentUser)
            return;
        try {
            // Delete all notifications from Firestore
            const batch = (0,index_esm/* writeBatch */.wP)(firebase.db);
            notifications.forEach(notification => {
                const notifRef = (0,index_esm.doc)(firebase.db, "notifications", notification.id);
                batch.delete(notifRef);
            });
            await batch.commit();
            // Clear from local state immediately
            setNotifications([]);
        }
        catch (error) {
            console.error('Error clearing notifications:', error);
            // Don't throw - just log the error
        }
    };
    const deleteOldNotifications = async (daysOld = 30) => {
        if (!currentUser)
            return;
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            const oldNotifications = notifications.filter(notification => {
                const notificationDate = notification.createdAt?.toDate?.() || notification.timestamp?.toDate?.();
                return notificationDate && notificationDate < cutoffDate;
            });
            if (oldNotifications.length === 0) {
                console.log('No old notifications to delete');
                return;
            }
            const batch = (0,index_esm/* writeBatch */.wP)(firebase.db);
            oldNotifications.forEach(notification => {
                const notifRef = (0,index_esm.doc)(firebase.db, "notifications", notification.id);
                batch.delete(notifRef);
            });
            await batch.commit();
            // Remove from local state
            setNotifications(prev => prev.filter(notification => {
                const notificationDate = notification.createdAt?.toDate?.() || notification.timestamp?.toDate?.();
                return !notificationDate || notificationDate >= cutoffDate;
            }));
            console.log(`Deleted ${oldNotifications.length} old notifications`);
        }
        catch (error) {
            console.error('Error deleting old notifications:', error);
            // Don't throw - just log the error
        }
    };
    const deleteNotification = async (notificationId) => {
        if (!currentUser)
            return;
        try {
            const notifRef = (0,index_esm.doc)(firebase.db, "notifications", notificationId);
            await (0,index_esm/* deleteDoc */.kd)(notifRef);
            // Remove from local state
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        }
        catch (error) {
            console.error('Error deleting notification:', error);
            // Don't throw - just log the error
        }
    };
    // Calculate unread count
    const unreadCount = notifications.filter(n => !n.read).length;
    return {
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        deleteOldNotifications,
        deleteNotification
    };
}

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/search.js
var search = __webpack_require__(8445);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/check.js
var check = __webpack_require__(5773);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/trash-2.js
var trash_2 = __webpack_require__(2708);
// EXTERNAL MODULE: ./node_modules/date-fns/formatDistanceToNow.js + 27 modules
var formatDistanceToNow = __webpack_require__(113);
;// ./src/components/NotificationCenter.tsx








const NotificationCenter = ({ isOpen, onClose }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    let notifications = [];
    let markAsRead = () => { };
    let deleteNotification = () => { };
    let unreadCount = 0;
    try {
        const notificationsData = useNotifications();
        notifications = notificationsData.notifications || [];
        markAsRead = notificationsData.markAsRead || (() => { });
        deleteNotification = notificationsData.deleteNotification || (() => { });
        unreadCount = notificationsData.unreadCount || 0;
    }
    catch (error) {
        console.error('[NotificationCenter] Error loading notifications:', error);
        notifications = [];
        markAsRead = () => { };
        deleteNotification = () => { };
        unreadCount = 0;
    }
    const { t } = (0,es/* useTranslation */.Bd)();
    const navigate = (0,react_router_dist/* useNavigate */.Zp)();
    const [filter, setFilter] = (0,react.useState)('all');
    const [searchTerm, setSearchTerm] = (0,react.useState)('');
    const [selectedNotifications, setSelectedNotifications] = (0,react.useState)([]);
    const [showBulkActions, setShowBulkActions] = (0,react.useState)(false);
    (0,react.useEffect)(() => {
        if (!isOpen) {
            setSelectedNotifications([]);
            setShowBulkActions(false);
        }
    }, [isOpen]);
    const filteredNotifications = notifications.filter(notification => {
        const matchesFilter = filter === 'all' ||
            (filter === 'unread' && !notification.read) ||
            (filter === 'read' && notification.read);
        const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    const handleSelectAll = () => {
        if (selectedNotifications.length === filteredNotifications.length) {
            setSelectedNotifications([]);
            setShowBulkActions(false);
        }
        else {
            setSelectedNotifications(filteredNotifications.map(n => n.id));
            setShowBulkActions(true);
        }
    };
    const handleBulkMarkAsRead = async () => {
        try {
            for (const id of selectedNotifications) {
                await markAsRead(id);
            }
            setSelectedNotifications([]);
            setShowBulkActions(false);
        }
        catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };
    const handleBulkDelete = async () => {
        try {
            for (const id of selectedNotifications) {
                await deleteNotification(id);
            }
            setSelectedNotifications([]);
            setShowBulkActions(false);
        }
        catch (error) {
            console.error('Error deleting notifications:', error);
        }
    };
    const handleNotificationClick = (notification) => {
        try {
            // Always mark as read when clicked, regardless of current status
            if (!notification.read) {
                markAsRead(notification.id);
            }
            // For message notifications, also mark the conversation as read
            if (notification.type === 'message' && notification.senderId) {
                // Import MessagingService dynamically to avoid circular dependencies
                __webpack_require__.e(/* import() */ 4672).then(__webpack_require__.bind(__webpack_require__, 4672)).then(({ MessagingService }) => {
                    MessagingService.markConversationAsRead(currentUser?.uid, notification.senderId).catch(error => {
                        console.error('Error marking conversation as read from notification:', error);
                    });
                });
            }
            // Handle navigation based on notification type
            switch (notification.type) {
                case 'message':
                    // Navigate to chat with the sender
                    if (notification.senderId) {
                        navigate(`/chat?user=${notification.senderId}`);
                    }
                    else {
                        navigate('/social'); // Fallback to social page
                    }
                    break;
                case 'job_application':
                    // Navigate to job applications page
                    if (notification.relatedId) {
                        navigate(`/jobs/${notification.relatedId}/applications`);
                    }
                    else {
                        navigate('/jobs');
                    }
                    break;
                case 'application_status_update':
                    // Navigate to application detail
                    if (notification.applicationId) {
                        navigate(`/applications/${notification.applicationId}`);
                    }
                    else {
                        navigate('/jobs/applied');
                    }
                    break;
                case 'project_invitation':
                    // Navigate to project invitation
                    if (notification.relatedId) {
                        navigate(`/projects/${notification.relatedId}`);
                    }
                    else {
                        navigate('/projects');
                    }
                    break;
                case 'task_assignment':
                    // Navigate to task management
                    if (notification.relatedId) {
                        navigate(`/projects/${notification.relatedId}/tasks`);
                    }
                    else {
                        navigate('/collaboration');
                    }
                    break;
                case 'project_update':
                    // Navigate to project detail
                    if (notification.relatedId) {
                        navigate(`/projects/${notification.relatedId}`);
                    }
                    else {
                        navigate('/projects');
                    }
                    break;
                default:
                    // Default navigation based on type
                    if (notification.type.includes('job')) {
                        navigate('/jobs');
                    }
                    else if (notification.type.includes('project')) {
                        navigate('/projects');
                    }
                    else if (notification.type.includes('message')) {
                        navigate('/social');
                    }
                    else {
                        navigate('/'); // Home page as fallback
                    }
                    break;
            }
            // Close the notification center after navigation
            onClose();
        }
        catch (error) {
            console.error('Error handling notification click:', error);
        }
    };
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'job_application':
                return '💼';
            case 'project_invitation':
                return '🎬';
            case 'task_assignment':
                return '📋';
            case 'message':
                return '💬';
            case 'project_update':
                return '🔄';
            case 'application_status_update':
                return '📊';
            default:
                return '🔔';
        }
    };
    const getNotificationColor = (type) => {
        switch (type) {
            case 'job_application':
                return 'bg-blue-100 text-blue-800';
            case 'project_invitation':
                return 'bg-green-100 text-green-800';
            case 'task_assignment':
                return 'bg-purple-100 text-purple-800';
            case 'message':
                return 'bg-indigo-100 text-indigo-800';
            case 'project_update':
                return 'bg-orange-100 text-orange-800';
            case 'application_status_update':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    if (!isOpen)
        return null;
    return ((0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [(0,jsx_runtime.jsx)(bell/* default */.A, { className: "w-6 h-6 text-blue-600" }), (0,jsx_runtime.jsxs)("h2", { className: "text-xl font-semibold text-gray-900", children: [t('notifications.title', 'Notifications'), unreadCount > 0 && ((0,jsx_runtime.jsx)("span", { className: "ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full", children: unreadCount }))] })] }), (0,jsx_runtime.jsx)("div", { className: "flex items-center space-x-2", children: (0,jsx_runtime.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0,jsx_runtime.jsx)(x/* default */.A, { className: "w-6 h-6" }) }) })] }), (0,jsx_runtime.jsxs)("div", { className: "p-4 border-b border-gray-200", children: [(0,jsx_runtime.jsxs)("div", { className: "flex space-x-2 mb-3", children: [(0,jsx_runtime.jsxs)("div", { className: "flex-1 relative", children: [(0,jsx_runtime.jsx)(search/* default */.A, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), (0,jsx_runtime.jsx)("input", { type: "text", placeholder: t('notifications.search', 'Search notifications...'), value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), (0,jsx_runtime.jsxs)("select", { value: filter, onChange: (e) => setFilter(e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [(0,jsx_runtime.jsx)("option", { value: "all", children: t('notifications.all', 'All') }), (0,jsx_runtime.jsx)("option", { value: "unread", children: t('notifications.unread', 'Unread') }), (0,jsx_runtime.jsx)("option", { value: "read", children: t('notifications.read', 'Read') })] })] }), showBulkActions && selectedNotifications.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between bg-blue-50 p-3 rounded-lg", children: [(0,jsx_runtime.jsxs)("span", { className: "text-sm text-blue-800", children: [selectedNotifications.length, " notification(s) selected"] }), (0,jsx_runtime.jsxs)("div", { className: "flex space-x-2", children: [(0,jsx_runtime.jsxs)("button", { onClick: handleBulkMarkAsRead, className: "flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700", children: [(0,jsx_runtime.jsx)(check/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: "Mark Read" })] }), (0,jsx_runtime.jsxs)("button", { onClick: handleBulkDelete, className: "flex items-center space-x-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700", children: [(0,jsx_runtime.jsx)(trash_2/* default */.A, { className: "w-4 h-4" }), (0,jsx_runtime.jsx)("span", { children: "Delete" })] })] })] }))] }), (0,jsx_runtime.jsx)("div", { className: "flex-1 overflow-y-auto p-4", children: filteredNotifications.length === 0 ? ((0,jsx_runtime.jsxs)("div", { className: "text-center py-8", children: [(0,jsx_runtime.jsx)(bell/* default */.A, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-500", children: searchTerm || filter !== 'all'
                                    ? t('notifications.noResults', 'No notifications match your criteria')
                                    : t('notifications.empty', 'No notifications yet') })] })) : ((0,jsx_runtime.jsx)("div", { className: "space-y-3", children: filteredNotifications.map((notification) => ((0,jsx_runtime.jsx)("div", { className: `p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'} ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`, onClick: () => handleNotificationClick(notification), children: (0,jsx_runtime.jsxs)("div", { className: "flex items-start space-x-3", children: [(0,jsx_runtime.jsx)("div", { onClick: (e) => e.stopPropagation(), children: (0,jsx_runtime.jsx)("input", { type: "checkbox", checked: selectedNotifications.includes(notification.id), onChange: (e) => {
                                                e.stopPropagation(); // Prevent triggering the card click
                                                if (e.target.checked) {
                                                    setSelectedNotifications(prev => [...prev, notification.id]);
                                                    setShowBulkActions(true);
                                                }
                                                else {
                                                    setSelectedNotifications(prev => {
                                                        const newSelected = prev.filter(id => id !== notification.id);
                                                        if (newSelected.length === 0) {
                                                            setShowBulkActions(false);
                                                        }
                                                        return newSelected;
                                                    });
                                                }
                                            }, className: "mt-1" }) }), (0,jsx_runtime.jsx)("div", { className: "flex-shrink-0", children: (0,jsx_runtime.jsx)("span", { className: "text-2xl", children: getNotificationIcon(notification.type) }) }), (0,jsx_runtime.jsx)("div", { className: "flex-1 min-w-0", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-start justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex-1", children: [(0,jsx_runtime.jsx)("p", { className: `text-sm ${notification.read ? 'text-gray-700' : 'text-gray-900'}`, children: notification.message || 'No message' }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2 mt-1", children: [(0,jsx_runtime.jsx)("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNotificationColor(notification.type)}`, children: notification.type.replace('_', ' ') }), (0,jsx_runtime.jsx)("span", { className: "text-xs text-gray-500", children: (() => {
                                                                        try {
                                                                            const timestamp = notification.createdAt?.toDate?.() || notification.createdAt || notification.timestamp?.toDate?.() || notification.timestamp;
                                                                            if (!timestamp)
                                                                                return 'Unknown time';
                                                                            const date = new Date(timestamp);
                                                                            if (isNaN(date.getTime()))
                                                                                return 'Unknown time';
                                                                            return (0,formatDistanceToNow/* formatDistanceToNow */.m)(date, { addSuffix: true });
                                                                        }
                                                                        catch (error) {
                                                                            console.error('Error formatting notification timestamp:', error);
                                                                            return 'Unknown time';
                                                                        }
                                                                    })() })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-1", children: [!notification.read && ((0,jsx_runtime.jsx)("button", { onClick: (e) => {
                                                                e.stopPropagation(); // Prevent triggering the card click
                                                                markAsRead(notification.id);
                                                            }, className: "p-1 text-gray-400 hover:text-green-600 transition-colors", title: "Mark as read", children: (0,jsx_runtime.jsx)(check/* default */.A, { className: "w-4 h-4" }) })), (0,jsx_runtime.jsx)("button", { onClick: (e) => {
                                                                e.stopPropagation(); // Prevent triggering the card click
                                                                deleteNotification(notification.id);
                                                            }, className: "p-1 text-gray-400 hover:text-red-600 transition-colors", title: "Delete notification", children: (0,jsx_runtime.jsx)(trash_2/* default */.A, { className: "w-4 h-4" }) })] })] }) })] }) }, notification.id))) })) }), (0,jsx_runtime.jsx)("div", { className: "p-4 border-t border-gray-200", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-4", children: [(0,jsx_runtime.jsx)("button", { onClick: handleSelectAll, className: "text-sm text-blue-600 hover:text-blue-800", children: selectedNotifications.length === filteredNotifications.length ? 'Deselect All' : 'Select All' }), selectedNotifications.length > 0 && ((0,jsx_runtime.jsxs)("span", { className: "text-sm text-gray-500", children: [selectedNotifications.length, " selected"] }))] }), (0,jsx_runtime.jsxs)("div", { className: "text-sm text-gray-500", children: [filteredNotifications.length, " notification(s)"] })] }) })] }) }));
};
/* harmony default export */ const components_NotificationCenter = (NotificationCenter);

;// ./src/components/NotificationSettings.tsx





const NotificationSettings = ({ isOpen = false, onClose }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [preferences, setPreferences] = (0,react.useState)({
        emailNotifications: {
            chat: true,
            projects: true,
            jobs: true,
            general: true,
        },
        inAppNotifications: {
            chat: true,
            projects: true,
            jobs: true,
            general: true,
        },
        emailFrequency: {
            chat: 'weekly',
            projects: 'weekly',
            jobs: 'weekly',
            general: 'weekly',
        },
    });
    const [loading, setLoading] = (0,react.useState)(true);
    const [saving, setSaving] = (0,react.useState)(false);
    const [message, setMessage] = (0,react.useState)('');
    (0,react.useEffect)(() => {
        if (currentUser && isOpen) {
            loadPreferences();
        }
    }, [currentUser, isOpen]);
    // Reset loading state when modal closes
    (0,react.useEffect)(() => {
        if (!isOpen) {
            setLoading(true);
        }
    }, [isOpen]);
    const loadPreferences = async () => {
        try {
            setLoading(true);
            const userDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.notificationPreferences) {
                    setPreferences(data.notificationPreferences);
                }
            }
        }
        catch (error) {
            console.error('Error loading notification preferences:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleToggle = (type, category) => {
        setPreferences(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [category]: !prev[type][category],
            },
        }));
    };
    const handleFrequencyChange = (category, frequency) => {
        setPreferences(prev => ({
            ...prev,
            emailFrequency: {
                ...prev.emailFrequency,
                [category]: frequency,
            },
        }));
    };
    const handleSave = async () => {
        if (!currentUser)
            return;
        try {
            setSaving(true);
            await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'users', currentUser.uid), {
                notificationPreferences: preferences,
            });
            setMessage('Notification preferences saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        }
        catch (error) {
            console.error('Error saving notification preferences:', error);
            setMessage('Failed to save preferences. Please try again.');
        }
        finally {
            setSaving(false);
        }
    };
    // If not open, don't render anything
    if (!isOpen) {
        return null;
    }
    // If no current user, show a message
    if (!currentUser) {
        return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50", onClick: onClose }), (0,jsx_runtime.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: (0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full", children: (0,jsx_runtime.jsxs)("div", { className: "p-6 text-center", children: [(0,jsx_runtime.jsx)("h1", { className: "text-xl font-bold text-gray-900 mb-4", children: "Notification Settings" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "Please sign in to manage your notification preferences." }), (0,jsx_runtime.jsx)("button", { onClick: onClose, className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "Close" })] }) }) })] }));
    }
    if (loading) {
        return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50", onClick: onClose }), (0,jsx_runtime.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: (0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-xl max-w-md w-full", children: (0,jsx_runtime.jsxs)("div", { className: "p-6 text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" }), (0,jsx_runtime.jsx)("p", { className: "mt-2 text-gray-600", children: "Loading preferences..." })] }) }) })] }));
    }
    return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50", onClick: onClose }), (0,jsx_runtime.jsx)("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: (0,jsx_runtime.jsx)("div", { className: "bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: (0,jsx_runtime.jsxs)("div", { className: "p-6", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0,jsx_runtime.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: "Notification Settings" }), (0,jsx_runtime.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0,jsx_runtime.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), message && ((0,jsx_runtime.jsx)("div", { className: `mb-4 p-3 rounded-md ${message.includes('successfully')
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-red-100 text-red-700 border border-red-200'}`, children: message })), (0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Email Notifications" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Chat Messages" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Get notified when you receive new messages" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => handleToggle('emailNotifications', 'chat'), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.emailNotifications.chat ? 'bg-blue-600' : 'bg-gray-200'}`, children: (0,jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.emailNotifications.chat ? 'translate-x-6' : 'translate-x-1'}` }) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Project Updates" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Get notified about project changes and assignments" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => handleToggle('emailNotifications', 'projects'), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.emailNotifications.projects ? 'bg-blue-600' : 'bg-gray-200'}`, children: (0,jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.emailNotifications.projects ? 'translate-x-6' : 'translate-x-1'}` }) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Job Applications" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Get notified about job application updates" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => handleToggle('emailNotifications', 'jobs'), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.emailNotifications.jobs ? 'bg-blue-600' : 'bg-gray-200'}`, children: (0,jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.emailNotifications.jobs ? 'translate-x-6' : 'translate-x-1'}` }) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "General Updates" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Get notified about platform updates and announcements" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => handleToggle('emailNotifications', 'general'), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.emailNotifications.general ? 'bg-blue-600' : 'bg-gray-200'}`, children: (0,jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.emailNotifications.general ? 'translate-x-6' : 'translate-x-1'}` }) })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Email Frequency" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Choose how often you want to receive email notifications" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Chat Messages" }), (0,jsx_runtime.jsx)("span", { className: "text-sm text-gray-500", children: preferences.emailFrequency.chat })] }), (0,jsx_runtime.jsx)("div", { className: "flex space-x-2", children: ['immediate', 'daily', 'weekly', 'monthly'].map((frequency) => ((0,jsx_runtime.jsx)("button", { onClick: () => handleFrequencyChange('chat', frequency), className: `px-3 py-1 text-sm rounded-md transition-colors ${preferences.emailFrequency.chat === frequency
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: frequency.charAt(0).toUpperCase() + frequency.slice(1) }, frequency))) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Project Updates" }), (0,jsx_runtime.jsx)("span", { className: "text-sm text-gray-500", children: preferences.emailFrequency.projects })] }), (0,jsx_runtime.jsx)("div", { className: "flex space-x-2", children: ['immediate', 'daily', 'weekly', 'monthly'].map((frequency) => ((0,jsx_runtime.jsx)("button", { onClick: () => handleFrequencyChange('projects', frequency), className: `px-3 py-1 text-sm rounded-md transition-colors ${preferences.emailFrequency.projects === frequency
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: frequency.charAt(0).toUpperCase() + frequency.slice(1) }, frequency))) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Job Applications" }), (0,jsx_runtime.jsx)("span", { className: "text-sm text-gray-500", children: preferences.emailFrequency.jobs })] }), (0,jsx_runtime.jsx)("div", { className: "flex space-x-2", children: ['immediate', 'daily', 'weekly', 'monthly'].map((frequency) => ((0,jsx_runtime.jsx)("button", { onClick: () => handleFrequencyChange('jobs', frequency), className: `px-3 py-1 text-sm rounded-md transition-colors ${preferences.emailFrequency.jobs === frequency
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: frequency.charAt(0).toUpperCase() + frequency.slice(1) }, frequency))) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "General Updates" }), (0,jsx_runtime.jsx)("span", { className: "text-sm text-gray-500", children: preferences.emailFrequency.general })] }), (0,jsx_runtime.jsx)("div", { className: "flex space-x-2", children: ['immediate', 'daily', 'weekly', 'monthly'].map((frequency) => ((0,jsx_runtime.jsx)("button", { onClick: () => handleFrequencyChange('general', frequency), className: `px-3 py-1 text-sm rounded-md transition-colors ${preferences.emailFrequency.general === frequency
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: frequency.charAt(0).toUpperCase() + frequency.slice(1) }, frequency))) })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "In-App Notifications" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Chat Messages" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Show notifications for new messages" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => handleToggle('inAppNotifications', 'chat'), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.inAppNotifications.chat ? 'bg-blue-600' : 'bg-gray-200'}`, children: (0,jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.inAppNotifications.chat ? 'translate-x-6' : 'translate-x-1'}` }) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Project Updates" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Show notifications for project changes" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => handleToggle('inAppNotifications', 'projects'), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.inAppNotifications.projects ? 'bg-blue-600' : 'bg-gray-200'}`, children: (0,jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.inAppNotifications.projects ? 'translate-x-6' : 'translate-x-1'}` }) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "Job Applications" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Show notifications for job updates" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => handleToggle('inAppNotifications', 'jobs'), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.inAppNotifications.jobs ? 'bg-blue-600' : 'bg-gray-200'}`, children: (0,jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.inAppNotifications.jobs ? 'translate-x-6' : 'translate-x-1'}` }) })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("p", { className: "font-medium text-gray-900", children: "General Updates" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Show notifications for platform updates" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => handleToggle('inAppNotifications', 'general'), className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.inAppNotifications.general ? 'bg-blue-600' : 'bg-gray-200'}`, children: (0,jsx_runtime.jsx)("span", { className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.inAppNotifications.general ? 'translate-x-6' : 'translate-x-1'}` }) })] })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "mt-8 flex justify-end space-x-3", children: [(0,jsx_runtime.jsx)("button", { onClick: onClose, className: "px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50", children: "Cancel" }), (0,jsx_runtime.jsx)("button", { onClick: handleSave, disabled: saving, className: "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: saving ? 'Saving...' : 'Save Preferences' })] })] }) }) })] }));
};
/* harmony default export */ const components_NotificationSettings = (NotificationSettings);

;// ./src/components/Navigation.tsx

// src/components/Navigation.tsx







const Navigation = ({ authUser, userSignOut }) => {
    const location = (0,react_router_dist/* useLocation */.zy)();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0,react.useState)(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = (0,react.useState)(false);
    const [activePath, setActivePath] = (0,react.useState)('/');
    const [isScrolled, setIsScrolled] = (0,react.useState)(false);
    const [showNotificationCenter, setShowNotificationCenter] = (0,react.useState)(false);
    const [showNotificationSettings, setShowNotificationSettings] = (0,react.useState)(false);
    const { t, i18n } = (0,es/* useTranslation */.Bd)();
    (0,react.useEffect)(() => {
        setActivePath(location.pathname);
    }, [location]);
    (0,react.useEffect)(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (!isMobileMenuOpen) {
            setIsUserMenuOpen(false);
        }
    };
    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
        if (!isUserMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };
    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };
    const isActive = (path) => {
        return activePath === path;
    };
    const navigationLinks = [
        { to: '/', label: t('nav.home') },
        { to: '/crew', label: t('nav.crew') },
        { to: '/jobs', label: t('nav.jobs') },
        { to: '/projects', label: t('nav.projects') },
        { to: '/collaboration', label: t('nav.collaboration') },
    ];
    const authenticatedLinks = [
        { to: '/social', label: t('nav.social') },
        { to: '/edit-profile', label: t('nav.resumeBuilder') },
    ];
    const jobManagementLinks = [
        { to: '/jobs/posted', label: t('nav.myPostedJobs') },
        { to: '/jobs/analytics', label: t('nav.jobAnalytics') },
        { to: '/post-job', label: t('nav.postNewJob') },
    ];
    let notifications = [];
    let loading = false;
    let unreadCount = 0;
    try {
        const notificationsData = useNotifications();
        notifications = notificationsData.notifications || [];
        loading = notificationsData.loading || false;
        unreadCount = notificationsData.unreadCount || 0;
    }
    catch (error) {
        console.error('[Navigation] Error loading notifications:', error);
        notifications = [];
        loading = false;
        unreadCount = 0;
    }
    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'es', label: 'ES' },
    ];
    // Function to get user display name (like "franciscovaldez")
    const getUserDisplayName = (user) => {
        if (user?.displayName) {
            return user.displayName.toLowerCase().replace(/\s+/g, '');
        }
        if (user?.email) {
            const emailName = user.email.split('@')[0];
            return emailName.toLowerCase();
        }
        return 'user';
    };
    return ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)("nav", { className: `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
                    : 'bg-white/80 backdrop-blur-sm border-b border-gray-100/50'}`, children: (0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between h-16", children: [(0,jsx_runtime.jsx)("div", { className: "flex items-center", children: (0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/", className: "group flex items-center space-x-2", onClick: closeAllMenus, children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent tracking-tight", children: "My Film Jobs" }), (0,jsx_runtime.jsx)("div", { className: "absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" })] }) }) }), (0,jsx_runtime.jsxs)("div", { className: "hidden md:flex items-center space-x-1", children: [navigationLinks.map((link) => {
                                        // Special handling for Jobs dropdown
                                        if (link.to === '/jobs') {
                                            return ((0,jsx_runtime.jsxs)("div", { className: "relative group", children: [(0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: "/jobs", className: `relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-1 ${isActive('/jobs') || isActive('/jobs/posted') || isActive('/jobs/analytics') || isActive('/post-job')
                                                            ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'}`, onClick: closeAllMenus, style: { zIndex: 2, position: 'relative' }, children: [(0,jsx_runtime.jsx)("span", { children: t('nav.jobs') }), (0,jsx_runtime.jsx)("svg", { className: "w-4 h-4 ml-1 inline-block", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0,jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), (0,jsx_runtime.jsx)("div", { className: "absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50", children: (0,jsx_runtime.jsxs)("div", { className: "py-2", children: [(0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/jobs", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900", onClick: closeAllMenus, children: t('nav.jobs') }), authUser && ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/jobs/posted", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900", onClick: closeAllMenus, children: t('nav.myPostedJobs') }), (0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/jobs/analytics", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900", onClick: closeAllMenus, children: t('nav.jobAnalytics') }), (0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/post-job", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900", onClick: closeAllMenus, children: t('nav.postNewJob') })] }))] }) })] }, link.to));
                                        }
                                        // Regular link handling
                                        return ((0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: link.to, className: `relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isActive(link.to)
                                                ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'}`, onClick: closeAllMenus, children: [link.label, isActive(link.to) && ((0,jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" }))] }, link.to));
                                    }), authUser && authenticatedLinks.map((link) => ((0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: link.to, className: `relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isActive(link.to)
                                            ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'}`, onClick: closeAllMenus, children: [link.label, isActive(link.to) && ((0,jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" }))] }, link.to))), (0,jsx_runtime.jsxs)("button", { onClick: () => setShowNotificationCenter(true), className: "relative ml-2 p-2 rounded-full hover:bg-gray-100 transition", children: [(0,jsx_runtime.jsx)(bell/* default */.A, { className: "w-6 h-6 text-gray-700" }), unreadCount > 0 && ((0,jsx_runtime.jsx)("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow-lg", children: unreadCount }))] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [(0,jsx_runtime.jsx)("div", { className: "relative", children: (0,jsx_runtime.jsx)("button", { className: "flex items-center px-2 py-1 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50/60 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200", "aria-label": "Change language", tabIndex: 0, children: languages.map((lang, idx) => ((0,jsx_runtime.jsxs)("span", { onClick: e => {
                                                    e.stopPropagation();
                                                    i18n.changeLanguage(lang.code);
                                                }, className: `cursor-pointer ${i18n.language === lang.code ? 'text-blue-700 font-bold' : 'text-gray-500 hover:text-blue-600'}`, children: [lang.label, idx < languages.length - 1 && (0,jsx_runtime.jsx)("span", { className: "mx-1 text-gray-300", children: "/" })] }, lang.code))) }) }), authUser ? ((0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsxs)("button", { onClick: toggleUserMenu, className: "flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 group", children: [(0,jsx_runtime.jsx)("div", { className: "w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium", children: authUser.email?.[0].toUpperCase() || 'U' }), (0,jsx_runtime.jsx)("span", { className: "hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900", children: getUserDisplayName(authUser) }), (0,jsx_runtime.jsx)(chevron_down/* default */.A, { size: 16, className: `text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}` })] }), isUserMenuOpen && ((0,jsx_runtime.jsxs)("div", { className: "absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/50 py-2 z-50 backdrop-blur-sm", children: [(0,jsx_runtime.jsxs)("div", { className: "px-4 py-3 border-b border-gray-100", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-900", children: authUser.email }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Film Professional" })] }), (0,jsx_runtime.jsxs)("div", { className: "py-2", children: [authenticatedLinks.map((link) => ((0,jsx_runtime.jsx)(dist/* Link */.N_, { to: link.to, className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors", onClick: closeAllMenus, children: link.label }, link.to))), (0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: "/applications", className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors", onClick: closeAllMenus, children: ["\uD83D\uDCDD ", t('nav.myApplications')] }), (0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: "/jobs/posted", className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors", onClick: closeAllMenus, children: ["\uD83D\uDCBC ", t('nav.postedJobs')] }), (0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: "/settings", className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors", onClick: closeAllMenus, children: [(0,jsx_runtime.jsx)(settings/* default */.A, { size: 16, className: "mr-2" }), t('nav.settings')] }), (0,jsx_runtime.jsxs)("button", { onClick: () => setShowNotificationSettings(true), className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors", children: [(0,jsx_runtime.jsx)(settings/* default */.A, { size: 16, className: "mr-2" }), t('nav.notificationSettings')] })] }), (0,jsx_runtime.jsx)("div", { className: "border-t border-gray-100 pt-2", children: (0,jsx_runtime.jsx)("button", { onClick: () => {
                                                                    userSignOut();
                                                                    closeAllMenus();
                                                                }, className: "block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors", children: t('nav.signOut') }) })] }))] }) })) : ((0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [(0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/login", className: "px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors", children: t('nav.signIn') }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                                    closeAllMenus();
                                                    window.location.href = '/register';
                                                }, className: "px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md", children: t('nav.getStarted') })] })), (0,jsx_runtime.jsx)("div", { className: "md:hidden", children: (0,jsx_runtime.jsx)("button", { onClick: toggleMobileMenu, className: "p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-colors", "aria-label": "Toggle mobile menu", children: isMobileMenuOpen ? (0,jsx_runtime.jsx)(x/* default */.A, { size: 24 }) : (0,jsx_runtime.jsx)(menu/* default */.A, { size: 24 }) }) })] })] }) }) }), isMobileMenuOpen && ((0,jsx_runtime.jsx)("div", { className: "md:hidden fixed top-16 left-0 right-0 bottom-0 bg-white z-50", children: (0,jsx_runtime.jsxs)("div", { className: "px-4 py-6 space-y-4 h-full overflow-y-auto", children: [(0,jsx_runtime.jsx)("div", { className: "space-y-2", children: navigationLinks.map((link) => ((0,jsx_runtime.jsx)(dist/* Link */.N_, { to: link.to, className: `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(link.to)
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`, onClick: closeAllMenus, children: link.label }, link.to))) }), authUser && ((0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: (0,jsx_runtime.jsxs)("div", { className: "border-t border-gray-200 pt-4", children: [(0,jsx_runtime.jsx)("p", { className: "px-4 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3", children: "My Account" }), (0,jsx_runtime.jsxs)("div", { className: "space-y-2", children: [authenticatedLinks.map((link) => ((0,jsx_runtime.jsx)(dist/* Link */.N_, { to: link.to, className: `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(link.to)
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`, onClick: closeAllMenus, children: link.label }, link.to))), (0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: "/applications", className: `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/applications')
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`, onClick: closeAllMenus, children: ["\uD83D\uDCDD ", t('nav.myApplications')] }), (0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: "/jobs/posted", className: `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/jobs/posted')
                                                    ? 'text-blue-600 bg-blue-50'
                                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`, onClick: closeAllMenus, children: ["\uD83D\uDCBC ", t('nav.postedJobs')] })] })] }) })), (0,jsx_runtime.jsx)("div", { className: "border-t border-gray-200 pt-4 space-y-3", children: !authUser ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/login", className: "block w-full px-4 py-3 text-center font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", onClick: closeAllMenus, children: t('nav.signIn') }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                            closeAllMenus();
                                            window.location.href = '/register';
                                        }, className: "block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm", children: t('nav.getStarted') })] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "px-4 py-3 bg-gray-50 rounded-lg", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-900", children: authUser.email }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Film Professional" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                            userSignOut();
                                            closeAllMenus();
                                        }, className: "block w-full px-4 py-3 text-center font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: t('nav.signOut') })] })) })] }) })), isMobileMenuOpen && ((0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden", onClick: closeAllMenus, style: { top: '64px' } })), (0,jsx_runtime.jsx)(components_NotificationCenter, { isOpen: showNotificationCenter, onClose: () => setShowNotificationCenter(false) }), (0,jsx_runtime.jsx)(components_NotificationSettings, { isOpen: showNotificationSettings, onClose: () => setShowNotificationSettings(false) })] }));
};
/* harmony default export */ const components_Navigation = (Navigation);

;// ./src/App.tsx











// Import components

function App() {
    const { currentUser, logout } = (0,AuthContext/* useAuth */.A)();
    console.log('[App] Rendering with currentUser:', currentUser?.email);
    // Global error handler for unhandled promise rejections
    (0,react.useEffect)(() => {
        console.log('[App] Setting up global error handlers...');
        const handleUnhandledRejection = (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        };
        const handleUnhandledError = (event) => {
            console.error('Unhandled error:', event.error);
        };
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleUnhandledError);
        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleUnhandledError);
        };
    }, []);
    const handleSignOut = async () => {
        try {
            await logout();
            console.log('User signed out successfully');
        }
        catch (error) {
            console.error('Error signing out:', error);
        }
    };
    return ((0,jsx_runtime.jsx)(ThemeProvider/* ThemeProvider */.NP, { children: (0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-background text-foreground", style: { fontFamily: 'Inter, sans-serif' }, children: [(0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50 text-gray-900", children: [(0,jsx_runtime.jsx)(components_Navigation, { authUser: currentUser, userSignOut: handleSignOut }), (0,jsx_runtime.jsx)("main", { className: "container mx-auto px-4 py-8 pt-24", children: (0,jsx_runtime.jsx)(react.Suspense, { fallback: (0,jsx_runtime.jsx)("div", { className: "flex items-center justify-center min-h-[400px]", children: (0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }), children: (0,jsx_runtime.jsx)(react_router_dist/* Outlet */.sv, {}) }) })] }), (0,jsx_runtime.jsx)(react_hot_toast_dist/* Toaster */.l$, { position: "top-right", toastOptions: {
                        duration: 4000,
                        className: '!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100',
                        success: {
                            iconTheme: {
                                primary: '#10B981',
                                secondary: 'white',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: 'white',
                            },
                        },
                    } })] }) }));
}
/* harmony default export */ const src_App = (App);

;// ./src/router.tsx




// Lazy load pages for better performance
const ProducerView = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6354), __webpack_require__.e(9505), __webpack_require__.e(4528)]).then(__webpack_require__.bind(__webpack_require__, 4528)));
const HomePage = react.lazy(() => __webpack_require__.e(/* import() */ 1415).then(__webpack_require__.bind(__webpack_require__, 1415)));
const MyProjectsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(6901), __webpack_require__.e(4008)]).then(__webpack_require__.bind(__webpack_require__, 4008)));
const SavedCrewProfilesPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6354), __webpack_require__.e(9505), __webpack_require__.e(3608)]).then(__webpack_require__.bind(__webpack_require__, 3608)));
const SavedProjectsPage = react.lazy(() => __webpack_require__.e(/* import() */ 4087).then(__webpack_require__.bind(__webpack_require__, 4087)));
const CollectionsHubPage = react.lazy(() => __webpack_require__.e(/* import() */ 3124).then(__webpack_require__.bind(__webpack_require__, 743)));
const SocialPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(856), __webpack_require__.e(9505), __webpack_require__.e(4672), __webpack_require__.e(5091)]).then(__webpack_require__.bind(__webpack_require__, 5091)));
const CollaborationPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6372), __webpack_require__.e(1409), __webpack_require__.e(6060), __webpack_require__.e(9651)]).then(__webpack_require__.bind(__webpack_require__, 9651)));
const SettingsPage = react.lazy(() => __webpack_require__.e(/* import() */ 2443).then(__webpack_require__.bind(__webpack_require__, 2443)));
const JobsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(7737)]).then(__webpack_require__.bind(__webpack_require__, 7737)));
const PostJobPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(856), __webpack_require__.e(1409), __webpack_require__.e(7011)]).then(__webpack_require__.bind(__webpack_require__, 7011)));
const JobDetailPage = react.lazy(() => __webpack_require__.e(/* import() */ 8004).then(__webpack_require__.bind(__webpack_require__, 8004)));
const DebugJobsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(9009)]).then(__webpack_require__.bind(__webpack_require__, 9009)));
const EditProfilePage = react.lazy(() => __webpack_require__.e(/* import() */ 6134).then(__webpack_require__.bind(__webpack_require__, 6134)));
const PublicResumePage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(3833), __webpack_require__.e(9505), __webpack_require__.e(3388)]).then(__webpack_require__.bind(__webpack_require__, 3388)));
const ChatTestPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(4672), __webpack_require__.e(336)]).then(__webpack_require__.bind(__webpack_require__, 336)));
const LoginPage = react.lazy(() => __webpack_require__.e(/* import() */ 8139).then(__webpack_require__.bind(__webpack_require__, 8139)));
const RegisterPage = react.lazy(() => __webpack_require__.e(/* import() */ 5).then(__webpack_require__.bind(__webpack_require__, 5)));
const ApplicationDetailPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(3398), __webpack_require__.e(4567)]).then(__webpack_require__.bind(__webpack_require__, 4567)));
const JobApplicationForm = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6093), __webpack_require__.e(2192)]).then(__webpack_require__.bind(__webpack_require__, 2192)));
const JobApplicationDashboard = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6093), __webpack_require__.e(7748)]).then(__webpack_require__.bind(__webpack_require__, 7748)));
const ApplicationSuccessPage = react.lazy(() => __webpack_require__.e(/* import() */ 8897).then(__webpack_require__.bind(__webpack_require__, 8897)));
const EditJobApplication = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6093), __webpack_require__.e(7482)]).then(__webpack_require__.bind(__webpack_require__, 7482)));
const JobPosterDashboard = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6093), __webpack_require__.e(7269)]).then(__webpack_require__.bind(__webpack_require__, 7269)));
const JobApplicationsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(856), __webpack_require__.e(6093), __webpack_require__.e(8158)]).then(__webpack_require__.bind(__webpack_require__, 8158)));
const JobApplicantsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(856), __webpack_require__.e(3398), __webpack_require__.e(766)]).then(__webpack_require__.bind(__webpack_require__, 766)));
const AppliedJobsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(6093), __webpack_require__.e(7757)]).then(__webpack_require__.bind(__webpack_require__, 7757)));
const SavedJobsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(1603)]).then(__webpack_require__.bind(__webpack_require__, 1603)));
const ApplicationDashboard = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(6500), __webpack_require__.e(6093), __webpack_require__.e(3029)]).then(__webpack_require__.bind(__webpack_require__, 3029)));
const ApplicationAnalytics = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(6093), __webpack_require__.e(4873)]).then(__webpack_require__.bind(__webpack_require__, 4873)));
const JobPosterAnalytics = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(4493)]).then(__webpack_require__.bind(__webpack_require__, 4493)));
const ProjectsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(5295), __webpack_require__.e(6901), __webpack_require__.e(1263)]).then(__webpack_require__.bind(__webpack_require__, 1263)));
const ProjectDetailPage = react.lazy(() => __webpack_require__.e(/* import() */ 4649).then(__webpack_require__.bind(__webpack_require__, 4649)));
const ProjectDashboard = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6372), __webpack_require__.e(2608), __webpack_require__.e(6060), __webpack_require__.e(4381)]).then(__webpack_require__.bind(__webpack_require__, 4381)));
const AddProject = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(6354), __webpack_require__.e(9707), __webpack_require__.e(1530)]).then(__webpack_require__.bind(__webpack_require__, 1530)));
const SimpleEmailTestPage = react.lazy(() => __webpack_require__.e(/* import() */ 8566).then(__webpack_require__.bind(__webpack_require__, 8566)));
const EmailIntegrationTestPage = react.lazy(() => __webpack_require__.e(/* import() */ 5862).then(__webpack_require__.bind(__webpack_require__, 5862)));
// Import the main App component that will handle the layout

function createAppRouter() {
    return (0,dist/* createBrowserRouter */.Ys)([
        {
            path: '/',
            element: (0,jsx_runtime.jsx)(src_App, {}),
            children: [
                { index: true, element: (0,jsx_runtime.jsx)(HomePage, {}) },
                {
                    path: 'crew',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ProducerView, {}) }))
                },
                {
                    path: 'projects',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ProjectsPage, {}) }))
                },
                {
                    path: 'projects/create',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(AddProject, {}) }))
                },
                {
                    path: 'projects/:projectId',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ProjectDetailPage, {}) }))
                },
                {
                    path: 'projects/:projectId/manage',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ProjectDashboard, {}) }))
                },
                {
                    path: 'email-test',
                    element: (0,jsx_runtime.jsx)(SimpleEmailTestPage, {})
                },
                {
                    path: 'email-integration-test',
                    element: (0,jsx_runtime.jsx)(EmailIntegrationTestPage, {})
                },
                {
                    path: 'login',
                    element: ((0,jsx_runtime.jsx)(PublicRoute, { children: (0,jsx_runtime.jsx)(LoginPage, {}) }))
                },
                {
                    path: 'register',
                    element: ((0,jsx_runtime.jsx)(PublicRoute, { children: (0,jsx_runtime.jsx)(RegisterPage, {}) }))
                },
                {
                    path: 'my-projects',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(MyProjectsPage, {}) }))
                },
                {
                    path: 'saved-crew',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SavedCrewProfilesPage, {}) }))
                },
                {
                    path: 'saved-projects',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SavedProjectsPage, {}) }))
                },
                {
                    path: 'collections',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(CollectionsHubPage, {}) }))
                },
                {
                    path: 'social',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SocialPage, {}) }))
                },
                {
                    path: 'chat',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ChatTestPage, {}) }))
                },
                {
                    path: 'collaboration',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(CollaborationPage, {}) }))
                },
                {
                    path: 'settings',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SettingsPage, {}) }))
                },
                {
                    path: 'edit-profile',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(EditProfilePage, {}) }))
                },
                { path: 'resume/:uid', element: (0,jsx_runtime.jsx)(PublicResumePage, {}) },
                {
                    path: 'jobs',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(JobsPage, {}) }))
                },
                {
                    path: 'jobs/:jobId',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(JobDetailPage, {}) }))
                },
                {
                    path: 'jobs/:jobId/apply',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(JobApplicationForm, {}) }))
                },
                {
                    path: 'applications',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(JobApplicationDashboard, {}) }))
                },
                {
                    path: 'applications/:applicationId',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ApplicationDetailPage, {}) }))
                },
                {
                    path: 'applications/:applicationId/edit',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(EditJobApplication, {}) }))
                },
                {
                    path: 'applications/:applicationId/success',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ApplicationSuccessPage, {}) }))
                },
                {
                    path: 'jobs/posted',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(JobPosterDashboard, {}) }))
                },
                {
                    path: 'jobs/:jobId/applications',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(JobApplicantsPage, {}) }))
                },
                {
                    path: 'post-job',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(PostJobPage, {}) }))
                },
                {
                    path: 'jobs/applied',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(AppliedJobsPage, {}) }))
                },
                {
                    path: 'jobs/saved',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SavedJobsPage, {}) }))
                },
                {
                    path: 'applications/dashboard',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ApplicationDashboard, {}) }))
                },
                {
                    path: 'applications/analytics',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(ApplicationAnalytics, {}) }))
                },
                {
                    path: 'jobs/analytics',
                    element: ((0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(JobPosterAnalytics, {}) }))
                },
                ...( false ? 0 : []),
            ],
        },
    ]);
}

;// ./src/index.tsx

// Initialize console filter BEFORE anything else to catch Firebase errors
// import './utilities/consoleFilter';






// Global error handler to catch any runtime errors
window.addEventListener('error', function (event) {
    console.error('Global error caught:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
    });
});
// Global handler for all <img> errors (for blob URLs)
document.addEventListener('error', function (e) {
    const target = e.target;
    if (target.tagName === 'IMG' &&
        target.src.startsWith('blob:') &&
        !target.src.endsWith('/default-avatar.svg')) {
        // Prevent the error from being logged to console
        e.preventDefault();
        target.src = '/default-avatar.svg';
    }
}, true);
// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', function (e) {
    console.error('Unhandled promise rejection:', e.reason);
});
// Create router instance once
const router = createAppRouter();
const RootWithProvider = () => ((0,jsx_runtime.jsx)(AuthContext/* AuthProvider */.O, { children: (0,jsx_runtime.jsx)(dist/* RouterProvider */.pg, { router: router }) }));
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = client.createRoot(rootElement);
    root.render((0,jsx_runtime.jsx)(RootWithProvider, {}));
}


/***/ }),

/***/ 8321:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4417);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(2612), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* src/styles/globals.css */
*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}
::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}
/* ! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com */
/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/
*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}
::before,
::after {
  --tw-content: '';
}
/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/
html,
:host {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
  font-variation-settings: normal; /* 6 */
  -webkit-tap-highlight-color: transparent; /* 7 */
}
/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/
body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}
/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/
hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}
/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/
abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}
/*
Remove the default font size and weight for headings.
*/
h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}
/*
Reset links to optimize for opt-in styling instead of opt-out.
*/
a {
  color: inherit;
  text-decoration: inherit;
}
/*
Add the correct font weight in Edge and Safari.
*/
b,
strong {
  font-weight: bolder;
}
/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/
code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */
  font-feature-settings: normal; /* 2 */
  font-variation-settings: normal; /* 3 */
  font-size: 1em; /* 4 */
}
/*
Add the correct font size in all browsers.
*/
small {
  font-size: 80%;
}
/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}
sub {
  bottom: -0.25em;
}
sup {
  top: -0.5em;
}
/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/
table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}
/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/
button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-feature-settings: inherit; /* 1 */
  font-variation-settings: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  letter-spacing: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}
/*
Remove the inheritance of text transform in Edge and Firefox.
*/
button,
select {
  text-transform: none;
}
/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/
button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}
/*
Use the modern Firefox focus style for all focusable elements.
*/
:-moz-focusring {
  outline: auto;
}
/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/
:-moz-ui-invalid {
  box-shadow: none;
}
/*
Add the correct vertical alignment in Chrome and Firefox.
*/
progress {
  vertical-align: baseline;
}
/*
Correct the cursor style of increment and decrement buttons in Safari.
*/
::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}
/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/
[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}
/*
Remove the inner padding in Chrome and Safari on macOS.
*/
::-webkit-search-decoration {
  -webkit-appearance: none;
}
/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/
::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}
/*
Add the correct display in Chrome and Safari.
*/
summary {
  display: list-item;
}
/*
Removes the default spacing and border for appropriate elements.
*/
blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}
fieldset {
  margin: 0;
  padding: 0;
}
legend {
  padding: 0;
}
ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}
/*
Reset default styling for dialogs.
*/
dialog {
  padding: 0;
}
/*
Prevent resizing textareas horizontally by default.
*/
textarea {
  resize: vertical;
}
/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/
input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}
input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}
/*
Set the default cursor for buttons.
*/
button,
[role="button"] {
  cursor: pointer;
}
/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}
/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/
img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}
/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/
img,
video {
  max-width: 100%;
  height: auto;
}
/* Make elements with the HTML hidden attribute stay hidden by default */
[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}
.container {
  width: 100%;
}
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}
@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.pointer-events-none {
  pointer-events: none;
}
.visible {
  visibility: visible;
}
.invisible {
  visibility: hidden;
}
.static {
  position: static;
}
.fixed {
  position: fixed;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.sticky {
  position: sticky;
}
.-inset-1 {
  inset: -0.25rem;
}
.inset-0 {
  inset: 0px;
}
.inset-y-0 {
  top: 0px;
  bottom: 0px;
}
.-bottom-0\\.5 {
  bottom: -0.125rem;
}
.-bottom-1 {
  bottom: -0.25rem;
}
.-bottom-2 {
  bottom: -0.5rem;
}
.-bottom-40 {
  bottom: -10rem;
}
.-bottom-8 {
  bottom: -2rem;
}
.-left-40 {
  left: -10rem;
}
.-right-0\\.5 {
  right: -0.125rem;
}
.-right-1 {
  right: -0.25rem;
}
.-right-2 {
  right: -0.5rem;
}
.-right-40 {
  right: -10rem;
}
.-top-1 {
  top: -0.25rem;
}
.-top-2 {
  top: -0.5rem;
}
.-top-40 {
  top: -10rem;
}
.bottom-0 {
  bottom: 0px;
}
.bottom-2 {
  bottom: 0.5rem;
}
.bottom-3 {
  bottom: 0.75rem;
}
.left-0 {
  left: 0px;
}
.left-1 {
  left: 0.25rem;
}
.left-1\\/2 {
  left: 50%;
}
.left-2 {
  left: 0.5rem;
}
.left-2\\.5 {
  left: 0.625rem;
}
.left-3 {
  left: 0.75rem;
}
.left-3\\/4 {
  left: 75%;
}
.left-4 {
  left: 1rem;
}
.right-0 {
  right: 0px;
}
.right-1 {
  right: 0.25rem;
}
.right-2 {
  right: 0.5rem;
}
.right-3 {
  right: 0.75rem;
}
.right-4 {
  right: 1rem;
}
.top-0 {
  top: 0px;
}
.top-1\\/2 {
  top: 50%;
}
.top-16 {
  top: 4rem;
}
.top-2 {
  top: 0.5rem;
}
.top-2\\.5 {
  top: 0.625rem;
}
.top-3 {
  top: 0.75rem;
}
.top-4 {
  top: 1rem;
}
.top-8 {
  top: 2rem;
}
.top-full {
  top: 100%;
}
.-z-10 {
  z-index: -10;
}
.z-10 {
  z-index: 10;
}
.z-20 {
  z-index: 20;
}
.z-40 {
  z-index: 40;
}
.z-50 {
  z-index: 50;
}
.col-span-2 {
  grid-column: span 2 / span 2;
}
.col-span-full {
  grid-column: 1 / -1;
}
.float-right {
  float: right;
}
.-mx-2 {
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}
.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
.mx-4 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.my-8 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.-ml-0\\.5 {
  margin-left: -0.125rem;
}
.-ml-1 {
  margin-left: -0.25rem;
}
.mb-0\\.5 {
  margin-bottom: 0.125rem;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-1\\.5 {
  margin-bottom: 0.375rem;
}
.mb-12 {
  margin-bottom: 3rem;
}
.mb-16 {
  margin-bottom: 4rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-5 {
  margin-bottom: 1.25rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.mb-8 {
  margin-bottom: 2rem;
}
.ml-1 {
  margin-left: 0.25rem;
}
.ml-1\\.5 {
  margin-left: 0.375rem;
}
.ml-2 {
  margin-left: 0.5rem;
}
.ml-3 {
  margin-left: 0.75rem;
}
.ml-4 {
  margin-left: 1rem;
}
.ml-8 {
  margin-left: 2rem;
}
.ml-auto {
  margin-left: auto;
}
.mr-1 {
  margin-right: 0.25rem;
}
.mr-1\\.5 {
  margin-right: 0.375rem;
}
.mr-2 {
  margin-right: 0.5rem;
}
.mr-3 {
  margin-right: 0.75rem;
}
.mr-4 {
  margin-right: 1rem;
}
.mt-0\\.5 {
  margin-top: 0.125rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.mt-1\\.5 {
  margin-top: 0.375rem;
}
.mt-10 {
  margin-top: 2.5rem;
}
.mt-12 {
  margin-top: 3rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.mt-8 {
  margin-top: 2rem;
}
.mt-auto {
  margin-top: auto;
}
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.block {
  display: block;
}
.inline-block {
  display: inline-block;
}
.inline {
  display: inline;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.table {
  display: table;
}
.grid {
  display: grid;
}
.hidden {
  display: none;
}
.h-0\\.5 {
  height: 0.125rem;
}
.h-1 {
  height: 0.25rem;
}
.h-1\\.5 {
  height: 0.375rem;
}
.h-10 {
  height: 2.5rem;
}
.h-12 {
  height: 3rem;
}
.h-14 {
  height: 3.5rem;
}
.h-16 {
  height: 4rem;
}
.h-2 {
  height: 0.5rem;
}
.h-2\\.5 {
  height: 0.625rem;
}
.h-20 {
  height: 5rem;
}
.h-24 {
  height: 6rem;
}
.h-3 {
  height: 0.75rem;
}
.h-3\\.5 {
  height: 0.875rem;
}
.h-32 {
  height: 8rem;
}
.h-4 {
  height: 1rem;
}
.h-48 {
  height: 12rem;
}
.h-5 {
  height: 1.25rem;
}
.h-6 {
  height: 1.5rem;
}
.h-64 {
  height: 16rem;
}
.h-7 {
  height: 1.75rem;
}
.h-72 {
  height: 18rem;
}
.h-8 {
  height: 2rem;
}
.h-80 {
  height: 20rem;
}
.h-9 {
  height: 2.25rem;
}
.h-96 {
  height: 24rem;
}
.h-\\[600px\\] {
  height: 600px;
}
.h-\\[85vh\\] {
  height: 85vh;
}
.h-auto {
  height: auto;
}
.h-full {
  height: 100%;
}
.h-screen {
  height: 100vh;
}
.max-h-40 {
  max-height: 10rem;
}
.max-h-48 {
  max-height: 12rem;
}
.max-h-60 {
  max-height: 15rem;
}
.max-h-96 {
  max-height: 24rem;
}
.max-h-\\[80vh\\] {
  max-height: 80vh;
}
.max-h-\\[90vh\\] {
  max-height: 90vh;
}
.min-h-0 {
  min-height: 0px;
}
.min-h-\\[200px\\] {
  min-height: 200px;
}
.min-h-\\[400px\\] {
  min-height: 400px;
}
.min-h-\\[80px\\] {
  min-height: 80px;
}
.min-h-screen {
  min-height: 100vh;
}
.w-1 {
  width: 0.25rem;
}
.w-1\\.5 {
  width: 0.375rem;
}
.w-1\\/2 {
  width: 50%;
}
.w-1\\/3 {
  width: 33.333333%;
}
.w-10 {
  width: 2.5rem;
}
.w-11 {
  width: 2.75rem;
}
.w-12 {
  width: 3rem;
}
.w-14 {
  width: 3.5rem;
}
.w-16 {
  width: 4rem;
}
.w-2 {
  width: 0.5rem;
}
.w-2\\/3 {
  width: 66.666667%;
}
.w-20 {
  width: 5rem;
}
.w-24 {
  width: 6rem;
}
.w-28 {
  width: 7rem;
}
.w-3 {
  width: 0.75rem;
}
.w-3\\.5 {
  width: 0.875rem;
}
.w-3\\/4 {
  width: 75%;
}
.w-32 {
  width: 8rem;
}
.w-36 {
  width: 9rem;
}
.w-4 {
  width: 1rem;
}
.w-4\\/5 {
  width: 80%;
}
.w-40 {
  width: 10rem;
}
.w-48 {
  width: 12rem;
}
.w-5 {
  width: 1.25rem;
}
.w-56 {
  width: 14rem;
}
.w-6 {
  width: 1.5rem;
}
.w-64 {
  width: 16rem;
}
.w-7 {
  width: 1.75rem;
}
.w-72 {
  width: 18rem;
}
.w-8 {
  width: 2rem;
}
.w-80 {
  width: 20rem;
}
.w-9 {
  width: 2.25rem;
}
.w-\\[180px\\] {
  width: 180px;
}
.w-full {
  width: 100%;
}
.min-w-0 {
  min-width: 0px;
}
.min-w-64 {
  min-width: 16rem;
}
.min-w-\\[20px\\] {
  min-width: 20px;
}
.min-w-full {
  min-width: 100%;
}
.min-w-max {
  min-width: -moz-max-content;
  min-width: max-content;
}
.max-w-2xl {
  max-width: 42rem;
}
.max-w-3xl {
  max-width: 48rem;
}
.max-w-4xl {
  max-width: 56rem;
}
.max-w-5xl {
  max-width: 64rem;
}
.max-w-6xl {
  max-width: 72rem;
}
.max-w-7xl {
  max-width: 80rem;
}
.max-w-full {
  max-width: 100%;
}
.max-w-lg {
  max-width: 32rem;
}
.max-w-md {
  max-width: 28rem;
}
.max-w-none {
  max-width: none;
}
.max-w-xl {
  max-width: 36rem;
}
.max-w-xs {
  max-width: 20rem;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.shrink-0 {
  flex-shrink: 0;
}
.grow {
  flex-grow: 1;
}
.border-collapse {
  border-collapse: collapse;
}
.origin-top-left {
  transform-origin: top left;
}
.origin-top-right {
  transform-origin: top right;
}
.-translate-x-1\\/2 {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.-translate-y-1\\/2 {
  --tw-translate-y: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-x-1 {
  --tw-translate-x: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.translate-x-6 {
  --tw-translate-x: 1.5rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-1 {
  --tw-rotate: 1deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.rotate-180 {
  --tw-rotate: 180deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-100 {
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-105 {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-110 {
  --tw-scale-x: 1.1;
  --tw-scale-y: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.scale-95 {
  --tw-scale-x: .95;
  --tw-scale-y: .95;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.transform {
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}
.animate-bounce {
  animation: bounce 1s infinite;
}
@keyframes pulse {
  50% {
    opacity: .5;
  }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.cursor-pointer {
  cursor: pointer;
}
.select-none {
  -webkit-user-select: none;
     -moz-user-select: none;
          user-select: none;
}
.resize-none {
  resize: none;
}
.resize {
  resize: both;
}
.list-inside {
  list-style-position: inside;
}
.list-disc {
  list-style-type: disc;
}
.appearance-none {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}
.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.grid-cols-7 {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.flex-col {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.items-start {
  align-items: flex-start;
}
.items-end {
  align-items: flex-end;
}
.items-center {
  align-items: center;
}
.justify-start {
  justify-content: flex-start;
}
.justify-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.gap-1 {
  gap: 0.25rem;
}
.gap-12 {
  gap: 3rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-5 {
  gap: 1.25rem;
}
.gap-6 {
  gap: 1.5rem;
}
.gap-8 {
  gap: 2rem;
}
.gap-px {
  gap: 1px;
}
.gap-x-3 {
  -moz-column-gap: 0.75rem;
       column-gap: 0.75rem;
}
.gap-x-4 {
  -moz-column-gap: 1rem;
       column-gap: 1rem;
}
.gap-y-1 {
  row-gap: 0.25rem;
}
.gap-y-6 {
  row-gap: 1.5rem;
}
.-space-x-1\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(-0.375rem * var(--tw-space-x-reverse));
  margin-left: calc(-0.375rem * calc(1 - var(--tw-space-x-reverse)));
}
.-space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(-0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(-0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.-space-y-px > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(-1px * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(-1px * var(--tw-space-y-reverse));
}
.space-x-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.25rem * var(--tw-space-x-reverse));
  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-1\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.375rem * var(--tw-space-x-reverse));
  margin-left: calc(0.375rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1rem * var(--tw-space-x-reverse));
  margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-6 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(1.5rem * var(--tw-space-x-reverse));
  margin-left: calc(1.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-x-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(2rem * var(--tw-space-x-reverse));
  margin-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));
}
.space-y-1 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));
}
.space-y-12 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(3rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(3rem * var(--tw-space-y-reverse));
}
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}
.space-y-2\\.5 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.625rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.625rem * var(--tw-space-y-reverse));
}
.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
}
.space-y-8 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(2rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(2rem * var(--tw-space-y-reverse));
}
.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
.divide-gray-100 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-divide-opacity, 1));
}
.divide-gray-200 > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-divide-opacity, 1));
}
.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-x-auto {
  overflow-x: auto;
}
.overflow-y-auto {
  overflow-y: auto;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-ellipsis {
  text-overflow: ellipsis;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.whitespace-pre-line {
  white-space: pre-line;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.break-words {
  overflow-wrap: break-word;
}
.break-all {
  word-break: break-all;
}
.rounded {
  border-radius: 0.25rem;
}
.rounded-2xl {
  border-radius: 1rem;
}
.rounded-3xl {
  border-radius: 1.5rem;
}
.rounded-full {
  border-radius: 9999px;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.rounded-none {
  border-radius: 0px;
}
.rounded-sm {
  border-radius: 0.125rem;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-b-lg {
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
.rounded-b-md {
  border-bottom-right-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}
.rounded-b-xl {
  border-bottom-right-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}
.rounded-t-lg {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
.rounded-t-md {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}
.border {
  border-width: 1px;
}
.border-0 {
  border-width: 0px;
}
.border-2 {
  border-width: 2px;
}
.border-4 {
  border-width: 4px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-b-2 {
  border-bottom-width: 2px;
}
.border-l-2 {
  border-left-width: 2px;
}
.border-l-4 {
  border-left-width: 4px;
}
.border-r {
  border-right-width: 1px;
}
.border-t {
  border-top-width: 1px;
}
.border-dashed {
  border-style: dashed;
}
.border-blue-100\\/50 {
  border-color: rgb(219 234 254 / 0.5);
}
.border-blue-200 {
  --tw-border-opacity: 1;
  border-color: rgb(191 219 254 / var(--tw-border-opacity, 1));
}
.border-blue-300 {
  --tw-border-opacity: 1;
  border-color: rgb(147 197 253 / var(--tw-border-opacity, 1));
}
.border-blue-500 {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
}
.border-blue-600 {
  --tw-border-opacity: 1;
  border-color: rgb(37 99 235 / var(--tw-border-opacity, 1));
}
.border-current {
  border-color: currentColor;
}
.border-gray-100 {
  --tw-border-opacity: 1;
  border-color: rgb(243 244 246 / var(--tw-border-opacity, 1));
}
.border-gray-100\\/50 {
  border-color: rgb(243 244 246 / 0.5);
}
.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
}
.border-gray-200\\/50 {
  border-color: rgb(229 231 235 / 0.5);
}
.border-gray-300 {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
}
.border-gray-600 {
  --tw-border-opacity: 1;
  border-color: rgb(75 85 99 / var(--tw-border-opacity, 1));
}
.border-gray-800 {
  --tw-border-opacity: 1;
  border-color: rgb(31 41 55 / var(--tw-border-opacity, 1));
}
.border-gray-900 {
  --tw-border-opacity: 1;
  border-color: rgb(17 24 39 / var(--tw-border-opacity, 1));
}
.border-green-200 {
  --tw-border-opacity: 1;
  border-color: rgb(187 247 208 / var(--tw-border-opacity, 1));
}
.border-green-500 {
  --tw-border-opacity: 1;
  border-color: rgb(34 197 94 / var(--tw-border-opacity, 1));
}
.border-indigo-200 {
  --tw-border-opacity: 1;
  border-color: rgb(199 210 254 / var(--tw-border-opacity, 1));
}
.border-orange-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 215 170 / var(--tw-border-opacity, 1));
}
.border-purple-200 {
  --tw-border-opacity: 1;
  border-color: rgb(233 213 255 / var(--tw-border-opacity, 1));
}
.border-red-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));
}
.border-red-300 {
  --tw-border-opacity: 1;
  border-color: rgb(252 165 165 / var(--tw-border-opacity, 1));
}
.border-red-400 {
  --tw-border-opacity: 1;
  border-color: rgb(248 113 113 / var(--tw-border-opacity, 1));
}
.border-red-500 {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}
.border-transparent {
  border-color: transparent;
}
.border-white {
  --tw-border-opacity: 1;
  border-color: rgb(255 255 255 / var(--tw-border-opacity, 1));
}
.border-white\\/30 {
  border-color: rgb(255 255 255 / 0.3);
}
.border-yellow-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 240 138 / var(--tw-border-opacity, 1));
}
.border-yellow-400 {
  --tw-border-opacity: 1;
  border-color: rgb(250 204 21 / var(--tw-border-opacity, 1));
}
.border-yellow-500 {
  --tw-border-opacity: 1;
  border-color: rgb(234 179 8 / var(--tw-border-opacity, 1));
}
.border-l-red-500 {
  --tw-border-opacity: 1;
  border-left-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}
.border-t-blue-600 {
  --tw-border-opacity: 1;
  border-top-color: rgb(37 99 235 / var(--tw-border-opacity, 1));
}
.border-t-transparent {
  border-top-color: transparent;
}
.\\!bg-white {
  --tw-bg-opacity: 1 !important;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1)) !important;
}
.bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity, 1));
}
.bg-black\\/20 {
  background-color: rgb(0 0 0 / 0.2);
}
.bg-black\\/50 {
  background-color: rgb(0 0 0 / 0.5);
}
.bg-blue-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}
.bg-blue-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(96 165 250 / var(--tw-bg-opacity, 1));
}
.bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}
.bg-blue-50\\/80 {
  background-color: rgb(239 246 255 / 0.8);
}
.bg-blue-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
}
.bg-blue-500\\/20 {
  background-color: rgb(59 130 246 / 0.2);
}
.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
}
.bg-gray-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}
.bg-gray-100\\/80 {
  background-color: rgb(243 244 246 / 0.8);
}
.bg-gray-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
}
.bg-gray-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));
}
.bg-gray-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
}
.bg-gray-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}
.bg-gray-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(107 114 128 / var(--tw-bg-opacity, 1));
}
.bg-gray-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));
}
.bg-gray-700 {
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));
}
.bg-gray-800 {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
}
.bg-gray-900 {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
}
.bg-green-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 252 231 / var(--tw-bg-opacity, 1));
}
.bg-green-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(74 222 128 / var(--tw-bg-opacity, 1));
}
.bg-green-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(240 253 244 / var(--tw-bg-opacity, 1));
}
.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}
.bg-green-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}
.bg-indigo-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(224 231 255 / var(--tw-bg-opacity, 1));
}
.bg-indigo-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(238 242 255 / var(--tw-bg-opacity, 1));
}
.bg-indigo-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(79 70 229 / var(--tw-bg-opacity, 1));
}
.bg-orange-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(255 237 213 / var(--tw-bg-opacity, 1));
}
.bg-orange-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(255 247 237 / var(--tw-bg-opacity, 1));
}
.bg-orange-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(234 88 12 / var(--tw-bg-opacity, 1));
}
.bg-pink-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(252 231 243 / var(--tw-bg-opacity, 1));
}
.bg-purple-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(243 232 255 / var(--tw-bg-opacity, 1));
}
.bg-purple-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(250 245 255 / var(--tw-bg-opacity, 1));
}
.bg-purple-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(168 85 247 / var(--tw-bg-opacity, 1));
}
.bg-purple-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(147 51 234 / var(--tw-bg-opacity, 1));
}
.bg-red-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
}
.bg-red-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}
.bg-red-50\\/50 {
  background-color: rgb(254 242 242 / 0.5);
}
.bg-red-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
}
.bg-red-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));
}
.bg-teal-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(204 251 241 / var(--tw-bg-opacity, 1));
}
.bg-transparent {
  background-color: transparent;
}
.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}
.bg-white\\/10 {
  background-color: rgb(255 255 255 / 0.1);
}
.bg-white\\/20 {
  background-color: rgb(255 255 255 / 0.2);
}
.bg-white\\/50 {
  background-color: rgb(255 255 255 / 0.5);
}
.bg-white\\/60 {
  background-color: rgb(255 255 255 / 0.6);
}
.bg-white\\/80 {
  background-color: rgb(255 255 255 / 0.8);
}
.bg-white\\/95 {
  background-color: rgb(255 255 255 / 0.95);
}
.bg-yellow-100 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 249 195 / var(--tw-bg-opacity, 1));
}
.bg-yellow-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 240 138 / var(--tw-bg-opacity, 1));
}
.bg-yellow-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}
.bg-yellow-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(234 179 8 / var(--tw-bg-opacity, 1));
}
.bg-yellow-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity, 1));
}
.bg-opacity-40 {
  --tw-bg-opacity: 0.4;
}
.bg-opacity-50 {
  --tw-bg-opacity: 0.5;
}
.bg-opacity-95 {
  --tw-bg-opacity: 0.95;
}
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
.from-blue-200 {
  --tw-gradient-from: #bfdbfe var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(191 219 254 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-blue-50 {
  --tw-gradient-from: #eff6ff var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(239 246 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-blue-500 {
  --tw-gradient-from: #3b82f6 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(59 130 246 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-blue-500\\/10 {
  --tw-gradient-from: rgb(59 130 246 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(59 130 246 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-blue-600 {
  --tw-gradient-from: #2563eb var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(37 99 235 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-blue-600\\/10 {
  --tw-gradient-from: rgb(37 99 235 / 0.1) var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(37 99 235 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-gray-100 {
  --tw-gradient-from: #f3f4f6 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(243 244 246 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-gray-200 {
  --tw-gradient-from: #e5e7eb var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(229 231 235 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-gray-50 {
  --tw-gradient-from: #f9fafb var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(249 250 251 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-gray-900 {
  --tw-gradient-from: #111827 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(17 24 39 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-green-400 {
  --tw-gradient-from: #4ade80 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(74 222 128 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-red-500 {
  --tw-gradient-from: #ef4444 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(239 68 68 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-slate-50 {
  --tw-gradient-from: #f8fafc var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(248 250 252 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.from-white {
  --tw-gradient-from: #fff var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.via-blue-50 {
  --tw-gradient-to: rgb(239 246 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), #eff6ff var(--tw-gradient-via-position), var(--tw-gradient-to);
}
.via-gray-50 {
  --tw-gradient-to: rgb(249 250 251 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), #f9fafb var(--tw-gradient-via-position), var(--tw-gradient-to);
}
.via-gray-700 {
  --tw-gradient-to: rgb(55 65 81 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), #374151 var(--tw-gradient-via-position), var(--tw-gradient-to);
}
.via-white {
  --tw-gradient-to: rgb(255 255 255 / 0)  var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), #fff var(--tw-gradient-via-position), var(--tw-gradient-to);
}
.to-blue-50 {
  --tw-gradient-to: #eff6ff var(--tw-gradient-to-position);
}
.to-blue-50\\/30 {
  --tw-gradient-to: rgb(239 246 255 / 0.3) var(--tw-gradient-to-position);
}
.to-blue-600 {
  --tw-gradient-to: #2563eb var(--tw-gradient-to-position);
}
.to-blue-700 {
  --tw-gradient-to: #1d4ed8 var(--tw-gradient-to-position);
}
.to-gray-100 {
  --tw-gradient-to: #f3f4f6 var(--tw-gradient-to-position);
}
.to-gray-200 {
  --tw-gradient-to: #e5e7eb var(--tw-gradient-to-position);
}
.to-gray-300 {
  --tw-gradient-to: #d1d5db var(--tw-gradient-to-position);
}
.to-gray-600 {
  --tw-gradient-to: #4b5563 var(--tw-gradient-to-position);
}
.to-gray-900 {
  --tw-gradient-to: #111827 var(--tw-gradient-to-position);
}
.to-green-600 {
  --tw-gradient-to: #16a34a var(--tw-gradient-to-position);
}
.to-indigo-100 {
  --tw-gradient-to: #e0e7ff var(--tw-gradient-to-position);
}
.to-indigo-50 {
  --tw-gradient-to: #eef2ff var(--tw-gradient-to-position);
}
.to-indigo-500 {
  --tw-gradient-to: #6366f1 var(--tw-gradient-to-position);
}
.to-indigo-500\\/10 {
  --tw-gradient-to: rgb(99 102 241 / 0.1) var(--tw-gradient-to-position);
}
.to-indigo-600 {
  --tw-gradient-to: #4f46e5 var(--tw-gradient-to-position);
}
.to-pink-600 {
  --tw-gradient-to: #db2777 var(--tw-gradient-to-position);
}
.to-purple-200 {
  --tw-gradient-to: #e9d5ff var(--tw-gradient-to-position);
}
.to-purple-50 {
  --tw-gradient-to: #faf5ff var(--tw-gradient-to-position);
}
.to-purple-500 {
  --tw-gradient-to: #a855f7 var(--tw-gradient-to-position);
}
.to-purple-600 {
  --tw-gradient-to: #9333ea var(--tw-gradient-to-position);
}
.to-purple-600\\/10 {
  --tw-gradient-to: rgb(147 51 234 / 0.1) var(--tw-gradient-to-position);
}
.to-white {
  --tw-gradient-to: #fff var(--tw-gradient-to-position);
}
.bg-clip-text {
  -webkit-background-clip: text;
          background-clip: text;
}
.fill-current {
  fill: currentColor;
}
.fill-white {
  fill: #fff;
}
.stroke-white {
  stroke: #fff;
}
.object-contain {
  -o-object-fit: contain;
     object-fit: contain;
}
.object-cover {
  -o-object-fit: cover;
     object-fit: cover;
}
.object-center {
  -o-object-position: center;
     object-position: center;
}
.p-0 {
  padding: 0px;
}
.p-1 {
  padding: 0.25rem;
}
.p-1\\.5 {
  padding: 0.375rem;
}
.p-2 {
  padding: 0.5rem;
}
.p-3 {
  padding: 0.75rem;
}
.p-4 {
  padding: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
.p-8 {
  padding: 2rem;
}
.px-0 {
  padding-left: 0px;
  padding-right: 0px;
}
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-1\\.5 {
  padding-left: 0.375rem;
  padding-right: 0.375rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-2\\.5 {
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-5 {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}
.py-0\\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.py-16 {
  padding-top: 4rem;
  padding-bottom: 4rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-2\\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}
.py-20 {
  padding-top: 5rem;
  padding-bottom: 5rem;
}
.py-24 {
  padding-top: 6rem;
  padding-bottom: 6rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
.py-6 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.\\!pr-3 {
  padding-right: 0.75rem !important;
}
.pb-1 {
  padding-bottom: 0.25rem;
}
.pb-2 {
  padding-bottom: 0.5rem;
}
.pb-24 {
  padding-bottom: 6rem;
}
.pb-4 {
  padding-bottom: 1rem;
}
.pb-6 {
  padding-bottom: 1.5rem;
}
.pb-8 {
  padding-bottom: 2rem;
}
.pl-10 {
  padding-left: 2.5rem;
}
.pl-2 {
  padding-left: 0.5rem;
}
.pl-3 {
  padding-left: 0.75rem;
}
.pl-4 {
  padding-left: 1rem;
}
.pl-7 {
  padding-left: 1.75rem;
}
.pl-8 {
  padding-left: 2rem;
}
.pl-9 {
  padding-left: 2.25rem;
}
.pr-1 {
  padding-right: 0.25rem;
}
.pr-10 {
  padding-right: 2.5rem;
}
.pr-12 {
  padding-right: 3rem;
}
.pr-3 {
  padding-right: 0.75rem;
}
.pr-4 {
  padding-right: 1rem;
}
.pr-6 {
  padding-right: 1.5rem;
}
.pr-8 {
  padding-right: 2rem;
}
.pr-9 {
  padding-right: 2.25rem;
}
.pt-1 {
  padding-top: 0.25rem;
}
.pt-10 {
  padding-top: 2.5rem;
}
.pt-12 {
  padding-top: 3rem;
}
.pt-2 {
  padding-top: 0.5rem;
}
.pt-20 {
  padding-top: 5rem;
}
.pt-24 {
  padding-top: 6rem;
}
.pt-3 {
  padding-top: 0.75rem;
}
.pt-4 {
  padding-top: 1rem;
}
.pt-5 {
  padding-top: 1.25rem;
}
.pt-6 {
  padding-top: 1.5rem;
}
.pt-8 {
  padding-top: 2rem;
}
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.align-middle {
  vertical-align: middle;
}
.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}
.text-5xl {
  font-size: 3rem;
  line-height: 1;
}
.text-6xl {
  font-size: 3.75rem;
  line-height: 1;
}
.text-8xl {
  font-size: 6rem;
  line-height: 1;
}
.text-\\[0\\.8rem\\] {
  font-size: 0.8rem;
}
.text-base {
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.font-bold {
  font-weight: 700;
}
.font-extrabold {
  font-weight: 800;
}
.font-light {
  font-weight: 300;
}
.font-medium {
  font-weight: 500;
}
.font-normal {
  font-weight: 400;
}
.font-semibold {
  font-weight: 600;
}
.uppercase {
  text-transform: uppercase;
}
.capitalize {
  text-transform: capitalize;
}
.italic {
  font-style: italic;
}
.leading-none {
  line-height: 1;
}
.leading-normal {
  line-height: 1.5;
}
.leading-relaxed {
  line-height: 1.625;
}
.leading-snug {
  line-height: 1.375;
}
.leading-tight {
  line-height: 1.25;
}
.tracking-tight {
  letter-spacing: -0.025em;
}
.tracking-wide {
  letter-spacing: 0.025em;
}
.tracking-wider {
  letter-spacing: 0.05em;
}
.\\!text-gray-900 {
  --tw-text-opacity: 1 !important;
  color: rgb(17 24 39 / var(--tw-text-opacity, 1)) !important;
}
.text-blue-100 {
  --tw-text-opacity: 1;
  color: rgb(219 234 254 / var(--tw-text-opacity, 1));
}
.text-blue-400 {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity, 1));
}
.text-blue-500 {
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity, 1));
}
.text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}
.text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}
.text-blue-800 {
  --tw-text-opacity: 1;
  color: rgb(30 64 175 / var(--tw-text-opacity, 1));
}
.text-blue-900 {
  --tw-text-opacity: 1;
  color: rgb(30 58 138 / var(--tw-text-opacity, 1));
}
.text-current {
  color: currentColor;
}
.text-gray-300 {
  --tw-text-opacity: 1;
  color: rgb(209 213 219 / var(--tw-text-opacity, 1));
}
.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
}
.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity, 1));
}
.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}
.text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}
.text-gray-800 {
  --tw-text-opacity: 1;
  color: rgb(31 41 55 / var(--tw-text-opacity, 1));
}
.text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity, 1));
}
.text-green-400 {
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity, 1));
}
.text-green-500 {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}
.text-green-600 {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity, 1));
}
.text-green-700 {
  --tw-text-opacity: 1;
  color: rgb(21 128 61 / var(--tw-text-opacity, 1));
}
.text-green-800 {
  --tw-text-opacity: 1;
  color: rgb(22 101 52 / var(--tw-text-opacity, 1));
}
.text-green-900 {
  --tw-text-opacity: 1;
  color: rgb(20 83 45 / var(--tw-text-opacity, 1));
}
.text-indigo-400 {
  --tw-text-opacity: 1;
  color: rgb(129 140 248 / var(--tw-text-opacity, 1));
}
.text-indigo-600 {
  --tw-text-opacity: 1;
  color: rgb(79 70 229 / var(--tw-text-opacity, 1));
}
.text-indigo-800 {
  --tw-text-opacity: 1;
  color: rgb(55 48 163 / var(--tw-text-opacity, 1));
}
.text-orange-500 {
  --tw-text-opacity: 1;
  color: rgb(249 115 22 / var(--tw-text-opacity, 1));
}
.text-orange-600 {
  --tw-text-opacity: 1;
  color: rgb(234 88 12 / var(--tw-text-opacity, 1));
}
.text-orange-700 {
  --tw-text-opacity: 1;
  color: rgb(194 65 12 / var(--tw-text-opacity, 1));
}
.text-orange-800 {
  --tw-text-opacity: 1;
  color: rgb(154 52 18 / var(--tw-text-opacity, 1));
}
.text-orange-900 {
  --tw-text-opacity: 1;
  color: rgb(124 45 18 / var(--tw-text-opacity, 1));
}
.text-pink-800 {
  --tw-text-opacity: 1;
  color: rgb(157 23 77 / var(--tw-text-opacity, 1));
}
.text-purple-400 {
  --tw-text-opacity: 1;
  color: rgb(192 132 252 / var(--tw-text-opacity, 1));
}
.text-purple-600 {
  --tw-text-opacity: 1;
  color: rgb(147 51 234 / var(--tw-text-opacity, 1));
}
.text-purple-700 {
  --tw-text-opacity: 1;
  color: rgb(126 34 206 / var(--tw-text-opacity, 1));
}
.text-purple-800 {
  --tw-text-opacity: 1;
  color: rgb(107 33 168 / var(--tw-text-opacity, 1));
}
.text-purple-900 {
  --tw-text-opacity: 1;
  color: rgb(88 28 135 / var(--tw-text-opacity, 1));
}
.text-red-400 {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
}
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}
.text-red-600 {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}
.text-red-700 {
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
}
.text-red-800 {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
}
.text-red-900 {
  --tw-text-opacity: 1;
  color: rgb(127 29 29 / var(--tw-text-opacity, 1));
}
.text-teal-800 {
  --tw-text-opacity: 1;
  color: rgb(17 94 89 / var(--tw-text-opacity, 1));
}
.text-transparent {
  color: transparent;
}
.text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.text-white\\/80 {
  color: rgb(255 255 255 / 0.8);
}
.text-white\\/90 {
  color: rgb(255 255 255 / 0.9);
}
.text-yellow-500 {
  --tw-text-opacity: 1;
  color: rgb(234 179 8 / var(--tw-text-opacity, 1));
}
.text-yellow-600 {
  --tw-text-opacity: 1;
  color: rgb(202 138 4 / var(--tw-text-opacity, 1));
}
.text-yellow-700 {
  --tw-text-opacity: 1;
  color: rgb(161 98 7 / var(--tw-text-opacity, 1));
}
.text-yellow-800 {
  --tw-text-opacity: 1;
  color: rgb(133 77 14 / var(--tw-text-opacity, 1));
}
.text-yellow-900 {
  --tw-text-opacity: 1;
  color: rgb(113 63 18 / var(--tw-text-opacity, 1));
}
.underline {
  text-decoration-line: underline;
}
.line-through {
  text-decoration-line: line-through;
}
.placeholder-gray-400::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(156 163 175 / var(--tw-placeholder-opacity, 1));
}
.placeholder-gray-400::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(156 163 175 / var(--tw-placeholder-opacity, 1));
}
.placeholder-gray-500::-moz-placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(107 114 128 / var(--tw-placeholder-opacity, 1));
}
.placeholder-gray-500::placeholder {
  --tw-placeholder-opacity: 1;
  color: rgb(107 114 128 / var(--tw-placeholder-opacity, 1));
}
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
.opacity-20 {
  opacity: 0.2;
}
.opacity-25 {
  opacity: 0.25;
}
.opacity-30 {
  opacity: 0.3;
}
.opacity-5 {
  opacity: 0.05;
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-60 {
  opacity: 0.6;
}
.opacity-75 {
  opacity: 0.75;
}
.mix-blend-multiply {
  mix-blend-mode: multiply;
}
.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-2xl {
  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-inner {
  --tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-sm {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.shadow-xl {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.outline-none {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.outline {
  outline-style: solid;
}
.ring-1 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-2 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.ring-black {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity, 1));
}
.ring-blue-500 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));
}
.ring-red-500 {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(239 68 68 / var(--tw-ring-opacity, 1));
}
.ring-opacity-5 {
  --tw-ring-opacity: 0.05;
}
.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.blur-sm {
  --tw-blur: blur(4px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.blur-xl {
  --tw-blur: blur(24px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.filter {
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.backdrop-blur-md {
  --tw-backdrop-blur: blur(12px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.backdrop-blur-sm {
  --tw-backdrop-blur: blur(4px);
  -webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
}
.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.delay-1000 {
  transition-delay: 1000ms;
}
.duration-150 {
  transition-duration: 150ms;
}
.duration-200 {
  transition-duration: 200ms;
}
.duration-300 {
  transition-duration: 300ms;
}
.duration-500 {
  transition-duration: 500ms;
}
.duration-700 {
  transition-duration: 700ms;
}
.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

/* ===== DESIGN SYSTEM VARIABLES ===== */

:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  --primary-950: #172554;

  /* Neutral Colors */
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;
  --neutral-950: #030712;

  /* Success Colors */
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-200: #bbf7d0;
  --success-300: #86efac;
  --success-400: #4ade80;
  --success-500: #22c55e;
  --success-600: #16a34a;
  --success-700: #15803d;
  --success-800: #166534;
  --success-900: #14532d;

  /* Warning Colors */
  --warning-50: #fffbeb;
  --warning-100: #fef3c7;
  --warning-200: #fde68a;
  --warning-300: #fcd34d;
  --warning-400: #fbbf24;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  --warning-700: #b45309;
  --warning-800: #92400e;
  --warning-900: #78350f;

  /* Error Colors */
  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-200: #fecaca;
  --error-300: #fca5a5;
  --error-400: #f87171;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --error-700: #b91c1c;
  --error-800: #991b1b;
  --error-900: #7f1d1d;

  /* Semantic Colors */
  --text-primary: var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --text-tertiary: var(--neutral-500);
  --text-inverse: var(--neutral-50);
  
  --bg-primary: #ffffff;
  --bg-secondary: var(--neutral-50);
  --bg-tertiary: var(--neutral-100);
  --bg-overlay: rgba(0, 0, 0, 0.5);
  
  --border-primary: var(--neutral-200);
  --border-secondary: var(--neutral-300);
  --border-focus: var(--primary-500);
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Spacing */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Transitions */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: var(--neutral-50);
    --text-secondary: var(--neutral-400);
    --text-tertiary: var(--neutral-500);
    --text-inverse: var(--neutral-900);
    
    --bg-primary: var(--neutral-900);
    --bg-secondary: var(--neutral-800);
    --bg-tertiary: var(--neutral-700);
    
    --border-primary: var(--neutral-700);
    --border-secondary: var(--neutral-600);
  }
}

/* ===== GLOBAL RESET & BASE STYLES ===== */

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== TYPOGRAPHY ENHANCEMENTS ===== */

  h1, .heading-primary {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1.1;
    color: var(--neutral-900) !important;
    letter-spacing: -0.02em;
}

h2, .heading-secondary {
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.2;
  color: #222 !important;
}

  h3, .heading-tertiary {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--neutral-900) !important;
}

.heading-card {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.body-large {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.body-medium {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.body-small {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-tertiary);
}

.meta-text {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ===== BADGE SYSTEM ===== */

.badge-base {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-success {
  background-color: var(--success-100);
  color: var(--success-800);
}

.badge-warning {
  background-color: var(--warning-100);
  color: var(--warning-800);
}

.badge-error {
  background-color: var(--error-100);
  color: var(--error-800);
}

.badge-info {
  background-color: var(--primary-100);
  color: var(--primary-800);
}

.badge-purple {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.badge-orange {
  background-color: #fed7aa;
  color: #ea580c;
}

.badge-gray {
  background-color: var(--neutral-100);
  color: var(--neutral-700);
}

/* ===== MODERN COMPONENT CLASSES ===== */

/* Card Design System */
.card-modern {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-in-out;
  padding: var(--space-6);
}

.card-modern:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-compact {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-in-out;
  padding: var(--space-4);
}

.card-interactive {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Button System */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background-color: var(--primary-600);
  color: var(--text-inverse);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-700);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-tertiary);
  border-color: var(--border-secondary);
}

.btn-secondary:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-ghost:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.btn-ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-accept, .btn-follow-back {
  background: #2563eb !important;
  color: #fff !important;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  transition: background 0.15s, box-shadow 0.15s;
}

.btn-accept:disabled, .btn-follow-back:disabled {
  background: #e5e7eb !important;
  color: #888 !important;
  opacity: 1 !important;
  box-shadow: none;
}

/* Form System */
.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;
}

.form-input::-moz-placeholder {
  color: #555 !important;
  opacity: 1 !important;
}

.form-input::placeholder {
  color: #555 !important;
  opacity: 1 !important;
}

.form-input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background-color: var(--bg-secondary);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.form-textarea {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;
  resize: vertical;
  min-height: 100px;
}

.form-textarea::-moz-placeholder {
  color: var(--text-tertiary);
}

.form-textarea::placeholder {
  color: var(--text-tertiary);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea:disabled {
  background-color: var(--bg-secondary);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

.form-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  padding-right: var(--space-10);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-position: right var(--space-2) center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}

.form-select:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select:disabled {
  background-color: var(--bg-secondary);
  color: var(--text-tertiary);
  cursor: not-allowed;
}

/* ===== LEGACY BUTTON CLASSES (for backward compatibility) ===== */

.btn-danger {
  background-color: var(--error-600);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--error-700);
}

.btn-card {
  width: 100%;
  justify-content: center;
}

/* ===== GRID SYSTEMS ===== */

.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
  padding: 0.5rem 0;
}

.grid-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

/* ===== ANIMATION CLASSES ===== */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-entrance {
  animation: fadeIn 0.6s ease-out;
}

.animate-fade {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide {
  animation: slideUp 0.4s ease-out;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* ===== UTILITY CLASSES ===== */

.font-light {
  font-weight: 300;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-wide {
  letter-spacing: 0.025em;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

/* ===== TEXT UTILITIES ===== */

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== TRANSITION UTILITIES ===== */

.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

/* ===== FOCUS STYLES ===== */

.focus\\:outline-none:focus {
  outline: none;
}

.focus\\:border-gray-400:focus {
  border-color: var(--neutral-400);
}

/* ===== SCROLLBAR STYLING ===== */

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--neutral-100);
}

::-webkit-scrollbar-thumb {
  background: var(--neutral-300);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--neutral-400);
}

/* ===== HOVER EFFECTS ===== */

.group:hover .group-hover\\:shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.group:hover .group-hover\\:text-black {
  color: var(--text-primary);
}

.group:hover .group-hover\\:underline {
  text-decoration: underline;
}

/* ===== GRADIENT UTILITIES ===== */

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--neutral-50), white);
}

.from-gray-50 {
  background-image: linear-gradient(to bottom right, var(--neutral-50), white);
}

.to-white {
  background-image: linear-gradient(to bottom right, var(--neutral-50), white);
}

/* ===== FORM ELEMENT STYLING ===== */

button {
  font-family: inherit;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input, textarea, select, .form-input, .form-select, .form-textarea {
  background-color: #fff !important;
  color: #222 !important;
}

input:disabled, textarea:disabled, select:disabled, .form-input:disabled, .form-select:disabled, .form-textarea:disabled {
  background-color: #f3f6fa !important;
  color: #888 !important;
}

/* ===== RESPONSIVE TYPOGRAPHY ===== */

@media (max-width: 640px) {
  .text-6xl {
    font-size: 2.5rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
  }
}

/* ===== PRINT STYLES ===== */

@media print {
  .no-print {
    display: none !important;
  }
}

/* ===== SELECT STYLING ===== */

select option {
  background-color: white;
  color: var(--text-primary);
  padding: 0.5rem;
}

select {
  background-color: white;
  color: var(--text-primary);
}

select::-webkit-scrollbar {
  width: 8px;
}

select::-webkit-scrollbar-track {
  background: var(--neutral-100);
}

select::-webkit-scrollbar-thumb {
  background: var(--neutral-300);
  border-radius: 4px;
}

select::-webkit-scrollbar-thumb:hover {
  background: var(--neutral-400);
}

/* ===== STAGGERED ANIMATIONS ===== */

.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
.stagger-6 { animation-delay: 0.6s; }
.stagger-7 { animation-delay: 0.7s; }
.stagger-8 { animation-delay: 0.8s; }

/* ===== SLIDER STYLING ===== */

.slider {
  -moz-appearance: none;
       appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--neutral-200);
  outline: none;
}

.slider::-webkit-slider-track {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--neutral-200);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-600);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-webkit-slider-thumb:hover {
  background: var(--primary-700);
}

.slider::-moz-range-track {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--neutral-200);
  border: none;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-600);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb:hover {
  background: var(--primary-700);
}

/* ===== NAVIGATION STYLES ===== */

#main-navbar, #main-navbar a, #main-navbar .nav-link {
  font-family: inherit;
}

.file\\:border-0::file-selector-button {
  border-width: 0px;
}

.file\\:bg-transparent::file-selector-button {
  background-color: transparent;
}

.file\\:text-sm::file-selector-button {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.file\\:font-medium::file-selector-button {
  font-weight: 500;
}

.last\\:border-b-0:last-child {
  border-bottom-width: 0px;
}

.checked\\:border-yellow-500:checked {
  --tw-border-opacity: 1;
  border-color: rgb(234 179 8 / var(--tw-border-opacity, 1));
}

.checked\\:bg-yellow-400:checked {
  --tw-bg-opacity: 1;
  background-color: rgb(250 204 21 / var(--tw-bg-opacity, 1));
}

.focus-within\\:relative:focus-within {
  position: relative;
}

.focus-within\\:z-20:focus-within {
  z-index: 20;
}

.hover\\:z-10:hover {
  z-index: 10;
}

.hover\\:-translate-y-0\\.5:hover {
  --tw-translate-y: -0.125rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:-translate-y-1:hover {
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:scale-105:hover {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:scale-110:hover {
  --tw-scale-x: 1.1;
  --tw-scale-y: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:scale-\\[1\\.02\\]:hover {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.hover\\:border-blue-200:hover {
  --tw-border-opacity: 1;
  border-color: rgb(191 219 254 / var(--tw-border-opacity, 1));
}

.hover\\:border-blue-300:hover {
  --tw-border-opacity: 1;
  border-color: rgb(147 197 253 / var(--tw-border-opacity, 1));
}

.hover\\:border-blue-500:hover {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
}

.hover\\:border-gray-200:hover {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
}

.hover\\:border-gray-300:hover {
  --tw-border-opacity: 1;
  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
}

.hover\\:border-green-600:hover {
  --tw-border-opacity: 1;
  border-color: rgb(22 163 74 / var(--tw-border-opacity, 1));
}

.hover\\:border-purple-300:hover {
  --tw-border-opacity: 1;
  border-color: rgb(216 180 254 / var(--tw-border-opacity, 1));
}

.hover\\:bg-black:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(219 234 254 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(191 219 254 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-50\\/60:hover {
  background-color: rgb(239 246 255 / 0.6);
}

.hover\\:bg-blue-500:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-500\\/30:hover {
  background-color: rgb(59 130 246 / 0.3);
}

.hover\\:bg-blue-600:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-100\\/80:hover {
  background-color: rgb(243 244 246 / 0.8);
}

.hover\\:bg-gray-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-200\\/80:hover {
  background-color: rgb(229 231 235 / 0.8);
}

.hover\\:bg-gray-300:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-400:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-50\\/80:hover {
  background-color: rgb(249 250 251 / 0.8);
}

.hover\\:bg-gray-600:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-800:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-gray-900:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-green-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(187 247 208 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-green-500:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-green-600:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-green-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-indigo-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(67 56 202 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-orange-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(255 237 213 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-orange-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(194 65 12 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-purple-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(233 213 255 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-purple-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(126 34 206 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-red-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 226 226 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-red-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 202 202 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-red-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-red-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-white:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-white\\/10:hover {
  background-color: rgb(255 255 255 / 0.1);
}

.hover\\:bg-white\\/20:hover {
  background-color: rgb(255 255 255 / 0.2);
}

.hover\\:bg-white\\/80:hover {
  background-color: rgb(255 255 255 / 0.8);
}

.hover\\:bg-yellow-100:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 249 195 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-yellow-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(254 252 232 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-yellow-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(161 98 7 / var(--tw-bg-opacity, 1));
}

.hover\\:from-blue-600:hover {
  --tw-gradient-from: #2563eb var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(37 99 235 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.hover\\:from-blue-700:hover {
  --tw-gradient-from: #1d4ed8 var(--tw-gradient-from-position);
  --tw-gradient-to: rgb(29 78 216 / 0) var(--tw-gradient-to-position);
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}

.hover\\:to-blue-800:hover {
  --tw-gradient-to: #1e40af var(--tw-gradient-to-position);
}

.hover\\:to-indigo-600:hover {
  --tw-gradient-to: #4f46e5 var(--tw-gradient-to-position);
}

.hover\\:to-purple-700:hover {
  --tw-gradient-to: #7e22ce var(--tw-gradient-to-position);
}

.hover\\:text-black:hover {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity, 1));
}

.hover\\:text-blue-500:hover {
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity, 1));
}

.hover\\:text-blue-600:hover {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}

.hover\\:text-blue-700:hover {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}

.hover\\:text-blue-800:hover {
  --tw-text-opacity: 1;
  color: rgb(30 64 175 / var(--tw-text-opacity, 1));
}

.hover\\:text-gray-600:hover {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}

.hover\\:text-gray-700:hover {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}

.hover\\:text-gray-800:hover {
  --tw-text-opacity: 1;
  color: rgb(31 41 55 / var(--tw-text-opacity, 1));
}

.hover\\:text-gray-900:hover {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity, 1));
}

.hover\\:text-green-500:hover {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}

.hover\\:text-green-600:hover {
  --tw-text-opacity: 1;
  color: rgb(22 163 74 / var(--tw-text-opacity, 1));
}

.hover\\:text-indigo-500:hover {
  --tw-text-opacity: 1;
  color: rgb(99 102 241 / var(--tw-text-opacity, 1));
}

.hover\\:text-purple-500:hover {
  --tw-text-opacity: 1;
  color: rgb(168 85 247 / var(--tw-text-opacity, 1));
}

.hover\\:text-purple-700:hover {
  --tw-text-opacity: 1;
  color: rgb(126 34 206 / var(--tw-text-opacity, 1));
}

.hover\\:text-purple-800:hover {
  --tw-text-opacity: 1;
  color: rgb(107 33 168 / var(--tw-text-opacity, 1));
}

.hover\\:text-red-500:hover {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}

.hover\\:text-red-600:hover {
  --tw-text-opacity: 1;
  color: rgb(220 38 38 / var(--tw-text-opacity, 1));
}

.hover\\:text-red-700:hover {
  --tw-text-opacity: 1;
  color: rgb(185 28 28 / var(--tw-text-opacity, 1));
}

.hover\\:text-red-800:hover {
  --tw-text-opacity: 1;
  color: rgb(153 27 27 / var(--tw-text-opacity, 1));
}

.hover\\:text-white:hover {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}

.hover\\:underline:hover {
  text-decoration-line: underline;
}

.hover\\:no-underline:hover {
  text-decoration-line: none;
}

.hover\\:opacity-100:hover {
  opacity: 1;
}

.hover\\:shadow-2xl:hover {
  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-lg:hover {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-md:hover {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-sm:hover {
  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:shadow-xl:hover {
  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.hover\\:ring-2:hover {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.hover\\:ring-blue-100:hover {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(219 234 254 / var(--tw-ring-opacity, 1));
}

.focus\\:z-10:focus {
  z-index: 10;
}

.focus\\:scale-\\[1\\.02\\]:focus {
  --tw-scale-x: 1.02;
  --tw-scale-y: 1.02;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.focus\\:border-blue-400:focus {
  --tw-border-opacity: 1;
  border-color: rgb(96 165 250 / var(--tw-border-opacity, 1));
}

.focus\\:border-blue-500:focus {
  --tw-border-opacity: 1;
  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));
}

.focus\\:border-gray-400:focus {
  --tw-border-opacity: 1;
  border-color: rgb(156 163 175 / var(--tw-border-opacity, 1));
}

.focus\\:border-indigo-500:focus {
  --tw-border-opacity: 1;
  border-color: rgb(99 102 241 / var(--tw-border-opacity, 1));
}

.focus\\:border-red-500:focus {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));
}

.focus\\:border-transparent:focus {
  border-color: transparent;
}

.focus\\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\\:ring-0:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-1:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\\:ring-blue-200:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(191 219 254 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-blue-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-gray-400:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-gray-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(107 114 128 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-gray-900:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(17 24 39 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-green-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(34 197 94 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-indigo-100:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(224 231 255 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-indigo-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(99 102 241 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-red-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(239 68 68 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-yellow-500:focus {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(234 179 8 / var(--tw-ring-opacity, 1));
}

.focus\\:ring-offset-1:focus {
  --tw-ring-offset-width: 1px;
}

.focus\\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}

.focus\\:ring-offset-gray-100:focus {
  --tw-ring-offset-color: #f3f4f6;
}

.focus-visible\\:outline-none:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus-visible\\:ring-0:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\\:ring-2:focus-visible {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-visible\\:ring-blue-400:focus-visible {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(96 165 250 / var(--tw-ring-opacity, 1));
}

.focus-visible\\:ring-blue-500:focus-visible {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));
}

.focus-visible\\:ring-gray-300:focus-visible {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(209 213 219 / var(--tw-ring-opacity, 1));
}

.focus-visible\\:ring-gray-400:focus-visible {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(156 163 175 / var(--tw-ring-opacity, 1));
}

.focus-visible\\:ring-green-500:focus-visible {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(34 197 94 / var(--tw-ring-opacity, 1));
}

.focus-visible\\:ring-red-500:focus-visible {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(239 68 68 / var(--tw-ring-opacity, 1));
}

.focus-visible\\:ring-offset-2:focus-visible {
  --tw-ring-offset-width: 2px;
}

.disabled\\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.disabled\\:bg-gray-400:disabled {
  --tw-bg-opacity: 1;
  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));
}

.disabled\\:bg-gray-50:disabled {
  --tw-bg-opacity: 1;
  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));
}

.disabled\\:opacity-50:disabled {
  opacity: 0.5;
}

.group:hover .group-hover\\:visible {
  visibility: visible;
}

.group:hover .group-hover\\:translate-x-1 {
  --tw-translate-x: 0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:scale-105 {
  --tw-scale-x: 1.05;
  --tw-scale-y: 1.05;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:scale-110 {
  --tw-scale-x: 1.1;
  --tw-scale-y: 1.1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

.group:hover .group-hover\\:bg-blue-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(191 219 254 / var(--tw-bg-opacity, 1));
}

.group:hover .group-hover\\:bg-blue-50 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}

.group:hover .group-hover\\:bg-green-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(187 247 208 / var(--tw-bg-opacity, 1));
}

.group:hover .group-hover\\:bg-red-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 202 202 / var(--tw-bg-opacity, 1));
}

.group:hover .group-hover\\:bg-yellow-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(254 240 138 / var(--tw-bg-opacity, 1));
}

.group:hover .group-hover\\:text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-blue-600 {
  --tw-text-opacity: 1;
  color: rgb(37 99 235 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-blue-700 {
  --tw-text-opacity: 1;
  color: rgb(29 78 216 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-gray-700 {
  --tw-text-opacity: 1;
  color: rgb(55 65 81 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-gray-800 {
  --tw-text-opacity: 1;
  color: rgb(31 41 55 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:text-gray-900 {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity, 1));
}

.group:hover .group-hover\\:underline {
  text-decoration-line: underline;
}

.group:hover .group-hover\\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\\:opacity-30 {
  opacity: 0.3;
}

.group:hover .group-hover\\:opacity-80 {
  opacity: 0.8;
}

.peer:disabled ~ .peer-disabled\\:cursor-not-allowed {
  cursor: not-allowed;
}

.peer:disabled ~ .peer-disabled\\:opacity-70 {
  opacity: 0.7;
}

.aria-selected\\:opacity-100[aria-selected="true"] {
  opacity: 1;
}

.aria-selected\\:opacity-30[aria-selected="true"] {
  opacity: 0.3;
}

@media (min-width: 640px) {
  .sm\\:col-span-3 {
    grid-column: span 3 / span 3;
  }
  .sm\\:col-span-4 {
    grid-column: span 4 / span 4;
  }
  .sm\\:mt-0 {
    margin-top: 0px;
  }
  .sm\\:block {
    display: block;
  }
  .sm\\:inline {
    display: inline;
  }
  .sm\\:flex {
    display: flex;
  }
  .sm\\:w-1\\/2 {
    width: 50%;
  }
  .sm\\:w-1\\/4 {
    width: 25%;
  }
  .sm\\:w-2\\/3 {
    width: 66.666667%;
  }
  .sm\\:w-56 {
    width: 14rem;
  }
  .sm\\:w-auto {
    width: auto;
  }
  .sm\\:max-w-\\[600px\\] {
    max-width: 600px;
  }
  .sm\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sm\\:grid-cols-6 {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
  .sm\\:flex-row {
    flex-direction: row;
  }
  .sm\\:items-center {
    align-items: center;
  }
  .sm\\:justify-between {
    justify-content: space-between;
  }
  .sm\\:space-x-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .sm\\:space-y-0 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0px * var(--tw-space-y-reverse));
  }
  .sm\\:rounded-lg {
    border-radius: 0.5rem;
  }
  .sm\\:p-6 {
    padding: 1.5rem;
  }
  .sm\\:px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .sm\\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  .sm\\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
}

@media (min-width: 768px) {
  .md\\:col-span-2 {
    grid-column: span 2 / span 2;
  }
  .md\\:mb-0 {
    margin-bottom: 0px;
  }
  .md\\:mr-8 {
    margin-right: 2rem;
  }
  .md\\:block {
    display: block;
  }
  .md\\:flex {
    display: flex;
  }
  .md\\:hidden {
    display: none;
  }
  .md\\:h-auto {
    height: auto;
  }
  .md\\:w-1\\/3 {
    width: 33.333333%;
  }
  .md\\:w-48 {
    width: 12rem;
  }
  .md\\:w-96 {
    width: 24rem;
  }
  .md\\:w-auto {
    width: auto;
  }
  .md\\:max-w-2xl {
    max-width: 42rem;
  }
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .md\\:flex-row {
    flex-direction: row;
  }
  .md\\:items-end {
    align-items: flex-end;
  }
  .md\\:items-center {
    align-items: center;
  }
  .md\\:justify-start {
    justify-content: flex-start;
  }
  .md\\:justify-between {
    justify-content: space-between;
  }
  .md\\:space-x-4 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(1rem * var(--tw-space-x-reverse));
    margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
  }
  .md\\:space-y-0 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-y-reverse: 0;
    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));
    margin-bottom: calc(0px * var(--tw-space-y-reverse));
  }
  .md\\:p-6 {
    padding: 1.5rem;
  }
  .md\\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .md\\:py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  .md\\:text-left {
    text-align: left;
  }
  .md\\:text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  .md\\:text-5xl {
    font-size: 3rem;
    line-height: 1;
  }
  .md\\:text-6xl {
    font-size: 3.75rem;
    line-height: 1;
  }
  .md\\:text-base {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .lg\\:col-span-2 {
    grid-column: span 2 / span 2;
  }
  .lg\\:max-w-md {
    max-width: 28rem;
  }
  .lg\\:grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .lg\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .lg\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .lg\\:grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .lg\\:grid-cols-7 {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
  .lg\\:grid-cols-8 {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  .lg\\:flex-row {
    flex-direction: row;
  }
  .lg\\:items-center {
    align-items: center;
  }
  .lg\\:justify-between {
    justify-content: space-between;
  }
  .lg\\:gap-8 {
    gap: 2rem;
  }
  .lg\\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  .lg\\:py-32 {
    padding-top: 8rem;
    padding-bottom: 8rem;
  }
  .lg\\:pb-32 {
    padding-bottom: 8rem;
  }
  .lg\\:pt-32 {
    padding-top: 8rem;
  }
  .lg\\:text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  .lg\\:text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  .lg\\:text-4xl {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  .lg\\:text-7xl {
    font-size: 4.5rem;
    line-height: 1;
  }
}

@media (min-width: 1280px) {
  .xl\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .xl\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1536px) {
  .\\32xl\\:grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (prefers-color-scheme: dark) {
  .dark\\:border-blue-800 {
    --tw-border-opacity: 1;
    border-color: rgb(30 64 175 / var(--tw-border-opacity, 1));
  }
  .dark\\:border-gray-200 {
    --tw-border-opacity: 1;
    border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));
  }
  .dark\\:border-gray-300 {
    --tw-border-opacity: 1;
    border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));
  }
  .dark\\:border-gray-600 {
    --tw-border-opacity: 1;
    border-color: rgb(75 85 99 / var(--tw-border-opacity, 1));
  }
  .dark\\:border-gray-700 {
    --tw-border-opacity: 1;
    border-color: rgb(55 65 81 / var(--tw-border-opacity, 1));
  }
  .dark\\:border-gray-800 {
    --tw-border-opacity: 1;
    border-color: rgb(31 41 55 / var(--tw-border-opacity, 1));
  }
  .dark\\:border-neutral-600 {
    --tw-border-opacity: 1;
    border-color: rgb(82 82 82 / var(--tw-border-opacity, 1));
  }
  .dark\\:\\!bg-gray-800 {
    --tw-bg-opacity: 1 !important;
    background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1)) !important;
  }
  .dark\\:bg-blue-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
  }
  .dark\\:bg-blue-900\\/30 {
    background-color: rgb(30 58 138 / 0.3);
  }
  .dark\\:bg-blue-900\\/50 {
    background-color: rgb(30 58 138 / 0.5);
  }
  .dark\\:bg-gray-100 {
    --tw-bg-opacity: 1;
    background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
  }
  .dark\\:bg-gray-700 {
    --tw-bg-opacity: 1;
    background-color: rgb(55 65 81 / var(--tw-bg-opacity, 1));
  }
  .dark\\:bg-gray-800 {
    --tw-bg-opacity: 1;
    background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
  }
  .dark\\:bg-neutral-50 {
    --tw-bg-opacity: 1;
    background-color: rgb(250 250 250 / var(--tw-bg-opacity, 1));
  }
  .dark\\:bg-neutral-700\\/30 {
    background-color: rgb(64 64 64 / 0.3);
  }
  .dark\\:bg-white {
    --tw-bg-opacity: 1;
    background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
  }
  .dark\\:from-blue-400\\/10 {
    --tw-gradient-from: rgb(96 165 250 / 0.1) var(--tw-gradient-from-position);
    --tw-gradient-to: rgb(96 165 250 / 0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }
  .dark\\:from-gray-700 {
    --tw-gradient-from: #374151 var(--tw-gradient-from-position);
    --tw-gradient-to: rgb(55 65 81 / 0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }
  .dark\\:from-gray-800 {
    --tw-gradient-from: #1f2937 var(--tw-gradient-from-position);
    --tw-gradient-to: rgb(31 41 55 / 0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }
  .dark\\:via-gray-700\\/50 {
    --tw-gradient-to: rgb(55 65 81 / 0)  var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), rgb(55 65 81 / 0.5) var(--tw-gradient-via-position), var(--tw-gradient-to);
  }
  .dark\\:to-gray-800 {
    --tw-gradient-to: #1f2937 var(--tw-gradient-to-position);
  }
  .dark\\:to-indigo-400\\/10 {
    --tw-gradient-to: rgb(129 140 248 / 0.1) var(--tw-gradient-to-position);
  }
  .dark\\:\\!text-gray-100 {
    --tw-text-opacity: 1 !important;
    color: rgb(243 244 246 / var(--tw-text-opacity, 1)) !important;
  }
  .dark\\:text-blue-300 {
    --tw-text-opacity: 1;
    color: rgb(147 197 253 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-blue-400 {
    --tw-text-opacity: 1;
    color: rgb(96 165 250 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-blue-700 {
    --tw-text-opacity: 1;
    color: rgb(29 78 216 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-blue-800 {
    --tw-text-opacity: 1;
    color: rgb(30 64 175 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-gray-200 {
    --tw-text-opacity: 1;
    color: rgb(229 231 235 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-gray-300 {
    --tw-text-opacity: 1;
    color: rgb(209 213 219 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-gray-400 {
    --tw-text-opacity: 1;
    color: rgb(156 163 175 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-gray-500 {
    --tw-text-opacity: 1;
    color: rgb(107 114 128 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-gray-800 {
    --tw-text-opacity: 1;
    color: rgb(31 41 55 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-red-400 {
    --tw-text-opacity: 1;
    color: rgb(248 113 113 / var(--tw-text-opacity, 1));
  }
  .dark\\:text-white {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  }
  .dark\\:placeholder-gray-500::-moz-placeholder {
    --tw-placeholder-opacity: 1;
    color: rgb(107 114 128 / var(--tw-placeholder-opacity, 1));
  }
  .dark\\:placeholder-gray-500::placeholder {
    --tw-placeholder-opacity: 1;
    color: rgb(107 114 128 / var(--tw-placeholder-opacity, 1));
  }
  .dark\\:hover\\:border-gray-400:hover {
    --tw-border-opacity: 1;
    border-color: rgb(156 163 175 / var(--tw-border-opacity, 1));
  }
  .dark\\:hover\\:bg-gray-100:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));
  }
  .dark\\:hover\\:bg-gray-200:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));
  }
  .dark\\:hover\\:bg-gray-600:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(75 85 99 / var(--tw-bg-opacity, 1));
  }
  .dark\\:hover\\:bg-gray-700\\/50:hover {
    background-color: rgb(55 65 81 / 0.5);
  }
  .dark\\:hover\\:text-white:hover {
    --tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity, 1));
  }
  .group:hover .dark\\:group-hover\\:bg-blue-900\\/70 {
    background-color: rgb(30 58 138 / 0.7);
  }
}

.first\\:\\[\\&\\:has\\(\\[aria-selected\\]\\)\\]\\:rounded-l-md:has([aria-selected]):first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.last\\:\\[\\&\\:has\\(\\[aria-selected\\]\\)\\]\\:rounded-r-md:has([aria-selected]):last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.\\[\\&\\:has\\(\\[aria-selected\\]\\.day-range-end\\)\\]\\:rounded-r-md:has([aria-selected].day-range-end) {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}`, "",{"version":3,"sources":["webpack://./src/styles/globals.css"],"names":[],"mappings":"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AA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,iBAA+B;EAA/B;AAA+B;AAA/B;EAAA,iBAA+B;EAA/B;AAA+B;AAA/B;EAAA,gBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,gBAA+B;EAA/B,oBAA+B;EAA/B,4BAA+B;EAA/B;AAA+B;AAA/B;EAAA,gBAA+B;EAA/B,oBAA+B;EAA/B,4BAA+B;EAA/B;AAA+B;AAA/B;EAAA,gBAA+B;EAA/B,oBAA+B;EAA/B,4BAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B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A+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,6BAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,4DAA+B;EAA/B,qEAA+B;EAA/B;AAA+B;AAA/B;EAAA,4DAA+B;EAA/B,qEAA+B;EAA/B;AAA+B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A+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B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1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,4DAm1BC;EAn1BD,mEAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,4DAm1BC;EAn1BD,mEAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,gDAm1BC;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","sourcesContent":["/* src/styles/globals.css */\n@import 'tailwindcss/base';\n@import 'tailwindcss/components';\n@import 'tailwindcss/utilities';\n\n/* ===== DESIGN SYSTEM VARIABLES ===== */\n\n:root {\n  /* Primary Colors */\n  --primary-50: #eff6ff;\n  --primary-100: #dbeafe;\n  --primary-200: #bfdbfe;\n  --primary-300: #93c5fd;\n  --primary-400: #60a5fa;\n  --primary-500: #3b82f6;\n  --primary-600: #2563eb;\n  --primary-700: #1d4ed8;\n  --primary-800: #1e40af;\n  --primary-900: #1e3a8a;\n  --primary-950: #172554;\n\n  /* Neutral Colors */\n  --neutral-50: #f9fafb;\n  --neutral-100: #f3f4f6;\n  --neutral-200: #e5e7eb;\n  --neutral-300: #d1d5db;\n  --neutral-400: #9ca3af;\n  --neutral-500: #6b7280;\n  --neutral-600: #4b5563;\n  --neutral-700: #374151;\n  --neutral-800: #1f2937;\n  --neutral-900: #111827;\n  --neutral-950: #030712;\n\n  /* Success Colors */\n  --success-50: #f0fdf4;\n  --success-100: #dcfce7;\n  --success-200: #bbf7d0;\n  --success-300: #86efac;\n  --success-400: #4ade80;\n  --success-500: #22c55e;\n  --success-600: #16a34a;\n  --success-700: #15803d;\n  --success-800: #166534;\n  --success-900: #14532d;\n\n  /* Warning Colors */\n  --warning-50: #fffbeb;\n  --warning-100: #fef3c7;\n  --warning-200: #fde68a;\n  --warning-300: #fcd34d;\n  --warning-400: #fbbf24;\n  --warning-500: #f59e0b;\n  --warning-600: #d97706;\n  --warning-700: #b45309;\n  --warning-800: #92400e;\n  --warning-900: #78350f;\n\n  /* Error Colors */\n  --error-50: #fef2f2;\n  --error-100: #fee2e2;\n  --error-200: #fecaca;\n  --error-300: #fca5a5;\n  --error-400: #f87171;\n  --error-500: #ef4444;\n  --error-600: #dc2626;\n  --error-700: #b91c1c;\n  --error-800: #991b1b;\n  --error-900: #7f1d1d;\n\n  /* Semantic Colors */\n  --text-primary: var(--neutral-900);\n  --text-secondary: var(--neutral-600);\n  --text-tertiary: var(--neutral-500);\n  --text-inverse: var(--neutral-50);\n  \n  --bg-primary: #ffffff;\n  --bg-secondary: var(--neutral-50);\n  --bg-tertiary: var(--neutral-100);\n  --bg-overlay: rgba(0, 0, 0, 0.5);\n  \n  --border-primary: var(--neutral-200);\n  --border-secondary: var(--neutral-300);\n  --border-focus: var(--primary-500);\n  \n  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n\n  /* Spacing */\n  --space-0: 0;\n  --space-1: 0.25rem;\n  --space-2: 0.5rem;\n  --space-3: 0.75rem;\n  --space-4: 1rem;\n  --space-5: 1.25rem;\n  --space-6: 1.5rem;\n  --space-8: 2rem;\n  --space-10: 2.5rem;\n  --space-12: 3rem;\n  --space-16: 4rem;\n  --space-20: 5rem;\n  --space-24: 6rem;\n\n  /* Border Radius */\n  --radius-none: 0;\n  --radius-sm: 0.125rem;\n  --radius-base: 0.25rem;\n  --radius-md: 0.375rem;\n  --radius-lg: 0.5rem;\n  --radius-xl: 0.75rem;\n  --radius-2xl: 1rem;\n  --radius-3xl: 1.5rem;\n  --radius-full: 9999px;\n\n  /* Transitions */\n  --duration-75: 75ms;\n  --duration-100: 100ms;\n  --duration-150: 150ms;\n  --duration-200: 200ms;\n  --duration-300: 300ms;\n  --duration-500: 500ms;\n  --duration-700: 700ms;\n  --duration-1000: 1000ms;\n}\n\n/* Dark mode support */\n@media (prefers-color-scheme: dark) {\n  :root {\n    --text-primary: var(--neutral-50);\n    --text-secondary: var(--neutral-400);\n    --text-tertiary: var(--neutral-500);\n    --text-inverse: var(--neutral-900);\n    \n    --bg-primary: var(--neutral-900);\n    --bg-secondary: var(--neutral-800);\n    --bg-tertiary: var(--neutral-700);\n    \n    --border-primary: var(--neutral-700);\n    --border-secondary: var(--neutral-600);\n  }\n}\n\n/* ===== GLOBAL RESET & BASE STYLES ===== */\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n  line-height: 1.6;\n  color: var(--text-primary);\n  background-color: var(--bg-primary);\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* ===== TYPOGRAPHY ENHANCEMENTS ===== */\n\n  h1, .heading-primary {\n    font-size: 3rem;\n    font-weight: 700;\n    line-height: 1.1;\n    color: var(--neutral-900) !important;\n    letter-spacing: -0.02em;\n}\n\nh2, .heading-secondary {\n  font-size: 2rem;\n  font-weight: 400;\n  line-height: 1.2;\n  color: #222 !important;\n}\n\n  h3, .heading-tertiary {\n    font-size: 1.5rem;\n    font-weight: 600;\n    line-height: 1.3;\n    color: var(--neutral-900) !important;\n}\n\n.heading-card {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n\n.body-large {\n  font-size: 1.125rem;\n  line-height: 1.6;\n  color: var(--text-secondary);\n}\n\n.body-medium {\n  font-size: 1rem;\n  line-height: 1.6;\n  color: var(--text-secondary);\n}\n\n.body-small {\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: var(--text-tertiary);\n}\n\n.meta-text {\n  font-size: 0.75rem;\n  color: var(--text-tertiary);\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n\n/* ===== BADGE SYSTEM ===== */\n\n.badge-base {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.25rem 0.75rem;\n  border-radius: 9999px;\n  font-size: 0.75rem;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n\n.badge-success {\n  background-color: var(--success-100);\n  color: var(--success-800);\n}\n\n.badge-warning {\n  background-color: var(--warning-100);\n  color: var(--warning-800);\n}\n\n.badge-error {\n  background-color: var(--error-100);\n  color: var(--error-800);\n}\n\n.badge-info {\n  background-color: var(--primary-100);\n  color: var(--primary-800);\n}\n\n.badge-purple {\n  background-color: #f3e8ff;\n  color: #7c3aed;\n}\n\n.badge-orange {\n  background-color: #fed7aa;\n  color: #ea580c;\n}\n\n.badge-gray {\n  background-color: var(--neutral-100);\n  color: var(--neutral-700);\n}\n\n/* ===== MODERN COMPONENT CLASSES ===== */\n\n/* Card Design System */\n.card-modern {\n  background-color: var(--bg-primary);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-sm);\n  transition: all 0.2s ease-in-out;\n  padding: var(--space-6);\n}\n\n.card-modern:hover {\n  transform: translateY(-2px);\n  box-shadow: var(--shadow-lg);\n}\n\n.card-compact {\n  background-color: var(--bg-primary);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-sm);\n  transition: all 0.2s ease-in-out;\n  padding: var(--space-4);\n}\n\n.card-interactive {\n  background-color: var(--bg-primary);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-sm);\n  transition: all 0.2s ease-in-out;\n  cursor: pointer;\n}\n\n.card-interactive:hover {\n  transform: translateY(-2px);\n  box-shadow: var(--shadow-lg);\n}\n\n/* Button System */\n.btn-primary {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-2);\n  padding: var(--space-3) var(--space-6);\n  background-color: var(--primary-600);\n  color: var(--text-inverse);\n  border: 1px solid transparent;\n  border-radius: var(--radius-lg);\n  font-family: inherit;\n  font-size: 0.875rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n\n.btn-primary:hover:not(:disabled) {\n  background-color: var(--primary-700);\n}\n\n.btn-primary:focus-visible {\n  outline: 2px solid var(--border-focus);\n  outline-offset: 2px;\n}\n\n.btn-primary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-secondary {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-2);\n  padding: var(--space-3) var(--space-6);\n  background-color: var(--bg-secondary);\n  color: var(--text-primary);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-lg);\n  font-family: inherit;\n  font-size: 0.875rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n\n.btn-secondary:hover:not(:disabled) {\n  background-color: var(--bg-tertiary);\n  border-color: var(--border-secondary);\n}\n\n.btn-secondary:focus-visible {\n  outline: 2px solid var(--border-focus);\n  outline-offset: 2px;\n}\n\n.btn-secondary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-ghost {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-2);\n  padding: var(--space-2) var(--space-4);\n  background-color: transparent;\n  color: var(--text-secondary);\n  border: 1px solid transparent;\n  border-radius: var(--radius-lg);\n  font-family: inherit;\n  font-size: 0.875rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n\n.btn-ghost:hover:not(:disabled) {\n  background-color: var(--bg-secondary);\n  color: var(--text-primary);\n}\n\n.btn-ghost:focus-visible {\n  outline: 2px solid var(--border-focus);\n  outline-offset: 2px;\n}\n\n.btn-ghost:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-accept, .btn-follow-back {\n  background: #2563eb !important;\n  color: #fff !important;\n  font-weight: 600;\n  border-radius: 999px;\n  box-shadow: 0 2px 8px rgba(37,99,235,0.08);\n  padding: 0.5rem 1.5rem;\n  font-size: 1rem;\n  border: none;\n  transition: background 0.15s, box-shadow 0.15s;\n}\n\n.btn-accept:disabled, .btn-follow-back:disabled {\n  background: #e5e7eb !important;\n  color: #888 !important;\n  opacity: 1 !important;\n  box-shadow: none;\n}\n\n/* Form System */\n.form-input {\n  width: 100%;\n  padding: var(--space-3) var(--space-4);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-lg);\n  background-color: var(--bg-primary);\n  color: var(--text-primary);\n  font-family: inherit;\n  font-size: 1rem;\n  line-height: 1.5;\n  transition: all 0.2s ease-in-out;\n}\n\n.form-input::placeholder {\n  color: #555 !important;\n  opacity: 1 !important;\n}\n\n.form-input:focus {\n  outline: none;\n  border-color: var(--border-focus);\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n\n.form-input:disabled {\n  background-color: var(--bg-secondary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n}\n\n.form-textarea {\n  width: 100%;\n  padding: var(--space-3) var(--space-4);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-lg);\n  background-color: var(--bg-primary);\n  color: var(--text-primary);\n  font-family: inherit;\n  font-size: 1rem;\n  line-height: 1.5;\n  transition: all 0.2s ease-in-out;\n  resize: vertical;\n  min-height: 100px;\n}\n\n.form-textarea::placeholder {\n  color: var(--text-tertiary);\n}\n\n.form-textarea:focus {\n  outline: none;\n  border-color: var(--border-focus);\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n\n.form-textarea:disabled {\n  background-color: var(--bg-secondary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n}\n\n.form-select {\n  width: 100%;\n  padding: var(--space-3) var(--space-4);\n  padding-right: var(--space-10);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-lg);\n  background-color: var(--bg-primary);\n  color: var(--text-primary);\n  font-family: inherit;\n  font-size: 1rem;\n  line-height: 1.5;\n  transition: all 0.2s ease-in-out;\n  cursor: pointer;\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\");\n  background-position: right var(--space-2) center;\n  background-repeat: no-repeat;\n  background-size: 1.5em 1.5em;\n  appearance: none;\n}\n\n.form-select:focus {\n  outline: none;\n  border-color: var(--border-focus);\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n\n.form-select:disabled {\n  background-color: var(--bg-secondary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n}\n\n/* ===== LEGACY BUTTON CLASSES (for backward compatibility) ===== */\n\n.btn-danger {\n  background-color: var(--error-600);\n}\n\n.btn-danger:hover:not(:disabled) {\n  background-color: var(--error-700);\n}\n\n.btn-card {\n  width: 100%;\n  justify-content: center;\n}\n\n/* ===== GRID SYSTEMS ===== */\n\n.grid-cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));\n  gap: 2rem;\n  padding: 0.5rem 0;\n}\n\n.grid-features {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 2rem;\n}\n\n/* ===== ANIMATION CLASSES ===== */\n\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.animate-entrance {\n  animation: fadeIn 0.6s ease-out;\n}\n\n.animate-fade {\n  animation: fadeIn 0.3s ease-out;\n}\n\n.animate-slide {\n  animation: slideUp 0.4s ease-out;\n}\n\n.animate-spin {\n  animation: spin 1s linear infinite;\n}\n\n/* ===== UTILITY CLASSES ===== */\n\n.font-light {\n  font-weight: 300;\n}\n\n.tracking-tight {\n  letter-spacing: -0.025em;\n}\n\n.tracking-wide {\n  letter-spacing: 0.025em;\n}\n\n.tracking-wider {\n  letter-spacing: 0.05em;\n}\n\n/* ===== TEXT UTILITIES ===== */\n\n.line-clamp-2 {\n  display: -webkit-box;\n  line-clamp: 2;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.line-clamp-3 {\n  display: -webkit-box;\n  line-clamp: 3;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.line-clamp-4 {\n  display: -webkit-box;\n  line-clamp: 4;\n  -webkit-line-clamp: 4;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n/* ===== TRANSITION UTILITIES ===== */\n\n.transition-all {\n  transition: all 0.2s ease-in-out;\n}\n\n.transition-colors {\n  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;\n}\n\n/* ===== FOCUS STYLES ===== */\n\n.focus\\:outline-none:focus {\n  outline: none;\n}\n\n.focus\\:border-gray-400:focus {\n  border-color: var(--neutral-400);\n}\n\n/* ===== SCROLLBAR STYLING ===== */\n\n::-webkit-scrollbar {\n  width: 8px;\n}\n\n::-webkit-scrollbar-track {\n  background: var(--neutral-100);\n}\n\n::-webkit-scrollbar-thumb {\n  background: var(--neutral-300);\n  border-radius: 4px;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: var(--neutral-400);\n}\n\n/* ===== HOVER EFFECTS ===== */\n\n.group:hover .group-hover\\:shadow-2xl {\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);\n}\n\n.group:hover .group-hover\\:text-black {\n  color: var(--text-primary);\n}\n\n.group:hover .group-hover\\:underline {\n  text-decoration: underline;\n}\n\n/* ===== GRADIENT UTILITIES ===== */\n\n.bg-gradient-to-br {\n  background-image: linear-gradient(to bottom right, var(--neutral-50), white);\n}\n\n.from-gray-50 {\n  background-image: linear-gradient(to bottom right, var(--neutral-50), white);\n}\n\n.to-white {\n  background-image: linear-gradient(to bottom right, var(--neutral-50), white);\n}\n\n/* ===== FORM ELEMENT STYLING ===== */\n\nbutton {\n  font-family: inherit;\n}\n\nbutton:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\ninput, textarea, select, .form-input, .form-select, .form-textarea {\n  background-color: #fff !important;\n  color: #222 !important;\n}\n\ninput:disabled, textarea:disabled, select:disabled, .form-input:disabled, .form-select:disabled, .form-textarea:disabled {\n  background-color: #f3f6fa !important;\n  color: #888 !important;\n}\n\n/* ===== RESPONSIVE TYPOGRAPHY ===== */\n\n@media (max-width: 640px) {\n  .text-6xl {\n    font-size: 2.5rem;\n  }\n  \n  .text-4xl {\n    font-size: 2rem;\n  }\n  \n  .text-3xl {\n    font-size: 1.75rem;\n  }\n}\n\n/* ===== PRINT STYLES ===== */\n\n@media print {\n  .no-print {\n    display: none !important;\n  }\n}\n\n/* ===== SELECT STYLING ===== */\n\nselect option {\n  background-color: white;\n  color: var(--text-primary);\n  padding: 0.5rem;\n}\n\nselect {\n  background-color: white;\n  color: var(--text-primary);\n}\n\nselect::-webkit-scrollbar {\n  width: 8px;\n}\n\nselect::-webkit-scrollbar-track {\n  background: var(--neutral-100);\n}\n\nselect::-webkit-scrollbar-thumb {\n  background: var(--neutral-300);\n  border-radius: 4px;\n}\n\nselect::-webkit-scrollbar-thumb:hover {\n  background: var(--neutral-400);\n}\n\n/* ===== STAGGERED ANIMATIONS ===== */\n\n.stagger-1 { animation-delay: 0.1s; }\n.stagger-2 { animation-delay: 0.2s; }\n.stagger-3 { animation-delay: 0.3s; }\n.stagger-4 { animation-delay: 0.4s; }\n.stagger-5 { animation-delay: 0.5s; }\n.stagger-6 { animation-delay: 0.6s; }\n.stagger-7 { animation-delay: 0.7s; }\n.stagger-8 { animation-delay: 0.8s; }\n\n/* ===== SLIDER STYLING ===== */\n\n.slider {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 100%;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--neutral-200);\n  outline: none;\n}\n\n.slider::-webkit-slider-track {\n  width: 100%;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--neutral-200);\n}\n\n.slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: var(--primary-600);\n  cursor: pointer;\n  border: 2px solid white;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n.slider::-webkit-slider-thumb:hover {\n  background: var(--primary-700);\n}\n\n.slider::-moz-range-track {\n  width: 100%;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--neutral-200);\n  border: none;\n}\n\n.slider::-moz-range-thumb {\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: var(--primary-600);\n  cursor: pointer;\n  border: 2px solid white;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n.slider::-moz-range-thumb:hover {\n  background: var(--primary-700);\n}\n\n/* ===== NAVIGATION STYLES ===== */\n\n#main-navbar, #main-navbar a, #main-navbar .nav-link {\n  font-family: inherit;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 9487:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   H9: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc),
/* harmony export */   IG: () => (/* binding */ storage),
/* harmony export */   O5: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.O5),
/* harmony export */   db: () => (/* binding */ db),
/* harmony export */   gS: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.gS),
/* harmony export */   j2: () => (/* binding */ auth),
/* harmony export */   rJ: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.rJ),
/* harmony export */   x7: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getDoc),
/* harmony export */   yA: () => (/* binding */ app)
/* harmony export */ });
/* unused harmony export handleFirestoreError */
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(223);
/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(474);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7594);
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2539);
// src/firebase.ts




const firebaseConfig = {
    apiKey: "AIzaSyA9sGVe965q1dymnGXHrY7xrqPM1NEBtF4",
    authDomain: "my-film-jobs.firebaseapp.com",
    projectId: "my-film-jobs",
    storageBucket: "my-film-jobs.firebasestorage.app",
    messagingSenderId: "403346239424",
    appId: "1:403346239424:web:f7058992d5ad13b723a225",
};
const app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__/* .initializeApp */ .Wp)(firebaseConfig);
const auth = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__/* .getAuth */ .xI)(app);
// Initialize Firestore with settings to prevent internal assertion errors
const db = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .initializeFirestore */ ._A)(app, {
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
    experimentalForceLongPolling: true, // Use long polling instead of WebSocket
});
const storage = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__/* .getStorage */ .c7)(app);
// Error handling for Firestore
const handleFirestoreError = (error) => {
    console.error('Firestore error:', error);
    // Attempt to reconnect if there's a connection issue
    if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        console.log('Attempting to reconnect to Firestore...');
        enableNetwork(db).catch(console.error);
    }
};
// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('FIRESTORE')) {
        console.warn('Caught Firestore error:', event.reason);
        event.preventDefault();
    }
});
// Export Firestore utilities



/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, [1578,7070,753,7043,2874], () => (__webpack_exec__(3414)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.bundle.js.map