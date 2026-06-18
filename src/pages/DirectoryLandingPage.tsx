import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, collection, query, where, limit, getDocs } from '../firebase';
import { setPageSeo, setStructuredData, removeStructuredData } from '../utilities/seo';
import {
  CATEGORIES,
  REGIONS,
  getCategoryBySlug,
  getRegionBySlug,
  directoryPath,
  directoryCanonical,
  crewMatchesCategory,
  crewMatchesRegion,
  primaryTitle,
  CrewLike,
} from '../utilities/directory';

const SCHEMA_ID = 'directory-itemlist';
// Anti-doorway guard: a category×region page only asks to be indexed once it has real
// crew on it. Empty pages stay noindex (but still crawlable, so links are followed).
const INDEX_THRESHOLD = 3;

const DirectoryLandingPage: React.FC = () => {
  const { categorySlug, regionSlug } = useParams<{ categorySlug: string; regionSlug: string }>();
  const category = getCategoryBySlug(categorySlug);
  const region = getRegionBySlug(regionSlug);

  const [crew, setCrew] = useState<CrewLike[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [categorySlug, regionSlug]);

  useEffect(() => {
    if (!category || !region) {
      setPageSeo({
        title: 'Directorio no encontrado | My Film Jobs',
        description: 'Esta página del directorio no existe.',
        canonicalUrl: 'https://myfilmjobs.com/directorio',
        robots: 'noindex, follow',
      });
      return;
    }
    const title = `${category.es} en ${region.label} | Crew de Cine | My Film Jobs`;
    const description = `Encuentra y contrata profesionales de ${category.es.toLowerCase()} en ${region.label}, República Dominicana. Directorio de crew de cine y producción audiovisual en My Film Jobs.`;
    const canonicalUrl = directoryCanonical(category.slug, region.slug);
    const indexable = crew.length >= INDEX_THRESHOLD;

    setPageSeo({ title, description, canonicalUrl, robots: indexable ? undefined : 'noindex, follow' });

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
  }, [categorySlug, regionSlug, crew.length]);

  if (!category || !region) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Esta página no existe</h1>
        <p className="mt-2 text-gray-600">Explora el directorio completo de crew de cine.</p>
        <Link to="/directorio" className="mt-6 inline-block rounded-md bg-blue-600 px-4 py-2 text-white">
          Ir al directorio
        </Link>
      </div>
    );
  }

  const relatedRegions = REGIONS.filter((r) => r.slug !== region.slug).slice(0, 6);
  const relatedCategories = CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 8);

  return (
    <div className="max-w-5xl mx-auto">
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/directorio" className="hover:underline">Directorio</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{category.es}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{region.label}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Profesionales de {category.es} en {region.label}
        </h1>
        <p className="mt-3 text-gray-600 max-w-3xl">
          Directorio de {category.es.toLowerCase()} para cine, televisión y producción audiovisual en{' '}
          {region.label}, República Dominicana. Encuentra crew verificado, mira sus perfiles y contáctalos
          directamente para tu próxima producción.
        </p>
      </header>

      {loading ? (
        <p className="text-gray-500">Cargando crew…</p>
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
                  <span className="block text-sm text-gray-500">{primaryTitle(c) || category.es}</span>
                  {c.city ? <span className="block text-xs text-gray-400">{c.city}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Aún no hay {category.es.toLowerCase()} registrados en {region.label}
          </h2>
          <p className="mt-2 text-gray-600">
            ¿Trabajas en {category.es.toLowerCase()} en {region.label}? Sé el primero en aparecer aquí.
          </p>
          <Link to="/register" className="mt-5 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-white font-medium">
            Crea tu perfil gratis
          </Link>
        </div>
      )}

      <section className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {category.es} en otras zonas
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedRegions.map((r) => (
            <Link
              key={r.slug}
              to={directoryPath(category.slug, r.slug)}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              {category.es} en {r.label}
            </Link>
          ))}
        </div>

        <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Otros departamentos en {region.label}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedCategories.map((c) => (
            <Link
              key={c.slug}
              to={directoryPath(c.slug, region.slug)}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              {c.es} en {region.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DirectoryLandingPage;
