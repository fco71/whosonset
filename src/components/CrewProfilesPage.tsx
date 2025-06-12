import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import CrewProfileCard from '../components/CrewProfileCard';

interface CrewProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  resumeUrl?: string;
  avatarUrl?: string;
}

const CrewProfilesPage: React.FC = () => {
  const [crewProfiles, setCrewProfiles] = useState<CrewProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrewProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Crew'));
        const profiles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as CrewProfile[];
        setCrewProfiles(profiles);
      } catch (error) {
        console.error('Error fetching crew profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrewProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Crew Profiles</h1>

      {loading ? (
        <div className="text-center text-gray-400">Loading crew profiles...</div>
      ) : crewProfiles.length === 0 ? (
        <div className="text-center text-gray-400">No crew profiles found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {crewProfiles.map(profile => (
            <CrewProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CrewProfilesPage;
