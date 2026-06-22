import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import i18n from '../i18n';
import { setPageSeo, setStructuredData, removeStructuredData } from '../utilities/seo';
import {
  CATEGORIES,
  REGIONS,
  directoryPath,
  directoryPathEn,
  categoryLabel,
  regionLabel,
  hubCounterpartPath,
  DirectoryLang,
} from '../utilities/directory';

const SCHEMA_ID = 'directory-hub';
const NATIONAL = 'republica-dominicana';
const NATIONAL_EN = 'dominican-republic';
const DEFAULT_CITY_CATEGORY = 'camara'; // entry category for city links (es slug)
const DEFAULT_CITY_CATEGORY_EN = 'camera'; // entry category for city links (en slug)

interface DirectoryHubPageProps {
  lang?: DirectoryLang;
}

const DirectoryHubPage: React.FC<DirectoryHubPageProps> = ({ lang = 'es' }) => {
  const isEn = lang === 'en';
  const otherLang: DirectoryLang = isEn ? 'es' : 'en';
  const navigate = useNavigate();

  // NOTE: we intentionally do NOT call i18n.changeLanguage(lang) here — the hub renders
  // in `lang` (from the URL) without hijacking the user's chosen global nav language.

  // Flipping the global EN/ES toggle moves the hub to the counterpart URL.
  useEffect(() => {
    const onLang = () => {
      if (i18n.language?.split('-')[0] === otherLang) {
        navigate(hubCounterpartPath(otherLang));
      }
    };
    i18n.on('languageChanged', onLang);
    return () => {
      i18n.off('languageChanged', onLang);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherLang]);

  useEffect(() => {
    const esUrl = 'https://myfilmjobs.com/directorio';
    const enUrl = 'https://myfilmjobs.com/directory';
    const canonicalUrl = isEn ? enUrl : esUrl;

    const title = isEn
      ? 'Film Crew Directory — Dominican Republic | My Film Jobs'
      : 'Directorio de Crew de Cine en República Dominicana | My Film Jobs';
    const description = isEn
      ? 'Find film, TV and video production crew in the Dominican Republic by department and city: camera, sound, grip & electric, art, production, post-production and more.'
      : 'Encuentra crew de cine y producción audiovisual en República Dominicana por departamento y ciudad: cámara, sonido, eléctrica, arte, producción, postproducción y más.';

    setPageSeo({
      title,
      description,
      canonicalUrl,
      alternates: { es: esUrl, en: enUrl, xDefault: esUrl },
    });
    setStructuredData(SCHEMA_ID, {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonicalUrl,
      publisher: { '@type': 'Organization', name: 'My Film Jobs', url: 'https://myfilmjobs.com' },
    });
    return () => removeStructuredData(SCHEMA_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const cities = REGIONS.filter((r) => !r.national);
  const catNationalPath = (catSlug: string, catEnSlug: string) =>
    isEn ? directoryPathEn(catEnSlug, NATIONAL_EN) : directoryPath(catSlug, NATIONAL);
  const cityPath = (regSlug: string, regEnSlug: string) =>
    isEn
      ? directoryPathEn(DEFAULT_CITY_CATEGORY_EN, regEnSlug)
      : directoryPath(DEFAULT_CITY_CATEGORY, regSlug);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEn ? 'Film crew directory — Dominican Republic' : 'Directorio de crew de cine — República Dominicana'}
        </h1>
        <p className="mt-3 text-gray-600 max-w-3xl">
          {isEn
            ? 'Find and contact film, TV and video production crew in the Dominican Republic. Browse by department or by city and connect directly with the professionals for your next production.'
            : 'Encuentra y contacta crew de cine, televisión y producción audiovisual en la República Dominicana. Explora por departamento o por ciudad y conecta directamente con los profesionales para tu próxima producción.'}
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
          {isEn ? 'By department' : 'Por departamento'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={catNationalPath(c.slug, c.enSlug)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-800 hover:shadow-sm hover:border-gray-300 transition"
            >
              {categoryLabel(c, lang)}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
          {isEn ? 'By city' : 'Por ciudad'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {cities.map((r) => (
            <Link
              key={r.slug}
              to={cityPath(r.slug, r.enSlug)}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {regionLabel(r, lang)}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DirectoryHubPage;
