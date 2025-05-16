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
    startDate: string; // Expects a string (e.g., "YYYY-MM-DD" or "")
    endDate: string;   // Expects a string (e.g., "YYYY-MM-DD" or "")
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

    // State variables for editing
    const [projectName, setProjectName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [productionCompany, setProductionCompany] = useState<string>('');
    const [status, setStatus] = useState<string>('Pre-Production');
    const [logline, setLogline] = useState<string>('');
    const [synopsis, setSynopsis] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(''); // Initialized to empty string
    const [endDate, setEndDate] = useState<string>('');     // Initialized to empty string
    const [location, setLocation] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [director, setDirector] = useState<string>('');
    const [producer, setProducer] = useState<string>('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [posterImage, setPosterImage] = useState<File | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string>('');
    const [posterImageUrl, setPosterImageUrl] = useState<string>('');
    const [projectWebsite, setProjectWebsite] = useState<string>('');
    const [productionBudget, setProductionBudget] = useState<string>('');
    const [productionCompanyContact, setProductionCompanyContact] = useState<string>('');
    const [isVerified, setIsVerified] = useState<boolean>(false);

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            setError(null);
            try {
                if (projectId) {
                    const projectDocRef = doc(db, 'Projects', projectId);
                    const projectDocSnapshot = await getDoc(projectDocRef);

                    if (projectDocSnapshot.exists()) {
                        const firestoreData = projectDocSnapshot.data(); // Get raw data

                        // Create a complete project object with defaults for missing fields
                        // This ensures conformity with the Project interface and avoids undefined values for strings/booleans.
                        const projectWithDefaults: Project = {
                            id: projectDocSnapshot.id,
                            projectName: firestoreData.projectName || '',
                            country: firestoreData.country || '',
                            productionCompany: firestoreData.productionCompany || '',
                            status: firestoreData.status || 'Pre-Production', // Default if not present
                            logline: firestoreData.logline || '',
                            synopsis: firestoreData.synopsis || '',
                            startDate: firestoreData.startDate || '', // FIX: Default to empty string
                            endDate: firestoreData.endDate || '',     // FIX: Default to empty string
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
                            owner_uid: firestoreData.owner_uid || '', // Assuming owner_uid should ideally exist
                        };
                        setProject(projectWithDefaults);

                        // Initialize editing state variables from the sanitized 'projectWithDefaults'
                        setProjectName(projectWithDefaults.projectName);
                        setCountry(projectWithDefaults.country);
                        setProductionCompany(projectWithDefaults.productionCompany);
                        setStatus(projectWithDefaults.status);
                        setLogline(projectWithDefaults.logline);
                        setSynopsis(projectWithDefaults.synopsis);
                        setStartDate(projectWithDefaults.startDate); // Now defaults to '' if originally undefined
                        setEndDate(projectWithDefaults.endDate);     // Now defaults to '' if originally undefined
                        setLocation(projectWithDefaults.location);
                        setGenre(projectWithDefaults.genre);
                        setDirector(projectWithDefaults.director);
                        setProducer(projectWithDefaults.producer);
                        setCoverImageUrl(projectWithDefaults.coverImageUrl);
                        setPosterImageUrl(projectWithDefaults.posterImageUrl);
                        setProjectWebsite(projectWithDefaults.projectWebsite);
                        setProductionBudget(projectWithDefaults.productionBudget);
                        setProductionCompanyContact(projectWithDefaults.productionCompanyContact);
                        setIsVerified(projectWithDefaults.isVerified);

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
        // Note: No need to reset form fields here if they are already populated from useEffect
        // If you want to ensure they are reset from the `project` state every time edit is clicked:
        if (project) {
            setProjectName(project.projectName);
            setCountry(project.country);
            setProductionCompany(project.productionCompany);
            setStatus(project.status);
            setLogline(project.logline);
            setSynopsis(project.synopsis);
            setStartDate(project.startDate); // project.startDate is already sanitized
            setEndDate(project.endDate);     // project.endDate is already sanitized
            setLocation(project.location);
            setGenre(project.genre);
            setDirector(project.director);
            setProducer(project.producer);
            setCoverImageUrl(project.coverImageUrl);
            setPosterImageUrl(project.posterImageUrl);
            setProjectWebsite(project.projectWebsite);
            setProductionBudget(project.productionBudget);
            setProductionCompanyContact(project.productionCompanyContact);
            setIsVerified(project.isVerified);
            setCoverImage(null); // Clear any staged file
            setPosterImage(null); // Clear any staged file
            setError(null);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        // Reset fields to the original project values (which are now sanitized)
        if (project) {
            setProjectName(project.projectName);
            setCountry(project.country);
            setProductionCompany(project.productionCompany);
            setStatus(project.status);
            setLogline(project.logline);
            setSynopsis(project.synopsis);
            setStartDate(project.startDate); // project.startDate is already sanitized
            setEndDate(project.endDate);     // project.endDate is already sanitized
            setLocation(project.location);
            setGenre(project.genre);
            setDirector(project.director);
            setProducer(project.producer);
            setCoverImage(null);
            setPosterImage(null);
            setCoverImageUrl(project.coverImageUrl); // Reset to original URL
            setPosterImageUrl(project.posterImageUrl); // Reset to original URL
            setProjectWebsite(project.projectWebsite);
            setProductionBudget(project.productionBudget);
            setProductionCompanyContact(project.productionCompanyContact);
            setIsVerified(project.isVerified);
            setError(null); // Clear any previous save errors
        }
    };

    // ... (rest of your handleCoverImageChange, handlePosterImageChange, deleteOldImage, uploadImage functions remain the same)

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
        if (!url || !url.startsWith("https://firebasestorage.googleapis.com/")) return; // Basic check
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
        if (!project) { // Should use projectId directly if project might not be fully set yet
            setError("Project context is missing for image upload.");
            return '';
        }
         if (!projectId) { // Guard against missing projectId
            setError("Project ID is missing for image upload.");
            return '';
        }


        if (!imageFile.type.startsWith("image/")) {
            setError("Please upload a valid image file (e.g., JPG, PNG).");
            return '';
        }

        const storageRef = ref(storage, `projects/${projectId}/${baseImageName}`); // Use projectId from params

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
        if (!project || !projectId) { // Added !projectId check
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
                // Ensure unique enough name using Date.now() and original extension
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

            const projectDocRef = doc(db, 'Projects', projectId); // Use projectId from params
            const updatedData: Omit<Project, 'id' | 'owner_uid'> = { // Be more precise about what's updatable
                projectName,
                country,
                productionCompany,
                status,
                logline,
                synopsis,
                startDate, // This state variable should now be '' if it was undefined, not undefined itself
                endDate,   // This state variable should now be '' if it was undefined, not undefined itself
                location,
                genre,
                director,
                producer,
                coverImageUrl: newCoverImageUrl,
                posterImageUrl: newPosterImageUrl,
                projectWebsite,
                productionBudget,
                productionCompanyContact,
                isVerified,
            };

            // console.log("Data being sent to updateDoc:", updatedData); // DEBUG line

            await updateDoc(projectDocRef, updatedData);

            setProject(prevProject => ({
                ...prevProject!, // We know project is not null here due to the guard clause
                ...updatedData,  // Spread the successfully updated fields
                id: projectId, // ensure id is present
                owner_uid: prevProject!.owner_uid // ensure owner_uid is present
            }));

            setCoverImage(null);
            setPosterImage(null);
            // The individual URL states (coverImageUrl, posterImageUrl) will be updated via setProject
            // Or if you want to keep them separate for some reason:
            setCoverImageUrl(newCoverImageUrl);
            setPosterImageUrl(newPosterImageUrl);

            setIsEditing(false);

        } catch (saveError: any) {
            console.error("Error updating project:", saveError); // Log the full error
            setError(saveError.message || "Failed to save project changes.");
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of your JSX and loading/error display logic)
    // Make sure to use projectId from useParams in JSX where needed if project might be null initially

    if (loading && !project && !isEditing) { // More specific initial loading
        return <p>Loading project details...</p>;
    }
    
    if (loading && isEditing) {
        return <p>Uploading images and saving changes…</p>;
    }

    if (error && !isEditing && !project) { // Show error if project couldn't be fetched
        return <p>Error: {error}</p>;
    }
    
    if (!project) { // If still no project after loading/error checks (e.g. not found)
         return <p>{error || 'Project not found or not available.'}</p>; // Display existing error or generic message
    }

    // --- Render Logic from here assumes 'project' is not null ---

    return (
        <div>
            <h2>Project Detail for ID: {projectId}</h2> {/* Display projectId for clarity */}
            {isEditing ? (
                <div>
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    {/* Project Name */}
                    <div>
                        <label htmlFor="projectName">Project Name:</label>
                        <input type="text" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                    </div>
                    {/* Country */}
                    <div>
                        <label htmlFor="country">Country:</label>
                        <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>
                    {/* Production Company */}
                    <div>
                        <label htmlFor="productionCompany">Production Company:</label>
                        <input type="text" id="productionCompany" value={productionCompany} onChange={(e) => setProductionCompany(e.target.value)} />
                    </div>
                    {/* Status */}
                    <div>
                        <label htmlFor="status">Status:</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Pre-Production">Pre-Production</option>
                            <option value="Production">Production</option>
                            <option value="Post-Production">Post-Production</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    {/* Logline */}
                    <div>
                        <label htmlFor="logline">Logline:</label>
                        <textarea id="logline" value={logline} onChange={(e) => setLogline(e.target.value)} />
                    </div>
                    {/* Synopsis */}
                    <div>
                        <label htmlFor="synopsis">Synopsis:</label>
                        <textarea id="synopsis" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
                    </div>
                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate">Start Date:</label>
                        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate">End Date:</label>
                        <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    {/* Location */}
                    <div>
                        <label htmlFor="location">Location:</label>
                        <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    {/* Genre */}
                    <div>
                        <label htmlFor="genre">Genre:</label>
                        <input type="text" id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
                    </div>
                    {/* Director */}
                    <div>
                        <label htmlFor="director">Director:</label>
                        <input type="text" id="director" value={director} onChange={(e) => setDirector(e.target.value)} />
                    </div>
                    {/* Producer */}
                    <div>
                        <label htmlFor="producer">Producer:</label>
                        <input type="text" id="producer" value={producer} onChange={(e) => setProducer(e.target.value)} />
                    </div>
                    {/* Cover Image */}
                    <div>
                        <label htmlFor="coverImage">Cover Image:</label>
                        <input type="file" id="coverImage" accept="image/*" onChange={handleCoverImageChange} />
                        {coverImage ? (
                            <img src={URL.createObjectURL(coverImage)} alt="Cover image preview" style={{ width: '150px', marginTop: '8px' }} />
                        ) : (
                            coverImageUrl && <img src={coverImageUrl} alt="Current Cover" style={{ width: '150px', marginTop: '8px' }} />
                        )}
                    </div>
                    {/* Poster Image */}
                    <div>
                        <label htmlFor="posterImage">Poster Image:</label>
                        <input type="file" id="posterImage" accept="image/*" onChange={handlePosterImageChange} />
                        {posterImage ? (
                            <img src={URL.createObjectURL(posterImage)} alt="Poster image preview" style={{ width: '150px', marginTop: '8px' }} />
                        ) : (
                            posterImageUrl && <img src={posterImageUrl} alt="Current Poster" style={{ width: '150px', marginTop: '8px' }} />
                        )}
                    </div>
                    {/* Project Website */}
                    <div>
                        <label htmlFor="projectWebsite">Project Website:</label>
                        <input type="url" id="projectWebsite" value={projectWebsite} onChange={(e) => setProjectWebsite(e.target.value)} />
                    </div>
                    {/* Production Budget */}
                    <div>
                        <label htmlFor="productionBudget">Production Budget:</label>
                        <input type="text" id="productionBudget" value={productionBudget} onChange={(e) => setProductionBudget(e.target.value)} />
                    </div>
                    {/* Production Company Contact */}
                    <div>
                        <label htmlFor="productionCompanyContact">Production Company Contact:</label>
                        <input type="text" id="productionCompanyContact" value={productionCompanyContact} onChange={(e) => setProductionCompanyContact(e.target.value)} />
                    </div>
                    {/* Verified */}
                    <div>
                        <label htmlFor="isVerified">Verified:</label>
                        <input type="checkbox" id="isVerified" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} />
                    </div>
                    <button onClick={handleSaveClick} disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={handleCancelClick} disabled={loading}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p><strong>Project Name:</strong> {project.projectName}</p>
                    <p><strong>Country:</strong> {project.country}</p>
                    <p><strong>Production Company:</strong> {project.productionCompany}</p>
                    <p><strong>Status:</strong> {project.status}</p>
                    <p><strong>Logline:</strong> {project.logline}</p>
                    <p><strong>Synopsis:</strong> {project.synopsis}</p>
                    <p><strong>Start Date:</strong> {project.startDate || 'N/A'}</p> {/* Display N/A if empty string */}
                    <p><strong>End Date:</strong> {project.endDate || 'N/A'}</p>   {/* Display N/A if empty string */}
                    <p><strong>Location:</strong> {project.location}</p>
                    <p><strong>Genre:</strong> {project.genre}</p>
                    <p><strong>Director:</strong> {project.director || 'N/A'}</p>
                    <p><strong>Producer:</strong> {project.producer || 'N/A'}</p>
                    {project.coverImageUrl && (
                        <div>
                            <strong>Cover Image:</strong><br />
                            <img src={project.coverImageUrl} alt={`${project.projectName} Cover`} style={{ maxWidth: '200px' }} />
                        </div>
                    )}
                    {project.posterImageUrl && (
                        <div>
                            <strong>Poster Image:</strong><br />
                            <img src={project.posterImageUrl} alt={`${project.projectName} Poster`} style={{ maxWidth: '200px' }} />
                        </div>
                    )}
                    <p><strong>Project Website:</strong> {project.projectWebsite ? <a href={project.projectWebsite.startsWith('http') ? project.projectWebsite : `http://${project.projectWebsite}`} target="_blank" rel="noopener noreferrer">{project.projectWebsite}</a> : 'N/A'}</p>
                    <p><strong>Production Budget:</strong> {project.productionBudget || 'N/A'}</p>
                    <p><strong>Production Company Contact:</strong> {project.productionCompanyContact || 'N/A'}</p>
                    <p><strong>Verified:</strong> {project.isVerified ? 'Yes' : 'No'}</p>
                    {auth.currentUser && project.owner_uid && auth.currentUser.uid === project.owner_uid && ( // Check project.owner_uid
                        <button onClick={handleEditClick}>Edit</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;