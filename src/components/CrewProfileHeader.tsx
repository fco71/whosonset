import React, { useState, useEffect } from 'react';
import FollowButton from './Social/FollowButton';
import { FavoritesService } from '../utilities/favoritesService';
import { useAuth } from '../contexts/AuthContext';

interface CrewProfileHeaderProps {
  profile: any;
}

const CrewProfileHeader: React.FC<CrewProfileHeaderProps> = ({ profile }) => {
  const { currentUser } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (currentUser && profile?.uid) {
        setIsBookmarked(await FavoritesService.isFavorite(profile.uid));
      }
    };
    checkFavorite();
  }, [currentUser, profile?.uid]);

  const handleBookmark = async () => {
    if (!currentUser) return;
    setBookmarking(true);
    try {
      const newStatus = await FavoritesService.toggleFavorite(profile.uid, profile);
      setIsBookmarked(newStatus);
    } finally {
      setBookmarking(false);
    }
  };

  const mainTitle = profile.jobTitles?.[0]?.title || '';
  const mainLocation = profile.residences?.[0]
    ? `${profile.residences[0].city ? profile.residences[0].city + ', ' : ''}${profile.residences[0].country || ''}`
    : '';
  const imageUrl = profile.profileImageUrl || '/default-avatar.svg';
  const availability = profile.availability || '';

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl shadow-lg px-8 py-6 mb-8 border border-gray-100 animate-fade-in">
      <img
        src={imageUrl}
        alt={profile.name}
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
        onError={e => { (e.target as HTMLImageElement).src = '/default-avatar.svg'; }}
        style={{ flexShrink: 0 }}
      />
      <div className="flex-1 min-w-0 text-center md:text-left">
        <div className="font-bold text-2xl text-gray-900 mb-1">{profile.name}</div>
        <div className="text-sm text-gray-500 mb-1">{mainTitle}{mainLocation ? ' · ' + mainLocation : ''}</div>
        {availability && (
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${availability.toLowerCase() === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{availability}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 items-center md:items-end">
        {currentUser && currentUser.uid !== profile.uid && (
          <FollowButton currentUserId={currentUser.uid} targetUserId={profile.uid} size="sm" />
        )}
        {currentUser && currentUser.uid !== profile.uid && (
          <button
            onClick={handleBookmark}
            disabled={bookmarking}
            className={`mt-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${isBookmarked ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'}`}
            title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          >
            {bookmarking ? 'Saving...' : isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CrewProfileHeader;
