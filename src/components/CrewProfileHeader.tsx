import React, { useState, useEffect } from 'react';
import FollowButton from './Social/FollowButton';
import { CrewFavoritesService } from '../services/crewFavoritesService';
import { useAuth } from '../contexts/AuthContext';
import { imageErrorFallback } from '../utilities/imageErrorFallback';
import { useTranslation } from 'react-i18next';

interface CrewProfileHeaderProps {
  profile: any;
}

const CrewProfileHeader: React.FC<CrewProfileHeaderProps> = ({ profile }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (currentUser && profile?.uid) {
        setIsBookmarked(await CrewFavoritesService.isFavorite(profile.uid));
      }
    };
    checkFavorite();
  }, [currentUser, profile?.uid]);

  const handleBookmark = async () => {
    if (!currentUser) return;
    setBookmarking(true);
    try {
      if (isBookmarked) {
        await CrewFavoritesService.removeFromFavorites(profile.uid);
        setIsBookmarked(false);
      } else {
        await CrewFavoritesService.addToFavorites(profile.uid, {
          crewName: profile.name,
          jobTitle: profile.jobTitles?.[0]?.title,
          location: profile.residences?.[0] ? 
            `${profile.residences[0].city}, ${profile.residences[0].country}` : undefined,
          profileImageUrl: profile.profileImageUrl,
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setBookmarking(false);
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return t('crew.available');
      case 'soon':
        return t('crew.soon');
      case 'unavailable':
        return t('crew.unavailable');
      default:
        return availability;
    }
  };

  const mainTitle = profile.jobTitles?.[0]?.title || '';
  const mainLocation = profile.residences?.[0]
    ? `${profile.residences[0].city ? profile.residences[0].city + ', ' : ''}${profile.residences[0].country || ''}`
    : '';
  const profileType = profile.profileType === 'teacher' || profile.isTeacher === true
    ? 'teacher'
    : profile.profileType === 'student' || profile.isStudent === true
    ? 'student'
    : 'professional';
  const profileTypeLabel = profileType === 'teacher'
    ? t('crew.profileTypes.teacher')
    : profileType === 'student'
    ? t('crew.profileTypes.student')
    : '';
  const profileTypeInstitution = profileType === 'teacher'
    ? profile.teacherInfo?.institution || profile.teacherInstitution || ''
    : profile.studentInfo?.institution || profile.school || '';
  // Fallback: use photoURL if profileImageUrl is missing
      const imageUrl = profile.profileImageUrl || '/bust-avatar.svg';
  const availability = profile.availability || '';



  return (
    <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow-lg px-8 py-6 mb-8 border border-gray-100 animate-fade-in">
      <img
        src={imageUrl}
        alt={profile.name}
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
        onError={imageErrorFallback}
        style={{ flexShrink: 0 }}
      />
      <div className="flex-1 min-w-0 text-center md:text-left">
        <div className="font-bold text-2xl text-gray-900 mb-1">{profile.name}</div>
        <div className="text-sm text-gray-500 mb-1">{mainTitle}{mainLocation ? ' · ' + mainLocation : ''}</div>
        {profileType !== 'professional' && (
          <span
            className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 mr-2"
            title={profileTypeInstitution ? `${profileTypeLabel} - ${profileTypeInstitution}` : profileTypeLabel}
          >
            {profileTypeLabel}{profileTypeInstitution ? ` - ${profileTypeInstitution}` : ''}
          </span>
        )}
        {availability && (
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${availability.toLowerCase() === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {getAvailabilityText(availability)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 items-center md:items-end">
        {currentUser && currentUser.uid !== profile.uid && (
          <div className="flex gap-2 items-center">
            <FollowButton currentUserId={currentUser.uid} targetUserId={profile.uid} size="sm" />
            <button
              onClick={handleBookmark}
              disabled={bookmarking}
              className={`p-2 rounded-full border border-gray-200 bg-white hover:bg-yellow-50 transition-all duration-200 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400'} ${bookmarking ? 'opacity-50' : ''}`}
              title={isBookmarked ? t('crew.removeFromBookmarks') : t('crew.addToBookmarks')}
              style={{ lineHeight: 0 }}
            >
              {isBookmarked ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z"/></svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrewProfileHeader;
