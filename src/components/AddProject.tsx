import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ImageUploader from './ImageUploader';
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
          coverImageUrl,
          posterImageUrl,
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
    setCoverImageUrl(url);
  };

  const handlePosterImageUploaded = (url: string) => {
    setPosterImageUrl(url);
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Add New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-600 border border-gray-400 px-4 py-2 rounded hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
