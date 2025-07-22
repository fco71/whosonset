"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[11],{

/***/ 774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3490);
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4164);




// Button size classes
const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-6 py-3 text-base',
};
// Button variant classes
const variantClasses = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-400 border border-transparent',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 border border-transparent',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-gray-400 border border-transparent',
    outline: 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-400',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-2 focus-visible:ring-gray-300 border border-transparent',
    link: 'bg-transparent text-blue-600 hover:underline p-0 focus-visible:ring-0 border-0',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 border border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 border border-transparent',
};
// Rounded classes
const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
};
const Button = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ variant = 'default', size = 'md', isLoading = false, loadingText, leftIcon, rightIcon, children, className, disabled = false, fullWidth = false, rounded = 'md', type = 'button', as: Component = framer_motion__WEBPACK_IMPORTED_MODULE_2__/* .motion */ .P.button, ...props }, ref) => {
    const isDisabled = isLoading || disabled;
    // Generate class names
    const buttonClasses = (0,clsx__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A)('inline-flex items-center justify-center font-medium', 'focus-visible:outline-none focus-visible:ring-offset-2', 'transition-all duration-200 ease-in-out', variantClasses[variant], sizeClasses[size], roundedClasses[rounded], {
        'w-full': fullWidth,
        'opacity-60 cursor-not-allowed pointer-events-none': isDisabled,
    }, className);
    // Loading spinner
    const loadingSpinner = ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", { className: "animate-spin h-4 w-4 text-current flex-shrink-0", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", "aria-hidden": "true", children: [(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Component, { ref: ref, type: type, className: buttonClasses, disabled: isDisabled, "aria-busy": isLoading, "aria-disabled": isDisabled, whileTap: !isDisabled ? { scale: 0.98 } : undefined, whileHover: !isDisabled ? { scale: 1.02 } : undefined, transition: { duration: 0.2 }, ...props, children: isLoading ? ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", { className: "flex items-center justify-center", children: [loadingSpinner, loadingText && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-2", children: loadingText })] })) : ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, { children: [leftIcon && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "mr-2", children: leftIcon }), children, rightIcon && (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: "ml-2", children: rightIcon })] })) }));
});
Button.displayName = 'Button';



/***/ }),

/***/ 6680:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ Input)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4848);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6540);
/* harmony import */ var _theme_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3049);



const Input = (0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(({ label, error, leftIcon, rightIcon, className = '', containerClassName = '', labelClassName = '', errorClassName = '', variant = 'outline', inputSize = 'md', id, disabled, onFocus, onBlur, ...props }, ref) => {
    const { theme } = (0,_theme_ThemeProvider__WEBPACK_IMPORTED_MODULE_2__/* .useTheme */ .DP)();
    const [isFocused, setIsFocused] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const inputId = id || react__WEBPACK_IMPORTED_MODULE_1__.useId();
    // Map our custom size to the appropriate classes
    const sizeClasses = {
        sm: 'h-8 text-xs px-2.5 py-1.5',
        md: 'h-10 text-sm px-3 py-2',
        lg: 'h-12 text-base px-4 py-3',
    }[inputSize || 'md'];
    // Variant classes
    const variantClasses = {
        outline: `bg-transparent border ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-neutral-600 focus:border-primary-500 focus:ring-primary-500'}`,
        filled: `bg-gray-50 dark:bg-neutral-700/30 border border-transparent ${error
            ? 'focus:border-red-500 focus:ring-red-500'
            : 'focus:border-primary-500 focus:ring-primary-500'}`,
        flushed: `bg-transparent border-0 border-b ${error
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-300 dark:border-neutral-600 focus:border-primary-500'} rounded-none px-0`,
        unstyled: 'bg-transparent border-0 p-0 focus:ring-0',
    }[variant];
    // Label classes
    const labelSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }[inputSize || 'md'];
    const handleFocus = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };
    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };
    return ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `w-full ${containerClassName}`, children: [label && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("label", { htmlFor: inputId, className: `block mb-1.5 font-medium text-gray-700 dark:text-gray-200 ${labelSizeClasses} ${labelClassName} ${error ? 'text-red-600 dark:text-red-400' : ''}`, children: label })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", { className: `relative flex items-center ${sizeClasses} ${variantClasses} ${isFocused ? 'ring-1 ring-primary-500' : ''} rounded-md transition-all duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`, children: [leftIcon && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute left-3 flex items-center justify-center text-gray-400 dark:text-gray-400", children: leftIcon })), (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("input", { ref: ref, id: inputId, className: `w-full h-full bg-transparent border-0 focus:outline-none focus:ring-0 ${leftIcon ? 'pl-9' : 'pl-3'} ${rightIcon ? 'pr-9' : 'pr-3'} ${disabled ? 'cursor-not-allowed' : ''} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`, disabled: disabled, onFocus: handleFocus, onBlur: handleBlur, ...props }), rightIcon && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "absolute right-3 flex items-center justify-center text-gray-400 dark:text-gray-400", children: rightIcon }))] }), error && ((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", { className: `mt-1.5 text-sm text-red-600 dark:text-red-400 ${errorClassName}`, children: error }))] }));
});
// Add display name for better debugging
Input.displayName = 'Input';

