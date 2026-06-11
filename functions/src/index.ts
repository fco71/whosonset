import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import Parser from "rss-parser";
import { createHash, timingSafeEqual } from "node:crypto";
import { EmailService } from "./emailService";

// Admin cascade for a departing user's collaboration footprint (callable from the client
// during account deletion). Defined in its own module; re-exported so Firebase deploys it.
export { cleanupUserWorkspaces } from "./cleanupUserWorkspaces";
export { onAuthUserDeleted } from "./onAuthUserDeleted";
export { respondToWorkspaceInvitation } from "./workspaceInvitations";
export { setWorkspaceSupervisorMode } from "./workspaceSupervisors";

// Escape user-supplied values before interpolating them into HTML email bodies.
// emailSend builds its HTML with template literals (not Handlebars placeholders),
// so the auto-escaping in EmailService never sees these values. Without this any
// authenticated caller could inject markup/links into the email a recipient sees.
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Helper function to get user data from crewProfiles first, then users
async function getUserData(userId: string) {
  try {
    console.log(`[getUserData] Looking up user with ID: ${userId}`);
    
    // Try crewProfiles first since it's more likely to have the email
    const crewDoc = await admin.firestore().collection('crewProfiles').doc(userId).get();
    if (crewDoc.exists) {
      const crewData = crewDoc.data();
      console.log(`[getUserData] Found user in 'crewProfiles' collection`);
      
      // Check multiple possible locations for email
      const email = crewData?.email || 
                  crewData?.contactInfo?.email || 
                  crewData?.notificationPreferences?.email ||
                  null;
                  
      console.log(`[getUserData] Extracted email from crewProfiles: ${email}`);
      
      // Always update the users collection with the email from crewProfiles if found
      if (email) {
        console.log(`[getUserData] Updating users collection with email from crewProfiles`);
        try {
          await admin.firestore().collection('users').doc(userId).set(
            { 
              email, 
              contactInfo: { email },
              notificationPreferences: {
                emailNotifications: {
                  general: true,
                  projects: true,
                  chat: true,
                  jobs: true
                },
                inAppNotifications: {
                  general: true,
                  projects: true,
                  chat: true,
                  jobs: true
                },
                emailFrequency: {
                  jobs: 'daily',
                  general: 'daily',
                  projects: 'daily',
                  chat: 'daily'
                }
              }
            },
            { merge: true }
          );
          console.log(`[getUserData] Successfully updated users collection with email`);
        } catch (updateError) {
          console.error('[getUserData] Error updating users collection:', updateError);
        }
      }
      
      return { 
        ...crewData,
        email,
        collection: 'crewProfiles'
      };
    }
    
    // If not found in crewProfiles, try users collection
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log(`[getUserData] Found user in 'users' collection`);
      
      // Check multiple possible locations for email
      const email = userData?.email || 
                   userData?.contactInfo?.email || 
                   userData?.notificationPreferences?.email ||
                   null;
                   
      console.log(`[getUserData] Extracted email from users collection: ${email}`);
      
      // If email notifications are explicitly disabled, return null for email
      if (userData?.notificationPreferences?.emailNotifications?.general === false) {
        console.log(`[getUserData] Email notifications are disabled for user: ${userId}`);
        return {
          ...userData,
          email: null,
          collection: 'users'
        };
      }
      
      return { 
        ...userData,
        email,
        collection: 'users'
      };
    }

    console.log(`[getUserData] No user found with ID: ${userId} in either collection`);
    return null;
  } catch (error) {
    console.error(`[getUserData] Error fetching user ${userId}:`, error);
    return null;
  }
}
// Define secrets for environment variables
const smtpUser = defineSecret('SMTP_USER');
const smtpPass = defineSecret('SMTP_PASS');
const emailFrom = defineSecret('EMAIL_FROM');
const blogManualRunKey = defineSecret("BLOG_MANUAL_RUN_KEY");

