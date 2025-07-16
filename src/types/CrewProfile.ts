import { JobTitleEntry } from './JobTitleEntry';
import { ProjectEntry } from './ProjectEntry';

// Unified CrewProfile interface for the entire application
export type EducationLevel = 
  | 'high_school' 
  | 'associate' 
  | 'bachelor' 
  | 'master' 
  | 'phd' 
  | 'professional_certification' 
  | 'other';

export interface EducationEntry {
  /** Name of the educational institution */
  institution: string;
  
  /** Location of the institution (city, country, or both) */
  place?: string;
  
  /** Type of degree or certification */
  degree?: string;
  
  /** Level of education */
  level?: EducationLevel;
  
  /** Field of study or major */
  fieldOfStudy?: string;
  
  /** End date in YYYY-MM format or 'Present' */
  endDate?: string;
  
  /** Start date in YYYY-MM format */
  startDate?: string;
  
  /** Whether the user is currently studying here */
  isCurrent?: boolean;
  
  /** Grade/GPA if applicable */
  grade?: string;
  
  /** Additional notes or achievements */
  description?: string;
}

/** Default empty education entry */
export const DEFAULT_EDUCATION_ENTRY: Omit<EducationEntry, 'isCurrent'> = {
  institution: '',
  place: '',
  degree: '',
  level: undefined,
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  grade: '',
  description: ''
};

export interface CrewProfile {
  uid: string;
  name: string;
  username: string;
  bio?: string;
  profileImageUrl?: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
  projects?: ProjectEntry[];
  education?: EducationEntry[];
  contactInfo?: ContactInfo;
  otherInfo?: string;
  isPublished: boolean;
  availability?: 'available' | 'unavailable' | 'soon';
  languages?: string[];
}

// Supporting interfaces
export interface Residence {
  country: string;
  city: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
}

// Legacy interface for backward compatibility (used in some saved collections)
export interface LegacyCrewProfile {
  id: string;
  name: string;
  role: string;
  bio: string;
  location: string;
  resumeUrl?: string;
  avatarUrl?: string;
}

// Form data interface for editing
export interface CrewProfileFormData {
  name: string;
  bio: string;
  profileImageUrl: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  contactInfo?: ContactInfo;
  otherInfo?: string;
  isPublished?: boolean;
  availability?: 'available' | 'unavailable' | 'soon';
  languages?: string[];
} 