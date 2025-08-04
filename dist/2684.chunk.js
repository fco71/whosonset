"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[2684],{

/***/ 232:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ ArrowLeft)
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
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("arrow-left", __iconNode);


//# sourceMappingURL=arrow-left.js.map


/***/ }),

/***/ 2684:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4976);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(232);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3954);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7504);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9869);




const ContactPage = () => {
    const [formData, setFormData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const [submitStatus, setSubmitStatus] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('idle');
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        try {
            // Simulate form submission - in production, this would send to your backend
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }
        catch (error) {
            setSubmitStatus('error');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50 py-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mb-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .Link */ .N_, { to: "/", className: "inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A, { className: "w-4 h-4 mr-2" }), "Back to My Film Jobs"] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Contact Us" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mt-2", children: "Get in touch with our team" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white shadow rounded-lg p-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-2xl font-semibold text-gray-900 mb-6", children: "Get in Touch" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start space-x-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .A, { className: "w-6 h-6 text-indigo-600" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Email" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "iam@myfilmjobs.com" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "We'll respond within 24 hours" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start space-x-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .A, { className: "w-6 h-6 text-indigo-600" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Support" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "Technical issues and account help" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "Available Monday - Friday, 9AM - 6PM" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-start space-x-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-shrink-0", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, { className: "w-6 h-6 text-indigo-600" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Business Inquiries" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "Partnerships and business opportunities" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500 mt-1", children: "For enterprise and collaboration inquiries" })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mt-8 pt-6 border-t border-gray-200", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Frequently Asked Questions" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "font-medium text-gray-900", children: "How do I reset my password?" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Use the \"Forgot Password\" link on the login page." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "font-medium text-gray-900", children: "How do I update my profile?" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Go to your profile page and click \"Edit Profile\"." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h4", { className: "font-medium text-gray-900", children: "How do I delete my account?" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600", children: "Contact us directly and we'll help you with account deletion." })] })] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white shadow rounded-lg p-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-2xl font-semibold text-gray-900 mb-6", children: "Send us a Message" }), submitStatus === 'success' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mb-6 p-4 bg-green-50 border border-green-200 rounded-md", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-green-800", children: "Thank you! Your message has been sent successfully." }) })), submitStatus === 'error' && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-md", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-red-800", children: "Sorry, there was an error sending your message. Please try again." }) })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-2", children: "Name *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", id: "name", name: "name", required: true, value: formData.name, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", placeholder: "Your full name" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "email", id: "email", name: "email", required: true, value: formData.email, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", placeholder: "your.email@example.com" })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "subject", className: "block text-sm font-medium text-gray-700 mb-2", children: "Subject *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("select", { id: "subject", name: "subject", required: true, value: formData.subject, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "", children: "Select a subject" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "general", children: "General Inquiry" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "technical", children: "Technical Support" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "account", children: "Account Issues" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "business", children: "Business Partnership" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "feedback", children: "Feedback" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", { value: "other", children: "Other" })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-2", children: "Message *" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("textarea", { id: "message", name: "message", required: true, rows: 6, value: formData.message, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", placeholder: "Tell us how we can help you..." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? 'Sending...' : 'Send Message' })] })] })] })] }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContactPage);


/***/ }),

/***/ 7504:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ MessageSquare)
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
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("message-square", __iconNode);


//# sourceMappingURL=message-square.js.map


/***/ }),

/***/ 9869:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Phone)
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
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("phone", __iconNode);


//# sourceMappingURL=phone.js.map


/***/ })

}]);
//# sourceMappingURL=2684.chunk.js.map