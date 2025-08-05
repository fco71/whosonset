import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CrewProfile } from '../types/CrewProfile';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { imageErrorFallback } from '../utilities/imageErrorFallback';

interface CrewBannerCardProps {
  profile: CrewProfile;
  index?: number;
  isFiltering?: boolean;
  currentUserId?: string;
  isBookmarked?: boolean;
  onBookmark?: (crewId: string, isBookmarked: boolean) => void;
  className?: string;
}

const CrewBannerCard: React.FC<CrewBannerCardProps> = ({ 
  profile, 
  index = 0, 
  isFiltering = false,
  currentUserId,
  isBookmarked = false,
  onBookmark,
  className = ''
}) => {
  const { t } = useTranslation();
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUserId || !onBookmark || isBookmarking) return;
    
    setIsBookmarking(true);
    try {
      await onBookmark(profile.uid, !isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
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

  const mainTitle = profile.jobTitles?.[0]?.title || t('crew.crewMember');
  const mainLocation = profile.residences?.[0] ? 
    `${profile.residences[0].city ? profile.residences[0].city + ', ' : ''}${profile.residences[0].country || ''}` : '';
  const imageUrl = profile.profileImageUrl || '/default-avatar.svg';
  const availability = profile.availability || '';

  return (
    <div 
      className={`
        relative group flex items-center bg-white rounded-2xl border border-gray-100 
        shadow-lg px-5 py-4 gap-4 hover:shadow-xl transition-all duration-300 cursor-pointer
        ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100 hover:scale-[1.02]'}
        ${className}
      `}
      style={{ 
        minHeight: 68, 
        textDecoration: 'none',
        animationDelay: `${index * 0.05}s`
      }}
    >
      {/* Bookmark Button - Upper Right */}
      {currentUserId && onBookmark && (
        <button
          onClick={handleBookmarkClick}
          disabled={isBookmarking}
          className="absolute top-2 right-2 z-20 hover:scale-110 transition-transform duration-200 p-1 rounded-full hover:bg-gray-100"
          title={isBookmarked ? t('crew.removeFromBookmarks') : t('crew.addToBookmarks')}
        >
          {isBookmarked ? (
            <BookmarkCheck size={16} className="text-blue-600 fill-current" />
          ) : (
            <Bookmark size={16} className="text-gray-400 hover:text-blue-500" />
          )}
        </button>
      )}

      {/* Main Content */}
      <Link 
        to={`/resume/${profile.uid}`} 
        className="flex items-center flex-1 min-w-0 gap-4"
        style={{ textDecoration: 'none' }}
      >
        {/* Avatar */}
        <img 
          src={imageUrl} 
          alt={profile.name} 
          className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 flex-shrink-0" 
          onError={imageErrorFallback}
        />
        
        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200" 
               style={{ fontSize: 17, letterSpacing: '-0.01em' }}>
            {profile.name}
          </div>
          <div className="text-xs text-gray-500 truncate" style={{ fontWeight: 500 }}>
            {mainTitle}{mainLocation ? ' · ' + mainLocation : ''}
          </div>
        </div>
      </Link>

      {/* Availability Badge - Lower Right */}
      {availability && (
        <span className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(availability)}`}>
          {getAvailabilityText(availability)}
        </span>
      )}
    </div>
  );
};

export default CrewBannerCard; 