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
  if (isCrewProfile(profile)) {
    return profile.name || 'Unknown Crew';
  }
  return profile.displayName || profile.firstName || profile.email?.split('@')[0] || 'Unknown User';
}

// Helper function to get a photo URL from any profile type
export function getPhotoUrl(profile: Profile): string | undefined {
  if (isCrewProfile(profile)) {
    return profile.profileImageUrl;
  }
  return profile.avatarUrl || profile.photoURL;
}

// Helper to get the ID from any profile type
export function getProfileId(profile: Profile): string {
  if (isCrewProfile(profile)) {
    return profile.uid || profile.id;
  }
  return profile.id;
}
