// Helpers for the programmatic crew directory (Spanish-first SEO landing pages).
// Taxonomy lives in src/data/directoryTaxonomy.json (shared with the sitemap script).

import taxonomy from '../data/directoryTaxonomy.json';

export interface DirectoryCategory {
  slug: string;
  es: string;
  en: string;
  department: string;
}

export interface DirectoryRegion {
  slug: string;
  label: string;
  national?: boolean;
  cities: string[];
}

export const CATEGORIES: DirectoryCategory[] = taxonomy.categories;
export const REGIONS: DirectoryRegion[] = taxonomy.regions as DirectoryRegion[];

const BASE_URL = 'https://myfilmjobs.com';

export function getCategoryBySlug(slug?: string): DirectoryCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getRegionBySlug(slug?: string): DirectoryRegion | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function directoryPath(categorySlug: string, regionSlug: string): string {
  return `/directorio/${categorySlug}/${regionSlug}`;
}

export function directoryCanonical(categorySlug: string, regionSlug: string): string {
  return `${BASE_URL}${directoryPath(categorySlug, regionSlug)}`;
}

function normalize(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents so "Samaná" matches "samana"
    .trim();
}

/** A loose crew-profile shape; the directory only needs these fields. */
export interface CrewLike {
  id?: string;
  name?: string;
  city?: string;
  country?: string;
  profileImageUrl?: string;
  jobTitles?: Array<{ department?: string; title?: string }>;
}

export function crewMatchesCategory(crew: CrewLike, category: DirectoryCategory): boolean {
  const titles = Array.isArray(crew.jobTitles) ? crew.jobTitles : [];
  return titles.some((t) => normalize(t?.department) === normalize(category.department));
}

export function crewMatchesRegion(crew: CrewLike, region: DirectoryRegion): boolean {
  if (region.national) {
    // National page: include anyone in the DR (or with no country set, to be inclusive while data is sparse).
    const country = normalize(crew.country);
    return !country || country.includes('repu') || country === 'do' || country.includes('dominican');
  }
  const city = normalize(crew.city);
  if (!city) return false;
  if (city === normalize(region.label)) return true;
  return region.cities.some((c) => {
    const n = normalize(c);
    return city === n || city.includes(n) || n.includes(city);
  });
}

export function primaryTitle(crew: CrewLike): string {
  const t = Array.isArray(crew.jobTitles) ? crew.jobTitles[0] : undefined;
  return (t?.title || t?.department || '').trim();
}
