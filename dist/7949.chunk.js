"use strict";
(self["webpackChunkwhosonset"] = self["webpackChunkwhosonset"] || []).push([[7949],{

/***/ 676:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ imageErrorFallback)
/* harmony export */ });
// Utility for robust <img> error fallback
function imageErrorFallback(e, fallback = '/default-avatar.svg') {
    const target = e.target;
    if (!target.src.endsWith(fallback)) {
        target.src = fallback;
    }
}


/***/ }),

/***/ 7949:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ pages_ProjectDetailPage)
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4848);
// EXTERNAL MODULE: ./node_modules/react-router/dist/index.js
var dist = __webpack_require__(7767);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(6540);
// EXTERNAL MODULE: ./src/firebase.ts
var firebase = __webpack_require__(9487);
// EXTERNAL MODULE: ./node_modules/firebase/firestore/dist/esm/index.esm.js + 3 modules
var index_esm = __webpack_require__(7594);
// EXTERNAL MODULE: ./node_modules/firebase/storage/dist/esm/index.esm.js + 1 modules
var esm_index_esm = __webpack_require__(2539);
// EXTERNAL MODULE: ./node_modules/react-router-dom/dist/index.js
var react_router_dom_dist = __webpack_require__(4976);
// EXTERNAL MODULE: ./src/contexts/AuthContext.tsx
var AuthContext = __webpack_require__(2584);
// EXTERNAL MODULE: ./node_modules/react-i18next/dist/es/index.js + 15 modules
var es = __webpack_require__(2389);
;// ./src/components/ProjectShowcase.tsx

const ProjectShowcase = ({ project, userId, onEditClick }) => {
    const handleSuggestClick = () => {
        const subject = `Suggestion for project: ${project.projectName}`;
        const body = encodeURIComponent(`I would like to suggest an update to "${project.projectName}".\n\nDetails:\n`);
        window.location.href = `mailto:admin@example.com?subject=${subject}&body=${body}`;
    };
    // Only show fields that have data
    const hasProductionInfo = project.productionCompany || project.country || project.startDate || project.endDate || (project.productionLocations && project.productionLocations.length > 0);
    const hasStoryInfo = project.logline || project.synopsis;
    return ((0,jsx_runtime.jsxs)("div", { className: "space-y-8", children: [hasProductionInfo && ((0,jsx_runtime.jsxs)("div", { className: "bg-gray-50 rounded-lg p-6", children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Project Information" }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [project.productionCompany && ((0,jsx_runtime.jsx)(Field, { label: "Production Company", value: project.productionCompany })), project.country && ((0,jsx_runtime.jsx)(Field, { label: "Country", value: project.country })), project.startDate && ((0,jsx_runtime.jsx)(Field, { label: "Start Date", value: project.startDate })), project.endDate && ((0,jsx_runtime.jsx)(Field, { label: "End Date", value: project.endDate })), project.productionLocations && project.productionLocations.length > 0 && ((0,jsx_runtime.jsx)(Field, { label: "Location", value: project.productionLocations[0].city
                                    ? `${project.productionLocations[0].city}, ${project.productionLocations[0].country}`
                                    : project.productionLocations[0].country }))] })] })), hasStoryInfo && ((0,jsx_runtime.jsxs)("div", { className: "space-y-6", children: [project.logline && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Logline" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-700 leading-relaxed", children: project.logline })] })), project.synopsis && ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Synopsis" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-700 whitespace-pre-line leading-relaxed", children: project.synopsis })] }))] })), !hasProductionInfo && !hasStoryInfo && ((0,jsx_runtime.jsx)("div", { className: "text-center py-8", children: (0,jsx_runtime.jsx)("p", { className: "text-gray-500 text-sm", children: "No additional project information available." }) }))] }));
};
const Field = ({ label, value }) => ((0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("dt", { className: "text-sm font-medium text-gray-600 mb-1", children: label }), (0,jsx_runtime.jsx)("dd", { className: "text-sm text-gray-900", children: value })] }));
/* harmony default export */ const components_ProjectShowcase = (ProjectShowcase);

// EXTERNAL MODULE: ./src/utilities/imageErrorFallback.ts
var imageErrorFallback = __webpack_require__(676);
;// ./src/components/ProjectDetail.tsx

// src/components/ProjectDetail.tsx









