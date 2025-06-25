import React, { useState } from 'react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FaDownload, FaBookmark, FaRegBookmark } from 'react-icons/fa';

export interface CrewProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  resumeUrl?: string;
  avatarUrl?: string;
}

interface CrewProfileCardProps {
  profile: CrewProfile;
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
          src={profile.avatarUrl || '/default-avatar.png'}
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
          <button
            onClick={handleSaveToCollection}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-light tracking-wide transition-all duration-300 hover:scale-105 ${
              isSaved 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSaved ? (
              <>
                <FaBookmark className="mr-2 text-sm" />
                Saved
              </>
            ) : (
              <>
                <FaRegBookmark className="mr-2 text-sm" />
                Save
              </>
            )}
          </button>

          <button
            onClick={handleDownloadResume}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-lg font-light tracking-wide hover:bg-gray-800 transition-all duration-300 hover:scale-105"
          >
            <FaDownload className="mr-2 text-sm" />
            Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrewProfileCard;
