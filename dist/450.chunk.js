"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[450],{

/***/ 9450:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ JobSearch_JobApplicationForm)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./src/utilities/jobApplicationService.ts
var jobApplicationService = __webpack_require__(6093);
// EXTERNAL MODULE: ./node_modules/firebase/storage/dist/esm/index.esm.js + 1 modules
var esm_index_esm = __webpack_require__(2539);
;// ./src/utilities/fileUploadService.ts


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
            const storageRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, storagePath);
            // Upload file
            const snapshot = await (0,esm_index_esm/* uploadBytes */.D)(storageRef, file);
            const downloadURL = await (0,esm_index_esm/* getDownloadURL */.qk)(snapshot.ref);
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
            const fileRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, filePath);
            await (0,esm_index_esm/* deleteObject */.XR)(fileRef);
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

;// ./src/components/JobSearch/JobApplicationForm.tsx








const JobApplicationForm = () => {
    const { jobId } = (0,chunk_QMGIS6GS/* useParams */.g)();
    const navigate = (0,chunk_QMGIS6GS/* useNavigate */.Zp)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const [job, setJob] = (0,react.useState)(null);
    const [isLoading, setIsLoading] = (0,react.useState)(true);
    const [isSubmitting, setIsSubmitting] = (0,react.useState)(false);
    const [error, setError] = (0,react.useState)(null);
    const [success, setSuccess] = (0,react.useState)(false);
    const [formData, setFormData] = (0,react.useState)({
        coverLetter: '',
        expectedSalary: undefined,
        availabilityDate: '',
        notes: '',
        resumeFile: null,
        resumeUploaded: null,
        attachments: [],
        attachmentsUploaded: []
    });
    (0,react.useEffect)(() => {
        if (jobId) {
            loadJobDetails();
        }
    }, [jobId]);
    const loadJobDetails = async () => {
        try {
            setIsLoading(true);
            const jobDoc = await (0,index_esm.getDoc)((0,index_esm.doc)(firebase.db, 'jobPostings', jobId));
            if (jobDoc.exists()) {
                setJob({
                    id: jobDoc.id,
                    ...jobDoc.data()
                });
            }
            else {
                setError('Job not found');
            }
        }
        catch (error) {
            console.error('Error loading job details:', error);
            setError('Failed to load job details');
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
    const handleFileUpload = (files) => {
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };
    const validateForm = () => {
        // All fields are now optional - just check if user is authenticated
        if (!currentUser) {
            setError('You must be logged in to apply');
            return false;
        }
        return true;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || !job)
            return;
        try {
            setIsSubmitting(true);
            setError(null);
            if (!currentUser) {
                setError('You must be logged in to apply');
                return;
            }
            const userId = currentUser.uid;
            // Upload resume if not already uploaded
            let resumeId = formData.resumeUploaded?.id;
            if (formData.resumeFile && !resumeId) {
                const uploadedResume = await FileUploadService.uploadFile(formData.resumeFile, userId, 'resume');
                resumeId = uploadedResume.id;
            }
            // Upload attachments
            const uploadedAttachments = [];
            if (formData.attachments.length > 0) {
                const uploadedFiles = await FileUploadService.uploadMultipleFiles(formData.attachments, userId, 'attachments');
                uploadedAttachments.push(...uploadedFiles);
            }
            // Add previously uploaded attachments
            uploadedAttachments.push(...formData.attachmentsUploaded);
            const applicationData = {
                jobId: job.id,
                applicantId: userId,
                projectId: job.projectId || '', // Handle case where projectId is undefined
                status: 'pending',
                coverLetter: formData.coverLetter || '',
                expectedSalary: formData.expectedSalary,
                availabilityDate: formData.availabilityDate || '',
                notes: formData.notes || '',
                resumeId: resumeId || '',
                attachments: (formData.attachmentsUploaded || []).map(file => ({
                    id: file.id,
                    name: file.name,
                    url: file.url,
                    type: 'other',
                    size: file.size,
                    uploadedAt: file.uploadedAt
                }))
            };
            const applicationId = await jobApplicationService/* JobApplicationService */.l.submitApplication(applicationData);
            setSuccess(true);
            // Redirect to success page after a short delay
            setTimeout(() => {
                navigate(`/applications/${applicationId}/success`);
            }, 2000);
        }
        catch (error) {
            console.error('Error submitting application:', error);
            setError('Failed to submit application. Please try again.');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (!currentUser) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\uD83D\uDD12" }), (0,jsx_runtime.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Authentication Required" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "Please log in to apply for this job." }), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/login'), className: "px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors", children: "Go to Login" })] }) }));
    }
    if (isLoading) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), (0,jsx_runtime.jsx)("p", { className: "text-lg font-light text-gray-600", children: "Loading job details..." })] }) }));
    }
    if (error && !job) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4 opacity-20", children: "\u274C" }), (0,jsx_runtime.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Error" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: error }), (0,jsx_runtime.jsx)("button", { onClick: () => navigate('/jobs'), className: "px-6 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors", children: "Back to Jobs" })] }) }));
    }
    if (success) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-6xl mb-4", children: "\u2705" }), (0,jsx_runtime.jsx)("h2", { className: "text-2xl font-light text-gray-900 mb-2", children: "Application Submitted!" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-4", children: "Your application has been successfully submitted." }), (0,jsx_runtime.jsx)("div", { className: "animate-pulse", children: (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Redirecting to confirmation page..." }) })] }) }));
    }
    return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-8 py-16", children: [(0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors", children: "\u2190 Back to Job" }), (0,jsx_runtime.jsxs)("h1", { className: "text-3xl font-light text-gray-900 mb-2", children: ["Apply for ", job?.title] }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Complete your application for this position" })] }), job && ((0,jsx_runtime.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-start justify-between mb-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-light text-gray-900 mb-2", children: job.title }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-600 mb-1", children: [job.department, " \u2022 ", job.location] }), job.salary && ((0,jsx_runtime.jsxs)("p", { className: "text-gray-600", children: ["$", job.salary.min.toLocaleString(), " - $", job.salary.max.toLocaleString()] }))] }), job.isUrgent && ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full", children: "Urgent" }))] }), (0,jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: (job.tags || []).slice(0, 5).map(tag => ((0,jsx_runtime.jsx)("span", { className: "px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full", children: tag }, tag))) })] })), (0,jsx_runtime.jsxs)("form", { onSubmit: handleSubmit, className: "bg-white rounded-xl shadow-sm border border-gray-100 p-8", children: [error && ((0,jsx_runtime.jsx)("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg", children: (0,jsx_runtime.jsx)("p", { className: "text-red-800", children: error }) })), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Cover Letter (Optional)" }), (0,jsx_runtime.jsx)("textarea", { value: formData.coverLetter, onChange: (e) => handleInputChange('coverLetter', e.target.value), placeholder: "Tell us why you're interested in this position and why you'd be a great fit... (optional)", className: "w-full h-48 p-4 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none font-light" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500 mt-2", children: "Optional: 300-500 words recommended if provided." })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Expected Salary (Optional)" }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("span", { className: "text-gray-500", children: "$" }), (0,jsx_runtime.jsx)("input", { type: "number", value: formData.expectedSalary || '', onChange: (e) => handleInputChange('expectedSalary', e.target.value ? parseInt(e.target.value) : undefined), placeholder: "e.g., 75000", className: "flex-1 p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none font-light", min: "0" }), (0,jsx_runtime.jsx)("span", { className: "text-gray-500", children: "per year" })] }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500 mt-2", children: "This helps us understand your salary expectations" })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "When are you available to start? (Optional)" }), (0,jsx_runtime.jsx)("input", { type: "date", value: formData.availabilityDate, onChange: (e) => handleInputChange('availabilityDate', e.target.value), className: "w-full p-3 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none font-light" })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Resume (Optional)" }), (0,jsx_runtime.jsxs)("div", { className: "border-2 border-dashed border-gray-200 rounded-lg p-6 text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-4xl mb-4 opacity-20", children: "\uD83D\uDCC4" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-2", children: "Upload your resume (optional)" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "PDF, DOC, or DOCX (max 5MB)" }), (0,jsx_runtime.jsx)("input", { type: "file", accept: ".pdf,.doc,.docx", onChange: (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleInputChange('resumeFile', file);
                                                }
                                            }, className: "mt-4" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Additional Attachments (Optional)" }), (0,jsx_runtime.jsxs)("div", { className: "border-2 border-dashed border-gray-200 rounded-lg p-6 text-center", children: [(0,jsx_runtime.jsx)("div", { className: "text-4xl mb-4 opacity-20", children: "\uD83D\uDCCE" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-600 mb-2", children: "Upload portfolio, references, or other documents" }), (0,jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "PDF, DOC, DOCX, or images (max 10MB each)" }), (0,jsx_runtime.jsx)("input", { type: "file", multiple: true, accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png", onChange: (e) => {
                                                const files = Array.from(e.target.files || []);
                                                handleFileUpload(files);
                                            }, className: "mt-4" })] }), formData.attachments.length > 0 && ((0,jsx_runtime.jsxs)("div", { className: "mt-4", children: [(0,jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Selected files:" }), (0,jsx_runtime.jsx)("div", { className: "space-y-2", children: formData.attachments.map((file, index) => ((0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [(0,jsx_runtime.jsx)("span", { className: "text-sm text-gray-700", children: file.name }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: () => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                attachments: prev.attachments.filter((_, i) => i !== index)
                                                            }));
                                                        }, className: "text-red-600 hover:text-red-800", children: "Remove" })] }, index))) })] }))] }), (0,jsx_runtime.jsxs)("div", { className: "mb-8", children: [(0,jsx_runtime.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Additional Notes (Optional)" }), (0,jsx_runtime.jsx)("textarea", { value: formData.notes, onChange: (e) => handleInputChange('notes', e.target.value), placeholder: "Any additional information you'd like to share...", className: "w-full h-24 p-4 border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none font-light" })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center justify-between pt-6 border-t border-gray-100", children: [(0,jsx_runtime.jsx)("button", { type: "button", onClick: () => navigate(-1), className: "px-6 py-3 text-gray-600 hover:text-gray-900 font-light transition-colors", children: "Cancel" }), (0,jsx_runtime.jsx)("button", { type: "submit", disabled: isSubmitting, className: "px-8 py-3 bg-gray-900 text-white font-light rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? ((0,jsx_runtime.jsxs)("span", { className: "flex items-center gap-2", children: [(0,jsx_runtime.jsx)("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), "Submitting..."] })) : ('Submit Application') })] })] })] }) }));
};
/* harmony default export */ const JobSearch_JobApplicationForm = (JobApplicationForm);


/***/ })

}]);
//# sourceMappingURL=450.chunk.js.map