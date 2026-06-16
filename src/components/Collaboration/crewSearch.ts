import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../firebase';

// Crew-profile search used by the invite flows (hub modals + group page).
// Search remains broader than approved contacts so classmates and teachers can
// find each other, but the callable returns only bounded identity fields instead
// of downloading every crew profile to the browser.

export interface CrewSearchResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  company?: string;
  disabled?: boolean;
}

interface CrewProfilesResponse {
  profiles: CrewSearchResult[];
}

const functions = getFunctions(app, 'us-central1');
const searchCrewProfilesCallable = httpsCallable<{ query: string }, CrewProfilesResponse>(
  functions,
  'searchCrewProfiles'
);
const getCrewProfilesByIdsCallable = httpsCallable<{ ids: string[] }, CrewProfilesResponse>(
  functions,
  'getCrewProfilesByIds'
);

const searchCache = new Map<string, { at: number; data: CrewSearchResult[] }>();
const profileCache = new Map<string, { at: number; data: CrewSearchResult }>();
const CACHE_TTL_MS = 30000;
const PROFILE_CACHE_TTL_MS = 5 * 60 * 1000;

export async function fetchCrewProfilesByIds(ids: string[]): Promise<CrewSearchResult[]> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) return [];

  const now = Date.now();
  const found = new Map<string, CrewSearchResult>();
  const missingIds: string[] = [];
  uniqueIds.forEach(id => {
    const cached = profileCache.get(id);
    if (cached && now - cached.at < PROFILE_CACHE_TTL_MS) {
      found.set(id, cached.data);
    } else {
      missingIds.push(id);
    }
  });

  for (let offset = 0; offset < missingIds.length; offset += 100) {
    const chunk = missingIds.slice(offset, offset + 100);
    const response = await getCrewProfilesByIdsCallable({ ids: chunk });
    response.data.profiles.forEach(profile => {
      profileCache.set(profile.id, { at: now, data: profile });
      found.set(profile.id, profile);
    });
  }

  return uniqueIds.flatMap(id => {
    const profile = found.get(id);
    return profile ? [profile] : [];
  });
}

export async function searchCrewProfiles(
  queryStr: string,
  options: { excludeUid?: string | null; approvedContacts?: string[] } = {}
): Promise<CrewSearchResult[]> {
  const { excludeUid, approvedContacts = [] } = options;
  const query = queryStr.trim();
  if (query.length < 2) return [];

  const cacheKey = query.toLowerCase();
  const cached = searchCache.get(cacheKey);
  let results: CrewSearchResult[];
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    results = cached.data;
  } else {
    const response = await searchCrewProfilesCallable({ query });
    results = response.data.profiles;
    searchCache.set(cacheKey, { at: Date.now(), data: results });
    results.forEach(profile => profileCache.set(profile.id, { at: Date.now(), data: profile }));
  }

  return results
    .filter(user => user.id !== excludeUid)
    .sort((a, b) => {
      // Approved contacts first, then alphabetical.
      const aContact = approvedContacts.includes(a.id) ? 0 : 1;
      const bContact = approvedContacts.includes(b.id) ? 0 : 1;
      if (aContact !== bContact) return aContact - bContact;
      return (a.name || '').localeCompare(b.name || '');
    });
}
