"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[5862],{

/***/ 4221:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9487);


class EmailNotificationService {
    // Check if user can receive email based on preferences and frequency
    static async canSendEmail(userIdentifier, template) {
        try {
            // First check if user has email notifications enabled
            // Try to get user by ID first, then by email
            let userDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'users', userIdentifier));
            if (!userDoc.exists()) {
                // Try to find user by email
                const usersRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'users');
                const q = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .query */ .P)(usersRef, (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .where */ ._M)('email', '==', userIdentifier));
                const querySnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .getDocs */ .GG)(q);
                if (!querySnapshot.empty) {
                    userDoc = querySnapshot.docs[0];
                }
            }
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const notificationPreferences = userData.notificationPreferences;
                if (notificationPreferences) {
                    // Check if email notifications are enabled for this template
                    const emailEnabled = notificationPreferences.emailNotifications?.[template];
                    if (!emailEnabled) {
                        console.log(`[EmailNotificationService] Email notifications disabled for ${userIdentifier} (${template})`);
                        return false;
                    }
                    // Check frequency settings
                    const frequency = notificationPreferences.emailFrequency?.[template] || 'weekly';
                    const timeLimit = this.getTimeLimitForFrequency(frequency);
                    if (timeLimit === 0) {
                        // Immediate - always send
                        return true;
                    }
                    // Check last sent time
                    const emailTrackingRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'emailTracking', userIdentifier);
                    const emailTrackingDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)(emailTrackingRef);
                    if (!emailTrackingDoc.exists()) {
                        // First time sending email to this user
                        return true;
                    }
                    const data = emailTrackingDoc.data();
                    const lastSent = data[template]?.lastSent;
                    if (!lastSent) {
                        // First time sending this template to this user
                        return true;
                    }
                    const timeSinceLastEmail = Date.now() - lastSent.toMillis();
                    return timeSinceLastEmail >= timeLimit;
                }
            }
            // Fallback to weekly limit if no preferences found
            const emailTrackingRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'emailTracking', userIdentifier);
            const emailTrackingDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)(emailTrackingRef);
            if (!emailTrackingDoc.exists()) {
                return true;
            }
            const data = emailTrackingDoc.data();
            const lastSent = data[template]?.lastSent;
            if (!lastSent) {
                return true;
            }
            const timeSinceLastEmail = Date.now() - lastSent.toMillis();
            return timeSinceLastEmail >= this.WEEKLY_LIMIT_MS;
        }
        catch (error) {
            console.error('Error checking email limit:', error);
            // If there's an error checking, allow the email to be sent
            return true;
        }
    }
    // Get time limit in milliseconds for each frequency
    static getTimeLimitForFrequency(frequency) {
        switch (frequency) {
            case 'immediate':
                return 0; // No limit
            case 'daily':
                return 24 * 60 * 60 * 1000; // 24 hours
            case 'weekly':
                return 7 * 24 * 60 * 60 * 1000; // 7 days
            case 'monthly':
                return 30 * 24 * 60 * 60 * 1000; // 30 days
            default:
                return this.WEEKLY_LIMIT_MS; // Default to weekly
        }
    }
    // Update email tracking after sending
    static async updateEmailTracking(userEmail, template) {
        try {
            const emailTrackingRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_1__.db, 'emailTracking', userEmail);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__/* .updateDoc */ .mZ)(emailTrackingRef, {
                [template]: {
                    lastSent: new Date(),
                    count: (await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_0__.getDoc)(emailTrackingRef)).data()?.[template]?.count || 0 + 1
                }
            });
        }
        catch (error) {
            console.error('Error updating email tracking:', error);
        }
    }
    static async sendNotification(data) {
        try {
            console.log('[EmailNotificationService] Sending notification:', data);
            // Check frequency limit using userId if available, otherwise use email
            const userIdentifier = data.userId || data.to;
            const canSend = await this.canSendEmail(userIdentifier, data.template || 'general');
            if (!canSend) {
                console.log(`[EmailNotificationService] Frequency limit reached for ${data.to} (${data.template})`);
                return false;
            }
            const response = await fetch(this.EMAIL_FUNCTION_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: data.to,
                    subject: data.subject,
                    message: data.message,
                    senderName: data.senderName,
                }),
            });
            const result = await response.json();
            console.log('[EmailNotificationService] Response:', result);
            if (result.success) {
                // Update tracking after successful send
                await this.updateEmailTracking(data.to, data.template || 'general');
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error sending email notification:', error);
            return false;
        }
    }
    // Chat notification
    static async sendChatNotification(recipientEmail, senderName, messagePreview, conversationUrl, userId) {
        const subject = `New message from ${senderName}`;
        // Just send the message preview - the Firebase function will handle the email template
        const message = messagePreview;
        return this.sendNotification({
            to: recipientEmail,
            subject,
            message,
            senderName: senderName,
            template: 'chat',
            userId: userId
        });
    }
    // Project update notification
    static async sendProjectUpdateNotification(recipientEmail, projectName, updateType, projectUrl) {
        const actionText = {
            created: 'has been created',
            updated: 'has been updated',
            assigned: 'has been assigned to you',
            completed: 'has been completed'
        }[updateType];
        const subject = `Project Update: ${projectName}`;
        const message = `
Hello,

The project "${projectName}" ${actionText}.

${projectUrl ? `Click here to view the project: ${projectUrl}` : 'Log in to your My Film Jobs dashboard to view this project.'}

Best regards,
The My Film Jobs Team
    `;
        return this.sendNotification({
            to: recipientEmail,
            subject,
            message,
            senderName: 'My Film Jobs',
            template: 'project'
        });
    }
    // Job application notification
    static async sendJobApplicationNotification(recipientEmail, jobTitle, applicantName, applicationUrl) {
        const subject = `New job application for ${jobTitle}`;
        const message = `
Hello,

You have received a new job application for "${jobTitle}" from ${applicantName}.

${applicationUrl ? `Click here to view the application: ${applicationUrl}` : 'Log in to your My Film Jobs dashboard to review this application.'}

Best regards,
The My Film Jobs Team
    `;
        return this.sendNotification({
            to: recipientEmail,
            subject,
            message,
            senderName: 'My Film Jobs',
            template: 'job'
        });
    }
    // General notification
    static async sendGeneralNotification(recipientEmail, subject, message) {
        return this.sendNotification({
            to: recipientEmail,
            subject,
            message,
            senderName: 'My Film Jobs',
            template: 'general'
        });
    }
}
EmailNotificationService.EMAIL_FUNCTION_URL = 'https://us-central1-my-film-jobs.cloudfunctions.net/emailSend';
EmailNotificationService.WEEKLY_LIMIT_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EmailNotificationService);


