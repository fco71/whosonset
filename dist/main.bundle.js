"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[792],{

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
    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [userProfile, setUserProfile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const login = async (email, password) => {
        await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .signInWithEmailAndPassword */ .x9)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2, email, password);
    };
    const signup = async (email, password, firstName, lastName) => {
        const userCredential = await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .createUserWithEmailAndPassword */ .eJ)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2, email, password);
        const user = userCredential.user;
        // Create display name from first/last name or email fallback
        const displayName = (firstName && lastName)
            ? `${firstName} ${lastName}`
            : user.email?.split('@')[0] || 'User';
        // Update Firebase Auth profile
        await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .updateProfile */ .r7)(user, {
            displayName: displayName
        });
        // Create user document in 'users' collection (with correct field names)
        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            firstName: firstName || '',
            lastName: lastName || '',
            photoURL: '/bust-avatar.svg',
            avatarUrl: '/bust-avatar.svg', // This is what userUtils.ts expects
            createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)(),
            updatedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)()
        });
        // ALSO create the crew profile (like existing working users)
        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'crewProfiles', user.uid), {
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
        });
        // Create user collections document (for favorites, etc.)
        await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .setDoc */ .BN)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_2__.db, 'UserCollections', user.uid), {
            savedProjects: [],
            savedCrew: [],
            createdAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)(),
            updatedAt: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_4__/* .serverTimestamp */ .O5)()
        });
        console.log('User created successfully with both users and crewProfiles documents');
    };
    const logout = async () => {
        await (0,firebase_auth__WEBPACK_IMPORTED_MODULE_3__/* .signOut */ .CI)(_firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const unsubscribe = _firebase__WEBPACK_IMPORTED_MODULE_2__/* .auth */ .j2.onAuthStateChanged((user) => {
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
        });
        return unsubscribe;
    }, []);
    const value = {
        currentUser,
        loading,
        userProfile,
        login,
        signup,
        logout
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(AuthContext.Provider, { value: value, children: !loading && children }));
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

/***/ 4631:
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

// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-dom/client.js
var client = __webpack_require__(5338);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./node_modules/react-hot-toast/dist/index.mjs + 1 modules
var dist = __webpack_require__(888);
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

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/search.js
var search = __webpack_require__(8445);
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
;// ./src/components/Navigation.tsx

// src/components/Navigation.tsx



