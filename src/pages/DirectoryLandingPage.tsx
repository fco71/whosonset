import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import i18n from '../i18n';
import { db, collection, query, where, limit, getDocs } from '../firebase';
import { setPageSeo, setStructuredData, removeStructuredData } from '../utilities/seo';
import {
  CATEGORIES,
  REGIONS,
  getCategoryBySlug,
  getRegionBySlug,
  getCategoryByEnSlug,
  getRegionByEnSlug,
  directoryPath,
  directoryPathEn,
  directoryCanonical,
  directoryCanonicalEn,
  categoryLabel,
  regionLabel,
  counterpartPath,
  crewMatchesCategory,
  crewMatchesRegion,
  primaryTitle,
  CrewLike,
  DirectoryLang,
} from '../utilities/directory';

const SCHEMA_ID = 'directory-itemlist';
// Anti-doorway guard: a category×region page only asks to be indexed once it has real
// crew on it. Empty pages stay noindex (but still crawlable, so links are followed).
const INDEX_THRESHOLD = 3;

interface DirectoryLandingPageProps {
  lang?: DirectoryLang;
}

const DirectoryLandingPage: React.FC<DirectoryLandingPageProps> = ({ lang = 'es' }) => {
  const isEn = lang === 'en';
  const otherLang: DirectoryLang = isEn ? 'es' : 'en';
  const { categorySlug, regionSlug } = useParams<{ categorySlug: string; regionSlug: string }>();
  const navigate = useNavigate();

  const category = isEn ? getCategoryByEnSlug(categorySlug) : getCategoryBySlug(categorySlug);
  const region = isEn ? getRegionByEnSlug(regionSlug) : getRegionBySlug(regionSlug);

  // Language-aware helpers for this page's own URLs / labels.
  const hubPath = isEn ? '/directory' : '/directorio';
  const linkPath = (catSlug: string, catEnSlug: string, regSlug: string, regEnSlug: string) =>
    isEn ? directoryPathEn(catEnSlug, regEnSlug) : directoryPath(catSlug, regSlug);

  const [crew, setCrew] = useState<CrewLike[]>([]);
  const [loading, setLoading] = useState(true);

  // NOTE: we intentionally do NOT call i18n.changeLanguage(lang) here. The page renders
  // its own content in `lang` (from the URL) regardless of the global app language, so
  // visiting a directory page must not hijack the user's chosen nav language.

  // When the user flips the global EN/ES toggle, switch the directory to the
  // counterpart URL for the SAME category+region (guard if either is missing).
  useEffect(() => {
    const onLang = () => {
      const current = i18n.language?.split('-')[0];
      if (current === otherLang && category && region) {
        navigate(counterpartPath(otherLang, category, region));
      }
    };
    i18n.on('languageChanged', onLang);
    return () => {
      i18n.off('languageChanged', onLang);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherLang, category, region]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      if (!category || !region) {
        if (active) setLoading(false);
        return;
      }
      try {
        // Public read requires the isPublished filter (see firestore.rules crewProfiles).
        const snap = await getDocs(
          query(collection(db, 'crewProfiles'), where('isPublished', '==', true), limit(300))
        );
        const all: CrewLike[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));
        const filtered = all.filter((c) => crewMatchesCategory(c, category) && crewMatchesRegion(c, region));
        if (active) setCrew(filtered);
      } catch {
        if (active) setCrew([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, regionSlug, lang]);

  useEffect(() => {
    if (!category || !region) {
      setPageSeo(
        isEn
          ? {
              title: 'Directory not found | My Film Jobs',
              description: 'This directory page does not exist.',
              canonicalUrl: 'https://myfilmjobs.com/directory',
              robots: 'noindex, follow',
            }
          : {
              title: 'Directorio no encontrado | My Film Jobs',
              description: 'Esta página del directorio no existe.',
              canonicalUrl: 'https://myfilmjobs.com/directorio',
              robots: 'noindex, follow',
            }
      );
      return;
    }

    const catEs = category.es;
    const catEn = category.en;
    const regEs = region.label;
    const regEn = region.en;

    const title = isEn
      ? `${catEn} in ${regEn} — Dominican Republic | Film Crew | My Film Jobs`
      : `${catEs} en ${regEs} | Crew de Cine | My Film Jobs`;
    const description = isEn
      ? `Find and hire ${catEn.toLowerCase()} professionals in ${regEn}, Dominican Republic. Directory of film and TV crew for your next production.`
      : `Encuentra y contrata profesionales de ${catEs.toLowerCase()} en ${regEs}, República Dominicana. Directorio de crew de cine y producción audiovisual en My Film Jobs.`;

    // Self-referential canonical (this page's own-language URL).
    const canonicalUrl = isEn
      ? directoryCanonicalEn(category.enSlug, region.enSlug)
      : directoryCanonical(category.slug, region.slug);

    const esUrl = directoryCanonical(category.slug, region.slug);
    const enUrl = directoryCanonicalEn(category.enSlug, region.enSlug);

    const indexable = crew.length >= INDEX_THRESHOLD;

    setPageSeo({
      title,
      description,
      canonicalUrl,
      robots: indexable ? undefined : 'noindex, follow',
      alternates: { es: esUrl, en: enUrl, xDefault: esUrl },
    });

    if (indexable) {
      setStructuredData(SCHEMA_ID, {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: title,
        itemListElement: crew.slice(0, 25).map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://myfilmjobs.com/resume/${c.id}`,
          name: c.name || 'Crew',
        })),
      });
    } else {
      removeStructuredData(SCHEMA_ID);
    }
    return () => removeStructuredData(SCHEMA_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, regionSlug, crew.length, lang]);

  if (!category || !region) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEn ? 'This page does not exist' : 'Esta página no existe'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEn ? 'Explore the full film crew directory.' : 'Explora el directorio completo de crew de cine.'}
        </p>
        <Link to={hubPath} className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white">
          {isEn ? 'Go to directory' : 'Ir al directorio'}
        </Link>
      </div>
    );
  }

  const catName = categoryLabel(category, lang);
  const regName = regionLabel(region, lang);
  const relatedRegions = REGIONS.filter((r) => r.slug !== region.slug).slice(0, 6);
  const relatedCategories = CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4">
        <Link to={hubPath} className="hover:underline">
          {isEn ? 'Directory' : 'Directorio'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{catName}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{regName}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEn ? `${catName} in ${regName}` : `Profesionales de ${catName} en ${regName}`}
        </h1>
        <p className="mt-3 text-gray-600 max-w-3xl">
          {isEn ? (
            <>
              Directory of {catName.toLowerCase()} for film, TV and video production in {regName},
              Dominican Republic. Find verified crew, view their profiles and contact them directly
              for your next production.
            </>
          ) : (
            <>
              Directorio de {catName.toLowerCase()} para cine, televisión y producción audiovisual en{' '}
              {regName}, República Dominicana. Encuentra crew verificado, mira sus perfiles y contáctalos
              directamente para tu próxima producción.
            </>
          )}
        </p>
      </header>

      {loading ? (
        <p className="text-gray-500">{isEn ? 'Loading crew…' : 'Cargando crew…'}</p>
      ) : crew.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {crew.map((c) => (
            <li key={c.id} className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition">
              <Link to={`/resume/${c.id}`} className="flex items-center gap-3">
                <img
                  src={c.profileImageUrl || '/bust-avatar.svg'}
                  alt={c.name || 'Crew'}
                  className="h-12 w-12 rounded-full object-cover bg-gray-100"
                  loading="lazy"
                />
                <span>
                  <span className="block font-medium text-gray-900">{c.name || 'Crew'}</span>
                  <span className="block text-sm text-gray-500">{primaryTitle(c) || catName}</span>
                  {c.city ? <span className="block text-xs text-gray-400">{c.city}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEn
              ? `No ${catName.toLowerCase()} listed yet in ${regName}`
              : `Aún no hay ${catName.toLowerCase()} registrados en ${regName}`}
          </h2>
          <p className="mt-2 text-gray-600">
            {isEn
              ? `Do you work in ${catName.toLowerCase()} in ${regName}? Be the first to appear here.`
              : `¿Trabajas en ${catName.toLowerCase()} en ${regName}? Sé el primero en aparecer aquí.`}
          </p>
          <Link to="/register" className="mt-5 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-white font-medium">
            {isEn ? 'Create your free profile' : 'Crea tu perfil gratis'}
          </Link>
        </div>
      )}

      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {isEn ? `${catName} in other areas` : `${catName} en otras zonas`}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedRegions.map((r) => (
            <Link
              key={r.slug}
              to={linkPath(category.slug, category.enSlug, r.slug, r.enSlug)}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              {isEn ? `${catName} in ${r.en}` : `${catName} en ${r.label}`}
            </Link>
          ))}
        </div>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-500">
          {isEn ? `Other departments in ${regName}` : `Otros departamentos en ${regName}`}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedCategories.map((c) => (
            <Link
              key={c.slug}
              to={linkPath(c.slug, c.enSlug, region.slug, region.enSlug)}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              {isEn ? `${c.en} in ${regName}` : `${c.es} en ${regName}`}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DirectoryLandingPage;
