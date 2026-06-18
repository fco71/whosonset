import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

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

function decode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogType: string;
  image: string;
  robots?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
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

// ---- index.html template cache (self-updating across deploys) ----
let templateCache: { html: string; at: number } | null = null;
const TEMPLATE_TTL_MS = 10 * 60 * 1000;

async function getTemplate(origin: string): Promise<string | null> {
  const now = Date.now();
  if (templateCache && now - templateCache.at < TEMPLATE_TTL_MS) return templateCache.html;
  try {
    const resp = await fetch(`${origin}/index.html`, {
      headers: { "user-agent": "prerender-template-fetch", "cache-control": "no-cache" },
    });
    if (!resp.ok) throw new Error(`template fetch ${resp.status}`);
    const html = await resp.text();
    templateCache = { html, at: now };
    return html;
  } catch (e) {
    console.error("[prerender] template fetch failed:", (e as Error).message);
    return templateCache?.html ?? null; // serve last-good if available
  }
}

// ---- route parsing ----
const RESERVED_JOBS = new Set(["posted", "saved", "applied", "analytics", "new", "create"]);

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
  if (!snap.exists) return null;
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
    robots: indexable ? undefined : "noindex, nofollow",
    jsonLd,
  };
}

async function buildBlog(db: admin.firestore.Firestore, id: string): Promise<Meta | null> {
  const snap = await db.collection("blogPosts").doc(id).get();
  if (!snap.exists) return null;
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
    robots: isPublic ? undefined : "noindex, nofollow",
    jsonLd,
  };
}

async function buildResume(db: admin.firestore.Firestore, uid: string): Promise<Meta | null> {
  const snap = await db.collection("crewProfiles").doc(uid).get();
  if (!snap.exists) return null;
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
  // The /resume/:uid route is the public profile surface; honor an explicit opt-out only.
  const isPublic = c.isPublic !== false && c.profileVisibility !== "private";

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
    robots: isPublic ? undefined : "noindex, nofollow",
    jsonLd: isPublic ? jsonLd : undefined,
  };
}

export const prerender = onRequest({ region: "us-central1", invoker: "public" }, async (req, res) => {
  const host = req.headers.host || "myfilmjobs.com";
  const fetchOrigin = `https://${host}`;
  const template = await getTemplate(fetchOrigin);

  // Fast path: humans (or no template) get the SPA shell unchanged, no Firestore read.
  if (!isBot(req.headers["user-agent"]) || !template) {
    res
      .status(200)
      .set("Content-Type", "text/html; charset=utf-8")
      .set("Cache-Control", "public, max-age=0, s-maxage=120")
      .send(template || "<!doctype html><title>My Film Jobs</title><div id=\"root\"></div>");
    return;
  }

  try {
    const entity = parseEntity(req.path);
    let meta: Meta | null = null;
    if (entity) {
      const db = admin.firestore();
      if (entity.type === "job") meta = await buildJob(db, entity.id);
      else if (entity.type === "blog") meta = await buildBlog(db, entity.id);
      else if (entity.type === "resume") meta = await buildResume(db, entity.id);
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
