"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[8139],{

/***/ 8139:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7767);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4976);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2584);




const LoginPage = () => {
    const [email, setEmail] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [password, setPassword] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { login } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__/* .useAuth */ .A)();
    const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .useNavigate */ .Zp)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        }
        catch (err) {
            setError('Failed to log in');
            console.error(err);
        }
        setLoading(false);
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-md w-full space-y-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to your account" }) }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "block sm:inline", children: error }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "rounded-md shadow-sm -space-y-px", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "email-address", className: "sr-only", children: "Email address" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: "email-address", name: "email", type: "email", autoComplete: "email", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Email address", value: email, onChange: (e) => setEmail(e.target.value) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "password", className: "sr-only", children: "Password" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center justify-between", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-sm", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_3__/* .Link */ .N_, { to: "/forgot-password", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Forgot your password?" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50", children: loading ? 'Signing in...' : 'Sign in' }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-sm text-center", children: ["Don't have an account?", ' ', (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_3__/* .Link */ .N_, { to: "/register", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Sign up" })] })] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LoginPage);


/***/ })

}]);
//# sourceMappingURL=8139.chunk.js.map