"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[3398],{

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

/***/ 3549:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ FileUploadService)
/* harmony export */ });
/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2539);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9487);


class FileUploadService {
    static validateFile(file, type) {
        // Check file size
        if (file.size > this.MAX_FILE_SIZE) {
            return {
                isValid: false,
                error: `File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`
            };
        }
        // Check file type
        const allowedExtensions = this.ALLOWED_TYPES[type];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return {
                isValid: false,
                error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`
            };
        }
        return { isValid: true };
    }
    static async uploadFile(file, userId, type, applicationId) {
        try {
            // Validate file
            const validation = this.validateFile(file, type);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }
            // Create unique filename
            const timestamp = Date.now();
            const fileExtension = file.name.split('.').pop();
            const fileName = `${type}_${timestamp}.${fileExtension}`;
            // Create storage path
            const storagePath = applicationId
                ? `applications/${applicationId}/${type}/${fileName}`
                : `users/${userId}/${type}/${fileName}`;
            const storageRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_0__/* .ref */ .KR)(_firebase__WEBPACK_IMPORTED_MODULE_1__/* .storage */ .IG, storagePath);
            // Upload file
            const snapshot = await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_0__/* .uploadBytes */ .D)(storageRef, file);
            const downloadURL = await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_0__/* .getDownloadURL */ .qk)(snapshot.ref);
            // Create file record
            const uploadedFile = {
                id: snapshot.ref.name,
                name: file.name,
                url: downloadURL,
                size: file.size,
                type: file.type,
                uploadedAt: new Date()
            };
            console.log(`[FileUploadService] File uploaded successfully: ${uploadedFile.name}`);
            return uploadedFile;
        }
        catch (error) {
            console.error('[FileUploadService] Error uploading file:', error);
            throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static async uploadMultipleFiles(files, userId, type, applicationId) {
        try {
            const uploadPromises = files.map(file => this.uploadFile(file, userId, type, applicationId));
            const uploadedFiles = await Promise.all(uploadPromises);
            console.log(`[FileUploadService] ${uploadedFiles.length} files uploaded successfully`);
            return uploadedFiles;
        }
        catch (error) {
            console.error('[FileUploadService] Error uploading multiple files:', error);
            throw new Error(`Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static async deleteFile(filePath) {
        try {
            const fileRef = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_0__/* .ref */ .KR)(_firebase__WEBPACK_IMPORTED_MODULE_1__/* .storage */ .IG, filePath);
            await (0,firebase_storage__WEBPACK_IMPORTED_MODULE_0__/* .deleteObject */ .XR)(fileRef);
            console.log(`[FileUploadService] File deleted successfully: ${filePath}`);
        }
        catch (error) {
            console.error('[FileUploadService] Error deleting file:', error);
            throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static async deleteApplicationFiles(applicationId) {
        try {
            // This would require listing files in the application folder
            // For now, we'll implement a simple deletion based on known file paths
            console.log(`[FileUploadService] Deleting files for application: ${applicationId}`);
            // In a full implementation, you would:
            // 1. List all files in the application folder
            // 2. Delete each file individually
            // 3. Handle errors gracefully
        }
        catch (error) {
            console.error('[FileUploadService] Error deleting application files:', error);
            throw new Error(`Failed to delete application files: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    static formatFileSize(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    static getFileIcon(fileName) {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return '🖼️';
            default:
                return '📎';
        }
    }
    static isImageFile(fileName) {
        const extension = fileName.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
    }
    static async getFilePreview(file) {
        if (this.isImageFile(file.name)) {
            return file.url;
        }
        // For PDFs, you could implement a PDF preview service
        // For now, return null for non-image files
        return null;
    }
}
FileUploadService.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
FileUploadService.ALLOWED_TYPES = {
    resume: ['.pdf', '.doc', '.docx'],
    attachments: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif']
};


/***/ }),

/***/ 3797:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7767);
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7594);
/* harmony import */ var _firebase__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9487);
/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2584);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(888);
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(774);
/* harmony import */ var _ui_Card__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(4948);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(180);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(7504);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(7775);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(8686);










const ApplicationMessaging = ({ applicationId, onClose, isModal = false }) => {
    const navigate = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__/* .useNavigate */ .Zp)();
    const { currentUser } = (0,_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_5__/* .useAuth */ .A)();
    const [application, setApplication] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [job, setJob] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [applicantProfile, setApplicantProfile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [messages, setMessages] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);
    const [newMessage, setNewMessage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('');
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const [isSendingMessage, setIsSendingMessage] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const messagesEndRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        if (applicationId) {
            loadApplicationDetails();
            subscribeToMessages();
        }
    }, [applicationId]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const loadApplicationDetails = async () => {
        try {
            setIsLoading(true);
            // Load application details
            const applicationDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'jobApplications', applicationId));
            if (applicationDoc.exists()) {
                const applicationData = {
                    id: applicationDoc.id,
                    ...applicationDoc.data()
                };
                setApplication(applicationData);
                // Load job details
                const jobDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'jobPostings', applicationData.jobId));
                if (jobDoc.exists()) {
                    setJob({
                        id: jobDoc.id,
                        ...jobDoc.data()
                    });
                }
                // Load applicant profile
                try {
                    const profileQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'crewProfiles'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .where */ ._M)('uid', '==', applicationData.applicantId));
                    const profileSnapshot = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .getDocs */ .GG)(profileQuery);
                    if (!profileSnapshot.empty) {
                        const profileData = profileSnapshot.docs[0].data();
                        setApplicantProfile({
                            uid: profileData.uid || applicationData.applicantId,
                            name: profileData.name || 'Unknown Applicant',
                            username: profileData.username || profileData.name?.toLowerCase().replace(/\s+/g, '') || 'unknown',
                            bio: profileData.bio || '',
                            jobTitles: profileData.jobTitles || [],
                            experience: profileData.experience || 'Not specified',
                            location: profileData.location || 'Not specified',
                            skills: profileData.skills || [],
                            availability: profileData.availability || 'Not specified',
                            phone: profileData.phone,
                            email: profileData.email
                        });
                    }
                    else {
                        setApplicantProfile({
                            uid: applicationData.applicantId,
                            name: 'Unknown Applicant',
                            username: 'unknown',
                            bio: 'Profile not available',
                            jobTitles: [],
                            experience: 'Not specified',
                            location: 'Not specified',
                            skills: [],
                            availability: 'Not specified'
                        });
                    }
                }
                catch (error) {
                    console.error('Error loading applicant profile:', error);
                    setApplicantProfile({
                        uid: applicationData.applicantId,
                        name: 'Unknown Applicant',
                        username: 'unknown',
                        bio: 'Profile not available',
                        jobTitles: [],
                        experience: 'Not specified',
                        location: 'Not specified',
                        skills: [],
                        availability: 'Not specified'
                    });
                }
            }
        }
        catch (error) {
            console.error('Error loading application details:', error);
            react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('Failed to load application details');
        }
        finally {
            setIsLoading(false);
        }
    };
    const subscribeToMessages = () => {
        const messagesQuery = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .query */ .P)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'jobApplications', applicationId, 'messages'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .orderBy */ .My)('timestamp', 'asc'), (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .limit */ .AB)(100));
        const unsubscribe = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .onSnapshot */ .aQ)(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messagesData);
        });
        return unsubscribe;
    };
    const sendMessage = async () => {
        if (!newMessage.trim() || !application || !currentUser)
            return;
        // Defensive: ensure applicationId is a string and matches parent
        if (!applicationId || typeof applicationId !== 'string') {
            react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('Invalid application ID');
            console.error('Invalid applicationId:', applicationId);
            return;
        }
        if (!currentUser.uid) {
            react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('User not authenticated');
            console.error('No currentUser.uid');
            return;
        }
        // Check parent document existence
        try {
            const parentDoc = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.getDoc)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'jobApplications', applicationId));
            if (!parentDoc.exists()) {
                react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('Application does not exist. Cannot send message.');
                console.error('Parent jobApplications doc does not exist:', applicationId);
                return;
            }
        }
        catch (err) {
            react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('Error checking application existence');
            console.error('Error checking parent doc existence:', err);
            return;
        }
        const messageData = {
            senderId: currentUser.uid,
            senderName: currentUser.displayName || currentUser.email || 'Unknown User',
            message: newMessage.trim(),
            timestamp: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .serverTimestamp */ .O5)(),
            applicationId: applicationId,
            read: false
        };
        try {
            console.log('Attempting to send message:', messageData);
            await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'jobApplications', applicationId, 'messages'), messageData);
            // Create notification for the recipient
            const jobPostingRef = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.doc)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'jobPostings', application.jobId);
            const jobPostingSnap = await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__.getDoc)(jobPostingRef);
            const jobPosting = jobPostingSnap.data();
            // Determine recipient: if sender is applicant, recipient is job poster; else recipient is applicant
            const recipientId = currentUser.uid === application.applicantId ? jobPosting?.postedById : application.applicantId;
            if (recipientId) {
                await (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .addDoc */ .gS)((0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .collection */ .rJ)(_firebase__WEBPACK_IMPORTED_MODULE_4__.db, 'users', recipientId, 'notifications'), {
                    type: 'application_message',
                    message: `New message from ${currentUser.displayName || currentUser.email} regarding job application`,
                    timestamp: (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_3__/* .serverTimestamp */ .O5)(),
                    read: false,
                    userId: recipientId,
                    relatedId: applicationId,
                    applicationId: applicationId,
                    senderId: currentUser.uid,
                    extra: {
                        applicationId: applicationId,
                        senderName: currentUser.displayName || currentUser.email
                    }
                });
            }
            setNewMessage('');
            react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.success('Message sent successfully!');
        }
        catch (error) {
            console.error('Error sending message:', error, '\nMessage data:', messageData, '\napplicationId:', applicationId, '\ncurrentUser:', currentUser);
            react_hot_toast__WEBPACK_IMPORTED_MODULE_6__/* .toast */ .oR.error('Failed to send message. Please try again.');
        }
        finally {
            setIsSendingMessage(false);
        }
    };
    const formatDate = (date) => {
        if (!date)
            return 'N/A';
        const dateObj = date.toDate ? date.toDate() : new Date(date);
        return dateObj.toLocaleString();
    };
    const isCurrentUser = (senderId) => {
        return senderId === currentUser?.uid;
    };
    if (isLoading) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center justify-center p-8", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600", children: "Loading messages..." })] }) }));
    }
    if (!application || !job) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center p-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\u274C" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Application Not Found" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mb-4", children: "The application you're looking for doesn't exist." }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_7__/* .Button */ .$, { onClick: () => navigate('/applications'), children: "Back to Applications" })] }));
    }
    const content = ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex flex-col h-full", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex items-center gap-3", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .A, { className: "w-5 h-5 text-blue-600" }) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "font-semibold text-gray-900", children: applicantProfile?.name || 'Unknown Applicant' }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", { className: "text-sm text-gray-600", children: [job.title, " \u2022 ", job.department] })] })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex items-center gap-2", children: isModal && onClose && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_7__/* .Button */ .$, { variant: "outline", size: "sm", onClick: onClose, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A, { className: "w-4 h-4" }) })) })] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0", children: messages.length === 0 ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "text-center py-8", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .A, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-gray-600 mb-2", children: "No messages yet" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: "text-sm text-gray-500", children: "Start a conversation about this application" })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "space-y-3", children: [messages.map((message) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: `flex ${isCurrentUser(message.senderId) ? 'justify-end' : 'justify-start'}`, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isCurrentUser(message.senderId)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'}`, children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `text-xs mb-1 ${isCurrentUser(message.senderId) ? 'text-blue-100' : 'text-gray-500'}`, children: [message.senderName, " \u2022 ", formatDate(message.timestamp)] }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "text-sm whitespace-pre-wrap", children: message.message })] }) }, message.id))), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: messagesEndRef })] })) }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "p-4 border-t border-gray-200 bg-white rounded-b-lg", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: "flex gap-2", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { type: "text", className: "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all", placeholder: "Type a message...", value: newMessage, onChange: (e) => setNewMessage(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter' && !e.shiftKey)
                                sendMessage(); }, disabled: isSendingMessage }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_7__/* .Button */ .$, { onClick: sendMessage, disabled: isSendingMessage || !newMessage.trim(), className: "px-4 py-2", children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A, { className: "w-4 h-4" }) })] }) })] }));
    if (isModal) {
        return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden", onClick: onClose, children: (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "bg-white rounded-xl max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden", onClick: (e) => e.stopPropagation(), children: content }) }));
    }
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_ui_Card__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Ay, { className: "h-[600px] flex flex-col overflow-hidden", children: content }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ApplicationMessaging);


