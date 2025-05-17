// src/components/AddProject.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase'; // Import Firestore and auth
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ImageUploader from './ImageUploader'; // Import the ImageUploader component

interface AddProjectProps { }

const AddProject: React.FC<AddProjectProps> = () => {
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

    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            try {
                const projectsCollectionRef = collection(db, 'Projects'); // Reference to the "Projects" collection
                await addDoc(projectsCollectionRef, {
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
                    owner_uid: user.uid, // Add the user's UID as the owner
                });

                console.log('Project added successfully!');
                navigate('/'); // Redirect to the home page or project detail page
            } catch (error: any) {
                console.error('Error adding project:', error.message);
            }
        } else {
            console.log('User not logged in.');
            navigate('/login');
        }
    };

    // Callback function to receive the uploaded image URL
    const handleCoverImageUploaded = (url: string) => {
        setCoverImageUrl(url);
    };

    // Callback function to receive the uploaded image URL
    const handlePosterImageUploaded = (url: string) => {
        setPosterImageUrl(url);
    };


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <h2>Add New Project</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName((e.target as HTMLInputElement).value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="country">Country:</label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry((e.target as HTMLInputElement).value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="productionCompany">Production Company:</label>
                    <input
                        type="text"
                        id="productionCompany"
                        value={productionCompany}
                        onChange={(e) => setProductionCompany((e.target as HTMLInputElement).value)}
                        required
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
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate((e.target as HTMLInputElement).value)}
                    />
                </div>
                <div>
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
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
                    <label htmlFor="coverImageUrl">Cover Image:</label>
                    <ImageUploader onImageUploaded={handleCoverImageUploaded} />
                </div>
                <div>
                    <label htmlFor="posterImageUrl">Poster Image:</label>
                    <ImageUploader onImageUploaded={handlePosterImageUploaded} />
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
                        onChange={(e) => setIsVerified(e.target.checked)}
                    />
                </div>
                <button type="submit">Add Project</button>
            </form>
        </div>
    );
};

export default AddProject;