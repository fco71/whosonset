export const NOINDEX_ROBOTS = 'noindex, nofollow';

export const DEFAULT_ROUTE_SEO = {
  title: 'My Film Jobs | Film Industry Jobs and Crew Networking',
  description: 'Find film industry jobs, connect with crew members, and grow your production network on My Film Jobs.',
};

const SEO_ROUTES: { pattern: RegExp; title: string; description: string }[] = [
  {
    pattern: /^\/$/,
    title: 'My Film Jobs | Film Industry Jobs and Crew Networking',
    description: 'Find film industry jobs, connect with crew members, and grow your production network on My Film Jobs.',
  },
  {
    pattern: /^\/jobs$/,
    title: 'Film Jobs Board | Production, Crew, and Creative Roles',
    description: 'Browse current film industry job opportunities across production, post-production, and creative departments.',
  },
  {
    pattern: /^\/jobs\/[^/]+$/,
    title: 'Film Job Opportunity | My Film Jobs',
    description: 'Explore film industry job details, requirements, and application deadlines on My Film Jobs.',
  },
  {
    pattern: /^\/blog$/,
    title: 'Film Industry Blog | News and Insights',
    description: 'Curated film industry news and insights with links to original sources and member discussion.',
  },
  {
    pattern: /^\/blog\/page\/\d+$/,
    title: 'Film Industry Blog Archive | My Film Jobs',
    description: 'Browse archived film industry news pages with opportunities and collaboration insights.',
  },
  {
    pattern: /^\/blog\/[^/]+$/,
    title: 'Film Industry Insight | My Film Jobs Blog',
    description: 'Read film industry insights and discover relevant jobs and collaboration opportunities on My Film Jobs.',
  },
  {
    pattern: /^\/about$/,
    title: 'About My Film Jobs | Built for Film Professionals',
    description: 'Learn how My Film Jobs helps film professionals connect, collaborate, and find opportunities across productions.',
  },
  {
    pattern: /^\/crew-public$/,
    title: 'Film Crew Directory | Discover Crew Talent',
    description: 'Browse public film crew profiles and discover talent for your next production on My Film Jobs.',
  },
  {
    pattern: /^\/contact$/,
    title: 'Contact My Film Jobs',
    description: 'Contact the My Film Jobs team for support, partnerships, or platform inquiries.',
  },
  {
    pattern: /^\/privacy-policy$/,
    title: 'Privacy Policy | My Film Jobs',
    description: 'Read the My Film Jobs privacy policy and how we handle user data.',
  },
  {
    pattern: /^\/terms-of-service$/,
    title: 'Terms of Service | My Film Jobs',
    description: 'Review the My Film Jobs terms of service for platform usage and responsibilities.',
  },
];

const NOINDEX_ROUTE_PATTERNS: RegExp[] = [
  /^\/(?:login|register|verify-email|forgot-password|reset-password)$/,
  /^\/(?:crew|projects|my-students|my-projects|saved-crew|saved-projects|collections|social|chat|collaboration|settings|edit-profile|post-job)(?:\/|$)/,
  /^\/applications(?:\/|$)/,
  /^\/jobs\/(?:posted|applied|saved|analytics)$/,
  /^\/jobs\/[^/]+\/(?:apply|applications)$/,
  /^\/(?:debug-jobs|email-test|email-integration-test|password-reset-test)$/,
];

export function normalizeSeoPath(pathname: string): string {
  const pathOnly = (pathname || '/').split(/[?#]/)[0] || '/';
  const withLeadingSlash = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  return withLeadingSlash === '/' ? '/' : withLeadingSlash.replace(/\/+$/, '');
}

export function getSeoForPath(pathname: string): typeof DEFAULT_ROUTE_SEO {
  const normalizedPath = normalizeSeoPath(pathname);
  return SEO_ROUTES.find(route => route.pattern.test(normalizedPath)) || DEFAULT_ROUTE_SEO;
}

export function isNoindexRoute(pathname: string): boolean {
  const normalizedPath = normalizeSeoPath(pathname);
  return NOINDEX_ROUTE_PATTERNS.some(pattern => pattern.test(normalizedPath));
}

export function getRouteRobots(pathname: string): string | undefined {
  return isNoindexRoute(pathname) ? NOINDEX_ROBOTS : undefined;
}
