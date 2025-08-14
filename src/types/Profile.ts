import { CrewProfile } from './CrewProfile';
import { UserProfile } from '../utilities/userUtils';

// Base profile interface with common properties
export interface BaseProfile {
  id: string;
  displayName?: string;
  photoURL?: string;
  availability?: 'available' | 'unavailable' | 'soon' | string;
  location?: string;
  jobTitle?: string;
}

// Make sure CrewProfile has the required ID field
type ProfileCrewProfile = CrewProfile & { id: string };

// Unified profile type that can be either CrewProfile or UserProfile
export type Profile = ProfileCrewProfile | (UserProfile & BaseProfile);

// Type guard to check if a profile is a CrewProfile
export function isCrewProfile(profile: Profile): profile is ProfileCrewProfile {
  return 'jobTitles' in profile && 'residences' in profile;
}

// Type guard to check if a profile is a UserProfile
export function isUserProfile(profile: Profile): profile is (UserProfile & BaseProfile) {
  return !isCrewProfile(profile);
}

// Helper function to get a display name from any profile type
export function getDisplayName(profile: Profile): string {
  // Try all possible name/display fields for maximum compatibility
  if (isCrewProfile(profile)) {
    return (
      (profile as any).name ||
      (profile as any).displayName ||
      'Unknown Crew'
    );
  }
  return (
    (profile as any).displayName ||
    (profile as any).name ||
    (profile as any).firstName ||
    (profile as any).username ||
    (typeof (profile as any).email === 'string' ? (profile as any).email.split('@')[0] : undefined) ||
    'Unknown User'
  );
}

// Helper function to get initials from a name
export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'U';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return words
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

// Helper function to generate initials-based avatar URL
export function getInitialsAvatarUrl(name: string): string {
  const initials = getInitials(name);
  return `/api/avatar/${encodeURIComponent(initials)}`;
}

// Helper function to get a photo URL from any profile type
export function getPhotoUrl(profile: Profile): string | undefined {
  // Use only the correct field names to avoid legacy field issues
  let url = undefined;
  if (isCrewProfile(profile)) {
    // For crew profiles, use only profileImageUrl (the correct field)
    url = (profile as any).profileImageUrl;
  } else {
    // For user profiles, use only avatarUrl (the correct field)
    url = (profile as any).avatarUrl;
  }
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '/bust-avatar.svg';
  }
  return url;
}

// Helper to get the ID from any profile type
export function getProfileId(profile: Profile): string {
  if (isCrewProfile(profile)) {
    return profile.uid || profile.id;
  }
  return profile.id;
}
