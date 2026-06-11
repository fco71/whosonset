import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

// Crew-profile search used by the invite flows (hub modals + group page).
// Searches ALL crew profiles, not just the user's approved contacts: the
// collaboration assignment requires students to add arbitrary classmates and the
// teacher — people they are NOT necessarily connected to. crewProfiles is
// public-read, so this is allowed. Approved contacts are ranked first as a
// convenience when provided.

export interface CrewSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  company?: string;
}

// Module-level cache so typing doesn't re-fetch the whole collection on every
// keystroke (and pages share it). 30s TTL so newly-created classmates still appear.
let crewProfilesCache: { at: number; data: CrewSearchResult[] } | null = null;
const CACHE_TTL_MS = 30000;

export async function fetchAllCrewProfiles(): Promise<CrewSearchResult[]> {
  const now = Date.now();
  if (crewProfilesCache && now - crewProfilesCache.at < CACHE_TTL_MS) {
    return crewProfilesCache.data;
  }
  const snap = await getDocs(collection(db, 'crewProfiles'));
  const allResults = snap.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name || doc.data().displayName || `Crew Member ${doc.id.slice(-4)}`,
    email: doc.data().email || '',
    avatar: doc.data().profileImageUrl || doc.data().avatarUrl || '',
    role: doc.data().jobTitles?.[0]?.title || 'Crew Member',
    company: doc.data().company || ''
  }));
  crewProfilesCache = { at: now, data: allResults };
  if (allResults.length === 0) {
    console.warn('[crewSearch] No crew profiles found in Firestore crewProfiles collection.');
  }
  return allResults;
}

export async function searchCrewProfiles(
  queryStr: string,
  options: { excludeUid?: string | null; approvedContacts?: string[] } = {}
): Promise<CrewSearchResult[]> {
  const { excludeUid, approvedContacts = [] } = options;
  const allResults = await fetchAllCrewProfiles();
  const needle = queryStr.toLowerCase();
  return allResults
    .filter(user => user.id !== excludeUid) // can't add yourself
    .filter(user =>
      (user.name || '').toLowerCase().includes(needle) ||
      (user.email || '').toLowerCase().includes(needle) ||
      (user.role || '').toLowerCase().includes(needle) ||
      (user.company || '').toLowerCase().includes(needle)
    )
    .sort((a, b) => {
      // Approved contacts first, then alphabetical.
      const aContact = approvedContacts.includes(a.id) ? 0 : 1;
      const bContact = approvedContacts.includes(b.id) ? 0 : 1;
      if (aContact !== bContact) return aContact - bContact;
      return (a.name || '').localeCompare(b.name || '');
    });
}
