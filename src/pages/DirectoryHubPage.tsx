import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setPageSeo, setStructuredData, removeStructuredData } from '../utilities/seo';
import { CATEGORIES, REGIONS, directoryPath } from '../utilities/directory';

const SCHEMA_ID = 'directory-hub';
const NATIONAL = 'republica-dominicana';
const DEFAULT_CITY_CATEGORY = 'camara'; // entry category for city links; users switch via related links

const DirectoryHubPage: React.FC = () => {
  useEffect(() => {
    setPageSeo({
      title: 'Directorio de Crew de Cine en República Dominicana | My Film Jobs',
      description:
        'Encuentra crew de cine y producción audiovisual en República Dominicana por departamento y ciudad: cámara, sonido, eléctrica, arte, producción, postproducción y más.',
      canonicalUrl: 'https://myfilmjobs.com/directorio',
    });
    setStructuredData(SCHEMA_ID, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Directorio de Crew de Cine en República Dominicana',
      description: 'Crew de cine y producción audiovisual en República Dominicana por departamento y ciudad.',
      url: 'https://myfilmjobs.com/directorio',
      publisher: { '@type': 'Organization', name: 'My Film Jobs', url: 'https://myfilmjobs.com' },
    });
    return () => removeStructuredData(SCHEMA_ID);
  }, []);

  const cities = REGIONS.filter((r) => !r.national);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Directorio de crew de cine — República Dominicana
        </h1>
        <p className="mt-3 text-gray-600 max-w-3xl">
          Encuentra y contacta crew de cine, televisión y producción audiovisual en la República
          Dominicana. Explora por departamento o por ciudad y conecta directamente con los
          profesionales para tu próxima producción.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
          Por departamento
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={directoryPath(c.slug, NATIONAL)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:shadow-sm hover:border-gray-300 transition"
            >
              {c.es}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
          Por ciudad
        </h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((r) => (
            <Link
              key={r.slug}
              to={directoryPath(DEFAULT_CITY_CATEGORY, r.slug)}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DirectoryHubPage;
