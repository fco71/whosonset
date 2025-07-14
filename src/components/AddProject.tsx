import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, doc as firestoreDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProjectForm from './ProjectForm';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Country list for dropdown (deduplicated)
const COUNTRIES = Array.from(new Set([
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium',
  'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland', 'Ireland', 'Portugal', 'Greece',
  'Poland', 'Czech Republic', 'Hungary', 'Slovakia', 'Slovenia', 'Croatia', 'Serbia', 'Bulgaria', 'Romania', 'Ukraine',
  'Russia', 'Belarus', 'Latvia', 'Lithuania', 'Estonia', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan',
  'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia', 'China', 'Japan', 'South Korea', 'North Korea',
  'Taiwan', 'Hong Kong', 'Macau', 'Vietnam', 'Laos', 'Cambodia', 'Thailand', 'Myanmar', 'Malaysia', 'Singapore',
  'Indonesia', 'Philippines', 'Brunei', 'East Timor', 'Papua New Guinea', 'Fiji', 'New Zealand', 'India', 'Pakistan',
  'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives', 'Afghanistan', 'Iran', 'Iraq', 'Syria', 'Lebanon',
  'Jordan', 'Israel', 'Palestine', 'Saudi Arabia', 'Yemen', 'Oman', 'United Arab Emirates', 'Qatar', 'Bahrain',
  'Kuwait', 'Egypt', 'Sudan', 'South Sudan', 'Ethiopia', 'Eritrea', 'Djibouti', 'Somalia', 'Kenya', 'Uganda',
  'Tanzania', 'Rwanda', 'Burundi', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Gabon', 'Equatorial Guinea',
  'Cameroon', 'Central African Republic', 'Chad', 'Niger', 'Nigeria', 'Benin', 'Togo', 'Ghana', 'Ivory Coast',
  'Liberia', 'Sierra Leone', 'Guinea', 'Guinea-Bissau', 'Senegal', 'The Gambia', 'Mauritania', 'Mali', 'Burkina Faso',
  'Algeria', 'Tunisia', 'Libya', 'Morocco', 'Western Sahara', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia',
  'South Africa', 'Lesotho', 'Eswatini', 'Mozambique', 'Madagascar', 'Comoros', 'Mauritius', 'Seychelles', 'Mexico',
  'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Colombia', 'Venezuela',
  'Guyana', 'Suriname', 'French Guiana', 'Brazil', 'Ecuador', 'Peru', 'Bolivia', 'Paraguay', 'Uruguay', 'Argentina',
  'Chile', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Bahamas', 'Trinidad and Tobago',
  'Barbados', 'Grenada', 'Saint Vincent and the Grenadines', 'Saint Lucia', 'Dominica', 'Antigua and Barbuda',
  'Saint Kitts and Nevis', 'Cape Verde', 'São Tomé and Príncipe', 'Equatorial Guinea', 'Gabon', 'Congo', 'DR Congo',
  'Central African Republic', 'Chad', 'Cameroon', 'Nigeria', 'Niger', 'Burkina Faso', 'Mali', 'Senegal', 'The Gambia',
  'Guinea-Bissau', 'Guinea', 'Sierra Leone', 'Liberia', 'Ivory Coast', 'Ghana', 'Togo', 'Benin', 'Algeria', 'Tunisia',
  'Libya', 'Egypt', 'Sudan', 'South Sudan', 'Ethiopia', 'Eritrea', 'Djibouti', 'Somalia', 'Kenya', 'Uganda', 'Tanzania',
  'Rwanda', 'Burundi', 'DR Congo', 'Congo', 'Gabon', 'Equatorial Guinea', 'São Tomé and Príncipe', 'Cameroon',
  'Central African Republic', 'Chad', 'Niger', 'Nigeria', 'Benin', 'Togo', 'Ghana', 'Ivory Coast', 'Liberia',
  'Sierra Leone', 'Guinea', 'Guinea-Bissau', 'Senegal', 'The Gambia', 'Mauritania', 'Mali', 'Burkina Faso', 'Algeria',
  'Tunisia', 'Libya', 'Morocco', 'Western Sahara', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'South Africa',
  'Lesotho', 'Eswatini', 'Mozambique', 'Madagascar', 'Comoros', 'Mauritius', 'Seychelles'
])).sort();

interface ProductionLocation {
  country: string;
  city?: string;
}

