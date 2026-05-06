import React, { Suspense } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

// Lazy load the EditCrewProfile component to improve initial load performance
const EditCrewProfile = React.lazy(() => import('../components/EditCrewProfile'));

const EditProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  
  return (
    /*
      Bare wrapper — no card, no border, no shadow. The EditCrewProfile
      component below renders its own full-bleed ventovault background and
      handles its own internal padding/cards.

      Negative side margins (`-mx-4 sm:mx-0`) escape the parent <main>'s
      `px-4` gutter on mobile so the ventovault world background reaches
      the actual viewport edge. Without this, the page wraps the form in a
      16px-on-each-side gray-50 strip (App.tsx line 164's `bg-gray-50`
      showing through the gutter), which reads on a phone as a visible dark
      "border" framing the resume builder. On sm+ we restore the gutter so
      the framed-card aesthetic comes back on tablet/desktop where there's
      enough viewport real estate for it to look intentional.

      Negative bottom margin (`-mb-8`) closes the gap between the last
      section and the footer for the same reason.
    */
    <div className="-mx-4 -mb-8 sm:mx-0 sm:mb-0">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">{t('resume.builder.loadingBuilder')}</span>
          </div>
        }
      >
        {currentUser ? (
          <EditCrewProfile />
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {t('resume.builder.signInRequired')}
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default EditProfilePage;
