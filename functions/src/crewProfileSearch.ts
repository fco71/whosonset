const SEARCH_INDEX_VERSION = 1;
const MIN_PREFIX_LENGTH = 2;
const MAX_PREFIX_LENGTH = 40;
const MAX_PREFIX_COUNT = 160;

export interface CrewProfileSearchIndex {
  searchPrefixes: string[];
  searchIndexVersion: number;
}

export function normalizeCrewSearchText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9@._+\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function addPrefixes(prefixes: Set<string>, value: string): void {
  if (value.length < MIN_PREFIX_LENGTH || prefixes.size >= MAX_PREFIX_COUNT) return;
  const maxLength = Math.min(value.length, MAX_PREFIX_LENGTH);
  for (let length = MIN_PREFIX_LENGTH; length <= maxLength; length += 1) {
    prefixes.add(value.slice(0, length));
    if (prefixes.size >= MAX_PREFIX_COUNT) return;
  }
}

export function buildCrewProfileSearchIndex(
  profile: Record<string, unknown>
): CrewProfileSearchIndex {
  const jobTitles = Array.isArray(profile.jobTitles)
    ? profile.jobTitles.flatMap((jobTitle) => {
        if (typeof jobTitle === 'string') return [jobTitle];
        if (jobTitle && typeof jobTitle === 'object') {
          const title = (jobTitle as Record<string, unknown>).title;
          return typeof title === 'string' ? [title] : [];
        }
        return [];
      })
    : [];
  const values = [
    profile.name,
    profile.displayName,
    profile.username,
    profile.email,
    profile.company,
    ...jobTitles
  ]
    .map(normalizeCrewSearchText)
    .filter(Boolean);

  const prefixes = new Set<string>();
  for (const value of values) {
    addPrefixes(prefixes, value);
    for (const token of value.split(' ')) {
      addPrefixes(prefixes, token);
    }
    if (prefixes.size >= MAX_PREFIX_COUNT) break;
  }

  return {
    searchPrefixes: [...prefixes].sort(),
    searchIndexVersion: SEARCH_INDEX_VERSION
  };
}

export function crewProfileSearchIndexMatches(
  profile: Record<string, unknown>,
  expected: CrewProfileSearchIndex
): boolean {
  if (profile.searchIndexVersion !== expected.searchIndexVersion) return false;
  if (!Array.isArray(profile.searchPrefixes)) return false;
  if (profile.searchPrefixes.length !== expected.searchPrefixes.length) return false;
  return profile.searchPrefixes.every((value, index) => value === expected.searchPrefixes[index]);
}
