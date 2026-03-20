import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectEntry } from '../types/ProjectEntry';
import { JobTitleEntry } from '../types/JobTitleEntry';
import { Residence, ContactInfo } from '../types/CrewProfile';
import { useManagedUrl } from '../hooks/useBlobUrl';
import { imageErrorFallback } from '../utilities/imageErrorFallback';
import { formatInstagramHandle } from '../lib/utils';

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
  isOwnResume?: boolean; // indicates if this is the user's own resume
}

const ResumeView: React.FC<ResumeViewProps> = (props) => {
  const { profile, isOwnResume = false } = props;
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
      (profile.residences && profile.residences.length > 2) ||
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
    
    // Residences (low priority, can be cut)
    if (profile.residences && profile.residences.length > 0) {
      const resHeight = Math.min(10, availableHeight);
      sections.push({ type: 'residences', height: resHeight, priority: 1 });
      availableHeight -= resHeight + sectionSpacing;
    }
    
    // Job Titles (medium priority)
    if (profile.jobTitles && profile.jobTitles.filter(jt => jt.department && jt.title).length > 0) {
      const jobHeight = Math.min(30, availableHeight);
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
      const eduHeight = Math.min(20, availableHeight);
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
  const hasLimits = contentLimits.length > 0;
  // Helper: section is visible if there are no limits, or if limits include it
  const sectionVisible = (type: string) => !hasLimits || !!contentLimits.find(s => s.type === type);
  
  const containerStyle: React.CSSProperties = {
    width: '210mm',
    height: '297mm',
    padding: '10mm 15mm 15mm 15mm',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    fontFamily: 'Georgia, serif',
    fontSize: '11pt',
    lineHeight: 1.3,
    color: '#333',
    boxSizing: 'border-box' as const,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10mm',
    marginBottom: '6mm',
    borderBottom: '2pt solid #333',
    paddingBottom: '3mm',
  };

  const profileImageStyle: React.CSSProperties = {
    width: '30mm',
    height: '40mm', // Original elegant rectangular aspect ratio
    borderRadius: '3mm',
    objectFit: 'cover' as const, // Cover to maintain aspect ratio
    border: '1pt solid #ccc',
    flexShrink: 0,
    backgroundColor: '#f5f5f5', // Light background for transparent images
    marginTop: '0', // Ensure photo starts at the very top
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '22pt',
    fontWeight: 'bold',
    margin: 0,
    padding: '1mm 0 0 0', // Small top padding so ascenders aren't clipped
    color: '#333',
    lineHeight: 1.2,
  };

  const bioStyle: React.CSSProperties = {
    fontSize: '10pt', // Match the Languages section text size exactly
    color: '#333', // Match the Languages section color exactly
    margin: '2mm 0 0 0',
    fontStyle: 'italic',
    fontWeight: 'normal', // Ensure same weight as Languages section
    // Align bio with bottom of profile photo (40mm photo height)
    maxHeight: '38mm', // 40mm photo height minus 2mm margin
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 8, // Allow more lines to fill the space
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

  // No inner content wrapper needed — the container's A4 dimensions
  // with overflow:hidden handle page bounds for both preview and PDF.

  return (
    <>
      <style>
        {`
          @media print {
            .resume-container {
              width: 210mm !important;
              height: 297mm !important;
              margin: 0 !important;
              padding: 10mm 15mm 15mm 15mm !important; /* Match container padding */
              box-shadow: none !important;
              page-break-after: avoid;
              page-break-inside: avoid;
              break-inside: avoid;
              font-size: 11pt !important;
              line-height: 1.3 !important;
              font-family: Georgia, serif !important; /* Match preview font */
            }
            
            .resume-container img {
              max-width: 30mm !important;
              max-height: 40mm !important;
              object-fit: cover !important;
            }
            
            .resume-container h1 {
              font-size: 22pt !important;
              font-weight: bold !important;
              margin: 0 !important;
              padding: 1mm 0 0 0 !important;
              color: #333 !important;
              line-height: 1.2 !important;
            }
            
            .resume-container h2 {
              font-size: 13pt !important;
              font-weight: bold !important;
              padding-bottom: 3mm !important;
              margin-bottom: 5mm !important;
              border-bottom: 1pt solid #333 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5pt !important;
            }
            
            .resume-container p, .resume-container li {
              font-size: 10pt !important;
              margin-bottom: 1mm !important;
              color: #333 !important;
            }
            
            /* Bio text specific styling to match preview exactly */
            .resume-container p {
              font-size: 10pt !important; /* Match Languages section exactly */
              color: #333 !important; /* Match Languages section color */
              font-style: italic !important;
              line-height: 1.3 !important;
              font-weight: normal !important; /* Ensure same weight as Languages */
              margin: 2mm 0 0 0 !important; /* Match preview margin */
            }
            
            /* Ensure header alignment matches preview */
            .resume-container > div:first-child {
              display: flex !important;
              align-items: flex-start !important;
              gap: 10mm !important;
              margin-bottom: 6mm !important;
              border-bottom: 2pt solid #333 !important;
              padding-bottom: 3mm !important;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
          }
          
          /* Responsive preview: scale the A4 page to fit its parent */
          .resume-preview-wrapper {
            width: 100%;
            overflow: visible;
          }

          @media screen and (max-width: 850px) {
            .resume-preview-wrapper .resume-container {
              transform-origin: top left;
              /* Scale factor is calculated by JS, but provide a sensible CSS fallback */
              transform: scale(0.85);
              margin-bottom: -40mm; /* compensate for the scaled whitespace */
            }
          }

          @media screen and (max-width: 650px) {
            .resume-preview-wrapper .resume-container {
              transform: scale(0.65);
              margin-bottom: -100mm;
            }
          }
        `}
      </style>
      
      <div className="resume-container" style={containerStyle}>
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
            {profile.languages && profile.languages.length > 0 && sectionVisible('languages') && (
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

            {/* Residences */}
            {profile.residences && profile.residences.length > 0 && sectionVisible('residences') && (
              <section style={sectionStyle}>
                <div style={sectionTitleStyle}>{t('resume.sections.residences')}</div>
                <ul style={jobTitlesListStyle}>
                  {profile.residences.slice(0, 2).map((residence, idx) => (
                    <li key={idx} style={jobTitleItemStyle}>
                      {residence.city && residence.country ? `${residence.city}, ${residence.country}` : 
                       residence.city || residence.country || ''}
                    </li>
                  ))}
                </ul>
                {profile.residences.length > 2 && (
                  <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }}>
                    ({t('resume.labels.showingTop', { count: 2, type: t('resume.types.residences') })})
                  </p>
                )}
              </section>
            )}

            {/* Job Titles */}
            {profile.jobTitles && profile.jobTitles.filter(jt => jt.department && jt.title).length > 0 && sectionVisible('jobTitles') && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>{t('resume.sections.professionalExperience')}</h2>
                <ul style={jobTitlesListStyle}>
                  {profile.jobTitles
                    .filter(jt => jt.department && jt.title)
                    .slice(0, 4) // Increased from 3 to 4
                    .map((jt, i) => (
                      <li key={i} style={jobTitleItemStyle}>
                        <strong>{jt.title}</strong> — {jt.department}
                      </li>
                    ))}
                </ul>
                {profile.jobTitles.filter(jt => jt.department && jt.title).length > 4 && (
                  <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', margin: '1mm 0 0 0' }}>
                    ({t('resume.labels.showingTop', { count: 4, type: t('resume.types.positions') })})
                  </p>
                )}
              </div>
            )}

            {/* Projects */}
            {profile.projects && profile.projects.filter(p => p.projectName && p.role).length > 0 && sectionVisible('projects') && (
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
                {/* Removed showingTop message */}
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && sectionVisible('education') && (
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
                    .slice(0, 2) // Increased from 1 to 2
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
                {/* Removed showingMostRecent message */}
              </div>
            )}

            {/* Contact Info */}
            {(profile.contactInfo?.email || profile.contactInfo?.phone || profile.contactInfo?.website || profile.contactInfo?.instagram) && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>{t('resume.sections.contactInformation')}</h2>
                <ul style={contactListStyle}>
                  {/* Show email if: it's own resume OR email is not private */}
                  {profile.contactInfo.email && (isOwnResume || !profile.contactInfo.emailPrivate) && (
                    <li style={contactItemStyle}>📧 {profile.contactInfo.email}</li>
                  )}
                  {/* Show phone if: it's own resume OR phone is not private */}
                  {profile.contactInfo.phone && (isOwnResume || !profile.contactInfo.phonePrivate) && (
                    <li style={contactItemStyle}>📞 {profile.contactInfo.phone}</li>
                  )}
                  {/* Always show website and social media */}
                  {profile.contactInfo.website && <li style={contactItemStyle}>🌐 {profile.contactInfo.website}</li>}
                  {profile.contactInfo.instagram && <li style={contactItemStyle}>📷 {formatInstagramHandle(profile.contactInfo.instagram)}</li>}
                </ul>
              </div>
            )}

            {/* Other Info */}
            {profile.otherInfo && sectionVisible('otherInfo') && (
              <div style={sectionStyle}>
                <h2 style={sectionTitleStyle}>{t('resume.sections.additionalInformation')}</h2>
                <p style={{
                  ...otherInfoStyle,
                  maxHeight: '8mm',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>{profile.otherInfo}</p>
              </div>
            )}
      </div>
    </>
  );
};

export default ResumeView;
