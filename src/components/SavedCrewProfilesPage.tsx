import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
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

const SavedCrewProfilesPage: React.FC = () => {
  const [savedCrewProfiles, setSavedCrewProfiles] = useState<CrewProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCrewProfiles = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const savedCrewRef = collection(db, `collections/${user.uid}/savedCrew`);
        const snapshot = await getDocs(savedCrewRef);
        const profiles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as CrewProfile[];
        setSavedCrewProfiles(profiles);
      } catch (error) {
        console.error('Error fetching saved crew profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCrewProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Saved Crew Profiles</h1>

      {loading ? (
        <div className="text-center text-gray-400">Loading saved profiles...</div>
      ) : savedCrewProfiles.length === 0 ? (
        <div className="text-center text-gray-400">No saved profiles found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {savedCrewProfiles.map(profile => (
            <CrewProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCrewProfilesPage;