/***/ }),

/***/ 5862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _utilities_emailNotificationService__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4221);



const EmailIntegrationTestPage = () => {
    const [testResults, setTestResults] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({});
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const runTest = async (testName, testFunction) => {
        setLoading(testName);
        try {
            const result = await testFunction();
            setTestResults(prev => ({
                ...prev,
                [testName]: { success: result, message: result ? 'SUCCESS' : 'FAILED' }
            }));
        }
        catch (error) {
            setTestResults(prev => ({
                ...prev,
                [testName]: { success: false, message: `ERROR: ${error}` }
            }));
        }
        finally {
            setLoading(null);
        }
    };
    const testChatNotification = async () => {
        return await _utilities_emailNotificationService__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.sendChatNotification('franciscoadolfo@gmail.com', 'Test User', 'This is a test message from the integration test page', 'http://localhost:8080/chat');
    };
    const testProjectNotification = async () => {
        return await _utilities_emailNotificationService__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.sendProjectUpdateNotification('franciscoadolfo@gmail.com', 'Test Project', 'created', 'http://localhost:8080/projects/test-project');
    };
    const testJobNotification = async () => {
        return await _utilities_emailNotificationService__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.sendJobApplicationNotification('franciscoadolfo@gmail.com', 'Test Job Position', 'Test Applicant', 'http://localhost:8080/applications/test-application');
    };
    const testGeneralNotification = async () => {
        return await _utilities_emailNotificationService__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.sendGeneralNotification('franciscoadolfo@gmail.com', 'Test General Notification', 'This is a test general notification from the integration test page.');
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "min-h-screen bg-gray-50 p-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "max-w-4xl mx-auto", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "bg-white rounded-lg shadow-md p-6", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "\uD83E\uDDEA Email Integration Test" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "mb-6", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "This page tests the email notification integration. Each test will send an email to franciscoadolfo@gmail.com." }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "1. Chat Notification Test" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-3", children: "Tests sending email notifications for new chat messages" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => runTest('chat', testChatNotification), disabled: loading === 'chat', className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50", children: loading === 'chat' ? 'Testing...' : 'Test Chat Notification' }), testResults.chat && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `mt-2 p-2 rounded ${testResults.chat.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: testResults.chat.message }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "2. Project Notification Test" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-3", children: "Tests sending email notifications for project creation" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => runTest('project', testProjectNotification), disabled: loading === 'project', className: "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50", children: loading === 'project' ? 'Testing...' : 'Test Project Notification' }), testResults.project && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `mt-2 p-2 rounded ${testResults.project.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: testResults.project.message }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "3. Job Application Notification Test" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-3", children: "Tests sending email notifications for job applications" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => runTest('job', testJobNotification), disabled: loading === 'job', className: "px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50", children: loading === 'job' ? 'Testing...' : 'Test Job Notification' }), testResults.job && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `mt-2 p-2 rounded ${testResults.job.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: testResults.job.message }))] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "4. General Notification Test" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-600 mb-3", children: "Tests sending general email notifications" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", { onClick: () => runTest('general', testGeneralNotification), disabled: loading === 'general', className: "px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50", children: loading === 'general' ? 'Testing...' : 'Test General Notification' }), testResults.general && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `mt-2 p-2 rounded ${testResults.general.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: testResults.general.message }))] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mt-8 p-4 bg-blue-50 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-blue-900 mb-2", children: "\uD83D\uDCE7 Test Results" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-blue-800", children: "Check your email inbox (franciscoadolfo@gmail.com) for test messages. Each successful test should send one email notification." })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "mt-6 p-4 bg-yellow-50 rounded-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "text-lg font-semibold text-yellow-900 mb-2", children: "\u26A0\uFE0F Important Notes" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("ul", { className: "text-sm text-yellow-800 space-y-1", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\u2022 This is for testing only - emails are sent to a real address" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\u2022 Each test sends exactly one email per trigger" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\u2022 Later we'll implement a weekly limit to prevent spam" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("li", { children: "\u2022 Check your email inbox for test messages" })] })] })] }) }) }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EmailIntegrationTestPage);


/***/ })

}]);
//# sourceMappingURL=5862.chunk.js.map