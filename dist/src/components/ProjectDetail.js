import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ProjectDetail.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, orderBy, startAfter, limit, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Link } from 'react-router-dom';
import ProjectShowcase from '../components/ProjectShowcase';
const LoadingSpinner = () => _jsx("div", { className: "text-white text-center mt-10 p-4", children: "Loading..." });
const ProjectDetail = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    // Removed posterImage state
    const [reviews, setReviews] = useState([]);
    const [lastVisibleReview, setLastVisibleReview] = useState(null);
    const [prevReviewPages, setPrevReviewPages] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const user = auth.currentUser;
    const [formState, setFormState] = useState({});
    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError(null);
            setProject(null);
            try {
                if (projectId) {
                    const projectDocRef = doc(db, 'Projects', projectId);
                    const projectDocSnapshot = await getDoc(projectDocRef);
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
                            location: firestoreData.location || '',
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
    useEffect(() => {
        if (projectId) {
            fetchReviews('reset');
        }
    }, [projectId]);
    useEffect(() => {
        if (!isEditing) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [reviews, isEditing]);
    const REVIEWS_PER_PAGE = 5;
    const fetchReviews = async (direction = 'reset') => {
        if (!projectId)
            return;
        setLoadingReviews(true);
        try {
            let q;
            const reviewsCollection = collection(db, 'Projects', projectId, 'Reviews');
            if (direction === 'next' && lastVisibleReview) {
                q = query(reviewsCollection, orderBy('createdAt', 'desc'), startAfter(lastVisibleReview), limit(REVIEWS_PER_PAGE));
            }
            else if (direction === 'prev') {
                if (prevReviewPages.length <= 1) {
                    setLoadingReviews(false);
                    return;
                }
                const newPrevPages = prevReviewPages.slice(0, -1);
                const cursorForPrevPage = newPrevPages.length > 1 ? newPrevPages[newPrevPages.length - 2] : null;
                q = cursorForPrevPage ? query(reviewsCollection, orderBy('createdAt', 'desc'), startAfter(cursorForPrevPage), limit(REVIEWS_PER_PAGE))
                    : query(reviewsCollection, orderBy('createdAt', 'desc'), limit(REVIEWS_PER_PAGE));
                setPrevReviewPages(newPrevPages);
            }
            else {
                q = query(reviewsCollection, orderBy('createdAt', 'desc'), limit(REVIEWS_PER_PAGE));
                setPrevReviewPages([]);
            }
            const snapshot = await getDocs(q);
            const docs = snapshot.docs;
            const fetchedReviews = docs.map((doc) => ({ id: doc.id, projectId: projectId, ...doc.data(), createdAt: doc.data().createdAt?.toDate?.() || new Date() }));
            setReviews(fetchedReviews);
            const newLastVisible = docs.length > 0 ? docs[docs.length - 1] : null;
            setLastVisibleReview(newLastVisible);
            if (direction === 'next' && docs.length > 0)
                setPrevReviewPages((prev) => [...prev, docs[0]]);
            else if (direction === 'reset' && docs.length > 0)
                setPrevReviewPages(docs[0] ? [docs[0]] : []);
        }
        catch (err) { // Added : any for err
            console.error('Failed to fetch reviews:', err);
            setError(err.message || 'Failed to fetch reviews.'); // Added err.message
        }
        finally {
            setLoadingReviews(false);
        }
    };
    const handleEditClick = () => {
        if (project) {
            setFormState({ ...project });
            setIsEditing(true);
            setError(null);
        }
    };
    const handleCancelClick = () => {
        setIsEditing(false);
        if (project)
            setFormState({ ...project });
        setCoverImage(null); // Removed setPosterImage
        setError(null);
    };
    const handleCoverImageChange = (e) => {
        if (e.target.files && e.target.files[0])
            setCoverImage(e.target.files[0]);
        else
            setCoverImage(null);
    };
    // Removed handlePosterImageChange
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
            const oldRef = ref(storage, decodedPath);
            await deleteObject(oldRef);
            console.log("Old image deleted successfully:", decodedPath);
        }
        catch (e) {
            if (e.code === 'storage/object-not-found')
                console.log("Old image not found:", url);
            else
                console.warn("Could not delete old image:", url, e.message);
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
        const storageRef = ref(storage, `projects/${projectId}/${baseImageName}`);
        try {
            await uploadBytes(storageRef, imageFile);
            return await getDownloadURL(storageRef);
        }
        catch (uploadError) {
            console.error("Error uploading image: ", uploadError);
            setError(`Image upload failed: ${uploadError.message}`);
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
            await updateDoc(doc(db, 'Projects', projectId), writableData);
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
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
        catch (saveError) {
            console.error("Error updating project:", saveError);
            setError(saveError.message || "Failed to save.");
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
    const reviewSection = (_jsxs("section", { className: "mt-12", children: [_jsx("h2", { className: "text-2xl font-semibold text-white mb-6", children: "Reviews" }), loadingReviews ? (_jsx("div", { className: "text-gray-400", children: "Loading reviews..." })) :
                reviews.length === 0 ? (_jsx("p", { className: "text-gray-400", children: "No reviews yet." })) : (_jsx("ul", { className: "space-y-4", children: reviews.map((r) => (_jsxs("li", { className: "bg-gray-900 rounded-lg p-5 border border-gray-700", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm font-medium text-teal-400", children: r.author }), _jsx("span", { className: "text-xs text-gray-500", children: r.createdAt.toLocaleString() })] }), _jsx("p", { className: "text-sm text-white", children: r.content })] }, r.id))) })), _jsxs("div", { className: "mt-8 flex items-center justify-between gap-6", children: [_jsx("button", { onClick: () => fetchReviews('prev'), disabled: loadingReviews || prevReviewPages.length <= 1, className: "px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-40", children: "\u2190 Previous" }), _jsxs("span", { className: "text-gray-400 text-sm", children: ["Page ", prevReviewPages.length || (reviews.length > 0 ? 1 : 0)] }), _jsx("button", { onClick: () => fetchReviews('next'), disabled: loadingReviews || reviews.length < REVIEWS_PER_PAGE, className: "px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-40", children: "Next \u2192" })] })] }));
    return (_jsxs("div", { className: "min-h-screen bg-gray-900 p-6", children: [_jsx(Link, { to: "/", className: "inline-block mb-6 text-blue-500 hover:text-blue-400 transition-colors", children: "\u2190 Back to All Projects" }), isEditing ? (
            // --- EDITING FORM ---
            _jsxs("form", { className: "max-w-5xl mx-auto p-6 bg-white rounded shadow-md space-y-6", children: [error && _jsx("p", { className: "text-red-600 text-sm mb-4", children: error }), saveSuccess && _jsx("p", { className: "text-green-500 text-sm mb-4", children: "Project updated successfully!" }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Basic Information" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "projectName", className: "block text-sm font-medium", children: "Project Name" }), _jsx("input", { type: "text", id: "projectName", name: "projectName", value: formState.projectName || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "country", className: "block text-sm font-medium", children: "Country" }), _jsx("input", { type: "text", id: "country", name: "country", value: formState.country || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "productionCompany", className: "block text-sm font-medium", children: "Production Company" }), _jsx("input", { type: "text", id: "productionCompany", name: "productionCompany", value: formState.productionCompany || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "status", className: "block text-sm font-medium", children: "Status" }), _jsxs("select", { id: "status", name: "status", value: formState.status || 'Pre-Production', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", children: [_jsx("option", { value: "Pre-Production", children: "Pre-Production" }), _jsx("option", { value: "Development", children: "Development" }), _jsx("option", { value: "Production", children: "Production" }), _jsx("option", { value: "Post-Production", children: "Post-Production" }), _jsx("option", { value: "Completed", children: "Completed" }), _jsx("option", { value: "Cancelled", children: "Cancelled" })] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Story Info" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "logline", className: "block text-sm font-medium", children: "Logline" }), _jsx("textarea", { id: "logline", name: "logline", value: formState.logline || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", rows: 2 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "synopsis", className: "block text-sm font-medium", children: "Synopsis" }), _jsx("textarea", { id: "synopsis", name: "synopsis", value: formState.synopsis || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2", rows: 4 })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Production Timeline" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "startDate", className: "block text-sm font-medium", children: "Start Date" }), _jsx("input", { type: "date", id: "startDate", name: "startDate", value: formState.startDate || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "endDate", className: "block text-sm font-medium", children: "End Date" }), _jsx("input", { type: "date", id: "endDate", name: "endDate", value: formState.endDate || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "location", className: "block text-sm font-medium", children: "Location" }), _jsx("input", { type: "text", id: "location", name: "location", value: formState.location || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "genres", className: "block text-sm font-medium", children: "Genres (comma-separated)" }), _jsx("input", { type: "text", id: "genres", name: "genres", value: (Array.isArray(formState.genres) ? formState.genres.join(', ') : formState.genre) || '', onChange: handleGenresChange, className: "mt-1 w-full border rounded px-3 py-2", placeholder: "e.g., Action, Comedy" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Creative Team" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "director", className: "block text-sm font-medium", children: "Director" }), _jsx("input", { type: "text", id: "director", name: "director", value: formState.director || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "producer", className: "block text-sm font-medium", children: "Producer" }), _jsx("input", { type: "text", id: "producer", name: "producer", value: formState.producer || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Media" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-start", children: _jsxs("div", { children: [_jsx("label", { htmlFor: "coverImage", className: "block text-sm font-medium", children: "Cover Image" }), _jsx("input", { type: "file", id: "coverImage", accept: "image/*", onChange: handleCoverImageChange, className: "mt-1" }), coverImage ? _jsx("img", { src: URL.createObjectURL(coverImage), alt: "New Cover Preview", className: "w-36 h-auto mt-2 rounded shadow object-cover" }) : formState.coverImageUrl ? _jsx("img", { src: formState.coverImageUrl, alt: "Current Cover", className: "w-36 h-auto mt-2 rounded shadow object-cover" }) : null] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-4 border-b pb-1", children: "Additional" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "projectWebsite", className: "block text-sm font-medium", children: "Website" }), _jsx("input", { type: "url", id: "projectWebsite", name: "projectWebsite", value: formState.projectWebsite || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "productionBudget", className: "block text-sm font-medium", children: "Budget" }), _jsx("input", { type: "text", id: "productionBudget", name: "productionBudget", value: formState.productionBudget || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "productionCompanyContact", className: "block text-sm font-medium", children: "Company Contact" }), _jsx("input", { type: "text", id: "productionCompanyContact", name: "productionCompanyContact", value: formState.productionCompanyContact || '', onChange: handleChange, className: "mt-1 w-full border rounded px-3 py-2" })] })] })] }), _jsxs("div", { className: "pt-4 border-t mt-6 flex justify-end space-x-4", children: [_jsx("button", { type: "button", onClick: handleCancelClick, className: "px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600", disabled: loading, children: "Cancel" }), _jsx("button", { type: "button", onClick: handleSaveClick, disabled: loading, className: `px-4 py-2 rounded text-white ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`, children: loading ? 'Saving...' : 'Save Changes' })] })] })) : (
            // --- DISPLAYING PROJECT DETAILS ---
            loading && !project ? (_jsx(LoadingSpinner, {})) :
                error && !project ? (_jsxs("p", { className: "text-white text-center mt-10", children: ["Error: ", error] })) :
                    project ? (_jsxs("div", { className: "max-w-4xl mx-auto py-12", children: [project.coverImageUrl && (_jsxs("div", { className: "mb-6 flex justify-center", children: [" ", _jsx("img", { src: project.coverImageUrl, alt: `${project.projectName} Cover`, 
                                        // Example: Fixed width, auto height, max height, contain to fit
                                        className: "w-64 h-auto max-h-48 object-contain rounded-md shadow-lg" })] })), _jsx(ProjectShowcase, { project: project, userId: user?.uid, 
                                // Pass onEditClick if ProjectShowcase itself renders an edit button for the owner.
                                // If the edit button is handled *only* below, this prop might not be needed by ProjectShowcase.
                                onEditClick: handleEditClick }), reviewSection, _jsxs("div", { className: "mt-10 text-center", children: [" ", user && user.uid === project.owner_uid ? (_jsx("button", { onClick: handleEditClick, className: "px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md", children: "Edit Project" })) : (_jsx("button", { onClick: handleSuggestClick, className: "px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md", children: "Suggest Update" }))] })] })) : (_jsx("div", { className: "text-white text-center mt-10", children: "Project not found or not available." })))] }));
};
export default ProjectDetail;
