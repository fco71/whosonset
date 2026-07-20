import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import * as fs from "fs";
import * as path from "path";

/**
 * Dynamic rendering for crawlers and social-link scrapers.
 *
 * The site is a client-rendered SPA: the HTML that ships is a shell, and all
 * per-page <title>/description/Open-Graph/JSON-LD is injected by JavaScript at
 * runtime. Googlebot runs JS, but social unfurlers (WhatsApp, Facebook, X,
 * LinkedIn, Slack, Telegram, Discord) do NOT — so every shared job/profile/post
 * link currently shows the generic homepage card.
 *
 * Firebase Hosting rewrites /jobs/**, /blog/**, /resume/** to this function.
 *   - Humans (no bot UA): get the SPA template back, unchanged — fast, no reads.
 *   - Bots: we read the entity from Firestore and swap the managed <meta> block
 *     (bracketed by <meta name="prerender-managed"> in index.html) with correct
 *     per-URL tags + JSON-LD (JobPosting / NewsArticle / ProfilePage).
 *
 * Nothing private is ever served: only public docs are enriched, and only the
 * already-public SPA shell is returned to humans.
 */

const SITE_NAME = "My Film Jobs";
const CANONICAL_ORIGIN = "https://myfilmjobs.com";
const DEFAULT_OG_IMAGE = `${CANONICAL_ORIGIN}/og-image.jpg`;
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const NOINDEX_ROBOTS = "noindex, nofollow";

// Crawlers + social unfurlers that need server-rendered meta (they don't run JS).
const BOT_UA = new RegExp(
  [
    "googlebot", "google-inspectiontool", "googleother", "storebot-google", "mediapartners-google",
    "bingbot", "bingpreview", "adidxbot", "duckduckbot", "baiduspider", "yandex", "slurp", "sogou",
    "facebookexternalhit", "facebot", "twitterbot", "linkedinbot", "pinterest", "slackbot",
    "slack-imgproxy", "telegrambot", "whatsapp", "discordbot", "redditbot", "applebot",
    "skypeuripreview", "embedly", "quora link preview", "outbrain", "nuzzel", "vkshare",
    "w3c_validator", "flipboard", "tumblr", "bitlybot", "viber", "ahrefsbot", "semrushbot", "petalbot",
  ].join("|"),
  "i"
);

const isBot = (ua: string | undefined): boolean => !!ua && BOT_UA.test(ua);

