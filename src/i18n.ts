import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English is bundled eagerly — it's the default + fallback, so the first paint
// never flashes raw translation keys. Every other locale is code-split and
// fetched on demand (at boot if the detector resolves it, or when the user
// switches), trimming the inactive locale's JSON (~50 KiB) out of the initial
// bundle. Add new locales here as dynamic imports, not static ones.
import en from './locales/en/translation.json';

const localeLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  es: () => import(/* webpackChunkName: "locale-es" */ './locales/es/translation.json'),
};

/**
 * Ensure a locale's translation bundle is registered before it's used.
 * No-op for English (always bundled) or any already-loaded locale. Failures
 * are non-fatal — i18next falls back to English if the bundle never arrives.
 */
export async function ensureLanguageLoaded(lng?: string): Promise<void> {
  if (!lng) return;
  const base = lng.split('-')[0];
  if (base === 'en' || i18n.hasResourceBundle(base, 'translation')) return;
  const loader = localeLoaders[base];
  if (!loader) return;
  try {
    const mod = await loader();
    i18n.addResourceBundle(base, 'translation', mod.default || mod, true, true);
  } catch (err) {
    console.error(`[i18n] Failed to load locale "${base}":`, err);
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
  });

// Wrap changeLanguage so the target locale's bundle is fetched before the
// switch takes effect. Callers (Navigation's switcher, App's ?lang= handler)
// stay unaware that non-English locales load lazily.
const rawChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = (async (lng?: string, ...rest: unknown[]) => {
  await ensureLanguageLoaded(lng ?? i18n.language);
  return (rawChangeLanguage as (...args: unknown[]) => Promise<unknown>)(lng, ...rest);
}) as typeof i18n.changeLanguage;

// If the detector resolved a non-English language at boot (e.g. a returning
// Spanish user via localStorage), fetch that bundle now and refresh once.
if (i18n.language && !i18n.language.startsWith('en')) {
  void ensureLanguageLoaded(i18n.language).then(() => rawChangeLanguage(i18n.language));
}

export default i18n;
