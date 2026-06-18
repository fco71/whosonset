// Google Analytics (GA4) initialization + helpers.
//
// Why this exists: the project shipped with REACT_APP_FIREBASE_MEASUREMENT_ID set
// but Firebase Analytics was never initialized and measurementId was never added to
// the Firebase config — so no traffic, sessions, or retention were ever collected.
// This module initializes GA4 once, guarded by isSupported() so it is a safe no-op
// in unsupported environments (SSR, cookie-blocked browsers, etc.). Initializing GA4
// also loads gtag.js and defines window.gtag, which makes the existing
// conversionTracking.ts calls start working too.

import type { FirebaseApp } from 'firebase/app';
import { Analytics, getAnalytics, isSupported, logEvent, setUserId } from 'firebase/analytics';

let analytics: Analytics | null = null;
let initPromise: Promise<Analytics | null> | null = null;

export function initAnalytics(app: FirebaseApp): Promise<Analytics | null> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      if (typeof window === 'undefined') return null;
      if (!process.env.REACT_APP_FIREBASE_MEASUREMENT_ID) return null;
      if (!(await isSupported())) return null;

      analytics = getAnalytics(app);
      return analytics;
    } catch (error) {
      // Never let analytics break the app.
      console.warn('[analytics] initialization skipped:', error);
      return null;
    }
  })();

  return initPromise;
}

async function resolveAnalytics(): Promise<Analytics | null> {
  if (analytics) return analytics;
  if (initPromise) return initPromise;
  return null;
}

/** Tie sessions to a stable user id so GA4 can report returning users / retention. */
export async function setAnalyticsUser(uid: string | null): Promise<void> {
  try {
    const a = await resolveAnalytics();
    if (a && uid) setUserId(a, uid);
  } catch {
    /* no-op */
  }
}

/** Log an arbitrary GA4 event (safe no-op if analytics is unavailable). */
export async function logAnalyticsEvent(name: string, params?: Record<string, unknown>): Promise<void> {
  try {
    const a = await resolveAnalytics();
    if (a) logEvent(a, name as string, params as Record<string, unknown> | undefined);
  } catch {
    /* no-op */
  }
}

/**
 * Manual SPA page_view. Not wired up by default because GA4 Enhanced Measurement
 * (on by default for web streams) already tracks history-based route changes.
 * Exported for explicit control if Enhanced Measurement is ever disabled.
 */
export async function trackPageView(path: string, title?: string): Promise<void> {
  try {
    const a = await resolveAnalytics();
    if (a) {
      logEvent(a, 'page_view', {
        page_path: path,
        page_location: typeof window !== 'undefined' ? window.location.href : undefined,
        page_title: title ?? (typeof document !== 'undefined' ? document.title : undefined),
      });
    }
  } catch {
    /* no-op */
  }
}
