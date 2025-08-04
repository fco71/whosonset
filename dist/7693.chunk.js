"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[7693],{

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

/***/ 7693:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_EmailVerificationPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var react_router_dom_dist = __webpack_require__(4976);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-check-big.js
var circle_check_big = __webpack_require__(4471);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-alert.js
var circle_alert = __webpack_require__(7946);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/refresh-cw.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = (0,createLucideIcon/* default */.A)("refresh-cw", __iconNode);


//# sourceMappingURL=refresh-cw.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/mail.js
var mail = __webpack_require__(3954);
;// ./src/pages/EmailVerificationPage.tsx





const EmailVerificationPage = () => {
    const [verificationSent, setVerificationSent] = (0,react.useState)(false);
    const [loading, setLoading] = (0,react.useState)(false);
    const [error, setError] = (0,react.useState)('');
    const [showSuccessMessage, setShowSuccessMessage] = (0,react.useState)(false);
    const { currentUser, sendEmailVerification, resendVerificationEmail } = (0,AuthContext/* useAuth */.A)();
    const navigate = (0,dist/* useNavigate */.Zp)();
    (0,react.useEffect)(() => {
        // If user is not logged in, redirect to login
        if (!currentUser) {
            navigate('/login');
            return;
        }
        // If email is already verified, redirect to home
        if (currentUser.emailVerified) {
            navigate('/');
            return;
        }
        // Show success message immediately for better UX
        setShowSuccessMessage(true);
    }, [currentUser, navigate]);
    const handleSendVerification = async () => {
        try {
            setLoading(true);
            setError('');
            await sendEmailVerification();
            setVerificationSent(true);
        }
        catch (err) {
            if (err.message.includes('already verified')) {
                navigate('/');
            }
            else {
                setError('Failed to send verification email. Please try again.');
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleResendVerification = async () => {
        try {
            setLoading(true);
            setError('');
            await resendVerificationEmail();
            setVerificationSent(true);
        }
        catch (err) {
            setError('Failed to resend verification email. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleCheckVerification = async () => {
        try {
            setLoading(true);
            setError('');
            // Reload the user to check if email was verified
            await currentUser.reload();
            if (currentUser.emailVerified) {
                navigate('/edit-profile');
            }
            else {
                setError('Email not yet verified. Please check your inbox and click the verification link.');
            }
        }
        catch (err) {
            setError('Failed to check verification status. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    if (!currentUser) {
        return null; // Will redirect in useEffect
    }
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: [(0,jsx_runtime.jsxs)("div", { className: "absolute inset-0 overflow-hidden", children: [(0,jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" }), (0,jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" })] }), (0,jsx_runtime.jsxs)("div", { className: "relative max-w-md w-full space-y-8", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "mb-8", children: (0,jsx_runtime.jsx)(react_router_dom_dist/* Link */.N_, { to: "/", className: "inline-block text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent tracking-tight", children: "My Film Jobs" }) }), (0,jsx_runtime.jsx)("div", { className: "flex justify-center mb-4", children: (0,jsx_runtime.jsx)("div", { className: "p-3 bg-green-100 rounded-full", children: (0,jsx_runtime.jsx)(circle_check_big/* default */.A, { className: "h-8 w-8 text-green-600" }) }) }), (0,jsx_runtime.jsx)("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Account Created Successfully! \uD83C\uDF89" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-600", children: ["We've sent a verification link to ", (0,jsx_runtime.jsx)("strong", { children: currentUser.email })] })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8", children: [error && ((0,jsx_runtime.jsxs)("div", { className: "mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start", role: "alert", children: [(0,jsx_runtime.jsx)(circle_alert/* default */.A, { className: "h-5 w-5 mr-2 mt-0.5 flex-shrink-0" }), (0,jsx_runtime.jsx)("span", { className: "text-sm", children: error })] })), showSuccessMessage && ((0,jsx_runtime.jsxs)("div", { className: "mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start", role: "alert", children: [(0,jsx_runtime.jsx)(circle_check_big/* default */.A, { className: "h-5 w-5 mr-2 mt-0.5 flex-shrink-0" }), (0,jsx_runtime.jsx)("span", { className: "text-sm", children: "Welcome to My Film Jobs! Your account has been created successfully." })] })), (0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "To complete your registration, please verify your email address by clicking the link we just sent you." }), (0,jsx_runtime.jsxs)("div", { className: "bg-blue-50 rounded-lg p-4 text-sm text-blue-700", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium mb-2", children: "\uD83D\uDCE7 Check your email inbox" }), (0,jsx_runtime.jsxs)("ul", { className: "text-left space-y-1", children: [(0,jsx_runtime.jsx)("li", { children: "\u2022 Look for an email from My Film Jobs" }), (0,jsx_runtime.jsx)("li", { children: "\u2022 Click the \"Verify Email\" button in the email" }), (0,jsx_runtime.jsx)("li", { children: "\u2022 You'll be redirected to complete your profile" })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "space-y-3", children: [(0,jsx_runtime.jsxs)("button", { type: "button", onClick: handleCheckVerification, disabled: loading, className: "w-full bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed", children: [loading ? ((0,jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin" })) : ((0,jsx_runtime.jsx)(circle_check_big/* default */.A, { className: "h-5 w-5" })), (0,jsx_runtime.jsx)("span", { children: loading ? 'Checking...' : "I've Verified My Email - Continue to Profile" })] }), (0,jsx_runtime.jsxs)("button", { type: "button", onClick: handleResendVerification, disabled: loading, className: "w-full bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-all duration-200 py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed", children: [(0,jsx_runtime.jsx)(mail/* default */.A, { className: "h-5 w-5" }), (0,jsx_runtime.jsx)("span", { children: loading ? 'Sending...' : 'Resend Verification Email' })] })] }), (0,jsx_runtime.jsx)("div", { className: "text-center", children: (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => navigate('/login'), className: "text-sm text-gray-600 hover:text-gray-500 transition-colors", children: "Back to Sign In" }) })] })] }), (0,jsx_runtime.jsx)("div", { className: "text-center", children: (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Can't find the email? Check your spam folder or contact support" }) })] })] }));
};
/* harmony default export */ const pages_EmailVerificationPage = (EmailVerificationPage);


/***/ }),

/***/ 7946:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ CircleAlert)
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
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("circle-alert", __iconNode);


//# sourceMappingURL=circle-alert.js.map


/***/ })

}]);
//# sourceMappingURL=7693.chunk.js.map