function escapeHtml(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeText(v: unknown): string {
  return String(v ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function clip(v: unknown, n: number): string {
  const s = normalizeText(v);
  return s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`;
}

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  try {
    const v = value as any;
    if (typeof v.toDate === "function") return v.toDate().toISOString();
    if (v instanceof Date) return v.toISOString();
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
}

function absUrl(path: unknown): string {
  const p = String(path || "");
  if (/^https?:\/\//i.test(p)) return p;
  if (!p) return DEFAULT_OG_IMAGE;
  return `${CANONICAL_ORIGIN}${p.startsWith("/") ? "" : "/"}${p}`;
}

function canonicalUrlForPath(pathname: string): string {
  const pathValue = pathname || "/";
  return `${CANONICAL_ORIGIN}${pathValue.startsWith("/") ? "" : "/"}${pathValue}`;
}

function decode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// ---- directory taxonomy (programmatic Spanish SEO pages) ----
// SAME source of truth as the frontend: src/data/directoryTaxonomy.json, copied into
// functions/ at build (scripts/copy-template-to-functions.cjs). The crew-matching logic
// below MIRRORS src/utilities/directory.ts — keep the two in sync if either changes.
interface DirCategory { slug: string; enSlug: string; es: string; en: string; department: string }
interface DirRegion { slug: string; enSlug: string; label: string; en: string; national?: boolean; cities: string[] }
interface Taxonomy { categories: DirCategory[]; regions: DirRegion[] }

type DirLang = "es" | "en";

function loadTaxonomy(): Taxonomy | null {
  for (const p of [
    path.join(__dirname, "directoryTaxonomy.json"),
    path.join(__dirname, "..", "directoryTaxonomy.json"),
  ]) {
    try {
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8")) as Taxonomy;
    } catch {
      /* try next candidate */
    }
  }
  console.error("[prerender] directoryTaxonomy.json not found; directory prerender disabled");
  return null;
}
const TAXONOMY: Taxonomy | null = loadTaxonomy();

function dirNormalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents so "Samaná" matches "samana"
    .trim();
}

interface CrewLike {
  name?: string;
  city?: string;
  country?: string;
  jobTitles?: Array<{ department?: string; title?: string }>;
}

function crewMatchesCategory(crew: CrewLike, category: DirCategory): boolean {
  const titles = Array.isArray(crew.jobTitles) ? crew.jobTitles : [];
  return titles.some((t) => dirNormalize(t?.department) === dirNormalize(category.department));
}

function crewMatchesRegion(crew: CrewLike, region: DirRegion): boolean {
  if (region.national) {
    const country = dirNormalize(crew.country);
    return !country || country.includes("repu") || country === "do" || country.includes("dominican");
  }
  const city = dirNormalize(crew.city);
  if (!city) return false;
  if (city === dirNormalize(region.label)) return true;
  return region.cities.some((c) => {
    const n = dirNormalize(c);
    return city === n || city.includes(n) || n.includes(city);
  });
}

interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogType: string;
  image: string;
  robots?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  // Explicit per-language alternates (bilingual directory). Other meta types leave
  // this undefined → no hreflang emitted, matching prior behavior.
  alternates?: { es?: string; en?: string; xDefault?: string };
}

function renderHead(m: Meta): string {
  const tags = [
    `<title>${escapeHtml(m.title)}</title>`,
    `<meta name="description" content="${escapeHtml(m.description)}" />`,
    `<meta name="robots" content="${escapeHtml(m.robots || DEFAULT_ROBOTS)}" />`,
    `<link rel="canonical" href="${escapeHtml(m.canonical)}" />`,
    `<meta property="og:type" content="${escapeHtml(m.ogType)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(m.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(m.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(m.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(m.image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(m.image)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(m.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(m.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(m.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(m.image)}" />`,
  ];
  if (m.alternates) {
    if (m.alternates.es) tags.push(`<link rel="alternate" hreflang="es" href="${escapeHtml(m.alternates.es)}" />`);
    if (m.alternates.en) tags.push(`<link rel="alternate" hreflang="en" href="${escapeHtml(m.alternates.en)}" />`);
    if (m.alternates.xDefault) tags.push(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(m.alternates.xDefault)}" />`);
  }
  const blocks = m.jsonLd ? (Array.isArray(m.jsonLd) ? m.jsonLd : [m.jsonLd]) : [];
  for (const b of blocks) {
    // Strip undefined values; escape </script> breakouts.
    const json = JSON.stringify(b, (_k, val) => (val === undefined ? undefined : val)).replace(/</g, "\\u003c");
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return tags.join("\n  ");
}

// Matches the managed block between the two marker <meta> tags. Tolerant of the
// production minifier (which drops the self-closing slash and collapses whitespace).
const SEO_BLOCK =
  /<meta name="prerender-managed" content="start"[^>]*>[\s\S]*?<meta name="prerender-managed" content="end"[^>]*>/i;

function injectHead(template: string, head: string): string {
  const replacement = `<meta name="prerender-managed" content="start">\n  ${head}\n  <meta name="prerender-managed" content="end">`;
  if (SEO_BLOCK.test(template)) return template.replace(SEO_BLOCK, replacement);
  // Fallback if markers are missing for any reason: inject before </head>.
  return template.replace(/<\/head>/i, `  ${head}\n</head>`);
}

// ---- index.html template ----
// loadBundledTemplate() reads the copy of index.html bundled WITH the function at deploy
// (scripts/copy-template-to-functions.cjs). It is the FALLBACK getTemplate() uses when the
// live same-origin fetch is unavailable — always a valid scripted shell, no network needed.
function loadBundledTemplate(): string | null {
  for (const p of [
    path.join(__dirname, "prerender-template.html"),
    path.join(__dirname, "..", "prerender-template.html"),
  ]) {
    try {
      if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
    } catch {
      /* try next candidate */
    }
  }
  console.error("[prerender] bundled template not found; will fall back to same-origin fetch");
  return null;
}

const BUNDLED_TEMPLATE: string | null = loadBundledTemplate();
let liveCache: { host: string; html: string; at: number } | null = null;
const LIVE_TTL_MS = 5 * 60 * 1000;

// PRIMARY source is the LIVE shell fetched from the REQUESTING host, so its asset hashes
// always match the currently-deployed hosting — a hosting-only deploy can no longer leave a
// stale bundle and break /resume etc. The bundled copy is the guaranteed fallback when the
// live fetch is unavailable. Fetching the requesting host (not a hard-coded origin) keeps dev
// on dev and prod on prod. Worst case equals the old bundled-first behavior — it can't regress.
async function getTemplate(reqHost?: string): Promise<string | null> {
  if (reqHost) {
    const now = Date.now();
    if (liveCache && liveCache.host === reqHost && now - liveCache.at < LIVE_TTL_MS) {
      return liveCache.html;
    }
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      const resp = await fetch(`https://${reqHost}/index.html`, {
        headers: { "user-agent": "prerender-template-fetch", "cache-control": "no-cache" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (resp.ok) {
        const html = await resp.text();
        // Only trust a fetched shell that actually looks like our app.
        if (html.includes('id="root"')) {
          liveCache = { host: reqHost, html, at: now };
          return html;
        }
      }
    } catch (e) {
      console.error("[prerender] live template fetch failed, using bundled copy:", (e as Error).message);
    }
  }
  // Fallback: the copy bundled with the function (always a valid scripted shell).
  return BUNDLED_TEMPLATE ?? liveCache?.html ?? null;
}

// ---- route parsing ----
const RESERVED_JOBS = new Set(["posted", "saved", "applied", "analytics", "new", "create"]);

function isNoindexAppRoute(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean).map(decode);
  if (parts[0] !== "jobs") return false;
  if (parts.length === 2 && RESERVED_JOBS.has(parts[1])) return true;
  return parts.length === 3 && (parts[2] === "apply" || parts[2] === "applications");
}

function buildNoindexMeta(pathname: string, title = `Page Not Available | ${SITE_NAME}`): Meta {
  return {
    title,
    description: "This page is not meant to appear in public search results.",
    canonical: canonicalUrlForPath(pathname),
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
    robots: NOINDEX_ROBOTS,
  };
}

function parseEntity(pathname: string): { type: "job" | "blog" | "resume"; id: string } | null {
  const parts = pathname.split("/").filter(Boolean).map(decode);
  if (parts.length !== 2) return null; // only single-segment detail pages
  const [seg, id] = parts;
  if (!id) return null;
  if (seg === "jobs") return RESERVED_JOBS.has(id) ? null : { type: "job", id };
  if (seg === "blog") return id === "page" ? null : { type: "blog", id };
  if (seg === "resume") return { type: "resume", id };
  return null;
}

type DirRoute =
  | { kind: "hub"; lang: DirLang }
  | { kind: "landing"; lang: DirLang; categorySlug: string; regionSlug: string };
function parseDirectory(pathname: string): DirRoute | null {
  const parts = pathname.split("/").filter(Boolean).map(decode);
  const lang: DirLang | null = parts[0] === "directorio" ? "es" : parts[0] === "directory" ? "en" : null;
  if (!lang) return null;
  if (parts.length === 1) return { kind: "hub", lang };
  if (parts.length === 3) return { kind: "landing", lang, categorySlug: parts[1], regionSlug: parts[2] };
  return null; // /directorio/x (incomplete) or deeper → let the SPA handle it
}

// ---- entity → meta builders ----
const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  freelance: "CONTRACTOR",
  internship: "INTERN",
};

async function buildJob(db: admin.firestore.Firestore, id: string): Promise<Meta | null> {
  const snap = await db.collection("jobPostings").doc(id).get();
  if (!snap.exists) {
    return buildNoindexMeta(`/jobs/${encodeURIComponent(id)}`, `Job Not Found | ${SITE_NAME}`);
  }
  const j: any = snap.data() || {};

  const department = j.department || "Film";
  const title = `${j.title || "Film Job"} | ${department} Film Job | ${SITE_NAME}`;
  const descParts = [
    j.department ? `${j.department} role` : "",
    j.location ? `in ${j.location}` : "",
    j.isRemote ? "remote friendly" : "",
    j.description ? clip(j.description, 150) : "",
  ].filter(Boolean);
  const description = clip(descParts.join(" - ") || "Explore this film industry job on My Film Jobs.", 200);

  const isPublic = j.status === "active" || j.status === "published";
  const validThrough = toIso(j.deadline) || toIso(j.endDate);
  const expired = validThrough ? new Date(validThrough).getTime() < Date.now() : false;
  const indexable = isPublic && !expired;

  let jsonLd: Record<string, unknown> | undefined;
  if (indexable) {
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: j.title,
      description: normalizeText(j.description || j.title || ""),
      datePosted: toIso(j.postedAt) || toIso(j.startDate) || new Date().toISOString(),
      employmentType: EMPLOYMENT_TYPE_MAP[j.contractType] || "CONTRACTOR",
      hiringOrganization: {
        "@type": "Organization",
        name: j.projectName || SITE_NAME,
        sameAs: CANONICAL_ORIGIN,
        logo: `${CANONICAL_ORIGIN}/my-icon.png`,
      },
      identifier: { "@type": "PropertyValue", name: SITE_NAME, value: id },
    };
    if (validThrough) schema.validThrough = validThrough;
    if (j.isRemote) {
      schema.jobLocationType = "TELECOMMUTE";
      schema.applicantLocationRequirements = { "@type": "Country", name: "DO" };
    } else if (j.location) {
      schema.jobLocation = {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: j.location },
      };
    }
    const min = j.salary?.min > 0 ? j.salary.min : undefined;
    const max = j.salary?.max > 0 ? j.salary.max : undefined;
    if (min || max) {
      schema.baseSalary = {
        "@type": "MonetaryAmount",
        currency: j.salary?.currency || "USD",
        value: { "@type": "QuantitativeValue", minValue: min, maxValue: max, unitText: "YEAR" },
      };
    }
    jsonLd = schema;
  }

  return {
    title,
    description,
    canonical: `${CANONICAL_ORIGIN}/jobs/${encodeURIComponent(id)}`,
    ogType: "article",
    image: DEFAULT_OG_IMAGE,
    robots: indexable ? undefined : NOINDEX_ROBOTS,
    jsonLd,
  };
}

