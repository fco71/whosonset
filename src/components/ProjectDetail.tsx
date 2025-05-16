// src/components/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Improvement 2: Added deleteObject

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

    // State variables for editing
    const [projectName, setProjectName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [productionCompany, setProductionCompany] = useState<string>('');
    const [status, setStatus] = useState<string>('Pre-Production');
    const [logline, setLogline] = useState<string>('');
    const [synopsis, setSynopsis] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
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
                        const projectData = projectDocSnapshot.data() as Project;
                        const fullProjectData = {
                            ...projectData,
                            id: projectDocSnapshot.id,
                        };
                        setProject(fullProjectData);

                        // Initialize editing state
                        setProjectName(projectData.projectName);
                        setCountry(projectData.country);
                        setProductionCompany(projectData.productionCompany);
                        setStatus(projectData.status);
                        setLogline(projectData.logline);
                        setSynopsis(projectData.synopsis);
                        setStartDate(projectData.startDate);
                        setEndDate(projectData.endDate);
                        setLocation(projectData.location);
                        setGenre(projectData.genre);
                        setDirector(projectData.director === undefined ? '' : projectData.director);
                        setProducer(projectData.producer === undefined ? '' : projectData.producer);
                        setCoverImageUrl(projectData.coverImageUrl || '');
                        setPosterImageUrl(projectData.posterImageUrl || '');
                        setProjectWebsite(projectData.projectWebsite || '');
                        setProductionBudget(projectData.productionBudget || '');
                        setProductionCompanyContact(projectData.productionCompanyContact || '');
                        setIsVerified(projectData.isVerified || false);

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
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        if (project) {
            setProjectName(project.projectName);
            setCountry(project.country);
            setProductionCompany(project.productionCompany);
            setStatus(project.status);
            setLogline(project.logline);
            setSynopsis(project.synopsis);
            setStartDate(project.startDate);
            setEndDate(project.endDate);
            setLocation(project.location);
            setGenre(project.genre);
            setDirector(project.director || '');
            setProducer(project.producer || '');
            setCoverImage(null);
            setPosterImage(null);
            setCoverImageUrl(project.coverImageUrl);
            setPosterImageUrl(project.posterImageUrl);
            setProjectWebsite(project.projectWebsite);
            setProductionBudget(project.productionBudget);
            setProductionCompanyContact(project.productionCompanyContact);
            setIsVerified(project.isVerified);
            setError(null); // Clear any previous save errors
        }
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

    // Improvement 2: New function to delete old image
    const deleteOldImage = async (url: string) => {
        if (!url) return;
        try {
            // Extract the path from the URL. Firebase Storage URLs typically look like:
            // https://firebasestorage.googleapis.com/v0/b/your-bucket/o/path%2Fto%2Fimage.jpg?alt=media&token=...
            // We need "path/to/image.jpg"
            const pathWithQuery = url.split("/o/")[1];
            const encodedPath = pathWithQuery.split("?")[0];
            const decodedPath = decodeURIComponent(encodedPath);
            const oldRef = ref(storage, decodedPath);
            await deleteObject(oldRef);
            console.log("Old image deleted successfully:", decodedPath);
        } catch (e: any) {
            // If deletion fails (e.g., file not found, permissions), log warning but don't block update.
            console.warn("Could not delete old image:", url, e.message);
        }
    };


    const uploadImage = async (imageFile: File | null, baseImageName: string) => {
        if (!imageFile) return '';
        if (!project) {
            setError("Project context is missing for image upload.");
            return '';
        }

        // Improvement 4: Image type validation
        if (!imageFile.type.startsWith("image/")) {
            setError("Please upload a valid image file (e.g., JPG, PNG).");
            return ''; // Indicate failure
        }

        // Improvement 1: Use new storage path structure projects/{projectId}/{imageName}
        // baseImageName here is the intended filename, e.g., "cover_projectID" or "poster_projectID"
        const storageRef = ref(storage, `projects/${project.id}/${baseImageName}`);

        try {
            await uploadBytes(storageRef, imageFile);
            const downloadUrl = await getDownloadURL(storageRef);
            return downloadUrl;
        } catch (uploadError: any) {
            console.error("Error uploading image: ", uploadError);
            setError(`Image upload failed for ${baseImageName}: ${uploadError.message}`);
            return ''; // Indicate failure
        }
    };

    const handleSaveClick = async () => {
        if (!project) return;

        setLoading(true);
        setError(null); // Clear previous errors

        try {
            let newCoverImageUrl = project.coverImageUrl; // Keep old URL by default
            let newPosterImageUrl = project.posterImageUrl; // Keep old URL by default

            // Handle Cover Image
            if (coverImage) { // If a new cover image file is selected
                if (project.coverImageUrl) { // And if there was an old cover image
                    await deleteOldImage(project.coverImageUrl); // Improvement 2: Delete old one
                }
                // Use a consistent name for the cover image, including project.id for uniqueness within its folder
                newCoverImageUrl = await uploadImage(coverImage, `cover_${project.id}_${Date.now()}.${coverImage.name.split('.').pop()}`);
                if (!newCoverImageUrl) { // If uploadImage returned empty string (error)
                    // Error is already set by uploadImage, so just stop further processing
                    setLoading(false);
                    return;
                }
            }

            // Handle Poster Image
            if (posterImage) { // If a new poster image file is selected
                if (project.posterImageUrl) { // And if there was an old poster image
                    await deleteOldImage(project.posterImageUrl); // Improvement 2: Delete old one
                }
                 // Use a consistent name for the poster image
                newPosterImageUrl = await uploadImage(posterImage, `poster_${project.id}_${Date.now()}.${posterImage.name.split('.').pop()}`);
                if (!newPosterImageUrl) { // If uploadImage returned empty string (error)
                    setLoading(false);
                    return;
                }
            }

            const projectDocRef = doc(db, 'Projects', project.id);
            const updatedData = {
                projectName,
                country,
                productionCompany,
                status,
                logline,
                synopsis,
                startDate,
                endDate,
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

            await updateDoc(projectDocRef, updatedData);

            // Update local project state
            setProject(prevProject => ({
                ...prevProject!,
                ...updatedData
            }));

            setCoverImage(null); // Clear file input state
            setPosterImage(null); // Clear file input state
            setCoverImageUrl(newCoverImageUrl); // Update state with new URL
            setPosterImageUrl(newPosterImageUrl); // Update state with new URL
            setIsEditing(false);

        } catch (saveError: any) {
            console.error("Error updating project:", saveError.message);
            setError(saveError.message || "Failed to save project changes.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isEditing) { // Only show full page loading if not in edit mode's own loading
        return <p>Loading project details...</p>;
    }
    
    // Improvement 3: Show specific loading message when saving/uploading from edit mode
    if (loading && isEditing) {
        return <p>Uploading images and saving changes…</p>;
    }


    if (error && !isEditing) { // Only show full page error if not related to edit mode validation
        return <p>Error: {error}</p>;
    }

    if (!project && !loading) { // If not loading and project is still null
        return <p>Project not found.</p>;
    }
    
    if (!project) { // Fallback if project is null after loading (e.g. fetch error not caught well)
         return <p>Loading project details or project not available...</p>;
    }


    return (
        <div>
            <h2>Project Detail</h2>
            {isEditing ? (
                <div>
                    {/* Display general error messages during editing, if any */}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    <div>
                        <label htmlFor="projectName">Project Name:</label>
                        <input
                            type="text"
                            id="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="country">Country:</label>
                        <input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="productionCompany">Production Company:</label>
                        <input
                            type="text"
                            id="productionCompany"
                            value={productionCompany}
                            onChange={(e) => setProductionCompany(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pre-Production">Pre-Production</option>
                            <option value="Production">Production</option>
                            <option value="Post-Production">Post-Production</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="logline">Logline:</label>
                        <textarea
                            id="logline"
                            value={logline}
                            onChange={(e) => setLogline(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="synopsis">Synopsis:</label>
                        <textarea
                            id="synopsis"
                            value={synopsis}
                            onChange={(e) => setSynopsis(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="genre">Genre:</label>
                        <input
                            type="text"
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="director">Director:</label>
                        <input
                            type="text"
                            id="director"
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="producer">Producer:</label>
                        <input
                            type="text"
                            id="producer"
                            value={producer}
                            onChange={(e) => setProducer(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="coverImage">Cover Image:</label>
                        <input type="file" id="coverImage" accept="image/*" onChange={handleCoverImageChange} />
                        {coverImage ? (
                            <img
                                src={URL.createObjectURL(coverImage)}
                                alt="Cover image preview" // Improvement 5
                                style={{ width: '150px', marginTop: '8px' }}
                            />
                        ) : (
                            coverImageUrl && (
                                <img
                                    src={coverImageUrl}
                                    alt="Current Cover"
                                    style={{ width: '150px', marginTop: '8px' }}
                                />
                            )
                        )}
                    </div>
                    <div>
                        <label htmlFor="posterImage">Poster Image:</label>
                        <input type="file" id="posterImage" accept="image/*" onChange={handlePosterImageChange} />
                        {posterImage ? (
                            <img
                                src={URL.createObjectURL(posterImage)}
                                alt="Poster image preview" // Improvement 5
                                style={{ width: '150px', marginTop: '8px' }}
                            />
                        ) : (
                            posterImageUrl && (
                                <img
                                    src={posterImageUrl}
                                    alt="Current Poster"
                                    style={{ width: '150px', marginTop: '8px' }}
                                />
                            )
                        )}
                    </div>
                    <div>
                        <label htmlFor="projectWebsite">Project Website:</label>
                        <input
                            type="url"
                            id="projectWebsite"
                            value={projectWebsite}
                            onChange={(e) => setProjectWebsite(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="productionBudget">Production Budget:</label>
                        <input
                            type="text"
                            id="productionBudget"
                            value={productionBudget}
                            onChange={(e) => setProductionBudget(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="productionCompanyContact">Production Company Contact:</label>
                        <input
                            type="text"
                            id="productionCompanyContact"
                            value={productionCompanyContact}
                            onChange={(e) => setProductionCompanyContact(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="isVerified">Verified:</label>
                        <input
                            type="checkbox"
                            id="isVerified"
                            checked={isVerified}
                            onChange={(e) => setIsVerified(e.target.checked)}
                        />
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
                    <p><strong>Start Date:</strong> {project.startDate}</p>
                    <p><strong>End Date:</strong> {project.endDate}</p>
                    <p><strong>Location:</strong> {project.location}</p>
                    <p><strong>Genre:</strong> {project.genre}</p>
                    <p><strong>Director:</strong> {project.director}</p>
                    <p><strong>Producer:</strong> {project.producer}</p>
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
                    <p><strong>Production Budget:</strong> {project.productionBudget}</p>
                    <p><strong>Production Company Contact:</strong> {project.productionCompanyContact}</p>
                    <p><strong>Verified:</strong> {project.isVerified ? 'Yes' : 'No'}</p>
                    {auth.currentUser && auth.currentUser.uid === project.owner_uid && (
                        <button onClick={handleEditClick}>Edit</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;