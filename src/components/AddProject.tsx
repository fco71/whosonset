// src/components/AddProject.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase'; // Import Firestore and auth
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ImageUploader from './ImageUploader'; // Import the ImageUploader component
import ProjectForm from './ProjectForm'

interface AddProjectProps { }

const AddProject: React.FC = () => {
    const [projectName, setProjectName] = useState('');
    const [country, setCountry] = useState('');
    const [productionCompany, setProductionCompany] = useState('');
    const [status, setStatus] = useState('Pre-Production'); // Default value
    const [logline, setLogline] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [genre, setGenre] = useState('');
    const [director, setDirector] = useState('');
    const [producer, setProducer] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [posterImageUrl, setPosterImageUrl] = useState('');
    const [projectWebsite, setProjectWebsite] = useState('');
    const [productionBudget, setProductionBudget] = useState('');
    const [productionCompanyContact, setProductionCompanyContact] = useState('');
    const [isVerified, setIsVerified] = useState(false);

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

    const handleCancel = () => {
        navigate('/'); // Redirect to the home page
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
              <ProjectForm
                    projectName={projectName}
                    setProjectName={setProjectName}
                    country={country}
                    setCountry={setCountry}
                    productionCompany={productionCompany}
                    setProductionCompany={setProductionCompany}
                    status={status}
                    setStatus={setStatus}
                    logline={logline}
                    setLogline={setLogline}
                    synopsis={synopsis}
                    setSynopsis={setSynopsis}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    location={location}
                    setLocation={setLocation}
                    genre={genre}
                    setGenre={setGenre}
                    director={director}
                    setDirector={setDirector}
                    producer={producer}
                    setProducer={setProducer}
                    coverImageUrl={coverImageUrl}
                    setCoverImageUrl={setCoverImageUrl}
                    posterImageUrl={posterImageUrl}
                    setPosterImageUrl={setPosterImageUrl}
                    projectWebsite={projectWebsite}
                    setProjectWebsite={setProjectWebsite}
                    productionBudget={productionBudget}
                    setProductionBudget={setProductionBudget}
                    productionCompanyContact={productionCompanyContact}
                    setProductionCompanyContact={setProductionCompanyContact}
                    isVerified={isVerified}
                    setIsVerified={setIsVerified}
                    handleCoverImageUploaded={handleCoverImageUploaded}
                    handlePosterImageUploaded={handlePosterImageUploaded}
                />
                <button type="submit">Add Project</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
}

export default AddProject;