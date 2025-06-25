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
  const containerStyle: React.CSSProperties = {
    width: '210mm',
    height: '297mm',
    maxWidth: '8.5in',
    maxHeight: '11in',
    margin: '0 auto',
    background: 'white',
    color: 'black',
    fontFamily: "'Times New Roman', serif",
    fontSize: '12pt',
    lineHeight: 1.4,
    padding: '20mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12mm',
    marginBottom: '8mm',
    borderBottom: '2pt solid #333',
    paddingBottom: '4mm',
  };

  const profileImageStyle: React.CSSProperties = {
    width: '35mm',
    height: '45mm',
    borderRadius: '3mm',
    objectFit: 'cover' as const,
    border: '1pt solid #ccc',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '24pt',
    fontWeight: 'bold',
    margin: 0,
    color: '#333',
  };

  const bioStyle: React.CSSProperties = {
    fontSize: '11pt',
    color: '#666',
    margin: '2mm 0 0 0',
    fontStyle: 'italic',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '6mm',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14pt',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '1pt solid #333',
    paddingBottom: '1mm',
    marginBottom: '3mm',
    textTransform: 'uppercase' as const,
    letterSpacing: '1pt',
  };

  const jobTitlesListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const jobTitleItemStyle: React.CSSProperties = {
    marginBottom: '1mm',
    fontSize: '11pt',
  };

  const projectsListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const projectItemStyle: React.CSSProperties = {
    marginBottom: '2mm',
    fontSize: '11pt',
  };

  const projectNameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#333',
  };

  const projectRoleStyle: React.CSSProperties = {
    color: '#666',
  };

  const projectDescriptionStyle: React.CSSProperties = {
    color: '#666',
    fontStyle: 'italic',
  };

  const contactListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2mm',
  };

  const contactItemStyle: React.CSSProperties = {
    fontSize: '10pt',
    color: '#333',
  };

  const otherInfoStyle: React.CSSProperties = {
    fontSize: '11pt',
    color: '#333',
    whiteSpace: 'pre-wrap' as const,
    lineHeight: 1.3,
  };

  const contentWrapperStyle: React.CSSProperties = {
    height: 'calc(297mm - 40mm)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const scrollableContentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto' as const,
  };

  return (
    <>
      <style>
        {`
          @media print {
            .resume-container {
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 15mm !important;
              box-shadow: none !important;
              page-break-after: always;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
          }
          
          @media screen and (max-width: 210mm) {
            .resume-container {
              width: 100% !important;
              max-width: 210mm !important;
              height: auto !important;
              min-height: 297mm !important;
            }
          }
        `}
      </style>
      
      <div className="resume-container" style={containerStyle}>
        <div style={contentWrapperStyle}>
          <div style={scrollableContentStyle}>
            {/* Header */}
            <div style={headerStyle}>
              {profile.profileImageUrl && (
                <img src={profile.profileImageUrl} alt="Profile" style={profileImageStyle} />
              )}
              <div>
                <h1 style={nameStyle}>{profile.name}</h1>
                {profile.bio && (
                  <p style={bioStyle}>{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Job Titles */}
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Professional Experience</h2>
              <ul style={jobTitlesListStyle}>
                {profile.jobTitles
                  .filter(jt => jt.department && jt.title)
                  .map((jt, i) => (
                    <li key={i} style={jobTitleItemStyle}>
                      <strong>{jt.title}</strong> — {jt.department}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Projects */}
            {profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 0 && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Selected Projects</h2>
                <ul style={projectsListStyle}>
                  {profile.projects
                    .filter(p => p.projectName && p.role)
                    .slice(0, 5)
                    .map((p, i) => (
                      <li key={i} style={projectItemStyle}>
                        <span style={projectNameStyle}>{p.projectName}</span>
                        <span style={projectRoleStyle}> — {p.role}</span>
                        {p.description && (
                          <span style={projectDescriptionStyle}>: {p.description}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Contact Info */}
            {(profile.contactInfo?.email || profile.contactInfo?.phone || profile.contactInfo?.website || profile.contactInfo?.instagram) && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Contact Information</h2>
                <ul style={contactListStyle}>
                  {profile.contactInfo.email && <li style={contactItemStyle}>📧 {profile.contactInfo.email}</li>}
                  {profile.contactInfo.phone && <li style={contactItemStyle}>📞 {profile.contactInfo.phone}</li>}
                  {profile.contactInfo.website && <li style={contactItemStyle}>🌐 {profile.contactInfo.website}</li>}
                  {profile.contactInfo.instagram && <li style={contactItemStyle}>📷 @{profile.contactInfo.instagram}</li>}
                </ul>
              </div>
            )}

            {/* Other Info */}
            {profile.otherInfo && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>Additional Information</h2>
                <p style={otherInfoStyle}>{profile.otherInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeView;