async function buildBlog(db: admin.firestore.Firestore, id: string): Promise<Meta | null> {
  const snap = await db.collection("blogPosts").doc(id).get();
  if (!snap.exists) {
    return buildNoindexMeta(`/blog/${encodeURIComponent(id)}`, `Blog Post Not Found | ${SITE_NAME}`);
  }
  const b: any = snap.data() || {};

  const isPublic = b.isPublic === true;
  const title = `${b.title || "Film Industry News"} | ${SITE_NAME}`;
  const description = clip(b.summary || `Read "${b.title || ""}" on My Film Jobs.`, 200);
  const image = b.imageUrl ? absUrl(b.imageUrl) : DEFAULT_OG_IMAGE;
  const published = toIso(b.publishedAt) || toIso(b.createdAt);

  const jsonLd = isPublic
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: clip(b.title || "", 110),
        image: [image],
        datePublished: published,
        dateModified: toIso(b.updatedAt) || published,
        author: { "@type": "Organization", name: SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: { "@type": "ImageObject", url: `${CANONICAL_ORIGIN}/my-icon.png` },
        },
        mainEntityOfPage: `${CANONICAL_ORIGIN}/blog/${encodeURIComponent(id)}`,
        ...(b.sourceUrl ? { isBasedOn: b.sourceUrl } : {}),
      }
    : undefined;

  return {
    title,
    description,
    canonical: `${CANONICAL_ORIGIN}/blog/${encodeURIComponent(id)}`,
    ogType: "article",
    image,
    robots: isPublic ? undefined : NOINDEX_ROBOTS,
    jsonLd,
  };
}

