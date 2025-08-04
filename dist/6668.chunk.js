"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[6668],{

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

/***/ 6668:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_ForgotPasswordPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var dist = __webpack_require__(4976);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/mail.js
var mail = __webpack_require__(3954);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-alert.js
var circle_alert = __webpack_require__(7946);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/circle-check-big.js
var circle_check_big = __webpack_require__(4471);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/arrow-left.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = (0,createLucideIcon/* default */.A)("arrow-left", __iconNode);


//# sourceMappingURL=arrow-left.js.map

;// ./src/pages/ForgotPasswordPage.tsx





const ForgotPasswordPage = () => {
    const [email, setEmail] = (0,react.useState)('');
    const [loading, setLoading] = (0,react.useState)(false);
    const [error, setError] = (0,react.useState)('');
    const [success, setSuccess] = (0,react.useState)(false);
    const { sendPasswordReset } = (0,AuthContext/* useAuth */.A)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            return setError('Please enter your email address');
        }
        try {
            setError('');
            setLoading(true);
            await sendPasswordReset(email.trim());
            setSuccess(true);
        }
        catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address');
            }
            else {
                setError('Failed to send password reset email. Please try again.');
            }
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: [(0,jsx_runtime.jsxs)("div", { className: "absolute inset-0 overflow-hidden", children: [(0,jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" }), (0,jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" })] }), (0,jsx_runtime.jsxs)("div", { className: "relative max-w-md w-full space-y-8", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "mb-8", children: (0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/", className: "inline-block text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent tracking-tight", children: "My Film Jobs" }) }), (0,jsx_runtime.jsx)("div", { className: "flex justify-center mb-4", children: (0,jsx_runtime.jsx)("div", { className: "p-3 bg-blue-100 rounded-full", children: (0,jsx_runtime.jsx)(mail/* default */.A, { className: "h-8 w-8 text-blue-600" }) }) }), (0,jsx_runtime.jsx)("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Reset Your Password" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Enter your email address and we'll send you a link to reset your password" })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8", children: [error && ((0,jsx_runtime.jsxs)("div", { className: "mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start", role: "alert", children: [(0,jsx_runtime.jsx)(circle_alert/* default */.A, { className: "h-5 w-5 mr-2 mt-0.5 flex-shrink-0" }), (0,jsx_runtime.jsx)("span", { className: "text-sm", children: error })] })), success ? ((0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "flex justify-center mb-4", children: (0,jsx_runtime.jsx)("div", { className: "p-3 bg-green-100 rounded-full", children: (0,jsx_runtime.jsx)(circle_check_big/* default */.A, { className: "h-8 w-8 text-green-600" }) }) }), (0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Check Your Email" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-600 mb-6", children: ["We've sent a password reset link to ", (0,jsx_runtime.jsx)("strong", { children: email })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4 text-sm text-gray-700 mb-6", children: [(0,jsx_runtime.jsx)("p", { className: "font-medium mb-2", children: "Can't find the email?" }), (0,jsx_runtime.jsxs)("ul", { className: "text-left space-y-1", children: [(0,jsx_runtime.jsx)("li", { children: "\u2022 Check your spam/junk folder" }), (0,jsx_runtime.jsx)("li", { children: "\u2022 Make sure you entered the correct email address" }), (0,jsx_runtime.jsx)("li", { children: "\u2022 Wait a few minutes for the email to arrive" })] })] }), (0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: "/login", className: "inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors", children: [(0,jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Sign In"] })] })) : ((0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0,jsx_runtime.jsx)(mail/* default */.A, { className: "h-5 w-5 text-gray-400" }) }), (0,jsx_runtime.jsx)("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: "block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm", placeholder: "your@email.com", value: email, onChange: (e) => setEmail(e.target.value) })] })] }), (0,jsx_runtime.jsx)("div", { children: (0,jsx_runtime.jsx)("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? ((0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Sending reset link..."] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(mail/* default */.A, { className: "h-4 w-4" }), "Send Reset Link"] })) }) })] })), !success && ((0,jsx_runtime.jsx)("div", { className: "mt-6 text-center", children: (0,jsx_runtime.jsxs)(dist/* Link */.N_, { to: "/login", className: "inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors", children: [(0,jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Back to Sign In"] }) }))] }), (0,jsx_runtime.jsx)("div", { className: "text-center", children: (0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: ["Remember your password?", ' ', (0,jsx_runtime.jsx)(dist/* Link */.N_, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-500 transition-colors", children: "Sign in" })] }) })] })] }));
};
/* harmony default export */ const pages_ForgotPasswordPage = (ForgotPasswordPage);


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
//# sourceMappingURL=6668.chunk.js.map