const Navigation = ({ authUser, userSignOut }) => {
    const location = (0,chunk_QMGIS6GS/* useLocation */.zy)();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0,react.useState)(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = (0,react.useState)(false);
    const [activePath, setActivePath] = (0,react.useState)('/');
    const [isScrolled, setIsScrolled] = (0,react.useState)(false);
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
        { to: '/', label: 'Home' },
        { to: '/crew', label: 'Crew' },
        { to: '/jobs', label: 'Jobs' },
        { to: '/my-projects', label: 'Projects' },
        { to: '/collaboration', label: 'Collaboration' },
    ];
    const authenticatedLinks = [
        { to: '/social', label: 'Social' },
        { to: '/favorites', label: 'Favorites' },
        { to: '/edit-profile', label: 'Resume Builder' },
    ];
    return ((0,jsx_runtime.jsxs)("nav", { className: `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
            : 'bg-white/80 backdrop-blur-sm border-b border-gray-100/50'}`, children: [(0,jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between h-16", children: [(0,jsx_runtime.jsx)("div", { className: "flex items-center", children: (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/", className: "group flex items-center space-x-2", onClick: closeAllMenus, children: (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent tracking-tight", children: "WHOSONSET" }), (0,jsx_runtime.jsx)("div", { className: "absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" })] }) }) }), (0,jsx_runtime.jsxs)("div", { className: "hidden md:flex items-center space-x-1", children: [navigationLinks.map((link) => ((0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: link.to, className: `relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isActive(link.to)
                                        ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'}`, onClick: closeAllMenus, children: [link.label, isActive(link.to) && ((0,jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" }))] }, link.to))), authUser && authenticatedLinks.map((link) => ((0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: link.to, className: `relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isActive(link.to)
                                        ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50/80'}`, onClick: closeAllMenus, children: [link.label, isActive(link.to) && ((0,jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" }))] }, link.to)))] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [authUser ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "hidden md:flex items-center space-x-2", children: [(0,jsx_runtime.jsx)("button", { className: "p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors", children: (0,jsx_runtime.jsx)(search/* default */.A, { size: 18 }) }), (0,jsx_runtime.jsx)("button", { className: "p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors", children: (0,jsx_runtime.jsx)(bell/* default */.A, { size: 18 }) })] }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsxs)("button", { onClick: toggleUserMenu, className: "flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 group", children: [(0,jsx_runtime.jsx)("div", { className: "w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium", children: authUser.email?.[0].toUpperCase() || 'U' }), (0,jsx_runtime.jsx)("span", { className: "hidden sm:block text-sm font-medium text-gray-700 group-hover:text-gray-900", children: authUser.email?.split('@')[0] || 'User' }), (0,jsx_runtime.jsx)(chevron_down/* default */.A, { size: 16, className: `text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}` })] }), isUserMenuOpen && ((0,jsx_runtime.jsxs)("div", { className: "absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200/50 py-2 z-50 backdrop-blur-sm", children: [(0,jsx_runtime.jsxs)("div", { className: "px-4 py-3 border-b border-gray-100", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-900", children: authUser.email }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Film Professional" })] }), (0,jsx_runtime.jsxs)("div", { className: "py-2", children: [authenticatedLinks.map((link) => ((0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: link.to, className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors", onClick: closeAllMenus, children: link.label }, link.to))), (0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Link */.N_, { to: "/settings", className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors", onClick: closeAllMenus, children: [(0,jsx_runtime.jsx)(settings/* default */.A, { size: 16, className: "mr-2" }), "Settings"] })] }), (0,jsx_runtime.jsx)("div", { className: "border-t border-gray-100 pt-2", children: (0,jsx_runtime.jsx)("button", { onClick: () => {
                                                                    userSignOut();
                                                                    closeAllMenus();
                                                                }, className: "block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors", children: "Sign Out" }) })] }))] })] })) : ((0,jsx_runtime.jsxs)("div", { className: "flex items-center space-x-3", children: [(0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/login", className: "px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors", children: "Sign In" }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/register", className: "px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md", children: "Get Started" })] })), (0,jsx_runtime.jsx)("div", { className: "md:hidden", children: (0,jsx_runtime.jsx)("button", { onClick: toggleMobileMenu, className: "p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-colors", "aria-label": "Toggle mobile menu", children: isMobileMenuOpen ? (0,jsx_runtime.jsx)(x/* default */.A, { size: 24 }) : (0,jsx_runtime.jsx)(menu/* default */.A, { size: 24 }) }) })] })] }) }), isMobileMenuOpen && ((0,jsx_runtime.jsx)("div", { className: "md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg", children: (0,jsx_runtime.jsxs)("div", { className: "px-4 py-6 space-y-4", children: [(0,jsx_runtime.jsx)("div", { className: "space-y-2", children: navigationLinks.map((link) => ((0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: link.to, className: `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(link.to)
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`, onClick: closeAllMenus, children: link.label }, link.to))) }), authUser && ((0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: (0,jsx_runtime.jsxs)("div", { className: "border-t border-gray-200 pt-4", children: [(0,jsx_runtime.jsx)("p", { className: "px-4 text-xs font-medium text-gray-500 uppercase tracking-wider mb-3", children: "My Account" }), (0,jsx_runtime.jsx)("div", { className: "space-y-2", children: authenticatedLinks.map((link) => ((0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: link.to, className: `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(link.to)
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`, onClick: closeAllMenus, children: link.label }, link.to))) })] }) })), (0,jsx_runtime.jsx)("div", { className: "border-t border-gray-200 pt-4 space-y-3", children: !authUser ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/login", className: "block w-full px-4 py-3 text-center font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", onClick: closeAllMenus, children: "Sign In" }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Link */.N_, { to: "/register", className: "block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm", onClick: closeAllMenus, children: "Get Started" })] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("div", { className: "px-4 py-3 bg-gray-50 rounded-lg", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-900", children: authUser.email }), (0,jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Film Professional" })] }), (0,jsx_runtime.jsx)("button", { onClick: () => {
                                            userSignOut();
                                            closeAllMenus();
                                        }, className: "block w-full px-4 py-3 text-center font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors", children: "Sign Out" })] })) })] }) })), isMobileMenuOpen && ((0,jsx_runtime.jsx)("div", { className: "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden", onClick: closeAllMenus, style: { top: '64px' } }))] }));
};
/* harmony default export */ const components_Navigation = (Navigation);

;// ./src/App.tsx











// Import components

