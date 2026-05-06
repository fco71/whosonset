import { JobTitleEntry } from './JobTitleEntry';
import { ProjectEntry } from './ProjectEntry';

// Unified CrewProfile interface for the entire application
export type CrewProfileType = 'professional' | 'student' | 'teacher';

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
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  grade: '',
  description: ''
};

export interface StudentProfileInfo {
  /** Optional school, university, or training program name */
  institution?: string;
}

export interface TeacherProfileInfo {
  /** Optional school, university, or training program name */
  institution?: string;
  /** Optional classes, workshops, or subjects taught */
  classes?: string[];
}

export interface SelectedTeacherInfo {
  uid: string;
  name: string;
  institution?: string;
  /**
   * Names of this teacher's classes that the student is enrolled in.
   * Optional — student may select the teacher without picking a specific class.
   * Used by the teacher's "My Students" view to group/single out students by class.
   */
  classes?: string[];
}

export interface CrewProfile {
  uid: string;
  name: string;
  username: string;
  bio?: string;
  profileImageUrl?: string;
  profileType?: CrewProfileType;
  studentInfo?: StudentProfileInfo;
  teacherInfo?: TeacherProfileInfo;
  /** Legacy/simple flag kept for compatibility with existing reads and filters */
  isStudent?: boolean;
  /** Legacy/simple flag kept for compatibility with existing reads and filters */
  isTeacher?: boolean;
  /** Legacy/simple school field kept for compatibility with existing reads and filters */
  school?: string;
  /** Legacy/simple teacher institution field kept for compatibility with existing reads and filters */
  teacherInstitution?: string;
  /** Legacy/simple teacher classes field kept for compatibility with existing reads and filters */
  teacherClasses?: string[];
  /** Teachers selected by a student profile */
  selectedTeacherIds?: string[];
  /** Display metadata for selected teachers */
  selectedTeachers?: SelectedTeacherInfo[];
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
  emailPrivate?: boolean; // true = hidden on website, false/undefined = visible
  phonePrivate?: boolean; // true = hidden on website, false/undefined = visible
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
  profileType?: CrewProfileType;
  studentInfo?: StudentProfileInfo;
  teacherInfo?: TeacherProfileInfo;
  selectedTeacherIds?: string[];
  selectedTeachers?: SelectedTeacherInfo[];
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