// Initialize Firebase Admin SDK with explicit configuration
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
  storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`
});

// Set the database rules to allow Admin SDK to bypass security rules
const db = admin.firestore();
db.settings({
  ignoreUndefinedProperties: true
});

// ---- Email anti-bombardment helpers --------------------------------------
// Two guards keep transactional email from flooding a recipient (and from
// blowing the Gmail SMTP free-tier daily cap during high-traffic moments like
// a class assignment):
//
//   emailCategoryEnabled — honors the per-category opt-out the user docs
//     already define under notificationPreferences.emailNotifications.
//     (getUserData only nulls the address on the GLOBAL `general` flag, so
//      per-category prefs like `chat` were previously ignored.)
//
//   emailCooldownActive — a per-key cooldown backed by a server-only
//     `emailThrottle` collection (Admin SDK bypasses rules; no rules change
//     needed). Collapses a burst — e.g. 20 chat messages in 2 minutes — into
//     a single email, then stays quiet until the window elapses.

type EmailCategory = 'general' | 'projects' | 'chat' | 'jobs';

function emailCategoryEnabled(recipientData: any, category: EmailCategory): boolean {
  const prefs = recipientData?.notificationPreferences?.emailNotifications;
  // Unset → treated as opted-in (preserves prior behavior for users who never
  // touched their notification settings). Only an explicit `false` opts out.
  if (!prefs || typeof prefs !== 'object') return true;
  return prefs[category] !== false;
}

/**
 * Returns true if an email for `key` was sent within `cooldownMs` (i.e. the
 * caller should SKIP sending). Otherwise records "now" and returns false.
 * Best-effort: on any error it returns false so email still goes out.
 */
async function emailCooldownActive(key: string, cooldownMs: number): Promise<boolean> {
  try {
    const ref = db.collection('emailThrottle').doc(key);
    const snap = await ref.get();
    const now = Date.now();
    if (snap.exists) {
      const lastMs = (snap.data()?.lastSentAt?.toMillis?.() as number | undefined) ?? 0;
      if (now - lastMs < cooldownMs) return true;
    }
    await ref.set({ lastSentAt: admin.firestore.FieldValue.serverTimestamp(), key }, { merge: true });
    return false;
  } catch (err) {
    console.error('[emailCooldown] check failed (sending anyway):', err);
    return false;
  }
}

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const dateValue = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(dateValue.getTime()) ? null : dateValue;
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

type BlogCategory = "technology" | "business" | "industry" | "careers";

interface BlogFeedSource {
  name: string;
  feedUrl: string;
  sourceUrl: string;
  defaultCategory: BlogCategory;
  minHoursBetweenSelections?: number;
}

interface CuratedArticle {
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  sourceFeedUrl: string;
  originalUrl: string;
  imageUrl: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: Date;
  createdAt: Date;
  titleKey: string;
  dedupeKey: string;
}

interface CurateBlogOptions {
  force?: boolean;
  dryRun?: boolean;
  trigger: "scheduled" | "manual";
}

interface CurateBlogResult {
  trigger: "scheduled" | "manual";
  status: "ok" | "skipped";
  reason?: string;
  source: "defaults" | "firestore";
  feedsUsed: number;
  invalidFeedEntries: number;
  dateKey: string;
  dailyQuota: number;
  existingToday: number;
  slotsRemaining: number;
  selectedCount: number;
  storedCount: number;
  candidateCount: number;
  uniqueCandidateCount: number;
  force: boolean;
  dryRun: boolean;
  selectedPreview?: CuratedArticlePreview[];
  sourceStats?: CuratedSourceStat[];
}

interface CuratedSourceStat {
  name: string;
  feedUrl: string;
  articleCount: number;
  minHoursBetweenSelections: number;
  cooldownBlockedCount: number;
}

interface CuratedArticlePreview {
  title: string;
  sourceName: string;
  category: BlogCategory;
  originalUrl: string;
  publishedAt: string;
}

const BLOG_TIMEZONE = "America/Los_Angeles";
const BLOG_MAX_POSTS_PER_DAY = 3;
const BLOG_ARCHIVE_PAGE_SIZE = 18;
const BLOG_LOOKBACK_HOURS = 72;
const BLOG_RECENT_DEDUP_DAYS = 7;
const BLOG_FEED_CONFIG_COLLECTION = "blogConfig";
const BLOG_FEED_CONFIG_DOCUMENT = "feeds";
const BLOG_MAX_FEED_SOURCES = 20;
const BLOG_MAX_SOURCE_COOLDOWN_HOURS = 720;
const BLOG_SOURCE_COOLDOWN_LOOKBACK_DAYS = 30;
const BLOG_DEFAULT_FEEDS: BlogFeedSource[] = [
  {
    name: "No Film School",
    feedUrl: "https://nofilmschool.com/feeds/content-types/article.rss",
    sourceUrl: "https://nofilmschool.com/",
    defaultCategory: "industry",
    minHoursBetweenSelections: 24,
  },
  {
    name: "Y.M.Cinema Magazine",
    feedUrl: "https://ymcinema.com/feed/",
    sourceUrl: "https://ymcinema.com/",
    defaultCategory: "technology",
  },
  {
    name: "Frame.io Blog",
    feedUrl: "https://blog.frame.io/feed/",
    sourceUrl: "https://blog.frame.io/",
    defaultCategory: "technology",
  },
  {
    name: "PremiumBeat Blog",
    feedUrl: "https://www.premiumbeat.com/blog/feed/",
    sourceUrl: "https://www.premiumbeat.com/blog/",
    defaultCategory: "careers",
  },
  {
    name: "Film Independent",
    feedUrl: "https://www.filmindependent.org/feed/",
    sourceUrl: "https://www.filmindependent.org/",
    defaultCategory: "industry",
  },
  {
    name: "IndieWire",
    feedUrl: "https://www.indiewire.com/feed/",
    sourceUrl: "https://www.indiewire.com/",
    defaultCategory: "business",
  },
  {
    name: "LatAm Cinema",
    feedUrl: "https://www.latamcinema.com/feed/",
    sourceUrl: "https://www.latamcinema.com/",
    defaultCategory: "industry",
    minHoursBetweenSelections: 48,
  },
];

const blogCategoryPriority: BlogCategory[] = [
  "industry",
  "technology",
  "business",
  "careers",
];

const rssParser = new Parser();

function isBlogCategory(value: unknown): value is BlogCategory {
  return value === "technology" || value === "business" || value === "industry" || value === "careers";
}

async function resolveBlogFeeds(): Promise<{
  feeds: BlogFeedSource[];
  source: "defaults" | "firestore";
  invalidEntries: number;
}> {
  const fallback = {
    feeds: BLOG_DEFAULT_FEEDS,
    source: "defaults" as const,
    invalidEntries: 0,
  };

  try {
    const configSnapshot = await db
      .collection(BLOG_FEED_CONFIG_COLLECTION)
      .doc(BLOG_FEED_CONFIG_DOCUMENT)
      .get();

    if (!configSnapshot.exists) {
      return fallback;
    }

    const data = configSnapshot.data() || {};
    const rawFeeds = Array.isArray(data.feeds)
      ? data.feeds
      : Array.isArray(data.sources)
        ? data.sources
        : [];

    const parsedFeeds: BlogFeedSource[] = [];
    let invalidEntries = 0;

    rawFeeds.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        invalidEntries += 1;
        return;
      }

      const record = entry as Record<string, unknown>;
      if (record.enabled === false) {
        return;
      }

      const name = typeof record.name === "string" ? record.name.trim() : "";
      const feedUrl = normalizeExternalUrl(typeof record.feedUrl === "string" ? record.feedUrl.trim() : "");
      const sourceUrl = normalizeExternalUrl(typeof record.sourceUrl === "string" ? record.sourceUrl.trim() : "");
      const defaultCategory = isBlogCategory(record.defaultCategory) ? record.defaultCategory : "industry";
      const minHoursBetweenSelections = normalizeCooldownHours(record.minHoursBetweenSelections);

      if (!name || !feedUrl || !sourceUrl) {
        invalidEntries += 1;
        return;
      }

      parsedFeeds.push({
        name,
        feedUrl,
        sourceUrl,
        defaultCategory,
        minHoursBetweenSelections,
      });
    });

    if (parsedFeeds.length === 0) {
      return {
        ...fallback,
        invalidEntries,
      };
    }

    return {
      feeds: parsedFeeds.slice(0, BLOG_MAX_FEED_SOURCES),
      source: "firestore",
      invalidEntries,
    };
  } catch (error) {
    console.error("[curateDailyBlogPosts] Failed to read blog feed config, using defaults:", error);
    return fallback;
  }
}

function getPacificDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: BLOG_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function normalizeExternalUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = "";
    if ((parsed.protocol !== "https:" && parsed.protocol !== "http:")) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

function normalizeCooldownHours(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(BLOG_MAX_SOURCE_COOLDOWN_HOURS, Math.floor(value)));
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value.trim(), 10);
    if (!Number.isNaN(parsed)) {
      return Math.max(0, Math.min(BLOG_MAX_SOURCE_COOLDOWN_HOURS, parsed));
    }
  }
  return 0;
}

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

function getUrlHash(value: string): string {
  return createHash("sha1").update(value).digest("hex");
}

function getTitleKey(title: string): string {
  return getUrlHash(normalizeTitle(title));
}

function toBooleanFlag(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

function secureEquals(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
}

interface InAppNotificationInput {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  relatedId?: string;
  applicationId?: string;
  senderId?: string;
  status?: string;
  metadata?: Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toStatusLabel(status: string): string {
  if (!status) {
    return "updated";
  }

  return status
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function createInAppNotification(input: InAppNotificationInput): Promise<void> {
  const userId = asString(input.userId);
  if (!userId) {
    return;
  }

  const body = asString(input.body) || asString(input.title) || "You have a new notification.";
  const now = admin.firestore.FieldValue.serverTimestamp();
  const payload: Record<string, unknown> = {
    userId,
    type: asString(input.type) || "system",
    title: asString(input.title) || "Notification",
    body,
    message: body,
    isRead: false,
    read: false,
    createdAt: now,
    timestamp: now,
  };

  const link = asString(input.link);
  if (link) {
    payload.link = link;
    payload.actionUrl = link;
  }

  const relatedId = asString(input.relatedId);
  if (relatedId) {
    payload.relatedId = relatedId;
  }

  const applicationId = asString(input.applicationId);
  if (applicationId) {
    payload.applicationId = applicationId;
    payload.relatedApplicationId = applicationId;
  }

  const senderId = asString(input.senderId);
  if (senderId) {
    payload.senderId = senderId;
  }

  const status = asString(input.status);
  if (status) {
    payload.status = status;
  }

  if (input.metadata && typeof input.metadata === "object") {
    payload.metadata = input.metadata;
  }

  await db.collection("notifications").add(payload);
}

async function getJobInfo(jobId: string): Promise<{ posterId: string; title: string }> {
  if (!jobId) {
    return {
      posterId: "",
      title: "",
    };
  }

  try {
    const jobSnapshot = await db.collection("jobPostings").doc(jobId).get();
    if (!jobSnapshot.exists) {
      return {
        posterId: "",
        title: "",
      };
    }

    const data = jobSnapshot.data() || {};
    const posterId = asString(data.postedById) || asString(data.createdBy);
    const title = asString(data.title) || asString(data.jobTitle);

    return {
      posterId,
      title,
    };
  } catch (error) {
    console.error("[notifications] Failed to resolve job info:", error);
    return {
      posterId: "",
      title: "",
    };
  }
}

function detectCategory(text: string, fallback: BlogCategory): BlogCategory {
  const normalized = text.toLowerCase();

  if (/camera|lens|ai|virtual production|vfx|render|codec|color grading|workflow/.test(normalized)) {
    return "technology";
  }

  if (/box office|revenue|deal|acquisition|investment|merger|earnings|financing/.test(normalized)) {
    return "business";
  }

  if (/hiring|career|job|crew|training|internship|union|resume/.test(normalized)) {
    return "careers";
  }

  if (/festival|production|filmmaker|cinema|distribution|director|studio/.test(normalized)) {
    return "industry";
  }

  return fallback;
}

function toTagList(text: string): string[] {
  const normalized = text.toLowerCase();
  const tags: string[] = [];

  if (/camera|lens|cinematography/.test(normalized)) tags.push("camera");
  if (/ai|machine learning|automation/.test(normalized)) tags.push("ai");
  if (/box office|revenue|earnings/.test(normalized)) tags.push("box-office");
  if (/career|hiring|job|crew/.test(normalized)) tags.push("careers");
  if (/festival|award/.test(normalized)) tags.push("festivals");
  if (/editing|post|color/.test(normalized)) tags.push("post-production");

  return tags.slice(0, 4);
}

function buildSummary(title: string, sourceName: string, category: BlogCategory): string {
  const categoryContext: Record<BlogCategory, string> = {
    technology: "film technology and production tools",
    business: "film business and market trends",
    industry: "film industry developments",
    careers: "career opportunities and professional growth",
  };

  return `${sourceName} reports on ${categoryContext[category]}. "${title}".`;
}

function extractImageUrl(item: Parser.Item): string {
  const enclosureUrl = typeof item.enclosure?.url === "string" ? item.enclosure.url : "";
  if (enclosureUrl) {
    return enclosureUrl;
  }

  const anyItem = item as Record<string, unknown>;
  const mediaContent = anyItem["media:content"] as { $?: { url?: string } } | undefined;
  if (mediaContent?.$?.url) {
    return String(mediaContent.$.url);
  }

  const rawContent = typeof item.content === "string" ? item.content : "";
  const imageMatch = rawContent.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
  return imageMatch?.[1] || "";
}

async function fetchFeedArticles(source: BlogFeedSource): Promise<CuratedArticle[]> {
  try {
    const parsedFeed = await rssParser.parseURL(source.feedUrl);
    const now = new Date();
    const oldestAllowed = now.getTime() - BLOG_LOOKBACK_HOURS * 60 * 60 * 1000;
    const articles: CuratedArticle[] = [];

    for (const item of parsedFeed.items.slice(0, 12)) {
      const title = (item.title || "").trim();
      const originalUrl = normalizeExternalUrl(item.link || "");
      if (!title || !originalUrl) {
        continue;
      }

      const publishedAt = toDate(item.isoDate || item.pubDate) || now;
      if (publishedAt.getTime() < oldestAllowed) {
        continue;
      }

      const category = detectCategory(`${title} ${item.contentSnippet || ""}`, source.defaultCategory);
      const titleKey = getTitleKey(title);
      const dedupeKey = getUrlHash(`${normalizeTitle(title)}::${originalUrl}`);

      articles.push({
        title,
        summary: buildSummary(title, source.name, category),
        sourceName: source.name,
        sourceUrl: source.sourceUrl,
        sourceFeedUrl: source.feedUrl,
        originalUrl,
        imageUrl: extractImageUrl(item),
        category,
        tags: toTagList(`${title} ${item.contentSnippet || ""}`),
        publishedAt,
        createdAt: now,
        titleKey,
        dedupeKey,
      });
    }

    return articles;
  } catch (error) {
    console.error(`[curateDailyBlogPosts] Failed to parse feed ${source.feedUrl}:`, error);
    return [];
  }
}

async function getRecentArticleKeys(): Promise<{ dedupeKeys: Set<string>; titleKeys: Set<string> }> {
  const dedupeKeys = new Set<string>();
  const titleKeys = new Set<string>();
  const threshold = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() - BLOG_RECENT_DEDUP_DAYS * 24 * 60 * 60 * 1000)
  );

  const snapshot = await db
    .collection("blogPosts")
    .where("createdAt", ">=", threshold)
    .get();

  snapshot.docs.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    const title = typeof data.title === "string" ? data.title : "";
    if (title) {
      titleKeys.add(getTitleKey(title));
    }

    const key = typeof data.dedupeKey === "string" ? data.dedupeKey : "";
    if (key) {
      dedupeKeys.add(key);
      return;
    }

    const originalUrl = typeof data.originalUrl === "string" ? data.originalUrl : "";
    if (title && originalUrl) {
      dedupeKeys.add(getUrlHash(`${normalizeTitle(title)}::${normalizeExternalUrl(originalUrl)}`));
    }
  });

  return {
    dedupeKeys,
    titleKeys,
  };
}

async function getRecentSourceLastPublishedAt(): Promise<Map<string, Date>> {
  const lastPublishedAtBySource = new Map<string, Date>();
  const threshold = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() - BLOG_SOURCE_COOLDOWN_LOOKBACK_DAYS * 24 * 60 * 60 * 1000)
  );

  const snapshot = await db
    .collection("blogPosts")
    .where("createdAt", ">=", threshold)
    .get();

  snapshot.docs.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    const sourceName = typeof data.sourceName === "string" ? data.sourceName.trim() : "";
    if (!sourceName) {
      return;
    }

    const publishedAt = toDate(data.publishedAt) || toDate(data.createdAt);
    if (!publishedAt) {
      return;
    }

    const current = lastPublishedAtBySource.get(sourceName);
    if (!current || publishedAt.getTime() > current.getTime()) {
      lastPublishedAtBySource.set(sourceName, publishedAt);
    }
  });

  return lastPublishedAtBySource;
}

function pickDailyArticles(candidates: CuratedArticle[], maxArticles: number): CuratedArticle[] {
  const sorted = candidates
    .slice()
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  const selected: CuratedArticle[] = [];
  const usedSources = new Set<string>();
  const usedKeys = new Set<string>();
  const usedTitleKeys = new Set<string>();

  for (const category of blogCategoryPriority) {
    const match = sorted.find((article) =>
      article.category === category &&
      !usedSources.has(article.sourceName) &&
      !usedKeys.has(article.dedupeKey) &&
      !usedTitleKeys.has(article.titleKey)
    );

    if (!match) {
      continue;
    }

    selected.push(match);
    usedSources.add(match.sourceName);
    usedKeys.add(match.dedupeKey);
    usedTitleKeys.add(match.titleKey);

    if (selected.length >= maxArticles) {
      return selected;
    }
  }

  // Prefer not repeating sources when filling remaining slots.
  for (const article of sorted) {
    if (selected.length >= maxArticles) {
      break;
    }
    if (
      usedKeys.has(article.dedupeKey) ||
      usedTitleKeys.has(article.titleKey) ||
      usedSources.has(article.sourceName)
    ) {
      continue;
    }

    selected.push(article);
    usedSources.add(article.sourceName);
    usedKeys.add(article.dedupeKey);
    usedTitleKeys.add(article.titleKey);
  }

  // If diversity blocks completion, allow reused sources but keep dedupe protections.
  for (const article of sorted) {
    if (selected.length >= maxArticles) {
      break;
    }
    if (usedKeys.has(article.dedupeKey) || usedTitleKeys.has(article.titleKey)) {
      continue;
    }

    selected.push(article);
    usedKeys.add(article.dedupeKey);
    usedTitleKeys.add(article.titleKey);
  }

  return selected;
}

function buildSelectedPreview(articles: CuratedArticle[]): CuratedArticlePreview[] {
  return articles.map((article) => ({
    title: article.title,
    sourceName: article.sourceName,
    category: article.category,
    originalUrl: article.originalUrl,
    publishedAt: article.publishedAt.toISOString(),
  }));
}

async function runBlogCuration(options: CurateBlogOptions): Promise<CurateBlogResult> {
  const force = options.force === true;
  const dryRun = options.dryRun === true;
  const resolvedFeeds = await resolveBlogFeeds();
  const activeFeeds = resolvedFeeds.feeds;
  console.log(
    `[curateDailyBlogPosts] Using ${activeFeeds.length} feed source(s) from ${resolvedFeeds.source}. Invalid config entries: ${resolvedFeeds.invalidEntries}.`
  );
  const dateKey = getPacificDateKey();

  if (activeFeeds.length === 0) {
    console.log("[curateDailyBlogPosts] No active feed sources configured.");
    return {
      trigger: options.trigger,
      status: "skipped",
      reason: "no_active_feeds",
      source: resolvedFeeds.source,
      feedsUsed: activeFeeds.length,
      invalidFeedEntries: resolvedFeeds.invalidEntries,
      dateKey,
      dailyQuota: BLOG_MAX_POSTS_PER_DAY,
      existingToday: 0,
      slotsRemaining: BLOG_MAX_POSTS_PER_DAY,
      selectedCount: 0,
      storedCount: 0,
      candidateCount: 0,
      uniqueCandidateCount: 0,
      force,
      dryRun,
      selectedPreview: [],
      sourceStats: [],
    };
  }

  const todaysSnapshot = await db
    .collection("blogPosts")
    .where("curatedDate", "==", dateKey)
    .get();

  const slotsRemaining = BLOG_MAX_POSTS_PER_DAY - todaysSnapshot.size;
  if (slotsRemaining <= 0 && !force) {
    console.log(`[curateDailyBlogPosts] Daily quota already reached for ${dateKey}.`);
    return {
      trigger: options.trigger,
      status: "skipped",
      reason: "daily_quota_reached",
      source: resolvedFeeds.source,
      feedsUsed: activeFeeds.length,
      invalidFeedEntries: resolvedFeeds.invalidEntries,
      dateKey,
      dailyQuota: BLOG_MAX_POSTS_PER_DAY,
      existingToday: todaysSnapshot.size,
      slotsRemaining: 0,
      selectedCount: 0,
      storedCount: 0,
      candidateCount: 0,
      uniqueCandidateCount: 0,
      force,
      dryRun,
      selectedPreview: [],
      sourceStats: activeFeeds.map((feed) => ({
        name: feed.name,
        feedUrl: feed.feedUrl,
        articleCount: 0,
        minHoursBetweenSelections: feed.minHoursBetweenSelections || 0,
        cooldownBlockedCount: 0,
      })),
    };
  }

  const recentKeys = await getRecentArticleKeys();
  const recentSourceLastPublishedAt = await getRecentSourceLastPublishedAt();
  const feedResults = await Promise.all(activeFeeds.map((source) => fetchFeedArticles(source)));
  const feedBySourceName = new Map(activeFeeds.map((feed) => [feed.name, feed]));
  const mergedArticles = feedResults.flat();
  const uniqueCandidates = mergedArticles.filter((article) => (
    !recentKeys.dedupeKeys.has(article.dedupeKey) &&
    !recentKeys.titleKeys.has(article.titleKey)
  ));
  const cooldownBlockedCountBySource = new Map<string, number>();
  const cooldownEligibleCandidates = uniqueCandidates.filter((article) => {
    const feed = feedBySourceName.get(article.sourceName);
    const cooldownHours = feed?.minHoursBetweenSelections || 0;
    if (cooldownHours <= 0) {
      return true;
    }

    const lastPublishedAt = recentSourceLastPublishedAt.get(article.sourceName);
    if (!lastPublishedAt) {
      return true;
    }

    const elapsedHours = (Date.now() - lastPublishedAt.getTime()) / (60 * 60 * 1000);
    if (elapsedHours >= cooldownHours) {
      return true;
    }

    cooldownBlockedCountBySource.set(
      article.sourceName,
      (cooldownBlockedCountBySource.get(article.sourceName) || 0) + 1
    );
    return false;
  });
  const sourceStats = activeFeeds.map((feed, index) => ({
    name: feed.name,
    feedUrl: feed.feedUrl,
    articleCount: feedResults[index]?.length || 0,
    minHoursBetweenSelections: feed.minHoursBetweenSelections || 0,
    cooldownBlockedCount: cooldownBlockedCountBySource.get(feed.name) || 0,
  }));
  const maxSelectable = force ? BLOG_MAX_POSTS_PER_DAY : Math.max(0, slotsRemaining);
  const selected = pickDailyArticles(cooldownEligibleCandidates, maxSelectable);

  if (selected.length === 0) {
    console.log("[curateDailyBlogPosts] No fresh candidates available this run.");
    return {
      trigger: options.trigger,
      status: "skipped",
      reason: "no_fresh_candidates",
      source: resolvedFeeds.source,
      feedsUsed: activeFeeds.length,
      invalidFeedEntries: resolvedFeeds.invalidEntries,
      dateKey,
      dailyQuota: BLOG_MAX_POSTS_PER_DAY,
      existingToday: todaysSnapshot.size,
      slotsRemaining: Math.max(0, slotsRemaining),
      selectedCount: 0,
      storedCount: 0,
      candidateCount: mergedArticles.length,
      uniqueCandidateCount: cooldownEligibleCandidates.length,
      force,
      dryRun,
      selectedPreview: [],
      sourceStats,
    };
  }

  if (dryRun) {
    console.log(`[curateDailyBlogPosts] Dry run selected ${selected.length} candidate(s).`);
    return {
      trigger: options.trigger,
      status: "ok",
      source: resolvedFeeds.source,
      feedsUsed: activeFeeds.length,
      invalidFeedEntries: resolvedFeeds.invalidEntries,
      dateKey,
      dailyQuota: BLOG_MAX_POSTS_PER_DAY,
      existingToday: todaysSnapshot.size,
      slotsRemaining: Math.max(0, slotsRemaining),
      selectedCount: selected.length,
      storedCount: 0,
      candidateCount: mergedArticles.length,
      uniqueCandidateCount: cooldownEligibleCandidates.length,
      force,
      dryRun,
      selectedPreview: buildSelectedPreview(selected),
      sourceStats,
    };
  }

  const batch = db.batch();
  selected.forEach((article) => {
    const docId = `${dateKey}-${article.dedupeKey.slice(0, 12)}`;
    const postRef = db.collection("blogPosts").doc(docId);

    batch.set(postRef, {
      title: article.title,
      summary: article.summary,
      sourceName: article.sourceName,
      sourceUrl: article.sourceUrl,
      sourceFeedUrl: article.sourceFeedUrl,
      originalUrl: article.originalUrl,
      imageUrl: article.imageUrl,
      category: article.category,
      tags: article.tags,
      publishedAt: admin.firestore.Timestamp.fromDate(article.publishedAt),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      curatedDate: dateKey,
      commentsCount: 0,
      isPublic: true,
      contentPolicy: "metadata_only",
      dedupeKey: article.dedupeKey,
    }, { merge: true });
  });

  await batch.commit();
  console.log(`[curateDailyBlogPosts] Stored ${selected.length} curated posts for ${dateKey}.`);
  return {
    trigger: options.trigger,
    status: "ok",
    source: resolvedFeeds.source,
    feedsUsed: activeFeeds.length,
    invalidFeedEntries: resolvedFeeds.invalidEntries,
    dateKey,
    dailyQuota: BLOG_MAX_POSTS_PER_DAY,
    existingToday: todaysSnapshot.size,
    slotsRemaining: Math.max(0, slotsRemaining),
    selectedCount: selected.length,
    storedCount: selected.length,
    candidateCount: mergedArticles.length,
    uniqueCandidateCount: cooldownEligibleCandidates.length,
    force,
    dryRun,
    selectedPreview: buildSelectedPreview(selected),
    sourceStats,
  };
}

export const curateDailyBlogPosts = onSchedule({
  schedule: "every 8 hours",
  timeZone: BLOG_TIMEZONE,
  region: "us-central1",
}, async () => {
  await runBlogCuration({
    trigger: "scheduled",
    force: false,
    dryRun: false,
  });
});

export const blogFeedSources = onRequest({
  region: "us-central1",
  invoker: "public",
}, async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).set("Allow", "GET, HEAD").send("Method Not Allowed");
    return;
  }

  const resolvedFeeds = await resolveBlogFeeds();

  res.set("Cache-Control", "public, max-age=300, s-maxage=300");
  if (req.method === "HEAD") {
    res.status(200).send();
    return;
  }

  res.status(200).json({
    source: resolvedFeeds.source,
    count: resolvedFeeds.feeds.length,
    invalidEntries: resolvedFeeds.invalidEntries,
    feeds: resolvedFeeds.feeds,
  });
});

export const runBlogCurationNow = onRequest({
  region: "us-central1",
  invoker: "public",
  secrets: [blogManualRunKey],
}, async (req, res) => {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).set("Allow", "GET, POST").send("Method Not Allowed");
    return;
  }

  const expectedKey = blogManualRunKey.value();
  const providedKey = req.get("x-blog-run-key") || (typeof req.query.key === "string" ? req.query.key : "");

  if (!expectedKey) {
    res.status(500).json({
      error: "BLOG_MANUAL_RUN_KEY is not configured.",
    });
    return;
  }

  if (!providedKey || !secureEquals(providedKey, expectedKey)) {
    res.status(403).json({
      error: "Forbidden",
    });
    return;
  }

  const force = toBooleanFlag(req.query.force);
  const dryRun = toBooleanFlag(req.query.dryRun);

  try {
    const result = await runBlogCuration({
      trigger: "manual",
      force,
      dryRun,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("[runBlogCurationNow] Failed to run manual curation:", error);
    res.status(500).json({
      error: "Failed to run blog curation",
    });
  }
});

export const onBlogCommentCreated = onDocumentCreated({
  document: "blogPosts/{postId}/comments/{commentId}",
  region: "us-central1",
}, async (event) => {
  const postId = event.params.postId;
  if (!postId) {
    return;
  }

  await db.collection("blogPosts").doc(postId).set({
    commentsCount: admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
});

export const onBlogCommentDeleted = onDocumentDeleted({
  document: "blogPosts/{postId}/comments/{commentId}",
  region: "us-central1",
}, async (event) => {
  const postId = event.params.postId;
  if (!postId) {
    return;
  }

  const postRef = db.collection("blogPosts").doc(postId);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(postRef);
    const data = snapshot.data();
    const currentCount = typeof data?.commentsCount === "number" ? data.commentsCount : 0;
    transaction.set(postRef, {
      commentsCount: Math.max(0, currentCount - 1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  });
});

export const notifyJobApplicationCreated = onDocumentCreated({
  document: "jobApplications/{applicationId}",
  region: "us-central1",
}, async (event) => {
  const data = event.data?.data();
  if (!data) {
    return;
  }

  const applicationId = asString(event.params.applicationId);
  const applicantId = asString(data.applicantId);
  const jobId = asString(data.jobId);
  if (!applicationId || !jobId) {
    return;
  }

  const jobInfo = await getJobInfo(jobId);
  if (!jobInfo.posterId || jobInfo.posterId === applicantId) {
    return;
  }

  const applicantName = asString(data.applicantName) || "A new applicant";
  const jobTitle = jobInfo.title || "your job posting";

  await createInAppNotification({
    userId: jobInfo.posterId,
    type: "job_application",
    title: "New Job Application",
    body: `${applicantName} applied to ${jobTitle}.`,
    link: `/jobs/${encodeURIComponent(jobId)}/applications`,
    relatedId: jobId,
    applicationId,
    metadata: {
      applicantId,
      jobId,
    },
  });
});

export const notifyJobApplicationStatusChange = onDocumentUpdated({
  document: "jobApplications/{applicationId}",
  region: "us-central1",
}, async (event) => {
  const beforeData = event.data?.before.data();
  const afterData = event.data?.after.data();
  if (!beforeData || !afterData) {
    return;
  }

  const beforeStatus = asString(beforeData.status);
  const afterStatus = asString(afterData.status);
  if (!afterStatus || beforeStatus === afterStatus) {
    return;
  }

  const applicantId = asString(afterData.applicantId);
  const applicationId = asString(event.params.applicationId);
  const jobId = asString(afterData.jobId);
  if (!applicantId || !applicationId) {
    return;
  }

  const jobInfo = await getJobInfo(jobId);
  const jobTitle = jobInfo.title || "your application";
  const statusLabel = toStatusLabel(afterStatus);

  await createInAppNotification({
    userId: applicantId,
    type: "application_status_update",
    title: "Application Status Updated",
    body: `${jobTitle} is now ${statusLabel}.`,
    link: `/applications/${encodeURIComponent(applicationId)}`,
    applicationId,
    relatedId: jobId || undefined,
    status: afterStatus,
    metadata: {
      jobId,
      status: afterStatus,
    },
  });
});

export const notifyJobApplicationMessageCreated = onDocumentCreated({
  document: "jobApplications/{applicationId}/messages/{messageId}",
  region: "us-central1",
}, async (event) => {
  const messageData = event.data?.data();
  if (!messageData) {
    return;
  }

  const applicationId = asString(event.params.applicationId);
  if (!applicationId) {
    return;
  }

  const senderId = asString(messageData.senderId);
  const senderName = asString(messageData.senderName) || "A member";

  const applicationSnapshot = await db.collection("jobApplications").doc(applicationId).get();
  if (!applicationSnapshot.exists) {
    return;
  }

  const applicationData = applicationSnapshot.data() || {};
  const applicantId = asString(applicationData.applicantId);
  const jobId = asString(applicationData.jobId);
  if (!applicantId || !jobId) {
    return;
  }

  const jobInfo = await getJobInfo(jobId);
  const posterId = jobInfo.posterId;
  const recipientId = senderId && senderId === applicantId ? posterId : applicantId;

  if (!recipientId || recipientId === senderId) {
    return;
  }

  const jobTitle = jobInfo.title || "the application";

  await createInAppNotification({
    userId: recipientId,
    type: "application_message",
    title: "New Application Message",
    body: `${senderName} sent a message about ${jobTitle}.`,
    link: `/applications/${encodeURIComponent(applicationId)}`,
    applicationId,
    relatedId: jobId,
    senderId,
    metadata: {
      jobId,
      messageId: asString(event.params.messageId),
    },
  });
});

export const blogSitemap = onRequest({
  region: "us-central1",
  invoker: "public",
}, async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).set("Allow", "GET, HEAD").send("Method Not Allowed");
    return;
  }

  try {
    const snapshot = await db.collection("blogPosts")
      .where("isPublic", "==", true)
      .get();

    const postEntries = snapshot.docs
      .map((postDoc) => {
        const data = postDoc.data();
        const publishedAt = toDate(data.publishedAt) || toDate(data.createdAt) || new Date();
        const updatedAt = toDate(data.updatedAt) || publishedAt;
        const encodedId = encodeURIComponent(postDoc.id);

        return {
          loc: `https://myfilmjobs.com/blog/${encodedId}`,
          lastmod: updatedAt,
        };
      })
      .sort((a, b) => b.lastmod.getTime() - a.lastmod.getTime());

    const archivePageCount = Math.max(1, Math.ceil(postEntries.length / BLOG_ARCHIVE_PAGE_SIZE));
    const defaultLastmod = postEntries[0]?.lastmod || new Date();
    const archiveEntries = Array.from({length: archivePageCount}, (_, index) => {
      const pageNumber = index + 1;
      const loc = pageNumber === 1
        ? "https://myfilmjobs.com/blog"
        : `https://myfilmjobs.com/blog/page/${pageNumber}`;
      const pageLastmod = postEntries[index * BLOG_ARCHIVE_PAGE_SIZE]?.lastmod || defaultLastmod;

      return {
        loc,
        lastmod: pageLastmod,
        changefreq: "daily",
        priority: pageNumber === 1 ? "0.9" : "0.6",
      };
    });

    const urls = [...archiveEntries, ...postEntries]
      .map((entry) => {
        const changefreq = "changefreq" in entry ? entry.changefreq : "daily";
        const priority = "priority" in entry ? entry.priority : "0.8";

        return [
          "  <url>",
          `    <loc>${escapeXml(entry.loc)}</loc>`,
          `    <lastmod>${entry.lastmod.toISOString()}</lastmod>`,
          `    <changefreq>${changefreq}</changefreq>`,
          `    <priority>${priority}</priority>`,
          "  </url>",
        ].join("\n");
      })
      .join("\n");

    const xml = [
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
      "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
      urls,
      "</urlset>",
    ].join("\n");

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=900, s-maxage=900");

    if (req.method === "HEAD") {
      res.status(200).send();
      return;
    }

    res.status(200).send(xml);
  } catch (error) {
    console.error("[blogSitemap] Failed to generate sitemap:", error);
    res.status(500).send("Failed to generate sitemap");
  }
});

