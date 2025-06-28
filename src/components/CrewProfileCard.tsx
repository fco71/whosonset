import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaDownload, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { CrewProfile } from '../types/CrewProfile';
import FollowButton from './Social/FollowButton';

interface CrewProfileCardProps {
  profile: CrewProfile;
  index?: number;
  isFiltering?: boolean;
  currentUserId?: string;
}

const CrewProfileCard: React.FC<CrewProfileCardProps> = ({ 
  profile, 
  index = 0, 
  isFiltering = false,
  currentUserId 
}) => {
  const [user] = useAuthState(auth);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || !currentUserId) return;
    
    setIsBookmarking(true);
    try {
      const userRef = doc(db, 'users', currentUserId);
      
      if (isBookmarked) {
        await updateDoc(userRef, {
          bookmarkedCrew: arrayRemove(profile.uid)
        });
        setIsBookmarked(false);
      } else {
        await updateDoc(userRef, {
          bookmarkedCrew: arrayUnion(profile.uid)
        });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
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
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const primaryJobTitle = profile.jobTitles?.[0]?.title || 'Crew Member';
  const primaryLocation = profile.residences?.[0] ? 
    `${profile.residences[0].city}, ${profile.residences[0].country}` : 'Location not specified';

  return (
    <div 
      className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden animate-card-entrance hover:scale-[1.02] ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img 
          src={profile.profileImageUrl || "/default-avatar.png"} 
          alt={profile.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        {profile.availability && (
          <div className="absolute bottom-3 left-3">
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full tracking-wider ${getAvailabilityColor(profile.availability)}`}>
              {profile.availability}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide group-hover:text-gray-700 transition-colors">
            {profile.name}
          </h3>
          <p className="text-lg font-medium text-gray-600 mb-1 tracking-wide">
            {primaryJobTitle}
          </p>
          <p className="text-sm text-gray-500 tracking-wider uppercase">
            {profile.jobTitles?.[0]?.department || 'Film & TV'}
          </p>
        </div>

        <div className="flex items-center mb-4 text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {primaryLocation}
        </div>

        {profile.bio && (
          <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
            {profile.bio}
          </p>
        )}

        {profile.languages && profile.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.languages.slice(0, 3).map((language, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium"
              >
                {language}
              </span>
            ))}
            {profile.languages.length > 3 && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                +{profile.languages.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Link
            to={`/crew/${profile.uid}`}
            className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors tracking-wide"
          >
            View Profile →
          </Link>
          
          {user && currentUserId && currentUserId !== profile.uid && (
            <Link
              to={`/social?tab=messaging&user=${profile.uid}`}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </Link>
          )}
        </div>

        {/* Follow Button - Consistent placement */}
        {user && user.uid !== profile.uid && (
          <div className="mt-4 pt-4 border-t border-gray-100">
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
