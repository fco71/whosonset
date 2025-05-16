// src/components/ProjectDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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
    const [status, setStatus] = useState<string>('Pre-Production'); // Default value
    const [logline, setLogline] = useState<string>('');
    const [synopsis, setSynopsis] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [director, setDirector] = useState<string>('');
    const [producer, setProducer] = useState<string>('');
    const [coverImageUrl, setCoverImageUrl] = useState<string>('');
    const [posterImageUrl, setPosterImageUrl] = useState<string>('');
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
                        setDirector(projectData.director);
                        setProducer(projectData.producer);
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
        console.log("handleEditClick called"); // Debugging
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const handleSaveClick = async () => {
        if (!project) return;

        console.log("handleSaveClick called"); // Debugging

        try {
            const projectDocRef = doc(db, 'Projects', project.id);

            console.log("Project ID:", project.id); // Debugging
            console.log("Data to update:", { // Debugging
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
                coverImageUrl: coverImageUrl,
                posterImageUrl: posterImageUrl,
                projectWebsite: projectWebsite,
                productionBudget: productionBudget,
                productionCompanyContact: productionCompanyContact,
                isVerified: isVerified,
            });

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
                coverImageUrl: coverImageUrl,
                posterImageUrl: posterImageUrl,
                projectWebsite: projectWebsite,
                productionBudget: productionBudget,
                productionCompanyContact: productionCompanyContact,
                isVerified: isVerified,
            });

            console.log("Project updated successfully!"); // Debugging

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
                coverImageUrl: coverImageUrl,
                posterImageUrl: posterImageUrl,
                projectWebsite: projectWebsite,
                productionBudget: productionBudget,
                productionCompanyContact: productionCompanyContact,
                isVerified: isVerified,
                id: project.id
            });

            console.log("Project state updated:", project); // Debugging
            console.log("isEditing:", isEditing); // Debugging

            setIsEditing(false);
        } catch (error: any) {
            console.error("Error updating project:", error.message);
            setError(error.message);
        }
    };

    console.log("isEditing:", isEditing); // Debugging

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
                        <label htmlFor="coverImageUrl">Cover Image URL:</label>
                        <input
                            type="text"
                            id="coverImageUrl"
                            value={coverImageUrl}
                            onChange={(e) => setCoverImageUrl((e.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="posterImageUrl">Poster Image URL:</label>
                        <input
                            type="text"
                            id="posterImageUrl"
                            value={posterImageUrl}
                            onChange={(e) => setPosterImageUrl((e.target as HTMLInputElement).value)}
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
                    <p>Director: {project.director}</p>
                    <p>Producer: {project.producer}</p>
                    <p>Cover Image URL: {project.coverImageUrl}</p>
                    <p>Poster Image URL: {project.posterImageUrl}</p>
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