export const jobsSitemap = onRequest({
  region: "us-central1",
  invoker: "public",
}, async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).set("Allow", "GET, HEAD").send("Method Not Allowed");
    return;
  }

  try {
    const [publishedSnapshot, activeSnapshot] = await Promise.all([
      db.collection("jobPostings").where("status", "==", "published").get(),
      db.collection("jobPostings").where("status", "==", "active").get(),
    ]);

    const jobsById = new Map<string, QueryDocumentSnapshot>();
    publishedSnapshot.docs.forEach((doc) => jobsById.set(doc.id, doc));
    activeSnapshot.docs.forEach((doc) => jobsById.set(doc.id, doc));

    const now = new Date();
    const dynamicJobUrls = Array.from(jobsById.values())
      .map((jobDoc) => {
        const data = jobDoc.data();
        const deadline = toDate(data.deadline);

        if (deadline && deadline.getTime() < now.getTime()) {
          return "";
        }

        const updatedAt = toDate(data.updatedAt) || toDate(data.createdAt) || toDate(data.postedAt) || now;
        const encodedId = encodeURIComponent(jobDoc.id);
        const loc = `https://myfilmjobs.com/jobs/${encodedId}`;

        return [
          "  <url>",
          `    <loc>${escapeXml(loc)}</loc>`,
          `    <lastmod>${updatedAt.toISOString()}</lastmod>`,
          "    <changefreq>daily</changefreq>",
          "    <priority>0.7</priority>",
          "  </url>",
        ].join("\n");
      })
      .filter(Boolean);

    // Keep sitemap non-empty to avoid Search Console warnings when no active jobs exist.
    if (dynamicJobUrls.length === 0) {
      const fallbackUpdatedAt = now.toISOString();
      dynamicJobUrls.push([
        "  <url>",
        "    <loc>https://myfilmjobs.com/jobs</loc>",
        `    <lastmod>${fallbackUpdatedAt}</lastmod>`,
        "    <changefreq>daily</changefreq>",
        "    <priority>0.6</priority>",
        "  </url>",
      ].join("\n"));
    }

    const urls = dynamicJobUrls.join("\n");

    const xml = [
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
      "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
      urls,
      "</urlset>",
    ].join("\n");

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=900, s-maxage=900");

    if (req.method === "HEAD") {
      res.status(200).send();
      return;
    }

    res.status(200).send(xml);
  } catch (error) {
    console.error("[jobsSitemap] Failed to generate sitemap:", error);
    res.status(500).send("Failed to generate sitemap");
  }
});

