const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const HREFLANG_CODES = ['en', 'es'] as const;
const MANAGED_HREFLANG_SELECTOR = 'link[rel="alternate"][data-seo-managed="hreflang"]';
const MANAGED_PAGINATION_SELECTOR = 'link[rel="prev"][data-seo-managed="pagination"], link[rel="next"][data-seo-managed="pagination"]';

export interface SeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

function upsertMetaTag(
  key: string,
  value: string,
  attribute: 'name' | 'property' = 'name'
): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
}

function upsertCanonicalLink(href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertAlternateLink(hrefLang: string, href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hrefLang}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('data-seo-managed', 'hreflang');
    document.head.appendChild(link);
  }

  link.setAttribute('hreflang', hrefLang);
  link.setAttribute('href', href);
}

function removeManagedAlternateLinks(): void {
  document.head.querySelectorAll<HTMLLinkElement>(MANAGED_HREFLANG_SELECTOR).forEach((link) => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  });
}

function removeManagedPaginationLinks(): void {
  document.head.querySelectorAll<HTMLLinkElement>(MANAGED_PAGINATION_SELECTOR).forEach((link) => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  });
}

function upsertPaginationLink(rel: 'prev' | 'next', href: string): void {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-seo-managed="pagination"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('data-seo-managed', 'pagination');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function buildLocalizedUrl(baseUrl: string, lang: string): string {
  const localized = new URL(baseUrl);
  localized.searchParams.set('lang', lang);
  return localized.toString();
}

function setDefaultHreflangLinks(canonicalUrl: string): void {
  try {
    const canonical = canonicalUrl.startsWith('http')
      ? new URL(canonicalUrl)
      : new URL(canonicalUrl, window.location.origin);
    canonical.searchParams.delete('lang');
    const baseCanonical = canonical.toString();

    removeManagedAlternateLinks();
    HREFLANG_CODES.forEach((code) => {
      upsertAlternateLink(code, buildLocalizedUrl(baseCanonical, code));
    });
    upsertAlternateLink('x-default', baseCanonical);
  } catch (error) {
    console.error('[seo] Failed to set hreflang links:', error);
  }
}

function removeMetaTag(
  key: string,
  attribute: 'name' | 'property' = 'name'
): void {
  const tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (tag?.parentNode) {
    tag.parentNode.removeChild(tag);
  }
}

export function setPageSeo(config: SeoConfig): void {
  const {
    title,
    description,
    canonicalUrl,
    robots = DEFAULT_ROBOTS,
    ogType = 'website',
    ogImage,
    twitterCard = 'summary_large_image',
  } = config;

  document.title = title;
  upsertMetaTag('description', description);
  upsertMetaTag('robots', robots);
  upsertMetaTag('og:type', ogType, 'property');
  upsertMetaTag('og:site_name', 'My Film Jobs', 'property');
  upsertMetaTag('og:title', title, 'property');
  upsertMetaTag('og:description', description, 'property');
  upsertMetaTag('og:url', canonicalUrl, 'property');
  if (ogImage) {
    upsertMetaTag('og:image', ogImage, 'property');
    upsertMetaTag('twitter:image', ogImage);
  } else {
    removeMetaTag('og:image', 'property');
    removeMetaTag('twitter:image');
  }
  upsertMetaTag('twitter:card', twitterCard);
  upsertMetaTag('twitter:title', title);
  upsertMetaTag('twitter:description', description);
  upsertCanonicalLink(canonicalUrl);
  setDefaultHreflangLinks(canonicalUrl);
}

export function setPaginationLinks(config: { prevUrl?: string; nextUrl?: string }): void {
  removeManagedPaginationLinks();
  if (config.prevUrl) {
    upsertPaginationLink('prev', config.prevUrl);
  }
  if (config.nextUrl) {
    upsertPaginationLink('next', config.nextUrl);
  }
}

export function clearPaginationLinks(): void {
  removeManagedPaginationLinks();
}

export function setStructuredData(scriptId: string, value: unknown): void {
  let script = document.getElementById(scriptId);
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(value);
}

export function removeStructuredData(scriptId: string): void {
  const script = document.getElementById(scriptId);
  if (script?.parentNode) {
    script.parentNode.removeChild(script);
  }
}
