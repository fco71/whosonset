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
    const { login, loginWithGoogle } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__/* .useAuth */ .A)();
    const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .useNavigate */ .Zp)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            // Check if email is verified
            const { currentUser } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_4__/* .useAuth */ .A)();
            if (currentUser && !currentUser.emailVerified) {
                navigate('/verify-email');
            }
            else {
                navigate('/');
            }
        }
        catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address');
            }
            else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            }
            else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            }
            else {
                setError('Failed to log in. Please try again.');
            }
            console.error(err);
        }
        setLoading(false);
    };
    const handleGoogleSignIn = async () => {
        if (loading)
            return;
        setLoading(true);
        setError('');
        try {
            const { isNewUser } = await loginWithGoogle();
            // For login page, always go to home (existing users)
            // New users would typically come from register page
            navigate('/');
        }
        catch (error) {
            console.error('Google sign-in error:', error);
            setError(error.code === 'auth/popup-closed-by-user'
                ? 'Sign-in was cancelled. Please try again.'
                : error.code === 'auth/popup-blocked'
                    ? 'Sign-in popup was blocked. Please allow popups and try again.'
                    : error.message && error.message.includes('not enabled')
                        ? 'Google sign-in is not enabled. Please contact support.'
                        : 'Google sign-in failed. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-md w-full space-y-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Sign in to your account" }) }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative", role: "alert", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "block sm:inline", children: error }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "space-y-3", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", { type: "button", onClick: handleGoogleSignIn, disabled: loading, className: "w-full bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 py-3 flex items-center justify-center space-x-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { children: loading ? 'Signing in...' : 'Continue with Google' })] }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "relative", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute inset-0 flex items-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-full border-t border-gray-300" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "relative flex justify-center text-sm", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "px-2 bg-gray-50 text-gray-500", children: "or" }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "rounded-md shadow-sm -space-y-px", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "email-address", className: "sr-only", children: "Email address" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: "email-address", name: "email", type: "email", autoComplete: "email", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Email address", value: email, onChange: (e) => setEmail(e.target.value) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "password", className: "sr-only", children: "Password" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center justify-between", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-sm", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_3__/* .Link */ .N_, { to: "/forgot-password", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Forgot your password?" }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50", children: loading ? 'Signing in...' : 'Sign in' }) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-sm text-center", children: ["Don't have an account?", ' ', (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_router_dom__WEBPACK_IMPORTED_MODULE_3__/* .Link */ .N_, { to: "/register", className: "font-medium text-indigo-600 hover:text-indigo-500", children: "Sign up" })] })] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LoginPage);


/***/ })

}]);
//# sourceMappingURL=8139.chunk.js.map