// Lazy load pages for better performance
const ProducerView = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(997), __webpack_require__.e(528)]).then(__webpack_require__.bind(__webpack_require__, 4528)));
const HomePage = react.lazy(() => __webpack_require__.e(/* import() */ 264).then(__webpack_require__.bind(__webpack_require__, 7264)));
const MyProjectsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(687), __webpack_require__.e(664), __webpack_require__.e(8)]).then(__webpack_require__.bind(__webpack_require__, 4008)));
const FavoritesPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(687), __webpack_require__.e(664), __webpack_require__.e(880)]).then(__webpack_require__.bind(__webpack_require__, 5880)));
const SavedCrewProfilesPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(354), __webpack_require__.e(997), __webpack_require__.e(608)]).then(__webpack_require__.bind(__webpack_require__, 3608)));
const SavedProjectsPage = react.lazy(() => __webpack_require__.e(/* import() */ 87).then(__webpack_require__.bind(__webpack_require__, 4087)));
const CollectionsHubPage = react.lazy(() => __webpack_require__.e(/* import() */ 124).then(__webpack_require__.bind(__webpack_require__, 743)));
const SocialPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(687), __webpack_require__.e(856), __webpack_require__.e(997), __webpack_require__.e(140)]).then(__webpack_require__.bind(__webpack_require__, 8140)));
const CollaborationPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(88), __webpack_require__.e(290)]).then(__webpack_require__.bind(__webpack_require__, 296)));
const SettingsPage = react.lazy(() => __webpack_require__.e(/* import() */ 443).then(__webpack_require__.bind(__webpack_require__, 2443)));
const JobsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(687), __webpack_require__.e(697)]).then(__webpack_require__.bind(__webpack_require__, 4697)));
const PostJobPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(687), __webpack_require__.e(856), __webpack_require__.e(409), __webpack_require__.e(11)]).then(__webpack_require__.bind(__webpack_require__, 7011)));
const JobDetailPage = react.lazy(() => __webpack_require__.e(/* import() */ 510).then(__webpack_require__.bind(__webpack_require__, 6510)));
const DebugJobsPage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(687), __webpack_require__.e(9)]).then(__webpack_require__.bind(__webpack_require__, 9009)));
const EditProfilePage = react.lazy(() => __webpack_require__.e(/* import() */ 134).then(__webpack_require__.bind(__webpack_require__, 6134)));
const PublicResumePage = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(833), __webpack_require__.e(997), __webpack_require__.e(149)]).then(__webpack_require__.bind(__webpack_require__, 1149)));
const LoginPage = react.lazy(() => __webpack_require__.e(/* import() */ 139).then(__webpack_require__.bind(__webpack_require__, 8139)));
const RegisterPage = react.lazy(() => __webpack_require__.e(/* import() */ 505).then(__webpack_require__.bind(__webpack_require__, 7505)));
// Protected Route Component for React Router v7
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const location = (0,chunk_QMGIS6GS/* useLocation */.zy)();
    if (!currentUser) {
        return (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Navigate */.C5, { to: redirectTo, state: { from: location.pathname }, replace: true });
    }
    return (0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: children });
};
// Public Route Component
const PublicRoute = ({ children, redirectTo = '/' }) => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    if (currentUser) {
        return (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Navigate */.C5, { to: redirectTo, replace: true });
    }
    return (0,jsx_runtime.jsx)(jsx_runtime.Fragment, { children: children });
};
const fontFamily = 'Inter, sans-serif';
function App() {
    const { currentUser, logout } = (0,AuthContext/* useAuth */.A)();
    const handleSignOut = async () => {
        try {
            await logout();
            console.log('User signed out successfully');
        }
        catch (error) {
            console.error('Error signing out:', error);
        }
    };
    return ((0,jsx_runtime.jsx)(ThemeProvider/* ThemeProvider */.NP, { children: (0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-background text-foreground", style: { fontFamily: 'Inter, sans-serif' }, children: (0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* BrowserRouter */.Kd, { children: [(0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50 text-gray-900", children: [(0,jsx_runtime.jsx)(components_Navigation, { authUser: currentUser, userSignOut: handleSignOut }), (0,jsx_runtime.jsx)("main", { className: "container mx-auto px-4 py-8", children: (0,jsx_runtime.jsx)(react.Suspense, { fallback: (0,jsx_runtime.jsx)("div", { className: "flex items-center justify-center min-h-[400px]", children: (0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }), children: (0,jsx_runtime.jsxs)(chunk_QMGIS6GS/* Routes */.BV, { children: [(0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { index: true, element: (0,jsx_runtime.jsx)(HomePage, {}) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/crew", element: (0,jsx_runtime.jsx)(ProducerView, {}) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/login", element: (0,jsx_runtime.jsx)(PublicRoute, { children: (0,jsx_runtime.jsx)(LoginPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/register", element: (0,jsx_runtime.jsx)(PublicRoute, { children: (0,jsx_runtime.jsx)(RegisterPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/my-projects", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(MyProjectsPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/favorites", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(FavoritesPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/saved-crew", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SavedCrewProfilesPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/saved-projects", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SavedProjectsPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/collections", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(CollectionsHubPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/social", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SocialPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/collaboration", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(CollaborationPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/settings", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(SettingsPage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/edit-profile", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(EditProfilePage, {}) }) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/resume/:uid", element: (0,jsx_runtime.jsx)(PublicResumePage, {}) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/jobs", element: (0,jsx_runtime.jsx)(JobsPage, {}) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/jobs/:id", element: (0,jsx_runtime.jsx)(JobDetailPage, {}) }), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "/post-job", element: (0,jsx_runtime.jsx)(ProtectedRoute, { children: (0,jsx_runtime.jsx)(PostJobPage, {}) }) }),  false && (0), (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Route */.qh, { path: "*", element: (0,jsx_runtime.jsx)(chunk_QMGIS6GS/* Navigate */.C5, { to: "/", replace: true }) })] }) }) })] }), (0,jsx_runtime.jsx)(dist/* Toaster */.l$, { position: "top-right", toastOptions: {
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
                        } })] }) }) }));
}
/* harmony default export */ const src_App = (App);

;// ./src/index.tsx






const RootWithProvider = () => ((0,jsx_runtime.jsx)(AuthContext/* AuthProvider */.O, { children: (0,jsx_runtime.jsx)(src_App, {}) }));
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = client.createRoot(rootElement);
    root.render((0,jsx_runtime.jsx)(react.StrictMode, { children: (0,jsx_runtime.jsx)(RootWithProvider, {}) }));
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
.right-1\\.5 {
  right: 0.375rem;
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
.mb-10 {
  margin-bottom: 2.5rem;
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
.h-36 {
  height: 9rem;
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
.max-h-64 {
  max-height: 16rem;
}
.max-h-96 {
  max-height: 24rem;
}
.max-h-\\[90vh\\] {
  max-height: 90vh;
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
.w-10 {
  width: 2.5rem;
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
.space-y-10 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(2.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(2.5rem * var(--tw-space-y-reverse));
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
.rounded-b-md {
  border-bottom-right-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
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
.border-gray-700 {
  --tw-border-opacity: 1;
  border-color: rgb(55 65 81 / var(--tw-border-opacity, 1));
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
.border-orange-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 215 170 / var(--tw-border-opacity, 1));
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
.border-yellow-200 {
  --tw-border-opacity: 1;
  border-color: rgb(254 240 138 / var(--tw-border-opacity, 1));
}
.border-yellow-400 {
  --tw-border-opacity: 1;
  border-color: rgb(250 204 21 / var(--tw-border-opacity, 1));
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
.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));
}
.bg-blue-700 {
  --tw-bg-opacity: 1;
  background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));
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
.bg-indigo-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(99 102 241 / var(--tw-bg-opacity, 1));
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
.p-5 {
  padding: 1.25rem;
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
.px-3\\.5 {
  padding-left: 0.875rem;
  padding-right: 0.875rem;
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
.py-10 {
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
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
.pl-3 {
  padding-left: 0.75rem;
}
.pl-4 {
  padding-left: 1rem;
}
.pl-8 {
  padding-left: 2rem;
}
.pl-9 {
  padding-left: 2.25rem;
}
.pr-10 {
  padding-right: 2.5rem;
}
.pr-2 {
  padding-right: 0.5rem;
}
.pr-3 {
  padding-right: 0.75rem;
}
.pr-4 {
  padding-right: 1rem;
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
.text-7xl {
  font-size: 4.5rem;
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
.leading-4 {
  line-height: 1rem;
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
.text-teal-400 {
  --tw-text-opacity: 1;
  color: rgb(45 212 191 / var(--tw-text-opacity, 1));
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
.text-yellow-400 {
  --tw-text-opacity: 1;
  color: rgb(250 204 21 / var(--tw-text-opacity, 1));
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

.hover\\:bg-black:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-200:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(191 219 254 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-50:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(239 246 255 / var(--tw-bg-opacity, 1));
}

.hover\\:bg-blue-500:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));
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

.hover\\:to-indigo-700:hover {
  --tw-gradient-to: #4338ca var(--tw-gradient-to-position);
}

.hover\\:text-black:hover {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity, 1));
}

.hover\\:text-blue-400:hover {
  --tw-text-opacity: 1;
  color: rgb(96 165 250 / var(--tw-text-opacity, 1));
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

.hover\\:text-indigo-500:hover {
  --tw-text-opacity: 1;
  color: rgb(99 102 241 / var(--tw-text-opacity, 1));
}

.hover\\:text-indigo-600:hover {
  --tw-text-opacity: 1;
  color: rgb(79 70 229 / var(--tw-text-opacity, 1));
}

.hover\\:text-purple-500:hover {
  --tw-text-opacity: 1;
  color: rgb(168 85 247 / var(--tw-text-opacity, 1));
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

.disabled\\:opacity-40:disabled {
  opacity: 0.4;
}

.disabled\\:opacity-50:disabled {
  opacity: 0.5;
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
  .md\\:col-span-3 {
    grid-column: span 3 / span 3;
  }
  .md\\:mb-0 {
    margin-bottom: 0px;
  }
  .md\\:mr-8 {
    margin-right: 2rem;
  }
  .md\\:mt-0 {
    margin-top: 0px;
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
  .md\\:py-16 {
    padding-top: 4rem;
    padding-bottom: 4rem;
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
  .md\\:text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
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
}`, "",{"version":3,"sources":["webpack://./src/styles/globals.css"],"names":[],"mappings":"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AA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,iBAA+B;EAA/B;AAA+B;AAA/B;EAAA,iBAA+B;EAA/B;AAA+B;AAA/B;EAAA,gBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,gBAA+B;EAA/B,oBAA+B;EAA/B,4BAA+B;EAA/B;AAA+B;AAA/B;EAAA,gBAA+B;EAA/B,oBAA+B;EAA/B,4BAA+B;EAA/B;AAA+B;AAA/B;EAAA,gBAA+B;EAA/B,oBAA+B;EAA/B,4BAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;A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A/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA,sBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,6BAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;A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mBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA,kBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,+BAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;EAA/B;AAA+B;AAA/B;EAAA,oBAA+B;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AA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,4DAm1BC;EAn1BD,mEAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,4DAm1BC;EAn1BD,mEAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,gDAm1BC;EAn1BD,6DAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,+EAm1BC;EAn1BD,mGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,6EAm1BC;EAn1BD,iGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,0CAm1BC;EAn1BD,uDAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,gFAm1BC;EAn1BD,oGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,2GAm1BC;EAn1BD,yGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,sBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,8BAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,2GAm1BC;EAn1BD,yGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,2GAm1BC;EAn1BD,yGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,2GAm1BC;EAn1BD,yGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,8BAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,2GAm1BC;EAn1BD,yGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,2GAm1BC;EAn1BD,yGAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA,yBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,iBAm1BC;EAn1BD,iBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,kBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,oBAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;AAm1BC;;AAn1BD;EAAA;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,uBAm1BC;IAn1BD,oDAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,uBAm1BC;IAn1BD,2DAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,mBAm1BC;IAn1BD;EAm1BC;AAAA;;AAn1BD;EAAA;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,uBAm1BC;IAn1BD,oDAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,uBAm1BC;IAn1BD,2DAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,iBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,mBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,eAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;AAAA;;AAn1BD;EAAA;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,iBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,iBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,mBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,iBAm1BC;IAn1BD;EAm1BC;AAAA;;AAn1BD;EAAA;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;AAAA;;AAn1BD;EAAA;IAAA;EAm1BC;AAAA;;AAn1BD;EAAA;IAAA,sBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,sBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,sBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,sBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,sBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,sBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,sBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,6BAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,0EAm1BC;IAn1BD,oEAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,4DAm1BC;IAn1BD,kEAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,4DAm1BC;IAn1BD,kEAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,mEAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,+BAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,2BAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,2BAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,sBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA,kBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;EAn1BD;IAAA,oBAm1BC;IAn1BD;EAm1BC;EAn1BD;IAAA;EAm1BC;AAAA;;AAn1BD;EAAA,gCAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,iCAm1BC;EAn1BD;AAm1BC;;AAn1BD;EAAA,iCAm1BC;EAn1BD;AAm1BC","sourcesContent":["/* src/styles/globals.css */\n@import 'tailwindcss/base';\n@import 'tailwindcss/components';\n@import 'tailwindcss/utilities';\n\n/* ===== DESIGN SYSTEM VARIABLES ===== */\n\n:root {\n  /* Primary Colors */\n  --primary-50: #eff6ff;\n  --primary-100: #dbeafe;\n  --primary-200: #bfdbfe;\n  --primary-300: #93c5fd;\n  --primary-400: #60a5fa;\n  --primary-500: #3b82f6;\n  --primary-600: #2563eb;\n  --primary-700: #1d4ed8;\n  --primary-800: #1e40af;\n  --primary-900: #1e3a8a;\n  --primary-950: #172554;\n\n  /* Neutral Colors */\n  --neutral-50: #f9fafb;\n  --neutral-100: #f3f4f6;\n  --neutral-200: #e5e7eb;\n  --neutral-300: #d1d5db;\n  --neutral-400: #9ca3af;\n  --neutral-500: #6b7280;\n  --neutral-600: #4b5563;\n  --neutral-700: #374151;\n  --neutral-800: #1f2937;\n  --neutral-900: #111827;\n  --neutral-950: #030712;\n\n  /* Success Colors */\n  --success-50: #f0fdf4;\n  --success-100: #dcfce7;\n  --success-200: #bbf7d0;\n  --success-300: #86efac;\n  --success-400: #4ade80;\n  --success-500: #22c55e;\n  --success-600: #16a34a;\n  --success-700: #15803d;\n  --success-800: #166534;\n  --success-900: #14532d;\n\n  /* Warning Colors */\n  --warning-50: #fffbeb;\n  --warning-100: #fef3c7;\n  --warning-200: #fde68a;\n  --warning-300: #fcd34d;\n  --warning-400: #fbbf24;\n  --warning-500: #f59e0b;\n  --warning-600: #d97706;\n  --warning-700: #b45309;\n  --warning-800: #92400e;\n  --warning-900: #78350f;\n\n  /* Error Colors */\n  --error-50: #fef2f2;\n  --error-100: #fee2e2;\n  --error-200: #fecaca;\n  --error-300: #fca5a5;\n  --error-400: #f87171;\n  --error-500: #ef4444;\n  --error-600: #dc2626;\n  --error-700: #b91c1c;\n  --error-800: #991b1b;\n  --error-900: #7f1d1d;\n\n  /* Semantic Colors */\n  --text-primary: var(--neutral-900);\n  --text-secondary: var(--neutral-600);\n  --text-tertiary: var(--neutral-500);\n  --text-inverse: var(--neutral-50);\n  \n  --bg-primary: #ffffff;\n  --bg-secondary: var(--neutral-50);\n  --bg-tertiary: var(--neutral-100);\n  --bg-overlay: rgba(0, 0, 0, 0.5);\n  \n  --border-primary: var(--neutral-200);\n  --border-secondary: var(--neutral-300);\n  --border-focus: var(--primary-500);\n  \n  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n\n  /* Spacing */\n  --space-0: 0;\n  --space-1: 0.25rem;\n  --space-2: 0.5rem;\n  --space-3: 0.75rem;\n  --space-4: 1rem;\n  --space-5: 1.25rem;\n  --space-6: 1.5rem;\n  --space-8: 2rem;\n  --space-10: 2.5rem;\n  --space-12: 3rem;\n  --space-16: 4rem;\n  --space-20: 5rem;\n  --space-24: 6rem;\n\n  /* Border Radius */\n  --radius-none: 0;\n  --radius-sm: 0.125rem;\n  --radius-base: 0.25rem;\n  --radius-md: 0.375rem;\n  --radius-lg: 0.5rem;\n  --radius-xl: 0.75rem;\n  --radius-2xl: 1rem;\n  --radius-3xl: 1.5rem;\n  --radius-full: 9999px;\n\n  /* Transitions */\n  --duration-75: 75ms;\n  --duration-100: 100ms;\n  --duration-150: 150ms;\n  --duration-200: 200ms;\n  --duration-300: 300ms;\n  --duration-500: 500ms;\n  --duration-700: 700ms;\n  --duration-1000: 1000ms;\n}\n\n/* Dark mode support */\n@media (prefers-color-scheme: dark) {\n  :root {\n    --text-primary: var(--neutral-50);\n    --text-secondary: var(--neutral-400);\n    --text-tertiary: var(--neutral-500);\n    --text-inverse: var(--neutral-900);\n    \n    --bg-primary: var(--neutral-900);\n    --bg-secondary: var(--neutral-800);\n    --bg-tertiary: var(--neutral-700);\n    \n    --border-primary: var(--neutral-700);\n    --border-secondary: var(--neutral-600);\n  }\n}\n\n/* ===== GLOBAL RESET & BASE STYLES ===== */\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n  line-height: 1.6;\n  color: var(--text-primary);\n  background-color: var(--bg-primary);\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n/* ===== TYPOGRAPHY ENHANCEMENTS ===== */\n\n  h1, .heading-primary {\n    font-size: 3rem;\n    font-weight: 700;\n    line-height: 1.1;\n    color: var(--neutral-900) !important;\n    letter-spacing: -0.02em;\n}\n\nh2, .heading-secondary {\n  font-size: 2rem;\n  font-weight: 400;\n  line-height: 1.2;\n  color: #222 !important;\n}\n\n  h3, .heading-tertiary {\n    font-size: 1.5rem;\n    font-weight: 600;\n    line-height: 1.3;\n    color: var(--neutral-900) !important;\n}\n\n.heading-card {\n  font-size: 1.25rem;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n\n.body-large {\n  font-size: 1.125rem;\n  line-height: 1.6;\n  color: var(--text-secondary);\n}\n\n.body-medium {\n  font-size: 1rem;\n  line-height: 1.6;\n  color: var(--text-secondary);\n}\n\n.body-small {\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: var(--text-tertiary);\n}\n\n.meta-text {\n  font-size: 0.75rem;\n  color: var(--text-tertiary);\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n\n/* ===== BADGE SYSTEM ===== */\n\n.badge-base {\n  display: inline-flex;\n  align-items: center;\n  padding: 0.25rem 0.75rem;\n  border-radius: 9999px;\n  font-size: 0.75rem;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n}\n\n.badge-success {\n  background-color: var(--success-100);\n  color: var(--success-800);\n}\n\n.badge-warning {\n  background-color: var(--warning-100);\n  color: var(--warning-800);\n}\n\n.badge-error {\n  background-color: var(--error-100);\n  color: var(--error-800);\n}\n\n.badge-info {\n  background-color: var(--primary-100);\n  color: var(--primary-800);\n}\n\n.badge-purple {\n  background-color: #f3e8ff;\n  color: #7c3aed;\n}\n\n.badge-orange {\n  background-color: #fed7aa;\n  color: #ea580c;\n}\n\n.badge-gray {\n  background-color: var(--neutral-100);\n  color: var(--neutral-700);\n}\n\n/* ===== MODERN COMPONENT CLASSES ===== */\n\n/* Card Design System */\n.card-modern {\n  background-color: var(--bg-primary);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-sm);\n  transition: all 0.2s ease-in-out;\n  padding: var(--space-6);\n}\n\n.card-modern:hover {\n  transform: translateY(-2px);\n  box-shadow: var(--shadow-lg);\n}\n\n.card-compact {\n  background-color: var(--bg-primary);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-sm);\n  transition: all 0.2s ease-in-out;\n  padding: var(--space-4);\n}\n\n.card-interactive {\n  background-color: var(--bg-primary);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-xl);\n  box-shadow: var(--shadow-sm);\n  transition: all 0.2s ease-in-out;\n  cursor: pointer;\n}\n\n.card-interactive:hover {\n  transform: translateY(-2px);\n  box-shadow: var(--shadow-lg);\n}\n\n/* Button System */\n.btn-primary {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-2);\n  padding: var(--space-3) var(--space-6);\n  background-color: var(--primary-600);\n  color: var(--text-inverse);\n  border: 1px solid transparent;\n  border-radius: var(--radius-lg);\n  font-family: inherit;\n  font-size: 0.875rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n\n.btn-primary:hover:not(:disabled) {\n  background-color: var(--primary-700);\n}\n\n.btn-primary:focus-visible {\n  outline: 2px solid var(--border-focus);\n  outline-offset: 2px;\n}\n\n.btn-primary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-secondary {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-2);\n  padding: var(--space-3) var(--space-6);\n  background-color: var(--bg-secondary);\n  color: var(--text-primary);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-lg);\n  font-family: inherit;\n  font-size: 0.875rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n\n.btn-secondary:hover:not(:disabled) {\n  background-color: var(--bg-tertiary);\n  border-color: var(--border-secondary);\n}\n\n.btn-secondary:focus-visible {\n  outline: 2px solid var(--border-focus);\n  outline-offset: 2px;\n}\n\n.btn-secondary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-ghost {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--space-2);\n  padding: var(--space-2) var(--space-4);\n  background-color: transparent;\n  color: var(--text-secondary);\n  border: 1px solid transparent;\n  border-radius: var(--radius-lg);\n  font-family: inherit;\n  font-size: 0.875rem;\n  font-weight: 500;\n  text-decoration: none;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n\n.btn-ghost:hover:not(:disabled) {\n  background-color: var(--bg-secondary);\n  color: var(--text-primary);\n}\n\n.btn-ghost:focus-visible {\n  outline: 2px solid var(--border-focus);\n  outline-offset: 2px;\n}\n\n.btn-ghost:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-accept, .btn-follow-back {\n  background: #2563eb !important;\n  color: #fff !important;\n  font-weight: 600;\n  border-radius: 999px;\n  box-shadow: 0 2px 8px rgba(37,99,235,0.08);\n  padding: 0.5rem 1.5rem;\n  font-size: 1rem;\n  border: none;\n  transition: background 0.15s, box-shadow 0.15s;\n}\n\n.btn-accept:disabled, .btn-follow-back:disabled {\n  background: #e5e7eb !important;\n  color: #888 !important;\n  opacity: 1 !important;\n  box-shadow: none;\n}\n\n/* Form System */\n.form-input {\n  width: 100%;\n  padding: var(--space-3) var(--space-4);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-lg);\n  background-color: var(--bg-primary);\n  color: var(--text-primary);\n  font-family: inherit;\n  font-size: 1rem;\n  line-height: 1.5;\n  transition: all 0.2s ease-in-out;\n}\n\n.form-input::placeholder {\n  color: #555 !important;\n  opacity: 1 !important;\n}\n\n.form-input:focus {\n  outline: none;\n  border-color: var(--border-focus);\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n\n.form-input:disabled {\n  background-color: var(--bg-secondary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n}\n\n.form-textarea {\n  width: 100%;\n  padding: var(--space-3) var(--space-4);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-lg);\n  background-color: var(--bg-primary);\n  color: var(--text-primary);\n  font-family: inherit;\n  font-size: 1rem;\n  line-height: 1.5;\n  transition: all 0.2s ease-in-out;\n  resize: vertical;\n  min-height: 100px;\n}\n\n.form-textarea::placeholder {\n  color: var(--text-tertiary);\n}\n\n.form-textarea:focus {\n  outline: none;\n  border-color: var(--border-focus);\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n\n.form-textarea:disabled {\n  background-color: var(--bg-secondary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n}\n\n.form-select {\n  width: 100%;\n  padding: var(--space-3) var(--space-4);\n  padding-right: var(--space-10);\n  border: 1px solid var(--border-primary);\n  border-radius: var(--radius-lg);\n  background-color: var(--bg-primary);\n  color: var(--text-primary);\n  font-family: inherit;\n  font-size: 1rem;\n  line-height: 1.5;\n  transition: all 0.2s ease-in-out;\n  cursor: pointer;\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\");\n  background-position: right var(--space-2) center;\n  background-repeat: no-repeat;\n  background-size: 1.5em 1.5em;\n  appearance: none;\n}\n\n.form-select:focus {\n  outline: none;\n  border-color: var(--border-focus);\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n\n.form-select:disabled {\n  background-color: var(--bg-secondary);\n  color: var(--text-tertiary);\n  cursor: not-allowed;\n}\n\n/* ===== LEGACY BUTTON CLASSES (for backward compatibility) ===== */\n\n.btn-danger {\n  background-color: var(--error-600);\n}\n\n.btn-danger:hover:not(:disabled) {\n  background-color: var(--error-700);\n}\n\n.btn-card {\n  width: 100%;\n  justify-content: center;\n}\n\n/* ===== GRID SYSTEMS ===== */\n\n.grid-cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));\n  gap: 2rem;\n  padding: 0.5rem 0;\n}\n\n.grid-features {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 2rem;\n}\n\n/* ===== ANIMATION CLASSES ===== */\n\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n.animate-entrance {\n  animation: fadeIn 0.6s ease-out;\n}\n\n.animate-fade {\n  animation: fadeIn 0.3s ease-out;\n}\n\n.animate-slide {\n  animation: slideUp 0.4s ease-out;\n}\n\n.animate-spin {\n  animation: spin 1s linear infinite;\n}\n\n/* ===== UTILITY CLASSES ===== */\n\n.font-light {\n  font-weight: 300;\n}\n\n.tracking-tight {\n  letter-spacing: -0.025em;\n}\n\n.tracking-wide {\n  letter-spacing: 0.025em;\n}\n\n.tracking-wider {\n  letter-spacing: 0.05em;\n}\n\n/* ===== TEXT UTILITIES ===== */\n\n.line-clamp-2 {\n  display: -webkit-box;\n  line-clamp: 2;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.line-clamp-3 {\n  display: -webkit-box;\n  line-clamp: 3;\n  -webkit-line-clamp: 3;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n.line-clamp-4 {\n  display: -webkit-box;\n  line-clamp: 4;\n  -webkit-line-clamp: 4;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n\n/* ===== TRANSITION UTILITIES ===== */\n\n.transition-all {\n  transition: all 0.2s ease-in-out;\n}\n\n.transition-colors {\n  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;\n}\n\n/* ===== FOCUS STYLES ===== */\n\n.focus\\:outline-none:focus {\n  outline: none;\n}\n\n.focus\\:border-gray-400:focus {\n  border-color: var(--neutral-400);\n}\n\n/* ===== SCROLLBAR STYLING ===== */\n\n::-webkit-scrollbar {\n  width: 8px;\n}\n\n::-webkit-scrollbar-track {\n  background: var(--neutral-100);\n}\n\n::-webkit-scrollbar-thumb {\n  background: var(--neutral-300);\n  border-radius: 4px;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: var(--neutral-400);\n}\n\n/* ===== HOVER EFFECTS ===== */\n\n.group:hover .group-hover\\:shadow-2xl {\n  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);\n}\n\n.group:hover .group-hover\\:text-black {\n  color: var(--text-primary);\n}\n\n.group:hover .group-hover\\:underline {\n  text-decoration: underline;\n}\n\n/* ===== GRADIENT UTILITIES ===== */\n\n.bg-gradient-to-br {\n  background-image: linear-gradient(to bottom right, var(--neutral-50), white);\n}\n\n.from-gray-50 {\n  background-image: linear-gradient(to bottom right, var(--neutral-50), white);\n}\n\n.to-white {\n  background-image: linear-gradient(to bottom right, var(--neutral-50), white);\n}\n\n/* ===== FORM ELEMENT STYLING ===== */\n\nbutton {\n  font-family: inherit;\n}\n\nbutton:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\ninput, textarea, select, .form-input, .form-select, .form-textarea {\n  background-color: #fff !important;\n  color: #222 !important;\n}\n\ninput:disabled, textarea:disabled, select:disabled, .form-input:disabled, .form-select:disabled, .form-textarea:disabled {\n  background-color: #f3f6fa !important;\n  color: #888 !important;\n}\n\n/* ===== RESPONSIVE TYPOGRAPHY ===== */\n\n@media (max-width: 640px) {\n  .text-6xl {\n    font-size: 2.5rem;\n  }\n  \n  .text-4xl {\n    font-size: 2rem;\n  }\n  \n  .text-3xl {\n    font-size: 1.75rem;\n  }\n}\n\n/* ===== PRINT STYLES ===== */\n\n@media print {\n  .no-print {\n    display: none !important;\n  }\n}\n\n/* ===== SELECT STYLING ===== */\n\nselect option {\n  background-color: white;\n  color: var(--text-primary);\n  padding: 0.5rem;\n}\n\nselect {\n  background-color: white;\n  color: var(--text-primary);\n}\n\nselect::-webkit-scrollbar {\n  width: 8px;\n}\n\nselect::-webkit-scrollbar-track {\n  background: var(--neutral-100);\n}\n\nselect::-webkit-scrollbar-thumb {\n  background: var(--neutral-300);\n  border-radius: 4px;\n}\n\nselect::-webkit-scrollbar-thumb:hover {\n  background: var(--neutral-400);\n}\n\n/* ===== STAGGERED ANIMATIONS ===== */\n\n.stagger-1 { animation-delay: 0.1s; }\n.stagger-2 { animation-delay: 0.2s; }\n.stagger-3 { animation-delay: 0.3s; }\n.stagger-4 { animation-delay: 0.4s; }\n.stagger-5 { animation-delay: 0.5s; }\n.stagger-6 { animation-delay: 0.6s; }\n.stagger-7 { animation-delay: 0.7s; }\n.stagger-8 { animation-delay: 0.8s; }\n\n/* ===== SLIDER STYLING ===== */\n\n.slider {\n  appearance: none;\n  -webkit-appearance: none;\n  width: 100%;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--neutral-200);\n  outline: none;\n}\n\n.slider::-webkit-slider-track {\n  width: 100%;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--neutral-200);\n}\n\n.slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: var(--primary-600);\n  cursor: pointer;\n  border: 2px solid white;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n.slider::-webkit-slider-thumb:hover {\n  background: var(--primary-700);\n}\n\n.slider::-moz-range-track {\n  width: 100%;\n  height: 6px;\n  border-radius: 3px;\n  background: var(--neutral-200);\n  border: none;\n}\n\n.slider::-moz-range-thumb {\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: var(--primary-600);\n  cursor: pointer;\n  border: 2px solid white;\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n.slider::-moz-range-thumb:hover {\n  background: var(--primary-700);\n}\n\n/* ===== NAVIGATION STYLES ===== */\n\n#main-navbar, #main-navbar a, #main-navbar .nav-link {\n  font-family: inherit;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 9487:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BN: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.BN),
/* harmony export */   Dc: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.Dc),
/* harmony export */   H9: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc),
/* harmony export */   IG: () => (/* binding */ storage),
/* harmony export */   O5: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.O5),
/* harmony export */   db: () => (/* binding */ db),
/* harmony export */   gS: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.gS),
/* harmony export */   j2: () => (/* binding */ auth),
/* harmony export */   kd: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.kd),
/* harmony export */   rJ: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.rJ),
/* harmony export */   x7: () => (/* reexport safe */ firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getDoc)
/* harmony export */ });
/* unused harmony exports app, handleFirestoreError */
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(223);
/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(474);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7594);
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2539);
// src/firebase.ts




const firebaseConfig = {
    apiKey: "AIzaSyDTvNBe3q-Wbog_sMlRFjwA_gqGXpw37UM",
    authDomain: "whosonsetdepez.firebaseapp.com",
    projectId: "whosonsetdepez",
    storageBucket: "whosonsetdepez.firebasestorage.app",
    messagingSenderId: "100935772037",
    appId: "1:100935772037:web:37d83a6740e740ff37c6ec",
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
/******/ __webpack_require__.O(0, [578,70,753,652], () => (__webpack_exec__(4631)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.bundle.js.map