// Test function to check user data
// Test endpoint to manually trigger a follow request notification
export const testFollowRequestNotification = onRequest(async (req, res) => {
  try {
    // This is a test function, so we'll use a mock document
    const followRequestData = {
      toUserId: 'ozfTOauw44ZAI9FvCBkcpvAr5sy2', // Replace with actual user ID for testing
      fromUserId: 'MrLprkr8VVhkDU1h87sE6EUdxfr1',
      fromUserName: 'Test User',
      status: 'pending'
    };

    // Instead of calling notifyFollowRequest directly, we'll create a document in Firestore
    const db = admin.firestore();
    const followRequestRef = db.collection('followRequests').doc('test-request-' + Date.now());
    
    await followRequestRef.set({
      toUserId: followRequestData.toUserId,
      fromUserId: followRequestData.fromUserId,
      fromUserName: followRequestData.fromUserName,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ 
      success: true, 
      message: 'Follow request created successfully. Notification should be sent shortly.'
    });
  } catch (error: unknown) {
    console.error('Error in testFollowRequestNotification:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      success: false, 
      error: errorMessage
    });
  }
});

export const testUserData = onRequest(async (req, res) => {
  try {
    const emails = ['iam@myfilmjobs.com', 'franciscovaldez@yahoo.com'];
    
    // Check users collection
    const usersSnapshot = await db.collection('users')
      .where('email', 'in', emails)
      .get();
    
    // Check crewProfiles collection
    const crewSnapshot = await db.collection('crewProfiles')
      .where('email', 'in', emails)
      .get();
    
    const users: any[] = [];
    
    // Process users from users collection
    usersSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      users.push({
        id: doc.id,
        collection: 'users',
        ...doc.data()
      });
    });
    
    // Process users from crewProfiles collection
    crewSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      // Only add if not already in the users array
      if (!users.some(u => u.email === doc.data().email)) {
        users.push({
          id: doc.id,
          collection: 'crewProfiles',
          ...doc.data()
        });
      }
    });
    
    if (users.length === 0) {
      res.status(404).json({ 
        error: 'No users found with the specified emails in either users or crewProfiles collections',
        checkedCollections: ['users', 'crewProfiles'],
        searchedEmails: emails
      });
      return;
    }

    res.json({ 
      users,
      message: `Found ${users.length} user(s) across all collections`
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user data',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Main email sending function - Production ready
export const emailSend = onRequest({
  cors: true,
  invoker: 'public',
  region: 'us-central1',
  secrets: [smtpUser, smtpPass, emailFrom]
}, async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
      return;
    }

    // Verify the token
    const idToken = authHeader.split('Bearer ')[1];
    try {
      await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }

    const { to, subject, message, senderName } = req.body;
    
    if (!to || !subject || !message) {
      res.status(400).json({ 
        error: 'Missing required fields: to, subject, message' 
      });
      return;
    }

    // Set environment variables from secrets
    process.env.SMTP_USER = smtpUser.value();
    process.env.SMTP_PASS = smtpPass.value();
    process.env.EMAIL_FROM = emailFrom.value();

    // Create email template. User-supplied values are HTML-escaped for the HTML
    // part; the text part is plain text and needs no escaping. The <h3> subject
    // line uses the raw subject (Handlebars compile in EmailService is a no-op
    // here because there are no {{ }} placeholders left in this string).
    const safeSenderName = escapeHtml(senderName || 'My Film Jobs');
    const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br>');
    const emailTemplate = {
      subject: subject || `New message from ${senderName || 'My Film Jobs'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">My Film Jobs</h2>
          <p>Hello,</p>
          <p>You have received a new message from <strong>${safeSenderName}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Message:</h3>
            <p>${safeMessageHtml}</p>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Best regards,<br>
            The My Film Jobs Team
          </p>
        </div>
      `,
      text: `
My Film Jobs

Hello,

You have received a new message from ${senderName || 'My Film Jobs'}.

Message:
${message}

Best regards,
The My Film Jobs Team
      `
    };

    // Send the email using EmailService
    const success = await EmailService.sendEmail({
      to,
      template: emailTemplate,
      data: {
        senderName: senderName || 'My Film Jobs',
        message
      }
    });

    if (success) {
      console.log(`[emailSend] Email sent successfully to ${to}`);
      res.json({ 
        success: true, 
        message: 'Email sent successfully!',
        data: { 
          to, 
          subject, 
          message: message ? 'Message content redacted for security' : undefined,
          senderName 
        },
        timestamp: new Date().toISOString()
      });
    } else {
      const errorMsg = 'Failed to send email. Please check the logs for details.';
      console.error(`[emailSend] ${errorMsg}`, { to, subject });
      res.status(500).json({ 
        success: false,
        error: errorMsg
      });
    }
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
});

