import React, { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FaDownload, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { LegacyCrewProfile } from '../types/CrewProfile';
import FollowButton from './Social/FollowButton';

interface CrewProfileCardProps {
  profile: LegacyCrewProfile;
}

const CrewProfileCard: React.FC<CrewProfileCardProps> = ({ profile }) => {
  const [user] = useAuthState(auth);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToCollection = async () => {
    if (!user) {
      alert('Please log in to save profiles.');
      return;
    }

    const docRef = doc(db, `collections/${user.uid}/savedCrew/${profile.id}`);

    try {
      if (isSaved) {
        await deleteDoc(docRef);
        setIsSaved(false);
      } else {
        await setDoc(docRef, profile);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving crew profile:', error);
    }
  };

  const handleDownloadResume = () => {
    if (profile.resumeUrl) {
      window.open(profile.resumeUrl, '_blank');
    } else {
      alert('No resume available.');
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
      {/* Profile Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={profile.avatarUrl || '/bust-avatar.svg'}
          alt={profile.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <h2 className="text-xl font-light text-gray-900 mb-2 tracking-wide group-hover:text-gray-700 transition-colors">
          {profile.name}
        </h2>
        <p className="text-sm font-medium text-gray-500 mb-3 tracking-wider uppercase">
          {profile.role} • {profile.location}
        </p>
        <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">
          {profile.bio}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {profile.resumeUrl && (
            <button
              onClick={handleDownloadResume}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-all duration-300 text-sm font-medium tracking-wide"
            >
              <FaDownload className="text-xs" />
              Download Resume
            </button>
          )}
          <button
            onClick={handleSaveToCollection}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm font-medium tracking-wide"
          >
            {isSaved ? (
              <>
                <FaBookmark className="text-xs" />
                Saved
              </>
            ) : (
              <>
                <FaRegBookmark className="text-xs" />
                Save
              </>
            )}
          </button>
        </div>

        {/* View Profile Link */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <a
            href={`/resume/${profile.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-900 hover:text-black transition-all duration-300 tracking-wide group-hover:underline group-hover:scale-105 block text-center"
          >
            View Profile →
          </a>
        </div>

        {/* Follow Button - Consistent placement */}
        {user && user.uid !== profile.id && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <FollowButton 
              currentUserId={user.uid}
              targetUserId={profile.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CrewProfileCard;
