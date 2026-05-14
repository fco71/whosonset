// src/pages/SavedCrewProfilesPage.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import CrewProfileCard from '../components/CrewProfileCard';
import { CrewProfile } from '../types/CrewProfile';
import { useTranslation } from 'react-i18next';
import { CrewFavoritesService } from '../utilities/crewFavoritesService';

const SavedCrewProfilesPage: React.FC = () => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [savedProfiles, setSavedProfiles] = useState<CrewProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteCrewIds, setFavoriteCrewIds] = useState<string[]>([]);

  // Load favorite crew profiles
  useEffect(() => {
    const fetchSavedProfiles = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get favorite crew IDs
        const favoriteIds = await CrewFavoritesService.getFavoriteCrewIds();
        setFavoriteCrewIds(favoriteIds);

        if (favoriteIds.length === 0) {
          setSavedProfiles([]);
          return;
        }

        // Fetch crew profiles for favorite IDs
        const crewProfilesRef = collection(db, 'crewProfiles');
        const profiles: CrewProfile[] = [];

        for (const crewId of favoriteIds) {
          try {
            // Use document ID directly instead of querying by uid field
            const crewDoc = await getDoc(doc(crewProfilesRef, crewId));
            if (crewDoc.exists()) {
              const crewData = crewDoc.data() as CrewProfile;
              profiles.push({
                ...crewData,
                uid: crewId,
              });
            }
          } catch (error) {
            console.error(`Error fetching crew profile for ${crewId}:`, error);
          }
        }

        setSavedProfiles(profiles);
      } catch (error) {
        console.error('Error fetching saved profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProfiles();
  }, [user]);

  // Handle crew bookmarking
  const handleCrewBookmark = async (crewId: string, isBookmarked: boolean) => {
    if (!user) return;

    try {
      const crewProfile = savedProfiles.find(p => p.uid === crewId);
      if (!crewProfile) return;

      if (isBookmarked) {
        await CrewFavoritesService.addToFavorites(crewId, {
          crewName: crewProfile.name,
          jobTitle: crewProfile.jobTitles?.[0]?.title,
          location: crewProfile.residences?.[0] ? 
            `${crewProfile.residences[0].city}, ${crewProfile.residences[0].country}` : undefined,
          profileImageUrl: crewProfile.profileImageUrl,
        });
        setFavoriteCrewIds(prev => [...prev, crewId]);
      } else {
        await CrewFavoritesService.removeFromFavorites(crewId);
        setFavoriteCrewIds(prev => prev.filter(id => id !== crewId));
        setSavedProfiles(prev => prev.filter(p => p.uid !== crewId));
      }
    } catch (error) {
      console.error('Error toggling crew bookmark:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-24">
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight animate-slide-up">
                {t('crew.savedCrew')}
              </h1>
              <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
                {t('crew.crewProfiles')}
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
              {t('crew.savedCrew')}
            </h1>
            <h2 className="text-4xl font-light text-gray-600 mb-8 tracking-wide animate-slide-up-delay">
              {t('crew.crewProfiles')}
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto animate-slide-up-delay-2">
              {t('crew.curatedCollection')}
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
              {t('crew.noSavedProfiles')}
            </h3>
            <p className="text-gray-600 font-light mb-8 max-w-md mx-auto">
              {t('crew.startBuilding')}
            </p>
            <a
              href="/producer-view"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-light tracking-wide hover:bg-black transition-all duration-300 hover:scale-105"
            >
              {t('crew.browseCrewProfiles')} →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {savedProfiles.map((profile, index) => (
              <div
                key={profile.uid}
                className="animate-card-entrance"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CrewProfileCard 
                  profile={profile} 
                  isBookmarked={favoriteCrewIds.includes(profile.uid)}
                  onBookmark={handleCrewBookmark}
                  currentUserId={user?.uid}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCrewProfilesPage;
