import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import ProjectForm from './ProjectForm';

// Country list for dropdown
const COUNTRIES = [
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
].sort();

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
  const [projectWebsite, setProjectWebsite] = useState('');
  const [productionBudget, setProductionBudget] = useState('');
  const [productionCompanyContact, setProductionCompanyContact] = useState('');

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
    if (user) {
      try {
        const projectsCollectionRef = collection(db, 'Projects');
        const safeCoverUrl = coverImageUrl.startsWith('http') ? coverImageUrl : '';

        await addDoc(projectsCollectionRef, {
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
          coverImageUrl: safeCoverUrl,
          projectWebsite,
          productionBudget,
          productionCompanyContact,
          owner_uid: user.uid,
          createdAt: serverTimestamp(),
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

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-gradient border-b border-gray-100">
        <div className="container-base section-padding-large">
          <div className="text-center mb-16 animate-fade">
            <h1 className="heading-primary mb-6 animate-slide">Add</h1>
            <h2 className="heading-secondary mb-8 animate-slide">New Project</h2>
            <p className="body-large max-w-2xl mx-auto animate-slide">
              Share your film project with the community. Add all the details that matter.
            </p>
          </div>
        </div>
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