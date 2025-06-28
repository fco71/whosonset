// src/components/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, orderBy, startAfter, limit, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Link } from 'react-router-dom';

import ProjectShowcase from '../components/ProjectShowcase';
// import LoadingSpinner from '../components/LoadingSpinner';

interface Project {
id: string;
projectName: string;
country: string;
productionCompany: string;
status: string;
logline: string;
synopsis: string;
startDate: string;
endDate: string;
productionLocations?: Array<{
  country: string;
  city?: string;
}>;
genre: string;
director: string;
producer: string;
coverImageUrl: string;
// Removed posterImageUrl
projectWebsite: string;
productionBudget: string;
productionCompanyContact: string;
isVerified: boolean;
owner_uid: string;
genres?: string[];
ownerId?: string;
}

interface Review {
id: string;
author: string;
content: string;
createdAt: Date;
projectId: string;
}

const LoadingSpinner: React.FC = () => <div className="text-white text-center mt-10 p-4">Loading...</div>;

const ProjectDetail: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    // Removed posterImage state
    const [reviews, setReviews] = useState<Review[]>([]);
    const [lastVisibleReview, setLastVisibleReview] = useState<QueryDocumentSnapshot | null>(null);
    const [prevReviewPages, setPrevReviewPages] = useState<QueryDocumentSnapshot[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const user = auth.currentUser;

    const [formState, setFormState] = useState<Partial<Project>>({});

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
                        const projectWithDefaults: Project = {
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
                    } else {
                        setError('Project not found.');
                    }
                } else {
                    setError('Project ID is missing.');
                }
            } catch (err: any) {
                console.error("Error fetching project:", err);
                setError(err.message || 'Failed to fetch project data.');
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        } else {
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

    const fetchReviews = async (direction: 'next' | 'prev' | 'reset' = 'reset') => {
        if (!projectId) return;
        setLoadingReviews(true);
        try {
            let q;
            const reviewsCollection = collection(db, 'Projects', projectId, 'Reviews');
            if (direction === 'next' && lastVisibleReview) {
                q = query(reviewsCollection, orderBy('createdAt', 'desc'), startAfter(lastVisibleReview), limit(REVIEWS_PER_PAGE));
            } else if (direction === 'prev') {
                if (prevReviewPages.length <= 1) { setLoadingReviews(false); return; }
                const newPrevPages = prevReviewPages.slice(0, -1);
                const cursorForPrevPage = newPrevPages.length > 1 ? newPrevPages[newPrevPages.length - 2] : null;
                q = cursorForPrevPage ? query(reviewsCollection, orderBy('createdAt', 'desc'), startAfter(cursorForPrevPage), limit(REVIEWS_PER_PAGE))
                                      : query(reviewsCollection, orderBy('createdAt', 'desc'), limit(REVIEWS_PER_PAGE));
                setPrevReviewPages(newPrevPages);
            } else {
                q = query(reviewsCollection, orderBy('createdAt', 'desc'), limit(REVIEWS_PER_PAGE));
                setPrevReviewPages([]);
            }
            const snapshot = await getDocs(q);
            const docs = snapshot.docs;
            const fetchedReviews = docs.map((doc) => ({ id: doc.id, projectId: projectId, ...(doc.data() as Omit<Review, 'id' | 'createdAt' | 'projectId'>), createdAt: doc.data().createdAt?.toDate?.() || new Date() }));
            setReviews(fetchedReviews);
            const newLastVisible = docs.length > 0 ? docs[docs.length - 1] : null;
            setLastVisibleReview(newLastVisible);
            if (direction === 'next' && docs.length > 0) setPrevReviewPages((prev) => [...prev, docs[0]]);
            else if (direction === 'reset' && docs.length > 0) setPrevReviewPages(docs[0] ? [docs[0]] : []);
        } catch (err) {
            if (err instanceof Error) {
                console.error('Failed to fetch reviews:', err);
                setError(err.message || 'Failed to fetch reviews.');
            } else {
                console.error('Failed to fetch reviews:', err);
                setError('Failed to fetch reviews.');
            }
        } finally {
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
        if (project) setFormState({ ...project });
        setCoverImage(null); // Removed setPosterImage
        setError(null);
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setCoverImage(e.target.files[0]);
        else setCoverImage(null);
    };

    // Removed handlePosterImageChange

    const deleteOldImage = async (url: string) => {
        if (!url || !url.startsWith("https://firebasestorage.googleapis.com/")) return;
        try {
            const pathWithQuery = url.split("/o/")[1];
            if (!pathWithQuery) { console.warn("Could not parse path from old image URL:", url); return; }
            const encodedPath = pathWithQuery.split("?")[0];
            const decodedPath = decodeURIComponent(encodedPath);
            const oldRef = ref(storage, decodedPath);
            await deleteObject(oldRef);
            console.log("Old image deleted successfully:", decodedPath);
        } catch (e) {
            if (e && typeof e === 'object' && 'code' in e && e.code === 'storage/object-not-found') {
                console.log("Old image not found:", url);
            } else if (e instanceof Error) {
                console.warn("Could not delete old image:", url, e.message);
            } else {
                console.warn("Could not delete old image:", url, e);
            }
        }
    };

    const uploadImage = async (imageFile: File | null, baseImageName: string) => {
        if (!imageFile) return '';
        if (!projectId) { setError("Project ID is missing for image upload."); return ''; }
        if (!imageFile.type.startsWith("image/")) { setError("Please upload a valid image file."); return ''; }
        const storageRef = ref(storage, `projects/${projectId}/${baseImageName}`);
        try {
            await uploadBytes(storageRef, imageFile);
            return await getDownloadURL(storageRef);
        } catch (uploadError) {
            if (uploadError instanceof Error) {
                console.error("Error uploading image: ", uploadError);
                setError(`Image upload failed: ${uploadError.message}`);
            } else {
                console.error("Error uploading image: ", uploadError);
                setError("Image upload failed.");
            }
            return '';
        }
    };

    const handleSaveClick = async () => {
        if (!project || !projectId) { setError("Cannot save, project data missing."); return; }
        // More robust check for actual changes
        const formKeys = Object.keys(formState) as Array<keyof Project>;
        const hasTextChanged = formKeys.some(key => {
            if (key === 'genres') { // Special handling for arrays
                return JSON.stringify(formState[key] || []) !== JSON.stringify(project[key] || []);
            }
            // REMOVED THE LINE THAT CAUSED THE ERROR: if (key === 'posterImageUrl') { return false; }
            return formState[key] !== project[key];
        });

        // Simplified check for image changes, as only coverImage remains
        if (!hasTextChanged && !coverImage) { setIsEditing(false); return; }

        setLoading(true); setError(null);
        try {
            let newCoverImageUrl = project.coverImageUrl;
            // Removed newPosterImageUrl
            if (coverImage) {
                if (project.coverImageUrl) await deleteOldImage(project.coverImageUrl);
                const coverExtension = coverImage.name.split('.').pop() || 'jpg';
                newCoverImageUrl = await uploadImage(coverImage, `cover_${projectId}_${Date.now()}.${coverExtension}`);
                if (!newCoverImageUrl) { setLoading(false); return; }
            }
            // Removed posterImage upload logic
            const updatedData: Partial<Project> = { ...formState, coverImageUrl: newCoverImageUrl }; // Removed posterImageUrl from here
            if (formState.genres && Array.isArray(formState.genres)) {
                updatedData.genres = formState.genres;
                if (updatedData.hasOwnProperty('genre')) delete (updatedData as any).genre;
            } else if (typeof formState.genre === 'string') {
                updatedData.genres = formState.genre.split(',').map(g => g.trim()).filter(g => g);
                if (updatedData.hasOwnProperty('genre')) delete (updatedData as any).genre;
            }
            const { id, owner_uid, ownerId, ...writableData } = updatedData as any; // ownerId might also be immutable
            // Ensure posterImageUrl is removed from writableData if it somehow remains
            if (writableData.hasOwnProperty('posterImageUrl')) {
                delete (writableData as any).posterImageUrl;
            }
            await updateDoc(doc(db, 'Projects', projectId), writableData);

            // Update local project state
            setProject(prev => {
                if (!prev) return null;
                const newProjectState: Project = {
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
                    delete (newProjectState as any).genre;
                }
                // Ensure posterImageUrl is removed from local state
                if (newProjectState.hasOwnProperty('posterImageUrl')) {
                    delete (newProjectState as any).posterImageUrl;
                }
                return newProjectState;
            });
            // Also update formState to reflect the saved state, including new image URLs
            setFormState(prev => ({...prev, ...writableData, coverImageUrl: newCoverImageUrl})); // Removed posterImageUrl from here

            setCoverImage(null); // Removed setPosterImage
            setIsEditing(false); setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (saveError) {
            if (saveError instanceof Error) {
                console.error("Error updating project:", saveError);
                setError(saveError.message || "Failed to save.");
            } else {
                console.error("Error updating project:", saveError);
                setError("Failed to save.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const genresArray = value.split(',').map(g => g.trim()).filter(g => g);
        setFormState(prev => ({ ...prev, genres: genresArray, genre: value })); // Keep genre string for input field
    };

    const handleSuggestClick = () => {
        const subject = `Suggestion for project: ${project?.projectName}`;
        const body = encodeURIComponent(`I would like to suggest an update for "${project?.projectName}".\n\nDetails:\n`);
        window.location.href = `mailto:admin@example.com?subject=${subject}&body=${body}`; // Replace with your admin email
    };

    const reviewSection = (
        <section className="mt-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Reviews</h2>
            {loadingReviews ? ( <div className="text-gray-400">Loading reviews...</div> ) :
             reviews.length === 0 ? ( <p className="text-gray-400">No reviews yet.</p> ) : (
                <ul className="space-y-4">
                    {reviews.map((r) => (
                        <li key={r.id} className="bg-gray-900 rounded-lg p-5 border border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-teal-400">{r.author}</span>
                                <span className="text-xs text-gray-500">{r.createdAt.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-white">{r.content}</p>
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-8 flex items-center justify-between gap-6">
                <button onClick={() => fetchReviews('prev')} disabled={loadingReviews || prevReviewPages.length <= 1} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-40">← Previous</button>
                <span className="text-gray-400 text-sm">Page {prevReviewPages.length || (reviews.length > 0 ? 1 : 0) }</span>
                <button onClick={() => fetchReviews('next')} disabled={loadingReviews || reviews.length < REVIEWS_PER_PAGE} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-40">Next →</button>
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <Link to="/" className="inline-block mb-6 text-blue-500 hover:text-blue-400 transition-colors">
                ← Back to All Projects
            </Link>

            {isEditing ? (
                // --- EDITING FORM ---
                <form className="max-w-5xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    {saveSuccess && <p className="text-green-500 text-sm mb-4">Project updated successfully!</p>}
                    {/* Form sections from your provided code */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="projectName" className="block text-sm font-medium">Project Name</label><input type="text" id="projectName" name="projectName" value={formState.projectName || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="country" className="block text-sm font-medium">Country</label><input type="text" id="country" name="country" value={formState.country || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="productionCompany" className="block text-sm font-medium">Production Company</label><input type="text" id="productionCompany" name="productionCompany" value={formState.productionCompany || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="status" className="block text-sm font-medium">Status</label><select id="status" name="status" value={formState.status || 'Pre-Production'} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2"><option value="Pre-Production">Pre-Production</option><option value="Development">Development</option><option value="Production">Production</option><option value="Post-Production">Post-Production</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option></select></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Story Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="logline" className="block text-sm font-medium">Logline</label><textarea id="logline" name="logline" value={formState.logline || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" rows={2} /></div>
                            <div><label htmlFor="synopsis" className="block text-sm font-medium">Synopsis</label><textarea id="synopsis" name="synopsis" value={formState.synopsis || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" rows={4} /></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Production Timeline</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="startDate" className="block text-sm font-medium">Start Date</label><input type="date" id="startDate" name="startDate" value={formState.startDate || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="endDate" className="block text-sm font-medium">End Date</label><input type="date" id="endDate" name="endDate" value={formState.endDate || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="genres" className="block text-sm font-medium">Genres (comma-separated)</label><input type="text" id="genres" name="genres" value={(Array.isArray(formState.genres) ? formState.genres.join(', ') : formState.genre) || ''} onChange={handleGenresChange} className="mt-1 w-full border rounded px-3 py-2" placeholder="e.g., Action, Comedy" /></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Creative Team</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="director" className="block text-sm font-medium">Director</label><input type="text" id="director" name="director" value={formState.director || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="producer" className="block text-sm font-medium">Producer</label><input type="text" id="producer" name="producer" value={formState.producer || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div><label htmlFor="coverImage" className="block text-sm font-medium">Cover Image</label><input type="file" id="coverImage" accept="image/*" onChange={handleCoverImageChange} className="mt-1" />{coverImage ? <img src={URL.createObjectURL(coverImage)} alt="New Cover Preview" className="w-36 h-auto mt-2 rounded shadow object-cover" /> : formState.coverImageUrl ? <img src={formState.coverImageUrl} alt="Current Cover" className="w-36 h-auto mt-2 rounded shadow object-cover" /> : null}</div>
                            {/* Removed Poster Image input */}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Additional</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="projectWebsite" className="block text-sm font-medium">Website</label><input type="url" id="projectWebsite" name="projectWebsite" value={formState.projectWebsite || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="productionBudget" className="block text-sm font-medium">Budget</label><input type="text" id="productionBudget" name="productionBudget" value={formState.productionBudget || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="productionCompanyContact" className="block text-sm font-medium">Company Contact</label><input type="text" id="productionCompanyContact" name="productionCompanyContact" value={formState.productionCompanyContact || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                        </div>
                    </div>
                    <div className="pt-4 border-t mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={handleCancelClick} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" disabled={loading}>Cancel</button>
                        <button type="button" onClick={handleSaveClick} disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>{loading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            ) : (
                // --- DISPLAYING PROJECT DETAILS ---
                loading && !project ? ( <LoadingSpinner /> ) :
                error && !project ? ( <p className="text-white text-center mt-10">Error: {error}</p> ) :
                project ? (
                    <div className="max-w-4xl mx-auto py-12">
                        {/* MODIFICATION 1: Small, fixed-size cover image at the top */}
                        {project.coverImageUrl && (
                            <div className="mb-6 flex justify-center"> {/* Centers the image container */}
                                <img
                                    src={project.coverImageUrl}
                                    alt={`${project.projectName} Cover`}
                                    // Example: Fixed width, auto height, max height, contain to fit
                                    className="w-64 h-auto max-h-48 object-contain rounded-md shadow-lg"
                                    // Alternative for fixed aspect ratio (e.g., 16:9) and object-cover:
                                    // className="w-64 h-36 object-cover rounded-md shadow-lg"
                                />
                            </div>
                        )}

                        <ProjectShowcase
                            project={project}
                            userId={user?.uid}
                            // Pass onEditClick if ProjectShowcase itself renders an edit button for the owner.
                            // If the edit button is handled *only* below, this prop might not be needed by ProjectShowcase.
                            onEditClick={handleEditClick}
                        />
                        {reviewSection}

                        {/* MODIFICATION 2: Conditional Edit/Suggest Button */}
                        <div className="mt-10 text-center"> {/* Ensures buttons are centered */}
                            {user && user.uid === project.owner_uid ? (
                                <button
                                    onClick={handleEditClick} // This will set isEditing to true
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                                >
                                    Edit Project
                                </button>
                            ) : (
                                <button
                                    onClick={handleSuggestClick}
                                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                                >
                                    Suggest Update
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-white text-center mt-10">Project not found or not available.</div>
                )
            )}
        </div>
    );
};

export default ProjectDetail;