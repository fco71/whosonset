interface ConversionPayload {
  event: string;
  timestamp: string;
  pagePath: string;
  pageUrl: string;
  metadata: Record<string, unknown>;
}

const CONVERSION_STORAGE_KEY = 'myfilmjobs_conversion_events';
const MAX_STORED_CONVERSIONS = 200;

function persistConversion(payload: ConversionPayload): void {
  try {
    const stored = JSON.parse(localStorage.getItem(CONVERSION_STORAGE_KEY) || '[]') as ConversionPayload[];
    stored.push(payload);
    localStorage.setItem(
      CONVERSION_STORAGE_KEY,
      JSON.stringify(stored.slice(-MAX_STORED_CONVERSIONS))
    );
  } catch (error) {
    console.error('[conversionTracking] Failed to persist conversion event:', error);
  }
}

export function trackConversion(
  eventName: string,
  metadata: Record<string, unknown> = {}
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: ConversionPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    pagePath: window.location.pathname,
    pageUrl: window.location.href,
    metadata,
  };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...payload,
    });
  } catch (error) {
    console.error('[conversionTracking] Failed to push event to dataLayer:', error);
  }

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload as unknown as Record<string, unknown>);
    }
  } catch (error) {
    console.error('[conversionTracking] Failed to push event to gtag:', error);
  }

  try {
    window.dispatchEvent(new CustomEvent('myfilmjobs:conversion', { detail: payload }));
  } catch (error) {
    console.error('[conversionTracking] Failed to dispatch conversion event:', error);
  }

  persistConversion(payload);
}

