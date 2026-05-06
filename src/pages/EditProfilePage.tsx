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
      handles its own internal padding/cards. Adding ANY frame here (the old
      "bg-white shadow-md rounded-lg p-6" was the culprit) creates a dark
      drop-shadow halo around the entire form on mobile that reads as a
      thick border eating up viewport real estate.
    */
    <div>
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
