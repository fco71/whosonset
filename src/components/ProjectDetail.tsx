// src/components/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
    location: string;
    genre: string;
    director: string;
    producer: string;
    coverImageUrl: string;
    posterImageUrl: string;
    projectWebsite: string;
    productionBudget: string;
    productionCompanyContact: string;
    isVerified: boolean;
    owner_uid: string;
}

const ProjectDetail: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [posterImage, setPosterImage] = useState<File | null>(null);

    // Form state object
    const [formState, setFormState] = useState<Partial<Project>>({});

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError(null);
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
                            location: firestoreData.location || '',
                            genre: firestoreData.genre || '',
                            director: firestoreData.director || '',
                            producer: firestoreData.producer || '',
                            coverImageUrl: firestoreData.coverImageUrl || '',
                            posterImageUrl: firestoreData.posterImageUrl || '',
                            projectWebsite: firestoreData.projectWebsite || '',
                            productionBudget: firestoreData.productionBudget || '',
                            productionCompanyContact: firestoreData.productionCompanyContact || '',
                            isVerified: typeof firestoreData.isVerified === 'boolean' ? firestoreData.isVerified : false,
                            owner_uid: firestoreData.owner_uid || '',
                        };
                        setProject(projectWithDefaults);

                        // Initialize form state
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

        fetchProject();
    }, [projectId]);

    const handleEditClick = () => {
        setIsEditing(true);
        setFormState(project!); // Populate form state with current project data
        setError(null);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormState(project!); // Reset form state to original project data
        setCoverImage(null);
        setPosterImage(null);
        setError(null);
    };

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        } else {
            setCoverImage(null);
        }
    };

    const handlePosterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPosterImage(e.target.files[0]);
        } else {
            setPosterImage(null);
        }
    };

    const deleteOldImage = async (url: string) => {
        if (!url || !url.startsWith("https://firebasestorage.googleapis.com/")) return;
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
        } catch (e: any) {
            console.warn("Could not delete old image:", url, e.message);
        }
    };

    const uploadImage = async (imageFile: File | null, baseImageName: string) => {
        if (!imageFile) return '';
        if (!project || !projectId) {
            setError("Project context or ID is missing for image upload.");
            return '';
        }

        if (!imageFile.type.startsWith("image/")) {
            setError("Please upload a valid image file (e.g., JPG, PNG).");
            return '';
        }

        const storageRef = ref(storage, `projects/${projectId}/${baseImageName}`);

        try {
            await uploadBytes(storageRef, imageFile);
            const downloadUrl = await getDownloadURL(storageRef);
            return downloadUrl;
        } catch (uploadError: any) {
            console.error("Error uploading image: ", uploadError);
            setError(`Image upload failed for ${baseImageName}: ${uploadError.message}`);
            return '';
        }
    };

    const handleSaveClick = async () => {
        if (!project || !projectId) {
            setError("Cannot save, project data or ID is missing.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let newCoverImageUrl = project.coverImageUrl;
            let newPosterImageUrl = project.posterImageUrl;

            if (coverImage) {
                if (project.coverImageUrl) {
                    await deleteOldImage(project.coverImageUrl);
                }
                const coverExtension = coverImage.name.split('.').pop() || 'jpg';
                newCoverImageUrl = await uploadImage(coverImage, `cover_${projectId}_${Date.now()}.${coverExtension}`);
                if (!newCoverImageUrl) {
                    setLoading(false);
                    return;
                }
            }

            if (posterImage) {
                if (project.posterImageUrl) {
                    await deleteOldImage(project.posterImageUrl);
                }
                const posterExtension = posterImage.name.split('.').pop() || 'jpg';
                newPosterImageUrl = await uploadImage(posterImage, `poster_${projectId}_${Date.now()}.${posterExtension}`);
                if (!newPosterImageUrl) {
                    setLoading(false);
                    return;
                }
            }

            const projectDocRef = doc(db, 'Projects', projectId);
            const updatedData = {
                ...formState,
                coverImageUrl: newCoverImageUrl,
                posterImageUrl: newPosterImageUrl,
            };

            await updateDoc(projectDocRef, updatedData);

            // Update the local project state
            setProject(prevProject => ({
                ...prevProject!,
                ...updatedData,
                id: projectId,
                owner_uid: prevProject!.owner_uid
            }));

            setCoverImage(null);
            setPosterImage(null);

            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (saveError: any) {
            console.error("Error updating project:", saveError);
            setError(saveError.message || "Failed to save project changes.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (loading && !project && !isEditing) {
        return <p>Loading project details...</p>;
    }

    if (loading && isEditing) {
        return <p>Uploading images and saving changes…</p>;
    }

    if (error && !isEditing && !project) {
        return <p>Error: {error}</p>;
    }

    if (!project) {
        return <p>{error || 'Project not found or not available.'}</p>;
    }

    return (
        <div>
            <h2>Project Detail for ID: {projectId}</h2>
            {isEditing ? (
                <form className="max-w-5xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    {saveSuccess && <p className="text-green-500 text-sm">Project updated successfully!</p>}

                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="projectName" className="block text-sm font-medium">Project Name</label>
                                <input type="text" id="projectName" name="projectName" value={formState.projectName || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-medium">Country</label>
                                <input type="text" id="country" name="country" value={formState.country || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="productionCompany" className="block text-sm font-medium">Production Company</label>
                                <input type="text" id="productionCompany" name="productionCompany" value={formState.productionCompany || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium">Status</label>
                                <select id="status" name="status" value={formState.status || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
                                    <option value="Pre-Production">Pre-Production</option>
                                    <option value="Production">Production</option>
                                    <option value="Post-Production">Post-Production</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Story Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="logline" className="block text-sm font-medium">Logline</label>
                                <textarea id="logline" name="logline" value={formState.logline || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" rows={2} />
                            </div>
                            <div>
                                <label htmlFor="synopsis" className="block text-sm font-medium">Synopsis</label>
                                <textarea id="synopsis" name="synopsis" value={formState.synopsis || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" rows={4} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Production Timeline</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
                                <input type="date" id="startDate" name="startDate" value={formState.startDate || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
                                <input type="date" id="endDate" name="endDate" value={formState.endDate || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium">Location</label>
                                <input type="text" id="location" name="location" value={formState.location || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="genre" className="block text-sm font-medium">Genre</label>
                                <input type="text" id="genre" name="genre" value={formState.genre || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Creative Team</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="director" className="block text-sm font-medium">Director</label>
                                <input type="text" id="director" name="director" value={formState.director || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="producer" className="block text-sm font-medium">Producer</label>
                                <input type="text" id="producer" name="producer" value={formState.producer || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Media</h3>
                        <div className="grid grid-cols-2 gap-4 items-start">
                            <div>
                                <label htmlFor="coverImage" className="block text-sm font-medium">Cover Image</label>
                                <input type="file" id="coverImage" accept="image/*" onChange={handleCoverImageChange} className="mt-1" />
                                {coverImage ? (
                                    <img src={URL.createObjectURL(coverImage)} alt="Preview" className="w-36 mt-2 rounded shadow" />
                                ) : (
                                    <img src={project.coverImageUrl} alt="Current Cover" className="w-36 mt-2 rounded shadow" />
                                )}
                            </div>
                            <div>
                                <label htmlFor="posterImage" className="block text-sm font-medium">Poster Image</label>
                                <input type="file" id="posterImage" accept="image/*" onChange={handlePosterImageChange} className="mt-1" />
                                {posterImage ? (
                                    <img src={URL.createObjectURL(posterImage)} alt="Preview" className="w-36 mt-2 rounded shadow" />
                                ) : (
                                    <img src={project.posterImageUrl} alt="Current Poster" className="w-36 mt-2 rounded shadow" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4 border-b pb-1">Additional</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="projectWebsite" className="block text-sm font-medium">Website</label>
                                <input type="url" id="projectWebsite" name="projectWebsite" value={formState.projectWebsite || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="productionBudget" className="block text-sm font-medium">Budget</label>
                                <input type="text" id="productionBudget" name="productionBudget" value={formState.productionBudget || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                            <div>
                                <label htmlFor="productionCompanyContact" className="block text-sm font-medium">Company Contact</label>
                                <input type="text" id="productionCompanyContact" name="productionCompanyContact" value={formState.productionCompanyContact || ''} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancelClick}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveClick}
                            disabled={loading}
                            className={`px-4 py-2 rounded text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-10">
                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-1">Basic Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">Project Name</label>
                                <input
                                    name="projectName"
                                    value={project?.projectName || ''}
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Status</label>
                                <select
                                    name="status"
                                    value={project?.status || ''}
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                    disabled
                                >
                                    <option value="">Select</option>
                                    <option value="Pre-Production">Pre-Production</option>
                                    <option value="Production">Production</option>
                                    <option value="Post-Production">Post-Production</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <label className="block mb-1">Logline</label>
                            <input
                                name="logline"
                                value={project?.logline || ''}
                                className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                readOnly
                            />
                        </div>
                        <div className="grid grid-cols-1">
                            <label className="block mb-1">Synopsis</label>
                            <textarea
                                name="synopsis"
                                value={project?.synopsis || ''}
                                rows={4}
                                className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                readOnly
                            />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-1">Production Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">Production Company</label>
                                <input
                                    name="productionCompany"
                                    value={project?.productionCompany || ''}
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Country</label>
                                <input
                                    name="country"
                                    value={project?.country || ''}
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={project?.startDate || ''}
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={project?.endDate || ''}
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                    readOnly
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-1">Location</label>
                                <input
                                    name="location"
                                    value={project?.location || ''}
                                    className="w-full bg-gray-800 p-2 rounded border border-gray-700"
                                    readOnly
                                />
                            </div>
                        </div>
                    </section>
                    {auth.currentUser && project?.owner_uid && auth.currentUser.uid === project.owner_uid && (
                        <button onClick={handleEditClick} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Edit Project
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;