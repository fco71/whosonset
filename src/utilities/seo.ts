const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

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