// import LoadingSpinner from '../components/LoadingSpinner';

const LoadingSpinner = () => (0,jsx_runtime.jsx)("div", { className: "text-white text-center mt-10 p-4", children: (0,es/* useTranslation */.Bd)().t('common.loading') });
const ProjectDetail = () => {
    const { t } = (0,es/* useTranslation */.Bd)();
    const { projectId } = (0,dist/* useParams */.g)();
    const { currentUser } = (0,AuthContext/* useAuth */.A)();
    const navigate = (0,dist/* useNavigate */.Zp)();
    const [project, setProject] = (0,react.useState)(null);
    const [loading, setLoading] = (0,react.useState)(true);
    const [error, setError] = (0,react.useState)(null);
    const [isEditing, setIsEditing] = (0,react.useState)(false);
    const [saveSuccess, setSaveSuccess] = (0,react.useState)(false);
    const [coverImage, setCoverImage] = (0,react.useState)(null);
    const [coverImageBlobUrl, setCoverImageBlobUrl] = (0,react.useState)(null);
    // Track blob URL with ref for proper cleanup
    const coverImageBlobRef = (0,react.useRef)(null);
    const [formState, setFormState] = (0,react.useState)({});
    (0,react.useEffect)(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError(null);
            setProject(null);
            try {
                if (projectId) {
                    const projectDocRef = (0,index_esm.doc)(firebase.db, 'Projects', projectId);
                    const projectDocSnapshot = await (0,index_esm.getDoc)(projectDocRef);
                    if (projectDocSnapshot.exists()) {
                        const firestoreData = projectDocSnapshot.data();
                        const projectWithDefaults = {
                            id: projectDocSnapshot.id,
                            projectName: firestoreData.projectName || '',
                            country: firestoreData.country || '',
                            productionCompany: firestoreData.productionCompany || '',
                            status: firestoreData.status || 'Pre-Production',
                            logline: firestoreData.logline || '',
                            synopsis: firestoreData.synopsis || '',
                            startDate: firestoreData.startDate || '',
                            endDate: firestoreData.endDate || '',
                            productionLocations: firestoreData.productionLocations || [],
                            genre: firestoreData.genre || '',
                            director: firestoreData.director || '',
                            producer: firestoreData.producer || '',
                            coverImageUrl: firestoreData.coverImageUrl || '',
                            // Removed posterImageUrl from default assignment
                            projectWebsite: firestoreData.projectWebsite || '',
                            productionBudget: firestoreData.productionBudget || '',
                            productionCompanyContact: firestoreData.productionCompanyContact || '',
                            isVerified: typeof firestoreData.isVerified === 'boolean' ? firestoreData.isVerified : false,
                            owner_uid: firestoreData.owner_uid || '',
                            genres: firestoreData.genres || (firestoreData.genre ? [firestoreData.genre] : []),
                            ownerId: firestoreData.ownerId || '',
                        };
                        setProject(projectWithDefaults);
                        setFormState(projectWithDefaults);
                    }
                    else {
                        setError('Project not found.');
                    }
                }
                else {
                    setError('Project ID is missing.');
                }
            }
            catch (err) {
                console.error("Error fetching project:", err);
                setError(err.message || 'Failed to fetch project data.');
            }
            finally {
                setLoading(false);
            }
        };
        if (projectId) {
            fetchProject();
        }
        else {
            setError("Project ID is missing from URL.");
            setLoading(false);
        }
    }, [projectId]);
    (0,react.useEffect)(() => {
        if (!isEditing) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isEditing]);
    const handleEditClick = () => {
        if (project) {
            setFormState({ ...project });
            setIsEditing(true);
            setError(null);
        }
    };
    const handleCancelClick = () => {
        setIsEditing(false);
        setCoverImage(null);
        // Clean up blob URL when canceling
        if (coverImageBlobRef.current) {
            URL.revokeObjectURL(coverImageBlobRef.current);
            coverImageBlobRef.current = null;
        }
        setCoverImageBlobUrl(null);
        setFormState(prevState => ({
            ...prevState,
            projectName: project?.projectName || '',
            country: project?.country || '',
            productionCompany: project?.productionCompany || '',
            status: project?.status || 'Pre-Production',
            logline: project?.logline || '',
            synopsis: project?.synopsis || '',
            startDate: project?.startDate || '',
            endDate: project?.endDate || '',
            genres: project?.genres || [],
            genre: project?.genre || '',
            director: project?.director || '',
            producer: project?.producer || '',
            coverImageUrl: project?.coverImageUrl || '',
            projectWebsite: project?.projectWebsite || '',
            productionBudget: project?.productionBudget || '',
            productionCompanyContact: project?.productionCompanyContact || ''
        }));
    };
    const handleCoverImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Clean up previous blob URL
            if (coverImageBlobRef.current) {
                URL.revokeObjectURL(coverImageBlobRef.current);
            }
            // Create new blob URL
            const blobUrl = URL.createObjectURL(file);
            coverImageBlobRef.current = blobUrl;
            setCoverImageBlobUrl(blobUrl);
            setCoverImage(file);
        }
    };
    const deleteOldImage = async (url) => {
        if (!url || !url.startsWith("https://firebasestorage.googleapis.com/"))
            return;
        try {
            const pathWithQuery = url.split("/o/")[1];
            if (!pathWithQuery) {
                console.warn("Could not parse path from old image URL:", url);
                return;
            }
            const encodedPath = pathWithQuery.split("?")[0];
            const decodedPath = decodeURIComponent(encodedPath);
            const oldRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, decodedPath);
            await (0,esm_index_esm/* deleteObject */.XR)(oldRef);
            console.log("Old image deleted successfully:", decodedPath);
        }
        catch (e) {
            if (e && typeof e === 'object' && 'code' in e && e.code === 'storage/object-not-found') {
                console.log("Old image not found:", url);
            }
            else if (e instanceof Error) {
                console.warn("Could not delete old image:", url, e.message);
            }
            else {
                console.warn("Could not delete old image:", url, e);
            }
        }
    };
    const uploadImage = async (imageFile, baseImageName) => {
        if (!imageFile)
            return '';
        if (!projectId) {
            setError("Project ID is missing for image upload.");
            return '';
        }
        if (!imageFile.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return '';
        }
        const storageRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, `projects/${projectId}/${baseImageName}`);
        try {
            await (0,esm_index_esm/* uploadBytes */.D)(storageRef, imageFile);
            return await (0,esm_index_esm/* getDownloadURL */.qk)(storageRef);
        }
        catch (uploadError) {
            if (uploadError instanceof Error) {
                console.error("Error uploading image: ", uploadError);
                setError(`Image upload failed: ${uploadError.message}`);
            }
            else {
                console.error("Error uploading image: ", uploadError);
                setError("Image upload failed.");
            }
            return '';
        }
    };
    const handleSaveClick = async () => {
        if (!project || !projectId) {
            setError("Cannot save, project data missing.");
            return;
        }
        // More robust check for actual changes
        const formKeys = Object.keys(formState);
        const hasTextChanged = formKeys.some(key => {
            if (key === 'genres') { // Special handling for arrays
                return JSON.stringify(formState[key] || []) !== JSON.stringify(project[key] || []);
            }
            // REMOVED THE LINE THAT CAUSED THE ERROR: if (key === 'posterImageUrl') { return false; }
            return formState[key] !== project[key];
        });
        // Simplified check for image changes, as only coverImage remains
        if (!hasTextChanged && !coverImage) {
            setIsEditing(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            let newCoverImageUrl = project.coverImageUrl;
            // Removed newPosterImageUrl
            if (coverImage) {
                if (project.coverImageUrl)
                    await deleteOldImage(project.coverImageUrl);
                const coverExtension = coverImage.name.split('.').pop() || 'jpg';
                newCoverImageUrl = await uploadImage(coverImage, `cover_${projectId}_${Date.now()}.${coverExtension}`);
                if (!newCoverImageUrl) {
                    setLoading(false);
                    return;
                }
            }
            // Removed posterImage upload logic
            const updatedData = { ...formState, coverImageUrl: newCoverImageUrl }; // Removed posterImageUrl from here
            if (formState.genres && Array.isArray(formState.genres)) {
                updatedData.genres = formState.genres;
                if (updatedData.hasOwnProperty('genre'))
                    delete updatedData.genre;
            }
            else if (typeof formState.genre === 'string') {
                updatedData.genres = formState.genre.split(',').map(g => g.trim()).filter(g => g);
                if (updatedData.hasOwnProperty('genre'))
                    delete updatedData.genre;
            }
            const { id, owner_uid, ownerId, ...writableData } = updatedData; // ownerId might also be immutable
            // Ensure posterImageUrl is removed from writableData if it somehow remains
            if (writableData.hasOwnProperty('posterImageUrl')) {
                delete writableData.posterImageUrl;
            }
            await (0,index_esm/* updateDoc */.mZ)((0,index_esm.doc)(firebase.db, 'Projects', projectId), writableData);
            // Update local project state
            setProject(prev => {
                if (!prev)
                    return null;
                const newProjectState = {
                    ...prev, // Start with previous state
                    ...formState, // Apply changes from formState
                    coverImageUrl: newCoverImageUrl, // Ensure new image URL is used
                    // Removed posterImageUrl from newProjectState
                    genres: writableData.genres || prev.genres, // Update genres
                    id: projectId, // Ensure ID is preserved
                    owner_uid: prev.owner_uid // Ensure owner_uid is preserved
                };
                // If genres array was set, ensure single 'genre' string is removed from local state if it exists
                if (newProjectState.genres && newProjectState.hasOwnProperty('genre')) {
                    delete newProjectState.genre;
                }
                // Ensure posterImageUrl is removed from local state
                if (newProjectState.hasOwnProperty('posterImageUrl')) {
                    delete newProjectState.posterImageUrl;
                }
                return newProjectState;
            });
            // Also update formState to reflect the saved state, including new image URLs
            setFormState(prev => ({ ...prev, ...writableData, coverImageUrl: newCoverImageUrl })); // Removed posterImageUrl from here
            setCoverImage(null); // Removed setPosterImage
            // Clean up blob URL after successful save
            if (coverImageBlobRef.current) {
                URL.revokeObjectURL(coverImageBlobRef.current);
                coverImageBlobRef.current = null;
            }
            setCoverImageBlobUrl(null);
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        catch (saveError) {
            if (saveError instanceof Error) {
                console.error("Error updating project:", saveError);
                setError(saveError.message || "Failed to save.");
            }
            else {
                console.error("Error updating project:", saveError);
                setError("Failed to save.");
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };
    const handleGenresChange = (e) => {
        const { value } = e.target;
        const genresArray = value.split(',').map(g => g.trim()).filter(g => g);
        setFormState(prev => ({ ...prev, genres: genresArray, genre: value })); // Keep genre string for input field
    };
    const handleSuggestClick = () => {
        const subject = `Suggestion for project: ${project?.projectName}`;
        const body = encodeURIComponent(`I would like to suggest an update for "${project?.projectName}".\n\nDetails:\n`);
        window.location.href = `mailto:admin@example.com?subject=${subject}&body=${body}`; // Replace with your admin email
    };
    const handleDeleteClick = async () => {
        if (!project || !projectId)
            return;
        if (window.confirm(t('projectForm.confirmDelete'))) {
            try {
                // Delete the project document
                await (0,index_esm/* deleteDoc */.kd)((0,index_esm.doc)(firebase.db, 'Projects', projectId));
                // Delete cover image if it exists
                if (project.coverImageUrl) {
                    try {
                        // Extract the storage path from the download URL
                        const url = new URL(project.coverImageUrl);
                        const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
                        if (pathMatch) {
                            const storagePath = decodeURIComponent(pathMatch[1]);
                            const imageRef = (0,esm_index_esm/* ref */.KR)(firebase/* storage */.IG, storagePath);
                            await (0,esm_index_esm/* deleteObject */.XR)(imageRef);
                        }
                    }
                    catch (error) {
                        console.error('Error deleting cover image:', error);
                    }
                }
                // Navigate back to projects page
                navigate('/projects');
            }
            catch (error) {
                console.error('Error deleting project:', error);
                alert(t('projectForm.deleteFailed'));
            }
        }
    };
    // Cleanup blob URL when component unmounts or when coverImage changes
    (0,react.useEffect)(() => {
        return () => {
            if (coverImageBlobRef.current) {
                URL.revokeObjectURL(coverImageBlobRef.current);
            }
        };
    }, []);
    return ((0,jsx_runtime.jsxs)("div", { className: "min-h-screen bg-gray-50 p-6", children: [(0,jsx_runtime.jsx)(react_router_dom_dist/* Link */.N_, { to: "/projects", className: "inline-block mb-6 text-blue-600 hover:text-blue-700 transition-colors", children: t('projects.backToProjects') }), isEditing ? (
            // --- EDITING FORM ---
            (0,jsx_runtime.jsxs)("form", { className: "max-w-5xl mx-auto p-6 bg-white rounded shadow-md space-y-6", children: [error && (0,jsx_runtime.jsx)("p", { className: "text-red-600 text-sm mb-4", children: error }), saveSuccess && (0,jsx_runtime.jsx)("p", { className: "text-green-500 text-sm mb-4", children: t('projectForm.updateSuccess') }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.basicInfo') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "projectName", className: "block text-sm font-medium", children: t('projectForm.projectName') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "projectName", name: "projectName", value: formState.projectName || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "country", className: "block text-sm font-medium", children: t('projectForm.country') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "country", name: "country", value: formState.country || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "productionCompany", className: "block text-sm font-medium", children: t('projectForm.productionCompany') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "productionCompany", name: "productionCompany", value: formState.productionCompany || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "status", className: "block text-sm font-medium", children: t('projectForm.status') }), (0,jsx_runtime.jsxs)("select", { id: "status", name: "status", value: formState.status || 'Pre-Production', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", children: [(0,jsx_runtime.jsx)("option", { value: "Pre-Production", children: t('projectStatus.preProduction') }), (0,jsx_runtime.jsx)("option", { value: "Development", children: t('projectStatus.development') }), (0,jsx_runtime.jsx)("option", { value: "Production", children: t('projectStatus.production') }), (0,jsx_runtime.jsx)("option", { value: "Post-Production", children: t('projectStatus.postProduction') }), (0,jsx_runtime.jsx)("option", { value: "Completed", children: t('projectStatus.completed') }), (0,jsx_runtime.jsx)("option", { value: "Cancelled", children: t('projectStatus.cancelled') })] })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.storyInfo') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "logline", className: "block text-sm font-medium", children: t('projectForm.logline') }), (0,jsx_runtime.jsx)("textarea", { id: "logline", name: "logline", value: formState.logline || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", rows: 2 })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "synopsis", className: "block text-sm font-medium", children: t('projectForm.synopsis') }), (0,jsx_runtime.jsx)("textarea", { id: "synopsis", name: "synopsis", value: formState.synopsis || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", rows: 4 })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.productionTimeline') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "startDate", className: "block text-sm font-medium", children: t('projectForm.startDate') }), (0,jsx_runtime.jsx)("input", { type: "date", id: "startDate", name: "startDate", value: formState.startDate || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "endDate", className: "block text-sm font-medium", children: t('projectForm.endDate') }), (0,jsx_runtime.jsx)("input", { type: "date", id: "endDate", name: "endDate", value: formState.endDate || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "genres", className: "block text-sm font-medium", children: t('projectForm.genres') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "genres", name: "genres", value: (Array.isArray(formState.genres) ? formState.genres.join(', ') : formState.genre) || '', onChange: handleGenresChange, className: "mt-1 w-full border rounded px-3 py-2", placeholder: t('projectForm.genresPlaceholder') })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.creativeTeam') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "director", className: "block text-sm font-medium", children: t('projectForm.director') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "director", name: "director", value: formState.director || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "producer", className: "block text-sm font-medium", children: t('projectForm.producer') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "producer", name: "producer", value: formState.producer || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] })] })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.media') }), (0,jsx_runtime.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-start", children: (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "coverImage", className: "block text-sm font-medium", children: t('projectForm.coverImage') }), (0,jsx_runtime.jsx)("input", { type: "file", id: "coverImage", accept: "image/*", onChange: handleCoverImageChange, className: "mt-1" }), coverImageBlobUrl ? ((0,jsx_runtime.jsx)("img", { src: coverImageBlobUrl, alt: t('projectDetail.newCoverPreview'), className: "w-36 h-auto mt-2 rounded shadow object-cover", onError: imageErrorFallback/* imageErrorFallback */.i })) : formState.coverImageUrl ? ((0,jsx_runtime.jsx)("img", { src: formState.coverImageUrl, alt: t('projectDetail.currentCover'), className: "w-36 h-auto mt-2 rounded shadow object-cover", onError: imageErrorFallback/* imageErrorFallback */.i })) : null] }) })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: t('projectForm.additional') }), (0,jsx_runtime.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "projectWebsite", className: "block text-sm font-medium", children: t('projectForm.website') }), (0,jsx_runtime.jsx)("input", { type: "url", id: "projectWebsite", name: "projectWebsite", value: formState.projectWebsite || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "productionBudget", className: "block text-sm font-medium", children: t('projectForm.budget') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "productionBudget", name: "productionBudget", value: formState.productionBudget || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), (0,jsx_runtime.jsxs)("div", { children: [(0,jsx_runtime.jsx)("label", { htmlFor: "productionCompanyContact", className: "block text-sm font-medium", children: t('projectForm.companyContact') }), (0,jsx_runtime.jsx)("input", { type: "text", id: "productionCompanyContact", name: "productionCompanyContact", value: formState.productionCompanyContact || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] })] })] }), (0,jsx_runtime.jsxs)("div", { className: "pt-4 border-t mt-6 flex justify-between", children: [(0,jsx_runtime.jsx)("button", { type: "button", onClick: handleDeleteClick, className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors", children: t('projectForm.delete') }), (0,jsx_runtime.jsxs)("div", { className: "flex space-x-4", children: [(0,jsx_runtime.jsx)("button", { type: "button", onClick: handleCancelClick, className: "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600", disabled: loading, children: t('projectForm.cancel') }), (0,jsx_runtime.jsx)("button", { type: "button", onClick: handleSaveClick, disabled: loading, className: `px-4 py-2 rounded text-white ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`, children: loading ? t('projectForm.saving') : t('projectForm.saveChanges') })] })] })] })) : (
            // --- DISPLAYING PROJECT DETAILS ---
            loading && !project ? ((0,jsx_runtime.jsx)(LoadingSpinner, {})) :
                error && !project ? ((0,jsx_runtime.jsxs)("p", { className: "text-white text-center mt-10", children: ["Error: ", error] })) :
                    project ? ((0,jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto py-12", children: [project.coverImageUrl && ((0,jsx_runtime.jsxs)("div", { className: "mb-6 flex justify-center", children: [" ", (0,jsx_runtime.jsx)("img", { src: project.coverImageUrl, alt: `${project.projectName} ${t('projectDetail.coverAlt')}`, className: "w-64 h-auto max-h-48 object-contain rounded-md shadow-lg", onError: imageErrorFallback/* imageErrorFallback */.i })] })), (0,jsx_runtime.jsx)(components_ProjectShowcase, { project: project, userId: currentUser?.uid, 
                                // Pass onEditClick if ProjectShowcase itself renders an edit button for the owner.
                                // If the edit button is handled *only* below, this prop might not be needed by ProjectShowcase.
                                onEditClick: handleEditClick }), (0,jsx_runtime.jsxs)("div", { className: "mt-10 text-center", children: [" ", currentUser && currentUser.uid === project.owner_uid ? ((0,jsx_runtime.jsx)("button", { onClick: handleEditClick, className: "px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors", children: t('projects.editProject') })) : ((0,jsx_runtime.jsx)("button", { onClick: handleSuggestClick, className: "px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md", children: t('projects.suggestUpdate') }))] })] })) : ((0,jsx_runtime.jsx)("div", { className: "text-white text-center mt-10", children: t('projects.projectNotFound') })))] }));
};
/* harmony default export */ const components_ProjectDetail = (ProjectDetail);

;// ./src/pages/ProjectDetailPage.tsx



const ProjectDetailPage = () => {
    const { projectId } = (0,dist/* useParams */.g)();
    if (!projectId) {
        return ((0,jsx_runtime.jsx)("div", { className: "min-h-screen bg-gray-900 flex items-center justify-center", children: (0,jsx_runtime.jsxs)("div", { className: "text-center", children: [(0,jsx_runtime.jsx)("h1", { className: "text-2xl font-bold text-white mb-4", children: "Project Not Found" }), (0,jsx_runtime.jsx)("p", { className: "text-gray-400", children: "The project you're looking for doesn't exist." })] }) }));
    }
    return (0,jsx_runtime.jsx)(components_ProjectDetail, {});
};
/* harmony default export */ const pages_ProjectDetailPage = (ProjectDetailPage);


/***/ })

}]);
//# sourceMappingURL=7949.chunk.js.map