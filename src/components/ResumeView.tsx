import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectEntry } from '../types/ProjectEntry';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { Residence, ContactInfo } from '../types/CrewProfile';
import { useManagedUrl } from '../hooks/useBlobUrl';
import { imageErrorFallback } from '../utilities/imageErrorFallback';

// Import html2pdf using require to bypass TypeScript issues
const html2pdf = require('html2pdf.js');

interface Project {
  projectName: string;
  role: string;
  description: string;
}

// Support both string and structured education entries during transition
type EducationEntry = string | {
  institution?: string;
  place?: string;  // Can be city, country, or both (e.g., 'New York' or 'Spain' or 'New York, USA')
  degree?: string;
  fieldOfStudy?: string;
  endDate?: string;
  isCurrent?: boolean;
};

interface CrewProfileData {
  name: string;
  profileImageUrl?: string;
  photoURL?: string; // Fallback for legacy data
  bio?: string;
  jobTitles: JobTitleEntry[];
  projects?: Project[];
  residences?: Residence[];
  education?: EducationEntry[];
  contactInfo?: ContactInfo;
  otherInfo?: string;
  languages?: string[];
}

interface ResumeViewProps {
  profile: CrewProfileData;
  editable?: boolean; // for future use
}

const ResumeView: React.FC<ResumeViewProps> = (props) => {
  const { profile } = props;
  const { t } = useTranslation();
  // Fallback: use photoURL if profileImageUrl is missing
  const managedProfileImageUrl = useManagedUrl(profile?.profileImageUrl || profile?.photoURL);
  
  // Calculate available space and prioritize content
  const calculateContentLimits = () => {
    const totalHeight = 297; // A4 height in mm
    const padding = 30; // 15mm top + 15mm bottom
    const headerHeight = 25; // Original header height
    const contactHeight = 15; // Contact section is critical, reserve space
    const sectionSpacing = 5; // Original spacing between sections
    
    let availableHeight = totalHeight - padding - headerHeight - contactHeight;
    let sections = [];
    
    // Only apply limits if content would overflow
    const hasManySections = (
      (profile.languages && profile.languages.length > 2) ||
      (profile.jobTitles && profile.jobTitles.filter(jt => jt.department && jt.title).length > 4) ||
      (profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 3) ||
      (profile.education && profile.education.length > 2) ||
      (profile.otherInfo && profile.otherInfo.length > 200)
    );
    
    if (!hasManySections) {
      // If content is reasonable, don't apply limits
      return [];
    }
    
    // Languages (low priority, can be cut)
    if (profile.languages && profile.languages.length > 0) {
      const langHeight = Math.min(10, availableHeight);
      sections.push({ type: 'languages', height: langHeight, priority: 1 });
      availableHeight -= langHeight + sectionSpacing;
    }
    
    // Job Titles (medium priority)
    if (profile.jobTitles && profile.jobTitles.filter(jt => jt.department && jt.title).length > 0) {
      const jobHeight = Math.min(25, availableHeight);
      sections.push({ type: 'jobTitles', height: jobHeight, priority: 2 });
      availableHeight -= jobHeight + sectionSpacing;
    }
    
    // Projects (medium priority)
    if (profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 0) {
      const projectHeight = Math.min(20, availableHeight);
      sections.push({ type: 'projects', height: projectHeight, priority: 3 });
      availableHeight -= projectHeight + sectionSpacing;
    }
    
    // Education (medium priority)
    if (profile.education && profile.education.length > 0) {
      const eduHeight = Math.min(15, availableHeight);
      sections.push({ type: 'education', height: eduHeight, priority: 4 });
      availableHeight -= eduHeight + sectionSpacing;
    }
    
    // Other Info (lowest priority, can be cut)
    if (profile.otherInfo && availableHeight > 10) {
      const otherHeight = Math.min(10, availableHeight);
      sections.push({ type: 'otherInfo', height: otherHeight, priority: 5 });
    }
    
    return sections;
  };
  
  const contentLimits = calculateContentLimits();
  
  const containerStyle: React.CSSProperties = {
    width: '210mm',
    height: '297mm',
    maxWidth: '8.5in',
    maxHeight: '11in',
    margin: '0 auto',
    background: 'white',
    color: 'black',
    fontFamily: "'Times New Roman', serif",
    fontSize: '11pt',
    lineHeight: 1.3,
    padding: '15mm',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    position: 'relative',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start', // This ensures name aligns with top of photo
    gap: '10mm',
    marginBottom: '6mm',
    borderBottom: '2pt solid #333',
    paddingBottom: '3mm',
    paddingTop: '0', // Remove top padding to align name with photo
  };

  const profileImageStyle: React.CSSProperties = {
    width: '30mm',
    height: '40mm', // Original elegant rectangular aspect ratio
    borderRadius: '3mm',
    objectFit: 'cover' as const, // Cover to maintain aspect ratio
    border: '1pt solid #ccc',
    flexShrink: 0,
    backgroundColor: '#f5f5f5', // Light background for transparent images
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '22pt',
    fontWeight: 'bold',
    margin: 0,
    padding: 0, // Remove all padding
    color: '#333',
    alignSelf: 'flex-start', // Ensure name aligns with top of photo
    lineHeight: 1, // Tight line height for better alignment
  };

  const bioStyle: React.CSSProperties = {
    fontSize: '11pt',
    color: '#666',
    margin: '2mm 0 0 0',
    fontStyle: 'italic',
    // Simple truncation with ellipsis
    maxHeight: '12mm', // About 3 lines maximum
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    lineHeight: 1.3,
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '5mm',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '13pt',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '1pt solid #333',
    paddingBottom: '3mm',
    marginBottom: '5mm',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5pt',
  };

  const jobTitlesListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const jobTitleItemStyle: React.CSSProperties = {
    marginBottom: '1mm',
    fontSize: '10pt',
  };

  const projectsListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const projectItemStyle: React.CSSProperties = {
    marginBottom: '2mm',
    fontSize: '10pt',
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
    fontSize: '10pt',
    color: '#333',
    whiteSpace: 'pre-wrap' as const,
    lineHeight: 1.3,
  };

  const contentWrapperStyle: React.CSSProperties = {
    height: 'calc(297mm - 30mm)',
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
              padding: 12mm !important;
              box-shadow: none !important;
              page-break-after: avoid;
              page-break-inside: avoid;
              break-inside: avoid;
              font-size: 11pt !important;
              line-height: 1.3 !important;
            }
            
            .resume-container img {
              max-width: 30mm !important;
              max-height: 40mm !important;
              object-fit: cover !important;
            }
            
            .resume-container h1 {
              font-size: 22pt !important;
            }
            
            .resume-container h2 {
              font-size: 13pt !important;
              padding-bottom: 3mm !important;
              margin-bottom: 5mm !important;
              border-bottom: 1pt solid #333 !important;
            }
            
            .resume-container p, .resume-container li {
              font-size: 10pt !important;
              margin-bottom: 1mm !important;
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
              {managedProfileImageUrl && (
                <img 
                  src={managedProfileImageUrl} 
                  alt="Profile" 
                  style={profileImageStyle}
                  crossOrigin="anonymous"
                  onError={e => imageErrorFallback(e)}
                />
              )}
              <div>
                <h1 style={nameStyle}>{profile.name}</h1>
                {profile.bio && (
                  <p style={bioStyle}>{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && contentLimits.find(s => s.type === 'languages') && (
              <section style={sectionStyle}>
                <div style={sectionTitleStyle}>{t('resume.sections.languages')}</div>
                <ul style={jobTitlesListStyle}>
                  {profile.languages.slice(0, 2).map((lang, idx) => (
                    <li key={idx} style={jobTitleItemStyle}>{lang}</li>
                  ))}
                </ul>
                {profile.languages.length > 2 && (
                  <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }}>
                    ({t('resume.labels.showingTop', { count: 2, type: t('resume.types.languages') })})
                  </p>
                )}
              </section>
            )}

            {/* Job Titles */}
            {profile.jobTitles && profile.jobTitles.filter(jt => jt.department && jt.title).length > 0 && contentLimits.find(s => s.type === 'jobTitles') && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>{t('resume.sections.professionalExperience')}</h2>
                <ul style={jobTitlesListStyle}>
                  {profile.jobTitles
                    .filter(jt => jt.department && jt.title)
                    .slice(0, 3) // Reduced from 4 to 3
                    .map((jt, i) => (
                      <li key={i} style={jobTitleItemStyle}>
                        <strong>{jt.title}</strong> — {jt.department}
                      </li>
                    ))}
                </ul>
                {profile.jobTitles.filter(jt => jt.department && jt.title).length > 3 && (
                  <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }}>
                    ({t('resume.labels.showingTop', { count: 3, type: t('resume.types.positions') })})
                  </p>
                )}
              </div>
            )}

            {/* Projects */}
            {profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 0 && contentLimits.find(s => s.type === 'projects') && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>{t('resume.sections.selectedProjects')}</h2>
                <ul style={projectsListStyle}>
                  {profile.projects
                    .filter(p => p.projectName && p.role)
                    .slice(0, 2) // Reduced from 3 to 2
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
                {profile.projects.filter(p => p.projectName && p.role).length > 2 && (
                  <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }}>
                    ({t('resume.labels.showingTop', { count: 2, type: t('resume.types.projects') })})
                  </p>
                )}
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && contentLimits.find(s => s.type === 'education') && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>{t('resume.sections.education')}</h2>
                <ul style={jobTitlesListStyle}>
                  {profile.education
                    .filter(edu => {
                      // Handle both string and object formats
                      if (typeof edu === 'string') return edu.trim() !== '';
                      // Only show if there's at least one piece of information
                      return edu.institution || edu.degree || edu.fieldOfStudy || edu.endDate || edu.isCurrent;
                    })
                    .slice(0, 1) // Reduced from 2 to 1
                    .map((edu, i) => {
                      // Handle string format (legacy)
                      if (typeof edu === 'string') {
                        return (
                          <li key={i} style={{ ...jobTitleItemStyle, marginBottom: '4mm' }}>
                            <div style={{ color: '#444' }}>{edu}</div>
                          </li>
                        );
                      }
                      
                      // Handle new structured format
                      const dateInfo = [];
                      
                      // Only show end date or current status
                      if (edu.isCurrent) {
                        dateInfo.push(t('resume.labels.present'));
                      } else if (edu.endDate) {
                        const endDate = new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' });
                        dateInfo.push(endDate);
                      }
                      
                      // Build the title line (bold) - only show degree in bold
                      const titleParts = [
                        edu.degree
                      ].filter(Boolean);
                      
                      // Build the subtitle line (regular) - include field of study, institution, place, and dates
                      const subtitleParts = [
                        edu.fieldOfStudy,
                        edu.institution,
                        edu.place,
                        dateInfo.length > 0 ? dateInfo.join(', ') : null
                      ].filter(Boolean);
                      
                      return (
                        <li key={i} style={{ ...jobTitleItemStyle, marginBottom: '4mm' }}>
                          {titleParts.length > 0 && (
                            <div style={{ fontWeight: 'bold', color: '#333' }}>
                              {titleParts.join('')}
                            </div>
                          )}
                          {subtitleParts.length > 0 && (
                            <div style={{ color: '#555' }}>
                              {subtitleParts.join(', ')}
                            </div>
                          )}
                        </li>
                      );
                    })}
                </ul>
                {profile.education.length > 1 && (
                  <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }}>
                    ({t('resume.labels.showingMostRecent', { count: 1 })})
                  </p>
                )}
              </div>
            )}

            {/* Contact Info */}
            {(profile.contactInfo?.email || profile.contactInfo?.phone || profile.contactInfo?.website || profile.contactInfo?.instagram) && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>{t('resume.sections.contactInformation')}</h2>
                <ul style={contactListStyle}>
                  {profile.contactInfo.email && <li style={contactItemStyle}>📧 {profile.contactInfo.email}</li>}
                  {profile.contactInfo.phone && <li style={contactItemStyle}>📞 {profile.contactInfo.phone}</li>}
                  {profile.contactInfo.website && <li style={contactItemStyle}>🌐 {profile.contactInfo.website}</li>}
                  {profile.contactInfo.instagram && <li style={contactItemStyle}>📷 @{profile.contactInfo.instagram}</li>}
                </ul>
              </div>
            )}

            {/* Other Info */}
            {profile.otherInfo && contentLimits.find(s => s.type === 'otherInfo') && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>{t('resume.sections.additionalInformation')}</h2>
                <p style={{
                  ...otherInfoStyle,
                  maxHeight: '8mm', // Limit height for other info
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>{profile.otherInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeView;