// Also provide a default export for backward compatibility
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (Input)));


/***/ }),

/***/ 7011:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_PostJobPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./node_modules/react-router/dist/development/chunk-QMGIS6GS.mjs
var chunk_QMGIS6GS = __webpack_require__(5788);
// EXTERNAL MODULE: ./src/components/ui/Button.tsx
var Button = __webpack_require__(774);
// EXTERNAL MODULE: ./src/components/ui/Input.tsx
var Input = __webpack_require__(6680);
// EXTERNAL MODULE: ./src/lib/utils.ts
var utils = __webpack_require__(9973);
;// ./src/components/ui/Textarea.tsx



const Textarea = react.forwardRef(({ className, ...props }, ref) => {
    return ((0,jsx_runtime.jsx)("textarea", { className: (0,utils.cn)("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className), ref: ref, ...props }));
});
Textarea.displayName = "Textarea";


// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
;// ./src/services/api/jobService.ts

// Create a new job posting
const createJobPosting = async (jobData, userId) => {
    try {
        const jobPosting = {
            ...jobData,
            status: 'published',
            postedById: userId, // Ensure this is set from the function parameter
            createdBy: userId, // Also set createdBy for backward compatibility
            applicationCount: 0,
            views: 0,
            createdAt: (0,firebase/* serverTimestamp */.O5)(),
            updatedAt: (0,firebase/* serverTimestamp */.O5)(),
        };
        const docRef = await (0,firebase/* addDoc */.gS)((0,firebase/* collection */.rJ)(firebase.db, 'jobPostings'), jobPosting);
        return docRef.id;
    }
    catch (error) {
        console.error('Error creating job posting:', error);
        throw new Error('Failed to create job posting');
    }
};
// Update an existing job posting
const updateJobPosting = async (jobId, jobData) => {
    try {
        const jobRef = doc(db, 'jobPostings', jobId);
        const updateData = {
            ...jobData,
            updatedAt: serverTimestamp()
        };
        await updateDoc(jobRef, updateData);
    }
    catch (error) {
        console.error('Error updating job posting:', error);
        throw new Error('Failed to update job posting');
    }
};
// Delete a job posting
const deleteJobPosting = async (jobId) => {
    try {
        const jobRef = doc(db, 'jobPostings', jobId);
        await deleteDoc(jobRef);
    }
    catch (error) {
        console.error('Error deleting job posting:', error);
        throw new Error('Failed to delete job posting');
    }
};
// Get job postings with filters
const getJobPostings = async (filters = {}) => {
    try {
        const jobsRef = collection(db, 'jobPostings');
        let q = query(jobsRef);
        // Apply status filter if provided and not 'all'
        if (filters.status && filters.status !== 'all') {
            q = query(q, where('status', '==', filters.status));
        }
        else if (!filters.status) {
            // Default to published if no status is specified
            q = query(q, where('status', '==', 'published'));
        }
        else {
        }
        if (filters?.department) {
            q = query(q, where('department', '==', filters.department));
        }
        if (filters?.jobType) {
            q = query(q, where('jobType', '==', filters.jobType));
        }
        if (filters?.experienceLevel) {
            q = query(q, where('experienceLevel', '==', filters.experienceLevel));
        }
        if (filters?.isRemote !== undefined) {
            q = query(q, where('isRemote', '==', filters.isRemote));
        }
        if (filters?.postedBy) {
            if (filters.postedBy) {
                q = query(q, where('postedById', '==', filters.postedBy));
            }
        }
        if (filters?.limit) {
            q = query(q, limit(filters.limit));
        }
        // Order by creation date, newest first
        q = query(q, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const jobs = [];
        querySnapshot.forEach((doc) => {
            try {
                const docData = doc.data();
                // Ensure required fields exist with defaults
                const jobData = {
                    id: doc.id,
                    title: docData.title || 'Untitled Position',
                    department: docData.department || 'General',
                    location: docData.location || 'Location not specified',
                    jobType: docData.jobType || 'full_time',
                    experienceLevel: docData.experienceLevel || 'mid',
                    isRemote: docData.isRemote || false,
                    description: docData.description || '',
                    requirements: docData.requirements || '',
                    responsibilities: docData.responsibilities || '',
                    benefits: docData.benefits || '',
                    skills: Array.isArray(docData.skills) ? docData.skills : [],
                    salaryMin: docData.salaryMin,
                    salaryMax: docData.salaryMax,
                    salaryPeriod: docData.salaryPeriod || 'year',
                    showSalary: docData.showSalary || false,
                    projectName: docData.projectName || '',
                    projectType: docData.projectType || 'other',
                    startDate: docData.startDate || new Date().toISOString().split('T')[0],
                    contactName: docData.contactName || '',
                    contactEmail: docData.contactEmail || '',
                    isPaid: docData.isPaid !== undefined ? docData.isPaid : true,
                    isUnion: docData.isUnion || false,
                    visaSponsorship: docData.visaSponsorship || false,
                    relocationAssistance: docData.relocationAssistance || false,
                    status: docData.status || 'draft',
                    postedById: docData.postedById || '',
                    createdBy: docData.createdBy || docData.postedById || '',
                    applicationCount: docData.applicationCount || 0,
                    views: docData.views || 0,
                    // Handle Firestore timestamps
                    createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date(),
                    updatedAt: docData.updatedAt?.toDate ? docData.updatedAt.toDate() : new Date()
                };
                jobs.push(jobData);
            }
            catch (error) {
                console.error(`Error processing document ${doc.id}:`, error);
            }
        });
        return jobs;
    }
    catch (error) {
        console.error('Error getting job postings:', error);
        throw new Error('Failed to get job postings');
    }
};
// Get a single job posting by ID
const getJobPostingById = async (jobId) => {
    try {
        const docRef = (0,firebase/* doc */.H9)(firebase.db, 'jobPostings', jobId);
        const docSnap = await (0,firebase/* getDoc */.x7)(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        const docData = docSnap.data();
        // Return the job data with proper typing
        return {
            ...docData,
            id: jobId,
            createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : new Date(),
            updatedAt: docData.updatedAt?.toDate ? docData.updatedAt.toDate() : new Date(),
            status: docData.status || 'published',
            postedById: docData.postedById || '',
            createdBy: docData.createdBy || docData.postedById || '',
            applicationCount: docData.applicationCount || 0,
            views: docData.views || 0,
            skills: Array.isArray(docData.skills) ? docData.skills : []
        };
    }
    catch (error) {
        console.error('Error fetching job posting:', error);
        throw new Error('Failed to fetch job posting');
    }
};

// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/react-toastify/dist/index.mjs
var dist = __webpack_require__(1409);
;// ./src/pages/PostJobPage.tsx









const PostJobPage = () => {
    const navigate = (0,chunk_QMGIS6GS/* useNavigate */.Zp)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    // Redirect to login if not authenticated
    react.useEffect(() => {
        if (!currentUser) {
            console.log('User not authenticated, redirecting to login');
            navigate('/login', { state: { from: '/post-job' } });
        }
    }, [currentUser, navigate]);
    // Block UI for unauthenticated users
    if (!currentUser) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 px-4", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-md w-full bg-white shadow rounded-lg p-8 text-center", children: [(0,jsx_runtime.jsx)("h2", { className: "text-2xl font-bold mb-4 text-gray-900", children: "Sign in required" }), (0,jsx_runtime.jsxs)("p", { className: "text-gray-600 mb-6", children: ["You must be signed in to post a job. Please ", (0,jsx_runtime.jsx)("a", { href: "/login", className: "text-blue-600 hover:underline", children: "sign in" }), " or ", (0,jsx_runtime.jsx)("a", { href: "/register", className: "text-blue-600 hover:underline", children: "register" }), " to continue."] })] }) }));
    }
    const [isFormValid, setIsFormValid] = (0,react.useState)(false);
    const [isSubmitting, setIsSubmitting] = (0,react.useState)(false);
    const [errors, setErrors] = (0,react.useState)({});
    // Initialize form state with default values
    const [formData, setFormData] = (0,react.useState)({
        title: '',
        department: '',
        location: '',
        jobType: 'full_time',
        experienceLevel: 'entry',
        isRemote: false,
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        skills: '',
        salaryMin: '',
        salaryMax: '',
        salaryPeriod: 'year',
        showSalary: true,
        projectName: '',
        projectLink: '',
        projectType: 'other',
        startDate: new Date().toISOString().split('T')[0],
        contactName: '',
        contactEmail: '',
        showContactEmail: false,
        contactPhone: '',
        isPaid: false,
        isUnion: false,
        visaSponsorship: false,
        relocationAssistance: false
    });
    // Form validation and handlers
    const validateField = (0,react.useCallback)((fieldName) => {
        const value = formData[fieldName];
        const newErrors = { ...errors };
        // Clear previous error
        delete newErrors[fieldName];
        // Required fields validation
        if (['title', 'department', 'location', 'description', 'contactName', 'contactEmail'].includes(fieldName)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                newErrors[fieldName] = 'This field is required';
            }
        }
        // Email validation
        if (fieldName === 'contactEmail' && value && !/\S+@\S+\.\S+/.test(value)) {
            newErrors[fieldName] = 'Please enter a valid email address';
        }
        // Numeric validation for salary
        if ((fieldName === 'salaryMin' || fieldName === 'salaryMax') && value) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                newErrors[fieldName] = 'Please enter a valid number';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, errors]);
    const handleInputChange = (e) => {
        const { name, type } = e.target;
        const value = type === 'checkbox'
            ? e.target.checked
            : e.target.value;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };
    const handleBlur = (e) => {
        const { name } = e.target;
        validateField(name);
    };
    // Select options
    const jobTypeOptions = [
        { value: 'full-time', label: 'Full-time' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'contract', label: 'Contract' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'internship', label: 'Internship' },
    ];
    const experienceLevelOptions = [
        { value: 'entry', label: 'Entry Level' },
        { value: 'mid', label: 'Mid Level' },
        { value: 'senior', label: 'Senior' },
        { value: 'lead', label: 'Lead' },
        { value: 'executive', label: 'Executive' },
    ];
    const departmentOptions = [
        { value: 'camera', label: 'Camera' },
        { value: 'lighting', label: 'Lighting' },
        { value: 'sound', label: 'Sound' },
        { value: 'art', label: 'Art Department' },
        { value: 'wardrobe', label: 'Wardrobe' },
        { value: 'makeup', label: 'Hair & Makeup' },
        { value: 'production', label: 'Production' },
        { value: 'post', label: 'Post-Production' },
        { value: 'other', label: 'Other' },
    ];
    // Handle form field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: typeof value === 'boolean' ? value : value.trimStart()
        }));
        // Clear error for this field if it exists
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };
    // Convert boolean to string for form fields
    const getFieldValue = (fieldName) => {
        const value = formData[fieldName];
        if (fieldName === 'isRemote' || fieldName === 'isPaid' || fieldName === 'isUnion' ||
            fieldName === 'visaSponsorship' || fieldName === 'relocationAssistance') {
            return value ? 'true' : 'false';
        }
        return String(value);
    };
    // Validate all fields
    const validateForm = () => {
        const newErrors = {};
        // Required fields with more specific error messages
        if (!formData.title.trim())
            newErrors.title = 'Please enter a job title';
        if (!formData.department.trim())
            newErrors.department = 'Please select a department';
        if (!formData.location.trim())
            newErrors.location = 'Please enter a location';
        if (!formData.description.trim())
            newErrors.description = 'Please enter a job description';
        if (!formData.contactName.trim())
            newErrors.contactName = 'Please enter a contact name';
        // Email validation with better error messages
        if (!formData.contactEmail.trim()) {
            newErrors.contactEmail = 'Please enter an email address';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
        }
        // Numeric validation for salary
        if (formData.salaryMin && isNaN(parseFloat(formData.salaryMin))) {
            newErrors.salaryMin = 'Please enter a valid number';
        }
        if (formData.salaryMax && isNaN(parseFloat(formData.salaryMax))) {
            newErrors.salaryMax = 'Please enter a valid number';
        }
        setErrors(newErrors);
        // Log validation errors for debugging
        if (Object.keys(newErrors).length > 0) {
            console.log('Validation errors:', newErrors);
        }
        return Object.keys(newErrors).length === 0;
    };
    // Handle select changes - consolidated implementation
    const handleSelectChange = (name) => (option) => {
        if (option) {
            setFormData(prev => ({
                ...prev,
                [name]: option.value
            }));
        }
        // Clear error for the field being edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
        // Clear error for the field being edited
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // First validate all fields
        const isValid = validateForm();
        if (!isValid) {
            // Find the first error and scroll to it
            const firstError = Object.keys(errors).find(key => errors[key]);
            if (firstError) {
                const element = document.querySelector(`[name="${firstError}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
            else {
                // If no specific field error but form is invalid, show general error
                dist/* toast */.oR.error('Please fill in all required fields');
            }
            return;
        }
        if (!currentUser) {
            const errorMsg = 'You must be logged in to post a job';
            console.error(errorMsg);
            dist/* toast */.oR.error(errorMsg);
            return;
        }
        setIsSubmitting(true);
        try {
            console.log('Current user:', currentUser.uid);
            // Create job data object that matches JobPostingBase interface
            const jobData = {
                // Required fields from JobPostingBase
                title: formData.title,
                department: formData.department,
                location: formData.location,
                jobType: (formData.jobType || 'full_time'),
                experienceLevel: (formData.experienceLevel || 'entry'),
                isRemote: formData.isRemote || false,
                // Details
                description: formData.description || '',
                requirements: formData.requirements || '',
                responsibilities: formData.responsibilities || '',
                benefits: formData.benefits || '',
                skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
                // Compensation - ensure no undefined values for Firestore
                salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : 0,
                salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : 0,
                salaryPeriod: formData.salaryPeriod || 'year',
                showSalary: formData.showSalary !== undefined ? formData.showSalary : true,
                // Project Info
                projectName: formData.projectName || '',
                projectLink: formData.projectLink || '',
                projectType: (formData.projectType || 'other'),
                // Timeline
                startDate: formData.startDate || new Date().toISOString().split('T')[0],
                // Contact
                contactName: formData.contactName,
                contactEmail: formData.contactEmail,
                showContactEmail: formData.showContactEmail,
                contactPhone: formData.contactPhone || '',
                // Additional
                isPaid: formData.isPaid || false,
                isUnion: formData.isUnion || false,
                visaSponsorship: formData.visaSponsorship || false,
                relocationAssistance: formData.relocationAssistance || false,
                // System fields
                status: 'published',
                postedById: currentUser.uid,
                applicationCount: 0,
                views: 0
            };
            console.log('Job data prepared:', JSON.stringify(jobData, null, 2));
            console.log('Calling createJobPosting API with user ID:', currentUser.uid);
            const jobId = await createJobPosting(jobData, currentUser.uid);
            if (!jobId) {
                throw new Error('Failed to create job: No job ID returned');
            }
            console.log('Job created successfully with ID:', jobId);
            // Verify the job was saved by fetching it back
            try {
                const savedJob = await getJobPostingById(jobId);
                console.log('Successfully retrieved saved job:', savedJob);
            }
            catch (fetchError) {
                console.error('Error fetching saved job:', fetchError);
            }
            dist/* toast */.oR.success('Job posted successfully!');
            // Redirect to the job details page
            navigate(`/jobs/${jobId}`);
        }
        catch (error) {
            console.error('Error in job posting flow:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to complete job posting process.';
            dist/* toast */.oR.error(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8", children: (0,jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto", children: [(0,jsx_runtime.jsxs)("div", { className: "text-center mb-8", children: [(0,jsx_runtime.jsx)("h1", { className: "text-3xl font-bold text-gray-900", children: "Post a New Job" }), (0,jsx_runtime.jsx)("p", { className: "mt-2 text-sm text-gray-600", children: "Fill out the form below to post a new job listing." })] }), errors.submit && ((0,jsx_runtime.jsx)("div", { className: "mb-4 p-4 bg-red-50 rounded-md", children: (0,jsx_runtime.jsx)("p", { className: "text-sm text-red-600 text-center", children: errors.submit }) })), (0,jsx_runtime.jsx)("form", { onSubmit: handleSubmit, className: "space-y-6", children: (0,jsx_runtime.jsxs)("div", { className: "bg-white shadow overflow-hidden sm:rounded-lg p-6 space-y-6", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Job Title *" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { id: "title", name: "title", type: "text", value: formData.title, onChange: (e) => handleChange('title', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "e.g. Gaffer, Key Grip, Production Designer" }), errors.title && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.title })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "department", className: "block text-sm font-medium text-gray-700", children: "Department *" }), (0,jsx_runtime.jsxs)("select", { id: "department", name: "department", value: formData.department, onChange: (e) => handleChange('department', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select a department" }), departmentOptions.map((dept) => ((0,jsx_runtime.jsx)("option", { value: dept.value, children: dept.label }, dept.value)))] }), errors.department && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.department })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "location", className: "block text-sm font-medium text-gray-700", children: "Location *" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { id: "location", name: "location", type: "text", value: formData.location, onChange: (e) => handleChange('location', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "e.g. Los Angeles, CA or Remote" }), errors.location && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.location })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "jobType", className: "block text-sm font-medium text-gray-700", children: "Job Type" }), (0,jsx_runtime.jsxs)("select", { id: "jobType", name: "jobType", value: formData.jobType, onChange: (e) => handleChange('jobType', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", children: [(0,jsx_runtime.jsx)("option", { value: "", children: "Select job type" }), (0,jsx_runtime.jsx)("option", { value: "full_time", children: "Full-time" }), (0,jsx_runtime.jsx)("option", { value: "part_time", children: "Part-time" }), (0,jsx_runtime.jsx)("option", { value: "contract", children: "Contract" }), (0,jsx_runtime.jsx)("option", { value: "freelance", children: "Freelance" })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Job Description *" }), (0,jsx_runtime.jsx)(Textarea, { id: "description", name: "description", rows: 4, value: formData.description, onChange: (e) => handleChange('description', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "Detailed description of the job" }), errors.description && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.description })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "requirements", className: "block text-sm font-medium text-gray-700", children: "Requirements" }), (0,jsx_runtime.jsx)(Textarea, { id: "requirements", name: "requirements", rows: 3, value: formData.requirements, onChange: (e) => handleChange('requirements', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "List the requirements for this job" }), errors.requirements && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.requirements })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "responsibilities", className: "block text-sm font-medium text-gray-700", children: "Responsibilities" }), (0,jsx_runtime.jsx)(Textarea, { id: "responsibilities", name: "responsibilities", rows: 3, value: formData.responsibilities, onChange: (e) => handleChange('responsibilities', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "List the responsibilities for this job" }), errors.responsibilities && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.responsibilities })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "benefits", className: "block text-sm font-medium text-gray-700", children: "Benefits & Perks" }), (0,jsx_runtime.jsx)(Textarea, { id: "benefits", name: "benefits", rows: 3, value: formData.benefits, onChange: (e) => handleChange('benefits', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "List the benefits and perks for this job" }), errors.benefits && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.benefits })] }), (0,jsx_runtime.jsxs)("fieldset", { className: "border border-gray-200 rounded-md p-4 mb-4", children: [(0,jsx_runtime.jsx)("legend", { className: "text-base font-medium text-gray-900 px-2", children: "Compensation" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "salaryMin", className: "block text-sm font-medium text-gray-700", children: "Minimum Salary" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { id: "salaryMin", name: "salaryMin", type: "number", min: "0", value: formData.salaryMin, onChange: e => handleChange('salaryMin', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "e.g. 50000" }), errors.salaryMin && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.salaryMin })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "salaryMax", className: "block text-sm font-medium text-gray-700", children: "Maximum Salary" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { id: "salaryMax", name: "salaryMax", type: "number", min: "0", value: formData.salaryMax, onChange: e => handleChange('salaryMax', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", placeholder: "e.g. 70000" }), errors.salaryMax && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.salaryMax })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "salaryPeriod", className: "block text-sm font-medium text-gray-700", children: "Salary Period" }), (0,jsx_runtime.jsxs)("select", { id: "salaryPeriod", name: "salaryPeriod", value: formData.salaryPeriod, onChange: e => handleChange('salaryPeriod', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm", children: [(0,jsx_runtime.jsx)("option", { value: "year", children: "Per Year" }), (0,jsx_runtime.jsx)("option", { value: "month", children: "Per Month" }), (0,jsx_runtime.jsx)("option", { value: "week", children: "Per Week" }), (0,jsx_runtime.jsx)("option", { value: "day", children: "Per Day" }), (0,jsx_runtime.jsx)("option", { value: "hour", children: "Per Hour" })] })] }), (0,jsx_runtime.jsxs)("div", { className: "flex items-center mt-6", children: [(0,jsx_runtime.jsx)("input", { id: "showSalary", name: "showSalary", type: "checkbox", checked: formData.showSalary, onChange: e => handleChange('showSalary', e.target.checked), className: "h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" }), (0,jsx_runtime.jsx)("label", { htmlFor: "showSalary", className: "ml-2 block text-sm text-gray-700", children: "Show salary on job posting" })] })] })] }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2", children: (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "startDate", className: "block text-sm font-medium text-gray-700", children: "Start Date *" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { type: "date", name: "startDate", id: "startDate", value: formData.startDate, min: new Date().toISOString().split('T')[0], onChange: (e) => handleChange('startDate', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" }), errors.startDate && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.startDate })] }) }), (0,jsx_runtime.jsxs)("div", { className: "pt-4 border-t border-gray-200", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Contact Information" }), (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: "How should applicants contact you?" }), (0,jsx_runtime.jsxs)("div", { className: "mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6", children: [(0,jsx_runtime.jsxs)("div", { className: "sm:col-span-3", children: [(0,jsx_runtime.jsx)("label", { htmlFor: "contactName", className: "block text-sm font-medium text-gray-700", children: "Contact Name *" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { type: "text", name: "contactName", id: "contactName", value: formData.contactName, onChange: (e) => handleChange('contactName', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" }), errors.contactName && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.contactName })] }), (0,jsx_runtime.jsxs)("div", { className: "sm:col-span-3", children: [(0,jsx_runtime.jsx)("label", { htmlFor: "contactEmail", className: "block text-sm font-medium text-gray-700", children: "Contact Email *" }), (0,jsx_runtime.jsx)(Input/* Input */.p, { type: "email", name: "contactEmail", id: "contactEmail", value: formData.contactEmail, onChange: (e) => handleChange('contactEmail', e.target.value), className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" }), errors.contactEmail && (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.contactEmail })] })] }), (0,jsx_runtime.jsxs)("div", { className: "mt-4", children: [(0,jsx_runtime.jsxs)("div", { className: "flex items-center", children: [(0,jsx_runtime.jsx)("input", { id: "showContactEmail", name: "showContactEmail", type: "checkbox", checked: formData.showContactEmail, onChange: (e) => handleChange('showContactEmail', e.target.checked), className: "h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" }), (0,jsx_runtime.jsx)("label", { htmlFor: "showContactEmail", className: "ml-2 block text-sm text-gray-700", children: "Show email address publicly on job posting" })] }), (0,jsx_runtime.jsx)("p", { className: "mt-1 text-sm text-gray-500", children: "If unchecked, applicants will only see your name and can contact you through the application system." })] })] }), (0,jsx_runtime.jsxs)("div", { className: "pt-5", children: [(0,jsx_runtime.jsxs)("div", { className: "flex justify-end", children: [(0,jsx_runtime.jsx)(Button/* Button */.$, { type: "button", onClick: () => navigate(-1), className: "bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Cancel" }), (0,jsx_runtime.jsx)(Button/* Button */.$, { type: "submit", disabled: isSubmitting || !formData.title || !formData.department || !formData.location || !formData.description || !formData.contactName || !formData.contactEmail, className: "ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200", children: isSubmitting ? ((0,jsx_runtime.jsxs)(jsx_runtime.Fragment, { children: [(0,jsx_runtime.jsxs)("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [(0,jsx_runtime.jsx)("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), (0,jsx_runtime.jsx)("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Publishing..."] })) : 'Publish Job' })] }), Object.keys(errors).length > 0 && ((0,jsx_runtime.jsx)("div", { className: "mt-4 p-3 bg-red-50 rounded-md", children: (0,jsx_runtime.jsx)("p", { className: "text-sm text-red-600", children: "Please fix the errors in the form before submitting." }) }))] })] }) })] }) }));
};
/* harmony default export */ const pages_PostJobPage = (PostJobPage);


/***/ }),

/***/ 9973:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cn: () => (/* binding */ cn)
/* harmony export */ });
/* unused harmony exports formatNumber, truncate, debounce, generateId, isMobileDevice, toKebabCase, isValidEmail */
/* harmony import */ var clsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4164);
/* harmony import */ var tailwind_merge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(856);


/**
 * Combines multiple class names and merges Tailwind CSS classes
 * @param inputs - Class names to be combined
 * @returns A single string of combined and merged class names
 */
function cn(...inputs) {
    return (0,tailwind_merge__WEBPACK_IMPORTED_MODULE_0__/* .twMerge */ .QP)((0,clsx__WEBPACK_IMPORTED_MODULE_1__/* .clsx */ .$)(inputs));
}
/**
 * Formats a number with commas as thousand separators
 * @param num - The number to format
 * @returns Formatted number as string
 */
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}
/**
 * Truncates a string to a specified length and adds an ellipsis if needed
 * @param str - The string to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
function truncate(str, length) {
    if (str.length <= length)
        return str;
    return `${str.slice(0, length)}...`;
}
/**
 * Debounce a function call
 * @param func - The function to debounce
 * @param wait - Time to wait in milliseconds
 * @returns Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
/**
 * Generates a unique ID
 * @returns A unique string ID
 */
function generateId() {
    return Math.random().toString(36).substring(2, 11);
}
/**
 * Checks if the current device is a mobile device
 * @returns Boolean indicating if the device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
/**
 * Converts a string to kebab-case
 * @param str - The string to convert
 * @returns kebab-cased string
 */
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
/**
 * Validates an email address
 * @param email - The email to validate
 * @returns Boolean indicating if the email is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


/***/ })

}]);
//# sourceMappingURL=11.chunk.js.map