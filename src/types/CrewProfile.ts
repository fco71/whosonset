import { JobTitleEntry } from './JobTitleEntry';
import { ProjectEntry } from './ProjectEntry';

// Unified CrewProfile interface for the entire application
export interface CrewProfile {
  uid: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
  jobTitles: JobTitleEntry[];
  residences: Residence[];
  projects?: ProjectEntry[];
  education?: string[];
  contactInfo?: ContactInfo;
  otherInfo?: string;
  isPublished: boolean;
  availability?: 'available' | 'unavailable' | 'soon';
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
  education: string[];
  contactInfo?: ContactInfo;
  otherInfo?: string;
  isPublished?: boolean;
  availability?: 'available' | 'unavailable' | 'soon';
} 