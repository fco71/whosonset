import React from 'react';

interface Project {
  projectName: string;
  role: string;
  description?: string;
}

interface JobTitleEntry {
  department: string;
  title: string;
}

interface Residence {
  country: string;
  city: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
}

interface CrewProfileData {
  name: string;
  profileImageUrl?: string;
  bio?: string;
  jobTitles: JobTitleEntry[];
  projects?: Project[];
  residences?: Residence[];
  contactInfo?: ContactInfo;
  otherInfo?: string;
}

interface ResumeViewProps {
  profile: CrewProfileData;
  editable?: boolean; // for future use
}

const ResumeView: React.FC<ResumeViewProps> = ({ profile }) => {
  return (
    <div className="bg-white text-black p-6 max-w-3xl mx-auto font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center gap-6">
        {profile.profileImageUrl && (
          <img src={profile.profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          {profile.bio && (
            <p className="text-sm text-gray-700 mt-1">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* Job Titles */}
      <div>
        <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Job Titles</h2>
        <ul className="list-disc list-inside text-sm">
          {profile.jobTitles
            .filter(jt => jt.department && jt.title)
            .map((jt, i) => (
              <li key={i}>{jt.title} ({jt.department})</li>
            ))}
        </ul>
      </div>

      {/* Projects */}
      {profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Selected Projects</h2>
          <ul className="space-y-1 text-sm">
            {profile.projects
              .filter(p => p.projectName && p.role)
              .slice(0, 5)
              .map((p, i) => (
                <li key={i}>
                  <strong>{p.projectName}</strong> — {p.role}
                  {p.description && <span>: {p.description}</span>}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Contact Info */}
      {(profile.contactInfo?.email || profile.contactInfo?.website || profile.contactInfo?.instagram) && (
        <div>
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Contact</h2>
          <ul className="text-sm">
            {profile.contactInfo.email && <li>Email: {profile.contactInfo.email}</li>}
            {profile.contactInfo.phone && <li>Phone: {profile.contactInfo.phone}</li>}
            {profile.contactInfo.website && <li>Website: {profile.contactInfo.website}</li>}
            {profile.contactInfo.instagram && <li>Instagram: @{profile.contactInfo.instagram}</li>}
          </ul>
        </div>
      )}

      {/* Other Info */}
      {profile.otherInfo && (
        <div>
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Other Info</h2>
          <p className="text-sm whitespace-pre-wrap">{profile.otherInfo}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeView;