async function buildResume(db: admin.firestore.Firestore, uid: string): Promise<Meta | null> {
  const snap = await db.collection("crewProfiles").doc(uid).get();
  if (!snap.exists) {
    return buildNoindexMeta(`/resume/${encodeURIComponent(uid)}`, `Profile Not Found | ${SITE_NAME}`);
  }
  const c: any = snap.data() || {};

  const role =
    (Array.isArray(c.jobTitles) && c.jobTitles[0] && (c.jobTitles[0].name || c.jobTitles[0].title)) ||
    c.primaryRole ||
    c.headline ||
    "Film Crew";
  const place = [c.city, c.country].filter(Boolean).join(", ");
  const name = c.name || "Film Crew Member";
  const title = `${name}${role ? ` — ${role}` : ""} | ${SITE_NAME}`;
  const description = clip(
    `${name}${role ? `, ${role}` : ""}${place ? ` based in ${place}` : ""}. View profile, credits, and connect on My Film Jobs.`,
    200
  );
  const image = c.profileImageUrl ? absUrl(c.profileImageUrl) : DEFAULT_OG_IMAGE;
  // Privacy gate: never reveal a non-published profile's identity in a link preview.
  if (c.isPublished !== true) {
    return buildNoindexMeta(`/resume/${encodeURIComponent(uid)}`, `Profile Not Available | ${SITE_NAME}`);
  }

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name,
      jobTitle: role,
      image,
      url: `${CANONICAL_ORIGIN}/resume/${encodeURIComponent(uid)}`,
      ...(place ? { address: { "@type": "PostalAddress", addressLocality: c.city, addressCountry: c.country } } : {}),
    },
  };

  return {
    title,
    description,
    canonical: `${CANONICAL_ORIGIN}/resume/${encodeURIComponent(uid)}`,
    ogType: "profile",
    image,
    jsonLd,
  };
}

