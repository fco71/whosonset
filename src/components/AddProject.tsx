import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProjectForm from './ProjectForm';

const AddProject: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [country, setCountry] = useState('');
  const [productionCompany, setProductionCompany] = useState('');
  const [status, setStatus] = useState('Pre-Production');
  const [logline, setLogline] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [genre, setGenre] = useState('');
  const [director, setDirector] = useState('');
  const [producer, setProducer] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  // Removed posterImageUrl state
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
        const projectsCollectionRef = collection(db, 'Projects');

        // Only save if the URL is a real Firebase one
        const safeCoverUrl = coverImageUrl.startsWith('http') ? coverImageUrl : '';
        // Removed safePosterUrl

        await addDoc(projectsCollectionRef, {
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
          coverImageUrl: safeCoverUrl,
          // Removed posterImageUrl from document data
          projectWebsite,
          productionBudget,
          productionCompanyContact,
          isVerified,
          owner_uid: user.uid,
          createdAt: serverTimestamp(), // ✅ required for pagination
        });

        console.log('Project added successfully!');
        navigate('/');
      } catch (error: any) {
        console.error('Error adding project:', error.message);
      }
    } else {
      console.log('User not logged in.');
      navigate('/login');
    }
  };

  const handleCoverImageUploaded = (url: string) => {
    setCoverImageUrl(url); // Will always be Firebase URL
  };

  // Removed handlePosterImageUploaded

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="section-gradient border-b border-gray-100">
        <div className="container-base section-padding-large">
          <div className="text-center mb-16 animate-fade">
            <h1 className="heading-primary mb-6 animate-slide">
              Add New Project
            </h1>
            <p className="body-large max-w-2xl mx-auto animate-slide">
              Create and showcase your film industry project. Add details, team members, and share with the community.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="section-light">
        <div className="container-narrow section-padding">
          <div className="card-base p-8 animate-fade">
            <form onSubmit={handleSubmit} className="space-y-8">
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
                projectWebsite={projectWebsite}
                setProjectWebsite={setProjectWebsite}
                productionBudget={productionBudget}
                setProductionBudget={setProductionBudget}
                productionCompanyContact={productionCompanyContact}
                setProductionCompanyContact={setProductionCompanyContact}
                isVerified={isVerified}
                setIsVerified={setIsVerified}
                handleCoverImageUploaded={handleCoverImageUploaded}
              />

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;