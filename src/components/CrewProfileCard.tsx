import React from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

interface CrewProfileCardProps {
  id: string;
  fullName: string;
  mainPosition: string;
  otherPositions?: string;
  profileImageUrl?: string;
  recentProductions?: string[];
  workExperience?: string;
  skills?: string;
  education?: string;
  resumeFilePath?: string;
}

const CrewProfileCard: React.FC<CrewProfileCardProps> = ({
  id,
  fullName,
  mainPosition,
  otherPositions,
  profileImageUrl,
  recentProductions = [],
  workExperience,
  skills,
  education,
  resumeFilePath,
}) => {
  const [user] = useAuthState(auth);

  const handleAddToCollection = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      savedCrew: arrayUnion(id),
    });
    alert(`${fullName} added to your collection.`);
  };

  const handleDownloadResume = async () => {
    if (!resumeFilePath) return alert('No resume available for download.');
    const url = await getDownloadURL(ref(storage, resumeFilePath));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fullName}_Resume.pdf`;
    a.click();
  };

  return (
    <div className="bg-[#4B2C2C] text-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
      <div className="md:w-1/3 bg-pink-600 flex flex-col justify-center items-center text-center p-4">
        {profileImageUrl && (
          <img
            src={profileImageUrl}
            alt={fullName}
            className="w-32 h-32 object-cover rounded-full mb-4"
          />
        )}
        <h2 className="text-xl font-bold">{fullName}</h2>
        <p className="text-sm font-semibold">{mainPosition}</p>
        {otherPositions && (
          <p className="text-xs mt-2">{otherPositions}</p>
        )}
        <button
          onClick={handleAddToCollection}
          className="mt-4 bg-white text-pink-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-100"
        >
          Add to Collection
        </button>
        <button
          onClick={handleDownloadResume}
          className="mt-2 bg-white text-pink-600 px-4 py-2 rounded-full font-semibold hover:bg-pink-100"
        >
          Download Resume
        </button>
      </div>
      <div className="md:w-2/3 p-6 space-y-6">
        <section>
          <h3 className="font-bold text-white mb-1">Recent Productions</h3>
          <ul className="list-disc list-inside text-sm">
            {recentProductions.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {workExperience && (
          <section>
            <h3 className="font-bold text-white mb-1">Work Experience</h3>
            <p className="text-sm">{workExperience}</p>
          </section>
        )}

        {skills && (
          <section>
            <h3 className="font-bold text-white mb-1">Skills</h3>
            <p className="text-sm">{skills}</p>
          </section>
        )}

        {education && (
          <section>
            <h3 className="font-bold text-white mb-1">Education</h3>
            <p className="text-sm">{education}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default CrewProfileCard;
