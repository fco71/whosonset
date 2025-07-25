"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[4008],{

/***/ 4008:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9487);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5788);
/* harmony import */ var _components_ProjectCard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1928);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2389);







const MyProjectsPage = () => {
    const { t } = (0,react_i18next__WEBPACK_IMPORTED_MODULE_5__/* .useTranslation */ .Bd)();
    const [projects, setProjects] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__/* .useNavigate */ .Zp)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            const user = _firebase__WEBPACK_IMPORTED_MODULE_3__/* .auth */ .j2.currentUser;
            if (!user) {
                setError(t('projects.mustBeLoggedIn'));
                setLoading(false);
                return;
            }
            try {
                const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_3__.db, 'Projects'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .where */ ._M)('owner_uid', '==', user.uid));
                const snapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .getDocs */ .GG)(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(data);
            }
            catch (err) {
                setError(t('projects.errorLoading'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [t]);
    const handleEdit = (projectId) => {
        navigate(`/edit-project/${projectId}`);
    };
    const handleDelete = async (projectId) => {
        if (!window.confirm(t('projects.confirmDelete')))
            return;
        try {
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__/* .deleteDoc */ .kd)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_3__.db, 'Projects', projectId));
            setProjects(projects => projects.filter(p => p.id !== projectId));
        }
        catch (err) {
            alert(t('projects.deleteFailed'));
        }
    };
    if (loading) {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen flex items-center justify-center", children: t('projects.loading') });
    }
    if (error) {
        return (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen flex items-center justify-center text-red-600", children: error });
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "min-h-screen bg-white", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "section-gradient border-b border-gray-100", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "container-base section-padding-large", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center mb-16 animate-fade", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "heading-primary mb-6 animate-slide", children: t('myProjects.title') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "heading-secondary mb-8 animate-slide", children: t('myProjects.subtitle') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "body-large max-w-2xl mx-auto animate-slide", children: t('myProjects.description') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mt-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => navigate('/projects/add'), className: "btn-primary", children: t('projects.createNewProject') }) })] }) }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "section-gray", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "container-base section-padding", children: projects.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-24 animate-fade", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-8xl mb-8 opacity-20 animate-bounce-slow", children: "\uD83C\uDFAC" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "heading-card mb-4", children: t('myProjects.noProjects') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "body-medium max-w-md mx-auto mb-8", children: t('myProjects.createFirst') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => navigate('/projects/add'), className: "btn-primary", children: t('projects.createNewProject') })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "grid-cards", children: projects.map((project, index) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { style: { animationDelay: `${index * 0.1}s` }, className: "relative group", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_components_ProjectCard__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, { id: project.id, projectName: project.projectName, productionCompany: project.productionCompany, country: project.country, productionLocations: project.productionLocations, status: project.status, summary: project.synopsis, director: project.director, producer: project.producer, coverImageUrl: project.coverImageUrl, genres: project.genres, showDetails: true }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => handleEdit(project.id), className: "btn-secondary px-3 py-1 text-xs", children: t('projects.edit') }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => handleDelete(project.id), className: "btn-danger px-3 py-1 text-xs", children: t('projects.delete') })] })] }, project.id))) })) }) })] }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyProjectsPage);


/***/ })

}]);
//# sourceMappingURL=4008.chunk.js.map