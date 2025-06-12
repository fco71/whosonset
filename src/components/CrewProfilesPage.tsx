import React from 'react';

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
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-white">
      {profile.avatarUrl && (
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      )}
      <h2 className="text-xl font-semibold">{profile.name}</h2>
      <p className="text-gray-400">{profile.role}</p>
      <p className="mt-2 text-sm text-center">{profile.bio}</p>
      <p className="mt-1 text-xs text-gray-500">{profile.location}</p>

      <div className="mt-4 flex gap-2">
        {profile.resumeUrl && (
          <a
            href={profile.resumeUrl}
            download
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Download Resume
          </a>
        )}
        <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
          Add to Collection
        </button>
      </div>
    </div>
  );
};

export default CrewProfileCard;