const DIR_HUB_ES = `${CANONICAL_ORIGIN}/directorio`;
const DIR_HUB_EN = `${CANONICAL_ORIGIN}/directory`;

function buildDirectoryHub(lang: DirLang): Meta {
  const isEn = lang === "en";
  const canonical = isEn ? DIR_HUB_EN : DIR_HUB_ES;
  const title = isEn
    ? `Film Crew Directory — Dominican Republic | ${SITE_NAME}`
    : `Directorio de Crew de Cine en República Dominicana | ${SITE_NAME}`;
  const description = isEn
    ? "Find film, TV and video production crew in the Dominican Republic by department and city: camera, sound, grip & electric, art, production, post-production and more."
    : "Encuentra crew de cine y producción audiovisual en República Dominicana por departamento y ciudad: cámara, sonido, eléctrica, arte, producción, postproducción y más.";
  return {
    title,
    description,
    canonical,
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
    alternates: { es: DIR_HUB_ES, en: DIR_HUB_EN, xDefault: DIR_HUB_ES },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: isEn ? "Film Crew Directory — Dominican Republic" : "Directorio de Crew de Cine en República Dominicana",
      description: isEn
        ? "Film, TV and video production crew in the Dominican Republic by department and city."
        : "Crew de cine y producción audiovisual en República Dominicana por departamento y ciudad.",
      url: canonical,
      publisher: { "@type": "Organization", name: SITE_NAME, url: CANONICAL_ORIGIN },
    },
  };
}

