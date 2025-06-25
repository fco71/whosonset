// src/pages/SavedCrewProfilesPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
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
  const [user] = useAuthState(auth);
  const [savedProfiles, setSavedProfiles] = useState<CrewProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProfiles = async () => {
      if (!user) return;
      try {
        const snapshot = await getDocs(
          collection(db, `collections/${user.uid}/savedCrew`)
        );
        const profiles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as CrewProfile[];
        setSavedProfiles(profiles);
      } catch (error) {
        console.error('Error fetching saved crew profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProfiles();
  }, [user]);

  if (loading) {
    return <LoadingSkeleton />;
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
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay-2">
              Your curated collection of exceptional talent. 
              Keep track of the crew members you want to work with.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          {savedProfiles.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <div className="text-8xl mb-8 opacity-20 animate-bounce-slow">💾</div>
              <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                No saved profiles yet
              </h3>
              <p className="text-lg font-light text-gray-500 max-w-md mx-auto leading-relaxed">
                Start exploring crew profiles and save the ones that catch your eye
              </p>
            </div>
          ) : (
            <>
              <div className="mb-12 animate-fade-in">
                <h3 className="text-3xl font-light text-gray-900 tracking-wide">
                  {savedProfiles.length} {savedProfiles.length === 1 ? 'Profile' : 'Profiles'} Saved
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {savedProfiles.map((profile, index) => (
                  <div 
                    key={profile.id}
                    className="animate-card-entrance"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CrewProfileCard profile={profile} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <div className="h-16 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="mb-12">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedCrewProfilesPage;