// Trigger function for follow request notifications
export const notifyFollowRequest = onDocumentCreated({
  document: 'followRequests/{requestId}',
  region: 'us-central1',
  secrets: [smtpUser, smtpPass, emailFrom]
}, async (event) => {
  try {
    // Set environment variables from secrets
    process.env.SMTP_USER = smtpUser.value();
    process.env.SMTP_PASS = smtpPass.value();
    process.env.EMAIL_FROM = emailFrom.value();

    const requestData = event.data?.data();
    if (!requestData) {
      console.log('[notifyFollowRequest] No request data found');
      return;
    }

    const { toUserId, fromUserName } = requestData;
    
    // Get recipient's data using helper function
    const recipientData = await getUserData(toUserId);
    if (!recipientData || !recipientData.email) {
      console.log(`[notifyFollowRequest] No email found for recipient: ${toUserId}`);
      return;
    }
    const recipientEmail = recipientData.email;

    // Send email notification
    const emailTemplate = EmailService.getFollowRequestTemplate(fromUserName);
    const success = await EmailService.sendEmail({
      to: recipientEmail,
      template: emailTemplate,
      data: {
        requesterName: fromUserName,
        recipientEmail,
        followRequestsUrl: 'https://myfilmjobs.com/social?tab=requests'
      }
    });

    if (success) {
      console.log('[notifyFollowRequest] Email sent successfully to:', recipientEmail);
    } else {
      console.error('[notifyFollowRequest] Failed to send email to:', recipientEmail);
    }
  } catch (error) {
    console.error('[notifyFollowRequest] Error:', error);
  }
});