async function buildDirectory(
  db: admin.firestore.Firestore,
  lang: DirLang,
  categorySlug: string,
  regionSlug: string
): Promise<Meta | null> {
  if (!TAXONOMY) return null;
  const isEn = lang === "en";
  const category = TAXONOMY.categories.find((c) => (isEn ? c.enSlug : c.slug) === categorySlug);
  const region = TAXONOMY.regions.find((r) => (isEn ? r.enSlug : r.slug) === regionSlug);
  if (!category || !region) return null; // unknown slug → serve the default site card

  const title = isEn
    ? `${category.en} in ${region.en} — Dominican Republic | Film Crew | ${SITE_NAME}`
    : `${category.es} en ${region.label} | Crew de Cine | ${SITE_NAME}`;
  const description = isEn
    ? `Find and hire ${category.en.toLowerCase()} professionals in ${region.en}, Dominican Republic. Directory of film and TV crew for your next production.`
    : `Encuentra y contrata profesionales de ${category.es.toLowerCase()} en ${region.label}, República Dominicana. Directorio de crew de cine y producción audiovisual en My Film Jobs.`;
  // Self canonical in the page's own language; alternates point at BOTH languages.
  const esUrl = `${CANONICAL_ORIGIN}/directorio/${encodeURIComponent(category.slug)}/${encodeURIComponent(region.slug)}`;
  const enUrl = `${CANONICAL_ORIGIN}/directory/${encodeURIComponent(category.enSlug)}/${encodeURIComponent(region.enSlug)}`;
  const canonical = isEn ? enUrl : esUrl;

  // Reproduce the page's query + the ≥3-crew anti-doorway threshold (mirror of
  // DirectoryLandingPage.tsx). Public read requires isPublished == true (firestore.rules).
  const matched: Array<{ id: string; name: string }> = [];
  try {
    const snap = await db.collection("crewProfiles").where("isPublished", "==", true).limit(300).get();
    snap.forEach((doc) => {
      const c = (doc.data() || {}) as CrewLike;
      if (crewMatchesCategory(c, category) && crewMatchesRegion(c, region)) {
        matched.push({ id: doc.id, name: c.name || "Crew" });
      }
    });
  } catch (e) {
    console.error("[prerender] directory crew query failed:", (e as Error).message);
    // On a read failure, fall through as thin (noindex) rather than indexing an empty page.
  }

  const indexable = matched.length >= 3;
  const jsonLd = indexable
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: title,
        itemListElement: matched.slice(0, 25).map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${CANONICAL_ORIGIN}/resume/${encodeURIComponent(c.id)}`,
          name: c.name,
        })),
      }
    : undefined;

  return {
    title,
    description,
    canonical,
    ogType: "website",
    image: DEFAULT_OG_IMAGE,
    robots: indexable ? undefined : "noindex, follow",
    alternates: { es: esUrl, en: enUrl, xDefault: esUrl },
    jsonLd,
  };
}

export const prerender = onRequest({ region: "us-central1", invoker: "public" }, async (req, res) => {
  // Firebase Hosting forwards the original domain in x-forwarded-host; req.headers.host is the
  // Cloud Run host. Prefer the forwarded one so the live fetch hits the actual site.
  const fwdHost = String(req.headers["x-forwarded-host"] || "").split(",")[0].trim();
  const template = await getTemplate(fwdHost || req.headers.host);

  // Fast path: humans (or, defensively, a missing template) get the SPA shell unchanged.
  // `template` is backed by the index.html copy bundled with the function, so it is
  // effectively never null — this is what prevents the previous blank-page failure mode.
  if (!isBot(req.headers["user-agent"]) || !template) {
    res
      .status(200)
      .set("Content-Type", "text/html; charset=utf-8")
      .set("Cache-Control", "public, max-age=0, s-maxage=120")
      .send(template || BUNDLED_TEMPLATE || "<!doctype html><title>My Film Jobs</title><div id=\"root\"></div>");
    return;
  }

  try {
    const entity = parseEntity(req.path);
    const dir = entity ? null : parseDirectory(req.path);
    let meta: Meta | null = null;
    if (isNoindexAppRoute(req.path)) {
      meta = buildNoindexMeta(req.path);
    } else if (entity) {
      const db = admin.firestore();
      if (entity.type === "job") meta = await buildJob(db, entity.id);
      else if (entity.type === "blog") meta = await buildBlog(db, entity.id);
      else if (entity.type === "resume") meta = await buildResume(db, entity.id);
    } else if (dir) {
      if (dir.kind === "hub") meta = buildDirectoryHub(dir.lang);
      else meta = await buildDirectory(admin.firestore(), dir.lang, dir.categorySlug, dir.regionSlug);
    }
    const html = meta ? injectHead(template, renderHead(meta)) : template;
    res
      .status(200)
      .set("Content-Type", "text/html; charset=utf-8")
      .set("Cache-Control", "public, max-age=300, s-maxage=600")
      .send(html);
  } catch (e) {
    console.error("[prerender] error:", (e as Error).message);
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(template);
  }
});
