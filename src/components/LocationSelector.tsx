import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Country {
  name: string;
  code: string;
}

interface City {
  name: string;
  country: string;
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
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountriesAndCities = async () => {
      setLoading(true);
      try {
        const countriesSnapshot = await getDocs(collection(db, 'countries'));
        const citiesSnapshot = await getDocs(collection(db, 'cities'));
        setCountries(countriesSnapshot.docs.map(doc => doc.data() as Country));
        setCities(citiesSnapshot.docs.map(doc => doc.data() as City));
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Fallback to empty arrays if collections don't exist
        setCountries([]);
        setCities([]);
      }
      setLoading(false);
    };
    fetchCountriesAndCities();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setFilteredCities(cities.filter(city => city.country === selectedCountry));
    } else {
      setFilteredCities([]);
    }
  }, [selectedCountry, cities]);

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
          <option key={country.code} value={country.name}>{country.name}</option>
        ))}
      </select>
      <select
        className="border rounded p-2"
        value={selectedCity}
        onChange={e => onCityChange(e.target.value)}
        disabled={!selectedCountry || loading}
      >
        <option value="">Select City</option>
        {filteredCities.map(city => (
          <option key={city.name} value={city.name}>{city.name}</option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector; 