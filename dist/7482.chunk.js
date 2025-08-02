"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[7482],{

/***/ 7482:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7767);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2584);
/* harmony import */ var _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6093);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(888);






const EditJobApplication = () => {
    const { applicationId } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .useParams */ .g)();
    const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .useNavigate */ .Zp)();
    const { currentUser } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_3__/* .useAuth */ .A)();
    const [application, setApplication] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [isSubmitting, setIsSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [formData, setFormData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        coverLetter: '',
        expectedSalary: undefined,
        availabilityDate: '',
        notes: ''
    });
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (applicationId) {
            loadApplication();
        }
    }, [applicationId]);
    const loadApplication = async () => {
        try {
            setIsLoading(true);
            const app = await _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_4__/* .JobApplicationService */ .l.getApplication(applicationId);
            if (!app) {
                setError('Application not found');
                return;
            }
            // Check if user owns this application
            if (app.applicantId !== currentUser?.uid) {
                setError('You can only edit your own applications');
                return;
            }
            setApplication(app);
            setFormData({
                coverLetter: app.coverLetter || '',
                expectedSalary: app.expectedSalary,
                availabilityDate: app.availabilityDate || '',
                notes: app.notes || ''
            });
        }
        catch (error) {
            console.error('Error loading application:', error);
            setError('Failed to load application');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!application || !currentUser)
            return;
        try {
            setIsSubmitting(true);
            setError(null);
            await _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_4__/* .JobApplicationService */ .l.updateApplication(applicationId, {
                coverLetter: formData.coverLetter,
                expectedSalary: formData.expectedSalary,
                availabilityDate: formData.availabilityDate,
                notes: formData.notes
            });
            react_hot_toast__WEBPACK_IMPORTED_MODULE_5__/* .toast */ .oR.success('Application updated successfully');
            navigate('/applications');
        }
        catch (error) {
            console.error('Error updating application:', error);
            setError('Failed to update application');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async () => {
        if (!application || !currentUser)
            return;
        if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
            return;
        }
        try {
            setIsSubmitting(true);
            setError(null);
            await _utilities_jobApplicationService__WEBPACK_IMPORTED_MODULE_4__/* .JobApplicationService */ .l.deleteApplication(applicationId);
            react_hot_toast__WEBPACK_IMPORTED_MODULE_5__/* .toast */ .oR.success('Application withdrawn successfully');
            navigate('/applications');
        }
        catch (error) {
            console.error('Error deleting application:', error);
            setError('Failed to withdraw application');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (isLoading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading application..." })] }) }));
    }
    if (error || !application) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\u274C" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Error" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mb-4", children: error || 'Application not found' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => navigate('/applications'), className: "px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "Back to Applications" })] }) }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-4xl mx-auto px-8 py-16", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => navigate('/applications'), className: "flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4", children: "\u2190 Back to Applications" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-light text-gray-900", children: "Edit Application" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mt-2", children: "Update your job application details" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-xl font-light text-gray-900 mb-4", children: "Application Details" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-500", children: "Status:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: `ml-2 px-2 py-1 rounded-full text-xs font-medium ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                    application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'}`, children: application.status.replace('_', ' ') })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-500", children: "Applied:" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-2", children: application.appliedAt?.toDate ?
                                                application.appliedAt.toDate().toLocaleDateString() :
                                                'N/A' })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, className: "bg-white rounded-xl shadow-sm border border-gray-100 p-8", children: [error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-800", children: error }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Cover Letter" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { value: formData.coverLetter, onChange: (e) => handleInputChange('coverLetter', e.target.value), placeholder: "Tell us why you're interested in this position and why you'd be a great fit...", className: "w-full h-48 p-4 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none font-light" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 mt-2", children: "Recommended: 300-500 words" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Expected Salary (Optional)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-500", children: "$" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "number", value: formData.expectedSalary || '', onChange: (e) => handleInputChange('expectedSalary', e.target.value ? parseInt(e.target.value) : undefined), placeholder: "e.g., 75000", className: "flex-1 p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none font-light", min: "0" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "text-gray-500", children: "per year" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "When are you available to start?" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "date", value: formData.availabilityDate, onChange: (e) => handleInputChange('availabilityDate', e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none font-light" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Additional Notes (Optional)" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { value: formData.notes, onChange: (e) => handleInputChange('notes', e.target.value), placeholder: "Any additional information you'd like to share...", className: "w-full h-24 p-4 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none font-light" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", disabled: isSubmitting, className: "flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50", children: isSubmitting ? 'Updating...' : 'Update Application' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "button", onClick: handleDelete, disabled: isSubmitting, className: "px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50", children: isSubmitting ? 'Withdrawing...' : 'Withdraw Application' })] })] })] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EditJobApplication);


/***/ })

}]);
//# sourceMappingURL=7482.chunk.js.map