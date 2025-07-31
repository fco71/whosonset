"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[5],{

/***/ 5:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_RegisterPage)
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
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/user.js
var user = __webpack_require__(8686);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/mail.js
var mail = __webpack_require__(3954);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/lock.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = (0,createLucideIcon/* default */.A)("lock", __iconNode);


//# sourceMappingURL=lock.js.map

;// ./node_modules/lucide-react/dist/esm/icons/eye-off.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const eye_off_iconNode = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = (0,createLucideIcon/* default */.A)("eye-off", eye_off_iconNode);


//# sourceMappingURL=eye-off.js.map

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/eye.js
var eye = __webpack_require__(3160);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/icons/arrow-right.js
var arrow_right = __webpack_require__(8635);
;// ./src/pages/RegisterPage.tsx





const RegisterPage = () => {
    const [firstName, setFirstName] = (0,react.useState)('');
    const [lastName, setLastName] = (0,react.useState)('');
    const [email, setEmail] = (0,react.useState)('');
    const [password, setPassword] = (0,react.useState)('');
    const [confirmPassword, setConfirmPassword] = (0,react.useState)('');
    const [showPassword, setShowPassword] = (0,react.useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0,react.useState)(false);
    const [error, setError] = (0,react.useState)('');
    const [loading, setLoading] = (0,react.useState)(false);
    const { signup } = (0,AuthContext/* useAuth */.A)();
    const navigate = (0,dist/* useNavigate */.Zp)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName.trim() || !lastName.trim()) {
            return setError('First name and last name are required');
        }
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        try {
            setError('');
            setLoading(true);
            await signup(email, password, firstName.trim(), lastName.trim());
            navigate('/edit-profile');
        }
        catch (err) {
            setError('Failed to create an account');
            console.error(err);
        }
        setLoading(false);
    };
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: [(0,jsx_runtime.jsxs)("div", { className: "absolute inset-0 overflow-hidden", children: [(0,jsx_runtime.jsx)("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" }), (0,jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" })] }), (0,jsx_runtime.jsxs)("div", { className: "relative max-w-md w-full space-y-8", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "mb-8", children: (0,jsx_runtime.jsx)(react_router_dom_dist/* Link */.N_, { to: "/", className: "inline-block text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent tracking-tight", children: "WHOSONSET" }) }), (0,jsx_runtime.jsx)("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Join the Film Community" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Create your account and start connecting with industry professionals" })] }), (0,jsx_runtime.jsxs)("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-8", children: [error && ((0,jsx_runtime.jsx)("div", { className: "mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg", role: "alert", children: (0,jsx_runtime.jsx)("span", { className: "text-sm", children: error }) })), (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "firstName", className: "block text-sm font-medium text-gray-700 mb-2", children: "First Name" }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0,jsx_runtime.jsx)(user/* default */.A, { className: "h-5 w-5 text-gray-400" }) }), (0,jsx_runtime.jsx)("input", { id: "firstName", name: "firstName", type: "text", autoComplete: "given-name", required: true, className: "block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm", placeholder: "John", value: firstName, onChange: (e) => setFirstName(e.target.value) })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "lastName", className: "block text-sm font-medium text-gray-700 mb-2", children: "Last Name" }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0,jsx_runtime.jsx)(user/* default */.A, { className: "h-5 w-5 text-gray-400" }) }), (0,jsx_runtime.jsx)("input", { id: "lastName", name: "lastName", type: "text", autoComplete: "family-name", required: true, className: "block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm", placeholder: "Doe", value: lastName, onChange: (e) => setLastName(e.target.value) })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email Address" }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0,jsx_runtime.jsx)(mail/* default */.A, { className: "h-5 w-5 text-gray-400" }) }), (0,jsx_runtime.jsx)("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, className: "block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm", placeholder: "your@email.com", value: email, onChange: (e) => setEmail(e.target.value) })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0,jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-gray-400" }) }), (0,jsx_runtime.jsx)("input", { id: "password", name: "password", type: showPassword ? "text" : "password", autoComplete: "new-password", required: true, className: "block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm", placeholder: "Create a secure password", value: password, onChange: (e) => setPassword(e.target.value) }), (0,jsx_runtime.jsx)("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? ((0,jsx_runtime.jsx)(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) : ((0,jsx_runtime.jsx)(eye/* default */.A, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "confirm-password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirm Password" }), (0,jsx_runtime.jsxs)("div", { className: "relative", children: [(0,jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0,jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-gray-400" }) }), (0,jsx_runtime.jsx)("input", { id: "confirm-password", name: "confirm-password", type: showConfirmPassword ? "text" : "password", autoComplete: "new-password", required: true, className: "block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm", placeholder: "Confirm your password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }), (0,jsx_runtime.jsx)("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowConfirmPassword(!showConfirmPassword), children: showConfirmPassword ? ((0,jsx_runtime.jsx)(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) : ((0,jsx_runtime.jsx)(eye/* default */.A, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) })] })] }), (0,jsx_runtime.jsx)("div", { children: (0,jsx_runtime.jsx)("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl", children: loading ? ((0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), "Creating your account..."] })) : ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsx)(user/* default */.A, { className: "h-4 w-4 mr-2" }), "Create Account", (0,jsx_runtime.jsx)(arrow_right/* default */.A, { className: "h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" })] })) }) })] }), (0,jsx_runtime.jsx)("div", { className: "mt-6 text-center", children: (0,jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: ["Already have an account?", ' ', (0,jsx_runtime.jsx)(react_router_dom_dist/* Link */.N_, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-500 transition-colors", children: "Sign in" })] }) })] }), (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Join thousands of film professionals" }), (0,jsx_runtime.jsxs)("div", { className: "flex justify-center space-x-6 text-xs text-gray-500", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-blue-600 rounded-full mr-2" }), "Network with industry pros"] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-blue-600 rounded-full mr-2" }), "Find exciting projects"] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-blue-600 rounded-full mr-2" }), "Showcase your work"] })] })] })] })] }));
};
/* harmony default export */ const pages_RegisterPage = (RegisterPage);


/***/ }),

/***/ 3160:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Eye)
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
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("eye", __iconNode);


//# sourceMappingURL=eye.js.map


/***/ }),

/***/ 8635:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ArrowRight)
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
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("arrow-right", __iconNode);


//# sourceMappingURL=arrow-right.js.map


/***/ }),

/***/ 8686:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ User)
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
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("user", __iconNode);


//# sourceMappingURL=user.js.map


/***/ })

}]);
//# sourceMappingURL=5.chunk.js.map