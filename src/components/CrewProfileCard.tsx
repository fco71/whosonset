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
    <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center text-center">
      <img
        src={profile.avatarUrl || '/default-avatar.png'}
        alt={profile.name}
        className="w-24 h-24 rounded-full mb-4 object-cover"
      />
      <h2 className="text-xl font-semibold">{profile.name}</h2>
      <p className="text-sm text-gray-400">{profile.role} – {profile.location}</p>
      <p className="mt-2 text-sm text-gray-300">{profile.bio}</p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSaveToCollection}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center"
        >
          {isSaved ? <FaBookmark className="mr-2" /> : <FaRegBookmark className="mr-2" />}
          {isSaved ? 'Saved' : 'Save'}
        </button>

        <button
          onClick={handleDownloadResume}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center"
        >
          <FaDownload className="mr-2" />
          Download Resume
        </button>
      </div>
    </div>
  );
};

export default CrewProfileCard;
