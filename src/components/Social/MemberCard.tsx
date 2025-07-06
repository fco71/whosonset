import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Profile, getDisplayName, getPhotoUrl, isCrewProfile, getProfileId } from '../../types/Profile';
import FollowButton from './FollowButton';

interface MemberCardProps {
  profile: Profile;
  index?: number;
  isFiltering?: boolean;
  currentUserId?: string;
  className?: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ 
  profile, 
  index = 0, 
  isFiltering = false,
  currentUserId,
  className = ''
}) => {
  const [user] = useAuthState(auth);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user?.uid || !currentUserId) return;
    
    setIsBookmarking(true);
    try {
      const userRef = doc(db, 'users', currentUserId);
      const profileId = 'uid' in profile ? profile.uid : profile.id;
      
      if (isBookmarked) {
        await updateDoc(userRef, {
          bookmarkedUsers: arrayRemove(profileId)
        });
        setIsBookmarked(false);
      } else {
        await updateDoc(userRef, {
          bookmarkedUsers: arrayUnion(profileId)
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const getAvailabilityColor = (availability?: string) => {
    if (!availability) return 'bg-gray-100 text-gray-800';
    
    switch (availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get primary job title
  const primaryJobTitle = isCrewProfile(profile)
    ? profile.jobTitles?.[0]?.title || 'Crew Member'
    : profile.jobTitle || 'Crew Member';

  // Get primary location
  let primaryLocation = 'Location not specified';
  if (isCrewProfile(profile) && profile.residences?.[0]) {
    primaryLocation = `${profile.residences[0].city}, ${profile.residences[0].country}`;
  } else if ('location' in profile && profile.location) {
    primaryLocation = profile.location;
  }

  const displayName = getDisplayName(profile);
  const photoUrl = getPhotoUrl(profile) || '/default-avatar.png';
  const profileId = getProfileId(profile);

  return (
    <div 
      className={cn(
        `group card-base card-hover animate-entrance ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`,
        'flex flex-col items-center p-6',
        className
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="h-48 card-image-container flex flex-col items-center justify-center mb-4">
        <img 
          src={photoUrl || "/default-avatar.png"} 
          alt={displayName}
          className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-100 shadow-sm"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/default-avatar.png";
          }}
        />
        
        {/* Bookmark Button */}
        {user && currentUserId && (
          <button
            onClick={handleBookmark}
            disabled={isBookmarking}
            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 disabled:opacity-50"
            title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <svg 
              className={`w-5 h-5 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} 
              fill={isBookmarked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
              />
            </svg>
          </button>
        )}
        
        {/* Availability Badge */}
        {('availability' in profile && profile.availability) && (
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getAvailabilityColor(profile.availability)}`}>
              {profile.availability}
            </span>
          </div>
        )}
      </div>
      
      <div className="w-full text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{displayName}</h3>
        <p className="text-sm text-gray-600 font-medium mb-1">{primaryJobTitle}</p>
        <p className="text-xs text-gray-500">{primaryLocation}</p>
      </div>
      
      <div className="w-full flex justify-center gap-3">
        {user && user.uid !== profileId && (
          <div className="w-full">
            <FollowButton 
              currentUserId={user.uid}
              targetUserId={profileId}
              className="w-full justify-center"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
