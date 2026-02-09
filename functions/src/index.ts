import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentDeleted } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import Parser from "rss-parser";
import { createHash } from "node:crypto";
import { EmailService } from "./emailService";

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
  dedupeKey: string;
}

const BLOG_TIMEZONE = "America/Los_Angeles";
const BLOG_MAX_POSTS_PER_DAY = 3;
const BLOG_LOOKBACK_HOURS = 72;
const BLOG_RECENT_DEDUP_DAYS = 7;
const BLOG_FEEDS: BlogFeedSource[] = [
  {
    name: "No Film School",
    feedUrl: "https://nofilmschool.com/feeds/content-types/article.rss",
    sourceUrl: "https://nofilmschool.com/",
    defaultCategory: "industry",
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
];

const blogCategoryPriority: BlogCategory[] = [
  "industry",
  "technology",
  "business",
  "careers",
];

const rssParser = new Parser();

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

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

function getUrlHash(value: string): string {
  return createHash("sha1").update(value).digest("hex");
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

  return `${sourceName} reports on ${categoryContext[category]}. "${title}" links to the original publisher for full context.`;
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
        dedupeKey,
      });
    }

    return articles;
  } catch (error) {
    console.error(`[curateDailyBlogPosts] Failed to parse feed ${source.feedUrl}:`, error);
    return [];
  }
}

async function getRecentDedupeKeys(): Promise<Set<string>> {
  const dedupeKeys = new Set<string>();
  const threshold = admin.firestore.Timestamp.fromDate(
    new Date(Date.now() - BLOG_RECENT_DEDUP_DAYS * 24 * 60 * 60 * 1000)
  );

  const snapshot = await db
    .collection("blogPosts")
    .where("createdAt", ">=", threshold)
    .get();

  snapshot.docs.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    const key = typeof data.dedupeKey === "string" ? data.dedupeKey : "";
    if (key) {
      dedupeKeys.add(key);
      return;
    }

    const title = typeof data.title === "string" ? data.title : "";
    const originalUrl = typeof data.originalUrl === "string" ? data.originalUrl : "";
    if (title && originalUrl) {
      dedupeKeys.add(getUrlHash(`${normalizeTitle(title)}::${normalizeExternalUrl(originalUrl)}`));
    }
  });

  return dedupeKeys;
}

function pickDailyArticles(candidates: CuratedArticle[], maxArticles: number): CuratedArticle[] {
  const sorted = candidates
    .slice()
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  const selected: CuratedArticle[] = [];
  const usedSources = new Set<string>();
  const usedKeys = new Set<string>();

  for (const category of blogCategoryPriority) {
    const match = sorted.find((article) =>
      article.category === category &&
      !usedSources.has(article.sourceName) &&
      !usedKeys.has(article.dedupeKey)
    );

    if (!match) {
      continue;
    }

    selected.push(match);
    usedSources.add(match.sourceName);
    usedKeys.add(match.dedupeKey);

    if (selected.length >= maxArticles) {
      return selected;
    }
  }

  for (const article of sorted) {
    if (selected.length >= maxArticles) {
      break;
    }
    if (usedKeys.has(article.dedupeKey)) {
      continue;
    }

    selected.push(article);
    usedKeys.add(article.dedupeKey);
  }

  return selected;
}

export const curateDailyBlogPosts = onSchedule({
  schedule: "every 8 hours",
  timeZone: BLOG_TIMEZONE,
  region: "us-central1",
}, async () => {
  const dateKey = getPacificDateKey();
  const todaysSnapshot = await db
    .collection("blogPosts")
    .where("curatedDate", "==", dateKey)
    .get();

  const slotsRemaining = BLOG_MAX_POSTS_PER_DAY - todaysSnapshot.size;
  if (slotsRemaining <= 0) {
    console.log(`[curateDailyBlogPosts] Daily quota already reached for ${dateKey}.`);
    return;
  }

  const recentDedupeKeys = await getRecentDedupeKeys();
  const feedResults = await Promise.all(BLOG_FEEDS.map((source) => fetchFeedArticles(source)));
  const mergedArticles = feedResults.flat();
  const uniqueCandidates = mergedArticles.filter((article) => !recentDedupeKeys.has(article.dedupeKey));
  const selected = pickDailyArticles(uniqueCandidates, slotsRemaining);

  if (selected.length === 0) {
    console.log("[curateDailyBlogPosts] No fresh candidates available this run.");
    return;
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
    const urls = Array.from(jobsById.values())
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
      .filter(Boolean)
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

    // Create email template
    const emailTemplate = {
      subject: subject || `New message from ${senderName || 'My Film Jobs'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">My Film Jobs</h2>
          <p>Hello,</p>
          <p>You have received a new message from <strong>${senderName || 'My Film Jobs'}</strong>.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Message:</h3>
            <p>${message}</p>
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
