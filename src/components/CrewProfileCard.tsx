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
        return 'badge-success';
      case 'soon':
        return 'badge-warning';
      case 'unavailable':
        return 'badge-error';
      default:
        return 'badge-gray';
    }
  };

  const primaryJobTitle = profile.jobTitles?.[0]?.title || 'Crew Member';
  const primaryLocation = profile.residences?.[0] ? 
    `${profile.residences[0].city}, ${profile.residences[0].country}` : 'Location not specified';

  return (
    <div 
      className={`group card-base card-hover animate-entrance ${isFiltering ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
      style={{ animationDelay: `${index * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}
    >
      <div className="h-48 card-image-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <img 
          src={profile.profileImageUrl || "/default-avatar.png"} 
          alt={profile.name}
          className="card-image"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8, border: '3px solid #e5e7eb' }}
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
            <span className={`badge-base ${getAvailabilityColor(profile.availability)}`}>{profile.availability}</span>
          </div>
        )}
      </div>
      <div style={{ width: '100%', textAlign: 'center', marginBottom: 12 }}>
        <h3 style={{ fontWeight: 600, color: '#1f2937', fontSize: 20, margin: 0 }}>{profile.name}</h3>
        <div style={{ color: '#6b7280', fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{primaryJobTitle}</div>
        <div style={{ color: '#9ca3af', fontSize: 14 }}>{primaryLocation}</div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }}>
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
