"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[6134],{

/***/ 6134:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_EditProfilePage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/esm/createLucideIcon.js + 3 modules
var createLucideIcon = __webpack_require__(9407);
;// ./node_modules/lucide-react/dist/esm/icons/loader-circle.js
/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = (0,createLucideIcon/* default */.A)("loader-circle", __iconNode);


//# sourceMappingURL=loader-circle.js.map

;// ./src/pages/EditProfilePage.tsx





// Lazy load the EditCrewProfile component to improve initial load performance
const EditCrewProfile = react.lazy(() => Promise.all(/* import() */[__webpack_require__.e(3833), __webpack_require__.e(5720), __webpack_require__.e(3542), __webpack_require__.e(7360)]).then(__webpack_require__.bind(__webpack_require__, 7360)));
const EditProfilePage = () => {
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const { t } = (0,es/* useTranslation */.Bd)();
    return ((0,jsx_runtime.jsxs)("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [(0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white mb-2", children: t('resume.page.title') }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 dark:text-gray-300", children: t('resume.page.description') })] }), (0,jsx_runtime.jsx)("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: (0,jsx_runtime.jsx)(react.Suspense, { fallback: (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-center h-64", children: [(0,jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-indigo-600" }), (0,jsx_runtime.jsx)("span", { className: "ml-2 text-gray-600 dark:text-gray-300", children: t('resume.builder.loadingBuilder') })] }), children: currentUser ? ((0,jsx_runtime.jsx)(EditCrewProfile, {})) : ((0,jsx_runtime.jsx)("div", { className: "text-center py-12", children: (0,jsx_runtime.jsx)("p", { className: "text-gray-600 dark:text-gray-300", children: t('resume.builder.signInRequired') }) })) }) })] }));
};
/* harmony default export */ const pages_EditProfilePage = (EditProfilePage);


/***/ })

}]);
//# sourceMappingURL=6134.chunk.js.map