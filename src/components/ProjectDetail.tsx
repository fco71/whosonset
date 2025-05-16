// src/components/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth, storage } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
    const [coverImage, setCoverImage] = useState<File | null>(null); // State for image file
    const [posterImage, setPosterImage] = useState<File | null>(null); // State for poster file
    const [coverImageUrl, setCoverImageUrl] = useState<string>(''); // Stored URL for the image
    const [posterImageUrl, setPosterImageUrl] = useState<string>(''); // Stored URL for the poster
    const [projectWebsite, setProjectWebsite] = useState<string>('');
    const [productionBudget, setProductionBudget] = useState<string>('');
    const [productionCompanyContact, setProductionCompanyContact] = useState<string>('');
    const [isVerified, setIsVerified] = useState<boolean>(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (projectId) {
                    const projectDocRef = doc(db, 'Projects', projectId);
                    const projectDocSnapshot = await getDoc(projectDocRef);

                    if (projectDocSnapshot.exists()) {
                        const projectData = projectDocSnapshot.data() as Project;

                        setProject({
                            ...projectData,
                            id: projectDocSnapshot.id,
                        });

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
                        setCoverImageUrl(projectData.coverImageUrl);
                        setPosterImageUrl(projectData.posterImageUrl);
                        setProjectWebsite(projectData.projectWebsite);
                        setProductionBudget(projectData.productionBudget);
                        setProductionCompanyContact(projectData.productionCompanyContact);
                        setIsVerified(projectData.isVerified);

                    } else {
                        setError('Project not found.');
                    }
                } else {
                    setError('Project ID is missing.');
                }
            } catch (error: any) {
                setError(error.message);
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
    };

    const handleCoverImageChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handlePosterImageChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setPosterImage(e.target.files[0]);
        }
    };

    const uploadImage = async (image: File | null, imageName: string) => {
        if (!image) return '';

        const storageRef = ref(storage, `images/${imageName}`);

        try {
            await uploadBytes(storageRef, image);
            const url = await getDownloadURL(storageRef);
            return url;
        } catch (error: any) {
            console.error("Error uploading image: ", error);
            setError(error.message);
            return '';
        }
    };

    const handleSaveClick = async () => {
        if (!project) return;

        try {
            setLoading(true); // Start loading before uploads

            // Upload images and get URLs
            const newCoverImageUrl = await uploadImage(coverImage, `cover_${project.id}`);
            const newPosterImageUrl = await uploadImage(posterImage, `poster_${project.id}`);

            const projectDocRef = doc(db, 'Projects', project.id);
            await updateDoc(projectDocRef, {
                projectName: projectName,
                country: country,
                productionCompany: productionCompany,
                status: status,
                logline: logline,
                synopsis: synopsis,
                startDate: startDate,
                endDate: endDate,
                location: location,
                genre: genre,
                director: director,
                producer: producer,
                coverImageUrl: newCoverImageUrl || coverImageUrl, // Use new URL if uploaded, else keep old
                posterImageUrl: newPosterImageUrl || posterImageUrl,
                projectWebsite: projectWebsite,
                productionBudget: productionBudget,
                productionCompanyContact: productionCompanyContact,
                isVerified: isVerified,
            });

            // Update local state with new values
            setProject({
                ...project,
                projectName: projectName,
                country: country,
                productionCompany: productionCompany,
                status: status,
                logline: logline,
                synopsis: synopsis,
                startDate: startDate,
                endDate: endDate,
                location: location,
                genre: genre,
                director: director,
                producer: producer,
                coverImageUrl: newCoverImageUrl || coverImageUrl,
                posterImageUrl: newPosterImageUrl || posterImageUrl,
                projectWebsite: projectWebsite,
                productionBudget: productionBudget,
                productionCompanyContact: productionCompanyContact,
                isVerified: isVerified,
                id: project.id
            });

            setIsEditing(false);
        } catch (error: any) {
            console.error("Error updating project:", error.message);
            setError(error.message);
        } finally {
            setLoading(false); // End loading whether success or fail
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!project) {
        return <p>Project not found.</p>;
    }

    return (
        <div>
            <h2>Project Detail</h2>
            {isEditing ? (
                <div>
                    <div>
                        <label htmlFor="projectName">Project Name:</label>
                        <input
                            type="text"
                            id="projectName"
                            value={projectName}
                            onChange={(e) => setProjectName((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="country">Country:</label>
                        <input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="productionCompany">Production Company:</label>
                        <input
                            type="text"
                            id="productionCompany"
                            value={productionCompany}
                            onChange={(e) => setProductionCompany((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus((e.target as HTMLSelectElement).value)}
                        >
                            <option value="Pre-Production">Pre-Production</option>
                            <option value="Filming">Filming</option>
                            <option value="Post-Production">Post-Production</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="logline">Logline:</label>
                        <textarea
                            id="logline"
                            value={logline}
                            onChange={(e) => setLogline((e.target as HTMLTextAreaElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="synopsis">Synopsis:</label>
                        <textarea
                            id="synopsis"
                            value={synopsis}
                            onChange={(e) => setSynopsis((e.target as HTMLTextAreaElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            type="text"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="text"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="genre">Genre:</label>
                        <input
                            type="text"
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="director">Director:</label>
                        <input
                            type="text"
                            id="director"
                            value={director}
                            onChange={(e) => setDirector((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="producer">Producer:</label>
                        <input
                            type="text"
                            id="producer"
                            value={producer}
                            onChange={(e) => setProducer((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="coverImage">Cover Image:</label>
                        <input
                            type="file"
                            id="coverImage"
                            onChange={handleCoverImageChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="posterImage">Poster Image:</label>
                        <input
                            type="file"
                            id="posterImage"
                            onChange={handlePosterImageChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="projectWebsite">Project Website:</label>
                        <input
                            type="text"
                            id="projectWebsite"
                            value={projectWebsite}
                            onChange={(e) => setProjectWebsite((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="productionBudget">Production Budget:</label>
                        <input
                            type="text"
                            id="productionBudget"
                            value={productionBudget}
                            onChange={(e) => setProductionBudget((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="productionCompanyContact">Production Company Contact:</label>
                        <input
                            type="text"
                            id="productionCompanyContact"
                            value={productionCompanyContact}
                            onChange={(e) => setProductionCompanyContact((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="isVerified">Is Verified:</label>
                        <input
                            type="checkbox"
                            id="isVerified"
                            checked={isVerified}
                            onChange={(e) => setIsVerified((e.target as HTMLInputElement).checked)}
                        />
                    </div>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                </div>
            ) : (
                <div>
                    <h3>{project.projectName}</h3>
                    <p>Country: {project.country}</p>
                    <p>Production Company: {project.productionCompany}</p>
                    <p>Status: {project.status}</p>
                    <p>Logline: {project.logline}</p>
                    <p>Synopsis: {project.synopsis}</p>
                    <p>Start Date: {project.startDate}</p>
                    <p>End Date: {project.endDate}</p>
                    <p>Location: {project.location}</p>
                    <p>Genre: {project.genre}</p>
                    <p>Director: {director}</p>
                    <p>Producer: {producer}</p>
                    <img src={project.coverImageUrl} alt="Cover" style={{ maxWidth: '200px' }} />
                    <img src={project.posterImageUrl} alt="Poster" style={{ maxWidth: '200px' }} />
                    <p>Project Website: {project.projectWebsite}</p>
                    <p>Production Budget: {project.productionBudget}</p>
                    <p>Production Company Contact: {project.productionCompanyContact}</p>
                    <p>Is Verified: {project.isVerified ? 'Yes' : 'No'}</p>
                    <button onClick={handleEditClick}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;