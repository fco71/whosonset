import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Country {
  name: string;
  code?: string;
  cities: string[];
}

interface LocationSelectorProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  placeholder?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
  placeholder = "Select location..."
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const countriesSnapshot = await getDocs(collection(db, 'countries'));
        setCountries(countriesSnapshot.docs.map(doc => doc.data() as Country));
      } catch (error) {
        console.error('Error fetching countries:', error);
        setCountries([]);
      }
      setLoading(false);
    };
    fetchCountries();
  }, []);

  // Find the selected country object
  const selectedCountryObj = countries.find(c => c.name === selectedCountry);
  const cityOptions = selectedCountryObj?.cities || [];

  return (
    <div className="flex flex-col gap-2">
      <select
        className="border rounded p-2"
        value={selectedCountry}
        onChange={e => onCountryChange(e.target.value)}
        disabled={loading}
      >
        <option value="">Select Country</option>
        {countries.map(country => (
          <option key={country.name} value={country.name}>{country.name}</option>
        ))}
      </select>
      <select
        className="border rounded p-2"
        value={selectedCity}
        onChange={e => onCityChange(e.target.value)}
        disabled={!selectedCountry || loading}
      >
        <option value="">Select City</option>
        {cityOptions.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector; 