const AddProject: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [productionLocations, setProductionLocations] = useState<ProductionLocation[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [productionCompany, setProductionCompany] = useState('');
  const [status, setStatus] = useState('Pre-Production');
  const [logline, setLogline] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [genre, setGenre] = useState('');
  const [director, setDirector] = useState('');
  const [producer, setProducer] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [projectWebsite, setProjectWebsite] = useState('');
  const [productionBudget, setProductionBudget] = useState('');
  const [productionCompanyContact, setProductionCompanyContact] = useState('');
  const [screenplayFile, setScreenplayFile] = useState<File | null>(null);
  const [screenplayUrl, setScreenplayUrl] = useState('');

  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const addLocation = () => {
    if (selectedCountry && !productionLocations.find(loc => loc.country === selectedCountry)) {
      setProductionLocations([...productionLocations, { country: selectedCountry, city: cityInput || undefined }]);
      setSelectedCountry('');
      setCityInput('');
    }
  };

  const removeLocation = (country: string) => {
    setProductionLocations(productionLocations.filter(loc => loc.country !== country));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.log('User not logged in.');
      navigate('/login');
      return;
    }
    try {
      // Step 1: Use the project name as the document ID (legacy behavior)
      const legacyProjectId = projectName.trim().replace(/\s+/g, '_');
      const projectRef = firestoreDoc(db, 'Projects', legacyProjectId);
      console.log('[AddProject] Creating Firestore doc:', legacyProjectId);
      await setDoc(projectRef, {
        projectName,
        productionLocations,
        productionCompany,
        status,
        logline,
        synopsis,
        startDate,
        endDate,
        genre,
        director,
        producer,
        projectWebsite,
        productionBudget,
        productionCompanyContact,
        owner_uid: user.uid,
        createdAt: serverTimestamp(),
      });
      console.log('[AddProject] Firestore doc created.');
      // Step 2: If there is a pending image file, upload it to the legacy path (project-images/originalfilename)
      if (pendingImageFile) {
        setImageUploading(true);
        const storagePath = `project-images/${pendingImageFile.name}`;
        const storageRef = ref(storage, storagePath);
        console.log('[AddProject] Uploading image to:', storagePath);
        try {
          const uploadResult = await uploadBytes(storageRef, pendingImageFile);
          console.log('[AddProject] uploadBytes result:', uploadResult);
        } catch (uploadErr) {
          console.error('[AddProject] uploadBytes error:', uploadErr);
          throw uploadErr;
        }
        let url = '';
        try {
          url = await getDownloadURL(storageRef);
          console.log('[AddProject] Got download URL:', url);
        } catch (urlErr) {
          console.error('[AddProject] getDownloadURL error:', urlErr);
          throw urlErr;
        }
        try {
          await updateDoc(projectRef, { coverImageUrl: url });
          setCoverImageUrl(url); // Update preview to use the real download URL
          console.log('[AddProject] Firestore updated with coverImageUrl:', url);
        } catch (firestoreErr) {
          console.error('[AddProject] updateDoc error:', firestoreErr);
          throw firestoreErr;
        }
        setImageUploading(false);
        setPendingImageFile(null);
        setIsCropping(false);
      }
      console.log('Project added successfully! Navigating home.');
      navigate('/');
    } catch (error: any) {
      console.error('Error adding project:', error);
      setImageUploading(false);
      setPendingImageFile(null);
      setIsCropping(false);
    }
  };

  const handleImageCropped = (file: File) => {
    setPendingImageFile(file);
    setIsCropping(false);
  };

  // Pass this to ImageUploader to set cropping state
  const handleImageCropStart = () => {
    setIsCropping(true);
  };

  // Reset all image states on crop cancel
  const handleImageCropCancel = () => {
    setIsCropping(false);
    setPendingImageFile(null);
  };

  const handleImageUploadStart = () => {
    setImageUploading(true);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleScreenplayUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenplayFile(file);
      const storageRef = ref(storage, `screenplays/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setScreenplayUrl(url);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-gradient border-b border-gray-100">
      </div>

      <div className="section-light">
        <div className="container-base section-padding">
          <div className="card-base max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Production Locations Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Production Locations
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select a country...</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City (Optional)</label>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="Enter city"
                      className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addLocation}
                  disabled={!selectedCountry}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Location
                </button>

                {/* Location Chips */}
                {productionLocations.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Selected Locations:</label>
                    <div className="flex flex-wrap gap-2">
                      {productionLocations.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>
                            {location.country}
                            {location.city && `, ${location.city}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeLocation(location.country)}
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ProjectForm
                projectName={projectName}
                setProjectName={setProjectName}
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
                onImageCropped={handleImageCropped}
                onImageCropStart={handleImageCropStart}
                onImageCropCancel={handleImageCropCancel}
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
                  disabled={imageUploading || isCropping}
                  title={imageUploading ? 'Please wait for image upload to finish' : isCropping ? 'Please finish cropping the image' : ''}
                >
                  {imageUploading ? 'Uploading Image...' : isCropping ? 'Cropping Image...' : 'Add Project'}
                </button>
              </div>
              {(imageUploading || isCropping) && (
                <div className="flex items-center gap-2 mt-4 text-blue-600">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>{imageUploading ? 'Uploading image, please wait...' : 'Cropping image, please wait...'}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddProject;