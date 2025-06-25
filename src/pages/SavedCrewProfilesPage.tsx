// src/pages/SavedCrewProfilesPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import CrewProfileCard from '../components/CrewProfileCard';
import { LegacyCrewProfile } from '../types/CrewProfile';

const SavedCrewProfilesPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [savedProfiles, setSavedProfiles] = useState<LegacyCrewProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProfiles = async () => {
      if (!user) return;

      try {
        const savedProfilesRef = collection(db, `collections/${user.uid}/savedCrew`);
        const querySnapshot = await getDocs(savedProfilesRef);
        const profiles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as LegacyCrewProfile[];
        
        setSavedProfiles(profiles);
      } catch (error) {
        console.error('Error fetching saved profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProfiles();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-24">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
                Saved
              </h1>
              <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
                Crew Profiles
              </h2>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="flex gap-3">
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="w-20 h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
              Saved
            </h1>
            <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
              Crew Profiles
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto animate-slide-up-delay-2">
              Your curated collection of talented crew members
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {savedProfiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📁</div>
            <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
              No Saved Profiles Yet
            </h3>
            <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
              Start building your collection by browsing crew profiles and saving the ones you're interested in.
            </p>
            <a
              href="/producer-view"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-light tracking-wide hover:bg-black transition-all duration-300 hover:scale-105"
            >
              Browse Crew Profiles →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {savedProfiles.map((profile, index) => (
              <div
                key={profile.id}
                className="animate-card-entrance"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CrewProfileCard profile={profile} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCrewProfilesPage;
