// src/components/ProjectDetail.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc, collection, query, orderBy, startAfter, limit, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

import ProjectShowcase from '../components/ProjectShowcase';
// import LoadingSpinner from '../components/LoadingSpinner';
import { imageErrorFallback } from '../utilities/imageErrorFallback';

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



const LoadingSpinner: React.FC = () => <div className="text-white text-center mt-10 p-4">{useTranslation().t('common.loading')}</div>;

const ProjectDetail: React.FC = () => {
    const { t } = useTranslation();
    const { projectId } = useParams<{ projectId: string }>();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImageBlobUrl, setCoverImageBlobUrl] = useState<string | null>(null);
    
    // Track blob URL with ref for proper cleanup
    const coverImageBlobRef = useRef<string | null>(null);
    


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

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            // Clean up blob URL after successful save
            if (coverImageBlobRef.current) {
                URL.revokeObjectURL(coverImageBlobRef.current);
                coverImageBlobRef.current = null;
            }
            setCoverImageBlobUrl(null);
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



    // Cleanup blob URL when component unmounts or when coverImage changes
    useEffect(() => {
        return () => {
            if (coverImageBlobRef.current) {
                URL.revokeObjectURL(coverImageBlobRef.current);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-6">
            <Link to="/projects" className="inline-block mb-6 text-blue-600 hover:text-blue-700 transition-colors font-medium">
                ← {t('projectDetail.backToAllProjects')}
            </Link>

            {isEditing ? (
                // --- EDITING FORM ---
                <form className="max-w-5xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    {saveSuccess && <p className="text-green-500 text-sm mb-4">{t('projectForm.updateSuccess')}</p>}
                    {/* Form sections from your provided code */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">{t('projectForm.basicInfo')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="projectName" className="block text-sm font-medium">{t('projectForm.projectName')}</label><input type="text" id="projectName" name="projectName" value={formState.projectName || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="country" className="block text-sm font-medium">{t('projectForm.country')}</label><input type="text" id="country" name="country" value={formState.country || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="productionCompany" className="block text-sm font-medium">{t('projectForm.productionCompany')}</label><input type="text" id="productionCompany" name="productionCompany" value={formState.productionCompany || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="status" className="block text-sm font-medium">{t('projectForm.status')}</label><select id="status" name="status" value={formState.status || 'Pre-Production'} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
  <option value="Pre-Production">{t('projectStatus.preProduction')}</option>
  <option value="Development">{t('projectStatus.development')}</option>
  <option value="Production">{t('projectStatus.production')}</option>
  <option value="Post-Production">{t('projectStatus.postProduction')}</option>
  <option value="Completed">{t('projectStatus.completed')}</option>
  <option value="Cancelled">{t('projectStatus.cancelled')}</option>
</select></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">{t('projectForm.storyInfo')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="logline" className="block text-sm font-medium">{t('projectForm.logline')}</label><textarea id="logline" name="logline" value={formState.logline || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" rows={2} /></div>
                            <div><label htmlFor="synopsis" className="block text-sm font-medium">{t('projectForm.synopsis')}</label><textarea id="synopsis" name="synopsis" value={formState.synopsis || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" rows={4} /></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">{t('projectForm.productionTimeline')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="startDate" className="block text-sm font-medium">{t('projectForm.startDate')}</label><input type="date" id="startDate" name="startDate" value={formState.startDate || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="endDate" className="block text-sm font-medium">{t('projectForm.endDate')}</label><input type="date" id="endDate" name="endDate" value={formState.endDate || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="genres" className="block text-sm font-medium">{t('projectForm.genres')}</label><input type="text" id="genres" name="genres" value={(Array.isArray(formState.genres) ? formState.genres.join(', ') : formState.genre) || ''} onChange={handleGenresChange} className="mt-1 w-full border rounded px-3 py-2" placeholder={t('projectForm.genresPlaceholder')} /></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">{t('projectForm.creativeTeam')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="director" className="block text-sm font-medium">{t('projectForm.director')}</label><input type="text" id="director" name="director" value={formState.director || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="producer" className="block text-sm font-medium">{t('projectForm.producer')}</label><input type="text" id="producer" name="producer" value={formState.producer || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">{t('projectForm.media')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <div><label htmlFor="coverImage" className="block text-sm font-medium">{t('projectForm.coverImage')}</label><input type="file" id="coverImage" accept="image/*" onChange={handleCoverImageChange} className="mt-1" />{coverImageBlobUrl ? (
  <img src={coverImageBlobUrl} alt={t('projectDetail.newCoverPreview')} className="w-36 h-auto mt-2 rounded shadow object-cover" onError={imageErrorFallback} />
) : formState.coverImageUrl ? (
  <img src={formState.coverImageUrl} alt={t('projectDetail.currentCover')} className="w-36 h-auto mt-2 rounded shadow object-cover" onError={imageErrorFallback} />
) : null}</div>
                            {/* Removed Poster Image input */}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">{t('projectForm.additional')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label htmlFor="projectWebsite" className="block text-sm font-medium">{t('projectForm.website')}</label><input type="url" id="projectWebsite" name="projectWebsite" value={formState.projectWebsite || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="productionBudget" className="block text-sm font-medium">{t('projectForm.budget')}</label><input type="text" id="productionBudget" name="productionBudget" value={formState.productionBudget || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                            <div><label htmlFor="productionCompanyContact" className="block text-sm font-medium">{t('projectForm.companyContact')}</label><input type="text" id="productionCompanyContact" name="productionCompanyContact" value={formState.productionCompanyContact || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" /></div>
                        </div>
                    </div>
                    <div className="pt-4 border-t mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={handleCancelClick} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" disabled={loading}>{t('projectForm.cancel')}</button>
                        <button type="button" onClick={handleSaveClick} disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>{loading ? t('projectForm.saving') : t('projectForm.saveChanges')}</button>
                    </div>
                </form>
            ) : (
                // --- DISPLAYING PROJECT DETAILS ---
                loading && !project ? ( <LoadingSpinner /> ) :
                error && !project ? ( <p className="text-gray-600 text-center mt-10">Error: {error}</p> ) :
                project ? (
                    <div className="max-w-4xl mx-auto py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                        {/* Project Header */}
                        <div className="px-8 py-6 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    {project.projectName}
                                </h1>
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        project.status === 'Development' ? 'bg-yellow-100 text-yellow-800' :
                                        project.status === 'Pre-Production' ? 'bg-blue-100 text-blue-800' :
                                        project.status === 'Production' ? 'bg-green-100 text-green-800' :
                                        project.status === 'Post-Production' ? 'bg-purple-100 text-purple-800' :
                                        project.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                            
                            {project.productionCompany && (
                                <p className="text-lg text-gray-600 mb-2">
                                    {project.productionCompany}
                                </p>
                            )}
                            
                            {project.genre && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-500">Genre:</span>
                                    <span className="text-sm font-medium text-gray-700">{project.genre}</span>
                                </div>
                            )}
                        </div>

                        {/* Cover Image */}
                        {project.coverImageUrl && (
                            <div className="px-8 py-6">
                                <img
                                    src={project.coverImageUrl}
                                    alt={`${project.projectName} ${t('projectDetail.coverAlt')}`}
                                    className="w-full max-w-2xl mx-auto h-auto max-h-96 object-cover rounded-xl shadow-lg"
                                    onError={imageErrorFallback}
                                />
                            </div>
                        )}

                        {/* Project Content */}
                        <div className="px-8 py-6">
                            <ProjectShowcase
                                project={project}
                                userId={currentUser?.uid}
                                onEditClick={handleEditClick}
                            />

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                {currentUser && currentUser.uid === project.owner_uid ? (
                                    <div className="flex gap-4 justify-center">
                                        <Link
                                            to={`/projects/${projectId}/manage`}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                        >
                                            {t('projects.manageProject')}
                                        </Link>
                                        <button
                                            onClick={handleEditClick}
                                            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                        >
                                            {t('projects.editProject')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <button
                                            onClick={handleSuggestClick}
                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                                        >
                                            {t('projects.suggestUpdate')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-600 text-center mt-10">{t('projects.projectNotFound')}</div>
                )
            )}
        </div>
    );
};

export default ProjectDetail;