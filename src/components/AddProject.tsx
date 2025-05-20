import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
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
        const projectsCollectionRef = collection(db, 'Projects');

        // Only save if the URLs are real Firebase ones
        const safeCoverUrl = coverImageUrl.startsWith('http') ? coverImageUrl : '';
        const safePosterUrl = posterImageUrl.startsWith('http') ? posterImageUrl : '';

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
          posterImageUrl: safePosterUrl,
          projectWebsite,
          productionBudget,
          productionCompanyContact,
          isVerified,
          owner_uid: user.uid,
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

  const handlePosterImageUploaded = (url: string) => {
    setPosterImageUrl(url); // Will always be Firebase URL
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Add New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 shadow-md rounded-lg">
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

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