// Trigger function for message notifications
export const notifyNewMessage = onDocumentCreated({
  document: 'conversations/{conversationId}/messages/{messageId}',
  region: 'us-central1',
  secrets: [smtpUser, smtpPass, emailFrom]
}, async (event) => {
  try {
    // Set environment variables from secrets
    process.env.SMTP_USER = smtpUser.value();
    process.env.SMTP_PASS = smtpPass.value();
    process.env.EMAIL_FROM = emailFrom.value();

    const messageData = event.data?.data();
    if (!messageData) {
      console.log('[notifyNewMessage] No message data found');
      return;
    }

    const { senderId, receiverId, content } = messageData;

    // Get conversation ID from event params
    const conversationId = event.params.conversationId;

    // Get recipient's data using helper function
    const recipientData = await getUserData(receiverId);
    if (!recipientData || !recipientData.email) {
      console.log(`[notifyNewMessage] No email found for recipient: ${receiverId}`);
      return;
    }
    const recipientEmail = recipientData.email;

    // Respect the recipient's per-category chat email preference.
    if (!emailCategoryEnabled(recipientData, 'chat')) {
      console.log(`[notifyNewMessage] Chat email disabled for recipient: ${receiverId}`);
      return;
    }

    // Throttle: at most one chat email per conversation per recipient every
    // 30 minutes. A back-and-forth burst collapses into a single nudge; the
    // in-app notification still fires for every message.
    if (await emailCooldownActive(`msg_${receiverId}_${conversationId}`, THIRTY_MINUTES_MS)) {
      console.log(`[notifyNewMessage] Within cooldown, skipping email for: ${receiverId}/${conversationId}`);
      return;
    }

    // Get sender's data using helper function
    const senderData = await getUserData(senderId);
    const senderName = (senderData as any)?.name || (senderData as any)?.displayName || 'Unknown User';

    // Send email notification
    const messagePreview = content.length > 50 ? content.substring(0, 50) + '...' : content;
    const emailTemplate = EmailService.getMessageNotificationTemplate(senderName, messagePreview);
    const success = await EmailService.sendEmail({
      to: recipientEmail,
      template: emailTemplate,
      data: {
        senderName,
        messagePreview,
        recipientEmail,
        messageUrl: `https://myfilmjobs.com/messages?conversation=${conversationId}`
      }
    });

    if (success) {
      console.log('[notifyNewMessage] Email sent successfully to:', recipientEmail);
    } else {
      console.error('[notifyNewMessage] Failed to send email to:', recipientEmail);
    }
  } catch (error) {
    console.error('[notifyNewMessage] Error:', error);
  }
});