/***/ }),

/***/ 4948:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ay: () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   BT: () => (/* binding */ CardDescription),
/* harmony export */   ZB: () => (/* binding */ CardTitle),
/* harmony export */   aR: () => (/* binding */ CardHeader),
/* harmony export */   bw: () => (/* binding */ CardBody),
/* harmony export */   wL: () => (/* binding */ CardFooter)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7106);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4164);




const Card = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ variant = 'elevated', hoverable = false, rounded = 'lg', shadow = 'md', padding = 'md', className = '', children, ...props }, ref) => {
    // Base card classes
    const baseClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(
    // Base styles
    'transition-all duration-200', 'overflow-hidden', 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2', 
    // Variant styles
    variant === 'elevated' && 'bg-white border border-gray-100', variant === 'outline' && 'bg-white border border-gray-200', variant === 'filled' && 'bg-gray-50', variant === 'unstyled' && 'bg-transparent', 
    // Shadow
    shadow === 'sm' && 'shadow-sm', shadow === 'md' && 'shadow', shadow === 'lg' && 'shadow-md', shadow === 'xl' && 'shadow-lg', shadow === '2xl' && 'shadow-xl', shadow === 'inner' && 'shadow-inner', 
    // Rounded corners
    rounded === 'sm' && 'rounded-sm', rounded === 'md' && 'rounded', rounded === 'lg' && 'rounded-lg', rounded === 'xl' && 'rounded-xl', rounded === '2xl' && 'rounded-2xl', rounded === 'full' && 'rounded-full', 
    // Padding
    padding === 'sm' && 'p-3', padding === 'md' && 'p-4', padding === 'lg' && 'p-6', 
    // Hover effects
    hoverable && [
        'hover:shadow-lg',
        'hover:-translate-y-0.5',
        'transform transition-transform duration-200',
        'hover:ring-2 hover:ring-blue-100',
    ], 
    // Custom class names
    className);
    // Animation variants with proper typing
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };
    // Hover animation
    const hoverAnimation = hoverable ? { scale: 1.01 } : {};
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(framer_motion__WEBPACK_IMPORTED_MODULE_2__/* .motion */ .P.div, { ref: ref, className: baseClasses, initial: "hidden", animate: "visible", whileHover: hoverAnimation, variants: variants, ...props, children: children }));
});
Card.displayName = 'Card';
const CardHeader = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', withBorder = true, children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('px-4 py-3', withBorder && 'border-b border-gray-100', className), ...props, children: children })));
CardHeader.displayName = 'CardHeader';
const CardBody = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', padding = 'md', children, ...props }, ref) => {
    const paddingClass = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    }[padding];
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)(paddingClass, className), ...props, children: children }));
});
CardBody.displayName = 'CardBody';
const CardFooter = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', withBorder = true, children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('px-4 py-3', withBorder && 'border-t border-gray-100', className), ...props, children: children })));
CardFooter.displayName = 'CardFooter';
const CardTitle = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ as: Tag = 'h3', className = '', children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Tag, { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('text-lg font-semibold text-gray-900', className), ...props, children: children })));
CardTitle.displayName = 'CardTitle';
const CardDescription = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ className = '', children, ...props }, ref) => ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { ref: ref, className: (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('text-sm text-gray-600 mt-1', className), ...props, children: children })));
CardDescription.displayName = 'CardDescription';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Card);


/***/ }),

/***/ 7775:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Send)
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
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("send", __iconNode);


//# sourceMappingURL=send.js.map


/***/ }),

/***/ 8117:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Paperclip)
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
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
];
const Paperclip = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("paperclip", __iconNode);


//# sourceMappingURL=paperclip.js.map


/***/ }),

/***/ 8309:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Download)
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
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)("download", __iconNode);


//# sourceMappingURL=download.js.map


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
//# sourceMappingURL=3398.chunk.js.map