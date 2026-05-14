import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CrewProfile } from '../types/CrewProfile';
import FollowButton from './Social/FollowButton';
import { imageErrorFallback } from '../utilities/imageErrorFallback';
import { useTranslation } from 'react-i18next';
import { CrewFavoritesService } from '../utilities/crewFavoritesService';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface CrewProfileCardProps {
  profile: CrewProfile;
  index?: number;
  isFiltering?: boolean;
  currentUserId?: string;
  isBookmarked?: boolean;
  onBookmark?: (crewId: string, isBookmarked: boolean) => void;
}

const CrewProfileCard: React.FC<CrewProfileCardProps> = ({ 
  profile, 
  index = 0, 
  isFiltering = false,
  currentUserId,
  isBookmarked = false,
  onBookmark
}) => {
  const { t } = useTranslation();
  const [user] = useAuthState(auth);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || !onBookmark) return;
    
    setIsBookmarking(true);
    try {
      onBookmark(profile.uid, !isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return 'badge-success';
      case 'soon':
        return 'badge-warning';
      case 'unavailable':
        return 'badge-error';
      default:
        return 'badge-gray';
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

  const primaryJobTitle = profile.jobTitles?.[0]?.title || t('crew.crewMember');
  const primaryLocation = profile.residences?.[0] ? 
    `${profile.residences[0].city}, ${profile.residences[0].country}` : t('crew.locationNotSpecified');
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

  return (
    <div 
      className={`group card-base card-hover animate-entrance ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
      style={{ animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24, height: 320, width: '100%' }}
    >
      <div className="h-48 card-image-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <img
          src={
            profile.profileImageUrl &&
            !profile.profileImageUrl.includes('lh3.googleusercontent.com/a')
              ? profile.profileImageUrl
              : "/bust-avatar.svg"
          }
          alt={profile.name}
          className="card-image"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '3px solid #e5e7eb' }}
          onError={imageErrorFallback}
        />
        {/* Bookmark Button */}
        {user && onBookmark && (
          <button
            onClick={handleBookmarkClick}
            disabled={isBookmarking}
            className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 ${
              isBookmarked 
                ? 'bg-blue-500/20 hover:bg-blue-500/30 shadow-sm' 
                : 'bg-white/10 hover:bg-white/20 shadow-sm'
            }`}
            title={isBookmarked ? t('crew.removeFromBookmarks') : t('crew.addToBookmarks')}
            style={{ pointerEvents: 'auto' }}
          >
            {isBookmarked ? (
              <BookmarkCheck size={16} className="text-blue-600 fill-current" />
            ) : (
              <Bookmark size={16} className="text-gray-600 hover:text-blue-500" />
            )}
          </button>
        )}
        {/* Availability Badge */}
        {profile.availability && (
          <div className="absolute bottom-3 left-3">
            <span className={`badge-base ${getAvailabilityColor(profile.availability)}`}>
              {getAvailabilityText(profile.availability)}
            </span>
          </div>
        )}
      </div>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: 12 }}>
        <h3 
          style={{ 
            fontWeight: 600, 
            color: '#1f2937', 
            fontSize: 20, 
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
          title={profile.name}
        >
          {profile.name}
        </h3>
        <div 
          style={{ 
            color: '#6b7280', 
            fontWeight: 500, 
            fontSize: 15, 
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
          title={primaryJobTitle}
        >
          {primaryJobTitle}
        </div>
        <div 
          style={{ 
            color: '#9ca3af', 
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
          title={primaryLocation}
        >
          {primaryLocation}
        </div>
        {profileType !== 'professional' && (
          <div
            style={{
              display: 'inline-block',
              marginTop: 6,
              padding: '3px 8px',
              borderRadius: 999,
              backgroundColor: '#eef2ff',
              color: '#4338ca',
              fontSize: 12,
              fontWeight: 600,
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={profileTypeInstitution ? `${profileTypeLabel} - ${profileTypeInstitution}` : profileTypeLabel}
          >
            {profileTypeLabel}{profileTypeInstitution ? ` - ${profileTypeInstitution}` : ''}
          </div>
        )}
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 12, marginTop: 'auto' }}>
        {user && user.uid !== profile.uid && (
          <div className="btn-secondary" style={{ display: 'inline-block' }}>
            <FollowButton 
              currentUserId={user.uid}
              targetUserId={profile.uid}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CrewProfileCard;
