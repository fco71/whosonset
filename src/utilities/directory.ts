// Helpers for the programmatic crew directory (Spanish-first SEO landing pages).
// Taxonomy lives in src/data/directoryTaxonomy.json (shared with the sitemap script).

import taxonomy from '../data/directoryTaxonomy.json';

export interface DirectoryCategory {
  slug: string;
  enSlug: string;
  es: string;
  en: string;
  department: string;
}

export interface DirectoryRegion {
  slug: string;
  enSlug: string;
  label: string;
  en: string;
  national?: boolean;
  cities: string[];
}

export type DirectoryLang = 'es' | 'en';

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

// ---- English mirror (/directory) ----------------------------------------
// English uses EXPLICIT slugs from the taxonomy (c.enSlug / r.enSlug) so the
// client route and the prerender resolve the SAME URL — never slugify at runtime
// in two places, or the two would diverge.

export function getCategoryByEnSlug(slug?: string): DirectoryCategory | undefined {
  return CATEGORIES.find((c) => c.enSlug === slug);
}

export function getRegionByEnSlug(slug?: string): DirectoryRegion | undefined {
  return REGIONS.find((r) => r.enSlug === slug);
}

export function enCategorySlug(c: DirectoryCategory): string {
  return c.enSlug;
}

export function enRegionSlug(r: DirectoryRegion): string {
  return r.enSlug;
}

export function directoryPathEn(catEnSlug: string, regionEnSlug: string): string {
  return `/directory/${catEnSlug}/${regionEnSlug}`;
}

export function directoryCanonicalEn(catEnSlug: string, regionEnSlug: string): string {
  return `${BASE_URL}${directoryPathEn(catEnSlug, regionEnSlug)}`;
}

/** Language-aware visible labels. */
export function categoryLabel(c: DirectoryCategory, lang: DirectoryLang): string {
  return lang === 'en' ? c.en : c.es;
}

export function regionLabel(r: DirectoryRegion, lang: DirectoryLang): string {
  return lang === 'en' ? r.en : r.label;
}

/**
 * The path for the SAME category+region in the OTHER language. Used by hreflang
 * and by the global EN/ES nav toggle to switch the directory between its two URLs.
 */
export function counterpartPath(
  lang: DirectoryLang,
  category: DirectoryCategory,
  region: DirectoryRegion
): string {
  // `lang` is the language we are switching TO.
  return lang === 'en'
    ? directoryPathEn(category.enSlug, region.enSlug)
    : directoryPath(category.slug, region.slug);
}

/** Hub counterpart path for the OTHER language (en→/directory, es→/directorio). */
export function hubCounterpartPath(lang: DirectoryLang): string {
  return lang === 'en' ? '/directory' : '/directorio';
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
